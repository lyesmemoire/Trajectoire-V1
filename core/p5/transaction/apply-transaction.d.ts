import { P5Event } from "../execution-contract.js";
import { Transaction } from "./transaction-contract.js";
/**
 * Adds an event to a pending transaction, returning a new transaction.
 *
 * Guarantees:
 * - X4: The original transaction is never mutated.
 * - Events accumulate in order for atomic commit.
 *
 * Pure function — no side effects.
 */
export declare function applyTransaction(_tx: Transaction, _event: P5Event): Transaction;
//# sourceMappingURL=apply-transaction.d.ts.map