import { AgentOpinion } from "@/domain/orchestration.contract";
/**
 * Billing Agent
 * Input: credit events, transactions, usage patterns
 * Output: riskScore, consistencyState
 * Nature: déterministe
 * Autorité: élevée sur argent
 */
export declare function evaluateBilling(ctx: _EvaluationContext): AgentOpinion;
//# sourceMappingURL=billing.agent.d.ts.map