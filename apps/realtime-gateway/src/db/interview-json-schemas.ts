import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  category: z.string().optional(),
});
// Canonical Reference: COS-OBJ-003 (blueprint.runtime.question)
// Owner: COS Team
export type Question = z.infer<typeof QuestionSchema>;

export const AnswerSchema = z.object({
  question_id: z.string(),
  transcript: z.string(),
// Canonical Reference: COS-OBJ-004 (blueprint.runtime.answer)
// Owner: COS Team
  duration_s: z.number().optional(),
});
export type Answer = z.infer<typeof AnswerSchema>;

export const QuestionsSchema = z.array(QuestionSchema);
export type Questions = z.infer<typeof QuestionsSchema>;

export const AnswersSchema = z.array(AnswerSchema);
export type Answers = z.infer<typeof AnswersSchema>;

export const AnalysisSchema = z.object({
  global_score: z.number(),
  percentile: z.number(),
  recommendation: z.string(),
  executive_summary: z.string(),
  soft_skills: z.array(z.object({
    label: z.string(),
    score: z.number(),
    comment: z.string().optional(),
  })),
  hard_skills: z.array(z.object({
    label: z.string(),
    score: z.number(),
    comment: z.string().optional(),
  })),
  integrity_score: z.number(),
  consistency_score: z.number(),
  assessment_text: z.string(),
  gap_analysis: z.string().optional(),
  decisions: z.array(z.object({
    scenario: z.string(),
    response: z.string(),
    analysis: z.string(),
    score: z.number(),
  })),
  overall_decision_score: z.number(),
  decision_style: z.string(),
  schema_version: z.literal("1.0").optional(),
});

export type Analysis = z.infer<typeof AnalysisSchema>;

export function parseQuestions(data: unknown): Questions {
  return QuestionsSchema.parse(data);
}

export function parseAnswers(data: unknown): Answers {
  return AnswersSchema.parse(data);
}
