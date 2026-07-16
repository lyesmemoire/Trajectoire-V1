// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withTimeout, CircuitBreaker, SessionRateLimiter, TimeoutError } from '../../lib/resilience';

describe('Resilience Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('withTimeout', () => {
    it('should resolve if promise completes before timeout', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 100));
      const resultPromise = withTimeout(promise, 500);
      
      vi.advanceTimersByTime(200);
      await expect(resultPromise).resolves.toBe('success');
    });

    it('should throw TimeoutError if no fallback and takes too long', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 500));
      const resultPromise = withTimeout(promise, 100);
      
      vi.advanceTimersByTime(200);
      await expect(resultPromise).rejects.toThrow(TimeoutError);
    });

    it('should resolve with fallback if takes too long', async () => {
      const promise = new Promise(resolve => setTimeout(() => resolve('success'), 500));
      const resultPromise = withTimeout(promise, 100, 'fallback');
      
      vi.advanceTimersByTime(200);
      await expect(resultPromise).resolves.toBe('fallback');
    });
  });

  describe('CircuitBreaker', () => {
    it('should transition from CLOSED to OPEN after failures', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 1000 });
      const failAction = vi.fn().mockRejectedValue(new Error('fail'));
      
      expect(cb.getState()).toBe('CLOSED');
      
      await expect(cb.execute(failAction)).rejects.toThrow('fail');
      await expect(cb.execute(failAction)).rejects.toThrow('fail');
      expect(cb.getState()).toBe('CLOSED');
      
      await expect(cb.execute(failAction)).rejects.toThrow('fail');
      expect(cb.getState()).toBe('OPEN');
    });

    it('should transition to HALF_OPEN after timeout and then to CLOSED on success', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 1000 });
      const failAction = vi.fn().mockRejectedValue(new Error('fail'));
      const successAction = vi.fn().mockResolvedValue('success');
      
      await expect(cb.execute(failAction)).rejects.toThrow('fail');
      expect(cb.getState()).toBe('OPEN');
      
      vi.advanceTimersByTime(1100);
      expect(cb.getState()).toBe('HALF_OPEN');
      
      await expect(cb.execute(successAction)).resolves.toBe('success');
      expect(cb.getState()).toBe('CLOSED');
    });

    it('should return fallback if OPEN', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 1, resetTimeoutMs: 1000 });
      const failAction = vi.fn().mockRejectedValue(new Error('fail'));
      
      await expect(cb.execute(failAction)).rejects.toThrow('fail');
      expect(cb.getState()).toBe('OPEN');
      
      const result = await cb.execute(failAction, 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('SessionRateLimiter', () => {
    it('should allow requests under the limit and block after', () => {
      const limiter = new SessionRateLimiter(500, 2);
      
      expect(limiter.consume('session1')).toBe(true);
      expect(limiter.consume('session1')).toBe(true);
      expect(limiter.consume('session1')).toBe(false); // 3rd request fails
    });

    it('should allow requests again after window expires', () => {
      const limiter = new SessionRateLimiter(500, 2);
      
      expect(limiter.consume('session1')).toBe(true);
      expect(limiter.consume('session1')).toBe(true);
      expect(limiter.consume('session1')).toBe(false);
      
      vi.advanceTimersByTime(600);
      expect(limiter.consume('session1')).toBe(true); // Should pass now
    });
  });
});
