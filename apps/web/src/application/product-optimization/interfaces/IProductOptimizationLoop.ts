/**
 * Product Optimization Loop Interfaces
 * Automatic product improvement loop
 */

import { z } from "zod";

// ============================================================================
// OPTIMIZATION INSIGHT
// ============================================================================

export interface OptimizationInsight {
  id: string;
  type: "unused_screen" | "unused_feature" | "inefficient_engine" | "unnecessary_cost" | "ignored_recommendation" | "repetitive_question" | "unnecessary_notification";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  impact: number; // 0-1
  effort: number; // 0-1
  priority: number; // 0-100
  data: Record<string, unknown>;
  detectedAt: Date;
}

export const OptimizationInsightSchema = z.object({
  id: z.string(),
  type: z.enum(["unused_screen", "unused_feature", "inefficient_engine", "unnecessary_cost", "ignored_recommendation", "repetitive_question", "unnecessary_notification"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  title: z.string(),
  description: z.string(),
  impact: z.number(),
  effort: z.number(),
  priority: z.number(),
  data: z.record(z.string(), z.any()),
  detectedAt: z.date(),
});

// ============================================================================
// OPTIMIZATION PROPOSAL
// ============================================================================

export interface OptimizationProposal {
  id: string;
  insightId: string;
  type: "product_improvement" | "journey_optimization" | "rule_adjustment" | "feature_evolution";
  title: string;
  description: string;
  implementationSteps: string[];
  expectedImpact: number; // 0-1
  estimatedEffort: number; // 0-1
  priority: number; // 0-100
  status: "pending" | "in_progress" | "implemented" | "rejected";
  generatedAt: Date;
}

export const OptimizationProposalSchema = z.object({
  id: z.string(),
  insightId: z.string(),
  type: z.enum(["product_improvement", "journey_optimization", "rule_adjustment", "feature_evolution"]),
  title: z.string(),
  description: z.string(),
  implementationSteps: z.array(z.string()),
  expectedImpact: z.number(),
  estimatedEffort: z.number(),
  priority: z.number(),
  status: z.enum(["pending", "in_progress", "implemented", "rejected"]),
  generatedAt: z.date(),
});

// ============================================================================
// SESSION METRICS
// ============================================================================

export interface SessionMetrics {
  sessionId: string;
  userId: string;
  timestamp: Date;
  duration: number;
  satisfaction: number;
  difficulty: number;
  stressLevel: number;
  confidenceLevel: number;
  screensVisited: string[];
  featuresUsed: string[];
  enginesInvoked: string[];
  recommendations: string[];
  recommendationsIgnored: string[];
  notifications: string[];
  notificationsIgnored: string[];
  feedback: string;
}

export const SessionMetricsSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  timestamp: z.date(),
  duration: z.number(),
  satisfaction: z.number(),
  difficulty: z.number(),
  stressLevel: z.number(),
  confidenceLevel: z.number(),
  screensVisited: z.array(z.string()),
  featuresUsed: z.array(z.string()),
  enginesInvoked: z.array(z.string()),
  recommendations: z.array(z.string()),
  recommendationsIgnored: z.array(z.string()),
  notifications: z.array(z.string()),
  notificationsIgnored: z.array(z.string()),
  feedback: z.string(),
});

// ============================================================================
// PRODUCT OPTIMIZATION LOOP CONFIG
// ============================================================================

export interface ProductOptimizationLoopConfig {
  analysisInterval: number; // hours
  minDataPoints: number;
  insightThreshold: number; // 0-1
  autoGenerateProposals: boolean;
  maxProposalsPerCycle: number;
  learningRate: number;
}

export const ProductOptimizationLoopConfigSchema = z.object({
  analysisInterval: z.number(),
  minDataPoints: z.number(),
  insightThreshold: z.number(),
  autoGenerateProposals: z.boolean(),
  maxProposalsPerCycle: z.number(),
  learningRate: z.number(),
});

export const defaultProductOptimizationLoopConfig: ProductOptimizationLoopConfig = {
  analysisInterval: 24,
  minDataPoints: 10,
  insightThreshold: 0.3,
  autoGenerateProposals: true,
  maxProposalsPerCycle: 5,
  learningRate: 0.1,
};
