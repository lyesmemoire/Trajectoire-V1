// @ts-nocheck
import type { ClockPort, UUIDPort, LoggingPort, TelemetryPort, EventPublisherPort, TransactionPort } from "../../application/ports/SystemPorts.js";
import type { DomainEvent } from "../../domain/events/DomainEvent.js";

export class SystemClockAdapter implements ClockPort {
  now(): Date { return new Date(); }
  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class CryptoUUIDAdapter implements UUIDPort {
  generate(): string { return crypto.randomUUID(); }
}

export class ConsoleLoggingAdapter implements LoggingPort {
  info(message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level: "info", message, ...meta }));
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(JSON.stringify({ level: "warn", message, ...meta }));
  }
  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(JSON.stringify({ level: "error", message, error: error?.message, ...meta }));
  }
}

export class NoOpTelemetryAdapter implements TelemetryPort {
  track(event: string, payload: Record<string, unknown>): void {
    // In production, forward to PostHog/Sentry. NoOp for bootstrapping.
  }
}

export class InMemoryEventPublisher implements EventPublisherPort {
  private readonly handlers: Array<(events: readonly DomainEvent[], correlationId: string) => void> = [];

  async publish(events: readonly DomainEvent[], correlationId: string): Promise<void> {
    for (const handler of this.handlers) {
      handler(events, correlationId);
    }
  }

  onPublish(handler: (events: readonly DomainEvent[], correlationId: string) => void): void {
    this.handlers.push(handler);
  }
}

export class NoOpTransactionAdapter implements TransactionPort {
  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}
