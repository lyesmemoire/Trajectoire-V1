/**
 * Tests P4 — Perceptual Engine (mise en scène UX, mapping mind → UX).
 * Déterministe ; toutes les sorties bornées (anti-overacting).
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import { perceiveUX, smoothUX } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/perception-ux";
import type { RecruiterMindState } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/recruiter-mind";
import { createSimulationState, updateSimulation } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/simulation-state";
import { deriveRecruiterMind } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/recruiter-mind";
import { buildCandidateProfile } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-profile";
import { initInterviewPipeline, runInterviewPipeline } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/pipeline";

function mind(p: Partial<RecruiterMindState>): RecruiterMindState {
  return {
    emotion: "neutral",
    trust: 0.5, suspicion: 0, engagement: 0.5, pressure: 0, fatigue: 0,
    confidenceInCandidate: 0, momentum: 0,
    ...p,
  };
}

describe("perceiveUX — déterminisme & bornes (anti-overacting)", () => {
  it("même mind -> même UX", () => {
    const m = mind({ pressure: 0.6, suspicion: 0.4 });
    expect(perceiveUX(m)).toEqual(perceiveUX(m));
  });

  it("toutes les sorties restent bornées même en état extrême", () => {
    const extreme = mind({ pressure: 1, suspicion: 1, fatigue: 1, engagement: 0, confidenceInCandidate: -1 });
    const ux = perceiveUX(extreme);
    expect(ux.delayBeforeReplyMs).toBeGreaterThanOrEqual(250);
    expect(ux.delayBeforeReplyMs).toBeLessThanOrEqual(1600);
    expect(ux.silenceProbability).toBeGreaterThanOrEqual(0);
    expect(ux.silenceProbability).toBeLessThanOrEqual(0.45);
    expect(ux.interruptionChance).toBeLessThanOrEqual(0.35);
    expect(ux.toneShift).toBeGreaterThanOrEqual(-1);
    expect(ux.toneShift).toBeLessThanOrEqual(1);
    expect(ux.questionSharpness).toBeGreaterThanOrEqual(0);
    expect(ux.questionSharpness).toBeLessThanOrEqual(1);
    expect(ux.speechRate).toBeGreaterThanOrEqual(0.85);
    expect(ux.speechRate).toBeLessThanOrEqual(1.2);
  });
});

describe("perceiveUX — sémantique perceptive", () => {
  it("pression haute -> ton plus sec + question plus tranchante + réponse plus rapide", () => {
    const calm = perceiveUX(mind({ pressure: 0.1, engagement: 0.7, confidenceInCandidate: 0.5 }));
    const tense = perceiveUX(mind({ pressure: 0.9, suspicion: 0.6 }));
    expect(tense.toneShift).toBeGreaterThan(calm.toneShift);
    expect(tense.questionSharpness).toBeGreaterThan(calm.questionSharpness);
    expect(tense.delayBeforeReplyMs).toBeLessThan(calm.delayBeforeReplyMs);
  });

  it("confiance/engagement élevés -> ton plus doux", () => {
    const warm = perceiveUX(mind({ confidenceInCandidate: 0.8, engagement: 0.9, trust: 0.9 }));
    expect(warm.toneShift).toBeLessThan(0.2);
  });

  it("interruption seulement sous forte pression", () => {
    expect(perceiveUX(mind({ pressure: 0.2 })).interruptionChance).toBeLessThan(0.15);
    expect(perceiveUX(mind({ pressure: 0.95, engagement: 0.1 })).interruptionChance).toBeGreaterThan(0.2);
  });
});

describe("smoothUX — anti-saccade", () => {
  it("lisse les variations entre deux tours", () => {
    const a = perceiveUX(mind({ pressure: 0 }));
    const b = perceiveUX(mind({ pressure: 1, suspicion: 1 }));
    const blended = smoothUX(a, b, 0.5);
    expect(blended.questionSharpness).toBeGreaterThan(a.questionSharpness);
    expect(blended.questionSharpness).toBeLessThan(b.questionSharpness);
  });
});

describe("pipeline expose ux", () => {
  it("runInterviewPipeline renvoie un ux borné", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 70, targetRole: "Dev" });
    const { state } = initInterviewPipeline({ profile, persona: "neutral" });
    const turn = runInterviewPipeline(state, "euh je sais pas");
    expect(turn.ux).toBeDefined();
    expect(turn.ux.delayBeforeReplyMs).toBeGreaterThanOrEqual(250);
    // l'ux dérive bien du mind du tour
    expect(turn.ux.emotion).toBe(turn.mind.emotion);
  });
});

describe("intégration stabilité : ux borné sur trajectoire longue", () => {
  it("200 tours -> ux toujours dans les bornes", () => {
    let sim = createSimulationState();
    for (let i = 0; i < 200; i++) {
      sim = updateSimulation(sim, { weakAnswer: i % 2 === 0, bluff: i % 5 === 0, strongAnswer: i % 3 === 0 });
      const ux = perceiveUX(deriveRecruiterMind(sim));
      expect(ux.silenceProbability).toBeLessThanOrEqual(0.45);
      expect(ux.interruptionChance).toBeLessThanOrEqual(0.35);
      expect(Number.isFinite(ux.delayBeforeReplyMs)).toBe(true);
    }
  });
});
