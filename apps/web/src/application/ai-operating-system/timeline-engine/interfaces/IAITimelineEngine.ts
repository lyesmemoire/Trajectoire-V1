/**
 * AI Timeline Engine Interfaces
 * Complete timeline of all AI decisions and evolutions
 */

import { z } from "zod";

// ============================================================================
// TIMELINE EVENT TYPE
// ============================================================================

export type TimelineEventType = 
  | "simulation"
  | "recommendation"
  | "decision"
  | "error"
  | "improvement"
  | "strategy_change"
  | "reflection"
  | "memory"
  | "learning"
  | "evolution"
  | "user_action"
  | "system_event";

// ============================================================================
// TIMELINE EVENT
// ============================================================================

export interface TimelineEvent {
  id: string;
  userId: string;
  eventType: TimelineEventType;
  timestamp: Date;
  description: string;
  data: Record<string, unknown>;
  impact: number; // 0-1
  confidence: number; // 0-1
  relatedEvents: string[];
  metadata: Record<string, unknown>;
}

export const TimelineEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventType: z.enum(["simulation", "recommendation", "decision", "error", "improvement", "strategy_change", "reflection", "memory", "learning", "evolution", "user_action", "system_event"]),
  timestamp: z.date(),
  description: z.string(),
  data: z.record(z.string(), z.unknown()),
  impact: z.number(),
  confidence: z.number(),
  relatedEvents: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()),
});

// ============================================================================
// TIMELINE SEGMENT
// ============================================================================

export interface TimelineSegment {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  events: TimelineEvent[];
  summary: string;
  keyInsights: string[];
  evolution: string;
}

export const TimelineSegmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  events: z.array(z.lazy(() => TimelineEventSchema)),
  summary: z.string(),
  keyInsights: z.array(z.string()),
  evolution: z.string(),
});

// ============================================================================
// TIMELINE COMPARISON
// ============================================================================

export interface TimelineComparison {
  id: string;
  userId: string;
  segment1Id: string;
  segment2Id: string;
  similarities: string[];
  differences: string[];
  improvements: string[];
  degradations: string[];
  overallChange: number; // 0-1
  timestamp: Date;
}

export const TimelineComparisonSchema = z.object({
  id: z.string(),
  userId: z.string(),
  segment1Id: z.string(),
  segment2Id: z.string(),
  similarities: z.array(z.string()),
  differences: z.array(z.string()),
  improvements: z.array(z.string()),
  degradations: z.array(z.string()),
  overallChange: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// TIMELINE ANALYSIS
// ============================================================================

export interface TimelineAnalysis {
  id: string;
  userId: string;
  totalEvents: number;
  eventsByType: Record<string, number>;
  averageImpact: number; // 0-1
  averageConfidence: number; // 0-1
  trend: "improving" | "stable" | "degrading";
  keyPatterns: string[];
  recommendations: string[];
  timestamp: Date;
}

export const TimelineAnalysisSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalEvents: z.number(),
  eventsByType: z.record(z.string(), z.number()),
  averageImpact: z.number(),
  averageConfidence: z.number(),
  trend: z.enum(["improving", "stable", "degrading"]),
  keyPatterns: z.array(z.string()),
  recommendations: z.array(z.string()),
  timestamp: z.date(),
});

// ============================================================================
// TIMELINE METRICS
// ============================================================================

export interface TimelineMetrics {
  totalEvents: number;
  totalSegments: number;
  totalComparisons: number;
  totalAnalyses: number;
  averageEventsPerSegment: number;
  averageSegmentDuration: number; // milliseconds
  eventDistribution: Record<string, number>;
  userDistribution: Record<string, number>;
  averageImpact: number; // 0-1
  averageConfidence: number; // 0-1
}

export const TimelineMetricsSchema = z.object({
  totalEvents: z.number(),
  totalSegments: z.number(),
  totalComparisons: z.number(),
  totalAnalyses: z.number(),
  averageEventsPerSegment: z.number(),
  averageSegmentDuration: z.number(),
  eventDistribution: z.record(z.string(), z.number()),
  userDistribution: z.record(z.string(), z.number()),
  averageImpact: z.number(),
  averageConfidence: z.number(),
});

// ============================================================================
// AI TIMELINE ENGINE CONFIG
// ============================================================================

export interface AITimelineEngineConfig {
  segmentDuration: number; // milliseconds
  maxEventsPerSegment: number;
  enableAutoSegmentation: boolean;
  enableAutoAnalysis: boolean;
  enableAutoComparison: boolean;
  retentionDays: number;
}

export const AITimelineEngineConfigSchema = z.object({
  segmentDuration: z.number(),
  maxEventsPerSegment: z.number(),
  enableAutoSegmentation: z.boolean(),
  enableAutoAnalysis: z.boolean(),
  enableAutoComparison: z.boolean(),
  retentionDays: z.number(),
});

export const defaultAITimelineEngineConfig: AITimelineEngineConfig = {
  segmentDuration: 86400000, // 24 hours
  maxEventsPerSegment: 1000,
  enableAutoSegmentation: true,
  enableAutoAnalysis: true,
  enableAutoComparison: true,
  retentionDays: 365,
};
