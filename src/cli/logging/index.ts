/**
 * CLI Logging
 * Structured logging for Blueprint CLI
 */

import pino from 'pino';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogFormat = 'text' | 'json';

export interface LoggerOptions {
  level?: LogLevel;
  format?: LogFormat;
  quiet?: boolean;
  verbose?: boolean;
}

class Logger {
  private logger: pino.Logger;
  private quiet: boolean;

  constructor(options: LoggerOptions = {}) {
    const { level = 'info', format = 'text', quiet = false, verbose = false } = options;
    this.quiet = quiet;

    const logLevel = verbose ? 'debug' : quiet ? 'error' : level;

    this.logger = pino({
      level: logLevel,
      transport: format === 'text' ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      } : undefined,
    });
  }

  debug(message: string, context?: any): void {
    if (!this.quiet) {
      this.logger.debug({ context }, message);
    }
  }

  info(message: string, context?: any): void {
    if (!this.quiet) {
      this.logger.info({ context }, message);
    }
  }

  warn(message: string, context?: any): void {
    if (!this.quiet) {
      this.logger.warn({ context }, message);
    }
  }

  error(message: string, context?: any): void {
    this.logger.error({ context }, message);
  }

  success(message: string, context?: any): void {
    if (!this.quiet) {
      this.logger.info({ context, success: true }, `✓ ${message}`);
    }
  }

  failure(message: string, context?: any): void {
    this.logger.error({ context, success: false }, `✗ ${message}`);
  }

  progress(message: string, current: number, total: number): void {
    if (!this.quiet) {
      const percentage = Math.round((current / total) * 100);
      this.logger.info(`[${percentage}%] ${message}`);
    }
  }
}

export { Logger };

let globalLogger: Logger | null = null;

export function createLogger(options?: LoggerOptions): Logger {
  globalLogger = new Logger(options);
  return globalLogger;
}

export function getLogger(): Logger {
  if (!globalLogger) {
    globalLogger = new Logger();
  }
  return globalLogger;
}
