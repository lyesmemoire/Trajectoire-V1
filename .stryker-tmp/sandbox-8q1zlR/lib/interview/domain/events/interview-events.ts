// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class InterviewStarted extends BaseDomainEvent<{ userId: string; jobTitle: string }> {
  public readonly type = "InterviewStarted";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ userId: string; jobTitle: string }>) { super(); }
}

export class AnswerSubmitted extends BaseDomainEvent<{ answerContent: string }> {
  public readonly type = "AnswerSubmitted";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ answerContent: string }>) { super(); }
}

export class AnalysisCompleted extends BaseDomainEvent<{ confidenceScore: number; clarityScore: number }> {
  public readonly type = "AnalysisCompleted";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ confidenceScore: number; clarityScore: number }>) { super(); }
}

export class RecoveryTriggered extends BaseDomainEvent<{ previousPressure: number; newPressure: number }> {
  public readonly type = "RecoveryTriggered";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ previousPressure: number; newPressure: number }>) { super(); }
}

export class QuestionGenerated extends BaseDomainEvent<{ questionContent: string; intent?: string }> {
  public readonly type = "QuestionGenerated";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ questionContent: string; intent?: string }>) { super(); }
}

export class InterviewPressureAdjusted extends BaseDomainEvent<{ previousPressure: number; newPressure: number }> {
  public readonly type = "InterviewPressureAdjusted";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ previousPressure: number; newPressure: number }>) { super(); }
}

export class InterviewStepOrchestrated extends BaseDomainEvent<{ step: string }> {
  public readonly type = "InterviewStepOrchestrated";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ step: string }>) { super(); }
}

export class InterviewCompleted extends BaseDomainEvent<{ finalPressure: number }> {
  public readonly type = "InterviewCompleted";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ finalPressure: number }>) { super(); }
}

export class InterviewFailed extends BaseDomainEvent<{ reason: string }> {
  public readonly type = "InterviewFailed";
  constructor(public readonly aggregateId: string, public readonly payload: Readonly<{ reason: string }>) { super(); }
}
