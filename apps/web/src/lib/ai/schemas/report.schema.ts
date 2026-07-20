import { z } from "zod";

/**
 * Report Schema
 * Zod schema for validating AI-generated report responses
 */

export const ReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  communication: z.number().min(0).max(100),
  technical: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(0),
  improvements: z.array(z.string()).min(0),
  summary: z.string().min(1),
  recommendation: z.string().min(1),
});

export type ReportAnalysis = z.infer<typeof ReportSchema>;
