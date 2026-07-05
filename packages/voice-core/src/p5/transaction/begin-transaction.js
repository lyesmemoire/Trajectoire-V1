import { createSnapshot } from "../snapshot/create-snapshot.js";
/**
 * Begins a new transaction by capturing a snapshot of the current state.
 *
 * The timestamp is injected to keep this function pure (no Date.now()).
 * The transaction starts with an empty event list.
 *
 * Pure function — no side effects.
 */
export function beginTransaction(state, timestamp) {
    return {
        snapshot: createSnapshot(state, timestamp),
        events: [],
    };
}
//# sourceMappingURL=begin-transaction.js.map