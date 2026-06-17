// src/replay/ReplayPipeline.ts

import type { TickTrace } from "@common/trace";
import { replayTrace } from "./ReplayTrace";
import { diffTraces } from "./diffTrace";
import { makeFingerprint } from "./fingerprint";
import { assertTimelineShape } from "./contracts";
import { computeDriftVector } from "./driftVector";
import { buildDiffContext } from "./buildDiffContext";

export type ReplayPipelineResult = {
  oldTimeline: ReturnType<typeof replayTrace>;
  newTimeline: ReturnType<typeof replayTrace>;
  diffs: ReturnType<typeof diffTraces>;
  fingerprint: ReturnType<typeof makeFingerprint>;
  driftVector: ReturnType<typeof computeDriftVector>;
};

/**
 * Deterministic full replay pipeline:
 * trace → grouped → diff → fingerprint → drift vector
 */
export function runReplayPipeline(
  oldTrace: TickTrace[],
  newTrace: TickTrace[]
): ReplayPipelineResult {
  const oldTimeline = replayTrace(oldTrace);
  const newTimeline = replayTrace(newTrace);

  // runtime safety gate (CI-critical)
  assertTimelineShape(oldTimeline);
  assertTimelineShape(newTimeline);

  const diffs = diffTraces(oldTrace, newTrace);

  // Build context containing diffs and total old events (single source of truth)
  const { totalOldEvents } = buildDiffContext(oldTrace, newTrace);

  const fingerprint = makeFingerprint(diffs, totalOldEvents);

  const driftVector = computeDriftVector(diffs, totalOldEvents);

  return {
    oldTimeline,
    newTimeline,
    diffs,
    fingerprint,
    driftVector,
  };
}
