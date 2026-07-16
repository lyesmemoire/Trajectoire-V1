/**
 * AnalyzeCompetencyCoverageUseCase
 *
 * Use case for analyzing competency coverage.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { AnalyzeCompetencyCoverageRequest } from "../dtos/AnalyzeCompetencyCoverageRequest";
import { AnalyzeCompetencyCoverageResponse } from "../dtos/AnalyzeCompetencyCoverageResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { AnalyticsPort } from "../ports/AnalyticsPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class AnalyzeCompetencyCoverageUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly analyticsPort: AnalyticsPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: AnalyzeCompetencyCoverageRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<AnalyzeCompetencyCoverageResponse>> {
    const timer = this.telemetryPort.startTimer("AnalyzeCompetencyCoverage");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting competency coverage analysis", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);
      const aggregate = new InterviewPlanAggregate(plan);

      const coverageMatrix = aggregate.getCoverageMatrix();
      const competencies = coverageMatrix.getCompetencies();

      const response: AnalyzeCompetencyCoverageResponse = {
        overallCoverage: coverageMatrix.getOverallCoverage(),
        softSkillCoverage: coverageMatrix.getSoftSkillCoverage(),
        hardSkillCoverage: coverageMatrix.getHardSkillCoverage(),
        gaps: coverageMatrix.getGaps(),
        competencies: Array.from(competencies.values()).map((c) => ({
          competencyId: c.getCompetencyId(),
          competencyName: c.getCompetencyName(),
          coverageLevel: c.getCoverageLevel(),
          questionCount: c.getQuestionIds().length,
          isSufficient: c.isCoverageSufficient(),
        })),
        analyzedAt: new Date(),
      };

      this.analyticsPort.trackCoverage({
        planId: request.planId,
        overallCoverage: response.overallCoverage,
        softSkillCoverage: response.softSkillCoverage,
        hardSkillCoverage: response.hardSkillCoverage,
        gaps: response.gaps,
        analyzedAt: response.analyzedAt,
      });

      this.telemetryPort.trackMetric("competency_coverage_analysis_duration", timer.stop(), {
        operation: "AnalyzeCompetencyCoverage",
      });

      this.loggingPort.info("Competency coverage analyzed", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "AnalyzeCompetencyCoverage",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to analyze competency coverage", error as Error, {
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
