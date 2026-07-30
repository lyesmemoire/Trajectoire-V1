/**
 * Smart UI Interfaces
 * Adaptive interface
 */

import { z } from "zod";

// ============================================================================
// UI ELEMENT
// ============================================================================

export interface UIElement {
  id: string;
  type: "widget" | "card" | "chart" | "cta" | "recommendation" | "history" | "stat";
  title: string;
  content: string;
  size: "small" | "medium" | "large";
  position: { row: number; column: number };
  color: "blue" | "green" | "yellow" | "red" | "purple" | "orange" | "gray";
  priority: number; // 0-100
  visible: boolean;
  metadata: Record<string, unknown>;
}

export const UIElementSchema = z.object({
  id: z.string(),
  type: z.enum(["widget", "card", "chart", "cta", "recommendation", "history", "stat"]),
  title: z.string(),
  content: z.string(),
  size: z.enum(["small", "medium", "large"]),
  position: z.object({ row: z.number(), column: z.number() }),
  color: z.enum(["blue", "green", "yellow", "red", "purple", "orange", "gray"]),
  priority: z.number(),
  visible: z.boolean(),
  metadata: z.record(z.string(), z.any()),
});

// ============================================================================
// SMART UI CONFIGURATION
// ============================================================================

export interface SmartUIConfiguration {
  userId: string;
  userType: "beginner" | "intermediate" | "expert" | "recruiter" | "inactive" | "premium";
  preferences: {
    preferredLayout: "grid" | "list" | "dashboard";
    compactMode: boolean;
    darkMode: boolean;
    showRecommendations: boolean;
    showHistory: boolean;
    showStats: boolean;
  };
  context: {
    timeOfDay: "morning" | "afternoon" | "evening";
    dayOfWeek: number;
    availableTime: number; // minutes
    stressLevel: number;
    engagementLevel: number;
  };
}

export const SmartUIConfigurationSchema = z.object({
  userId: z.string(),
  userType: z.enum(["beginner", "intermediate", "expert", "recruiter", "inactive", "premium"]),
  preferences: z.object({
    preferredLayout: z.enum(["grid", "list", "dashboard"]),
    compactMode: z.boolean(),
    darkMode: z.boolean(),
    showRecommendations: z.boolean(),
    showHistory: z.boolean(),
    showStats: z.boolean(),
  }),
  context: z.object({
    timeOfDay: z.enum(["morning", "afternoon", "evening"]),
    dayOfWeek: z.number(),
    availableTime: z.number(),
    stressLevel: z.number(),
    engagementLevel: z.number(),
  }),
});

// ============================================================================
// SMART UI LAYOUT
// ============================================================================

export interface SmartUILayout {
  id: string;
  userId: string;
  elements: UIElement[];
  layout: "grid" | "list" | "dashboard";
  generatedBy: string[];
  timestamp: Date;
}

export const SmartUILayoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  elements: z.array(z.lazy(() => UIElementSchema)),
  layout: z.enum(["grid", "list", "dashboard"]),
  generatedBy: z.array(z.string()),
  timestamp: z.date(),
});

// ============================================================================
// SMART UI CONFIG
// ============================================================================

export interface SmartUIConfig {
  maxElements: number;
  minPriorityThreshold: number;
  adaptiveLayout: boolean;
  adaptiveColors: boolean;
  adaptiveSizing: boolean;
  userBasedDefaults: boolean;
}

export const SmartUIConfigSchema = z.object({
  maxElements: z.number(),
  minPriorityThreshold: z.number(),
  adaptiveLayout: z.boolean(),
  adaptiveColors: z.boolean(),
  adaptiveSizing: z.boolean(),
  userBasedDefaults: z.boolean(),
});

export const defaultSmartUIConfig: SmartUIConfig = {
  maxElements: 12,
  minPriorityThreshold: 40,
  adaptiveLayout: true,
  adaptiveColors: true,
  adaptiveSizing: true,
  userBasedDefaults: true,
};
