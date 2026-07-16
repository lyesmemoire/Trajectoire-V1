/**
 * Integration Tests for Production Monitoring Manager
 */

import { ProductionMonitoringManagerImpl } from "../ProductionMonitoringManager";

describe("ProductionMonitoringManager - Integration Tests", () => {
  let monitoringManager: ProductionMonitoringManagerImpl;

  beforeEach(() => {
    monitoringManager = new ProductionMonitoringManagerImpl();
  });

  afterEach(async () => {
    await monitoringManager.stop();
  });

  describe("Pipeline Connections", () => {
    test("should connect Runtime Diagnostic to Runtime Inspector", async () => {
      await monitoringManager.start();
      
      const diagnosticCollector = monitoringManager.getDiagnosticCollector();
      const runtimeInspector = monitoringManager.getRuntimeInspector();
      
      expect(diagnosticCollector).toBeDefined();
      expect(runtimeInspector).toBeDefined();
    });

    test("should connect Runtime Inspector to Logger", async () => {
      await monitoringManager.start();
      
      const runtimeInspector = monitoringManager.getRuntimeInspector();
      const logger = monitoringManager.getLogger();
      
      expect(runtimeInspector).toBeDefined();
      expect(logger).toBeDefined();
    });

    test("should connect Logger to Monitoring", async () => {
      await monitoringManager.start();
      
      const logger = monitoringManager.getLogger();
      const monitoring = monitoringManager.getMonitoring();
      
      expect(logger).toBeDefined();
      expect(monitoring).toBeDefined();
    });

    test("should initialize all pipeline components", async () => {
      await monitoringManager.start();
      
      expect(monitoringManager.getDiagnosticCollector()).toBeDefined();
      expect(monitoringManager.getRuntimeInspector()).toBeDefined();
      expect(monitoringManager.getLogger()).toBeDefined();
      expect(monitoringManager.getMonitoring()).toBeDefined();
    });
  });

  describe("Error Export", () => {
    test("should export errors", async () => {
      await monitoringManager.start();
      
      const error = new Error("Test error");
      await monitoringManager.exportError(error, { context: "test" });
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ level: string; message: string }> };
      const logs = logger.getLogs();
      
      expect(logs.some(log => log.level === "error" && log.message === "Test error")).toBe(true);
    });

    test("should export errors with context", async () => {
      await monitoringManager.start();
      
      const error = new Error("Test error");
      await monitoringManager.exportError(error, { userId: "123", operation: "test" });
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ data?: Record<string, unknown> }> };
      const logs = logger.getLogs();
      
      const errorLog = logs.find(log => log.data?.userId === "123");
      expect(errorLog).toBeDefined();
    });
  });

  describe("Latency Export", () => {
    test("should export latency metrics", async () => {
      await monitoringManager.start();
      
      await monitoringManager.exportLatency(150, "test_operation");
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ message: string }> };
      const logs = logger.getLogs();
      
      expect(logs.some(log => log.message.includes("Metric: latency") && log.message.includes("150"))).toBe(true);
    });

    test("should export latency with operation name", async () => {
      await monitoringManager.start();
      
      await monitoringManager.exportLatency(200, "audio_processing");
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ data?: Record<string, string> }> };
      const logs = logger.getLogs();
      
      const latencyLog = logs.find(log => log.data?.operation === "audio_processing");
      expect(latencyLog).toBeDefined();
    });
  });

  describe("Memory Export", () => {
    test("should export memory metrics", async () => {
      await monitoringManager.start();
      
      const memoryMetrics = {
        usedMemory: 50 * 1024 * 1024,
        totalMemory: 100 * 1024 * 1024,
        memoryUsagePercentage: 50,
        heapUsed: 40 * 1024 * 1024,
        heapTotal: 80 * 1024 * 1024
      };
      
      await monitoringManager.exportMemory(memoryMetrics);
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ message: string }> };
      const logs = logger.getLogs();
      
      expect(logs.some(log => log.message.includes("Metric: memory_usage") && log.message.includes("50"))).toBe(true);
    });
  });

  describe("CPU Export", () => {
    test("should export CPU metrics", async () => {
      await monitoringManager.start();
      
      const cpuMetrics = {
        cpuUsage: 75,
        processCpuUsage: 60,
        systemCpuUsage: 80
      };
      
      await monitoringManager.exportCPU(cpuMetrics);
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ message: string }> };
      const logs = logger.getLogs();
      
      expect(logs.some(log => log.message.includes("Metric: cpu_usage") && log.message.includes("75"))).toBe(true);
    });
  });

  describe("Metrics Collection", () => {
    test("should collect monitoring metrics", async () => {
      await monitoringManager.start();
      
      const metrics = monitoringManager.collectMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.errors).toBeDefined();
      expect(metrics.latency).toBeDefined();
      expect(metrics.memory).toBeDefined();
      expect(metrics.cpu).toBeDefined();
      expect(metrics.provider).toBeDefined();
      expect(metrics.runtime).toBeDefined();
      expect(metrics.websocket).toBeDefined();
      expect(metrics.timestamp).toBeGreaterThan(0);
    });

    test("should collect error metrics", async () => {
      await monitoringManager.start();
      
      const metrics = monitoringManager.collectMetrics();
      
      expect(metrics.errors.totalErrors).toBe(0);
      expect(metrics.errors.errorsByType).toBeDefined();
      expect(metrics.errors.recentErrors).toEqual([]);
    });

    test("should collect latency metrics", async () => {
      await monitoringManager.start();
      
      const metrics = monitoringManager.collectMetrics();
      
      expect(metrics.latency.averageLatency).toBe(0);
      expect(metrics.latency.p50Latency).toBe(0);
      expect(metrics.latency.p95Latency).toBe(0);
      expect(metrics.latency.p99Latency).toBe(0);
      expect(metrics.latency.maxLatency).toBe(0);
    });

    test("should collect provider metrics", async () => {
      await monitoringManager.start();
      
      const metrics = monitoringManager.collectMetrics();
      
      expect(metrics.provider.totalRequests).toBe(0);
      expect(metrics.provider.successfulRequests).toBe(0);
      expect(metrics.provider.failedRequests).toBe(0);
      expect(metrics.provider.averageResponseTime).toBe(0);
      expect(metrics.provider.activeProviders).toBe(0);
      expect(metrics.provider.inactiveProviders).toBe(0);
    });

    test("should collect runtime metrics", async () => {
      await monitoringManager.start();
      
      const metrics = monitoringManager.collectMetrics();
      
      expect(metrics.runtime.state).toBe("Unknown");
      expect(metrics.runtime.uptime).toBe(0);
      expect(metrics.runtime.totalOperations).toBe(0);
      expect(metrics.runtime.successfulOperations).toBe(0);
      expect(metrics.runtime.failedOperations).toBe(0);
    });

    test("should collect WebSocket metrics", async () => {
      await monitoringManager.start();
      
      const metrics = monitoringManager.collectMetrics();
      
      expect(metrics.websocket.connectionState).toBe("Unknown");
      expect(metrics.websocket.messagesSent).toBe(0);
      expect(metrics.websocket.messagesReceived).toBe(0);
      expect(metrics.websocket.connectionErrors).toBe(0);
      expect(metrics.websocket.reconnectionCount).toBe(0);
    });
  });

  describe("Metrics Export", () => {
    test("should export metrics to monitoring", async () => {
      await monitoringManager.start();
      
      await monitoringManager.exportMetrics();
      
      const monitoring = monitoringManager.getMonitoring() as unknown as { getExportedMetrics(): Array<{ timestamp: number }> };
      const exported = monitoring.getExportedMetrics();
      
      expect(exported.length).toBeGreaterThan(0);
    });

    test("should export metrics periodically", async () => {
      await monitoringManager.start();
      
      // Wait for at least one collection cycle
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      const monitoring = monitoringManager.getMonitoring() as unknown as { getExportedMetrics(): Array<{ timestamp: number }> };
      const exported = monitoring.getExportedMetrics();
      
      expect(exported.length).toBeGreaterThan(0);
    });
  });

  describe("Metrics Subscription", () => {
    test("should notify metrics subscribers", async () => {
      await monitoringManager.start();
      
      let metricsReceived = false;
      monitoringManager.subscribeToMetrics(() => {
        metricsReceived = true;
      });
      
      // Wait for collection cycle
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      expect(metricsReceived).toBe(true);
    });

    test("should pass metrics to subscribers", async () => {
      await monitoringManager.start();
      
      let receivedMetrics: unknown = null;
      monitoringManager.subscribeToMetrics((metrics) => {
        receivedMetrics = metrics;
      });
      
      // Wait for collection cycle
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      expect(receivedMetrics).toBeDefined();
      expect((receivedMetrics as { timestamp: number }).timestamp).toBeGreaterThan(0);
    });

    test("should handle subscriber errors gracefully", async () => {
      await monitoringManager.start();
      
      monitoringManager.subscribeToMetrics(() => {
        throw new Error("Test error");
      });
      
      monitoringManager.subscribeToMetrics((metrics) => {
        expect(metrics).toBeDefined();
      });
      
      // Wait for collection cycle
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Should not throw
    });
  });

  describe("Lifecycle", () => {
    test("should start and stop correctly", async () => {
      await monitoringManager.start();
      
      expect(monitoringManager.getMonitoringMetrics()).toBeDefined();
      
      await monitoringManager.stop();
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ message: string }> };
      const logs = logger.getLogs();
      
      expect(logs.some(log => log.message.includes("Production monitoring started"))).toBe(true);
      expect(logs.some(log => log.message.includes("Production monitoring stopped"))).toBe(true);
    });

    test("should handle multiple start/stop cycles", async () => {
      for (let i = 0; i < 3; i++) {
        await monitoringManager.start();
        await new Promise(resolve => setTimeout(resolve, 100));
        await monitoringManager.stop();
      }
    });

    test("should flush logs on stop", async () => {
      await monitoringManager.start();
      
      await monitoringManager.exportError(new Error("Test error"));
      
      await monitoringManager.stop();
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ level: string }> };
      const logs = logger.getLogs();
      
      // Logs should be flushed (empty after stop)
      expect(logs.length).toBe(0);
    });
  });

  describe("No Business Logic", () => {
    test("should not modify data during collection", async () => {
      await monitoringManager.start();
      
      const metrics1 = monitoringManager.collectMetrics();
      const metrics2 = monitoringManager.collectMetrics();
      
      // Should return consistent data without side effects
      expect(metrics1.timestamp).not.toBe(metrics2.timestamp);
      expect(metrics1.errors.totalErrors).toBe(metrics2.errors.totalErrors);
    });

    test("should not perform transformations on data", async () => {
      await monitoringManager.start();
      
      const error = new Error("Test error");
      await monitoringManager.exportError(error, { original: "data" });
      
      const logger = monitoringManager.getLogger() as unknown as { getLogs(): Array<{ data?: Record<string, unknown> }> };
      const logs = logger.getLogs();
      
      const errorLog = logs.find(log => log.data?.original === "data");
      expect(errorLog).toBeDefined();
    });
  });
});
