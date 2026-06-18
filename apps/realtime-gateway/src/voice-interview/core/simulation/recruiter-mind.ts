/**
 * core/simulation/recruiter-mind.ts — Recruiter Mind Model (P3.11). PURE.
 *
 * Vue mentale UNIFIÉE et cohérente du recruteur, DÉRIVÉE des sous-états de
 * simulation (pressure/memory/hidden-eval/persona). Les modules P3.8 restent la
 * source de vérité ; ce module fournit une lecture d'agent cohérent + des
 * mutateurs sémantiques + une dérivation de persona depuis l'état mental.
 *
 * Iso-comportement : n'altère aucun module existant. Couche additive.
 */

import type { SimulationState } from "./simulation-state.js";
import type { ReactiveMode } from "./persona-reactivity.js";

export type RecruiterEmotion =
  | "calm"
  | "neutral"
  | "annoyed"
  | "curious"
  | "impressed"
  | "suspicious";

export interface RecruiterMindState {
  emotion: RecruiterEmotion;
  trust: number; // 0–1
  suspicion: number; // 0–1
  engagement: number; // 0–1
  pressure: number; // 0–1
  fatigue: number; // 0–1
  confidenceInCandidate: number; // -1 → 1
  momentum: number; // -1 → 1 (tendance dynamique)
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Dérive l'état mental unifié depuis l'état de simulation.
 * Mapping déterministe (voir spec P3.11).
 */
export function deriveRecruiterMind(sim: SimulationState): RecruiterMindState {
  const h = sim.hiddenEval;
  const p = sim.pressure;

  const pressure = clamp(p.level / 100, 0, 1);
  // suspicion : bluff + pression élevée.
  const suspicion = clamp(h.bluffScore / 100 + (pressure > 0.8 ? 0.2 : 0), 0, 1);
  // trust : cohérence, érodée par la suspicion.
  const trust = clamp(h.coherenceScore / 100 - suspicion * 0.5, 0, 1);
  // engagement : monte avec la pression modérée + stabilité, baisse si fatigue.
  const fatigue = clamp(sim.turn * 0.06, 0, 1);
  const engagement = clamp(
    0.4 + h.stabilityScore / 200 + (pressure > 0.3 && pressure < 0.8 ? 0.2 : 0) - fatigue * 0.3,
    0,
    1,
  );
  // confiance dans le candidat : -1..1, basée sur stabilité - bluff.
  const confidenceInCandidate = clamp(
    (h.stabilityScore - h.bluffScore) / 100,
    -1,
    1,
  );
  // momentum : croissance implicite (growth) recentrée autour de 0.
  const momentum = clamp((h.growthScore - 50) / 50, -1, 1);

  return {
    emotion: deriveEmotion({ trust, suspicion, engagement, pressure, confidenceInCandidate }),
    trust,
    suspicion,
    engagement,
    pressure,
    fatigue,
    confidenceInCandidate,
    momentum,
  };
}

function deriveEmotion(s: {
  trust: number;
  suspicion: number;
  engagement: number;
  pressure: number;
  confidenceInCandidate: number;
}): RecruiterEmotion {
  if (s.suspicion >= 0.5) return "suspicious";
  if (s.pressure >= 0.8) return "annoyed";
  if (s.confidenceInCandidate >= 0.5 && s.trust >= 0.6) return "impressed";
  if (s.engagement >= 0.6) return "curious";
  if (s.pressure < 0.3 && s.suspicion < 0.3) return "calm";
  return "neutral";
}

/**
 * Dérive le mode de persona depuis l'état mental (P3.11 : MindState pilote persona).
 * Additif : ne modifie pas persona-reactivity, propose une lecture cohérente.
 */
export function personaFromMind(mind: RecruiterMindState): ReactiveMode {
  if (mind.suspicion >= 0.5) return "AGGRESSIVE";
  if (mind.confidenceInCandidate >= 0.5) return mind.trust >= 0.7 ? "CTO" : "TECH";
  if (mind.confidenceInCandidate < 0 || mind.engagement < 0.4) return "MENTOR";
  return "RH";
}

/** Résumé lisible de l'état mental (debug / rapport). */
export function describeMind(mind: RecruiterMindState): string {
  return (
    `Humeur: ${mind.emotion} · confiance candidat: ${mind.confidenceInCandidate.toFixed(2)} · ` +
    `trust: ${mind.trust.toFixed(2)} · suspicion: ${mind.suspicion.toFixed(2)} · ` +
    `engagement: ${mind.engagement.toFixed(2)} · pression: ${mind.pressure.toFixed(2)} · ` +
    `fatigue: ${mind.fatigue.toFixed(2)} · momentum: ${mind.momentum.toFixed(2)}`
  );
}
