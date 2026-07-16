/**
 * TelemetryAdapter
 *
 * Infrastructure adapter for telemetry.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY telemetry implementation.
 */

import { TelemetryPort } from "../../application/ports/TelemetryPort";
import { ConfigurationService } from "../configuration/ConfigurationService";

export class TelemetryAdapter implements TelemetryPort {
  private metrics: Map<string, number> = new Map();
  private timers: Map<string, number> = new Map();

  constructor(private readonly configurationService: ConfigurationService) {}

  trackMetric(name: string, value: number, tags?: Record<string, unknown>): void {
    const config = this.configurationService.getTelemetryConfig();

    if (!config.enabled) {
      return;
    }

    if (Math.random() > config.samplingRate) {
      return;
    }

    this.metrics.set(name, value);

    if (config.endpoint && config.apiKey) {
      this.sendMetric(name, value, tags);
    }
  }

  trackEvent(name: string, properties?: Record<string, unknown>): void {
    const config = this.configurationService.getTelemetryConfig();

    if (!config.enabled) {
      return;
    }

    if (Math.random() > config.samplingRate) {
      return;
    }

    if (config.endpoint && config.apiKey) {
      this.sendEvent(name, properties);
    }
  }

  trackError(error: Error, context?: Record<string, unknown>): void {
    const config = this.configurationService.getTelemetryConfig();

    if (!config.enabled) {
      return;
    }

    if (config.endpoint && config.apiKey) {
      this.sendError(error, context);
    }
  }

  startTimer(operationName: string): { stop: () => number } {
    const startTime = Date.now();
    this.timers.set(operationName, startTime);

    return {
      stop: () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        this.timers.delete(operationName);
        return duration;
      },
    };
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  reset(): void {
    this.metrics.clear();
    this.timers.clear();
  }

  private async sendMetric(name: string, value: number, tags?: Record<string, unknown>): Promise<void> {
    const config = this.configurationService.getTelemetryConfig();

    try {
      await fetch(`${config.endpoint}/metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          name,
          value,
          tags: tags || {},
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send metric:", error);
    }
  }

  private async sendEvent(name: string, properties?: Record<string, unknown>): Promise<void> {
    const config = this.configurationService.getTelemetryConfig();

    try {
      await fetch(`${config.endpoint}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          name,
          properties: properties || {},
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send event:", error);
    }
  }

  private async sendError(error: Error, context?: Record<string, unknown>): Promise<void> {
    const config = this.configurationService.getTelemetryConfig();

    try {
      await fetch(`${config.endpoint}/errors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context: context || {},
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to send error:", error);
    }
  }
}
