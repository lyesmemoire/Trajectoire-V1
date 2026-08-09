/**
 * Calculates a highly detailed ATS score based on multiple vectors.
 */
export function calculatePremiumATSScore(baseMetrics, behavioralSignals) {
    const dimensions = {
        skillMatch: baseMetrics.skillMatchScore || 0,
        seniorityFit: baseMetrics.seniorityScore || 0,
        recruiterClarity: baseMetrics.readabilityScore || 0,
        leadershipSignals: behavioralSignals.leadershipScore || 0,
        metricsUsage: behavioralSignals.metricsScore || 0,
        atsCompatibility: baseMetrics.formattingScore || 95,
    };
    const weights = {
        skillMatch: 0.35,
        seniorityFit: 0.15,
        recruiterClarity: 0.2,
        leadershipSignals: 0.1,
        metricsUsage: 0.15,
        atsCompatibility: 0.05,
    };
    const overall = Object.keys(dimensions).reduce((acc, key) => {
        return acc + dimensions[key] * weights[key];
    }, 0);
    return {
        overall: Math.round(overall),
        dimensions,
    };
}
//# sourceMappingURL=premium-engine.js.map