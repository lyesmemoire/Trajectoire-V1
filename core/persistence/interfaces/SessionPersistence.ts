/**
 * Session Persistence Interface
 *
 * Abstracts session persistence operations.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY persistence operations.
 */

import { SessionSnapshot } from "../types";
import { PersistenceError } from "../errors/PersistenceError";
import { PersistenceStatus } from "../types";

// ============================================================================
// SESSION PERSISTENCE INTERFACE
// ============================================================================

export interface SessionPersistence {
  /**
   * Save a new session snapshot
   */
  saveSession(snapshot: SessionSnapshot): Promise<string>;

  /**
   * Update an existing session snapshot
   */
  updateSession(snapshot: SessionSnapshot): Promise<void>;

  /**
   * Close a session (final snapshot)
   */
  closeSession(snapshot: SessionSnapshot): Promise<void>;

  /**
   * Restore a session snapshot
   */
  restoreSession(sessionId: string): Promise<SessionSnapshot | null>;

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): Promise<void>;

  /**
   * Get persistence status
   */
  getPersistenceStatus(sessionId: string): Promise<PersistenceStatus>;
}

// ============================================================================
// SESSION PERSISTENCE ERROR HANDLER
// ============================================================================

export interface SessionPersistenceErrorHandler {
  /**
   * Handle persistence errors
   */
  handleError(error: PersistenceError): void;
}
