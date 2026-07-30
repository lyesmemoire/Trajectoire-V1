/**
 * ConversationService
 * Application service for managing interview conversations
 * Handles message sending and AI responses
 */

import { Message } from "@/domain/entities";
import { SendMessageSchema } from "@/validation";
import { SessionRepository, MessageRepository } from "@/infrastructure/repositories";
import { IRateLimiter, IQuotaService, IAuditService, ILogger, IAIProvider } from "@/core/interfaces";
import { AppError, ErrorCode, QuotaError, AIError } from "@/core/errors";
import { RateLimitRules, EndpointType } from "@/domain/valueObjects";
import { InterviewService } from "@/lib/ai/services/interview.service";
import { DistributedLock } from "@/lib/concurrency/DistributedLock";

export interface SendMessageCommand {
  userId: string;
  sessionId: string;
  content: string;
}

export interface SendMessageResult {
  messageId: string;
  aiResponse: string;
  messageCount: number;
}

export class ConversationService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly messageRepository: MessageRepository,
    private readonly rateLimiter: IRateLimiter,
    private readonly quotaService: IQuotaService,
    private readonly auditService: IAuditService,
    private readonly logger: ILogger,
    private readonly aiProvider: IAIProvider
  ) {}

  /**
   * Send a message in a conversation
   * Uses distributed lock to prevent race conditions on message order
   */
  async sendMessage(command: SendMessageCommand): Promise<SendMessageResult> {
    this.logger.setUserContext(command.userId, command.sessionId);

    // Use distributed lock to prevent race conditions on message order
    return DistributedLock.execute(
      `session:${command.sessionId}`,
      async () => {
        return this.sendMessageInternal(command);
      },
      5000 // 5 second timeout
    );
  }

  /**
   * Internal implementation of message sending
   * Called within distributed lock
   */
  private async sendMessageInternal(command: SendMessageCommand): Promise<SendMessageResult> {
    this.logger.setUserContext(command.userId, command.sessionId);

    // Validate input
    const validationResult = SendMessageSchema.safeParse({
      sessionId: command.sessionId,
      content: command.content,
    });

    if (!validationResult.success) {
      throw new AppError("Invalid input data", ErrorCode.INVALID_INPUT, 400);
    }

    // Get session
    const sessionData = await this.sessionRepository.findById(command.sessionId);
    if (!sessionData) {
      throw new AppError("Session not found", ErrorCode.NOT_FOUND, 404);
    }

    if (sessionData.user_id !== command.userId) {
      throw new AppError("Access denied", ErrorCode.FORBIDDEN, 403);
    }

    if (sessionData.status !== "in_progress") {
      throw new AppError("Session is not active", ErrorCode.CONFLICT, 409);
    }

    // Check rate limit
    const rateLimitResult = await this.rateLimiter.checkRateLimit(
      command.userId,
      RateLimitRules.getRule("simulation_message" as EndpointType).requestsPerMinute,
      60 * 1000
    );

    if (!rateLimitResult.allowed) {
      await this.auditService.log({
        userId: command.userId,
        action: "rate_limit_exceeded",
        resourceType: "quota",
        metadata: { route: "simulation/message" },
      });
      throw new AppError("Rate limit exceeded", ErrorCode.RATE_LIMIT_EXCEEDED, 429);
    }

    // Check quota
    const quotaResult = await this.quotaService.checkQuota(command.userId, "messages");
    if (!quotaResult.allowed) {
      await this.auditService.log({
        userId: command.userId,
        action: "quota_exceeded",
        resourceType: "quota",
        metadata: { quotaType: "messages" },
      });
      throw new QuotaError("Quota exceeded", {
        resourceType: "messages",
        currentUsage: quotaResult.limit - quotaResult.remaining,
        limit: quotaResult.limit,
        period: quotaResult.period,
      });
    }

    // Check message count limit
    const messageCount = await this.messageRepository.count({ session_id: command.sessionId });
    if (messageCount >= 50) {
      throw new AppError("Maximum message count reached", ErrorCode.QUOTA_EXCEEDED, 429);
    }

    // Create user message
    const userMessage = new Message({
      sessionId: command.sessionId,
      role: "user",
      content: command.content,
    });

    const persistedUserMessage = await this.messageRepository.create(userMessage.toPersistence() as any);

    // Get conversation history
    const messages = await this.messageRepository.getBySessionId(command.sessionId);
    const conversationHistory = messages
      .map((m) => ({
        role: m.role,
        content: m.content,
      }))
      .slice(-20); // Last 20 messages

    // Generate AI response
    let aiResponse: string;
    try {
      // Timeout de 30 secondes pour l'appel IA
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      aiResponse = await InterviewService.generateNextResponse({
        context: {
          jobTitle: sessionData.job_title,
          level: sessionData.level,
          interviewType: sessionData.interview_type,
          sessionId: command.sessionId,
          userId: command.userId,
          signal: controller.signal,
        },
        lastMessages: conversationHistory,
      });

      clearTimeout(timeout);
    } catch (error) {
      this.logger.error("AI generation failed, rolling back user message", { error });
      
      // Rollback: delete the user message since AI generation failed
      await this.messageRepository.delete(persistedUserMessage.id);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AIError("AI response timeout - request took too long", ErrorCode.AI_ERROR, 504);
      }
      
      throw new AIError("Failed to generate AI response", ErrorCode.AI_ERROR, 500);
    }

    // Create AI message
    const aiMessage = new Message({
      sessionId: command.sessionId,
      role: "assistant",
      content: aiResponse,
    });

    await this.messageRepository.create(aiMessage.toPersistence() as any);

    // Increment quota (only after successful AI generation)
    await this.quotaService.incrementQuota(command.userId, "messages");

    // Audit log
    await this.auditService.log({
      userId: command.userId,
      action: "message_send",
      resourceType: "message",
      resourceId: userMessage.id,
      metadata: { sessionId: command.sessionId },
    });

    this.logger.info("Message sent successfully", { 
      sessionId: command.sessionId,
      messageId: userMessage.id,
    });

    return {
      messageId: userMessage.id,
      aiResponse,
      messageCount: messageCount + 2, // user + AI
    };
  }

  /**
   * Get messages for a session
   */
  async getMessages(sessionId: string, userId: string): Promise<Message[]> {
    const sessionData = await this.sessionRepository.findById(sessionId);
    
    if (!sessionData) {
      throw new AppError("Session not found", ErrorCode.NOT_FOUND, 404);
    }

    if (sessionData.user_id !== userId) {
      throw new AppError("Access denied", ErrorCode.FORBIDDEN, 403);
    }

    const messages = await this.messageRepository.getBySessionId(sessionId);
    return messages.map((m) => Message.fromPersistence(m));
  }
}
