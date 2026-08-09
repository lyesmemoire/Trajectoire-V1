import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedMetricsService } from './red-metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

  constructor(private readonly redMetrics: RedMetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const method = request.method;
    const route = request.route?.path || request.url;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.redMetrics.recordHttpRequest(method, route, statusCode, duration);

          this.logger.debug(
            `${method} ${route} - Status: ${statusCode} - Duration: ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.redMetrics.recordHttpRequest(method, route, statusCode, duration);

          this.logger.error(
            `${method} ${route} - Status: ${statusCode} - Duration: ${duration}ms - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
