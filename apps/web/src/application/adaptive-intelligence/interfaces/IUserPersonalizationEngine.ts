/**
 * User Personalization Engine Interfaces
 * Creates personalized matrix for each user
 */

import { z } from "zod";

// ============================================================================
// USER PERSONALITY MATRIX
// ============================================================================

export interface UserPersonalityMatrix {
  userId: string;
  tolerance: ToleranceProfile;
  motivation: MotivationProfile;
  experience: ExperienceProfile;
  objectives: ObjectivesProfile;
  history: HistoryProfile;
  personality: PersonalityProfile;
  preferences: PreferencesProfile;
  adaptation: AdaptationProfile;
  timestamp: Date;
}

export const UserPersonalityMatrixSchema = z.object({
  userId: z.string(),
  tolerance: z.lazy(() => ToleranceProfileSchema),
  motivation: z.lazy(() => MotivationProfileSchema),
  experience: z.lazy(() => ExperienceProfileSchema),
  objectives: z.lazy(() => ObjectivesProfileSchema),
  history: z.lazy(() => HistoryProfileSchema),
  personality: z.lazy(() => PersonalityProfileSchema),
  preferences: z.lazy(() => PreferencesProfileSchema),
  adaptation: z.lazy(() => AdaptationProfileSchema),
  timestamp: z.date(),
});

// ============================================================================
// TOLERANCE PROFILE
// ============================================================================

export interface ToleranceProfile {
  stressTolerance: number; // 0-1
  difficultyTolerance: number; // 0-1
  feedbackTolerance: number; // 0-1
  changeTolerance: number; // 0-1
  failureTolerance: number; // 0-1
}

export const ToleranceProfileSchema = z.object({
  stressTolerance: z.number(),
  difficultyTolerance: z.number(),
  feedbackTolerance: z.number(),
  changeTolerance: z.number(),
  failureTolerance: z.number(),
});

// ============================================================================
// MOTIVATION PROFILE
// ============================================================================

export interface MotivationProfile {
  intrinsicMotivation: number; // 0-1
  extrinsicMotivation: number; // 0-1
  achievementMotivation: number; // 0-1
  socialMotivation: number; // 0-1
  growthMotivation: number; // 0-1
}

export const MotivationProfileSchema = z.object({
  intrinsicMotivation: z.number(),
  extrinsicMotivation: z.number(),
  achievementMotivation: z.number(),
  socialMotivation: z.number(),
  growthMotivation: z.number(),
});

// ============================================================================
// EXPERIENCE PROFILE
// ============================================================================

export interface ExperienceProfile {
  totalSessions: number;
  totalHours: number;
  skillLevel: number; // 0-1
  expertiseAreas: string[];
  learningRate: number; // 0-1
  retentionRate: number; // 0-1
}

export const ExperienceProfileSchema = z.object({
  totalSessions: z.number(),
  totalHours: z.number(),
  skillLevel: z.number(),
  expertiseAreas: z.array(z.string()),
  learningRate: z.number(),
  retentionRate: z.number(),
});

// ============================================================================
// OBJECTIVES PROFILE
// ============================================================================

export interface ObjectivesProfile {
  primaryObjective: string;
  secondaryObjectives: string[];
  objectivePriority: number; // 0-1
  timeHorizon: "short" | "medium" | "long";
  flexibility: number; // 0-1
}

export const ObjectivesProfileSchema = z.object({
  primaryObjective: z.string(),
  secondaryObjectives: z.array(z.string()),
  objectivePriority: z.number(),
  timeHorizon: z.enum(["short", "medium", "long"]),
  flexibility: z.number(),
});

// ============================================================================
// HISTORY PROFILE
// ============================================================================

export interface HistoryProfile {
  recentPerformance: number; // 0-1
  performanceTrend: "improving" | "stable" | "declining";
  engagementLevel: number; // 0-1
  consistency: number; // 0-1
  preferredActivities: string[];
  avoidedActivities: string[];
}

export const HistoryProfileSchema = z.object({
  recentPerformance: z.number(),
  performanceTrend: z.enum(["improving", "stable", "declining"]),
  engagementLevel: z.number(),
  consistency: z.number(),
  preferredActivities: z.array(z.string()),
  avoidedActivities: z.array(z.string()),
});

// ============================================================================
// PERSONALITY PROFILE
// ============================================================================

export interface PersonalityProfile {
  openness: number; // 0-1
  conscientiousness: number; // 0-1
  extraversion: number; // 0-1
  agreeableness: number; // 0-1
  neuroticism: number; // 0-1
}

export const PersonalityProfileSchema = z.object({
  openness: z.number(),
  conscientiousness: z.number(),
  extraversion: z.number(),
  agreeableness: z.number(),
  neuroticism: z.number(),
});

// ============================================================================
// PREFERENCES PROFILE
// ============================================================================

export interface PreferencesProfile {
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
  feedbackStyle: "direct" | "gentle" | "detailed" | "brief";
  challengeLevel: "easy" | "medium" | "hard" | "adaptive";
  sessionLength: number; // in minutes
  timeOfDay: "morning" | "afternoon" | "evening" | "flexible";
}

export const PreferencesProfileSchema = z.object({
  learningStyle: z.enum(["visual", "auditory", "kinesthetic", "mixed"]),
  feedbackStyle: z.enum(["direct", "gentle", "detailed", "brief"]),
  challengeLevel: z.enum(["easy", "medium", "hard", "adaptive"]),
  sessionLength: z.number(),
  timeOfDay: z.enum(["morning", "afternoon", "evening", "flexible"]),
});

// ============================================================================
// ADAPTATION PROFILE
// ============================================================================

export interface AdaptationProfile {
  adaptationSpeed: number; // 0-1
  adaptationAccuracy: number; // 0-1
  adaptationHistory: AdaptationRecord[];
}

export const AdaptationProfileSchema = z.object({
  adaptationSpeed: z.number(),
  adaptationAccuracy: z.number(),
  adaptationHistory: z.array(z.lazy(() => AdaptationRecordSchema)),
});

export interface AdaptationRecord {
  timestamp: Date;
  adaptationType: string;
  success: boolean;
  impact: number;
}

export const AdaptationRecordSchema = z.object({
  timestamp: z.date(),
  adaptationType: z.string(),
  success: z.boolean(),
  impact: z.number(),
});

// ============================================================================
// PERSONALIZATION CONFIG
// ============================================================================

export interface PersonalizationConfig {
  updateFrequency: number; // days between updates
  minDataPoints: number;
  adaptationThreshold: number;
  learningRate: number;
  profileDecay: number; // 0-1, how fast old data decays
}

export const PersonalizationConfigSchema = z.object({
  updateFrequency: z.number(),
  minDataPoints: z.number(),
  adaptationThreshold: z.number(),
  learningRate: z.number(),
  profileDecay: z.number(),
});

export const defaultPersonalizationConfig: PersonalizationConfig = {
  updateFrequency: 7,
  minDataPoints: 5,
  adaptationThreshold: 0.3,
  learningRate: 0.1,
  profileDecay: 0.05,
};
