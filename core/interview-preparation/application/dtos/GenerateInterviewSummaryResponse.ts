/**
 * GenerateInterviewSummaryResponse DTO
 *
 * Response DTO for generating interview summary.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface GenerateInterviewSummaryResponse {
  planId: string;
  totalQuestions: number;
  totalDuration: number;
  softSkillQuestions: number;
  hardSkillQuestions: number;
  averageDifficulty: number;
  sections: string[];
  primaryCompetencies: string[];
  estimatedDifficulty: string;
  isBalanced: boolean;
  generatedAt: Date;
}
