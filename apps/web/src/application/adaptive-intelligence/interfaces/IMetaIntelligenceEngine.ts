/**
 * Meta Intelligence Engine Interfaces
 * Decides when NOT to invoke certain engines for efficiency
 */

import { z } from "zod";

// ============================================================================
// ENGINE INVOCATION DECISION
// ============================================================================

export interface EngineInvocationDecision {
  engine: string;
  shouldInvoke: boolean;
  reason: string;
  confidence: number;
  alternative: string | null;
  expectedSavings: number; // Cost or time savings
  timestamp: Date;
}

export const EngineInvocationDecisionSchema = z.object({
  engine: z.string(),
  shouldInvoke: z.boolean(),
  reason: z.string(),
  confidence: z.number(),
  alternative: z.string().nullable(),
  expectedSavings: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// META DECISION
// ============================================================================

export interface MetaDecision {
  id: string;
  context: MetaContext;
  decisions: EngineInvocationDecision[];
  overallRecommendation: string;
  totalSavings: number;
  timestamp: Date;
}

export const MetaDecisionSchema = z.object({
  id: z.string(),
  context: z.lazy(() => MetaContextSchema),
  decisions: z.array(z.lazy(() => EngineInvocationDecisionSchema)),
  overallRecommendation: z.string(),
  totalSavings: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// META CONTEXT
// ============================================================================

export interface MetaContext {
  userId: string;
  currentCost: number;
  budgetRemaining: number;
  timeAvailable: number;
  urgency: "low" | "medium" | "high";
  recentPerformance: number;
  userState: {
    stress: number;
    fatigue: number;
    engagement: number;
  };
  engineHistory: EngineHistoryEntry[];
}

export const MetaContextSchema = z.object({
  userId: z.string(),
  currentCost: z.number(),
  budgetRemaining: z.number(),
  timeAvailable: z.number(),
  urgency: z.enum(["low", "medium", "high"]),
  recentPerformance: z.number(),
  userState: z.object({
    stress: z.number(),
    fatigue: z.number(),
    engagement: z.number(),
  }),
  engineHistory: z.array(z.lazy(() => EngineHistoryEntrySchema)),
});

// ============================================================================
// ENGINE HISTORY ENTRY
// ============================================================================

export interface EngineHistoryEntry {
  engine: string;
  lastInvoked: Date;
  successRate: number;
  averageCost: number;
  averageValue: number;
}

export const EngineHistoryEntrySchema = z.object({
  engine: z.string(),
  lastInvoked: z.date(),
  successRate: z.number(),
  averageCost: z.number(),
  averageValue: z.number(),
});

// ============================================================================
// META INTELLIGENCE CONFIG
// ============================================================================

export interface MetaIntelligenceConfig {
  budgetThreshold: number; // Minimum budget to invoke expensive engines
  timeThreshold: number; // Minimum time to invoke time-consuming engines
  urgencyThreshold: "low" | "medium" | "high";
  stressThreshold: number;
  fatigueThreshold: number;
  engagementThreshold: number;
  successRateThreshold: number;
  costBenefitRatio: number;
  adaptiveMode: boolean;
}

export const MetaIntelligenceConfigSchema = z.object({
  budgetThreshold: z.number(),
  timeThreshold: z.number(),
  urgencyThreshold: z.enum(["low", "medium", "high"]),
  stressThreshold: z.number(),
  fatigueThreshold: z.number(),
  engagementThreshold: z.number(),
  successRateThreshold: z.number(),
  costBenefitRatio: z.number(),
  adaptiveMode: z.boolean(),
});

export const defaultMetaIntelligenceConfig: MetaIntelligenceConfig = {
  budgetThreshold: 0.05, // $0.05 minimum budget
  timeThreshold: 60, // 1 minute minimum time
  urgencyThreshold: "medium",
  stressThreshold: 0.8,
  fatigueThreshold: 0.8,
  engagementThreshold: 0.3,
  successRateThreshold: 0.5,
  costBenefitRatio: 2.0, // Value must be 2x cost
  adaptiveMode: true,
};
