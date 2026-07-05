import { DomainEvent } from "../events/base.event";

export abstract class AggregateRoot {
  private readonly _domainEvents: DomainEvent[] = [];

  /**
   * Adds a new domain event to this aggregate's internal list of events.
   * These events should be dispatched after the aggregate is persisted.
   */
  protected recordEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Returns a copy of the recorded events.
   */
  public pullEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Clears all recorded events from this aggregate.
   */
  public clearEvents(): void {
    this._domainEvents.length = 0;
  }
}
