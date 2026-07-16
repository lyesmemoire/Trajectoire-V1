// @ts-nocheck
import { Repository } from "@/lib/core/infrastructure/base/Repository";
import { InterviewSessionAggregate } from "../domain/aggregates/interview-session.aggregate";
import { Result } from "@/lib/core/result";

export interface InterviewRepositoryPort extends Repository<InterviewSessionAggregate, string> {
  findActiveByUserId(userId: string): Promise<Result<InterviewSessionAggregate | null>>;
  findByCorrelationId(correlationId: string): Promise<Result<InterviewSessionAggregate | null>>;
}
