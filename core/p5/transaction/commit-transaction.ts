import { applyEvents } from "../execution-engine";
import { restoreSnapshot } from "../snapshot/restore-snapshot";
import { Transaction, CommitResult } from "./transaction-contract";

/**
 * Commits a transaction: applies ALL pending events atomically.
 *
 * Guarantees:
 * - X1: All events applied or none (atomic — since this is synchronous and pure,
 *        either the function returns the full result or throws).
 * - X3: Same transaction → same result (deterministic).
 * - X4: The original transaction object is never mutated.
 *
 * Pure function — no side effects.
 */
export function commitTransaction(tx: Transaction): CommitResult {
  const initial = restoreSnapshot(tx.snapshot);
  const finalState = applyEvents(initial, tx.events);

  return {
    state: finalState,
    appliedCount: tx.events.length,
  };
}
