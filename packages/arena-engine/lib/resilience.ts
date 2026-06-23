/**
 * Resilience patterns for critical paths.
 */

/**
 * Returns a promise that resolves with the result of the given promise,
 * or resolves with the fallback value if the promise takes longer than ms.
 * If no fallback is provided, it throws a TimeoutError.
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallbackValue?: T
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (fallbackValue !== undefined) {
        resolve(fallbackValue);
      } else {
        reject(new TimeoutError(`Operation timed out after ${ms}ms`));
      }
    }, ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED';
  private failures = 0;
  private nextAttempt = Date.now();
  
  constructor(private options: CircuitBreakerOptions) {}

  getState(): CircuitBreakerState {
    if (this.state === 'OPEN' && Date.now() >= this.nextAttempt) {
      return 'HALF_OPEN';
    }
    return this.state;
  }

  async execute<T>(action: () => Promise<T>, fallbackValue?: T): Promise<T> {
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      if (fallbackValue !== undefined) return fallbackValue;
      throw new Error('CircuitBreaker is OPEN');
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallbackValue !== undefined) return fallbackValue;
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= this.options.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.resetTimeoutMs;
    }
  }
}

/**
 * Basic Token Bucket or Time Window rate limiter per session.
 */
export class SessionRateLimiter {
  // sessionId -> array of timestamps
  private limits = new Map<string, number[]>();

  constructor(private windowMs: number, private maxRequests: number) {}

  /**
   * Returns true if allowed, false if rate limited.
   */
  consume(sessionId: string): boolean {
    const now = Date.now();
    const requests = this.limits.get(sessionId) || [];
    
    // Filter out old timestamps
    const validRequests = requests.filter(ts => now - ts < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      this.limits.set(sessionId, validRequests); // optimize memory
      return false;
    }
    
    validRequests.push(now);
    this.limits.set(sessionId, validRequests);
    return true;
  }

  cleanup(sessionId: string) {
    this.limits.delete(sessionId);
  }
}
