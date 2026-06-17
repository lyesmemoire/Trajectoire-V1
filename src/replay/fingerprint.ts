// WARNING: CI-critical module
// This file MUST remain a pure function of (diffs, totalOldEvents)
// Do not import replayTrace, grouped timelines, or pipeline logic

// src/replay/fingerprint.ts
import type { TickDiff } from "./diffTrace";

/**
 * Deterministic fingerprint summarising structural differences between two traces.
 * All calculations operate on the provided diffs and the total number of old events.
 */
export type DiffFingerprint = {
  /** All tick IDs where any difference was observed (sorted ascending). */
  changedTicks: number[];
  /** Number of ticks where the leader differs between the two runs. */
  leaderChanges: number;
  /** Proportion of event‑count drift, rounded to 4 decimal places.
   *  Computed as Σ|newCount‑oldCount| / totalOldEvents.
   */
  eventDrift: number;
};

/**
 * Build a fingerprint from the diff results.
 *
 * @param diffs            Array of TickDiff objects produced by `diffTraces`.
 * @param totalOldEvents   Total number of events in the old trace (for normalization).
 */
export function makeFingerprint(
  diffs: TickDiff[],
  totalOldEvents: number
): DiffFingerprint {
  const changed = new Set<number>();
  let leaderChanges = 0;
  let eventDriftSum = 0;

  for (const d of diffs) {
    // Any structural diff, missing tick, or leader change marks the tick as changed.
    if (d.leaderChange || d.eventCountChange || d.missing) {
      changed.add(d.tickId);
    }
    if (d.leaderChange) {
      leaderChanges += 1;
    }
    if (d.eventCountChange) {
      const { old: oldCount, new: newCount } = d.eventCountChange;
      eventDriftSum += Math.abs(newCount - oldCount);
    }
  }

  const rawDrift = totalOldEvents > 0 ? eventDriftSum / totalOldEvents : 0;
  const eventDrift = Number(rawDrift.toFixed(4));

  const changedTicks = Array.from(changed).sort((a, b) => a - b);

  return { changedTicks, leaderChanges, eventDrift };
}
