/**
 * OpenAIAdapter Unit Tests
 *
 * Tests for infrastructure OpenAI adapter.
 * NO network calls, NO external dependencies.
 * ONLY unit tests with mocks.
 */
// @ts-nocheck


import { describe, it, expect, beforeEach, vi } from "vitest";
import { OpenAIInterviewGenerationAdapter } from "../adapters/OpenAIInterviewGenerationAdapter";
import { OpenAIClient } from "../clients/OpenAIClient";
import { PromptBuilder } from "../ai/PromptBuilder";
import { ResponseParser } from "../ai/ResponseParser";
import { OpenAIError } from "../errors/InfrastructureErrors";
import { QuestionContext } from "../../domain/types";

describe("OpenAIInterviewGenerationAdapter", () => {
  let adapter: OpenAIInterviewGenerationAdapter;
  let mockOpenAIClient: OpenAIClient;
  let mockPromptBuilder: PromptBuilder;
  let mockResponseParser: ResponseParser;

  beforeEach(() => {
    mockOpenAIClient = {
      chatCompletion: vi.fn(),
    } as unknown as OpenAIClient;

    mockPromptBuilder = {
      buildQuestionGenerationPrompt: vi.fn(),
      buildEvaluationCriteriaPrompt: vi.fn(),
      buildExpectedAnswerPrompt: vi.fn(),
    } as unknown as PromptBuilder;

    mockResponseParser = {
      parseQuestionGenerationResponse: vi.fn(),
      parseEvaluationCriteriaResponse: vi.fn(),
      parseExpectedAnswerResponse: vi.fn(),
    } as unknown as ResponseParser;

    adapter = new OpenAIInterviewGenerationAdapter(
      mockOpenAIClient,
      mockPromptBuilder,
      mockResponseParser
    );
  });

  describe("generateQuestion", () => {
    it("should generate a question successfully", async () => {
      const context: QuestionContext = {
        candidateLevel: "SENIOR" as any,
        jobRequirements: [{ requirementId: "req1", competencyId: "react", requiredLevel: "SENIOR" as any, isMandatory: true }],
        previousQuestions: [],
      };

      const mockPrompt = "Generated prompt";
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                questions: [
                  {
                    id: "q1",
                    text: "What is React?",
                    type: "TECHNICAL",
                    difficulty: "MEDIUM",
                    competency: "React",
                    skillLevel: "SENIOR",
                    expectedDuration: 10,
                    evaluationCriteria: ["Accuracy"],
                    expectedAnswerStructure: ["Intro", "Details"],
                  },
                ],
              }),
            },
          },
        ],
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150,
        },
      };

      const mockParsed = {
        questions: [
          {
            id: "q1",
            text: "What is React?",
            type: "TECHNICAL",
            difficulty: "MEDIUM",
            competency: "React",
            skillLevel: "SENIOR",
            expectedDuration: 10,
            evaluationCriteria: ["Accuracy"],
            expectedAnswerStructure: ["Intro", "Details"],
          },
        ],
      };

      vi.mocked(mockPromptBuilder.buildQuestionGenerationPrompt).mockReturnValue(mockPrompt);
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);
      vi.mocked(mockResponseParser.parseQuestionGenerationResponse).mockReturnValue(mockParsed);

      const result = await adapter.generateQuestion(context);

      expect(result.questionText).toBe("What is React?");
      expect(result.suggestedEvaluationCriteria).toEqual(["Accuracy"]);
      expect(result.suggestedKeyPoints).toEqual(["Intro", "Details"]);
      expect(result.suggestedDifficulty).toBe("MEDIUM");
      expect(result.confidence).toBe(0.8);
    });

    it("should throw OpenAIError when no content returned", async () => {
      const context: QuestionContext = {
        candidateLevel: "JUNIOR" as any,
        jobRequirements: [],
        previousQuestions: [],
      };

      const mockResponse = {
        choices: [],
      };

      vi.mocked(mockPromptBuilder.buildQuestionGenerationPrompt).mockReturnValue("prompt");
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);

      await expect(adapter.generateQuestion(context)).rejects.toThrow(OpenAIError);
    });

    it("should throw OpenAIError when parsing fails", async () => {
      const context: QuestionContext = {
        candidateLevel: "MID_LEVEL" as any,
        jobRequirements: [],
        previousQuestions: [],
      };

      const mockResponse = {
        choices: [
          {
            message: { content: "invalid json" },
          },
        ],
      };

      vi.mocked(mockPromptBuilder.buildQuestionGenerationPrompt).mockReturnValue("prompt");
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);
      vi.mocked(mockResponseParser.parseQuestionGenerationResponse).mockImplementation(() => {
        throw new Error("Parse error");
      });

      await expect(adapter.generateQuestion(context)).rejects.toThrow(OpenAIError);
    });
  });

  describe("generateEvaluationCriteria", () => {
    it("should generate evaluation criteria successfully", async () => {
      const questionText = "What is your experience with React?";

      const mockPrompt = "Generated criteria prompt";
      const mockResponse = {
        choices: [
          {
            message: { content: '["Accuracy", "Clarity", "Depth"]' },
          },
        ],
      };

      vi.mocked(mockPromptBuilder.buildEvaluationCriteriaPrompt).mockReturnValue(mockPrompt);
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);
      vi.mocked(mockResponseParser.parseEvaluationCriteriaResponse).mockReturnValue([
        "Accuracy",
        "Clarity",
        "Depth",
      ]);

      const result = await adapter.generateEvaluationCriteria(questionText);

      expect(result).toEqual(["Accuracy", "Clarity", "Depth"]);
      expect(mockPromptBuilder.buildEvaluationCriteriaPrompt).toHaveBeenCalledWith(questionText);
    });

    it("should throw OpenAIError when no content returned", async () => {
      const questionText = "Test question";

      const mockResponse = {
        choices: [],
      };

      vi.mocked(mockPromptBuilder.buildEvaluationCriteriaPrompt).mockReturnValue("prompt");
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);

      await expect(adapter.generateEvaluationCriteria(questionText)).rejects.toThrow(OpenAIError);
    });
  });

  describe("generateExpectedAnswer", () => {
    it("should generate expected answer structure successfully", async () => {
      const questionText = "Describe your debugging process";

      const mockPrompt = "Generated answer prompt";
      const mockResponse = {
        choices: [
          {
            message: { content: '["Problem", "Analysis", "Solution", "Verification"]' },
          },
        ],
      };

      vi.mocked(mockPromptBuilder.buildExpectedAnswerPrompt).mockReturnValue(mockPrompt);
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);
      vi.mocked(mockResponseParser.parseExpectedAnswerResponse).mockReturnValue([
        "Problem",
        "Analysis",
        "Solution",
        "Verification",
      ]);

      const result = await adapter.generateExpectedAnswer(questionText);

      expect(result).toEqual(["Problem", "Analysis", "Solution", "Verification"]);
      expect(mockPromptBuilder.buildExpectedAnswerPrompt).toHaveBeenCalledWith(questionText);
    });

    it("should throw OpenAIError when no content returned", async () => {
      const questionText = "Test question";

      const mockResponse = {
        choices: [],
      };

      vi.mocked(mockPromptBuilder.buildExpectedAnswerPrompt).mockReturnValue("prompt");
      vi.mocked(mockOpenAIClient.chatCompletion).mockResolvedValue(mockResponse as any);

      await expect(adapter.generateExpectedAnswer(questionText)).rejects.toThrow(OpenAIError);
    });
  });
});
