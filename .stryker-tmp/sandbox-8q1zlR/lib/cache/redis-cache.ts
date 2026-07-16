/**
 * Redis Cache Provider
 * Redis-based cache implementation using Upstash Redis
 * Suitable for production environments
 */
// @ts-nocheck


import { Redis } from "@upstash/redis";
import { CacheProvider } from "./cache-provider";
import { LoggerProvider } from "@/lib/core/observability/logger";
import { envServer } from "@/lib/env.server";

const logger = LoggerProvider.getLogger();

export class RedisCacheProvider implements CacheProvider {
  private redis: Redis;
  private defaultTTL: number;

  constructor(defaultTTL: number = 300000) {
    // Default TTL: 5 minutes
    this.defaultTTL = defaultTTL;
    
    this.redis = new Redis({
      url: envServer.UPSTASH_REDIS_REST_URL!,
      token: envServer.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get<string>(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error("Redis cache get failed", { key, error });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const expiry = ttl || this.defaultTTL;
      await this.redis.set(key, serialized, { ex: Math.floor(expiry / 1000) });
    } catch (error) {
      logger.error("Redis cache set failed", { key, error });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error("Redis cache delete failed", { key, error });
    }
  }

  async clear(): Promise<void> {
    try {
      // Clear all keys with a specific prefix to avoid deleting other data
      const keys = await this.redis.keys("cache:*");
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error("Redis cache clear failed", { error });
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error("Redis cache has failed", { key, error });
      return false;
    }
  }

  async getMany<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>();
    
    try {
      const values = await this.redis.mget<(string | null)[]>(...keys);
      
      keys.forEach((key, i) => {
        const value = values[i];
        if (value) {
          result.set(key, JSON.parse(value!) as T);
        }
      });
    } catch (error) {
      logger.error("Redis cache getMany failed", { keys, error });
    }

    return result;
  }

  async setMany<T>(entries: Map<string, T>, ttl?: number): Promise<void> {
    const expiry = ttl || this.defaultTTL;
    
    try {
      const pipeline = this.redis.pipeline();
      
      for (const [key, value] of entries.entries()) {
        const serialized = JSON.stringify(value);
        pipeline.set(key, serialized, { ex: Math.floor(expiry / 1000) });
      }
      
      await pipeline.exec();
    } catch (error) {
      logger.error("Redis cache setMany failed", { error });
    }
  }

  async deleteMany(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error("Redis cache deleteMany failed", { keys, error });
    }
  }
}
