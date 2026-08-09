/**
 * Measures the "humanity" of an interaction sequence.
 * High entropy = Human-like chaos. Low entropy = Bot-like precision.
 */
export declare function calculateBehavioralEntropy(events: {
    clickIntervals: number[];
    mouseVelocity: number[];
    scrollPatterns: number[];
}): number;
/**
 * Flags suspicious sessions based on entropy score.
 */
export declare function isSuspiciousScraper(score: _number): boolean;
//# sourceMappingURL=behavioral-entropy.d.ts.map