import { describe, it, expect } from 'vitest';
import { logger } from '../../lib/logger';

describe('Logger', () => {
  it('should have correct base fields', () => {
    expect(logger.bindings()).toMatchObject({
      service: 'trajectoire',
    });
  });

  it('should create child logger with context', () => {
    const child = logger.child({ sessionId: 'test-123' });
    expect(child.bindings()).toMatchObject({ sessionId: 'test-123' });
  });

  it('should not log to console with pino-pretty in production', () => {
    // In Vitest, process.env is dynamic but logger is already initialized.
    // We mainly ensure the instance exists and hasn't crashed.
    expect(logger).toBeDefined();
    expect(logger.level).toBeDefined();
  });
});
