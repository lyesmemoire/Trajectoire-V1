/**
 * Monitors connection health: latency, jitter, quality score.
 */

export type ConnectionQuality = "excellent" | "good" | "fair" | "poor" | "disconnected";

export class ConnectionMonitor {
  private readonly latencies: number[] = [];
  private readonly maxSamples: number = 20;
  private lastPingSentAt: number | null = null;

  recordPingSent(): void {
    this.lastPingSentAt = Date.now();
  }

  recordPongReceived(): number | null {
    if (this.lastPingSentAt === null) return null;
    const latency = Date.now() - this.lastPingSentAt;
    this.lastPingSentAt = null;

    this.latencies.push(latency);
    if (this.latencies.length > this.maxSamples) {
      this.latencies.shift();
    }

    return latency;
  }

  get averageLatencyMs(): number | null {
    if (this.latencies.length === 0) return null;
    const sum = this.latencies.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.latencies.length);
  }

  get jitterMs(): number | null {
    if (this.latencies.length < 2) return null;
    const avg = this.averageLatencyMs!;
    const variance = this.latencies.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / this.latencies.length;
    return Math.round(Math.sqrt(variance));
  }

  get lastLatencyMs(): number | null {
    if (this.latencies.length === 0) return null;
    return this.latencies[this.latencies.length - 1]!;
  }

  get quality(): ConnectionQuality {
    const avg = this.averageLatencyMs;
    if (avg === null) return "disconnected";
    if (avg < 50) return "excellent";
    if (avg < 150) return "good";
    if (avg < 300) return "fair";
    return "poor";
  }

  reset(): void {
    this.latencies.length = 0;
    this.lastPingSentAt = null;
  }
}
