/**
 * Retry Policy with Exponential Backoff and Jitter
 * Implements enterprise-grade retry logic with jitter to prevent thundering herd
 */

import { logger } from "@/lib/logger/Logger";
import { TimeoutError, ExternalServiceError, ValidationError, BusinessError, ForbiddenError, ConflictError } from "@/core/errors";

export interface RetryPolicyConfig {
  /**
   * Maximum number of retry attempts
   */
  maxAttempts: number;

  /**
   * Initial delay in milliseconds
   */
  initialDelayMs: number;

  /**
   * Maximum delay in milliseconds
   */
  maxDelayMs: number;

  /**
   * Multiplier for exponential backoff
   */
  backoffMultiplier: number;

  /**
   * Jitter factor (0-1) to add randomness
   */
  jitterFactor: number;
}

export interface RetryStats {
  attempt: number;
  totalAttempts: number;
  delayMs: number;
  error?: Error;
}

/**
 * Error types that should NOT be retried
 */
const NON_RETRYABLE_ERRORS = [
  ValidationError,
  BusinessError,
  ForbiddenError,
  ConflictError,
];

/**
 * HTTP status codes that should be retried
 */
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  // Check if error is a non-retryable business error
  if (error instanceof Error) {
    for (const ErrorType of NON_RETRYABLE_ERRORS) {
      if (error instanceof ErrorType) {
        return false;
      }
    }

    // Check for timeout errors
    if (error instanceof TimeoutError) {
      return true;
    }

    // Check for external service errors
    if (error instanceof ExternalServiceError) {
      return true;
    }

    // Check HTTP status codes if available
    const statusCode = (error as any).statusCode;
    if (statusCode && RETRYABLE_STATUS_CODES.includes(statusCode)) {
      return true;
    }

    // Check for network errors
    if (error.message.includes("ECONNREFUSED") || 
        error.message.includes("ETIMEDOUT") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("ECONNRESET")) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, config: RetryPolicyConfig): number {
  // Exponential backoff: delay = initial * (multiplier ^ attempt)
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt);
  
  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, config.maxDelayMs);
  
  // Add jitter: random value between -jitter and +jitter
  const jitter = cappedDelay * config.jitterFactor * (Math.random() * 2 - 1);
  
  return Math.max(0, Math.floor(cappedDelay + jitter));
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry Policy Class
 */
export class RetryPolicy {
  constructor(
    private readonly name: string,
    private readonly config: RetryPolicyConfig
  ) {
    logger.info("RetryPolicy initialized", { name, config });
  }

  /**
   * Execute a function with retry logic
   * @param fn - Function to execute
   * @returns Function result
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < this.config.maxAttempts; attempt++) {
      try {
        if (attempt > 0) {
          const delayMs = calculateDelay(attempt - 1, this.config);
          logger.info("Retrying after delay", {
            name: this.name,
            attempt: attempt + 1,
            totalAttempts: this.config.maxAttempts,
            delayMs,
          });
          await sleep(delayMs);
        }

        const result = await fn();
        
        if (attempt > 0) {
          logger.info("Retry succeeded", {
            name: this.name,
            attempt: attempt + 1,
          });
        }
        
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check if error is retryable
        if (!isRetryableError(error)) {
          logger.warn("Non-retryable error, aborting retry", {
            name: this.name,
            error: lastError.message,
          });
          throw error;
        }

        logger.warn("Retry attempt failed", {
          name: this.name,
          attempt: attempt + 1,
          totalAttempts: this.config.maxAttempts,
          error: lastError.message,
        });

        // If this was the last attempt, throw the error
        if (attempt === this.config.maxAttempts - 1) {
          logger.error("All retry attempts exhausted", {
            name: this.name,
            totalAttempts: this.config.maxAttempts,
            error: lastError.message,
          });
          throw error;
        }
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError || new Error("Retry failed");
  }

  /**
   * Get retry policy configuration
   */
  getConfig(): RetryPolicyConfig {
    return { ...this.config };
  }
}

/**
 * Default retry policy configurations
 */
export const RetryPolicyDefaults = {
  OPENAI: {
    maxAttempts: 3,
    initialDelayMs: 200,
    maxDelayMs: 1600,
    backoffMultiplier: 2,
    jitterFactor: 0.1,
  },
  SUPABASE: {
    maxAttempts: 2,
    initialDelayMs: 100,
    maxDelayMs: 400,
    backoffMultiplier: 2,
    jitterFactor: 0.1,
  },
  HTTP_EXTERNAL: {
    maxAttempts: 3,
    initialDelayMs: 200,
    maxDelayMs: 1600,
    backoffMultiplier: 2,
    jitterFactor: 0.1,
  },
} as const;
