import { Injectable } from '@nestjs/common';
import CircuitBreaker from 'opossum';

export interface CircuitBreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  rollingWindowTimeout?: number;
  rollingWindowBuckets?: number;
}

@Injectable()
export class CircuitBreakerService {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  create(
    name: string,
    action: (...args: any[]) => Promise<any>,
    options?: CircuitBreakerOptions,
  ): CircuitBreaker {
    const breaker = new CircuitBreaker(action, {
      timeout: options?.timeout || 10000,
      errorThresholdPercentage: options?.errorThresholdPercentage || 50,
      resetTimeout: options?.resetTimeout || 30000,
      rollingWindowTimeout: options?.rollingWindowTimeout || 10000,
      rollingWindowBuckets: options?.rollingWindowBuckets || 10,
      rollingCountTimeout: options?.rollingWindowTimeout || 10000,
    });

    breaker.on('open', () => {
      console.warn(`Circuit breaker "${name}" opened`);
    });

    breaker.on('halfOpen', () => {
      console.info(`Circuit breaker "${name}" half-open`);
    });

    breaker.on('close', () => {
      console.info(`Circuit breaker "${name}" closed`);
    });

    breaker.on('fallback', (result: any) => {
      console.warn(`Circuit breaker "${name}" fallback triggered`, result);
    });

    this.circuitBreakers.set(name, breaker);
    return breaker;
  }

  get(name: string): CircuitBreaker | undefined {
    return this.circuitBreakers.get(name);
  }

  getStatus(name: string): {
    state: string;
    stats: any;
  } | null {
    const breaker = this.circuitBreakers.get(name);
    if (!breaker) return null;

    return {
      state: breaker.opened
        ? 'open'
        : breaker.halfOpen
          ? 'half-open'
          : 'closed',
      stats: breaker.stats,
    };
  }

  getAllStatuses(): Record<string, any> {
    const statuses: Record<string, any> = {};
    for (const [name, breaker] of this.circuitBreakers.entries()) {
      statuses[name] = {
        state: breaker.opened
          ? 'open'
          : breaker.halfOpen
            ? 'half-open'
            : 'closed',
        stats: breaker.stats,
      };
    }
    return statuses;
  }
}
