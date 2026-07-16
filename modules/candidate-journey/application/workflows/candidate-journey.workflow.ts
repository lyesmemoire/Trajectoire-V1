import { Result, ok, fail } from "../../../../lib/core/result";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { UploadCvUseCase, UploadCvInput } from "../../../../lib/cv/application/use-cases/upload/upload-cv.use-case";
import { UpdateCareerProfileUseCase, UpdateCareerProfileInput } from "../../../../lib/career/application/use-cases/update-career-profile/update-career-profile.use-case";
import { CareerUpdateDTO } from "../../../../lib/career/application/dto/career-update.dto";
import { UploadJobOfferUseCase, UploadJobOfferInput } from "../../../../lib/jobs/application/use-cases/upload/upload-job-offer.use-case";
import { AtsAnalysisGateway } from "../../../../lib/cv/ports/gateways/ats-analysis.gateway";
import { RewriteCvUseCase, RewriteCvInput } from "../../../../lib/cv/application/use-cases/rewrite/rewrite-cv.use-case";
import { StartInterviewUseCase, StartInterviewCommand } from "../../../../lib/interview/application/use-cases/start-interview/start-interview.use-case";
import { JourneyData } from "../../domain/entities/journey.entity";
import { MetricsAdapter, IntelligenceMetadata } from "../../../../lib/intelligence-runtime/application/MetricsAdapter";
import { AtsRepositoryPort } from "../../../../lib/cv/ports/ats-repository.port";
import { ProfileExtractionRepositoryPort } from "../../../../lib/cv/ports/profile-extraction-repository.port";
import { OptimizedCvRepositoryPort } from "../../../../lib/cv/ports/optimized-cv-repository.port";
import { InterviewReportRepositoryPort } from "../../../../lib/interview/ports/interview-report-repository.port";
import { RequestContext } from "../../../../lib/core/runtime/context/RequestContext";
import { VoiceInterviewOrchestrator, VoiceInterviewConfig } from "../../../../lib/interview/application/orchestrators/voice-interview-orchestrator";
import { InterviewConversationUseCase } from "../../../../lib/interview/application/use-cases/interview-conversation.use-case";
import { CareerCopilotOrchestrator, CareerCopilotInput, CareerCopilotOutput } from "../../../../lib/career/application/orchestrators/career-copilot-orchestrator";
import { CareerTimeline } from "../../../../lib/career/domain/entities/career-timeline.entity";
import { CareerTimelineRepositoryPort } from "../../../../lib/career/ports/career-timeline-repository.port";
import { CareerMemoryEntity } from "../../../../lib/career/domain/entities/career-memory.entity";
import { CareerMemoryRepositoryPort } from "../../../../lib/career/ports/career-memory-repository.port";
import { PrismaCareerTimelineRepository } from "../../../../lib/career/infrastructure/repositories/prisma-career-timeline.repository";
import { PrismaCareerMemoryRepository } from "../../../../lib/career/infrastructure/repositories/prisma-career-memory.repository";
import { Clock } from "../../../../lib/core/clock/Clock";

export interface CvUploadResult {
  cvId: string;
  url: string;
}

export interface JobOfferUploadResult {
  jobOfferId: string;
}

export interface InterviewStartResult {
  sessionId: string;
}

export class CandidateJourneyWorkflow {
  private voiceInterviewOrchestrator: VoiceInterviewOrchestrator | null = null;
  private careerCopilotOrchestrator: CareerCopilotOrchestrator;
  private careerTimeline: CareerTimeline;
  private careerMemory: CareerMemoryEntity;

  constructor(
    private readonly uploadCvUseCase: UploadCvUseCase,
    private readonly updateCareerProfileUseCase: UpdateCareerProfileUseCase,
    private readonly uploadJobOfferUseCase: UploadJobOfferUseCase,
    private readonly atsAnalysisGateway: AtsAnalysisGateway,
    private readonly rewriteCvUseCase: RewriteCvUseCase,
    private readonly startInterviewUseCase: StartInterviewUseCase,
    private readonly atsRepository: AtsRepositoryPort,
    private readonly profileExtractionRepository: ProfileExtractionRepositoryPort,
    private readonly optimizedCvRepository: OptimizedCvRepositoryPort,
    private readonly interviewReportRepository: InterviewReportRepositoryPort,
    private readonly interviewConversationUseCase: InterviewConversationUseCase | null = null,
    private readonly interviewRepository: any = null,
    private readonly careerTimelineRepository: CareerTimelineRepositoryPort | null = null,
    private readonly careerMemoryRepository: CareerMemoryRepositoryPort | null = null,
    private readonly clock: Clock | null = null
  ) {
    this.careerCopilotOrchestrator = new CareerCopilotOrchestrator();
    this.careerTimeline = clock ? new CareerTimeline(clock) : new CareerTimeline({ now: () => new Date() });
    this.careerMemory = new CareerMemoryEntity("placeholder"); // Will be initialized with userId
  }

  async uploadCv(input: UploadCvInput): Promise<Result<CvUploadResult>> {
    try {
      const startTime = Date.now();
      const result = await (this.uploadCvUseCase as any).execute(input);
      const latency = Date.now() - startTime;

      // Record metrics
      const metadata: IntelligenceMetadata = { latency };
      const metrics = MetricsAdapter.adaptMetrics(metadata);

      // Record timeline event and memory
      const userId = RequestContext.userId();
      if (userId) {
        // Initialize career memory for this user
        this.careerMemory = new CareerMemoryEntity(userId);
        await this.loadCareerMemory(userId);

        const event = this.careerTimeline.addEvent(userId, "cv_uploaded", { filename: input.filename });
        await this.persistTimelineEvent(event);

        // Add CV to memory
        if (result.isSuccess()) {
          const cvData = result.unwrap();
          this.careerMemory.addCv(cvData.cvId, ""); // Content would be extracted from CV
          await this.persistCareerMemory(userId);
        }

        // Invoke Career Copilot after CV upload
        await this.invokeCareerCopilot("afterCvUpload", userId, {});
      }

      return result;
    } catch (error: any) {
      return fail(new InfrastructureError(`CV upload failed: ${error.message}`));
    }
  }

  async updateCareerProfile(dto: CareerUpdateDTO): Promise<Result<any>> {
    try {
      const startTime = Date.now();
      const input: UpdateCareerProfileInput = { dto };
      const result = await (this.updateCareerProfileUseCase as any).execute(input);
      const latency = Date.now() - startTime;

      const metadata: IntelligenceMetadata = { latency };
      const metrics = MetricsAdapter.adaptMetrics(metadata);

      // Record timeline event
      const userId = RequestContext.userId();
      if (userId) {
        const event = this.careerTimeline.addEvent(userId, "profile_extracted", { profile: dto });
        await this.persistTimelineEvent(event);

        // Invoke Career Copilot after profile extraction
        await this.invokeCareerCopilot("afterProfileExtraction", userId, {
          careerProfile: dto
        });
      }

      return result;
    } catch (error: any) {
      return fail(new InfrastructureError(`Career profile update failed: ${error.message}`));
    }
  }

  async uploadJobOffer(input: UploadJobOfferInput): Promise<Result<JobOfferUploadResult>> {
    try {
      const startTime = Date.now();
      const result = await (this.uploadJobOfferUseCase as any).execute(input);
      const latency = Date.now() - startTime;

      const metadata: IntelligenceMetadata = { latency };
      const metrics = MetricsAdapter.adaptMetrics(metadata);

      return result;
    } catch (error: any) {
      return fail(new InfrastructureError(`Job offer upload failed: ${error.message}`));
    }
  }

  async analyzeAts(cvText: string, jobDescription?: string, cvId?: string, userId?: string): Promise<Result<JourneyData["atsAnalysisResult"]>> {
    try {
      const startTime = Date.now();
      const result = await this.atsAnalysisGateway.analyzeCv(cvText, jobDescription);
      const latency = Date.now() - startTime;

      const metadata: IntelligenceMetadata = { latency };
      const metrics = MetricsAdapter.adaptMetrics(metadata);

      // Persist ATS analysis if cvId and userId are provided
      if (result.isSuccess() && cvId && userId) {
        const analysis = result.unwrap();
        await this.atsRepository.saveAnalysis({
          cvId,
          userId,
          scoreBefore: undefined,
          scoreAfter: analysis.score,
          matchedKeywords: analysis.matchedKeywords,
          missingKeywords: analysis.missingKeywords,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          recommendations: analysis.recommendations,
        });

        // Record timeline event
        const event = this.careerTimeline.addEvent(userId, "ats_completed", { score: analysis.score, cvId });
        await this.persistTimelineEvent(event);

        // Add ATS analysis to career memory
        this.careerMemory.addAtsAnalysis(`ats_${cvId}_${Date.now()}`, cvId, analysis.score, analysis.matchedKeywords, analysis.missingKeywords);
        await this.persistCareerMemory(userId);

        // Invoke Career Copilot after ATS analysis
        await this.invokeCareerCopilot("afterAtsAnalysis", userId, {
          atsAnalysis: analysis,
          cv: cvText,
          jobOffer: jobDescription
        });
      }

      return result;
    } catch (error: any) {
      return fail(new InfrastructureError(`ATS analysis failed: ${error.message}`));
    }
  }

  async optimizeCv(input: RewriteCvInput): Promise<Result<string>> {
    try {
      const startTime = Date.now();
      const result = await (this.rewriteCvUseCase as any).execute(input);
      const latency = Date.now() - startTime;

      const metadata: IntelligenceMetadata = { latency };
      const metrics = MetricsAdapter.adaptMetrics(metadata);

      // Persist optimized CV if cvId and userId are provided
      if (result.isSuccess() && input.cvId) {
        const userId = RequestContext.userId();
        if (userId) {
          await this.optimizedCvRepository.saveOptimizedCv({
            cvId: input.cvId,
            userId,
            version: 1,
            text: result.unwrap(),
            atsContext: input.context,
          });

          // Record timeline event
          const event = this.careerTimeline.addEvent(userId, "cv_optimized", { cvId: input.cvId });
          await this.persistTimelineEvent(event);

          // Invoke Career Copilot after CV optimization
          await this.invokeCareerCopilot("afterCvOptimization", userId, {
            cv: result.unwrap()
          });
        }
      }

      return result;
    } catch (error: any) {
      return fail(new InfrastructureError(`CV optimization failed: ${error.message}`));
    }
  }

  async startInterview(input: StartInterviewCommand): Promise<Result<InterviewStartResult>> {
    try {
      const startTime = Date.now();
      const result = await (this.startInterviewUseCase as any).execute(input);
      const latency = Date.now() - startTime;

      const metadata: IntelligenceMetadata = { latency };
      const metrics = MetricsAdapter.adaptMetrics(metadata);

      if (result.isSuccess()) {
        const sessionId = result.unwrap();

        // Record timeline event
        const event = this.careerTimeline.addEvent(input.userId, "interview_started", { sessionId });
        await this.persistTimelineEvent(event);

        // Add interview to career memory
        this.careerMemory.addInterview(sessionId);
        await this.persistCareerMemory(input.userId);

        // Invoke Career Copilot during interview
        await this.invokeCareerCopilot("duringInterview", input.userId, {
          interviewData: { sessionId }
        });

        // Start voice interview if interview conversation use case is available
        if (this.interviewConversationUseCase) {
          try {
            this.voiceInterviewOrchestrator = new VoiceInterviewOrchestrator(
              this.interviewConversationUseCase,
              this.interviewRepository,
              null
            );

            const voiceConfig: VoiceInterviewConfig = {
              userId: input.userId,
              sessionId,
              language: "fr",
              sampleRate: 16000,
              channels: 1,
              bufferSize: 4096
            };

            await this.voiceInterviewOrchestrator.start(voiceConfig);
          } catch (voiceError) {
            console.error("Failed to start voice interview:", voiceError);
            // Continue without voice if voice setup fails
          }
        }

        return ok({ sessionId });
      }
      return fail(result.unwrapError());
    } catch (error: any) {
      return fail(new InfrastructureError(`Interview start failed: ${error.message}`));
    }
  }

  async stopInterview(): Promise<Result<void>> {
    try {
      if (this.voiceInterviewOrchestrator) {
        await this.voiceInterviewOrchestrator.stop();
        this.voiceInterviewOrchestrator = null;
      }

      // Record timeline event
      const userId = RequestContext.userId();
      if (userId) {
        const event = this.careerTimeline.addEvent(userId, "interview_completed", {});
        await this.persistTimelineEvent(event);

        // Update interview in career memory with completion
        const metrics = this.getVoiceInterviewMetrics();
        if (metrics) {
          const interviews = this.careerMemory.getInterviewHistory();
          if (interviews.length > 0) {
            const lastInterview = interviews[interviews.length - 1];
            if (lastInterview) {
              // Use overallScore instead of globalScore
              const score = (metrics as any).globalScore || (metrics as any).overallScore || 0;
              this.careerMemory.addInterview(lastInterview.sessionId, score);
              await this.persistCareerMemory(userId);
            }
          }
        }

        // Invoke Career Copilot after interview
        await this.invokeCareerCopilot("afterInterview", userId, {});
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Interview stop failed: ${error.message}`));
    }
  }

  getVoiceInterviewMetrics() {
    if (this.voiceInterviewOrchestrator) {
      return this.voiceInterviewOrchestrator.getMetrics();
    }
    return null;
  }

  /**
   * Invoke Career Copilot at specific journey points
   */
  private async invokeCareerCopilot(
    trigger: "afterCvUpload" | "afterProfileExtraction" | "afterAtsAnalysis" | "afterCvOptimization" | "duringInterview" | "afterInterview" | "afterFinalReport",
    userId: string,
    additionalData: Partial<CareerCopilotInput>
  ): Promise<void> {
    try {
      const input: CareerCopilotInput = {
        userId,
        ...additionalData
      };

      let output: CareerCopilotOutput;

      switch (trigger) {
        case "afterCvUpload":
          output = await this.careerCopilotOrchestrator.afterCvUpload(input, this.careerMemory);
          break;
        case "afterProfileExtraction":
          output = await this.careerCopilotOrchestrator.afterProfileExtraction(input, this.careerMemory);
          break;
        case "afterAtsAnalysis":
          output = await this.careerCopilotOrchestrator.afterAtsAnalysis(input, this.careerMemory);
          break;
        case "afterCvOptimization":
          output = await this.careerCopilotOrchestrator.afterCvOptimization(input, this.careerMemory);
          break;
        case "duringInterview":
          output = await this.careerCopilotOrchestrator.duringInterview(input, this.careerMemory);
          break;
        case "afterInterview":
          output = await this.careerCopilotOrchestrator.afterInterview(input, this.careerMemory);
          break;
        case "afterFinalReport":
          output = await this.careerCopilotOrchestrator.afterFinalReport(input, this.careerMemory);
          break;
        default:
          return;
      }

      // Persist Career Copilot output
      await this.persistCareerCopilotOutput(userId, output);
    } catch (error) {
      console.error(`Career Copilot invocation failed at ${trigger}:`, error);
      // Don't fail the workflow if copilot fails
    }
  }

  /**
   * Persist Career Copilot output
   */
  private async persistCareerCopilotOutput(userId: string, output: CareerCopilotOutput): Promise<void> {
    try {
      // For now, log the output. In a real implementation, this would persist to a repository
      console.log(`Career Copilot output for user ${userId}:`, JSON.stringify(output, null, 2));
    } catch (error) {
      console.error("Failed to persist Career Copilot output:", error);
    }
  }

  /**
   * Persist timeline event
   */
  private async persistTimelineEvent(event: any): Promise<void> {
    try {
      if (this.careerTimelineRepository) {
        await this.careerTimelineRepository.save(event);
      }
    } catch (error) {
      console.error("Failed to persist timeline event:", error);
    }
  }

  /**
   * Load career memory from repository
   */
  private async loadCareerMemory(userId: string): Promise<void> {
    try {
      if (this.careerMemoryRepository) {
        const memory = await this.careerMemoryRepository.findByUserId(userId);
        if (memory) {
          // Reconstruct CareerMemoryEntity from persisted data
          this.careerMemory = new CareerMemoryEntity(userId);
          memory.cvs.forEach(cv => this.careerMemory.addCv(cv.id, cv.content, cv.atsScore));
          memory.atsAnalyses.forEach(ats => this.careerMemory.addAtsAnalysis(ats.id, ats.cvId, ats.score, ats.matchedKeywords, ats.missingKeywords));
          memory.interviews.forEach(interview => this.careerMemory.addInterview(interview.sessionId, interview.score));
          memory.reports.forEach(report => this.careerMemory.addReport(report.sessionId, report.globalScore, report.strengths, report.weaknesses));
          memory.recommendations.forEach(rec => {
            this.careerMemory.addRecommendation(rec.id, rec.type, rec.content);
            if (rec.followedUp) {
              this.careerMemory.markRecommendationFollowedUp(rec.id);
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed to load career memory:", error);
    }
  }

  /**
   * Persist career memory to repository
   */
  private async persistCareerMemory(userId: string): Promise<void> {
    try {
      if (this.careerMemoryRepository) {
        await this.careerMemoryRepository.save(this.careerMemory.getMemory());
      }
    } catch (error) {
      console.error("Failed to persist career memory:", error);
    }
  }
}
