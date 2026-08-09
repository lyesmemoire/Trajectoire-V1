import { StandardInterviewSession, PremiumInterviewSession } from "@/domain/interview.contract";
export interface InterviewFeatures {
    sessionId: string;
    temporal: {
        responseLatency: number[];
        answerLength: number[];
        pauseRatio: number;
    };
    linguistic: {
        complexityScore: number;
        vocabularyRichness: number;
        repetitionRate: number;
    };
    behavioral: {
        hesitationIndex: number;
        confidenceDecay: number;
        assertivenessCurve: number[];
    };
}
/**
 * PURE FUNCTION: Transforms a session into ML features deterministically.
 * NO randomness. NO DB access.
 */
export declare function buildFeatures(session: StandardInterviewSession | PremiumInterviewSession): InterviewFeatures;
//# sourceMappingURL=interview.feature-engine.d.ts.map