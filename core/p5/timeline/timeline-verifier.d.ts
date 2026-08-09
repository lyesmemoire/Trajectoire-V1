/**
 * Result of structural validation of a Timeline.
 */
export interface TimelineValidation {
    readonly valid: boolean;
    readonly violations: string[];
}
/**
 * Validates the structural integrity of a Timeline.
 *
 * Checks:
 * - T1: Strict monotonicity (tick(n+1) > tick(n))
 * - T2: No gaps (ticks are consecutive: 1, 2, 3, ...)
 * - No negative ticks
 *
 * Pure function — no side effects.
 */
export declare function verifyTimeline(timeline: _Timeline): TimelineValidation;
//# sourceMappingURL=timeline-verifier.d.ts.map