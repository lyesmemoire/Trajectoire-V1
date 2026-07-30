import { NormalizedScore } from "./ranking-contract.js";

/**
 * Deterministic z-score normalizer.
 *
 * Formula: clamp(((score - mean) / stdDev) * 15 + 50, 0, 100)
 *
 * The factor 15 is a fixed architectural constant (versioned implicitly).
 * This ensures scores cluster around 50 with a spread of ~15 points per σ.
 *
 * Pure function — no Date.now(), no Math.random(), no side effects.
 */
const Z_SCALE_FACTOR = 15;
const Z_CENTER = 50;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function normalizeScores(candidates: { candidateId: string; rawScore: number }[], mean: number, stdDev: number, ): NormalizedScore[] {
  // Sort by rawScore descending for percentile calculation (stable)
  const sorted = [...candidates].sort((a, b) => {
    if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
    return a.candidateId.localeCompare(b.candidateId); // deterministic tie-break
  });

  return sorted.map((c, index) => {
    const zScore = stdDev === 0
      ? 0
      : (c.rawScore - mean) / stdDev;

    const normalizedScore = clamp(zScore * Z_SCALE_FACTOR + Z_CENTER, 0, 100);
    const percentile = sorted.length <= 1
      ? 1
      : 1 - index / (sorted.length - 1);

    return {
      candidateId: c.candidateId,
      rawScore: c.rawScore,
      normalizedScore: Math.round(normalizedScore * 100) / 100,
      percentile: Math.round(percentile * 1000) / 1000,
    };
  });
}
