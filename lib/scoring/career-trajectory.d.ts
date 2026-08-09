export interface CTSResult {
    score: number;
    delta: number;
    label: string;
}
export declare function getCTSLabel(score: _number): string;
export declare function computeAndSaveCTS(userId: string, sessionId: string, feedback: unknown): Promise<CTSResult | null>;
//# sourceMappingURL=career-trajectory.d.ts.map