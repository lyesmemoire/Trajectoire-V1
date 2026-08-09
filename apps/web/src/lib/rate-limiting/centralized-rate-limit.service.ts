// lib/rate-limiting/centralized-rate-limit.service.ts
//
// CENTRALIZED RATE LIMITING SERVICE
// Supports multiple scopes, sliding window, burst capability, and comprehensive route coverage
//
// SCOPES:
// - IP: Rate limit by IP address
// - USER: Rate limit by user ID
// - SESSION: Rate limit by session ID
// - ORGANISATION: Rate limit by organisation ID
//
// ALGORITHM: Sliding Window with Burst Capability
// - Uses Redis sorted sets for O(log n) operations
// - Supports burst capacity for short-term spikes
// - Provides accurate rate limiting with minimal memory usage

import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

// ============================================================
// TYPES & INTERFACES
// ============================================================

export enum RateLimitScope {
  IP = "IP",
  USER = "USER",
  SESSION = "SESSION",
  ORGANISATION = "ORGANISATION",
}

export enum RouteType {
  API = "api",
  AUTH = "auth",
  UPLOAD = "upload",
  GRAPH = "graph",
  COPILOT = "copilot",
  SEARCH = "search",
  MATCHING = "matching",
  SIMULATION = "simulation",
  DASHBOARD = "dashboard",
  STRIPE = "stripe",
}

export interface RateLimitConfig {
  limit: number;           // Maximum requests per window
  window: number;          // Window duration in seconds
  burstLimit?: number;     // Optional burst capacity
  burstWindow?: number;    // Burst window duration in seconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;     // Seconds until retry
  scope: RateLimitScope;
  identifier: string;
}

export interface RateLimitHeaders {
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string;
  "X-RateLimit-Scope": string;
  "Retry-After"?: string;
}

// ============================================================
// RATE LIMIT CONFIGURATIONS
// ============================================================

const RATE_LIMIT_CONFIGS: Record<RouteType, RateLimitConfig> = {
  [RouteType.API]: {
    limit: 100,
    window: 60,           // 100 requests per minute
    burstLimit: 150,      // Allow burst up to 150
    burstWindow: 10,      // Within 10 seconds
  },
  [RouteType.AUTH]: {
    limit: 10,
    window: 60,           // 10 auth attempts per minute
    burstLimit: 15,       // Allow burst up to 15
    burstWindow: 30,      // Within 30 seconds
  },
  [RouteType.UPLOAD]: {
    limit: 20,
    window: 3600,         // 20 uploads per hour
    burstLimit: 25,       // Allow burst up to 25
    burstWindow: 300,     // Within 5 minutes
  },
  [RouteType.GRAPH]: {
    limit: 50,
    window: 60,           // 50 graph queries per minute
    burstLimit: 75,       // Allow burst up to 75
    burstWindow: 15,      // Within 15 seconds
  },
  [RouteType.COPILOT]: {
    limit: 30,
    window: 60,           // 30 copilot requests per minute
    burstLimit: 45,       // Allow burst up to 45
    burstWindow: 20,      // Within 20 seconds
  },
  [RouteType.SEARCH]: {
    limit: 100,
    window: 60,           // 100 searches per minute
    burstLimit: 150,      // Allow burst up to 150
    burstWindow: 10,      // Within 10 seconds
  },
  [RouteType.MATCHING]: {
    limit: 50,
    window: 60,           // 50 matching requests per minute
    burstLimit: 75,       // Allow burst up to 75
    burstWindow: 15,      // Within 15 seconds
  },
  [RouteType.SIMULATION]: {
    limit: 20,
    window: 3600,         // 20 simulations per hour
    burstLimit: 25,       // Allow burst up to 25
    burstWindow: 300,     // Within 5 minutes
  },
  [RouteType.DASHBOARD]: {
    limit: 200,
    window: 60,           // 200 dashboard requests per minute
    burstLimit: 300,      // Allow burst up to 300
    burstWindow: 10,      // Within 10 seconds
  },
  [RouteType.STRIPE]: {
    limit: 10,
    window: 60,           // 10 Stripe requests per minute
    burstLimit: 15,       // Allow burst up to 15
    burstWindow: 30,      // Within 30 seconds
  },
};

// ============================================================
// CENTRALIZED RATE LIMITING SERVICE
// ============================================================

export class CentralizedRateLimitService {
  private redis: Redis | null = null;
  private readonly keyPrefix = "rl";

  constructor() {
    this.initializeRedis();
  }

  /**
   * Initialize Redis connection
   */
  private initializeRedis(): void {
    if (
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      logger.info({ component: "CentralizedRateLimitService" }, "Redis initialized for rate limiting");
    } else {
      logger.warn({ component: "CentralizedRateLimitService" }, "Redis not configured, rate limiting disabled");
    }
  }

  /**
   * Check rate limit for a specific scope and identifier
   */
  async checkRateLimit(
    scope: RateLimitScope,
    identifier: string,
    routeType: RouteType
  ): Promise<RateLimitResult> {
    const config = RATE_LIMIT_CONFIGS[routeType] || RATE_LIMIT_CONFIGS[RouteType.API];
    const key = this.buildKey(scope, identifier, routeType);

    // Fallback: if Redis is not available, allow request in dev/test
    if (!this.redis) {
      const isProduction = process.env.NODE_ENV === "production";
      return {
        allowed: !isProduction,
        remaining: config.limit,
        resetTime: new Date(Date.now() + config.window * 1000),
        scope,
        identifier,
      };
    }

    try {
      const result = await this.slidingWindowCheck(key, config);
      
      // Calculate retry after if not allowed
      const retryAfter = result.allowed ? undefined : Math.ceil((result.resetTime.getTime() - Date.now()) / 1000);

      return {
        ...result,
        retryAfter,
        scope,
        identifier,
      };
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : "Unknown error",
        component: "CentralizedRateLimitService",
        scope,
        identifier,
        routeType,
      }, "Rate limit check failed, allowing request (fail-open)");

      // Fail-open: if Redis fails, allow the request
      return {
        allowed: true,
        remaining: config.limit,
        resetTime: new Date(Date.now() + config.window * 1000),
        scope,
        identifier,
      };
    }
  }

  /**
   * Sliding window algorithm with burst capability
   */
  private async slidingWindowCheck(
    key: string,
    config: RateLimitConfig
  ): Promise<Omit<RateLimitResult, "scope" | "identifier" | "retryAfter">> {
    const now = Date.now();
    const windowStart = now - config.window * 1000;
    const burstWindowStart = config.burstWindow 
      ? now - config.burstWindow * 1000 
      : windowStart;

    // Clean up expired entries
    await this.redis!.zremrangebyscore(key, 0, windowStart);

    // Count requests in the main window
    const mainWindowCount = await this.redis!.zcount(key, windowStart, now);

    // Check burst capacity if configured
    if (config.burstLimit && config.burstWindow) {
      const burstCount = await this.redis!.zcount(key, burstWindowStart, now);
      
      // Allow if within burst limit
      if (burstCount < config.burstLimit) {
        await this.addRequest(key, now, config.window);
        const remaining = config.burstLimit - burstCount - 1;
        
        return {
          allowed: true,
          remaining: Math.max(0, remaining),
          resetTime: new Date(now + config.window * 1000),
        };
      }
    }

    // Check main window limit
    if (mainWindowCount >= config.limit) {
      // Get the oldest request timestamp for retry calculation
      const oldest = await this.redis!.zrange(key, 0, 0, { withScores: true }) as [string, number][];
      const resetTime = oldest.length > 0 
        ? new Date(oldest[0][1] + config.window * 1000)
        : new Date(now + config.window * 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    // Add the request
    await this.addRequest(key, now, config.window);
    const remaining = config.limit - mainWindowCount - 1;

    return {
      allowed: true,
      remaining: Math.max(0, remaining),
      resetTime: new Date(now + config.window * 1000),
    };
  }

  /**
   * Add a request to the sorted set
   */
  private async addRequest(key: string, timestamp: number, windowSeconds: number): Promise<void> {
    await this.redis!.zadd(key, { score: timestamp, member: timestamp.toString() });
    await this.redis!.expire(key, windowSeconds);
  }

  /**
   * Build Redis key for rate limiting
   */
  private buildKey(scope: RateLimitScope, identifier: string, routeType: RouteType): string {
    return `${this.keyPrefix}:${scope}:${routeType}:${identifier}`;
  }

  /**
   * Get rate limit headers for a result
   */
  getHeaders(result: RateLimitResult, routeType: RouteType): RateLimitHeaders {
    const config = RATE_LIMIT_CONFIGS[routeType] || RATE_LIMIT_CONFIGS[RouteType.API];
    
    const headers: RateLimitHeaders = {
      "X-RateLimit-Limit": config.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(result.resetTime.getTime() / 1000).toString(),
      "X-RateLimit-Scope": result.scope,
    };

    if (result.retryAfter) {
      headers["Retry-After"] = result.retryAfter.toString();
    }

    return headers;
  }

  /**
   * Reset rate limit for a specific scope and identifier (admin function)
   */
  async resetRateLimit(
    scope: RateLimitScope,
    identifier: string,
    routeType: RouteType
  ): Promise<void> {
    if (!this.redis) {
      logger.warn({ component: "CentralizedRateLimitService" }, "Cannot reset rate limit: Redis not available");
      return;
    }

    const key = this.buildKey(scope, identifier, routeType);
    await this.redis.del(key);
    
    logger.info({
      component: "CentralizedRateLimitService",
      scope,
      identifier,
      routeType,
    }, "Rate limit reset");
  }

  /**
   * Get current usage statistics for a scope and identifier
   */
  async getUsageStats(
    scope: RateLimitScope,
    identifier: string,
    routeType: RouteType
  ): Promise<{ current: number; limit: number; window: number }> {
    const config = RATE_LIMIT_CONFIGS[routeType] || RATE_LIMIT_CONFIGS[RouteType.API];
    const key = this.buildKey(scope, identifier, routeType);

    if (!this.redis) {
      return { current: 0, limit: config.limit, window: config.window };
    }

    const now = Date.now();
    const windowStart = now - config.window * 1000;
    const current = await this.redis.zcount(key, windowStart, now);

    return {
      current,
      limit: config.limit,
      window: config.window,
    };
  }
}

// ============================================================
// SINGLETON INSTANCE
// ============================================================

let serviceInstance: CentralizedRateLimitService | null = null;

export function getRateLimitService(): CentralizedRateLimitService {
  if (!serviceInstance) {
    serviceInstance = new CentralizedRateLimitService();
  }
  return serviceInstance;
}
