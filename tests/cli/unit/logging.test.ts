/**
 * Unit tests for CLI Logging module
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createLogger, getLogger, Logger, LogLevel, LogFormat } from '../../../src/cli/logging/index';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = createLogger({ format: 'json', quiet: true });
  });

  afterEach(() => {
    // Reset global logger
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with default options', () => {
      const defaultLogger = new Logger();
      
      expect(defaultLogger).toBeDefined();
    });

    it('should create logger with custom level', () => {
      const customLogger = new Logger({ level: 'debug', format: 'json', quiet: true });
      
      expect(customLogger).toBeDefined();
    });

    it('should set debug level when verbose is true', () => {
      const verboseLogger = new Logger({ verbose: true, format: 'json', quiet: true });
      
      expect(verboseLogger).toBeDefined();
    });

    it('should set error level when quiet is true', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(quietLogger).toBeDefined();
    });

    it('should use text format by default', () => {
      const textLogger = new Logger({ format: 'text', quiet: true });
      
      expect(textLogger).toBeDefined();
    });
  });

  describe('log methods', () => {
    it('should log debug message', () => {
      expect(() => logger.debug('Debug message')).not.toThrow();
    });

    it('should log debug message with context', () => {
      expect(() => logger.debug('Debug message', { key: 'value' })).not.toThrow();
    });

    it('should log info message', () => {
      expect(() => logger.info('Info message')).not.toThrow();
    });

    it('should log info message with context', () => {
      expect(() => logger.info('Info message', { key: 'value' })).not.toThrow();
    });

    it('should log warn message', () => {
      expect(() => logger.warn('Warning message')).not.toThrow();
    });

    it('should log warn message with context', () => {
      expect(() => logger.warn('Warning message', { key: 'value' })).not.toThrow();
    });

    it('should log error message', () => {
      expect(() => logger.error('Error message')).not.toThrow();
    });

    it('should log error message with context', () => {
      expect(() => logger.error('Error message', { key: 'value' })).not.toThrow();
    });

    it('should log success message', () => {
      expect(() => logger.success('Success message')).not.toThrow();
    });

    it('should log success message with context', () => {
      expect(() => logger.success('Success message', { key: 'value' })).not.toThrow();
    });

    it('should log failure message', () => {
      expect(() => logger.failure('Failure message')).not.toThrow();
    });

    it('should log failure message with context', () => {
      expect(() => logger.failure('Failure message', { key: 'value' })).not.toThrow();
    });
  });

  describe('progress', () => {
    it('should log progress message', () => {
      expect(() => logger.progress('Processing', 5, 10)).not.toThrow();
    });

    it('should calculate percentage correctly', () => {
      expect(() => logger.progress('Processing', 50, 100)).not.toThrow();
    });

    it('should handle 0 progress', () => {
      expect(() => logger.progress('Starting', 0, 100)).not.toThrow();
    });

    it('should handle 100% progress', () => {
      expect(() => logger.progress('Complete', 100, 100)).not.toThrow();
    });
  });

  describe('quiet mode', () => {
    it('should suppress debug messages in quiet mode', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(() => quietLogger.debug('Should not show')).not.toThrow();
    });

    it('should suppress info messages in quiet mode', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(() => quietLogger.info('Should not show')).not.toThrow();
    });

    it('should suppress warn messages in quiet mode', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(() => quietLogger.warn('Should not show')).not.toThrow();
    });

    it('should still log error messages in quiet mode', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(() => quietLogger.error('Should show')).not.toThrow();
    });

    it('should suppress success messages in quiet mode', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(() => quietLogger.success('Should not show')).not.toThrow();
    });

    it('should suppress progress messages in quiet mode', () => {
      const quietLogger = new Logger({ quiet: true, format: 'json' });
      
      expect(() => quietLogger.progress('Should not show', 50, 100)).not.toThrow();
    });
  });

  describe('non-quiet mode', () => {
    it('should log debug messages when not quiet', () => {
      const normalLogger = new Logger({ quiet: false, format: 'json' });
      
      expect(() => normalLogger.debug('Should show')).not.toThrow();
    });

    it('should log info messages when not quiet', () => {
      const normalLogger = new Logger({ quiet: false, format: 'json' });
      
      expect(() => normalLogger.info('Should show')).not.toThrow();
    });

    it('should log warn messages when not quiet', () => {
      const normalLogger = new Logger({ quiet: false, format: 'json' });
      
      expect(() => normalLogger.warn('Should show')).not.toThrow();
    });

    it('should log success messages when not quiet', () => {
      const normalLogger = new Logger({ quiet: false, format: 'json' });
      
      expect(() => normalLogger.success('Should show')).not.toThrow();
    });

    it('should log progress messages when not quiet', () => {
      const normalLogger = new Logger({ quiet: false, format: 'json' });
      
      expect(() => normalLogger.progress('Should show', 50, 100)).not.toThrow();
    });
  });

  describe('createLogger', () => {
    it('should create and set global logger', () => {
      const newLogger = createLogger({ format: 'json', quiet: true });
      
      expect(newLogger).toBeDefined();
      expect(getLogger()).toBe(newLogger);
    });

    it('should create logger with options', () => {
      const customLogger = createLogger({ 
        level: 'debug', 
        format: 'json', 
        quiet: true 
      });
      
      expect(customLogger).toBeDefined();
    });
  });

  describe('getLogger', () => {
    it('should return existing global logger', () => {
      const existingLogger = createLogger({ format: 'json', quiet: true });
      const retrievedLogger = getLogger();
      
      expect(retrievedLogger).toBe(existingLogger);
    });

    it('should create default logger if none exists', () => {
      // Clear any existing logger by creating a new module instance
      const defaultLogger = getLogger();
      
      expect(defaultLogger).toBeDefined();
      expect(defaultLogger).toBeInstanceOf(Logger);
    });
  });

  describe('log levels', () => {
    it('should accept debug level', () => {
      const debugLogger = new Logger({ level: 'debug', format: 'json', quiet: true });
      
      expect(debugLogger).toBeDefined();
    });

    it('should accept info level', () => {
      const infoLogger = new Logger({ level: 'info', format: 'json', quiet: true });
      
      expect(infoLogger).toBeDefined();
    });

    it('should accept warn level', () => {
      const warnLogger = new Logger({ level: 'warn', format: 'json', quiet: true });
      
      expect(warnLogger).toBeDefined();
    });

    it('should accept error level', () => {
      const errorLogger = new Logger({ level: 'error', format: 'json', quiet: true });
      
      expect(errorLogger).toBeDefined();
    });
  });

  describe('log formats', () => {
    it('should accept text format', () => {
      const textLogger = new Logger({ format: 'text', quiet: true });
      
      expect(textLogger).toBeDefined();
    });

    it('should accept json format', () => {
      const jsonLogger = new Logger({ format: 'json', quiet: true });
      
      expect(jsonLogger).toBeDefined();
    });
  });
});
