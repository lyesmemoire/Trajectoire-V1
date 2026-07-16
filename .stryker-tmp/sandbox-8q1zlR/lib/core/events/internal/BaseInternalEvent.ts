// @ts-nocheck
import { InternalEvent } from "../base.event";
import { RequestContext } from "../../runtime/context/RequestContext";

export abstract class BaseInternalEvent<T = unknown> implements InternalEvent<T> {
  private static _clock: { now(): Date } = { now: () => new Date() };
  private static _idGenerator: { generate(): string } = { generate: () => crypto.randomUUID() };

  static setClock(clock: { now(): Date }): void { BaseInternalEvent._clock = clock; }
  static setIdGenerator(idGen: { generate(): string }): void { BaseInternalEvent._idGenerator = idGen; }

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
    this.eventId = BaseInternalEvent._idGenerator.generate();
    this.occurredAt = BaseInternalEvent._clock.now();
    this.version = 1;
    this.correlationId = RequestContext.correlationId();
    this.causationId = RequestContext.current()?.requestId;
    this.metadata = Object.freeze(metadata ?? {});
  }
}
