/**
 * Structured Logging Service
 * Provides JSON-formatted structured logging with correlation IDs and metadata
 */

import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface LogContext {
  correlationId?: string;
  requestId?: string;
  sessionId?: string;
  userId?: string;
  graphId?: string;
  conversationId?: string;
  [key: string]: any;
}

export interface StructuredLogEntry {
  timestamp: string;
  level: LogLevel;
  severity: Severity;
  message: string;
  context: LogContext;
  metadata?: Record<string, any> | undefined;
  stackTrace?: string | undefined;
  service: string;
  environment: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class StructuredLoggingService implements LoggerService {
  private readonly serviceName: string;
  private readonly environment: string;
  private context: LogContext;

  constructor() {
    this.serviceName = process.env.SERVICE_NAME || 'trajectoire-api';
    this.environment = process.env.NODE_ENV || 'development';
    this.context = {};
  }

  /**
   * Set the correlation ID for the current request
   */
  setCorrelationId(correlationId: string): void {
    this.context.correlationId = correlationId;
  }

  /**
   * Set the request ID for the current request
   */
  setRequestId(requestId: string): void {
    this.context.requestId = requestId;
  }

  /**
   * Set the session ID for the current request
   */
  setSessionId(sessionId: string): void {
    this.context.sessionId = sessionId;
  }

  /**
   * Set the user ID for the current request
   */
  setUserId(userId: string): void {
    this.context.userId = userId;
  }

  /**
   * Set the graph ID for the current request
   */
  setGraphId(graphId: string): void {
    this.context.graphId = graphId;
  }

  /**
   * Set the conversation ID for the current request
   */
  setConversationId(conversationId: string): void {
    this.context.conversationId = conversationId;
  }

  /**
   * Set additional context
   */
  setContext(key: string, value: any): void {
    this.context[key] = value;
  }

  /**
   * Clear all context
   */
  clearContext(): void {
    Object.keys(this.context).forEach((key) => {
      delete this.context[key];
    });
  }

  /**
   * Get the current context
   */
  getContext(): LogContext {
    return { ...this.context };
  }

  /**
   * Log a debug message
   */
  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, Severity.LOW, message, metadata);
  }

  /**
   * Log an info message
   */
  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, Severity.LOW, message, metadata);
  }

  /**
   * Log a warning message
   */
  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, Severity.MEDIUM, message, metadata);
  }

  /**
   * Log an error message
   */
  error(
    message: string,
    error?: Error | string,
    metadata?: Record<string, any>,
  ): void {
    const errorMetadata = { ...metadata };
    let stackTrace: string | undefined;

    if (error) {
      if (error instanceof Error) {
        errorMetadata.errorName = error.name;
        errorMetadata.errorMessage = error.message;
        stackTrace = error.stack;
      } else {
        errorMetadata.errorMessage = error;
      }
    }

    this.log(LogLevel.ERROR, Severity.HIGH, message, errorMetadata, stackTrace);
  }

  /**
   * Log a fatal error message
   */
  fatal(
    message: string,
    error?: Error | string,
    metadata?: Record<string, any>,
  ): void {
    const errorMetadata = { ...metadata };
    let stackTrace: string | undefined;

    if (error) {
      if (error instanceof Error) {
        errorMetadata.errorName = error.name;
        errorMetadata.errorMessage = error.message;
        stackTrace = error.stack;
      } else {
        errorMetadata.errorMessage = error;
      }
    }

    this.log(
      LogLevel.FATAL,
      Severity.CRITICAL,
      message,
      errorMetadata,
      stackTrace,
    );
  }

  /**
   * Internal log method (public for LoggerService interface)
   */
  public log(
    level: LogLevel,
    severity: Severity,
    message: string,
    metadata?: Record<string, any>,
    stackTrace?: string,
  ): void {
    const logEntry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      severity,
      message,
      context: { ...this.context },
      metadata,
      stackTrace,
      service: this.serviceName,
      environment: this.environment,
    };
  }

  /**
   * Log with custom severity
   */
  logWithSeverity(
    level: LogLevel,
    severity: Severity,
    message: string,
    metadata?: Record<string, any>,
  ): void {
    this.log(level, severity, message, metadata);
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: LogContext): StructuredLoggingService {
    const childLogger = new StructuredLoggingService();
    childLogger.context = { ...this.context, ...additionalContext };
    return childLogger;
  }

  /**
   * Generate a new correlation ID
   */
  generateCorrelationId(): string {
    return uuidv4();
  }

  /**
   * Generate a new request ID
   */
  generateRequestId(): string {
    return uuidv4();
  }
}
