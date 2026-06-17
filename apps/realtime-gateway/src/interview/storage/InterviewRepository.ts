// apps/realtime-gateway/src/interview/storage/InterviewRepository.ts

import type { InterviewState } from "../models/InterviewState";

/**
 * Repository for persisting InterviewState objects.
 * In‑memory implementation is provided, but the interface allows
 * future DB (Supabase, Postgres) integration without changing callers.
 */
export interface InterviewRepository {
  /** Create a new interview session */
  create(state: InterviewState): Promise<void>;

  /** Retrieve a session by its id */
  findById(id: string): Promise<InterviewState | null>;

  /** Update an existing interview session */
  update(state: InterviewState): Promise<void>;

  /** Delete a session (e.g., after expiration) */
  delete(id: string): Promise<void>;

  /** Check if a session exists */
  exists(id: string): Promise<boolean>;

  /** Find sessions that have expired based on current time */
  findExpiredSessions(currentTimeMs: number): Promise<InterviewState[]>;

  /** Cleanup expired sessions from the store */
  cleanupExpiredSessions(currentTimeMs: number): Promise<void>;
}
