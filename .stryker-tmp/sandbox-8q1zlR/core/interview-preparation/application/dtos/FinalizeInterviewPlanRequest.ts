/**
 * FinalizeInterviewPlanRequest DTO
 *
 * Request DTO for finalizing interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface FinalizeInterviewPlanRequest {
  planId: string;
  finalizedBy: string;
}
