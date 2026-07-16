/**
 * GenerateInterviewPlanCommandHandler
 *
 * Command handler for generating interview plans.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY command handling and delegation.
 */

import { InterviewPlanApplicationService } from "../services/InterviewPlanApplicationService";
import { GenerateInterviewPlanRequest } from "../dtos/GenerateInterviewPlanRequest";
import { GenerateInterviewPlanResponse } from "../dtos/GenerateInterviewPlanResponse";
import { Result, OperationStatus } from "../exceptions/ResultObjects";
import { RequestValidator } from "../validators/RequestValidator";
import { ValidationError } from "../exceptions/ApplicationExceptions";

export class GenerateInterviewPlanCommandHandler {
  constructor(
    private readonly applicationService: InterviewPlanApplicationService,
    private readonly validator: RequestValidator
  ) {}

  async handle(request: GenerateInterviewPlanRequest, userId: string): Promise<Result<GenerateInterviewPlanResponse>> {
    const validationResult = this.validator.validateGenerateInterviewPlanRequest(request);

    if (!validationResult.isValid) {
      return {
        status: OperationStatus.FAILURE,
        error: new ValidationError(validationResult.errors.map((e) => e.message).join(", ")),
      };
    }

    return this.applicationService.generateInterviewPlan(request, userId);
  }
}
