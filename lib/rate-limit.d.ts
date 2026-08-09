import type { NextRequest } from "next/server";
export interface RateLimitResult {
    blocked: boolean;
    headers: Record<string, string>;
}
/**
 * Rate limit par userId + action (utilisé par les API routes)
 */
export declare function checkRateLimit(userId: string, action: string): Promise<RateLimitResult>;
/**
 * Rate limit par IP (utilisé par le middleware)
 */
export declare function enforceRateLimit(request: NextRequest): Promise<RateLimitResult>;
//# sourceMappingURL=rate-limit.d.ts.map