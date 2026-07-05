# ADR-004: Platform Runtime

**Status**: Accepted  
**Date**: 2026-07-02  

## Context

Without centralized infrastructure services, each domain reimplements retry, cache, scheduling, event dispatch, etc.

## Decision

A shared `lib/core/runtime/` provides: Container, Module, PlatformRuntime, CommandBus, QueryBus, EventDispatcher, DomainEventPublisher, Pipeline, Outbox, UnitOfWork, Cache, Config, Idempotency, Retry, Authorization, FeatureFlags, Health, Metrics, Scheduler, RequestContext.

No decorators, no reflection, no auto-discovery. Explicit registration via `Map`.

## Consequences

- All domains consume the same infrastructure
- Adding a new domain = Aggregates + Ports + UseCases + Adapters, no runtime changes
- `lib/core/` is frozen after Sprint 3.4.4.1
