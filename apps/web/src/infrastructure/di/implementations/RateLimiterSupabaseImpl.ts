/**
 * Rate limiter implementation for the application DI layer.
 *
 * Historical note:
 * This class keeps its original name to avoid unnecessary DI/import churn,
 * but it no longer depends on the legacy Supabase `rate_limits` table.
 *
 * Canonical implementation:
 * "@/lib/security/rateLimiter"
 */

import type {
  IRateLimiter,
  RateLimitResult,
} from "@/core/interfaces";

import {
  checkRateLimit,
} from "@/lib/security/rateLimiter";

export class RateLimiterSupabaseImpl implements IRateLimiter {
  async checkRateLimit(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    const result = checkRateLimit(
      identifier,
      limit,
      windowMs
    );

    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetTime: new Date(result.resetTime),
      limit,
    };
  }

  async reset(_identifier: string): Promise<void> {
    /**
     * The current in-memory implementation does not expose
     * an individual reset primitive.
     *
     * Keep the interface contract without reintroducing a
     * persistence dependency.
     */
  }

  async cleanup(): Promise<void> {
    /**
     * Expired entries are handled by the underlying
     * rate-limit implementation.
     */
  }
}
