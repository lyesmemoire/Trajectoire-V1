/**
 * Adaptive Interview Experience Interfaces
 * Real-time adaptive interview experience
 */

import { z } from "zod";

// ============================================================================
// RECRUITER ADAPTATION STATE
// ============================================================================

export interface RecruiterAdaptationState {
  personality: "friendly" | "professional" | "challenging" | "supportive";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  speed: "slow" | "normal" | "fast";
  interruptions: "rare" | "occasional" | "frequent";
  empathy: number; // 0-1
  aggressiveness: number; // 0-1
  traps: number; // 0-1
  tone: "formal" | "casual" | "mixed";
}

export const RecruiterAdaptationStateSchema = z.object({
  personality: z.enum(["friendly", "professional", "challenging", "supportive"]),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  speed: z.enum(["slow", "normal", "fast"]),
  interruptions: z.enum(["rare", "occasional", "frequent"]),
  empathy: z.number(),
  aggressiveness: z.number(),
  traps: z.number(),
  tone: z.enum(["formal", "casual", "mixed"]),
});

// ============================================================================
// USER RESPONSE ANALYSIS
// ============================================================================

export interface UserResponseAnalysis {
  responseId: string;
  sessionId: string;
  timestamp: Date;
  responseTime: number; // in seconds
  content: string;
  quality: number; // 0-1
  confidence: number; // 0-1
  errors: string[];
  hesitations: number;
  structure: "good" | "fair" | "poor";
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
}

export const UserResponseAnalysisSchema = z.object({
  responseId: z.string(),
  sessionId: z.string(),
  timestamp: z.date(),
  responseTime: z.number(),
  content: z.string(),
  quality: z.number(),
  confidence: z.number(),
  errors: z.array(z.string()),
  hesitations: z.number(),
  structure: z.enum(["good", "fair", "poor"]),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  keywords: z.array(z.string()),
});

// ============================================================================
// ADAPTATION TRIGGER
// ============================================================================

export interface AdaptationTrigger {
  id: string;
  type: "stress" | "confidence" | "fatigue" | "error" | "success" | "hesitation" | "silence" | "repetition";
  severity: "low" | "medium" | "high";
  value: number;
  threshold: number;
  timestamp: Date;
}

export const AdaptationTriggerSchema = z.object({
  id: z.string(),
  type: z.enum(["stress", "confidence", "fatigue", "error", "success", "hesitation", "silence", "repetition"]),
  severity: z.enum(["low", "medium", "high"]),
  value: z.number(),
  threshold: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// ADAPTATION ACTION
// ============================================================================

export interface AdaptationAction {
  id: string;
  triggerId: string;
  type: "personality" | "level" | "speed" | "interruption" | "empathy" | "aggressiveness" | "traps" | "tone";
  previousValue: any;
  newValue: any;
  reason: string;
  timestamp: Date;
}

export const AdaptationActionSchema = z.object({
  id: z.string(),
  triggerId: z.string(),
  type: z.enum(["personality", "level", "speed", "interruption", "empathy", "aggressiveness", "traps", "tone"]),
  previousValue: z.any(),
  newValue: z.any(),
  reason: z.string(),
  timestamp: z.date(),
});

// ============================================================================
// REAL-TIME UPDATE
// ============================================================================

export interface RealTimeUpdate {
  sessionId: string;
  responseAnalysis: UserResponseAnalysis;
  adaptationActions: AdaptationAction[];
  updatedEngines: string[];
  timestamp: Date;
}

export const RealTimeUpdateSchema = z.object({
  sessionId: z.string(),
  responseAnalysis: z.lazy(() => UserResponseAnalysisSchema),
  adaptationActions: z.array(z.lazy(() => AdaptationActionSchema)),
  updatedEngines: z.array(z.string()),
  timestamp: z.date(),
});

// ============================================================================
// ADAPTIVE INTERVIEW CONFIG
// ============================================================================

export interface AdaptiveInterviewConfig {
  stressThreshold: number;
  confidenceThreshold: number;
  fatigueThreshold: number;
  errorThreshold: number;
  successThreshold: number;
  hesitationThreshold: number;
  silenceThreshold: number; // seconds
  repetitionThreshold: number;
  adaptationSpeed: number; // 0-1, how fast to adapt
  minAdaptationInterval: number; // seconds between adaptations
}

export const AdaptiveInterviewConfigSchema = z.object({
  stressThreshold: z.number(),
  confidenceThreshold: z.number(),
  fatigueThreshold: z.number(),
  errorThreshold: z.number(),
  successThreshold: z.number(),
  hesitationThreshold: z.number(),
  silenceThreshold: z.number(),
  repetitionThreshold: z.number(),
  adaptationSpeed: z.number(),
  minAdaptationInterval: z.number(),
});

export const defaultAdaptiveInterviewConfig: AdaptiveInterviewConfig = {
  stressThreshold: 0.7,
  confidenceThreshold: 0.4,
  fatigueThreshold: 0.7,
  errorThreshold: 3,
  successThreshold: 0.8,
  hesitationThreshold: 5,
  silenceThreshold: 10,
  repetitionThreshold: 3,
  adaptationSpeed: 0.5,
  minAdaptationInterval: 30,
};
