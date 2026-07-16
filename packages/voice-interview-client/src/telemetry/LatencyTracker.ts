/**
 * Tracks per-phase latencies (STT, LLM, TTS, round-trip).
 */

export interface PhaseTiming {
  readonly name: string;
  readonly startedAt: number;
  readonly endedAt: number | null;
  readonly durationMs: number | null;
}

export class LatencyTracker {
  private readonly phases: Map<string, number> = new Map();
  private readonly history: PhaseTiming[] = [];
  private roundTripStart: number | null = null;

  startPhase(name: string): void {
    this.phases.set(name, Date.now());
  }

  endPhase(name: string): number | null {
    const startedAt = this.phases.get(name);
    if (startedAt === undefined) return null;

    const endedAt = Date.now();
    const durationMs = endedAt - startedAt;
    this.phases.delete(name);

    this.history.push(Object.freeze({
      name,
      startedAt,
      endedAt,
      durationMs,
    }));

    return durationMs;
  }

  startRoundTrip(): void {
    this.roundTripStart = Date.now();
  }

  endRoundTrip(): number | null {
    if (this.roundTripStart === null) return null;
    const duration = Date.now() - this.roundTripStart;
    this.roundTripStart = null;
    return duration;
  }

  getLastTiming(name: string): number | null {
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i]!.name === name) {
        return this.history[i]!.durationMs;
      }
    }
    return null;
  }

  get allTimings(): readonly PhaseTiming[] {
    return Object.freeze([...this.history]);
  }

  reset(): void {
    this.phases.clear();
    this.history.length = 0;
    this.roundTripStart = null;
  }
}
