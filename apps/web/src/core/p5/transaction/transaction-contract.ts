

import { P5Event } from "../execution-contract.js";
import { MindSnapshot } from "../snapshot/snapshot-contract.js";



/**
 * A pending transaction: a snapshot of the state before the transaction
 * began, plus the ordered list of events to apply atomically.
 *
 * Either ALL events are applied (commit) or NONE are (rollback).
 */
export interface Transaction {
  readonly snapshot: MindSnapshot;
  readonly events: readonly P5Event[];
}

/**
 * Result of committing a transaction.
 */
export interface CommitResult {
  readonly state: import("../execution-contract.js").MindState;
  readonly appliedCount: number;
}
