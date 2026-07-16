import { Result } from "../../../../lib/core/result";
import { JourneyAggregate } from "../../domain/aggregates/journey.aggregate";

export interface JourneyRepositoryPort {
  save(journey: JourneyAggregate): Promise<Result<void>>;
  findById(id: string): Promise<Result<JourneyAggregate>>;
  findByUserId(userId: string): Promise<Result<JourneyAggregate[]>>;
  delete(id: string): Promise<Result<void>>;
}
