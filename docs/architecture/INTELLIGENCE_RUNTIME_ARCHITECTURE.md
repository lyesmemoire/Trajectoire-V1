# Intelligence Runtime Architecture

## Overview

**Date**: 2026-07-13  
**Module**: lib/intelligence-runtime  
**Status**: Architecture Blueprint  
**Related**: ADR-021-INTELLIGENCE-RUNTIME.md

---

## Module Scope

### Authorized Responsibilities

**Context Orchestration**
- Build context from multiple sources (CandidateGraph, CandidateAIBrain, other engines)
- Extract candidate profile from CandidateGraph
- Extract historical observations from CandidateAIBrain
- Extract current goals from CandidateAIBrain
- Extract context from other engines via DependencyManager
- Format context for prompt variables

**Event Publishing**
- Publish observation events to EventBus
- Publish custom events
- Provide type-safe event publishing
- Event filtering and subscription management

**Dependency Management**
- Resolve engine-to-engine dependencies via Brain
- Get engine output from Brain observations
- Get engine history from Brain observations
- Get engine current state
- Handle dependency resolution errors gracefully

**Execution Pipeline**
- Composable pipeline for AI operations
- Stages: validation → enrichment → execution → post-processing
- Middleware pattern for extensibility
- Pipeline orchestration

**Retry**
- Retry logic with exponential backoff
- Configurable max retries
- Error handling
- Attempt tracking

**Timeout**
- Timeout wrapper around provider calls
- Configurable per engine
- Graceful degradation on timeout

**Circuit Breaker**
- Circuit breaker pattern
- Open circuit after N failures
- Half-open state for testing recovery

**Telemetry**
- Track performance and usage metrics
- Structured logging
- Integration with observability platform

**Metrics**
- Track latency, tokens, cost
- Per-user metrics
- Per-engine metrics
- Per-provider metrics

**Logging**
- Structured logging
- Execution logging
- Error logging
- Debug logging

**Prompt Orchestration**
- Prompt versioning
- A/B testing capabilities
- Gradual rollout capabilities
- Rollback capabilities

**Cost Tracking**
- Track cost by provider
- Track cost by prompt version
- Summarize costs
- Token counting

**Usage Tracking**
- Track usage by user
- Track usage by engine
- Track usage by provider
- Usage summarization

### Forbidden Responsibilities

**Business Logic**
- No engine-specific business logic
- No domain-specific rules
- No decision-making logic

**Provider Abstraction**
- No provider abstraction (responsibility of intelligence-core)
- No provider-specific logic
- No AI SDK dependencies

**Prompt Rendering**
- No prompt rendering logic (responsibility of shared infrastructure)
- No prompt template management
- No prompt variable substitution

**Framework Dependencies**
- No React dependencies
- No Next.js dependencies
- No HTTP-specific logic

**Persistence**
- No database-specific logic (responsibility of shared infrastructure)
- No Supabase-specific logic
- No persistence implementation

---

## Target Structure

```
lib/intelligence-runtime/
├── domain/
│   ├── context/
│   │   ├── Context.ts
│   │   ├── ContextSource.ts
│   │   ├── ContextBuilder.ts
│   │   └── index.ts
│   ├── dependency/
│   │   ├── Dependency.ts
│   │   ├── DependencyResolver.ts
│   │   ├── DependencyGraph.ts
│   │   └── index.ts
│   ├── execution/
│   │   ├── ExecutionPipeline.ts
│   │   ├── ExecutionStage.ts
│   │   ├── ExecutionMiddleware.ts
│   │   └── index.ts
│   ├── brain/
│   │   ├── BrainOrchestrator.ts
│   │   ├── BrainPort.ts
│   │   └── index.ts
│   └── index.ts
├── application/
│   ├── ContextBuilder.ts
│   ├── DependencyManager.ts
│   ├── EventPublisher.ts
│   ├── ExecutionOrchestrator.ts
│   └── index.ts
├── infrastructure/
│   ├── retry/
│   │   ├── RetryPolicy.ts
│   │   ├── RetryConfig.ts
│   │   └── index.ts
│   ├── timeout/
│   │   ├── TimeoutPolicy.ts
│   │   ├── TimeoutConfig.ts
│   │   └── index.ts
│   ├── circuit-breaker/
│   │   ├── CircuitBreaker.ts
│   │   ├── CircuitBreakerConfig.ts
│   │   └── index.ts
│   ├── telemetry/
│   │   ├── TelemetryPort.ts
│   │   ├── TelemetryCollector.ts
│   │   └── index.ts
│   ├── metrics/
│   │   ├── MetricsPort.ts
│   │   ├── MetricsCollector.ts
│   │   └── index.ts
│   ├── logging/
│   │   ├── Logger.ts
│   │   ├── LoggerConfig.ts
│   │   └── index.ts
│   ├── events/
│   │   ├── EventBus.ts
│   │   ├── EventStore.ts
│   │   └── index.ts
│   ├── cost/
│   │   ├── CostTracker.ts
│   │   ├── CostMetrics.ts
│   │   └── index.ts
│   ├── usage/
│   │   ├── UsageTracker.ts
│   │   ├── UsageMetrics.ts
│   │   └── index.ts
│   └── index.ts
├── composition/
│   ├── runtime-container.ts
│   ├── runtime-factory.ts
│   └── index.ts
└── index.ts
```

---

## Folder Responsibilities

### domain/

**Responsibility**: Domain models and ports for runtime capabilities

**Dependencies**:
- ✅ Allowed: TypeScript standard library
- ❌ Forbidden: intelligence-core, infrastructure, external dependencies

**Sub-folders**:

#### domain/context/
- **Context.ts**: Context domain model
- **ContextSource.ts**: Context source abstraction
- **ContextBuilder.ts**: Context builder port
- **index.ts**: Public exports

#### domain/dependency/
- **Dependency.ts**: Dependency domain model
- **DependencyResolver.ts**: Dependency resolver port
- **DependencyGraph.ts**: Dependency graph model
- **index.ts**: Public exports

#### domain/execution/
- **ExecutionPipeline.ts**: Execution pipeline domain model
- **ExecutionStage.ts**: Execution stage abstraction
- **ExecutionMiddleware.ts**: Middleware abstraction
- **index.ts**: Public exports

#### domain/brain/
- **BrainOrchestrator.ts**: Brain orchestration port
- **BrainPort.ts**: Brain port interface
- **index.ts**: Public exports

### application/

**Responsibility**: Application-level orchestration of runtime capabilities

**Dependencies**:
- ✅ Allowed: domain, infrastructure (ports only)
- ❌ Forbidden: intelligence-core, external dependencies, framework dependencies

**Components**:

- **ContextBuilder**: Build context from multiple sources
  - Extract candidate profile from CandidateGraph
  - Extract historical observations from CandidateAIBrain
  - Extract current goals from CandidateAIBrain
  - Extract context from other engines via DependencyManager
  - Format context for prompt variables

- **DependencyManager**: Resolve engine-to-engine dependencies
  - Get engine output from Brain observations
  - Get engine history from Brain observations
  - Get engine current state
  - Handle dependency resolution errors gracefully

- **EventPublisher**: Wrapper around EventBus for engines
  - Publish observation events
  - Publish custom events
  - Provide type-safe event publishing

- **ExecutionOrchestrator**: Orchestrate execution pipeline
  - Execute pipeline stages
  - Apply middleware
  - Handle errors
  - Return results

### infrastructure/

**Responsibility**: Infrastructure implementations for runtime capabilities

**Dependencies**:
- ✅ Allowed: domain, external libraries (non-framework)
- ❌ Forbidden: intelligence-core, framework dependencies (React, Next.js)

**Sub-folders**:

#### infrastructure/retry/
- **RetryPolicy.ts**: Retry logic with exponential backoff
- **RetryConfig.ts**: Retry configuration
- **index.ts**: Public exports

#### infrastructure/timeout/
- **TimeoutPolicy.ts**: Timeout wrapper
- **TimeoutConfig.ts**: Timeout configuration
- **index.ts**: Public exports

#### infrastructure/circuit-breaker/
- **CircuitBreaker.ts**: Circuit breaker implementation
- **CircuitBreakerConfig.ts**: Circuit breaker configuration
- **index.ts**: Public exports

#### infrastructure/telemetry/
- **TelemetryPort.ts**: Telemetry port interface
- **TelemetryCollector.ts**: Telemetry collection implementation
- **index.ts**: Public exports

#### infrastructure/metrics/
- **MetricsPort.ts**: Metrics port interface
- **MetricsCollector.ts**: Metrics collection implementation
- **index.ts**: Public exports

#### infrastructure/logging/
- **Logger.ts**: Structured logger
- **LoggerConfig.ts**: Logger configuration
- **index.ts**: Public exports

#### infrastructure/events/
- **EventBus.ts**: Event bus implementation
- **EventStore.ts**: Event store implementation
- **index.ts**: Public exports

#### infrastructure/cost/
- **CostTracker.ts**: Cost tracking implementation
- **CostMetrics.ts**: Cost metrics model
- **index.ts**: Public exports

#### infrastructure/usage/
- **UsageTracker.ts**: Usage tracking implementation
- **UsageMetrics.ts**: Usage metrics model
- **index.ts**: Public exports

### composition/

**Responsibility**: Dependency injection for runtime components

**Dependencies**:
- ✅ Allowed: domain, application, infrastructure
- ❌ Forbidden: intelligence-core, external dependencies

**Components**:

- **runtime-container.ts**: Runtime dependency container
  - Wire runtime components
  - Provide singleton instances
  - Manage component lifecycle

- **runtime-factory.ts**: Factory for creating runtime instances
  - Create configured runtime instances
  - Provide factory methods for common configurations
  - Support custom configurations

---

## Module Boundaries

| Module | Responsibility | Depends On |
|--------|---------------|------------|
| **intelligence-core** | Provider abstraction, DTO standardization, minimal AI orchestration foundation | None (minimal dependencies) |
| **intelligence-runtime** | Runtime capabilities: retry, cost tracking, logging, events, memory, context building, dependency resolution | intelligence-core |
| **Intelligence Engines** | Domain-specific business logic, engine-specific DTOs, engine-specific prompts | intelligence-runtime, intelligence-core |
| **Conversational Domains** | Chat-based AI interactions (Career Copilot, Interview) | intelligence-core (ai-core) |
| **Decision Engines** | Decision-making logic and evaluation | None (rule-based) |
| **Background Agents** | Asynchronous background AI operations | intelligence-runtime (optional) |
| **Knowledge Services** | Embeddings, RAG, vector store operations | None (infrastructure) |

---

## Dependency Rules

### Logical Architecture

```
UI
        │
        ▼
Intelligence Engine
        │
        ▼
Intelligence Runtime
        │
        ▼
Intelligence Core
        │
        ▼
Providers
        │
        ▼
AI SDK
```

### Allowed Dependencies

- ✅ Engines → intelligence-runtime
- ✅ Engines → intelligence-core
- ✅ intelligence-runtime → intelligence-core
- ✅ intelligence-core → Providers
- ✅ Providers → AI SDK

### Forbidden Dependencies

- ❌ intelligence-core → intelligence-runtime (no reverse dependency)
- ❌ intelligence-core → Engines (no reverse dependency)
- ❌ intelligence-runtime → Engines (no reverse dependency)
- ❌ Providers → intelligence-runtime (no reverse dependency)
- ❌ AI SDK → intelligence-core (no reverse dependency)

### No Circular Dependencies

- ✅ No circular dependencies in proposed architecture
- ✅ Clean dependency hierarchy respected
- ✅ Dependency inversion principle respected

---

## Evolution Principles

### intelligence-core: Very Rare Evolution

- **Stability**: intelligence-core must evolve very rarely
- **Breaking Changes**: Avoid breaking changes
- **Backward Compatibility**: Maintain backward compatibility when possible
- **Justification**: intelligence-core is a stable foundation for all engines

**Evolution Criteria**:
- Critical bug fixes only
- Major architectural shifts (rare)
- Industry-wide changes in AI SDKs (rare)

### intelligence-runtime: Evolution for New Technical Capabilities

- **Evolution**: intelligence-runtime can evolve to integrate new technical capabilities
- **Additions**: Add new capabilities (cache, timeout, circuit breaker, telemetry)
- **Improvements**: Improve existing capabilities
- **Justification**: intelligence-runtime provides technical capabilities that evolve with needs

**Evolution Criteria**:
- New technical capabilities needed by engines
- Performance improvements
- Observability enhancements
- Reliability improvements

### Intelligence Engines: Never Reimplement Runtime Capabilities

- **Reuse**: Engines must never re-implement capabilities present in intelligence-runtime
- **Dependency**: Engines must depend on intelligence-runtime for runtime capabilities
- **Standardization**: All engines use the same runtime capabilities
- **Justification**: Avoid code duplication and ensure consistency

**Evolution Criteria**:
- Business logic evolution
- Domain-specific changes
- Engine-specific improvements

---

## Implementation Guidelines

### Clean Architecture Compliance

1. **Domain Layer**: Pure domain models and ports, no dependencies on infrastructure
2. **Application Layer**: Orchestration logic, depends on domain and infrastructure ports
3. **Infrastructure Layer**: Concrete implementations, depends on domain
4. **Composition Layer**: Dependency injection, wires all layers

### SOLID Principles

1. **Single Responsibility**: Each component has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable for base types
4. **Interface Segregation**: Clients should not depend on unused interfaces
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Dependency Inversion

- High-level modules (application) depend on abstractions (domain ports)
- Low-level modules (infrastructure) implement abstractions (domain ports)
- No direct dependencies between high-level and low-level modules

### Server-Only Protection

- All components in intelligence-runtime are server-only
- No React, Next.js, or client-side dependencies
- Use `"use server"` directive where appropriate
- Add ESLint rules to prevent client-side imports

---

## Testing Strategy

### Unit Tests

- Domain models: Test invariants and business rules
- Ports: Test interface contracts
- Application logic: Test orchestration
- Infrastructure: Test implementations

### Integration Tests

- Test integration between layers
- Test integration with intelligence-core
- Test integration with external dependencies (mocked)

### Contract Tests

- Test port implementations against port contracts
- Test engine integration with runtime
- Test runtime integration with core

---

## Migration Strategy

### Phase 1: Create intelligence-runtime (Sprint 6.12)

1. Create module structure
2. Implement domain models and ports
3. Implement infrastructure components
4. Implement application orchestration
5. Implement composition layer
6. Add unit tests
7. Add integration tests
8. Document patterns

### Phase 2: Migrate Forecast (Sprint 6.12)

1. Update Forecast to use intelligence-runtime
2. Update Forecast to use intelligence-core
3. Remove direct dependencies on core/ai/
4. Add unit tests
5. Verify build, typecheck, eslint, tests
6. Create migration report

### Phase 3: Migrate Other Engines (Sprint 6.13+)

1. Migrate Planning Intelligence
2. Migrate Career Intelligence
3. Migrate ATS
4. Migrate Daily Coach
5. Migrate remaining engines

### Phase 4: Deprecate Legacy (Sprint 6.14)

1. Deprecate aiOrchestrator
2. Deprecate direct core/ai/ usage
3. Update documentation
4. Remove deprecated code

---

## Success Criteria

### Technical Success Criteria

- ✅ intelligence-runtime created with all proposed components
- ✅ All components have unit tests
- ✅ Build, typecheck, eslint pass
- ✅ Dependency diagram respected
- ✅ No circular dependencies
- ✅ Clean Architecture compliance verified

### Migration Success Criteria

- ✅ Forecast migrated to use intelligence-runtime + intelligence-core
- ✅ Forecast tests pass
- ✅ Forecast behavior unchanged (no regression)
- ✅ Build, typecheck, eslint pass
- ✅ Migration report created

### Business Success Criteria

- ✅ Cost reduction achieved (via cache, retry optimization)
- ✅ Performance improvement achieved (via cache, timeout)
- ✅ Reliability improvement achieved (via retry, circuit breaker)
- ✅ Feature velocity improved (via prompt versioning, feature flags)

---

## Conclusion

This architecture blueprint defines the structure, responsibilities, and evolution principles for `lib/intelligence-runtime`. The module provides cross-cutting runtime capabilities for Intelligence Engines while maintaining clear separation from `lib/intelligence-core` (provider abstraction) and engine-specific business logic.

**Status**: Architecture Blueprint Complete ✅  
**Next Phase**: Public API Definition (INTELLIGENCE_RUNTIME_PUBLIC_API.md)
