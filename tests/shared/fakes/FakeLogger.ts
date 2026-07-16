import { Logger, LogLevel, LogContext } from "@/lib/core/observability/logger/Logger";

/**
 * Fake implementation of Logger for testing.
 * Tracks all log calls for verification in tests.
 */
export class FakeLogger implements Logger {
  private logs: Array<{ level: LogLevel; message: string; context?: LogContext; error?: Error | unknown }> = [];
  private level: LogLevel = LogLevel.DEBUG;

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.logs.push({ level: LogLevel.DEBUG, message, context });
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.logs.push({ level: LogLevel.INFO, message, context });
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.logs.push({ level: LogLevel.WARN, message, context });
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.logs.push({ level: LogLevel.ERROR, message, error, context });
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  withContext(_context: LogContext): Logger {
    return this;
  }

  /**
   * Returns all logged messages.
   */
  getLogs(): Array<{ level: LogLevel; message: string; context?: LogContext; error?: Error | unknown }> {
    return this.logs;
  }

  /**
   * Returns logs filtered by level.
   */
  getLogsByLevel(level: LogLevel): Array<{ level: LogLevel; message: string; context?: LogContext; error?: Error | unknown }> {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Returns logs containing a specific message.
   */
  getLogsByMessage(message: string): Array<{ level: LogLevel; message: string; context?: LogContext; error?: Error | unknown }> {
    return this.logs.filter(log => log.message.includes(message));
  }

  /**
   * Clears all logged messages.
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Returns the total number of log calls.
   */
  getLogCount(): number {
    return this.logs.length;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
}
