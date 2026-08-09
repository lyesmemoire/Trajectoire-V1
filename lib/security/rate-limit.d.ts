import { Ratelimit } from "@upstash/ratelimit";
/**
 * Generic rate limiter wrapper to prevent crashes when Redis is not configured.
 */
export declare const createRateLimiter: (limit: number, period: string) => Ratelimit | {
    limit: () => Promise<{
        success: boolean;
        limit: number;
        reset: number;
        remaining: number;
    }>;
};
export declare const cvRewriteLimiter: Ratelimit | {
    limit: () => Promise<{
        success: boolean;
        limit: number;
        reset: number;
        remaining: number;
    }>;
};
export declare const interviewStartLimiter: Ratelimit | {
    limit: () => Promise<{
        success: boolean;
        limit: number;
        reset: number;
        remaining: number;
    }>;
};
export declare const premiumContinueLimiter: Ratelimit | {
    limit: () => Promise<{
        success: boolean;
        limit: number;
        reset: number;
        remaining: number;
    }>;
};
export declare const executiveSimulateLimiter: Ratelimit | {
    limit: () => Promise<{
        success: boolean;
        limit: number;
        reset: number;
        remaining: number;
    }>;
};
//# sourceMappingURL=rate-limit.d.ts.map