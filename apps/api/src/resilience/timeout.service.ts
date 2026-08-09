import { Injectable, Logger } from '@nestjs/common';

export interface TimeoutOptions {
  timeout?: number;
  onTimeout?: () => void;
}

@Injectable()
export class TimeoutService {
  private readonly logger = new Logger(TimeoutService.name);

  async executeWithTimeout<T>(
    fn: () => Promise<T>,
    options: TimeoutOptions = {},
  ): Promise<T> {
    const { timeout = 30000, onTimeout } = options;

    return Promise.race([
      fn(),
      this.createTimeoutPromise<T>(timeout, onTimeout),
    ]);
  }

  private createTimeoutPromise<T>(
    timeout: number,
    onTimeout?: () => void,
  ): Promise<T> {
    return new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        if (onTimeout) {
          onTimeout();
        }
        reject(new TimeoutError(`Operation timed out after ${timeout}ms`));
      }, timeout);

      // Clear timeout if promise resolves
      if (typeof timeoutId.unref === 'function') {
        timeoutId.unref();
      }
    });
  }

  withTimeout<T>(fn: () => Promise<T>, timeout: number): () => Promise<T> {
    return () => this.executeWithTimeout(fn, { timeout });
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}
