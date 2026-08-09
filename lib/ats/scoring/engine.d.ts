/**
 * Calcul déterministe du score de compétences.
 * 40% du score final ATS.
 */
export declare function calculateSkillScore(required: string[], candidate: string[]): {
    score: number;
    matched: string[];
    missing: string[];
};
/**
 * Agrégation finale du score ATS (Deterministic).
 */
export declare function aggregateFinalScore(metrics: {
    skills: number;
    experience: number;
    seniority: number;
    readability: number;
}): number;
//# sourceMappingURL=engine.d.ts.map