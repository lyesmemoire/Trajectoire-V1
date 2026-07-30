import { CommitResult } from "./transaction-contract.js";
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
export declare function commitTransaction(_tx: _Transaction): CommitResult;
//# sourceMappingURL=commit-transaction.d.ts.map