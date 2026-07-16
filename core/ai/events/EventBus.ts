/**
 * Event Bus
 *
 * Pub/sub system for decoupled communication between engines and brain.
 * Engines publish events, Brain subscribes to events.
 */

import { BrainEvent, EventHandler, EventFilter } from "./BrainEvents";

export interface Subscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  filter?: EventFilter;
  once: boolean;
}

export class EventBus {
  private subscriptions: Map<string, Subscription[]> = new Map();
  private eventHistory: BrainEvent[] = [];
  private maxHistorySize: number = 1000;

  /**
   * Subscribe to an event type
   */
  subscribe<T extends BrainEvent>(
    eventType: string,
    handler: EventHandler<T>,
    options?: {
      filter?: EventFilter<T>;
      once?: boolean;
    }
  ): () => void {
    const subscription: Subscription = {
      id: this.generateId(),
      eventType,
      handler: handler as EventHandler,
      filter: options?.filter as EventFilter,
      once: options?.once || false,
    };

    const existing = this.subscriptions.get(eventType) || [];
    existing.push(subscription);
    this.subscriptions.set(eventType, existing);

    // Return unsubscribe function
    return () => this.unsubscribe(subscription.id);
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(subscriptionId: string): void {
    const subscriptionEntries = Array.from(this.subscriptions.entries());
    for (const [eventType, subscriptions] of subscriptionEntries) {
      const filtered = subscriptions.filter((s) => s.id !== subscriptionId);
      if (filtered.length === 0) {
        this.subscriptions.delete(eventType);
      } else {
        this.subscriptions.set(eventType, filtered);
      }
    }
  }

  /**
   * Publish an event
   */
  async publish<T extends BrainEvent>(event: T): Promise<void> {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Get subscribers for this event type
    const subscriptions = this.subscriptions.get(event.type) || [];

    // Execute handlers
    for (const subscription of subscriptions) {
      try {
        // Apply filter if provided
        if (subscription.filter && !subscription.filter(event)) {
          continue;
        }

        // Execute handler
        await subscription.handler(event);

        // Remove if once
        if (subscription.once) {
          this.unsubscribe(subscription.id);
        }
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }
  }

  /**
   * Subscribe to all events
   */
  subscribeAll(handler: EventHandler<BrainEvent>): () => void {
    return this.subscribe("*", handler);
  }

  /**
   * Get event history
   */
  getHistory(): BrainEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Get event history by type
   */
  getHistoryByType<T extends BrainEvent>(eventType: string): T[] {
    return this.eventHistory.filter((e) => e.type === eventType) as T[];
  }

  /**
   * Get event history in date range
   */
  getHistoryByDateRange(start: Date, end: Date): BrainEvent[] {
    return this.eventHistory.filter((e) => e.timestamp >= start && e.timestamp <= end);
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Clear all subscriptions
   */
  clearSubscriptions(): void {
    this.subscriptions.clear();
  }

  /**
   * Get subscription count
   */
  getSubscriptionCount(): number {
    let count = 0;
    const subscriptionValues = Array.from(this.subscriptions.values());
    for (const subscriptions of subscriptionValues) {
      count += subscriptions.length;
    }
    return count;
  }

  /**
   * Get subscriptions by event type
   */
  getSubscriptionsByType(eventType: string): Subscription[] {
    return this.subscriptions.get(eventType) || [];
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const eventBus = new EventBus();
