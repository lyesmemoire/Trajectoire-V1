import { Result } from "@/lib/core/result";
import { CareerProfileAggregate } from "../domain/aggregates/career-profile.aggregate";
import { Repository } from "@/lib/core/infrastructure/base/Repository";

export interface CareerRepositoryPort extends Repository<CareerProfileAggregate, string> {
  findByUserId(userId: string): Promise<Result<CareerProfileAggregate | null>>;
}
