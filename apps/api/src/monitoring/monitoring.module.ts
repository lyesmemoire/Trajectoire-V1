/**
 * Monitoring Module
 * Provides runtime and graph metrics for the monitoring dashboard
 */

import { Module } from '@nestjs/common';
import { RuntimeMetricsService } from './runtime-metrics.service';
import { GraphMetricsService } from './graph-metrics.service';
import { MonitoringController } from './monitoring.controller';
import { MetricsService } from '../observability/metrics.service';
import { ObservabilityModule } from '../observability/observability.module';
import { KnowledgeGraphModule } from '../runtime/kg/kg.module';

@Module({
  imports: [ObservabilityModule, KnowledgeGraphModule],
  controllers: [MonitoringController],
  providers: [RuntimeMetricsService, GraphMetricsService],
  exports: [RuntimeMetricsService, GraphMetricsService],
})
export class MonitoringModule {}
