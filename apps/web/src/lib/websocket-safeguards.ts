/**
 * WebSocket V3 Safeguards
 * 
 * Garde-fous pour les connexions WebSocket :
 * - Circuit breaker Redis (timeout 500ms, fallback gracieux)
 * - Timeout DB explicite (3s max)
 * - Rate limiting par session (anti-spam)
 */

export interface CircuitBreakerConfig {
  timeout: number;
  failureThreshold: number;
  recoveryTimeout: number;
}

export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: number | null;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = {
    isOpen: false,
    failureCount: 0,
    lastFailureTime: null,
  };

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.isOpen) {
      const now = Date.now();
      if (this.state.lastFailureTime && 
          now - this.state.lastFailureTime > this.config.recoveryTimeout) {
        // Tentative de réouverture
        this.state.isOpen = false;
        this.state.failureCount = 0;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        this.timeoutPromise(this.config.timeout),
      ]);
      
      // Reset failure count on success
      this.state.failureCount = 0;
      return result;
    } catch (error) {
      this.state.failureCount++;
      this.state.lastFailureTime = Date.now();

      if (this.state.failureCount >= this.config.failureThreshold) {
        this.state.isOpen = true;
      }

      throw error;
    }
  }

  private timeoutPromise<T>(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timeout after ${timeout}ms`)), timeout);
    });
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: null,
    };
  }
}

export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private config: RateLimiterConfig) {}

  check(sessionId: string): boolean {
    const now = Date.now();
    const sessionRequests = this.requests.get(sessionId) || [];

    // Remove requests outside the window
    const validRequests = sessionRequests.filter(
      timestamp => now - timestamp < this.config.windowMs
    );

    if (validRequests.length >= this.config.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(sessionId, validRequests);

    // Cleanup old sessions periodically
    if (this.requests.size > 1000) {
      this.cleanup(now);
    }

    return true;
  }

  private cleanup(now: number): void {
    for (const [sessionId, timestamps] of this.requests.entries()) {
      const validRequests = timestamps.filter(
        timestamp => now - timestamp < this.config.windowMs
      );
      
      if (validRequests.length === 0) {
        this.requests.delete(sessionId);
      } else {
        this.requests.set(sessionId, validRequests);
      }
    }
  }

  reset(sessionId: string): void {
    this.requests.delete(sessionId);
  }

  getStats(): { totalSessions: number; totalRequests: number } {
    let totalRequests = 0;
    for (const timestamps of this.requests.values()) {
      totalRequests += timestamps.length;
    }

    return {
      totalSessions: this.requests.size,
      totalRequests,
    };
  }
}

export const defaultCircuitBreakerConfig: CircuitBreakerConfig = {
  timeout: 500,
  failureThreshold: 5,
  recoveryTimeout: 60000, // 1 minute
};

export const defaultRateLimiterConfig: RateLimiterConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
};

export const dbTimeout = 3000; // 3 seconds max for DB operations
