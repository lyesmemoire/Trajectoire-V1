import { z } from "zod";

/**
 * CV Schema
 * Zod schema for validating AI-generated CV analysis responses
 */

export const CVAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  atsScore: z.number().min(0).max(100),
  skills: z.object({
    matched: z.array(z.string()).min(0),
    missing: z.array(z.string()).min(0),
    additional: z.array(z.string()).min(0),
  }),
  strengths: z.array(z.string()).min(0),
  weaknesses: z.array(z.string()).min(0),
  recommendations: z.array(z.string()).min(0),
  summary: z.string().min(1),
});

export const CVSkillsSchema = z.object({
  technical: z.array(z.string()).min(0),
  soft: z.array(z.string()).min(0),
  tools: z.array(z.string()).min(0),
  languages: z.array(z.string()).min(0),
});

export type CVAnalysis = z.infer<typeof CVAnalysisSchema>;
export type CVSkills = z.infer<typeof CVSkillsSchema>;
