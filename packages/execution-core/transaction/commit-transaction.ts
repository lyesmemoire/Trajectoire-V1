import { applyEvents } from "../execution-engine.js";
import { restoreSnapshot } from "../snapshot/restore-snapshot.js";
import { CommitResult, Transaction } from "./transaction-contract.js";

/**
 * Commits a transaction: applies ALL pending events atomically.
 *
 * Guarantees:
 * - X1: All events applied or none (atomic Ã¢â‚¬â€ since this is synchronous and pure,
 *        either the function returns the full result or throws).
 * - X3: Same transaction Ã¢â€ â€™ same result (deterministic).
 * - X4: The original transaction object is never mutated.
 *
 * Pure function Ã¢â‚¬â€ no side effects.
 */
export function commitTransaction(tx: Transaction): CommitResult {
  const initial = restoreSnapshot(tx.snapshot);
  const finalState = applyEvents(initial, tx.events);

  return {
    state: finalState,
    appliedCount: tx.events.length,
  };
}
