// @ts-nocheck
import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { Clock } from "@/lib/core/clock/Clock";
import { CareerScore } from "../value-objects/career-score.vo";
import { EmployabilityScore } from "../value-objects/employability-score.vo";
import {
  CareerProfileUpdated,
  CareerArchetypeUnlocked,
  PredictionSnapshotCreated,
  CareerInsightsGenerated
} from "../events/career-events";

export interface CareerProfileProps {
  userId: string;
  employabilityScore: EmployabilityScore;
  communicationScore: CareerScore;
  confidenceScore: CareerScore;
  technicalScore: CareerScore;
  leadershipScore: CareerScore;
  stressResistance?: number;
  clarityTrend?: number;
  confidenceTrend?: number;
  ownershipTrend?: number;
  careerDNA?: Record<string, any>;
  unlockedPersonas: string[];
  updatedAt: Date;
}

export class CareerProfileAggregate extends AggregateRoot {
  public readonly id: string;
  public props: CareerProfileProps;
  private readonly clock: Clock;

  private constructor(id: string, props: CareerProfileProps, clock: Clock) {
    super();
    this.id = id;
    this.props = props;
    this.clock = clock;
  }

  // Factories

  public static create(id: string, userId: string, clock: Clock): CareerProfileAggregate {
    const aggregate = new CareerProfileAggregate(id, {
      userId,
      employabilityScore: EmployabilityScore.create(0),
      communicationScore: CareerScore.create(0),
      confidenceScore: CareerScore.create(0),
      technicalScore: CareerScore.create(0),
      leadershipScore: CareerScore.create(0),
      unlockedPersonas: [],
      updatedAt: clock.now(),
    }, clock);

    return aggregate;
  }

  public static load(id: string, props: CareerProfileProps, clock: Clock): CareerProfileAggregate {
    return new CareerProfileAggregate(id, props, clock);
  }

  // Getters

  public get userId(): string { return this.props.userId; }
  public get employabilityScore(): EmployabilityScore { return this.props.employabilityScore; }
  public get communicationScore(): CareerScore { return this.props.communicationScore; }
  public get confidenceScore(): CareerScore { return this.props.confidenceScore; }
  public get technicalScore(): CareerScore { return this.props.technicalScore; }
  public get leadershipScore(): CareerScore { return this.props.leadershipScore; }
  public get unlockedPersonas(): string[] { return this.props.unlockedPersonas; }

  // Business Methods

  public updateScores(scores: {
    employability: EmployabilityScore;
    communication: CareerScore;
    confidence: CareerScore;
    technical: CareerScore;
    leadership: CareerScore;
  }): void {
    this.props.employabilityScore = scores.employability;
    this.props.communicationScore = scores.communication;
    this.props.confidenceScore = scores.confidence;
    this.props.technicalScore = scores.technical;
    this.props.leadershipScore = scores.leadership;
    this.props.updatedAt = this.clock.now();

    this.recordEvent(new CareerProfileUpdated(this.id, {
      userId: this.props.userId,
      employabilityScore: this.props.employabilityScore.value,
      communicationScore: this.props.communicationScore.value,
      confidenceScore: this.props.confidenceScore.value,
      technicalScore: this.props.technicalScore.value,
      leadershipScore: this.props.leadershipScore.value,
    }));
  }

  public unlockArchetype(archetypeId: string): void {
    if (!this.props.unlockedPersonas.includes(archetypeId)) {
      this.props.unlockedPersonas.push(archetypeId);
      this.props.updatedAt = this.clock.now();

      this.recordEvent(new CareerArchetypeUnlocked(this.id, {
        userId: this.props.userId,
        archetypeId,
      }));
    }
  }

  public attachPrediction(sessionId: string, predictionId: string): void {
    this.recordEvent(new PredictionSnapshotCreated(this.id, {
      userId: this.props.userId,
      sessionId,
      predictionId,
    }));
  }

  public generateInsights(): void {
    // Possibly updates careerDNA or other props
    this.props.updatedAt = this.clock.now();
    
    this.recordEvent(new CareerInsightsGenerated(this.id, {
      userId: this.props.userId,
    }));
  }
}
