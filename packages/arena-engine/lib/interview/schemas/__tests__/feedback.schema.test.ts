import { describe, it, expect } from "vitest";
import { computeFeedbackScore } from "../feedback.schema";
import type { FeedbackSignals } from "../feedback.schema";

// Fixture de base
const baseSignals: FeedbackSignals = {
  observations: {
    content: {
      positives:      ["Exemple concret avec chiffre"],
      negatives:      [],
      concrete_count: 3,
    },
    structure: {
      has_situation: true,
      has_task:      true,
      has_action:    true,
      has_result:    true,
      is_concise:    true,
    },
    cv_alignment: {
      contradictions: [],
      omissions:      [],
      inflations:     [],
    },
  },
  recommendations: [
    {
      priority: 1,
      area:     "CONTENT",
      action:   "Ajouter le contexte budgétaire",
      example:  null,
    },
  ],
  summary: "Réponse structurée avec exemples chiffrés.",
};

describe("computeFeedbackScore", () => {
  it("retourne 100 en cv_alignment si aucune contradiction", () => {
    const score = computeFeedbackScore(baseSignals);
    expect(score.cv_alignment).toBe(100);
  });

  it("pénalise 20 pts par contradiction", () => {
    const signals: FeedbackSignals = {
      ...baseSignals,
      observations: {
        ...baseSignals.observations,
        cv_alignment: {
          contradictions: [
            { said: "5M€ de budget", cv_states: "2M€ de budget" },
          ],
          omissions:  [],
          inflations: [],
        },
      },
    };
    const score = computeFeedbackScore(signals);
    expect(score.cv_alignment).toBe(80);
  });

  it("cv_alignment ne descend pas sous 0", () => {
    const signals: FeedbackSignals = {
      ...baseSignals,
      observations: {
        ...baseSignals.observations,
        cv_alignment: {
          contradictions: Array(6).fill({
            said: "X", cv_states: "Y",
          }),
          omissions:  Array(5).fill("Z"),
          inflations: Array(5).fill("W"),
        },
      },
    };
    const score = computeFeedbackScore(signals);
    expect(score.cv_alignment).toBe(0);
  });

  it("structure = 100 si STAR complet + concis", () => {
    const score = computeFeedbackScore(baseSignals);
    expect(score.structure).toBe(100);
  });

  it("structure = 60 si STAR incomplet (3/4) sans bonus concision", () => {
    const signals: FeedbackSignals = {
      ...baseSignals,
      observations: {
        ...baseSignals.observations,
        structure: {
          has_situation: true,
          has_task:      true,
          has_action:    true,
          has_result:    false, // manque
          is_concise:    false,
        },
      },
    };
    const score = computeFeedbackScore(signals);
    expect(score.structure).toBe(60); // (3/4 * 80) = 60, pas de bonus
  });

  it("overall est déterministe — même input, même output", () => {
    const score1 = computeFeedbackScore(baseSignals);
    const score2 = computeFeedbackScore(baseSignals);
    expect(score1.overall).toBe(score2.overall);
  });

  it("contradiction unique → overall pénalisé significativement", () => {
    const perfect = computeFeedbackScore(baseSignals);
    const withContradiction = computeFeedbackScore({
      ...baseSignals,
      observations: {
        ...baseSignals.observations,
        cv_alignment: {
          contradictions: [{ said: "X", cv_states: "Y" }],
          omissions:  [],
          inflations: [],
        },
      },
    });
    // cv_alignment pèse 40% — une contradiction (-20) doit impacter l'overall
    expect(withContradiction.overall).toBeLessThan(perfect.overall - 5);
  });
});
