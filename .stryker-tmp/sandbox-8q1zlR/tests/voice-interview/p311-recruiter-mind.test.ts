/**
 * Tests P3.11 — Recruiter Mind Model (état mental unifié dérivé).
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import { createSimulationState, updateSimulation } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/simulation-state";
import { deriveRecruiterMind, personaFromMind, describeMind } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/recruiter-mind";
import { buildCandidateProfile } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-profile";
import { initInterviewPipeline, runInterviewPipeline } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/pipeline";

const WEAK = "euh je sais pas trop";
const STRONG =
  "Par exemple, dans le cadre d'un projet client, ma mission était de réduire les délais. " +
  "J'ai conçu et déployé une architecture, organisé l'équipe et automatisé le pipeline. " +
  "Résultat : une réduction de 30% du temps de livraison en 3 mois.";

describe("deriveRecruiterMind", () => {
  it("état initial neutre/calme avec valeurs bornées", () => {
    const mind = deriveRecruiterMind(createSimulationState());
    expect(mind.trust).toBeGreaterThanOrEqual(0);
    expect(mind.trust).toBeLessThanOrEqual(1);
    expect(mind.confidenceInCandidate).toBeGreaterThanOrEqual(-1);
    expect(mind.confidenceInCandidate).toBeLessThanOrEqual(1);
    // état de départ : bienveillant par défaut (pas de suspicion ni pression)
    expect(["calm", "neutral", "curious", "impressed"]).toContain(mind.emotion);
    expect(mind.suspicion).toBeLessThan(0.5);
  });

  it("bluff répété -> suspicion élevée + emotion suspicious", () => {
    let s = createSimulationState();
    for (let i = 0; i < 3; i++) s = updateSimulation(s, { bluff: true });
    const mind = deriveRecruiterMind(s);
    expect(mind.suspicion).toBeGreaterThan(0.3);
    expect(mind.emotion).toBe("suspicious");
  });

  it("réponses fortes structurées -> confiance candidat positive", () => {
    let s = createSimulationState();
    for (let i = 0; i < 3; i++) s = updateSimulation(s, { strongAnswer: true, strongTechnical: true, progression: true });
    const mind = deriveRecruiterMind(s);
    expect(mind.confidenceInCandidate).toBeGreaterThan(0);
  });

  it("pression maximale -> emotion annoyed ou suspicious", () => {
    let s = createSimulationState();
    for (let i = 0; i < 6; i++) s = updateSimulation(s, { weakAnswer: true });
    const mind = deriveRecruiterMind(s);
    expect(["annoyed", "suspicious"]).toContain(mind.emotion);
    expect(mind.pressure).toBeGreaterThan(0.6);
  });

  it("fatigue augmente avec les tours", () => {
    let s = createSimulationState();
    const m0 = deriveRecruiterMind(s);
    for (let i = 0; i < 5; i++) s = updateSimulation(s, { strongAnswer: true });
    const m5 = deriveRecruiterMind(s);
    expect(m5.fatigue).toBeGreaterThan(m0.fatigue);
  });
});

describe("personaFromMind", () => {
  it("suspicion -> AGGRESSIVE", () => {
    let s = createSimulationState();
    for (let i = 0; i < 4; i++) s = updateSimulation(s, { bluff: true });
    expect(personaFromMind(deriveRecruiterMind(s))).toBe("AGGRESSIVE");
  });
  it("confiance forte -> TECH/CTO", () => {
    let s = createSimulationState();
    for (let i = 0; i < 4; i++) s = updateSimulation(s, { strongTechnical: true, strongAnswer: true });
    expect(["TECH", "CTO"]).toContain(personaFromMind(deriveRecruiterMind(s)));
  });
});

describe("describeMind", () => {
  it("produit un résumé lisible", () => {
    const d = describeMind(deriveRecruiterMind(createSimulationState()));
    expect(d).toContain("Humeur");
    expect(d).toContain("trust");
  });
});

describe("pipeline expose mind", () => {
  it("runInterviewPipeline renvoie un mind cohérent", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 70, targetRole: "Dev" });
    const { state } = initInterviewPipeline({ profile, persona: "neutral" });
    const weakTurn = runInterviewPipeline(state, WEAK);
    expect(weakTurn.mind).toBeDefined();
    // après une réponse faible, la pression mentale ne diminue pas
    expect(weakTurn.mind.pressure).toBeGreaterThanOrEqual(deriveRecruiterMind(state.simulation).pressure);

    const strongTurn = runInterviewPipeline(state, STRONG);
    expect(strongTurn.mind).toBeDefined();
  });
});
