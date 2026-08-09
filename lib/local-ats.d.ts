export declare function getEmbedding(text: string): Promise<number[]>;
export declare function computeSemanticScore(cvText: string, jobText: string): Promise<number>;
export declare function computeKeywordScore(cv: string, job: string): number;
export declare function generateFeedback(cvText: string, jobText: string): Promise<{
    matched_keywords: string[];
    missing_keywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}>;
//# sourceMappingURL=local-ats.d.ts.map