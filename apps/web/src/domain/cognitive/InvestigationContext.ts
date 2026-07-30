import { z } from "zod";

// ===================================================================
// INVESTIGATION CONTEXT — Investigation Context Contract
// ===================================================================

export interface InvestigationConstraints {
  maxTurns: number;
  maxDuration: number; // in minutes
  maxTokens: number;
  allowedTopics: string[];
  forbiddenTopics: string[];
}

export interface InvestigationGoal {
  id: string;
  description: string;
  priority: number;
  targetCompetencies: string[];
  minConfidence: number;
}

export interface InvestigationContext {
  sessionId: string;
  candidateId: string;
  interviewId: string;
  startTime: Date;
  metadata: Record<string, any>;
  constraints: InvestigationConstraints;
  goals: InvestigationGoal[];
}

// Zod Schemas
export const InvestigationConstraintsSchema = z.object({
  maxTurns: z.number().int().min(1),
  maxDuration: z.number().int().min(1),
  maxTokens: z.number().int().min(1),
  allowedTopics: z.array(z.string()),
  forbiddenTopics: z.array(z.string()),
});

export const InvestigationGoalSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1),
  priority: z.number().int().min(1).max(10),
  targetCompetencies: z.array(z.string()),
  minConfidence: z.number().min(0).max(1),
});

export const InvestigationContextSchema = z.object({
  sessionId: z.string().min(1),
  candidateId: z.string().min(1),
  interviewId: z.string().min(1),
  startTime: z.date(),
  metadata: z.record(z.string(), z.any()),
  constraints: InvestigationConstraintsSchema,
  goals: z.array(InvestigationGoalSchema),
});
