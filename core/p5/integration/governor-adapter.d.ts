import { P5Event } from "../execution-contract.js";
/**
 * Result of adapting a RuntimeDecision into P5Events.
 */
export interface AdaptResult {
    readonly events: P5Event[];
    readonly valid: boolean;
    readonly reasons: string[];
}
/**
 * Adapts a RuntimeDecision into validated, normalized P5Events.
 *
 * Bridges the runtime boundary into the P5 pure engine by:
 * 1. Mapping RuntimeDecision → GovernorDecision (currently 1:1)
 * 2. Validating via P5.1 validation
 * 3. Normalizing via P5.1 normalizeDecision
 *
 * Pure function — no side effects.
 */
export declare function adaptDecision(decision: _RuntimeDecision): AdaptResult;
//# sourceMappingURL=governor-adapter.d.ts.map