/**
 * Decision Policy Engine Interfaces
 * Automatic rule weighting instead of static if/then rules
 */

import { z } from "zod";

// ============================================================================
// POLICY FACTORS
// ============================================================================

export interface PolicyFactors {
  stress: number;
  confidence: number;
  employability: number;
  goalUrgency: number;
  timeAvailable: number;
  historyCount: number;
  engagement: number;
  readiness: number;
  capability: number;
  motivation: number;
  fatigue: number;
  recentPerformance: number;
  goalProgress: number;
  skillGaps: number;
  weaknessSeverity: number;
  sessionCount: number;
  streak: number;
}

export const PolicyFactorsSchema = z.object({
  stress: z.number(),
  confidence: z.number(),
  employability: z.number(),
  goalUrgency: z.number(),
  timeAvailable: z.number(),
  historyCount: z.number(),
  engagement: z.number(),
  readiness: z.number(),
  capability: z.number(),
  motivation: z.number(),
  fatigue: z.number(),
  recentPerformance: z.number(),
  goalProgress: z.number(),
  skillGaps: z.number(),
  weaknessSeverity: z.number(),
  sessionCount: z.number(),
  streak: z.number(),
});

// ============================================================================
// POLICY WEIGHTS
// ============================================================================

export interface PolicyWeights {
  stress: number;
  confidence: number;
  employability: number;
  goalUrgency: number;
  timeAvailable: number;
  historyCount: number;
  engagement: number;
  readiness: number;
  capability: number;
  motivation: number;
  fatigue: number;
  recentPerformance: number;
  goalProgress: number;
  skillGaps: number;
  weaknessSeverity: number;
  sessionCount: number;
  streak: number;
}

export const PolicyWeightsSchema = z.object({
  stress: z.number(),
  confidence: z.number(),
  employability: z.number(),
  goalUrgency: z.number(),
  timeAvailable: z.number(),
  historyCount: z.number(),
  engagement: z.number(),
  readiness: z.number(),
  capability: z.number(),
  motivation: z.number(),
  fatigue: z.number(),
  recentPerformance: z.number(),
  goalProgress: z.number(),
  skillGaps: z.number(),
  weaknessSeverity: z.number(),
  sessionCount: z.number(),
  streak: z.number(),
});

// ============================================================================
// POLICY SCORE
// ============================================================================

export interface PolicyScore {
  overall: number;
  components: {
    stress: number;
    confidence: number;
    employability: number;
    goalUrgency: number;
    timeAvailable: number;
    historyCount: number;
    engagement: number;
    readiness: number;
    capability: number;
    motivation: number;
    fatigue: number;
    recentPerformance: number;
    goalProgress: number;
    skillGaps: number;
    weaknessSeverity: number;
    sessionCount: number;
    streak: number;
  };
  priority: "critical" | "high" | "medium" | "low";
  confidence: number;
  timestamp: Date;
}

export const PolicyScoreSchema = z.object({
  overall: z.number(),
  components: z.object({
    stress: z.number(),
    confidence: z.number(),
    employability: z.number(),
    goalUrgency: z.number(),
    timeAvailable: z.number(),
    historyCount: z.number(),
    engagement: z.number(),
    readiness: z.number(),
    capability: z.number(),
    motivation: z.number(),
    fatigue: z.number(),
    recentPerformance: z.number(),
    goalProgress: z.number(),
    skillGaps: z.number(),
    weaknessSeverity: z.number(),
    sessionCount: z.number(),
    streak: z.number(),
  }),
  priority: z.enum(["critical", "high", "medium", "low"]),
  confidence: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// POLICY DECISION
// ============================================================================

export interface PolicyDecision {
  id: string;
  factors: PolicyFactors;
  score: PolicyScore;
  recommendedActions: string[];
  reasoning: string;
  alternatives: PolicyAlternative[];
  timestamp: Date;
}

export const PolicyDecisionSchema = z.object({
  id: z.string(),
  factors: z.lazy(() => PolicyFactorsSchema),
  score: z.lazy(() => PolicyScoreSchema),
  recommendedActions: z.array(z.string()),
  reasoning: z.string(),
  alternatives: z.array(z.lazy(() => PolicyAlternativeSchema)),
  timestamp: z.date(),
});

export interface PolicyAlternative {
  actions: string[];
  expectedScore: number;
  confidence: number;
  tradeoffs: string[];
}

export const PolicyAlternativeSchema = z.object({
  actions: z.array(z.string()),
  expectedScore: z.number(),
  confidence: z.number(),
  tradeoffs: z.array(z.string()),
});

// ============================================================================
// POLICY CONFIGURATION
// ============================================================================

export interface PolicyConfig {
  weights: PolicyWeights;
  thresholds: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  adaptationRate: number;
  minConfidence: number;
  maxAlternatives: number;
}

export const PolicyConfigSchema = z.object({
  weights: z.lazy(() => PolicyWeightsSchema),
  thresholds: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
  }),
  adaptationRate: z.number(),
  minConfidence: z.number(),
  maxAlternatives: z.number(),
});

export const defaultPolicyConfig: PolicyConfig = {
  weights: {
    stress: 0.15,
    confidence: 0.12,
    employability: 0.10,
    goalUrgency: 0.12,
    timeAvailable: 0.08,
    historyCount: 0.05,
    engagement: 0.08,
    readiness: 0.07,
    capability: 0.06,
    motivation: 0.07,
    fatigue: 0.05,
    recentPerformance: 0.05,
    goalProgress: 0.05,
    skillGaps: 0.05,
    weaknessSeverity: 0.05,
    sessionCount: 0.03,
    streak: 0.02,
  },
  thresholds: {
    critical: 0.8,
    high: 0.6,
    medium: 0.4,
    low: 0.2,
  },
  adaptationRate: 0.1,
  minConfidence: 0.7,
  maxAlternatives: 3,
};

// ============================================================================
// POLICY LEARNING
// ============================================================================

export interface PolicyLearning {
  decisionId: string;
  factors: PolicyFactors;
  score: PolicyScore;
  actualOutcome: number;
  expectedOutcome: number;
  feedback: "positive" | "negative" | "neutral";
  weightAdjustments: Partial<PolicyWeights>;
  timestamp: Date;
}

export const PolicyLearningSchema = z.object({
  decisionId: z.string(),
  factors: z.lazy(() => PolicyFactorsSchema),
  score: z.lazy(() => PolicyScoreSchema),
  actualOutcome: z.number(),
  expectedOutcome: z.number(),
  feedback: z.enum(["positive", "negative", "neutral"]),
  weightAdjustments: z.record(z.string(), z.number()),
  timestamp: z.date(),
});
