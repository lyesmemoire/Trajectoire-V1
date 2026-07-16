/**
 * CalculateInterviewTimingUseCase
 *
 * Use case for calculating interview timing.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */
// @ts-nocheck


import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { CalculateInterviewTimingRequest } from "../dtos/CalculateInterviewTimingRequest";
import { CalculateInterviewTimingResponse } from "../dtos/CalculateInterviewTimingResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class CalculateInterviewTimingUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: CalculateInterviewTimingRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<CalculateInterviewTimingResponse>> {
    const timer = this.telemetryPort.startTimer("CalculateInterviewTiming");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview timing calculation", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);
      const aggregate = new InterviewPlanAggregate(plan);

      const totalDuration = aggregate.calculateTotalDuration();
      const sections = plan.getSections();

      const sectionTimings = sections.map((section) => ({
        sectionId: section.getSectionId(),
        sectionName: section.getName(),
        duration: section.getTiming().getTotalTime() / 60,
        questionCount: section.getQuestions().length,
      }));

      this.telemetryPort.trackMetric("interview_timing_calculation_duration", timer.stop(), {
        operation: "CalculateInterviewTiming",
      });

      this.loggingPort.info("Interview timing calculated", {
        planId: request.planId,
        totalDuration,
        operationId: executionContext.operationId,
      });

      const response: CalculateInterviewTimingResponse = {
        totalDuration,
        sectionTimings,
        calculatedAt: new Date(),
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "CalculateInterviewTiming",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to calculate interview timing", error as Error, {
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
