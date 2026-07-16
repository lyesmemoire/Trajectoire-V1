/**
 * Persistence Error
 *
 * Error types for persistence operations.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY error definitions.
 */

// ============================================================================
// PERSISTENCE ERROR TYPES
// ============================================================================

export enum PersistenceErrorType {
  CONNECTION = "connection",
  TIMEOUT = "timeout",
  NOT_FOUND = "not_found",
  VALIDATION = "validation",
  DATABASE = "database",
  CONFLICT = "conflict",
  CORRUPTION = "corruption",
  UNKNOWN = "unknown",
}

// ============================================================================
// PERSISTENCE ERROR
// ============================================================================

export class PersistenceError extends Error {
  public readonly type: PersistenceErrorType;
  public readonly recoverable: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    type: PersistenceErrorType,
    message: string,
    recoverable: boolean = true,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "PersistenceError";
    this.type = type;
    this.recoverable = recoverable;
    this.details = details;
    Object.setPrototypeOf(this, PersistenceError.prototype);
  }

  static connection(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.CONNECTION,
      message,
      true,
      details,
    );
  }

  static timeout(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.TIMEOUT,
      message,
      true,
      details,
    );
  }

  static notFound(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.NOT_FOUND,
      message,
      false,
      details,
    );
  }

  static validation(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.VALIDATION,
      message,
      false,
      details,
    );
  }

  static database(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.DATABASE,
      message,
      true,
      details,
    );
  }

  static conflict(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.CONFLICT,
      message,
      true,
      details,
    );
  }

  static corruption(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.CORRUPTION,
      message,
      false,
      details,
    );
  }

  static unknown(
    message: string,
    details?: Record<string, unknown>,
  ): PersistenceError {
    return new PersistenceError(
      PersistenceErrorType.UNKNOWN,
      message,
      true,
      details,
    );
  }
}
