import { EventEmitter } from "events";
import { EventBus } from "./event-bus";
import { PlatformEvent } from "./base.event";
import { createChildLogger } from "../logger";

export class LocalEventBus implements EventBus {
  private emitter = new EventEmitter();
  private log = createChildLogger({ component: "LocalEventBus" });

  async publish(event: PlatformEvent): Promise<void> {
    this.log.debug({
      eventId: event.eventId,
      aggregateId: event.aggregateId,
    }, `[LocalEventBus] Publishing event: ${event.type}`);
    this.emitter.emit(event.type, event);
  }

  subscribe(eventType: string, handler: (event: PlatformEvent) => Promise<void>): void {
    this.log.debug(`[LocalEventBus] Subscribing to event: ${eventType}`);
    this.emitter.on(eventType, async (event: PlatformEvent) => {
      try {
        await handler(event);
      } catch (error) {
        this.log.error({ error, eventId: event.eventId }, `[LocalEventBus] Error handling event ${eventType}`);
      }
    });
  }
}

// Global instance for the application
export const localEventBus = new LocalEventBus();
