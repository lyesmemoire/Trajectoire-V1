/**
 * Diagnostic Health Checker
 *
 * Provides technical health indicators based on metrics.
 * No AI reasoning, only metric summarization.
 */

import { DiagnosticCollector } from "./DiagnosticCollector";

export type HealthStatus = "healthy" | "warning" | "critical";

export interface ComponentHealth {
  component: string;
  status: HealthStatus;
  message: string;
  metrics: Record<string, unknown>;
}

export interface SystemHealth {
  overall: HealthStatus;
  components: ComponentHealth[];
  timestamp: Date;
}

export class DiagnosticHealthChecker {
  private static readonly BUFFER_WARNING_THRESHOLD = 0.8;
  private static readonly BUFFER_CRITICAL_THRESHOLD = 0.95;
  private static readonly LATENCY_WARNING_THRESHOLD = 500;
  private static readonly LATENCY_CRITICAL_THRESHOLD = 1000;
  private static readonly ERROR_WARNING_THRESHOLD = 5;
  private static readonly ERROR_CRITICAL_THRESHOLD = 10;
  private static readonly OVERFLOW_WARNING_THRESHOLD = 3;
  private static readonly OVERFLOW_CRITICAL_THRESHOLD = 10;

  /**
   * Check system health
   */
  static checkHealth(collector: DiagnosticCollector): SystemHealth {
    const components: ComponentHealth[] = [
      this.checkRuntimeHealth(collector),
      this.checkProviderHealth(collector),
      this.checkAudioHealth(collector),
      this.checkStreamingHealth(collector),
      this.checkLatencyHealth(collector),
      this.checkWebSocketHealth(collector),
      this.checkSessionHealth(collector),
    ];

    const overall = this.calculateOverallHealth(components);

    return {
      overall,
      components,
      timestamp: new Date(),
    };
  }

  /**
   * Check Runtime health
   */
  private static checkRuntimeHealth(collector: DiagnosticCollector): ComponentHealth {
    const metrics = collector.getRuntimeMetrics().getMetrics();
    
    const status: HealthStatus = "healthy";
    const message = `State: ${metrics.currentState}, Transitions: ${metrics.transitionCount}`;

    return {
      component: "Runtime",
      status,
      message,
      metrics: {
        currentState: metrics.currentState,
        transitionCount: metrics.transitionCount,
        uptime: metrics.uptime,
      },
    };
  }

  /**
   * Check Provider health
   */
  private static checkProviderHealth(collector: DiagnosticCollector): ComponentHealth {
    const metrics = collector.getProviderMetrics().getMetrics();
    
    let status: HealthStatus = "healthy";
    const issues: string[] = [];

    if (metrics.errorCount >= this.ERROR_CRITICAL_THRESHOLD) {
      status = "critical";
      issues.push(`High error count: ${metrics.errorCount}`);
    } else if (metrics.errorCount >= this.ERROR_WARNING_THRESHOLD) {
      status = "warning";
      issues.push(`Elevated error count: ${metrics.errorCount}`);
    }

    if (metrics.connectionState !== "connected") {
      status = status === "critical" ? "critical" : "warning";
      issues.push(`Connection state: ${metrics.connectionState}`);
    }

    const message = issues.length > 0 
      ? issues.join(", ")
      : `Provider: ${metrics.activeProvider || "None"}, Connected`;

    return {
      component: "Provider",
      status,
      message,
      metrics: {
        activeProvider: metrics.activeProvider,
        connectionState: metrics.connectionState,
        errorCount: metrics.errorCount,
      },
    };
  }

  /**
   * Check Audio health
   */
  private static checkAudioHealth(collector: DiagnosticCollector): ComponentHealth {
    const metrics = collector.getAudioMetrics().getMetrics();
    
    let status: HealthStatus = "healthy";
    const issues: string[] = [];

    const inputBufferRatio = metrics.inputBufferMaxSize > 0 
      ? metrics.inputBufferSize / metrics.inputBufferMaxSize 
      : 0;
    const outputBufferRatio = metrics.outputBufferMaxSize > 0 
      ? metrics.outputBufferSize / metrics.outputBufferMaxSize 
      : 0;

    const maxBufferRatio = Math.max(inputBufferRatio, outputBufferRatio);

    if (maxBufferRatio >= this.BUFFER_CRITICAL_THRESHOLD) {
      status = "critical";
      issues.push(`Buffer at ${(maxBufferRatio * 100).toFixed(0)}%`);
    } else if (maxBufferRatio >= this.BUFFER_WARNING_THRESHOLD) {
      status = "warning";
      issues.push(`Buffer at ${(maxBufferRatio * 100).toFixed(0)}%`);
    }

    if (metrics.overflowCount >= this.OVERFLOW_CRITICAL_THRESHOLD) {
      status = "critical";
      issues.push(`Overflow count: ${metrics.overflowCount}`);
    } else if (metrics.overflowCount >= this.OVERFLOW_WARNING_THRESHOLD) {
      status = status === "critical" ? "critical" : "warning";
      issues.push(`Overflow count: ${metrics.overflowCount}`);
    }

    const message = issues.length > 0 
      ? issues.join(", ")
      : `Input: ${metrics.inputBufferSize}, Output: ${metrics.outputBufferSize}`;

    return {
      component: "Audio",
      status,
      message,
      metrics: {
        inputBufferSize: metrics.inputBufferSize,
        outputBufferSize: metrics.outputBufferSize,
        overflowCount: metrics.overflowCount,
        underflowCount: metrics.underflowCount,
        backpressure: metrics.backpressure,
      },
    };
  }

  /**
   * Check Streaming health
   */
  private static checkStreamingHealth(collector: DiagnosticCollector): ComponentHealth {
    const metrics = collector.getStreamingMetrics().getMetrics();
    
    const status: HealthStatus = "healthy";
    const message = `Chunks: ${metrics.chunksSent} sent, ${metrics.chunksReceived} received, ${metrics.chunksPerSecond.toFixed(1)}/s`;

    return {
      component: "Streaming",
      status,
      message,
      metrics: {
        chunksSent: metrics.chunksSent,
        chunksReceived: metrics.chunksReceived,
        chunksPerSecond: metrics.chunksPerSecond,
        bytesPerSecond: metrics.bytesPerSecond,
      },
    };
  }

  /**
   * Check Latency health
   */
  private static checkLatencyHealth(collector: DiagnosticCollector): ComponentHealth {
    const metrics = collector.getLatencyTracker().getMetrics();
    
    let status: HealthStatus = "healthy";
    const issues: string[] = [];

    if (metrics.totalResponseTime >= this.LATENCY_CRITICAL_THRESHOLD) {
      status = "critical";
      issues.push(`High latency: ${metrics.totalResponseTime}ms`);
    } else if (metrics.totalResponseTime >= this.LATENCY_WARNING_THRESHOLD) {
      status = "warning";
      issues.push(`Elevated latency: ${metrics.totalResponseTime}ms`);
    }

    const message = issues.length > 0 
      ? issues.join(", ")
      : `Total: ${metrics.totalResponseTime}ms, Avg: ${metrics.averageLatency.toFixed(0)}ms`;

    return {
      component: "Latency",
      status,
      message,
      metrics: {
        microphoneToProvider: metrics.microphoneToProvider,
        providerToFirstToken: metrics.providerToFirstToken,
        firstTokenToFirstAudio: metrics.firstTokenToFirstAudio,
        totalResponseTime: metrics.totalResponseTime,
        averageLatency: metrics.averageLatency,
        maxLatency: metrics.maxLatency,
        minLatency: metrics.minLatency,
      },
    };
  }

  /**
   * Check WebSocket health
   */
  private static checkWebSocketHealth(collector: DiagnosticCollector): ComponentHealth {
    const connectionStates = collector.getConnectionStateTracker().getAllStates();
    
    let status: HealthStatus = "healthy";
    const issues: string[] = [];

    const connectedComponents = connectionStates.filter(s => s.state === "connected");
    const disconnectedComponents = connectionStates.filter(s => s.state === "disconnected");
    const errorComponents = connectionStates.filter(s => s.state === "error");

    if (errorComponents.length > 0) {
      status = "critical";
      issues.push(`${errorComponents.length} component(s) in error`);
    } else if (disconnectedComponents.length > connectedComponents.length) {
      status = "warning";
      issues.push(`${disconnectedComponents.length} component(s) disconnected`);
    }

    const message = issues.length > 0 
      ? issues.join(", ")
      : `${connectedComponents.length} component(s) connected`;

    return {
      component: "WebSocket",
      status,
      message,
      metrics: {
        connectedCount: connectedComponents.length,
        disconnectedCount: disconnectedComponents.length,
        errorCount: errorComponents.length,
      },
    };
  }

  /**
   * Check Session health
   */
  private static checkSessionHealth(_collector: DiagnosticCollector): ComponentHealth {
    const status: HealthStatus = "healthy";
    const message = "Session monitoring active";

    return {
      component: "Session",
      status,
      message,
      metrics: {},
    };
  }

  /**
   * Calculate overall health
   */
  private static calculateOverallHealth(components: ComponentHealth[]): HealthStatus {
    const criticalCount = components.filter(c => c.status === "critical").length;
    const warningCount = components.filter(c => c.status === "warning").length;

    if (criticalCount > 0) {
      return "critical";
    }
    if (warningCount > 0) {
      return "warning";
    }
    return "healthy";
  }

  /**
   * Get health summary as formatted string
   */
  static getHealthSummary(collector: DiagnosticCollector): string {
    const health = this.checkHealth(collector);
    const lines: string[] = [];

    lines.push(`Overall: ${this.formatStatus(health.overall)}`);
    lines.push(``);

    for (const component of health.components) {
      lines.push(`${component.component}`);
      lines.push(`${this.formatStatus(component.status)} ${component.message}`);
      lines.push(``);
    }

    return lines.join('\n');
  }

  /**
   * Format health status with emoji
   */
  private static formatStatus(status: HealthStatus): string {
    switch (status) {
      case "healthy":
        return "✔";
      case "warning":
        return "⚠";
      case "critical":
        return "✖";
    }
  }
}
