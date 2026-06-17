// apps/realtime-gateway/src/interview/storage/InMemoryProfileRepository.ts

import type { ProfileRepository } from "./ProfileRepository";
import type { CandidateProfile } from "../models/CandidateProfile";
import type { JobProfile } from "../models/JobProfile";

/** In‑memory implementation of ProfileRepository. */
export class InMemoryProfileRepository implements ProfileRepository {
  private candidateMap = new Map<string, CandidateProfile>();
  private jobMap = new Map<string, JobProfile>();

  async saveCandidateProfile(profile: CandidateProfile): Promise<void> {
    this.candidateMap.set(profile.id, profile);
  }

  async findCandidateById(id: string): Promise<CandidateProfile | null> {
    return this.candidateMap.get(id) ?? null;
  }

  async saveJobProfile(job: JobProfile): Promise<void> {
    this.jobMap.set(job.id, job);
  }

  async findJobById(id: string): Promise<JobProfile | null> {
    return this.jobMap.get(id) ?? null;
  }
}
