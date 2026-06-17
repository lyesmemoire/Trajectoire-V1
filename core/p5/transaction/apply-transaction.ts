import { P5Event } from "../execution-contract";
import { Transaction } from "./transaction-contract";

/**
 * Adds an event to a pending transaction, returning a new transaction.
 *
 * Guarantees:
 * - X4: The original transaction is never mutated.
 * - Events accumulate in order for atomic commit.
 *
 * Pure function — no side effects.
 */
export function applyTransaction(tx: Transaction, event: P5Event): Transaction {
  return {
    snapshot: tx.snapshot,
    events: [...tx.events, event],
  };
}
