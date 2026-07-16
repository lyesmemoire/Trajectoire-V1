/**
 * metrics.ts — Observabilité minimaliste du runtime vocal (P4.2).
 *
 * Compteurs statiques basiques en mémoire pour exposer l'état de santé du
 * système via l'endpoint /health.
 */
// @ts-nocheck


interface MetricsSnapshot {
  activeSessions: number;
  totalSessionsCreated: number;
  totalAborts: number;
  avgSessionDurationMs: number;
  avgLatencyToFirstAudioMs: number;
}

class MetricsRegistry {
  public totalSessionsCreated = 0;
  public totalAborts = 0;
  
  private sessionDurationsMs: number[] = [];
  private latenciesToFirstAudioMs: number[] = [];

  recordSessionCreated() {
    this.totalSessionsCreated++;
  }

  recordSessionDuration(durationMs: number) {
    this.sessionDurationsMs.push(durationMs);
    // Keep only the last 1000 items to avoid memory leaks
    if (this.sessionDurationsMs.length > 1000) {
      this.sessionDurationsMs.shift();
    }
  }

  recordAbort() {
    this.totalAborts++;
  }

  recordLatencyToFirstAudio(latencyMs: number) {
    this.latenciesToFirstAudioMs.push(latencyMs);
    if (this.latenciesToFirstAudioMs.length > 1000) {
      this.latenciesToFirstAudioMs.shift();
    }
  }

  getSnapshot(activeSessions: number): MetricsSnapshot {
    return {
      activeSessions,
      totalSessionsCreated: this.totalSessionsCreated,
      totalAborts: this.totalAborts,
      avgSessionDurationMs: this.computeAvg(this.sessionDurationsMs),
      avgLatencyToFirstAudioMs: this.computeAvg(this.latenciesToFirstAudioMs),
    };
  }

  private computeAvg(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
  }
}

export const metrics = new MetricsRegistry();
