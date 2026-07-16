// @ts-nocheck
import { P5Event } from "../execution-contract.js";

/**
 * A single journal entry: an event with its sequence number.
 * Sequence numbers are strictly monotonic (1, 2, 3, ...) with no gaps.
 */
export interface JournalEntry {
  readonly sequence: number;
  readonly event: P5Event;
}

/**
 * An ordered, immutable log of P5Events.
 * Represents the complete event history from a given snapshot point.
 */
export interface EventJournal {
  readonly entries: readonly JournalEntry[];
}
