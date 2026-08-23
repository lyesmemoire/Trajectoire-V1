export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallbackValue?: T,
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => {
      if (fallbackValue !== undefined) {
        resolve(fallbackValue);
        return;
      }

      reject(new TimeoutError(`Operation timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeoutMs: number;
}

export type CircuitBreakerState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: CircuitBreakerState = "CLOSED";
  private failures = 0;
  private nextAttempt = 0;

  constructor(private readonly options: CircuitBreakerOptions) {}

  getState(): CircuitBreakerState {
    if (
      this.state === "OPEN" &&
      Date.now() >= this.nextAttempt
    ) {
      return "HALF_OPEN";
    }

    return this.state;
  }

  async execute<T>(
    action: () => Promise<T>,
    fallbackValue?: T,
  ): Promise<T> {
    const currentState = this.getState();

    if (currentState === "OPEN") {
      if (fallbackValue !== undefined) {
        return fallbackValue;
      }

      throw new Error("CircuitBreaker is OPEN");
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      if (fallbackValue !== undefined) {
        return fallbackValue;
      }

      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = "CLOSED";
    this.nextAttempt = 0;
  }

  private onFailure(): void {
    this.failures += 1;

    if (this.failures >= this.options.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt =
        Date.now() + this.options.resetTimeoutMs;
    }
  }
}

export class SessionRateLimiter {
  private readonly limits = new Map<string, number[]>();

  constructor(
    private readonly windowMs: number,
    private readonly maxRequests: number,
  ) {}

  consume(sessionId: string): boolean {
    const now = Date.now();

    const requests =
      this.limits.get(sessionId) ?? [];

    const validRequests = requests.filter(
      (timestamp) =>
        now - timestamp < this.windowMs,
    );

    if (validRequests.length >= this.maxRequests) {
      this.limits.set(sessionId, validRequests);
      return false;
    }

    validRequests.push(now);
    this.limits.set(sessionId, validRequests);

    return true;
  }

  cleanup(sessionId: string): void {
    this.limits.delete(sessionId);
  }
}