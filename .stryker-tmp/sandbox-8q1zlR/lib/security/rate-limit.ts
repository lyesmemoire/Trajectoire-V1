// @ts-nocheck
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { envServer } from "@/lib/env.server";
import { LoggerProvider } from "@/lib/core/observability/logger";

const redisUrl = envServer.UPSTASH_REDIS_REST_URL;
const redisToken = envServer.UPSTASH_REDIS_REST_TOKEN;

const redis = (redisUrl && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

if (!redis && envServer.NODE_ENV === "development") {
  LoggerProvider.getLogger().warn("Rate limit disabled in dev: UPSTASH_REDIS_REST_URL or TOKEN missing");
}

/**
 * Generic rate limiter wrapper to prevent crashes when Redis is not configured.
 */
export const createRateLimiter = (limit: number, period: string) => {
  if (!redis) {
    return {
      limit: async () => ({ success: true, limit: limit, reset: 0, remaining: limit })
    };
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, period as any),
  });
};

// Pre‑configured limiters
export const cvRewriteLimiter = createRateLimiter(5, "1 m"); // 5/min
export const interviewStartLimiter = createRateLimiter(10, "1 m"); // 10/min
export const premiumContinueLimiter = createRateLimiter(30, "1 m"); // 30/min
export const executiveSimulateLimiter = createRateLimiter(3, "1 m"); // 3/min — strict
export const aiStreamLimiter = createRateLimiter(5, "1 m"); // 5/min
export const aiTtsLimiter = createRateLimiter(5, "1 m"); // 5/min
export const interviewLimiter = createRateLimiter(10, "1 m"); // 10/min (orchestrate + analyze)
export const cvLimiter = createRateLimiter(5, "1 m"); // 5/min
export const atsPremiumLimiter = createRateLimiter(5, "1 m"); // 5/min

// Phase 2 — Routes LLM secondaires
export const speechLimiter = createRateLimiter(5, "1 m"); // 5/min
export const optimizeLimiter = createRateLimiter(3, "1 m"); // 3/min — coûteux
export const uploadLimiter = createRateLimiter(5, "1 m"); // 5/min

