/**
 * Circuit Breaker Pattern
 * Prevents cascading failures by stopping calls to failing services
 * States: CLOSED (normal), OPEN (circuit open, calls fail fast), HALF_OPEN (testing if service recovered)
 */

import { ExternalServiceError } from "@/core/errors";
import { logger } from "@/lib/logger/Logger";

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface CircuitBreakerConfig {
  /**
   * Number of consecutive failures before opening the circuit
   */
  failureThreshold: number;

  /**
   * Time in milliseconds to wait before transitioning from OPEN to HALF_OPEN
   */
  recoveryTimeout: number;

  /**
   * Number of consecutive successes before transitioning from HALF_OPEN to CLOSED
   */
  successThreshold: number;

  /**
   * Time window to track failures (in milliseconds)
   */
  timeout: number;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
}

export interface ICircuitBreaker {
  /**
   * Execute a function through the circuit breaker
   * @param fn - Function to execute
   * @returns Function result
   * @throws ExternalServiceError if circuit is open
   */
  execute<T>(fn: () => Promise<T>): Promise<T>;

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitState;

  /**
   * Get circuit breaker statistics
   */
  getStats(): CircuitBreakerStats;

  /**
   * Reset the circuit breaker to CLOSED state
   */
  reset(): void;
}

export class CircuitBreaker implements ICircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  private nextAttemptTime?: number;

  constructor(
    private readonly name: string,
    private readonly config: CircuitBreakerConfig
  ) {
    logger.info("CircuitBreaker initialized", { name, config });
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    // If circuit is OPEN, check if we can transition to HALF_OPEN
    if (currentState === CircuitState.OPEN) {
      if (Date.now() >= (this.nextAttemptTime || 0)) {
        this.transitionToHalfOpen();
        logger.info("Circuit breaker transitioned to HALF_OPEN", { name: this.name });
      } else {
        logger.warn("Circuit breaker is OPEN, rejecting request", { name: this.name });
        throw new ExternalServiceError(
          `Circuit breaker is OPEN for ${this.name}. Service is temporarily unavailable.`,
          this.name
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
    };
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
    this.nextAttemptTime = undefined;
    logger.info("Circuit breaker reset", { name: this.name });
  }

  private onSuccess(): void {
    this.successCount++;
    this.lastSuccessTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successCount >= this.config.successThreshold) {
        this.transitionToClosed();
        logger.info("Circuit breaker transitioned to CLOSED", { name: this.name });
      }
    } else {
      // Reset failure count on success in CLOSED state
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToOpen();
      logger.warn("Circuit breaker transitioned to OPEN from HALF_OPEN", { name: this.name });
    } else if (this.failureCount >= this.config.failureThreshold) {
      this.transitionToOpen();
      logger.warn("Circuit breaker transitioned to OPEN", { name: this.name, failureCount: this.failureCount });
    }
  }

  private transitionToClosed(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttemptTime = undefined;
  }

  private transitionToOpen(): void {
    this.state = CircuitState.OPEN;
    this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    this.successCount = 0;
  }

  private transitionToHalfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    this.successCount = 0;
  }
}

/**
 * Default circuit breaker configurations
 */
export const CircuitBreakerDefaults = {
  OPENAI: {
    failureThreshold: 5,
    recoveryTimeout: 60000, // 1 minute
    successThreshold: 2,
    timeout: 30000, // 30 seconds
  },
  SUPABASE: {
    failureThreshold: 10,
    recoveryTimeout: 30000, // 30 seconds
    successThreshold: 3,
    timeout: 10000, // 10 seconds
  },
  HTTP_EXTERNAL: {
    failureThreshold: 5,
    recoveryTimeout: 60000, // 1 minute
    successThreshold: 2,
    timeout: 15000, // 15 seconds
  },
} as const;
