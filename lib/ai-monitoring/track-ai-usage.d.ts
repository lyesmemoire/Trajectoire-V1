export interface TrackAIUsageInput {
    userId?: string;
    sessionId?: string;
    provider: string;
    model: string;
    feature: string;
    tokensInput: number;
    tokensOutput: number;
    latencyMs: number;
    costUsd: number;
    cacheHit?: boolean;
    confidenceScore?: number;
    failureType?: string;
}
/**
 * Persists AI usage logs for cost analysis and observability.
 */
export declare function trackAIUsage(input: _TrackAIUsageInput): Promise<any>;
//# sourceMappingURL=track-ai-usage.d.ts.map