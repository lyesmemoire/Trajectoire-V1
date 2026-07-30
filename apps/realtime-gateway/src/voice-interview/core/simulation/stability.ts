/**
 * core/simulation/stability.ts — Invariants de stabilité comportementale (Step B, pré-P4).
 *
 * Vérifie la STABILITÉ du personnage (pas la logique métier) : bornes, absence
 * d'amplification infinie, oscillation contrôlée. Utilisable en tests ET en
 * runtime comme garde-fou (assertStable) avant d'ajouter P4 (temps humain).
 *
 * PURE, déterministe.
 */

import type { SimulationState } from "./simulation-state.js";
import type { RecruiterMindState } from "./recruiter-mind.js";

export interface StabilityViolation {
  invariant: string;
  detail: string;
}

function inRange(n: number, lo: number, hi: number): boolean {
  return Number.isFinite(n) && n >= lo && n <= hi;
}

/** Vérifie qu'un MindState respecte toutes les bornes (0–1 / -1–1). */
export function checkMindBounds(mind: RecruiterMindState): StabilityViolation[] {
  const v: StabilityViolation[] = [];
  const unit: Array<[string, number]> = [
    ["trust", mind.trust],
    ["suspicion", mind.suspicion],
    ["engagement", mind.engagement],
    ["pressure", mind.pressure],
    ["fatigue", mind.fatigue],
  ];
  for (const [name, val] of unit) {
    if (!inRange(val, 0, 1)) v.push({ invariant: `${name}_bounds`, detail: `${name}=${val}` });
  }
  if (!inRange(mind.confidenceInCandidate, -1, 1))
    v.push({ invariant: "confidence_bounds", detail: `${mind.confidenceInCandidate}` });
  if (!inRange(mind.momentum, -1, 1))
    v.push({ invariant: "momentum_bounds", detail: `${mind.momentum}` });
  return v;
}

/** Vérifie que l'état de simulation reste borné (pas de NaN / dérive). */
export function checkSimulationBounds(sim: SimulationState): StabilityViolation[] {
  const v: StabilityViolation[] = [];
  if (!inRange(sim.pressure.level, 0, 100))
    v.push({ invariant: "pressure_level_bounds", detail: `${sim.pressure.level}` });
  if (!inRange(sim.pressure.aggressiveness, 0, 1))
    v.push({ invariant: "aggressiveness_bounds", detail: `${sim.pressure.aggressiveness}` });
  for (const k of ["coherenceScore", "bluffScore", "stabilityScore", "growthScore"] as const) {
    if (!inRange(sim.hiddenEval[k], 0, 100))
      v.push({ invariant: `hidden_${k}_bounds`, detail: `${sim.hiddenEval[k]}` });
  }
  return v;
}

/**
 * Vérifie l'absence d'amplification monotone non bornée sur une trajectoire :
 * la pression ne doit pas croître strictement à chaque tour indéfiniment
 * (un système stable a une borne supérieure — ici 100 — et peut redescendre).
 */
export function checkBoundedOscillation(pressureLevels: number[], ): StabilityViolation[] {
  const v: StabilityViolation[] = [];
  for (const lvl of pressureLevels) {
    if (!inRange(lvl, 0, 100)) {
      v.push({ invariant: "pressure_runaway", detail: `level out of bounds: ${lvl}` });
      break;
    }
  }
  return v;
}

/** True si l'état complet est stable (aucune violation). */
export function isStable(sim: SimulationState, mind: RecruiterMindState, ): boolean {
  return (
    checkSimulationBounds(sim).length === 0 && checkMindBounds(mind).length === 0
  );
}

/** Garde-fou runtime : lève si l'état est instable (à activer en dev/staging). */
export function assertStable(sim: SimulationState, mind: RecruiterMindState, ): void {
  const violations = [...checkSimulationBounds(sim), ...checkMindBounds(mind)];
  if (violations.length > 0) {
    throw new Error(
      `Stability violation: ${violations.map((x) => x.invariant).join(", ")}`,
    );
  }
}
