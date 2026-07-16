# ADR-006: Outbox Pattern

**Status**: Accepted  
**Date**: 2026-07-02  

## Context

Publishing events after a database write is not atomic. If the process crashes between the write and the event publish, the event is lost.

## Decision

Events are persisted to an `OutboxEvent` table within the same database transaction as the business write. An `OutboxRelay` worker periodically reads unprocessed events and dispatches them via `EventDispatcher`. Failed events are retried up to 5 times with error tracking.

The schema is designed for future extensions: delayed events, dead letter queues, event replay.

## Consequences

- At-least-once delivery guarantee
- Events survive process crashes
- Future: swap to Kafka/RabbitMQ by replacing OutboxRelay without changing domain code
