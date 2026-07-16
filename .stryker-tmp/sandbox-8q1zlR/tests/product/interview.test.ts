/**
 * Tests P3 — évaluation d'entretien (déterministe).
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import { evaluateAnswer } from "@/lib/runtime/interview/evaluate-answer";
import { generateFollowUp } from "@/lib/runtime/interview/generate-followup";

describe("evaluateAnswer", () => {
  it("retourne un score borné 0–100 et une structure feedback complète", () => {
    const r = evaluateAnswer({ answer: "Réponse courte." });
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(["faible", "moyen", "fort"]).toContain(r.feedback.level);
    expect(Array.isArray(r.feedback.improve)).toBe(true);
    expect(r.star).toBeDefined();
  });

  it("note 0 et guide sur une réponse vide", () => {
    const r = evaluateAnswer({ answer: "   " });
    expect(r.score).toBe(0);
    expect(r.feedback.level).toBe("faible");
    expect(r.feedback.improve.length).toBeGreaterThan(0);
  });

  it("récompense une réponse STAR complète et chiffrée", () => {
    const strong = evaluateAnswer({
      answer:
        "Dans le cadre d'un projet client complexe, ma mission était de réduire les délais. " +
        "J'ai mis en place une nouvelle architecture et organisé l'équipe. " +
        "Résultat : nous avons réduit le temps de livraison de 30% en 3 mois.",
      gap: "architecture",
    });
    const weak = evaluateAnswer({ answer: "J'ai fait des trucs." });
    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.score).toBeGreaterThanOrEqual(80);
    expect(strong.star.result).toBe(true);
  });

  it("crédite la couverture du gap visé", () => {
    const withGap = evaluateAnswer({
      answer: "J'ai travaillé sur la résolution de problème en équipe.",
      gap: "résolution de problème",
    });
    const withoutGap = evaluateAnswer({
      answer: "J'ai travaillé sur autre chose.",
      gap: "résolution de problème",
    });
    expect(withGap.score).toBeGreaterThan(withoutGap.score);
  });

  it("est déterministe (même entrée -> même score)", () => {
    const input = { answer: "Contexte, objectif, j'ai agi, résultat positif.", gap: "node" };
    expect(evaluateAnswer(input).score).toBe(evaluateAnswer(input).score);
  });
});

describe("generateFollowUp", () => {
  it("cible le gap quand fourni", () => {
    expect(generateFollowUp("Q", "AWS")).toContain("AWS");
  });
  it("a un fallback générique sans gap", () => {
    expect(generateFollowUp("Q").length).toBeGreaterThan(0);
  });
});
