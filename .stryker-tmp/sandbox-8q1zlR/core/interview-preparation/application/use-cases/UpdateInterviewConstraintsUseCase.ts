/**
 * UpdateInterviewConstraintsUseCase
 *
 * Use case for updating interview constraints.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */
// @ts-nocheck


import { InterviewConstraints } from "../../domain/value-objects/InterviewConstraints";
import { QuestionDifficulty } from "../../domain/types";
import { UpdateInterviewConstraintsRequest } from "../dtos/UpdateInterviewConstraintsRequest";
import { UpdateInterviewConstraintsResponse } from "../dtos/UpdateInterviewConstraintsResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class UpdateInterviewConstraintsUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: UpdateInterviewConstraintsRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<UpdateInterviewConstraintsResponse>> {
    const timer = this.telemetryPort.startTimer("UpdateInterviewConstraints");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview constraints update", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);

      const constraintsData = {
        ...request.constraints,
        maxDifficulty: request.constraints.maxDifficulty as QuestionDifficulty,
        minDifficulty: request.constraints.minDifficulty as QuestionDifficulty,
      };

      const newConstraints = new InterviewConstraints(constraintsData);

      await this.persistencePort.save(plan);

      this.telemetryPort.trackMetric("interview_constraints_update_duration", timer.stop(), {
        operation: "UpdateInterviewConstraints",
      });

      this.loggingPort.info("Interview constraints updated", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const response: UpdateInterviewConstraintsResponse = {
        planId: request.planId,
        constraints: {
          maxTotalDuration: newConstraints.getMaxTotalDuration(),
          maxQuestionsPerSection: newConstraints.getMaxQuestionsPerSection(),
          maxTotalQuestions: newConstraints.getMaxTotalQuestions(),
          minSoftSkillQuestions: newConstraints.getMinSoftSkillQuestions(),
          minHardSkillQuestions: newConstraints.getMinHardSkillQuestions(),
          maxDifficulty: newConstraints.getMaxDifficulty(),
          minDifficulty: newConstraints.getMinDifficulty(),
          mandatoryCompetencies: newConstraints.getMandatoryCompetencies(),
          forbiddenTopics: newConstraints.getForbiddenTopics(),
        },
        updatedAt: new Date(),
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "UpdateInterviewConstraints",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to update interview constraints", error as Error, {
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
