import { MindState } from "../execution-contract";
import { applyEvents } from "../execution-engine";
import { restoreSnapshot } from "../snapshot/restore-snapshot";
import { Transaction } from "./transaction-contract";

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

export function verifyTransaction(
  tx: Transaction,
  committedState: MindState,
): TransactionVerification {
  const replayed = applyEvents(restoreSnapshot(tx.snapshot), tx.events);
  const diff: string[] = [];

  if (replayed.trust !== committedState.trust) diff.push("trust");
  if (replayed.suspicion !== committedState.suspicion) diff.push("suspicion");
  if (replayed.pressure !== committedState.pressure) diff.push("pressure");
  if (replayed.emotion !== committedState.emotion) diff.push("emotion");

  return { valid: diff.length === 0, diff };
}
