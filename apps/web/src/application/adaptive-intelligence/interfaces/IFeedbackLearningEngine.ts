/**
 * Feedback Learning Engine Interfaces
 * Learns from feedback to improve decisions
 */

import { z } from "zod";

// ============================================================================
// FEEDBACK ENTRY
// ============================================================================

export interface FeedbackEntry {
  id: string;
  decisionId: string;
  actionId: string;
  feedback: "positive" | "negative" | "neutral";
  rating: number; // 0-10
  reason: string;
  context: Record<string, any>;
  timestamp: Date;
}

export const FeedbackEntrySchema = z.object({
  id: z.string(),
  decisionId: z.string(),
  actionId: z.string(),
  feedback: z.enum(["positive", "negative", "neutral"]),
  rating: z.number(),
  reason: z.string(),
  context: z.record(z.string(), z.any()),
  timestamp: z.date(),
});

// ============================================================================
// LEARNING INSIGHT
// ============================================================================

export interface LearningInsight {
  id: string;
  pattern: string;
  confidence: number;
  recommendation: string;
  action: string;
  expectedImprovement: number;
  timestamp: Date;
}

export const LearningInsightSchema = z.object({
  id: z.string(),
  pattern: z.string(),
  confidence: z.number(),
  recommendation: z.string(),
  action: z.string(),
  expectedImprovement: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// LEARNING CONFIG
// ============================================================================

export interface LearningConfig {
  minFeedbackForLearning: number;
  learningRate: number;
  confidenceThreshold: number;
  patternRecognitionEnabled: boolean;
  adaptiveLearning: boolean;
  feedbackWeight: number;
  historyWeight: number;
}

export const LearningConfigSchema = z.object({
  minFeedbackForLearning: z.number(),
  learningRate: z.number(),
  confidenceThreshold: z.number(),
  patternRecognitionEnabled: z.boolean(),
  adaptiveLearning: z.boolean(),
  feedbackWeight: z.number(),
  historyWeight: z.number(),
});

export const defaultLearningConfig: LearningConfig = {
  minFeedbackForLearning: 10,
  learningRate: 0.1,
  confidenceThreshold: 0.7,
  patternRecognitionEnabled: true,
  adaptiveLearning: true,
  feedbackWeight: 0.7,
  historyWeight: 0.3,
};

// ============================================================================
// LEARNING METRICS
// ============================================================================

export interface LearningMetrics {
  totalFeedback: number;
  positiveFeedback: number;
  negativeFeedback: number;
  neutralFeedback: number;
  averageRating: number;
  learningRate: number;
  patternCount: number;
  accuracy: number;
}

export const LearningMetricsSchema = z.object({
  totalFeedback: z.number(),
  positiveFeedback: z.number(),
  negativeFeedback: z.number(),
  neutralFeedback: z.number(),
  averageRating: z.number(),
  learningRate: z.number(),
  patternCount: z.number(),
  accuracy: z.number(),
});
