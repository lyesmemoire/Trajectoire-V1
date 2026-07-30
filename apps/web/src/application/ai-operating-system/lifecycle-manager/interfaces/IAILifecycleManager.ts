/**
 * AI Lifecycle Manager Interfaces
 * Manages the complete lifecycle of AI decisions
 */

import { z } from "zod";

// ============================================================================
// LIFECYCLE STAGE
// ============================================================================

export type LifecycleStage = 
  | "need"
  | "context"
  | "reasoning"
  | "decision"
  | "simulation"
  | "validation"
  | "execution"
  | "observation"
  | "learning"
  | "reflection"
  | "memory"
  | "optimization";

// ============================================================================
// LIFECYCLE EVENT
// ============================================================================

export interface LifecycleEvent {
  id: string;
  lifecycleId: string;
  stage: LifecycleStage;
  timestamp: Date;
  status: "started" | "completed" | "failed" | "skipped";
  duration: number; // milliseconds
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export const LifecycleEventSchema = z.object({
  id: z.string(),
  lifecycleId: z.string(),
  stage: z.enum(["need", "context", "reasoning", "decision", "simulation", "validation", "execution", "observation", "learning", "reflection", "memory", "optimization"]),
  timestamp: z.date(),
  status: z.enum(["started", "completed", "failed", "skipped"]),
  duration: z.number(),
  data: z.record(z.string(), z.unknown()),
  metadata: z.record(z.string(), z.unknown()),
});

// ============================================================================
// DECISION NEED
// ============================================================================

export interface DecisionNeed {
  id: string;
  userId: string;
  type: string;
  description: string;
  priority: number; // 0-100
  urgency: number; // 0-100
  context: Record<string, unknown>;
  constraints: string[];
  objectives: string[];
  createdAt: Date;
}

export const DecisionNeedSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  description: z.string(),
  priority: z.number(),
  urgency: z.number(),
  context: z.record(z.string(), z.unknown()),
  constraints: z.array(z.string()),
  objectives: z.array(z.string()),
  createdAt: z.date(),
});

// ============================================================================
// DECISION CONTEXT
// ============================================================================

export interface DecisionContext {
  id: string;
  lifecycleId: string;
  userId: string;
  userProfile: Record<string, unknown>;
  sessionData: Record<string, unknown>;
  historicalData: Record<string, unknown>;
  environment: Record<string, unknown>;
  timestamp: Date;
}

export const DecisionContextSchema = z.object({
  id: z.string(),
  lifecycleId: z.string(),
  userId: z.string(),
  userProfile: z.record(z.string(), z.unknown()),
  sessionData: z.record(z.string(), z.unknown()),
  historicalData: z.record(z.string(), z.unknown()),
  environment: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
});

// ============================================================================
// DECISION OUTCOME
// ============================================================================

export interface DecisionOutcome {
  id: string;
  lifecycleId: string;
  decisionId: string;
  actualDecision: any;
  expectedDecision: any;
  realResult: any;
  userFeedback: string;
  satisfaction: number; // 0-1
  roi: number; // 0-1
  quality: number; // 0-1
  timestamp: Date;
}

export const DecisionOutcomeSchema = z.object({
  id: z.string(),
  lifecycleId: z.string(),
  decisionId: z.string(),
  actualDecision: z.unknown(),
  expectedDecision: z.unknown(),
  realResult: z.unknown(),
  userFeedback: z.string(),
  satisfaction: z.number(),
  roi: z.number(),
  quality: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// LIFECYCLE HISTORY
// ============================================================================

export interface LifecycleHistory {
  id: string;
  lifecycleId: string;
  events: LifecycleEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export const LifecycleHistorySchema = z.object({
  id: z.string(),
  lifecycleId: z.string(),
  events: z.array(z.lazy(() => LifecycleEventSchema)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================================================
// AI LIFECYCLE
// ============================================================================

export interface AILifecycle {
  id: string;
  userId: string;
  need: DecisionNeed;
  context: DecisionContext | null;
  decisionId: string | null;
  outcome: DecisionOutcome | null;
  history: LifecycleHistory;
  status: "active" | "completed" | "failed" | "cancelled";
  currentStage: LifecycleStage;
  startTime: Date;
  endTime: Date | null;
  totalDuration: number; // milliseconds
  totalCost: number; // dollars
  confidence: number; // 0-1
}

export const AILifecycleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  need: z.lazy(() => DecisionNeedSchema),
  context: z.lazy(() => DecisionContextSchema).nullable(),
  decisionId: z.string().nullable(),
  outcome: z.lazy(() => DecisionOutcomeSchema).nullable(),
  history: z.lazy(() => LifecycleHistorySchema),
  status: z.enum(["active", "completed", "failed", "cancelled"]),
  currentStage: z.enum(["need", "context", "reasoning", "decision", "simulation", "validation", "execution", "observation", "learning", "reflection", "memory", "optimization"]),
  startTime: z.date(),
  endTime: z.date().nullable(),
  totalDuration: z.number(),
  totalCost: z.number(),
  confidence: z.number(),
});

// ============================================================================
// LIFECYCLE METRICS
// ============================================================================

export interface LifecycleMetrics {
  totalLifecycles: number;
  activeLifecycles: number;
  completedLifecycles: number;
  failedLifecycles: number;
  averageDuration: number; // milliseconds
  averageCost: number; // dollars
  averageConfidence: number; // 0-1
  stageDistribution: Record<string, number>;
  successRate: number;
}

export const LifecycleMetricsSchema = z.object({
  totalLifecycles: z.number(),
  activeLifecycles: z.number(),
  completedLifecycles: z.number(),
  failedLifecycles: z.number(),
  averageDuration: z.number(),
  averageCost: z.number(),
  averageConfidence: z.number(),
  stageDistribution: z.record(z.string(), z.number()),
  successRate: z.number(),
});

// ============================================================================
// AI LIFECYCLE MANAGER CONFIG
// ============================================================================

export interface AILifecycleManagerConfig {
  enableAutoProgression: boolean;
  enableAutoRetry: boolean;
  maxRetries: number;
  retryDelay: number; // milliseconds
  enableHistory: boolean;
  enableMetrics: boolean;
  defaultTimeout: number; // milliseconds
}

export const AILifecycleManagerConfigSchema = z.object({
  enableAutoProgression: z.boolean(),
  enableAutoRetry: z.boolean(),
  maxRetries: z.number(),
  retryDelay: z.number(),
  enableHistory: z.boolean(),
  enableMetrics: z.boolean(),
  defaultTimeout: z.number(),
});

export const defaultAILifecycleManagerConfig: AILifecycleManagerConfig = {
  enableAutoProgression: true,
  enableAutoRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  enableHistory: true,
  enableMetrics: true,
  defaultTimeout: 30000,
};
