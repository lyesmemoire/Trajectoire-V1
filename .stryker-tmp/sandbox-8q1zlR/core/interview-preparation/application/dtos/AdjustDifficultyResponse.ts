/**
 * AdjustDifficultyResponse DTO
 *
 * Response DTO for adjusting difficulty.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface AdjustDifficultyResponse {
  planId: string;
  adjustedQuestions: AdjustedQuestionDTO[];
  adjustedAt: Date;
}

export interface AdjustedQuestionDTO {
  questionId: string;
  oldDifficulty: string;
  newDifficulty: string;
  reason: string;
}
