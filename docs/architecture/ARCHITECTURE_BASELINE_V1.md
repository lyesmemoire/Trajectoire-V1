# Architecture Baseline V1

**Version:** 1.0  
**Date:** 2026-07-14  
**Status:** GELÉE (FROZEN)  
**Sprint:** 6.29

---

## Overview

This document is the official reference for the Trajectoire Intelligence Architecture. All future developments must respect this baseline. This document replaces all previous architecture references that have become obsolete.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    ENGINES LAYER                          │
│  core/intelligence/engines/ (54 engines)                 │
│  - Orchestration layer                                    │
│  - Uses intelligenceCoreModule                           │
│  - Uses EventPublisher                                   │
│  - Uses CandidateAIBrain for context                     │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│              INTELLIGENCE-CORE MODULE                     │
│  lib/intelligence-core/                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Domain Layer                                       │  │
│  │ - ports/ (IntelligenceProviderPort)              │  │
│  │ - dto/ (IntelligenceRequest, IntelligenceResponse) │  │
│  │ - contracts/ (IntelligenceErrors)                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Application Layer                                 │  │
│  │ - intelligence.use-case.ts (IntelligenceUseCase)│  │
│  │ - BrainContextBuilder.ts                          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Infrastructure Layer                              │  │
│  │ - providers/ (ai-sdk-v6.provider.ts)             │  │
│  │ - error.adapter.ts                               │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Composition Layer                                │  │
│  │ - container.ts                                   │  │
│  │ - intelligence.factory.ts                        │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│            INTELLIGENCE-RUNTIME MODULE                   │
│  lib/intelligence-runtime/                               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Domain Layer                                       │  │
│  │ - context/ (RuntimeContext)                      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Application Layer                                 │  │
│  │ - EventPublisher.ts                               │  │
│  │ - ExecutionPipeline.ts                            │  │
│  │ - DependencyManager.ts                           │  │
│  │ - ContextBuilder.ts                              │  │
│  │ - MetricsAdapter.ts                              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Composition Layer                                │  │
│  │ - container.ts                                   │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                 PROVIDER LAYER                            │
│  - OpenAI Provider (via IntelligenceProviderPort)         │
│  - Anthropic Provider (via IntelligenceProviderPort)      │
│  - Provider abstraction via IntelligenceProviderPort     │
└──────────────────────────────────────────────────────────┘
```

---

## Layers

### 1. Engines Layer

**Location:** `core/intelligence/engines/`

**Responsibilities:**
- Orchestrate intelligence operations
- Build context from CandidateAIBrain
- Call intelligenceCoreModule for AI execution
- Publish events via EventPublisher
- Transform AI responses for business use

**Dependencies:**
- intelligenceCoreModule (required)
- EventPublisher (required)
- CandidateAIBrain (required)
- Prompt templates (required)

**Forbidden Dependencies:**
- aiOrchestrator
- eventBus
- ObservationCreatedEvent
- RecommendationGeneratedEvent
- OpenAI SDK
- Mistral SDK

---

### 2. Intelligence-Core Module

**Location:** `lib/intelligence-core/`

**Responsibilities:**
- Provide intelligence orchestration abstraction
- Define provider contracts (IntelligenceProviderPort)
- Implement use cases (IntelligenceUseCase)
- Provide context building (BrainContextBuilder)
- Handle errors (error.adapter)

**Layers:**

#### Domain Layer
- `ports/`: IntelligenceProviderPort interface
- `dto/`: IntelligenceRequest, IntelligenceResponse
- `contracts/`: IntelligenceErrors

#### Application Layer
- `intelligence.use-case.ts`: IntelligenceUseCase class
- `BrainContextBuilder.ts`: Context builder for brain data

#### Infrastructure Layer
- `providers/`: Provider implementations (ai-sdk-v6.provider.ts)
- `error.adapter.ts`: Error handling

#### Composition Layer
- `container.ts`: Dependency injection container
- `intelligence.factory.ts`: Factory for creating use cases

---

### 3. Intelligence-Runtime Module

**Location:** `lib/intelligence-runtime/`

**Responsibilities:**
- Provide runtime primitives
- Event publishing (EventPublisher)
- Pipeline execution (ExecutionPipeline)
- Context management (RuntimeContext)
- Dependency management (DependencyManager)
- Metrics collection (MetricsAdapter)

**Layers:**

#### Domain Layer
- `context/`: RuntimeContext

#### Application Layer
- `EventPublisher.ts`: Event publishing
- `ExecutionPipeline.ts`: Pipeline orchestration
- `DependencyManager.ts`: Dependency resolution
- `ContextBuilder.ts`: Context building
- `MetricsAdapter.ts`: Metrics collection

#### Composition Layer
- `container.ts`: Dependency injection container

---

### 4. Provider Layer

**Responsibilities:**
- Implement IntelligenceProviderPort
- Call LLM APIs (OpenAI, Anthropic)
- Handle provider-specific logic
- Return standardized responses

**Providers:**
- OpenAI Provider
- Anthropic Provider

---

## Dependency Rules

### Rule D001: Dependency Direction

**Engines → Intelligence-Core → Intelligence-Runtime → Providers**

Engines must depend on intelligence-core, not the reverse.

Intelligence-core must depend on intelligence-runtime, not the reverse.

Intelligence-core must depend on providers via IntelligenceProviderPort, not directly.

---

### Rule D002: No Circular Dependencies

No circular dependencies allowed between modules.

---

### Rule D003: Provider Abstraction

All provider interactions must go through IntelligenceProviderPort.

No direct OpenAI SDK or Mistral SDK usage in engines or intelligence-core.

---

### Rule D004: Event Publishing

All event publishing must use EventPublisher.

No eventBus usage allowed.

---

### Rule D005: Context Building

Context building must use CandidateAIBrain for historical context.

Context building must use BrainContextBuilder for standardized context.

---

## Conventions

### Convention C001: Engine Naming

**Pattern:** `[Domain][Function]Engine.ts`

**Examples:**
- careerCopilotProactiveEngine.ts
- interviewAnalyzerAIEngine.ts
- recommendationsAIEngine.ts

---

### Convention C002: Import Order

**Standard Order:**
1. intelligence-core imports
2. intelligence-runtime imports
3. Prompt imports
4. Brain imports
5. Engine imports (if any)

**Example:**
```typescript
import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { promptV1 } from "../../ai/Prompts/prompt-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
```

---

### Convention C003: Request Structure

**Standard Structure:**
```typescript
const request: IntelligenceRequest<OutputType> = {
  id: `engine-${Date.now()}`,
  type: "engine-type",
  input: {} as any,
  context: {
    // context data
  } as any,
  options: {
    provider: "openai" | "anthropic",
    model: "model-name",
    temperature: 0.7,
    maxTokens: 1500,
  },
};
```

---

### Convention C004: Event Publishing

**Standard Pattern:**
```typescript
const eventPublisher = new EventPublisher();
eventPublisher.publish("event-type", {
  source: "engine-name",
  data: { /* event data */ },
  confidence: 0.9,
});
```

---

### Convention C005: Error Handling

**Standard Pattern:**
```typescript
if (!result.success || !result.output) {
  throw new Error(`Engine failed: ${result.error}`);
}
```

---

## Mandatory Standards

### Standard S001: IntelligenceCoreModule Usage

**Requirement:** All engines must use intelligenceCoreModule.createUseCase

**Forbidden:** aiOrchestrator

---

### Standard S002: IntelligenceRequest Usage

**Requirement:** All engines must use IntelligenceRequest

**Forbidden:** Direct provider calls

---

### Standard S003: EventPublisher Usage

**Requirement:** All engines must use EventPublisher for events

**Forbidden:** eventBus

---

### Standard S004: Provider Abstraction

**Requirement:** All provider selection via options.provider

**Forbidden:** Direct OpenAI SDK or Mistral SDK

---

### Standard S005: Context Object

**Requirement:** All prompt variables in context object

**Forbidden:** Prompt variables in input object

---

### Standard S006: Result Output

**Requirement:** Use result.output for response data

**Forbidden:** result.data

---

### Standard S007: Business Logic Preservation

**Requirement:** No business logic modifications during migration

**Forbidden:** Changing business logic

---

### Standard S008: Prompt Preservation

**Requirement:** No prompt modifications during migration

**Forbidden:** Changing prompts

---

### Standard S009: DTO Preservation

**Requirement:** No DTO modifications during migration

**Forbidden:** Changing DTOs

---

## Checklist for New Engines

### Pre-Creation Checklist

- [ ] Engine name follows Convention C001
- [ ] Engine location: `core/intelligence/engines/`
- [ ] Prompt template exists in `core/ai/Prompts/`
- [ ] Output interface defined
- [ ] Input interface defined

### Implementation Checklist

- [ ] Import intelligenceCoreModule
- [ ] Import IntelligenceRequest
- [ ] Import EventPublisher
- [ ] Import prompt template
- [ ] Import CandidateAIBrain
- [ ] Use intelligenceCoreModule.createUseCase
- [ ] Create IntelligenceRequest with context
- [ ] Use EventPublisher for events
- [ ] Use result.output for response
- [ ] Handle errors properly

### Post-Creation Checklist

- [ ] No aiOrchestrator import
- [ ] No eventBus import
- [ ] No ObservationCreatedEvent import
- [ ] No RecommendationGeneratedEvent import
- [ ] No OpenAI SDK import
- [ ] No Mistral SDK import
- [ ] TypeScript compiles
- [ ] Business logic preserved
- [ ] Prompts preserved
- [ ] DTOs preserved

---

## Migration Checklist

### Pre-Migration Checklist

- [ ] Legacy engine identified
- [ ] Legacy dependencies documented
- [ ] Business logic documented
- [ ] Prompt documented
- [ ] DTOs documented

### Migration Checklist

- [ ] Replace aiOrchestrator with intelligenceCoreModule
- [ ] Replace eventBus with EventPublisher
- [ ] Replace legacy events with EventPublisher
- [ ] Use IntelligenceRequest
- [ ] Use context object
- [ ] Use result.output
- [ ] Preserve business logic
- [ ] Preserve prompts
- [ ] Preserve DTOs

### Post-Migration Checklist

- [ ] No legacy imports
- [ ] TypeScript compiles
- [ ] Build succeeds (excluding pre-existing errors)
- [ ] Business logic unchanged
- [ ] Prompts unchanged
- [ ] DTOs unchanged

---

## Obsolete References

The following documents are obsolete and replaced by this baseline:

- ADR-020_INTELLIGENCE_ENGINE_STANDARD.md (partially obsolete)
- ARCHITECTURE.md (scope mismatch)
- MIGRATION_TEMPLATE.md (still valid for domain migration, not engines)

---

## Version History

**V1.0 (2026-07-14):**
- Initial architecture baseline
- 100% engine migration
- 0 legacy dependencies
- Architecture freeze

---

## Approval

**Approved By:** Architecture Team  
**Approval Date:** 2026-07-14  
**Status:** GELÉE (FROZEN)

**All future developments must respect this baseline.**

**Any deviation from this baseline requires explicit approval from the Architecture Team.**
