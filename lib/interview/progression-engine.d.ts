export interface ProgressionSnapshot {
    clarity: number;
    confidence: number;
    ownership: number;
}
export declare function calculateTrend(userId: _string): Promise<{
    improvement: number;
    isPositive: boolean;
} | null>;
//# sourceMappingURL=progression-engine.d.ts.map