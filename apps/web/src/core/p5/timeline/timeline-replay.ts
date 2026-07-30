

import { MindState } from "../execution-contract.js";
import { reduceMind } from "../reduceMind.js";
import { restoreSnapshot } from "../snapshot/restore-snapshot.js";
import { MindSnapshot } from "../snapshot/snapshot-contract.js";
import { Timeline } from "./timeline-contract.js";

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
