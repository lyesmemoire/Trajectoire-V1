// src/bootstrap/ShutdownManager.ts
import { IWorldRuntime } from "../ports/IWorldRuntime";
import { IClock, ITimer } from "../ports/IInfra";

export class ShutdownManager {
  private shuttingDown = false;

  constructor(
    private readonly clock: IClock,
    private readonly timer: ITimer,
    private world: IWorldRuntime
  ) {}

  public isShuttingDown(): boolean {
    return this.shuttingDown;
  }

  public async shutdown(reason: string): Promise<void> {
    if (this.shuttingDown) return;
    this.shuttingDown = true;

    this.world.eventBus.publish({
      type: "SYSTEM_SHUTDOWN_INITIATED",
      payload: { reason, ts: this.clock.now() },
    });

    // Give downstream components a moment to flush state
    await new Promise((r) => this.timer.setTimeout(r, 500));

    this.world.eventBus.publish({
      type: "SYSTEM_SHUTDOWN_COMPLETE",
      payload: { ts: this.clock.now() },
    });
  }
}
