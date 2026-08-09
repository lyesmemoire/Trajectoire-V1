export type FollowUpStrategy = "clarification" | "pressure" | "deep_dive" | "contradiction" | "supportive";
export interface FollowUpIntent {
    strategy: FollowUpStrategy;
    reason: string;
}
export declare function chooseStrategy(analysis: _unknown, personaPressure: number): FollowUpIntent;
//# sourceMappingURL=followup-strategy.d.ts.map