// src/distributed/stream/EventStreamBus.ts
import { TelemetryBus } from "../../observability/TelemetryBus"
type Listener = (event: any) => void;

/**
 * Simple in‑process pub/sub bus used by the autonomous loop and all
 * observability components. It is deliberately lightweight – no external
 * dependencies – and exported as a singleton so that any module can call
 * `eventBus.publish(event)` or `eventBus.subscribe(fn)`.
 */
export class EventStreamBus {
  private listeners = new Set<Listener>();

  publish(event: any) {
    for (const l of this.listeners) {
      try {
        l(event);
      } catch (e) {
        // Swallow listener errors to keep the bus alive; log for debugging.
        console.error('[EventStreamBus] listener error', e);
      }
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Return an unsubscribe function.
    return () => this.listeners.delete(listener);
  }

  // Static helpers for global usage
  static publish(event: any) {
    // delegate to singleton instance
    eventBus.publish(event);
    // Emit telemetry for every event
    TelemetryBus.emit({ type: event.type, ts: Date.now(), meta: event });
  }

  static subscribe(fn: (event: any) => void) {
    return eventBus.subscribe(fn);
  }
}

// Export a singleton instance used throughout the codebase.
export const eventBus = new EventStreamBus();
