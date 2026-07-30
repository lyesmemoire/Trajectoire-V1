import { z } from "zod";

/**
 * Validates raw data from Supabase interview_sessions table.
 */
export const StandardSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  job_title: z.string(),
  job_description: z.string().nullable(),
  candidate_summary: z.string().nullable(),
  questions: z.array(z.string()),
  answers: z.array(z.string()),
  status: z.enum(["active", "completed"]),
  score: z.number().nullable(),
  final_score: z.number().nullable(),
  level: z.string().nullable(),
  feedback_json: z.record(z.string(), z.unknown()).nullable(),
  created_at: z.string(),
  completed_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export type StandardSessionRow = z.infer<typeof StandardSessionSchema>;

/**
 * Validates raw data from Supabase premium_interview_sessions table.
 */
export const PremiumSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  job_title: z.string(),
  company: z.string().nullable(),
  persona: z.enum([
    "big_tech_senior",
    "startup_founder",
    "corporate_hr",
    "technical_lead",
    "aggressive_recruiter",
  ]),
  difficulty: z.enum(["normal", "hard", "elite"]),
  phase: z.enum([
    "intro",
    "cv_deep_dive",
    "technical_case",
    "behavioral",
    "pressure_test",
    "closing",
  ]),
  transcript: z.array(
    z.object({
      role: z.enum(["interviewer", "candidate"]),
      content: z.string(),
    })
  ),
  memory: z.object({
    structuredSummary: z.string().optional(),
    keyStrengths: z.array(z.string()).optional(),
    keyWeaknesses: z.array(z.string()).optional(),
  }).nullable(),
  is_processing: z.boolean(),
  status: z.enum(["active", "completed"]),
  score: z.number(),
  technical_score: z.number().nullable(),
  communication_score: z.number().nullable(),
  confidence_score: z.number().nullable(),
  stress_score: z.number().nullable(),
  tags: z.array(z.string()),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export type PremiumSessionRow = z.infer<typeof PremiumSessionSchema>;

/**
 * Helper to validate standard session DB row.
 */
export function validateStandardSession(data: any): StandardSessionRow {
  return StandardSessionSchema.parse(data);
}

/**
 * Helper to validate premium session DB row.
 */
export function validatePremiumSession(data: any): PremiumSessionRow {
  return PremiumSessionSchema.parse(data);
}
