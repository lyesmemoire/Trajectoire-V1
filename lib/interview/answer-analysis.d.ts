export interface AnswerAnalysis {
    clarity: number;
    specificity: number;
    confidence: number;
    ownership: number;
    weaknesses: string[];
    strengths: string[];
    summary: string;
}
export declare function analyzeAnswer(answer: string, question: string): Promise<AnswerAnalysis>;
//# sourceMappingURL=answer-analysis.d.ts.map