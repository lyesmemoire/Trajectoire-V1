/**
 * Diagnostic Timeline Builder
 *
 * Reconstructs a chronological timeline from diagnostic events.
 * Pure temporal reconstruction, no business logic.
 */

import { DiagnosticEvent } from "./types";
import { DiagnosticEventRecorder } from "./DiagnosticEventRecorder";

export interface TimelineNode {
  timestamp: Date;
  component: string;
  eventType: string;
  description: string;
  metadata?: Record<string, unknown>;
  nextNode?: TimelineNode;
  duration?: number;
}

export class DiagnosticTimelineBuilder {
  /**
   * Build timeline from event recorder
   */
  static buildTimeline(eventRecorder: DiagnosticEventRecorder): TimelineNode[] {
    const events = eventRecorder.getEvents();
    return this.buildTimelineFromEvents(events);
  }

  /**
   * Build timeline from events array
   */
  static buildTimelineFromEvents(events: DiagnosticEvent[]): TimelineNode[] {
    const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const nodes: TimelineNode[] = [];
    
    for (let i = 0; i < sortedEvents.length; i++) {
      const event = sortedEvents[i];
      const nextEvent = sortedEvents[i + 1];
      
      const node: TimelineNode = {
        timestamp: event.timestamp,
        component: event.source,
        eventType: event.eventType,
        description: this.describeEvent(event),
        metadata: event.data,
      };

      if (nextEvent) {
        node.duration = nextEvent.timestamp.getTime() - event.timestamp.getTime();
      }

      nodes.push(node);
    }

    return nodes;
  }

  /**
   * Build formatted timeline with visual arrows
   */
  static buildFormattedTimeline(eventRecorder: DiagnosticEventRecorder): string {
    const nodes = this.buildTimeline(eventRecorder);
    return this.formatTimeline(nodes);
  }

  /**
   * Format timeline with visual arrows
   */
  static formatTimeline(nodes: TimelineNode[]): string {
    const lines: string[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const timeStr = this.formatTimestamp(node.timestamp);
      
      lines.push(`${timeStr}`);
      lines.push(`${node.description}`);
      
      if (node.duration !== undefined && node.duration > 0) {
        lines.push(`↓ (${node.duration}ms)`);
      } else {
        lines.push(`↓`);
      }
      
      if (i < nodes.length - 1) {
        lines.push(``);
      }
    }

    return lines.join('\n');
  }

  /**
   * Format timestamp
   */
  private static formatTimestamp(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * Generate human-readable event description
   */
  private static describeEvent(event: DiagnosticEvent): string {
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
      case "session":
        return this.describeSessionEvent(eventType, data);
      case "connector":
        return this.describeConnectorEvent(eventType, data);
      case "orchestrator":
        return this.describeOrchestratorEvent(eventType, data);
      default:
        return `${source}: ${eventType}`;
    }
  }

  private static describeRuntimeEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "state_change":
        return `Runtime: ${data.from} → ${data.to}`;
      case "state_machine_change":
        return `State Machine: ${data.state}`;
      case "microphone_input":
        return "Microphone input received";
      case "latency_sample":
        return `Latency: ${data.latency}ms`;
      case "timing_start":
        return `Started: ${data.component}`;
      case "timing_stop":
        return `Completed: ${data.component} (${data.duration}ms)`;
      case "connection_state_change":
        return `Connection: ${data.from} → ${data.to}`;
      default:
        return `Runtime: ${eventType}`;
    }
  }

  private static describeProviderEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "active_provider_change":
        return `Provider: ${data.provider}`;
      case "provider_state_change":
        return `Provider State: ${data.state}`;
      case "connection_state_change":
        return `Provider Connection: ${data.from} → ${data.to}`;
      case "heartbeat":
        return "Provider heartbeat";
      case "error":
        return `Provider Error: ${data.message}`;
      case "provider_start":
        return "Provider processing started";
      case "first_token":
        return `First token (${data.providerToFirstToken}ms)`;
      default:
        return `Provider: ${eventType}`;
    }
  }

  private static describeAudioEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "input_buffer_update":
        return `Input Buffer: ${data.size}/${data.maxSize}`;
      case "output_buffer_update":
        return `Output Buffer: ${data.size}/${data.maxSize}`;
      case "buffer_overflow":
        return "Buffer overflow";
      case "buffer_underflow":
        return "Buffer underflow";
      case "vad_state_change":
        return `VAD: ${data.from} → ${data.to}`;
      case "barge_in_state_change":
        return `Barge-In: ${data.from} → ${data.to}`;
      case "first_audio":
        return `First audio (${data.totalResponseTime}ms)`;
      default:
        return `Audio: ${eventType}`;
    }
  }

  private static describeStreamingEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "chunk_sent":
        return `Chunk sent (${data.size} bytes)`;
      case "chunk_received":
        return `Chunk received (${data.size} bytes)`;
      case "streaming_started":
        return "Streaming started";
      case "streaming_stopped":
        return "Streaming stopped";
      case "streaming_resumed":
        return "Streaming resumed";
      case "streaming_interrupted":
        return "Streaming interrupted";
      default:
        return `Streaming: ${eventType}`;
    }
  }

  private static describeSessionEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "session_created":
        return `Session created: ${data.sessionId}`;
      case "session_started":
        return "Session started";
      case "session_ended":
        return "Session ended";
      case "message_sent":
        return "Message sent";
      case "message_received":
        return "Message received";
      default:
        return `Session: ${eventType}`;
    }
  }

  private static describeConnectorEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "connector_connected":
        return "Connector connected";
      case "connector_disconnected":
        return "Connector disconnected";
      case "connector_error":
        return `Connector error: ${data.message}`;
      default:
        return `Connector: ${eventType}`;
    }
  }

  private static describeOrchestratorEvent(eventType: string, data: Record<string, unknown>): string {
    switch (eventType) {
      case "orchestrator_started":
        return "Orchestrator started";
      case "orchestrator_stopped":
        return "Orchestrator stopped";
      case "orchestrator_error":
        return `Orchestrator error: ${data.message}`;
      default:
        return `Orchestrator: ${eventType}`;
    }
  }

  /**
   * Get timeline statistics
   */
  static getTimelineStats(eventRecorder: DiagnosticEventRecorder): {
    totalEvents: number;
    duration: number;
    eventsPerSource: Record<string, number>;
    averageInterval: number;
  } {
    const events = eventRecorder.getEvents();
    if (events.length === 0) {
      return {
        totalEvents: 0,
        duration: 0,
        eventsPerSource: {},
        averageInterval: 0,
      };
    }

    const sortedEvents = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const duration = sortedEvents[sortedEvents.length - 1].timestamp.getTime() - sortedEvents[0].timestamp.getTime();
    
    const eventsPerSource: Record<string, number> = {};
    for (const event of events) {
      eventsPerSource[event.source] = (eventsPerSource[event.source] || 0) + 1;
    }

    let totalInterval = 0;
    for (let i = 1; i < sortedEvents.length; i++) {
      totalInterval += sortedEvents[i].timestamp.getTime() - sortedEvents[i - 1].timestamp.getTime();
    }
    const averageInterval = totalInterval / (sortedEvents.length - 1);

    return {
      totalEvents: events.length,
      duration,
      eventsPerSource,
      averageInterval,
    };
  }
}
