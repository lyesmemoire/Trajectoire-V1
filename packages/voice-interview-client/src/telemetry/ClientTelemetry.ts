/**
 * Client-side telemetry orchestrator.
 * Combines latency tracking with exportable metrics and snapshots.
 */

import type { TelemetryConfig } from "../types/config.js";
import type { TelemetrySnapshot, TelemetryExporterSink, LatencyMetric } from "../types/telemetry.js";
import { LatencyTracker } from "./LatencyTracker.js";
import { NoOpTelemetryExporter, ConsoleTelemetryExporter } from "./TelemetryExporter.js";

let idCounter = 0;
function generateId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter.toString(36)}`;
}

export class ClientTelemetry {
  private readonly tracker: LatencyTracker;
  private readonly exporter: TelemetryExporterSink;
  private readonly enabled: boolean;
  private readonly samplingRate: number;
  private _traceId: string | null = null;
  private _correlationId: string | null = null;
  private _currentState: string = "Disconnected";
  private _currentPhase: string | null = null;
  private _socketStatus: string = "disconnected";
  private _retryCount: number = 0;
  private _protocolVersion: number = 1;

  constructor(config: TelemetryConfig) {
    this.tracker = new LatencyTracker();
    this.enabled = config.enabled;
    this.samplingRate = config.samplingRate;

    if (!config.enabled) {
      this.exporter = new NoOpTelemetryExporter();
    } else if (config.debugOverlay) {
      this.exporter = new ConsoleTelemetryExporter();
    } else {
      this.exporter = new NoOpTelemetryExporter();
    }
  }

  newTrace(): string {
    this._traceId = generateId();
    this._correlationId = generateId();
    return this._traceId;
  }

  startPhase(name: string): void {
    if (!this.shouldSample()) return;
    this.tracker.startPhase(name);
  }

  endPhase(name: string): number | null {
    if (!this.shouldSample()) return null;
    const durationMs = this.tracker.endPhase(name);
    if (durationMs !== null) {
      const metric: LatencyMetric = { name, valueMs: durationMs, timestamp: Date.now() };
      this.exporter.exportMetric(metric);
    }
    return durationMs;
  }

  startRoundTrip(): void {
    this.tracker.startRoundTrip();
  }

  endRoundTrip(): number | null {
    return this.tracker.endRoundTrip();
  }

  updateState(state: string): void {
    this._currentState = state;
  }

  updatePhase(phase: string | null): void {
    this._currentPhase = phase;
  }

  updateSocketStatus(status: string): void {
    this._socketStatus = status;
  }

  updateRetryCount(count: number): void {
    this._retryCount = count;
  }

  get snapshot(): TelemetrySnapshot {
    return Object.freeze({
      sttLatencyMs: this.tracker.getLastTiming("stt"),
      llmLatencyMs: this.tracker.getLastTiming("llm"),
      ttsLatencyMs: this.tracker.getLastTiming("tts"),
      roundTripMs: this.tracker.getLastTiming("roundTrip"),
      wsLatencyMs: this.tracker.getLastTiming("ws"),
      currentState: this._currentState,
      currentPhase: this._currentPhase,
      protocolVersion: this._protocolVersion,
      socketStatus: this._socketStatus,
      retryCount: this._retryCount,
      traceId: this._traceId,
      correlationId: this._correlationId,
    });
  }

  async flush(): Promise<void> {
    await this.exporter.flush();
  }

  reset(): void {
    this.tracker.reset();
    this._traceId = null;
    this._correlationId = null;
    this._currentState = "Disconnected";
    this._currentPhase = null;
    this._socketStatus = "disconnected";
    this._retryCount = 0;
  }

  private shouldSample(): boolean {
    if (!this.enabled) return false;
    return Math.random() < this.samplingRate;
  }
}
