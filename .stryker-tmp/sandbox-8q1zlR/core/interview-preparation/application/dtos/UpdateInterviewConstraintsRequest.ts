/**
 * UpdateInterviewConstraintsRequest DTO
 *
 * Request DTO for updating interview constraints.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface UpdateInterviewConstraintsRequest {
  planId: string;
  constraints: InterviewConstraintsDTO;
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
