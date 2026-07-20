import AIClient from "../client";
import { AI_MODELS } from "../models";
import { REPORT_SYSTEM_PROMPT, REPORT_GENERATION_PROMPT } from "../prompts/report";
import { RetryManager } from "../retry/RetryManager";
import { ReportSchema } from "../schemas/report.schema";
import { ValidationError, ExternalServiceError } from "@/core/errors";

/**
 * Report Service
 * Handles report generation using AI
 * Returns JSON without writing to database
 */

export interface ReportInput {
  jobTitle: string;
  level: string;
  interviewType: string;
  durationMinutes: number;
  conversationHistory: string;
  cv?: string;
  userContext?: string;
  sessionId?: string;
  userId?: string;
}

export interface ReportAnalysis {
  overallScore: number;
  communication: number;
  technical: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: string;
}

export class ReportService {
  /**
   * Generate a complete interview report
   * @param input - Report generation input data
   * @returns Report analysis
   */
  public static async generateReport(input: ReportInput): Promise<ReportAnalysis> {
    const client = AIClient.getInstance();
    const sessionId = input.sessionId || "default";
    const userId = input.userId;

    const systemPrompt = REPORT_SYSTEM_PROMPT;
    const generationPrompt = REPORT_GENERATION_PROMPT(
      input.jobTitle,
      input.level,
      input.interviewType,
      input.durationMinutes
    );

    const fullPrompt = `${systemPrompt}

Conversation History:
${input.conversationHistory}

${input.userContext ? `User Context: ${input.userContext}` : ''}

${input.cv ? `CV: ${input.cv}` : ''}`;

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.REPORT,
          messages: [
            { role: "system", content: fullPrompt },
            { role: "user", content: generationPrompt },
          ],
          temperature: 0.3,
          responseFormat: { type: "json_object" },
        });

        // Validate with Zod
        const parsed = JSON.parse(response.content);
        const validated = ReportSchema.safeParse(parsed);
        if (!validated.success) {
          throw new ValidationError(`Validation failed: ${validated.error.message}`);
        }

        return validated.data;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Report generation failed", "ReportService");
    }

    return result.data;
  }

  /**
   * Generate recommendations based on report
   * @param reportAnalysis - Existing report analysis
   * @param sessionId - Optional session ID for tracking
   * @param userId - Optional user ID for tracking
   * @returns Enhanced recommendations
   */
  public static async generateRecommendations(
    reportAnalysis: ReportAnalysis,
    sessionId?: string,
    userId?: string
  ): Promise<string> {
    const client = AIClient.getInstance();
    const actualSessionId = sessionId || "default";

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.REPORT,
          messages: [
            {
              role: "system",
              content: "Based on the interview performance, provide specific recommendations for improvement. Focus on areas that need immediate attention, skills to develop, and preparation strategies.",
            },
            {
              role: "user",
              content: JSON.stringify(reportAnalysis),
            },
          ],
          temperature: 0.4,
        });

        return response.content;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Recommendation generation failed", "ReportService");
    }

    return result.data;
  }
}
