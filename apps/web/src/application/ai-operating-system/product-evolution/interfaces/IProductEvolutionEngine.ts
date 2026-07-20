/**
 * Autonomous Product Evolution Engine Interfaces
 * Automatically generates product roadmap and improvements
 */

import { z } from "zod";

// ============================================================================
// EVOLUTION PRIORITY
// ============================================================================

export type EvolutionPriority = "critical" | "high" | "medium" | "low";

// ============================================================================
// EVOLUTION TYPE
// ============================================================================

export type EvolutionType = 
  | "feature_create"
  | "feature_remove"
  | "feature_improve"
  | "prompt_modify"
  | "ai_improve"
  | "ux_simplify"
  | "architecture_optimize"
  | "technical_debt"
  | "bug_fix"
  | "performance";

// ============================================================================
// PRODUCT ANALYSIS
// ============================================================================

export interface ProductAnalysis {
  id: string;
  timestamp: Date;
  users: {
    total: number;
    active: number;
    new: number;
    churned: number;
  };
  conversions: {
    total: number;
    rate: number; // 0-1
    bySource: Record<string, number>;
  };
  abandons: {
    total: number;
    rate: number; // 0-1
    byStage: Record<string, number>;
  };
  feedback: {
    total: number;
    averageRating: number; // 0-5
    sentiment: number; // 0-1
    topIssues: string[];
  };
  prompts: {
    total: number;
    averageCost: number; // dollars
    averageLatency: number; // milliseconds
    topPrompts: string[];
  };
  ai: {
    averageConfidence: number; // 0-1
    averageAccuracy: number; // 0-1
    errorRate: number; // 0-1
  };
  ux: {
    averageSessionDuration: number; // milliseconds
    averagePageViews: number;
    bounceRate: number; // 0-1
  };
  costs: {
    total: number; // dollars
    byComponent: Record<string, number>;
  };
  performance: {
    averageResponseTime: number; // milliseconds
    errorRate: number; // 0-1
    uptime: number; // 0-1
  };
}

export const ProductAnalysisSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  users: z.object({
    total: z.number(),
    active: z.number(),
    new: z.number(),
    churned: z.number(),
  }),
  conversions: z.object({
    total: z.number(),
    rate: z.number(),
    bySource: z.record(z.string(), z.number()),
  }),
  abandons: z.object({
    total: z.number(),
    rate: z.number(),
    byStage: z.record(z.string(), z.number()),
  }),
  feedback: z.object({
    total: z.number(),
    averageRating: z.number(),
    sentiment: z.number(),
    topIssues: z.array(z.string()),
  }),
  prompts: z.object({
    total: z.number(),
    averageCost: z.number(),
    averageLatency: z.number(),
    topPrompts: z.array(z.string()),
  }),
  ai: z.object({
    averageConfidence: z.number(),
    averageAccuracy: z.number(),
    errorRate: z.number(),
  }),
  ux: z.object({
    averageSessionDuration: z.number(),
    averagePageViews: z.number(),
    bounceRate: z.number(),
  }),
  costs: z.object({
    total: z.number(),
    byComponent: z.record(z.string(), z.number()),
  }),
  performance: z.object({
    averageResponseTime: z.number(),
    errorRate: z.number(),
    uptime: z.number(),
  }),
});

// ============================================================================
// EVOLUTION ITEM
// ============================================================================

export interface EvolutionItem {
  id: string;
  type: EvolutionType;
  title: string;
  description: string;
  priority: EvolutionPriority;
  estimatedEffort: number; // 0-1
  expectedROI: number; // 0-1
  expectedImpact: number; // 0-1
  status: "proposed" | "in_progress" | "completed" | "rejected";
  createdAt: Date;
  completedAt: Date | null;
  result: string | null;
}

export const EvolutionItemSchema = z.object({
  id: z.string(),
  type: z.enum(["feature_create", "feature_remove", "feature_improve", "prompt_modify", "ai_improve", "ux_simplify", "architecture_optimize", "technical_debt", "bug_fix", "performance"]),
  title: z.string(),
  description: z.string(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  estimatedEffort: z.number(),
  expectedROI: z.number(),
  expectedImpact: z.number(),
  status: z.enum(["proposed", "in_progress", "completed", "rejected"]),
  createdAt: z.date(),
  completedAt: z.date().nullable(),
  result: z.string().nullable(),
});

// ============================================================================
// PRODUCT ROADMAP
// ============================================================================

export interface ProductRoadmap {
  id: string;
  week: string;
  startDate: Date;
  endDate: Date;
  topPriorities: EvolutionItem[];
  featuresToRemove: EvolutionItem[];
  featuresToCreate: EvolutionItem[];
  promptsToModify: EvolutionItem[];
  aiToImprove: EvolutionItem[];
  uxToSimplify: EvolutionItem[];
  architectureToOptimize: EvolutionItem[];
  technicalDebt: EvolutionItem[];
  bugFixes: EvolutionItem[];
  performanceImprovements: EvolutionItem[];
  summary: string;
  expectedROI: number; // 0-1
  expectedImpact: number; // 0-1
  totalEffort: number; // 0-1
}

export const ProductRoadmapSchema = z.object({
  id: z.string(),
  week: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  topPriorities: z.array(z.lazy(() => EvolutionItemSchema)),
  featuresToRemove: z.array(z.lazy(() => EvolutionItemSchema)),
  featuresToCreate: z.array(z.lazy(() => EvolutionItemSchema)),
  promptsToModify: z.array(z.lazy(() => EvolutionItemSchema)),
  aiToImprove: z.array(z.lazy(() => EvolutionItemSchema)),
  uxToSimplify: z.array(z.lazy(() => EvolutionItemSchema)),
  architectureToOptimize: z.array(z.lazy(() => EvolutionItemSchema)),
  technicalDebt: z.array(z.lazy(() => EvolutionItemSchema)),
  bugFixes: z.array(z.lazy(() => EvolutionItemSchema)),
  performanceImprovements: z.array(z.lazy(() => EvolutionItemSchema)),
  summary: z.string(),
  expectedROI: z.number(),
  expectedImpact: z.number(),
  totalEffort: z.number(),
});

// ============================================================================
// EVOLUTION METRICS
// ============================================================================

export interface EvolutionMetrics {
  totalRoadmaps: number;
  totalEvolutionItems: number;
  totalCompletedItems: number;
  totalRejectedItems: number;
  averageROI: number; // 0-1
  averageImpact: number; // 0-1
  averageEffort: number; // 0-1
  itemsByType: Record<string, number>;
  itemsByPriority: Record<string, number>;
  successRate: number;
}

export const EvolutionMetricsSchema = z.object({
  totalRoadmaps: z.number(),
  totalEvolutionItems: z.number(),
  totalCompletedItems: z.number(),
  totalRejectedItems: z.number(),
  averageROI: z.number(),
  averageImpact: z.number(),
  averageEffort: z.number(),
  itemsByType: z.record(z.string(), z.number()),
  itemsByPriority: z.record(z.string(), z.number()),
  successRate: z.number(),
});

// ============================================================================
// PRODUCT EVOLUTION ENGINE CONFIG
// ============================================================================

export interface ProductEvolutionEngineConfig {
  enableAutoGeneration: boolean;
  generationInterval: number; // milliseconds
  minPriorityForRoadmap: EvolutionPriority;
  maxItemsPerRoadmap: number;
  enableAutoImplementation: boolean;
  implementationThreshold: number; // 0-1
  enableMonitoring: boolean;
  monitoringDuration: number; // milliseconds
}

export const ProductEvolutionEngineConfigSchema = z.object({
  enableAutoGeneration: z.boolean(),
  generationInterval: z.number(),
  minPriorityForRoadmap: z.enum(["critical", "high", "medium", "low"]),
  maxItemsPerRoadmap: z.number(),
  enableAutoImplementation: z.boolean(),
  implementationThreshold: z.number(),
  enableMonitoring: z.boolean(),
  monitoringDuration: z.number(),
});

export const defaultProductEvolutionEngineConfig: ProductEvolutionEngineConfig = {
  enableAutoGeneration: false,
  generationInterval: 604800000, // 7 days
  minPriorityForRoadmap: "medium",
  maxItemsPerRoadmap: 20,
  enableAutoImplementation: false,
  implementationThreshold: 0.8,
  enableMonitoring: true,
  monitoringDuration: 1209600000, // 14 days
};
