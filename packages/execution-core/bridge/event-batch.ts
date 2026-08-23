import { P5Event } from "../execution-contract.js";
import { GovernorDecision, ValidationResult } from "./normalization-contract.js";
import { validateDecision } from "./validation.js";
import { normalizeDecision } from "./normalize-decision.js";

/**
 * Result of processing a batch of GovernorDecisions.
 */
export interface BatchResult {
  events: P5Event[];
  rejected: Array<{ index: number; decision: GovernorDecision; reasons: string[] }>;
}

/**
 * Processes an ordered list of GovernorDecisions into a flat, deterministic P5Event batch.
 *
 * Guarantees:
 * - Same input → same output (B1 Déterminisme)
 * - Stable event order within and across decisions (B2 Ordre stable)
 * - No invalid events reach the output (B3 via validation)
 * - Pure function, no side effects (B4)
 * - Output is directly consumable by reduceMind / applyEvents (B5)
 *
 * Invalid decisions are collected in `rejected` and excluded from the event stream.
 */
export function batchDecisions(decisions: readonly GovernorDecision[]): BatchResult {
  const events: P5Event[] = [];
  const rejected: BatchResult["rejected"] = [];

  for (let i = 0; i < decisions.length; i++) {
    const decision = decisions[i];
    if (!decision) continue;
    const validation: ValidationResult = validateDecision(decision);

    if (!validation.valid) {
      rejected.push({ index: i, decision, reasons: validation.reasons });
      continue;
    }

    const normalized = normalizeDecision(decision);
    events.push(...normalized);
  }

  return { events, rejected };
}
