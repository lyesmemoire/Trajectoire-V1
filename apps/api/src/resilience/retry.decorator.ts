import { applyDecorators } from '@nestjs/common';

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffMultiplier?: number;
  maxDelay?: number;
  retryableErrors?: string[];
}

export function Retry(options: RetryOptions = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
    retryableErrors = [],
  } = options;

  return applyDecorators();
  // This decorator would be implemented with actual retry logic
  // For now, it's a placeholder for the retry mechanism
  // In production, use @nestjs/throttler or custom retry logic
}

export class RetryService {
  static async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delay = 1000,
      backoffMultiplier = 2,
      maxDelay = 10000,
      retryableErrors = [],
    } = options;

    let lastError: Error;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        const isRetryable =
          retryableErrors.length === 0 ||
          retryableErrors.some(
            (err) => error instanceof Error && error.message.includes(err),
          );

        if (!isRetryable || attempt === maxAttempts) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
      }
    }

    throw lastError!;
  }
}
