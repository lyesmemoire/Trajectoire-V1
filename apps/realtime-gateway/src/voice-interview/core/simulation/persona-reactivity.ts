/**
 * core/simulation/persona-reactivity.ts — Recruteur adaptatif (P3.8). PURE, déterministe.
 *
 * Le recruteur change de personnalité en live selon le comportement du candidat
 * (déduit de l'évaluation invisible).
 */

import type { HiddenEval } from "./hidden-eval.js";

export type ReactiveMode = "RH" | "TECH" | "CTO" | "AGGRESSIVE" | "MENTOR";

export interface ReactivePersona {
  mode: ReactiveMode;
  aggression: number; // 0–1
  curiosity: number; // 0–1
  patience: number; // 0–1
}

export function createReactivePersona(): ReactivePersona {
  return { mode: "RH", aggression: 0.2, curiosity: 0.6, patience: 0.7 };
}

export interface ReactivitySignal {
  bluff?: boolean;
  weakAnswer?: boolean;
  strongTechnical?: boolean;
  contradiction?: boolean;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Détermine le mode + les traits selon les signaux ET l'évaluation invisible.
 * Priorité : contradiction/bluff (agressif) > technique fort > réponses faibles.
 */
export function updatePersona(state: ReactivePersona, signal: ReactivitySignal, hidden: HiddenEval, ): ReactivePersona {
  let mode: ReactiveMode = state.mode;
  let aggression = state.aggression;
  let curiosity = state.curiosity;
  let patience = state.patience;

  if (signal.contradiction || (signal.bluff && hidden.bluffScore >= 40)) {
    mode = "AGGRESSIVE";
    aggression = clamp01(aggression + 0.3);
    patience = clamp01(patience - 0.3);
  } else if (signal.strongTechnical && hidden.stabilityScore >= 55) {
    mode = hidden.stabilityScore >= 75 ? "CTO" : "TECH";
    curiosity = clamp01(curiosity + 0.2);
    aggression = clamp01(aggression - 0.1);
  } else if (signal.weakAnswer) {
    mode = hidden.growthScore >= 50 ? "MENTOR" : "RH";
    patience = clamp01(patience + 0.1);
    aggression = clamp01(aggression - 0.1);
  }

  return { mode, aggression, curiosity, patience };
}
