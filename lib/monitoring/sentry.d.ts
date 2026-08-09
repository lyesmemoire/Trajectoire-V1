import * as Sentry from "@sentry/nextjs";
/**
 * Capture AI specific errors with context.
 */
export declare function captureAIError(error: unknown, context?: Record<string, _unknown>): void;
/**
 * Sanitize event data before sending to Sentry.
 */
export declare function sanitizeSensitiveData(event: Sentry.Event): Sentry.Event;
//# sourceMappingURL=sentry.d.ts.map