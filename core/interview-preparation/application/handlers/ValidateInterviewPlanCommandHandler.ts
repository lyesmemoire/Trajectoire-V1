/**
 * ValidateInterviewPlanCommandHandler
 *
 * Command handler for validating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY command handling and delegation.
 */

import { InterviewPlanApplicationService } from "../services/InterviewPlanApplicationService";
import { ValidateInterviewPlanRequest } from "../dtos/ValidateInterviewPlanRequest";
import { ValidateInterviewPlanResponse } from "../dtos/ValidateInterviewPlanResponse";
import { Result, OperationStatus } from "../exceptions/ResultObjects";
import { RequestValidator } from "../validators/RequestValidator";
import { ValidationError } from "../exceptions/ApplicationExceptions";

export class ValidateInterviewPlanCommandHandler {
  constructor(
    private readonly applicationService: InterviewPlanApplicationService,
    private readonly validator: RequestValidator
  ) {}

  async handle(request: ValidateInterviewPlanRequest, userId: string): Promise<Result<ValidateInterviewPlanResponse>> {
    const validationResult = this.validator.validatePlanId(request.planId);

    if (!validationResult.isValid) {
      return {
        status: OperationStatus.FAILURE,
        error: new ValidationError(validationResult.errors.map((e) => e.message).join(", ")),
      };
    }

    return this.applicationService.validateInterviewPlan(request, userId);
  }
}
