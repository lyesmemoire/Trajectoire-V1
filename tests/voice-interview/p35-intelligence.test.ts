/**
 * Tests P3.5 — intent detection, personas, clarify/repeat/stop, summary.
 * 100% déterministe.
 */
import { describe, it, expect } from "vitest";
import { detectIntent } from "@/apps/realtime-gateway/src/voice-interview/core/intent-detector";
import {
  generateQuestion,
  applyStyle,
  rephraseQuestion,
} from "@/apps/realtime-gateway/src/voice-interview/core/question-generator";
import { buildInterviewSummary } from "@/apps/realtime-gateway/src/voice-interview/core/interview-summary";
import { createInitialState } from "@/apps/realtime-gateway/src/voice-interview/core/state";
import { processVoiceTurn } from "@/apps/realtime-gateway/src/voice-interview/core/voice-orchestrator";
import type { VoiceTurnRecord } from "@/apps/realtime-gateway/src/voice-interview/sessions/session-manager";

describe("detectIntent", () => {
  it("repeat / clarify / next / stop / slower", () => {
    expect(detectIntent("Peux-tu répéter ?")).toBe("repeat");
    expect(detectIntent("Je n'ai pas compris")).toBe("clarify");
    expect(detectIntent("question suivante")).toBe("next");
    expect(detectIntent("on arrête là")).toBe("stop");
    expect(detectIntent("plus lentement s'il te plaît")).toBe("slower");
  });
  it("none pour une vraie réponse d'entretien", () => {
    expect(
      detectIntent(
        "Dans mon dernier projet j'ai mis en place une architecture et le résultat a été une réduction de 30% des délais.",
      ),
    ).toBe("none");
  });
  it("vide -> none", () => {
    expect(detectIntent("")).toBe("none");
  });
});

describe("personas (style)", () => {
  it("applyStyle change le ton sans casser le sens", () => {
    const q = "Parle-moi de ton expérience.";
    expect(applyStyle(q, "neutral")).toBe(q);
    expect(applyStyle(q, "supportive")).toContain("Prends ton temps");
    expect(applyStyle(q, "challenging")).toContain("Soyons précis");
  });
  it("generateQuestion applique le style", () => {
    const q = generateQuestion({
      phase: "intro",
      gap: "node",
      askedQuestions: [],
      style: "challenging",
    });
    expect(q).toContain("Soyons précis");
    expect(q).toContain("node");
  });
});

describe("rephraseQuestion (repeat)", () => {
  it("produit une version simplifiée", () => {
    const r = rephraseQuestion("Question complexe et longue", "Docker");
    expect(r).toContain("Docker");
    expect(r.toLowerCase()).toContain("simplement");
  });
});

describe("processVoiceTurn — intentions (pas de pénalité)", () => {
  it("repeat : reformule, score 0, non terminé", async () => {
    const state = createInitialState({ jobGap: "node" });
    state.askedQuestions.push("Une question initiale ?");
    const r = await processVoiceTurn(state, "peux-tu répéter ?");
    expect(r.intent).toBe("repeat");
    expect(r.score).toBe(0);
    expect(r.finished).toBe(false);
    expect(r.nextQuestion.toLowerCase()).toContain("simplement");
  });

  it("clarify : explique, phase inchangée", async () => {
    const state = createInitialState({ jobGap: "node" });
    const phaseBefore = state.phase;
    const r = await processVoiceTurn(state, "je n'ai pas compris");
    expect(r.intent).toBe("clarify");
    expect(r.state.phase).toBe(phaseBefore);
    expect(r.score).toBe(0);
  });

  it("next : enchaîne sans évaluer", async () => {
    const state = createInitialState({ jobGap: "node" });
    const r = await processVoiceTurn(state, "question suivante");
    expect(r.intent).toBe("next");
    expect(r.nextQuestion.length).toBeGreaterThan(0);
  });

  it("stop : clôture + résumé", async () => {
    const state = createInitialState({ jobGap: "node" });
    const history: VoiceTurnRecord[] = [
      { turn: 1, transcript: "x", score: 80, question: "q1" },
      { turn: 2, transcript: "y", score: 60, question: "q2" },
    ];
    const r = await processVoiceTurn(state, "on arrête là", undefined, history);
    expect(r.intent).toBe("stop");
    expect(r.finished).toBe(true);
    expect(r.summary).toBeDefined();
    expect(r.summary?.overallScore).toBe(70);
  });

  it("réponse normale : évaluée normalement (intent none)", async () => {
    const state = createInitialState({ jobGap: "architecture" });
    const strong =
      "Dans le cadre d'un projet, ma mission était X. J'ai mis en place une architecture. Résultat : -30% en 3 mois.";
    const r = await processVoiceTurn(state, strong);
    expect(r.intent).toBe("none");
    expect(r.score).toBeGreaterThanOrEqual(80);
  });
});

describe("buildInterviewSummary", () => {
  it("agrège l'historique", () => {
    const s = buildInterviewSummary([
      { turn: 1, transcript: "a", score: 90, question: "q1" },
      { turn: 2, transcript: "b", score: 40, question: "q2" },
    ]);
    expect(s.overallScore).toBe(65);
    expect(s.turns).toBe(2);
    expect(typeof s.recommendation).toBe("string");
  });
  it("historique vide -> score 0, recommandation présente", () => {
    const s = buildInterviewSummary([]);
    expect(s.overallScore).toBe(0);
    expect(s.recommendation.length).toBeGreaterThan(0);
  });
});
