/**
 * runtime/clock.ts — Abstraction du temps (P4.2). Frontière d'effet temporel.
 * SystemClock en prod ; FakeClock (temps virtuel) en test pour le déterminisme.
 */
export interface Clock {
  now(): number;
  sleep(ms: number): Promise<void>;
}

export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
  sleep(ms: number): Promise<void> {
    if (ms <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class FakeClock implements Clock {
  private t: number;
  private pending: Array<{ at: number; resolve: () => void }> = [];
  constructor(start = 0) {
    this.t = start;
  }
  now(): number {
    return this.t;
  }
  sleep(ms: number): Promise<void> {
    if (ms <= 0) return Promise.resolve();
    return new Promise((resolve) => {
      this.pending.push({ at: this.t + ms, resolve });
    });
  }
  advance(ms: number): void {
    this.t += ms;
    const due = this.pending.filter((p) => p.at <= this.t);
    this.pending = this.pending.filter((p) => p.at > this.t);
    for (const p of due) p.resolve();
  }
  pendingCount(): number {
    return this.pending.length;
  }
}
