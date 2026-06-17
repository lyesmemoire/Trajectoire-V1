// apps/realtime-gateway/src/interview/storage/InMemoryInterviewRepository.ts

import type { InterviewRepository } from "./InterviewRepository";
import type { InterviewState } from "../models/InterviewState";

/** In‑memory implementation of InterviewRepository. */
export class InMemoryInterviewRepository implements InterviewRepository {
  private store = new Map<string, InterviewState>();

  async create(state: InterviewState): Promise<void> {
    this.store.set(state.sessionId, state);
  }

  async findById(id: string): Promise<InterviewState | null> {
    return this.store.get(id) ?? null;
  }

  async update(state: InterviewState): Promise<void> {
    // Overwrite existing entry; if not present, treat as create.
    this.store.set(state.sessionId, state);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.store.has(id);
  }

  async findExpiredSessions(currentTimeMs: number): Promise<InterviewState[]> {
    const expired: InterviewState[] = [];
    for (const state of this.store.values()) {
      if (state.expiresAt && state.expiresAt < currentTimeMs) {
        expired.push(state);
      }
    }
    return expired;
  }

  async cleanupExpiredSessions(currentTimeMs: number): Promise<void> {
    for (const [id, state] of this.store.entries()) {
      if (state.expiresAt && state.expiresAt < currentTimeMs) {
        this.store.delete(id);
      }
    }
  }
}
