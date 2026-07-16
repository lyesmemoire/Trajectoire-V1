/**
 * Session Restore Error
 *
 * Error types for session restore operations.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY error definitions.
 */

// ============================================================================
// SESSION RESTORE ERROR TYPES
// ============================================================================

export enum SessionRestoreErrorType {
  SNAPSHOT_NOT_FOUND = "snapshot_not_found",
  SNAPSHOT_CORRUPTED = "snapshot_corrupted",
  SNAPSHOT_INVALID = "snapshot_invalid",
  VERSION_MISMATCH = "version_mismatch",
  DATA_INCOMPLETE = "data_incomplete",
  UNKNOWN = "unknown",
}

// ============================================================================
// SESSION RESTORE ERROR
// ============================================================================

export class SessionRestoreError extends Error {
  public readonly type: SessionRestoreErrorType;
  public readonly recoverable: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    type: SessionRestoreErrorType,
    message: string,
    recoverable: boolean = false,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "SessionRestoreError";
    this.type = type;
    this.recoverable = recoverable;
    this.details = details;
    Object.setPrototypeOf(this, SessionRestoreError.prototype);
  }

  static snapshotNotFound(
    sessionId: string,
    details?: Record<string, unknown>,
  ): SessionRestoreError {
    return new SessionRestoreError(
      SessionRestoreErrorType.SNAPSHOT_NOT_FOUND,
      `Snapshot not found for session: ${sessionId}`,
      false,
      details,
    );
  }

  static snapshotCorrupted(
    sessionId: string,
    details?: Record<string, unknown>,
  ): SessionRestoreError {
    return new SessionRestoreError(
      SessionRestoreErrorType.SNAPSHOT_CORRUPTED,
      `Snapshot corrupted for session: ${sessionId}`,
      false,
      details,
    );
  }

  static snapshotInvalid(
    sessionId: string,
    details?: Record<string, unknown>,
  ): SessionRestoreError {
    return new SessionRestoreError(
      SessionRestoreErrorType.SNAPSHOT_INVALID,
      `Snapshot invalid for session: ${sessionId}`,
      false,
      details,
    );
  }

  static versionMismatch(
    expected: string,
    actual: string,
    details?: Record<string, unknown>,
  ): SessionRestoreError {
    return new SessionRestoreError(
      SessionRestoreErrorType.VERSION_MISMATCH,
      `Version mismatch: expected ${expected}, got ${actual}`,
      false,
      details,
    );
  }

  static dataIncomplete(
    sessionId: string,
    details?: Record<string, unknown>,
  ): SessionRestoreError {
    return new SessionRestoreError(
      SessionRestoreErrorType.DATA_INCOMPLETE,
      `Data incomplete for session: ${sessionId}`,
      false,
      details,
    );
  }

  static unknown(
    message: string,
    details?: Record<string, unknown>,
  ): SessionRestoreError {
    return new SessionRestoreError(
      SessionRestoreErrorType.UNKNOWN,
      message,
      false,
      details,
    );
  }
}
