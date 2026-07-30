import { BaseEvent } from "../contracts/Event";

// ===================================================================
// EVENT BUS — Type-Agnostic Event Bus Contract
// ===================================================================

export type EventHandler = (event: BaseEvent) => void | Promise<void>;

export interface EventBus {
  publish(event: BaseEvent): void;
  subscribe(pattern: string, handler: EventHandler): void;
  unsubscribe(pattern: string, handler: EventHandler): void;
  getHistory(sessionId: string): BaseEvent[];
  clear(): void;
}

export class DefaultEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private history: Map<string, BaseEvent[]> = new Map();

  publish(event: BaseEvent): void {
    // Store in history
    const sessionHistory = this.history.get(event.sessionId) || [];
    sessionHistory.push(event);
    this.history.set(event.sessionId, sessionHistory);

    // Notify matching handlers (pattern matching by eventType)
    for (const [pattern, handlers] of this.handlers.entries()) {
      if (this.matchesPattern(event.eventType, pattern)) {
        for (const handler of handlers) {
          handler(event);
        }
      }
    }
  }

  subscribe(pattern: string, handler: EventHandler): void {
    if (!this.handlers.has(pattern)) {
      this.handlers.set(pattern, new Set());
    }
    this.handlers.get(pattern)!.add(handler);
  }

  unsubscribe(pattern: string, handler: EventHandler): void {
    const handlers = this.handlers.get(pattern);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(pattern);
      }
    }
  }

  getHistory(sessionId: string): BaseEvent[] {
    return this.history.get(sessionId) || [];
  }

  clear(): void {
    this.handlers.clear();
    this.history.clear();
  }

  private matchesPattern(eventType: string, pattern: string): boolean {
    // Simple pattern matching: exact match or wildcard
    if (pattern === "*") return true;
    if (pattern === eventType) return true;
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      return eventType.startsWith(prefix);
    }
    return false;
  }
}
