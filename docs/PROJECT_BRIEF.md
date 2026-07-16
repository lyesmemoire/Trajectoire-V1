# Project Brief

**Project**: Trajectoire  
**Last Updated**: 2025-01-11  
**Status**: Active Development

---

## Overview

Trajectoire is a career development platform that helps candidates prepare for interviews through AI-powered tools and resources.

---

## Reference Implementations

### Interview Preparation Engine

**Status**: ✅ APPROVED AS REFERENCE IMPLEMENTATION  
**Architecture Freeze Date**: 2025-01-11  
**Version**: 1.0  
**Location**: `core/interview-preparation/`

The Interview Preparation Engine is a reference implementation demonstrating best practices in:
- Clean Architecture
- Hexagonal Architecture
- Domain-Driven Design
- SOLID Principles
- Port-Adapter Pattern
- Composition Root Pattern
- Constructor Injection

**Audit Score**: 99/100

**Documentation**: [Interview Preparation Engine Reference Implementation](architecture/interview-preparation-engine/REFERENCE_IMPLEMENTATION.md)

### FEATURE_B5 Runtime Persistence

**Status**: ✅ APPROVED AS REFERENCE IMPLEMENTATION  
**Architecture Freeze Date**: 2026-07-11  
**Version**: 1.0  
**Location**: `core/persistence/`

FEATURE_B5 is a reference implementation demonstrating real Supabase runtime persistence for Runtime sessions.

**Documentation**: [FEATURE_B5 Runtime Persistence](FEATURE_B5_RUNTIME_PERSISTENCE.md)

---

## Architecture Principles

### Clean Architecture

All reference implementations follow Clean Architecture principles:
- Domain layer independent of infrastructure
- Application layer depends on domain
- Infrastructure layer depends on application
- Bootstrap layer depends on application and infrastructure

### Hexagonal Architecture

All reference implementations follow Hexagonal Architecture principles:
- Ports defined in application layer
- Adapters implemented in infrastructure layer
- Domain independent of ports and adapters

### Domain-Driven Design

All reference implementations follow DDD principles:
- Aggregates enforce consistency boundaries
- Entities have identity and lifecycle
- Value Objects are immutable
- Factories encapsulate complex creation

### SOLID Principles

All reference implementations follow SOLID principles:
- SRP: Single responsibility per component
- OCP: Open for extension, closed for modification
- LSP: Substitutable implementations
- ISP: Segregated interfaces
- DIP: Depend on abstractions

---

## Technology Stack

- **Language**: TypeScript
- **Framework**: Next.js
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Testing**: Jest, Vitest

---

## Architecture Decisions

### ADR-001: Hexagonal Architecture

Adopt Hexagonal Architecture (Ports & Adapters) for all domains.

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-001](architecture/adr/ADR-001-hexagonal-architecture.md)

### ADR-003: Data and AI Stack

Supabase treated as platform, Prisma as ORM, AI services integrated via Adapters.

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-003](architecture/adr/ADR-003-data-and-ai-stack.md)

### ADR-005: Domain Events

Domain events via abstract EventBus for decoupling.

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-005](architecture/adr/ADR-005-domain-events.md)

### ADR-007: Composition Root

Composition Root via static container.ts files.

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-007](architecture/adr/ADR-007-composition-root.md)

### ADR-008: Dependency Injection Strategy

Manual constructor injection with static Composition Root.

**Status**: ✅ ACCEPTED

**Documentation**: [ADR-008](architecture/adr/ADR-008-dependency-injection-strategy.md)

---

## Development Guidelines

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Zero TODO/FIXME comments in production code
- Zero dead code
- Zero unused exports

### Architecture Guidelines

- Follow reference implementations
- Use Port-Adapter pattern for external dependencies
- Use Composition Root for dependency assembly
- Use constructor injection only
- No service locator pattern
- No hidden singletons
- No concrete dependencies

### Testing Guidelines

- Integration tests for all components
- E2E tests for critical flows
- 100% component coverage
- 100% integration point coverage

### Documentation Guidelines

- Architecture documentation for all domains
- README for all major components
- Phase completion reports
- Audit reports for architecture freeze

---

## Roadmap

See [ETAT_DES_LIEUX_ET_ROADMAP.md](../ETAT_DES_LIEUX_ET_ROADMAP.md) for detailed roadmap.

---

## Contact

**Project Owner**: Trajectoire Team  
**Architecture Lead**: Cascade AI Assistant  
**Last Review**: 2025-01-11
