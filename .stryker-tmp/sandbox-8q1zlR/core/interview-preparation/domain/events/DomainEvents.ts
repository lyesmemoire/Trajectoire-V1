/**
 * Domain Events
 *
 * Domain events for the Interview Preparation Engine.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY event definitions.
 */
// @ts-nocheck


import { InterviewPlanRequest } from "../types";

export interface DomainEvent {
  eventId: string;
  eventType: string;
  occurredAt: Date;
  aggregateId: string;
  aggregateType: string;
  version: number;
}

export class InterviewPlanRequested implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "InterviewPlanRequested";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly request: InterviewPlanRequest;
  readonly requestedBy: string;

  constructor(request: InterviewPlanRequest, requestedBy: string) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = `plan_${request.candidateId}_${request.jobOfferId}`;
    this.request = request;
    this.requestedBy = requestedBy;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class InterviewPlanGenerated implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "InterviewPlanGenerated";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly candidateId: string;
  readonly jobOfferId: string;
  readonly questionCount: number;
  readonly totalDuration: number;

  constructor(
    planId: string,
    candidateId: string,
    jobOfferId: string,
    questionCount: number,
    totalDuration: number
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.candidateId = candidateId;
    this.jobOfferId = jobOfferId;
    this.questionCount = questionCount;
    this.totalDuration = totalDuration;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class QuestionGenerated implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "QuestionGenerated";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewQuestion";
  readonly version: number = 1;
  readonly questionId: string;
  readonly sectionId: string;
  readonly type: string;
  readonly difficulty: string;
  readonly generatedBy: "AI" | "TEMPLATE";

  constructor(
    questionId: string,
    sectionId: string,
    type: string,
    difficulty: string,
    generatedBy: "AI" | "TEMPLATE"
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = questionId;
    this.questionId = questionId;
    this.sectionId = sectionId;
    this.type = type;
    this.difficulty = difficulty;
    this.generatedBy = generatedBy;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class CoverageCompleted implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "CoverageCompleted";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly overallCoverage: number;
  readonly gaps: string[];

  constructor(planId: string, overallCoverage: number, gaps: string[]) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.overallCoverage = overallCoverage;
    this.gaps = gaps;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class PlanValidated implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "PlanValidated";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly isValid: boolean;
  readonly score: number;
  readonly errors: string[];
  readonly warnings: string[];

  constructor(
    planId: string,
    isValid: boolean,
    score: number,
    errors: string[],
    warnings: string[]
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.isValid = isValid;
    this.score = score;
    this.errors = errors;
    this.warnings = warnings;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class PlanRejected implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "PlanRejected";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly reason: string;
  readonly rejectedBy: string;

  constructor(planId: string, reason: string, rejectedBy: string) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.reason = reason;
    this.rejectedBy = rejectedBy;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class QuestionAdded implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "QuestionAdded";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewSection";
  readonly version: number = 1;
  readonly questionId: string;
  readonly sectionId: string;
  readonly planId: string;

  constructor(questionId: string, sectionId: string, planId: string) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = sectionId;
    this.questionId = questionId;
    this.sectionId = sectionId;
    this.planId = planId;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class QuestionRemoved implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "QuestionRemoved";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewSection";
  readonly version: number = 1;
  readonly questionId: string;
  readonly sectionId: string;
  readonly planId: string;
  readonly reason: string;

  constructor(questionId: string, sectionId: string, planId: string, reason: string) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = sectionId;
    this.questionId = questionId;
    this.sectionId = sectionId;
    this.planId = planId;
    this.reason = reason;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class QuestionReordered implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "QuestionReordered";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewSection";
  readonly version: number = 1;
  readonly sectionId: string;
  readonly planId: string;
  readonly questionIds: string[];

  constructor(sectionId: string, planId: string, questionIds: string[]) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = sectionId;
    this.sectionId = sectionId;
    this.planId = planId;
    this.questionIds = questionIds;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class DifficultyAdjusted implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "DifficultyAdjusted";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewQuestion";
  readonly version: number = 1;
  readonly questionId: string;
  readonly oldDifficulty: string;
  readonly newDifficulty: string;
  readonly reason: string;

  constructor(
    questionId: string,
    oldDifficulty: string,
    newDifficulty: string,
    reason: string
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = questionId;
    this.questionId = questionId;
    this.oldDifficulty = oldDifficulty;
    this.newDifficulty = newDifficulty;
    this.reason = reason;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class InterviewPlanCompleted implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "InterviewPlanCompleted";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly candidateId: string;
  readonly jobOfferId: string;
  readonly completedBy: string;

  constructor(
    planId: string,
    candidateId: string,
    jobOfferId: string,
    completedBy: string
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.candidateId = candidateId;
    this.jobOfferId = jobOfferId;
    this.completedBy = completedBy;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class PlanGenerationFailed implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "PlanGenerationFailed";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly candidateId: string;
  readonly jobOfferId: string;
  readonly error: string;
  readonly errorType: string;

  constructor(
    candidateId: string,
    jobOfferId: string,
    error: string,
    errorType: string
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = `plan_${candidateId}_${jobOfferId}`;
    this.candidateId = candidateId;
    this.jobOfferId = jobOfferId;
    this.error = error;
    this.errorType = errorType;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class QuestionGenerationFailed implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "QuestionGenerationFailed";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewQuestion";
  readonly version: number = 1;
  readonly sectionId: string;
  readonly competencyId: string;
  readonly error: string;
  readonly errorType: string;

  constructor(
    sectionId: string,
    competencyId: string,
    error: string,
    errorType: string
  ) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = sectionId;
    this.sectionId = sectionId;
    this.competencyId = competencyId;
    this.error = error;
    this.errorType = errorType;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class CoverageAnalysisFailed implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "CoverageAnalysisFailed";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly error: string;
  readonly errorType: string;

  constructor(planId: string, error: string, errorType: string) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.error = error;
    this.errorType = errorType;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class PlanValidationFailed implements DomainEvent {
  readonly eventId: string;
  readonly eventType: string = "PlanValidationFailed";
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string = "InterviewPlan";
  readonly version: number = 1;
  readonly planId: string;
  readonly error: string;
  readonly errorType: string;

  constructor(planId: string, error: string, errorType: string) {
    this.eventId = this.generateId();
    this.occurredAt = new Date();
    this.aggregateId = planId;
    this.planId = planId;
    this.error = error;
    this.errorType = errorType;
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
