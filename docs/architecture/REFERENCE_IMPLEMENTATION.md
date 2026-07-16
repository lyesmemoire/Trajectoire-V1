# Reference Implementation

## FEATURE_B5: Runtime Persistence with Supabase

**Status**: ARCHITECTURE FROZEN  
**Version**: 1.0  
**Reference Implementation**: YES  
**May be modified**: NO  
**Exception**: Critical production bug only

---

## Certification Summary

FEATURE_B5 has been certified as the official reference implementation for the Trajectoire project. All future features must follow this architectural pattern.

**Certification Date**: July 11, 2026  
**Certified By**: Principal Software Engineer (Cascade)  
**Decision**: ✅ APPROVED FOR ARCHITECTURE FREEZE

---

## Architecture Pattern

### Component Structure

```
Interface
  ↓
Service
  ↓
Builder
  ↓
Mapper
  ↓
Repository
  ↓
Provider
  ↓
Events
  ↓
Policies
  ↓
Composition Root
```

### Layer Separation

```
Runtime (Domain)
  ↓ (events)
PersistenceEventHandler (Application)
  ↓ (commands)
SessionPersistenceIntegration (Application)
  ↓ (orchestration with retry)
SessionPersistenceService (Application)
  ↓ (interface)
SessionPersistence (Interface)
  ↓ (implementation)
SupabaseSessionRepository (Infrastructure)
  ↓ (data access)
Supabase (External)
```

---

## Key Principles

### SOLID Principles

**Single Responsibility Principle (SRP)**
- Each component has exactly one responsibility
- No component performs multiple unrelated tasks
- All responsibilities are explicitly documented in file headers

**Open/Closed Principle (OCP)**
- Components open for extension via interfaces
- Closed for modification of core logic
- New implementations can be added without changing existing code

**Liskov Substitution Principle (LSP)**
- All implementations properly implement their interfaces
- Substitutable without breaking functionality
- Contract honored by all implementations

**Interface Segregation Principle (ISP)**
- Interfaces are focused and cohesive
- No fat interfaces with unused methods
- Clients depend only on methods they use

**Dependency Inversion Principle (DIP)**
- All dependencies injected via constructor
- Depend on abstractions, not concretions
- Composition Root in `core/container.ts`

### Clean Architecture

**Layer Separation**
- Domain: Runtime, entities, value objects
- Application: Services, handlers, integration
- Infrastructure: Repositories, providers
- No upward dependencies

**Dependency Rule**
- Dependencies point inward
- Outer layers depend on inner layers
- Inner layers know nothing about outer layers

**Event-Driven Architecture**
- Runtime emits events
- Persistence subscribes to events
- No direct coupling between layers

### ADR Compliance

**ADR-001: Hexagonal Architecture** ✅
- Ports defined in `interfaces/`
- Adapters in `repositories/`
- Clear separation of concerns

**ADR-003: Data and AI Stack** ✅
- Supabase isolated via interface
- Infrastructure details encapsulated
- Swappable without domain changes

**ADR-005: Domain Events** ✅
- Event-driven communication
- No direct inter-domain calls
- Loose coupling via events

**ADR-007: Composition Root** ✅
- All instantiation in `core/container.ts`
- No `new` keywords outside composition root
- Manual DI via constructor

**ADR-008: Dependency Injection** ✅
- Manual DI via constructor
- No IoC framework
- Max 5 dependencies per constructor

---

## Folder Structure Template

```
core/[feature]/
├── builders/              # Construction logic
├── events/                # Event handling
├── integration/           # Integration coordination
├── interfaces/           # Feature interfaces
├── mappers/              # Data transformation
├── policies/             # Cross-cutting policies
├── repositories/         # Data access
├── services/             # Application services
├── errors/               # Domain errors
├── __tests__/            # Test suite
└── types.ts              # Shared types
```

---

## Component Responsibilities

### Builders
**Responsibility**: Construct domain objects from raw data
**SRP**: ✅ Single responsibility (construction only)
**Forbidden**: Validation, business logic, persistence logic

### Events
**Responsibility**: Transform domain events into commands
**SRP**: ✅ Single responsibility (event handling only)
**Forbidden**: Business logic, repository access, validation

### Integration
**Responsibility**: Thin wrapper for event handlers
**SRP**: ✅ Single responsibility (delegation only)
**Forbidden**: Business logic, event handling, persistence logic

### Services
**Responsibility**: Orchestrate operations with policies
**SRP**: ✅ Single responsibility (orchestration only)
**Forbidden**: Business logic, repository access, policy implementation

### Policies
**Responsibility**: Cross-cutting concerns (retry, caching, etc.)
**SRP**: ✅ Single responsibility (policy execution)
**Forbidden**: Business logic, repository access

### Repositories
**Responsibility**: Execute data access operations
**SRP**: ✅ Single responsibility (data persistence)
**Forbidden**: Business logic, mapping, validation, policy logic

### Mappers
**Responsibility**: Transform between domain and DTO
**SRP**: ✅ Single responsibility (transformation only)
**Forbidden**: Validation, business logic, repository logic

---

## Quality Gates

All features must pass:

1. **TypeScript**: Strict mode, no errors
2. **ESLint**: Zero errors in feature module
3. **Prettier**: All files formatted
4. **Tests**: Unit tests for all components
5. **Documentation**: Complete architecture documentation
6. **ADR Compliance**: All relevant ADRs respected

---

## Dependency Rules

### Constructor Injection
- All dependencies via constructor
- No service locator pattern
- No global state

### Dependency Limits
- Max 5 dependencies per constructor
- Max 5 parameters per method
- Max 15 public methods per class
- Max 3 levels of nesting

### Import Rules
- No circular dependencies
- No upward layer imports
- Import from interfaces, not implementations

---

## Testing Strategy

### Unit Tests
- Test each component in isolation
- Mock all dependencies
- Cover all public methods
- Test error paths

### Integration Tests
- Test component interactions
- Use real implementations where possible
- Test event flows
- Verify error handling

### E2E Tests
- Test complete user flows
- Use real infrastructure
- Test failure scenarios
- Verify performance

---

## Documentation Requirements

Each feature must include:

1. **Architecture Diagram**: Visual representation of components
2. **Folder Structure**: File organization
3. **Component Responsibilities**: SRP documentation
4. **Environment Variables**: Required configuration
5. **Database Schema**: If applicable
6. **Migration Guide**: If applicable
7. **Operations Guide**: How to operate in production
8. **Rollback Guide**: How to rollback changes

---

## Modification Policy

### Frozen Architecture
- **Status**: ARCHITECTURE FROZEN
- **May be modified**: NO
- **Exception**: Critical production bug only

### Modification Process
1. Identify critical production bug
2. Document impact analysis
3. Propose minimal fix
4. Review with Principal Software Engineer
5. Apply fix with regression tests
6. Update documentation

### Future Enhancements
- Incremental snapshot persistence (Sprint C)
- Versioned snapshot mapping (Sprint C)
- Replay from incremental snapshots (Sprint C)

These are planned enhancements, not modifications to frozen architecture.

---

## Reference for Future Features

All future features must follow this pattern:

### Interview Preparation Engine
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

### Voice Interview Engine
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

### Speech-to-Text
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

### Live Analysis
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

### Live Coaching
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

### Final Report
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

### Learning Engine
- Interface → Service → Builder → Mapper → Repository → Provider → Events → Policies → Composition Root

---

## Contact

For questions about this reference implementation:
- Review FEATURE_B5 documentation: `docs/FEATURE_B5_RUNTIME_PERSISTENCE.md`
- Review ADRs: `docs/architecture/adr/`
- Consult Principal Software Engineer for guidance

---

## Version History

**v1.0** (July 11, 2026)
- Initial certification
- Architecture frozen
- Reference implementation established
