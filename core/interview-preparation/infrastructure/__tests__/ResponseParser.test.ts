/**
 * ResponseParser Unit Tests
 *
 * Tests for infrastructure response parser.
 * NO network calls, NO external dependencies.
 * ONLY unit tests with mocks.
 */

import { describe, it, expect } from "vitest";
import { ResponseParser } from "../ai/ResponseParser";
import { ParsingError } from "../errors/InfrastructureErrors";

describe("ResponseParser", () => {
  let responseParser: ResponseParser;

  beforeEach(() => {
    responseParser = new ResponseParser();
  });

  describe("parseQuestionGenerationResponse", () => {
    it("should parse valid JSON response with questions", () => {
      const validJson = JSON.stringify({
        questions: [
          {
            id: "q1",
            text: "What is your experience with React?",
            type: "TECHNICAL",
            difficulty: "MEDIUM",
            competency: "React",
            skillLevel: "MID_LEVEL",
            expectedDuration: 10,
            evaluationCriteria: ["Technical accuracy", "Clarity"],
            expectedAnswerStructure: ["Introduction", "Examples", "Conclusion"],
          },
        ],
      });

      const result = responseParser.parseQuestionGenerationResponse(validJson);

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].id).toBe("q1");
      expect(result.questions[0].text).toBe("What is your experience with React?");
      expect(result.questions[0].type).toBe("TECHNICAL");
      expect(result.questions[0].difficulty).toBe("MEDIUM");
    });

    it("should throw ParsingError for invalid JSON", () => {
      const invalidJson = "{ invalid json }";

      expect(() => {
        responseParser.parseQuestionGenerationResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should throw ParsingError when questions array is missing", () => {
      const invalidJson = JSON.stringify({ data: "something" });

      expect(() => {
        responseParser.parseQuestionGenerationResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should throw ParsingError when questions array is empty", () => {
      const invalidJson = JSON.stringify({ questions: [] });

      expect(() => {
        responseParser.parseQuestionGenerationResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should throw ParsingError when question is missing required fields", () => {
      const invalidJson = JSON.stringify({
        questions: [
          {
            id: "q1",
            text: "Question text",
          },
        ],
      });

      expect(() => {
        responseParser.parseQuestionGenerationResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should parse multiple questions", () => {
      const validJson = JSON.stringify({
        questions: [
          {
            id: "q1",
            text: "Question 1",
            type: "TECHNICAL",
            difficulty: "EASY",
            competency: "React",
            skillLevel: "JUNIOR",
            expectedDuration: 5,
            evaluationCriteria: ["Accuracy"],
            expectedAnswerStructure: ["Answer"],
          },
          {
            id: "q2",
            text: "Question 2",
            type: "BEHAVIORAL",
            difficulty: "MEDIUM",
            competency: "Leadership",
            skillLevel: "SENIOR",
            expectedDuration: 15,
            evaluationCriteria: ["Communication"],
            expectedAnswerStructure: ["STAR"],
          },
        ],
      });

      const result = responseParser.parseQuestionGenerationResponse(validJson);

      expect(result.questions).toHaveLength(2);
      expect(result.questions[0].id).toBe("q1");
      expect(result.questions[1].id).toBe("q2");
    });
  });

  describe("parseEvaluationCriteriaResponse", () => {
    it("should parse valid evaluation criteria array", () => {
      const validJson = JSON.stringify([
        "Technical accuracy",
        "Problem-solving approach",
        "Communication skills",
      ]);

      const result = responseParser.parseEvaluationCriteriaResponse(validJson);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe("Technical accuracy");
      expect(result[1]).toBe("Problem-solving approach");
      expect(result[2]).toBe("Communication skills");
    });

    it("should throw ParsingError for invalid JSON", () => {
      const invalidJson = "{ not an array }";

      expect(() => {
        responseParser.parseEvaluationCriteriaResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should throw ParsingError when response is not an array", () => {
      const invalidJson = JSON.stringify({ criteria: "something" });

      expect(() => {
        responseParser.parseEvaluationCriteriaResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should parse empty array", () => {
      const validJson = JSON.stringify([]);

      const result = responseParser.parseEvaluationCriteriaResponse(validJson);

      expect(result).toHaveLength(0);
    });
  });

  describe("parseExpectedAnswerResponse", () => {
    it("should parse valid expected answer structure array", () => {
      const validJson = JSON.stringify([
        "Introduction",
        "Main explanation",
        "Examples",
        "Conclusion",
      ]);

      const result = responseParser.parseExpectedAnswerResponse(validJson);

      expect(result).toHaveLength(4);
      expect(result[0]).toBe("Introduction");
      expect(result[3]).toBe("Conclusion");
    });

    it("should throw ParsingError for invalid JSON", () => {
      const invalidJson = "{ not an array }";

      expect(() => {
        responseParser.parseExpectedAnswerResponse(invalidJson);
      }).toThrow(ParsingError);
    });

    it("should throw ParsingError when response is not an array", () => {
      const invalidJson = JSON.stringify({ structure: "something" });

      expect(() => {
        responseParser.parseExpectedAnswerResponse(invalidJson);
      }).toThrow(ParsingError);
    });
  });
});
