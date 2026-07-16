// @ts-nocheck
import { AggregateRoot } from "../../domain/AggregateRoot";
import { EventDispatcher } from "../event-dispatcher/EventDispatcher";
import { OutboxRepository } from "../outbox/OutboxRepository";
import { LoggerProvider } from "../../observability/logger";
import { DomainEventPublisherPort } from "./DomainEventPublisherPort";

/**
 * Automates the flow:
 *   AggregateRoot.pullEvents() → Outbox.save() → EventDispatcher.dispatch()
 * 
 * The UseCase no longer needs to know about event plumbing.
 * It simply calls:
 *   await publisher.publishEventsFrom(aggregate);
 * 
 * Two strategies:
 *   - publishEventsFrom(): dispatches immediately (in-process)
 *   - persistEventsFrom(): writes to outbox only (for OutboxRelay to pick up)
 * 
 * This is the default implementation of DomainEventPublisherPort.
 */
export class DomainEventPublisher implements DomainEventPublisherPort {
  private log = LoggerProvider.getLogger();

  constructor(
    private readonly dispatcher: EventDispatcher,
    private readonly outbox?: OutboxRepository
  ) {}

  /**
   * Pulls all recorded events from the aggregate, dispatches them
   * in-process via the EventDispatcher, and clears the aggregate's event list.
   * 
   * Use this for events that need immediate handling within the same process.
   */
  async publishEventsFrom(aggregate: AggregateRoot): Promise<void> {
    const events = aggregate.pullEvents();
    aggregate.clearEvents();

    for (const event of events) {
      this.log.debug(`Publishing domain event: ${event.type}`, { eventId: event.eventId, eventType: event.type });
      await this.dispatcher.dispatch(event);
    }
  }

  /**
   * Pulls all recorded events from the aggregate, persists them to
   * the Outbox for reliable delivery, and clears the aggregate's event list.
   * 
   * Use this when durability is required (e.g. cross-service communication).
   * The OutboxRelay will pick them up and dispatch them.
   */
  async persistEventsFrom(aggregate: AggregateRoot): Promise<void> {
    if (!this.outbox) {
      throw new Error("OutboxRepository is required for persistEventsFrom(). Use publishEventsFrom() for in-process dispatch.");
    }

    const events = aggregate.pullEvents();
    aggregate.clearEvents();

    for (const event of events) {
      this.log.debug(`Persisting domain event to outbox: ${event.type}`, { eventId: event.eventId, eventType: event.type });
      await this.outbox.save(event);
    }
  }

  /**
   * Standard method requested by CTO to pull events, save to outbox and clear.
   * Alias/Replacement for persistEventsFrom() to standardize naming.
   */
  async publish(aggregate: AggregateRoot): Promise<void> {
    return this.persistEventsFrom(aggregate);
  }
}
