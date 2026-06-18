import { MindState } from "../execution-contract.js";
import { restoreSnapshot } from "../snapshot/restore-snapshot.js";
import { Transaction } from "./transaction-contract.js";

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
