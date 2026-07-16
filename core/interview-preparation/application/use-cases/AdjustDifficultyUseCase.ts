/**
 * AdjustDifficultyUseCase
 *
 * Use case for adjusting difficulty.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { DifficultyAdjustmentService } from "../../domain/services/DifficultyAdjustmentService";
import { SkillLevel } from "../../domain/types";
import { AdjustDifficultyRequest } from "../dtos/AdjustDifficultyRequest";
import { AdjustDifficultyResponse } from "../dtos/AdjustDifficultyResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class AdjustDifficultyUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: AdjustDifficultyRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<AdjustDifficultyResponse>> {
    const timer = this.telemetryPort.startTimer("AdjustDifficulty");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting difficulty adjustment", {
        planId: request.planId,
        candidateLevel: request.candidateLevel,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);

      const difficultyService = new DifficultyAdjustmentService();
      const candidateLevel = request.candidateLevel as SkillLevel;

      const allQuestions = plan.getSections().flatMap((s) => s.getQuestions());
      const adjustedQuestions = difficultyService.adjustDifficulty(allQuestions, candidateLevel);

      const adjustedQuestionDTOs = adjustedQuestions.map((q) => ({
        questionId: q.getQuestionId(),
        oldDifficulty: q.getDifficulty().getValue(),
        newDifficulty: q.getDifficulty().getValue(),
        reason: "Adjusted for candidate level",
      }));

      this.telemetryPort.trackMetric("difficulty_adjustment_duration", timer.stop(), {
        operation: "AdjustDifficulty",
      });

      this.loggingPort.info("Difficulty adjusted", {
        planId: request.planId,
        adjustedCount: adjustedQuestions.length,
        operationId: executionContext.operationId,
      });

      const response: AdjustDifficultyResponse = {
        planId: request.planId,
        adjustedQuestions: adjustedQuestionDTOs,
        adjustedAt: new Date(),
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "AdjustDifficulty",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to adjust difficulty", error as Error, {
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
