import { P5Event } from "../execution-contract.js";
import { EventJournal } from "./journal-contract.js";

/**
 * Appends an event to a journal, returning a new journal.
 *
 * Guarantees:
 * - J1: The original journal is never mutated.
 * - J2: Sequence numbers are strictly continuous (previous.length + 1).
 *
 * Pure function — no side effects.
 */
export function appendEvent(journal: EventJournal, event: P5Event): EventJournal {
  const nextSequence = journal.entries.length + 1;

  return {
    entries: [
      ...journal.entries,
      { sequence: nextSequence, event },
    ],
  };
}
