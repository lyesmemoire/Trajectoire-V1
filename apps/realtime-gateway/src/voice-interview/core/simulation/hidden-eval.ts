/**
 * core/simulation/hidden-eval.ts — Évaluation invisible (P3.8). PURE, déterministe.
 *
 * Jugement interne NON exposé au frontend. Influence difficulté, pression,
 * persona et rapport final.
 */

export interface HiddenEval {
  coherenceScore: number; // 0–100
  bluffScore: number; // 0–100
  stabilityScore: number; // 0–100
  growthScore: number; // 0–100
}

export function createHiddenEval(): HiddenEval {
  return { coherenceScore: 70, bluffScore: 0, stabilityScore: 50, growthScore: 50 };
}

export interface HiddenSignal {
  contradiction?: boolean;
  bluff?: boolean;
  strongStructuredAnswer?: boolean;
  /** Le score progresse-t-il vs le tour précédent ? */
  progression?: boolean;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n));
}

export function updateHiddenEval(state: HiddenEval, signal: HiddenSignal, ): HiddenEval {
  let { coherenceScore, bluffScore, stabilityScore, growthScore } = state;
  if (signal.contradiction) coherenceScore -= 15;
  if (signal.bluff) bluffScore += 20;
  if (signal.strongStructuredAnswer) stabilityScore += 12;
  if (signal.progression) growthScore += 10;
  else growthScore -= 3;

  return {
    coherenceScore: clamp(coherenceScore),
    bluffScore: clamp(bluffScore),
    stabilityScore: clamp(stabilityScore),
    growthScore: clamp(growthScore),
  };
}
