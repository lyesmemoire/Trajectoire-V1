/**
 * Enterprise Observability Platform
 * Centralized observability for all AI operations
 */

import {
  ObservabilityGraphType,
  ObservabilityDataPoint,
  ObservabilityTrace,
  ObservabilitySpan,
  ObservabilityLog,
  ObservabilityMetric,
  ObservabilityDashboard,
  ObservabilityMetricsSummary,
  EnterpriseObservabilityConfig,
  defaultEnterpriseObservabilityConfig,
} from "./interfaces/IEnterpriseObservability";

// ============================================================================
// ENTERPRISE OBSERVABILITY PLATFORM CLASS
// ============================================================================

export class EnterpriseObservabilityPlatform {
  private static instance: EnterpriseObservabilityPlatform;
  private config: EnterpriseObservabilityConfig;
  private dataPoints: Map<string, ObservabilityDataPoint> = new Map();
  private traces: Map<string, ObservabilityTrace> = new Map();
  private spans: Map<string, ObservabilitySpan> = new Map();
  private logs: Map<string, ObservabilityLog> = new Map();
  private metrics: Map<string, ObservabilityMetric> = new Map();
  private dashboards: Map<string, ObservabilityDashboard> = new Map();

  private constructor() {
    this.config = defaultEnterpriseObservabilityConfig;
    this.initializeDefaultDashboard();
  }

  static getInstance(): EnterpriseObservabilityPlatform {
    if (!EnterpriseObservabilityPlatform.instance) {
      EnterpriseObservabilityPlatform.instance = new EnterpriseObservabilityPlatform();
    }
    return EnterpriseObservabilityPlatform.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<EnterpriseObservabilityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize default dashboard
   */
  private initializeDefaultDashboard(): void {
    const dashboard: ObservabilityDashboard = {
      id: "default_dashboard",
      name: "Default Observability Dashboard",
      graphs: [
        "decision",
        "engine",
        "cost",
        "memory",
        "reasoning",
        "reflection",
        "policy",
        "learning",
        "health",
        "impact",
      ],
      timeRange: "1h",
      filters: {},
      lastUpdated: new Date(),
    };

    this.dashboards.set(dashboard.id, dashboard);
  }

  /**
   * Start trace
   */
  startTrace(traceId: string, operationName: string): string {
    const trace: ObservabilityTrace = {
      id: `trace_${traceId}`,
      traceId,
      startTime: new Date(),
      endTime: null,
      duration: 0,
      spans: [],
      status: "active",
      metadata: {},
    };

    this.traces.set(trace.id, trace);

    // Create root span
    this.createSpan(trace.id, null, operationName);

    return trace.id;
  }

  /**
   * End trace
   */
  endTrace(traceId: string): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;

    trace.endTime = new Date();
    trace.duration = trace.endTime.getTime() - trace.startTime.getTime();
    trace.status = "completed";

    // Update all spans
    trace.spans.forEach(span => {
      const spanEntity = this.spans.get(span.id);
      if (spanEntity && !spanEntity.endTime) {
        const endTime = new Date();
        spanEntity.endTime = endTime;
        spanEntity.duration = endTime.getTime() - spanEntity.startTime.getTime();
        spanEntity.status = "completed";
      }
    });
  }

  /**
   * Create span
   */
  createSpan(traceId: string, parentId: string | null, operationName: string): string {
    const spanId = `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const span: ObservabilitySpan = {
      id: spanId,
      traceId,
      parentId,
      operationName,
      startTime: new Date(),
      endTime: null,
      duration: 0,
      status: "active",
      tags: {},
      logs: [],
    };

    this.spans.set(spanId, span);

    // Add span to trace
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.spans.push(span);
    }

    return spanId;
  }

  /**
   * End span
   */
  endSpan(spanId: string): void {
    const span = this.spans.get(spanId);
    if (!span) return;

    span.endTime = new Date();
    span.duration = span.endTime.getTime() - span.startTime.getTime();
    span.status = "completed";
  }

  /**
   * Add log
   */
  addLog(level: "debug" | "info" | "warn" | "error" | "fatal", component: string, message: string, context: Record<string, unknown>, traceId: string | null = null): void {
    const log: ObservabilityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      component,
      message,
      context,
      traceId,
    };

    this.logs.set(log.id, log);
  }

  /**
   * Add metric
   */
  addMetric(name: string, value: number, unit: string, labels: Record<string, string>): void {
    const metric: ObservabilityMetric = {
      id: `metric_${name}_${Date.now()}`,
      name,
      value,
      unit,
      timestamp: new Date(),
      labels,
    };

    this.metrics.set(metric.id, metric);
  }

  /**
   * Add data point
   */
  addDataPoint(graphType: ObservabilityGraphType, value: number, label: string, metadata: Record<string, unknown>): void {
    const dataPoint: ObservabilityDataPoint = {
      id: `datapoint_${graphType}_${Date.now()}`,
      graphType,
      timestamp: new Date(),
      value,
      label,
      metadata,
    };

    this.dataPoints.set(dataPoint.id, dataPoint);
  }

  /**
   * Get trace
   */
  getTrace(traceId: string): ObservabilityTrace | null {
    return this.traces.get(traceId) || null;
  }

  /**
   * Get traces
   */
  getTraces(): ObservabilityTrace[] {
    return Array.from(this.traces.values());
  }

  /**
   * Get span
   */
  getSpan(spanId: string): ObservabilitySpan | null {
    return this.spans.get(spanId) || null;
  }

  /**
   * Get spans by trace
   */
  getSpansByTrace(traceId: string): ObservabilitySpan[] {
    return Array.from(this.spans.values()).filter(span => span.traceId === traceId);
  }

  /**
   * Get logs
   */
  getLogs(level?: "debug" | "info" | "warn" | "error" | "fatal"): ObservabilityLog[] {
    if (level) {
      return Array.from(this.logs.values()).filter(log => log.level === level);
    }
    return Array.from(this.logs.values());
  }

  /**
   * Get logs by component
   */
  getLogsByComponent(component: string): ObservabilityLog[] {
    return Array.from(this.logs.values()).filter(log => log.component === component);
  }

  /**
   * Get metrics
   */
  getMetrics(name?: string): ObservabilityMetric[] {
    if (name) {
      return Array.from(this.metrics.values()).filter(metric => metric.name === name);
    }
    return Array.from(this.metrics.values());
  }

  /**
   * Get data points by graph type
   */
 getDataPointsByGraphType(graphType: ObservabilityGraphType): ObservabilityDataPoint[] {
    return Array.from(this.dataPoints.values()).filter(dp => dp.graphType === graphType);
  }

  /**
   * Get dashboard
   */
  getDashboard(dashboardId: string): ObservabilityDashboard | null {
    return this.dashboards.get(dashboardId) || null;
  }

  /**
   * Get dashboards
   */
  getDashboards(): ObservabilityDashboard[] {
    return Array.from(this.dashboards.values());
  }

  /**
   * Create dashboard
   */
  createDashboard(name: string, graphs: ObservabilityGraphType[], timeRange: string, filters: Record<string, unknown>): string {
    const dashboardId = `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const dashboard: ObservabilityDashboard = {
      id: dashboardId,
      name,
      graphs,
      timeRange,
      filters,
      lastUpdated: new Date(),
    };

    this.dashboards.set(dashboardId, dashboard);

    return dashboardId;
  }

  /**
   * Update dashboard
   */
  updateDashboard(dashboardId: string, updates: Partial<ObservabilityDashboard>): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (dashboard) {
      const updated = { ...dashboard, ...updates, lastUpdated: new Date() };
      this.dashboards.set(dashboardId, updated);
    }
  }

  /**
   * Delete dashboard
   */
  deleteDashboard(dashboardId: string): void {
    this.dashboards.delete(dashboardId);
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(): ObservabilityMetricsSummary {
    const totalTraces = this.traces.size;
    const totalSpans = this.spans.size;
    const totalLogs = this.logs.size;
    const totalMetrics = this.metrics.size;

    const traces = Array.from(this.traces.values());
    const averageTraceDuration = traces.length > 0
      ? traces.reduce((sum, trace) => sum + trace.duration, 0) / traces.length
      : 0;

    const failedTraces = traces.filter(trace => trace.status === "failed").length;
    const errorRate = totalTraces > 0 ? failedTraces / totalTraces : 0;
    const successRate = totalTraces > 0 ? 1 - errorRate : 0;

    const averageCost = 0.1; // Placeholder
    const averageLatency = 500; // Placeholder

    return {
      totalTraces,
      totalSpans,
      totalLogs,
      totalMetrics,
      averageTraceDuration,
      errorRate,
      successRate,
      averageCost,
      averageLatency,
    };
  }

  /**
   * Clear old data
   */
  clearOldData(): void {
    const traceCutoff = new Date();
    traceCutoff.setDate(traceCutoff.getDate() - this.config.traceRetentionDays);

    const logCutoff = new Date();
    logCutoff.setDate(logCutoff.getDate() - this.config.logRetentionDays);

    const metricCutoff = new Date();
    metricCutoff.setDate(metricCutoff.getDate() - this.config.metricRetentionDays);

    // Clear old traces
    this.traces.forEach((trace, id) => {
      if (trace.startTime < traceCutoff) {
        this.traces.delete(id);
      }
    });

    // Clear old spans
    this.spans.forEach((span, id) => {
      if (span.startTime < traceCutoff) {
        this.spans.delete(id);
      }
    });

    // Clear old logs
    this.logs.forEach((log, id) => {
      if (log.timestamp < logCutoff) {
        this.logs.delete(id);
      }
    });

    // Clear old metrics
    this.metrics.forEach((metric, id) => {
      if (metric.timestamp < metricCutoff) {
        this.metrics.delete(id);
      }
    });

    // Clear old data points
    this.dataPoints.forEach((dp, id) => {
      if (dp.timestamp < metricCutoff) {
        this.dataPoints.delete(id);
      }
    });
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.dataPoints.clear();
    this.traces.clear();
    this.spans.clear();
    this.logs.clear();
    this.metrics.clear();
    this.dashboards.clear();
    this.initializeDefaultDashboard();
  }
}

export const enterpriseObservabilityPlatform = EnterpriseObservabilityPlatform.getInstance();
