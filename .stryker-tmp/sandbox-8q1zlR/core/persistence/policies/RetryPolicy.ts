/**
 * Retry Policy
 *
 * Configurable retry policy with exponential backoff.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY retry execution logic.
 */
// @ts-nocheck


// ============================================================================
// RETRY POLICY INTERFACE
// ============================================================================

export interface RetryPolicy {
  /**
   * Execute operation with retry logic
   */
  execute<T>(operation: () => Promise<T>): Promise<T>;
}

// ============================================================================
// RETRY POLICY CONFIGURATION
// ============================================================================

export interface RetryPolicyConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryPolicyConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

// ============================================================================
// RETRY POLICY IMPLEMENTATION
// ============================================================================

export class RetryPolicyImpl implements RetryPolicy {
  private config: RetryPolicyConfig;

  constructor(config: RetryPolicyConfig = DEFAULT_RETRY_CONFIG) {
    this.config = config;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.config.initialDelay;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on last attempt
        if (attempt === this.config.maxRetries) {
          throw lastError;
        }

        // Wait with exponential backoff
        await this.delay(delay);
        delay = Math.min(
          delay * this.config.backoffMultiplier,
          this.config.maxDelay,
        );
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
