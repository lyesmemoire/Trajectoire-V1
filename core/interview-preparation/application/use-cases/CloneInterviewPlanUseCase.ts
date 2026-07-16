/**
 * CloneInterviewPlanUseCase
 *
 * Use case for cloning interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { InterviewPlanFactory } from "../../domain/factories/InterviewPlanFactory";
import { CloneInterviewPlanRequest } from "../dtos/CloneInterviewPlanRequest";
import { CloneInterviewPlanResponse } from "../dtos/CloneInterviewPlanResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class CloneInterviewPlanUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: CloneInterviewPlanRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<CloneInterviewPlanResponse>> {
    const timer = this.telemetryPort.startTimer("CloneInterviewPlan");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview plan cloning", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const originalPlan = await this.persistencePort.load(request.planId);

      const factory = new InterviewPlanFactory();
      const clonedPlan = factory.create({
        candidateId: request.newCandidateId ?? originalPlan.getCandidateId(),
        jobOfferId: request.newJobOfferId ?? originalPlan.getJobOfferId(),
        matchingId: originalPlan.getMatchingId(),
        requestedBy: request.clonedBy,
        constraints: undefined,
      });

      const savedClonedPlan = await this.persistencePort.save(clonedPlan);

      this.telemetryPort.trackMetric("interview_plan_clone_duration", timer.stop(), {
        operation: "CloneInterviewPlan",
      });

      this.loggingPort.info("Interview plan cloned", {
        originalPlanId: request.planId,
        newPlanId: savedClonedPlan.getPlanId(),
        operationId: executionContext.operationId,
      });

      const response: CloneInterviewPlanResponse = {
        originalPlanId: request.planId,
        newPlanId: savedClonedPlan.getPlanId(),
        candidateId: savedClonedPlan.getCandidateId(),
        jobOfferId: savedClonedPlan.getJobOfferId(),
        clonedAt: new Date(),
        clonedBy: request.clonedBy,
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "CloneInterviewPlan",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to clone interview plan", error as Error, {
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
