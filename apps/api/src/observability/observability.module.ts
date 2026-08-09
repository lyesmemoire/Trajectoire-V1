/**
 * Observability Module
 * Provides tracing, metrics, and correlation ID middleware for the application
 */

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TracingService } from './tracing.service';
import { MetricsService } from './metrics.service';
import { PrometheusMetricsService } from './prometheus-metrics.service';
import { StructuredLoggingService } from './structured-logging.service';
import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { TracingInterceptor } from './tracing.interceptor';
import { LoggingInterceptor } from './logging.interceptor';
import { MetricsController } from './metrics.controller';

@Module({
  providers: [
    TracingService,
    MetricsService,
    PrometheusMetricsService,
    StructuredLoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [MetricsController],
  exports: [
    TracingService,
    MetricsService,
    PrometheusMetricsService,
    StructuredLoggingService,
  ],
})
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
