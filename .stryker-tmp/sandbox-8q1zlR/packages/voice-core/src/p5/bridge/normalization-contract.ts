// @ts-nocheck
import { Emotion } from "../execution-contract.js";

/**
 * Represents a decision emitted by the P4 Control Plane (Governor).
 * All fields are optional — only present fields produce P5Events.
 */
export interface GovernorDecision {
  trustDelta?: number;
  suspicionDelta?: number;
  pressureDelta?: number;
  emotion?: Emotion;
}

/**
 * Result of validating a GovernorDecision.
 * If `valid` is false, `reasons` lists every violation found.
 */
export interface ValidationResult {
  valid: boolean;
  reasons: string[];
}
