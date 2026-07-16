import { describe, it, expect } from 'vitest';
import { TimeoutDecorator } from '../../../infrastructure/decorators/TimeoutDecorator.js';
import { ProviderError } from '../../../infrastructure/errors/ProviderErrors.js';

describe('TimeoutDecorator', () => {
  it('should pass through if operation finishes before timeout', async () => {
    const promise = Promise.resolve('success');
    const result = await TimeoutDecorator.withTimeout(promise, 1000, 'test');
    expect(result).toBe('success');
  });

  it('should throw ProviderError if operation times out', async () => {
    const slowOp = new Promise(resolve => setTimeout(() => resolve('done'), 200));

    await expect(TimeoutDecorator.withTimeout(slowOp, 100, 'test')).rejects.toThrow(ProviderError);
  });
});
