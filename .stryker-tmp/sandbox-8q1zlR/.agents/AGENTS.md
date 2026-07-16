# Architectural Conventions & Rules

These rules must be strictly followed when writing new code for Trajectoire.

## 1. Domain Structure
All domains must strictly follow this directory structure:
```
domain_name/
├── application/       # UseCases, Policies
├── domain/            # Entities, ValueObjects, Aggregates, DomainEvents
├── infrastructure/    # Adapters, Implementations of Repositories/Gateways
├── presentation/      # Presenters, Responses
├── ports/             # Repositories, Gateways interfaces
├── container.ts       # Dependency injection mapping
└── index.ts           # Public exports (Module definition)
```

## 2. File Size Limits
To prevent monolithic classes, the following maximum line limits apply:
- **Entity/Aggregate**: < 250 lines
- **Repository (Adapter)**: < 200 lines
- **UseCase**: < 150 lines
- **Policy**: < 80 lines
- **Controller/API Route**: < 60 lines

If a file exceeds these limits, it must be refactored into smaller, cohesive units (e.g. splitting logic into Domain Services, helper functions, or smaller Use Cases).

## 3. Core Principles
- **No Infrastructure in Domain**: The `domain/` layer must NEVER import anything from `infrastructure/` or external libraries like Prisma, Stripe, or Supabase.
- **Clock and UUIDs**: Never use `new Date()` or `crypto.randomUUID()` directly in the domain. Always use injected `Clock` and `IdGenerator` (or static `BaseDomainEvent._clock` / `_idGenerator`).
- **Result Pattern**: Use Cases must return `Result<T, E>`. Do not throw exceptions for expected domain errors.
- **Dependency Injection**: Dependencies must be registered in the domain's `container.ts`. No auto-discovery or decorators.
- **Event Sourcing (Lightweight)**: Aggregates record domain events via `recordEvent()`. The `DomainEventPublisher` pulls and dispatches/persists them. Use cases should not orchestrate event dispatch directly.
- **Pipeline & Context**: Use `Pipeline` for middleware orchestration and `RequestContext` for passing correlation IDs. No `req` object drilling down to Use Cases.
