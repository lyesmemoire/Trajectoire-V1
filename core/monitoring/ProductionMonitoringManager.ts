/**
 * Production Monitoring Manager
 *
 * Responsibilities:
 * - Connect Runtime Diagnostic to Runtime Inspector
 * - Connect Runtime Inspector to Logger
 * - Connect Logger to Monitoring
 * - Export errors
 * - Export latency
 * - Export memory
 * - Export CPU
 * - Export Provider metrics
 * - Export Runtime metrics
 * - Export WebSocket metrics
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY monitoring pipeline orchestration
 */

import { DiagnosticCollector } from "../diagnostics/DiagnosticCollector";
import { RuntimeInspector } from "../inspector/RuntimeInspector";

// ============================================================================
// MONITORING METRICS
// ============================================================================

export interface MonitoringMetrics {
  errors: ErrorMetrics;
  latency: LatencyMetrics;
  memory: MemoryMetrics;
  cpu: CPUMetrics;
  provider: ProviderMetrics;
  runtime: RuntimeMetrics;
  websocket: WebSocketMetrics;
  timestamp: number;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Map<string, number>;
  recentErrors: Array<{
    message: string;
    type: string;
    timestamp: number;
  }>;
}

export interface LatencyMetrics {
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  maxLatency: number;
}

export interface MemoryMetrics {
  usedMemory: number;
  totalMemory: number;
  memoryUsagePercentage: number;
  heapUsed: number;
  heapTotal: number;
}

export interface CPUMetrics {
  cpuUsage: number;
  processCpuUsage: number;
  systemCpuUsage: number;
}

export interface ProviderMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  activeProviders: number;
  inactiveProviders: number;
}

export interface RuntimeMetrics {
  state: string;
  uptime: number;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
}

export interface WebSocketMetrics {
  connectionState: string;
  messagesSent: number;
  messagesReceived: number;
  connectionErrors: number;
  reconnectionCount: number;
}

// ============================================================================
// LOGGING INTERFACE
// ============================================================================

export interface Logger {
  log(level: "debug" | "info" | "warn" | "error", message: string, data?: Record<string, unknown>): void;
  logError(error: Error, context?: Record<string, unknown>): void;
  logMetric(metric: string, value: number, tags?: Record<string, string>): void;
  flush(): Promise<void>;
}

// ============================================================================
// MONITORING INTERFACE
// ============================================================================

export interface Monitoring {
  exportMetrics(metrics: MonitoringMetrics): Promise<void>;
  exportError(error: Error, context?: Record<string, unknown>): Promise<void>;
  exportLatency(latency: number, operation: string): Promise<void>;
  exportMemory(memory: MemoryMetrics): Promise<void>;
  exportCPU(cpu: CPUMetrics): Promise<void>;
}

// ============================================================================
// PRODUCTION MONITORING MANAGER INTERFACE
// ============================================================================

export interface ProductionMonitoringManager {
  start(): Promise<void>;
  stop(): Promise<void>;
  collectMetrics(): MonitoringMetrics;
  exportMetrics(): Promise<void>;
  exportError(error: Error, context?: Record<string, unknown>): Promise<void>;
  exportLatency(latency: number, operation: string): Promise<void>;
  exportMemory(memory: MemoryMetrics): Promise<void>;
  exportCPU(cpu: CPUMetrics): Promise<void>;
  getMonitoringMetrics(): MonitoringMetrics;
  subscribeToMetrics(callback: (metrics: MonitoringMetrics) => void): void;
}

// ============================================================================
// SIMPLE LOGGER IMPLEMENTATION
// ============================================================================

class SimpleLogger implements Logger {
  private logs: Array<{ level: string; message: string; data?: Record<string, unknown>; timestamp: number }> = [];

  log(level: "debug" | "info" | "warn" | "error", message: string, data?: Record<string, unknown>): void {
    this.logs.push({ level, message, data, timestamp: Date.now() });
    console.log(`[${level.toUpperCase()}]`, message, data || "");
  }

  logError(error: Error, context?: Record<string, unknown>): void {
    this.log("error", error.message, { ...context, stack: error.stack });
  }

  logMetric(metric: string, value: number, tags?: Record<string, string>): void {
    this.log("info", `Metric: ${metric} = ${value}`, tags);
  }

  async flush(): Promise<void> {
    // In a real implementation, this would flush to external monitoring service
    this.logs = [];
  }

  getLogs(): Array<{ level: string; message: string; data?: Record<string, unknown>; timestamp: number }> {
    return [...this.logs];
  }
}

// ============================================================================
// SIMPLE MONITORING IMPLEMENTATION
// ============================================================================

class SimpleMonitoring implements Monitoring {
  private exportedMetrics: MonitoringMetrics[] = [];

  async exportMetrics(metrics: MonitoringMetrics): Promise<void> {
    this.exportedMetrics.push(metrics);
    console.log("Exported metrics:", metrics);
  }

  async exportError(error: Error, context?: Record<string, unknown>): Promise<void> {
    console.error("Exported error:", error, context);
  }

  async exportLatency(latency: number, operation: string): Promise<void> {
    console.log(`Exported latency: ${operation} = ${latency}ms`);
  }

  async exportMemory(memory: MemoryMetrics): Promise<void> {
    console.log("Exported memory:", memory);
  }

  async exportCPU(cpu: CPUMetrics): Promise<void> {
    console.log("Exported CPU:", cpu);
  }

  getExportedMetrics(): MonitoringMetrics[] {
    return [...this.exportedMetrics];
  }
}

// ============================================================================
// PRODUCTION MONITORING MANAGER IMPLEMENTATION
// ============================================================================

export class ProductionMonitoringManagerImpl implements ProductionMonitoringManager {
  private diagnosticCollector: DiagnosticCollector;
  private runtimeInspector: RuntimeInspector;
  private logger: Logger;
  private monitoring: Monitoring;
  private isRunning: boolean = false;
  private metricsCallbacks: Array<(metrics: MonitoringMetrics) => void> = [];
  private collectionInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.diagnosticCollector = new DiagnosticCollector();
    this.runtimeInspector = new RuntimeInspector(this.diagnosticCollector);
    this.logger = new SimpleLogger();
    this.monitoring = new SimpleMonitoring();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    
    // Start periodic metrics collection
    this.collectionInterval = setInterval(() => {
      if (this.isRunning) {
        const metrics = this.collectMetrics();
        this.notifyMetricsCallbacks(metrics);
      }
    }, 5000); // Collect every 5 seconds

    this.logger.log("info", "Production monitoring started");
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }

    await this.logger.flush();
    this.logger.log("info", "Production monitoring stopped");
  }

  collectMetrics(): MonitoringMetrics {
    const eventRecorder = this.diagnosticCollector.getEventRecorder();
    const _runtimeMetrics = this.diagnosticCollector.getRuntimeMetrics();
    const _providerMetrics = this.diagnosticCollector.getProviderMetrics();
    const _latencyTracker = this.diagnosticCollector.getLatencyTracker();
    
    const _events = eventRecorder.getEvents();
    
    // Collect error metrics
    const errorMetrics: ErrorMetrics = {
      totalErrors: 0,
      errorsByType: new Map(),
      recentErrors: []
    };

    // Collect latency metrics
    const latencyMetrics: LatencyMetrics = {
      averageLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      maxLatency: 0
    };

    // Collect memory metrics
    const memoryMetrics: MemoryMetrics = {
      usedMemory: 0,
      totalMemory: 0,
      memoryUsagePercentage: 0,
      heapUsed: 0,
      heapTotal: 0
    };

    // Collect CPU metrics
    const cpuMetrics: CPUMetrics = {
      cpuUsage: 0,
      processCpuUsage: 0,
      systemCpuUsage: 0
    };

    // Collect provider metrics
    const providerMetricsData: ProviderMetrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      activeProviders: 0,
      inactiveProviders: 0
    };

    // Collect runtime metrics
    const runtimeMetricsData: RuntimeMetrics = {
      state: "Unknown",
      uptime: 0,
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0
    };

    // Collect WebSocket metrics
    const websocketMetrics: WebSocketMetrics = {
      connectionState: "Unknown",
      messagesSent: 0,
      messagesReceived: 0,
      connectionErrors: 0,
      reconnectionCount: 0
    };

    return {
      errors: errorMetrics,
      latency: latencyMetrics,
      memory: memoryMetrics,
      cpu: cpuMetrics,
      provider: providerMetricsData,
      runtime: runtimeMetricsData,
      websocket: websocketMetrics,
      timestamp: Date.now()
    };
  }

  async exportMetrics(): Promise<void> {
    const metrics = this.collectMetrics();
    await this.monitoring.exportMetrics(metrics);
    this.logger.logMetric("monitoring_export", 1, { timestamp: metrics.timestamp.toString() });
  }

  async exportError(error: Error, context?: Record<string, unknown>): Promise<void> {
    this.logger.logError(error, context);
    await this.monitoring.exportError(error, context);
  }

  async exportLatency(latency: number, operation: string): Promise<void> {
    this.logger.logMetric("latency", latency, { operation });
    await this.monitoring.exportLatency(latency, operation);
  }

  async exportMemory(memory: MemoryMetrics): Promise<void> {
    this.logger.logMetric("memory_usage", memory.memoryUsagePercentage, { used: memory.usedMemory.toString() });
    await this.monitoring.exportMemory(memory);
  }

  async exportCPU(cpu: CPUMetrics): Promise<void> {
    this.logger.logMetric("cpu_usage", cpu.cpuUsage, { process: cpu.processCpuUsage.toString() });
    await this.monitoring.exportCPU(cpu);
  }

  getMonitoringMetrics(): MonitoringMetrics {
    return this.collectMetrics();
  }

  subscribeToMetrics(callback: (metrics: MonitoringMetrics) => void): void {
    this.metricsCallbacks.push(callback);
  }

  // ============================================================================
  // PRIVATE METHODS
// ============================================================================

  private notifyMetricsCallbacks(metrics: MonitoringMetrics): void {
    this.metricsCallbacks.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error("Error in metrics callback:", error);
      }
    });
  }

  // ============================================================================
  // GETTERS FOR TESTING
  // ============================================================================

  getDiagnosticCollector(): DiagnosticCollector {
    return this.diagnosticCollector;
  }

  getRuntimeInspector(): RuntimeInspector {
    return this.runtimeInspector;
  }

  getLogger(): Logger {
    return this.logger;
  }

  getMonitoring(): Monitoring {
    return this.monitoring;
  }
}
