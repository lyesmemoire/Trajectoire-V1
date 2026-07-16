/**
 * Orchestration Contract
 * Defines the types for the Multi-Agent Evaluation System
 */
// @ts-nocheck


export type AgentType = "interview" | "cv" | "billing" | "fraud" | "behavior";

export type AgentRecommendation = "allow" | "warn" | "block" | "escalate" | "veto";

export interface AgentOpinion {
  agent: AgentType;
  confidence: number;        // 0–1
  severity: number;          // 0–1
  recommendation: AgentRecommendation;
  reasoning: string;
  signals: Record<string, number>;
}

export type DecisionStatus = "allow" | "block" | "freeze" | "review";

export interface SystemDecision {
  status: DecisionStatus;
  globalScore: number;
  agentVotes: AgentOpinion[];
  overrideSource?: "fraud" | "fraud-kernel" | "billing" | "system";
  explanationGraph: string[];
  confidence: number;
}

/**
 * Context object passed to the AgentEvaluator containing
 * all necessary signals for the agents to form their opinions.
 */
export interface EvaluationContext {
  userId: string;
  sessionId?: string;
  
  // Fraud Kernel Signals
  metrics?: { requestsLastMinute: number };
  billing?: { negativeBalance: boolean };
  
  // Interview Signals
  interviewScore?: number;
  interviewConfidence?: number;
  
  // CV Signals
  cvMatchScore?: number;
  
  // Billing Signals
  hasBillingInconsistency?: boolean;
  creditBalance?: number;
  
  // Fraud Signals
  ipAnomalies?: number;
  velocityAnomalies?: number;
  
  // Behavior Signals
  driftScore?: number;
  stabilityScore?: number;
}
