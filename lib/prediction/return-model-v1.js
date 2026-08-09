/**
 * Predictive Return Model V1
 * Predicts the probability of a user returning within 24-48 hours.
 */
export function computeReturnScore(input) {
    // 1. Positive Signals (Value & Retention)
    const recoverySignal = input.behavior.claraRecoveries * 2 +
        input.behavior.replays * 1.5 +
        input.behavior.retries * 2;
    // 2. Danger Signals (Friction & Churn)
    const stressSignal = input.behavior.freezes * 2.5 +
        input.behavior.victorInterrupts * 1.5 +
        input.ux.hesitationIndex * 2 +
        input.ux.scrollEntropy;
    // 3. Engagement Signals (Energy & Motivation)
    const engagementSignal = input.ux.typingSpeed +
        input.behavior.replays * 1.2 -
        input.ux.clickDelayAvg / 1000; // Normalized to seconds
    // 4. Final Aggregation
    const rawScore = recoverySignal * 1.4 + engagementSignal * 1.2 - stressSignal * 1.6;
    // 5. Normalization via Sigmoid
    const returnProbability = sigmoid(rawScore / 10);
    // 6. Business Segmentation
    let returnSegment;
    if (returnProbability > 0.7)
        returnSegment = "HIGH";
    else if (returnProbability > 0.4)
        returnSegment = "MEDIUM";
    else
        returnSegment = "LOW";
    // 7. Explainer Logic
    let primaryDriver;
    if (recoverySignal > stressSignal) {
        primaryDriver = "Clara recovery loop dominance";
    }
    else if (stressSignal > recoverySignal) {
        primaryDriver = "High cognitive friction (Victor overload)";
    }
    else {
        primaryDriver = "Neutral engagement pattern";
    }
    return {
        returnProbability: Math.round(returnProbability * 100) / 100,
        returnSegment,
        primaryDriver,
        rawScore,
    };
}
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
//# sourceMappingURL=return-model-v1.js.map