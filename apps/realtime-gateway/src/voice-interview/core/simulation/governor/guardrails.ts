/**
 * governor/guardrails.ts — Garde-fous globaux durs (P4.1). PURE, déterministe.
 *
 * Maintient l'UX dans le cadre « humain plausible » : bornes dures + limite de
 * variation par tour (anti-saut) + pas de deux extrêmes consécutifs.
 */

import type { PerceptionUX } from "../perception-ux.js";

export interface GlobalUXGuardrails {
  maxSilence: number;
  maxInterruption: number;
  maxToneShiftPerTurn: number;
  maxEmotionDelta: number; // variation max de toneShift entre 2 tours
  minStabilityWindow: number; // nb de tours « doux » imposés après un extrême
}

export const DEFAULT_GUARDRAILS: GlobalUXGuardrails = {
  maxSilence: 0.6,
  maxInterruption: 0.35,
  maxToneShiftPerTurn: 0.25,
  maxEmotionDelta: 0.3,
  minStabilityWindow: 3,
};

export interface GuardrailState {
  /** Tours restants avant de pouvoir rejouer un extrême. */
  cooldown: number;
  lastToneShift: number;
}

export function createGuardrailState(): GuardrailState {
  return { cooldown: 0, lastToneShift: 0 };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function isExtreme(ux: PerceptionUX, g: GlobalUXGuardrails): boolean {
  return (
    ux.interruptionChance >= g.maxInterruption - 0.05 ||
    ux.silenceProbability >= g.maxSilence - 0.1 ||
    Math.abs(ux.toneShift) >= 0.8
  );
}

/**
 * Applique les garde-fous : bornes dures, limite de delta de ton, anti deux
 * extrêmes consécutifs. Retourne l'UX corrigée + le nouvel état.
 */
export function applyGuardrails(ux: PerceptionUX, state: GuardrailState, g: GlobalUXGuardrails = DEFAULT_GUARDRAILS, ): { ux: PerceptionUX; state: GuardrailState } {
  // 1) Bornes dures.
  let out: PerceptionUX = {
    ...ux,
    silenceProbability: clamp(ux.silenceProbability, 0, g.maxSilence),
    interruptionChance: clamp(ux.interruptionChance, 0, g.maxInterruption),
  };

  // 2) Limite de variation de ton entre tours (anti-saut émotionnel).
  const delta = out.toneShift - state.lastToneShift;
  if (Math.abs(delta) > g.maxEmotionDelta) {
    const capped = state.lastToneShift + Math.sign(delta) * g.maxEmotionDelta;
    out = { ...out, toneShift: clamp(capped, -1, 1) };
  }

  // 3) Anti deux extrêmes consécutifs : si en cooldown, on adoucit.
  let cooldown = state.cooldown;
  if (cooldown > 0) {
    out = {
      ...out,
      interruptionChance: Math.min(out.interruptionChance, 0.1),
      silenceProbability: Math.min(out.silenceProbability, 0.25),
      toneShift: clamp(out.toneShift, -0.5, 0.5),
    };
    cooldown -= 1;
  } else if (isExtreme(out, g)) {
    // On vient de jouer un extrême -> fenêtre de stabilité imposée ensuite.
    cooldown = g.minStabilityWindow;
  }

  return { ux: out, state: { cooldown, lastToneShift: out.toneShift } };
}
