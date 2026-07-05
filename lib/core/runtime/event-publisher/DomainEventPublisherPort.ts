import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";

/**
 * Port for publishing domain events from aggregates.
 * This allows UseCases to receive a publisher via dependency injection
 * instead of relying on a concrete implementation, making them testable.
 */
export interface DomainEventPublisherPort {
  /**
   * Pulls all recorded events from the aggregate, dispatches them
   * in-process, and clears the aggregate's event list.
   * 
   * Use this for events that need immediate handling within the same process.
   */
  publishEventsFrom(aggregate: AggregateRoot): Promise<void>;

  /**
   * Pulls all recorded events from the aggregate, persists them to
   * the Outbox for reliable delivery, and clears the aggregate's event list.
   * 
   * Use this when durability is required (e.g. cross-service communication).
   * The OutboxRelay will pick them up and dispatch them.
   */
  persistEventsFrom(aggregate: AggregateRoot): Promise<void>;

  /**
   * Standard method to pull events, save to outbox and clear.
   * Alias/Replacement for persistEventsFrom() to standardize naming.
   */
  publish(aggregate: AggregateRoot): Promise<void>;
}
