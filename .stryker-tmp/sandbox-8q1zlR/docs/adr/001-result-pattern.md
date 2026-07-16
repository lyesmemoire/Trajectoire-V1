# ADR-001: Result Pattern

**Status**: Accepted  
**Date**: 2026-06-28  

## Context

We need a way to express success/failure in use cases without relying on exceptions for control flow.

## Decision

All use cases and repositories return `Result<T, E>` where `E extends DomainError`. We use `ok(value)` and `fail(error)` factory functions.

## Consequences

- No try/catch in calling code for expected errors
- All domain errors are typed and traceable
- Exceptions are reserved for truly unexpected failures
