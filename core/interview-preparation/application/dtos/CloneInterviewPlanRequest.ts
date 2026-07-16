/**
 * CloneInterviewPlanRequest DTO
 *
 * Request DTO for cloning interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface CloneInterviewPlanRequest {
  planId: string;
  newCandidateId?: string;
  newJobOfferId?: string;
  clonedBy: string;
}
