export interface RetryPolicy {
  execute<T>(operation: () => Promise<T>): Promise<T>;
}

export class NoRetry implements RetryPolicy {
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return operation();
  }
}

export class LinearBackoff implements RetryPolicy {
  constructor(private readonly maxRetries: number, private readonly delayMs: number) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt > this.maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, this.delayMs));
      }
    }
  }
}

export class ExponentialBackoff implements RetryPolicy {
  constructor(private readonly maxRetries: number, private readonly baseDelayMs: number) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt > this.maxRetries) throw error;
        const delay = this.baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
