import { EventJournal } from "./journal-contract";

/**
 * Creates a new, empty EventJournal.
 */
export function createJournal(): EventJournal {
  return { entries: [] };
}
