/**
 * OptimizeQuestionOrderUseCase
 *
 * Use case for optimizing question order.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { QuestionOrderingService } from "../../domain/services/QuestionOrderingService";
import { OrderingStrategy } from "../../domain/types";
import { OptimizeQuestionOrderRequest } from "../dtos/OptimizeQuestionOrderRequest";
import { OptimizeQuestionOrderResponse } from "../dtos/OptimizeQuestionOrderResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class OptimizeQuestionOrderUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: OptimizeQuestionOrderRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<OptimizeQuestionOrderResponse>> {
    const timer = this.telemetryPort.startTimer("OptimizeQuestionOrder");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting question order optimization", {
        planId: request.planId,
        strategy: request.strategy,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);

      const orderingService = new QuestionOrderingService();
      const strategy = request.strategy as OrderingStrategy;

      const allQuestions = plan.getSections().flatMap((s) => s.getQuestions());
      const orderedQuestions = orderingService.orderQuestions(allQuestions, strategy);

      const optimizedQuestionIds = orderedQuestions.map((q) => q.getQuestionId());

      this.telemetryPort.trackMetric("question_order_optimization_duration", timer.stop(), {
        operation: "OptimizeQuestionOrder",
      });

      this.loggingPort.info("Question order optimized", {
        planId: request.planId,
        strategy: request.strategy,
        operationId: executionContext.operationId,
      });

      const response: OptimizeQuestionOrderResponse = {
        planId: request.planId,
        optimizedQuestionIds,
        strategy: request.strategy,
        optimizedAt: new Date(),
      };

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "OptimizeQuestionOrder",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to optimize question order", error as Error, {
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
