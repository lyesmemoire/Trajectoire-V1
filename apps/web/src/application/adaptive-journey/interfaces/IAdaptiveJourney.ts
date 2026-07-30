/**
 * Adaptive Journey Interfaces
 * Personalized user journey
 */

import { z } from "zod";

// ============================================================================
// JOURNEY STEP
// ============================================================================

export interface JourneyStep {
  id: string;
  userId: string;
  type: "simulation" | "exercise" | "skill" | "difficulty" | "personality" | "company" | "interview";
  title: string;
  description: string;
  parameters: Record<string, unknown>;
  priority: number; // 0-100
  estimatedDuration: number; // minutes
  difficulty: "easy" | "medium" | "hard" | "adaptive";
  confidence: number; // 0-1
  reasoning: string;
  generatedBy: string[];
  completed: boolean;
  completedAt?: Date;
  timestamp: Date;
}

export const JourneyStepSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["simulation", "exercise", "skill", "difficulty", "personality", "company", "interview"]),
  title: z.string(),
  description: z.string(),
  parameters: z.record(z.string(), z.any()),
  priority: z.number(),
  estimatedDuration: z.number(),
  difficulty: z.enum(["easy", "medium", "hard", "adaptive"]),
  confidence: z.number(),
  reasoning: z.string(),
  generatedBy: z.array(z.string()),
  completed: z.boolean(),
  completedAt: z.date().optional(),
  timestamp: z.date(),
});

// ============================================================================
// ADAPTIVE JOURNEY
// ============================================================================

export interface AdaptiveJourney {
  id: string;
  userId: string;
  steps: JourneyStep[];
  currentStepIndex: number;
  overallProgress: number; // 0-1
  estimatedCompletion: Date;
  generatedBy: string[];
  timestamp: Date;
}

export const AdaptiveJourneySchema = z.object({
  id: z.string(),
  userId: z.string(),
  steps: z.array(z.lazy(() => JourneyStepSchema)),
  currentStepIndex: z.number(),
  overallProgress: z.number(),
  estimatedCompletion: z.date(),
  generatedBy: z.array(z.string()),
  timestamp: z.date(),
});

// ============================================================================
// JOURNEY CONTEXT
// ============================================================================

export interface JourneyContext {
  userId: string;
  currentLevel: "beginner" | "intermediate" | "advanced" | "expert";
  currentSkills: string[];
  completedSimulations: number;
  averageScore: number;
  streak: number;
  timeAvailable: number; // minutes
  objective: string;
  preferences: {
    preferredDifficulty: "easy" | "medium" | "hard" | "adaptive";
    preferredDuration: number; // minutes
    preferredTopics: string[];
    avoidTopics: string[];
  };
}

export const JourneyContextSchema = z.object({
  userId: z.string(),
  currentLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  currentSkills: z.array(z.string()),
  completedSimulations: z.number(),
  averageScore: z.number(),
  streak: z.number(),
  timeAvailable: z.number(),
  objective: z.string(),
  preferences: z.object({
    preferredDifficulty: z.enum(["easy", "medium", "hard", "adaptive"]),
    preferredDuration: z.number(),
    preferredTopics: z.array(z.string()),
    avoidTopics: z.array(z.string()),
  }),
});

// ============================================================================
// ADAPTIVE JOURNEY CONFIG
// ============================================================================

export interface AdaptiveJourneyConfig {
  maxStepsPerJourney: number;
  minPriorityThreshold: number;
  adaptiveDifficulty: boolean;
  considerStreak: boolean;
  considerTimeAvailable: boolean;
  learningRate: number;
  explorationRate: number; // 0-1, how much to explore new topics
}

export const AdaptiveJourneyConfigSchema = z.object({
  maxStepsPerJourney: z.number(),
  minPriorityThreshold: z.number(),
  adaptiveDifficulty: z.boolean(),
  considerStreak: z.boolean(),
  considerTimeAvailable: z.boolean(),
  learningRate: z.number(),
  explorationRate: z.number(),
});

export const defaultAdaptiveJourneyConfig: AdaptiveJourneyConfig = {
  maxStepsPerJourney: 10,
  minPriorityThreshold: 50,
  adaptiveDifficulty: true,
  considerStreak: true,
  considerTimeAvailable: true,
  learningRate: 0.1,
  explorationRate: 0.2,
};
