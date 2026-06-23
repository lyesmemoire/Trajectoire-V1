import { describe, it } from "vitest";
import { PolicyEvolutionEngine } from "../../src/evolution/PolicyEvolutionEngine";
import { AdversarialEvolutionEngine } from "../../src/evolution/AdversarialEvolutionEngine";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";
import { PolicyGenome } from "../../src/evolution/types";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { LamportClock } from "../../src/distributed/causality/LamportClock";
import { EvolutionTracker } from "../../src/analytics/EvolutionTracker";

function createObservableCausalWorld(id: number, infra: FakeInfra, genome: PolicyGenome, sim: MultiWorldSimulator): SimulatedWorld {
  const clock = new LamportClock();
  const policy = new CausalThresholdPolicy(genome);
  const state = { crashed: false, cascadeCount: 0, survivalTicks: 0, messagesProcessed: 0, defensiveCount: 0 };

  const world: SimulatedWorld = {
    id, infra, engine: { state, policy, clock }, nextExecutionTime: null, inFlightMessages: [],
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
      if (action.type === "NETWORK_DEFENSIVE") state.defensiveCount++;
      else if (action.type === "CRITICAL_STOP") state.crashed = true;
      else {
        clock.update(msg.message.lamportClock);
        state.messagesProcessed++;
        if (gap > 20) { state.cascadeCount++; if (state.cascadeCount > 10) state.crashed = true; }
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

function extractFitness(world: SimulatedWorld) {
  const state = world.engine.state;
  let score = state.messagesProcessed * 10;
  if (state.crashed) score = 0; 
  else { score -= state.defensiveCount * 2; score -= state.cascadeCount * 5; }
  return { score: Math.max(0, score), metrics: {} };
}

describe("Analytics: Red Queen Dynamics (Long Term Evolution)", () => {
  it("Runs adversarial evolution for 100 generations to detect attractors vs cycles", () => {
    console.log(`\n=== Running Red Queen Analysis ===`);
    
    const tracker = new EvolutionTracker(`red_queen`);
    const random = new FakeRandom(42);
    const baseEngine = new PolicyEvolutionEngine(random, null as any, null as any, extractFitness);

    const advEngine = new AdversarialEvolutionEngine(
      baseEngine,
      (seed, chaos) => {
        const sim = new MultiWorldSimulator(seed);
        sim.router.setConfig({
          dropRate: chaos.parameters.dropRate,
          reorderRate: chaos.parameters.reorderRate,
          duplicationRate: chaos.parameters.duplicationRate,
          maxJitterMs: chaos.parameters.maxJitterMs,
        });

        const partitionRatio = chaos.parameters.partitionDurationRatio;
        if (partitionRatio > 0.05) {
          const duration = 3000 * partitionRatio;
          const healTime = Math.min(2900, 500 + duration);
          (sim as any)._setupPartitions = (infra: any) => {
            infra.timer.scheduleAtAbsolute(500, () => sim.router.setPartitions([[0, 1], [2]]));
            infra.timer.scheduleAtAbsolute(healTime, () => sim.router.healPartition());
          };
        }
        return sim;
      },
      random,
      (sim) => (id, infra, genome) => {
        if (id === 0 && (sim as any)._setupPartitions) {
          (sim as any)._setupPartitions(infra);
        }
        return createObservableCausalWorld(id, infra, genome, sim);
      },
      extractFitness
    );

    advEngine.run(
      {
        populationSize: 20,
        generations: 80, // Run for a long time to see stability or oscillations
        mutationRate: 0.15,
        crossoverRate: 0.7,
        eliteCount: 2,
        baseSnapshot: { logicalTime: 0, randomState: 0, stateStore: null, controlPlaneState: null, worlds: [], networkBacklog: [], partitions: null },
        simulationDurationMs: 3000,
        seed: 42,
        riskStrategy: "EXPECTED_VALUE",
        
        chaosPopulationSize: 20,
        chaosMutationRate: 0.2,
        chaosCrossoverRate: 0.7,
        chaosEliteCount: 2,
        chaosCostLambda: 2.0
      },
      {
        criticalThreshold: { min: 5, max: 40 },
        degradeThreshold: { min: 10, max: 60 },
        maxAllowedLamportGap: { min: 5, max: 50 },
        lamportPenaltyFactor: { min: 0.1, max: 5.0 },
        ignoreStaleProbability: { min: 0.0, max: 0.5 },
        burstDetectionThreshold: { min: 10, max: 100 },
        burstToleranceMultiplier: { min: 0.0, max: 1.0 }
      },
      {
        dropRate: { min: 0.0, max: 0.5 },
        reorderRate: { min: 0.0, max: 0.5 },
        duplicationRate: { min: 0.0, max: 0.2 },
        maxJitterMs: { min: 0, max: 150 },
        partitionDurationRatio: { min: 0.0, max: 0.5 }
      },
      tracker
    );

    tracker.close();
    console.log(`Saved long-term artifacts to: ${tracker.getFilePath()}`);
  }, 120000); // Allow 2 minutes for this long test
});
