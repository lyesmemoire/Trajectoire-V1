import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CorrelationIdMiddleware } from './correlation-id.middleware';
import { RequestIdMiddleware } from './request-id.middleware';
import { RedMetricsService } from './red-metrics.service';
import { UseMetricsService } from './use-metrics.service';
import { BusinessMetricsService } from './business-metrics.service';
import { AlertingService } from './alerting.service';
import { HealthDashboardController } from './health-dashboard.controller';
import { MetricsInterceptor } from './metrics-interceptor';
import { ResilienceModule } from '../resilience/resilience.module';

@Global()
@Module({
  imports: [ResilienceModule],
  providers: [
    CorrelationIdMiddleware,
    RequestIdMiddleware,
    RedMetricsService,
    UseMetricsService,
    BusinessMetricsService,
    AlertingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  controllers: [HealthDashboardController],
  exports: [
    CorrelationIdMiddleware,
    RequestIdMiddleware,
    RedMetricsService,
    UseMetricsService,
    BusinessMetricsService,
    AlertingService,
  ],
})
export class TelemetryModule {}
