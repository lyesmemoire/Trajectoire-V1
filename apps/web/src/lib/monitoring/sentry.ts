import * as Sentry from "@sentry/nextjs";
import { logError } from "@/lib/logger/Logger";

/**
 * Capture AI specific errors with context.
 */
export function captureAIError(error: unknown, context?: Record<string, any>) {
  logError("[AI Error Captured]", { error, context });
  Sentry.captureException(error, {
    tags: { system: "ai" },
    extra: context,
  });
}

/**
 * Sanitize event data before sending to Sentry.
 */
export function sanitizeSensitiveData(event: Sentry.Event) {
  // Logic to remove PII or secrets
  return event;
}
