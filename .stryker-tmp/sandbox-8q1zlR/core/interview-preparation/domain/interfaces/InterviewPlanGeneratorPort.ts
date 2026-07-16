/**
 * InterviewPlanGeneratorPort
 *
 * Port interface for interview plan generation.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition.
 */
// @ts-nocheck


import { InterviewPlan } from "../entities/InterviewPlan";
import { InterviewPlanRequest, ValidationResult, PlanAdjustments } from "../types";

export interface InterviewPlanGeneratorPort {
  /**
   * Generate an interview plan from request data
   * @param request - Plan generation request
   * @returns Generated interview plan
   * @throws InterviewPlanningError if generation fails
   */
  generate(request: InterviewPlanRequest): Promise<InterviewPlan>;

  /**
   * Validate an interview plan
   * @param plan - Plan to validate
   * @returns Validation result
   */
  validate(plan: InterviewPlan): ValidationResult;

  /**
   * Regenerate an interview plan with adjustments
   * @param planId - Plan ID to regenerate
   * @param adjustments - Adjustments to apply
   * @returns Regenerated interview plan
   * @throws InterviewPlanningError if regeneration fails
   */
  regenerate(planId: string, adjustments: PlanAdjustments): Promise<InterviewPlan>;
}
