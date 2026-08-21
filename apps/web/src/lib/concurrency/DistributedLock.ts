import "server-only";

import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";

import { AppError, ErrorCode } from "@/core/errors";
import { logger } from "@/lib/logger/Logger";

/**
 * Distributed lock used to serialize operations on the same resource.
 *
 * Production:
 * - Uses Upstash Redis when UPSTASH_REDIS_REST_URL and
 *   UPSTASH_REDIS_REST_TOKEN are configured.
 * - Acquisition uses SET NX PX.
 * - Release uses an atomic Lua compare-and-delete so one owner
 *   cannot accidentally release another owner's lock.
 *
 * Local development:
 * - Falls back to a process-local lock when Redis is not configured.
 * - The fallback is intentionally not advertised as cross-instance.
 */
export class DistributedLock {
  private static readonly RETRY_INTERVAL_MS = 100;

  /**
   * Lease lifetime is deliberately separate from the acquisition timeout.
   *
   * The caller may wait only 5 seconds to obtain the lock while the
   * protected AI operation itself can take substantially longer.
   *
   * Redis automatically releases an abandoned lock after this lease.
   */
  private static readonly LEASE_MS = 5 * 60 * 1000;

  private static readonly KEY_PREFIX =
    "trajectoire:distributed-lock:";

  private static redisClient: Redis | null | undefined;

  /**
   * Tokens owned by this Node process.
   *
   * This also allows the public release(key) compatibility method to
   * release only a lock that was actually acquired by this process.
   */
  private static readonly ownedTokens =
    new Map<string, string>();

  /**
   * Process-local fallback used only when Upstash Redis is not configured.
   */
  private static readonly localLocks =
    new Map<string, string>();

  private static warnedAboutLocalFallback = false;

  /**
   * Acquire a lock on a logical resource.
   *
   * @param key Unique logical key, for example `session:<sessionId>`.
   * @param timeoutMs Maximum time to wait for acquisition.
   * @returns Async release callback.
   */
  static async acquire(
    key: string,
    timeoutMs: number = 5000,
  ): Promise<() => Promise<void>> {
    const token = randomUUID();

    const redis = this.getRedis();

    const lockKey = this.redisKey(key);

    const startedAt = Date.now();

    logger.info(
      "Attempting to acquire distributed lock",
      {
        key,
        timeoutMs,
        backend: redis ? "redis" : "local",
      },
    );

    while (Date.now() - startedAt < timeoutMs) {
      try {
        const acquired = redis
          ? await this.tryAcquireRedis(
              redis,
              lockKey,
              token,
            )
          : this.tryAcquireLocal(
              key,
              token,
            );

        if (acquired) {
          this.ownedTokens.set(
            key,
            token,
          );

          logger.info(
            "Distributed lock acquired",
            {
              key,
              backend:
                redis
                  ? "redis"
                  : "local",
            },
          );

          let released = false;

          return async () => {
            if (released) {
              return;
            }

            released = true;

            await this.releaseOwned(
              key,
              token,
            );
          };
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        logger.error(
          "Distributed lock acquisition failed",
          {
            key,
            error: message,
          },
        );

        throw new AppError(
          `Failed to acquire distributed lock: ${message}`,
          ErrorCode.DATABASE_ERROR,
          500,
        );
      }

      await this.sleep(
        this.RETRY_INTERVAL_MS,
      );
    }

    throw new AppError(
      "Failed to acquire distributed lock: timeout",
      ErrorCode.INTERNAL_ERROR,
      408,
      true,
      {
        key,
        timeoutMs,
      },
    );
  }

  /**
   * Compatibility release method.
   *
   * Only releases a token owned by the current process. This prevents a
   * caller from deleting another worker's Redis lock by key alone.
   */
  static async release(
    key: string,
  ): Promise<void> {
    const token =
      this.ownedTokens.get(key);

    if (!token) {
      logger.info(
        "Distributed lock release ignored: lock not owned by process",
        {
          key,
        },
      );

      return;
    }

    await this.releaseOwned(
      key,
      token,
    );
  }

  /**
   * Execute an operation while holding the resource lock.
   */
  static async execute<T>(
    key: string,
    fn: () => Promise<T>,
    timeoutMs: number = 5000,
  ): Promise<T> {
    const release =
      await this.acquire(
        key,
        timeoutMs,
      );

    try {
      return await fn();
    } finally {
      await release();
    }
  }

  private static getRedis():
    | Redis
    | null {
    if (
      this.redisClient !== undefined
    ) {
      return this.redisClient;
    }

    const url =
      process.env
        .UPSTASH_REDIS_REST_URL;

    const token =
      process.env
        .UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      this.redisClient = null;

      if (
        !this.warnedAboutLocalFallback
      ) {
        this.warnedAboutLocalFallback =
          true;

        logger.info(
          "Upstash Redis not configured; DistributedLock is using process-local fallback",
        );
      }

      return null;
    }

    this.redisClient =
      new Redis({
        url,
        token,
      });

    return this.redisClient;
  }

  private static redisKey(
    key: string,
  ): string {
    return `${this.KEY_PREFIX}${key}`;
  }

  private static async tryAcquireRedis(
    redis: Redis,
    lockKey: string,
    token: string,
  ): Promise<boolean> {
    const result =
      await redis.set(
        lockKey,
        token,
        {
          nx: true,
          px: this.LEASE_MS,
        },
      );

    return result === "OK";
  }

  private static tryAcquireLocal(
    key: string,
    token: string,
  ): boolean {
    if (
      this.localLocks.has(key)
    ) {
      return false;
    }

    this.localLocks.set(
      key,
      token,
    );

    return true;
  }

  private static async releaseOwned(
    key: string,
    token: string,
  ): Promise<void> {
    const redis =
      this.getRedis();

    try {
      if (redis) {
        await this.releaseRedis(
          redis,
          this.redisKey(key),
          token,
        );
      } else {
        this.releaseLocal(
          key,
          token,
        );
      }

      logger.info(
        "Distributed lock released",
        {
          key,
          backend:
            redis
              ? "redis"
              : "local",
        },
      );
    } catch (error) {
      logger.error(
        "Failed to release distributed lock",
        {
          key,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        },
      );

      /*
       * Keep the historical release behaviour:
       * release failures must not replace the result/error of the
       * protected business operation.
       */
    } finally {
      if (
        this.ownedTokens.get(key) ===
        token
      ) {
        this.ownedTokens.delete(key);
      }
    }
  }

  private static async releaseRedis(
    redis: Redis,
    lockKey: string,
    token: string,
  ): Promise<void> {
    /*
     * Atomic compare-and-delete.
     *
     * A simple GET followed by DEL would contain a race:
     * the lease could expire and another process could acquire the lock
     * between those two commands.
     */
    const releaseScript = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      end

      return 0
    `;

    await redis.eval(
      releaseScript,
      [lockKey],
      [token],
    );
  }

  private static releaseLocal(
    key: string,
    token: string,
  ): void {
    if (
      this.localLocks.get(key) ===
      token
    ) {
      this.localLocks.delete(key);
    }
  }

  private static sleep(
    ms: number,
  ): Promise<void> {
    return new Promise(
      (resolve) =>
        setTimeout(resolve, ms),
    );
  }
}
