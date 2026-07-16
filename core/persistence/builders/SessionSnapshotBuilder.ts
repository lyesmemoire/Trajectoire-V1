/**
 * Session Snapshot Builder
 *
 * Responsibilities:
 * - Build complete session snapshots from Runtime state
 * - Capture all relevant Runtime data for persistence
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY data aggregation
 */

import { RuntimeEngine } from "../providers/runtime/RuntimeEngine";
import { RuntimeManager } from "../providers/runtime/RuntimeManager";
import { DiagnosticCollector } from "../diagnostics/DiagnosticCollector";
import { SessionData } from "./SessionRepository";

// ============================================================================
// SESSION SNAPSHOT BUILDER INTERFACE
// ============================================================================

export interface SessionSnapshotBuilder {
  /**
   * Build a complete session snapshot
   */
  buildSnapshot(sessionId: string, candidateId?: string): SessionData;

  /**
   * Build a minimal session snapshot
   */
  buildMinimalSnapshot(
    sessionId: string,
    candidateId?: string,
  ): Partial<SessionData>;
}

// ============================================================================
// SESSION SNAPSHOT BUILDER IMPLEMENTATION
// ============================================================================

export class SessionSnapshotBuilderImpl implements SessionSnapshotBuilder {
  private runtimeEngine: RuntimeEngine;
  private runtimeManager: RuntimeManager;
  private diagnosticCollector: DiagnosticCollector;

  constructor(
    runtimeEngine: RuntimeEngine,
    runtimeManager: RuntimeManager,
    diagnosticCollector: DiagnosticCollector,
  ) {
    this.runtimeEngine = runtimeEngine;
    this.runtimeManager = runtimeManager;
    this.diagnosticCollector = diagnosticCollector;
  }

  buildSnapshot(sessionId: string, candidateId?: string): SessionData {
    const startedAt = new Date();

    return {
      sessionId,
      candidateId,
      startedAt,
      endedAt: undefined,
      duration: undefined,
      runtimeState: this.captureRuntimeState(),
      providerState: this.captureProviderState(),
      audioState: this.captureAudioState(),
      pipelineState: this.capturePipelineState(),
      timeline: this.captureTimeline(),
      correlationIds: this.captureCorrelationIds(),
      diagnostics: this.captureDiagnostics(),
      metadata: this.captureMetadata(),
      errors: this.captureErrors(),
      events: this.captureEvents(),
      lastSavedAt: undefined,
      saveCount: 0,
    };
  }

  buildMinimalSnapshot(
    sessionId: string,
    candidateId?: string,
  ): Partial<SessionData> {
    return {
      sessionId,
      candidateId,
      startedAt: new Date(),
      runtimeState: this.captureRuntimeState(),
      providerState: this.captureProviderState(),
      metadata: this.captureMetadata(),
    };
  }

  private captureRuntimeState(): Record<string, unknown> {
    return {
      state: this.runtimeManager.getRuntimeState(),
      metrics: this.runtimeManager.getRuntimeMetrics(),
    };
  }

  private captureProviderState(): Record<string, unknown> {
    const provider = this.runtimeEngine.getActiveProvider(
      "RealtimeConversation",
    );
    return {
      providerId: provider?.id,
      providerType: provider?.metadata.type,
      providerStatus: provider?.healthStatus.status,
    };
  }

  private captureAudioState(): Record<string, unknown> {
    // Audio state would be captured from AudioStreamingOrchestrator
    // For now, return minimal state
    return {
      state: "idle",
    };
  }

  private capturePipelineState(): Record<string, unknown> {
    // Pipeline state would be captured from AudioPipelineOrchestrator
    // For now, return minimal state
    return {
      state: "idle",
    };
  }

  private captureTimeline(): Record<string, unknown>[] {
    // Timeline would be captured from DiagnosticCollector
    const events = this.diagnosticCollector
      .getEventRecorder()
      .getRecentEvents(100);
    return events.map((event) => ({
      id: event.id,
      source: event.source,
      eventType: event.eventType,
      timestamp: event.timestamp.toISOString(),
      data: event.data,
    }));
  }

  private captureCorrelationIds(): string[] {
    // Correlation IDs would be captured from CorrelationManager
    return [];
  }

  private captureDiagnostics(): Record<string, unknown> {
    return {
      runtimeMetrics: this.diagnosticCollector.getRuntimeMetrics(),
      providerMetrics: this.diagnosticCollector.getProviderMetrics(),
      audioMetrics: this.diagnosticCollector.getAudioMetrics(),
    };
  }

  private captureMetadata(): Record<string, unknown> {
    return {
      version: "1.0.0",
      environment: "production",
    };
  }

  private captureErrors(): Record<string, unknown>[] {
    // Errors would be captured from DiagnosticCollector
    return [];
  }

  private captureEvents(): Record<string, unknown>[] {
    // Events would be captured from DiagnosticCollector
    const events = this.diagnosticCollector
      .getEventRecorder()
      .getRecentEvents(1000);
    return events.map((event) => ({
      id: event.id,
      source: event.source,
      eventType: event.eventType,
      timestamp: event.timestamp.toISOString(),
      data: event.data,
    }));
  }
}

/**
 * TODO (Sprint C)
 *
 * Introduce incremental snapshots.
 *
 * Current implementation intentionally stores complete snapshots only.
 *
 * Future evolution:
 *   - buildInitialSnapshot()
 *   - buildIncrementalSnapshot()
 *   - buildFinalSnapshot()
 *
 * This evolution must remain transparent for the Runtime.
 * The Runtime must continue producing snapshots without
 * knowing how they are persisted.
 */
