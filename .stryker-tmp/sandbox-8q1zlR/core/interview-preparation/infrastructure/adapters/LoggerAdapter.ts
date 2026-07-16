/**
 * LoggerAdapter
 *
 * Infrastructure adapter for logging.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY logging implementation.
 */
// @ts-nocheck


import { LoggingPort } from "../../application/ports/LoggingPort";
import { ConfigurationService, LoggingConfig } from "../configuration/ConfigurationService";

export class LoggerAdapter implements LoggingPort {
  constructor(private readonly configurationService: ConfigurationService) {}

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("DEBUG", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("INFO", message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log("WARN", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };
    this.log("ERROR", message, errorContext);
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };
    this.log("FATAL", message, errorContext);
  }

  private log(level: string, message: string, context?: Record<string, unknown>): void {
    const config = this.configurationService.getLoggingConfig();
    const shouldLog = this.shouldLog(level, config);

    if (!shouldLog) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: context || {},
    };

    if (config.format === "JSON") {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${logEntry.timestamp}] [${level}] ${message}`, context || "");
    }
  }

  private shouldLog(level: string, config: LoggingConfig): boolean {
    const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
    const configLevelIndex = levels.indexOf(config.level);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= configLevelIndex;
  }
}
