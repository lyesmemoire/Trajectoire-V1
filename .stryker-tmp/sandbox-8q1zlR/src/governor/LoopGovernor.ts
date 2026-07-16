// @ts-nocheck
import { EventStreamBus } from "../distributed/stream/EventStreamBus";
import { GlobalStateStore } from "../observability/GlobalStateStore";
import { TelemetryBus } from "../observability/TelemetryBus";

export interface GovernorConfig {
  maxDeadRatio: number; // dead nodes / active nodes threshold
  maxQueuedTasks: number; // threshold for queued tasks before throttling
  checkIntervalMs: number;
}

export const defaultGovernorConfig: GovernorConfig = {
  maxDeadRatio: 0.5,
  maxQueuedTasks: 20,
  checkIntervalMs: 1000,
};

export class LoopGovernor {
  private config: GovernorConfig;
  private interval?: NodeJS.Timeout;

  constructor(config?: Partial<GovernorConfig>) {
    this.config = { ...defaultGovernorConfig, ...config };
  }

  start() {
    this.interval = setInterval(() => this.evaluate(), this.config.checkIntervalMs);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private evaluate() {
    const state = GlobalStateStore.snapshot();
    const { activeNodes, deadNodes, queuedTasks } = state;

    // 1. dead node ratio
    if (activeNodes > 0 && deadNodes / activeNodes > this.config.maxDeadRatio) {
      this.emitStop("Dead node ratio too high");
      return;
    }

    // 2. queued tasks overload
    if (queuedTasks > this.config.maxQueuedTasks) {
      this.emitThrottle("Task queue overload");
    }
  }

  private emitStop(reason: string) {
    EventStreamBus.publish({
      type: "GOVERNOR_ACTION",
      action: "STOP_LOOP",
      reason,
      ts: Date.now(),
    });
    TelemetryBus.emit({
      type: "GOVERNOR_STOP",
      value: 1,
      meta: { reason },
      ts: Date.now(),
    });
  }

  private emitThrottle(reason: string) {
    EventStreamBus.publish({
      type: "GOVERNOR_ACTION",
      action: "THROTTLE",
      reason,
      ts: Date.now(),
    });
    TelemetryBus.emit({
      type: "GOVERNOR_THROTTLE",
      value: 1,
      meta: { reason },
      ts: Date.now(),
    });
  }
}
