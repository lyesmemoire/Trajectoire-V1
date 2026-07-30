import { NextRequest } from 'next/server'
/**
 * Get Request ID from NextRequest
 * Helper function to extract correlation ID from Next.js request headers
 */

import { getCorrelationId } from "./correlationId";

/**
 * Get correlation ID from NextRequest
 * @param request - Next.js request object
 * @returns Correlation ID
 */
export function getRequestId(request: NextRequest): string {
  return getCorrelationId(request.headers);
}
