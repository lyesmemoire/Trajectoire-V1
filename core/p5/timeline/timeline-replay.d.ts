import { MindState } from "../execution-contract.js";
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
export declare function replayTimeline(snapshot: _MindSnapshot, timeline: Timeline): MindState;
//# sourceMappingURL=timeline-replay.d.ts.map