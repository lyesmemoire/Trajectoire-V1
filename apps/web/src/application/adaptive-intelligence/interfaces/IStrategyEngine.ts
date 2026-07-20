/**
 * Strategy Engine Interfaces
 * Long-term strategy planning across multiple weeks
 */

import { z } from "zod";

// ============================================================================
// STRATEGY OBJECTIVES
// ============================================================================

export interface StrategyObjective {
  id: string;
  name: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  targetValue: number;
  currentValue: number;
  deadline: Date;
  category: "communication" | "leadership" | "negotiation" | "english" | "technical" | "soft_skills";
}

export const StrategyObjectiveSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  targetValue: z.number(),
  currentValue: z.number(),
  deadline: z.date(),
  category: z.enum(["communication", "leadership", "negotiation", "english", "technical", "soft_skills"]),
});

// ============================================================================
// STRATEGY PHASE
// ============================================================================

export interface StrategyPhase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  activities: StrategyActivity[];
  expectedOutcomes: string[];
  dependencies: string[];
}

export const StrategyPhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  objectives: z.array(z.string()),
  activities: z.array(z.lazy(() => StrategyActivitySchema)),
  expectedOutcomes: z.array(z.string()),
  dependencies: z.array(z.string()),
});

// ============================================================================
// STRATEGY ACTIVITY
// ============================================================================

export interface StrategyActivity {
  id: string;
  type: "simulation" | "exercise" | "mock_interview" | "training" | "rest" | "review";
  name: string;
  description: string;
  duration: number; // in minutes
  category: string;
  difficulty: "easy" | "medium" | "hard";
  resources: string[];
  prerequisites: string[];
}

export const StrategyActivitySchema = z.object({
  id: z.string(),
  type: z.enum(["simulation", "exercise", "mock_interview", "training", "rest", "review"]),
  name: z.string(),
  description: z.string(),
  duration: z.number(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  resources: z.array(z.string()),
  prerequisites: z.array(z.string()),
});

// ============================================================================
// STRATEGY PLAN
// ============================================================================

export interface StrategyPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  phases: StrategyPhase[];
  objectives: StrategyObjective[];
  progress: number;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export const StrategyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  phases: z.array(z.lazy(() => StrategyPhaseSchema)),
  objectives: z.array(z.lazy(() => StrategyObjectiveSchema)),
  progress: z.number(),
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================================================
// STRATEGY RECOMMENDATION
// ============================================================================

export interface StrategyRecommendation {
  id: string;
  userId: string;
  category: string;
  priority: number;
  reason: string;
  suggestedActivities: StrategyActivity[];
  estimatedDuration: number;
  expectedValue: number;
  confidence: number;
}

export const StrategyRecommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.string(),
  priority: z.number(),
  reason: z.string(),
  suggestedActivities: z.array(z.lazy(() => StrategyActivitySchema)),
  estimatedDuration: z.number(),
  expectedValue: z.number(),
  confidence: z.number(),
});

// ============================================================================
// STRATEGY CONFIG
// ============================================================================

export interface StrategyConfig {
  defaultPhaseDuration: number; // in days
  maxPhases: number;
  minActivitiesPerPhase: number;
  maxActivitiesPerPhase: number;
  balanceCategories: boolean;
  includeRestDays: boolean;
  restFrequency: number; // days between rest days
  adaptationFrequency: number; // days between strategy reviews
}

export const StrategyConfigSchema = z.object({
  defaultPhaseDuration: z.number(),
  maxPhases: z.number(),
  minActivitiesPerPhase: z.number(),
  maxActivitiesPerPhase: z.number(),
  balanceCategories: z.boolean(),
  includeRestDays: z.boolean(),
  restFrequency: z.number(),
  adaptationFrequency: z.number(),
});

export const defaultStrategyConfig: StrategyConfig = {
  defaultPhaseDuration: 7, // 1 week per phase
  maxPhases: 12, // 12 weeks max
  minActivitiesPerPhase: 3,
  maxActivitiesPerPhase: 7,
  balanceCategories: true,
  includeRestDays: true,
  restFrequency: 7, // Rest every 7 days
  adaptationFrequency: 7, // Review strategy every 7 days
};
