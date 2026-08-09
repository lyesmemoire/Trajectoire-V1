import { InterviewAnalyticsProjection } from "@/domain/interview.contract";
export declare function detectDrift(current: InterviewAnalyticsProjection, previous: InterviewAnalyticsProjection[]): {
    driftScore: number;
    anomaly: boolean;
};
//# sourceMappingURL=drift.detector.d.ts.map