import { Injectable, Logger } from '@nestjs/common';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error) => void;
}

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      backoffMultiplier = 2,
      retryableErrors = [],
      onRetry,
    } = options;

    let lastError: Error;
    let currentDelay = initialDelay;

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

        if (!isRetryable) {
          this.logger.error(
            `Non-retryable error on attempt ${attempt}: ${lastError.message}`,
          );
          throw error;
        }

        if (attempt === maxAttempts) {
          this.logger.error(
            `Operation failed after ${attempt} attempts: ${lastError.message}`,
          );
          throw error;
        }

        this.logger.warn(
          `Attempt ${attempt} failed. Retrying in ${currentDelay}ms...`,
        );

        if (onRetry) {
          onRetry(attempt, lastError);
        }

        await this.sleep(currentDelay);
        currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
