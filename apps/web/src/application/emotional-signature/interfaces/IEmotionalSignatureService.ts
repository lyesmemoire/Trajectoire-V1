/**
 * Emotional Signature Service Interfaces
 * Définit les interfaces pour le système de progression émotionnelle
 */

import { z } from "zod";

// ============================================================================
// EMOTIONAL STATE ENUM
// ============================================================================

export enum EmotionalState {
  WELCOME = "WELCOME",
  SAFETY = "SAFETY",
  CHALLENGE = "CHALLENGE",
  CONSTRUCTIVE_DOUBT = "CONSTRUCTIVE_DOUBT",
  BREAKTHROUGH = "BREAKTHROUGH",
  PRIDE = "PRIDE",
  PROJECTION = "PROJECTION",
}

// ============================================================================
// EMOTIONAL STATE CONFIGURATION
// ============================================================================

export interface EmotionalStateConfig {
  psychologicalObjective: string;
  averageDuration: number; // en minutes
  entryConditions: {
    minConfidence: number;
    maxStress: number;
    minResponseQuality: number;
  };
  exitConditions: {
    minConfidence: number;
    maxStress: number;
    minResponseQuality: number;
  };
  expectedConfidence: number; // 0-1
  acceptableStress: number; // 0-1
  conversationalStyle: "warm" | "analytical" | "challenging" | "supportive" | "inspiring";
  rhythm: "slow" | "normal" | "fast" | "variable";
  empathyLevel: number; // 0-1
  demandLevel: number; // 0-1
}

// ============================================================================
// EMOTIONAL TRANSITION
// ============================================================================

export interface EmotionalTransition {
  from: EmotionalState;
  to: EmotionalState;
  reason: string;
  timestamp: Date;
}

// ============================================================================
// RECRUITER POSTURE
// ============================================================================

export interface RecruiterPosture {
  reassuring: number; // 0-1
  demanding: number; // 0-1
  analytical: number; // 0-1
  benevolent: number; // 0-1
  curious: number; // 0-1
}

// ============================================================================
// EMOTIONAL INFLUENCE
// ============================================================================

export interface EmotionalInfluence {
  conversationEngine: {
    tone: string;
    complexity: number;
  };
  recruiterPersona: RecruiterPosture;
  reasoning: {
    depth: number;
    creativity: number;
  };
  memory: {
    recallDepth: number;
    referenceFrequency: number;
  };
  tone: {
    warmth: number;
    formality: number;
  };
  followUp: {
    persistence: number;
    adaptability: number;
  };
  coaching: {
    guidanceLevel: number;
    autonomyLevel: number;
  };
  feedback: {
    positivity: number;
    constructiveness: number;
  };
  aios: {
    adaptationSpeed: number;
    sensitivity: number;
  };
}

// ============================================================================
// EMOTIONAL METRICS
// ============================================================================

export interface EmotionalMetrics {
  confidence: number; // 0-1
  stress: number; // 0-1
  responseQuality: number; // 0-1
  fatigue: number; // 0-1
  rhythm: number; // 0-1
  engagement: number; // 0-1
  progression: number; // 0-1
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const EmotionalStateSchema = z.enum([
  "WELCOME",
  "SAFETY",
  "CHALLENGE",
  "CONSTRUCTIVE_DOUBT",
  "BREAKTHROUGH",
  "PRIDE",
  "PROJECTION",
]);

export const EmotionalStateConfigSchema = z.object({
  psychologicalObjective: z.string(),
  averageDuration: z.number(),
  entryConditions: z.object({
    minConfidence: z.number(),
    maxStress: z.number(),
    minResponseQuality: z.number(),
  }),
  exitConditions: z.object({
    minConfidence: z.number(),
    maxStress: z.number(),
    minResponseQuality: z.number(),
  }),
  expectedConfidence: z.number(),
  acceptableStress: z.number(),
  conversationalStyle: z.enum(["warm", "analytical", "challenging", "supportive", "inspiring"]),
  rhythm: z.enum(["slow", "normal", "fast", "variable"]),
  empathyLevel: z.number(),
  demandLevel: z.number(),
});

export const RecruiterPostureSchema = z.object({
  reassuring: z.number(),
  demanding: z.number(),
  analytical: z.number(),
  benevolent: z.number(),
  curious: z.number(),
});

export const EmotionalInfluenceSchema = z.object({
  conversationEngine: z.object({
    tone: z.string(),
    complexity: z.number(),
  }),
  recruiterPersona: RecruiterPostureSchema,
  reasoning: z.object({
    depth: z.number(),
    creativity: z.number(),
  }),
  memory: z.object({
    recallDepth: z.number(),
    referenceFrequency: z.number(),
  }),
  tone: z.object({
    warmth: z.number(),
    formality: z.number(),
  }),
  followUp: z.object({
    persistence: z.number(),
    adaptability: z.number(),
  }),
  coaching: z.object({
    guidanceLevel: z.number(),
    autonomyLevel: z.number(),
  }),
  feedback: z.object({
    positivity: z.number(),
    constructiveness: z.number(),
  }),
  aios: z.object({
    adaptationSpeed: z.number(),
    sensitivity: z.number(),
  }),
});

export const EmotionalMetricsSchema = z.object({
  confidence: z.number(),
  stress: z.number(),
  responseQuality: z.number(),
  fatigue: z.number(),
  rhythm: z.number(),
  engagement: z.number(),
  progression: z.number(),
});
