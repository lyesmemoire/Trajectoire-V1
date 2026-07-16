// @ts-nocheck
import { CareerProfileAggregate } from "../domain/aggregates/career-profile.aggregate";

export interface InsightGeneratorPort {
  generateInsights(profile: CareerProfileAggregate): Promise<void>;
}
