import { describe, it, expect } from "vitest";
import { PolicyEvolutionEngine, WorldFactory, FitnessExtractor } from "../../src/evolution/PolicyEvolutionEngine";
import { MultiWorldSimulator, SimulatedWorld } from "../helpers/MultiWorldSimulator";
import { EvolutionConfig, PolicyGenome } from "../../src/evolution/types";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";
import { LamportClock } from "../../src/distributed/causality/LamportClock";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { InterWorldMessage } from "../../src/distributed/network/types";

/**
 * Phase 6.6 — Causal-Aware Policy Evolution
 * 
 * This test suite validates that the GA can optimize a CausalThresholdPolicy
 * to be resilient under chaotic network conditions (drops, reorder, duplication).
 * 
 * The key innovation: the policy uses Lamport Clock gaps to detect causal
 * anomalies and adapt its behavior accordingly.
 */

// ─────────────────────────────────────────────────────
// Mock Distributed Engine for Causal GA
// ─────────────────────────────────────────────────────

interface CausalWorldState {
  clock: LamportClock;
  survivalTicks: number;
  defensiveActivations: number;
  falsePositives: number;
  cascadeFailures: number;
  lastReceivedClock: number;
  crashed: boolean;
}

function createCausalWorld(
  id: number,
  infra: FakeInfra,
  genome: PolicyGenome,
  sim: MultiWorldSimulator,
): { world: SimulatedWorld; state: CausalWorldState } {
  const policy = new CausalThresholdPolicy(genome);
  const clock = new LamportClock();
  
  const state: CausalWorldState = {
    clock,
    survivalTicks: 0,
    defensiveActivations: 0,
    falsePositives: 0,
    cascadeFailures: 0,
    lastReceivedClock: 0,
    crashed: false,
  };

  const world: SimulatedWorld = {
    id,
    infra,
    engine: { state, policy },
    nextExecutionTime: null,
    inFlightMessages: [],

    receiveMessage(msg: InterWorldMessage) {
      if (state.crashed) return;
      
      const receivedLamport = msg.message.lamportClock ?? 0;
      state.lastReceivedClock = receivedLamport;
      clock.update(receivedLamport);

      // Compute lamport gap
      const lamportGap = clock.get() - receivedLamport;

      // Make a decision using the causal policy
      const decision = policy.decide({
        healthScore: 80 - (state.cascadeFailures * 10), // Health degrades with cascade failures
        currentState: 2, // RUNNING
        localLamportClock: clock.get(),
        lastReceivedMessageClock: receivedLamport,
        lamportGap,
      });

      switch (decision.type) {
        case "NETWORK_DEFENSIVE":
          state.defensiveActivations++;
          // If the message was actually fine (gap is moderate, not deadly),
          // count it as a false positive
          if (receivedLamport > 0 && lamportGap < 20) {
            state.falsePositives++;
          }
          break;
        case "CRITICAL_STOP":
          state.crashed = true;
          break;
        case "DEGRADE":
          // Degraded but alive
          break;
        case "NONE":
          // Normal processing — but if the message was dangerously stale,
          // it causes a cascade failure
          if (lamportGap > 15) {
            state.cascadeFailures++;
          }
          break;
      }
    },
  };

  // Schedule periodic survival ticks (every 50ms)
  infra.timer.setInterval(() => {
    if (!state.crashed) {
      clock.tick();
      state.survivalTicks++;
    }
  }, 50);

  return { world, state };
}

describe("Phase 6.6 — Causal-Aware Policy Evolution", () => {
  // ─────────────────────────────────────────────────────
  // A. Policy Reacts to Chaos
  // ─────────────────────────────────────────────────────
  it("A) Optimized causal policy outperforms naive policy under chaos", () => {
    // Fitness function rewards survival and penalizes crashes + false positives
    function evaluateUnderChaos(genome: PolicyGenome, seed: number): number {
      const sim = new MultiWorldSimulator(seed);
      sim.router.setConfig({
        dropRate: 0.3,
        reorderRate: 0.5,
        duplicationRate: 0.2,
        maxJitterMs: 200,
      });

      const peerCount = 3;
      const states: CausalWorldState[] = [];

      for (let i = 0; i < peerCount; i++) {
        const infra = new FakeInfra(seed * 100 + i);
        const { world, state } = createCausalWorld(i, infra, genome, sim);
        sim.addWorld(world);
        states.push(state);
      }

      // Schedule cross-world communication: each world sends to its neighbors periodically
      for (let i = 0; i < peerCount; i++) {
        const fromId = i;
        const toId = (i + 1) % peerCount;
        const world = sim.worlds.find(w => w.id === fromId)!;
        
        world.infra.timer.setInterval(() => {
          const st = states[fromId];
          if (!st.crashed) {
            st.clock.tick();
            sim.router.send(fromId, toId, {
              type: "HEARTBEAT",
              payload: { seq: st.survivalTicks },
              lamportClock: st.clock.get(),
            }, 50);
          }
        }, 100);
      }

      sim.runUntil(2000);

      // Multi-dimensional fitness
      let fitness = 0;
      for (const s of states) {
        fitness += s.survivalTicks * 10;                // Reward survival
        fitness -= s.crashed ? 500 : 0;                 // Heavy penalty for crash
        fitness -= s.cascadeFailures * 50;              // Penalty for cascade from stale messages
        fitness -= s.falsePositives * 10;               // Penalty for false defensive
      }
      return fitness;
    }

    // Naive policy (no causal awareness)
    const naiveGenome: PolicyGenome = {
      version: 2,
      parameters: {
        criticalThreshold: 20,
        degradeThreshold: 30,
        maxAllowedLamportGap: 1000, // Effectively no causal detection
        lamportPenaltyFactor: 0,    // No causal penalty at all
      },
    };

    // Optimized policy (reasonable causal thresholds)
    const optimizedGenome: PolicyGenome = {
      version: 2,
      parameters: {
        criticalThreshold: 15,
        degradeThreshold: 25,
        maxAllowedLamportGap: 8,
        lamportPenaltyFactor: 2.0,
      },
    };

    const naiveFitness = evaluateUnderChaos(naiveGenome, 42);
    const optimizedFitness = evaluateUnderChaos(optimizedGenome, 42);

    console.log(`[Naive]     fitness: ${naiveFitness}`);
    console.log(`[Optimized] fitness: ${optimizedFitness}`);

    // The optimized policy should outperform by handling causal anomalies
    expect(optimizedFitness).toBeGreaterThan(naiveFitness);
  });

  // ─────────────────────────────────────────────────────
  // B. GA Deterministic Reproduction
  // ─────────────────────────────────────────────────────
  it("B) Same seed produces identical causal evolution", () => {
    const bounds = {
      criticalThreshold: { min: 5, max: 40 },
      degradeThreshold: { min: 10, max: 50 },
      maxAllowedLamportGap: { min: 1, max: 50 },
      lamportPenaltyFactor: { min: 0, max: 5 },
    };

    function runGA(globalSeed: number) {
      const sim = new MultiWorldSimulator(globalSeed);
      sim.router.setConfig({
        dropRate: 0.2,
        reorderRate: 0.3,
        duplicationRate: 0.1,
        maxJitterMs: 100,
      });

      const worldFactory: WorldFactory = (id, infra, genome) => {
        const { world, state } = createCausalWorld(id, infra, genome, sim);

        // Schedule periodic heartbeats to a neighbor
        const targetId = (id + 1) % 10; // Circular topology
        infra.timer.setInterval(() => {
          if (!state.crashed) {
            state.clock.tick();
            sim.router.send(id, targetId, {
              type: "HEARTBEAT",
              payload: {},
              lamportClock: state.clock.get(),
            }, 30);
          }
        }, 80);

        return world;
      };

      const fitnessExtractor: FitnessExtractor = (world) => {
        const s = world.engine.state as CausalWorldState;
        const score = s.survivalTicks * 10
          - (s.crashed ? 500 : 0)
          - s.cascadeFailures * 50
          - s.falsePositives * 10;
        return {
          score,
          metrics: {
            survivalTicks: s.survivalTicks,
            cascadeFailures: s.cascadeFailures,
            falsePositives: s.falsePositives,
            crashed: s.crashed ? 1 : 0,
          },
        };
      };

      const config: EvolutionConfig = {
        populationSize: 20,
        generations: 3,
        mutationRate: 0.15,
        crossoverRate: 0.7,
        eliteCount: 2,
        baseSnapshot: {
          logicalTime: 0,
          randomState: 1337,
          stateStore: {},
          controlPlaneState: {},
        },
        simulationDurationMs: 1000,
        seed: globalSeed,
      };

      const engine = new PolicyEvolutionEngine(
        new FakeRandom(globalSeed),
        sim,
        worldFactory,
        fitnessExtractor,
      );

      return engine.run(config, bounds);
    }

    const result1 = runGA(42);
    const result2 = runGA(42);

    // Bit-perfect determinism
    expect(result1.parameters).toEqual(result2.parameters);
  });

  // ─────────────────────────────────────────────────────
  // C. Snapshot + Fork under Chaos
  // ─────────────────────────────────────────────────────
  it("C) Snapshot during chaotic exchange produces identical fitness in fork", () => {
    const genome: PolicyGenome = {
      version: 2,
      parameters: {
        criticalThreshold: 15,
        degradeThreshold: 25,
        maxAllowedLamportGap: 10,
        lamportPenaltyFactor: 1.5,
      },
    };

    const sim = new MultiWorldSimulator(42);
    sim.router.setConfig({
      dropRate: 0.1,
      reorderRate: 0.5,
      maxJitterMs: 200,
    });

    const infraA = new FakeInfra(100);
    const { world: worldA, state: stateA } = createCausalWorld(0, infraA, genome, sim);
    
    const infraB = new FakeInfra(200);
    const { world: worldB, state: stateB } = createCausalWorld(1, infraB, genome, sim);

    sim.addWorld(worldA);
    sim.addWorld(worldB);

    // Schedule regular heartbeats A -> B
    infraA.timer.setInterval(() => {
      if (!stateA.crashed) {
        stateA.clock.tick();
        sim.router.send(0, 1, {
          type: "HEARTBEAT",
          payload: {},
          lamportClock: stateA.clock.get(),
        }, 50);
      }
    }, 100);

    // Run until halfway
    sim.runUntil(500);

    // Snapshot B
    const snapshotB = sim.snapshotWorld(1);

    // Fork B into C
    const stateC: CausalWorldState = {
      clock: new LamportClock(),
      survivalTicks: stateB.survivalTicks,
      defensiveActivations: stateB.defensiveActivations,
      falsePositives: stateB.falsePositives,
      cascadeFailures: stateB.cascadeFailures,
      lastReceivedClock: stateB.lastReceivedClock,
      crashed: stateB.crashed,
    };
    stateC.clock.set(stateB.clock.get());

    const worldC = sim.forkWorld(snapshotB, 2, (id, infra) => {
      const policy = new CausalThresholdPolicy(genome);
      const w: SimulatedWorld = {
        id,
        infra,
        engine: { state: stateC, policy },
        nextExecutionTime: null,
        inFlightMessages: [],
        receiveMessage(msg: InterWorldMessage) {
          if (stateC.crashed) return;
          const receivedLamport = msg.message.lamportClock ?? 0;
          stateC.lastReceivedClock = receivedLamport;
          stateC.clock.update(receivedLamport);
          const lamportGap = stateC.clock.get() - receivedLamport;
          const decision = policy.decide({
            healthScore: 80 - (stateC.cascadeFailures * 10),
            currentState: 2,
            localLamportClock: stateC.clock.get(),
            lastReceivedMessageClock: receivedLamport,
            lamportGap,
          });
          switch (decision.type) {
            case "NETWORK_DEFENSIVE": stateC.defensiveActivations++; if (receivedLamport > 0 && lamportGap < 20) stateC.falsePositives++; break;
            case "CRITICAL_STOP": stateC.crashed = true; break;
            case "DEGRADE": break;
            case "NONE": if (lamportGap > 15) stateC.cascadeFailures++; break;
          }
        },
      };

      infra.timer.setInterval(() => {
        if (!stateC.crashed) {
          stateC.clock.tick();
          stateC.survivalTicks++;
        }
      }, 50);

      return w;
    });

    // Run both B and C for the same remaining duration
    sim.runUntil(1000);

    // Both should have identical causal evolution from the fork point
    expect(stateB.crashed).toBe(stateC.crashed);
    expect(stateB.survivalTicks).toBe(stateC.survivalTicks);
    expect(stateB.cascadeFailures).toBe(stateC.cascadeFailures);
  });
});
