/**
 * InterviewPlanFactory
 *
 * Factory for creating InterviewPlan aggregates.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY InterviewPlan creation.
 */

import { InterviewPlan } from "../entities/InterviewPlan";
import { InterviewSection } from "../entities/InterviewSection";
import { InterviewObjective } from "../value-objects/InterviewObjective";
import { InterviewConstraints } from "../value-objects/InterviewConstraints";
import { AdaptiveRules } from "../value-objects/AdaptiveRules";
import { InterviewSummary } from "../value-objects/InterviewSummary";
import { InterviewMetadata } from "../value-objects/InterviewMetadata";
import { InterviewTiming } from "../value-objects/InterviewTiming";
import { PlanStatus, SectionData, InterviewPlanRequest, ObjectiveType, QuestionDifficulty } from "../types";

export class InterviewPlanFactory {
  create(request: InterviewPlanRequest): InterviewPlan {
    const planId = this.generateId();
    const objective = InterviewObjective.fromType(ObjectiveType.SCREENING);
    const constraints = request.constraints
      ? new InterviewConstraints(request.constraints)
      : InterviewConstraints.default();
    const adaptiveRules = AdaptiveRules.default();
    const summary = this.createEmptySummary();
    const metadata = InterviewMetadata.initial(request.requestedBy);
    const status = PlanStatus.DRAFT;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new InterviewPlan(
      planId,
      request.candidateId,
      request.jobOfferId,
      request.matchingId,
      objective,
      [],
      constraints,
      adaptiveRules,
      summary,
      metadata,
      status,
      createdAt,
      updatedAt
    );
  }

  createSection(data: SectionData): InterviewSection {
    const sectionId = this.generateId();
    const planId = "";
    const timing = InterviewTiming.fromSeconds(600);
    const order = 0;
    const isMandatory = false;
    const minQuestions = 3;
    const maxQuestions = 10;

    return new InterviewSection(
      sectionId,
      planId,
      data.name,
      data.description,
      data.objective,
      [],
      timing,
      order,
      isMandatory,
      minQuestions,
      maxQuestions
    );
  }

  createEmpty(): InterviewPlan {
    const planId = this.generateId();
    const objective = InterviewObjective.fromType(ObjectiveType.SCREENING);
    const constraints = InterviewConstraints.default();
    const adaptiveRules = AdaptiveRules.default();
    const summary = this.createEmptySummary();
    const metadata = InterviewMetadata.initial("system");
    const status = PlanStatus.DRAFT;
    const createdAt = new Date();
    const updatedAt = new Date();

    return new InterviewPlan(
      planId,
      "",
      "",
      "",
      objective,
      [],
      constraints,
      adaptiveRules,
      summary,
      metadata,
      status,
      createdAt,
      updatedAt
    );
  }

  private createEmptySummary(): InterviewSummary {
    return new InterviewSummary(
      0,
      0,
      0,
      0,
      2,
      [],
      [],
      QuestionDifficulty.BEGINNER
    );
  }

  private generateId(): string {
    return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
