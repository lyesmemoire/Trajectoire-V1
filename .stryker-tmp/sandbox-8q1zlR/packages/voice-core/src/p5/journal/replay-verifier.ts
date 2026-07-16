// @ts-nocheck
import { MindState } from "../execution-contract.js";

/**
 * Result of comparing an original state against a replayed state.
 */
export interface VerificationResult {
  readonly valid: boolean;
  readonly diff: string[];
}

/**
 * Compares two MindStates and reports any divergent fields.
 *
 * Returns { valid: true, diff: [] } if states are logically equivalent.
 * Returns { valid: false, diff: ["trust", ...] } listing every divergent field.
 *
 * Pure function — no side effects.
 */
export function verifyReplay(original: MindState, replayed: MindState): VerificationResult {
  const diff: string[] = [];

  if (original.trust !== replayed.trust) {
    diff.push("trust");
  }
  if (original.suspicion !== replayed.suspicion) {
    diff.push("suspicion");
  }
  if (original.pressure !== replayed.pressure) {
    diff.push("pressure");
  }
  if (original.emotion !== replayed.emotion) {
    diff.push("emotion");
  }

  return { valid: diff.length === 0, diff };
}
