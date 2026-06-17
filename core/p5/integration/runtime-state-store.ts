import { ExecutionSession } from "./execution-session";

/**
 * Minimal in-memory session store.
 *
 * No disk. No database. No network. No Redis.
 * Exists to manage session lifecycle for runtime integration.
 */
export class RuntimeStateStore {
  private readonly sessions = new Map<string, ExecutionSession>();

  /** Store or update a session. */
  setSession(sessionId: string, session: ExecutionSession): void {
    this.sessions.set(sessionId, session);
  }

  /** Retrieve a session by ID. Returns undefined if not found. */
  getSession(sessionId: string): ExecutionSession | undefined {
    return this.sessions.get(sessionId);
  }

  /** Delete a session. Returns true if it existed. */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /** Remove all sessions. */
  clear(): void {
    this.sessions.clear();
  }

  /** Number of active sessions. */
  get size(): number {
    return this.sessions.size;
  }
}
