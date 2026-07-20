/**
 * SecureLogger Implementation
 * Implements ILogger interface with secure logging (masks sensitive data)
 */

import { ILogger, LogLevel, LogEntry } from "@/core/interfaces";
import { secureLogger as legacySecureLogger } from "@/lib/security/secureLogger";

export class SecureLoggerImpl implements ILogger {
  private userId?: string;
  private sessionId?: string;

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  setUserContext(userId: string, sessionId?: string): void {
    this.userId = userId;
    this.sessionId = sessionId;
  }

  clearUserContext(): void {
    this.userId = undefined;
    this.sessionId = undefined;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      timestamp: new Date(),
      message,
      context: {
        ...context,
        userId: this.userId,
        sessionId: this.sessionId,
      },
      userId: this.userId,
      sessionId: this.sessionId,
    };

    // Use legacy secure logger for now
    switch (level) {
      case LogLevel.DEBUG:
        // Legacy logger doesn't have debug, use info
        legacySecureLogger.info(message, context);
        break;
      case LogLevel.INFO:
        legacySecureLogger.info(message, context);
        break;
      case LogLevel.WARN:
        legacySecureLogger.warn(message, context);
        break;
      case LogLevel.ERROR:
        legacySecureLogger.error(message, context);
        break;
    }
  }
}
