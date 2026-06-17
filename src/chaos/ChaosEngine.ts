export type ChaosMode =
  | "ORDER_CORRUPTION"
  | "PAYLOAD_TAMPER"
  | "EVENT_DUPLICATION"
  | "EVENT_DROP"
  | "TIMESTAMP_SKEW"
  | "STATE_NOISE";

export interface ChaosConfig {
  enabled: boolean;
  mode: ChaosMode;
  intensity: number; // 0 → 1
  seed?: number;
}

export class ChaosEngine {
  private seed: number;
  private rng: number;

  constructor(private config: ChaosConfig) {
    this.seed = config.seed ?? 1337;
    this.rng = this.seed;
  }

  private random(): number {
    // deterministic LCG (cert‑friendly)
    this.rng = (this.rng * 1664525 + 1013904223) % 2 ** 32;
    return this.rng / 2 ** 32;
  }

  private shouldTrigger(): boolean {
    if (!this.config.enabled) return false;
    return this.random() < this.config.intensity;
  }

  /**
   * Apply the configured chaos mode to an event.
   * Returns the mutated event, an array of events (duplication), or null (drop).
   */
  apply<T extends Record<string, any>>(event: T): T | T[] | null {
    if (!this.shouldTrigger()) return event;

    switch (this.config.mode) {
      case "EVENT_DROP":
        return null;

      case "EVENT_DUPLICATION":
        // Return original + deep‑clone copy
        return [event, structuredClone(event)] as any;

      case "PAYLOAD_TAMPER":
        return {
          ...event,
          payload: {
            ...(event as any).payload,
            _chaos: true,
          },
        } as any;

      case "TIMESTAMP_SKEW":
        return {
          ...event,
          timestamp: Date.now() + 9999,
        } as any;

      case "ORDER_CORRUPTION":
        return {
          ...event,
          _order: Math.floor(Math.random() * 100000),
        } as any;

      case "STATE_NOISE":
        return {
          ...event,
          noise: Math.random().toString(36),
        } as any;

      default:
        return event;
    }
  }
}
