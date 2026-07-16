// @ts-nocheck
// src/replay/goldenCompare.ts

import type { GoldenFingerprint, GoldenThresholds } from "./types";

/**
 * Result of comparing an actual fingerprint against an expected (golden) fingerprint.
 * Only leaderChanges and eventDrift are enforced as CI‑blocking violations. changedTicks
 * is reported for information but does not affect the `passed` flag (v1 policy).
 */
export type GoldenComparisonResult = {
  passed: boolean;
  violations: {
    metric: "leaderChanges" | "eventDrift" | "changedTicks";
    actual: number;
    expected: number;
    threshold: number;
  }[];
  // Informational metrics (not used for CI decisions)
  info?: {
    changedTicksCount: number;
    expectedChangedTicksCount: number;
  };
};

/**
 * Pure function that compares an actual fingerprint to an expected golden fingerprint
 * using the supplied thresholds (defaults merged elsewhere). It returns a deterministic
 * result without any side‑effects.
 */
export function compareFingerprints(
  actual: GoldenFingerprint,
  expected: GoldenFingerprint,
  thresholds: GoldenThresholds
): GoldenComparisonResult {
  const violations: GoldenComparisonResult["violations"] = [];

  // leaderChanges – CI‑blocking when actual exceeds threshold
  if (actual.leaderChanges > thresholds.leaderChanges) {
    violations.push({
      metric: "leaderChanges",
      actual: actual.leaderChanges,
      expected: expected.leaderChanges,
      threshold: thresholds.leaderChanges,
    });
  }

  // eventDrift – CI‑blocking when actual exceeds threshold
  if (actual.eventDrift > thresholds.eventDrift) {
    violations.push({
      metric: "eventDrift",
      actual: actual.eventDrift,
      expected: expected.eventDrift,
      threshold: thresholds.eventDrift,
    });
  }

  // changedTicks – informational only (do not cause failure)
  const changedTicksCount = actual.changedTicks.length;
  const expectedCount = expected.changedTicks.length;
  const info = {
    changedTicksCount,
    expectedChangedTicksCount: expectedCount,
  };
  // Optionally record a violation for visibility, but do NOT affect `passed`
  if (changedTicksCount !== expectedCount) {
    violations.push({
      metric: "changedTicks",
      actual: changedTicksCount,
      expected: expectedCount,
      // threshold is the expected count for reference; not used for CI gating
      threshold: expectedCount,
    });
  }

  // `passed` is true only when there are no leaderChanges or eventDrift violations.
  // changedTicks violations are ignored for CI, but they remain in the list for reporting.
  const passed = violations.filter(v => v.metric !== "changedTicks").length === 0;

  return {
    passed,
    violations,
    info,
  };
}
