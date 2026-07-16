# ADR-003: Event System (4-Tier)

**Status**: Accepted  
**Date**: 2026-07-01  

## Context

A flat event system leads to events that serve too many purposes simultaneously (domain facts, CRM syncs, emails, inter-module communication).

## Decision

Four tiers of events:
- **Domain Events**: Business facts (e.g. `SubscriptionActivated`)
- **Internal Events**: Inter-module coordination within the monolith
- **Integration Events**: External system synchronization (CRM, Email, Analytics)
- **Notification Events**: User-facing notifications

All events implement `PlatformEvent` with `correlationId` and `causationId` for end-to-end tracing.

## Consequences

- Clear separation of concerns for event handlers
- Correlation tracking across the entire request lifecycle
- Each tier can evolve independently
