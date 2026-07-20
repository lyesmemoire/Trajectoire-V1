/**
 * SimulationService
 * Application service for interview session management
 * Handles business logic for session creation and lifecycle
 */

import { Session, SessionProps } from "@/domain/entities";
import { CreateSessionSchema } from "@/validation";
import { SessionRepository } from "@/infrastructure/repositories";
import { IRateLimiter, IQuotaService, IAuditService, ILogger } from "@/core/interfaces";
import { AppError, ErrorCode, QuotaError } from "@/core/errors";
import { RateLimitRules, EndpointType } from "@/domain/valueObjects";
import { SupabaseTransactionManager } from "@/infrastructure/transactions/SupabaseTransactionManager";

export interface CreateSimulationCommand {
  userId: string;
  jobTitle: string;
  level: string;
  interviewType: "RH" | "Technique" | "Manager";
  duration: number;
}

export interface CreateSimulationResult {
  sessionId: string;
  jobTitle: string;
  level: string;
  interviewType: string;
  durationSeconds: number;
}

export class SimulationService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly rateLimiter: IRateLimiter,
    private readonly quotaService: IQuotaService,
    private readonly auditService: IAuditService,
    private readonly logger: ILogger,
    private readonly transactionManager: SupabaseTransactionManager
  ) {}

  /**
   * Create a new simulation session
   */
  async createSimulation(command: CreateSimulationCommand): Promise<CreateSimulationResult> {
    this.logger.setUserContext(command.userId);

    // Validate input
    const validationResult = CreateSessionSchema.safeParse({
      jobTitle: command.jobTitle,
      level: command.level,
      interviewType: command.interviewType,
      duration: command.duration,
    });

    if (!validationResult.success) {
      throw new AppError("Invalid input data", ErrorCode.INVALID_INPUT, 400);
    }

    // Check rate limit
    const rateLimitResult = await this.rateLimiter.checkRateLimit(
      command.userId,
      RateLimitRules.getRule("simulation_create" as EndpointType).requestsPerMinute,
      60 * 1000
    );

    if (!rateLimitResult.allowed) {
      await this.auditService.log({
        userId: command.userId,
        action: "rate_limit_exceeded",
        resourceType: "quota",
        metadata: { route: "simulation/create" },
      });
      throw new AppError("Rate limit exceeded", ErrorCode.RATE_LIMIT_EXCEEDED, 429);
    }

    // Check quota
    const quotaResult = await this.quotaService.checkQuota(command.userId, "simulations");
    if (!quotaResult.allowed) {
      await this.auditService.log({
        userId: command.userId,
        action: "quota_exceeded",
        resourceType: "quota",
        metadata: { quotaType: "simulations" },
      });
      throw new QuotaError("Quota exceeded", {
        resourceType: "simulations",
        currentUsage: quotaResult.limit - quotaResult.remaining,
        limit: quotaResult.limit,
        period: quotaResult.period,
      });
    }

    // Create session entity
    const session = new Session({
      userId: command.userId,
      jobTitle: command.jobTitle,
      level: command.level,
      interviewType: command.interviewType,
      durationSeconds: command.duration * 60,
    });

    // Persist session
    const persistedSession = await this.sessionRepository.create(session.toPersistence());

    // Increment quota
    await this.quotaService.incrementQuota(command.userId, "simulations");

    // Audit log
    await this.auditService.log({
      userId: command.userId,
      action: "simulation_create",
      resourceType: "session",
      resourceId: persistedSession.id,
      metadata: {
        job_title: session.jobTitle,
        level: session.level,
        interview_type: session.interviewType,
      },
    });

    this.logger.info("Session created successfully", { sessionId: session.id });

    return {
      sessionId: persistedSession.id,
      jobTitle: session.jobTitle,
      level: session.level,
      interviewType: session.interviewType,
      durationSeconds: session.durationSeconds,
    };
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string, userId: string): Promise<Session> {
    const sessionData = await this.sessionRepository.findById(sessionId);
    
    if (!sessionData) {
      throw new AppError("Session not found", ErrorCode.NOT_FOUND, 404);
    }

    if (sessionData.user_id !== userId) {
      throw new AppError("Access denied", ErrorCode.FORBIDDEN, 403);
    }

    return Session.fromPersistence(sessionData);
  }

  /**
   * End a session
   */
  async endSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.getSession(sessionId, userId);

    session.complete();

    await this.sessionRepository.update(sessionId, session.toPersistence());

    await this.auditService.log({
      userId,
      action: "session_end",
      resourceType: "session",
      resourceId: sessionId,
    });

    this.logger.info("Session ended successfully", { sessionId });
  }

  /**
   * Cancel a session
   */
  async cancelSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.getSession(sessionId, userId);

    session.cancel();

    await this.sessionRepository.update(sessionId, session.toPersistence());

    await this.auditService.log({
      userId,
      action: "session_cancel",
      resourceType: "session",
      resourceId: sessionId,
    });

    this.logger.info("Session cancelled successfully", { sessionId });
  }
}
