/**
 * RateLimiterSupabase Implementation
 * Implements IRateLimiter interface using Supabase
 */

import { IRateLimiter, RateLimitResult } from "@/core/interfaces";
import { checkRateLimit } from "@/lib/security/rateLimiterSupabase";

export class RateLimiterSupabaseImpl implements IRateLimiter {
  async checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const result = await checkRateLimit(identifier, limit, windowMs);

    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetTime: new Date(result.resetTime),
      limit,
    };
  }

  async reset(identifier: string): Promise<void> {
    // Legacy rate limiter doesn't have reset, implement if needed
    // For now, this is a no-op
  }

  async cleanup(): Promise<void> {
    // Legacy rate limiter handles cleanup automatically
    // For now, this is a no-op
  }
}
