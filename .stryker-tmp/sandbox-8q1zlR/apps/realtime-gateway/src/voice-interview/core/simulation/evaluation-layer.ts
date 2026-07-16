/**
 * core/simulation/evaluation-layer.ts — Couche ÉVALUATION (refactor P3.7).
 *
 * Regroupe les évaluations : score STAR de base (V1), rapport multidimensionnel,
 * recommandation, crédibilité et rapport recruteur final.
 * (Les scores "invisibles" arriveront en P3.8 dans cette même couche.)
 *
 * FAÇADE iso-comportement : réexporte la logique existante, sans la modifier.
 */
// @ts-nocheck


export { evaluateTranscript, type AnswerEvaluation } from "../evaluation.js";

export {
  buildInterviewReport,
  buildHiringRecommendation,
  type InterviewReport,
  type HiringRecommendation,
  type HiringDecision,
  type AnsweredTurn,
} from "../v2/interview-report.js";

export {
  buildRecruiterReport,
  type RecruiterReport,
  type BuildRecruiterReportInput,
} from "../v2/recruiter-report.js";

export { buildCredibilityScore, type CredibilityScore } from "../v2/bluff-detector.js";
