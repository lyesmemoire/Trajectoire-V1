/**
 * AIGenerationPort
 *
 * Port interface for AI-based question generation.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition for AI adapter.
 */

import { AIQuestionResponse, QuestionContext } from "../../domain/types";

export interface AIGenerationPort {
  /**
   * Generate interview question using AI
   * @param context - Question generation context
   * @returns AI-generated question response
   * @throws AIGenerationError if generation fails
   */
  generateQuestion(context: QuestionContext): Promise<AIQuestionResponse>;

  /**
   * Generate evaluation criteria using AI
   * @param questionText - Question text
   * @returns AI-generated evaluation criteria
   * @throws AIGenerationError if generation fails
   */
  generateEvaluationCriteria(questionText: string): Promise<string[]>;

  /**
   * Generate expected answer structure using AI
   * @param questionText - Question text
   * @returns AI-generated expected answer structure
   * @throws AIGenerationError if generation fails
   */
  generateExpectedAnswer(questionText: string): Promise<string[]>;
}
