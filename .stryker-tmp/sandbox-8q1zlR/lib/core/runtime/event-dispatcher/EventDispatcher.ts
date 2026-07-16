// @ts-nocheck
import { PlatformEvent } from "../../events/base.event";
import { createChildLogger } from "../../logger";

export interface EventHandler<E extends PlatformEvent> {
  handle(event: E): Promise<void>;
}

export class EventDispatcher {
  private handlers = new Map<string, EventHandler<any>[]>();
  private log = createChildLogger({ component: "EventDispatcher" });

  register<E extends PlatformEvent>(eventType: string, handler: EventHandler<E>): void {
    const current = this.handlers.get(eventType) || [];
    current.push(handler);
    this.handlers.set(eventType, current);
    this.log.debug(`Registered handler for event: ${eventType}`);
  }

  unregister<E extends PlatformEvent>(eventType: string, handler: EventHandler<E>): void {
    const current = this.handlers.get(eventType);
    if (current) {
      this.handlers.set(eventType, current.filter(h => h !== handler));
      this.log.debug(`Unregistered handler for event: ${eventType}`);
    }
  }

  async dispatch(event: PlatformEvent): Promise<void> {
    const current = this.handlers.get(event.type) || [];
    this.log.debug({ eventId: event.eventId }, `Dispatching event: ${event.type} to ${current.length} handlers`);
    
    // In a real system, you might want to execute these asynchronously without blocking
    // or handle partial failures more robustly.
    for (const handler of current) {
      try {
        await handler.handle(event);
      } catch (error: any) {
        this.log.error({ error, eventId: event.eventId }, `Error in handler for event: ${event.type}`);
      }
    }
  }
}
