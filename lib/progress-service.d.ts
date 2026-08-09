export type InterviewSessionSummary = {
    id: string;
    createdAt: string;
    jobTitle: string;
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    stressScore: number;
    tags: string[];
};
export type ProgressKPI = {
    value: number;
    diff: number;
};
export type SkillInsight = {
    type: "weakness" | "strength" | "neutral";
    message: string;
};
export type CareerTrajectory = {
    currentScore: number;
    delta: number;
    label: string;
    history: number[];
};
export type ProgressData = {
    kpis: {
        technical: ProgressKPI;
        communication: ProgressKPI;
        confidence: ProgressKPI;
        stress: ProgressKPI;
    };
    history: InterviewSessionSummary[];
    insights: SkillInsight[];
    careerTrajectory: CareerTrajectory | null;
};
export declare function getProgressData(supabase: unknown, userId: string): Promise<ProgressData | null>;
//# sourceMappingURL=progress-service.d.ts.map