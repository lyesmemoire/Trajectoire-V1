/**
 * Distributed Lock Service
 * Uses PostgreSQL advisory locks to prevent race conditions
 */

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger/Logger";
import { AppError, ErrorCode } from "@/core/errors";

export class DistributedLock {
  /**
   * Acquire an advisory lock on a resource
   * @param key - Unique key for the lock (e.g., sessionId)
   * @param timeoutMs - Maximum time to wait for lock (default: 5000ms)
   * @returns Lock release function
   */
  static async acquire(key: string, timeoutMs: number = 5000): Promise<() => Promise<void>> {
    const supabase = await createClient();
    const lockKey = this.hashKey(key);
    
    logger.info("Attempting to acquire distributed lock", { key, lockKey, timeoutMs });

    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      // Try to acquire advisory lock
      const { data, error } = await supabase.rpc("try_advisory_lock", {
        p_lock_key: lockKey,
      });

      if (error) {
        throw new AppError(
          `Failed to acquire distributed lock: ${error.message}`,
          ErrorCode.DATABASE_ERROR,
          500
        );
      }

      if (data === true) {
        logger.info("Distributed lock acquired", { key, lockKey });
        
        // Return release function
        return async () => {
          await this.release(key);
        };
      }

      // Wait 100ms before retrying
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new AppError(
      "Failed to acquire distributed lock: timeout",
      ErrorCode.INTERNAL_ERROR,
      408,
      true,
      { key, timeoutMs }
    );
  }

  /**
   * Release an advisory lock
   * @param key - Unique key for the lock
   */
  static async release(key: string): Promise<void> {
    const supabase = await createClient();
    const lockKey = this.hashKey(key);

    const { error } = await supabase.rpc("release_advisory_lock", {
      p_lock_key: lockKey,
    });

    if (error) {
      logger.error("Failed to release distributed lock", { key, lockKey, error });
      // Don't throw error, as the lock may have been released already
      return;
    }

    logger.info("Distributed lock released", { key, lockKey });
  }

  /**
   * Execute a function with a distributed lock
   * @param key - Unique key for the lock
   * @param fn - Function to execute
   * @param timeoutMs - Maximum time to wait for lock (default: 5000ms)
   * @returns Function result
   */
  static async execute<T>(
    key: string,
    fn: () => Promise<T>,
    timeoutMs: number = 5000
  ): Promise<T> {
    const release = await this.acquire(key, timeoutMs);

    try {
      return await fn();
    } finally {
      await release();
    }
  }

  /**
   * Hash a key to a numeric value for advisory lock
   * @param key - String key
   * @returns Numeric hash
   */
  private static hashKey(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
