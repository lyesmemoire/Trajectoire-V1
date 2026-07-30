import { NextResponse, NextRequest } from 'next/server';

/**
 * Retrieve the existing request-id from the incoming request headers or generate a new one.
 * Uses the built‑in crypto API (available in Node 14+ and V8) to create a UUID v4.
 */
export function getOrCreateRequestId(request: NextRequest): string {
  const existing = request.headers.get("x-request-id");
  if (existing) {
    return existing;
  }
  // Generate a new UUID for this request
  const id = crypto.randomUUID();
  return id;
}

/**
 * Attach the request-id to a NextResponse so downstream services (Sentry, audit logs,
 * AI providers) can access it via the `x-request-id` header.
 */
export function attachRequestId(response: NextResponse, requestId: string, ): void {
  response.headers.set("x-request-id", requestId);
}
