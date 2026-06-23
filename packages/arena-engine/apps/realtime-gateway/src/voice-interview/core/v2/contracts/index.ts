/**
 * core/v2/contracts — Barrière de dépendances de V2 (Step A, pré-P4).
 *
 * V2 ne doit dépendre QUE de ce barrel, qui réexporte les modules de décision
 * (tous dans core/v2/*) + l'évaluation STAR partagée (core/evaluation).
 *
 * INVARIANT : ce fichier n'importe RIEN de core/simulation/ (pas de pression,
 * mémoire, persona-reactivity, mind, pipeline…). Il coupe définitivement le
 * glissement de frontière où V2 passait par `simulation/index`.
 *
 * Iso-comportement : ce sont exactement les mêmes implémentations, importées
 * depuis leur source réelle (pas de logique réécrite).
 */

// ── Cerveau recruteur (personnalité + stratégie de questions) ──────────
export {
  getPersona,
  applyTone,
  PERSONAS,
  type InterviewerPersona,
  type PersonaName,
} from "../personas.js";
export {
  buildInterviewPlan,
  nextV2Phase,
  V2_PHASE_ORDER,
  PHASE_CATEGORIES,
  type InterviewPlan,
  type V2Phase,
} from "../interview-plan-builder.js";
export {
  QUESTION_BANK,
  QUESTION_BANK_VERSION,
  byCategory,
  renderQuestion,
  type Question,
  type QuestionCategory,
  type Difficulty,
} from "../question-bank.js";
export { pickTrapQuestion, trapSkills } from "../trap-question-engine.js";

// ── Perception (signaux / contradictions / bluff) ──────────────────────
export { extractSignals, type AnswerSignals } from "../answer-signals.js";
export {
  extractCandidateFacts,
  detectContradiction,
  type CandidateFacts,
  type Contradiction,
} from "../candidate-facts.js";
export { detectBluff, type BluffSignals } from "../bluff-detector.js";

// ── Adaptatif (difficulté) ─────────────────────────────────────────────
export { adaptDifficulty } from "../difficulty-adapter.js";

// ── Évaluation (STAR partagée V1 + rapports V2) ────────────────────────
export { evaluateTranscript, type AnswerEvaluation } from "../../evaluation.js";
export {
  buildInterviewReport,
  buildHiringRecommendation,
  type InterviewReport,
  type HiringRecommendation,
  type HiringDecision,
  type AnsweredTurn,
} from "../interview-report.js";
export {
  buildRecruiterReport,
  type RecruiterReport,
  type BuildRecruiterReportInput,
} from "../recruiter-report.js";
