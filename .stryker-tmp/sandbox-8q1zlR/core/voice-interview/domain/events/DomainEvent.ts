// @ts-nocheck
export interface DomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly type: string;
  readonly occurredAt: Date;
  readonly version: number;
}