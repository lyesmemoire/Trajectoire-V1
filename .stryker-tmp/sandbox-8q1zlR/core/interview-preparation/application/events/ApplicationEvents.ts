/**
 * Application Events
 *
 * Application-level events for cross-cutting concerns.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY event definitions.
 */
// @ts-nocheck


export interface ApplicationEvent {
  eventId: string;
  eventType: string;
  timestamp: Date;
  userId: string;
  metadata?: Record<string, unknown>;
}

export class InterviewPlanGeneratedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "INTERVIEW_PLAN_GENERATED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, candidateId: string, jobOfferId: string, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
      candidateId,
      jobOfferId,
    };
  }
}

export class InterviewPlanValidatedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "INTERVIEW_PLAN_VALIDATED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, isValid: boolean, score: number, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
      isValid,
      score,
    };
  }
}

export class InterviewPlanFinalizedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "INTERVIEW_PLAN_FINALIZED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, candidateId: string, jobOfferId: string, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
      candidateId,
      jobOfferId,
    };
  }
}

export class InterviewPlanClonedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "INTERVIEW_PLAN_CLONED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(originalPlanId: string, newPlanId: string, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      originalPlanId,
      newPlanId,
    };
  }
}

export class InterviewConstraintsUpdatedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "INTERVIEW_CONSTRAINTS_UPDATED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
    };
  }
}

export class CoverageAnalyzedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "COVERAGE_ANALYZED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, overallCoverage: number, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
      overallCoverage,
    };
  }
}

export class DifficultyAdjustedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "DIFFICULTY_ADJUSTED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, adjustedCount: number, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
      adjustedCount,
    };
  }
}

export class QuestionOrderOptimizedEvent implements ApplicationEvent {
  eventId: string;
  eventType = "QUESTION_ORDER_OPTIMIZED";
  timestamp: Date;
  userId: string;
  metadata: Record<string, unknown>;

  constructor(planId: string, strategy: string, userId: string) {
    this.eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.userId = userId;
    this.metadata = {
      planId,
      strategy,
    };
  }
}
