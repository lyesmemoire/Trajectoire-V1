# Intelligence Runtime Proposal

## Overview

**Date**: 2026-07-13  
**Proposal**: Create `lib/intelligence-runtime` module  
**Status**: Proposed  
**Related**: Sprint 6.11A Architecture Gap Analysis

---

## Executive Summary

The analysis of Forecast Intelligence Engine revealed 11 cross-cutting components that provide runtime capabilities (retry, cost tracking, logging, events, memory, context building, dependency resolution) but do not belong in `lib/intelligence-core` (which focuses on minimal provider abstraction).

**Recommendation**: Create `lib/intelligence-runtime` to house these cross-cutting runtime capabilities.

**Benefits**:
- Clear separation between provider abstraction (intelligence-core) and runtime capabilities (intelligence-runtime)
- High reusability across all 29+ Intelligence Engines
- Future-proof architecture for additional runtime needs (cache, timeout, circuit breaker, telemetry)
- Clean Architecture compliance with proper dependency hierarchy

---

## Problem Statement

### Current State

Forecast Intelligence Engine (and likely other engines) depends on multiple cross-cutting components:

1. **aiOrchestrator** - Combines provider selection, prompt rendering, JSON validation, retry logic, and cost tracking
2. **CandidateAIBrain** - Memory layer for AI-generated knowledge
3. **EventBus** - Pub/sub system for decoupled communication
4. **RetryPolicy** - Retry logic with exponential backoff
5. **CostTracker** - Cost tracking and metrics
6. **aiExecutionLogger** - Execution logging
7. **AIMode** - AI mode detection

These components are currently in `core/ai/` and are used by multiple engines, creating:
- Tight coupling between engines and `core/ai/`
- No clear separation between provider abstraction and runtime capabilities
- Difficulty in testing engines in isolation
- Potential for code duplication across engines

### Gap in lib/intelligence-core

`lib/intelligence-core` (Sprint 6.10) provides:
- Provider abstraction (IntelligenceProviderPort)
- DTO standardization (IntelligenceRequest, IntelligenceResponse)
- Minimal use case orchestration (IntelligenceUseCase)
- Error handling (ErrorAdapter)

It does NOT provide:
- Retry logic
- Cost tracking
- Execution logging
- Event publishing
- Memory management
- Context building
- Dependency resolution

These missing capabilities are runtime concerns that should be shared across engines but are NOT part of the minimal provider abstraction.

---

## Proposed Solution

### Create lib/intelligence-runtime

A new module that provides cross-cutting runtime capabilities for Intelligence Engines.

### Module Structure

```
lib/intelligence-runtime/
├── application/
│   ├── ContextBuilder.ts          # Build context from multiple sources
│   ├── DependencyManager.ts       # Resolve engine-to-engine dependencies
│   ├── EventPublisher.ts          # Wrapper around EventBus for engines
│   └── index.ts
├── domain/
│   ├── BrainOrchestrator.ts       # Orchestrate Brain operations
│   ├── Context.ts                 # Context domain models
│   ├── Dependency.ts              # Dependency domain models
│   └── index.ts
├── infrastructure/
│   ├── RetryPolicy.ts             # Retry logic with exponential backoff
│   ├── CostTracker.ts             # Cost tracking and metrics
│   ├── ExecutionLogger.ts         # Execution logging
│   ├── AIMode.ts                  # AI mode detection
│   ├── EventBus.ts                # Event bus (moved from core/ai)
│   └── index.ts
├── composition/
│   ├── runtime-container.ts       # Runtime dependency container
│   └── index.ts
└── index.ts
```

### Folder Responsibilities

#### application/
**Purpose**: Application-level orchestration of runtime capabilities

**Components**:
- **ContextBuilder**: Build context from CandidateGraph, CandidateAIBrain, and other engines
  - Extract candidate profile from CandidateGraph
  - Extract historical observations from CandidateAIBrain
  - Extract current goals from CandidateAIBrain
  - Extract context from other engines via DependencyManager
  - Format context for prompt variables

- **DependencyManager**: Resolve engine-to-engine dependencies via Brain
  - Get engine output from Brain observations
  - Get engine history from Brain observations
  - Get engine current state
  - Handle dependency resolution errors gracefully

- **EventPublisher**: Wrapper around EventBus providing engine-specific event publishing API
  - Publish observation events
  - Publish custom events
  - Provide type-safe event publishing

#### domain/
**Purpose**: Domain models for runtime capabilities

**Components**:
- **BrainOrchestrator**: Orchestrate Brain operations
  - Coordinate BrainMemory, BrainEvents, BrainHistory, BrainTimeline, BrainPatterns
  - Provide high-level Brain operations
  - Abstract Brain complexity from engines

- **Context**: Domain models for context
  - Context interface
  - ContextSource interface
  - ContextBuilder interface

- **Dependency**: Domain models for dependencies
  - Dependency interface
  - DependencyResolver interface
  - DependencyGraph interface

#### infrastructure/
**Purpose**: Infrastructure implementations for runtime capabilities

**Components**:
- **RetryPolicy**: Retry logic with exponential backoff (moved from core/ai)
  - Configurable max retries
  - Exponential backoff strategy
  - Error handling
  - Attempt tracking

- **CostTracker**: Cost tracking and metrics (moved from core/ai)
  - Track cost by provider
  - Track cost by prompt version
  - Summarize costs
  - Token counting

- **ExecutionLogger**: Execution logging (moved from core/ai)
  - Log execution details
  - Track latency
  - Track tokens
  - Track cost
  - Track errors

- **AIMode**: AI mode detection (moved from core/ai)
  - Detect mock mode
  - Detect production mode
  - Auto-switch providers based on mode

- **EventBus**: Event bus (moved from core/ai/events)
  - Pub/sub system
  - Event history
  - Subscription management
  - Event filtering

#### composition/
**Purpose**: Dependency injection for runtime components

**Components**:
- **runtime-container**: Runtime dependency container
  - Wire runtime components
  - Provide singleton instances
  - Manage component lifecycle

---

## Component Migration Plan

### Components to Move from core/ai/

| Component | Source | Destination | Effort |
|-----------|--------|-------------|--------|
| RetryPolicy | core/ai/RetryPolicy.ts | lib/intelligence-runtime/infrastructure/ | Low |
| CostTracker | core/ai/CostTracker.ts | lib/intelligence-runtime/infrastructure/ | Low |
| aiExecutionLogger | core/ai/AIExecutionLog.ts | lib/intelligence-runtime/infrastructure/ | Low |
| AIMode | core/ai/AIMode.ts | lib/intelligence-runtime/infrastructure/ | Low |
| EventBus | core/ai/events/EventBus.ts | lib/intelligence-runtime/infrastructure/ | Low |
| BrainEvents | core/ai/events/BrainEvents.ts | lib/intelligence-runtime/infrastructure/ | Low |

### Components to Create

| Component | Destination | Effort |
|-----------|-------------|--------|
| ContextBuilder | lib/intelligence-runtime/application/ | Medium |
| DependencyManager | lib/intelligence-runtime/application/ | Medium |
| EventPublisher | lib/intelligence-runtime/application/ | Low |
| BrainOrchestrator | lib/intelligence-runtime/domain/ | High |
| Context models | lib/intelligence-runtime/domain/ | Low |
| Dependency models | lib/intelligence-runtime/domain/ | Low |
| runtime-container | lib/intelligence-runtime/composition/ | Low |

### Components to Keep in core/ai/

| Component | Reason |
|-----------|--------|
| AIProvider | Provider interface - belongs in infrastructure |
| OpenAIProvider | Provider implementation - belongs in infrastructure |
| AnthropicProvider | Provider implementation - belongs in infrastructure |
| MockProvider | Provider implementation - belongs in infrastructure |
| PromptRenderer | Prompt rendering - belongs in infrastructure |
| PromptVersionManager | Prompt versioning - belongs in infrastructure |
| JsonValidator | JSON validation - belongs in infrastructure |
| aiOrchestrator | Legacy orchestrator - will be deprecated after migration |

### Components to Keep in core/ai/brain/

| Component | Reason |
|-----------|--------|
| CandidateAIBrain | Brain orchestration - will be wrapped by BrainOrchestrator |
| BrainMemory | Memory storage - will be used by BrainOrchestrator |
| BrainEvents | Event tracking - will be used by BrainOrchestrator |
| BrainHistory | Execution history - will be used by BrainOrchestrator |
| BrainTimeline | Timeline tracking - will be used by BrainOrchestrator |
| BrainPatterns | Pattern detection - will be used by BrainOrchestrator |

---

## Dependency Architecture

### Dependency Rules

```
Engines
↓
intelligence-runtime
↓
intelligence-core
↓
Providers
↓
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

## Migration Strategy

### Phase 1: Create intelligence-runtime (Sprint 6.12)

1. Create module structure
2. Move components from core/ai/
3. Create new components (ContextBuilder, DependencyManager, EventPublisher, BrainOrchestrator)
4. Create runtime-container
5. Add unit tests
6. Update documentation

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

## Future Enhancements

### Planned Components

| Component | Priority | Justification |
|-----------|----------|---------------|
| **Cache** | High | Cache LLM responses to reduce cost and latency |
| **Timeout** | High | Timeout LLM calls to prevent hanging |
| **Circuit Breaker** | High | Prevent cascade failures when providers are down |
| **Telemetry** | High | Track performance and usage metrics |
| **Tracing** | Medium | Distributed tracing for debugging |
| **Usage Metrics** | High | Track usage by user, engine, provider |
| **Prompt Versioning** | High | A/B testing of prompts, gradual rollouts |
| **Feature Flags** | Medium | Enable/disable features without deployment |
| **Execution Pipeline** | Medium | Composable pipeline for AI operations |

### Implementation Notes

**Cache**:
- Implement in-memory cache with TTL
- Consider Redis for distributed cache
- Cache key based on prompt + variables hash

**Timeout**:
- Implement timeout wrapper around provider calls
- Configurable per engine
- Graceful degradation on timeout

**Circuit Breaker**:
- Implement circuit breaker pattern
- Open circuit after N failures
- Half-open state for testing recovery

**Telemetry**:
- Extend existing ExecutionLogger
- Add structured logging
- Integration with observability platform (e.g., Datadog, New Relic)

**Tracing**:
- Implement distributed tracing (e.g., OpenTelemetry)
- Trace LLM calls across services
- Correlate traces with user sessions

**Usage Metrics**:
- Extend existing CostTracker
- Add per-user metrics
- Add per-engine metrics
- Add per-provider metrics

**Prompt Versioning**:
- Extend existing PromptVersionManager
- Add A/B testing capabilities
- Add gradual rollout capabilities
- Add rollback capabilities

**Feature Flags**:
- Integrate with feature flag service (e.g., LaunchDarkly)
- Engine-level feature flags
- Provider-level feature flags

**Execution Pipeline**:
- Implement composable pipeline
- Stages: validation → enrichment → execution → post-processing
- Middleware pattern for extensibility

---

## Benefits

### Architecture Benefits

1. **Clear Separation of Concerns**
   - intelligence-core: Provider abstraction
   - intelligence-runtime: Runtime capabilities
   - Engines: Business logic

2. **Clean Architecture Compliance**
   - Proper dependency hierarchy
   - No circular dependencies
   - Dependency inversion respected

3. **Reusability**
   - 11 cross-cutting components shared across 29+ engines
   - No code duplication
   - Consistent behavior across engines

4. **Testability**
   - Components can be tested in isolation
   - Mock runtime capabilities for engine tests
   - Clear interfaces for mocking

5. **Maintainability**
   - Single source of truth for runtime capabilities
   - Changes in one place affect all engines
   - Easier to debug and monitor

### Business Benefits

1. **Cost Reduction**
   - Cache reduces LLM costs
   - Retry logic reduces failed calls
   - Usage metrics enable cost optimization

2. **Performance Improvement**
   - Cache reduces latency
   - Timeout prevents hanging calls
   - Circuit breaker prevents cascade failures

3. **Reliability**
   - Retry logic handles transient failures
   - Circuit breaker prevents cascade failures
   - Telemetry enables proactive monitoring

4. **Feature Velocity**
   - Prompt versioning enables A/B testing
   - Feature flags enable rapid experimentation
   - Execution pipeline enables composable features

---

## Risks and Mitigations

### Risk 1: Migration Complexity

**Risk**: Migrating 29+ engines to use intelligence-runtime is complex and time-consuming

**Mitigation**:
- Incremental migration (one engine at a time)
- Maintain backward compatibility during migration
- Comprehensive testing at each step
- Rollback plan for each migration

### Risk 2: Breaking Changes

**Risk**: Moving components from core/ai/ may break existing code

**Mitigation**:
- Deprecation period for old components
- Clear migration guide
- Automated codemods where possible
- Extensive testing

### Risk 3: Performance Regression

**Risk**: New abstraction layer may introduce performance overhead

**Mitigation**:
- Benchmark performance before and after
- Optimize hot paths
- Profile and optimize critical components
- Monitor in production

### Risk 4: Over-Engineering

**Risk**: intelligence-runtime may become too complex

**Mitigation**:
- Start with minimal viable runtime
- Add components only when needed
- Regular architecture reviews
- Keep components focused and simple

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

## Timeline Estimate

### Sprint 6.12 (2 weeks)

- Week 1: Create intelligence-runtime
  - Create module structure
  - Move components from core/ai/
  - Create new components
  - Add unit tests

- Week 2: Migrate Forecast
  - Update Forecast to use intelligence-runtime
  - Update Forecast to use intelligence-core
  - Verify and test
  - Create migration report

### Sprint 6.13 (2 weeks)

- Migrate Planning Intelligence
- Migrate Career Intelligence
- Migrate ATS
- Migrate Daily Coach

### Sprint 6.14 (2 weeks)

- Migrate remaining engines
- Deprecate legacy components
- Remove deprecated code
- Final verification

**Total Estimate**: 6 weeks for complete migration

---

## Conclusion

### Recommendation

**Create lib/intelligence-runtime** ✅

**Justification**:
1. **Clear boundary**: intelligence-core provides minimal provider abstraction, intelligence-runtime provides runtime capabilities
2. **High reusability**: 11 cross-cutting components used by all engines
3. **No overlap**: Clear separation between provider abstraction and runtime capabilities
4. **Future-proof**: Accommodates future runtime needs (cache, timeout, circuit breaker, telemetry)
5. **Clean Architecture**: Respects dependency rules and layer separation

### Next Steps

1. Create ADR-021 or ADR-022 to document intelligence-runtime decision
2. Implement intelligence-runtime in Sprint 6.12
3. Migrate Forecast to use intelligence-runtime + intelligence-core
4. Continue migration of other engines in Sprint 6.13+
5. Deprecate legacy components in Sprint 6.14

### Status

**Proposal Status**: Ready for Approval ✅  
**Next Phase**: ADR Creation → Sprint 6.12 Implementation
