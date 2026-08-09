/**
 * Prevents internal identifiers and sensitive data from leaking into client-side logs or analytics.
 */
export declare function scrubPayload(data: unknown): unknown;
/**
 * Strips internal middleware headers before sending response.
 */
export declare function stripInternalHeaders(headers: Headers): Headers;
//# sourceMappingURL=request-scrubber.d.ts.map