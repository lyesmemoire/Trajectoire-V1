/**
 * runtime/clock.ts — Abstraction du temps (P4.2). Frontière d'effet temporel.
 * SystemClock en prod ; FakeClock (temps virtuel) en test pour le déterminisme.
 */
// @ts-nocheck

export interface Clock {
  now(): number;
  sleep(ms: number, options?: { signal?: AbortSignal }): Promise<void>;
}

export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
  sleep(ms: number, options?: { signal?: AbortSignal }): Promise<void> {
    const signal = options?.signal;
    if (signal?.aborted) {
      const err = new Error(signal.reason ?? "Aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    }
    if (ms <= 0) return Promise.resolve();

    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout;
      
      const onAbort = () => {
        clearTimeout(timeoutId);
        const err = new Error(signal!.reason ?? "Aborted");
        err.name = "AbortError";
        reject(err);
      };

      if (signal) {
        signal.addEventListener("abort", onAbort, { once: true });
      }

      timeoutId = setTimeout(() => {
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        resolve();
      }, ms);
    });
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
  sleep(ms: number, options?: { signal?: AbortSignal }): Promise<void> {
    const signal = options?.signal;
    if (signal?.aborted) {
      const err = new Error(signal.reason ?? "Aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    }
    if (ms <= 0) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      let isSettled = false;
      const resolveWrapper = () => {
        if (isSettled) return;
        isSettled = true;
        if (signal) signal.removeEventListener("abort", onAbort);
        resolve();
      };
      
      const onAbort = () => {
        if (isSettled) return;
        isSettled = true;
        this.pending = this.pending.filter((p) => p.resolve !== resolveWrapper);
        const err = new Error(signal!.reason ?? "Aborted");
        err.name = "AbortError";
        reject(err);
      };

      if (signal) {
        signal.addEventListener("abort", onAbort, { once: true });
      }
      this.pending.push({ at: this.t + ms, resolve: resolveWrapper });
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
