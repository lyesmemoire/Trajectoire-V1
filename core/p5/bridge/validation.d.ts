import { ValidationResult } from "./normalization-contract.js";
/**
 * Validates a GovernorDecision before it enters the normalization pipeline.
 *
 * Rejects:
 * - NaN deltas
 * - Infinity / -Infinity deltas
 * - Empty string emotions
 *
 * This is a pure function — no Date.now(), no Math.random(), no side effects.
 */
export declare function validateDecision(decision: _GovernorDecision): ValidationResult;
//# sourceMappingURL=validation.d.ts.map