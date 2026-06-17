// apps/realtime-gateway/src/interview/runtime/fsm/policies/RetryPolicy.ts

/**
 * Maximum number of attempts for a retryable event.
 * Pure deterministic constant – no side‑effects.
 */
export const DEFAULT_MAX_ATTEMPTS = 3;

/**
 * Pure, synchronous retry policy.
 * Returns the attempt count (starting at 1) and whether another retry is allowed.
 */
export class RetryPolicy {
  static apply(event: any, _transitionId: string) {
    // The event may carry an optional meta.attempt count; default to 0.
    const previousAttempts = typeof event?.meta?.attempt === "number" ? event.meta.attempt : 0;
    const attempts = previousAttempts + 1;
    const shouldRetry = attempts < DEFAULT_MAX_ATTEMPTS;
    return { attempts, shouldRetry };
  }
}
