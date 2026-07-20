/**
 * Autonomous Optimization Engine Interfaces
 * Automatically detects and optimizes inefficiencies
 */

import { z } from "zod";

// ============================================================================
// OPTIMIZATION TYPE
// ============================================================================

export type OptimizationType = 
  | "remove"
  | "merge"
  | "replace"
  | "optimize"
  | "cache"
  | "compress"
  | "defer"
  | "parallelize"
  | "disable"
  | "rewrite";

// ============================================================================
// INEFFICIENCY TYPE
// ============================================================================

export type InefficiencyType = 
  | "slow_engine"
  | "useless_engine"
  | "double_calculation"
  | "ignored_recommendation"
  | "inefficient_journey"
  | "inefficient_prompt"
  | "overconsumption_openai"
  | "bad_ux"
  | "useless_screen"
  | "ignored_notification"
  | "unused_feature"
  | "unnecessary_cost";

// ============================================================================
// INEFFICIENCY
// ============================================================================

export interface Inefficiency {
  id: string;
  type: InefficiencyType;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string; // engine, screen, feature, etc.
  impact: number; // 0-1
  frequency: number; // occurrences per day
  cost: number; // dollars per day
  detectedAt: Date;
  evidence: string[];
}

export const InefficiencySchema = z.object({
  id: z.string(),
  type: z.enum(["slow_engine", "useless_engine", "double_calculation", "ignored_recommendation", "inefficient_journey", "inefficient_prompt", "overconsumption_openai", "bad_ux", "useless_screen", "ignored_notification", "unused_feature", "unnecessary_cost"]),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  location: z.string(),
  impact: z.number(),
  frequency: z.number(),
  cost: z.number(),
  detectedAt: z.date(),
  evidence: z.array(z.string()),
});

// ============================================================================
// OPTIMIZATION PROPOSAL
// ============================================================================

export interface OptimizationProposal {
  id: string;
  inefficiencyId: string;
  type: OptimizationType;
  description: string;
  target: string;
  action: string;
  expectedImprovement: number; // 0-1
  expectedSavings: number; // dollars per day
  effort: number; // 0-1
  priority: number; // 0-100
  risk: number; // 0-1
  status: "pending" | "in_progress" | "implemented" | "rejected" | "rolled_back";
  createdAt: Date;
  implementedAt: Date | null;
  result: string | null;
}

export const OptimizationProposalSchema = z.object({
  id: z.string(),
  inefficiencyId: z.string(),
  type: z.enum(["remove", "merge", "replace", "optimize", "cache", "compress", "defer", "parallelize", "disable", "rewrite"]),
  description: z.string(),
  target: z.string(),
  action: z.string(),
  expectedImprovement: z.number(),
  expectedSavings: z.number(),
  effort: z.number(),
  priority: z.number(),
  risk: z.number(),
  status: z.enum(["pending", "in_progress", "implemented", "rejected", "rolled_back"]),
  createdAt: z.date(),
  implementedAt: z.date().nullable(),
  result: z.string().nullable(),
});

// ============================================================================
// OPTIMIZATION RESULT
// ============================================================================

export interface OptimizationResult {
  id: string;
  proposalId: string;
  actualImprovement: number; // 0-1
  actualSavings: number; // dollars per day
  sideEffects: string[];
  userImpact: number; // 0-1
  timestamp: Date;
}

export const OptimizationResultSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  actualImprovement: z.number(),
  actualSavings: z.number(),
  sideEffects: z.array(z.string()),
  userImpact: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// OPTIMIZATION METRICS
// ============================================================================

export interface OptimizationMetrics {
  totalInefficiencies: number;
  totalProposals: number;
  totalImplemented: number;
  totalRejected: number;
  totalSavings: number; // dollars
  averageImprovement: number; // 0-1
  inefficiencyDistribution: Record<string, number>;
  proposalDistribution: Record<string, number>;
  successRate: number;
}

export const OptimizationMetricsSchema = z.object({
  totalInefficiencies: z.number(),
  totalProposals: z.number(),
  totalImplemented: z.number(),
  totalRejected: z.number(),
  totalSavings: z.number(),
  averageImprovement: z.number(),
  inefficiencyDistribution: z.record(z.string(), z.number()),
  proposalDistribution: z.record(z.string(), z.number()),
  successRate: z.number(),
});

// ============================================================================
// AUTONOMOUS OPTIMIZATION ENGINE CONFIG
// ============================================================================

export interface AutonomousOptimizationEngineConfig {
  enableAutoDetection: boolean;
  enableAutoImplementation: boolean;
  detectionInterval: number; // milliseconds
  maxAutoRisk: number; // 0-1
  minPriorityForAuto: number; // 0-100
  enableRollback: boolean;
  rollbackThreshold: number; // 0-1
  enableMonitoring: boolean;
  monitoringDuration: number; // milliseconds
}

export const AutonomousOptimizationEngineConfigSchema = z.object({
  enableAutoDetection: z.boolean(),
  enableAutoImplementation: z.boolean(),
  detectionInterval: z.number(),
  maxAutoRisk: z.number(),
  minPriorityForAuto: z.number(),
  enableRollback: z.boolean(),
  rollbackThreshold: z.number(),
  enableMonitoring: z.boolean(),
  monitoringDuration: z.number(),
});

export const defaultAutonomousOptimizationEngineConfig: AutonomousOptimizationEngineConfig = {
  enableAutoDetection: true,
  enableAutoImplementation: false,
  detectionInterval: 3600000, // 1 hour
  maxAutoRisk: 0.3,
  minPriorityForAuto: 80,
  enableRollback: true,
  rollbackThreshold: 0.5,
  enableMonitoring: true,
  monitoringDuration: 86400000, // 24 hours
};
