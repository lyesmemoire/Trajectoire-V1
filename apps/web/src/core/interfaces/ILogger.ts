/**
 * ILogger Interface
 * Defines the contract for logging implementations
 * Following Dependency Inversion Principle
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogEntry {
  level: LogLevel;
  timestamp: Date;
  message: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

export interface ILogger {
  /**
   * Log a debug message
   * @param message - Log message
   * @param context - Additional context
   */
  debug(message: string, context?: Record<string, unknown>): void;

  /**
   * Log an info message
   * @param message - Log message
   * @param context - Additional context
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Log a warning message
   * @param message - Log message
   * @param context - Additional context
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Log an error message
   * @param message - Log message
   * @param context - Additional context
   */
  error(message: string, context?: Record<string, unknown>): void;

  /**
   * Set user context for logs
   * @param userId - User ID
   * @param sessionId - Optional session ID
   */
  setUserContext(userId: string, sessionId?: string): void;

  /**
   * Clear user context
   */
  clearUserContext(): void;
}
