/**
 * Cache Provider Interface
 * Defines the contract for cache implementations
 */

export interface CacheProvider {
  /**
   * Get a value from the cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set a value in the cache with optional TTL
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete a value from the cache
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all values from the cache
   */
  clear(): Promise<void>;

  /**
   * Check if a key exists in the cache
   */
  has(key: string): Promise<boolean>;

  /**
   * Get multiple values from the cache
   */
  getMany<T>(keys: string[]): Promise<Map<string, T>>;

  /**
   * Set multiple values in the cache
   */
  setMany<T>(entries: Map<string, T>, ttl?: number): Promise<void>;

  /**
   * Delete multiple values from the cache
   */
  deleteMany(keys: string[]): Promise<void>;
}
