import { describe, it } from "vitest";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra } from "../../src/testing/FakeInfra";
import { LamportClock } from "../../src/distributed/causality/LamportClock";
import { PolicyGenome } from "../../src/evolution/types";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { DecisionAction } from "../../src/control-plane/policy/DecisionPolicy";

const MODERATE_CHAOS = {
  dropRate: 0.05,
  reorderRate: 0.1,
  duplicationRate: 0.0,
  maxJitterMs: 20
};

const NAIVE_GENOME: PolicyGenome = {
  version: 2,
  parameters: {
    criticalThreshold: 5,
    degradeThreshold: 10,
    maxAllowedLamportGap: 50,
    lamportPenaltyFactor: 0.1,
    ignoreStaleProbability: 0.0 // Naive policy processes everything immediately
  }
};

const WORST_CASE_GENOME: PolicyGenome = {
  version: 2,
  parameters: {
    criticalThreshold: 30, // Highly conservative
    degradeThreshold: 50,
    maxAllowedLamportGap: 5, // Paranoid about causal gaps
    lamportPenaltyFactor: 5.0,
    ignoreStaleProbability: 0.9 // Often drops stale messages to avoid cascades
  }
};

const EXPECTED_GENOME: PolicyGenome = {
  version: 2,
  parameters: {
    criticalThreshold: 15, // Opportunistic
    degradeThreshold: 25,
    maxAllowedLamportGap: 15,
    lamportPenaltyFactor: 1.0,
    ignoreStaleProbability: 0.2 // Rarely drops
  }
};

const CVAR_30_GENOME: PolicyGenome = {
  version: 2,
  parameters: {
    criticalThreshold: 20, // Tail-risk aware
    degradeThreshold: 35,
    maxAllowedLamportGap: 10,
    lamportPenaltyFactor: 2.5,
    ignoreStaleProbability: 0.5 // Balanced defense
  }
};

export function createObservableCausalWorld(
  id: number,
  infra: FakeInfra,
  genome: PolicyGenome,
  sim: MultiWorldSimulator
): SimulatedWorld {
  const clock = new LamportClock();
  const policy = new CausalThresholdPolicy(genome);

  const state = {
    crashed: false,
    cascadeCount: 0,
    survivalTicks: 0,
    messagesProcessed: 0,
    lastLamportGap: 0,
    defensiveCount: 0
  };

  const world: SimulatedWorld = {
    id,
    infra,
    engine: { state, policy, clock },
    nextExecutionTime: null,
    inFlightMessages: [],

    receiveMessage(msg: any) {
      if (state.crashed) return;

      const gap = clock.get() - msg.message.lamportClock;
      state.lastLamportGap = Math.abs(gap); // Store absolute gap for monitoring

      const action = policy.decide({
        healthScore: 100 - state.cascadeCount * 10,
        lamportGap: gap,
        queueSize: world.inFlightMessages!.length,
        timeSinceLastMessage: 50,
        recentErrors: state.cascadeCount
      });

      if (action.type === "NETWORK_DEFENSIVE") {
        state.defensiveCount++;
      } else if (action.type === "CRITICAL_STOP") {
        state.crashed = true;
      } else {
        // Update clock on normal processing
        clock.update(msg.message.lamportClock);
        state.messagesProcessed++;
        
        // Very simple synthetic cascade logic for stress testing
        if (gap > 20) {
          state.cascadeCount++;
          if (state.cascadeCount > 10) state.crashed = true;
        }
      }
    }
  };

  // Sender loop: everyone sends to (id+1)%3
  infra.timer.setInterval(() => {
    if (!state.crashed) {
      const toId = (id + 1) % 3;
      sim.router.send(id, toId, { type: "HEARTBEAT", payload: {}, lamportClock: clock.get() }, 50);
    }
  }, 80);

  // Survival loop
  infra.timer.setInterval(() => {
    if (!state.crashed) {
      clock.tick();
      state.survivalTicks++;
      // Decay cascade count naturally over time
      if (state.cascadeCount > 0 && Math.random() > 0.5) state.cascadeCount--;
    }
  }, 50);

  return world;
}

function runStressTest(policyName: string, genome: PolicyGenome) {
  const sim = new MultiWorldSimulator(42);
  sim.router.setConfig(MODERATE_CHAOS); // Use moderate chaos

  const worlds: SimulatedWorld[] = [];
  for (let i = 0; i < 3; i++) {
    const world = createObservableCausalWorld(i, new FakeInfra(i * 10), genome, sim);
    sim.addWorld(world);
    worlds.push(world);
  }

  // Phase 1: Normal Operation
  sim.runUntil(500);

  // Phase 2: Split-Brain
  sim.router.setPartitions([[0, 1], [2]]);
  sim.runUntil(2500); // 2000 ticks of partition

  const backlogSizePeak = sim.router.getBacklog().length;
  const backlogAccumulationRate = backlogSizePeak / 2000;
  const cascadesBeforeHeal = worlds.reduce((sum, w) => sum + w.engine.state.cascadeCount, 0);

  // Phase 3: Burst Healing
  sim.router.healPartition();

  // Phase 4: Tick-by-tick observation for Reconvergence
  let maxLamportGapAfterHeal = 0;
  let lamportGapIntegral = 0;
  let postHealCrash = false;
  let crashTimeRelativeToHeal = -1;
  let cascadeFailuresAfter = cascadesBeforeHeal;
  let stabilizedTicksCount = 0;
  let stabilizationTicks = -1;

  for (let t = 0; t < 500; t += 10) {
    sim.runUntil(2500 + t);
    
    let currentGapSum = 0;
    let defensiveSum = 0;
    let anyCrashed = false;

    for (const w of worlds) {
      currentGapSum += w.engine.state.lastLamportGap;
      defensiveSum += w.engine.state.defensiveCount;
      if (w.engine.state.crashed) anyCrashed = true;
      cascadeFailuresAfter = Math.max(cascadeFailuresAfter, w.engine.state.cascadeCount);
    }

    maxLamportGapAfterHeal = Math.max(maxLamportGapAfterHeal, currentGapSum);
    lamportGapIntegral += currentGapSum;

    if (anyCrashed && !postHealCrash) {
      postHealCrash = true;
      crashTimeRelativeToHeal = t;
    }

    // Stabilization condition: low gap and no new defensive actions over a window
    const meanGap = currentGapSum / worlds.length;
    if (meanGap < 10 && defensiveSum < 5 && !anyCrashed) {
      stabilizedTicksCount += 10;
      if (stabilizedTicksCount >= 50 && stabilizationTicks === -1) {
        stabilizationTicks = t; // Marked as stabilized
      }
    } else {
      stabilizedTicksCount = 0; // Reset rolling window
    }
  }

  const amplification = cascadesBeforeHeal === 0 ? cascadeFailuresAfter : cascadeFailuresAfter / cascadesBeforeHeal;

  console.log(`\n=== Policy: ${policyName} ===`);
  console.log(`Partition Duration: 2000 ticks`);
  console.log(`Backlog Size Peak: ${backlogSizePeak} (Rate: ${backlogAccumulationRate.toFixed(2)} msg/tick)`);
  console.log(`Max Lamport Gap After Heal: ${maxLamportGapAfterHeal}`);
  console.log(`Lamport Gap Integral (Area): ${lamportGapIntegral}`);
  console.log(`Post-Heal Crash: ${postHealCrash} ${postHealCrash ? `(at +${crashTimeRelativeToHeal} ticks)` : ""}`);
  console.log(`Cascade Amplification Factor: ${amplification.toFixed(2)}x (Before: ${cascadesBeforeHeal}, After: ${cascadeFailuresAfter})`);
  console.log(`Stabilization Ticks: ${stabilizationTicks === -1 ? "FAILED TO STABILIZE" : `+${stabilizationTicks} ticks`}`);
  console.log(`Throughput (Messages Processed): ${worlds.reduce((sum, w) => sum + w.engine.state.messagesProcessed, 0)}`);
}

describe("Phase 7.4 — Partition Stress Evaluation (Analytics)", () => {
  it("A) Compare policies under Split-Brain with Burst Healing", () => {
    runStressTest("NAIVE", NAIVE_GENOME);
    runStressTest("EXPECTED_VALUE (Opportunistic)", EXPECTED_GENOME);
    runStressTest("CVAR_30 (Robust)", CVAR_30_GENOME);
    runStressTest("WORST_CASE (Conservative)", WORST_CASE_GENOME);
  });
});
