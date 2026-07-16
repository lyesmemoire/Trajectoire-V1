/**
 * Diagnostic Exporter
 *
 * Exports diagnostic snapshots to JSON format.
 * Passive export only, no business logic.
 */

import { DiagnosticSnapshot } from "./types";
import { DiagnosticCollector } from "./DiagnosticCollector";
import { DiagnosticSnapshotBuilder } from "./DiagnosticSnapshot";

export class DiagnosticExporter {
  /**
   * Export current diagnostic state to JSON
   */
  static exportToJSON(collector: DiagnosticCollector): string {
    const snapshot = DiagnosticSnapshotBuilder.createSnapshot(collector);
    return JSON.stringify(snapshot, null, 2);
  }

  /**
   * Export diagnostic snapshot to JSON
   */
  static exportSnapshotToJSON(snapshot: DiagnosticSnapshot): string {
    return JSON.stringify(snapshot, null, 2);
  }

  /**
   * Export diagnostic state to JSON with custom formatting
   */
  static exportToJSONPretty(collector: DiagnosticCollector): string {
    const snapshot = DiagnosticSnapshotBuilder.createSnapshot(collector);
    return JSON.stringify(snapshot, this.jsonReplacer, 2);
  }

  /**
   * JSON replacer for handling Date objects
   */
  private static jsonReplacer(key: string, value: unknown): unknown {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }

  /**
   * Export minimal diagnostic state (metrics only, no events)
   */
  static exportMetricsOnly(collector: DiagnosticCollector): string {
    const snapshot = DiagnosticSnapshotBuilder.createSnapshot(collector);
    const minimal = {
      timestamp: snapshot.timestamp,
      runtime: snapshot.runtime,
      provider: snapshot.provider,
      audio: snapshot.audio,
      streaming: snapshot.streaming,
      voiceActivity: snapshot.voiceActivity,
      latency: snapshot.latency,
      processingTimes: snapshot.processingTimes,
    };
    return JSON.stringify(minimal, this.jsonReplacer, 2);
  }

  /**
   * Export events only
   */
  static exportEventsOnly(collector: DiagnosticCollector): string {
    const events = collector.getEventRecorder().getEvents();
    return JSON.stringify(events, this.jsonReplacer, 2);
  }

  /**
   * Export timeline only
   */
  static exportTimelineOnly(collector: DiagnosticCollector): string {
    const snapshot = DiagnosticSnapshotBuilder.createSnapshot(collector);
    return JSON.stringify(snapshot.timeline, this.jsonReplacer, 2);
  }

  /**
   * Export to downloadable file (browser environment)
   */
  static downloadAsFile(collector: DiagnosticCollector, filename: string = "diagnostic-snapshot.json"): void {
    if (typeof window === "undefined") {
      throw new Error("downloadAsFile is only available in browser environment");
    }

    const json = this.exportToJSONPretty(collector);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse JSON to diagnostic snapshot
   */
  static parseFromJSON(json: string): DiagnosticSnapshot {
    const parsed = JSON.parse(json);
    
    // Convert ISO strings back to Date objects
    const convertDates = (obj: unknown): unknown => {
      if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
        return new Date(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(convertDates);
      }
      if (obj !== null && typeof obj === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          result[key] = convertDates(value);
        }
        return result;
      }
      return obj;
    };

    return convertDates(parsed) as DiagnosticSnapshot;
  }
}
