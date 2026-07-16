// @ts-nocheck
import { IntegrationEvent } from "../base.event";
import { RequestContext } from "../../runtime/context/RequestContext";

export abstract class BaseIntegrationEvent<T = unknown> implements IntegrationEvent<T> {
  private static _clock: { now(): Date } = { now: () => new Date() };
  private static _idGenerator: { generate(): string } = { generate: () => crypto.randomUUID() };

  static setClock(clock: { now(): Date }): void { BaseIntegrationEvent._clock = clock; }
  static setIdGenerator(idGen: { generate(): string }): void { BaseIntegrationEvent._idGenerator = idGen; }

  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly version: number;
  public readonly correlationId: string;
  public readonly causationId?: string;
  public readonly metadata: Readonly<Record<string, unknown>>;
  public abstract readonly type: string;
  public abstract readonly aggregateId: string;
  public abstract readonly payload: Readonly<T>;

  constructor(metadata?: Record<string, unknown>) {
    this.eventId = BaseIntegrationEvent._idGenerator.generate();
    this.occurredAt = BaseIntegrationEvent._clock.now();
    this.version = 1;
    this.correlationId = RequestContext.correlationId();
    this.causationId = RequestContext.current()?.requestId;
    this.metadata = Object.freeze(metadata ?? {});
  }
}
