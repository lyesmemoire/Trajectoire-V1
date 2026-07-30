/**
 * Privacy Layer for Analytics
 * Filters out PII (Personally Identifiable Information) before sending to PostHog/GA4.
 */

const ALLOWED_PROPERTIES = [
  "event_name",
  "timestamp",
  "duration_ms",
  "status",
  "score",
  "type",
  "method",
  "card_type",
  "archetype",
  "percentile",
  "interruption_count",
  "recovery_count",
  "latency_ms",
  "is_mobile",
  "plan_id",
];

/**
 * Scrubs any property not explicitly whitelisted.
 */
export function sanitizeAnalyticsPayload(properties: Record<string, unknown>, ): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const key of Object.keys(properties)) {
    if (ALLOWED_PROPERTIES.includes(key)) {
      sanitized[key] = properties[key];
    }
  }

  return sanitized;
}
