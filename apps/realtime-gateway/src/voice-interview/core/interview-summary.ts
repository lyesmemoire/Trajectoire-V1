/**
 * core/interview-summary.ts — Synthèse finale d'entretien (P3.5).
 *
 * PURE, déterministe. Agrège l'historique des tours (déjà stocké en session)
 * en un bilan exploitable. Aucune dépendance LLM/DB.
 */

import type { VoiceTurnRecord } from "../sessions/session-manager.js";

export interface InterviewSummary {
  overallScore: number; // 0–100, moyenne des tours évalués
  turns: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export function buildInterviewSummary(history: VoiceTurnRecord[], ): InterviewSummary {
  const scored = history.filter((h) => typeof h.score === "number");
  const overallScore =
    scored.length > 0
      ? Math.round(scored.reduce((a, b) => a + b.score, 0) / scored.length)
      : 0;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const strong = scored.filter((h) => h.score >= 75).length;
  const weak = scored.filter((h) => h.score < 50).length;

  if (strong > 0) strengths.push(`${strong} réponse(s) structurée(s) et convaincante(s).`);
  if (overallScore >= 70)
    strengths.push("Bonne maîtrise globale de la méthode STAR.");
  if (scored.some((h) => h.score >= 85))
    strengths.push("Au moins une réponse de très bon niveau.");

  if (weak > 0)
    weaknesses.push(`${weak} réponse(s) à structurer davantage (méthode STAR).`);
  if (overallScore < 50)
    weaknesses.push("Manque d'exemples concrets et de résultats chiffrés.");
  if (strengths.length === 0)
    weaknesses.push("Approfondir les situations avec des cas réels.");

  let recommendation: string;
  if (overallScore >= 75) {
    recommendation =
      "Profil solide : continue à t'entraîner sur les questions de mise en pression.";
  } else if (overallScore >= 50) {
    recommendation =
      "Bon potentiel : travaille la structure STAR et ajoute des résultats mesurables.";
  } else {
    recommendation =
      "Reprends chaque réponse avec un exemple précis (Situation, Tâche, Action, Résultat) et un chiffre.";
  }

  return {
    overallScore,
    turns: scored.length,
    strengths,
    weaknesses,
    recommendation,
  };
}
