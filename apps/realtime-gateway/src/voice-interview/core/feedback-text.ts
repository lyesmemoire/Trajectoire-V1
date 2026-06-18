/**
 * core/feedback-text.ts — Génération de feedback texte court (P3.2).
 *
 * PURE, déterministe. Transforme un signal pédagogique + une évaluation STAR
 * en une phrase de retour brève, calme et non jugeante (1 idée à la fois).
 */

import type { FeedbackSignal } from "./interview-engine.js";
import type { AnswerEvaluation } from "./evaluation.js";

export function buildFeedbackText(
  signal: FeedbackSignal,
  evaluation: AnswerEvaluation,
): string {
  // Pointe la dimension STAR la plus utile à travailler.
  const missing: string | null = !evaluation.star.result
    ? "le résultat obtenu"
    : !evaluation.star.action
      ? "ce que tu as fait concrètement"
      : !evaluation.star.situation
        ? "le contexte"
        : !evaluation.star.task
          ? "l'objectif visé"
          : null;

  switch (signal) {
    case "move-on":
      return "Réponse claire et structurée. On passe à la suite.";
    case "deepen":
      return missing
        ? `Bonne base. Pour aller plus loin, précise ${missing}.`
        : "Bonne base. Ajoute un exemple encore plus concret.";
    case "probe":
    default:
      return missing
        ? `Prenons un instant : peux-tu préciser ${missing} ?`
        : "Reprenons calmement avec un exemple précis.";
  }
}
