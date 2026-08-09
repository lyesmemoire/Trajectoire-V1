import { reduceMind } from "../reduceMind.js";
import { restoreSnapshot } from "../snapshot/restore-snapshot.js";
/**
 * Replays a journal from a snapshot, producing the final MindState.
 *
 * Equivalent to:
 *   journal.entries.reduce((s, e) => reduceMind(s, e.event), restoreSnapshot(snapshot))
 *
 * Guarantees:
 * - J3: Replay produces the exact same state as original execution.
 * - J4: Two identical replays produce deepEqual results.
 * - Pure function — no RNG, no Clock, no I/O.
 */
export function replay(snapshot, journal) {
    const initial = restoreSnapshot(snapshot);
    return journal.entries.reduce((state, entry) => reduceMind(state, entry.event), initial);
}
//# sourceMappingURL=replay.js.map