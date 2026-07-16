import { describe, it, expect } from 'vitest';
import { CircuitBreakerDecorator } from '../../../infrastructure/decorators/CircuitBreakerDecorator.js';
import { RetryDecorator } from '../../../infrastructure/decorators/RetryDecorator.js';
import { TimeoutDecorator } from '../../../infrastructure/decorators/TimeoutDecorator.js';
import { ProviderError } from '../../../infrastructure/errors/ProviderErrors.js';

describe('Chaos Tests - Resilience Stack', () => {
  it('should survive massive timeouts using Timeout -> Retry -> CircuitBreaker stack', async () => {
    // 1. Setup the resilience stack
    // CircuitBreaker (trips after 2 failures)
    const cb = new CircuitBreakerDecorator('AI_PROVIDER', { failureThreshold: 2, resetTimeoutMs: 100 });
    
    // 2. Define an operation that ALWAYS times out (a chaotic AI provider)
    let callCount = 0;
    const chaoticProviderCall = async () => {
      callCount++;
      return new Promise((resolve) => {
        setTimeout(() => resolve('too late'), 50); // Resolves in 50ms
      });
    };

    // 3. Compose the decorators
    const executeWithResilience = async () => {
      return cb.execute(async () => {
        return RetryDecorator.withRetry(async () => {
          return TimeoutDecorator.withTimeout(chaoticProviderCall(), 10, 'AI_PROVIDER'); // Timeout in 10ms
        }, 1, 5); // 1 retry, 5ms delay
      });
    };

    // 4. First execution: should fail after Timeout + 1 Retry (2 attempts total)
    await expect(executeWithResilience()).rejects.toThrow(ProviderError);
    expect(callCount).toBe(2);
    expect(cb.getState()).toBe('CLOSED');

    // 5. Second execution: fails again, pushing CB to OPEN
    await expect(executeWithResilience()).rejects.toThrow(ProviderError);
    expect(callCount).toBe(4);
    expect(cb.getState()).toBe('OPEN');

    // 6. Third execution: Fast fails via Circuit Breaker without invoking the chaotic provider!
    await expect(executeWithResilience()).rejects.toThrow('Circuit breaker OPEN');
    expect(callCount).toBe(4); // callCount did not increase!

    // 7. System recovers after 100ms (HALF_OPEN on next call)
    await new Promise(resolve => setTimeout(resolve, 150));

    // Make the provider successful now
    const recoveredProviderCall = async () => {
      callCount++;
      return 'success';
    };

    const executeRecovered = async () => {
      return cb.execute(async () => {
        return RetryDecorator.withRetry(async () => {
          return TimeoutDecorator.withTimeout(recoveredProviderCall(), 50, 'AI_PROVIDER');
        }, 1, 5);
      });
    };

    const result = await executeRecovered();
    expect(result).toBe('success');
    expect(cb.getState()).toBe('CLOSED');
    expect(callCount).toBe(5);
  });
});
