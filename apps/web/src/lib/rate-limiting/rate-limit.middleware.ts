// lib/rate-limiting/rate-limit.middleware.ts
//
// RATE LIMITING MIDDLEWARE FOR NEXT.JS API ROUTES
// Integrates with CentralizedRateLimitService to provide comprehensive rate limiting
//
// USAGE:
// Apply to API routes using the rateLimit() wrapper function
//
// EXAMPLE:
// ```typescript
// import { rateLimit } from '@/lib/rate-limiting/rate-limit.middleware';
// 
// export const POST = rateLimit(RouteType.AUTH, async (req) => {
//   // Your route handler
// });
// ```

import { NextRequest, NextResponse } from "next/server";
import { getRateLimitService, RateLimitScope, RouteType, RateLimitResult } from "./centralized-rate-limit.service";
import { logger } from "@/lib/logger";

// ============================================================
// CONFIGURATION
// ============================================================

export interface RateLimitMiddlewareOptions {
  routeType: RouteType;
  scopes?: RateLimitScope[];
  skipSuccessfulRequests?: boolean; // Don't count successful requests (for expensive operations)
}

const DEFAULT_SCOPES: RateLimitScope[] = [RateLimitScope.IP];

// ============================================================
// RATE LIMIT WRAPPER
// ============================================================

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function rateLimit<T extends (...args: any[]) => Promise<NextResponse>>(
  routeType: RouteType,
  handler: T,
  options?: Partial<RateLimitMiddlewareOptions>
): T {
  return (async (req: NextRequest, ...args: any[]) => {
    const opts: RateLimitMiddlewareOptions = {
      routeType,
      scopes: options?.scopes || DEFAULT_SCOPES,
      skipSuccessfulRequests: options?.skipSuccessfulRequests || false,
    };

    // Extract identifiers for different scopes
    const identifiers = extractIdentifiers(req);

    // Check rate limits for all configured scopes
    const results: RateLimitResult[] = [];
    for (const scope of opts.scopes || []) {
      const identifier = (identifiers as any)[scope];
      if (!identifier) continue;

      const result = await getRateLimitService().checkRateLimit(
        scope,
        identifier,
        routeType
      );
      results.push(result);

      if (!result.allowed) {
        // Rate limit exceeded - return 429 with headers
        const headers = getRateLimitService().getHeaders(result, routeType);
        
        logger.warn({
          scope,
          identifier,
          routeType,
          path: req.nextUrl.pathname,
          retryAfter: result.retryAfter,
        }, "Rate limit exceeded");

        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: `Too many requests. Please retry after ${result.retryAfter} seconds.`,
            retryAfter: result.retryAfter,
          },
          {
            status: 429,
            headers: Object.entries(headers).map(([key, value]) => [key, String(value)]) as [string, string][],
          }
        );
      }
    }

    // Set rate limit headers for successful requests
    if (results.length > 0) {
      const primaryResult = results[0]; // Use first result for headers
      const headers = getRateLimitService().getHeaders(primaryResult, routeType);
      
      // Execute the handler
      const response = await handler(req, ...args);
      
      // Apply headers to response
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // No rate limiting applied (no identifiers found)
    return handler(req, ...args);
  }) as T;
}

// ============================================================
// IDENTIFIER EXTRACTION
// ============================================================

function extractIdentifiers(req: NextRequest): Record<RateLimitScope, string | null> {
  return {
    [RateLimitScope.IP]: extractIp(req),
    [RateLimitScope.USER]: extractUserId(req),
    [RateLimitScope.SESSION]: extractSessionId(req),
    [RateLimitScope.ORGANISATION]: extractOrganisationId(req),
  };
}

/**
 * Extract IP address from request
 */
function extractIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  // Fallback to a default IP (in production, this should never happen)
  return "unknown";
}

/**
 * Extract user ID from request
 * This assumes the user ID is available in the request context
 * (set by authentication middleware)
 */
function extractUserId(req: NextRequest): string | null {
  // Try to get user ID from various possible locations
  const userId = req.headers.get("x-user-id");
  if (userId) return userId;

  // If using Supabase auth, the user ID might be in the auth header
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    // This would need to be decoded to get the user ID
    // For now, return null as this should be handled by auth middleware
    return null;
  }

  return null;
}

/**
 * Extract session ID from request
 */
function extractSessionId(req: NextRequest): string | null {
  return req.headers.get("x-session-id") || req.cookies.get("session-id")?.value || null;
}

/**
 * Extract organisation ID from request
 */
function extractOrganisationId(req: NextRequest): string | null {
  return req.headers.get("x-organisation-id") || req.headers.get("x-organization-id") || null;
}

// ============================================================
// MANUAL RATE LIMIT CHECK
// ============================================================

/**
 * Manually check rate limit without automatic response handling
 * Useful for custom rate limiting logic
 */
export async function checkRateLimitManual(
  req: NextRequest,
  routeType: RouteType,
  scopes?: RateLimitScope[]
): Promise<{ allowed: boolean; headers?: Record<string, string> }> {
  const opts = scopes || DEFAULT_SCOPES;
  const identifiers = extractIdentifiers(req);

  for (const scope of opts) {
    const identifier = identifiers[scope];
    if (!identifier) continue;

    const result = await getRateLimitService().checkRateLimit(
      scope,
      identifier,
      routeType
    );

    if (!result.allowed) {
      const headers = getRateLimitService().getHeaders(result, routeType);
      return { allowed: false, headers: headers as unknown as Record<string, string> };
    }
  }

  return { allowed: true };
}

// ============================================================
// RATE LIMIT DECORATOR (FOR CLASS-BASED HANDLERS)
// ============================================================

/**
 * Decorator for class-based route handlers
 * Usage: @RateLimit(RouteType.API, [RateLimitScope.USER, RateLimitScope.IP])
 */
export function RateLimit(routeType: RouteType, scopes?: RateLimitScope[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req = args[0] as NextRequest;
      const identifiers = extractIdentifiers(req);

      for (const scope of scopes || DEFAULT_SCOPES) {
        const identifier = identifiers[scope];
        if (!identifier) continue;

        const result = await getRateLimitService().checkRateLimit(
          scope,
          identifier,
          routeType
        );

        if (!result.allowed) {
          const headers = getRateLimitService().getHeaders(result, routeType);
          
          logger.warn({
            scope,
            identifier,
            routeType,
            path: req.nextUrl.pathname,
            retryAfter: result.retryAfter,
          }, "Rate limit exceeded (decorator)");

          return NextResponse.json(
            {
              error: "Rate limit exceeded",
              message: `Too many requests. Please retry after ${result.retryAfter} seconds.`,
              retryAfter: result.retryAfter,
            },
            {
              status: 429,
              headers: Object.entries(headers).map(([key, value]) => [key, String(value)]) as [string, string][],
            }
          );
        }
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
