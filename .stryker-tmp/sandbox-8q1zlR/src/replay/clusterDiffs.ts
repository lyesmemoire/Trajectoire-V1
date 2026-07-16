// @ts-nocheck
// src/replay/clusterDiffs.ts

import type { TickDiff } from "./diffTrace";

/**
 * Drift cluster categories used for human‑readable interpretation of diff results.
 */
export type DriftCluster = {
  /**
   * One of the deterministic cluster types.
   */
  type: "leader_drift" | "event_inflation" | "event_regression" | "missing_tick";
  /**
   * Sorted list of tick IDs that belong to this cluster.
   */
  ticks: number[];
  /**
   * Severity weight (sum of per‑tick weights).
   */
  severity: number;
  /**
   * Number of ticks in the cluster.
   */
  count: number;
};

/**
 * Fixed severity weights for each cluster type.
 */
const WEIGHTS: Record<DriftCluster["type"], number> = {
  leader_drift: 3,
  event_inflation: 1,
  event_regression: 1,
  missing_tick: 5,
};

/**
 * Deterministic clustering of TickDiffs into high‑level buckets.
 *
 * The function is pure – it never mutates its input and does not influence
 * any CI pass/fail decision. It only provides a view‑layer for report
 * generation.
 */
export function clusterDiffs(diffs: TickDiff[]): DriftCluster[] {
  // Collect raw tick IDs per category.
  const buckets: Record<DriftCluster["type"], Set<number>> = {
    leader_drift: new Set<number>(),
    event_inflation: new Set<number>(),
    event_regression: new Set<number>(),
    missing_tick: new Set<number>(),
  };

  for (const d of diffs) {
    const tick = d.tickId;
    if (d.leaderChange !== undefined) {
      buckets.leader_drift.add(tick);
    }
    if (d.eventCountChange !== undefined) {
      const { old, new: n } = d.eventCountChange;
      if (n > old) buckets.event_inflation.add(tick);
      else if (n < old) buckets.event_regression.add(tick);
    }
    if (d.missing !== undefined) {
      buckets.missing_tick.add(tick);
    }
  }

  // Transform each bucket into a DriftCluster with deterministic ordering.
  const typePriority: DriftCluster["type"][] = [
    "leader_drift",
    "event_inflation",
    "event_regression",
    "missing_tick",
  ];

  const clusters: DriftCluster[] = [];
  for (const type of typePriority) {
    const tickSet = buckets[type];
    if (tickSet.size === 0) continue;
    const ticks = Array.from(tickSet).sort((a, b) => a - b);
    const count = ticks.length;
    const severity = count * WEIGHTS[type];
    clusters.push({ type, ticks, severity, count });
  }

  // Final deterministic ordering: severity desc, then type priority, then min tick.
  clusters.sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity;
    const priA = typePriority.indexOf(a.type);
    const priB = typePriority.indexOf(b.type);
    if (priA !== priB) return priA - priB;
    return (a.ticks[0] ?? 0) - (b.ticks[0] ?? 0);
  });

  return clusters;
}
