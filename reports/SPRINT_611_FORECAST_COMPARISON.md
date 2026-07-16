# Sprint 6.11 - Forecast vs lib/intelligence-core Comparison

## Overview

**Date**: 2026-07-13  
**Engine**: CareerCopilotForecastEngine  
**Target**: lib/intelligence-core (Sprint 6.10 implementation)  
**Status**: Comparison Complete  
**Next Step**: Infrastructure Migration

---

## Architecture Comparison

### Current Architecture (Forecast)

```
CareerCopilotForecastEngine.generateForecast()
↓
Extract data from CandidateGraph
↓
Extract observations from CandidateAIBrain
↓
Extract context from 6 other engines
↓
aiOrchestrator.execute(careerCopilotForecastV1, variables, config)
↓
Save result to CandidateAIBrain
↓
Publish event to EventBus
↓
Return ForecastOutput
```

### Target Architecture (lib/intelligence-core)

```
IntelligenceUseCase.execute(request)
↓
Validate request
↓
Build prompt variables from context
↓
Provider.execute(prompt, variables, options)
↓
ResultAdapter.adapt(result)
↓
Return IntelligenceResponse
```

---

## Component Mapping

| Current Component | Target Component | Status |
|------------------|------------------|--------|
| `CareerCopilotForecastEngine` | `IntelligenceUseCase` | ✅ Mappable |
| `aiOrchestrator` | `IntelligenceProviderPort` | ✅ Mappable |
| `careerCopilotForecastV1` | Prompt template | ✅ Mappable |
| `ForecastInput` | `IntelligenceRequest<TInput>` | ✅ Mappable |
| `ForecastOutput` | `IntelligenceResponse<TOutput>` | ✅ Mappable |
| `CandidateAIBrain` | Context building | ⚠️ Custom required |
| `EventBus` | Event publishing | ⚠️ Custom required |

---

## DTO Mapping

### ForecastInput → IntelligenceRequest

**Current**:
```typescript
export interface ForecastInput {
  candidateGraph: any;  // ⚠️ VIOLATION: any type
}
```

**Target**:
```typescript
export interface IntelligenceRequest<TInput> {
  readonly id: string;
  readonly type: string;
  readonly input: TInput;
  readonly context: IntelligenceContext;
  readonly options: IntelligenceOptions;
}
```

**Gap Analysis**:
- ❌ ForecastInput lacks `id`, `type`, `context`, `options`
- ❌ ForecastInput uses `any` type (violation)
- ✅ Can wrap ForecastInput in IntelligenceRequest

### ForecastOutput → IntelligenceResponse

**Current**:
```typescript
export interface ForecastOutput {
  today: { /* ... */ };
  currentTrajectory: { /* ... */ };
  probableFuture: { /* ... */ };
  why: { /* ... */ };
  whatCanAccelerate: { /* ... */ };
  whatCanSlowDown: { /* ... */ };
  successProbability: { /* ... */ };
  predictionConfidence: { /* ... */ };
  priorityActions: string[];
}
```

**Target**:
```typescript
export interface IntelligenceResponse<TOutput> {
  readonly id: string;
  readonly type: string;
  readonly data: TOutput;
  readonly metadata: IntelligenceMetadata;
  readonly error?: IntelligenceError;
}
```

**Gap Analysis**:
- ✅ ForecastOutput can be wrapped in IntelligenceResponse.data
- ❌ ForecastOutput lacks `id`, `type`, `metadata`
- ❌ ForecastOutput fields not readonly (violation)
- ✅ Can add metadata from execution

---

## Context Building Gap

### Current Context Building (Forecast)

Forecast extracts context from:
1. CandidateGraph (candidate profile, trends, scores)
2. CandidateAIBrain (historical observations, goals, recommendations, progression plan, digital twin, daily summary)
3. 6 other engines (Success, Scenario, Constraint, Resource, KnowledgeEvolution)

**Total**: 15 context variables

### Target Context Building (lib/intelligence-core)

lib/intelligence-core provides:
- `IntelligenceContext` interface
- No built-in context extraction utilities
- Context building is engine-specific

**Gap Analysis**:
- ❌ lib/intelligence-core does NOT provide ContextBuilder
- ❌ lib/intelligence-core does NOT provide DependencyManager
- ⚠️ Forecast must implement custom context building
- ⚠️ Forecast must implement custom dependency resolution

**Recommendation**: Create engine-specific context builder in Forecast's infrastructure layer.

---

## Event Publishing Gap

### Current Event Publishing (Forecast)

```typescript
candidateAIBrain.addObservation({
  timestamp: new Date(),  // ⚠️ VIOLATION: Date object
  source: "career-copilot-forecast",
  type: "general",
  data: result.data,
  confidence: 0.8,
});

eventBus.publish(forecastEvent);
```

### Target Event Publishing (lib/intelligence-core)

lib/intelligence-core does NOT provide:
- Event publishing utilities
- EventBus integration
- CandidateAIBrain integration

**Gap Analysis**:
- ❌ lib/intelligence-core does NOT provide EventPublisher
- ❌ lib/intelligence-core does NOT provide Brain integration
- ⚠️ Forecast must keep custom CandidateAIBrain integration
- ⚠️ Forecast must keep custom EventBus integration

**Recommendation**: Keep CandidateAIBrain and EventBus integration in Forecast's infrastructure layer.

---

## Provider Configuration Gap

### Current Provider Configuration (Forecast)

```typescript
{
  provider: "openai",
  model: "gpt-4-turbo",
  promptId: "career-copilot-forecast",
  promptVersion: "v1",
  temperature: 0.7,
  maxTokens: 1500,
}
```

### Target Provider Configuration (lib/intelligence-core)

```typescript
{
  provider: string,  // ✅ Flexible (not enum)
  model: string,
  temperature?: number,
  maxTokens?: number,
  timeout?: number,
  streaming?: boolean,  // ✅ New capability
}
```

**Gap Analysis**:
- ✅ `provider` is now string (more flexible)
- ✅ `temperature` and `maxTokens` are compatible
- ❌ `promptId` and `promptVersion` are NOT in lib/intelligence-core
- ✅ `timeout` is new (can use default)
- ✅ `streaming` is new (can ignore)

**Recommendation**: Remove `promptId` and `promptVersion` from configuration. These are legacy aiOrchestrator concepts.

---

## Identified Gaps

### Critical Gaps (Must Address)

1. **DTO Violations**
   - ForecastInput.candidateGraph: any → needs strict type
   - ForecastOutput fields → need readonly
   - new Date() → need ISO strings

2. **Context Building**
   - lib/intelligence-core does NOT provide ContextBuilder
   - Forecast must implement custom context extraction
   - Forecast must implement custom dependency resolution

3. **Event Publishing**
   - lib/intelligence-core does NOT provide EventPublisher
   - Forecast must keep custom CandidateAIBrain integration
   - Forecast must keep custom EventBus integration

4. **Prompt Management**
   - lib/intelligence-core does NOT manage prompts
   - Forecast must keep prompt in infrastructure
   - Forecast must remove promptId/promptVersion concepts

### Minor Gaps (Can Defer)

1. **Streaming Support**
   - lib/intelligence-core supports streaming
   - Forecast does not use streaming
   - Can ignore for now

2. **Timeout Configuration**
   - lib/intelligence-core supports timeout
   - Forecast does not use timeout
   - Can use default

---

## Migration Strategy

### Phase 1: Fix DTO Violations (Pre-requisite)

1. Replace `ForecastInput.candidateGraph: any` with strict type
2. Add `readonly` to all ForecastOutput fields
3. Replace `new Date()` with `new Date().toISOString()`

### Phase 2: Create Infrastructure Layer

1. Create `core/intelligence/engines/forecast/infrastructure/`
2. Create `ForecastContextBuilder.ts` - custom context extraction
3. Create `ForecastDependencyResolver.ts` - custom dependency resolution
4. Move prompt to infrastructure layer

### Phase 3: Migrate to IntelligenceUseCase

1. Wrap ForecastInput in IntelligenceRequest
2. Wrap ForecastOutput in IntelligenceResponse
3. Replace aiOrchestrator with IntelligenceUseCase
4. Use AISDKV6Provider or MistralProvider

### Phase 4: Keep Legacy Integrations

1. Keep CandidateAIBrain integration (custom)
2. Keep EventBus integration (custom)
3. Keep engine-to-engine dependencies (custom)

### Phase 5: Update API

1. Keep `CareerCopilotForecastEngine.generateForecast()` signature
2. Add internal migration to IntelligenceUseCase
3. Maintain backward compatibility

---

## Complexity Assessment

### Migration Complexity: **HIGH**

**Reasons**:
1. DTO violations require correction (any, Date, readonly)
2. Context building must be custom (no utility in lib/intelligence-core)
3. Event publishing must be custom (no utility in lib/intelligence-core)
4. 6 engine dependencies require custom resolution
5. Prompt management must be custom (no utility in lib/intelligence-core)

### Estimated Effort: 6-8 hours

**Breakdown**:
- DTO fixes: 1 hour
- Infrastructure layer creation: 2 hours
- IntelligenceUseCase integration: 2 hours
- Testing and validation: 2 hours
- Buffer: 1 hour

---

## Recommendations

### 1. Accept Custom Components

lib/intelligence-core is a minimal framework. It does NOT provide:
- ContextBuilder
- DependencyManager  
- EventPublisher
- Brain integration

**Recommendation**: Accept that Forecast must implement these components custom in its infrastructure layer.

### 2. Focus on Core Migration

The core value of lib/intelligence-core is:
- Provider abstraction (IntelligenceProviderPort)
- Request/Response standardization (IntelligenceRequest/Response)
- Error handling standardization (IntelligenceError hierarchy)

**Recommendation**: Focus migration on these core benefits. Keep custom components for context, events, and brain integration.

### 3. Maintain Backward Compatibility

Forecast is used by multiple components. Breaking the API would cause regressions.

**Recommendation**: Keep `CareerCopilotForecastEngine.generateForecast()` signature unchanged. Implement migration internally.

### 4. Incremental Migration

Given the complexity, consider an incremental approach:

**Phase 1**: DTO fixes only (1 hour)
**Phase 2**: Infrastructure layer creation (2 hours)
**Phase 3**: IntelligenceUseCase integration (2 hours)
**Phase 4**: Testing and validation (2 hours)

**Recommendation**: Complete each phase with green builds before proceeding.

---

## Next Steps

1. ✅ Fix DTO violations (any, Date, readonly)
2. ✅ Create Forecast infrastructure layer
3. ✅ Implement custom context builder
4. ✅ Implement custom dependency resolver
5. ✅ Integrate IntelligenceUseCase
6. ✅ Keep CandidateAIBrain integration
7. ✅ Keep EventBus integration
8. ✅ Test and validate
9. ✅ Create migration report

---

## Conclusion

Forecast can be migrated to lib/intelligence-core, but it requires:
- Custom infrastructure components (context, dependencies, events)
- DTO corrections (any, Date, readonly)
- Careful backward compatibility maintenance

The migration is feasible but complex (6-8 hours). The key insight is that lib/intelligence-core is a minimal framework focused on provider abstraction and DTO standardization, NOT a comprehensive engine framework with context building and event publishing utilities.

**Status**: Ready for infrastructure migration  
**Next Step**: Begin Phase 1 - Fix DTO violations
