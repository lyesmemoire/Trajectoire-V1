import { ProviderError } from "../errors/ProviderErrors.js";

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  readonly failureThreshold: number;
  readonly resetTimeoutMs: number;
  readonly halfOpenMaxAttempts: number;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
  halfOpenMaxAttempts: 1
};

export class CircuitBreakerDecorator {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenAttempts = 0;
  private readonly options: CircuitBreakerOptions;

  constructor(
    private readonly providerName: string,
    options?: Partial<CircuitBreakerOptions>
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.options.resetTimeoutMs) {
        this.state = "HALF_OPEN";
        this.halfOpenAttempts = 0;
      } else {
        throw new ProviderError(
          `Circuit breaker OPEN for provider ${this.providerName}. Refusing call.`,
          this.providerName
        );
      }
    }

    if (this.state === "HALF_OPEN" && this.halfOpenAttempts >= this.options.halfOpenMaxAttempts) {
      this.trip();
      throw new ProviderError(
        `Circuit breaker tripped again for ${this.providerName} during HALF_OPEN probe.`,
        this.providerName
      );
    }

    try {
      if (this.state === "HALF_OPEN") {
        this.halfOpenAttempts += 1;
      }
      const result = await operation();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure(): void {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.options.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    this.state = "OPEN";
    this.failureCount = 0;
  }

  private reset(): void {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.halfOpenAttempts = 0;
  }

  public getState(): CircuitState {
    return this.state;
  }
}
