import { describe, it, expect } from "vitest";
import { MultiWorldSimulator, SimulatedWorld, NetworkChaosConfig } from "../helpers/MultiWorldSimulator";
import { FakeInfra, FakeRandom } from "../../src/testing/FakeInfra";
import { LamportClock } from "../../src/distributed/causality/LamportClock";
import { CausalThresholdPolicy } from "../../src/control-plane/policy/CausalThresholdPolicy";
import { InterWorldMessage } from "../../src/distributed/network/types";
import { PolicyGenome, EvolutionConfig } from "../../src/evolution/types";
import { PolicyEvolutionEngine } from "../../src/evolution/PolicyEvolutionEngine";
import { RobustEvolutionEngine, EnvironmentSetup } from "../../src/evolution/RobustEvolutionEngine";

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────

const CHAOS_PROFILES: Record<string, NetworkChaosConfig> = {
  moderate: { dropRate: 0.2, reorderRate: 0.3, duplicationRate: 0.1, maxJitterMs: 100 },
  reorderHeavy: { dropRate: 0.1, reorderRate: 0.8, duplicationRate: 0.3, maxJitterMs: 300 },
  dropHeavy: { dropRate: 0.6, reorderRate: 0.1, duplicationRate: 0.0, maxJitterMs: 50 },
};

const DEFAULT_WEIGHTS = {
  survival: 10, throughput: 5, efficiency: 2,
  stability: 1, paranoia: 8, cascade: 15,
};

function createExtendedCausalWorld(
  id: number, infra: FakeInfra, genome: PolicyGenome, sim: MultiWorldSimulator
): SimulatedWorld {
  const policy = new CausalThresholdPolicy(genome);
  const clock = new LamportClock();

  const state = {
    clock, survivalTicks: 0, defensiveActivations: 0, falsePositives: 0,
    cascadeFailures: 0, messagesProcessed: 0, messagesIgnored: 0,
    lastReceivedClock: 0, crashed: false, gapHistory: [] as number[], gapVariance: 0,
  };

  const world: SimulatedWorld = {
    id, infra, engine: { state, policy }, nextExecutionTime: null, inFlightMessages: [],

    receiveMessage(msg: InterWorldMessage) {
      if (state.crashed) return;

      const receivedLamport = msg.message.lamportClock ?? 0;
      state.lastReceivedClock = receivedLamport;
      clock.update(receivedLamport);

      const rawGap = clock.get() - receivedLamport;
      state.gapHistory.push(rawGap);
      if (state.gapHistory.length > 10) state.gapHistory.shift();

      const avgGap = state.gapHistory.reduce((a, b) => a + b, 0) / state.gapHistory.length;
      if (state.gapHistory.length >= 2) {
        const sumSqDiff = state.gapHistory.reduce((sum, g) => sum + (g - avgGap) ** 2, 0);
        state.gapVariance = sumSqDiff / state.gapHistory.length;
      }

      const effectiveGap = state.gapHistory.length >= 3 ? avgGap : rawGap;

      const decision = policy.decide({
        healthScore: 80 - (state.cascadeFailures * 10),
        currentState: 2,
        localLamportClock: clock.get(),
        lastReceivedMessageClock: receivedLamport,
        lamportGap: effectiveGap,
      });

      switch (decision.type) {
        case "NETWORK_DEFENSIVE":
          state.defensiveActivations++;
          if (receivedLamport > 0 && rawGap < 20) state.falsePositives++;
          const ignoreProb = genome.parameters.ignoreStaleProbability ?? 0;
          if (ignoreProb > 0 && infra.random.next() < ignoreProb) state.messagesIgnored++;
          else state.messagesProcessed++;
          break;
        case "CRITICAL_STOP": state.crashed = true; break;
        case "DEGRADE": state.messagesProcessed++; break;
        case "NONE":
          if (rawGap > 15) state.cascadeFailures++;
          state.messagesProcessed++;
          break;
      }
    },
  };

  // Heartbeat loop
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
    }
  }, 50);

  return world;
}

function extractFitness(world: SimulatedWorld): { score: number; metrics: Record<string, number> } {
  const s = world.engine.state;
  
  const survivalScore = s.survivalTicks;
  const throughputScore = s.messagesProcessed;
  const cascadeCost = (s.crashed ? 100 : 0) + (s.cascadeFailures * 10);
  
  const defensiveRatio = s.survivalTicks > 0 ? s.defensiveActivations / Math.max(s.messagesProcessed + s.messagesIgnored, 1) : 0;
  const paranoiaCost = (defensiveRatio * 50) + (s.messagesIgnored * 2) + (s.falsePositives * 5);
  
  const totalDecisions = s.messagesProcessed + s.messagesIgnored + s.defensiveActivations;
  const efficiencyScore = totalDecisions > 0 ? (s.messagesProcessed / totalDecisions) * 100 : 0;
  
  const stabilityCost = s.gapVariance * 0.1;

  const total =
    DEFAULT_WEIGHTS.survival * survivalScore +
    DEFAULT_WEIGHTS.throughput * throughputScore +
    DEFAULT_WEIGHTS.efficiency * efficiencyScore -
    DEFAULT_WEIGHTS.stability * stabilityCost -
    DEFAULT_WEIGHTS.paranoia * paranoiaCost -
    DEFAULT_WEIGHTS.cascade * cascadeCost;

  return {
    score: total,
    metrics: { survivalScore, throughputScore, cascadeCost, paranoiaCost, efficiencyScore, stabilityCost }
  };
}

// ─────────────────────────────────────────────────────
// Setup
// ─────────────────────────────────────────────────────

function createRobustEngine(envKeys: string[]): RobustEvolutionEngine {
  const random = new FakeRandom(12345);
  
  const baseEngine = new PolicyEvolutionEngine(
    random,
    new MultiWorldSimulator(0),
    () => ({} as any), // Ignored dummy
    () => ({} as any)  // Ignored dummy
  );

  const environments: EnvironmentSetup[] = envKeys.map(key => {
    return (sim: MultiWorldSimulator) => sim.router.setConfig(CHAOS_PROFILES[key]);
  });

  const simulatorFactory = (seed: number) => new MultiWorldSimulator(seed);

  const worldFactoryBuilder = (sim: MultiWorldSimulator) => {
    return (id: number, infra: FakeInfra, genome: PolicyGenome) => {
      const world = createExtendedCausalWorld(id, infra, genome, sim);
      return world;
    };
  };

  return new RobustEvolutionEngine(
    baseEngine,
    simulatorFactory,
    environments,
    random,
    worldFactoryBuilder,
    extractFitness
  );
}

const paramBounds = {
  criticalThreshold: { min: 5, max: 50 },
  degradeThreshold: { min: 10, max: 70 },
  maxAllowedLamportGap: { min: 1, max: 50 },
  lamportPenaltyFactor: { min: 0, max: 5.0 },
  ignoreStaleProbability: { min: 0, max: 1.0 },
};

const testConfig: EvolutionConfig = {
  populationSize: 50,  // Fast training
  generations: 5,
  mutationRate: 0.2,
  crossoverRate: 0.7,
  eliteCount: 2,
  simulationDurationMs: 1500,
  seed: 42,
  baseSnapshot: { logicalTime: 0, randomState: 0, stateStore: {}, controlPlaneState: {} } as any,
};

// Evaluate a single genome on a specific chaos profile (for verification)
function evaluateSingle(genome: PolicyGenome, chaosKey: string, seed: number) {
  const sim = new MultiWorldSimulator(seed);
  sim.router.setConfig(CHAOS_PROFILES[chaosKey]);
  
  const worlds: SimulatedWorld[] = [];
  for (let i = 0; i < 3; i++) {
    const infra = new FakeInfra(seed * 100 + i);
    const world = createExtendedCausalWorld(i, infra, genome, sim);
    sim.addWorld(world);
    worlds.push(world);
  }

  sim.runUntil(1500);

  let totalScore = 0;
  for (const w of worlds) {
    totalScore += extractFitness(w).score;
  }
  return totalScore;
}

// ═══════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════

describe("Phase 6.8 — Robust Optimization / Min-Max Training", () => {
  
  it("A) Anti-collapse strict: Robust policy survives all environments with fitness > 0", () => {
    // Entraîne une policy robuste sur les 3 environnements simultanément
    const engine = createRobustEngine(["moderate", "reorderHeavy", "dropHeavy"]);
    const robustGenome = engine.run(testConfig, paramBounds);

    const moderateScore = evaluateSingle(robustGenome, "moderate", 42);
    const reorderScore = evaluateSingle(robustGenome, "reorderHeavy", 42);
    const dropScore = evaluateSingle(robustGenome, "dropHeavy", 42);

    console.log(`[Robust Policy] Moderate: ${moderateScore.toFixed(1)}`);
    console.log(`[Robust Policy] Reorder:  ${reorderScore.toFixed(1)}`);
    console.log(`[Robust Policy] Drop:     ${dropScore.toFixed(1)}`);

    // Invariant: it should not completely collapse (<0 means it crashed or had insane cascade failures)
    // The robust training forces it to find a middle ground.
    expect(moderateScore).toBeGreaterThan(0);
    expect(reorderScore).toBeGreaterThan(0);
    expect(dropScore).toBeGreaterThan(0);
  });

  it("B) Dominance test: Robust policy beats specialized policies in worst-case scenarios", () => {
    const engine = createRobustEngine(["moderate", "reorderHeavy", "dropHeavy"]);
    const robustGenome = engine.run(testConfig, paramBounds);

    // Specialist trained ONLY on dropHeavy
    const dropEngine = createRobustEngine(["dropHeavy"]);
    const dropSpecialist = dropEngine.run(testConfig, paramBounds);

    // Specialist trained ONLY on reorderHeavy
    const reorderEngine = createRobustEngine(["reorderHeavy"]);
    const reorderSpecialist = reorderEngine.run(testConfig, paramBounds);

    const robustOnReorder = evaluateSingle(robustGenome, "reorderHeavy", 42);
    const dropSpecOnReorder = evaluateSingle(dropSpecialist, "reorderHeavy", 42);

    const robustOnDrop = evaluateSingle(robustGenome, "dropHeavy", 42);
    const reorderSpecOnDrop = evaluateSingle(reorderSpecialist, "dropHeavy", 42);

    console.log(`[Dominance] Robust vs DropSpec on ReorderHeavy : ${robustOnReorder.toFixed(1)} vs ${dropSpecOnReorder.toFixed(1)}`);
    console.log(`[Dominance] Robust vs ReorderSpec on DropHeavy : ${robustOnDrop.toFixed(1)} vs ${reorderSpecOnDrop.toFixed(1)}`);

    // The robust policy must dominate the specialist in the specialist's blind spot
    expect(robustOnReorder).toBeGreaterThanOrEqual(dropSpecOnReorder);
    expect(robustOnDrop).toBeGreaterThanOrEqual(reorderSpecOnDrop);
  });

  it("C) Reproducibility Multi-Env: Environment order does not change output", () => {
    // Train with order A
    const engine1 = createRobustEngine(["moderate", "reorderHeavy", "dropHeavy"]);
    const genome1 = engine1.run(testConfig, paramBounds);

    // Train with order B
    const engine2 = createRobustEngine(["dropHeavy", "reorderHeavy", "moderate"]);
    const genome2 = engine2.run(testConfig, paramBounds);

    // If environment simulation leaks state, these would be different
    expect(genome1.parameters).toEqual(genome2.parameters);
  });

});
