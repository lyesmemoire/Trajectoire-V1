import AIClient from "../client";
import { AI_MODELS } from "../models";
import { INTERVIEW_SYSTEM_PROMPT, INTERVIEW_STARTER_PROMPT } from "../prompts/interview";
import { RetryManager } from "../retry/RetryManager";
import { InterviewSummarySchema } from "../schemas/interview.schema";
import { ValidationError, ExternalServiceError } from "@/core/errors";

/**
 * Interview Service
 * Handles interview conversation generation
 * Does not save to database - saving is handled by API routes
 */

export interface InterviewContext {
  jobTitle: string;
  level: string;
  interviewType: "RH" | "Technique" | "Manager";
  candidateName?: string;
  sessionId?: string;
  userId?: string;
}

export interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export interface InterviewInput {
  context: InterviewContext;
  conversationSummary?: string;
  lastMessages?: ConversationMessage[];
  userResponse?: string;
}

export class InterviewService {
  /**
   * Generate the first interview question
   * @param context - Interview context
   * @returns First interview question
   */
  public static async generateFirstQuestion(context: InterviewContext): Promise<string> {
    const client = AIClient.getInstance();
    const sessionId = context.sessionId || "default";
    const userId = context.userId;

    const systemPrompt = INTERVIEW_SYSTEM_PROMPT(context.interviewType);
    const userPrompt = INTERVIEW_STARTER_PROMPT(
      context.candidateName || "Candidate",
      context.jobTitle,
      context.level
    );

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.INTERVIEW,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        });

        return response.content;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "First question generation failed", "InterviewService");
    }

    return result.data;
  }

  /**
   * Generate the next interview response based on conversation
   * @param input - Interview input with context and conversation
   * @returns Next interview response
   */
  public static async generateNextResponse(input: InterviewInput): Promise<string> {
    const client = AIClient.getInstance();
    const sessionId = input.context.sessionId || "default";
    const userId = input.context.userId;

    const systemPrompt = INTERVIEW_SYSTEM_PROMPT(input.context.interviewType);

    // Build last messages string (last 10 messages)
    const lastMessages = input.lastMessages
      ?.slice(-10)
      .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      .join("\n");

    const userContext = `Position: ${input.context.jobTitle}
Level: ${input.context.level}
Type: ${input.context.interviewType}`;

    const fullPrompt = `${systemPrompt}

${userContext}

${lastMessages}`;

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: fullPrompt },
        ];

        // Add conversation history
        if (input.lastMessages) {
          input.lastMessages.forEach((msg) => {
            messages.push({
              role: msg.role,
              content: msg.content,
            });
          });
        }

        const response = await client.chatCompletion({
          model: AI_MODELS.INTERVIEW,
          messages,
          temperature: 0.7,
        });

        return response.content;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Response generation failed", "InterviewService");
    }

    return result.data;
  }

  /**
   * Generate a conversation summary
   * @param messages - Full conversation messages
   * @param sessionId - Optional session ID for tracking
   * @param userId - Optional user ID for tracking
   * @returns Conversation summary
   */
  public static async generateSummary(
    messages: ConversationMessage[],
    sessionId?: string,
    userId?: string
  ): Promise<string> {
    const client = AIClient.getInstance();
    const actualSessionId = sessionId || "default";

    const conversation = messages
      .map((msg) => `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${msg.content}`)
      .join("\n");

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.SUMMARY,
          messages: [
            {
              role: "system",
              content: "Summarize this interview conversation in 2-3 sentences, focusing on key topics discussed and the candidate's main responses.",
            },
            { role: "user", content: conversation },
          ],
          temperature: 0.3,
        });

        // Validate with Zod
        const parsed = { summary: response.content };
        const validated = InterviewSummarySchema.safeParse(parsed);
        if (!validated.success) {
          throw new ValidationError(`Validation failed: ${validated.error.message}`);
        }

        return validated.data.summary;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Summary generation failed", "InterviewService");
    }

    return result.data;
  }
}
