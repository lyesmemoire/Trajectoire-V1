/**
 * core/v2/interview-plan-builder.ts — Plan d'entretien réaliste (P3.6, Bloc 1+3+8). PURE.
 *
 * Construit une trame ordonnée (phases) adaptée au profil + persona, puis le
 * moteur de flux la parcourt dynamiquement (avec retours arrière possibles).
 */

import type { CandidateProfile } from "./candidate-profile";
import type { InterviewerPersona } from "./personas";
import type { QuestionCategory } from "./question-bank";

export type V2Phase =
  | "warmup"
  | "exploration"
  | "technical"
  | "challenge"
  | "pressure"
  | "closing";

export const V2_PHASE_ORDER: V2Phase[] = [
  "warmup",
  "exploration",
  "technical",
  "challenge",
  "pressure",
  "closing",
];

/** Catégories de questions privilégiées par phase. */
export const PHASE_CATEGORIES: Record<V2Phase, QuestionCategory[]> = {
  warmup: ["introduction", "culture"],
  exploration: ["experience", "behavioral"],
  technical: ["technical"],
  challenge: ["gap", "behavioral"],
  pressure: ["pressure"],
  closing: ["closing"],
};

export interface InterviewPlan {
  phases: V2Phase[];
  /** Nombre de questions cible par phase (ajusté au persona). */
  questionsPerPhase: Record<V2Phase, number>;
  focusSkills: string[];
  focusGaps: string[];
}

export function buildInterviewPlan(
  profile: CandidateProfile,
  persona: InterviewerPersona,
): InterviewPlan {
  // Plus le persona est technique, plus on charge la phase technique.
  const techQ = Math.max(1, Math.round(persona.technicalFocus / 2)); // 1–3
  // Plus le persona met de pression, plus la phase pressure est étoffée.
  const pressureQ = persona.pressureLevel >= 4 ? 2 : 1;

  return {
    phases: [...V2_PHASE_ORDER],
    questionsPerPhase: {
      warmup: 1,
      exploration: 2,
      technical: techQ,
      challenge: profile.gaps.length > 0 ? 2 : 1,
      pressure: pressureQ,
      closing: 1,
    },
    focusSkills: profile.technicalSkills.slice(0, 5),
    focusGaps: profile.gaps.slice(0, 5),
  };
}

/** Phase suivante (closing terminal). */
export function nextV2Phase(phase: V2Phase): V2Phase {
  const i = V2_PHASE_ORDER.indexOf(phase);
  if (i < 0 || i >= V2_PHASE_ORDER.length - 1) return "closing";
  return V2_PHASE_ORDER[i + 1] as V2Phase;
}
