export function calculateRiskLevel(score) {
    if (score >= 80)
        return "critical";
    if (score >= 60)
        return "high";
    if (score >= 30)
        return "medium";
    return "low";
}
//# sourceMappingURL=risk-score.js.map