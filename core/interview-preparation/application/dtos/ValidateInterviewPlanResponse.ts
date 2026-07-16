/**
 * ValidateInterviewPlanResponse DTO
 *
 * Response DTO for validating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface ValidateInterviewPlanResponse {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  validatedAt: Date;
}
