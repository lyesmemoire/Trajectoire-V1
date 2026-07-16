/**
 * FinalizeInterviewPlanUseCase
 *
 * Use case for finalizing interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { FinalizeInterviewPlanRequest } from "../dtos/FinalizeInterviewPlanRequest";
import { FinalizeInterviewPlanResponse } from "../dtos/FinalizeInterviewPlanResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class FinalizeInterviewPlanUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: FinalizeInterviewPlanRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<FinalizeInterviewPlanResponse>> {
    const timer = this.telemetryPort.startTimer("FinalizeInterviewPlan");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview plan finalization", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);
      const aggregate = new InterviewPlanAggregate(plan);

      const validationResult = aggregate.validate();

      if (!validationResult.isValid) {
        this.loggingPort.warn("Cannot finalize invalid plan", {
          planId: request.planId,
          errors: validationResult.errors,
          operationId: executionContext.operationId,
        });

        return ResultBuilder.failure(
          new Error(`Plan validation failed: ${validationResult.errors.join(", ")}`)
        );
      }

      const finalizedPlan = plan;
      const savedPlan = await this.persistencePort.save(finalizedPlan);

      this.telemetryPort.trackMetric("interview_plan_finalization_duration", timer.stop(), {
        operation: "FinalizeInterviewPlan",
      });

      this.loggingPort.info("Interview plan finalized", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const response: FinalizeInterviewPlanResponse = {
        planId: request.planId,
        candidateId: savedPlan.getCandidateId(),
        jobOfferId: savedPlan.getJobOfferId(),
        status: savedPlan.getStatus(),
        finalizedAt: new Date(),
        finalizedBy: request.finalizedBy,
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "FinalizeInterviewPlan",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to finalize interview plan", error as Error, {
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
