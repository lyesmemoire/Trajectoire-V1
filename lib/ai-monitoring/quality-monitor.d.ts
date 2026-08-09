export interface AIQualityMetric {
    sessionId: string;
    userId: string;
    model: string;
    feature: string;
    confidenceScore: number;
    driftDetected: boolean;
    timestamp: string;
}
/**
 * Monitors the quality and behavioral consistency of AI outputs.
 */
export declare const AIQualityMonitor: {
    logMetric: (metric: AIQualityMetric) => Promise<void>;
};
//# sourceMappingURL=quality-monitor.d.ts.map