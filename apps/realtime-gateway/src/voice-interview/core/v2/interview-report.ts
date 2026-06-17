/**
 * core/v2/interview-report.ts — Score multidimensionnel + reco finale (P3.6, Bloc 10+11). PURE.
 */

import type { AnswerSignals } from "./answer-signals";

export interface InterviewReport {
  communication: number;
  technicalDepth: number;
  problemSolving: number;
  leadership: number;
  confidence: number;
  cultureFit: number;
  overall: number;
}

export type HiringDecision = "strong_hire" | "hire" | "mixed" | "weak" | "reject";

export interface HiringRecommendation {
  decision: HiringDecision;
  strengths: string[];
  weaknesses: string[];
  justification: string;
  report: InterviewReport;
}

/** Un enregistrement de réponse pour l'agrégation finale. */
export interface AnsweredTurn {
  category: string;
  score: number; // 0–100 (eval STAR)
  signals: AnswerSignals;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function to100(n01: number): number {
  return Math.round(Math.max(0, Math.min(1, n01)) * 100);
}

export function buildInterviewReport(turns: AnsweredTurn[]): InterviewReport {
  if (turns.length === 0) {
    return {
      communication: 0, technicalDepth: 0, problemSolving: 0,
      leadership: 0, confidence: 0, cultureFit: 0, overall: 0,
    };
  }

  const communication = to100(avg(turns.map((t) => t.signals.specificity * 0.6 + t.signals.confidence * 0.4)));
  const technicalDepth = to100(avg(turns.filter((t) => t.category === "technical").map((t) => t.signals.technicalDepth)) || avg(turns.map((t) => t.signals.technicalDepth)));
  const problemSolving = Math.round(avg(turns.map((t) => t.score)));
  const leadership = to100(avg(turns.map((t) => t.signals.ownership)));
  const confidence = to100(avg(turns.map((t) => t.signals.confidence)));
  const cultureFit = to100(avg(turns.map((t) => (t.signals.confidence + t.signals.specificity) / 2)));

  const overall = Math.round(
    communication * 0.2 +
      technicalDepth * 0.25 +
      problemSolving * 0.25 +
      leadership * 0.15 +
      confidence * 0.1 +
      cultureFit * 0.05,
  );

  return { communication, technicalDepth, problemSolving, leadership, confidence, cultureFit, overall };
}

export function buildHiringRecommendation(
  turns: AnsweredTurn[],
): HiringRecommendation {
  const report = buildInterviewReport(turns);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (report.technicalDepth >= 65) strengths.push("Bonne profondeur technique.");
  if (report.communication >= 65) strengths.push("Communication claire et structurée.");
  if (report.leadership >= 60) strengths.push("Sens des responsabilités (ownership).");
  if (report.problemSolving >= 70) strengths.push("Résolution de problèmes solide.");

  if (report.technicalDepth < 50) weaknesses.push("Profondeur technique à renforcer.");
  if (report.confidence < 50) weaknesses.push("Manque d'assurance dans les réponses.");
  if (report.problemSolving < 50) weaknesses.push("Réponses peu structurées / peu chiffrées.");
  if (strengths.length === 0) strengths.push("Potentiel à confirmer avec plus d'exemples.");

  let decision: HiringDecision;
  if (report.overall >= 80) decision = "strong_hire";
  else if (report.overall >= 65) decision = "hire";
  else if (report.overall >= 50) decision = "mixed";
  else if (report.overall >= 35) decision = "weak";
  else decision = "reject";

  const justification = decisionText(decision);
  return { decision, strengths, weaknesses, justification, report };
}

function decisionText(d: HiringDecision): string {
  switch (d) {
    case "strong_hire":
      return "Avis très favorable : profil convaincant sur l'ensemble des dimensions.";
    case "hire":
      return "Avis favorable : candidat solide, quelques points à confirmer.";
    case "mixed":
      return "Avis mitigé : potentiel réel mais zones à approfondir.";
    case "weak":
      return "Avis réservé : préparation supplémentaire recommandée avant décision.";
    case "reject":
    default:
      return "Avis défavorable en l'état : écart important avec les attentes du poste.";
  }
}
