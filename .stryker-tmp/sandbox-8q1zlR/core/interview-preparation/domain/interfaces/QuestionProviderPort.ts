/**
 * QuestionProviderPort
 *
 * Port interface for question provision.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition.
 */
// @ts-nocheck


import { InterviewQuestion } from "../entities/InterviewQuestion";
import { QuestionTemplate, QuestionCriteria, TemplateCriteria } from "../types";

export interface QuestionProviderPort {
  /**
   * Provide questions based on criteria
   * @param criteria - Question criteria
   * @returns Array of interview questions
   * @throws QuestionGenerationError if generation fails
   */
  provideQuestions(criteria: QuestionCriteria): Promise<InterviewQuestion[]>;

  /**
   * Provide question templates based on criteria
   * @param criteria - Template criteria
   * @returns Array of question templates
   */
  provideTemplates(criteria: TemplateCriteria): Promise<QuestionTemplate[]>;

  /**
   * Search question templates by query
   * @param query - Search query
   * @returns Array of matching question templates
   */
  searchTemplates(query: string): Promise<QuestionTemplate[]>;
}
