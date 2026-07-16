/**
 * FinalizeInterviewPlanResponse DTO
 *
 * Response DTO for finalizing interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface FinalizeInterviewPlanResponse {
  planId: string;
  candidateId: string;
  jobOfferId: string;
  status: string;
  finalizedAt: Date;
  finalizedBy: string;
}
