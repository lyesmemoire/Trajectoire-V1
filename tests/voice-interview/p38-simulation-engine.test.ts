/**
 * Tests P3.8 — Interview Simulation Engine (pression, mémoire, cross-session,
 * hidden eval, persona réactif, état global). 100% déterministe.
 */
import { describe, it, expect } from "vitest";
import { createPressureState, updatePressure, mayInterrupt } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/pressure";
import { createMemoryState, updateMemory, recall } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/memory";
import { createCrossSessionState, hasHistory, buildMemoryHook } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/cross-session";
import { createHiddenEval, updateHiddenEval } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/hidden-eval";
import { createReactivePersona, updatePersona } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/persona-reactivity";
import { createSimulationState, updateSimulation } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/simulation-state";

describe("pressure", () => {
  it("monte sur faiblesse/contradiction/bluff, descend sur réponse forte", () => {
    let s = createPressureState();
    s = updatePressure(s, { weakAnswer: true });
    const afterWeak = s.level;
    s = updatePressure(s, { strongAnswer: true });
    expect(s.level).toBeLessThan(afterWeak);
    s = updatePressure(s, { contradiction: true, bluff: true });
    expect(s.level).toBeGreaterThan(afterWeak);
  });
  it("mappe le rythme et permet l'interruption à haut niveau", () => {
    let s = createPressureState();
    for (let i = 0; i < 6; i++) s = updatePressure(s, { bluff: true });
    expect(s.level).toBe(100);
    expect(s.rhythm).toBe("interrupted");
    expect(mayInterrupt(s)).toBe(true);
  });
  it("est déterministe", () => {
    const a = updatePressure(createPressureState(), { contradiction: true });
    const b = updatePressure(createPressureState(), { contradiction: true });
    expect(a).toEqual(b);
  });
});

describe("memory", () => {
  it("décroissance + oubli si confiance trop basse", () => {
    let s = createMemoryState();
    s = updateMemory(s, 1, { key: "k8s", value: "2 ans" }); // confidence 0.5
    // 5 décroissances de 0.05 -> 0.25 < 0.3 -> oublié
    for (let t = 2; t <= 6; t++) s = updateMemory(s, t);
    expect(recall(s, "k8s").status).toBe("forgotten");
  });
  it("renforcement sur signal fort -> rappel exact", () => {
    let s = createMemoryState();
    s = updateMemory(s, 1, { key: "aws", value: "4 ans", strongSignal: true });
    const r = recall(s, "aws");
    expect(r.status).toBe("exact");
  });
  it("contradiction -> fixation cognitive (confiance forte)", () => {
    let s = createMemoryState();
    s = updateMemory(s, 1, { key: "x", value: "v", contradiction: true });
    expect(recall(s, "x").status).toBe("exact");
  });
});

describe("cross-session", () => {
  it("pas d'historique -> hook null", () => {
    const s = createCrossSessionState();
    expect(hasHistory(s)).toBe(false);
    expect(buildMemoryHook(s)).toBeNull();
  });
  it("historique -> hook reformulé", () => {
    const s = createCrossSessionState([{ summary: "ok", contradictions: 1, score: 60 }]);
    expect(hasHistory(s)).toBe(true);
    expect(buildMemoryHook(s)).toContain("dernier échange");
  });
});

describe("hidden-eval", () => {
  it("contradiction baisse cohérence, bluff monte bluffScore", () => {
    const s = updateHiddenEval(createHiddenEval(), { contradiction: true, bluff: true });
    expect(s.coherenceScore).toBeLessThan(70);
    expect(s.bluffScore).toBeGreaterThan(0);
  });
  it("réponse structurée monte stabilité, progression monte growth", () => {
    const s = updateHiddenEval(createHiddenEval(), { strongStructuredAnswer: true, progression: true });
    expect(s.stabilityScore).toBeGreaterThan(50);
    expect(s.growthScore).toBeGreaterThan(50);
  });
});

describe("persona-reactivity", () => {
  it("contradiction/bluff -> AGGRESSIVE", () => {
    const h = updateHiddenEval(createHiddenEval(), { bluff: true });
    const p = updatePersona(createReactivePersona(), { contradiction: true }, h);
    expect(p.mode).toBe("AGGRESSIVE");
    expect(p.patience).toBeLessThan(0.7);
  });
  it("technique fort + stabilité -> TECH/CTO", () => {
    const h = { coherenceScore: 80, bluffScore: 0, stabilityScore: 80, growthScore: 60 };
    const p = updatePersona(createReactivePersona(), { strongTechnical: true }, h);
    expect(["TECH", "CTO"]).toContain(p.mode);
  });
  it("réponse faible -> RH/MENTOR", () => {
    const h = createHiddenEval();
    const p = updatePersona(createReactivePersona(), { weakAnswer: true }, h);
    expect(["RH", "MENTOR"]).toContain(p.mode);
  });
});

describe("simulation-state (global)", () => {
  it("agrège tous les sous-états + incrémente le tour", () => {
    let s = createSimulationState();
    expect(s.turn).toBe(0);
    s = updateSimulation(s, { contradiction: true, bluff: true, memoryUpdate: { key: "k8s", value: "2 ans" } });
    expect(s.turn).toBe(1);
    expect(s.pressure.level).toBeGreaterThan(20);
    expect(s.hiddenEval.bluffScore).toBeGreaterThan(0);
    expect(s.persona.mode).toBe("AGGRESSIVE");
    expect(recall(s.memory, "k8s").status).not.toBe("forgotten");
  });
  it("est déterministe", () => {
    const a = updateSimulation(createSimulationState(), { strongAnswer: true, strongTechnical: true });
    const b = updateSimulation(createSimulationState(), { strongAnswer: true, strongTechnical: true });
    expect(a).toEqual(b);
  });
  it("cross-session préservé", () => {
    const s0 = createSimulationState([{ summary: "x", contradictions: 0, score: 80 }]);
    const s1 = updateSimulation(s0, { strongAnswer: true });
    expect(s1.crossSession.previousSessions).toHaveLength(1);
  });
});
