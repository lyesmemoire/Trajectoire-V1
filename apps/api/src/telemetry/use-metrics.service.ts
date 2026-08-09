import { Injectable } from '@nestjs/common';
import { MeterProvider, Meter } from '@opentelemetry/api';

@Injectable()
export class UseMetricsService {
  private meter: Meter | null = null;

  constructor() {
    // This will be initialized with the OpenTelemetry meter
  }

  setMeterProvider(meterProvider: MeterProvider) {
    this.meter = meterProvider.getMeter('use-metrics');
    this.initializeMetrics();
  }

  private initializeMetrics() {
    if (!this.meter) return;

    // We'll use regular gauges instead of observable gauges for simplicity
    // Observable gauges require a different API setup
  }

  recordCpuUsage(usage: number) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('cpu_usage_percent', {
      description: 'CPU usage percentage',
      unit: '%',
    });
    gauge.record(usage, { type: 'user' });
  }

  recordMemoryUsage(usedPercent: number, freePercent: number) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('memory_usage_percent', {
      description: 'Memory usage percentage',
      unit: '%',
    });
    gauge.record(usedPercent, { type: 'used' });
    gauge.record(freePercent, { type: 'free' });
  }

  recordDiskUsage(usagePercent: number, mount: string) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('disk_usage_percent', {
      description: 'Disk usage percentage',
      unit: '%',
    });
    gauge.record(usagePercent, { mount });
  }

  recordNetworkIO(bytesIn: number, bytesOut: number) {
    if (!this.meter) return;
    const counter = this.meter.createCounter('network_io_bytes', {
      description: 'Network I/O in bytes',
      unit: 'bytes',
    });
    counter.add(bytesIn, { direction: 'in' });
    counter.add(bytesOut, { direction: 'out' });
  }

  recordConnectionCount(count: number, type: string) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('connection_count', {
      description: 'Number of active connections',
    });
    gauge.record(count, { type });
  }

  recordQueueLength(queueName: string, length: number) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('queue_length', {
      description: 'Queue length',
    });
    gauge.record(length, { queue: queueName });
  }

  recordThreadPoolSize(poolName: string, active: number, total: number) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('thread_pool_size', {
      description: 'Thread pool size',
    });
    gauge.record(active, { pool: poolName, state: 'active' });
    gauge.record(total, { pool: poolName, state: 'total' });
  }

  recordErrorRate(service: string, errorCount: number, totalCount: number) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('error_rate', {
      description: 'Error rate',
      unit: '%',
    });
    const errorRate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0;
    gauge.record(errorRate, { service });
  }

  recordLatency(service: string, latency: number, percentile: string) {
    if (!this.meter) return;
    const gauge = this.meter.createGauge('latency', {
      description: 'Request latency',
      unit: 'ms',
    });
    gauge.record(latency, { service, percentile });
  }
}
