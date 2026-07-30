import { AgentOpinion } from "@/domain/orchestration.contract";

/**
 * CV Agent
 * Input: CV graph, embeddings, ATS signals
 * Output: skillScore, matchScore
 * Nature: structurelle + sémantique
 * Autorité: faible à moyenne
 */
export function evaluateCV(ctx: any): AgentOpinion {
  const matchScore = ctx.cvMatchScore ?? 0.5; // Default if not provided
  
  return {
    agent: "cv",
    confidence: 0.7, // NLP/Semantic matching confidence
    severity: 0,
    recommendation: "allow",
    reasoning: `CV match score is ${matchScore.toFixed(2)}.`,
    signals: {
      matchScore
    }
  };
}
