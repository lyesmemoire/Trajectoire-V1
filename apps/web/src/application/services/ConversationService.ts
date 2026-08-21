/**
 * ConversationService
 *
 * Application service responsible for the interview conversation lifecycle.
 *
 * Responsibilities:
 * - validate candidate messages
 * - protect session ownership
 * - enforce session state
 * - enforce rate limits and quotas
 * - serialize conversation turns with a distributed lock
 * - persist candidate messages
 * - generate contextual recruiter responses
 * - rollback candidate messages if AI generation fails
 * - persist recruiter responses
 * - audit successful operations
 *
 * Strategic interview decisions are delegated to InterviewService,
 * which can consume UnifiedInterviewContext.
 */

import {
  Message,
} from "@/domain/entities";

import {
  SendMessageSchema,
} from "@/validation";

import {
  SessionRepository,
  MessageRepository,
} from "@/infrastructure/repositories";

import type {
  IRateLimiter,
  IQuotaService,
  IAuditService,
  ILogger,
} from "@/core/interfaces";

import {
  AppError,
  ErrorCode,
  QuotaError,
  AIError,
} from "@/core/errors";

import {
  RateLimitRules,
  EndpointType,
} from "@/domain/valueObjects";

import {
  InterviewService,
} from "@/lib/ai/services/interview.service";

import {
  DistributedLock,
} from "@/lib/concurrency/DistributedLock";

import type {
  UnifiedInterviewContext,
} from "@/application/interview-context/UnifiedInterviewContextService";

export interface SendMessageCommand {
  userId: string;
  sessionId: string;
  content: string;

  /**
   * Optional by design.
   *
   * This preserves backward compatibility with callers that do not
   * yet build the unified interview context.
   *
   * When available, InterviewService will use:
   * - CV
   * - job description
   * - matching result
   * - previous interview history
   * - interview priorities
   */
  unifiedContext?:
    UnifiedInterviewContext | null;
}

export interface SendMessageResult {
  messageId: string;
  aiResponse: string;
  messageCount: number;
}

const MAX_SESSION_MESSAGES = 50;

const AI_RESPONSE_TIMEOUT_MS =
  30_000;

const CONVERSATION_HISTORY_LIMIT =
  20;

export class ConversationService {
  constructor(
    private readonly sessionRepository:
      SessionRepository,

    private readonly messageRepository:
      MessageRepository,

    private readonly rateLimiter:
      IRateLimiter,

    private readonly quotaService:
      IQuotaService,

    private readonly auditService:
      IAuditService,

    private readonly logger:
      ILogger,
  ) {}

  /**
   * Public entry point for a candidate message.
   *
   * A distributed lock prevents two simultaneous answers from
   * producing an inconsistent message order.
   */
  async sendMessage(
    command: SendMessageCommand,
  ): Promise<SendMessageResult> {
    this.logger.setUserContext(
      command.userId,
      command.sessionId,
    );

    return DistributedLock.execute(
      `session:${command.sessionId}`,

      async () =>
        this.sendMessageInternal(
          command,
        ),

      5_000,
    );
  }

  /**
   * Internal message lifecycle.
   *
   * This method always runs inside the session distributed lock.
   */
  private async sendMessageInternal(
    command: SendMessageCommand,
  ): Promise<SendMessageResult> {
    this.logger.setUserContext(
      command.userId,
      command.sessionId,
    );

    // =========================================================
    // 1. INPUT VALIDATION
    // =========================================================

    const validationResult =
      SendMessageSchema.safeParse({
        sessionId:
          command.sessionId,

        content:
          command.content,
      });

    if (
      !validationResult.success
    ) {
      throw new AppError(
        "Invalid input data",
        ErrorCode.INVALID_INPUT,
        400,
      );
    }

    const validatedContent =
      validationResult.data.content;

    // =========================================================
    // 2. SESSION
    // =========================================================

    const sessionData =
      await this.sessionRepository
        .findById(
          command.sessionId,
        );

    if (!sessionData) {
      throw new AppError(
        "Session not found",
        ErrorCode.NOT_FOUND,
        404,
      );
    }

    if (
      sessionData.user_id !==
      command.userId
    ) {
      throw new AppError(
        "Access denied",
        ErrorCode.FORBIDDEN,
        403,
      );
    }

    if (
      sessionData.status !==
      "in_progress"
    ) {
      throw new AppError(
        "Session is not active",
        ErrorCode.CONFLICT,
        409,
      );
    }

    // =========================================================
    // 3. RATE LIMIT
    // =========================================================

    const rateLimitRule =
      RateLimitRules.getRule(
        "simulation_message" as
          EndpointType,
      );

    const rateLimitResult =
      await this.rateLimiter
        .checkRateLimit(
          command.userId,
          rateLimitRule
            .requestsPerMinute,
          60 * 1000,
        );

    if (
      !rateLimitResult.allowed
    ) {
      await this.auditService.log({
        userId:
          command.userId,

        action:
          "rate_limit_exceeded",

        resourceType:
          "quota",

        metadata: {
          route:
            "simulation/message",
        },
      });

      throw new AppError(
        "Rate limit exceeded",
        ErrorCode
          .RATE_LIMIT_EXCEEDED,
        429,
      );
    }

    // =========================================================
    // 4. QUOTA
    // =========================================================

    const quotaResult =
      await this.quotaService
        .checkQuota(
          command.userId,
          "messages",
        );

    if (!quotaResult.allowed) {
      await this.auditService.log({
        userId:
          command.userId,

        action:
          "quota_exceeded",

        resourceType:
          "quota",

        metadata: {
          quotaType:
            "messages",
        },
      });

      throw new QuotaError(
        "Quota exceeded",
        {
          resourceType:
            "messages",

          currentUsage:
            quotaResult.limit -
            quotaResult.remaining,

          limit:
            quotaResult.limit,

          period:
            quotaResult.period,
        },
      );
    }

    // =========================================================
    // 5. SESSION MESSAGE LIMIT
    // =========================================================

    const messageCount =
      await this.messageRepository
        .count({
          session_id:
            command.sessionId,
        });

    if (
      messageCount >=
      MAX_SESSION_MESSAGES
    ) {
      throw new AppError(
        "Maximum message count reached",
        ErrorCode.QUOTA_EXCEEDED,
        429,
      );
    }

    // =========================================================
    // 6. PERSIST CANDIDATE MESSAGE
    // =========================================================

    const userMessage =
      new Message({
        sessionId:
          command.sessionId,

        role:
          "user",

        content:
          validatedContent,
      });

    const persistedUserMessage =
      await this.messageRepository
        .create(
          userMessage
            .toPersistence() as any,
        );

    // =========================================================
    // 7. CONVERSATION MEMORY
    // =========================================================

    const persistedMessages =
      await this.messageRepository
        .getBySessionId(
          command.sessionId,
        );

    /*
     * Keep bounded short-term memory.
     *
     * InterviewService performs an additional final prompt-bound
     * trimming. Keeping 20 here gives enough conversation context
     * to the application layer without allowing an unbounded session
     * to grow the AI request forever.
     */
    const conversationHistory =
      persistedMessages
        .map((message) => ({
          role:
            message.role,

          content:
            message.content,
        }))
        .filter(
          (
            message,
          ): message is {
            role:
              | "assistant"
              | "user";

            content:
              string;
          } =>
            (
              message.role ===
                "assistant" ||
              message.role ===
                "user"
            ) &&
            typeof message.content ===
              "string" &&
            message.content
              .trim()
              .length > 0,
        )
        .slice(
          -CONVERSATION_HISTORY_LIMIT,
        );

    // =========================================================
    // 8. GENERATE STRATEGIC AI RESPONSE
    // =========================================================

    let aiResponse: string;

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),

        AI_RESPONSE_TIMEOUT_MS,
      );

    try {
      aiResponse =
        await InterviewService
          .generateNextResponse({
            context: {
              jobTitle:
                sessionData.job_title,

              level:
                sessionData.level,

              interviewType:
                sessionData.interview_type,

              sessionId:
                command.sessionId,

              userId:
                command.userId,

              signal:
                controller.signal,

              /*
               * This is the actual bridge between the application
               * conversation and the unified Trajectoire brain.
               */
              unifiedContext:
                command
                  .unifiedContext ??
                null,
            },

            /*
             * Candidate answer is explicitly supplied to the strategy
             * engine so it can decide whether to:
             * - clarify
             * - ask for an example
             * - ask for metrics
             * - deepen a competency
             * - challenge
             * - change topic
             */
            userResponse:
              validatedContent,

            lastMessages:
              conversationHistory,
          });

      if (
        !aiResponse ||
        aiResponse
          .trim()
          .length === 0
      ) {
        throw new Error(
          "AI returned an empty interview response",
        );
      }

      aiResponse =
        aiResponse.trim();
    } catch (error) {
      this.logger.error(
        "AI generation failed, rolling back user message",
        {
          error,

          sessionId:
            command.sessionId,

          hasUnifiedContext:
            Boolean(
              command
                .unifiedContext,
            ),
        },
      );

      /*
       * Atomic conversation behaviour:
       *
       * if the recruiter response cannot be produced, the candidate
       * message is removed so that replaying the request does not leave
       * the session in a half-completed conversational turn.
       */
      await this.messageRepository
        .delete(
          persistedUserMessage.id,
        );

      if (
        error instanceof Error &&
        error.name ===
          "AbortError"
      ) {
        throw new AIError(
          "AI response timeout - request took too long",
          ErrorCode.AI_ERROR,
          504,
        );
      }

      /*
       * Preserve a meaningful AI-domain error while avoiding leaking
       * provider internals to callers.
       */
      throw new AIError(
        "Failed to generate AI response",
        ErrorCode.AI_ERROR,
        500,
      );
    } finally {
      /*
       * Prevent orphaned timeout timers on every success/failure path.
       */
      clearTimeout(
        timeout,
      );
    }

    // =========================================================
    // 9. PERSIST RECRUITER RESPONSE
    // =========================================================

    const aiMessage =
      new Message({
        sessionId:
          command.sessionId,

        role:
          "assistant",

        content:
          aiResponse,
      });

    await this.messageRepository
      .create(
        aiMessage
          .toPersistence() as any,
      );

    // =========================================================
    // 10. COMMIT QUOTA
    // =========================================================

    /*
     * Quota is incremented only after a complete successful turn:
     *
     * candidate message persisted
     * + AI response generated
     * + recruiter message persisted
     */
    await this.quotaService
      .incrementQuota(
        command.userId,
        "messages",
      );

    // =========================================================
    // 11. AUDIT
    // =========================================================

    await this.auditService.log({
      userId:
        command.userId,

      action:
        "message_send",

      resourceType:
        "message",

      resourceId:
        persistedUserMessage.id,

      metadata: {
        sessionId:
          command.sessionId,

        contextualInterview:
          Boolean(
            command
              .unifiedContext,
          ),

        matchingAvailable:
          command
            .unifiedContext
            ?.matching.score !==
            null &&
          command
            .unifiedContext
            ?.matching.score !==
            undefined,

        cvAvailable:
          Boolean(
            command
              .unifiedContext
              ?.candidate.cvText,
          ),
      },
    });

    this.logger.info(
      "Message sent successfully",
      {
        sessionId:
          command.sessionId,

        messageId:
          persistedUserMessage.id,

        contextualInterview:
          Boolean(
            command
              .unifiedContext,
          ),
      },
    );

    // =========================================================
    // 12. RESULT
    // =========================================================

    return {
      messageId:
        persistedUserMessage.id,

      aiResponse,

      messageCount:
        messageCount + 2,
    };
  }

  /**
   * Return all persisted messages for a session after ownership check.
   */
  async getMessages(
    sessionId: string,
    userId: string,
  ): Promise<Message[]> {
    const sessionData =
      await this.sessionRepository
        .findById(
          sessionId,
        );

    if (!sessionData) {
      throw new AppError(
        "Session not found",
        ErrorCode.NOT_FOUND,
        404,
      );
    }

    if (
      sessionData.user_id !==
      userId
    ) {
      throw new AppError(
        "Access denied",
        ErrorCode.FORBIDDEN,
        403,
      );
    }

    const messages =
      await this.messageRepository
        .getBySessionId(
          sessionId,
        );

    return messages.map(
      (message) =>
        Message.fromPersistence(
          message,
        ),
    );
  }
}