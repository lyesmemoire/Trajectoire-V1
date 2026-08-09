import { Injectable, Logger } from '@nestjs/common';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  successThreshold?: number;
  timeout?: number;
  resetTimeout?: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuits = new Map<string, CircuitBreaker>();

  getCircuit(
    name: string,
    options: CircuitBreakerOptions = {},
  ): CircuitBreaker {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, new CircuitBreaker(name, options, this.logger));
    }
    return this.circuits.get(name)!;
  }

  async execute<T>(
    circuitName: string,
    fn: () => Promise<T>,
    options?: CircuitBreakerOptions,
  ): Promise<T> {
    const circuit = this.getCircuit(circuitName, options);
    return circuit.execute(fn);
  }

  getCircuitState(name: string): CircuitState {
    const circuit = this.circuits.get(name);
    return circuit?.state || CircuitState.CLOSED;
  }

  resetCircuit(name: string): void {
    const circuit = this.circuits.get(name);
    if (circuit) {
      circuit.reset();
    }
  }
}

class CircuitBreaker {
  private _state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number = 0;
  private nextAttemptTime: number = 0;

  constructor(
    private readonly name: string,
    private readonly options: CircuitBreakerOptions,
    private readonly logger: Logger,
  ) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      successThreshold: options.successThreshold || 2,
      timeout: options.timeout || 10000,
      resetTimeout: options.resetTimeout || 60000,
      ...options,
    };
  }

  get state(): CircuitState {
    return this._state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this._state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        throw new CircuitBreakerOpenError(
          `Circuit ${this.name} is OPEN. Rejecting request.`,
        );
      }
      this.transitionToHalfOpen();
    }

    try {
      const result = await Promise.race([
        fn(),
        this.createTimeoutPromise<T>(this.options.timeout!),
      ]);

      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this._state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold!) {
        this.transitionToClosed();
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    if (this.failureCount >= this.options.failureThreshold!) {
      this.transitionToOpen();
    }
  }

  private transitionToClosed(): void {
    this._state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.logger.log(`Circuit ${this.name} transitioned to CLOSED`);
  }

  private transitionToOpen(): void {
    this._state = CircuitState.OPEN;
    this.nextAttemptTime = Date.now() + this.options.resetTimeout!;
    this.logger.warn(
      `Circuit ${this.name} transitioned to OPEN. Will retry at ${new Date(this.nextAttemptTime).toISOString()}`,
    );
  }

  private transitionToHalfOpen(): void {
    this._state = CircuitState.HALF_OPEN;
    this.successCount = 0;
    this.logger.log(`Circuit ${this.name} transitioned to HALF_OPEN`);
  }

  private createTimeoutPromise<T>(timeout: number): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  reset(): void {
    this.transitionToClosed();
  }
}

export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}
