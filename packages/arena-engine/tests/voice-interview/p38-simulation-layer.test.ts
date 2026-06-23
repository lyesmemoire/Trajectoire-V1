/**
 * Tests — couche de simulation (refactor P3.7).
 * Vérifie que les 4 couches exposent leur surface et restent iso-comportement
 * vs l'usage direct des modules V2.
 */
import { describe, it, expect } from "vitest";
import * as Sim from "@/apps/realtime-gateway/src/voice-interview/core/simulation/index";
import { perceive } from "@/apps/realtime-gateway/src/voice-interview/core/simulation/perception";
import { extractSignals } from "@/apps/realtime-gateway/src/voice-interview/core/v2/answer-signals";
import { detectBluff } from "@/apps/realtime-gateway/src/voice-interview/core/v2/bluff-detector";
import { extractCandidateFacts, detectContradiction } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-facts";

describe("simulation layer — surface publique", () => {
  it("perception exporte signaux/bluff/contradictions", () => {
    expect(typeof Sim.extractSignals).toBe("function");
    expect(typeof Sim.detectBluff).toBe("function");
    expect(typeof Sim.detectContradiction).toBe("function");
  });
  it("interviewer-brain exporte personas/banque/parcours/plan", () => {
    expect(typeof Sim.getPersona).toBe("function");
    expect(typeof Sim.byCategory).toBe("function");
    expect(typeof Sim.inferRoleTrack).toBe("function");
    expect(typeof Sim.buildInterviewPlan).toBe("function");
    expect(typeof Sim.pickTrapQuestion).toBe("function");
  });
  it("adaptive exporte difficulté/arbre", () => {
    expect(typeof Sim.adaptDifficulty).toBe("function");
    expect(typeof Sim.nextTopicInTree).toBe("function");
  });
  it("evaluation exporte rapports/crédibilité", () => {
    expect(typeof Sim.buildInterviewReport).toBe("function");
    expect(typeof Sim.buildRecruiterReport).toBe("function");
    expect(typeof Sim.buildCredibilityScore).toBe("function");
  });
});

describe("perceive() — iso-comportement vs modules directs", () => {
  const facts = extractCandidateFacts("Kubernetes : 2 ans.");
  const transcript = "J'utilise Kubernetes depuis 6 ans.";

  it("agrège exactement signaux + bluff + contradiction", () => {
    const p = perceive(transcript, facts);
    const signals = extractSignals(transcript);
    const bluff = detectBluff(transcript, signals);
    const contradiction = detectContradiction(facts, transcript);

    expect(p.signals).toEqual(signals);
    expect(p.bluff).toEqual(bluff);
    expect(p.contradiction).toEqual(contradiction ?? undefined);
  });

  it("pas de contradiction -> champ absent", () => {
    const p = perceive("Kubernetes depuis 2 ans.", facts);
    expect(p.contradiction).toBeUndefined();
  });
});
