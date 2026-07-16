// @ts-nocheck
import type { InterviewSessionAggregate } from "../../domain/aggregates/InterviewSessionAggregate.js";
import type { SessionId, CandidateId } from "../../domain/types.js";

export interface InterviewSessionRepository {
  save(session: InterviewSessionAggregate): Promise<void>;
  findById(id: SessionId): Promise<InterviewSessionAggregate | null>;
  findActiveByCandidate(candidateId: CandidateId): Promise<InterviewSessionAggregate | null>;
  delete(id: SessionId): Promise<void>;
  exists(id: SessionId): Promise<boolean>;
}
