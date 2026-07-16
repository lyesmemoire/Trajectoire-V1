# ADR-005: CQRS (Lightweight)

**Status**: Accepted  
**Date**: 2026-07-02  

## Context

Use cases that mix reads and writes become difficult to optimize, cache, and scale independently.

## Decision

Separate `CommandBus` (writes) and `QueryBus` (reads). Both use explicit `Map<string, Handler>` registration. No event sourcing — this is lightweight CQRS.

## Consequences

- Read-optimized queries bypass aggregate construction
- Write use cases focus solely on state transitions and event emission
- Future: read models can be denormalized without affecting write paths
