/**
 * Global Metrics Interceptor
 * Automatically instruments all HTTP endpoints with metrics
 * Ensures no endpoint is without metrics
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
import { MetricsService } from './metrics.service';
import { TracingService } from './tracing.service';

@Injectable()
export class GlobalMetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalMetricsInterceptor.name);

  constructor(
    private readonly metricsService: MetricsService,
    private readonly tracingService: TracingService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const method = request.method;
    const route = request.route?.path || request.path;
    const correlationId = request.correlationId || 'unknown';

    const startTime = Date.now();

    // Start span for this request
    const span = this.tracingService.startSpan({
      name: `http_${method.toLowerCase()}`,
      attributes: {
        'http.method': method,
        'http.route': route,
        'correlation.id': correlationId,
      },
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Record HTTP request counter
          this.metricsService.incrementCounter({
            name: 'http_requests_total',
            description: 'Total HTTP requests',
            increment: 1,
          });

          // Record response time histogram
          this.metricsService.recordHistogram({
            name: 'http_response_time_seconds',
            description: 'HTTP response time in seconds',
            value: duration / 1000,
            unit: 's',
            attributes: {
              method,
              route,
              status_code: statusCode.toString(),
            },
          });

          // Add attributes to span and end it
          this.tracingService.addAttributes({
            'http.status_code': statusCode.toString(),
            success: 'true',
          });
          span.end();

          this.logger.debug(
            `${method} ${route} - ${statusCode} - ${duration}ms - Correlation ID: ${correlationId}`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Record HTTP error counter
          this.metricsService.incrementCounter({
            name: 'http_errors_total',
            description: 'Total HTTP errors',
            increment: 1,
          });

          // Record response time histogram for errors
          this.metricsService.recordHistogram({
            name: 'http_response_time_seconds',
            description: 'HTTP response time in seconds',
            value: duration / 1000,
            unit: 's',
            attributes: {
              method,
              route,
              status_code: statusCode.toString(),
              error: error.name,
            },
          });

          // Record error counter
          this.metricsService.incrementCounter({
            name: 'error_count_total',
            description: 'Total errors',
            increment: 1,
          });

          // Record exception in span and end it
          this.tracingService.recordException(error);
          this.tracingService.addAttributes({
            'http.status_code': statusCode.toString(),
            success: 'false',
            'error.type': error.name,
            'error.message': error.message,
          });
          span.end();

          this.logger.error(
            `${method} ${route} - ${statusCode} - ${duration}ms - Error: ${error.message} - Correlation ID: ${correlationId}`,
          );
        },
      }),
    );
  }
}
