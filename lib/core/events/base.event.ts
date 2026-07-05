export interface PlatformEvent<T = unknown> {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly version: number;
  readonly type: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly payload: Readonly<T>;
}

export interface DomainEvent<T = unknown> extends PlatformEvent<T> {}
export interface IntegrationEvent<T = unknown> extends PlatformEvent<T> {}
export interface InternalEvent<T = unknown> extends PlatformEvent<T> {}
export interface NotificationEvent<T = unknown> extends PlatformEvent<T> {}
