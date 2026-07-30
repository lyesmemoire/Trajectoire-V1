/**
 * Structured Logger
 * Centralized logging with structured JSON output
 * Compatible with Edge Runtime
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  service?: string;
  operation?: string;
  duration?: number;
  status?: string;
  errorCode?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

class Logger {
  private static instance: Logger | null = null;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const entry = this.formatLog(level, message, context);

    if (this.isDevelopment) {
      // Pretty print in development
      console.log(`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, context || "");
    } else {
      // JSON in production
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log with automatic timing
   * @param operation - Operation name
   * @param fn - Function to execute
   * @param context - Additional context
   * @returns Function result
   */
  async withTiming<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = Date.now();
    this.info(`Starting: ${operation}`, context);

    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      this.info(`Completed: ${operation}`, {
        ...context,
        operation,
        duration,
        status: "success",
      });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`Failed: ${operation}`, {
        ...context,
        operation,
        duration,
        status: "error",
        errorCode: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience functions for quick logging (backward compatibility)
// These provide simple logInfo, logWarn, logError functions for quick usage
export const logInfo = (message: string, meta?: any) => {
  // Only log in development to avoid Vercel log explosion
  if (process.env.NODE_ENV === "development") {
    logger.info(message, meta);
  }
};

export const logWarn = (message: string, meta?: any) => {
  // Only log in development to avoid Vercel log explosion
  if (process.env.NODE_ENV === "development") {
    logger.warn(message, meta);
  }
};

export const logError = (error: any, meta?: any) => {
  // Always log errors in production for monitoring
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(errorMessage, { error, ...meta });
};
