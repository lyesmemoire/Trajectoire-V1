/**
 * Tests P4.1 — Emotional UX Control System (budget, composition, guardrails,
 * anti-drift, governor). Système de contraintes : on vérifie que la composition
 * des effets reste bornée et stable, sans inventer de comportement.
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import { createEmotionalBudget, costOf, spendBudget, remaining } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/governor/emotional-budget";
import { applyCompositionRules } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/governor/composition-rules";
import { applyGuardrails, createGuardrailState, DEFAULT_GUARDRAILS } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/governor/guardrails";
import { applyAntiDrift, createAntiDriftState } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/governor/anti-drift";
import { createGovernorState, governUX } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/governor/ux-pipeline";
import type { PerceptionUX } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/perception-ux";
import { createSimulationState, updateSimulation } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/simulation-state";
import { deriveRecruiterMind, personaFromMind } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/recruiter-mind";
import { perceiveUX } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/perception-ux";
import { buildCandidateProfile } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-profile";
import { initInterviewPipeline, runInterviewPipeline } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/pipeline";

function ux(p: Partial<PerceptionUX>): PerceptionUX {
  return {
    delayBeforeReplyMs: 800, silenceProbability: 0.1, interruptionChance: 0.05,
    toneShift: 0, questionSharpness: 0.4, speechRate: 1, emotion: "neutral",
    ...p,
  };
}

describe("emotional budget", () => {
  it("coût croît avec interruption/silence/ton", () => {
    expect(costOf({ interruption: 0.3, silence: 0.3, toneShift: 0.5, sharpness: 0.5 }))
      .toBeGreaterThan(costOf({ interruption: 0, silence: 0, toneShift: 0, sharpness: 0 }));
  });
  it("budget s'épuise sous effets forts répétés (scale diminue)", () => {
    let b = createEmotionalBudget(100);
    const strong = { interruption: 0.35, silence: 0.45, toneShift: 1, sharpness: 1 };
    const cost = costOf(strong);
    const scales: number[] = [];
    for (let i = 0; i < 14; i++) {
      const r = spendBudget(b, cost, strong);
      b = r.budget;
      scales.push(r.scale);
    }
    // après assez de tours d'effets forts, le budget force l'atténuation
    expect(scales[scales.length - 1]!).toBeLessThan(1);
    expect(remaining(b)).toBeGreaterThanOrEqual(0);
    // et le système ne se bloque jamais (régen) : scale > 0
    expect(scales[scales.length - 1]!).toBeGreaterThan(0);
  });
});

describe("composition rules", () => {
  it("calm bloque l'agression", () => {
    const r = applyCompositionRules(ux({ emotion: "calm", interruptionChance: 0.3, toneShift: 0.8 }), "RH");
    expect(r.interruptionChance).toBeLessThanOrEqual(0.1);
    expect(r.toneShift).toBeLessThanOrEqual(0.2);
  });
  it("HR persona adoucit l'interruption", () => {
    const r = applyCompositionRules(ux({ interruptionChance: 0.3, emotion: "neutral" }), "RH");
    expect(r.interruptionChance).toBeLessThanOrEqual(0.15);
  });
  it("résout interruption + silence long contradictoires", () => {
    const r = applyCompositionRules(ux({ interruptionChance: 0.3, silenceProbability: 0.4, emotion: "suspicious" }), "TECH");
    expect(r.interruptionChance > 0.2 && r.silenceProbability > 0.3).toBe(false);
  });
});

describe("guardrails", () => {
  it("bornes dures silence/interruption", () => {
    const { ux: g } = applyGuardrails(ux({ silenceProbability: 0.9, interruptionChance: 0.9 }), createGuardrailState());
    expect(g.silenceProbability).toBeLessThanOrEqual(DEFAULT_GUARDRAILS.maxSilence);
    expect(g.interruptionChance).toBeLessThanOrEqual(DEFAULT_GUARDRAILS.maxInterruption);
  });
  it("limite la variation de ton entre tours (anti-saut)", () => {
    let st = createGuardrailState();
    st = applyGuardrails(ux({ toneShift: 0 }), st).state;
    const { ux: g } = applyGuardrails(ux({ toneShift: 1 }), st);
    expect(Math.abs(g.toneShift - 0)).toBeLessThanOrEqual(DEFAULT_GUARDRAILS.maxEmotionDelta + 1e-9);
  });
  it("impose une fenêtre de stabilité après un extrême", () => {
    let st = createGuardrailState();
    const ex = applyGuardrails(ux({ interruptionChance: 0.35, toneShift: 0.9 }), st);
    st = ex.state;
    expect(st.cooldown).toBeGreaterThan(0);
    const next = applyGuardrails(ux({ interruptionChance: 0.35 }), st);
    expect(next.ux.interruptionChance).toBeLessThanOrEqual(0.1); // adouci
  });
});

describe("anti-drift", () => {
  it("tire vers l'attracteur quand la dérive est forte", () => {
    const { ux: g } = applyAntiDrift(ux({ emotion: "calm", toneShift: 0.9 }), createAntiDriftState());
    expect(g.toneShift).toBeLessThan(0.9); // ramené vers l'attracteur calm (~ -0.1)
  });
});

describe("governUX (orchestrateur)", () => {
  it("UX gouvernée toujours bornée même sur entrée extrême", () => {
    const st = createGovernorState();
    const { ux: g } = governUX(ux({ interruptionChance: 1, silenceProbability: 1, toneShift: 1, questionSharpness: 1 }), "TECH", st);
    expect(g.interruptionChance).toBeLessThanOrEqual(0.35);
    expect(g.silenceProbability).toBeLessThanOrEqual(0.6);
    expect(g.toneShift).toBeLessThanOrEqual(1);
  });
  it("déterministe", () => {
    const a = governUX(ux({ toneShift: 0.5 }), "RH", createGovernorState());
    const b = governUX(ux({ toneShift: 0.5 }), "RH", createGovernorState());
    expect(a.ux).toEqual(b.ux);
  });
});

describe("intégration pipeline + stabilité longue durée", () => {
  it("pipeline expose une UX gouvernée + governor dans l'état", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 70, targetRole: "Dev" });
    const { state } = initInterviewPipeline({ profile, persona: "neutral" });
    expect(state.governor).toBeDefined();
    const turn = runInterviewPipeline(state, "euh je sais pas");
    expect(turn.ux.interruptionChance).toBeLessThanOrEqual(0.35);
    expect(turn.state.governor).toBeDefined();
  });

  it("500 tours agressifs -> UX gouvernée jamais hors bornes (pas de drift composé)", () => {
    let sim = createSimulationState();
    let gov = createGovernorState();
    for (let i = 0; i < 500; i++) {
      sim = updateSimulation(sim, { weakAnswer: true, bluff: i % 2 === 0, contradiction: i % 3 === 0 });
      const mind = deriveRecruiterMind(sim);
      const base = perceiveUX(mind);
      const g = governUX(base, personaFromMind(mind), gov);
      gov = g.state;
      expect(g.ux.interruptionChance).toBeLessThanOrEqual(0.35);
      expect(g.ux.silenceProbability).toBeLessThanOrEqual(0.6);
      expect(Math.abs(g.ux.toneShift)).toBeLessThanOrEqual(1);
      expect(Number.isFinite(g.ux.delayBeforeReplyMs)).toBe(true);
    }
  });
});
