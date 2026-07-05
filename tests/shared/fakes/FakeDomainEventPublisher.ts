import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { DomainEventPublisherPort } from "@/lib/core/runtime/event-publisher/DomainEventPublisherPort";

/**
 * Fake implementation of DomainEventPublisherPort for testing.
 * Tracks published events for verification in tests.
 */
export class FakeDomainEventPublisher implements DomainEventPublisherPort {
  private publishedEvents: any[] = [];
  private persistedEvents: any[] = [];

  async publishEventsFrom(aggregate: AggregateRoot): Promise<void> {
    const events = aggregate.pullEvents();
    aggregate.clearEvents();
    this.publishedEvents.push(...events);
  }

  async persistEventsFrom(aggregate: AggregateRoot): Promise<void> {
    const events = aggregate.pullEvents();
    aggregate.clearEvents();
    this.persistedEvents.push(...events);
  }

  async publish(aggregate: AggregateRoot): Promise<void> {
    return this.persistEventsFrom(aggregate);
  }

  /**
   * Returns all events that were published in-process.
   */
  getPublishedEvents(): any[] {
    return this.publishedEvents;
  }

  /**
   * Returns all events that were persisted to outbox.
   */
  getPersistedEvents(): any[] {
    return this.persistedEvents;
  }

  /**
   * Clears all tracked events.
   */
  clear(): void {
    this.publishedEvents = [];
    this.persistedEvents = [];
  }

  /**
   * Returns the total number of events published/persisted.
   */
  getEventCount(): number {
    return this.publishedEvents.length + this.persistedEvents.length;
  }
}
