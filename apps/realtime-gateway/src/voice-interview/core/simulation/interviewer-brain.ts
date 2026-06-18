/**
 * core/simulation/interviewer-brain.ts — Couche CERVEAU RECRUTEUR (refactor P3.7).
 *
 * Regroupe la "personnalité" et la stratégie de questionnement :
 *  - personas (RH / Tech Lead / Eng Manager / CTO / founder…)
 *  - banque de questions + rendu
 *  - parcours métier (role tracks)
 *  - plan d'entretien (phases)
 *
 * FAÇADE iso-comportement : réexporte la logique existante, sans la modifier.
 *
 * ⚠️ FAÇADE UNIQUEMENT — Ne jamais importer depuis ce fichier
 *    dans les modules sous-jacents (risque d'import circulaire).
 */

export {
  getPersona,
  applyTone,
  PERSONAS,
  type InterviewerPersona,
  type PersonaName,
} from "../v2/personas.js";

export {
  QUESTION_BANK,
  QUESTION_BANK_VERSION,
  byCategory,
  renderQuestion,
  type Question,
  type QuestionCategory,
  type Difficulty,
} from "../v2/question-bank.js";

export {
  ROLE_TRACKS,
  inferRoleTrack,
  getRoleTrack,
  type RoleTrack,
  type RoleTrackName,
} from "../v2/role-tracks.js";

export {
  buildInterviewPlan,
  nextV2Phase,
  V2_PHASE_ORDER,
  PHASE_CATEGORIES,
  type InterviewPlan,
  type V2Phase,
} from "../v2/interview-plan-builder.js";

export {
  pickTrapQuestion,
  trapSkills,
} from "../v2/trap-question-engine.js";
