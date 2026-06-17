/**
 * governor/composition-rules.ts — Règles de composition UX (P4.1). PURE.
 *
 * Empêche les combinaisons UX absurdes (agressif + empathique, interruption +
 * silence long…) et impose la cohérence persona. Système de CONTRAINTES, pas
 * de comportement : on corrige une UX, on n'en invente pas.
 */

import type { PerceptionUX } from "../perception-ux";
import type { ReactiveMode } from "../persona-reactivity";

export interface CompositionContext {
  ux: PerceptionUX;
  personaMode: ReactiveMode;
}

export interface UXRule {
  name: string;
  priority: number;
  /** Applique une correction si nécessaire ; retourne l'UX (éventuellement modifiée). */
  apply: (ctx: CompositionContext) => PerceptionUX;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Règles ordonnées par priorité (plus haute = appliquée en dernier). */
export const COMPOSITION_RULES: UXRule[] = [
  {
    name: "calm_no_aggression",
    priority: 10,
    apply: ({ ux }) => {
      if (ux.emotion === "calm" || ux.emotion === "impressed") {
        return {
          ...ux,
          interruptionChance: Math.min(ux.interruptionChance, 0.1),
          toneShift: Math.min(ux.toneShift, 0.2),
        };
      }
      return ux;
    },
  },
  {
    name: "rh_persona_gentle",
    priority: 20,
    apply: ({ ux, personaMode }) => {
      if (personaMode === "RH" || personaMode === "MENTOR") {
        return {
          ...ux,
          interruptionChance: Math.min(ux.interruptionChance, 0.15),
          toneShift: clamp(ux.toneShift, -1, 0.3),
        };
      }
      return ux;
    },
  },
  {
    name: "no_interrupt_and_long_silence",
    priority: 30,
    apply: ({ ux }) => {
      // Contradiction : on ne peut pas à la fois beaucoup interrompre ET
      // beaucoup laisser de silence. On garde le signal dominant.
      if (ux.interruptionChance > 0.2 && ux.silenceProbability > 0.3) {
        return ux.interruptionChance >= ux.silenceProbability
          ? { ...ux, silenceProbability: 0.15 }
          : { ...ux, interruptionChance: 0.1 };
      }
      return ux;
    },
  },
];

/** Applique toutes les règles dans l'ordre de priorité. */
export function applyCompositionRules(
  ux: PerceptionUX,
  personaMode: ReactiveMode,
): PerceptionUX {
  const ordered = [...COMPOSITION_RULES].sort((a, b) => a.priority - b.priority);
  let out = ux;
  for (const rule of ordered) {
    out = rule.apply({ ux: out, personaMode });
  }
  return out;
}
