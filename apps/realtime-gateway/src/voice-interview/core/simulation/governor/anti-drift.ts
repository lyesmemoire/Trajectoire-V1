/**
 * governor/anti-drift.ts — Anti-dérive par attracteurs (P4.1). PURE.
 *
 * Force le système à revenir vers des zones stables (attracteurs) et pénalise
 * les oscillations rapides (mémoire des derniers états UX).
 */

import type { PerceptionUX } from "../perception-ux.js";
import type { RecruiterEmotion } from "../recruiter-mind.js";

/** Cibles stables vers lesquelles le système est attiré, par émotion dominante. */
interface Attractor {
  toneShift: number;
  questionSharpness: number;
  silenceProbability: number;
  interruptionChance: number;
}

const ATTRACTORS: Record<RecruiterEmotion, Attractor> = {
  calm: { toneShift: -0.1, questionSharpness: 0.2, silenceProbability: 0.05, interruptionChance: 0.02 },
  neutral: { toneShift: 0, questionSharpness: 0.35, silenceProbability: 0.1, interruptionChance: 0.05 },
  curious: { toneShift: -0.05, questionSharpness: 0.4, silenceProbability: 0.1, interruptionChance: 0.05 },
  impressed: { toneShift: -0.2, questionSharpness: 0.3, silenceProbability: 0.05, interruptionChance: 0.02 },
  annoyed: { toneShift: 0.5, questionSharpness: 0.7, silenceProbability: 0.2, interruptionChance: 0.2 },
  suspicious: { toneShift: 0.5, questionSharpness: 0.75, silenceProbability: 0.3, interruptionChance: 0.15 },
};

export interface AntiDriftState {
  /** Historique des 3 derniers toneShift (détection d'oscillation). */
  recentTone: number[];
}

export function createAntiDriftState(): AntiDriftState {
  return { recentTone: [] };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Détecte une oscillation rapide (alternance signe sur 3 valeurs). */
function isOscillating(tones: number[]): boolean {
  if (tones.length < 3) return false;
  const [a, b, c] = tones.slice(-3);
  const d1 = (b ?? 0) - (a ?? 0);
  const d2 = (c ?? 0) - (b ?? 0);
  return Math.sign(d1) !== 0 && Math.sign(d2) !== 0 && Math.sign(d1) !== Math.sign(d2);
}

/**
 * Tire l'UX vers l'attracteur de l'émotion courante quand la dérive est forte,
 * et amortit si oscillation détectée. Déterministe.
 */
export function applyAntiDrift(ux: PerceptionUX, state: AntiDriftState, ): { ux: PerceptionUX; state: AntiDriftState } {
  const attractor = ATTRACTORS[ux.emotion] ?? ATTRACTORS.neutral;

  // Distance à l'attracteur (sur le ton, dimension la plus visible).
  const drift = Math.abs(ux.toneShift - attractor.toneShift);
  // Plus la dérive est grande, plus on rapproche (convergence progressive).
  const pull = drift > 0.4 ? 0.4 : 0.15;

  let out: PerceptionUX = {
    ...ux,
    toneShift: clamp(lerp(ux.toneShift, attractor.toneShift, pull), -1, 1),
    questionSharpness: clamp(lerp(ux.questionSharpness, attractor.questionSharpness, pull * 0.5), 0, 1),
    silenceProbability: clamp(lerp(ux.silenceProbability, attractor.silenceProbability, pull * 0.5), 0, 1),
    interruptionChance: clamp(lerp(ux.interruptionChance, attractor.interruptionChance, pull * 0.5), 0, 1),
  };

  const recentTone = [...state.recentTone, out.toneShift].slice(-3);
  // Amortissement si oscillation rapide.
  if (isOscillating(recentTone)) {
    const avg = recentTone.reduce((a, b) => a + b, 0) / recentTone.length;
    out = { ...out, toneShift: clamp(lerp(out.toneShift, avg, 0.5), -1, 1) };
  }

  return { ux: out, state: { recentTone } };
}
