/**
 * Reflection Engine Interfaces
 * Self-reflection after each simulation
 */

import { z } from "zod";

// ============================================================================
// REFLECTION QUESTION
// ============================================================================

export interface ReflectionQuestion {
  id: string;
  question: string;
  category: "what_worked" | "what_failed" | "decision_quality" | "engine_utility" | "prompt_quality" | "intervention_quality" | "recommendation_quality" | "cost_optimization" | "better_alternatives";
  priority: number; // 0-100
}

export const ReflectionQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.enum(["what_worked", "what_failed", "decision_quality", "engine_utility", "prompt_quality", "intervention_quality", "recommendation_quality", "cost_optimization", "better_alternatives"]),
  priority: z.number(),
});

// ============================================================================
// REFLECTION ANSWER
// ============================================================================

export interface ReflectionAnswer {
  questionId: string;
  answer: string;
  confidence: number; // 0-1
  evidence: string[];
  timestamp: Date;
}

export const ReflectionAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  confidence: z.number(),
  evidence: z.array(z.string()),
  timestamp: z.date(),
});

// ============================================================================
// ACTIONABLE INSIGHT
// ============================================================================

export interface ActionableInsight {
  id: string;
  type: "engine_correction" | "prompt_correction" | "policy_correction" | "cost_optimization" | "feature_improvement" | "workflow_optimization";
  title: string;
  description: string;
  impact: number; // 0-1
  effort: number; // 0-1
  priority: number; // 0-100
  target: string; // engine, prompt, policy, etc.
  action: string;
  status: "pending" | "in_progress" | "implemented" | "rejected";
  createdAt: Date;
}

export const ActionableInsightSchema = z.object({
  id: z.string(),
  type: z.enum(["engine_correction", "prompt_correction", "policy_correction", "cost_optimization", "feature_improvement", "workflow_optimization"]),
  title: z.string(),
  description: z.string(),
  impact: z.number(),
  effort: z.number(),
  priority: z.number(),
  target: z.string(),
  action: z.string(),
  status: z.enum(["pending", "in_progress", "implemented", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// LEARNING EVENT
// ============================================================================

export interface LearningEvent {
  id: string;
  sessionId: string;
  timestamp: Date;
  eventType: "success" | "failure" | "improvement" | "degradation" | "discovery";
  description: string;
  context: Record<string, unknown>;
  confidence: number; // 0-1
  enginesInvolved: string[];
}

export const LearningEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  timestamp: z.date(),
  eventType: z.enum(["success", "failure", "improvement", "degradation", "discovery"]),
  description: z.string(),
  context: z.record(z.string(), z.unknown()),
  confidence: z.number(),
  enginesInvolved: z.array(z.string()),
});

// ============================================================================
// ENGINE CORRECTION
// ============================================================================

export interface EngineCorrection {
  id: string;
  engineId: string;
  correctionType: "parameter" | "logic" | "threshold" | "weight" | "algorithm";
  currentValue: unknown;
  recommendedValue: unknown;
  reason: string;
  expectedImprovement: number; // 0-1
  status: "pending" | "applied" | "rejected";
  createdAt: Date;
}

export const EngineCorrectionSchema = z.object({
  id: z.string(),
  engineId: z.string(),
  correctionType: z.enum(["parameter", "logic", "threshold", "weight", "algorithm"]),
  currentValue: z.unknown(),
  recommendedValue: z.unknown(),
  reason: z.string(),
  expectedImprovement: z.number(),
  status: z.enum(["pending", "applied", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// PROMPT CORRECTION
// ============================================================================

export interface PromptCorrection {
  id: string;
  promptId: string;
  currentPrompt: string;
  recommendedPrompt: string;
  reason: string;
  expectedImprovement: number; // 0-1
  status: "pending" | "applied" | "rejected";
  createdAt: Date;
}

export const PromptCorrectionSchema = z.object({
  id: z.string(),
  promptId: z.string(),
  currentPrompt: z.string(),
  recommendedPrompt: z.string(),
  reason: z.string(),
  expectedImprovement: z.number(),
  status: z.enum(["pending", "applied", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// POLICY CORRECTION
// ============================================================================

export interface PolicyCorrection {
  id: string;
  policyId: string;
  currentPolicy: string;
  recommendedPolicy: string;
  reason: string;
  expectedImprovement: number; // 0-1
  status: "pending" | "applied" | "rejected";
  createdAt: Date;
}

export const PolicyCorrectionSchema = z.object({
  id: z.string(),
  policyId: z.string(),
  currentPolicy: z.string(),
  recommendedPolicy: z.string(),
  reason: z.string(),
  expectedImprovement: z.number(),
  status: z.enum(["pending", "applied", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// COST OPTIMIZATION
// ============================================================================

export interface CostOptimization {
  id: string;
  source: string; // engine, prompt, workflow
  currentCost: number;
  optimizedCost: number;
  savings: number;
  strategy: string;
  status: "pending" | "implemented" | "rejected";
  createdAt: Date;
}

export const CostOptimizationSchema = z.object({
  id: z.string(),
  source: z.string(),
  currentCost: z.number(),
  optimizedCost: z.number(),
  savings: z.number(),
  strategy: z.string(),
  status: z.enum(["pending", "implemented", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// REFLECTION REPORT
// ============================================================================

export interface ReflectionReport {
  id: string;
  sessionId: string;
  userId: string;
  timestamp: Date;
  questions: ReflectionQuestion[];
  answers: ReflectionAnswer[];
  actionableInsights: ActionableInsight[];
  learningEvents: LearningEvent[];
  engineCorrections: EngineCorrection[];
  promptCorrections: PromptCorrection[];
  policyCorrections: PolicyCorrection[];
  costOptimizations: CostOptimization[];
  overallRating: number; // 0-1
  summary: string;
  recommendations: string[];
  confidence: number; // 0-1
}

export const ReflectionReportSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  timestamp: z.date(),
  questions: z.array(z.lazy(() => ReflectionQuestionSchema)),
  answers: z.array(z.lazy(() => ReflectionAnswerSchema)),
  actionableInsights: z.array(z.lazy(() => ActionableInsightSchema)),
  learningEvents: z.array(z.lazy(() => LearningEventSchema)),
  engineCorrections: z.array(z.lazy(() => EngineCorrectionSchema)),
  promptCorrections: z.array(z.lazy(() => PromptCorrectionSchema)),
  policyCorrections: z.array(z.lazy(() => PolicyCorrectionSchema)),
  costOptimizations: z.array(z.lazy(() => CostOptimizationSchema)),
  overallRating: z.number(),
  summary: z.string(),
  recommendations: z.array(z.string()),
  confidence: z.number(),
});

// ============================================================================
// REFLECTION CONFIG
// ============================================================================

export interface ReflectionConfig {
  autoReflectAfterSession: boolean;
  reflectionQuestions: ReflectionQuestion[];
  minConfidenceThreshold: number;
  maxInsightsPerSession: number;
  enableEngineCorrections: boolean;
  enablePromptCorrections: boolean;
  enablePolicyCorrections: boolean;
  enableCostOptimizations: boolean;
  autoApplyCorrections: boolean;
}

export const ReflectionConfigSchema = z.object({
  autoReflectAfterSession: z.boolean(),
  reflectionQuestions: z.array(z.lazy(() => ReflectionQuestionSchema)),
  minConfidenceThreshold: z.number(),
  maxInsightsPerSession: z.number(),
  enableEngineCorrections: z.boolean(),
  enablePromptCorrections: z.boolean(),
  enablePolicyCorrections: z.boolean(),
  enableCostOptimizations: z.boolean(),
  autoApplyCorrections: z.boolean(),
});

export const defaultReflectionConfig: ReflectionConfig = {
  autoReflectAfterSession: true,
  reflectionQuestions: [
    {
      id: "q1",
      question: "What worked well during this session?",
      category: "what_worked",
      priority: 90,
    },
    {
      id: "q2",
      question: "What didn't work well during this session?",
      category: "what_failed",
      priority: 90,
    },
    {
      id: "q3",
      question: "Which decisions were suboptimal?",
      category: "decision_quality",
      priority: 80,
    },
    {
      id: "q4",
      question: "Which engines were unnecessary?",
      category: "engine_utility",
      priority: 70,
    },
    {
      id: "q5",
      question: "Which prompts were weak?",
      category: "prompt_quality",
      priority: 70,
    },
    {
      id: "q6",
      question: "Which interventions were unnecessary?",
      category: "intervention_quality",
      priority: 60,
    },
    {
      id: "q7",
      question: "Which recommendations were never followed?",
      category: "recommendation_quality",
      priority: 60,
    },
    {
      id: "q8",
      question: "What costs could have been avoided?",
      category: "cost_optimization",
      priority: 80,
    },
    {
      id: "q9",
      question: "What better decisions were possible?",
      category: "better_alternatives",
      priority: 75,
    },
  ],
  minConfidenceThreshold: 0.7,
  maxInsightsPerSession: 5,
  enableEngineCorrections: true,
  enablePromptCorrections: true,
  enablePolicyCorrections: true,
  enableCostOptimizations: true,
  autoApplyCorrections: false,
};
