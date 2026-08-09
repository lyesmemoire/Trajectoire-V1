/**
 * Privacy Layer for Analytics
 * Filters out PII (Personally Identifiable Information) before sending to PostHog/GA4.
 */
/**
 * Scrubs any property not explicitly whitelisted.
 */
export declare function sanitizeAnalyticsPayload(properties: Record<string, _unknown>): Record<string, unknown>;
//# sourceMappingURL=analytics-filter.d.ts.map