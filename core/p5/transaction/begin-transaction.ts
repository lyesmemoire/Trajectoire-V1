import { MindState } from "../execution-contract";
import { createSnapshot } from "../snapshot/create-snapshot";
import { Transaction } from "./transaction-contract";

/**
 * Begins a new transaction by capturing a snapshot of the current state.
 *
 * The timestamp is injected to keep this function pure (no Date.now()).
 * The transaction starts with an empty event list.
 *
 * Pure function — no side effects.
 */
export function beginTransaction(state: MindState, timestamp: number): Transaction {
  return {
    snapshot: createSnapshot(state, timestamp),
    events: [],
  };
}
