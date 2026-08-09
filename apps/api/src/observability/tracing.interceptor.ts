/**
 * Tracing Interceptor
 * Automatically traces all API calls with correlation IDs and metrics
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
import { TracingService } from './tracing.service';
import { MetricsService } from './metrics.service';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TracingInterceptor.name);

  constructor(
    private readonly tracingService: TracingService,
    private readonly metricsService: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const path = request.route?.path || request.url;
    const correlationId = request.correlationId;
    const spanId = request.spanId;

    const startTime = Date.now();

    // Track HTTP request count
    this.metricsService.trackHttpRequest(method, path, response.statusCode);

    // Start a span for the API operation
    const span = this.tracingService.startSpan({
      name: `api.${method.toLowerCase()}.${path.replace(/\//g, '.')}`,
      kind: 1, // SpanKind.SERVER
      attributes: {
        'http.method': method,
        'http.path': path,
        'correlation.id': correlationId,
        'span.id': spanId,
      },
    });

    // Add correlation ID to span
    if (correlationId) {
      this.tracingService.addAttributes({
        'correlation.id': correlationId,
      });
    }

    // Add span ID to span
    if (spanId) {
      this.tracingService.addAttributes({
        'span.id': spanId,
      });
    }

    // Add graph execution ID if present
    if (request.graphExecutionId) {
      this.tracingService.addAttributes({
        'graph.execution.id': request.graphExecutionId,
      });
    }

    // Add request details
    this.tracingService.addAttributes({
      'http.method': method,
      'http.path': path,
      'http.url': request.url,
      'http.user_agent': request.headers['user-agent'],
    });

    // Log the request
    this.logger.log(
      `${method} ${path} - Correlation ID: ${correlationId}, Span ID: ${spanId}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.metricsService.trackHttpRequestDuration(method, path, duration);
          this.tracingService.addEvent('request.completed', {
            duration: duration.toString(),
          });
          this.logger.log(
            `${method} ${path} completed in ${duration}ms - Correlation ID: ${correlationId}`,
          );
          span.end();
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.metricsService.trackHttpRequestDuration(method, path, duration);
          this.metricsService.trackError(error.name, error.message);
          this.tracingService.recordException(error);
          this.tracingService.addEvent('request.failed', {
            error: error.message,
            duration: duration.toString(),
          });
          this.logger.error(
            `${method} ${path} failed in ${duration}ms - Correlation ID: ${correlationId} - Error: ${error.message}`,
          );
          span.end();
        },
      }),
    );
  }
}
