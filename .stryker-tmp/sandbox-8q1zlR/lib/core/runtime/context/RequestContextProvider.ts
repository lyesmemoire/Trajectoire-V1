// @ts-nocheck
export interface RequestContextData {
  requestId: string;
  correlationId: string;
  causationId?: string;
  userId?: string;
  locale?: string;
  timezone?: string;
  tenantId?: string;
}

/**
 * Port for providing request context information.
 * This allows UseCases to receive context via dependency injection
 * instead of relying on static access, making them testable.
 */
export interface RequestContextProvider {
  /**
   * Returns the current request context, or null if none is active.
   */
  current(): RequestContextData | null;

  /**
   * Returns the current correlationId, or "unknown" if no context is active.
   */
  correlationId(): string;

  /**
   * Returns the current requestId, or "unknown" if no context is active.
   */
  requestId(): string;

  /**
   * Returns the current userId, or undefined if not authenticated.
   */
  userId(): string | undefined;
}
