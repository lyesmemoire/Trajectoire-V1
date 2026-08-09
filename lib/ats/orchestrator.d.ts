export interface ATSAnalysis {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    feedback: string;
    confidence: number;
}
export declare function processATSAnalysis(cvBuffer: _Buffer, jobDescription: string): Promise<ATSAnalysis>;
//# sourceMappingURL=orchestrator.d.ts.map