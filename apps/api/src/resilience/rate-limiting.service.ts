import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export enum RateLimitScope {
  IP = 'ip',
  USER = 'user',
  SESSION = 'session',
  ORGANISATION = 'organisation',
}

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  burstLimit?: number;
  burstWindowMs?: number;
  failClosed?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

@Injectable()
export class RateLimitingService {
  private readonly logger = new Logger(RateLimitingService.name);
  private readonly redis: Redis;

  // Default configurations per route type
  private readonly routeConfigs: Record<string, RateLimitConfig> = {
    api: { limit: 100, windowMs: 60000, burstLimit: 20, burstWindowMs: 10000, failClosed: false },
    auth: { limit: 10, windowMs: 60000, burstLimit: 3, burstWindowMs: 10000, failClosed: true },
    upload: { limit: 20, windowMs: 60000, burstLimit: 5, burstWindowMs: 10000, failClosed: true },
    graph: { limit: 50, windowMs: 60000, burstLimit: 10, burstWindowMs: 10000, failClosed: false },
    copilot: {
      limit: 30,
      windowMs: 60000,
      burstLimit: 5,
      burstWindowMs: 10000,
      failClosed: true,
    },
    search: {
      limit: 100,
      windowMs: 60000,
      burstLimit: 20,
      burstWindowMs: 10000,
      failClosed: false,
    },
    matching: {
      limit: 50,
      windowMs: 60000,
      burstLimit: 10,
      burstWindowMs: 10000,
      failClosed: true,
    },
    simulation: {
      limit: 20,
      windowMs: 60000,
      burstLimit: 5,
      burstWindowMs: 10000,
      failClosed: false,
    },
    dashboard: {
      limit: 200,
      windowMs: 60000,
      burstLimit: 40,
      burstWindowMs: 10000,
      failClosed: false,
    },
    stripe: { limit: 10, windowMs: 60000, burstLimit: 2, burstWindowMs: 10000, failClosed: true },
  };

  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') redis: Redis,
  ) {
    this.redis = redis;
  }

  /**
   * Check if request is allowed using Sliding Window algorithm
   */
  async checkRateLimit(
    scope: RateLimitScope,
    identifier: string,
    routeType: string,
  ): Promise<RateLimitResult> {
    const config = this.routeConfigs[routeType] || this.routeConfigs.api;
    const key = this.generateKey(scope, identifier, routeType);
    const now = Date.now();

    try {
      // Check burst limit first (short window)
      if (config && config.burstLimit && config.burstWindowMs) {
        const burstResult = await this.checkSlidingWindow(
          `${key}:burst`,
          config.burstLimit,
          config.burstWindowMs,
          now,
        );

        if (!burstResult.allowed) {
          this.logger.warn(
            `Burst limit exceeded for ${scope}:${identifier} on ${routeType}`,
          );
          return {
            allowed: false,
            remaining: 0,
            resetTime: burstResult.resetTime,
            retryAfter: burstResult.retryAfter || 0,
          };
        }
      }

      // Check main limit (longer window)
      if (!config) {
        return {
          allowed: true,
          remaining: 100,
          resetTime: new Date(now + 60000),
        };
      }
      const mainResult = await this.checkSlidingWindow(
        key,
        config.limit,
        config.windowMs,
        now,
      );

      return mainResult;
    } catch (error) {
      this.logger.error(
        `Rate limiting check failed: ${(error as Error).message}`,
      );

      // Check if this route should fail closed
      const shouldFailClosed = config?.failClosed || false;

      if (shouldFailClosed) {
        // Fail closed - reject request if rate limiting fails
        this.logger.error(
          `Rate limiting failed for ${scope}:${identifier} on ${routeType} - failing closed`,
        );
        return {
          allowed: false,
          remaining: 0,
          resetTime: new Date(now + (config?.windowMs || 60000)),
          retryAfter: Math.ceil((config?.windowMs || 60000) / 1000),
        };
      }

      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: config?.limit || 100,
        resetTime: new Date(now + (config?.windowMs || 60000)),
      };
    }
  }

  /**
   * Sliding Window algorithm implementation using Redis
   */
  private async checkSlidingWindow(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): Promise<RateLimitResult> {
    const windowStart = now - windowMs;

    // Remove entries outside the current window
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in the current window
    const count = await this.redis.zcard(key);

    if (count >= limit) {
      // Rate limit exceeded
      const oldestRequest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const resetTime =
        oldestRequest.length > 0 && oldestRequest[1]
          ? new Date(parseInt(oldestRequest[1]) + windowMs)
          : new Date(now + windowMs);

      const retryAfter = Math.ceil((resetTime.getTime() - now) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter,
      };
    }

    // Add current request to the window
    await this.redis.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry for the key
    await this.redis.expire(key, Math.ceil(windowMs / 1000) + 1);

    const remaining = limit - count - 1;
    const resetTime = new Date(windowStart + windowMs);

    return {
      allowed: true,
      remaining,
      resetTime,
    };
  }

  /**
   * Generate Redis key for rate limiting
   */
  private generateKey(
    scope: RateLimitScope,
    identifier: string,
    routeType: string,
  ): string {
    return `ratelimit:${scope}:${identifier}:${routeType}`;
  }

  /**
   * Reset rate limit for a specific scope and identifier
   */
  async resetRateLimit(
    scope: RateLimitScope,
    identifier: string,
    routeType: string,
  ): Promise<void> {
    const key = this.generateKey(scope, identifier, routeType);
    await this.redis.del(key);
    await this.redis.del(`${key}:burst`);
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(
    scope: RateLimitScope,
    identifier: string,
    routeType: string,
  ): Promise<{ count: number; remaining: number; resetTime: Date }> {
    const config = this.routeConfigs[routeType] || this.routeConfigs.api;
    const key = this.generateKey(scope, identifier, routeType);
    const now = Date.now();

    if (!config) {
      return { count: 0, remaining: 100, resetTime: new Date(now + 60000) };
    }

    const windowStart = now - config.windowMs;

    // Remove entries outside the current window
    await this.redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in the current window
    const count = await this.redis.zcard(key);
    const remaining = Math.max(0, config.limit - count);
    const resetTime = new Date(windowStart + config.windowMs);

    return { count, remaining, resetTime };
  }

  /**
   * Configure custom rate limit for a route type
   */
  configureRoute(routeType: string, config: RateLimitConfig): void {
    this.routeConfigs[routeType] = config;
    this.logger.log(
      `Rate limit configured for ${routeType}: ${JSON.stringify(config)}`,
    );
  }
}
