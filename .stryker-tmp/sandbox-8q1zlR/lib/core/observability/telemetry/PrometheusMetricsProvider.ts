// @ts-nocheck
import { MetricsProvider, MetricsTags } from "./MetricsProvider";

/**
 * Prometheus metrics provider.
 * Uses prom-client to expose metrics in Prometheus format.
 * 
 * Note: This requires prom-client to be installed:
 * npm install prom-client
 */
export class PrometheusMetricsProvider implements MetricsProvider {
  private counters: Map<string, any> = new Map();
  private gauges: Map<string, any> = new Map();
  private histograms: Map<string, any> = new Map();
  private registry: any;

  constructor() {
    try {
      const promClient = require("prom-client");
      this.registry = new promClient.Registry();
      
      // Add default metrics (CPU, memory, etc.)
      promClient.collectDefaultMetrics({ register: this.registry });
    } catch (error) {
      console.warn("prom-client not installed, PrometheusMetricsProvider will be no-op");
    }
  }

  private getCounter(name: string, labels?: string[]): any {
    if (!this.registry) return null;
    
    if (this.counters.has(name)) {
      return this.counters.get(name);
    }

    try {
      const promClient = require("prom-client");
      const counter = new promClient.Counter({
        name,
        help: `${name} counter`,
        labelNames: labels || [],
        registers: [this.registry],
      });
      this.counters.set(name, counter);
      return counter;
    } catch {
      return null;
    }
  }

  private getGauge(name: string, labels?: string[]): any {
    if (!this.registry) return null;
    
    if (this.gauges.has(name)) {
      return this.gauges.get(name);
    }

    try {
      const promClient = require("prom-client");
      const gauge = new promClient.Gauge({
        name,
        help: `${name} gauge`,
        labelNames: labels || [],
        registers: [this.registry],
      });
      this.gauges.set(name, gauge);
      return gauge;
    } catch {
      return null;
    }
  }

  private getHistogram(name: string, labels?: string[]): any {
    if (!this.registry) return null;
    
    if (this.histograms.has(name)) {
      return this.histograms.get(name);
    }

    try {
      const promClient = require("prom-client");
      const histogram = new promClient.Histogram({
        name,
        help: `${name} histogram`,
        labelNames: labels || [],
        registers: [this.registry],
        buckets: [0.1, 0.5, 1, 5, 10, 30, 60, 120, 300],
      });
      this.histograms.set(name, histogram);
      return histogram;
    } catch {
      return null;
    }
  }

  private extractLabelNames(tags?: MetricsTags): string[] {
    return tags ? Object.keys(tags) : [];
  }

  private extractLabelValues(tags?: MetricsTags): string[] {
    return tags ? Object.values(tags) : [];
  }

  increment(name: string, value: number = 1, tags?: MetricsTags): void {
    const counter = this.getCounter(name, this.extractLabelNames(tags));
    if (counter) {
      counter.inc(this.extractLabelValues(tags), value);
    }
  }

  gauge(name: string, value: number, tags?: MetricsTags): void {
    const gauge = this.getGauge(name, this.extractLabelNames(tags));
    if (gauge) {
      gauge.set(this.extractLabelValues(tags), value);
    }
  }

  histogram(name: string, value: number, tags?: MetricsTags): void {
    const histogram = this.getHistogram(name, this.extractLabelNames(tags));
    if (histogram) {
      histogram.observe(this.extractLabelValues(tags), value);
    }
  }

  timing(name: string, durationMs: number, tags?: MetricsTags): void {
    this.histogram(name, durationMs, tags);
  }

  /**
   * Get the metrics in Prometheus format.
   */
  async getMetrics(): Promise<string> {
    if (!this.registry) return "";
    return this.registry.metrics();
  }

  /**
   * Get the metrics content type for HTTP responses.
   */
  getContentType(): string {
    return "text/plain; version=0.0.4; charset=utf-8";
  }
}
