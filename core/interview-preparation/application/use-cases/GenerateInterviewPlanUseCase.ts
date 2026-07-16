/**
 * GenerateInterviewPlanUseCase
 *
 * Use case for generating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { InterviewPlanFactory } from "../../domain/factories/InterviewPlanFactory";
import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { QuestionDifficulty } from "../../domain/types";
import { GenerateInterviewPlanRequest } from "../dtos/GenerateInterviewPlanRequest";
import { GenerateInterviewPlanResponse } from "../dtos/GenerateInterviewPlanResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { AnalyticsPort } from "../ports/AnalyticsPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class GenerateInterviewPlanUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly analyticsPort: AnalyticsPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: GenerateInterviewPlanRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<GenerateInterviewPlanResponse>> {
    const timer = this.telemetryPort.startTimer("GenerateInterviewPlan");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview plan generation", {
        candidateId: request.candidateId,
        jobOfferId: request.jobOfferId,
        operationId: executionContext.operationId,
      });

      const factory = new InterviewPlanFactory();
      const domainRequest = {
        candidateId: request.candidateId,
        jobOfferId: request.jobOfferId,
        matchingId: request.matchingId,
        requestedBy: request.requestedBy,
        constraints: request.constraints
          ? {
              ...request.constraints,
              maxDifficulty: request.constraints.maxDifficulty as QuestionDifficulty,
              minDifficulty: request.constraints.minDifficulty as QuestionDifficulty,
            }
          : undefined,
      };

      const plan = factory.create(domainRequest);
      const aggregate = new InterviewPlanAggregate(plan);

      const savedPlan = await this.persistencePort.save(plan);

      const coverageMatrix = aggregate.getCoverageMatrix();
      const response: GenerateInterviewPlanResponse = {
        planId: savedPlan.getPlanId(),
        candidateId: savedPlan.getCandidateId(),
        jobOfferId: savedPlan.getJobOfferId(),
        matchingId: savedPlan.getMatchingId(),
        status: savedPlan.getStatus(),
        questionCount: savedPlan.getSummary().getTotalQuestions(),
        totalDuration: aggregate.calculateTotalDuration(),
        overallCoverage: coverageMatrix.getOverallCoverage(),
        softSkillCoverage: coverageMatrix.getSoftSkillCoverage(),
        hardSkillCoverage: coverageMatrix.getHardSkillCoverage(),
        gaps: coverageMatrix.getGaps(),
        createdAt: savedPlan.getCreatedAt(),
        generatedBy: request.requestedBy,
      };

      this.analyticsPort.trackGeneration({
        candidateId: request.candidateId,
        jobOfferId: request.jobOfferId,
        questionCount: response.questionCount,
        duration: response.totalDuration,
        coveragePercentage: response.overallCoverage,
        generatedAt: new Date(),
      });

      this.telemetryPort.trackMetric("interview_plan_generation_duration", timer.stop(), {
        operation: "GenerateInterviewPlan",
      });

      this.loggingPort.info("Interview plan generated successfully", {
        planId: response.planId,
        operationId: executionContext.operationId,
      });

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "GenerateInterviewPlan",
        candidateId: request.candidateId,
        jobOfferId: request.jobOfferId,
      });

      this.loggingPort.error("Failed to generate interview plan", error as Error, {
        candidateId: request.candidateId,
        jobOfferId: request.jobOfferId,
        operationId: executionContext.operationId,
      });

      if (error instanceof Error) {
        return ResultBuilder.failure(new PersistenceError(error.message));
      }

      return ResultBuilder.failure(new PersistenceError("Unknown error occurred"));
    }
  }
}
