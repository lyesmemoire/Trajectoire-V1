/**
 * Metrics Controller
 * Exposes Prometheus metrics endpoint
 */

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrometheusMetricsService } from './prometheus-metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly prometheusMetricsService: PrometheusMetricsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMetrics(): Promise<{ metrics: string; contentType: string }> {
    const metrics = await this.prometheusMetricsService.getMetrics();
    const contentType = this.prometheusMetricsService.getContentType();

    return {
      metrics,
      contentType,
    };
  }
}
