/**
 * Session Restore Service
 *
 * Restores session snapshots without starting the Runtime.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY restore operations.
 */

import { SessionSnapshot } from "../types";
import { SessionRestoreError } from "../errors/SessionRestoreError";
import { SessionSnapshotMapper } from "../mappers/SessionSnapshotMapper";

// ============================================================================
// SESSION RESTORE SERVICE INTERFACE
// ============================================================================

export interface SessionRestoreService {
  /**
   * Restore a session snapshot
   */
  restore(sessionId: string): Promise<SessionSnapshot>;

  /**
   * Validate a session snapshot
   */
  validate(snapshot: SessionSnapshot): Promise<boolean>;

  /**
   * Check if a snapshot can be restored
   */
  canRestore(sessionId: string): Promise<boolean>;
}

// ============================================================================
// SESSION RESTORE SERVICE IMPLEMENTATION
// ============================================================================

export class SessionRestoreServiceImpl implements SessionRestoreService {
  private mapper: SessionSnapshotMapper;
  private loadSnapshot: (sessionId: string) => Promise<SessionSnapshot | null>;

  constructor(
    mapper: SessionSnapshotMapper,
    loadSnapshot: (sessionId: string) => Promise<SessionSnapshot | null>,
  ) {
    this.mapper = mapper;
    this.loadSnapshot = loadSnapshot;
  }

  async restore(sessionId: string): Promise<SessionSnapshot> {
    const snapshot = await this.loadSnapshot(sessionId);

    if (!snapshot) {
      throw SessionRestoreError.snapshotNotFound(sessionId);
    }

    const isValid = await this.validate(snapshot);
    if (!isValid) {
      throw SessionRestoreError.snapshotInvalid(sessionId);
    }

    return snapshot;
  }

  async validate(snapshot: SessionSnapshot): Promise<boolean> {
    // Validate required fields
    if (!snapshot.sessionId) {
      return false;
    }

    if (!snapshot.startedAt) {
      return false;
    }

    if (!snapshot.runtimeState) {
      return false;
    }

    if (!snapshot.providerState) {
      return false;
    }

    // Validate structure
    if (!Array.isArray(snapshot.timeline)) {
      return false;
    }

    if (!Array.isArray(snapshot.correlationIds)) {
      return false;
    }

    if (!Array.isArray(snapshot.errors)) {
      return false;
    }

    if (!Array.isArray(snapshot.events)) {
      return false;
    }

    // Validate metadata
    if (!snapshot.metadata) {
      return false;
    }

    return true;
  }

  async canRestore(sessionId: string): Promise<boolean> {
    try {
      const snapshot = await this.loadSnapshot(sessionId);
      return snapshot !== null && (await this.validate(snapshot));
    } catch {
      return false;
    }
  }
}
