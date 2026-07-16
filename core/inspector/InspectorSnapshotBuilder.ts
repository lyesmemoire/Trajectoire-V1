/**
 * Inspector Snapshot Builder
 *
 * Builds global snapshots containing all inspector data.
 * Pure snapshot construction, no state modification.
 */

import { InspectorSnapshot, PipelineState, DigitalTwinState } from "./types";
import { RuntimeStateInspector } from "./RuntimeStateInspector";
import { ProviderInspector } from "./ProviderInspector";
import { AudioInspector } from "./AudioInspector";
import { SessionInspector } from "./SessionInspector";
import { DigitalTwinInspector } from "./DigitalTwinInspector";
import { PipelineInspector } from "./PipelineInspector";
import { DiagnosticCollector } from "../diagnostics/DiagnosticCollector";

export class InspectorSnapshotBuilder {
  private runtimeInspector: RuntimeStateInspector;
  private providerInspector: ProviderInspector;
  private audioInspector: AudioInspector;
  private sessionInspector: SessionInspector;
  private digitalTwinInspector: DigitalTwinInspector;
  private pipelineInspector: PipelineInspector;
  private diagnosticCollector: DiagnosticCollector;

  constructor(
    runtimeInspector: RuntimeStateInspector,
    providerInspector: ProviderInspector,
    audioInspector: AudioInspector,
    sessionInspector: SessionInspector,
    digitalTwinInspector: DigitalTwinInspector,
    pipelineInspector: PipelineInspector,
    diagnosticCollector: DiagnosticCollector
  ) {
    this.runtimeInspector = runtimeInspector;
    this.providerInspector = providerInspector;
    this.audioInspector = audioInspector;
    this.sessionInspector = sessionInspector;
    this.digitalTwinInspector = digitalTwinInspector;
    this.pipelineInspector = pipelineInspector;
    this.diagnosticCollector = diagnosticCollector;
  }

  /**
   * Build complete inspector snapshot
   * Read-only snapshot of all inspector data
   */
  buildSnapshot(): InspectorSnapshot {
    const health = this.diagnosticCollector.checkHealth();
    const performance = this.diagnosticCollector.getPerformanceProfiler().getPerformanceReport();

    const perfMap: Record<string, number> = {};
    for (const comp of performance.components) {
      perfMap[comp.component] = comp.averageTime;
    }

    return {
      timestamp: new Date(),
      runtime: {
        state: this.runtimeInspector.getRuntimeState(),
        context: this.runtimeInspector.getRuntimeContext(),
        queue: this.runtimeInspector.getRuntimeQueue(),
        lifecycle: this.runtimeInspector.getRuntimeLifecycle(),
      },
      provider: this.providerInspector.getProviderState(),
      audio: this.audioInspector.getAudioState(),
      session: this.sessionInspector.getSessionState(),
      digitalTwin: this.digitalTwinInspector.getDigitalTwinState(),
      pipeline: this.pipelineInspector.getPipelineState(),
      diagnostics: {
        health: health.overall,
        performance: perfMap,
        timeline: this.diagnosticCollector.buildFormattedTimeline(),
      },
    };
  }

  /**
   * Build minimal snapshot (runtime + provider + audio only)
   * Read-only minimal snapshot
   */
  buildMinimalSnapshot(): Partial<InspectorSnapshot> {
    return {
      timestamp: new Date(),
      runtime: {
        state: this.runtimeInspector.getRuntimeState(),
        context: this.runtimeInspector.getRuntimeContext(),
        queue: this.runtimeInspector.getRuntimeQueue(),
        lifecycle: this.runtimeInspector.getRuntimeLifecycle(),
      },
      provider: this.providerInspector.getProviderState(),
      audio: this.audioInspector.getAudioState(),
    };
  }

  /**
   * Build pipeline-focused snapshot
   * Read-only pipeline snapshot
   */
  buildPipelineSnapshot(): {
    timestamp: Date;
    pipeline: PipelineState;
    digitalTwin: DigitalTwinState;
  } {
    return {
      timestamp: new Date(),
      pipeline: this.pipelineInspector.getPipelineState(),
      digitalTwin: this.digitalTwinInspector.getDigitalTwinState(),
    };
  }

  /**
   * Build diagnostic-focused snapshot
   * Read-only diagnostic snapshot
   */
  buildDiagnosticSnapshot(): {
    timestamp: Date;
    diagnostics: InspectorSnapshot["diagnostics"];
  } {
    const health = this.diagnosticCollector.checkHealth();
    const performance = this.diagnosticCollector.getPerformanceProfiler().getPerformanceReport();

    const perfMap: Record<string, number> = {};
    for (const comp of performance.components) {
      perfMap[comp.component] = comp.averageTime;
    }

    return {
      timestamp: new Date(),
      diagnostics: {
        health: health.overall,
        performance: perfMap,
        timeline: this.diagnosticCollector.buildFormattedTimeline(),
      },
    };
  }
}
