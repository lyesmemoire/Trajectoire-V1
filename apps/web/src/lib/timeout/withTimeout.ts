/**
 * Timeout Helper
 * Wraps promises with timeout functionality
 */

import { TimeoutError } from "@/core/errors";

/**
 * Execute a promise with a timeout
 * @param promise - Promise to execute
 * @param timeoutMs - Timeout in milliseconds
 * @param operation - Operation name for error reporting
 * @returns Promise result
 * @throws TimeoutError if timeout is exceeded
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`, operation, timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Timeout configurations for different operations
 */
export const TIMEOUT_CONFIG = {
  OPENAI: 30000, // 30 seconds
  SUPABASE: 10000, // 10 seconds
  HTTP_EXTERNAL: 15000, // 15 seconds
  DEFAULT: 5000, // 5 seconds
} as const;
