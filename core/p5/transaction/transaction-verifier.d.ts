import { MindState } from "../execution-contract.js";
/**
 * Verifies that a committed state matches what a replay of the
 * transaction would produce.
 *
 * This proves X5: a committed transaction is replay-compatible.
 *
 * Pure function — no side effects.
 */
export interface TransactionVerification {
    readonly valid: boolean;
    readonly diff: string[];
}
export declare function verifyTransaction(tx: _Transaction, committedState: MindState): TransactionVerification;
//# sourceMappingURL=transaction-verifier.d.ts.map