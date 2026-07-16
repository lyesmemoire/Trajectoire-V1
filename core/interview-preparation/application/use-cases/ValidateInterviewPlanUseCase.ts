/**
 * ValidateInterviewPlanUseCase
 *
 * Use case for validating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { ValidateInterviewPlanRequest } from "../dtos/ValidateInterviewPlanRequest";
import { ValidateInterviewPlanResponse } from "../dtos/ValidateInterviewPlanResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { AnalyticsPort } from "../ports/AnalyticsPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class ValidateInterviewPlanUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly analyticsPort: AnalyticsPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: ValidateInterviewPlanRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<ValidateInterviewPlanResponse>> {
    const timer = this.telemetryPort.startTimer("ValidateInterviewPlan");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview plan validation", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);
      const aggregate = new InterviewPlanAggregate(plan);

      const validationResult = aggregate.validate();

      this.analyticsPort.trackValidation({
        planId: request.planId,
        isValid: validationResult.isValid,
        score: validationResult.score,
        errorCount: validationResult.errors.length,
        warningCount: validationResult.warnings.length,
        validatedAt: new Date(),
      });

      this.telemetryPort.trackMetric("interview_plan_validation_duration", timer.stop(), {
        operation: "ValidateInterviewPlan",
      });

      this.loggingPort.info("Interview plan validated", {
        planId: request.planId,
        isValid: validationResult.isValid,
        operationId: executionContext.operationId,
      });

      const response: ValidateInterviewPlanResponse = {
        isValid: validationResult.isValid,
        score: validationResult.score,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        validatedAt: new Date(),
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "ValidateInterviewPlan",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to validate interview plan", error as Error, {
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
