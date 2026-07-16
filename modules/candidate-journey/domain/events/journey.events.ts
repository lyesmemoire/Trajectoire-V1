import { BaseDomainEvent } from "../../../../lib/core/events/domain/BaseDomainEvent";

export class JourneyStarted extends BaseDomainEvent<{ journeyId: string; userId: string; timestamp: Date }> {
  public readonly type = "journey.started";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ journeyId: string; userId: string; timestamp: Date }>;

  constructor(public readonly userId: string, payload: { journeyId: string; userId: string; timestamp: Date }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.journeyId;
    this.payload = Object.freeze(payload);
  }
}

export class JourneyStepCompleted extends BaseDomainEvent<{ journeyId: string; userId: string; step: string; timestamp: Date }> {
  public readonly type = "journey.step_completed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ journeyId: string; userId: string; step: string; timestamp: Date }>;

  constructor(public readonly userId: string, payload: { journeyId: string; userId: string; step: string; timestamp: Date }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.journeyId;
    this.payload = Object.freeze(payload);
  }
}

export class JourneyCompleted extends BaseDomainEvent<{ journeyId: string; userId: string; timestamp: Date; data: any }> {
  public readonly type = "journey.completed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ journeyId: string; userId: string; timestamp: Date; data: any }>;

  constructor(public readonly userId: string, payload: { journeyId: string; userId: string; timestamp: Date; data: any }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.journeyId;
    this.payload = Object.freeze(payload);
  }
}

export class JourneyFailed extends BaseDomainEvent<{ journeyId: string; userId: string; error: string; timestamp: Date }> {
  public readonly type = "journey.failed";
  public readonly aggregateId: string;
  public readonly payload: Readonly<{ journeyId: string; userId: string; error: string; timestamp: Date }>;

  constructor(public readonly userId: string, payload: { journeyId: string; userId: string; error: string; timestamp: Date }, metadata?: Record<string, unknown>) {
    super(metadata);
    this.aggregateId = payload.journeyId;
    this.payload = Object.freeze(payload);
  }
}
