import { Result } from "@/lib/core/result";
import { CVAggregate } from "../../domain/aggregates/cv.aggregate";

export interface CvRepositoryPort {
  findById(cvId: string): Promise<Result<CVAggregate>>;
  findByUserId(userId: string): Promise<Result<CVAggregate[]>>;
  save(aggregate: CVAggregate): Promise<Result<void>>;
  delete(cvId: string): Promise<Result<void>>;
}
