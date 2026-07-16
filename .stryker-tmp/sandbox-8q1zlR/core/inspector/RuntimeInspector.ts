/**
 * Runtime Inspector
 *
 * Main aggregator for all inspector components.
 * Passive observation only, no business logic.
 */
// @ts-nocheck


import { RuntimeStateInspector } from "./RuntimeStateInspector";
import { ProviderInspector } from "./ProviderInspector";
import { AudioInspector } from "./AudioInspector";
import { SessionInspector } from "./SessionInspector";
import { DigitalTwinInspector } from "./DigitalTwinInspector";
import { PipelineInspector } from "./PipelineInspector";
import { InspectorSnapshotBuilder } from "./InspectorSnapshotBuilder";
import { DiagnosticCollector } from "../diagnostics/DiagnosticCollector";

export class RuntimeInspector {
  private runtimeStateInspector: RuntimeStateInspector;
  private providerInspector: ProviderInspector;
  private audioInspector: AudioInspector;
  private sessionInspector: SessionInspector;
  private digitalTwinInspector: DigitalTwinInspector;
  private pipelineInspector: PipelineInspector;
  private snapshotBuilder: InspectorSnapshotBuilder;

  constructor(diagnosticCollector: DiagnosticCollector) {
    this.runtimeStateInspector = new RuntimeStateInspector();
    this.providerInspector = new ProviderInspector();
    this.audioInspector = new AudioInspector();
    this.sessionInspector = new SessionInspector();
    this.digitalTwinInspector = new DigitalTwinInspector();
    this.pipelineInspector = new PipelineInspector();
    this.snapshotBuilder = new InspectorSnapshotBuilder(
      this.runtimeStateInspector,
      this.providerInspector,
      this.audioInspector,
      this.sessionInspector,
      this.digitalTwinInspector,
      this.pipelineInspector,
      diagnosticCollector
    );
  }

  /**
   * Get Runtime State Inspector
   */
  getRuntimeStateInspector(): RuntimeStateInspector {
    return this.runtimeStateInspector;
  }

  /**
   * Get Provider Inspector
   */
  getProviderInspector(): ProviderInspector {
    return this.providerInspector;
  }

  /**
   * Get Audio Inspector
   */
  getAudioInspector(): AudioInspector {
    return this.audioInspector;
  }

  /**
   * Get Session Inspector
   */
  getSessionInspector(): SessionInspector {
    return this.sessionInspector;
  }

  /**
   * Get Digital Twin Inspector
   */
  getDigitalTwinInspector(): DigitalTwinInspector {
    return this.digitalTwinInspector;
  }

  /**
   * Get Pipeline Inspector
   */
  getPipelineInspector(): PipelineInspector {
    return this.pipelineInspector;
  }

  /**
   * Get Snapshot Builder
   */
  getSnapshotBuilder(): InspectorSnapshotBuilder {
    return this.snapshotBuilder;
  }

  /**
   * Build complete snapshot
   */
  buildSnapshot() {
    return this.snapshotBuilder.buildSnapshot();
  }

  /**
   * Build minimal snapshot
   */
  buildMinimalSnapshot() {
    return this.snapshotBuilder.buildMinimalSnapshot();
  }

  /**
   * Build pipeline snapshot
   */
  buildPipelineSnapshot() {
    return this.snapshotBuilder.buildPipelineSnapshot();
  }

  /**
   * Build diagnostic snapshot
   */
  buildDiagnosticSnapshot() {
    return this.snapshotBuilder.buildDiagnosticSnapshot();
  }
}
