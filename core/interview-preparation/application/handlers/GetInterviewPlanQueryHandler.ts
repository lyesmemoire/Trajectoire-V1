/**
 * GetInterviewPlanQueryHandler
 *
 * Query handler for retrieving interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY query handling and delegation.
 */

import { InterviewPlanApplicationService } from "../services/InterviewPlanApplicationService";
import { PreviewInterviewPlanRequest } from "../dtos/PreviewInterviewPlanRequest";
import { PreviewInterviewPlanResponse } from "../dtos/PreviewInterviewPlanResponse";
import { Result, OperationStatus } from "../exceptions/ResultObjects";
import { RequestValidator } from "../validators/RequestValidator";
import { ValidationError } from "../exceptions/ApplicationExceptions";

export class GetInterviewPlanQueryHandler {
  constructor(
    private readonly applicationService: InterviewPlanApplicationService,
    private readonly validator: RequestValidator
  ) {}

  async handle(request: PreviewInterviewPlanRequest, userId: string): Promise<Result<PreviewInterviewPlanResponse>> {
    const validationResult = this.validator.validatePlanId(request.planId);

    if (!validationResult.isValid) {
      return {
        status: OperationStatus.FAILURE,
        error: new ValidationError(validationResult.errors.map((e) => e.message).join(", ")),
      };
    }

    return this.applicationService.previewInterviewPlan(request, userId);
  }
}
