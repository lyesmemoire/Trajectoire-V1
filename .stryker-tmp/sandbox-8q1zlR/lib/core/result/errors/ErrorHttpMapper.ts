// @ts-nocheck
import { DomainError } from "./DomainError";

/**
 * Centralized mapping from DomainError codes to HTTP status codes.
 * 
 * Used by Presenters and API handlers to translate Result failures
 * into consistent HTTP responses without scattering status code logic
 * across individual routes.
 * 
 * Usage:
 * ```ts
 * const status = ErrorHttpMapper.toHttpStatus(error);
 * return NextResponse.json({ error: error.message }, { status });
 * ```
 */
export class ErrorHttpMapper {
  private static readonly codeToStatus: Record<string, number> = {
    VALIDATION_ERROR: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    RATE_LIMIT_EXCEEDED: 429,
    BUSINESS_RULE_VIOLATION: 422,
    CONCURRENCY_ERROR: 409,
    APPLICATION_ERROR: 500,
    INFRASTRUCTURE_ERROR: 500,
  };

  /**
   * Maps a DomainError to an HTTP status code.
   * Returns 500 for unknown error codes.
   */
  static toHttpStatus(error: DomainError): number {
    return this.codeToStatus[error.code] ?? 500;
  }

  /**
   * Formats a DomainError into a standard API error response body.
   */
  static toResponseBody(error: DomainError): {
    error: string;
    code: string;
    metadata?: Record<string, unknown>;
  } {
    return {
      error: error.message,
      code: error.code,
      ...(error.metadata ? { metadata: error.metadata } : {}),
    };
  }

  /**
   * Convenience: returns both status and body in one call.
   */
  static toHttpResponse(error: DomainError): {
    status: number;
    body: { error: string; code: string; metadata?: Record<string, unknown> };
  } {
    return {
      status: this.toHttpStatus(error),
      body: this.toResponseBody(error),
    };
  }
}
