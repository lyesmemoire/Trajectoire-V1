import { PremiumATSScore } from "./scoring/premium-engine";
import { MunitionPack } from "./contracts/munitions";
export interface PremiumATSAnalysis {
    candidateId: string;
    jobTitle: string;
    analyzedAt: string;
    score: PremiumATSScore;
    recruiterSignals: string[];
    strengths: string[];
    missingSkills: string[];
    rewriteSuggestions: Array<{
        original: string;
        improved: string;
    }>;
    confidence: number;
    munitionPack: MunitionPack;
}
/**
 * Orchestrateur ATS Premium focalisé sur le "Recruiter Doubt".
 */
export declare function processPremiumATSAnalysis(cvBuffer: _Buffer, jobDescription: string): Promise<PremiumATSAnalysis>;
//# sourceMappingURL=premium-orchestrator.d.ts.map