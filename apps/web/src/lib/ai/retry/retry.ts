/**
 * Retry Logic
 * Intelligent retry mechanism with exponential backoff and fallback
 */

import { ExternalServiceError } from "@/core/errors";

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableErrors: string[];
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalDelay: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 2000, // 2 seconds
  maxDelay: 8000, // 8 seconds
  backoffMultiplier: 2,
  retryableErrors: [
    "timeout",
    "429", // Rate limit
    "500", // Internal server error
    "502", // Bad gateway
    "503", // Service unavailable
    "504", // Gateway timeout
    "ECONNRESET",
    "ETIMEDOUT",
  ],
};

/**
 * Execute a function with retry logic
 * @param fn - Function to execute
 * @param options - Retry options
 * @returns Retry result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<RetryResult<T>> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | undefined;
  let totalDelay = 0;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts: attempt + 1,
        totalDelay,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if error is retryable
      if (!isRetryableError(lastError, opts.retryableErrors)) {
        return {
          success: false,
          error: lastError,
          attempts: attempt + 1,
          totalDelay,
        };
      }

      // Don't delay after the last attempt
      if (attempt < opts.maxRetries) {
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
          opts.maxDelay
        );
        totalDelay += delay;
        await sleep(delay);
      }
    }
  }

  return {
    success: false,
    error: lastError,
    attempts: opts.maxRetries + 1,
    totalDelay,
  };
}

/**
 * Check if an error is retryable
 * @param error - Error to check
 * @param retryableErrors - List of retryable error patterns
 * @returns True if error is retryable
 */
function isRetryableError(error: Error, retryableErrors: string[]): boolean {
  const errorMessage = error.message.toLowerCase();
  return retryableErrors.some((pattern) =>
    errorMessage.includes(pattern.toLowerCase())
  );
}

/**
 * Sleep for a specified duration
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute with fallback to a secondary function
 * @param primaryFn - Primary function to try
 * @param fallbackFn - Fallback function if primary fails
 * @param options - Retry options for primary function
 * @returns Result from primary or fallback
 */
export async function withFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const primaryResult = await withRetry(primaryFn, options);

  if (primaryResult.success && primaryResult.data) {
    return primaryResult.data;
  }

  // Primary failed, try fallback
  try {
    return await fallbackFn();
  } catch (error) {
    throw new ExternalServiceError(`Both primary and fallback failed: ${error instanceof Error ? error.message : "Unknown error"}`, "Retry");
  }
}
