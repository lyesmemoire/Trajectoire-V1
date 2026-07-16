/**
 * Retry Policy
 *
 * Handles retry logic for AI provider requests with exponential backoff.
 */

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableErrors?: string[]; // Error codes that are retryable
}

export interface RetryResult {
  success: boolean;
  attempts: number;
  totalDelay: number;
  lastError?: Error;
}

/**
 * Retry Policy
 *
 * Implements retry logic with exponential backoff.
 */
export class RetryPolicy {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxRetries: 2,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryableErrors: ["rate_limit_exceeded", "server_error", "timeout"],
      ...config,
    };
  }

  /**
   * Execute a function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    isRetryable: (error: Error) => boolean = this.defaultIsRetryable.bind(this)
  ): Promise<RetryResult & { data?: T }> {
    let lastError: Error | undefined;
    let totalDelay = 0;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const data = await fn();
        return {
          success: true,
          attempts: attempt + 1,
          totalDelay,
          data,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.config.maxRetries || !isRetryable(lastError)) {
          break;
        }

        const delay = this.calculateDelay(attempt);
        totalDelay += delay;
        await this.sleep(delay);
      }
    }

    return {
      success: false,
      attempts: this.config.maxRetries + 1,
      totalDelay,
      lastError,
    };
  }

  /**
   * Calculate delay for a given attempt with exponential backoff
   */
  private calculateDelay(attempt: number): number {
    const delay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt);
    return Math.min(delay, this.config.maxDelay);
  }

  /**
   * Sleep for a given duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Default retryable error check
   */
  private defaultIsRetryable(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    
    // Check for retryable error codes
    if (this.config.retryableErrors) {
      for (const code of this.config.retryableErrors) {
        if (errorMessage.includes(code)) {
          return true;
        }
      }
    }

    // Check for common retryable error patterns
    const retryablePatterns = [
      "rate limit",
      "timeout",
      "server error",
      "internal error",
      "503",
      "502",
      "500",
      "429",
    ];

    for (const pattern of retryablePatterns) {
      if (errorMessage.includes(pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Update retry configuration
   */
  updateConfig(config: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): RetryConfig {
    return { ...this.config };
  }
}
