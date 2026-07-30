/**
 * Live Coaching Interfaces
 * Invisible coaching during simulation
 */

import { z } from "zod";

// ============================================================================
// COACHING TYPE
// ============================================================================

export type CoachingType = 
  | "encouragement"
  | "correction"
  | "advice"
  | "breathing"
  | "reminder"
  | "tip"
  | "structure"
  | "confidence";

// ============================================================================
// LIVE COACHING MESSAGE
// ============================================================================

export interface LiveCoachingMessage {
  id: string;
  sessionId: string;
  type: CoachingType;
  content: string;
  priority: "low" | "medium" | "high";
  urgency: "low" | "medium" | "high";
  displayDuration: number; // seconds
  position: "top" | "bottom" | "side";
  style: "subtle" | "prominent" | "urgent";
  trigger: string;
  timestamp: Date;
  dismissed: boolean;
}

export const LiveCoachingMessageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  type: z.enum(["encouragement", "correction", "advice", "breathing", "reminder", "tip", "structure", "confidence"]),
  content: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  urgency: z.enum(["low", "medium", "high"]),
  displayDuration: z.number(),
  position: z.enum(["top", "bottom", "side"]),
  style: z.enum(["subtle", "prominent", "urgent"]),
  trigger: z.string(),
  timestamp: z.date(),
  dismissed: z.boolean(),
});

// ============================================================================
// COACHING TRIGGER
// ============================================================================

export interface CoachingTrigger {
  id: string;
  type: "high_stress" | "blocking" | "silence" | "repetition" | "poor_structure" | "low_confidence" | "long_response_time" | "success";
  severity: "low" | "medium" | "high";
  value: number;
  threshold: number;
  context: Record<string, unknown>;
  timestamp: Date;
}

export const CoachingTriggerSchema = z.object({
  id: z.string(),
  type: z.enum(["high_stress", "blocking", "silence", "repetition", "poor_structure", "low_confidence", "long_response_time", "success"]),
  severity: z.enum(["low", "medium", "high"]),
  value: z.number(),
  threshold: z.number(),
  context: z.record(z.string(), z.any()),
  timestamp: z.date(),
});

// ============================================================================
// LIVE COACHING CONFIG
// ============================================================================

export interface LiveCoachingConfig {
  enabled: boolean;
  maxMessagesPerSession: number;
  minIntervalBetweenMessages: number; // seconds
  stressThreshold: number;
  confidenceThreshold: number;
  silenceThreshold: number; // seconds
  repetitionThreshold: number;
  responseTimeThreshold: number; // seconds
  immersionPreservation: number; // 0-1, how much to preserve immersion
  adaptiveIntensity: boolean;
}

export const LiveCoachingConfigSchema = z.object({
  enabled: z.boolean(),
  maxMessagesPerSession: z.number(),
  minIntervalBetweenMessages: z.number(),
  stressThreshold: z.number(),
  confidenceThreshold: z.number(),
  silenceThreshold: z.number(),
  repetitionThreshold: z.number(),
  responseTimeThreshold: z.number(),
  immersionPreservation: z.number(),
  adaptiveIntensity: z.boolean(),
});

export const defaultLiveCoachingConfig: LiveCoachingConfig = {
  enabled: true,
  maxMessagesPerSession: 15,
  minIntervalBetweenMessages: 30,
  stressThreshold: 0.7,
  confidenceThreshold: 0.4,
  silenceThreshold: 10,
  repetitionThreshold: 3,
  responseTimeThreshold: 20,
  immersionPreservation: 0.7,
  adaptiveIntensity: true,
};

// ============================================================================
// COACHING SESSION STATE
// ============================================================================

export interface CoachingSessionState {
  sessionId: string;
  userId: string;
  startTime: Date;
  messagesSent: number;
  lastMessageTime: Date;
  triggersDetected: CoachingTrigger[];
  messagesDelivered: LiveCoachingMessage[];
  currentIntensity: number; // 0-1
  userEngagement: number; // 0-1
}

export const CoachingSessionStateSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  startTime: z.date(),
  messagesSent: z.number(),
  lastMessageTime: z.date(),
  triggersDetected: z.array(z.lazy(() => CoachingTriggerSchema)),
  messagesDelivered: z.array(z.lazy(() => LiveCoachingMessageSchema)),
  currentIntensity: z.number(),
  userEngagement: z.number(),
});
