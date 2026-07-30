/**
 * CLI Errors
 * Custom error classes for Blueprint CLI
 */

export class CLIError extends Error {
  constructor(
    message: string,
    public code: string,
    public exitCode: number = 1
  ) {
    super(message);
    this.name = 'CLIError';
  }
}

export class CommandError extends CLIError {
  constructor(message: string, code: string = 'COMMAND_ERROR') {
    super(message, code, 1);
    this.name = 'CommandError';
  }
}

export class ValidationError extends CLIError {
  constructor(message: string, code: string = 'VALIDATION_ERROR') {
    super(message, code, 2);
    this.name = 'ValidationError';
  }
}

export class ConfigError extends CLIError {
  constructor(message: string, code: string = 'CONFIG_ERROR') {
    super(message, code, 3);
    this.name = 'ConfigError';
  }
}

export class FileNotFoundError extends CLIError {
  constructor(path: string, code: string = 'FILE_NOT_FOUND') {
    super(`File not found: ${path}`, code, 4);
    this.name = 'FileNotFoundError';
  }
}

export class CompilationError extends CLIError {
  constructor(message: string, code: string = 'COMPILATION_ERROR') {
    super(message, code, 5);
    this.name = 'CompilationError';
  }
}

export class RuntimeError extends CLIError {
  constructor(message: string, code: string = 'RUNTIME_ERROR') {
    super(message, code, 6);
    this.name = 'RuntimeError';
  }
}

export class HealthCheckError extends CLIError {
  constructor(message: string, code: string = 'HEALTH_CHECK_ERROR') {
    super(message, code, 7);
    this.name = 'HealthCheckError';
  }
}

export function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.error(`[${error.code}] ${error.message}`);
    process.exit(error.exitCode);
  }
  
  if (error instanceof Error) {
    console.error(`[UNKNOWN_ERROR] ${error.message}`);
    process.exit(1);
  }
  
  console.error('[UNKNOWN_ERROR] An unknown error occurred');
  process.exit(1);
}
