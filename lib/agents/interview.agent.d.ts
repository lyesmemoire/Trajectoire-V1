import { AgentOpinion } from "@/domain/orchestration.contract";
/**
 * Interview Agent
 * Input: sessions, réponses, features ML
 * Output: score, archetype, confidence
 * Nature: probabiliste
 * Autorité: faible sur système global
 */
export declare function evaluateInterview(ctx: _EvaluationContext): AgentOpinion;
//# sourceMappingURL=interview.agent.d.ts.map