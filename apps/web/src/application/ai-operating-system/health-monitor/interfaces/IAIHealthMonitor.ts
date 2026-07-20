/**
 * AI Health Monitor Interfaces
 * Real-time monitoring of all AI components
 */

import { z } from "zod";

// ============================================================================
// HEALTH SCORE TYPE
// ============================================================================

export type HealthScoreType = 
  | "global_intelligence"
  | "reasoning"
  | "memory"
  | "planning"
  | "conversation"
  | "recommendation"
  | "reflection"
  | "cost"
  | "product"
  | "execution"
  | "governance"
  | "optimization"
  | "explainability";

// ============================================================================
// HEALTH STATUS
// ============================================================================

export type HealthStatus = "healthy" | "degraded" | "critical" | "unknown";

// ============================================================================
// COMPONENT HEALTH
// ============================================================================

export interface ComponentHealth {
  componentId: string;
  componentName: string;
  status: HealthStatus;
  score: number; // 0-1
  metrics: Record<string, number>;
  lastUpdated: Date;
  issues: string[];
  warnings: string[];
}

export const ComponentHealthSchema = z.object({
  componentId: z.string(),
  componentName: z.string(),
  status: z.enum(["healthy", "degraded", "critical", "unknown"]),
  score: z.number(),
  metrics: z.record(z.string(), z.number()),
  lastUpdated: z.date(),
  issues: z.array(z.string()),
  warnings: z.array(z.string()),
});

// ============================================================================
// HEALTH SNAPSHOT
// ============================================================================

export interface HealthSnapshot {
  id: string;
  timestamp: Date;
  globalIntelligenceScore: number;
  reasoningScore: number;
  memoryScore: number;
  planningScore: number;
  conversationScore: number;
  recommendationScore: number;
  reflectionScore: number;
  costScore: number;
  productScore: number;
  executionScore: number;
  governanceScore: number;
  optimizationScore: number;
  explainabilityScore: number;
  overallHealth: number; // 0-1
  healthStatus: HealthStatus;
  componentHealth: Map<string, ComponentHealth>;
}

export const HealthSnapshotSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  globalIntelligenceScore: z.number(),
  reasoningScore: z.number(),
  memoryScore: z.number(),
  planningScore: z.number(),
  conversationScore: z.number(),
  recommendationScore: z.number(),
  reflectionScore: z.number(),
  costScore: z.number(),
  productScore: z.number(),
  executionScore: z.number(),
  governanceScore: z.number(),
  optimizationScore: z.number(),
  explainabilityScore: z.number(),
  overallHealth: z.number(),
  healthStatus: z.enum(["healthy", "degraded", "critical", "unknown"]),
  componentHealth: z.any(), // Map serialization handled separately
});

// ============================================================================
// HEALTH ALERT
// ============================================================================

export interface HealthAlert {
  id: string;
  severity: "info" | "warning" | "error" | "critical";
  componentId: string;
  componentName: string;
  message: string;
  details: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt: Date | null;
}

export const HealthAlertSchema = z.object({
  id: z.string(),
  severity: z.enum(["info", "warning", "error", "critical"]),
  componentId: z.string(),
  componentName: z.string(),
  message: z.string(),
  details: z.string(),
  timestamp: z.date(),
  acknowledged: z.boolean(),
  resolved: z.boolean(),
  resolvedAt: z.date().nullable(),
});

// ============================================================================
// HEALTH TREND
// ============================================================================

export interface HealthTrend {
  scoreType: HealthScoreType;
  currentValue: number;
  previousValue: number;
  trend: "improving" | "stable" | "degrading";
  changePercentage: number;
  timeRange: string;
  timestamp: Date;
}

export const HealthTrendSchema = z.object({
  scoreType: z.enum(["global_intelligence", "reasoning", "memory", "planning", "conversation", "recommendation", "reflection", "cost", "product", "execution", "governance", "optimization", "explainability"]),
  currentValue: z.number(),
  previousValue: z.number(),
  trend: z.enum(["improving", "stable", "degrading"]),
  changePercentage: z.number(),
  timeRange: z.string(),
  timestamp: z.date(),
});

// ============================================================================
// HEALTH METRICS
// ============================================================================

export interface HealthMetrics {
  totalSnapshots: number;
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  averageHealth: number; // 0-1
  healthDistribution: Record<string, number>;
  trendDistribution: Record<string, number>;
  uptime: number; // 0-1
  averageResponseTime: number; // milliseconds
}

export const HealthMetricsSchema = z.object({
  totalSnapshots: z.number(),
  totalAlerts: z.number(),
  activeAlerts: z.number(),
  resolvedAlerts: z.number(),
  averageHealth: z.number(),
  healthDistribution: z.record(z.string(), z.number()),
  trendDistribution: z.record(z.string(), z.number()),
  uptime: z.number(),
  averageResponseTime: z.number(),
});

// ============================================================================
// AI HEALTH MONITOR CONFIG
// ============================================================================

export interface AIHealthMonitorConfig {
  monitoringInterval: number; // milliseconds
  snapshotRetentionDays: number;
  alertRetentionDays: number;
  enableAutoAlerts: boolean;
  enableTrendAnalysis: boolean;
  healthThresholds: {
    healthy: number; // 0-1
    degraded: number; // 0-1
    critical: number; // 0-1
  };
}

export const AIHealthMonitorConfigSchema = z.object({
  monitoringInterval: z.number(),
  snapshotRetentionDays: z.number(),
  alertRetentionDays: z.number(),
  enableAutoAlerts: z.boolean(),
  enableTrendAnalysis: z.boolean(),
  healthThresholds: z.object({
    healthy: z.number(),
    degraded: z.number(),
    critical: z.number(),
  }),
});

export const defaultAIHealthMonitorConfig: AIHealthMonitorConfig = {
  monitoringInterval: 60000, // 1 minute
  snapshotRetentionDays: 30,
  alertRetentionDays: 90,
  enableAutoAlerts: true,
  enableTrendAnalysis: true,
  healthThresholds: {
    healthy: 0.8,
    degraded: 0.5,
    critical: 0.3,
  },
};
