import { Logger, LogLevel, LogContext } from "./Logger";

export class ConsoleLogger implements Logger {
  private level: LogLevel = LogLevel.INFO;
  private baseContext: LogContext = {};

  constructor(level?: LogLevel) {
    if (level) {
      this.level = level;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const ctx = { ...this.baseContext, ...context };
    const contextStr = Object.keys(ctx).length > 0 ? ` ${JSON.stringify(ctx)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorStr = error instanceof Error ? `${error.message}\n${error.stack}` : JSON.stringify(error);
      console.error(this.formatMessage(LogLevel.ERROR, message, context), errorStr);
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  withContext(context: LogContext): Logger {
    const logger = new ConsoleLogger(this.level);
    logger.baseContext = { ...this.baseContext, ...context };
    return logger;
  }
}
