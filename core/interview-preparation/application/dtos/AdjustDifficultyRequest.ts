/**
 * AdjustDifficultyRequest DTO
 *
 * Request DTO for adjusting difficulty.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface AdjustDifficultyRequest {
  planId: string;
  candidateLevel: string;
}
