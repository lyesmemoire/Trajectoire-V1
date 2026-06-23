import { describe, it, expect } from "vitest";
import { PolicyEvolutionEngine, WorldFactory } from "../../src/evolution/PolicyEvolutionEngine";
import { RobustEvolutionEngine, EnvironmentSetup } from "../../src/evolution/RobustEvolutionEngine";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";
import { PolicyGenome } from "../../src/evolution/types";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { DecisionAction } from "../../src/control-plane/policy/DecisionPolicy";
import { LamportClock } from "../../src/distributed/causality/LamportClock";

function createObservableCausalWorld(
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
        clock.update(msg.message.lamportClock);
        state.messagesProcessed++;
        if (gap > 20) {
          state.cascadeCount++;
          if (state.cascadeCount > 10) state.crashed = true;
        }
      }
    }
  };

  infra.timer.setInterval(() => {
    if (!state.crashed) {
      const toId = (id + 1) % 3;
      sim.router.send(id, toId, { type: "HEARTBEAT", payload: {}, lamportClock: clock.get() }, 50);
    }
  }, 80);

  infra.timer.setInterval(() => {
    if (!state.crashed) {
      clock.tick();
      state.survivalTicks++;
      if (state.cascadeCount > 0 && Math.random() > 0.5) state.cascadeCount--;
    }
  }, 50);

  return world;
}

const CHAOS_PROFILES: Record<string, any> = {
  moderate: { dropRate: 0.05, reorderRate: 0.1, duplicationRate: 0.0, maxJitterMs: 20 },
  reorderHeavy: { dropRate: 0.02, reorderRate: 0.3, duplicationRate: 0.05, maxJitterMs: 80 },
  dropHeavy: { dropRate: 0.2, reorderRate: 0.05, duplicationRate: 0.0, maxJitterMs: 20 },
  extreme: { dropRate: 0.15, reorderRate: 0.25, duplicationRate: 0.1, maxJitterMs: 150 },
};

function generateMixedEnvironments(count: number, randomSeed: number): EnvironmentSetup[] {
  const envs: EnvironmentSetup[] = [];
  const rand = new FakeRandom(randomSeed);
  const profiles = Object.values(CHAOS_PROFILES);

  for (let i = 0; i < count; i++) {
    const isPartition = rand.next() > 0.6; // 40% chance of being a partition environment
    const profile = profiles[Math.floor(rand.next() * profiles.length)];

    envs.push((sim: MultiWorldSimulator) => {
      sim.router.setConfig(profile);

      if (isPartition) {
        (sim as any).isPartitionScenario = true;
      }
    });
  }

  return envs;
}

function extractFitness(world: SimulatedWorld) {
  const state = world.engine.state;
  let score = state.messagesProcessed * 10;
  if (state.crashed) {
    score = 0; // Huge penalty for crashing (whether by chaos or suicide)
  } else {
    score -= state.defensiveCount * 2;
    score -= state.cascadeCount * 5;
  }
  return {
    score: Math.max(0, score),
    metrics: { processed: state.messagesProcessed, defensive: state.defensiveCount, crashed: state.crashed ? 1 : 0 }
  };
}

describe("Phase 7.5 — Context-Aware Robust Policy Evolution", () => {
  it("A) Evolves a policy that survives both Chaos and Partitions", () => {
    const random = new FakeRandom(100);
    const envs = generateMixedEnvironments(15, 100); // 15 diverse scenarios (chaos + partition)

    // Base engine for internal loops
    const baseEngine = new PolicyEvolutionEngine(
      random,
      null as any, // Injected by RobustEngine
      null as any,
      extractFitness
    );

    const robustEngine = new RobustEvolutionEngine(
      baseEngine,
      (seed) => {
        return new MultiWorldSimulator(seed);
      },
      envs,
      random,
      (sim) => (id, infra, genome) => {
        if (id === 0 && (sim as any).isPartitionScenario) {
          infra.timer.scheduleAtAbsolute(500, () => {
            sim.router.setPartitions([[0, 1], [2]]);
          });
          infra.timer.scheduleAtAbsolute(2500, () => {
            sim.router.healPartition();
          });
        }
        return createObservableCausalWorld(id, infra, genome, sim);
      },
      extractFitness
    );

    const parameterBounds = {
      criticalThreshold: { min: 10, max: 40 },
      degradeThreshold: { min: 20, max: 60 },
      maxAllowedLamportGap: { min: 5, max: 50 },
      lamportPenaltyFactor: { min: 0.5, max: 5.0 },
      ignoreStaleProbability: { min: 0.0, max: 0.5 },
      burstDetectionThreshold: { min: 10, max: 80 },
      burstToleranceMultiplier: { min: 0.0, max: 1.0 } // MUST be <= 1.0 to reduce penalty
    };

    const bestGenome = robustEngine.run({
      populationSize: 20, // Keep it fast for tests
      generations: 8,
      mutationRate: 0.2,
      crossoverRate: 0.7,
      eliteCount: 2,
      baseSnapshot: { logicalTime: 0, randomState: 0, stateStore: null, controlPlaneState: null, worlds: [], networkBacklog: [], partitions: null },
      simulationDurationMs: 3000, // Long enough to survive the 500-2500 partition
      seed: 42,
      riskStrategy: "CVAR_30" // Optimize for the worst 30% runs
    }, parameterBounds);

    console.log("=== EVOLVED CONTEXT-AWARE GENOME ===");
    console.log(JSON.stringify(bestGenome.parameters, null, 2));

    // Validations:
    // 1. The GA should have learned to be paranoid against chaos
    expect(bestGenome.parameters.lamportPenaltyFactor).toBeGreaterThan(1.0); 
    
    // 2. The GA should have learned to lower its shields during a burst!
    expect(bestGenome.parameters.burstToleranceMultiplier).toBeLessThan(0.8);
    
    // 3. The GA should have found a reasonable burst threshold (not 0, not 100)
    expect(bestGenome.parameters.burstDetectionThreshold).toBeGreaterThan(10);
  });
});
