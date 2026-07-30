/**
 * core/state.ts — État logique d'un entretien vocal (P3.1).
 *
 * PURE : aucune dépendance infra (pas de réseau, pas de DB, pas d'horloge mutable
 * cachée). Tout est déterministe et testable. C'est le cœur du "Voice Interview Brain".
 */

import type { PressureMunition } from "../../../../lib/ats/contracts/munitions.js";

export type InterviewPhase = "intro" | "deep" | "pressure" | "wrap";

/** Style de l'interviewer (P3.5) : influe sur questions + feedback, pas le moteur. */
export type InterviewerStyle = "supportive" | "neutral" | "challenging";

export interface InterviewState {
  /** Manque principal visé (issu de l'analyse P1/P2). */
  jobGap: string;
  /** Sujet/compétence en cours d'exploration. */
  currentTopic: string;
  /** Questions déjà posées (anti-répétition). */
  askedQuestions: string[];
  /** Signaux de score accumulés (0–100 par réponse évaluée). */
  scoreSignals: number[];
  /** Phase courante de l'entretien. */
  phase: InterviewPhase;
  /** Style du recruteur simulé (P3.5). */
  interviewerStyle: InterviewerStyle;
  /** ATS munition tracking */
  munitions: PressureMunition[];
  munitionsUsage: Record<string, MunitionUsage>;
  /** ID de la munition actuellement explorée (si applicable) */
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

/** Crée un état initial valide et déterministe. */
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
 * Applique un patch immuable à l'état (retourne un NOUVEL objet).
 * Garantit l'absence de mutation cachée — clé pour la testabilité.
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

/** Nombre de tours d'entretien réalisés (= questions posées). */
export function turnCount(state: InterviewState): number {
  return state.askedQuestions.length;
}

/** L'entretien est-il terminé ? */
export function isFinished(state: InterviewState): boolean {
  return state.phase === "wrap";
}
