/**
 * Session Persistence Service
 *
 * Orchestrates session persistence operations.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY persistence coordination.
 */

import { SessionSnapshot } from "../types";
import { DiagnosticCollector } from "../../diagnostics/DiagnosticCollector";
import { RetryPolicy } from "../policies/RetryPolicy";

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
  getPersistenceStatus(
    sessionId: string,
  ): Promise<import("../types").PersistenceStatus>;
}

// ============================================================================
// SESSION PERSISTENCE SERVICE INTERFACE
// ============================================================================

export interface SessionPersistenceService {
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
  getPersistenceStatus(
    sessionId: string,
  ): Promise<import("../types").PersistenceStatus>;
}

// ============================================================================
// SESSION PERSISTENCE SERVICE IMPLEMENTATION
// ============================================================================

export class SessionPersistenceServiceImpl implements SessionPersistenceService {
  private persistence: SessionPersistence;
  private diagnosticCollector: DiagnosticCollector;
  private retryPolicy: RetryPolicy;

  constructor(
    persistence: SessionPersistence,
    diagnosticCollector: DiagnosticCollector,
    retryPolicy: RetryPolicy,
  ) {
    this.persistence = persistence;
    this.diagnosticCollector = diagnosticCollector;
    this.retryPolicy = retryPolicy;
  }

  async saveSession(snapshot: SessionSnapshot): Promise<string> {
    const startTime = Date.now();

    try {
      const sessionId = await this.retryPolicy.execute(() =>
        this.persistence.saveSession(snapshot),
      );
      this.recordPersistenceEvent(
        "save",
        snapshot.sessionId,
        Date.now() - startTime,
        true,
      );
      return sessionId;
    } catch (error) {
      this.recordPersistenceEvent(
        "save",
        snapshot.sessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
      return snapshot.sessionId;
    }
  }

  async updateSession(snapshot: SessionSnapshot): Promise<void> {
    const startTime = Date.now();

    try {
      await this.retryPolicy.execute(() =>
        this.persistence.updateSession(snapshot),
      );
      this.recordPersistenceEvent(
        "update",
        snapshot.sessionId,
        Date.now() - startTime,
        true,
      );
    } catch (error) {
      this.recordPersistenceEvent(
        "update",
        snapshot.sessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
    }
  }

  async closeSession(snapshot: SessionSnapshot): Promise<void> {
    const startTime = Date.now();

    try {
      await this.retryPolicy.execute(() =>
        this.persistence.closeSession(snapshot),
      );
      this.recordPersistenceEvent(
        "close",
        snapshot.sessionId,
        Date.now() - startTime,
        true,
      );
    } catch (error) {
      this.recordPersistenceEvent(
        "close",
        snapshot.sessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
    }
  }

  async restoreSession(sessionId: string): Promise<SessionSnapshot | null> {
    const startTime = Date.now();

    try {
      const snapshot = await this.retryPolicy.execute(() =>
        this.persistence.restoreSession(sessionId),
      );
      if (snapshot) {
        this.recordPersistenceEvent(
          "restore",
          sessionId,
          Date.now() - startTime,
          true,
        );
      }
      return snapshot;
    } catch (error) {
      this.recordPersistenceEvent(
        "restore",
        sessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
      return null;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    const startTime = Date.now();

    try {
      await this.retryPolicy.execute(() =>
        this.persistence.deleteSession(sessionId),
      );
      this.recordPersistenceEvent(
        "delete",
        sessionId,
        Date.now() - startTime,
        true,
      );
    } catch (error) {
      this.recordPersistenceEvent(
        "delete",
        sessionId,
        Date.now() - startTime,
        false,
        error as Error,
      );
    }
  }

  async getPersistenceStatus(
    sessionId: string,
  ): Promise<import("../types").PersistenceStatus> {
    return this.persistence.getPersistenceStatus(sessionId);
  }

  private recordPersistenceEvent(
    operation: string,
    sessionId: string,
    duration: number,
    success: boolean,
    error?: Error,
  ): void {
    this.diagnosticCollector
      .getEventRecorder()
      .recordEvent("session", "PersistenceOperation", {
        operation,
        sessionId,
        duration,
        success,
        error: error
          ? {
              message: error.message,
              name: error.name,
            }
          : undefined,
      });
  }
}
