import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InterviewSession, SessionState } from '../common/session.types';

@Injectable()
export class SessionManager {
  private sessions = new Map<string, InterviewSession>();
  private readonly idleTimeoutMs = 10 * 60 * 1000; // 10 minutes

  /** Get existing session or create a new one */
  getOrCreate(sessionId?: string): InterviewSession {
    const id = sessionId ?? uuidv4();
    if (!this.sessions.has(id)) {
      const now = Date.now();
      const session: InterviewSession = {
        sessionId: id,
        createdAt: now,
        lastActivityAt: now,
        state: SessionState.IDLE,
      };
      this.sessions.set(id, session);
    }
    return this.sessions.get(id)!;
  }

  /** Update activity timestamp */
  touch(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivityAt = Date.now();
    }
  }

  /** Delete a session and cleanup abort controllers */
  delete(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.asrAbort?.abort();
      session.ttsAbort?.abort();
    }
    this.sessions.delete(sessionId);
  }

  /** Cleanup idle sessions */
  cleanupInactiveSessions() {
    const now = Date.now();
    for (const [id, sess] of this.sessions.entries()) {
      if (now - sess.lastActivityAt > this.idleTimeoutMs) {
        this.delete(id);
      }
    }
  }

  /** Start periodic cleanup */
  startCleanupTask() {
    setInterval(() => this.cleanupInactiveSessions(), 60_000);
  }
}
