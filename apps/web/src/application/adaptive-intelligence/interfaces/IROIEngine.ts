/**
 * ROI Engine Interfaces
 * Calculates return on investment for each action
 */

import { z } from "zod";

// ============================================================================
// ROI METRICS
// ============================================================================

export interface ROIMetrics {
  actionId: string;
  cost: number;
  value: number;
  roi: number;
  roiPercentage: number;
  timeToValue: number; // in minutes
  valueDuration: number; // in minutes
  valuePerMinute: number;
  costPerMinute: number;
}

export const ROIMetricsSchema = z.object({
  actionId: z.string(),
  cost: z.number(),
  value: z.number(),
  roi: z.number(),
  roiPercentage: z.number(),
  timeToValue: z.number(),
  valueDuration: z.number(),
  valuePerMinute: z.number(),
  costPerMinute: z.number(),
});

// ============================================================================
// ROI ANALYSIS
// ============================================================================

export interface ROIAnalysis {
  actionId: string;
  metrics: ROIMetrics;
  recommended: boolean;
  reason: string;
  alternative: string | null;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
}

export const ROIAnalysisSchema = z.object({
  actionId: z.string(),
  metrics: z.lazy(() => ROIMetricsSchema),
  recommended: z.boolean(),
  reason: z.string(),
  alternative: z.string().nullable(),
  confidence: z.number(),
  riskLevel: z.enum(["low", "medium", "high"]),
});

// ============================================================================
// ROI CONFIG
// ============================================================================

export interface ROIConfig {
  minROI: number;
  minROIPercentage: number;
  maxCost: number;
  maxTimeToValue: number;
  minValueDuration: number;
  riskTolerance: "low" | "medium" | "high";
  valueThreshold: number;
  costThreshold: number;
}

export const ROIConfigSchema = z.object({
  minROI: z.number(),
  minROIPercentage: z.number(),
  maxCost: z.number(),
  maxTimeToValue: z.number(),
  minValueDuration: z.number(),
  riskTolerance: z.enum(["low", "medium", "high"]),
  valueThreshold: z.number(),
  costThreshold: z.number(),
});

export const defaultROIConfig: ROIConfig = {
  minROI: 0.5, // Minimum absolute ROI
  minROIPercentage: 50, // Minimum ROI percentage
  maxCost: 0.10, // Maximum cost per action
  maxTimeToValue: 60, // Maximum time to realize value (minutes)
  minValueDuration: 30, // Minimum value duration (minutes)
  riskTolerance: "medium",
  valueThreshold: 0.7, // Minimum value score (0-1)
  costThreshold: 0.05, // Maximum cost threshold
};

// ============================================================================
// ROI HISTORY
// ============================================================================

export interface ROIHistory {
  actionId: string;
  metrics: ROIMetrics;
  analysis: ROIAnalysis;
  actualValue: number;
  expectedValue: number;
  accuracy: number;
  timestamp: Date;
}

export const ROIHistorySchema = z.object({
  actionId: z.string(),
  metrics: z.lazy(() => ROIMetricsSchema),
  analysis: z.lazy(() => ROIAnalysisSchema),
  actualValue: z.number(),
  expectedValue: z.number(),
  accuracy: z.number(),
  timestamp: z.date(),
});
