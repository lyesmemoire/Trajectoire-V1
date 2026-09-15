import { z } from "zod";

/**
 * Report Schema
 * Zod schema for validating AI-generated report responses
 */

export const ReportQuestionSchema = z.object({
  messageId: z.string().optional(), // echoed from EVALUATION DATA by LLM, validated server-side
  question: z.string(),
  answer: z.string(),
  competency: z.string().nullable(),
  score: z.number().min(0).max(100),
  whatWentWell: z.array(z.string()),
  whatWasMissing: z.array(z.string()),
  howToImprove: z.array(z.string()),
  betterAnswer: z.string(),
});

export const ReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  technical: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(0),
  improvements: z.array(z.string()).min(0),
  summary: z.string().min(1),
  recommendation: z.string().min(1),
  questionByQuestion: z.array(ReportQuestionSchema).optional().default([]),
});

export type ReportAnalysis = z.infer<typeof ReportSchema>;
