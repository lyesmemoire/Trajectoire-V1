// @ts-nocheck
// src/bootstrap/ShutdownManager.ts
import { EventStreamBus } from "../distributed/stream/EventStreamBus";

export class ShutdownManager {
  private shuttingDown = false;

  constructor(private bus: EventStreamBus) {}

  public isShuttingDown(): boolean {
    return this.shuttingDown;
  }

  public async shutdown(reason: string): Promise<void> {
    if (this.shuttingDown) return;
    this.shuttingDown = true;

    this.bus.publish({
      type: "SYSTEM_SHUTDOWN_INITIATED",
      payload: { reason, ts: Date.now() },
    });

    // Give downstream components a moment to flush state
    await new Promise((r) => setTimeout(r, 500));

    this.bus.publish({
      type: "SYSTEM_SHUTDOWN_COMPLETE",
      payload: { ts: Date.now() },
    });
  }
}
