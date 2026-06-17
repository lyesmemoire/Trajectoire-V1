// apps/realtime-gateway/src/interview/storage/ProfileRepository.ts

import type { CandidateProfile } from "../models/CandidateProfile";
import type { JobProfile } from "../models/JobProfile";

/**
 * Repository interface for persisting candidate and job profiles.
 * For now only an in‑memory implementation is required, but the
 * contract enables swapping to a DB (e.g., Supabase) later.
 */
export interface ProfileRepository {
  /** Save or update a candidate profile */
  saveCandidateProfile(profile: CandidateProfile): Promise<void>;

  /** Retrieve a candidate profile by its unique id */
  findCandidateById(id: string): Promise<CandidateProfile | null>;

  /** Save or update a job profile */
  saveJobProfile(job: JobProfile): Promise<void>;

  /** Retrieve a job profile by its unique id */
  findJobById(id: string): Promise<JobProfile | null>;
}
