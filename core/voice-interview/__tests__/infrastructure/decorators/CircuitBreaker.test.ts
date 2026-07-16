import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreakerDecorator } from '../../../infrastructure/decorators/CircuitBreakerDecorator.js';
import { ProviderError } from '../../../infrastructure/errors/ProviderErrors.js';

describe('CircuitBreakerDecorator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass through successful calls in CLOSED state', async () => {
    const cb = new CircuitBreakerDecorator('test-provider', { failureThreshold: 3 });
    const result = await cb.execute(async () => 'success');
    expect(result).toBe('success');
    expect(cb.getState()).toBe('CLOSED');
  });

  it('should trip to OPEN after failure threshold is reached', async () => {
    const cb = new CircuitBreakerDecorator('test-provider', { failureThreshold: 3 });
    
    // 1st failure
    await expect(cb.execute(async () => { throw new Error('f1'); })).rejects.toThrow('f1');
    expect(cb.getState()).toBe('CLOSED');
    
    // 2nd failure
    await expect(cb.execute(async () => { throw new Error('f2'); })).rejects.toThrow('f2');
    expect(cb.getState()).toBe('CLOSED');
    
    // 3rd failure -> trips
    await expect(cb.execute(async () => { throw new Error('f3'); })).rejects.toThrow('f3');
    expect(cb.getState()).toBe('OPEN');
  });

  it('should fast-fail when OPEN', async () => {
    const cb = new CircuitBreakerDecorator('test-provider', { failureThreshold: 1 });
    await expect(cb.execute(async () => { throw new Error('f1'); })).rejects.toThrow('f1');
    expect(cb.getState()).toBe('OPEN');

    // Next call fast-fails with ProviderError
    await expect(cb.execute(async () => 'should not run')).rejects.toThrow(ProviderError);
  });

  it('should transition to HALF_OPEN after timeout and CLOSE on success', async () => {
    const cb = new CircuitBreakerDecorator('test-provider', { failureThreshold: 1, resetTimeoutMs: 10000 });
    
    // Trip to OPEN
    await expect(cb.execute(async () => { throw new Error('f1'); })).rejects.toThrow('f1');
    
    // Wait for timeout
    vi.advanceTimersByTime(10000);

    // This call should be allowed (HALF_OPEN) and succeed, resetting to CLOSED
    const result = await cb.execute(async () => 'recovered');
    expect(result).toBe('recovered');
    expect(cb.getState()).toBe('CLOSED');
  });

  it('should transition to OPEN if HALF_OPEN probe fails', async () => {
    const cb = new CircuitBreakerDecorator('test-provider', { failureThreshold: 1, resetTimeoutMs: 10000 });
    
    // Trip to OPEN
    await expect(cb.execute(async () => { throw new Error('f1'); })).rejects.toThrow('f1');
    
    // Wait for timeout
    vi.advanceTimersByTime(10000);

    // This call is allowed (HALF_OPEN) but fails -> Trips back to OPEN
    await expect(cb.execute(async () => { throw new Error('f2'); })).rejects.toThrow('f2');
    expect(cb.getState()).toBe('OPEN');

    // Further calls fail immediately
    await expect(cb.execute(async () => 'probe 2')).rejects.toThrow(ProviderError);
  });
});
