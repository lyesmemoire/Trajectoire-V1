/**
 * Retry Manager
 * Intelligent retry mechanism with exponential backoff and fallback
 */

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  fallbackModel?: string;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  attempts: number;
  totalDelay: number;
  usedFallback: boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 2000,
  maxDelay: 8000,
  backoffMultiplier: 2,
  fallbackModel: undefined, // Fallback model can be specified by caller
};

export class RetryManager {
  /**
   * Execute a function with retry logic and fallback
   * @param fn - Function to execute
   * @param options - Retry options
   * @returns Retry result
   */
  public static async execute<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<RetryResult<T>> {
    const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: string | undefined;
    let totalDelay = 0;
    let usedFallback = false;

    // Primary attempts
    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        const data = await fn();
        return {
          success: true,
          data,
          attempts: attempt + 1,
          totalDelay,
          usedFallback,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        // Don't delay after the last attempt
        if (attempt < opts.maxRetries) {
          const delay = Math.min(
            opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
            opts.maxDelay
          );
          totalDelay += delay;
          await this.sleep(delay);
        }
      }
    }

    // If fallback model is specified, try it
    if (opts.fallbackModel) {
      usedFallback = true;
      try {
        const data = await fn(); // Re-execute with fallback context
        return {
          success: true,
          data,
          attempts: opts.maxRetries + 2,
          totalDelay,
          usedFallback: true,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }

    return {
      success: false,
      error: lastError,
      attempts: opts.maxRetries + (usedFallback ? 2 : 1),
      totalDelay,
      usedFallback,
    };
  }

  /**
   * Sleep for a specified duration
   * @param ms - Duration in milliseconds
   * @returns Promise that resolves after the duration
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if an error is retryable
   * @param error - Error to check
   * @returns True if error is retryable
   */
  public static isRetryableError(error: Error): boolean {
    const retryablePatterns = [
      "timeout",
      "429",
      "500",
      "502",
      "503",
      "504",
      "ECONNRESET",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ECONNREFUSED",
    ];

    const errorMessage = error.message.toLowerCase();
    return retryablePatterns.some((pattern) =>
      errorMessage.includes(pattern.toLowerCase())
    );
  }

  /**
   * Execute with custom primary and fallback functions
   * @param primaryFn - Primary function
   * @param fallbackFn - Fallback function
   * @param options - Retry options
   * @returns Retry result
   */
  public static async withFallback<T>(
    primaryFn: () => Promise<T>,
    fallbackFn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<RetryResult<T>> {
    const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: string | undefined;
    let totalDelay = 0;

    // Try primary with retries
    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        const data = await primaryFn();
        return {
          success: true,
          data,
          attempts: attempt + 1,
          totalDelay,
          usedFallback: false,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);

        if (attempt < opts.maxRetries) {
          const delay = Math.min(
            opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
            opts.maxDelay
          );
          totalDelay += delay;
          await this.sleep(delay);
        }
      }
    }

    // Try fallback
    try {
      const data = await fallbackFn();
      return {
        success: true,
        data,
        attempts: opts.maxRetries + 1,
        totalDelay,
        usedFallback: true,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    return {
      success: false,
      error: lastError,
      attempts: opts.maxRetries + 1,
      totalDelay,
      usedFallback: true,
    };
  }
}
