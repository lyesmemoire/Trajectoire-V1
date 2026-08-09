/**
 * Prevents internal identifiers and sensitive data from leaking into client-side logs or analytics.
 */
export function scrubPayload(data) {
    if (!data)
        return data;
    const sensitiveKeys = [
        "email",
        "phone",
        "transcript",
        "cv_text",
        "extracted_text",
        "raw_response",
        "auth_token",
        "password",
    ];
    const scrubbed = JSON.parse(JSON.stringify(data));
    const recurse = (obj) => {
        for (const key in obj) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                obj[key] = "[REDACTED]";
            }
            else if (typeof obj[key] === "object") {
                recurse(obj[key]);
            }
        }
    };
    recurse(scrubbed);
    return scrubbed;
}
/**
 * Strips internal middleware headers before sending response.
 */
export function stripInternalHeaders(headers) {
    const internalHeaders = [
        "x-internal-route",
        "x-verified-user-id",
        "x-verified-user-email",
        "x-threat-score",
        "x-latency-id",
    ];
    internalHeaders.forEach((h) => headers.delete(h));
    return headers;
}
//# sourceMappingURL=request-scrubber.js.map