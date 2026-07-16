import type { DomainEvent } from "./DomainEvent.js";

export interface EventMetadata {
  readonly [key: string]: string | number | boolean | null | undefined;
}

export interface EventEnvelope<TEvent extends DomainEvent> {
  readonly event: TEvent;
  readonly correlationId: string;
  readonly causationId: string;
  readonly aggregateVersion: number;
  readonly schemaVersion: number;
  readonly metadata?: EventMetadata;
}
