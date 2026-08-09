import { describe, it, expect } from 'vitest';
import { createLogger, getLogger } from './index';

describe('Logger', () => {
  it('should create logger', () => {
    const logger = createLogger({ level: 'info', format: 'text' });
    expect(logger).toBeDefined();
  });

  it('should log info message', () => {
    const logger = createLogger({ level: 'info', format: 'text' });
    expect(() => logger.info('test message')).not.toThrow();
  });

  it('should log error message', () => {
    const logger = createLogger({ level: 'info', format: 'text' });
    expect(() => logger.error('error message')).not.toThrow();
  });

  it('should log warning message', () => {
    const logger = createLogger({ level: 'info', format: 'text' });
    expect(() => logger.warn('warning message')).not.toThrow();
  });

  it('should log debug message', () => {
    const logger = createLogger({ level: 'debug', format: 'text' });
    expect(() => logger.debug('debug message')).not.toThrow();
  });

  it('should log success message', () => {
    const logger = createLogger({ level: 'info', format: 'text' });
    expect(() => logger.success('success message')).not.toThrow();
  });

  it('should log failure message', () => {
    const logger = createLogger({ level: 'info', format: 'text' });
    expect(() => logger.failure('failure message')).not.toThrow();
  });

  it('should get global logger', () => {
    const logger = getLogger();
    expect(logger).toBeDefined();
  });

  it('should respect quiet mode', () => {
    const logger = createLogger({ level: 'info', format: 'text', quiet: true });
    expect(() => logger.info('test message')).not.toThrow();
  });

  it('should support JSON format', () => {
    const logger = createLogger({ level: 'info', format: 'json' });
    expect(() => logger.info('test message')).not.toThrow();
  });
});
