/**
 * Decision Explainability Engine Interfaces
 * Provides explanations for AI decisions
 */

import { z } from "zod";

// ============================================================================
// EXPLANATION TYPE
// ============================================================================

export type ExplanationType = 
  | "recommendation"
  | "difficulty"
  | "personality"
  | "follow_up"
  | "score"
  | "intervention"
  | "journey"
  | "feedback"
  | "general";

// ============================================================================
// DECISION EXPLANATION
// ============================================================================

export interface DecisionExplanation {
  id: string;
  decisionId: string;
  type: ExplanationType;
  reason: string;
  alternatives: string[];
  confidence: number; // 0-1
  evidence: string[];
  historicalPrecedent: string | null;
  tradeoffs: string[];
  risk: string;
  expectedOutcome: string;
  timestamp: Date;
  userId: string;
}

export const DecisionExplanationSchema = z.object({
  id: z.string(),
  decisionId: z.string(),
  type: z.enum(["recommendation", "difficulty", "personality", "follow_up", "score", "intervention", "journey", "feedback", "general"]),
  reason: z.string(),
  alternatives: z.array(z.string()),
  confidence: z.number(),
  evidence: z.array(z.string()),
  historicalPrecedent: z.string().nullable(),
  tradeoffs: z.array(z.string()),
  risk: z.string(),
  expectedOutcome: z.string(),
  timestamp: z.date(),
  userId: z.string(),
});

// ============================================================================
// EXPLANATION REQUEST
// ============================================================================

export interface ExplanationRequest {
  decisionId: string;
  type: ExplanationType;
  userId: string;
  context: Record<string, unknown>;
  detailLevel: "brief" | "standard" | "detailed";
  includeAlternatives: boolean;
  includeEvidence: boolean;
  includeTradeoffs: boolean;
}

export const ExplanationRequestSchema = z.object({
  decisionId: z.string(),
  type: z.enum(["recommendation", "difficulty", "personality", "follow_up", "score", "intervention", "journey", "feedback", "general"]),
  userId: z.string(),
  context: z.record(z.string(), z.unknown()),
  detailLevel: z.enum(["brief", "standard", "detailed"]),
  includeAlternatives: z.boolean(),
  includeEvidence: z.boolean(),
  includeTradeoffs: z.boolean(),
});

// ============================================================================
// EXPLANATION COMPONENT
// ============================================================================

export interface ExplanationComponent {
  id: string;
  explanationId: string;
  componentType: "reason" | "evidence" | "alternative" | "tradeoff" | "risk" | "outcome";
  content: string;
  weight: number; // 0-1
  source: string;
  timestamp: Date;
}

export const ExplanationComponentSchema = z.object({
  id: z.string(),
  explanationId: z.string(),
  componentType: z.enum(["reason", "evidence", "alternative", "tradeoff", "risk", "outcome"]),
  content: z.string(),
  weight: z.number(),
  source: z.string(),
  timestamp: z.date(),
});

// ============================================================================
// EXPLANATION TEMPLATE
// ============================================================================

export interface ExplanationTemplate {
  id: string;
  type: ExplanationType;
  template: string;
  variables: string[];
  defaultValues: Record<string, string>;
  detailLevels: {
    brief: string;
    standard: string;
    detailed: string;
  };
}

export const ExplanationTemplateSchema = z.object({
  id: z.string(),
  type: z.enum(["recommendation", "difficulty", "personality", "follow_up", "score", "intervention", "journey", "feedback", "general"]),
  template: z.string(),
  variables: z.array(z.string()),
  defaultValues: z.record(z.string(), z.string()),
  detailLevels: z.object({
    brief: z.string(),
    standard: z.string(),
    detailed: z.string(),
  }),
});

// ============================================================================
// EXPLANATION METRICS
// ============================================================================

export interface ExplanationMetrics {
  totalExplanations: number;
  explanationsByType: Record<string, number>;
  averageConfidence: number; // 0-1
  averageAlternatives: number;
  averageEvidence: number;
  userSatisfaction: number; // 0-1
  clarityScore: number; // 0-1
}

export const ExplanationMetricsSchema = z.object({
  totalExplanations: z.number(),
  explanationsByType: z.record(z.string(), z.number()),
  averageConfidence: z.number(),
  averageAlternatives: z.number(),
  averageEvidence: z.number(),
  userSatisfaction: z.number(),
  clarityScore: z.number(),
});

// ============================================================================
// DECISION EXPLAINABILITY ENGINE CONFIG
// ============================================================================

export interface DecisionExplainabilityEngineConfig {
  enableCaching: boolean;
  cacheDuration: number; // milliseconds
  enableTemplates: boolean;
  defaultDetailLevel: "brief" | "standard" | "detailed";
  maxAlternatives: number;
  maxEvidence: number;
  enableHistoricalPrecedent: boolean;
  enableTradeoffs: boolean;
}

export const DecisionExplainabilityEngineConfigSchema = z.object({
  enableCaching: z.boolean(),
  cacheDuration: z.number(),
  enableTemplates: z.boolean(),
  defaultDetailLevel: z.enum(["brief", "standard", "detailed"]),
  maxAlternatives: z.number(),
  maxEvidence: z.number(),
  enableHistoricalPrecedent: z.boolean(),
  enableTradeoffs: z.boolean(),
});

export const defaultDecisionExplainabilityEngineConfig: DecisionExplainabilityEngineConfig = {
  enableCaching: true,
  cacheDuration: 300000,
  enableTemplates: true,
  defaultDetailLevel: "standard",
  maxAlternatives: 3,
  maxEvidence: 5,
  enableHistoricalPrecedent: true,
  enableTradeoffs: true,
};
