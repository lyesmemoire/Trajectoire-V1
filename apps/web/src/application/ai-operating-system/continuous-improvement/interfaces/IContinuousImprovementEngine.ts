/**
 * Continuous Self Improvement Engine Interfaces
 * Automatically learns from results and improves strategies
 */

import { z } from "zod";

// ============================================================================
// IMPROVEMENT TYPE
// ============================================================================

export type ImprovementType = 
  | "weight"
  | "policy"
  | "confidence"
  | "threshold"
  | "strategy"
  | "recommendation"
  | "planning"
  | "priority"
  | "model"
  | "prompt";

// ============================================================================
// COMPARISON METRIC
// ============================================================================

export interface ComparisonMetric {
  expectedDecision: unknown;
  actualDecision: unknown;
  realResult: unknown;
  userFeedback: string;
  roi: number; // 0-1
  quality: number; // 0-1
  satisfaction: number; // 0-1
  timestamp: Date;
}

export const ComparisonMetricSchema = z.object({
  expectedDecision: z.unknown(),
  actualDecision: z.unknown(),
  realResult: z.unknown(),
  userFeedback: z.string(),
  roi: z.number(),
  quality: z.number(),
  satisfaction: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// IMPROVEMENT ACTION
// ============================================================================

export interface ImprovementAction {
  id: string;
  sessionId: string;
  type: ImprovementType;
  target: string;
  currentValue: unknown;
  newValue: unknown;
  reason: string;
  expectedImpact: number; // 0-1
  confidence: number; // 0-1
  status: "pending" | "applied" | "rejected" | "rolled_back";
  createdAt: Date;
  appliedAt: Date | null;
  result: string | null;
}

export const ImprovementActionSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  type: z.enum(["weight", "policy", "confidence", "threshold", "strategy", "recommendation", "planning", "priority", "model", "prompt"]),
  target: z.string(),
  currentValue: z.unknown(),
  newValue: z.unknown(),
  reason: z.string(),
  expectedImpact: z.number(),
  confidence: z.number(),
  status: z.enum(["pending", "applied", "rejected", "rolled_back"]),
  createdAt: z.date(),
  appliedAt: z.date().nullable(),
  result: z.string().nullable(),
});

// ============================================================================
// LEARNING EVENT
// ============================================================================

export interface LearningEvent {
  id: string;
  sessionId: string;
  eventType: "success" | "failure" | "improvement" | "degradation" | "discovery";
  description: string;
  context: Record<string, unknown>;
  metrics: ComparisonMetric;
  impact: number; // 0-1
  timestamp: Date;
}

export const LearningEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  eventType: z.enum(["success", "failure", "improvement", "degradation", "discovery"]),
  description: z.string(),
  context: z.record(z.string(), z.unknown()),
  metrics: z.lazy(() => ComparisonMetricSchema),
  impact: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// IMPROVEMENT SESSION
// ============================================================================

export interface ImprovementSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  comparison: ComparisonMetric;
  learningEvents: LearningEvent[];
  improvementActions: ImprovementAction[];
  overallImprovement: number; // 0-1
  status: "active" | "completed" | "failed";
}

export const ImprovementSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  comparison: z.lazy(() => ComparisonMetricSchema),
  learningEvents: z.array(z.lazy(() => LearningEventSchema)),
  improvementActions: z.array(z.lazy(() => ImprovementActionSchema)),
  overallImprovement: z.number(),
  status: z.enum(["active", "completed", "failed"]),
});

// ============================================================================
// IMPROVEMENT METRICS
// ============================================================================

export interface ImprovementMetrics {
  totalSessions: number;
  totalLearningEvents: number;
  totalImprovementActions: number;
  totalAppliedActions: number;
  totalRejectedActions: number;
  averageImprovement: number; // 0-1
  improvementByType: Record<string, number>;
  successRate: number;
  averageConfidence: number; // 0-1
}

export const ImprovementMetricsSchema = z.object({
  totalSessions: z.number(),
  totalLearningEvents: z.number(),
  totalImprovementActions: z.number(),
  totalAppliedActions: z.number(),
  totalRejectedActions: z.number(),
  averageImprovement: z.number(),
  improvementByType: z.record(z.string(), z.number()),
  successRate: z.number(),
  averageConfidence: z.number(),
});

// ============================================================================
// CONTINUOUS IMPROVEMENT ENGINE CONFIG
// ============================================================================

export interface ContinuousImprovementEngineConfig {
  enableAutoImprovement: boolean;
  enableAutoLearning: boolean;
  minConfidenceForAuto: number; // 0-1
  minImpactForAuto: number; // 0-1
  enableRollback: boolean;
  rollbackThreshold: number; // 0-1
  improvementInterval: number; // milliseconds
  enableMonitoring: boolean;
  monitoringDuration: number; // milliseconds
}

export const ContinuousImprovementEngineConfigSchema = z.object({
  enableAutoImprovement: z.boolean(),
  enableAutoLearning: z.boolean(),
  minConfidenceForAuto: z.number(),
  minImpactForAuto: z.number(),
  enableRollback: z.boolean(),
  rollbackThreshold: z.number(),
  improvementInterval: z.number(),
  enableMonitoring: z.boolean(),
  monitoringDuration: z.number(),
});

export const defaultContinuousImprovementEngineConfig: ContinuousImprovementEngineConfig = {
  enableAutoImprovement: false,
  enableAutoLearning: true,
  minConfidenceForAuto: 0.8,
  minImpactForAuto: 0.7,
  enableRollback: true,
  rollbackThreshold: 0.5,
  improvementInterval: 3600000, // 1 hour
  enableMonitoring: true,
  monitoringDuration: 86400000, // 24 hours
};
