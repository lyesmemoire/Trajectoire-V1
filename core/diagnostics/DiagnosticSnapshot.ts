/**
 * Diagnostic Snapshot Builder
 *
 * Creates a point-in-time snapshot of all diagnostic data.
 * Passive observation only, no business logic.
 */

import { DiagnosticSnapshot, TimelineEntry } from "./types";
import { DiagnosticCollector } from "./DiagnosticCollector";

export class DiagnosticSnapshotBuilder {
  /**
   * Create a snapshot from the diagnostic collector
   */
  static createSnapshot(collector: DiagnosticCollector): DiagnosticSnapshot {
    const timestamp = new Date();

    return {
      timestamp,
      runtime: collector.getRuntimeMetrics().getMetrics(),
      provider: collector.getProviderMetrics().getMetrics(),
      session: {
        activeSession: false,
        sessionId: null,
        sessionDuration: 0,
        messageCount: 0,
        sessionStatus: "idle",
        sessionStartTime: null,
      },
      webSocket: {
        connected: false,
        disconnected: true,
        reconnectionCount: 0,
        lastPingTimestamp: null,
        lastPongTimestamp: null,
        averageResponseTime: 0,
        connectionUptime: 0,
      },
      audio: collector.getAudioMetrics().getMetrics(),
      streaming: collector.getStreamingMetrics().getMetrics(),
      voiceActivity: collector.getVoiceActivityMetrics().getMetrics(),
      latency: collector.getLatencyTracker().getMetrics(),
      processingTimes: collector.getProcessingTimeTracker().getAllMetrics(),
      events: collector.getEventRecorder().getEvents(),
      timeline: this.buildTimeline(collector),
    };
  }

  /**
   * Build timeline from events
   */
  private static buildTimeline(collector: DiagnosticCollector): TimelineEntry[] {
    const events = collector.getEventRecorder().getEvents();
    
    return events.map(event => ({
      timestamp: event.timestamp,
      component: event.source,
      eventType: event.eventType,
      description: this.describeEvent(event),
      metadata: event.data,
    }));
  }

  /**
   * Generate human-readable event description
   */
  private static describeEvent(event: { source: string; eventType: string; data: Record<string, unknown> }): string {
    const { source, eventType, data } = event;

    switch (source) {
      case "runtime":
        return this.describeRuntimeEvent(eventType, data);
      case "provider":
        return this.describeProviderEvent(eventType, data);
      case "audio":
        return this.describeAudioEvent(eventType, data);
      case "streaming":
        return this.describeStreamingEvent(eventType, data);
      default:
        return `${source}: ${eventType}`;
    }
  }

  private static describeRuntimeEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "state_change":
        return `State changed from ${data.from} to ${data.to}`;
      case "state_machine_change":
        return `State machine changed to ${data.state}`;
      case "microphone_input":
        return "Microphone input received";
      case "latency_sample":
        return `Latency: ${data.latency}ms (avg: ${data.average}ms)`;
      case "timing_start":
        return `Started timing: ${data.component}`;
      case "timing_stop":
        return `Stopped timing: ${data.component} (${data.duration}ms)`;
      default:
        return `Runtime: ${eventType}`;
    }
  }

  private static describeProviderEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "active_provider_change":
        return `Active provider changed to ${data.provider}`;
      case "provider_state_change":
        return `Provider state changed to ${data.state}`;
      case "connection_state_change":
        return `Connection changed from ${data.from} to ${data.to}`;
      case "heartbeat":
        return "Heartbeat received";
      case "error":
        return `Provider error: ${data.message}`;
      case "provider_start":
        return "Provider processing started";
      case "first_token":
        return `First token received (${data.providerToFirstToken}ms)`;
      default:
        return `Provider: ${eventType}`;
    }
  }

  private static describeAudioEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "input_buffer_update":
        return `Input buffer: ${data.size}/${data.maxSize} ${data.backpressure ? '(backpressure)' : ''}`;
      case "output_buffer_update":
        return `Output buffer: ${data.size}/${data.maxSize} ${data.backpressure ? '(backpressure)' : ''}`;
      case "buffer_overflow":
        return "Buffer overflow detected";
      case "buffer_underflow":
        return "Buffer underflow detected";
      case "vad_state_change":
        return `VAD changed from ${data.from} to ${data.to}`;
      case "barge_in_state_change":
        return `Barge-In changed from ${data.from} to ${data.to}`;
      case "first_audio":
        return `First audio output (${data.totalResponseTime}ms total)`;
      default:
        return `Audio: ${eventType}`;
    }
  }

  private static describeStreamingEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "chunk_sent":
        return `Chunk sent (${data.size} bytes, total: ${data.totalSent})`;
      case "chunk_received":
        return `Chunk received (${data.size} bytes, total: ${data.totalReceived})`;
      default:
        return `Streaming: ${eventType}`;
    }
  }
}
