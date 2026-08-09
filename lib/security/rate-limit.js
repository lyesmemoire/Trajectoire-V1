import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = (redisUrl && redisToken)
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;
if (!redis && process.env.NODE_ENV === "development") {
    console.warn("Rate limit disabled in dev: UPSTASH_REDIS_REST_URL or TOKEN missing");
}
/**
 * Generic rate limiter wrapper to prevent crashes when Redis is not configured.
 */
export const createRateLimiter = (limit, period) => {
    if (!redis) {
        return {
            limit: async () => ({ success: true, limit: limit, reset: 0, remaining: limit })
        };
    }
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, period),
    });
};
// Pre‑configured limiters
export const cvRewriteLimiter = createRateLimiter(5, "1 m"); // 5/min
export const interviewStartLimiter = createRateLimiter(10, "1 m"); // 10/min
export const premiumContinueLimiter = createRateLimiter(30, "1 m"); // 30/min
export const executiveSimulateLimiter = createRateLimiter(3, "1 m"); // 3/min — strict
//# sourceMappingURL=rate-limit.js.map