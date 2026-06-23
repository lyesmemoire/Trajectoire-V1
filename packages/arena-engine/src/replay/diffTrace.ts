// src/replay/diffTrace.ts

// INVARIANT: This module must remain pure and deterministic.
// It MUST NOT access grouped timelines, replay structures, or perform any aggregation.
// The sole responsibility is to produce a sorted TickDiff[] from two traces.

// 🟢 Truth Layer – immutable core
// Guard: This function is the SINGLE source of ordering for TickDiff[]
// All downstream code must treat the returned array as already sorted.

import type { TickTrace } from "@common/trace";
import { replayTrace } from "./ReplayTrace";

export type TickDiff = {
  tickId: number;
  leaderChange?: { old: string; new: string };
  eventCountChange?: { old: number; new: number };
  missing?: "old" | "new";
};

/**
 * Pure deterministic diff between two traces.
 * Returns an array of TickDiff objects sorted by tickId.
 */
export function diffTraces(
  oldTrace: TickTrace[],
  newTrace: TickTrace[]
): TickDiff[] {
  const oldMap = replayTrace(oldTrace);
  const newMap = replayTrace(newTrace);

  // Build set of all tick IDs across both traces
  const allTicks = new Set<number>([
    ...Object.keys(oldMap).map(Number),
    ...Object.keys(newMap).map(Number),
  ]);

  const sorted = Array.from(allTicks).sort((a: number, b: number) => a - b);

  const diffs: TickDiff[] = [];

  for (const tickId of sorted) {
    const oldBucket = oldMap[tickId];
    const newBucket = newMap[tickId];

    if (!oldBucket) {
      diffs.push({ tickId, missing: "old" });
      continue;
    }

    if (!newBucket) {
      diffs.push({ tickId, missing: "new" });
      continue;
    }

    const oldLeaders = oldBucket.events
      .filter((e: TickTrace) => e.isLeader)
      .sort((a: TickTrace, b: TickTrace) => a.nodeId.localeCompare(b.nodeId));
    const oldLeader = oldLeaders[0] ?? null;
    const newLeaders = newBucket.events
      .filter((e: TickTrace) => e.isLeader)
      .sort((a: TickTrace, b: TickTrace) => a.nodeId.localeCompare(b.nodeId));
    const newLeader = newLeaders[0] ?? null;

    const diff: TickDiff = { tickId };

    if (oldLeader?.nodeId !== newLeader?.nodeId) {
      diff.leaderChange = {
        old: oldLeader?.nodeId ?? "NONE",
        new: newLeader?.nodeId ?? "NONE",
      };
    }

    if (oldBucket.events.length !== newBucket.events.length) {
      diff.eventCountChange = {
        old: oldBucket.events.length,
        new: newBucket.events.length,
      };
    }

    diffs.push(diff);
  }

  return diffs;
}
