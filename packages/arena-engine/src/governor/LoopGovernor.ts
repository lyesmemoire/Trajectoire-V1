import { IWorldRuntime } from "../ports/IWorldRuntime";
import { TelemetryBus } from "../observability/TelemetryBus";
import { IClock, ITimer, TimerHandle } from "../ports/IInfra";

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
  private interval?: TimerHandle;

  constructor(
    private readonly clock: IClock,
    private readonly timer: ITimer,
    private world: IWorldRuntime,
    config?: Partial<GovernorConfig>
  ) {
    this.config = { ...defaultGovernorConfig, ...config };
  }

  start() {
    this.interval = this.timer.setInterval(() => this.evaluate(), this.config.checkIntervalMs);
  }

  stop() {
    if (this.interval !== undefined) this.timer.clearInterval(this.interval);
  }

  private evaluate() {
    const state = this.world.stateStore.snapshot();
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
    this.world.eventBus.publish({
      type: "GOVERNOR_ACTION",
      action: "STOP_LOOP",
      reason,
      ts: this.clock.now(),
    });
    TelemetryBus.emit({
      type: "GOVERNOR_STOP",
      value: 1,
      meta: { reason },
      ts: this.clock.now(),
    });
  }

  private emitThrottle(reason: string) {
    this.world.eventBus.publish({
      type: "GOVERNOR_ACTION",
      action: "THROTTLE",
      reason,
      ts: this.clock.now(),
    });
    TelemetryBus.emit({
      type: "GOVERNOR_THROTTLE",
      value: 1,
      meta: { reason },
      ts: this.clock.now(),
    });
  }
}
