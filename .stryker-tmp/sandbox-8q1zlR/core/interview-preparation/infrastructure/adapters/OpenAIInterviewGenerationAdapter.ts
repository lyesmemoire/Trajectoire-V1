/**
 * OpenAIInterviewGenerationAdapter
 *
 * Infrastructure adapter for AI-based interview question generation using OpenAI.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY AI generation implementation.
 */
// @ts-nocheck


import { AIGenerationPort } from "../../application/ports/AIGenerationPort";
import { QuestionContext, AIQuestionResponse } from "../../domain/types";
import { OpenAIClient, ChatMessage } from "../clients/OpenAIClient";
import { PromptBuilder, PromptContext } from "../ai/PromptBuilder";
import { ResponseParser } from "../ai/ResponseParser";
import { OpenAIError, ParsingError } from "../errors/InfrastructureErrors";

export class OpenAIInterviewGenerationAdapter implements AIGenerationPort {
  constructor(
    private readonly openAIClient: OpenAIClient,
    private readonly promptBuilder: PromptBuilder,
    private readonly responseParser: ResponseParser
  ) {}

  async generateQuestion(context: QuestionContext): Promise<AIQuestionResponse> {
    try {
      const promptContext: PromptContext = {
        candidateProfile: JSON.stringify({ candidateLevel: context.candidateLevel }),
        jobOfferProfile: JSON.stringify({ jobRequirements: context.jobRequirements }),
        matchingProfile: JSON.stringify({ previousQuestions: context.previousQuestions }),
        objective: "Generate a relevant interview question",
        constraints: JSON.stringify(context),
        customRequirements: context.jobRequirements.map((r) => r.competencyId),
      };

      const prompt = this.promptBuilder.buildQuestionGenerationPrompt(promptContext);

      const messages: ChatMessage[] = [
        { role: "system", content: prompt },
        { role: "user", content: "Generate interview questions based on the provided context." },
      ];

      const response = await this.openAIClient.chatCompletion({
        messages,
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 2000,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new OpenAIError("No content returned from OpenAI");
      }

      const parsed = this.responseParser.parseQuestionGenerationResponse(content);

      const question = parsed.questions[0];

      return {
        questionText: question.text,
        suggestedEvaluationCriteria: question.evaluationCriteria,
        suggestedKeyPoints: question.expectedAnswerStructure,
        suggestedDifficulty: question.difficulty as any,
        confidence: 0.8,
      };
    } catch (error) {
      if (error instanceof OpenAIError || error instanceof ParsingError) {
        throw error;
      }
      throw new OpenAIError(`Failed to generate question: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async generateEvaluationCriteria(questionText: string): Promise<string[]> {
    try {
      const prompt = this.promptBuilder.buildEvaluationCriteriaPrompt(questionText);

      const messages: ChatMessage[] = [
        { role: "system", content: prompt },
        { role: "user", content: "Generate evaluation criteria." },
      ];

      const response = await this.openAIClient.chatCompletion({
        messages,
        model: "gpt-4",
        temperature: 0.5,
        maxTokens: 500,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new OpenAIError("No content returned from OpenAI");
      }

      return this.responseParser.parseEvaluationCriteriaResponse(content);
    } catch (error) {
      if (error instanceof OpenAIError || error instanceof ParsingError) {
        throw error;
      }
      throw new OpenAIError(`Failed to generate evaluation criteria: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async generateExpectedAnswer(questionText: string): Promise<string[]> {
    try {
      const prompt = this.promptBuilder.buildExpectedAnswerPrompt(questionText);

      const messages: ChatMessage[] = [
        { role: "system", content: prompt },
        { role: "user", content: "Generate expected answer structure." },
      ];

      const response = await this.openAIClient.chatCompletion({
        messages,
        model: "gpt-4",
        temperature: 0.5,
        maxTokens: 500,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new OpenAIError("No content returned from OpenAI");
      }

      return this.responseParser.parseExpectedAnswerResponse(content);
    } catch (error) {
      if (error instanceof OpenAIError || error instanceof ParsingError) {
        throw error;
      }
      throw new OpenAIError(`Failed to generate expected answer: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
