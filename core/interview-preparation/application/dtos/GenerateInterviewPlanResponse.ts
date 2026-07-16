/**
 * GenerateInterviewPlanResponse DTO
 *
 * Response DTO for generating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface GenerateInterviewPlanResponse {
  planId: string;
  candidateId: string;
  jobOfferId: string;
  matchingId: string;
  status: string;
  questionCount: number;
  totalDuration: number;
  overallCoverage: number;
  softSkillCoverage: number;
  hardSkillCoverage: number;
  gaps: string[];
  createdAt: Date;
  generatedBy: string;
}
