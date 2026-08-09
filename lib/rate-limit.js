import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
let redis = null;
let limiter = null;
function getRedis() {
    if (!process.env.UPSTASH_REDIS_REST_URL ||
        !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }
    if (!redis) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return redis;
}
function getLimiter() {
    const r = getRedis();
    if (!r)
        return null;
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
const ACTION_LIMITS = {
    upload: { requests: 5, window: "1 h" },
    ats: { requests: 20, window: "1 h" },
    optimize: { requests: 3, window: "1 h" },
    interview_generate: { requests: 5, window: "1 h" },
    interview_feedback: { requests: 5, window: "1 h" },
};
/**
 * Rate limit par userId + action (utilisé par les API routes)
 */
export async function checkRateLimit(userId, action) {
    const r = getRedis();
    const isProduction = process.env.NODE_ENV === "production";
    if (!r)
        return { blocked: isProduction, headers: {} };
    const config = ACTION_LIMITS[action] ?? { requests: 10, window: "1 h" };
    const key = `rl:${action}:${userId}`;
    const actionLimiter = new Ratelimit({
        redis: r,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
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
export async function enforceRateLimit(request) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "127.0.0.1";
    const limiterInstance = getLimiter();
    const isProduction = process.env.NODE_ENV === "production";
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
//# sourceMappingURL=rate-limit.js.map