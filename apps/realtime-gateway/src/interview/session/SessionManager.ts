// apps/realtime-gateway/src/interview/session/SessionManager.ts

import type { InterviewRepository } from "../storage/InterviewRepository";
import type { InterviewState } from "../models/InterviewState";
import type { InterviewEvent } from "../models/InterviewEvent";
import { createHash } from "crypto";

export class SessionManager {
  private readonly locks = new Map<string, Promise<void>>();

  constructor(
    private readonly interviewRepo: InterviewRepository,
    // private readonly profileRepo: ProfileRepository,
    // private readonly policyEngine: InterviewPolicyEngine
  ) {}

  private async withLock<T>(
    sessionId: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const existingLock = this.locks.get(sessionId) || Promise.resolve();

    let releaseLock: () => void;
    const newLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    // Chain the new lock
    this.locks.set(
      sessionId,
      existingLock.then(() => newLock),
    );

    try {
      await existingLock;
      return await fn();
    } finally {
      releaseLock!();
      // Clean up the lock map if no one else is waiting
      if (this.locks.get(sessionId) === newLock) {
        this.locks.delete(sessionId);
      }
    }
  }

  async createSession(state: InterviewState): Promise<void> {
    await this.withLock(state.sessionId, async () => {
      const exists = await this.interviewRepo.exists(state.sessionId);
      if (exists) throw new Error(`Session ${state.sessionId} already exists`);
      await this.interviewRepo.create(state);
    });
  }

  async getSession(sessionId: string): Promise<InterviewState | null> {
    // getSession might not need a lock if it's just a read, but locking ensures we don't read mid-update
    return this.withLock(sessionId, async () => {
      return this.interviewRepo.findById(sessionId);
    });
  }

  async updateSession(
    sessionId: string,
    updaterFn: (current: InterviewState) => InterviewState,
  ): Promise<void> {
    await this.withLock(sessionId, async () => {
      const state = await this.interviewRepo.findById(sessionId);
      if (!state) throw new Error(`Session ${sessionId} not found`);

      const updatedState = updaterFn(state);
      await this.interviewRepo.update(updatedState);
    });
  }

  async appendEvent(sessionId: string, event: InterviewEvent): Promise<void> {
    await this.updateSession(sessionId, (state) => {
      return {
        ...state,
        events: [...state.events, event],
      };
    });
  }

  async destroySession(sessionId: string): Promise<void> {
    await this.withLock(sessionId, async () => {
      await this.interviewRepo.delete(sessionId);
    });
  }

  async expireSession(sessionId: string): Promise<void> {
    await this.updateSession(sessionId, (state) => {
      return {
        ...state,
        status: "expired",
      };
    });
  }

  async touchSession(sessionId: string, newExpiresAt: number): Promise<void> {
    await this.updateSession(sessionId, (state) => {
      return {
        ...state,
        expiresAt: newExpiresAt,
      };
    });
  }

  // Utility for question hashing
  static generateQuestionHash(
    topic: string,
    type: string,
    difficulty: string,
    question: string,
  ): string {
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[.,!?]/g, "");
    const combined = `${normalize(topic)}${normalize(type)}${normalize(difficulty)}${normalize(question)}`;
    return createHash("sha256").update(combined).digest("hex");
  }
}
