/**
 * Adds an event to a pending transaction, returning a new transaction.
 *
 * Guarantees:
 * - X4: The original transaction is never mutated.
 * - Events accumulate in order for atomic commit.
 *
 * Pure function — no side effects.
 */
// @ts-nocheck

export function applyTransaction(tx, event) {
    return {
        snapshot: tx.snapshot,
        events: [...tx.events, event],
    };
}
//# sourceMappingURL=apply-transaction.js.map