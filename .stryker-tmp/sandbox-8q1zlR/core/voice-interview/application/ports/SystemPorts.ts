// @ts-nocheck
import type { DomainEvent } from "../../domain/events/DomainEvent.js";

export interface ClockPort {
  now(): Date;
  sleep(ms: number): Promise<void>;
}

export interface UUIDPort {
  generate(): string;
}

export interface LoggingPort {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
}

export interface TelemetryPort {
  track(event: string, payload: Record<string, unknown>): void;
}

export interface EventPublisherPort {
  publish(events: readonly DomainEvent[], correlationId: string): Promise<void>;
}

export interface TransactionPort {
  run<T>(work: () => Promise<T>): Promise<T>;
}
