import { describe, it } from "vitest";
import { PolicyEvolutionEngine } from "../../src/evolution/PolicyEvolutionEngine";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";
import { PolicyGenome } from "../../src/evolution/types";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { LamportClock } from "../../src/distributed/causality/LamportClock";

export function createAdaptiveWorld(id: number, infra: FakeInfra, genome: PolicyGenome, sim: MultiWorldSimulator, numNodes: number = 20, numHotspots: number = 3): SimulatedWorld {
  const clock = new LamportClock();
  const policy = new CausalThresholdPolicy(genome);
  
  const state = { 
    crashed: false, 
    cascadeCount: 0, 
    survivalTicks: 0, 
    messagesProcessed: 0, 
    defensiveCount: 0,
    rejectCount: 0, 
    nacksReceived: 0,
    currentTargetId: (id + 1) % numHotspots, // INITIAL HOTSPOT !
    lastRerouteTick: 0,
    lastQueueSize: 0
  };

  const world: SimulatedWorld = {
    id, infra, engine: { state, policy, clock }, nextExecutionTime: null, inFlightMessages: [],
    receiveMessage(msg: any) {
      if (state.crashed) return;

      if (msg.message.type === "NACK_CONGESTION") {
        state.nacksReceived++;
        // Routing Adaptation Logic with Cooldown and Exploration
        const threshold = genome.parameters.rerouteTriggerThreshold ?? 1000;
        const cooldown = genome.parameters.rerouteCooldownTicks ?? 0;
        const currentTick = state.survivalTicks;
        
        if (state.nacksReceived >= threshold && (currentTick - state.lastRerouteTick) >= cooldown) {
          // Dissipation logic
          const currentQ = world.inFlightMessages?.length ?? 0;
          const deltaQ = currentQ - state.lastQueueSize;
          state.lastQueueSize = currentQ;
          
          const gamma = genome.parameters.rerouteDampingFactor ?? 0;
          const pReroute = Math.exp(-gamma * Math.abs(deltaQ));

          if (Math.random() < pReroute) {
            // Reroute decision!
            const exploreRate = genome.parameters.rerouteExplorationRate ?? 0;
            if (Math.random() < exploreRate) {
              // Random target
              let nextTarget = Math.floor(Math.random() * numNodes);
              if (nextTarget === id) nextTarget = (nextTarget + 1) % numNodes;
              state.currentTargetId = nextTarget;
            } else {
              // Deterministic round-robin
              state.currentTargetId = (state.currentTargetId + 1) % numNodes;
              if (state.currentTargetId === id) {
                state.currentTargetId = (state.currentTargetId + 1) % numNodes;
              }
            }
          }
          state.nacksReceived = 0; // reset (absorption of reaction if not rerouted, or simple reset if rerouted)
          state.lastRerouteTick = currentTick;
        }
        return;
      }

      // Normal message processing
      const gap = clock.get() - msg.message.lamportClock;
      const action = policy.decide({
        healthScore: 100 - state.cascadeCount * 10,
        lamportGap: gap,
        queueSize: world.inFlightMessages!.length,
        timeSinceLastMessage: 50,
        recentErrors: state.cascadeCount
      });

      if (action.type === "REJECT_BACKPRESSURE") {
        state.rejectCount++;
        // Simulate immediate NACK return (not using router latency for NACKs to keep it simple, or minimal latency)
        sim.router.send(id, msg.from, { type: "NACK_CONGESTION", lamportClock: clock.get() }, 10);
      }
      else if (action.type === "NETWORK_DEFENSIVE") state.defensiveCount++;
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
      sim.router.send(id, state.currentTargetId, { type: "HEARTBEAT", payload: {}, lamportClock: clock.get() }, 50);
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

function extractTopologyFitness(world: SimulatedWorld) {
  const state = world.engine.state;
  let score = state.messagesProcessed * 10;
  if (state.crashed) score = 0; 
  else { 
    score -= state.defensiveCount * 2; 
    score -= state.cascadeCount * 5; 
  }
  return { 
    score: Math.max(0, score), 
    metrics: { queueSize: world.inFlightMessages?.length ?? 0 } 
  };
}

describe("Phase 8C: Topology Adaptation", () => {
  it("Should evolve routing to break structural symmetry", () => {
    const random = new FakeRandom(42);
    const engine = new PolicyEvolutionEngine(random, { worlds: [], stats: {} } as any, () => ({}) as any, extractTopologyFitness);

    const numNodes = 20;

    engine.evaluateGenomeBatch = (population: PolicyGenome[], config: any) => {
      // Evaluate all genomes. We use a shared environment where EACH genome plays all 20 nodes of a separate instance
      // so it's a parallel evaluation of N arenas.
      return population.map(genome => {
        const sim = new MultiWorldSimulator(config.seed);
        sim.router.setConfig({ dropRate: 0, duplicationRate: 0, reorderRate: 0, maxJitterMs: 0 }); // Zéro chaos

        for(let i=0; i<numNodes; i++) {
          sim.addWorld(createAdaptiveWorld(i, new FakeInfra(config.seed + i), genome, sim, numNodes));
        }

        sim.runUntil(config.simulationDurationMs);

        let totalScore = 0;
        let queueSizes: number[] = [];
        let totalNacks = 0;
        let totalRejects = 0;
        
        for(let i=0; i<numNodes; i++) {
          const w = sim.worlds.find(world => world.id === i)!;
          const res = extractTopologyFitness(w);
          totalScore += res.score;
          queueSizes.push(res.metrics.queueSize);
          totalNacks += w.engine.state.nacksReceived;
          totalRejects += w.engine.state.rejectCount;
        }

        // Calculate queue variance (Gini-like measure or just variance)
        const avgQueue = queueSizes.reduce((a, b) => a + b, 0) / numNodes;
        const queueVariance = queueSizes.reduce((a, b) => a + Math.pow(b - avgQueue, 2), 0) / numNodes;

        return { genome, score: totalScore / numNodes, metrics: { queueVariance, totalScore, totalNacks, totalRejects } };
      });
    };

    const bestGenome = engine.run(
      {
        populationSize: 30,
        generations: 30,
        mutationRate: 0.3,
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
        burstToleranceMultiplier: { min: 0.0, max: 1.0 },
        backpressureThreshold: { min: 1, max: 10 },
        rerouteTriggerThreshold: { min: 1, max: 10 },
        rerouteCooldownTicks: { min: 0, max: 50 },
        rerouteExplorationRate: { min: 0.0, max: 1.0 }
      }
    );

    console.log("Evolved Adaptive Topology Genome:", bestGenome);
    
    // Evaluate the best genome one last time to log metrics
    const sim = new MultiWorldSimulator(42);
    sim.router.setConfig({ dropRate: 0, duplicationRate: 0, reorderRate: 0, maxJitterMs: 0 }); // Zéro chaos

    for(let i=0; i<numNodes; i++) {
      sim.addWorld(createAdaptiveWorld(i, new FakeInfra(42 + i), bestGenome, sim, numNodes));
    }

    sim.runUntil(3000);

    let totalScore = 0;
    let queueSizes: number[] = [];
    let totalNacks = 0;
    let totalRejects = 0;
    
    for(let i=0; i<numNodes; i++) {
      const w = sim.worlds.find(world => world.id === i)!;
      const res = extractTopologyFitness(w);
      totalScore += res.score;
      queueSizes.push(res.metrics.queueSize);
      totalNacks += w.engine.state.nacksReceived;
      totalRejects += w.engine.state.rejectCount;
    }

    const avgQueue = queueSizes.reduce((a, b) => a + b, 0) / numNodes;
    const queueVariance = queueSizes.reduce((a, b) => a + Math.pow(b - avgQueue, 2), 0) / numNodes;
    
    console.log(`Final Best Score: ${totalScore / numNodes}`);
    console.log(`Final Total NACKs: ${totalNacks}`);
    console.log(`Final Total Rejects: ${totalRejects}`);
    console.log(`Final Queue Variance: ${queueVariance}`);
  });
});
