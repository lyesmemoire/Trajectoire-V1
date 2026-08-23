import { GovernorDecision, ValidationResult } from "./normalization-contract.js";

/**
 * Validates a GovernorDecision before it enters the normalization pipeline.
 *
 * Rejects:
 * - NaN deltas
 * - Infinity / -Infinity deltas
 * - Empty string emotions
 *
 * This is a pure function Ã¢â‚¬â€ no Date.now(), no Math.random(), no side effects.
 */
export function validateDecision(decision: GovernorDecision): ValidationResult {
  const reasons: string[] = [];

  if (decision.trustDelta !== undefined) {
    if (!Number.isFinite(decision.trustDelta)) {
      reasons.push(`trustDelta is not finite: ${decision.trustDelta}`);
    }
  }

  if (decision.suspicionDelta !== undefined) {
    if (!Number.isFinite(decision.suspicionDelta)) {
      reasons.push(`suspicionDelta is not finite: ${decision.suspicionDelta}`);
    }
  }

  if (decision.pressureDelta !== undefined) {
    if (!Number.isFinite(decision.pressureDelta)) {
      reasons.push(`pressureDelta is not finite: ${decision.pressureDelta}`);
    }
  }

  if (decision.emotion !== undefined) {
    if (typeof decision.emotion !== "string" || decision.emotion.length === 0) {
      reasons.push(`emotion is invalid: ${JSON.stringify(decision.emotion)}`);
    }
  }

  return { valid: reasons.length === 0, reasons };
}
