/**
 * GenerateInterviewPlanRequest DTO
 *
 * Request DTO for generating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */

export interface GenerateInterviewPlanRequest {
  candidateId: string;
  jobOfferId: string;
  matchingId: string;
  requestedBy: string;
  constraints?: InterviewConstraintsDTO;
  customRequirements?: string[];
}

export interface InterviewConstraintsDTO {
  maxTotalDuration?: number;
  maxQuestionsPerSection?: number;
  maxTotalQuestions?: number;
  minSoftSkillQuestions?: number;
  minHardSkillQuestions?: number;
  maxDifficulty?: string;
  minDifficulty?: string;
  mandatoryCompetencies?: string[];
  forbiddenTopics?: string[];
}
