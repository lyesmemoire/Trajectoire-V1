/**
 * Planning Engine Interfaces
 * Multi-day planning with intelligent scheduling
 */

import { z } from "zod";

// ============================================================================
// DAILY PLAN
// ============================================================================

export interface DailyPlan {
  id: string;
  userId: string;
  date: Date;
  activities: PlannedActivity[];
  totalDuration: number;
  priority: "high" | "medium" | "low";
  status: "draft" | "scheduled" | "in_progress" | "completed" | "skipped";
  notes: string;
}

export const DailyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  activities: z.array(z.lazy(() => PlannedActivitySchema)),
  totalDuration: z.number(),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["draft", "scheduled", "in_progress", "completed", "skipped"]),
  notes: z.string(),
});

// ============================================================================
// PLANNED ACTIVITY
// ============================================================================

export interface PlannedActivity {
  id: string;
  type: "simulation" | "exercise" | "mock_interview" | "stress_interview" | "rest" | "review";
  name: string;
  description: string;
  startTime: string; // HH:MM format
  duration: number; // in minutes
  category: string;
  difficulty: "easy" | "medium" | "hard";
  priority: number;
  completed: boolean;
  resources: string[];
}

export const PlannedActivitySchema = z.object({
  id: z.string(),
  type: z.enum(["simulation", "exercise", "mock_interview", "stress_interview", "rest", "review"]),
  name: z.string(),
  description: z.string(),
  startTime: z.string(),
  duration: z.number(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  priority: z.number(),
  completed: z.boolean(),
  resources: z.array(z.string()),
});

// ============================================================================
// WEEKLY PLAN
// ============================================================================

export interface WeeklyPlan {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  dailyPlans: DailyPlan[];
  totalActivities: number;
  totalDuration: number;
  focusAreas: string[];
  status: "draft" | "active" | "completed" | "cancelled";
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export const WeeklyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  dailyPlans: z.array(z.lazy(() => DailyPlanSchema)),
  totalActivities: z.number(),
  totalDuration: z.number(),
  focusAreas: z.array(z.string()),
  status: z.enum(["draft", "active", "completed", "cancelled"]),
  progress: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================================================
// PLANNING CONSTRAINTS
// ============================================================================

export interface PlanningConstraints {
  maxDailyDuration: number; // in minutes
  minDailyDuration: number; // in minutes
  maxActivitiesPerDay: number;
  minActivitiesPerDay: number;
  preferredStartTime: string; // HH:MM format
  preferredEndTime: string; // HH:MM format
  restDayFrequency: number; // days between rest days
  maxConsecutiveWorkDays: number;
  difficultyBalance: boolean; // Balance easy/medium/hard
  categoryBalance: boolean; // Balance categories
}

export const PlanningConstraintsSchema = z.object({
  maxDailyDuration: z.number(),
  minDailyDuration: z.number(),
  maxActivitiesPerDay: z.number(),
  minActivitiesPerDay: z.number(),
  preferredStartTime: z.string(),
  preferredEndTime: z.string(),
  restDayFrequency: z.number(),
  maxConsecutiveWorkDays: z.number(),
  difficultyBalance: z.boolean(),
  categoryBalance: z.boolean(),
});

export const defaultPlanningConstraints: PlanningConstraints = {
  maxDailyDuration: 180, // 3 hours max
  minDailyDuration: 30, // 30 minutes min
  maxActivitiesPerDay: 5,
  minActivitiesPerDay: 1,
  preferredStartTime: "09:00",
  preferredEndTime: "18:00",
  restDayFrequency: 7, // Rest every 7 days
  maxConsecutiveWorkDays: 6,
  difficultyBalance: true,
  categoryBalance: true,
};

// ============================================================================
// PLANNING CONFIG
// ============================================================================

export interface PlanningConfig {
  constraints: PlanningConstraints;
  autoSchedule: boolean;
  adaptiveScheduling: boolean;
  reminderEnabled: boolean;
  reminderLeadTime: number; // minutes before activity
  flexibility: number; // 0-1, how flexible scheduling is
}

export const PlanningConfigSchema = z.object({
  constraints: z.lazy(() => PlanningConstraintsSchema),
  autoSchedule: z.boolean(),
  adaptiveScheduling: z.boolean(),
  reminderEnabled: z.boolean(),
  reminderLeadTime: z.number(),
  flexibility: z.number(),
});

export const defaultPlanningConfig: PlanningConfig = {
  constraints: defaultPlanningConstraints,
  autoSchedule: true,
  adaptiveScheduling: true,
  reminderEnabled: true,
  reminderLeadTime: 15, // 15 minutes before
  flexibility: 0.5,
};

// ============================================================================
// PLANNING SUGGESTION
// ============================================================================

export interface PlanningSuggestion {
  id: string;
  userId: string;
  date: Date;
  suggestedActivities: PlannedActivity[];
  reason: string;
  confidence: number;
  alternatives: PlannedActivity[][];
}

export const PlanningSuggestionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  suggestedActivities: z.array(z.lazy(() => PlannedActivitySchema)),
  reason: z.string(),
  confidence: z.number(),
  alternatives: z.array(z.array(z.lazy(() => PlannedActivitySchema))),
});
