/**
 * Cost Optimization Engine Interfaces
 * Manages OpenAI costs, tokens, ROI and optimizes model choices
 */

import { z } from "zod";

// ============================================================================
// MODEL OPTIONS
// ============================================================================

export type ModelType = "gpt-3.5-turbo" | "gpt-4" | "gpt-4-turbo" | "gpt-5" | "custom";

export interface ModelCost {
  model: ModelType;
  inputCostPerToken: number; // USD per 1K tokens
  outputCostPerToken: number; // USD per 1K tokens
  maxTokens: number;
  latency: number; // Average latency in ms
  quality: number; // 0-1 quality score
  streaming: boolean;
  caching: boolean;
}

export const ModelCostSchema = z.object({
  model: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-5", "custom"]),
  inputCostPerToken: z.number(),
  outputCostPerToken: z.number(),
  maxTokens: z.number(),
  latency: z.number(),
  quality: z.number(),
  streaming: z.boolean(),
  caching: z.boolean(),
});

// ============================================================================
// COST ESTIMATION
// ============================================================================

export interface CostEstimation {
  model: ModelType;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  estimatedTime: number;
  qualityScore: number;
}

export const CostEstimationSchema = z.object({
  model: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-5", "custom"]),
  inputTokens: z.number(),
  outputTokens: z.number(),
  totalTokens: z.number(),
  inputCost: z.number(),
  outputCost: z.number(),
  totalCost: z.number(),
  estimatedTime: z.number(),
  qualityScore: z.number(),
});

// ============================================================================
// ROI CALCULATION
// ============================================================================

export interface ROICalculation {
  actionId: string;
  cost: number;
  expectedValue: number;
  roi: number; // Return on Investment
  roiPercentage: number;
  breakEven: boolean;
  recommended: boolean;
  reasoning: string;
}

export const ROICalculationSchema = z.object({
  actionId: z.string(),
  cost: z.number(),
  expectedValue: z.number(),
  roi: z.number(),
  roiPercentage: z.number(),
  breakEven: z.boolean(),
  recommended: z.boolean(),
  reasoning: z.string(),
});

// ============================================================================
// OPTIMIZATION STRATEGY
// ============================================================================

export interface OptimizationStrategy {
  useStreaming: boolean;
  useCaching: boolean;
  reuseResults: boolean;
  skipAction: boolean;
  alternativeAction: string | null;
  modelChoice: ModelType;
  reasoning: string;
}

export const OptimizationStrategySchema = z.object({
  useStreaming: z.boolean(),
  useCaching: z.boolean(),
  reuseResults: z.boolean(),
  skipAction: z.boolean(),
  alternativeAction: z.string().nullable(),
  modelChoice: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-5", "custom"]),
  reasoning: z.string(),
});

// ============================================================================
// COST OPTIMIZATION CONFIG
// ============================================================================

export interface CostOptimizationConfig {
  maxCostPerAction: number;
  maxCostPerSession: number;
  minROI: number;
  budget: number;
  budgetPeriod: "hourly" | "daily" | "weekly" | "monthly";
  streamingThreshold: number; // Tokens threshold for streaming
  cachingEnabled: boolean;
  reuseEnabled: boolean;
  qualityThreshold: number;
  latencyThreshold: number;
}

export const CostOptimizationConfigSchema = z.object({
  maxCostPerAction: z.number(),
  maxCostPerSession: z.number(),
  minROI: z.number(),
  budget: z.number(),
  budgetPeriod: z.enum(["hourly", "daily", "weekly", "monthly"]),
  streamingThreshold: z.number(),
  cachingEnabled: z.boolean(),
  reuseEnabled: z.boolean(),
  qualityThreshold: z.number(),
  latencyThreshold: z.number(),
});

export const defaultCostOptimizationConfig: CostOptimizationConfig = {
  maxCostPerAction: 0.10, // $0.10 per action
  maxCostPerSession: 1.00, // $1.00 per session
  minROI: 1.5, // 150% ROI minimum
  budget: 10.00, // $10.00 budget
  budgetPeriod: "daily",
  streamingThreshold: 1000, // Use streaming for >1000 tokens
  cachingEnabled: true,
  reuseEnabled: true,
  qualityThreshold: 0.7,
  latencyThreshold: 3000, // 3 seconds
};

// ============================================================================
// COST HISTORY
// ============================================================================

export interface CostHistory {
  actionId: string;
  model: ModelType;
  cost: number;
  tokens: number;
  timestamp: Date;
  roi: number;
  value: number;
}

export const CostHistorySchema = z.object({
  actionId: z.string(),
  model: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-5", "custom"]),
  cost: z.number(),
  tokens: z.number(),
  timestamp: z.date(),
  roi: z.number(),
  value: z.number(),
});

// ============================================================================
// CACHE ENTRY
// ============================================================================

export interface CacheEntry {
  key: string;
  model: ModelType;
  input: any;
  output: any;
  cost: number;
  tokens: number;
  timestamp: Date;
  hits: number;
  ttl: number; // Time to live in seconds
}

export const CacheEntrySchema = z.object({
  key: z.string(),
  model: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-5", "custom"]),
  input: z.any(),
  output: z.any(),
  cost: z.number(),
  tokens: z.number(),
  timestamp: z.date(),
  hits: z.number(),
  ttl: z.number(),
});
