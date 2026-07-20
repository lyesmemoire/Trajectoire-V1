import { z } from "zod";

/**
 * Interview Schema
 * Zod schema for validating AI-generated interview responses
 */

export const InterviewResponseSchema = z.object({
  response: z.string().min(1),
  followUpQuestion: z.string().optional(),
  evaluation: z.object({
    clarity: z.number().min(0).max(10).optional(),
    relevance: z.number().min(0).max(10).optional(),
    completeness: z.number().min(0).max(10).optional(),
  }).optional(),
});

export const InterviewSummarySchema = z.object({
  summary: z.string().min(1),
  keyTopics: z.array(z.string()).min(0),
  candidateStrengths: z.array(z.string()).min(0),
  areasForImprovement: z.array(z.string()).min(0),
});

export type InterviewResponse = z.infer<typeof InterviewResponseSchema>;
export type InterviewSummary = z.infer<typeof InterviewSummarySchema>;
