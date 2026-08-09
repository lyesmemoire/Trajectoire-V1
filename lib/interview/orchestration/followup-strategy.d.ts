export type FollowUpStrategy = "clarification" | "pressure" | "deep_dive" | "contradiction" | "supportive" | "transition";
export interface FollowUpIntent {
    strategy: FollowUpStrategy;
    reason: string;
}
export declare function chooseStrategy(analysis: _AnswerAnalysis, pressureLevel: number): FollowUpIntent;
//# sourceMappingURL=followup-strategy.d.ts.map