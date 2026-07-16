// @ts-nocheck
import { Logger, LogLevel, LogContext } from "./Logger";

export class PinoLogger implements Logger {
  private level: LogLevel = LogLevel.INFO;
  private baseContext: LogContext = {};
  private pino: any;

  constructor(level?: LogLevel) {
    if (level) {
      this.level = level;
    }
    
    try {
      const pino = require("pino");
      this.pino = pino({
        level: this.level,
        formatters: {
          level: (label: string) => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      });
    } catch (error) {
      // Fallback to console if pino is not installed
      console.warn("Pino not installed, falling back to console logging");
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private getContext(context?: LogContext): LogContext {
    return { ...this.baseContext, ...context };
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      if (this.pino) {
        this.pino.debug(this.getContext(context), message);
      } else {
        console.debug(`[DEBUG] ${message}`, this.getContext(context));
      }
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      if (this.pino) {
        this.pino.info(this.getContext(context), message);
      } else {
        console.info(`[INFO] ${message}`, this.getContext(context));
      }
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      if (this.pino) {
        this.pino.warn(this.getContext(context), message);
      } else {
        console.warn(`[WARN] ${message}`, this.getContext(context));
      }
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const ctx = this.getContext(context);
      const errorObj = error instanceof Error ? { error: error.message, stack: error.stack } : { error };
      
      if (this.pino) {
        this.pino.error({ ...ctx, ...errorObj }, message);
      } else {
        console.error(`[ERROR] ${message}`, { ...ctx, ...errorObj });
      }
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
    if (this.pino) {
      this.pino.level = level;
    }
  }

  withContext(context: LogContext): Logger {
    const logger = new PinoLogger(this.level);
    logger.baseContext = { ...this.baseContext, ...context };
    logger.pino = this.pino;
    return logger;
  }
}
