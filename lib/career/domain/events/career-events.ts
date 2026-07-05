import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class CareerProfileUpdated extends BaseDomainEvent<{
  userId: string;
  communicationScore: number;
  confidenceScore: number;
  technicalScore: number;
  leadershipScore: number;
  employabilityScore: number;
}> {
  public readonly type = "CareerProfileUpdated";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: Readonly<{
      userId: string;
      communicationScore: number;
      confidenceScore: number;
      technicalScore: number;
      leadershipScore: number;
      employabilityScore: number;
    }>
  ) {
    super();
  }
}

export class CareerArchetypeUnlocked extends BaseDomainEvent<{
  userId: string;
  archetypeId: string;
}> {
  public readonly type = "CareerArchetypeUnlocked";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: Readonly<{ userId: string; archetypeId: string }>
  ) {
    super();
  }
}

export class PredictionSnapshotCreated extends BaseDomainEvent<{
  userId: string;
  sessionId: string;
  predictionId: string;
}> {
  public readonly type = "PredictionSnapshotCreated";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: Readonly<{ userId: string; sessionId: string; predictionId: string }>
  ) {
    super();
  }
}

export class CareerInsightsGenerated extends BaseDomainEvent<{
  userId: string;
}> {
  public readonly type = "CareerInsightsGenerated";

  constructor(
    public readonly aggregateId: string,
    public readonly payload: Readonly<{ userId: string }>
  ) {
    super();
  }
}
