export interface BehavioralAnalytics {
    interruptionRate: number;
    recoveryRate: number;
    vaguenessFrequency: number;
    stressCollapseRate: number;
    metricUsageRate: number;
}
/**
 * Aggregates behavioral signals from a user's recent sessions.
 */
export declare function computeUserBehavioralAnalytics(userId: _string): Promise<BehavioralAnalytics>;
//# sourceMappingURL=behavioral-analytics.d.ts.map