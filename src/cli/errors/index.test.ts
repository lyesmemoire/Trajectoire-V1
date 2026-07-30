import { describe, it, expect } from 'vitest';
import { CLIError, CommandError, ValidationError, ConfigError, FileNotFoundError, CompilationError, RuntimeError, HealthCheckError } from './index';

describe('CLI errors', () => {
  it('should create CLIError', () => {
    const error = new CLIError('Test error', 'TEST_CODE', 1);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.exitCode).toBe(1);
  });

  it('should create CommandError', () => {
    const error = new CommandError('Command failed');
    expect(error.code).toBe('COMMAND_ERROR');
    expect(error.exitCode).toBe(1);
  });

  it('should create ValidationError', () => {
    const error = new ValidationError('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.exitCode).toBe(2);
  });

  it('should create ConfigError', () => {
    const error = new ConfigError('Config error');
    expect(error.code).toBe('CONFIG_ERROR');
    expect(error.exitCode).toBe(3);
  });

  it('should create FileNotFoundError', () => {
    const error = new FileNotFoundError('File not found');
    expect(error.code).toBe('FILE_NOT_FOUND');
    expect(error.exitCode).toBe(4);
  });

  it('should create CompilationError', () => {
    const error = new CompilationError('Compilation failed');
    expect(error.code).toBe('COMPILATION_ERROR');
    expect(error.exitCode).toBe(5);
  });

  it('should create RuntimeError', () => {
    const error = new RuntimeError('Runtime error');
    expect(error.code).toBe('RUNTIME_ERROR');
    expect(error.exitCode).toBe(6);
  });

  it('should create HealthCheckError', () => {
    const error = new HealthCheckError('Health check failed');
    expect(error.code).toBe('HEALTH_CHECK_ERROR');
    expect(error.exitCode).toBe(7);
  });
});
