/**
 * PreviewInterviewPlanResponse DTO
 *
 * Response DTO for previewing interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface PreviewInterviewPlanResponse {
  planId: string;
  candidateId: string;
  jobOfferId: string;
  objective: string;
  sections: SectionPreviewDTO[];
  constraints: ConstraintsPreviewDTO;
  summary: SummaryPreviewDTO;
  previewedAt: Date;
}

export interface SectionPreviewDTO {
  sectionId: string;
  name: string;
  description: string;
  objective: string;
  questionCount: number;
  duration: number;
  order: number;
}

export interface ConstraintsPreviewDTO {
  maxTotalDuration: number;
  maxQuestionsPerSection: number;
  maxTotalQuestions: number;
  minSoftSkillQuestions: number;
  minHardSkillQuestions: number;
}

export interface SummaryPreviewDTO {
  totalQuestions: number;
  totalDuration: number;
  softSkillQuestions: number;
  hardSkillQuestions: number;
  averageDifficulty: string;
}
