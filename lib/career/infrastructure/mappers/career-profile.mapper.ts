import { Mapper } from "@/lib/core/infrastructure/base/Mapper";
import { CareerProfileAggregate } from "../../domain/aggregates/career-profile.aggregate";
import { CareerScore } from "../../domain/value-objects/career-score.vo";
import { EmployabilityScore } from "../../domain/value-objects/employability-score.vo";
import { CareerProfile } from "@prisma/client";
import { Clock } from "@/lib/core/clock/Clock";

export class CareerProfileMapper implements Mapper<CareerProfile, CareerProfileAggregate> {
  constructor(private readonly clock: Clock) {}

  toDomain(raw: CareerProfile): CareerProfileAggregate {
    return CareerProfileAggregate.load(raw.id, {
      userId: raw.userId,
      employabilityScore: EmployabilityScore.create(raw.employabilityScore),
      communicationScore: CareerScore.create(raw.communicationScore || 0),
      confidenceScore: CareerScore.create(raw.confidenceTrend || 0), // Mapping as defined in original repo
      technicalScore: CareerScore.create(0), // not mapped natively in original schema
      leadershipScore: CareerScore.create(raw.leadershipScore || 0),
      stressResistance: raw.stressResistance || undefined,
      clarityTrend: raw.clarityTrend || undefined,
      confidenceTrend: raw.confidenceTrend || undefined,
      ownershipTrend: raw.ownershipTrend || undefined,
      careerDNA: raw.careerDNA ? JSON.parse(JSON.stringify(raw.careerDNA)) : undefined,
      unlockedPersonas: raw.unlockedPersonas,
      updatedAt: raw.updatedAt,
    }, this.clock);
  }

  toPersistence(domain: CareerProfileAggregate): CareerProfile {
    return {
      id: domain.id,
      userId: domain.userId,
      employabilityScore: domain.employabilityScore.value,
      communicationScore: domain.communicationScore.value,
      confidenceTrend: domain.confidenceScore.value, // Used for confidenceScore
      leadershipScore: domain.leadershipScore.value,
      stressResistance: domain.props.stressResistance || null,
      clarityTrend: domain.props.clarityTrend || null,
      ownershipTrend: domain.props.ownershipTrend || null,
      careerDNA: domain.props.careerDNA ? JSON.parse(JSON.stringify(domain.props.careerDNA)) : null,
      unlockedPersonas: domain.unlockedPersonas,
      updatedAt: domain.props.updatedAt,
    };
  }
}
