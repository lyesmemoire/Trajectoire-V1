// @ts-nocheck
import type { TickTrace } from "@common/trace";

export type TickBucket = {
  tickId: number;
  events: TickTrace[];
};

export type ReplayTimeline = Record<number, TickBucket>;

/**
 * Canonical representation of drift between two traces.
 * All higher‑level layers (fingerprint, clustering, scoring) are pure projections of this vector.
 */
export type DriftVector = {
  // Aggregated counts
  leaderChanges: number;
  eventInflation: number;
  eventRegression: number;
  missingTicks: number;
  // Raw sums needed for fingerprint calculation (event count absolute differences)
  eventDriftSum: number;
  totalOldEvents: number;

  // Per‑tick detail arrays (deterministic ordering)
  ticks: {
    changed: number[];
    leaderChange: number[];
    eventInflation: number[];
    eventRegression: number[];
    missing: number[];
  };
};

/** Drift cluster used for UI reporting */
export type DriftCluster = {
  type: "leader_drift" | "event_inflation" | "event_regression" | "missing_tick";
  ticks: number[];
  severity: number;
  count: number;
};

/** Result of the scoring / distance engine */
export type ScoringResult = {
  totalDistance: number;
  bestMatch: string;
  threshold: number;
  passed: boolean;
  breakdown: { type: string; weight: number; distance: number }[];
};

export type GoldenFingerprint = {
  changedTicks: number[];
  leaderChanges: number;
  eventDrift: number;
};

export type GoldenThresholds = {
  leaderChanges: number;
  eventDrift: number;
  ticksAdded?: number;
  ticksRemoved?: number;
};

export type GoldenSpec = {
  name: string;
  fingerprint: GoldenFingerprint;
  thresholds: GoldenThresholds;
};
