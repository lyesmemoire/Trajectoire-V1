/**
 * Optimized Redis Client - SPRINT-4.5
 * 
 * Performance monitoring and automatic optimization for Redis operations
 */

import { Redis } from '@upstash/redis';
import { performanceMonitor, measurePerformance } from './PerformanceMonitor';

export class OptimizedRedis {
  private client: Redis;
  private localCache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = 5000; // 5 seconds for local cache

  constructor(redis: Redis) {
    this.client = redis;
  }

  // Optimized get with local cache
  @measurePerformance('redis.get')
  async get(key: string): Promise<string | null> {
    // Check local cache first
    const localCached = this.getFromLocalCache(key);
    if (localCached !== null) {
      return localCached;
    }

    // Check Redis
    const value = await this.client.get(key) as string | null;
    
    // Cache locally
    if (value !== null) {
      this.setLocalCache(key, value);
    }

    return value;
  }

  // Optimized set
  @measurePerformance('redis.set')
  async set(key: string, value: string, options?: any): Promise<void> {
    this.setLocalCache(key, value);
    await this.client.set(key, value, options);
  }

  // Optimized mget (batch get)
  @measurePerformance('redis.mget')
  async mget(keys: string[]): Promise<(string | null)[]> {
    const results: (string | null)[] = [];
    const keysToFetch: string[] = [];

    // Check local cache first
    keys.forEach(key => {
      const localCached = this.getFromLocalCache(key);
      if (localCached !== null) {
        results.push(localCached);
      } else {
        results.push(null);
        keysToFetch.push(key);
      }
    });

    // Fetch missing keys from Redis
    if (keysToFetch.length > 0) {
      const redisResults = await this.client.mget(keysToFetch);
      let redisIndex = 0;
      
      keys.forEach((key, index) => {
        if (results[index] === null) {
          const value = redisResults[redisIndex++] as string | null;
          if (value !== null) {
            this.setLocalCache(key, value);
            results[index] = value;
          }
        }
      });
    }

    return results;
  }

  // Optimized mset (batch set)
  @measurePerformance('redis.mset')
  async mset(keyValuePairs: Record<string, string>): Promise<void> {
    // Update local cache
    Object.entries(keyValuePairs).forEach(([key, value]) => {
      this.setLocalCache(key, value);
    });

    await this.client.mset(keyValuePairs);
  }

  // Optimized delete
  @measurePerformance('redis.delete')
  async delete(key: string): Promise<void> {
    this.deleteFromLocalCache(key);
    await this.client.del(key);
  }

  // Optimized incr with local tracking
  @measurePerformance('redis.incr')
  async incr(key: string): Promise<number> {
    this.deleteFromLocalCache(key);
    return this.client.incr(key);
  }

  // Optimized decr with local tracking
  @measurePerformance('redis.decr')
  async decr(key: string): Promise<number> {
    this.deleteFromLocalCache(key);
    return this.client.decr(key);
  }

  // Local cache helpers
  private getFromLocalCache(key: string): string | null {
    const cached = this.localCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.cacheTTL) {
      this.localCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setLocalCache(key: string, data: string): void {
    this.localCache.set(key, { data, timestamp: Date.now() });
  }

  private deleteFromLocalCache(key: string): void {
    this.localCache.delete(key);
  }

  // Clear local cache
  clearLocalCache(): void {
    this.localCache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      localSize: this.localCache.size,
      keys: Array.from(this.localCache.keys()),
    };
  }
}

let redisInstance: OptimizedRedis | null = null;

export const optimizedRedis = () => {
  if (!redisInstance) {
    redisInstance = new OptimizedRedis(new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    }));
  }
  return redisInstance;
};