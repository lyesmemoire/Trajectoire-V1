/**
 * Unit tests for CLI Errors module
 */

import { describe, it, expect, vi } from 'vitest';
import {
  CLIError,
  CommandError,
  ValidationError,
  ConfigError,
  FileNotFoundError,
  CompilationError,
  RuntimeError,
  HealthCheckError,
  handleError,
} from '../../../src/cli/errors';

describe('CLI Errors', () => {
  describe('CLIError', () => {
    it('should create error with message and code', () => {
      const error = new CLIError('Test error', 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('CLIError');
    });

    it('should create error with custom exit code', () => {
      const error = new CLIError('Test error', 'TEST_ERROR', 5);
      
      expect(error.exitCode).toBe(5);
    });

    it('should be instance of Error', () => {
      const error = new CLIError('Test error', 'TEST_ERROR');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CLIError);
    });
  });

  describe('CommandError', () => {
    it('should create command error with default code', () => {
      const error = new CommandError('Command failed');
      
      expect(error.message).toBe('Command failed');
      expect(error.code).toBe('COMMAND_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('CommandError');
    });

    it('should create command error with custom code', () => {
      const error = new CommandError('Command failed', 'CUSTOM_CODE');
      
      expect(error.code).toBe('CUSTOM_CODE');
    });

    it('should be instance of CLIError', () => {
      const error = new CommandError('Command failed');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(CommandError);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with default code', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.exitCode).toBe(2);
      expect(error.name).toBe('ValidationError');
    });

    it('should create validation error with custom code', () => {
      const error = new ValidationError('Invalid input', 'CUSTOM_VALIDATION');
      
      expect(error.code).toBe('CUSTOM_VALIDATION');
    });

    it('should be instance of CLIError', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe('ConfigError', () => {
    it('should create config error with default code', () => {
      const error = new ConfigError('Config not found');
      
      expect(error.message).toBe('Config not found');
      expect(error.code).toBe('CONFIG_ERROR');
      expect(error.exitCode).toBe(3);
      expect(error.name).toBe('ConfigError');
    });

    it('should create config error with custom code', () => {
      const error = new ConfigError('Config not found', 'CUSTOM_CONFIG');
      
      expect(error.code).toBe('CUSTOM_CONFIG');
    });

    it('should be instance of CLIError', () => {
      const error = new ConfigError('Config not found');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(ConfigError);
    });
  });

  describe('FileNotFoundError', () => {
    it('should create file not found error with path in message', () => {
      const error = new FileNotFoundError('/path/to/file');
      
      expect(error.message).toBe('File not found: /path/to/file');
      expect(error.code).toBe('FILE_NOT_FOUND');
      expect(error.exitCode).toBe(4);
      expect(error.name).toBe('FileNotFoundError');
    });

    it('should create file not found error with custom code', () => {
      const error = new FileNotFoundError('/path/to/file', 'CUSTOM_FILE');
      
      expect(error.code).toBe('CUSTOM_FILE');
    });

    it('should be instance of CLIError', () => {
      const error = new FileNotFoundError('/path/to/file');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(FileNotFoundError);
    });
  });

  describe('CompilationError', () => {
    it('should create compilation error with default code', () => {
      const error = new CompilationError('Compilation failed');
      
      expect(error.message).toBe('Compilation failed');
      expect(error.code).toBe('COMPILATION_ERROR');
      expect(error.exitCode).toBe(5);
      expect(error.name).toBe('CompilationError');
    });

    it('should create compilation error with custom code', () => {
      const error = new CompilationError('Compilation failed', 'CUSTOM_COMPILATION');
      
      expect(error.code).toBe('CUSTOM_COMPILATION');
    });

    it('should be instance of CLIError', () => {
      const error = new CompilationError('Compilation failed');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(CompilationError);
    });
  });

  describe('RuntimeError', () => {
    it('should create runtime error with default code', () => {
      const error = new RuntimeError('Runtime error');
      
      expect(error.message).toBe('Runtime error');
      expect(error.code).toBe('RUNTIME_ERROR');
      expect(error.exitCode).toBe(6);
      expect(error.name).toBe('RuntimeError');
    });

    it('should create runtime error with custom code', () => {
      const error = new RuntimeError('Runtime error', 'CUSTOM_RUNTIME');
      
      expect(error.code).toBe('CUSTOM_RUNTIME');
    });

    it('should be instance of CLIError', () => {
      const error = new RuntimeError('Runtime error');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(RuntimeError);
    });
  });

  describe('HealthCheckError', () => {
    it('should create health check error with default code', () => {
      const error = new HealthCheckError('Health check failed');
      
      expect(error.message).toBe('Health check failed');
      expect(error.code).toBe('HEALTH_CHECK_ERROR');
      expect(error.exitCode).toBe(7);
      expect(error.name).toBe('HealthCheckError');
    });

    it('should create health check error with custom code', () => {
      const error = new HealthCheckError('Health check failed', 'CUSTOM_HEALTH');
      
      expect(error.code).toBe('CUSTOM_HEALTH');
    });

    it('should be instance of CLIError', () => {
      const error = new HealthCheckError('Health check failed');
      
      expect(error).toBeInstanceOf(CLIError);
      expect(error).toBeInstanceOf(HealthCheckError);
    });
  });

  describe('handleError', () => {
    it('should handle CLIError and exit with correct code', () => {
      const error = new CommandError('Test error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Exit called');
      });

      expect(() => handleError(error)).toThrow('Exit called');
      expect(consoleSpy).toHaveBeenCalledWith('[COMMAND_ERROR] Test error');
      expect(exitSpy).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should handle generic Error and exit with code 1', () => {
      const error = new Error('Generic error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Exit called');
      });

      expect(() => handleError(error)).toThrow('Exit called');
      expect(consoleSpy).toHaveBeenCalledWith('[UNKNOWN_ERROR] Generic error');
      expect(exitSpy).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should handle unknown error and exit with code 1', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Exit called');
      });

      expect(() => handleError('string error')).toThrow('Exit called');
      expect(consoleSpy).toHaveBeenCalledWith('[UNKNOWN_ERROR] An unknown error occurred');
      expect(exitSpy).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should handle null error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('Exit called');
      });

      expect(() => handleError(null)).toThrow('Exit called');
      expect(consoleSpy).toHaveBeenCalledWith('[UNKNOWN_ERROR] An unknown error occurred');
      expect(exitSpy).toHaveBeenCalledWith(1);

      consoleSpy.mockRestore();
      exitSpy.mockRestore();
    });
  });
});
