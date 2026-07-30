import { P5Event } from "../execution-contract.js";
/**
 * Transforms a GovernorDecision into a deterministic, ordered list of P5Events.
 *
 * Order guarantee (B2): trust → suspicion → pressure → emotion.
 * This order is stable and independent of object key enumeration.
 *
 * Only present (defined) fields produce events.
 * This is a pure function — no RNG, no clock, no side effects (B4).
 */
export declare function normalizeDecision(decision: _GovernorDecision): P5Event[];
//# sourceMappingURL=normalize-decision.d.ts.map