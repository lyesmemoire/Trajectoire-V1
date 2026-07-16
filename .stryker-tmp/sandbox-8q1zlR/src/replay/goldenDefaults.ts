// @ts-nocheck
// src/replay/goldenDefaults.ts

import type { GoldenThresholds } from "./types";

/**
 * Default thresholds applied to all golden specs unless overridden.
 */
export const DEFAULT_GOLDEN_THRESHOLDS: GoldenThresholds = {
  leaderChanges: 0,
  eventDrift: 0.1,
  ticksAdded: 0,
  ticksRemoved: 0,
} as const;
