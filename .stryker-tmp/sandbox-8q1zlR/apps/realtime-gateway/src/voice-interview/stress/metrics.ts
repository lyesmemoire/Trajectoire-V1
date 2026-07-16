/**
 * stress/metrics.ts — Métriques formelles de stabilité (P4.3). PURES.
 *
 * Définit mathématiquement ce que « stable » signifie pour ce système agentique.
 * Calculées sur une TRAJECTOIRE (suite d'états Mind + UX sur les tours).
 *
 *  1. Bornage           : tous les champs ∈ leurs bornes (0 violation = dur).
 *  2. Drift             : pente de régression linéaire sur la 2e moitié.
 *  3. Oscillation       : moyenne de |Δ| tour-à-tour (énergie de saccade).
 *  4. Enveloppe         : variance fin vs variance début (convergence).
 *  5. Path dependency   : distance entre trajectoires de seeds adjacents.
 */
// @ts-nocheck

import type { RecruiterMindState } from "../core/simulation/recruiter-mind.js";
import type { PerceptionUX } from "../core/simulation/perception-ux.js";

export interface TrajectoryPoint {
  mind: RecruiterMindState;
  ux: PerceptionUX;
}
export type Trajectory = TrajectoryPoint[];

/** Pente de régression linéaire (moindres carrés) d'une série y[t], t=0..n-1. */
export function linearSlope(ys: number[]): number {
  const n = ys.length;
  if (n < 2) return 0;
  const meanX = (n - 1) / 2;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - meanX) * (ys[i]! - meanY);
    den += (i - meanX) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

export function variance(ys: number[]): number {
  const n = ys.length;
  if (n < 2) return 0;
  const mean = ys.reduce((a, b) => a + b, 0) / n;
  return ys.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
}

function field(traj: Trajectory, sel: (p: TrajectoryPoint) => number): number[] {
  return traj.map(sel);
}

/** Énergie d'oscillation : moyenne de |Δ| tour-à-tour d'une série. */
export function oscillationEnergy(ys: number[]): number {
  if (ys.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < ys.length; i++) sum += Math.abs(ys[i]! - ys[i - 1]!);
  return sum / (ys.length - 1);
}

export interface TrajectoryMetrics {
  turns: number;
  /** 2. Drift sur la 2e moitié (pente) par champ Mind clé. */
  driftSuspicion: number;
  driftPressure: number;
  driftTrust: number;
  /** 3. Oscillation UX (énergie de saccade). */
  oscToneShift: number;
  oscInterruption: number;
  oscSilence: number;
  /** 4. Enveloppe : variance fin / variance début (ratio ; <=k = convergent). */
  envelopeRatioSuspicion: number;
  /** Émotion finale (pour distribution). */
  finalEmotion: RecruiterMindState["emotion"];
}

/** Calcule les métriques d'une trajectoire. */
export function computeTrajectoryMetrics(traj: Trajectory): TrajectoryMetrics {
  const n = traj.length;
  const half = Math.floor(n / 2);
  const secondHalf = traj.slice(half);

  const susp = field(traj, (p) => p.mind.suspicion);
  const firstQ = susp.slice(0, Math.max(2, Math.floor(n / 3)));
  const lastQ = susp.slice(-Math.max(2, Math.floor(n / 3)));
  const vStart = variance(firstQ);
  const vEnd = variance(lastQ);

  return {
    turns: n,
    driftSuspicion: linearSlope(field(secondHalf, (p) => p.mind.suspicion)),
    driftPressure: linearSlope(field(secondHalf, (p) => p.mind.pressure)),
    driftTrust: linearSlope(field(secondHalf, (p) => p.mind.trust)),
    oscToneShift: oscillationEnergy(field(traj, (p) => p.ux.toneShift)),
    oscInterruption: oscillationEnergy(field(traj, (p) => p.ux.interruptionChance)),
    oscSilence: oscillationEnergy(field(traj, (p) => p.ux.silenceProbability)),
    envelopeRatioSuspicion: vStart === 0 ? (vEnd === 0 ? 1 : Infinity) : vEnd / vStart,
    finalEmotion: traj[n - 1]?.mind.emotion ?? "neutral",
  };
}

/** 5. Distance L1 moyenne entre deux trajectoires (champs Mind), tour à tour. */
export function trajectoryDistance(a: Trajectory, b: Trajectory): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const ma = a[i]!.mind;
    const mb = b[i]!.mind;
    sum +=
      Math.abs(ma.suspicion - mb.suspicion) +
      Math.abs(ma.trust - mb.trust) +
      Math.abs(ma.pressure - mb.pressure) +
      Math.abs(ma.engagement - mb.engagement);
  }
  return sum / n;
}

/** Seuils de stabilité (ce que « stable » veut dire, explicitement). */
export const STABILITY_THRESHOLDS = {
  maxAbsDrift: 0.05,        // pente quasi nulle = pas de divergence monotone
  maxOscToneShift: 0.25,    // = maxToneShiftPerTurn du governor
  maxOscInterruption: 0.25,
  maxOscSilence: 0.25,
  maxEnvelopeRatio: 3.0,    // la dispersion ne doit pas exploser
  maxPathDistance: 0.6,     // seeds adjacents : trajectoires cohérentes (pas chaos)
} as const;
