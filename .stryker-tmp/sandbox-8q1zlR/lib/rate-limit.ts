// @ts-nocheck
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import type { NextRequest } from "next/server";
import { envServer } from "@/lib/env.server";

let redis: Redis | null = null;
let limiter: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (
    !envServer.UPSTASH_REDIS_REST_URL ||
    !envServer.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: envServer.UPSTASH_REDIS_REST_URL,
      token: envServer.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}

function getLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  if (!limiter) {
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "ratelimit",
    });
  }

  return limiter;
}

export interface RateLimitResult {
  blocked: boolean;
  headers: Record<string, string>;
}

const ACTION_LIMITS: Record<string, { requests: number; window: string }> = {
  upload: { requests: 5, window: "1 h" },
  ats: { requests: 20, window: "1 h" },
  optimize: { requests: 3, window: "1 h" },
  interview_generate: { requests: 5, window: "1 h" },
  interview_feedback: { requests: 5, window: "1 h" },
};

/**
 * Rate limit par userId + action (utilisé par les API routes)
 */
export async function checkRateLimit(
  userId: string,
  action: string,
): Promise<RateLimitResult> {
  const r = getRedis();
  const isProduction = envServer.NODE_ENV === "production";
  if (!r) return { blocked: isProduction, headers: {} };

  const config = ACTION_LIMITS[action] ?? { requests: 10, window: "1 h" };
  const key = `rl:${action}:${userId}`;

  const actionLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(
      config.requests,
      config.window as Parameters<typeof Ratelimit.slidingWindow>[1],
    ),
    prefix: "rl",
  });

  const result = await actionLimiter.limit(key);

  return {
    blocked: !result.success,
    headers: {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.reset.toString(),
    },
  };
}

/**
 * Rate limit par IP (utilisé par le middleware)
 */
export async function enforceRateLimit(
  request: NextRequest,
): Promise<RateLimitResult> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const limiterInstance = getLimiter();
  const isProduction = envServer.NODE_ENV === "production";

  if (!limiterInstance) {
    return { blocked: isProduction, headers: {} };
  }

  const result = await limiterInstance.limit(ip);

  return {
    blocked: !result.success,
    headers: {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": result.reset.toString(),
    },
  };
}
