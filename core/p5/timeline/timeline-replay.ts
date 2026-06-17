import { MindState } from "../execution-contract";
import { reduceMind } from "../reduceMind";
import { MindSnapshot } from "../snapshot/snapshot-contract";
import { restoreSnapshot } from "../snapshot/restore-snapshot";
import { Timeline } from "./timeline-contract";

/**
 * Replays a timeline from a snapshot, producing the final MindState.
 *
 * Equivalent to:
 *   timeline.entries.reduce((s, e) => reduceMind(s, e.event), restoreSnapshot(snapshot))
 *
 * Guarantees:
 * - T3: Deterministic — two identical replays produce deepEqual results.
 * - T5: Causal order preserved — events applied in tick order.
 * - Pure function — no RNG, no Clock, no I/O.
 */
export function replayTimeline(snapshot: MindSnapshot, timeline: Timeline): MindState {
  const initial = restoreSnapshot(snapshot);

  return timeline.entries.reduce(
    (state, entry) => reduceMind(state, entry.event),
    initial,
  );
}
