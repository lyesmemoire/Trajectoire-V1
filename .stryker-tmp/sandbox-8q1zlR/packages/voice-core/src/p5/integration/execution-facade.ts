// @ts-nocheck
import { MindState } from "../execution-contract.js";
import { RuntimeDecision, ExecutionResult } from "./integration-contract.js";
import { createSession, executeDecision } from "./execution-session.js";
import { RuntimeStateStore } from "./runtime-state-store.js";

/**
 * High-level facade for the P5 execution engine.
 *
 * Provides a single entry point for runtime consumers:
 *   initSession → execute → execute → ... → destroySession
 *
 * All state management, journaling, timeline, and transactions
 * are handled internally.
 */
export class ExecutionFacade {
  private readonly store = new RuntimeStateStore();

  /** Initialize a new execution session with the given initial state. */
  initSession(sessionId: string, initialState: MindState, timestamp: number): void {
    const session = createSession(initialState, timestamp);
    this.store.setSession(sessionId, session);
  }

  private commitListener?: (event: { sessionId: string; snapshotHash: string; journalPointer: string }) => void;

  public onCommit(listener: (event: { sessionId: string; snapshotHash: string; journalPointer: string }) => void): void {
    this.commitListener = listener;
  }

  /**
   * Execute a decision within a session.
   *
   * Returns the ExecutionResult on success, or null if:
   * - The session does not exist.
   * - The decision is invalid.
   */
  execute(
    sessionId: string,
    decision: RuntimeDecision,
    timestamp: number,
  ): ExecutionResult | null {
    const session = this.store.getSession(sessionId);
    if (!session) return null;

    const { session: nextSession, result } = executeDecision(session, decision, timestamp);
    this.store.setSession(sessionId, nextSession);

    if (this.commitListener) {
      this.commitListener({
        sessionId,
        snapshotHash: nextSession.initialSnapshot?.id || "snapshot-0", // TODO: proper snapshot hash later
        journalPointer: nextSession.journal.entries.length.toString(),
      });
    }

    return result;
  }

  /** Get the current state of a session. */
  getState(sessionId: string): MindState | undefined {
    return this.store.getSession(sessionId)?.state;
  }

  /** Get the full session (state + journal + timeline). */
  getSession(sessionId: string) {
    return this.store.getSession(sessionId);
  }

  /** Destroy a session. */
  destroySession(sessionId: string): boolean {
    return this.store.deleteSession(sessionId);
  }

  /** Number of active sessions. */
  get activeSessions(): number {
    return this.store.size;
  }
}
