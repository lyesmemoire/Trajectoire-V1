import { restoreSnapshot } from "../snapshot/restore-snapshot.js";
/**
 * Rolls back a transaction: discards all pending events and restores
 * the original state from the snapshot.
 *
 * Guarantees:
 * - X2: rollback returns the exact initial state captured at begin.
 * - X4: The transaction object is never mutated.
 *
 * Pure function — no side effects.
 */
export function rollbackTransaction(tx) {
    return restoreSnapshot(tx.snapshot);
}
//# sourceMappingURL=rollback-transaction.js.map