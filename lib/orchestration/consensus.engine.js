/**
 * Consensus Engine
 * Applies the Decision Matrix: HARD OVERRIDE vs SOFT CONSENSUS
 */
export function resolveConsensus(opinions) {
    const fraudAgent = opinions.find(o => o.agent === "fraud");
    const billingAgent = opinions.find(o => o.agent === "billing");
    const behaviorAgent = opinions.find(o => o.agent === "behavior");
    const interviewAgent = opinions.find(o => o.agent === "interview");
    const cvAgent = opinions.find(o => o.agent === "cv");
    const explanationGraph = [];
    const overrideSource = undefined;
    // 1. HARD OVERRIDE LAYER
    // Fraud Kernel = VETO ABSOLU IMMUTABLE
    if (fraudAgent && fraudAgent.recommendation === "veto") {
        return {
            status: "block",
            globalScore: 0,
            agentVotes: opinions,
            overrideSource: "fraud-kernel",
            explanationGraph: ["HARD FRAUD VETO OVERRIDE", `Reason: ${fraudAgent.reasoning}`],
            confidence: fraudAgent.confidence
        };
    }
    // Billing inconsistency = FREEZE
    if (billingAgent && billingAgent.recommendation === "block") {
        explanationGraph.push(`Billing Agent applied FREEZE: ${billingAgent.reasoning}`);
        return {
            status: "freeze",
            globalScore: 0,
            agentVotes: opinions,
            overrideSource: "billing",
            explanationGraph,
            confidence: billingAgent.confidence
        };
    }
    // 2. SOFT CONSENSUS LAYER
    const intScore = interviewAgent?.signals.score ?? 0;
    const cvScore = cvAgent?.signals.matchScore ?? 0;
    // behavior score mapping: lower drift -> higher score. For example (1 - drift)
    const drift = behaviorAgent?.signals.driftScore ?? 0;
    const behaviorScore = Math.max(1 - drift, 0);
    // billing health: 1 if good, 0 if inconsistent
    const billingHealth = billingAgent && billingAgent.recommendation !== "block" ? 1 : 0;
    // finalScore = 0.4 * Interview + 0.2 * CV + 0.2 * Behavior + 0.2 * Billing health
    const finalScore = (0.4 * intScore) +
        (0.2 * cvScore) +
        (0.2 * behaviorScore) +
        (0.2 * billingHealth);
    explanationGraph.push(`Computed Global Score: ${finalScore.toFixed(2)}`);
    // Calculate Variance to detect disagreement > 0.5
    const scores = [intScore, cvScore, behaviorScore, billingHealth];
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / scores.length;
    let status = "allow";
    const finalConfidence = 0.8;
    // 3. DECISION MATRIX
    if (behaviorAgent && behaviorAgent.recommendation === "escalate" && finalScore < 0.6) {
        status = "review";
        explanationGraph.push("Behavior drift is high and global score is low. Escalating for REVIEW.");
    }
    else if (variance > 0.1) { // Adjusted to 0.1 since max possible variance on 0-1 scale is 0.25
        status = "review";
        explanationGraph.push(`Agent divergence > 0.1 variance (${variance.toFixed(2)}). Escalating for REVIEW.`);
    }
    else {
        explanationGraph.push("Consensus reached: ALLOW.");
    }
    return {
        status,
        globalScore: finalScore,
        agentVotes: opinions,
        overrideSource,
        explanationGraph,
        confidence: finalConfidence
    };
}
//# sourceMappingURL=consensus.engine.js.map