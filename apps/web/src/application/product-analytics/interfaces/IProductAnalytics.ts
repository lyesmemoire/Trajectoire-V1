/**
 * Product Analytics Interfaces
 * Administrator dashboard for product intelligence
 */

import { z } from "zod";

// ============================================================================
// TIME RANGE
// ============================================================================

export type TimeRange = "hour" | "day" | "week" | "month" | "year" | "all";

// ============================================================================
// ENGAGEMENT METRICS
// ============================================================================

export interface EngagementMetrics {
  totalUsers: number;
  activeUsers: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  sessionsPerUser: number;
  retentionRate: number;
  churnRate: number;
}

export const EngagementMetricsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  dailyActiveUsers: z.number(),
  weeklyActiveUsers: z.number(),
  monthlyActiveUsers: z.number(),
  averageSessionDuration: z.number(),
  sessionsPerUser: z.number(),
  retentionRate: z.number(),
  churnRate: z.number(),
});

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

export interface PerformanceMetrics {
  averageScore: number;
  scoreDistribution: Record<string, number>;
  completionRate: number;
  averageResponseTime: number;
  averageStressLevel: number;
  averageConfidenceLevel: number;
  improvementRate: number;
  successRate: number;
}

export const PerformanceMetricsSchema = z.object({
  averageScore: z.number(),
  scoreDistribution: z.record(z.string(), z.number()),
  completionRate: z.number(),
  averageResponseTime: z.number(),
  averageStressLevel: z.number(),
  averageConfidenceLevel: z.number(),
  improvementRate: z.number(),
  successRate: z.number(),
});

// ============================================================================
// COST METRICS
// ============================================================================

export interface CostMetrics {
  totalOpenAICost: number;
  costPerSession: number;
  costPerUser: number;
  tokenUsage: number;
  modelDistribution: Record<string, number>;
  costTrend: "increasing" | "stable" | "decreasing";
  roi: number;
}

export const CostMetricsSchema = z.object({
  totalOpenAICost: z.number(),
  costPerSession: z.number(),
  costPerUser: z.number(),
  tokenUsage: z.number(),
  modelDistribution: z.record(z.string(), z.number()),
  costTrend: z.enum(["increasing", "stable", "decreasing"]),
  roi: z.number(),
});

// ============================================================================
// ENGINE USAGE METRICS
// ============================================================================

export interface EngineUsageMetrics {
  engineUsage: Record<string, number>;
  engineSuccessRate: Record<string, number>;
  engineLatency: Record<string, number>;
  engineCost: Record<string, number>;
  mostUsedEngines: string[];
  leastUsedEngines: string[];
}

export const EngineUsageMetricsSchema = z.object({
  engineUsage: z.record(z.string(), z.number()),
  engineSuccessRate: z.record(z.string(), z.number()),
  engineLatency: z.record(z.string(), z.number()),
  engineCost: z.record(z.string(), z.number()),
  mostUsedEngines: z.array(z.string()),
  leastUsedEngines: z.array(z.string()),
});

// ============================================================================
// PRODUCT ANALYTICS DATA
// ============================================================================

export interface ProductAnalyticsData {
  timeRange: TimeRange;
  startDate: Date;
  endDate: Date;
  engagement: EngagementMetrics;
  performance: PerformanceMetrics;
  costs: CostMetrics;
  engineUsage: EngineUsageMetrics;
  generatedAt: Date;
}

export const ProductAnalyticsDataSchema = z.object({
  timeRange: z.enum(["hour", "day", "week", "month", "year", "all"]),
  startDate: z.date(),
  endDate: z.date(),
  engagement: z.lazy(() => EngagementMetricsSchema),
  performance: z.lazy(() => PerformanceMetricsSchema),
  costs: z.lazy(() => CostMetricsSchema),
  engineUsage: z.lazy(() => EngineUsageMetricsSchema),
  generatedAt: z.date(),
});

// ============================================================================
// PRODUCT ANALYTICS CONFIG
// ============================================================================

export interface ProductAnalyticsConfig {
  cacheDuration: number; // minutes
  maxDataPoints: number;
  aggregationInterval: number; // minutes
  includeHistoricalComparison: boolean;
  includePredictions: boolean;
}

export const ProductAnalyticsConfigSchema = z.object({
  cacheDuration: z.number(),
  maxDataPoints: z.number(),
  aggregationInterval: z.number(),
  includeHistoricalComparison: z.boolean(),
  includePredictions: z.boolean(),
});

export const defaultProductAnalyticsConfig: ProductAnalyticsConfig = {
  cacheDuration: 60,
  maxDataPoints: 1000,
  aggregationInterval: 60,
  includeHistoricalComparison: true,
  includePredictions: false,
};
