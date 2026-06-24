import { describe, it } from "vitest";
import { PolicyEvolutionEngine } from "../../src/evolution/PolicyEvolutionEngine";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";
import { PolicyGenome } from "../../src/evolution/types";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { LamportClock } from "../../src/distributed/causality/LamportClock";

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

describe("Analytics: Attractor Validation (Phase 8.1)", () => {
  
  const fatalChaos = {
    dropRate: 0.005373430813370939,
    reorderRate: 0,
    duplicationRate: 0.002810844517224862,
    maxJitterMs: 0.15168291209343954,
    partitionDurationRatio: 0.00036166565276759936
  };

  const zeroChaos = {
    dropRate: 0,
    reorderRate: 0,
    duplicationRate: 0,
    maxJitterMs: 0,
    partitionDurationRatio: 0
  };

  function runPolicyEvolution(chaosParams: typeof fatalChaos, mutationRate: number, generations: number) {
    const random = new FakeRandom(42);
    const engine = new PolicyEvolutionEngine(random, { worlds: [], stats: {} } as any, () => ({}) as any, extractFitness);

    // Override evaluateGenomeBatch manually using our sim
    engine.evaluateGenomeBatch = (population: PolicyGenome[], config: any) => {
      const sim = new MultiWorldSimulator(config.seed);
      sim.router.setConfig({
        dropRate: chaosParams.dropRate,
        reorderRate: chaosParams.reorderRate,
        duplicationRate: chaosParams.duplicationRate,
        maxJitterMs: chaosParams.maxJitterMs,
      });

      const partitionRatio = chaosParams.partitionDurationRatio;
      if (partitionRatio > 0) {
        const duration = 3000 * partitionRatio;
        const healTime = Math.min(2900, 500 + duration);
        sim.router.setPartitions([[0, 1], [2]]);
        // We will schedule heal when worlds are added
      }

      const fitnesses = population.map(genome => {
        // Evaluate each genome across 3 worlds in isolation for simplicity here
        const isoSim = new MultiWorldSimulator(config.seed);
        isoSim.router.setConfig(chaosParams);
        
        isoSim.addWorld(createObservableCausalWorld(0, new FakeInfra(config.seed), genome, isoSim));
        isoSim.addWorld(createObservableCausalWorld(1, new FakeInfra(config.seed + 1), genome, isoSim));
        isoSim.addWorld(createObservableCausalWorld(2, new FakeInfra(config.seed + 2), genome, isoSim));

        if (partitionRatio > 0) {
            isoSim.router.setPartitions([[0, 1], [2]]);
            const duration = 3000 * partitionRatio;
            const healTime = Math.min(2900, 500 + duration);
            isoSim.worlds[0].infra.timer.scheduleAtAbsolute!(healTime, () => isoSim.router.healPartition());
        }

        isoSim.runUntil(config.simulationDurationMs);
        
        const w0 = extractFitness(isoSim.worlds.find(w => w.id === 0)!);
        const w1 = extractFitness(isoSim.worlds.find(w => w.id === 1)!);
        const w2 = extractFitness(isoSim.worlds.find(w => w.id === 2)!);
        const avgScore = (w0.score + w1.score + w2.score) / 3;
        
        return { genome, score: avgScore, metrics: {} };
      });

      return fitnesses;
    };

    return engine.run(
      {
        populationSize: 15,
        generations: generations,
        mutationRate: mutationRate,
        crossoverRate: 0.7,
        eliteCount: 2,
        baseSnapshot: { logicalTime: 0, randomState: 0, stateStore: null, controlPlaneState: null, worlds: [], networkBacklog: [], partitions: null },
        simulationDurationMs: 3000,
        seed: 42,
        riskStrategy: "EXPECTED_VALUE"
      },
      {
        criticalThreshold: { min: 5, max: 40 },
        degradeThreshold: { min: 10, max: 60 },
        maxAllowedLamportGap: { min: 5, max: 50 },
        lamportPenaltyFactor: { min: 0.1, max: 5.0 },
        ignoreStaleProbability: { min: 0.0, max: 0.5 },
        burstDetectionThreshold: { min: 10, max: 100 },
        burstToleranceMultiplier: { min: 0.0, max: 1.0 }
      }
    );
  }

  it("Test A: 'No Chaos Baseline' (Isolated Control)", () => {
    console.log("\\n--- Test A: No Chaos Baseline (Isolated 3-nodes) ---");
    const best = runPolicyEvolution(zeroChaos, 0.2, 5);
    console.log(`Best Policy Score under ZERO CHAOS (Isolated): ${best.score}`);
  });

  it("Test A2: 'No Chaos Baseline' (Adversarial 20-nodes setup)", () => {
    console.log("\\n--- Test A2: No Chaos Baseline (20-nodes Arena) ---");
    // We recreate the exact faulty logic of AdversarialEvolutionEngine
    const sim = new MultiWorldSimulator(42);
    const genome: PolicyGenome = { version: 1, parameters: { criticalThreshold: 20, degradeThreshold: 40, maxAllowedLamportGap: 20, lamportPenaltyFactor: 1, ignoreStaleProbability: 0, burstDetectionThreshold: 50, burstToleranceMultiplier: 1 } };
    
    // Create 20 nodes that route using (id + 1) % 3
    for(let i=0; i<20; i++) {
        sim.addWorld(createObservableCausalWorld(i, new FakeInfra(42+i), genome, sim));
    }
    sim.runUntil(3000);
    
    let totalScore = 0;
    for(let i=0; i<20; i++) {
        totalScore += extractFitness(sim.worlds.find(w => w.id === i)!).score;
    }
    console.log(`Average Policy Score under ZERO CHAOS (20 nodes): ${totalScore / 20}`);
  });

  it("Test B: 'Random Restart' (Mutation Lock Control)", () => {
    console.log("\\n--- Test B: Random Restart against Fatal Genome ---");
    const best = runPolicyEvolution(fatalChaos, 0.2, 10);
    console.log(`Best Policy Score after Random Restart: ${best.score}`);
  });

  it("Test C: 'High Energy Mutation' (Exploration Control)", () => {
    console.log("\\n--- Test C: High Energy Mutation (0.8) against Fatal Genome ---");
    const best = runPolicyEvolution(fatalChaos, 0.8, 10);
    console.log(`Best Policy Score with High Mutation: ${best.score}`);
  });

  it("Test D: 'Chaos Perturbation' (Attractor Robustness)", () => {
    console.log("\\n--- Test D: Chaos Perturbation ---");
    const perturbedChaos = {
      dropRate: fatalChaos.dropRate + 0.05,
      reorderRate: fatalChaos.reorderRate + 0.05,
      duplicationRate: fatalChaos.duplicationRate + 0.05,
      maxJitterMs: fatalChaos.maxJitterMs + 10,
      partitionDurationRatio: fatalChaos.partitionDurationRatio + 0.05
    };
    const best = runPolicyEvolution(perturbedChaos, 0.2, 5);
    console.log(`Best Policy Score against Perturbed Chaos: ${best.score}`);
  });

});
