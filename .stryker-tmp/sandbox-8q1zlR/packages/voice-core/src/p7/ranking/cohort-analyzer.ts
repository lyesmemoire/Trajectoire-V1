// @ts-nocheck
import { CohortStats, CohortLabel } from "./ranking-contract.js";

/**
 * Computes cohort-level statistics from a set of raw scores.
 *
 * Pure function — deterministic on any permutation of the input array.
 */
export function computeCohortStats(scores: number[]): CohortStats {
  if (scores.length === 0) {
    return { mean: 0, stdDev: 0, min: 0, max: 0 };
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    min,
    max,
  };
}

/**
 * Labels a cohort based on its statistical distribution.
 *
 * Rules (fixed, deterministic):
 * - stdDev < 5    → "low_variance_cohort"
 * - max - min > 80 → "high_dispersion_cohort"
 * - otherwise     → "normal_cohort"
 */
export function labelCohort(stats: CohortStats): CohortLabel {
  if (stats.stdDev < 5) return "low_variance_cohort";
  if (stats.max - stats.min > 80) return "high_dispersion_cohort";
  return "normal_cohort";
}
