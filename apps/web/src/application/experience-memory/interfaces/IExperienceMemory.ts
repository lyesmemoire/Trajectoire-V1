/**
 * Experience Memory Interfaces
 * Product memory
 */

import { z } from "zod";

// ============================================================================
// USER PREFERENCE
// ============================================================================

export interface UserPreference {
  userId: string;
  preferredTimeOfDay: "morning" | "afternoon" | "evening" | "flexible";
  preferredDayOfWeek: number;
  preferredDuration: number; // minutes
  preferredDifficulty: "easy" | "medium" | "hard" | "adaptive";
  preferredExerciseTypes: string[];
  avoidedExerciseTypes: string[];
  preferredPersonalities: string[];
  avoidedPersonalities: string[];
  preferredCompanies: string[];
  feedbackStyle: "direct" | "gentle" | "detailed" | "brief";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
}

export const UserPreferenceSchema = z.object({
  userId: z.string(),
  preferredTimeOfDay: z.enum(["morning", "afternoon", "evening", "flexible"]),
  preferredDayOfWeek: z.number(),
  preferredDuration: z.number(),
  preferredDifficulty: z.enum(["easy", "medium", "hard", "adaptive"]),
  preferredExerciseTypes: z.array(z.string()),
  avoidedExerciseTypes: z.array(z.string()),
  preferredPersonalities: z.array(z.string()),
  avoidedPersonalities: z.array(z.string()),
  preferredCompanies: z.array(z.string()),
  feedbackStyle: z.enum(["direct", "gentle", "detailed", "brief"]),
  learningStyle: z.enum(["visual", "auditory", "kinesthetic", "mixed"]),
});

// ============================================================================
// SESSION MEMORY
// ============================================================================

export interface SessionMemory {
  sessionId: string;
  userId: string;
  timestamp: Date;
  duration: number;
  exerciseType: string;
  difficulty: string;
  personality: string;
  stressLevel: number;
  confidenceLevel: number;
  fatigueLevel: number;
  satisfaction: number; // 0-1
  feedback: string;
}

export const SessionMemorySchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  timestamp: z.date(),
  duration: z.number(),
  exerciseType: z.string(),
  difficulty: z.string(),
  personality: z.string(),
  stressLevel: z.number(),
  confidenceLevel: z.number(),
  fatigueLevel: z.number(),
  satisfaction: z.number(),
  feedback: z.string(),
});

// ============================================================================
// EXPERIENCE MEMORY
// ============================================================================

export interface ExperienceMemory {
  userId: string;
  preferences: UserPreference;
  sessionHistory: SessionMemory[];
  totalSessions: number;
  totalDuration: number;
  averageSatisfaction: number;
  averageStress: number;
  averageConfidence: number;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const ExperienceMemorySchema = z.object({
  userId: z.string(),
  preferences: z.lazy(() => UserPreferenceSchema),
  sessionHistory: z.array(z.lazy(() => SessionMemorySchema)),
  totalSessions: z.number(),
  totalDuration: z.number(),
  averageSatisfaction: z.number(),
  averageStress: z.number(),
  averageConfidence: z.number(),
  lastActivity: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================================================
// EXPERIENCE MEMORY CONFIG
// ============================================================================

export interface ExperienceMemoryConfig {
  maxHistorySize: number;
  historyRetentionDays: number;
  learningRate: number;
  preferenceDecay: number; // 0-1
  minSessionsForLearning: number;
}

export const ExperienceMemoryConfigSchema = z.object({
  maxHistorySize: z.number(),
  historyRetentionDays: z.number(),
  learningRate: z.number(),
  preferenceDecay: z.number(),
  minSessionsForLearning: z.number(),
});

export const defaultExperienceMemoryConfig: ExperienceMemoryConfig = {
  maxHistorySize: 100,
  historyRetentionDays: 90,
  learningRate: 0.1,
  preferenceDecay: 0.05,
  minSessionsForLearning: 5,
};
