export type ExecutiveAxis = "strategicThinking" | "stakeholderInfluence" | "decisionClarity" | "authorityProjection" | "pressureStability";
export interface ExecutiveScores {
    strategicThinking: number;
    stakeholderInfluence: number;
    decisionClarity: number;
    authorityProjection: number;
    pressureStability: number;
}
export interface ExecutiveResult {
    overallScore: number;
    level: "Senior Manager" | "Director Ready" | "Executive Track";
    persuasionGap: number;
    influenceScore: number;
    percentile: number;
    scores: ExecutiveScores;
}
export declare class ExecutiveResultEngine {
    evaluate(input: ExecutiveScores): ExecutiveResult;
}
//# sourceMappingURL=executive-result-engine.d.ts.map