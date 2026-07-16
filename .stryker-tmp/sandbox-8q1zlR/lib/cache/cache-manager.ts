/**
 * Cache Manager
 * Provides a unified interface for caching with automatic provider selection
 */
// @ts-nocheck


import { CacheProvider } from "./cache-provider";
import { MemoryCacheProvider } from "./memory-cache";
import { RedisCacheProvider } from "./redis-cache";
import { envServer } from "@/lib/env.server";
import { LoggerProvider } from "@/lib/core/observability/logger";

const logger = LoggerProvider.getLogger();

export class CacheManager {
  private provider: CacheProvider;
  private prefix: string;

  constructor(prefix: string = "cache") {
    this.prefix = prefix;
    
    // Use Redis if configured, otherwise fall back to memory
    if (envServer.UPSTASH_REDIS_REST_URL && envServer.UPSTASH_REDIS_REST_TOKEN) {
      logger.info("Using Redis cache provider");
      this.provider = new RedisCacheProvider();
    } else {
      logger.info("Using memory cache provider");
      this.provider = new MemoryCacheProvider();
    }
  }

  /**
   * Get a value from the cache
   */
  async get<T>(key: string): Promise<T | null> {
    const prefixedKey = this.getPrefixedKey(key);
    return this.provider.get<T>(prefixedKey);
  }

  /**
   * Set a value in the cache with optional TTL
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key);
    return this.provider.set(prefixedKey, value, ttl);
  }

  /**
   * Delete a value from the cache
   */
  async delete(key: string): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key);
    return this.provider.delete(prefixedKey);
  }

  /**
   * Clear all values from the cache
   */
  async clear(): Promise<void> {
    return this.provider.clear();
  }

  /**
   * Check if a key exists in the cache
   */
  async has(key: string): Promise<boolean> {
    const prefixedKey = this.getPrefixedKey(key);
    return this.provider.has(prefixedKey);
  }

  /**
   * Get multiple values from the cache
   */
  async getMany<T>(keys: string[]): Promise<Map<string, T>> {
    const prefixedKeys = keys.map(k => this.getPrefixedKey(k));
    const result = await this.provider.getMany<T>(prefixedKeys);
    
    // Remove prefix from result keys
    const unprefixedResult = new Map<string, T>();
    for (const [key, value] of result.entries()) {
      const unprefixedKey = this.removePrefix(key);
      unprefixedResult.set(unprefixedKey, value);
    }
    
    return unprefixedResult;
  }

  /**
   * Set multiple values in the cache
   */
  async setMany<T>(entries: Map<string, T>, ttl?: number): Promise<void> {
    const prefixedEntries = new Map<string, T>();
    for (const [key, value] of entries.entries()) {
      prefixedEntries.set(this.getPrefixedKey(key), value);
    }
    return this.provider.setMany(prefixedEntries, ttl);
  }

  /**
   * Delete multiple values from the cache
   */
  async deleteMany(keys: string[]): Promise<void> {
    const prefixedKeys = keys.map(k => this.getPrefixedKey(k));
    return this.provider.deleteMany(prefixedKeys);
  }

  /**
   * Get or set pattern - fetch from cache, or compute and cache if missing
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  private removePrefix(key: string): string {
    return key.replace(`${this.prefix}:`, "");
  }
}

// Singleton instances for different cache namespaces
const cacheInstances = new Map<string, CacheManager>();

export function getCacheManager(prefix: string = "cache"): CacheManager {
  if (!cacheInstances.has(prefix)) {
    cacheInstances.set(prefix, new CacheManager(prefix));
  }
  return cacheInstances.get(prefix)!;
}
