export interface PremiumATSScore {
    overall: number;
    dimensions: {
        skillMatch: number;
        seniorityFit: number;
        recruiterClarity: number;
        leadershipSignals: number;
        metricsUsage: number;
        atsCompatibility: number;
    };
}
/**
 * Calculates a highly detailed ATS score based on multiple vectors.
 */
export declare function calculatePremiumATSScore(baseMetrics: unknown, behavioralSignals: unknown): PremiumATSScore;
//# sourceMappingURL=premium-engine.d.ts.map