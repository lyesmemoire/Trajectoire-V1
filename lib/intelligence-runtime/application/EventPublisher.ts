/**
 * EventPublisher
 *
 * Publishes runtime events.
 * Abstraction only, no specific implementation.
 */

export type EventHandler<T = unknown> = (event: T) => void | Promise<void>;

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  once: boolean;
}

export interface EventPublisherOptions {
  maxHistory?: number;
}

export class EventPublisher {
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private eventHistory: unknown[] = [];
  private maxHistory: number;
  private subscriptionCounter: number = 0;

  constructor(options?: EventPublisherOptions) {
    this.maxHistory = options?.maxHistory ?? 1000;
  }

  /**
   * Publish an event
   * @param eventType - Event type
   * @param payload - Event payload
   */
  async publish<T>(eventType: string, payload: T): Promise<void> {
    // Add to history
    this.eventHistory.push({ type: eventType, payload });
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }

    // Get subscribers for this event type
    const subscriptions = this.subscriptions.get(eventType) ?? [];

    // Execute handlers
    for (const subscription of subscriptions) {
      try {
        await subscription.handler(payload);

        // Remove if once
        if (subscription.once) {
          this.unsubscribe(subscription.id);
        }
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    }
  }

  /**
   * Subscribe to an event type
   * @param eventType - Event type
   * @param handler - Event handler
   * @param options - Subscription options
   * @returns Unsubscribe function
   */
  subscribe<T>(
    eventType: string,
    handler: EventHandler<T>,
    options?: { once?: boolean }
  ): () => void {
    const subscription: EventSubscription = {
      id: `sub-${this.subscriptionCounter++}`,
      eventType,
      handler: handler as EventHandler,
      once: options?.once ?? false,
    };

    const existing = this.subscriptions.get(eventType) ?? [];
    existing.push(subscription);
    this.subscriptions.set(eventType, existing);

    // Return unsubscribe function
    return () => this.unsubscribe(subscription.id);
  }

  /**
   * Unsubscribe from an event
   * @param subscriptionId - Subscription ID
   */
  unsubscribe(subscriptionId: string): void {
    const entries = Array.from(this.subscriptions.entries());
    for (const [eventType, subscriptions] of entries) {
      const filtered = subscriptions.filter((s) => s.id !== subscriptionId);
      if (filtered.length === 0) {
        this.subscriptions.delete(eventType);
      } else {
        this.subscriptions.set(eventType, filtered);
      }
    }
  }

  /**
   * Get event history
   * @returns Event history
   */
  getHistory(): unknown[] {
    return [...this.eventHistory];
  }

  /**
   * Get event history by type
   * @param eventType - Event type
   * @returns Event history for type
   */
  getHistoryByType<T>(eventType: string): T[] {
    return this.eventHistory
      .filter((e) => (e as { type: string }).type === eventType)
      .map((e) => (e as { payload: T }).payload);
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
   * @returns Number of subscriptions
   */
  getSubscriptionCount(): number {
    return Array.from(this.subscriptions.values())
      .reduce((count, subscriptions) => count + subscriptions.length, 0);
  }

  /**
   * Get subscriptions by event type
   * @param eventType - Event type
   * @returns Subscriptions for event type
   */
  getSubscriptionsByType(eventType: string): EventSubscription[] {
    return this.subscriptions.get(eventType) ?? [];
  }
}
