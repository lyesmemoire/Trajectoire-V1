import { Transaction } from "./transaction-contract.js";
/**
 * Begins a new transaction by capturing a snapshot of the current state.
 *
 * The timestamp is injected to keep this function pure (no Date.now()).
 * The transaction starts with an empty event list.
 *
 * Pure function — no side effects.
 */
export declare function beginTransaction(state: _MindState, timestamp: number): Transaction;
//# sourceMappingURL=begin-transaction.d.ts.map