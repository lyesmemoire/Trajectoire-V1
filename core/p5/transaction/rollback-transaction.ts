import { MindState } from "../execution-contract";
import { restoreSnapshot } from "../snapshot/restore-snapshot";
import { Transaction } from "./transaction-contract";

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
export function rollbackTransaction(tx: Transaction): MindState {
  return restoreSnapshot(tx.snapshot);
}
