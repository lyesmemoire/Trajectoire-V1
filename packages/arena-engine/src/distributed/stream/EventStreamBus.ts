// src/distributed/stream/EventStreamBus.ts
import { TelemetryBus } from "../../observability/TelemetryBus"
import { IClock } from "../../ports/IInfra";
type Listener = (event: any) => void;

/**
 * Pub/sub bus used by the autonomous loop and all observability components.
 * This class should be instantiated per WorldRuntime to isolate events.
 */
export class EventStreamBus {
  private listeners = new Set<Listener>();

  constructor(private readonly clock: IClock) {}

  publish(event: any) {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch (e) {
        // Swallow listener errors to keep the bus alive; log for debugging.
        console.error('[EventStreamBus] listener error', e);
      }
    }
    // Emit telemetry for every event
    TelemetryBus.emit({ type: event.type, ts: this.clock.now(), meta: event });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Return an unsubscribe function.
    return () => this.listeners.delete(listener);
  }
}
