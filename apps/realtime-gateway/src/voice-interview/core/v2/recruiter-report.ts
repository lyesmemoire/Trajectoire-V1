/**
 * core/v2/recruiter-report.ts — Rapport recruteur final (P3.7.6). PURE.
 *
 * Étend le rapport V2 (interview-report) avec crédibilité, contradictions,
 * signaux de bluff et niveau recommandé. Décision argumentée.
 */

import {
  buildInterviewReport,
  type AnsweredTurn,
  type InterviewReport,
  type HiringDecision,
} from "./interview-report";
import {
  buildCredibilityScore,
  type CredibilityScore,
  type BluffSignals,
} from "./bluff-detector";
import type { AnswerSignals } from "./answer-signals";
import type { Contradiction } from "./candidate-facts";
import type { Seniority } from "./candidate-profile";

export interface RecruiterReport {
  hireDecision: HiringDecision;
  confidenceLevel: number; // 0–100
  report: InterviewReport;
  credibility: CredibilityScore;
  strengths: string[];
  weaknesses: string[];
  contradictions: string[];
  bluffSignals: string[];
  recommendedLevel: Seniority;
  justification: string;
}

export interface BuildRecruiterReportInput {
  answered: AnsweredTurn[];
  signalsList: AnswerSignals[];
  bluffList: BluffSignals[];
  contradictions: Contradiction[];
}

export function buildRecruiterReport(
  input: BuildRecruiterReportInput,
): RecruiterReport {
  const report = buildInterviewReport(input.answered);
  const credibility = buildCredibilityScore(
    input.signalsList,
    input.bluffList,
    input.contradictions.length,
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (report.technicalDepth >= 65) strengths.push("Bonne profondeur technique.");
  if (report.communication >= 65) strengths.push("Communication claire.");
  if (credibility.evidence >= 65) strengths.push("Réponses appuyées par des exemples.");
  if (report.leadership >= 60) strengths.push("Sens des responsabilités (ownership).");

  if (report.technicalDepth < 50) weaknesses.push("Profondeur technique à renforcer.");
  if (credibility.specificity < 50) weaknesses.push("Réponses trop générales / peu précises.");
  if (credibility.consistency < 50) weaknesses.push("Cohérence à confirmer.");
  if (strengths.length === 0) strengths.push("Potentiel à confirmer avec plus d'exemples.");

  const contradictions = input.contradictions.map((c) => c.message);
  const bluffSignals: string[] = [];
  const avgBluff =
    input.bluffList.length > 0
      ? input.bluffList.reduce((a, b) => a + b.bluffProbability, 0) / input.bluffList.length
      : 0;
  if (avgBluff >= 0.5) bluffSignals.push("Forte densité de buzzwords sans exemples concrets.");
  else if (avgBluff >= 0.3) bluffSignals.push("Quelques réponses superficielles à approfondir.");

  // Décision : pondère le rapport global ET la crédibilité.
  const blended = Math.round(report.overall * 0.6 + credibility.overall * 0.4);
  let hireDecision: HiringDecision;
  if (blended >= 80) hireDecision = "strong_hire";
  else if (blended >= 65) hireDecision = "hire";
  else if (blended >= 50) hireDecision = "mixed";
  else if (blended >= 35) hireDecision = "weak";
  else hireDecision = "reject";

  // Pénalité forte si contradictions ou bluff élevé.
  if (input.contradictions.length >= 2 || avgBluff >= 0.6) {
    hireDecision = downgrade(hireDecision);
  }

  const recommendedLevel: Seniority =
    report.technicalDepth >= 70 && credibility.overall >= 65
      ? "senior"
      : report.technicalDepth >= 45
        ? "mid"
        : "junior";

  return {
    hireDecision,
    confidenceLevel: credibility.overall,
    report,
    credibility,
    strengths,
    weaknesses,
    contradictions,
    bluffSignals,
    recommendedLevel,
    justification: justify(hireDecision, input.contradictions.length, bluffSignals.length),
  };
}

function downgrade(d: HiringDecision): HiringDecision {
  const order: HiringDecision[] = ["strong_hire", "hire", "mixed", "weak", "reject"];
  const i = order.indexOf(d);
  return order[Math.min(order.length - 1, i + 1)] ?? "weak";
}

function justify(d: HiringDecision, contradictions: number, bluff: number): string {
  const base =
    d === "strong_hire" ? "Avis très favorable."
      : d === "hire" ? "Avis favorable."
        : d === "mixed" ? "Avis mitigé : zones à approfondir."
          : d === "weak" ? "Avis réservé."
            : "Avis défavorable en l'état.";
  const flags: string[] = [];
  if (contradictions > 0) flags.push(`${contradictions} incohérence(s) CV ↔ réponses`);
  if (bluff > 0) flags.push("signaux de superficialité");
  return flags.length > 0 ? `${base} À noter : ${flags.join(", ")}.` : base;
}
