export declare function simulateDelay(ms?: any): Promise<void>;
export declare function mockATS(cv: string, job: string): Promise<{
    score: number;
    matched_keywords: string[];
    missing_keywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
}>;
export declare function mockOptimize(cv: string, job: string): Promise<{
    improvedSummary: string;
    improvedBullets: string[];
    keywordsAdded: string[];
    generalAdvice: string;
}>;
export declare function mockInterviewAnalyze(questions: string[], answers: string[], _jobTitle?: string): Promise<{
    scores: {
        clarity: number;
        relevance: number;
        confidence: number;
        structure: number;
        depth: number;
        finalScore: number;
    };
    strengths: string[];
    improvements: string[];
    detailedFeedback: {
        question: string;
        score: number;
        comment: string;
    }[];
    level: string;
    tips: string[];
}>;
//# sourceMappingURL=mock-ai.d.ts.map