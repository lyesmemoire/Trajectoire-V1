/**
 * InterviewPlanOrchestrator
 *
 * Orchestrator for coordinating multiple interview plan operations.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY orchestration of use cases.
 */
// @ts-nocheck


import { InterviewPlanApplicationService } from "../services/InterviewPlanApplicationService";
import { GenerateInterviewPlanRequest } from "../dtos/GenerateInterviewPlanRequest";
import { GenerateInterviewPlanResponse } from "../dtos/GenerateInterviewPlanResponse";
import { ValidateInterviewPlanRequest } from "../dtos/ValidateInterviewPlanRequest";
import { ValidateInterviewPlanResponse } from "../dtos/ValidateInterviewPlanResponse";
import { FinalizeInterviewPlanRequest } from "../dtos/FinalizeInterviewPlanRequest";
import { FinalizeInterviewPlanResponse } from "../dtos/FinalizeInterviewPlanResponse";
import { Result } from "../exceptions/ResultObjects";

export interface GenerateAndFinalizeResult {
  generation: Result<GenerateInterviewPlanResponse>;
  validation: Result<ValidateInterviewPlanResponse> | null;
  finalization: Result<FinalizeInterviewPlanResponse> | null;
}

export class InterviewPlanOrchestrator {
  constructor(private readonly applicationService: InterviewPlanApplicationService) {}

  async generateAndFinalize(
    request: GenerateInterviewPlanRequest,
    userId: string
  ): Promise<GenerateAndFinalizeResult> {
    const generation = await this.applicationService.generateInterviewPlan(request, userId);

    if (generation.status !== "SUCCESS" || !generation.data) {
      return {
        generation,
        validation: null,
        finalization: null,
      };
    }

    const validationRequest: ValidateInterviewPlanRequest = {
      planId: generation.data.planId,
    };

    const validation = await this.applicationService.validateInterviewPlan(validationRequest, userId);

    if (validation.status !== "SUCCESS" || !validation.data?.isValid) {
      return {
        generation,
        validation,
        finalization: null,
      };
    }

    const finalizationRequest: FinalizeInterviewPlanRequest = {
      planId: generation.data.planId,
      finalizedBy: userId,
    };

    const finalization = await this.applicationService.finalizeInterviewPlan(finalizationRequest, userId);

    return {
      generation,
      validation,
      finalization,
    };
  }
}
