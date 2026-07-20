/**
 * Meta Cognition Engine Interfaces
 * Self-monitoring of intelligence
 */

import { z } from "zod";

// ============================================================================
// METRIC TYPE
// ============================================================================

export type MetricType = 
  | "quality"
  | "coherence"
  | "cost"
  | "speed"
  | "utility"
  | "relevance"
  | "confidence"
  | "explainability"
  | "impact"
  | "openai_consumption"
  | "supabase_consumption"
  | "complexity";

// ============================================================================
// METRIC VALUE
// ============================================================================

export interface MetricValue {
  type: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  threshold: number;
  status: "good" | "warning" | "critical";
}

export const MetricValueSchema = z.object({
  type: z.enum(["quality", "coherence", "cost", "speed", "utility", "relevance", "confidence", "explainability", "impact", "openai_consumption", "supabase_consumption", "complexity"]),
  value: z.number(),
  unit: z.string(),
  timestamp: z.date(),
  threshold: z.number(),
  status: z.enum(["good", "warning", "critical"]),
});

// ============================================================================
// IMPROVEMENT PROPOSAL
// ============================================================================

export interface ImprovementProposal {
  id: string;
  metricType: MetricType;
  currentValue: number;
  targetValue: number;
  description: string;
  strategy: string;
  expectedImpact: number; // 0-1
  effort: number; // 0-1
  priority: number; // 0-100
  status: "pending" | "in_progress" | "implemented" | "rejected";
  createdAt: Date;
}

export const ImprovementProposalSchema = z.object({
  id: z.string(),
  metricType: z.enum(["quality", "coherence", "cost", "speed", "utility", "relevance", "confidence", "explainability", "impact", "openai_consumption", "supabase_consumption", "complexity"]),
  currentValue: z.number(),
  targetValue: z.number(),
  description: z.string(),
  strategy: z.string(),
  expectedImpact: z.number(),
  effort: z.number(),
  priority: z.number(),
  status: z.enum(["pending", "in_progress", "implemented", "rejected"]),
  createdAt: z.date(),
});

// ============================================================================
// SELF MONITORING REPORT
// ============================================================================

export interface SelfMonitoringReport {
  id: string;
  timestamp: Date;
  metrics: MetricValue[];
  overallHealth: number; // 0-1
  healthStatus: "healthy" | "degraded" | "critical";
  improvementProposals: ImprovementProposal[];
  trends: Record<string, "improving" | "stable" | "degrading">;
  alerts: string[];
  summary: string;
}

export const SelfMonitoringReportSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  metrics: z.array(z.lazy(() => MetricValueSchema)),
  overallHealth: z.number(),
  healthStatus: z.enum(["healthy", "degraded", "critical"]),
  improvementProposals: z.array(z.lazy(() => ImprovementProposalSchema)),
  trends: z.record(z.string(), z.enum(["improving", "stable", "degrading"])),
  alerts: z.array(z.string()),
  summary: z.string(),
});

// ============================================================================
// ENGINE PERFORMANCE
// ============================================================================

export interface EnginePerformance {
  engineId: string;
  quality: number; // 0-1
  coherence: number; // 0-1
  cost: number;
  speed: number; // milliseconds
  utility: number; // 0-1
  relevance: number; // 0-1
  confidence: number; // 0-1
  explainability: number; // 0-1
  impact: number; // 0-1
  complexity: number; // 0-1
  lastUpdated: Date;
}

export const EnginePerformanceSchema = z.object({
  engineId: z.string(),
  quality: z.number(),
  coherence: z.number(),
  cost: z.number(),
  speed: z.number(),
  utility: z.number(),
  relevance: z.number(),
  confidence: z.number(),
  explainability: z.number(),
  impact: z.number(),
  complexity: z.number(),
  lastUpdated: z.date(),
});

// ============================================================================
// SYSTEM PERFORMANCE
// ============================================================================

export interface SystemPerformance {
  openaiConsumption: number; // tokens
  openaiCost: number; // dollars
  supabaseConsumption: number; // requests
  supabaseCost: number; // dollars
  totalCost: number; // dollars
  averageResponseTime: number; // milliseconds
  uptime: number; // 0-1
  errorRate: number; // 0-1
  timestamp: Date;
}

export const SystemPerformanceSchema = z.object({
  openaiConsumption: z.number(),
  openaiCost: z.number(),
  supabaseConsumption: z.number(),
  supabaseCost: z.number(),
  totalCost: z.number(),
  averageResponseTime: z.number(),
  uptime: z.number(),
  errorRate: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// META COGNITION CONFIG
// ============================================================================

export interface MetaCognitionConfig {
  monitoringInterval: number; // milliseconds
  metricRetentionDays: number;
  alertThreshold: number; // 0-1
  autoGenerateProposals: boolean;
  maxProposalsPerReport: number;
  enableTrendAnalysis: boolean;
  enableAlerting: boolean;
}

export const MetaCognitionConfigSchema = z.object({
  monitoringInterval: z.number(),
  metricRetentionDays: z.number(),
  alertThreshold: z.number(),
  autoGenerateProposals: z.boolean(),
  maxProposalsPerReport: z.number(),
  enableTrendAnalysis: z.boolean(),
  enableAlerting: z.boolean(),
});

export const defaultMetaCognitionConfig: MetaCognitionConfig = {
  monitoringInterval: 60000, // 1 minute
  metricRetentionDays: 30,
  alertThreshold: 0.3,
  autoGenerateProposals: true,
  maxProposalsPerReport: 5,
  enableTrendAnalysis: true,
  enableAlerting: true,
};
