import { z } from "zod";

// ===================================================================
// STRATEGY — The current investigation strategy
// Strategy is computed deterministically from the cognitive state.
// It directs the Planner on what to focus on next.
// ===================================================================

export const InterviewTempoSchema = z.enum([
  "ACCELERATE",
  "NORMAL",
  "DECELERATE",
  "PAUSE",
]);

export type InterviewTempo = z.infer<typeof InterviewTempoSchema>;

export const QuestionDepthSchema = z.enum([
  "SURFACE",
  "MODERATE",
  "DEEP",
  "EXHAUSTIVE",
]);

export type QuestionDepth = z.infer<typeof QuestionDepthSchema>;

export const ChallengeLevelSchema = z.enum([
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "EXTREME",
]);

export type ChallengeLevel = z.infer<typeof ChallengeLevelSchema>;

export const StrategySchema = z.object({
  primaryGoal: z.string().min(1),
  secondaryGoal: z.string().nullable().default(null),
  currentInvestigation: z.string().nullable().default(null),
  priorityCompetency: z.string().min(1),
  questionDepth: QuestionDepthSchema,
  challengeLevel: ChallengeLevelSchema,
  interviewTempo: InterviewTempoSchema,
  expectedEvidence: z.array(z.string()).default([]),
  successCriteria: z.string().min(1),
  failureCriteria: z.string().min(1),
  confidenceDeltaExpected: z.number().min(-1).max(1),
  riskAssessment: z.string().nullable().default(null),
});

export type Strategy = z.infer<typeof StrategySchema>;
