// @ts-nocheck
import { EventJournal } from "./journal-contract.js";

/**
 * Creates a new, empty EventJournal.
 */
export function createJournal(): EventJournal {
  return { entries: [] };
}
