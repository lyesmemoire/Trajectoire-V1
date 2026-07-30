/**
 * ReportService
 * Application service for report generation
 * Handles business logic for creating interview reports
 */

import { Report } from "@/domain/entities";
import { SessionRepository, ReportRepository, MessageRepository } from "@/infrastructure/repositories";
import { IRateLimiter, IQuotaService, IAuditService, ILogger } from "@/core/interfaces";
import { AppError, ErrorCode, QuotaError } from "@/core/errors";
import { RateLimitRules, EndpointType } from "@/domain/valueObjects";
import { ReportService as AIReportService } from "@/lib/ai/services/report.service";

export interface GenerateReportCommand {
  userId: string;
  sessionId: string;
}

export interface GenerateReportResult {
  reportId: string;
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
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly reportRepository: ReportRepository,
    private readonly messageRepository: MessageRepository,
    private readonly rateLimiter: IRateLimiter,
    private readonly quotaService: IQuotaService,
    private readonly auditService: IAuditService,
    private readonly logger: ILogger
  ) {}

  /**
   * Generate a report for a completed session
   */
  async generateReport(command: GenerateReportCommand): Promise<GenerateReportResult> {
    this.logger.setUserContext(command.userId, command.sessionId);

    // Get session
    const sessionData = await this.sessionRepository.findById(command.sessionId);
    if (!sessionData) {
      throw new AppError("Session not found", ErrorCode.NOT_FOUND, 404);
    }

    if (sessionData.user_id !== command.userId) {
      throw new AppError("Access denied", ErrorCode.FORBIDDEN, 403);
    }

    if (sessionData.status !== "completed") {
      throw new AppError("Session must be completed to generate report", ErrorCode.CONFLICT, 409);
    }

    // Check if report already exists
    const existingReport = await this.reportRepository.getBySessionId(command.sessionId);
    if (existingReport) {
      return {
        reportId: existingReport.id,
        overallScore: existingReport.overall_score,
        communication: existingReport.communication,
        technical: existingReport.technical,
        confidence: existingReport.confidence,
        strengths: existingReport.strengths,
        improvements: existingReport.improvements,
        summary: existingReport.summary,
        recommendation: existingReport.recommendation,
      };
    }

    // Check rate limit
    const rateLimitResult = await this.rateLimiter.checkRateLimit(
      command.userId,
      RateLimitRules.getRule("report_generate" as EndpointType).requestsPerMinute,
      60 * 1000
    );

    if (!rateLimitResult.allowed) {
      await this.auditService.log({
        userId: command.userId,
        action: "rate_limit_exceeded",
        resourceType: "quota",
        metadata: { route: "report/generate" },
      });
      throw new AppError("Rate limit exceeded", ErrorCode.RATE_LIMIT_EXCEEDED, 429);
    }

    // Check quota
    const quotaResult = await this.quotaService.checkQuota(command.userId, "reports");
    if (!quotaResult.allowed) {
      await this.auditService.log({
        userId: command.userId,
        action: "quota_exceeded",
        resourceType: "quota",
        metadata: { quotaType: "reports" },
      });
      throw new QuotaError("Quota exceeded", {
        resourceType: "reports",
        currentUsage: quotaResult.limit - quotaResult.remaining,
        limit: quotaResult.limit,
        period: quotaResult.period,
      });
    }

    // Get conversation history
    const messages = await this.messageRepository.getBySessionId(command.sessionId);
    const conversationHistory = messages
      .map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`)
      .join("\n\n");

    // Generate AI report
    let analysis;
    try {
      analysis = await AIReportService.generateReport({
        jobTitle: sessionData.job_title,
        level: sessionData.level,
        interviewType: sessionData.interview_type,
        durationMinutes: Math.floor(sessionData.duration_seconds / 60),
        conversationHistory,
        sessionId: command.sessionId,
        userId: command.userId,
      });
    } catch (error) {
      this.logger.error("AI report generation failed", { error });
      // Return minimal report if AI fails
      analysis = {
        overallScore: 0,
        communication: 0,
        technical: 0,
        confidence: 0,
        strengths: [],
        improvements: [],
        summary: "Analyse indisponible. Veuillez réessayer plus tard.",
        recommendation: "Réessayez de générer le rapport ultérieurement.",
      };
    }

    // Create report entity
    const report = new Report({
      sessionId: command.sessionId,
      overallScore: analysis.overallScore,
      communication: analysis.communication,
      technical: analysis.technical,
      confidence: analysis.confidence,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      summary: analysis.summary,
      recommendation: analysis.recommendation,
    });

    // Persist report
    const persistedReport = await this.reportRepository.create(report.toPersistence() as any);

    // Increment quota
    await this.quotaService.incrementQuota(command.userId, "reports");

    // Audit log
    await this.auditService.log({
      userId: command.userId,
      action: "report_generate",
      resourceType: "report",
      resourceId: persistedReport.id,
      metadata: { overall_score: analysis.overallScore },
    });

    this.logger.info("Report generated successfully", { 
      sessionId: command.sessionId,
      reportId: persistedReport.id,
    });

    return {
      reportId: persistedReport.id,
      overallScore: analysis.overallScore,
      communication: analysis.communication,
      technical: analysis.technical,
      confidence: analysis.confidence,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      summary: analysis.summary,
      recommendation: analysis.recommendation,
    };
  }

  /**
   * Get report by ID
   */
  async getReport(reportId: string, userId: string): Promise<Report> {
    const reportData = await this.reportRepository.findById(reportId);
    
    if (!reportData) {
      throw new AppError("Report not found", ErrorCode.NOT_FOUND, 404);
    }

    // Verify user owns the report by checking session ownership
    const sessionData = await this.sessionRepository.findById(reportData.session_id);
    if (!sessionData || sessionData.user_id !== userId) {
      throw new AppError("Access denied", ErrorCode.FORBIDDEN, 403);
    }

    return Report.fromPersistence(reportData);
  }
}
