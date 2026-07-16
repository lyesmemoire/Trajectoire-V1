# Planning Architecture Audit

## Overview

Comprehensive audit of the Planning domain to determine its architectural family and migration strategy.

**Date**: 2026-07-13  
**Context**: Sprint 6.8 - Planning Migration  
**Objective**: Classify Planning into the appropriate AI component family  

---

## Component Inventory

### React Components (Client-Side)

| Component | Location | Purpose | AI Dependencies |
|-----------|----------|---------|----------------|
| planning-intelligence.tsx | components/dashboard/ | Display planning intelligence data | None (presentational) |
| progression-plan.tsx | components/dashboard/ | Display progression plan data | None (presentational) |
| why-plan.tsx | components/dashboard/ | Display plan explanation | None (presentational) |
| progress-plan/page.tsx | app/(app)/dashboard/progress-plan/ | Display static task list | None (no AI) |

**Total**: 4 React components  
**AI Dependencies**: None (all presentational, receive data via props)

### Server Actions

**None found**

### Services & Orchestrators

**None found**

### AI Engines

| Engine | Location | Purpose | AI Dependencies |
|--------|----------|---------|----------------|
| CareerCopilotPlanningIntelligenceEngine | core/intelligence/engines/ | Generate career planning intelligence | aiOrchestrator, CandidateAIBrain, EventBus |
| CareerCopilotProgressionPlanEngine | core/intelligence/engines/ | Generate progression plan | aiOrchestrator, CandidateAIBrain, EventBus |
| ActionPlanAIEngine | core/intelligence/engines/ | Generate action plan | aiOrchestrator, CandidateAIBrain |

**Total**: 3 AI engines  
**AI Dependencies**: aiOrchestrator, CandidateAIBrain, EventBus

### Prompts

| Prompt | Location | Purpose |
|--------|----------|---------|
| career-copilot-planning-intelligence-v1.ts | core/ai/Prompts/ | Planning intelligence prompt template |
| career-copilot-progression-plan-v1.ts | core/ai/Prompts/ | Progression plan prompt template |
| action-plan-v1.ts | core/ai/Prompts/ | Action plan prompt template |

**Total**: 3 prompts

### Sub-modules

**None found**

---

## Domain Existence Analysis

### Expected Location

According to `reports/AI_DOMAINS_MATRIX.md`:
- **Expected Location**: `lib/planning/` (estimated)
- **Status**: Legacy (Not Migrated)
- **Architecture**: Monolithic with client-side AI
- **Features**: Career planning, goal setting, milestone tracking, resource allocation
- **Dependencies**: Supabase, Task APIs

### Actual State

**Search Results**:
- ❌ No `lib/planning/` directory found
- ❌ No Planning-specific services found
- ❌ No Planning route handlers found
- ✅ 3 Planning AI engines exist (CareerCopilotPlanningIntelligenceEngine, CareerCopilotProgressionPlanEngine, ActionPlanAIEngine)
- ✅ 3 Planning prompts exist
- ✅ 4 presentational components exist (receive data via props)
- ❌ No Task API integration found

### Conclusion

**Planning does not exist as an independent domain.**

Planning is implemented as Intelligence Engines with presentational components. It follows the Intelligence Engine pattern (aiOrchestrator + CandidateAIBrain + EventBus + structured JSON output), not the Conversational Domain pattern.

---

## Data Flow Analysis

### Current Flow

```
Dashboard (app/(app)/dashboard/page.tsx)
  ↓ Server Component
CandidateGraphDataLoader (loadFromRealData)
  ↓ CandidateGraph
CandidateGraphBuilder (build)
  ↓ candidateGraph
CareerCopilotPlanningIntelligenceEngine.generatePlanning()
  ↓ aiOrchestrator.execute()
career-copilot-planning-intelligence-v1 (Prompt)
  ↓ Structured JSON
PlanningOutput (currentPosition, targetPosition, gapAnalysis, planningRoadmap, etc.)
  ↓ Pass to component
PlanningIntelligence (presentational)
  ↓ Display data
UI (render planning data)
```

### Flow Characteristics

- **AI Processing**: Yes (aiOrchestrator with Claude 3.5 Sonnet)
- **Streaming**: No (synchronous JSON generation)
- **Conversation**: No (no message history, no chat interface)
- **useChat**: No (no chat hook)
- **AI Engine**: Yes (CareerCopilotPlanningIntelligenceEngine, CareerCopilotProgressionPlanEngine, ActionPlanAIEngine)
- **Provider**: Yes (Anthropic Claude 3.5 Sonnet)
- **Prompt**: Yes (career-copilot-planning-intelligence-v1, career-copilot-progression-plan-v1, action-plan-v1)
- **Structured Input**: Yes (PlanningInput, ProgressionPlanInput)
- **Structured Output**: Yes (PlanningOutput, ProgressionPlanOutput)
- **CandidateAIBrain**: Yes (historical context)
- **EventBus**: Yes (event publishing)

---

## AI Dependencies

### LLM Provider

- **Provider**: Anthropic Claude 3.5 Sonnet
- **Usage**: aiOrchestrator.execute()
- **Pattern**: Synchronous JSON generation (not streaming)

### AI Orchestrator

- **Component**: aiOrchestrator
- **Usage**: CareerCopilotPlanningIntelligenceEngine.generatePlanning()
- **Pattern**: Structured JSON output

### Prompts

- **Prompt**: career-copilot-planning-intelligence-v1.ts
- **Type**: PromptTemplate
- **Purpose**: Generate career planning intelligence
- **Variables**: 18 variables (candidateProfile, careerTimeline, skillsEvolution, etc.)

- **Prompt**: career-copilot-progression-plan-v1.ts
- **Type**: PromptTemplate
- **Purpose**: Generate progression plan
- **Variables**: Multiple variables (candidateProfile, historicalObservations, etc.)

- **Prompt**: action-plan-v1.ts
- **Type**: PromptTemplate
- **Purpose**: Generate action plan
- **Variables**: Multiple variables

---

## Supabase Access

### Tables Accessed

**Unknown** - Planning engines use CandidateGraph which likely accesses Supabase via CandidateGraphDataLoader.

### Access Pattern

**Server-side only** - Planning engines are called from server components (dashboard page.tsx).

---

## Bundle Analysis

### Client Bundle

**React Components**:
- planning-intelligence.tsx is client-side ("use client")
- progression-plan.tsx is client-side
- why-plan.tsx is client-side
- progress-plan/page.tsx is client-side
- No AI engine imports in client components ✅
- No LLM provider imports in client components ✅
- No prompt imports in client components ✅
- Purely presentational (receive data via props) ✅

**Bundle Impact**:
- Minimal (presentational components only)
- No AI engines in client bundle ✅
- No prompts in client bundle ✅
- No LLM providers in client bundle ✅

### Server Bundle

**Server Components**:
- dashboard page.tsx imports CareerCopilotPlanningIntelligenceEngine ✅
- CareerCopilotPlanningIntelligenceEngine imports aiOrchestrator ✅
- CareerCopilotPlanningIntelligenceEngine imports CandidateAIBrain ✅
- CareerCopilotPlanningIntelligenceEngine imports career-copilot-planning-intelligence-v1 prompt ✅

**Bundle Impact**:
- AI engines in server bundle (expected)
- Prompts in server bundle (expected)
- LLM provider in server bundle (expected)

---

## Architecture Pattern

### Current Pattern

Planning follows the **Intelligence Engine** pattern:

1. **AI Processing**: Yes (aiOrchestrator with Claude 3.5 Sonnet)
2. **Streaming**: No (synchronous JSON generation)
3. **Conversation**: No (no chat interface)
4. **useChat**: No (no chat hook)
5. **Structured Input**: Yes (PlanningInput, ProgressionPlanInput)
6. **Structured Output**: Yes (PlanningOutput, ProgressionPlanOutput)
7. **aiOrchestrator**: Yes (aiOrchestrator.execute())
8. **CandidateAIBrain**: Yes (historical context)
9. **EventBus**: Yes (event publishing)

### Pattern Comparison

| Characteristic | Conversational Domain | Intelligence Engine | Decision Engine | Background Agent | Knowledge Service | Planning |
|----------------|---------------------|---------------------|-----------------|------------------|------------------|----------|
| Streaming | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Conversation | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Message + History | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| useChat | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Structured Input | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| Structured Output | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| aiOrchestrator | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No | ✅ Yes |
| CandidateAIBrain | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No | ✅ Yes |
| EventBus | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| Rule-based | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Autonomous | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Embeddings | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |

**Pattern Match**: 9/9 characteristics match Intelligence Engine pattern  
**Pattern Mismatch**: 0/9 characteristics match Conversational Domain pattern

---

## Technical Debt

### Violations of AI Domain Standard

**Not applicable** - Planning is not a Conversational Domain.

### Legacy Dependencies

**None found** - Planning uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain, EventBus).

### Import Restrictions

**Current State**:
- Client components have no AI imports ✅
- Server component imports CareerCopilotPlanningIntelligenceEngine ✅
- No forbidden imports ✅

**No Forbidden Imports**: Current state respects server-only boundaries.

---

## Opportunities for Mutualization

**None** - Planning already uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain, EventBus). It should be standardized with other intelligence engines in Phase 2.

---

## Complexity Assessment

### Complexity Level: Medium

**Reasons**:
1. 3 AI engines (CareerCopilotPlanningIntelligenceEngine, CareerCopilotProgressionPlanEngine, ActionPlanAIEngine)
2. 3 prompts (career-copilot-planning-intelligence-v1, career-copilot-progression-plan-v1, action-plan-v1)
3. Standard AI infrastructure (aiOrchestrator, CandidateAIBrain, EventBus)
4. Presentational components only (no AI logic in client)
5. Server-side only AI processing
6. Complex data structures (PlanningOutput, ProgressionPlanOutput)

### Migration Effort

**Estimated Effort**: Not applicable (Intelligence Engine, not Conversational Domain)  
**Risk**: None  
**Complexity**: Medium

---

## Key Insights

### 1. Planning is an Intelligence Engine

Planning is implemented as Intelligence Engines, not a Conversational Domain. It uses aiOrchestrator + CandidateAIBrain + EventBus pattern with structured JSON output.

### 2. Planning Does Not Match Conversational Domain Pattern

Planning does not match the Conversational Domain pattern:
- ❌ No streaming
- ❌ No conversation
- ❌ No useChat
- ❌ No message history
- ✅ Synchronous operation
- ✅ Structured input/output
- ✅ aiOrchestrator integration
- ✅ CandidateAIBrain integration
- ✅ EventBus integration

### 3. Planning Already Uses Standard AI Infrastructure

Planning already uses standard AI infrastructure:
- aiOrchestrator for LLM calls
- CandidateAIBrain for historical context
- EventBus for event publishing
- Standard prompt pattern (PromptTemplate)

### 4. Planning Components are Purely Presentational

All Planning React components are purely presentational:
- No AI imports in client components
- Receive data via props
- No AI logic in client
- Server-side AI processing only

### 5. Migration to AI Domain Standard is Inappropriate

Migrating Planning to the AI Domain Standard is inappropriate because:
- Planning is not a Conversational Domain
- Planning is an Intelligence Engine
- Planning should be standardized with other intelligence engines in Phase 2

---

## Recommendations

### Primary Recommendation

**Planning should be classified as an Intelligence Engine, not a Conversational Domain.**

**Rationale**:
1. Planning uses aiOrchestrator + CandidateAIBrain + EventBus pattern
2. Planning has structured input/output (not streaming)
3. Planning has no conversation or chat interface
4. Planning is synchronous, not streaming
5. Planning matches 9/9 Intelligence Engine characteristics

### Secondary Recommendation

**Planning should be standardized with other intelligence engines in Phase 2.**

**Rationale**:
1. Planning already uses standard AI infrastructure
2. Planning should follow Intelligence Engine Standard (to be defined in Phase 2)
3. Planning should not be migrated to AI Domain Standard

### Tertiary Recommendation

**Update AI_COMPONENT_CLASSIFICATION.md and AI_PLATFORM_ROADMAP.md to reflect this finding.**

**Rationale**:
1. Remove Planning from Conversational Domain list
2. Add Planning to Intelligence Engine list
3. Note that Planning is an Intelligence Engine
4. Intelligence Engine Standard should include Planning

---

## Conclusion

Planning is an Intelligence Engine, not a Conversational Domain. It follows the aiOrchestrator + CandidateAIBrain + EventBus pattern with structured JSON output. Migrating Planning to the AI Domain Standard is inappropriate because Planning is not a Conversational Domain.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Next Steps**: Remove Planning from AI Platform Roadmap Phase 1, add to Phase 2 (Intelligence Engine)

**Decision**: STOP - Planning is an Intelligence Engine and should not be migrated as a Conversational Domain.
