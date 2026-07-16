/**
 * Fake EventPublisher for testing
 * Captures all events for verification
 */
// @ts-nocheck


import { DomainEvent } from "../../../lib/core/events/base.event";

export class FakeEventPublisher {
  private events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    this.events.push(...events);
  }

  getEvents(): DomainEvent[] {
    return [...this.events];
  }

  getEventsByType(type: string): DomainEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  clear(): void {
    this.events = [];
  }

  getEventCount(): number {
    return this.events.length;
  }
}
