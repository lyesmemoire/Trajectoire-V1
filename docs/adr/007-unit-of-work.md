# ADR-007: Unit of Work

**Status**: Accepted  
**Date**: 2026-07-02  

## Context

Use cases may need to coordinate multiple repository writes as a single atomic operation.

## Decision

A `UnitOfWork` interface with `begin()`, `commit()`, `rollback()`, and `execute(work)`. The `PrismaUnitOfWork` implementation delegates to Prisma's interactive transactions via `TransactionManager`.

## Consequences

- Use cases can be database-agnostic while preserving atomicity
- Future: wrap outbox writes inside the same UoW to guarantee atomicity of business data + event persistence
