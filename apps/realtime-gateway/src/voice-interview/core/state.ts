// @ts-nocheck
/**
 * core/state.ts â€” Ã‰tat logique d'un entretien vocal (P3.1).
 *
 * PURE : aucune dÃ©pendance infra (pas de rÃ©seau, pas de DB, pas d'horloge mutable
 * cachÃ©e). Tout est dÃ©terministe et testable. C'est le cÅ“ur du "Voice Interview Brain".
 */

import type { PressureMunition } from "../../../../lib/ats/contracts/munitions.js";

export type InterviewPhase = "intro" | "deep" | "pressure" | "wrap";

/** Style de l'interviewer (P3.5) : influe sur questions + feedback, pas le moteur. */
export type InterviewerStyle = "supportive" | "neutral" | "challenging";

export interface InterviewState {
  /** Manque principal visÃ© (issu de l'analyse P1/P2). */
  jobGap: string;
  /** Sujet/compÃ©tence en cours d'exploration. */
  currentTopic: string;
  /** Questions dÃ©jÃ  posÃ©es (anti-rÃ©pÃ©tition). */
  askedQuestions: string[];
  /** Signaux de score accumulÃ©s (0â€“100 par rÃ©ponse Ã©valuÃ©e). */
  scoreSignals: number[];
  /** Phase courante de l'entretien. */
  phase: InterviewPhase;
  /** Style du recruteur simulÃ© (P3.5). */
  interviewerStyle: InterviewerStyle;
  /** ATS munition tracking */
  munitions: PressureMunition[];
  munitionsUsage: Record<string, MunitionUsage>;
  /** ID de la munition actuellement explorÃ©e (si applicable) */
  currentMunitionId?: string;
}

export interface MunitionUsage {
  firstUsedAtTurn: number;
  attempts: number;
  lastResponse: "engaged" | "deflected" | "silence" | null;
}

export interface CreateStateInput {
  jobGap?: string;
  initialTopic?: string;
  interviewerStyle?: InterviewerStyle;
  munitions?: PressureMunition[];
}

/** CrÃ©e un Ã©tat initial valide et dÃ©terministe. */
export function createInitialState(input: CreateStateInput = {}): InterviewState {
  const jobGap = (input.jobGap ?? "").trim();
  return {
    jobGap,
    currentTopic: (input.initialTopic ?? jobGap ?? "").trim() || "parcours",
    askedQuestions: [],
    scoreSignals: [],
    phase: "intro",
    interviewerStyle: input.interviewerStyle ?? "neutral",
    munitions: input.munitions ?? [],
    munitionsUsage: {},
  };
}

/** Ordre canonique des phases. */
const PHASE_ORDER: InterviewPhase[] = ["intro", "deep", "pressure", "wrap"];

/** Phase suivante dans l'ordre canonique (wrap est terminal). */
export function nextPhase(phase: InterviewPhase): InterviewPhase {
  const i = PHASE_ORDER.indexOf(phase);
  if (i < 0 || i >= PHASE_ORDER.length - 1) return "wrap";
  return PHASE_ORDER[i + 1] as InterviewPhase;
}

/** Moyenne des signaux de score (0 si aucun). */
export function averageScore(state: InterviewState): number {
  if (state.scoreSignals.length === 0) return 0;
  const sum = state.scoreSignals.reduce((a, b) => a + b, 0);
  return Math.round(sum / state.scoreSignals.length);
}

/**
 * Applique un patch immuable Ã  l'Ã©tat (retourne un NOUVEL objet).
 * Garantit l'absence de mutation cachÃ©e â€” clÃ© pour la testabilitÃ©.
 */
export function applyPatch(state: InterviewState, patch: Partial<InterviewState>, ): InterviewState {
  return {
    ...state,
    ...patch,
    askedQuestions: patch.askedQuestions ?? [...state.askedQuestions],
    scoreSignals: patch.scoreSignals ?? [...(state.scoreSignals || [])],
    munitions: patch.munitions ?? [...(state.munitions || [])],
    munitionsUsage: patch.munitionsUsage ?? { ...(state.munitionsUsage || {}) },
  };
}

/** Nombre de tours d'entretien rÃ©alisÃ©s (= questions posÃ©es). */
export function turnCount(state: InterviewState): number {
  return state.askedQuestions.length;
}

/** L'entretien est-il terminÃ© ? */
export function isFinished(state: InterviewState): boolean {
  return state.phase === "wrap";
}
