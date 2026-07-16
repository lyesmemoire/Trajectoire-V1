/**
 * GenerateInterviewSummaryUseCase
 *
 * Use case for generating interview summary.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */
// @ts-nocheck


import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { GenerateInterviewSummaryRequest } from "../dtos/GenerateInterviewSummaryRequest";
import { GenerateInterviewSummaryResponse } from "../dtos/GenerateInterviewSummaryResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class GenerateInterviewSummaryUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: GenerateInterviewSummaryRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<GenerateInterviewSummaryResponse>> {
    const timer = this.telemetryPort.startTimer("GenerateInterviewSummary");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview summary generation", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);
      const aggregate = new InterviewPlanAggregate(plan);

      const summary = plan.getSummary();
      const sections = plan.getSections();
      const coverageMatrix = aggregate.getCoverageMatrix();

      const softSkillQuestions = summary.getSoftSkillQuestions();
      const hardSkillQuestions = summary.getHardSkillQuestions();
      const totalQuestions = summary.getTotalQuestions();
      const isBalanced = Math.abs(softSkillQuestions - hardSkillQuestions) / totalQuestions <= 0.2;

      this.telemetryPort.trackMetric("interview_summary_generation_duration", timer.stop(), {
        operation: "GenerateInterviewSummary",
      });

      this.loggingPort.info("Interview summary generated", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const response: GenerateInterviewSummaryResponse = {
        planId: request.planId,
        totalQuestions: summary.getTotalQuestions(),
        totalDuration: aggregate.calculateTotalDuration(),
        softSkillQuestions: summary.getSoftSkillQuestions(),
        hardSkillQuestions: summary.getHardSkillQuestions(),
        averageDifficulty: summary.getAverageDifficulty(),
        sections: sections.map((s) => s.getName()),
        primaryCompetencies: Array.from(coverageMatrix.getCompetencies().keys()).slice(0, 5),
        estimatedDifficulty: summary.getEstimatedDifficulty(),
        isBalanced,
        generatedAt: new Date(),
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "GenerateInterviewSummary",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to generate interview summary", error as Error, {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      if (error instanceof Error) {
        return ResultBuilder.failure(new PersistenceError(error.message));
      }

      return ResultBuilder.failure(new PersistenceError("Unknown error occurred"));
    }
  }
}
