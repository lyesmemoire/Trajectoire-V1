# Sprint 6.11A - Architecture Gap Analysis

## Overview

**Date**: 2026-07-13  
**Scope**: Forecast Intelligence Engine Dependencies  
**Objective**: Identify cross-cutting components that should not belong to lib/intelligence-core but constitute a shared runtime  
**Status**: Analysis Complete

---

## 1. Forecast Dependency Mapping

### Direct Dependencies

| Component | Location | Type | Usage in Forecast |
|-----------|----------|------|-------------------|
| `aiOrchestrator` | `core/ai/AIOrchestrator.ts` | Infrastructure | LLM orchestration, retry logic, cost tracking |
| `careerCopilotForecastV1` | `core/ai/Prompts/career-copilot-forecast-v1.ts` | Infrastructure | Prompt template |
| `candidateAIBrain` | `core/ai/brain/CandidateAIBrain.ts` | Runtime | Memory, observations, goals, history |
| `eventBus` | `core/ai/events/EventBus.ts` | Runtime | Event publishing |
| `ObservationCreatedEvent` | `core/ai/events/BrainEvents.ts` | Runtime | Event type definition |
| `CareerCopilotSuccessIntelligenceEngine` | `core/intelligence/engines/` | Domain | Engine-to-engine dependency |
| `CareerCopilotScenarioIntelligenceEngine` | `core/intelligence/engines/` | Domain | Engine-to-engine dependency |
| `CareerCopilotConstraintIntelligenceEngine` | `core/intelligence/engines/` | Domain | Engine-to-engine dependency |
| `CareerCopilotResourceIntelligenceEngine` | `core/intelligence/engines/` | Domain | Engine-to-engine dependency |
| `CareerCopilotKnowledgeEvolutionEngine` | `core/intelligence/engines/` | Domain | Engine-to-engine dependency |

### Indirect Dependencies (via aiOrchestrator)

| Component | Location | Type | Usage |
|-----------|----------|------|-------|
| `AIProvider` | `core/ai/AIProvider.ts` | Infrastructure | Provider interface |
| `OpenAIProvider` | `core/ai/OpenAIProvider.ts` | Infrastructure | OpenAI implementation |
| `AnthropicProvider` | `core/ai/AnthropicProvider.ts` | Infrastructure | Anthropic implementation |
| `MockProvider` | `core/ai/MockProvider.ts` | Infrastructure | Mock implementation |
| `PromptRenderer` | `core/ai/PromptTemplates/PromptRenderer.ts` | Infrastructure | Prompt rendering |
| `PromptVersionManager` | `core/ai/PromptTemplates/PromptVersion.ts` | Infrastructure | Prompt versioning |
| `JsonValidator` | `core/ai/JsonValidator.ts` | Infrastructure | JSON validation |
| `RetryPolicy` | `core/ai/RetryPolicy.ts` | Runtime | Retry logic with exponential backoff |
| `CostTracker` | `core/ai/CostTracker.ts` | Runtime | Cost tracking and metrics |
| `aiExecutionLogger` | `core/ai/AIExecutionLog.ts` | Runtime | Execution logging |
| `AIMode` | `core/ai/AIMode.ts` | Runtime | AI mode detection |

### Indirect Dependencies (via CandidateAIBrain)

| Component | Location | Type | Usage |
|-----------|----------|------|-------|
| `BrainMemory` | `core/ai/brain/BrainMemory.ts` | Runtime | Memory storage |
| `BrainEvents` | `core/ai/brain/BrainEvents.ts` | Runtime | Event tracking |
| `BrainHistory` | `core/ai/brain/BrainHistory.ts` | Runtime | Execution history |
| `BrainTimeline` | `core/ai/brain/BrainTimeline.ts` | Runtime | Timeline tracking |
| `BrainPatterns` | `core/ai/brain/BrainPatterns.ts` | Runtime | Pattern detection |
| `supabase` | `lib/supabase/client.ts` | Infrastructure | Persistence |

---

## 2. Component Classification

### Domain Layer

| Component | Responsibility | Reusable? | Specific to |
|-----------|---------------|-----------|-------------|
| `ForecastInput` | Input DTO | ❌ No | Forecast |
| `ForecastOutput` | Output DTO | ❌ No | Forecast |
| `CandidateGraph` | Candidate data structure | ✅ Yes | Multiple engines |
| `CareerCopilotForecastEngine` | Forecast business logic | ❌ No | Forecast |
| `CareerCopilotSuccessIntelligenceEngine` | Success analysis | ❌ No | Success Intelligence |
| `CareerCopilotScenarioIntelligenceEngine` | Scenario analysis | ❌ No | Scenario Intelligence |
| `CareerCopilotConstraintIntelligenceEngine` | Constraint analysis | ❌ No | Constraint Intelligence |
| `CareerCopilotResourceIntelligenceEngine` | Resource analysis | ❌ No | Resource Intelligence |
| `CareerCopilotKnowledgeEvolutionEngine` | Knowledge evolution | ❌ No | Knowledge Evolution |

### Infrastructure Layer

| Component | Responsibility | Reusable? | Specific to |
|-----------|---------------|-----------|-------------|
| `careerCopilotForecastV1` | Prompt template | ❌ No | Forecast |
| `AIProvider` | Provider interface | ✅ Yes | All engines |
| `OpenAIProvider` | OpenAI implementation | ✅ Yes | All engines |
| `AnthropicProvider` | Anthropic implementation | ✅ Yes | All engines |
| `MockProvider` | Mock implementation | ✅ Yes | All engines |
| `PromptRenderer` | Prompt rendering | ✅ Yes | All engines |
| `PromptVersionManager` | Prompt versioning | ✅ Yes | All engines |
| `JsonValidator` | JSON validation | ✅ Yes | All engines |
| `supabase` | Database client | ✅ Yes | All persistence |

### Runtime Layer (Cross-Cutting)

| Component | Responsibility | Dependencies | Reusable? | Specific to |
|-----------|---------------|-------------|-----------|-------------|
| `aiOrchestrator` | LLM orchestration | Providers, RetryPolicy, CostTracker, Logger | ✅ Yes | All engines |
| `RetryPolicy` | Retry logic with exponential backoff | None | ✅ Yes | All engines |
| `CostTracker` | Cost tracking and metrics | None | ✅ Yes | All engines |
| `aiExecutionLogger` | Execution logging | None | ✅ Yes | All engines |
| `AIMode` | AI mode detection | None | ✅ Yes | All engines |
| `candidateAIBrain` | Memory, observations, goals, history | BrainMemory, BrainEvents, BrainHistory, BrainTimeline, BrainPatterns, EventBus, Supabase | ✅ Yes | All engines |
| `BrainMemory` | Memory storage | None | ✅ Yes | All engines |
| `BrainEvents` | Event tracking | None | ✅ Yes | All engines |
| `BrainHistory` | Execution history | None | ✅ Yes | All engines |
| `BrainTimeline` | Timeline tracking | None | ✅ Yes | All engines |
| `BrainPatterns` | Pattern detection | None | ✅ Yes | All engines |
| `eventBus` | Event publishing | None | ✅ Yes | All engines |
| `ObservationCreatedEvent` | Event type definition | None | ✅ Yes | All engines |

### Legacy Layer

| Component | Responsibility | Reason | Action |
|-----------|---------------|--------|--------|
| None identified | - | - | - |

### To Delete

| Component | Reason | Action |
|-----------|--------|--------|
| None identified | - | - | - |

---

## 3. Component Destination Analysis

### Destination: lib/intelligence-core

| Component | Justification |
|-----------|---------------|
| `IntelligenceProviderPort` | Already in lib/intelligence-core - provider abstraction |
| `IntelligenceUseCase` | Already in lib/intelligence-core - use case orchestration |
| `IntelligenceRequest` | Already in lib/intelligence-core - request DTO |
| `IntelligenceResponse` | Already in lib/intelligence-core - response DTO |
| `ResultAdapter` | Already in lib/intelligence-core - result transformation |
| `ErrorAdapter` | Already in lib/intelligence-core - error transformation |
| `AISDKV6Provider` | Already in lib/intelligence-core - AI SDK v6 provider |
| `MistralProvider` | Already in lib/intelligence-core - Mistral provider |

**Justification**: These components are the minimal foundation for AI operations. They provide provider abstraction and DTO standardization without including runtime concerns.

### Destination: lib/intelligence-runtime (PROPOSED)

| Component | Justification |
|-----------|---------------|
| `RetryPolicy` | Cross-cutting retry logic used by all engines |
| `CostTracker` | Cross-cutting cost tracking used by all engines |
| `aiExecutionLogger` | Cross-cutting execution logging used by all engines |
| `AIMode` | Cross-cutting AI mode detection used by all engines |
| `EventBus` | Cross-cutting event publishing used by all engines |
| `BrainMemory` | Cross-cutting memory storage used by all engines |
| `BrainEvents` | Cross-cutting event tracking used by all engines |
| `BrainHistory` | Cross-cutting execution history used by all engines |
| `BrainTimeline` | Cross-cutting timeline tracking used by all engines |
| `BrainPatterns` | Cross-cutting pattern detection used by all engines |
| `candidateAIBrain` | Cross-cutting brain orchestration used by all engines |

**Justification**: These components provide runtime capabilities (retry, cost tracking, logging, events, memory) that are shared across all engines but are NOT part of the minimal provider abstraction in intelligence-core.

### Destination: Forecast Only

| Component | Justification |
|-----------|---------------|
| `ForecastInput` | Forecast-specific input DTO |
| `ForecastOutput` | Forecast-specific output DTO |
| `CareerCopilotForecastEngine` | Forecast-specific business logic |
| `careerCopilotForecastV1` | Forecast-specific prompt template |

**Justification**: These components contain Forecast-specific business logic and DTOs that should remain in the Forecast engine.

### Destination: Intelligence Engines (Shared)

| Component | Justification |
|-----------|---------------|
| `CandidateGraph` | Shared data structure used by multiple engines |
| `CareerCopilotSuccessIntelligenceEngine` | Success Intelligence engine (shared dependency) |
| `CareerCopilotScenarioIntelligenceEngine` | Scenario Intelligence engine (shared dependency) |
| `CareerCopilotConstraintIntelligenceEngine` | Constraint Intelligence engine (shared dependency) |
| `CareerCopilotResourceIntelligenceEngine` | Resource Intelligence engine (shared dependency) |
| `CareerCopilotKnowledgeEvolutionEngine` | Knowledge Evolution engine (shared dependency) |

**Justification**: These are domain components that belong to their respective engines but are shared as dependencies between engines.

### Destination: Infrastructure (Shared)

| Component | Justification |
|-----------|---------------|
| `AIProvider` | Provider interface (shared by all engines) |
| `OpenAIProvider` | OpenAI implementation (shared by all engines) |
| `AnthropicProvider` | Anthropic implementation (shared by all engines) |
| `MockProvider` | Mock implementation (shared by all engines) |
| `PromptRenderer` | Prompt rendering (shared by all engines) |
| `PromptVersionManager` | Prompt versioning (shared by all engines) |
| `JsonValidator` | JSON validation (shared by all engines) |
| `supabase` | Database client (shared by all persistence) |

**Justification**: These are infrastructure components that should be shared but are NOT part of intelligence-core (which focuses on provider abstraction) or intelligence-runtime (which focuses on runtime capabilities).

---

## 4. Cross-Cutting Component Analysis

### Context Building

**Current State**: Forecast implements custom context building inline
- Extracts data from CandidateGraph
- Extracts observations from CandidateAIBrain
- Extracts context from 6 other engines
- Formats data for prompt variables

**Responsibility**: Build context from multiple sources for AI prompts

**Dependencies**: CandidateGraph, CandidateAIBrain, other engines

**Reusable**: ✅ Yes - all engines need context building

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (ContextBuilder)

---

### Dependency Management

**Current State**: Forecast calls other engines directly
- `CareerCopilotSuccessIntelligenceEngine.getCurrentSuccessIntelligence()`
- `CareerCopilotScenarioIntelligenceEngine` (via Brain)
- `CareerCopilotConstraintIntelligenceEngine.getLastConstraintAnalysis()`
- `CareerCopilotResourceIntelligenceEngine.getLastResourceAnalysis()`
- `CareerCopilotKnowledgeEvolutionEngine.getLastKnowledgeEvolution()`

**Responsibility**: Resolve engine-to-engine dependencies via Brain

**Dependencies**: CandidateAIBrain, other engines

**Reusable**: ✅ Yes - all engines need dependency resolution

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (DependencyManager)

---

### Event Publishing

**Current State**: Forecast uses EventBus
- Publishes ObservationCreatedEvent
- CandidateAIBrain subscribes to events

**Responsibility**: Decoupled communication between engines and Brain

**Dependencies**: EventBus, BrainEvents

**Reusable**: ✅ Yes - all engines need event publishing

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (EventPublisher wrapper around EventBus)

---

### Memory (CandidateAIBrain)

**Current State**: Forecast uses CandidateAIBrain
- Stores observations
- Retrieves historical observations
- Retrieves goals
- Retrieves insights
- Pattern detection
- Persistence to Supabase

**Responsibility**: Memory layer for AI-generated knowledge

**Dependencies**: BrainMemory, BrainEvents, BrainHistory, BrainTimeline, BrainPatterns, EventBus, Supabase

**Reusable**: ✅ Yes - all engines need memory

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (Brain orchestration)

---

### Prompt Building

**Current State**: Forecast uses PromptRenderer (via aiOrchestrator)
- Renders prompt templates
- Substitutes variables
- Formats for LLM

**Responsibility**: Build prompts from templates and variables

**Dependencies**: PromptRenderer

**Reusable**: ✅ Yes - all engines need prompt building

**Specific to**: ❌ No - generic capability

**Destination**: Infrastructure (PromptRenderer) - NOT intelligence-runtime

---

### Retry Logic

**Current State**: Forecast uses RetryPolicy (via aiOrchestrator)
- Exponential backoff
- Max retries
- Error handling

**Responsibility**: Retry failed operations with backoff

**Dependencies**: None

**Reusable**: ✅ Yes - all engines need retry logic

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (RetryPolicy)

---

### Telemetry

**Current State**: Forecast uses aiExecutionLogger (via aiOrchestrator)
- Logs execution
- Tracks latency
- Tracks tokens
- Tracks cost
- Tracks errors

**Responsibility**: Track and log AI execution metrics

**Dependencies**: None

**Reusable**: ✅ Yes - all engines need telemetry

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (ExecutionLogger)

---

### Observability

**Current State**: Forecast uses CostTracker (via aiOrchestrator)
- Tracks cost by provider
- Tracks cost by prompt version
- Summarizes costs

**Responsibility**: Track and summarize AI costs

**Dependencies**: None

**Reusable**: ✅ Yes - all engines need cost tracking

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (CostTracker)

---

### Token Counting

**Current State**: Forecast uses CostTracker (via aiOrchestrator)
- Counts prompt tokens
- Counts completion tokens
- Counts total tokens

**Responsibility**: Track token usage

**Dependencies**: None

**Reusable**: ✅ Yes - all engines need token counting

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (CostTracker - includes token counting)

---

### Usage Metrics

**Current State**: Forecast uses CostTracker (via aiOrchestrator)
- Tracks usage by provider
- Tracks usage by prompt version
- Summarizes usage

**Responsibility**: Track and summarize AI usage

**Dependencies**: None

**Reusable**: ✅ Yes - all engines need usage metrics

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (CostTracker - includes usage metrics)

---

### Cost Tracking

**Current State**: Forecast uses CostTracker (via aiOrchestrator)
- Tracks cost by provider
- Tracks cost by prompt version
- Summarizes costs

**Responsibility**: Track and summarize AI costs

**Dependencies**: None

**Reusable**: ✅ Yes - all engines need cost tracking

**Specific to**: ❌ No - generic capability

**Destination**: lib/intelligence-runtime (CostTracker)

---

## 5. lib/intelligence-runtime Proposal

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
- **ContextBuilder**: Build context from CandidateGraph, CandidateAIBrain, and other engines
- **DependencyManager**: Resolve engine-to-engine dependencies via Brain
- **EventPublisher**: Wrapper around EventBus providing engine-specific event publishing API

#### domain/
- **BrainOrchestrator**: Orchestrate Brain operations (observations, goals, patterns, history)
- **Context**: Domain models for context (Context, ContextSource, ContextBuilder)
- **Dependency**: Domain models for dependencies (Dependency, DependencyResolver, DependencyGraph)

#### infrastructure/
- **RetryPolicy**: Retry logic with exponential backoff (moved from core/ai)
- **CostTracker**: Cost tracking and metrics (moved from core/ai)
- **ExecutionLogger**: Execution logging (moved from core/ai)
- **AIMode**: AI mode detection (moved from core/ai)
- **EventBus**: Event bus (moved from core/ai/events)

#### composition/
- **runtime-container**: Runtime dependency container for wiring runtime components

### Key Principles

1. **No AI SDK dependencies**: intelligence-runtime should NOT depend on AI SDKs
2. **No provider logic**: intelligence-runtime should NOT contain provider-specific logic
3. **No prompt management**: intelligence-runtime should NOT manage prompts (that's infrastructure)
4. **No business logic**: intelligence-runtime should NOT contain business logic
5. **Pure runtime capabilities**: intelligence-runtime provides ONLY runtime capabilities (retry, cost, logging, events, memory)

---

## 6. Module Responsibilities Table

| Module | Responsibility |
|--------|---------------|
| **intelligence-core** | Provider abstraction, DTO standardization, minimal AI orchestration foundation |
| **intelligence-runtime** | Runtime capabilities: retry, cost tracking, logging, events, memory, context building, dependency resolution |
| **Intelligence Engines** | Domain-specific business logic, engine-specific DTOs, engine-specific prompts |
| **Conversational Domains** | Chat-based AI interactions (Career Copilot, Interview) |
| **Decision Engines** | Decision-making logic and evaluation |
| **Background Agents** | Asynchronous background AI operations |
| **Infrastructure** | Shared infrastructure: providers, prompt rendering, validation, persistence |

---

## 7. Dependency Diagram

```
┌─────────────────────────────────────────┐
│         Intelligence Engines            │
│  (Forecast, Planning, Career, etc.)    │
└──────────────┬──────────────────────────┘
               │
               │ depends on
               │
┌──────────────▼──────────────────────────┐
│      intelligence-runtime               │
│  (Retry, Cost, Logger, Events, Memory,  │
│   ContextBuilder, DependencyManager)    │
└──────────────┬──────────────────────────┘
               │
               │ depends on
               │
┌──────────────▼──────────────────────────┐
│      intelligence-core                   │
│  (Provider abstraction, DTOs, UseCase)  │
└──────────────┬──────────────────────────┘
               │
               │ depends on
               │
┌──────────────▼──────────────────────────┐
│         Providers                      │
│  (AISDKV6Provider, MistralProvider)    │
└──────────────┬──────────────────────────┘
               │
               │ depends on
               │
┌──────────────▼──────────────────────────┐
│           AI SDK                        │
│  (AI SDK v6, Mistral SDK)              │
└─────────────────────────────────────────┘
```

**Dependency Rules**:
- ✅ Engines → intelligence-runtime → intelligence-core → Providers → AI SDK
- ❌ No reverse dependencies
- ❌ No circular dependencies
- ✅ Clean Architecture respected

---

## 8. Future Runtime Needs

### Components to Consider for intelligence-runtime

| Component | Need | Priority | Justification |
|-----------|------|----------|---------------|
| **Cache** | High | High | Cache LLM responses to reduce cost and latency |
| **Timeout** | High | High | Timeout LLM calls to prevent hanging |
| **Circuit Breaker** | Medium | High | Prevent cascade failures when providers are down |
| **Telemetry** | High | High | Track performance and usage metrics |
| **Tracing** | Medium | Medium | Distributed tracing for debugging |
| **Usage Metrics** | High | High | Track usage by user, engine, provider |
| **Prompt Versioning** | High | High | A/B testing of prompts, gradual rollouts |
| **Feature Flags** | Medium | Medium | Enable/disable features without deployment |
| **Execution Pipeline** | Medium | Medium | Composable pipeline for AI operations |

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

## 9. Validation Criteria

### ✅ All Forecast dependencies mapped
- 10 direct dependencies identified
- 12 indirect dependencies identified
- All components classified

### ✅ Each component has unique responsibility
- No ambiguity in responsibilities
- Clear separation of concerns
- Single responsibility principle respected

### ✅ No ambiguous responsibilities
- Each component has a clear, single purpose
- No overlap between intelligence-core and intelligence-runtime
- Clear boundaries between modules

### ✅ Each component has target destination
- intelligence-core: 7 components (already there)
- intelligence-runtime: 11 components (proposed)
- Forecast only: 4 components
- Intelligence Engines (shared): 6 components
- Infrastructure (shared): 8 components

### ✅ Dependencies respect Clean Architecture
- Engines → intelligence-runtime → intelligence-core → Providers → AI SDK
- No reverse dependencies
- No circular dependencies
- Dependency inversion respected

### ✅ No engine migration performed
- No code changes to Forecast
- No code changes to intelligence-core
- No creation of intelligence-runtime

### ✅ No functional modifications
- No business logic changes
- No behavior changes
- Pure analysis and design

---

## 10. Conclusion

### Key Findings

1. **Forecast has 22 dependencies** (10 direct, 12 indirect)
2. **11 cross-cutting components identified** that should be in intelligence-runtime
3. **Clear separation of concerns** between intelligence-core (provider abstraction) and intelligence-runtime (runtime capabilities)
4. **No circular dependencies** in proposed architecture
5. **Clean Architecture respected** in dependency diagram

### Recommendation

**Create lib/intelligence-runtime** ✅

**Justification**:
1. **Clear boundary**: intelligence-core provides minimal provider abstraction, intelligence-runtime provides runtime capabilities
2. **High reusability**: 11 cross-cutting components used by all engines
3. **No overlap**: Clear separation between provider abstraction and runtime capabilities
4. **Future-proof**: Accommodates future runtime needs (cache, timeout, circuit breaker, telemetry, etc.)
5. **Clean Architecture**: Respects dependency rules and layer separation

**Next Steps**:
1. Create ADR-021 or ADR-022 to document intelligence-runtime decision
2. Implement intelligence-runtime with identified components
3. Migrate Forecast to use intelligence-runtime + intelligence-core
4. Continue migration of other engines

**Status**: Analysis Complete ✅  
**Recommendation**: Create lib/intelligence-runtime ✅
