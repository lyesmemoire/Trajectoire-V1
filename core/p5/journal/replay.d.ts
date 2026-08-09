import { MindState } from "../execution-contract.js";
import { EventJournal } from "./journal-contract.js";
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
export declare function replay(snapshot: _MindSnapshot, journal: EventJournal): MindState;
//# sourceMappingURL=replay.d.ts.map