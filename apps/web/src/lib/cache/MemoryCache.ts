/**
 * Memory Cache Service
 * Simple in-memory cache with TTL support
 * Used for caching frequently accessed data like AI configuration, prompts, profiles, quota
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(private defaultTTL: number = 5 * 60 * 1000) {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Delete a value from cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get or set a value (cache-aside pattern)
   * @param key - Cache key
   * @param factory - Function to generate value if not in cache
   * @param ttl - Time to live in milliseconds
   * @returns Cached or freshly generated value
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Singleton instance
let cacheInstance: MemoryCache | null = null;

/**
 * Get the singleton cache instance
 * @param defaultTTL - Default time to live in milliseconds
 * @returns MemoryCache instance
 */
export function getCache(defaultTTL?: number): MemoryCache {
  if (!cacheInstance) {
    cacheInstance = new MemoryCache(defaultTTL);
  }
  return cacheInstance;
}

/**
 * Cache key generators for common use cases
 */
export const CacheKeys = {
  // AI Configuration
  aiConfig: (type: string) => `ai:config:${type}`,
  
  // System prompts
  systemPrompt: (interviewType: string) => `ai:prompt:${interviewType}`,
  
  // User profiles
  userProfile: (userId: string) => `user:profile:${userId}`,
  
  // User quota
  userQuota: (userId: string, quotaType: string) => `quota:${userId}:${quotaType}`,
  
  // Session data
  session: (sessionId: string) => `session:${sessionId}`,
  
  // Report data
  report: (reportId: string) => `report:${reportId}`,
  
  // Message history (last N messages)
  messageHistory: (sessionId: string, limit: number) => `messages:${sessionId}:${limit}`,
};

/**
 * TTL constants (in milliseconds)
 */
export const TTL = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 10 * 60 * 1000,    // 10 minutes
  LONG: 30 * 60 * 1000,      // 30 minutes
  HOUR: 60 * 60 * 1000,      // 1 hour
};
