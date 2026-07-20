/**
 * Recommendation Fusion Engine Interfaces
 * Fuses duplicate recommendations from multiple engines
 */

import { z } from "zod";

// ============================================================================
// RECOMMENDATION SOURCE
// ============================================================================

export interface RecommendationSource {
  engine: string;
  recommendation: string;
  confidence: number;
  priority: number;
  timestamp: Date;
}

export const RecommendationSourceSchema = z.object({
  engine: z.string(),
  recommendation: z.string(),
  confidence: z.number(),
  priority: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// FUSED RECOMMENDATION
// ============================================================================

export interface FusedRecommendation {
  id: string;
  category: string;
  content: string;
  sources: RecommendationSource[];
  fusedFrom: string[]; // Engine names
  confidence: number;
  priority: number;
  reasoning: string;
  duplicatesRemoved: number;
  timestamp: Date;
}

export const FusedRecommendationSchema = z.object({
  id: z.string(),
  category: z.string(),
  content: z.string(),
  sources: z.array(z.lazy(() => RecommendationSourceSchema)),
  fusedFrom: z.array(z.string()),
  confidence: z.number(),
  priority: z.number(),
  reasoning: z.string(),
  duplicatesRemoved: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// FUSION CONFIG
// ============================================================================

export interface FusionConfig {
  similarityThreshold: number; // 0-1, threshold for considering recommendations as duplicates
  confidenceAggregation: "average" | "max" | "weighted";
  priorityAggregation: "average" | "max" | "weighted";
  maxRecommendationsPerCategory: number;
  minConfidence: number;
  deduplicationEnabled: boolean;
  categoryGrouping: boolean;
}

export const FusionConfigSchema = z.object({
  similarityThreshold: z.number(),
  confidenceAggregation: z.enum(["average", "max", "weighted"]),
  priorityAggregation: z.enum(["average", "max", "weighted"]),
  maxRecommendationsPerCategory: z.number(),
  minConfidence: z.number(),
  deduplicationEnabled: z.boolean(),
  categoryGrouping: z.boolean(),
});

export const defaultFusionConfig: FusionConfig = {
  similarityThreshold: 0.8,
  confidenceAggregation: "weighted",
  priorityAggregation: "max",
  maxRecommendationsPerCategory: 3,
  minConfidence: 0.5,
  deduplicationEnabled: true,
  categoryGrouping: true,
};

// ============================================================================
// FUSION RESULT
// ============================================================================

export interface FusionResult {
  id: string;
  inputRecommendations: RecommendationSource[];
  fusedRecommendations: FusedRecommendation[];
  duplicatesRemoved: number;
  categoriesFused: number;
  totalConfidenceImprovement: number;
  timestamp: Date;
}

export const FusionResultSchema = z.object({
  id: z.string(),
  inputRecommendations: z.array(z.lazy(() => RecommendationSourceSchema)),
  fusedRecommendations: z.array(z.lazy(() => FusedRecommendationSchema)),
  duplicatesRemoved: z.number(),
  categoriesFused: z.number(),
  totalConfidenceImprovement: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// SIMILARITY SCORE
// ============================================================================

export interface SimilarityScore {
  recommendation1: string;
  recommendation2: string;
  similarity: number; // 0-1
  method: "text" | "semantic" | "category";
}

export const SimilarityScoreSchema = z.object({
  recommendation1: z.string(),
  recommendation2: z.string(),
  similarity: z.number(),
  method: z.enum(["text", "semantic", "category"]),
});
