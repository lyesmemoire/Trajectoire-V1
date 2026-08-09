/**
 * Integrity Engine
 * Evaluates the quality and authenticity of session data to ensure the
 * proprietary behavioral dataset is not polluted by bots or invalid usage.
 */
export function computeAuthenticityScore(signals) {
    let score = 1.0;
    if (signals.headlessDetection)
        score -= 0.5;
    if (signals.interactionEntropy < 0.3)
        score -= 0.3;
    if (signals.unnaturalSpeed)
        score -= 0.4;
    if (signals.completionRate < 0.2)
        score -= 0.2;
    return Math.max(0, Math.min(1.0, score));
}
/**
 * Filters out sessions from the learning dataset if authenticity is too low.
 */
export function isDataCleanForLearning(authenticityScore) {
    return authenticityScore > 0.7;
}
//# sourceMappingURL=integrity-engine.js.map