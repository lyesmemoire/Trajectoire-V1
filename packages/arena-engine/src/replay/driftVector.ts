// src/replay/driftVector.ts
import type { TickDiff } from "./diffTrace";
import type { DriftVector } from "./types";

/**
 * Compute a deterministic DriftVector from diffs and total old events.
 * The vector aggregates counts and per‑tick detail arrays.
 */
export function computeDriftVector(
  diffs: TickDiff[],
  totalOldEvents: number
): DriftVector {
  const uniqueTicks = new Set<number>();
  let leaderChanges = 0;
  let eventInflation = 0;
  let eventRegression = 0;
  let missingTicks = 0;
  let eventDriftSum = 0;

  const leaderChangeTicks: number[] = [];
  const eventInflationTicks: number[] = [];
  const eventRegressionTicks: number[] = [];
  const missingTickIds: number[] = [];

  for (const d of diffs) {
    uniqueTicks.add(d.tickId);
    if (d.leaderChange) {
      leaderChanges++;
      leaderChangeTicks.push(d.tickId);
    }
    if (d.eventCountChange) {
      const { old: oldCount, new: newCount } = d.eventCountChange;
      const diff = Math.abs(newCount - oldCount);
      eventDriftSum += diff;
      if (newCount > oldCount) {
        eventInflation++;
        eventInflationTicks.push(d.tickId);
      } else if (newCount < oldCount) {
        eventRegression++;
        eventRegressionTicks.push(d.tickId);
      }
    }
    if (d.missing) {
      missingTicks++;
      missingTickIds.push(d.tickId);
    }
  }

  const changedTickIds = Array.from(uniqueTicks).sort((a, b) => a - b);

  return {
    leaderChanges,
    eventInflation,
    eventRegression,
    missingTicks,
    eventDriftSum,
    totalOldEvents,
    ticks: {
      changed: changedTickIds,
      leaderChange: leaderChangeTicks.sort((a, b) => a - b),
      eventInflation: eventInflationTicks.sort((a, b) => a - b),
      eventRegression: eventRegressionTicks.sort((a, b) => a - b),
      missing: missingTickIds.sort((a, b) => a - b),
    },
  };
}
