/**
 * Human Presence Service Interface
 * Interface pour le service principal de présence humaine
 */

import { z } from "zod";

// ============================================================================
// PRESENCE CONTEXT
// ============================================================================

export interface PresenceContext {
  userId: string;
  sessionId: string;
  originalDecision: string;
  context: Record<string, unknown>;
  timestamp: Date;
}

export const PresenceContextSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  originalDecision: z.string(),
  context: z.record(z.string(), z.unknown()),
  timestamp: z.date(),
});

// ============================================================================
// PRESENCE MODIFICATION
// ============================================================================

export interface PresenceModification {
  id: string;
  userId: string;
  sessionId: string;
  originalDecision: string;
  modifiedDecision: string;
  conversation?: {
    modified: string;
    naturalnessScore: number;
    direction?: any;
  };
  memory?: {
    modified: string;
    continuityScore: number;
    references?: any[];
  };
  emotion?: {
    modified: string;
    empathyScore: number;
    emotionalState?: any;
    adaptations?: any;
  };
  rhythm?: {
    modified: string;
    rhythmScore: number;
  };
  reflection?: {
    modified: string;
    reflectionScore: number;
  };
  trust?: {
    modified: string;
    trustScore: number;
    coherenceCheck?: any;
    corrected?: boolean;
  };
  silence?: {
    modified: string;
    silenceScore: number;
    silenceDecision?: any;
  };
  attention?: {
    modified: string;
    attentionScore: number;
  };
  naturalness?: {
    modified: string;
    naturalnessScore: number;
    presenceScoreResult?: any;
    rewritten?: boolean;
  };
  presenceScore?: number;
  timestamp: Date;
}

export const PresenceModificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  originalDecision: z.string(),
  modifiedDecision: z.string(),
  conversation: z.object({
    modified: z.string(),
    naturalnessScore: z.number(),
  }).optional(),
  memory: z.object({
    modified: z.string(),
    continuityScore: z.number(),
  }).optional(),
  emotion: z.object({
    modified: z.string(),
    empathyScore: z.number(),
  }).optional(),
  rhythm: z.object({
    modified: z.string(),
    rhythmScore: z.number(),
  }).optional(),
  reflection: z.object({
    modified: z.string(),
    reflectionScore: z.number(),
  }).optional(),
  trust: z.object({
    modified: z.string(),
    trustScore: z.number(),
  }).optional(),
  silence: z.object({
    modified: z.string(),
    silenceScore: z.number(),
  }).optional(),
  attention: z.object({
    modified: z.string(),
    attentionScore: z.number(),
  }).optional(),
  naturalness: z.object({
    modified: z.string(),
    naturalnessScore: z.number(),
  }).optional(),
  presenceScore: z.number().optional(),
  timestamp: z.date(),
});

// ============================================================================
// PRESENCE METRICS
// ============================================================================

export interface PresenceMetrics {
  totalModifications: number;
  averagePresenceScore: number;
  averageNaturalnessScore: number;
  averageEmpathyScore: number;
  averageRhythmScore: number;
}

export const PresenceMetricsSchema = z.object({
  totalModifications: z.number(),
  averagePresenceScore: z.number(),
  averageNaturalnessScore: z.number(),
  averageEmpathyScore: z.number(),
  averageRhythmScore: z.number(),
});

// ============================================================================
// HUMAN PRESENCE CONFIG
// ============================================================================

export interface HumanPresenceConfig {
  enableConversationPresence: boolean;
  enableMemoryPresence: boolean;
  enableEmotionPresence: boolean;
  enableRhythmPresence: boolean;
  enableReflectionPresence: boolean;
  enableTrustPresence: boolean;
  enableSilencePresence: boolean;
  enableAttentionPresence: boolean;
  enableNaturalnessPresence: boolean;
}

export const HumanPresenceConfigSchema = z.object({
  enableConversationPresence: z.boolean(),
  enableMemoryPresence: z.boolean(),
  enableEmotionPresence: z.boolean(),
  enableRhythmPresence: z.boolean(),
  enableReflectionPresence: z.boolean(),
  enableTrustPresence: z.boolean(),
  enableSilencePresence: z.boolean(),
  enableAttentionPresence: z.boolean(),
  enableNaturalnessPresence: z.boolean(),
});

export const defaultHumanPresenceConfig: HumanPresenceConfig = {
  enableConversationPresence: true,
  enableMemoryPresence: true,
  enableEmotionPresence: true,
  enableRhythmPresence: true,
  enableReflectionPresence: true,
  enableTrustPresence: true,
  enableSilencePresence: true,
  enableAttentionPresence: true,
  enableNaturalnessPresence: true,
};
