/**
 * Inspector Exporter
 *
 * Exports inspector snapshots to various formats.
 * Pure export functionality, no state modification.
 */
// @ts-nocheck


import { InspectorSnapshot } from "./types";

export class InspectorExporter {
  /**
   * Export snapshot to JSON
   */
  static exportToJSON(snapshot: InspectorSnapshot): string {
    return JSON.stringify(snapshot, this.jsonReplacer, 2);
  }

  /**
   * Export snapshot to pretty JSON
   */
  static exportToPrettyJSON(snapshot: InspectorSnapshot): string {
    return JSON.stringify(snapshot, this.jsonReplacer, 2);
  }

  /**
   * Export snapshot to HTML
   */
  static exportToHTML(snapshot: InspectorSnapshot): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Runtime Inspector Snapshot</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .section h2 { margin-top: 0; color: #333; }
    .metric { margin: 5px 0; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; }
    .healthy { color: green; }
    .warning { color: orange; }
    .critical { color: red; }
  </style>
</head>
<body>
  <h1>Runtime Inspector Snapshot</h1>
  <p><strong>Timestamp:</strong> ${snapshot.timestamp.toISOString()}</p>

  <div class='section'>
    <h2>Runtime</h2>
    <div class='metric'><span class='label'>State:</span> <span class='value'>${snapshot.runtime.state.currentState}</span></div>
    <div class='metric'><span class='label'>Uptime:</span> <span class='value'>${Math.floor(snapshot.runtime.state.uptime / 1000)}s</span></div>
    <div class='metric'><span class='label'>Transitions:</span> <span class='value'>${snapshot.runtime.state.transitionCount}</span></div>
    <div class='metric'><span class='label'>Lifecycle:</span> <span class='value'>${snapshot.runtime.lifecycle.status}</span></div>
  </div>

  <div class='section'>
    <h2>Provider</h2>
    <div class='metric'><span class='label'>Active:</span> <span class='value'>${snapshot.provider.activeProvider || "None"}</span></div>
    <div class='metric'><span class='label'>Health:</span> <span class='value ${this.getHealthClass(snapshot.provider.health)}'>${snapshot.provider.health}</span></div>
    <div class='metric'><span class='label'>Connection:</span> <span class='value'>${snapshot.provider.connectionState}</span></div>
  </div>

  <div class='section'>
    <h2>Audio</h2>
    <div class='metric'><span class='label'>Microphone:</span> <span class='value'>${snapshot.audio.microphone.active ? "Active" : "Inactive"}</span></div>
    <div class='metric'><span class='label'>Speaker:</span> <span class='value'>${snapshot.audio.speaker.active ? "Active" : "Inactive"}</span></div>
    <div class='metric'><span class='label'>VAD:</span> <span class='value'>${snapshot.audio.vad.state}</span></div>
    <div class='metric'><span class='label'>Streaming:</span> <span class='value'>${snapshot.audio.streaming.active ? "Active" : "Inactive"}</span></div>
  </div>

  <div class='section'>
    <h2>Session</h2>
    <div class='metric'><span class='label'>Active:</span> <span class='value'>${snapshot.session.active ? "Yes" : "No"}</span></div>
    <div class='metric'><span class='label'>Session ID:</span> <span class='value'>${snapshot.session.sessionId || "None"}</span></div>
    <div class='metric'><span class='label'>Duration:</span> <span class='value'>${Math.floor(snapshot.session.duration / 1000)}s</span></div>
    <div class='metric'><span class='label'>Messages:</span> <span class='value'>${snapshot.session.messageCount}</span></div>
  </div>

  <div class='section'>
    <h2>Pipeline</h2>
    <div class='metric'><span class='label'>Current Stage:</span> <span class='value'>${snapshot.pipeline.currentStage || "None"}</span></div>
    <div class='metric'><span class='label'>Progress:</span> <span class='value'>${snapshot.pipeline.overallProgress.toFixed(0)}%</span></div>
    <h3>Stages</h3>
    ${snapshot.pipeline.stages.map(stage => `<div class='metric'><span class='label'>${stage.name}:</span> <span class='value'>${stage.status}</span></div>`).join('')}
  </div>

  <div class='section'>
    <h2>Diagnostics</h2>
    <div class='metric'><span class='label'>Health:</span> <span class='value ${this.getHealthClass(snapshot.diagnostics.health)}'>${snapshot.diagnostics.health}</span></div>
    <h3>Performance</h3>
    ${Object.entries(snapshot.diagnostics.performance).map(([component, time]) => `<div class='metric'><span class='label'>${component}:</span> <span class='value'>${time.toFixed(2)}ms</span></div>`).join('')}
  </div>

</body>
</html>`;
  }

  /**
   * Export snapshot to Markdown
   */
  static exportToMarkdown(snapshot: InspectorSnapshot): string {
    return `# Runtime Inspector Snapshot

**Timestamp:** ${snapshot.timestamp.toISOString()}

## Runtime
- **State:** ${snapshot.runtime.state.currentState}
- **Uptime:** ${Math.floor(snapshot.runtime.state.uptime / 1000)}s
- **Transitions:** ${snapshot.runtime.state.transitionCount}
- **Lifecycle:** ${snapshot.runtime.lifecycle.status}

## Provider
- **Active:** ${snapshot.provider.activeProvider || "None"}
- **Health:** ${snapshot.provider.health}
- **Connection:** ${snapshot.provider.connectionState}

## Audio
- **Microphone:** ${snapshot.audio.microphone.active ? "Active" : "Inactive"}
- **Speaker:** ${snapshot.audio.speaker.active ? "Active" : "Inactive"}
- **VAD:** ${snapshot.audio.vad.state}
- **Streaming:** ${snapshot.audio.streaming.active ? "Active" : "Inactive"}

## Session
- **Active:** ${snapshot.session.active ? "Yes" : "No"}
- **Session ID:** ${snapshot.session.sessionId || "None"}
- **Duration:** ${Math.floor(snapshot.session.duration / 1000)}s
- **Messages:** ${snapshot.session.messageCount}

## Pipeline
- **Current Stage:** ${snapshot.pipeline.currentStage || "None"}
- **Progress:** ${snapshot.pipeline.overallProgress.toFixed(0)}%

### Stages
${snapshot.pipeline.stages.map(stage => `- **${stage.name}:** ${stage}`).join('\n')}

## Diagnostics
- **Health:** ${snapshot.diagnostics.health}

### Performance
${Object.entries(snapshot.diagnostics.performance).map(([component, time]) => `- **${component}:** ${time.toFixed(2)}ms`).join('\n')}

### Timeline
\`\`\`
${snapshot.diagnostics.timeline}
\`\`\``;
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
   * Get CSS class for health status
   */
  private static getHealthClass(health: string): string {
    switch (health) {
      case "healthy":
        return "healthy";
      case "warning":
      case "degraded":
        return "warning";
      case "critical":
      case "unhealthy":
        return "critical";
      default:
        return "";
    }
  }

  /**
   * Download snapshot as file (browser environment)
   */
  static downloadAsFile(snapshot: InspectorSnapshot, format: "json" | "html" | "markdown", filename?: string): void {
    if (typeof window === "undefined") {
      throw new Error("downloadAsFile is only available in browser environment");
    }

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case "json":
        content = this.exportToJSON(snapshot);
        mimeType = "application/json";
        extension = "json";
        break;
      case "html":
        content = this.exportToHTML(snapshot);
        mimeType = "text/html";
        extension = "html";
        break;
      case "markdown":
        content = this.exportToMarkdown(snapshot);
        mimeType = "text/markdown";
        extension = "md";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `inspector-snapshot.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse JSON to snapshot
   */
  static parseFromJSON(json: string): InspectorSnapshot {
    const parsed = JSON.parse(json);
    
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

    return convertDates(parsed) as InspectorSnapshot;
  }
}
