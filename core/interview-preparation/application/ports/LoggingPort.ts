/**
 * LoggingPort
 *
 * Port interface for logging.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY interface definition for logging adapter.
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

export interface LoggingPort {
  /**
   * Log debug message
   * @param message - Log message
   * @param context - Optional context
   */
  debug(message: string, context?: Record<string, unknown>): void;

  /**
   * Log info message
   * @param message - Log message
   * @param context - Optional context
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Log warning message
   * @param message - Log message
   * @param context - Optional context
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Log error message
   * @param message - Log message
   * @param error - Optional error
   * @param context - Optional context
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void;

  /**
   * Log fatal message
   * @param message - Log message
   * @param error - Optional error
   * @param context - Optional context
   */
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
}
