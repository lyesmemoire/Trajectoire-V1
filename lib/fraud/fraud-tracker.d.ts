export interface FraudTrajectoryPoint {
    timestamp: number;
    riskScore: number;
}
export declare class FraudTracker {
    private history;
    append(userId: string, score: number): void;
    getTrend(userId: string): number;
}
//# sourceMappingURL=fraud-tracker.d.ts.map