import { CareerPipelineStep, CareerPipelineContext } from "../career-pipeline";
import { CareerRepositoryPort } from "../../../../ports/career-repository.port";
import { CareerProfileAggregate } from "../../../../domain/aggregates/career-profile.aggregate";
import { CareerScore } from "../../../../domain/value-objects/career-score.vo";
import { EmployabilityScore } from "../../../../domain/value-objects/employability-score.vo";
import { IdGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";

export class LoadCareerProfileStep implements CareerPipelineStep {
  constructor(
    private readonly repository: CareerRepositoryPort,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock
  ) {}

  async execute(context: CareerPipelineContext): Promise<CareerPipelineContext> {
    const result = await this.repository.findByUserId(context.userId);
    let profile = result.isSuccess() ? result.unwrap() : null;

    if (!profile) {
      profile = CareerProfileAggregate.create(this.idGenerator.generate(), context.userId, this.clock);
    }

    // Prepare scores update
    const iv = context.dto.interviewAnalysis;
    const communicationScore = CareerScore.create(iv.communicationScore ?? profile.communicationScore.value);
    const confidenceScore = CareerScore.create(iv.confidenceScore ?? profile.confidenceScore.value);
    const technicalScore = CareerScore.create(iv.technicalScore ?? profile.technicalScore.value);
    const leadershipScore = CareerScore.create(iv.leadershipScore ?? profile.leadershipScore.value);

    const newEmployabilityRaw = (
      communicationScore.value +
      confidenceScore.value +
      technicalScore.value +
      leadershipScore.value
    ) / 4;
    const employabilityScore = EmployabilityScore.create(newEmployabilityRaw);

    // Call domain method
    profile.updateScores({
      employability: employabilityScore,
      communication: communicationScore,
      confidence: confidenceScore,
      technical: technicalScore,
      leadership: leadershipScore,
    });

    return {
      ...context,
      profile,
    };
  }
}
