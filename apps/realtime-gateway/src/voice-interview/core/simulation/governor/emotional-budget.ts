/**
 * governor/emotional-budget.ts — Budget émotionnel (P4.1). PURE, déterministe.
 *
 * Chaque session a un budget total ; les effets UX forts le consomment.
 * Empêche le « recruteur psycho instable » : on ne peut pas enchaîner les
 * effets extrêmes. Régénération lente (fatigue système).
 */

export interface EmotionalBudget {
  total: number;
  spent: number;
  channels: {
    tension: number;
    empathy: number;
    dominance: number;
    unpredictability: number;
  };
}

export function createEmotionalBudget(total = 100): EmotionalBudget {
  return {
    total,
    spent: 0,
    channels: { tension: 0, empathy: 0, dominance: 0, unpredictability: 0 },
  };
}

/** Coût estimé d'un ensemble de paramètres UX pour un tour. */
export interface UXCostInput {
  interruption: number; // 0–1
  silence: number; // 0–1
  toneShift: number; // -1..1
  sharpness: number; // 0–1
}

export function costOf(ux: UXCostInput): number {
  // Interruption = coût élevé ; silence = moyen ; ton agressif = continu.
  const interruptionCost = ux.interruption * 18;
  const silenceCost = ux.silence * 10;
  const toneCost = Math.max(0, ux.toneShift) * 3;
  const sharpCost = ux.sharpness * 2;
  return interruptionCost + silenceCost + toneCost + sharpCost;
}

/** Budget restant (0 si épuisé). */
export function remaining(b: EmotionalBudget): number {
  return Math.max(0, b.total - b.spent);
}

/**
 * Applique un tour : consomme le coût, régénère lentement, met à jour les canaux.
 * Déterministe. Le `scale` (0–1) renvoyé indique combien on peut se permettre
 * d'effet ce tour (1 = plein, <1 = on doit atténuer).
 */
export function spendBudget(
  b: EmotionalBudget,
  cost: number,
  ux: UXCostInput,
): { budget: EmotionalBudget; scale: number } {
  const REGEN = 6; // régénération par tour
  const avail = remaining(b) + REGEN;
  const scale = cost <= 0 ? 1 : Math.max(0, Math.min(1, avail / cost));

  const effectiveCost = cost * scale;
  const spent = Math.max(0, Math.min(b.total, b.spent - REGEN + effectiveCost));

  return {
    budget: {
      total: b.total,
      spent,
      channels: {
        tension: clamp01(b.channels.tension * 0.8 + Math.max(0, ux.toneShift) * 0.2),
        empathy: clamp01(b.channels.empathy * 0.8 + Math.max(0, -ux.toneShift) * 0.2),
        dominance: clamp01(b.channels.dominance * 0.8 + ux.interruption * 0.2),
        unpredictability: clamp01(b.channels.unpredictability * 0.8 + ux.silence * 0.2),
      },
    },
    scale,
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
