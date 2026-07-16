/**
 * CloneInterviewPlanResponse DTO
 *
 * Response DTO for cloning interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface CloneInterviewPlanResponse {
  originalPlanId: string;
  newPlanId: string;
  candidateId: string;
  jobOfferId: string;
  clonedAt: Date;
  clonedBy: string;
}
