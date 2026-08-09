/**
 * Monitoring Controller
 * Exposes monitoring and metrics endpoints for the dashboard
 */

import { Controller, Get } from '@nestjs/common';
import { RuntimeMetricsService } from './runtime-metrics.service';
import { GraphMetricsService } from './graph-metrics.service';
import type {
  RuntimeMetrics,
  OperationMetrics,
} from './runtime-metrics.service';
import type { GraphMetrics, GraphStatistics } from './graph-metrics.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly runtimeMetricsService: RuntimeMetricsService,
    private readonly graphMetricsService: GraphMetricsService,
  ) {}

  /**
   * Get all runtime metrics
   */
  @Get('runtime')
  getRuntimeMetrics(): RuntimeMetrics {
    return this.runtimeMetricsService.getRuntimeMetrics();
  }

  /**
   * Get operation metrics
   */
  @Get('operations')
  getOperationMetrics(): OperationMetrics {
    return this.runtimeMetricsService.getAllOperationMetrics();
  }

  /**
   * Get CPU metrics
   */
  @Get('cpu')
  getCPUMetrics() {
    return this.runtimeMetricsService.getCPUMetrics();
  }

  /**
   * Get memory metrics
   */
  @Get('memory')
  getMemoryMetrics() {
    return this.runtimeMetricsService.getMemoryMetrics();
  }

  /**
   * Get uptime
   */
  @Get('uptime')
  getUptime() {
    return { uptime: this.runtimeMetricsService.getUptime() };
  }

  /**
   * Get error metrics
   */
  @Get('errors')
  getErrorMetrics() {
    const runtimeMetrics = this.runtimeMetricsService.getRuntimeMetrics();
    return runtimeMetrics.errors;
  }

  /**
   * Get latency metrics
   */
  @Get('latency')
  getLatencyMetrics() {
    const runtimeMetrics = this.runtimeMetricsService.getRuntimeMetrics();
    return runtimeMetrics.latency;
  }

  /**
   * Get matching metrics
   */
  @Get('matching')
  getMatchingMetrics() {
    return this.runtimeMetricsService.getOperationMetrics('matching');
  }

  /**
   * Get search metrics
   */
  @Get('search')
  getSearchMetrics() {
    return this.runtimeMetricsService.getOperationMetrics('search');
  }

  /**
   * Get graph operation metrics
   */
  @Get('graph-operations')
  getGraphOperationMetrics() {
    return this.runtimeMetricsService.getOperationMetrics('graph');
  }

  /**
   * Get reasoning metrics
   */
  @Get('reasoning')
  getReasoningMetrics() {
    return this.runtimeMetricsService.getOperationMetrics('reasoning');
  }

  /**
   * Get graph metrics
   */
  @Get('graph')
  async getGraphMetrics(): Promise<GraphMetrics> {
    return this.graphMetricsService.getGraphMetrics();
  }

  /**
   * Get node metrics
   */
  @Get('nodes')
  getNodeMetrics() {
    return this.graphMetricsService.getNodeMetrics();
  }

  /**
   * Get edge metrics
   */
  @Get('edges')
  getEdgeMetrics() {
    return this.graphMetricsService.getEdgeMetrics();
  }

  /**
   * Get cache metrics
   */
  @Get('cache')
  getCacheMetrics() {
    return this.graphMetricsService.getCacheMetrics();
  }

  /**
   * Get graph statistics
   */
  @Get('graph-statistics')
  getGraphStatistics(): GraphStatistics {
    return this.graphMetricsService.getGraphStatistics();
  }

  /**
   * Get all metrics (combined)
   */
  @Get('all')
  async getAllMetrics() {
    const runtimeMetrics = this.runtimeMetricsService.getRuntimeMetrics();
    const operationMetrics =
      this.runtimeMetricsService.getAllOperationMetrics();
    const graphMetrics = await this.graphMetricsService.getGraphMetrics();
    const graphStatistics = this.graphMetricsService.getGraphStatistics();

    return {
      runtime: runtimeMetrics,
      operations: operationMetrics,
      graph: graphMetrics,
      statistics: graphStatistics,
    };
  }

  /**
   * Reset runtime metrics
   */
  @Get('reset-runtime')
  resetRuntimeMetrics() {
    this.runtimeMetricsService.resetMetrics();
    return { message: 'Runtime metrics reset successfully' };
  }

  /**
   * Reset graph metrics
   */
  @Get('reset-graph')
  resetGraphMetrics() {
    this.graphMetricsService.resetMetrics();
    return { message: 'Graph metrics reset successfully' };
  }

  /**
   * Refresh graph metrics
   */
  @Get('refresh-graph')
  async refreshGraphMetrics() {
    await this.graphMetricsService.refreshMetrics();
    return { message: 'Graph metrics refreshed successfully' };
  }
}
