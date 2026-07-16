// @ts-nocheck
// src/replay/buildDiffContext.ts

import { diffTraces, type TickDiff } from "./diffTrace";
import { replayTrace } from "./ReplayTrace";
import type { TickTrace } from "@common/trace";

export type DiffContext = {
  diffs: TickDiff[];
  totalOldEvents: number;
};

export function buildDiffContext(
  oldTrace: TickTrace[],
  newTrace: TickTrace[]
): DiffContext {
  const diffs = diffTraces(oldTrace, newTrace);

  const oldGrouped = replayTrace(oldTrace);

  let totalOldEvents = 0;
  for (const bucket of Object.values(oldGrouped)) {
    totalOldEvents += bucket.events.length;
  }

  return { diffs, totalOldEvents };
}
