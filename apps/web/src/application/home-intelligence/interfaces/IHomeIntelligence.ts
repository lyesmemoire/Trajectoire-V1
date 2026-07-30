/**
 * Home Intelligence Interfaces
 * Dynamic home page generation by Adaptive Intelligence Orchestrator
 */

import { z } from "zod";

// ============================================================================
// HOME CARD
// ============================================================================

export interface HomeCard {
  id: string;
  type: "stats" | "mission" | "goal" | "skill" | "recommendation" | "badge" | "history" | "celebration" | "warning";
  title: string;
  content: string;
  priority: number; // 0-100
  order: number;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "orange" | "gray";
  size: "small" | "medium" | "large";
  cta?: {
    text: string;
    action: string;
    priority: "primary" | "secondary";
  };
  metadata: Record<string, unknown>;
}

export const HomeCardSchema = z.object({
  id: z.string(),
  type: z.enum(["stats", "mission", "goal", "skill", "recommendation", "badge", "history", "celebration", "warning"]),
  title: z.string(),
  content: z.string(),
  priority: z.number(),
  order: z.number(),
  color: z.enum(["blue", "green", "yellow", "red", "purple", "orange", "gray"]),
  size: z.enum(["small", "medium", "large"]),
  cta: z.object({
    text: z.string(),
    action: z.string(),
    priority: z.enum(["primary", "secondary"]),
  }).optional(),
  metadata: z.record(z.string(), z.any()),
});

// ============================================================================
// HOME CONFIGURATION
// ============================================================================

export interface HomeConfiguration {
  userId: string;
  date: Date;
  userState: {
    stress: number;
    confidence: number;
    fatigue: number;
    engagement: number;
    streak: number;
    lastSessionDate?: Date;
  };
  context: {
    timeOfDay: "morning" | "afternoon" | "evening";
    dayOfWeek: number;
    isWeekend: boolean;
    availableTime: number; // minutes
  };
  preferences: {
    preferredOrder: string[];
    hiddenCardTypes: string[];
    maxCards: number;
  };
}

export const HomeConfigurationSchema = z.object({
  userId: z.string(),
  date: z.date(),
  userState: z.object({
    stress: z.number(),
    confidence: z.number(),
    fatigue: z.number(),
    engagement: z.number(),
    streak: z.number(),
    lastSessionDate: z.date().optional(),
  }),
  context: z.object({
    timeOfDay: z.enum(["morning", "afternoon", "evening"]),
    dayOfWeek: z.number(),
    isWeekend: z.boolean(),
    availableTime: z.number(),
  }),
  preferences: z.object({
    preferredOrder: z.array(z.string()),
    hiddenCardTypes: z.array(z.string()),
    maxCards: z.number(),
  }),
});

// ============================================================================
// HOME PAGE
// ============================================================================

export interface HomePage {
  id: string;
  userId: string;
  date: Date;
  welcomeMessage: string;
  encouragement: string;
  primaryCTA: {
    text: string;
    action: string;
    recommendedDuration?: number;
  };
  cards: HomeCard[];
  generatedBy: string[];
  confidence: number;
  timestamp: Date;
}

export const HomePageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  welcomeMessage: z.string(),
  encouragement: z.string(),
  primaryCTA: z.object({
    text: z.string(),
    action: z.string(),
    recommendedDuration: z.number().optional(),
  }),
  cards: z.array(z.lazy(() => HomeCardSchema)),
  generatedBy: z.array(z.string()),
  confidence: z.number(),
  timestamp: z.date(),
});

// ============================================================================
// HOME INTELLIGENCE CONFIG
// ============================================================================

export interface HomeIntelligenceConfig {
  maxCardsPerDay: number;
  minPriorityThreshold: number;
  celebrationThreshold: number; // score threshold for celebration
  warningThreshold: number; // score threshold for warnings
  adaptiveOrdering: boolean;
  personalizationEnabled: boolean;
  timeBasedGreeting: boolean;
  streakBonus: number;
}

export const HomeIntelligenceConfigSchema = z.object({
  maxCardsPerDay: z.number(),
  minPriorityThreshold: z.number(),
  celebrationThreshold: z.number(),
  warningThreshold: z.number(),
  adaptiveOrdering: z.boolean(),
  personalizationEnabled: z.boolean(),
  timeBasedGreeting: z.boolean(),
  streakBonus: z.number(),
});

export const defaultHomeIntelligenceConfig: HomeIntelligenceConfig = {
  maxCardsPerDay: 8,
  minPriorityThreshold: 30,
  celebrationThreshold: 80,
  warningThreshold: 40,
  adaptiveOrdering: true,
  personalizationEnabled: true,
  timeBasedGreeting: true,
  streakBonus: 10,
};
