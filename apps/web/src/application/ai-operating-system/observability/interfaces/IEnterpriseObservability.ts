/**
 * Enterprise Observability Platform Interfaces
 * Centralized observability for all AI operations
 */

import { z } from "zod";

// ============================================================================
// OBSERVABILITY GRAPH TYPE
// ============================================================================

export type ObservabilityGraphType = 
  | "decision"
  | "engine"
  | "cost"
  | "memory"
  | "reasoning"
  | "reflection"
  | "policy"
  | "learning"
  | "health"
  | "impact";

// ============================================================================
// OBSERVABILITY DATA POINT
// ============================================================================

export interface ObservabilityDataPoint {
  id: string;
  graphType: ObservabilityGraphType;
  timestamp: Date;
  value: number;
  label: string;
  metadata: Record<string, unknown>;
}

export const ObservabilityDataPointSchema = z.object({
  id: z.string(),
  graphType: z.enum(["decision", "engine", "cost", "memory", "reasoning", "reflection", "policy", "learning", "health", "impact"]),
  timestamp: z.date(),
  value: z.number(),
  label: z.string(),
  metadata: z.record(z.string(), z.unknown()),
});

// ============================================================================
// OBSERVABILITY TRACE
// ============================================================================

export interface ObservabilityTrace {
  id: string;
  traceId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // milliseconds
  spans: ObservabilitySpan[];
  status: "active" | "completed" | "failed";
  metadata: Record<string, unknown>;
}

export const ObservabilityTraceSchema = z.object({
  id: z.string(),
  traceId: z.string(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  duration: z.number(),
  spans: z.array(z.lazy(() => ObservabilitySpanSchema)),
  status: z.enum(["active", "completed", "failed"]),
  metadata: z.record(z.string(), z.unknown()),
});

// ============================================================================
// OBSERVABILITY SPAN
// ============================================================================

export interface ObservabilitySpan {
  id: string;
  traceId: string;
  parentId: string | null;
  operationName: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // milliseconds
  status: "active" | "completed" | "failed";
  tags: Record<string, string>;
  logs: string[];
}

export const ObservabilitySpanSchema = z.object({
  id: z.string(),
  traceId: z.string(),
  parentId: z.string().nullable(),
  operationName: z.string(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  duration: z.number(),
  status: z.enum(["active", "completed", "failed"]),
  tags: z.record(z.string(), z.string()),
  logs: z.array(z.string()),
});

// ============================================================================
// OBSERVABILITY LOG
// ============================================================================

export interface ObservabilityLog {
  id: string;
  timestamp: Date;
  level: "debug" | "info" | "warn" | "error" | "fatal";
  component: string;
  message: string;
  context: Record<string, unknown>;
  traceId: string | null;
}

export const ObservabilityLogSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  level: z.enum(["debug", "info", "warn", "error", "fatal"]),
  component: z.string(),
  message: z.string(),
  context: z.record(z.string(), z.unknown()),
  traceId: z.string().nullable(),
});

// ============================================================================
// OBSERVABILITY METRIC
// ============================================================================

export interface ObservabilityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  labels: Record<string, string>;
}

export const ObservabilityMetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  timestamp: z.date(),
  labels: z.record(z.string(), z.string()),
});

// ============================================================================
// OBSERVABILITY DASHBOARD
// ============================================================================

export interface ObservabilityDashboard {
  id: string;
  name: string;
  graphs: ObservabilityGraphType[];
  timeRange: string;
  filters: Record<string, unknown>;
  lastUpdated: Date;
}

export const ObservabilityDashboardSchema = z.object({
  id: z.string(),
  name: z.string(),
  graphs: z.array(z.enum(["decision", "engine", "cost", "memory", "reasoning", "reflection", "policy", "learning", "health", "impact"])),
  timeRange: z.string(),
  filters: z.record(z.string(), z.unknown()),
  lastUpdated: z.date(),
});

// ============================================================================
// OBSERVABILITY METRICS SUMMARY
// ============================================================================

export interface ObservabilityMetricsSummary {
  totalTraces: number;
  totalSpans: number;
  totalLogs: number;
  totalMetrics: number;
  averageTraceDuration: number; // milliseconds
  errorRate: number; // 0-1
  successRate: number; // 0-1
  averageCost: number; // dollars
  averageLatency: number; // milliseconds
}

export const ObservabilityMetricsSummarySchema = z.object({
  totalTraces: z.number(),
  totalSpans: z.number(),
  totalLogs: z.number(),
  totalMetrics: z.number(),
  averageTraceDuration: z.number(),
  errorRate: z.number(),
  successRate: z.number(),
  averageCost: z.number(),
  averageLatency: z.number(),
});

// ============================================================================
// ENTERPRISE OBSERVABILITY CONFIG
// ============================================================================

export interface EnterpriseObservabilityConfig {
  enableTracing: boolean;
  enableLogging: boolean;
  enableMetrics: boolean;
  traceRetentionDays: number;
  logRetentionDays: number;
  metricRetentionDays: number;
  enableRealTime: boolean;
  samplingRate: number; // 0-1
}

export const EnterpriseObservabilityConfigSchema = z.object({
  enableTracing: z.boolean(),
  enableLogging: z.boolean(),
  enableMetrics: z.boolean(),
  traceRetentionDays: z.number(),
  logRetentionDays: z.number(),
  metricRetentionDays: z.number(),
  enableRealTime: z.boolean(),
  samplingRate: z.number(),
});

export const defaultEnterpriseObservabilityConfig: EnterpriseObservabilityConfig = {
  enableTracing: true,
  enableLogging: true,
  enableMetrics: true,
  traceRetentionDays: 7,
  logRetentionDays: 30,
  metricRetentionDays: 30,
  enableRealTime: true,
  samplingRate: 1.0,
};
