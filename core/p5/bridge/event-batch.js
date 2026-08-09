import { validateDecision } from "./validation.js";
import { normalizeDecision } from "./normalize-decision.js";
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
export function batchDecisions(decisions) {
    const events = [];
    const rejected = [];
    for (let i = 0; i < decisions.length; i++) {
        const decision = decisions[i];
        if (!decision)
            continue;
        const validation = validateDecision(decision);
        if (!validation.valid) {
            rejected.push({ index: i, decision, reasons: validation.reasons });
            continue;
        }
        const normalized = normalizeDecision(decision);
        events.push(...normalized);
    }
    return { events, rejected };
}
//# sourceMappingURL=event-batch.js.map