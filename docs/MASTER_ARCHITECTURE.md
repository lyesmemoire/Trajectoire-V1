# Master Architecture

**Project**: Trajectoire  
**Last Updated**: 2025-01-11  
**Status**: Active Development

---

## Overview

This document provides the master architecture overview for the Trajectoire project, including all reference implementations and architectural principles.

---

## Reference Implementations

### Interview Preparation Engine

**Status**: ✅ APPROVED AS REFERENCE IMPLEMENTATION  
**Architecture Freeze Date**: 2025-01-11  
**Version**: 1.0  
**Location**: `core/interview-preparation/`

**Architecture**:
- Clean Architecture
- Hexagonal Architecture
- Domain-Driven Design
- SOLID Principles

**Layers**:
- Domain: Aggregates, Entities, Value Objects, Factories
- Application: Use Cases, Services, Orchestrators, Ports, DTOs
- Infrastructure: Adapters, Clients, Providers, Mappers
- Bootstrap: Engine, Containers

**Key Patterns**:
- Port-Adapter Pattern
- Composition Root Pattern
- Factory Pattern
- Mapper Pattern

**Documentation**: [Interview Preparation Engine Architecture](architecture/interview-preparation-engine/)

### FEATURE_B5 Runtime Persistence

**Status**: ✅ APPROVED AS REFERENCE IMPLEMENTATION  
**Architecture Freeze Date**: 2026-07-11  
**Version**: 1.0  
**Location**: `core/persistence/`

**Architecture**:
- Clean Architecture
- Hexagonal Architecture
- Domain-Driven Design
- SOLID Principles

**Layers**:
- Domain: Runtime, Events
- Application: Services, Handlers, Integration
- Infrastructure: Repositories, Mappers
- Bootstrap: Container

**Key Patterns**:
- Port-Adapter Pattern
- Composition Root Pattern
- Factory Pattern
- Mapper Pattern
- Retry Pattern

**Documentation**: [FEATURE_B5 Runtime Persistence](FEATURE_B5_RUNTIME_PERSISTENCE.md)

---

## Architectural Principles

### Clean Architecture

**Rule**: Dependencies must point inward

**Layer Structure**:
```
Domain (innermost)
  ↓
Application
  ↓
Infrastructure
  ↓
Bootstrap (outermost)
```

**Key Points**:
- Domain layer has no dependencies
- Application layer depends on domain
- Infrastructure layer depends on application
- Bootstrap layer depends on application and infrastructure

### Hexagonal Architecture

**Rule**: Ports in application, adapters in infrastructure

**Structure**:
- Ports (interfaces): Defined in application layer
- Adapters (implementations): Implemented in infrastructure layer
- Domain: Independent of ports and adapters

**Key Points**:
- All external dependencies accessed via ports
- Adapters implement ports
- Domain has no knowledge of infrastructure

### Domain-Driven Design

**Key Concepts**:
- Aggregates: Enforce consistency boundaries
- Entities: Have identity and lifecycle
- Value Objects: Immutable
- Factories: Encapsulate complex creation
- Domain Events: Decouple domain from side effects

### SOLID Principles

**SRP**: Single responsibility per component

**OCP**: Open for extension, closed for modification

**LSP**: Substitutable implementations

**ISP**: Segregated interfaces

**DIP**: Depend on abstractions

---

## Design Patterns

### Port-Adapter Pattern

**Purpose**: Decouple application from infrastructure

**Implementation**:
- Ports defined in application layer
- Adapters implement ports in infrastructure layer
- Application depends on ports only

**Benefits**:
- Vendor independence
- Testability
- Flexibility

### Composition Root Pattern

**Purpose**: Centralize dependency assembly

**Implementation**:
- Single composition root per domain
- No `new` outside composition root
- Constructor injection only

**Benefits**:
- Explicit dependencies
- Testability
- No hidden singletons

### Factory Pattern

**Purpose**: Encapsulate complex object creation

**Implementation**:
- Factories for domain aggregates
- Factories for reconstruction

**Benefits**:
- Encapsulation
- Consistency
- Testability

### Mapper Pattern

**Purpose**: Transform between layers

**Implementation**:
- DTO to domain mapping
- Domain to DTO mapping

**Benefits**:
- Layer separation
- Data transformation
- Testability

---

## Dependency Injection Strategy

### Constructor Injection

**Rule**: All dependencies injected via constructors

**Implementation**:
- 100% constructor injection
- No property injection
- No method injection

**Benefits**:
- Explicit dependencies
- Type safety
- Testability

### No Service Locator

**Rule**: No service locator pattern

**Implementation**:
- No static dependency retrieval
- No service locator usage

**Benefits**:
- Explicit dependencies
- No hidden dependencies

### No Hidden Singletons

**Rule**: All singletons explicit

**Implementation**:
- Explicit singleton pattern
- No hidden singletons

**Benefits**:
- Explicit state
- Testability

### No Concrete Dependencies

**Rule**: Depend on interfaces only

**Implementation**:
- 100% interface compliance
- No concrete dependencies

**Benefits**:
- Loose coupling
- Substitutability
- Testability

---

## Architecture Decisions

### ADR-001: Hexagonal Architecture

**Decision**: Adopt Hexagonal Architecture (Ports & Adapters)

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-001](architecture/adr/ADR-001-hexagonal-architecture.md)

### ADR-003: Data and AI Stack

**Decision**: Supabase as platform, Prisma as ORM, AI via Adapters

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-003](architecture/adr/ADR-003-data-and-ai-stack.md)

### ADR-005: Domain Events

**Decision**: Domain events via abstract EventBus

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-005](architecture/adr/ADR-005-domain-events.md)

### ADR-007: Composition Root

**Decision**: Composition Root via static container.ts

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-007](architecture/adr/ADR-007-composition-root.md)

### ADR-008: Dependency Injection Strategy

**Decision**: Manual constructor injection with static Composition Root

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-008](architecture/adr/ADR-008-dependency-injection-strategy.md)

---

## Technology Stack

### Languages

- TypeScript (primary)
- JavaScript (legacy)

### Frameworks

- Next.js (frontend)
- React (UI)

### Databases

- Supabase (PostgreSQL)
- Prisma (ORM)

### AI Services

- OpenAI
- Mistral

### Authentication

- Supabase Auth

### Storage

- Supabase Storage

### Testing

- Jest
- Vitest

---

## Code Quality Standards

### TypeScript

- Strict mode
- Zero compilation errors
- Zero type errors

### ESLint

- Zero errors
- Acceptable warnings only

### Prettier

- 100% formatting compliance

### Dead Code

- Zero dead code
- Zero unused exports

### TODO/FIXME

- Zero TODO comments in production code
- Zero FIXME comments in production code

---

## Testing Standards

### Integration Tests

- 100% component coverage
- 100% integration point coverage

### E2E Tests

- Critical flows
- Complete lifecycle validation

---

## Documentation Standards

### Architecture Documentation

- Complete for all domains
- Diagrams included
- Responsibilities documented

### Phase Reports

- Phase completion reports
- Architecture validation reports
- Integration reports

### Audit Reports

- Architecture audits
- Quality audits
- Security audits
- Performance audits
- Scalability audits

---

## Architecture Freeze

### Interview Preparation Engine

**Freeze Date**: 2025-01-11

**Status**: ✅ ARCHITECTURE FROZEN

**Modification Policy**:
- No general modifications
- No architecture changes
- No refactoring
- No new features
- Critical production bug fixes only (requires approval)

### FEATURE_B5 Runtime Persistence

**Freeze Date**: 2026-07-11

**Status**: ✅ ARCHITECTURE FROZEN

**Modification Policy**:
- No general modifications
- No architecture changes
- No refactoring
- No new features
- Critical production bug fixes only (requires approval)

---

## Contact

**Project Owner**: Trajectoire Team  
**Architecture Lead**: Cascade AI Assistant  
**Last Review**: 2025-01-11
