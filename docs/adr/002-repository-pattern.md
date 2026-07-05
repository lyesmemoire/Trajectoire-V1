# ADR-002: Repository Pattern

**Status**: Accepted  
**Date**: 2026-06-29  

## Context

Domain logic must not depend on database technology (Prisma, Supabase, Mongo).

## Decision

Every domain defines **RepositoryPort** interfaces in `ports/repositories/`. Infrastructure implementations live in `infrastructure/repositories/`. Repositories never leak database models — they always return domain Entities, Aggregates, or Value Objects.

## Consequences

- Swapping databases requires only new adapter implementations
- Domain tests can use in-memory repositories
- No Prisma types appear in domain or application layers
