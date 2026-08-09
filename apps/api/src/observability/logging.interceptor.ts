/**
 * Logging Interceptor
 * Automatically adds correlation IDs and context to structured logging
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StructuredLoggingService } from './structured-logging.service';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  constructor(
    private readonly structuredLoggingService: StructuredLoggingService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    // Clear previous context
    this.structuredLoggingService.clearContext();

    // Extract or generate Correlation ID
    const correlationId =
      (request.headers['x-correlation-id'] as string) ||
      this.structuredLoggingService.generateCorrelationId();

    // Generate Request ID
    const requestId = this.structuredLoggingService.generateRequestId();

    // Extract Session ID from headers
    const sessionId = request.headers['x-session-id'] as string;

    // Extract User ID from headers or user object
    const userId =
      (request.headers['x-user-id'] as string) ||
      (request as any).user?.id ||
      (request as any).user?.userId;

    // Extract Graph ID from headers or query params
    const graphId =
      (request.headers['x-graph-id'] as string) ||
      (request.query.graphId as string) ||
      (request.body?.graphId as string);

    // Extract Conversation ID from headers or query params
    const conversationId =
      (request.headers['x-conversation-id'] as string) ||
      (request.query.conversationId as string) ||
      (request.body?.conversationId as string);

    // Set all IDs in the logging context
    this.structuredLoggingService.setCorrelationId(correlationId);
    this.structuredLoggingService.setRequestId(requestId);

    if (sessionId) {
      this.structuredLoggingService.setSessionId(sessionId);
    }

    if (userId) {
      this.structuredLoggingService.setUserId(userId);
    }

    if (graphId) {
      this.structuredLoggingService.setGraphId(graphId);
    }

    if (conversationId) {
      this.structuredLoggingService.setConversationId(conversationId);
    }

    // Add additional context
    this.structuredLoggingService.setContext('method', request.method);
    this.structuredLoggingService.setContext('path', request.path);
    this.structuredLoggingService.setContext('ip', request.ip);
    this.structuredLoggingService.setContext(
      'userAgent',
      request.headers['user-agent'],
    );

    // Log request start
    this.structuredLoggingService.info('Incoming request', {
      method: request.method,
      path: request.path,
      query: request.query,
      body: this.sanitizeBody(request.body),
    });

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.structuredLoggingService.info('Request completed', {
            method: request.method,
            path: request.path,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.structuredLoggingService.error('Request failed', error, {
            method: request.method,
            path: request.path,
            statusCode: response.statusCode || 500,
            duration: `${duration}ms`,
          });
        },
      }),
    );
  }

  /**
   * Sanitize request body to remove sensitive information
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
