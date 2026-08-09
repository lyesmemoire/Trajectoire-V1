import { AgentOpinion } from "@/domain/orchestration.contract";
/**
 * CV Agent
 * Input: CV graph, embeddings, ATS signals
 * Output: skillScore, matchScore
 * Nature: structurelle + sémantique
 * Autorité: faible à moyenne
 */
export declare function evaluateCV(ctx: _EvaluationContext): AgentOpinion;
//# sourceMappingURL=cv.agent.d.ts.map