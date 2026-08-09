/**
 * Measures the "humanity" of an interaction sequence.
 * High entropy = Human-like chaos. Low entropy = Bot-like precision.
 */
export function calculateBehavioralEntropy(events) {
    if (events.clickIntervals.length < 3)
        return 1.0; // Default for small samples
    // 1. Calculate variance in click intervals
    const mean = events.clickIntervals.reduce((a, b) => a + b) /
        events.clickIntervals.length;
    const variance = events.clickIntervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
        events.clickIntervals.length;
    // Bots have very low variance (stable timing)
    const clickEntropy = Math.min(1, variance / 5000);
    // 2. Simple check for robotic mouse paths
    const lowMouseVariance = events.mouseVelocity.every((v) => v === events.mouseVelocity[0]);
    const mouseEntropy = lowMouseVariance ? 0.1 : 0.9;
    return clickEntropy * 0.7 + mouseEntropy * 0.3;
}
/**
 * Flags suspicious sessions based on entropy score.
 */
export function isSuspiciousScraper(score) {
    const SKEPTICISM_THRESHOLD = 0.25;
    return score < SKEPTICISM_THRESHOLD;
}
//# sourceMappingURL=behavioral-entropy.js.map