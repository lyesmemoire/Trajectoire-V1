import type { DriftCluster } from "./types";

/**
 * Compute a numeric distance score from a set of drift clusters.
 *
 * The score is a simple weighted sum of each cluster's severity.
 * Severity is already the weight * count (see clustering implementation).
 * This function is pure and does not affect CI pass/fail logic – it merely
 * provides an interpretable "how far" metric for downstream reporting.
 */
export function computeDistance(clusters: DriftCluster[]): {
  total: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};
  let total = 0;
  for (const c of clusters) {
    // Aggregate by cluster type
    breakdown[c.type] = (breakdown[c.type] ?? 0) + c.severity;
    total += c.severity;
  }
  return { total, breakdown };
}
