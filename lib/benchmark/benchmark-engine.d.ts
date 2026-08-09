export interface BenchmarkResult {
    percentile: number;
    category: string;
}
/**
 * Compares a specific metric for a user against the global average.
 */
export declare function computeBenchmark(userId: _string, metric: "clarity" | "confidence" | "technical"): Promise<BenchmarkResult>;
//# sourceMappingURL=benchmark-engine.d.ts.map