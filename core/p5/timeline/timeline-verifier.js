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
export function verifyTimeline(timeline) {
    const violations = [];
    for (let i = 0; i < timeline.entries.length; i++) {
        const entry = timeline.entries[i];
        if (!entry)
            continue;
        const expectedTick = i + 1;
        if (entry.tick < 0) {
            violations.push(`Entry ${i}: negative tick ${entry.tick}`);
        }
        if (entry.tick !== expectedTick) {
            violations.push(`Entry ${i}: expected tick ${expectedTick}, got ${entry.tick}`);
        }
    }
    return { valid: violations.length === 0, violations };
}
//# sourceMappingURL=timeline-verifier.js.map