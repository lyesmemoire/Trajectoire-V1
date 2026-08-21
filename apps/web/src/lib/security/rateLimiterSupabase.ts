/**
 * Compatibility adapter for the historical persistent
 * Supabase rate limiter.
 *
 * Legacy persistence removed:
 *   public.rate_limits
 *
 * Canonical implementation:
 *   "@/lib/security/rateLimiter"
 *
 * The filename and exports are intentionally preserved so
 * existing imports continue to work.
 */

import {
  checkRateLimit as checkMemoryRateLimit,
  getRateLimitIdentifier,
  RateLimitError,
  RATE_LIMITS,
} from "@/lib/security/rateLimiter";

export {
  getRateLimitIdentifier,
  RateLimitError,
  RATE_LIMITS,
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  return checkMemoryRateLimit(
    identifier,
    limit,
    windowMs
  );
}
