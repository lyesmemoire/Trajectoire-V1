import { ChaosEngine } from "../ChaosEngine";

export type AttackType =
  | "REPLAY_DESYNC_STORM"
  | "EVENT_STAMPEDROP"
  | "ORDER_INVERSION_BURST"
  | "PAYLOAD_CORRUPTION_WAVE"
  | "DUPLICATION_AMPLIFIER"
  | "TIMESTAMP_DRIFT_FIELD"
  | "STATE_EXPLOSION";

export interface AttackConfig {
  type: AttackType;
  intensity: number; // 0 → 1
  durationEvents: number;
  seed: number;
}

export class AttackSuite {
  private chaos: ChaosEngine;
  private counter = 0;

  constructor(private config: AttackConfig) {
    this.chaos = new ChaosEngine({
      enabled: true,
      mode: "PAYLOAD_TAMPER",
      intensity: config.intensity,
      seed: config.seed,
    });
  }

  shouldContinue(): boolean {
    return this.counter < this.config.durationEvents;
  }

  apply<T extends Record<string, any>>(event: T): T | T[] | null {
    this.counter++;

    switch (this.config.type) {
      case "REPLAY_DESYNC_STORM":
        return this.mutateReplayDesync(event);
      case "EVENT_STAMPEDROP":
        return this.randomDrop(event);
      case "ORDER_INVERSION_BURST":
        return this.invertOrder(event);
      case "PAYLOAD_CORRUPTION_WAVE":
        return this.chaos.apply(event);
      case "DUPLICATION_AMPLIFIER":
        return [event, structuredClone(event)] as any;
      case "TIMESTAMP_DRIFT_FIELD":
        return {
          ...event,
          timestamp: Date.now() + Math.floor(Math.random() * 100000),
        } as any;
      case "STATE_EXPLOSION":
        return {
          ...event,
          payload: {
            ...(event as any).payload,
            chaos: true,
            entropy: Math.random(),
          },
        } as any;
      default:
        return event;
    }
  }

  private randomDrop<T>(event: T): T | null {
    return Math.random() < this.config.intensity ? null : event;
  }

  private invertOrder<T>(event: T): T {
    return {
      ...event,
      _priority: Math.floor(Math.random() * 1000000),
    } as any;
  }

  private mutateReplayDesync<T>(event: T): T {
    return {
      ...event,
      payload: {
        ...(event as any).payload,
        _desync: Math.random().toString(36),
      },
    } as any;
  }
}
