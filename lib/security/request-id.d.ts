import { NextResponse, NextRequest } from 'next/server';
/**
 * Retrieve the existing request-id from the incoming request headers or generate a new one.
 * Uses the built‑in crypto API (available in Node 14+ and V8) to create a UUID v4.
 */
export declare function getOrCreateRequestId(request: NextRequest): string;
/**
 * Attach the request-id to a NextResponse so downstream services (Sentry, audit logs,
 * AI providers) can access it via the `x-request-id` header.
 */
export declare function attachRequestId(response: NextResponse, requestId: string): void;
//# sourceMappingURL=request-id.d.ts.map