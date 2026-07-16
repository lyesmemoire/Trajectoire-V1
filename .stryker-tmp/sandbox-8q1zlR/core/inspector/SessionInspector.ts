/**
 * Session Inspector
 *
 * Passive inspector for Session state.
 * Read-only access to Session internal state.
 */
// @ts-nocheck


import { SessionState } from "./types";

export class SessionInspector {
  /**
   * Get current Session state
   * Read-only access to Session state
   */
  getSessionState(): SessionState {
    return {
      active: false,
      sessionId: null,
      duration: 0,
      messageCount: 0,
      interruptionCount: 0,
      status: "idle",
      startTime: null,
      endTime: null,
    };
  }

  /**
   * Get active session ID
   * Read-only access to session ID
   */
  getSessionId(): string | null {
    const state = this.getSessionState();
    return state.sessionId;
  }

  /**
   * Get session duration
   * Read-only access to session duration
   */
  getSessionDuration(): number {
    const state = this.getSessionState();
    return state.duration;
  }

  /**
   * Get message count
   * Read-only access to message count
   */
  getMessageCount(): number {
    const state = this.getSessionState();
    return state.messageCount;
  }

  /**
   * Get interruption count
   * Read-only access to interruption count
   */
  getInterruptionCount(): number {
    const state = this.getSessionState();
    return state.interruptionCount;
  }

  /**
   * Get Session state summary
   * Read-only summary of Session state
   */
  getStateSummary(): string {
    const state = this.getSessionState();
    return `Session: ${state.sessionId || "None"} | Active: ${state.active} | Messages: ${state.messageCount} | Interruptions: ${state.interruptionCount}`;
  }
}
