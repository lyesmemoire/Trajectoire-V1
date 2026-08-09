/**
 * Resilience Manager - SPRINT-4.4
 * 
 * Comprehensive resilience patterns for all external API calls:
 * - Circuit Breaker
 * - Retry with exponential backoff
 * - Timeout handling
 * - Bulkhead (concurrency limiting)
 * - Idempotency
 * - Rollback and compensation
 * - Dead Letter Queue
 */

export interface ResilienceConfig {
  circuitBreaker?: {
    failureThreshold: number;
    recoveryTimeout: number;
    halfOpenMaxCalls: number;
  };
  retry?: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
  };
  timeout?: {
    duration: number;
  };
  bulkhead?: {
    maxConcurrent: number;
    maxQueueSize: number;
  };
  idempotency?: {
    enabled: boolean;
    ttl: number;
  };
}

export const defaultResilienceConfig: ResilienceConfig = {
  circuitBreaker: {
    failureThreshold: 5,
    recoveryTimeout: 60000,
    halfOpenMaxCalls: 3,
  },
  retry: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  timeout: {
    duration: 30000,
  },
  bulkhead: {
    maxConcurrent: 10,
    maxQueueSize: 20,
  },
  idempotency: {
    enabled: true,
    ttl: 3600000, // 1 hour
  },
};

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenCallCount = 0;

  constructor(private config: ResilienceConfig['circuitBreaker']) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.config!.recoveryTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.halfOpenCallCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      
      if (this.state === CircuitState.HALF_OPEN) {
        this.halfOpenCallCount++;
        if (this.halfOpenCallCount >= this.config!.halfOpenMaxCalls) {
          this.state = CircuitState.CLOSED;
          this.failureCount = 0;
        }
      }
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      if (this.failureCount >= this.config!.failureThreshold) {
        this.state = CircuitState.OPEN;
      }
      
      throw error;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.halfOpenCallCount = 0;
  }
}

export class RetryPolicy {
  constructor(private config: ResilienceConfig['retry']) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error;
    let delay = this.config!.initialDelay;

    for (let attempt = 1; attempt <= this.config!.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.config!.maxAttempts) {
          break;
        }

        await this.sleep(delay);
        delay = Math.min(delay * this.config!.backoffMultiplier, this.config!.maxDelay);
      }
    }

    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class TimeoutHandler {
  constructor(private config: ResilienceConfig['timeout']) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      this.createTimeout(this.config!.duration),
    ]);
  }

  private createTimeout(duration: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), duration);
    });
  }
}

export class Bulkhead {
  private activeCalls = 0;
  private queue: Array<() => void> = [];

  constructor(private config: ResilienceConfig['bulkhead']) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.activeCalls++;
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeCalls--;
          this.processQueue();
        }
      };

      if (this.activeCalls < this.config!.maxConcurrent) {
        execute();
      } else if (this.queue.length < this.config!.maxQueueSize) {
        this.queue.push(execute);
      } else {
        reject(new Error('Bulkhead queue is full'));
      }
    });
  }

  private processQueue(): void {
    if (this.queue.length > 0 && this.activeCalls < this.config!.maxConcurrent) {
      const next = this.queue.shift();
      if (next) next();
    }
  }

  getActiveCalls(): number {
    return this.activeCalls;
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}

export class IdempotencyManager {
  private cache = new Map<string, { result: any; timestamp: number }>();

  constructor(private config: ResilienceConfig['idempotency']) {}

  async execute<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (!this.config!.enabled) {
      return fn();
    }

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config!.ttl) {
      return cached.result;
    }

    const result = await fn();
    this.cache.set(key, { result, timestamp: Date.now() });

    // Clean up expired entries
    this.cleanup();

    return result;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config!.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export class DeadLetterQueue {
  private queue: Array<{ error: Error; operation: string; timestamp: number; data: any }> = [];

  async enqueue(error: Error, operation: string, data: any): Promise<void> {
    this.queue.push({
      error,
      operation,
      timestamp: Date.now(),
      data,
    });

    // In production, this would persist to a database or message queue
    console.error(`[DLQ] Enqueued failed operation: ${operation}`, error);
  }

  async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        console.log(`[DLQ] Processing failed operation: ${item.operation}`);
        // Retry logic would go here
      }
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}

export class CompensationManager {
  private compensations: Array<() => Promise<void>> = [];

  register(compensation: () => Promise<void>): void {
    this.compensations.push(compensation);
  }

  async rollback(): Promise<void> {
    console.log('[Compensation] Starting rollback...');
    
    for (let i = this.compensations.length - 1; i >= 0; i--) {
      try {
        await this.compensations[i]();
      } catch (error) {
        console.error('[Compensation] Rollback failed:', error);
      }
    }
    
    this.compensations = [];
  }

  clear(): void {
    this.compensations = [];
  }
}

export class ResilienceManager {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private retryPolicies = new Map<string, RetryPolicy>();
  private timeoutHandlers = new Map<string, TimeoutHandler>();
  private bulkheads = new Map<string, Bulkhead>();
  private idempotencyManagers = new Map<string, IdempotencyManager>();
  private deadLetterQueue = new DeadLetterQueue();

  constructor(private config: ResilienceConfig = defaultResilienceConfig) {}

  async execute<T>(
    operation: string,
    fn: () => Promise<T>,
    options?: {
      idempotencyKey?: string;
      compensation?: () => Promise<void>;
    }
  ): Promise<T> {
    const compensationManager = new CompensationManager();
    
    if (options?.compensation) {
      compensationManager.register(options.compensation);
    }

    try {
      const result = await this.executeWithResilience(operation, fn, options);
      return result;
    } catch (error) {
      await this.deadLetterQueue.enqueue(error as Error, operation, { options });
      await compensationManager.rollback();
      throw error;
    }
  }

  private async executeWithResilience<T>(
    operation: string,
    fn: () => Promise<T>,
    options?: { idempotencyKey?: string }
  ): Promise<T> {
    // Get or create resilience components
    const circuitBreaker = this.getCircuitBreaker(operation);
    const retryPolicy = this.getRetryPolicy(operation);
    const timeoutHandler = this.getTimeoutHandler(operation);
    const bulkhead = this.getBulkhead(operation);
    const idempotencyManager = this.getIdempotencyManager(operation);

    // Build the resilient execution chain
    const resilientFn = async () => {
      return await circuitBreaker.execute(async () => {
        return await retryPolicy.execute(async () => {
          return await timeoutHandler.execute(async () => {
            return await bulkhead.execute(async () => {
              if (options?.idempotencyKey) {
                return await idempotencyManager.execute(options.idempotencyKey, fn);
              }
              return await fn();
            });
          });
        });
      });
    };

    return resilientFn();
  }

  private getCircuitBreaker(operation: string): CircuitBreaker {
    if (!this.circuitBreakers.has(operation)) {
      this.circuitBreakers.set(operation, new CircuitBreaker(this.config.circuitBreaker));
    }
    return this.circuitBreakers.get(operation)!;
  }

  private getRetryPolicy(operation: string): RetryPolicy {
    if (!this.retryPolicies.has(operation)) {
      this.retryPolicies.set(operation, new RetryPolicy(this.config.retry));
    }
    return this.retryPolicies.get(operation)!;
  }

  private getTimeoutHandler(operation: string): TimeoutHandler {
    if (!this.timeoutHandlers.has(operation)) {
      this.timeoutHandlers.set(operation, new TimeoutHandler(this.config.timeout));
    }
    return this.timeoutHandlers.get(operation)!;
  }

  private getBulkhead(operation: string): Bulkhead {
    if (!this.bulkheads.has(operation)) {
      this.bulkheads.set(operation, new Bulkhead(this.config.bulkhead));
    }
    return this.bulkheads.get(operation)!;
  }

  private getIdempotencyManager(operation: string): IdempotencyManager {
    if (!this.idempotencyManagers.has(operation)) {
      this.idempotencyManagers.set(operation, new IdempotencyManager(this.config.idempotency));
    }
    return this.idempotencyManagers.get(operation)!;
  }

  getStatus(): Record<string, any> {
    return {
      circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([op, cb]) => ({
        operation: op,
        state: cb.getState(),
      })),
      bulkheads: Array.from(this.bulkheads.entries()).map(([op, bh]) => ({
        operation: op,
        activeCalls: bh.getActiveCalls(),
        queueSize: bh.getQueueSize(),
      })),
      deadLetterQueue: {
        size: this.deadLetterQueue.getQueueSize(),
      },
    };
  }

  async processDeadLetterQueue(): Promise<void> {
    await this.deadLetterQueue.processQueue();
  }

  reset(): void {
    this.circuitBreakers.forEach(cb => cb.reset());
    this.circuitBreakers.clear();
    this.retryPolicies.clear();
    this.timeoutHandlers.clear();
    this.bulkheads.clear();
    this.idempotencyManagers.forEach(im => im.clear());
    this.idempotencyManagers.clear();
  }
}

// Singleton instance
export const resilienceManager = new ResilienceManager();