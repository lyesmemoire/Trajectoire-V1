/**
 * PreviewInterviewPlanUseCase
 *
 * Use case for previewing interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of domain and ports.
 */

import { InterviewPlanAggregate } from "../../domain/aggregates/InterviewPlanAggregate";
import { PreviewInterviewPlanRequest } from "../dtos/PreviewInterviewPlanRequest";
import { PreviewInterviewPlanResponse } from "../dtos/PreviewInterviewPlanResponse";
import { InterviewPersistencePort } from "../ports/InterviewPersistencePort";
import { TelemetryPort } from "../ports/TelemetryPort";
import { LoggingPort } from "../ports/LoggingPort";
import { PersistenceError } from "../exceptions/ApplicationExceptions";
import { Result, ResultBuilder } from "../exceptions/ResultObjects";
import { ExecutionContextBuilder } from "../exceptions/ResultObjects";

export class PreviewInterviewPlanUseCase {
  constructor(
    private readonly persistencePort: InterviewPersistencePort,
    private readonly telemetryPort: TelemetryPort,
    private readonly loggingPort: LoggingPort
  ) {}

  async execute(
    request: PreviewInterviewPlanRequest,
    context: ExecutionContextBuilder
  ): Promise<Result<PreviewInterviewPlanResponse>> {
    const timer = this.telemetryPort.startTimer("PreviewInterviewPlan");
    const executionContext = context.build();

    try {
      this.loggingPort.info("Starting interview plan preview", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      const plan = await this.persistencePort.load(request.planId);
      const aggregate = new InterviewPlanAggregate(plan);

      const sections = plan.getSections();
      const constraints = plan.getConstraints();
      const summary = plan.getSummary();

      const response: PreviewInterviewPlanResponse = {
        planId: plan.getPlanId(),
        candidateId: plan.getCandidateId(),
        jobOfferId: plan.getJobOfferId(),
        objective: plan.getObjective().getPrimaryGoal(),
        sections: sections.map((s) => ({
          sectionId: s.getSectionId(),
          name: s.getName(),
          description: s.getDescription(),
          objective: s.getObjective(),
          questionCount: s.getQuestions().length,
          duration: s.getTiming().getTotalTime() / 60,
          order: s.getOrder(),
        })),
        constraints: {
          maxTotalDuration: constraints.getMaxTotalDuration(),
          maxQuestionsPerSection: constraints.getMaxQuestionsPerSection(),
          maxTotalQuestions: constraints.getMaxTotalQuestions(),
          minSoftSkillQuestions: constraints.getMinSoftSkillQuestions(),
          minHardSkillQuestions: constraints.getMinHardSkillQuestions(),
        },
        summary: {
          totalQuestions: summary.getTotalQuestions(),
          totalDuration: aggregate.calculateTotalDuration(),
          softSkillQuestions: summary.getSoftSkillQuestions(),
          hardSkillQuestions: summary.getHardSkillQuestions(),
          averageDifficulty: summary.getEstimatedDifficulty(),
        },
        previewedAt: new Date(),
      };

      this.telemetryPort.trackMetric("interview_plan_preview_duration", timer.stop(), {
        operation: "PreviewInterviewPlan",
      });

      this.loggingPort.info("Interview plan previewed", {
        planId: request.planId,
        operationId: executionContext.operationId,
      });

      return ResultBuilder.success(response);
    } catch (error) {
      this.telemetryPort.trackError(error as Error, {
        operation: "PreviewInterviewPlan",
        planId: request.planId,
      });

      this.loggingPort.error("Failed to preview interview plan", error as Error, {
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
