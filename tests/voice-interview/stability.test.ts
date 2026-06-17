/**
 * Tests Step B — invariants de stabilité comportementale (pré-P4).
 * On teste la STABILITÉ du personnage : bornes, pas d'amplification infinie,
 * conservation des bornes sur de longues trajectoires (incl. aléatoires seedées).
 */
import { describe, it, expect } from "vitest";
import {
  createSimulationState,
  updateSimulation,
  type SimulationSignal,
} from "@/apps/realtime-gateway/src/voice-interview/core/simulation/simulation-state";
import { deriveRecruiterMind } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/recruiter-mind";
import {
  checkMindBounds,
  checkSimulationBounds,
  checkBoundedOscillation,
  isStable,
  assertStable,
} from "@/apps/realtime-gateway/src/voice-interview/core/simulation/stability";

/** PRNG déterministe (mulberry32) pour des trajectoires reproductibles. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomSignal(r: () => number): SimulationSignal {
  return {
    weakAnswer: r() < 0.4,
    strongAnswer: r() < 0.3,
    strongTechnical: r() < 0.2,
    contradiction: r() < 0.15,
    bluff: r() < 0.2,
    progression: r() < 0.5,
  };
}

describe("bornes instantanées", () => {
  it("état initial stable", () => {
    const sim = createSimulationState();
    const mind = deriveRecruiterMind(sim);
    expect(checkSimulationBounds(sim)).toEqual([]);
    expect(checkMindBounds(mind)).toEqual([]);
    expect(isStable(sim, mind)).toBe(true);
  });
});

describe("pas d'amplification infinie (pression bornée)", () => {
  it("100 réponses faibles consécutives -> pression plafonne à 100, jamais au-delà", () => {
    let sim = createSimulationState();
    const levels: number[] = [];
    for (let i = 0; i < 100; i++) {
      sim = updateSimulation(sim, { weakAnswer: true, contradiction: true, bluff: true });
      levels.push(sim.pressure.level);
    }
    expect(Math.max(...levels)).toBeLessThanOrEqual(100);
    expect(checkBoundedOscillation(levels)).toEqual([]);
    expect(checkSimulationBounds(sim)).toEqual([]);
  });

  it("la pression peut redescendre (système dissipatif, pas figé)", () => {
    let sim = createSimulationState();
    for (let i = 0; i < 10; i++) sim = updateSimulation(sim, { weakAnswer: true });
    const high = sim.pressure.level;
    for (let i = 0; i < 10; i++) sim = updateSimulation(sim, { strongAnswer: true });
    expect(sim.pressure.level).toBeLessThan(high);
  });
});

describe("conservation des bornes sur trajectoires longues/aléatoires", () => {
  it("3 seeds × 200 tours -> aucune violation de bornes (sim + mind)", () => {
    for (const seed of [1, 42, 12345]) {
      const r = rng(seed);
      let sim = createSimulationState();
      for (let i = 0; i < 200; i++) {
        sim = updateSimulation(sim, randomSignal(r));
        const mind = deriveRecruiterMind(sim);
        const violations = [...checkSimulationBounds(sim), ...checkMindBounds(mind)];
        expect(violations).toEqual([]);
      }
    }
  });

  it("assertStable ne lève jamais sur une trajectoire valide", () => {
    const r = rng(7);
    let sim = createSimulationState();
    expect(() => {
      for (let i = 0; i < 150; i++) {
        sim = updateSimulation(sim, randomSignal(r));
        assertStable(sim, deriveRecruiterMind(sim));
      }
    }).not.toThrow();
  });
});

describe("garde-fou détecte un état corrompu", () => {
  it("assertStable lève si le MindState est hors bornes (corruption simulée)", () => {
    const sim = createSimulationState();
    const corrupt = { ...deriveRecruiterMind(sim), trust: 5, suspicion: -2 };
    expect(() => assertStable(sim, corrupt)).toThrow(/Stability violation/);
    expect(checkMindBounds(corrupt).length).toBeGreaterThan(0);
  });
});
