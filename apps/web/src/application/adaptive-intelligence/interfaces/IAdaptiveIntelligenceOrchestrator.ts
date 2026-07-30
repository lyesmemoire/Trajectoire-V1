/**
 * Adaptive Intelligence Orchestrator Interfaces
 * Central brain that orchestrates all AI engines and services
 */

import { z } from "zod";

// ============================================================================
// USER CONTEXT
// ============================================================================

export interface UserContext {
  userId: string;
  profile: UserProfile;
  history: UserHistory;
  currentSimulation: CurrentSimulation | null;
  goals: UserGoals;
  scores: UserScores;
  weaknesses: UserWeaknesses;
  context: ContextualFactors;
}

export const UserContextSchema = z.object({
  userId: z.string(),
  profile: z.lazy(() => UserProfileSchema),
  history: z.lazy(() => UserHistorySchema),
  currentSimulation: z.lazy(() => CurrentSimulationSchema).nullable(),
  goals: z.lazy(() => UserGoalsSchema),
  scores: z.lazy(() => UserScoresSchema),
  weaknesses: z.lazy(() => UserWeaknessesSchema),
  context: z.lazy(() => ContextualFactorsSchema),
});

// ============================================================================
// USER PROFILE
// ============================================================================

export interface UserProfile {
  careerProfile: {
    targetRole: string;
    currentLevel: string;
    experience: number;
    skills: string[];
    interests: string[];
  };
  personality: {
    traits: Record<string, number>;
    communicationStyle: string;
    stressTolerance: number;
    confidence: number;
  };
  preferences: {
    learningStyle: string;
    feedbackPreference: string;
    challengeLevel: string;
  };
}

export const UserProfileSchema = z.object({
  careerProfile: z.object({
    targetRole: z.string(),
    currentLevel: z.string(),
    experience: z.number(),
    skills: z.array(z.string()),
    interests: z.array(z.string()),
  }),
  personality: z.object({
    traits: z.record(z.string(), z.number()),
    communicationStyle: z.string(),
    stressTolerance: z.number(),
    confidence: z.number(),
  }),
  preferences: z.object({
    learningStyle: z.string(),
    feedbackPreference: z.string(),
    challengeLevel: z.string(),
  }),
});

// ============================================================================
// USER HISTORY
// ============================================================================

export interface UserHistory {
  simulations: SimulationHistory[];
  conversations: ConversationHistory[];
  learningProgress: LearningProgress[];
  timeSpent: number;
  lastActivity: Date;
  streak: number;
}

export const UserHistorySchema = z.object({
  simulations: z.array(z.lazy(() => SimulationHistorySchema)),
  conversations: z.array(z.lazy(() => ConversationHistorySchema)),
  learningProgress: z.array(z.lazy(() => LearningProgressSchema)),
  timeSpent: z.number(),
  lastActivity: z.date(),
  streak: z.number(),
});

export interface SimulationHistory {
  id: string;
  date: Date;
  role: string;
  duration: number;
  score: number;
  passed: boolean;
}

export const SimulationHistorySchema = z.object({
  id: z.string(),
  date: z.date(),
  role: z.string(),
  duration: z.number(),
  score: z.number(),
  passed: z.boolean(),
});

export interface ConversationHistory {
  id: string;
  date: Date;
  type: string;
  duration: number;
  quality: number;
}

export const ConversationHistorySchema = z.object({
  id: z.string(),
  date: z.date(),
  type: z.string(),
  duration: z.number(),
  quality: z.number(),
});

export interface LearningProgress {
  topic: string;
  progress: number;
  lastUpdated: Date;
}

export const LearningProgressSchema = z.object({
  topic: z.string(),
  progress: z.number(),
  lastUpdated: z.date(),
});

// ============================================================================
// CURRENT SIMULATION
// ============================================================================

export interface CurrentSimulation {
  id: string;
  role: string;
  stage: string;
  duration: number;
  turns: number;
  currentScore: number;
  confidence: number;
  stress: number;
}

export const CurrentSimulationSchema = z.object({
  id: z.string(),
  role: z.string(),
  stage: z.string(),
  duration: z.number(),
  turns: z.number(),
  currentScore: z.number(),
  confidence: z.number(),
  stress: z.number(),
});

// ============================================================================
// USER GOALS
// ============================================================================

export interface UserGoals {
  primary: string;
  secondary: string[];
  timeline: string;
  priority: "high" | "medium" | "low";
  progress: number;
}

export const UserGoalsSchema = z.object({
  primary: z.string(),
  secondary: z.array(z.string()),
  timeline: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  progress: z.number(),
});

// ============================================================================
// USER SCORES
// ============================================================================

export interface UserScores {
  overall: number;
  employability: number;
  confidence: number;
  skillGaps: Record<string, number>;
  strengths: string[];
  areasForImprovement: string[];
}

export const UserScoresSchema = z.object({
  overall: z.number(),
  employability: z.number(),
  confidence: z.number(),
  skillGaps: z.record(z.string(), z.number()),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
});

// ============================================================================
// USER WEAKNESSES
// ============================================================================

export interface UserWeaknesses {
  identified: string[];
  severity: Record<string, "low" | "medium" | "high">;
  addressed: string[];
  recurring: string[];
}

export const UserWeaknessesSchema = z.object({
  identified: z.array(z.string()),
  severity: z.record(z.string(), z.enum(["low", "medium", "high"])),
  addressed: z.array(z.string()),
  recurring: z.array(z.string()),
});

// ============================================================================
// CONTEXTUAL FACTORS
// ============================================================================

export interface ContextualFactors {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  dayOfWeek: string;
  sessionCount: number;
  recentPerformance: "improving" | "stable" | "declining";
  motivation: number;
  fatigue: number;
  environment: "quiet" | "moderate" | "noisy";
  device: "desktop" | "tablet" | "mobile";
}

export const ContextualFactorsSchema = z.object({
  timeOfDay: z.enum(["morning", "afternoon", "evening", "night"]),
  dayOfWeek: z.string(),
  sessionCount: z.number(),
  recentPerformance: z.enum(["improving", "stable", "declining"]),
  motivation: z.number(),
  fatigue: z.number(),
  environment: z.enum(["quiet", "moderate", "noisy"]),
  device: z.enum(["desktop", "tablet", "mobile"]),
});

// ============================================================================
// ORCHESTRATION DECISION
// ============================================================================

export interface OrchestratorDecision {
  id: string;
  timestamp: Date;
  userId: string;
  context: UserContext;
  analysis: ContextAnalysis;
  actions: OrchestratorAction[];
  priority: "critical" | "high" | "medium" | "low";
  reasoning: string;
  expectedOutcome: string;
}

export const OrchestratorDecisionSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  userId: z.string(),
  context: z.lazy(() => UserContextSchema),
  analysis: z.lazy(() => ContextAnalysisSchema),
  actions: z.array(z.lazy(() => OrchestratorActionSchema)),
  priority: z.enum(["critical", "high", "medium", "low"]),
  reasoning: z.string(),
  expectedOutcome: z.string(),
});

// ============================================================================
// CONTEXT ANALYSIS
// ============================================================================

export interface ContextAnalysis {
  userState: UserState;
  needs: UserNeeds;
  opportunities: UserOpportunities;
  risks: UserRisks;
  recommendations: string[];
}

export const ContextAnalysisSchema = z.object({
  userState: z.lazy(() => UserStateSchema),
  needs: z.lazy(() => UserNeedsSchema),
  opportunities: z.lazy(() => UserOpportunitiesSchema),
  risks: z.lazy(() => UserRisksSchema),
  recommendations: z.array(z.string()),
});

export interface UserState {
  engagement: number;
  readiness: number;
  capability: number;
  motivation: number;
  stress: number;
  confidence: number;
}

export const UserStateSchema = z.object({
  engagement: z.number(),
  readiness: z.number(),
  capability: z.number(),
  motivation: z.number(),
  stress: z.number(),
  confidence: z.number(),
});

export interface UserNeeds {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  priority: string[];
}

export const UserNeedsSchema = z.object({
  immediate: z.array(z.string()),
  shortTerm: z.array(z.string()),
  longTerm: z.array(z.string()),
  priority: z.array(z.string()),
});

export interface UserOpportunities {
  skillDevelopment: string[];
  careerAdvancement: string[];
  performanceImprovement: string[];
  learning: string[];
}

export const UserOpportunitiesSchema = z.object({
  skillDevelopment: z.array(z.string()),
  careerAdvancement: z.array(z.string()),
  performanceImprovement: z.array(z.string()),
  learning: z.array(z.string()),
});

export interface UserRisks {
  disengagement: number;
  burnout: number;
  skillAtrophy: string[];
  goalAbandonment: number;
}

export const UserRisksSchema = z.object({
  disengagement: z.number(),
  burnout: z.number(),
  skillAtrophy: z.array(z.string()),
  goalAbandonment: z.number(),
});

// ============================================================================
// ORCHESTRATOR ACTIONS
// ============================================================================

export interface OrchestratorAction {
  id: string;
  type: ActionType;
  engine: EngineType;
  priority: number;
  parameters: Record<string, unknown>;
  dependencies: string[];
  expectedDuration: number;
  estimatedValue: number;
  risk: "low" | "medium" | "high";
}

export const OrchestratorActionSchema = z.object({
  id: z.string(),
  type: z.lazy(() => ActionTypeSchema),
  engine: z.lazy(() => EngineTypeSchema),
  priority: z.number(),
  parameters: z.record(z.string(), z.any()),
  dependencies: z.array(z.string()),
  expectedDuration: z.number(),
  estimatedValue: z.number(),
  risk: z.enum(["low", "medium", "high"]),
});

export type ActionType =
  | "analyze"
  | "recommend"
  | "train"
  | "evaluate"
  | "adapt"
  | "intervene"
  | "report"
  | "guide";

export const ActionTypeSchema = z.enum([
  "analyze",
  "recommend",
  "train",
  "evaluate",
  "adapt",
  "intervene",
  "report",
  "guide",
]);

export type EngineType =
  | "careerProfile"
  | "weaknessDetector"
  | "goalEngine"
  | "recommendationEngine"
  | "learningPath"
  | "confidenceScore"
  | "employability"
  | "diagnostic"
  | "conversationEngine"
  | "personalityEngine"
  | "evaluationEngine"
  | "aiQualityPlatform";

export const EngineTypeSchema = z.enum([
  "careerProfile",
  "weaknessDetector",
  "goalEngine",
  "recommendationEngine",
  "learningPath",
  "confidenceScore",
  "employability",
  "diagnostic",
  "conversationEngine",
  "personalityEngine",
  "evaluationEngine",
  "aiQualityPlatform",
]);

// ============================================================================
// EXECUTION RESULT
// ============================================================================

export interface ExecutionResult {
  decisionId: string;
  timestamp: Date;
  userId: string;
  actions: ActionExecution[];
  overallSuccess: boolean;
  totalDuration: number;
  totalValue: number;
  errors: ExecutionError[];
  insights: ExecutionInsight[];
}

export const ExecutionResultSchema = z.object({
  decisionId: z.string(),
  timestamp: z.date(),
  userId: z.string(),
  actions: z.array(z.lazy(() => ActionExecutionSchema)),
  overallSuccess: z.boolean(),
  totalDuration: z.number(),
  totalValue: z.number(),
  errors: z.array(z.lazy(() => ExecutionErrorSchema)),
  insights: z.array(z.lazy(() => ExecutionInsightSchema)),
});

export interface ActionExecution {
  actionId: string;
  engine: EngineType;
  success: boolean;
  duration: number;
  value: number;
  output: any;
  error: string | null;
}

export const ActionExecutionSchema = z.object({
  actionId: z.string(),
  engine: z.lazy(() => EngineTypeSchema),
  success: z.boolean(),
  duration: z.number(),
  value: z.number(),
  output: z.any(),
  error: z.string().nullable(),
});

export interface ExecutionError {
  actionId: string;
  engine: EngineType;
  error: string;
  severity: "low" | "medium" | "high";
  recoverable: boolean;
}

export const ExecutionErrorSchema = z.object({
  actionId: z.string(),
  engine: z.lazy(() => EngineTypeSchema),
  error: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  recoverable: z.boolean(),
});

export interface ExecutionInsight {
  category: string;
  insight: string;
  confidence: number;
  actionable: boolean;
}

export const ExecutionInsightSchema = z.object({
  category: z.string(),
  insight: z.string(),
  confidence: z.number(),
  actionable: z.boolean(),
});

// ============================================================================
// ORCHESTRATOR CONFIGURATION
// ============================================================================

export interface OrchestratorConfig {
  maxConcurrentActions: number;
  actionTimeout: number;
  riskTolerance: "low" | "medium" | "high";
  learningRate: number;
  adaptationFrequency: number;
  interventionThreshold: number;
  valueThreshold: number;
}

export const OrchestratorConfigSchema = z.object({
  maxConcurrentActions: z.number(),
  actionTimeout: z.number(),
  riskTolerance: z.enum(["low", "medium", "high"]),
  learningRate: z.number(),
  adaptationFrequency: z.number(),
  interventionThreshold: z.number(),
  valueThreshold: z.number(),
});

export const defaultOrchestratorConfig: OrchestratorConfig = {
  maxConcurrentActions: 5,
  actionTimeout: 30000, // 30 seconds
  riskTolerance: "medium",
  learningRate: 0.1,
  adaptationFrequency: 100, // Every 100 actions
  interventionThreshold: 0.7, // 70% confidence needed
  valueThreshold: 0.5, // Minimum value to execute
};
