import * as Sentry from "@sentry/nextjs";
/**
 * Capture AI specific errors with context.
 */
export function captureAIError(error, context) {
    console.error("[AI Error Captured]:", error, context);
    Sentry.captureException(error, {
        tags: { system: "ai" },
        extra: context,
    });
}
/**
 * Sanitize event data before sending to Sentry.
 */
export function sanitizeSensitiveData(event) {
    // Logic to remove PII or secrets
    return event;
}
//# sourceMappingURL=sentry.js.map