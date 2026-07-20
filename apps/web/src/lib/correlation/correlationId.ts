/**
 * Correlation ID Management
 * Handles request ID generation and propagation across the application
 */

const CORRELATION_ID_HEADER = "x-request-id";
const CORRELATION_ID_CONTEXT_KEY = "correlationId";

/**
 * Generate a random UUID v4
 * Compatible with Edge Runtime
 * @returns UUID string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or generate correlation ID from request headers
 * @param headers - Request headers
 * @returns Correlation ID
 */
export function getCorrelationId(headers: Headers): string {
  const existingId = headers.get(CORRELATION_ID_HEADER);
  if (existingId) {
    return existingId;
  }
  return generateUUID();
}

/**
 * Set correlation ID in headers
 * @param headers - Headers object
 * @param correlationId - Correlation ID
 */
export function setCorrelationId(headers: Headers, correlationId: string): void {
  headers.set(CORRELATION_ID_HEADER, correlationId);
}

/**
 * Get correlation ID header name
 * @returns Header name
 */
export function getCorrelationIdHeader(): string {
  return CORRELATION_ID_HEADER;
}
