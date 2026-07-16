// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { RetryDecorator } from '../../../infrastructure/decorators/RetryDecorator.js';

describe('RetryDecorator', () => {
  it('should pass through on first success', async () => {
    const op = vi.fn().mockResolvedValue('success');
    
    const result = await RetryDecorator.withRetry(op, 3, 10);
    expect(result).toBe('success');
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed', async () => {
    let attempts = 0;
    const op = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) throw new Error('fail');
      return 'success';
    });
    
    const result = await RetryDecorator.withRetry(op, 3, 10);
    expect(result).toBe('success');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries', async () => {
    const op = vi.fn().mockRejectedValue(new Error('fail'));
    
    await expect(RetryDecorator.withRetry(op, 2, 10)).rejects.toThrow('fail');
    expect(op).toHaveBeenCalledTimes(3); // First try + 2 retries = 3 total attempts
  });
});
