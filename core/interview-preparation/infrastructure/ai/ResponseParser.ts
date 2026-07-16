/**
 * ResponseParser
 *
 * Infrastructure response parser for AI generation.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY JSON parsing and validation.
 */

import { ParsingError } from "../errors/InfrastructureErrors";

export interface ParsedQuestion {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  competency: string;
  skillLevel: string;
  expectedDuration: number;
  evaluationCriteria: string[];
  expectedAnswerStructure: string[];
}

export interface ParsedResponse {
  questions: ParsedQuestion[];
}

export class ResponseParser {
  parseQuestionGenerationResponse(jsonString: string): ParsedResponse {
    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new ParsingError("Invalid response: missing or invalid questions array", jsonString);
      }

      if (parsed.questions.length === 0) {
        throw new ParsingError("Invalid response: empty questions array", jsonString);
      }

      const questions = parsed.questions.map((q: unknown, index: number) => {
        if (!this.isValidQuestion(q)) {
          throw new ParsingError(`Invalid question at index ${index}`, jsonString);
        }
        return q as ParsedQuestion;
      });

      return { questions };
    } catch (error) {
      if (error instanceof ParsingError) {
        throw error;
      }
      throw new ParsingError(`Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`, jsonString);
    }
  }

  parseEvaluationCriteriaResponse(jsonString: string): string[] {
    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new ParsingError("Invalid response: expected array", jsonString);
      }

      return parsed as string[];
    } catch (error) {
      if (error instanceof ParsingError) {
        throw error;
      }
      throw new ParsingError(`Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`, jsonString);
    }
  }

  parseExpectedAnswerResponse(jsonString: string): string[] {
    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new ParsingError("Invalid response: expected array", jsonString);
      }

      return parsed as string[];
    } catch (error) {
      if (error instanceof ParsingError) {
        throw error;
      }
      throw new ParsingError(`Failed to parse JSON: ${error instanceof Error ? error.message : "Unknown error"}`, jsonString);
    }
  }

  private isValidQuestion(q: unknown): boolean {
    if (typeof q !== "object" || q === null) {
      return false;
    }

    const question = q as Record<string, unknown>;

    const requiredFields = ["id", "text", "type", "difficulty", "competency", "skillLevel", "expectedDuration", "evaluationCriteria", "expectedAnswerStructure"];

    for (const field of requiredFields) {
      if (!(field in question)) {
        return false;
      }
    }

    if (typeof question.id !== "string" || question.id.length === 0) {
      return false;
    }

    if (typeof question.text !== "string" || question.text.length === 0) {
      return false;
    }

    if (typeof question.type !== "string" || question.type.length === 0) {
      return false;
    }

    if (typeof question.difficulty !== "string" || question.difficulty.length === 0) {
      return false;
    }

    if (typeof question.competency !== "string" || question.competency.length === 0) {
      return false;
    }

    if (typeof question.skillLevel !== "string" || question.skillLevel.length === 0) {
      return false;
    }

    if (typeof question.expectedDuration !== "number" || question.expectedDuration <= 0) {
      return false;
    }

    if (!Array.isArray(question.evaluationCriteria)) {
      return false;
    }

    if (!Array.isArray(question.expectedAnswerStructure)) {
      return false;
    }

    return true;
  }
}
