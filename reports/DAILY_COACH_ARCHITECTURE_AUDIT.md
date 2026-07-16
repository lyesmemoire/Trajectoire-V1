# Daily Coach Architecture Audit

## Overview

Comprehensive audit of the Daily Coach domain to determine its architectural family and migration strategy.

**Date**: 2026-07-13  
**Context**: Sprint 6.8 - Daily Coach Migration  
**Objective**: Classify Daily Coach into the appropriate AI component family  

---

## Component Inventory

### React Components (Client-Side)

| Component | Location | Purpose | AI Dependencies |
|-----------|----------|---------|----------------|
| daily-coach-widget.tsx | components/dashboard/ | Display daily coaching widget | None (presentational) |
| daily-summary.tsx | components/dashboard/ | Display daily summary with progress | None (presentational) |
| coaching-intelligence.tsx | components/dashboard/ | Display coaching intelligence data | None (presentational) |
| live-coaching.tsx | components/dashboard/ | Display live coaching data | None (presentational) |

**Total**: 4 React components  
**AI Dependencies**: None (all presentational, receive data via props)

### Server Actions

**None found**

### Services & Orchestrators

| Service | Location | Purpose | AI Dependencies |
|---------|----------|---------|----------------|
| email-coaching.ts | lib/coaching/ | Send weekly summary email | None (email service) |

**Total**: 1 service  
**AI Dependencies**: None

### AI Engine

| Engine | Location | Purpose | AI Dependencies |
|--------|----------|---------|----------------|
| DailyCoachAIEngine | core/intelligence/engines/ | Generate daily coaching messages | aiOrchestrator, CandidateAIBrain |

**Total**: 1 AI engine  
**AI Dependencies**: aiOrchestrator, CandidateAIBrain

### Prompts

| Prompt | Location | Purpose |
|--------|----------|---------|
| daily-coach-v1.ts | core/ai/Prompts/ | Daily coaching prompt template |

**Total**: 1 prompt

### Sub-modules

**None found**

---

## Domain Existence Analysis

### Expected Location

According to `reports/AI_DOMAINS_MATRIX.md`:
- **Expected Location**: `lib/daily-coach/` (estimated)
- **Status**: Legacy (Not Migrated)
- **Architecture**: Monolithic with client-side AI
- **Features**: Daily task recommendations, progress tracking, motivation and coaching, habit formation
- **Dependencies**: Supabase, Calendar API

### Actual State

**Search Results**:
- ❌ No `lib/daily-coach/` directory found
- ❌ No Daily Coach-specific services found
- ❌ No Daily Coach route handlers found
- ✅ Daily Coach AI engine exists (`core/intelligence/engines/dailyCoachAIEngine.ts`)
- ✅ Daily Coach prompt exists (`core/ai/Prompts/daily-coach-v1.ts`)
- ✅ 4 presentational components exist (receive data via props)
- ✅ 1 email service exists (`lib/coaching/email-coaching.ts`)

### Conclusion

**Daily Coach does not exist as an independent domain.**

Daily Coach is implemented as an Intelligence Engine (`DailyCoachAIEngine`) with presentational components. It follows the Intelligence Engine pattern (aiOrchestrator + CandidateAIBrain + structured JSON output), not the Conversational Domain pattern.

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
DailyCoachAIEngine.generateDailyCoach()
  ↓ aiOrchestrator.execute()
daily-coach-v1 (Prompt)
  ↓ Structured JSON
DailyCoachOutput (personalizedMessage, dailyObjective, etc.)
  ↓ Pass to component
DailyCoachWidget (presentational)
  ↓ Display data
UI (render coaching data)
```

### Flow Characteristics

- **AI Processing**: Yes (aiOrchestrator with GPT-4 Turbo)
- **Streaming**: No (synchronous JSON generation)
- **Conversation**: No (no message history, no chat interface)
- **useChat**: No (no chat hook)
- **AI Engine**: Yes (DailyCoachAIEngine)
- **Provider**: Yes (OpenAI GPT-4 Turbo)
- **Prompt**: Yes (daily-coach-v1)
- **Structured Input**: Yes (DailyCoachInput)
- **Structured Output**: Yes (DailyCoachOutput)
- **CandidateAIBrain**: Yes (historical context)
- **EventBus**: No

---

## AI Dependencies

### LLM Provider

- **Provider**: OpenAI GPT-4 Turbo
- **Usage**: aiOrchestrator.execute()
- **Pattern**: Synchronous JSON generation (not streaming)

### AI Orchestrator

- **Component**: aiOrchestrator
- **Usage**: DailyCoachAIEngine.generateDailyCoach()
- **Pattern**: Structured JSON output

### Prompts

- **Prompt**: daily-coach-v1.ts
- **Type**: PromptTemplate
- **Purpose**: Generate daily coaching messages
- **Variables**: 18 variables (candidateProfile, strengths, weaknesses, etc.)

---

## Supabase Access

### Tables Accessed

**Unknown** - Daily Coach uses CandidateGraph which likely accesses Supabase via CandidateGraphDataLoader.

### Access Pattern

**Server-side only** - DailyCoachAIEngine is called from server component (dashboard page.tsx).

---

## Bundle Analysis

### Client Bundle

**React Components**:
- daily-coach-widget.tsx is client-side ("use client")
- daily-summary.tsx is client-side
- coaching-intelligence.tsx is client-side
- live-coaching.tsx is client-side
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
- dashboard page.tsx imports DailyCoachAIEngine ✅
- DailyCoachAIEngine imports aiOrchestrator ✅
- DailyCoachAIEngine imports CandidateAIBrain ✅
- DailyCoachAIEngine imports daily-coach-v1 prompt ✅

**Bundle Impact**:
- AI engine in server bundle (expected)
- Prompts in server bundle (expected)
- LLM provider in server bundle (expected)

---

## Architecture Pattern

### Current Pattern

Daily Coach follows the **Intelligence Engine** pattern:

1. **AI Processing**: Yes (aiOrchestrator with GPT-4 Turbo)
2. **Streaming**: No (synchronous JSON generation)
3. **Conversation**: No (no chat interface)
4. **useChat**: No (no chat hook)
5. **Structured Input**: Yes (DailyCoachInput)
6. **Structured Output**: Yes (DailyCoachOutput)
7. **aiOrchestrator**: Yes (aiOrchestrator.execute())
8. **CandidateAIBrain**: Yes (historical context)
9. **EventBus**: No

### Pattern Comparison

| Characteristic | Conversational Domain | Intelligence Engine | Decision Engine | Background Agent | Knowledge Service | Daily Coach |
|----------------|---------------------|---------------------|-----------------|------------------|------------------|-------------|
| Streaming | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Conversation | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Message + History | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| useChat | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Structured Input | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| Structured Output | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| aiOrchestrator | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No | ✅ Yes |
| CandidateAIBrain | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No | ✅ Yes |
| EventBus | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Rule-based | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Autonomous | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Embeddings | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |

**Pattern Match**: 9/9 characteristics match Intelligence Engine pattern  
**Pattern Mismatch**: 0/9 characteristics match Conversational Domain pattern

---

## Technical Debt

### Violations of AI Domain Standard

**Not applicable** - Daily Coach is not a Conversational Domain.

### Legacy Dependencies

**None found** - Daily Coach uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain).

### Import Restrictions

**Current State**:
- Client components have no AI imports ✅
- Server component imports DailyCoachAIEngine ✅
- No forbidden imports ✅

**No Forbidden Imports**: Current state respects server-only boundaries.

---

## Opportunities for Mutualization

**None** - Daily Coach already uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain). It should be standardized with other intelligence engines in Phase 2.

---

## Complexity Assessment

### Complexity Level: Low

**Reasons**:
1. Single AI engine (DailyCoachAIEngine)
2. Single prompt (daily-coach-v1)
3. Standard AI infrastructure (aiOrchestrator, CandidateAIBrain)
4. Presentational components only (no AI logic in client)
5. Server-side only AI processing

### Migration Effort

**Estimated Effort**: Not applicable (Intelligence Engine, not Conversational Domain)  
**Risk**: None  
**Complexity**: Low

---

## Key Insights

### 1. Daily Coach is an Intelligence Engine

Daily Coach is implemented as an Intelligence Engine, not a Conversational Domain. It uses aiOrchestrator + CandidateAIBrain pattern with structured JSON output.

### 2. Daily Coach Does Not Match Conversational Domain Pattern

Daily Coach does not match the Conversational Domain pattern:
- ❌ No streaming
- ❌ No conversation
- ❌ No useChat
- ❌ No message history
- ✅ Synchronous operation
- ✅ Structured input/output
- ✅ aiOrchestrator integration
- ✅ CandidateAIBrain integration

### 3. Daily Coach Already Uses Standard AI Infrastructure

Daily Coach already uses standard AI infrastructure:
- aiOrchestrator for LLM calls
- CandidateAIBrain for historical context
- Standard prompt pattern (PromptTemplate)

### 4. Daily Coach Components are Purely Presentational

All Daily Coach React components are purely presentational:
- No AI imports in client components
- Receive data via props
- No AI logic in client
- Server-side AI processing only

### 5. Migration to AI Domain Standard is Inappropriate

Migrating Daily Coach to AI Domain Standard is inappropriate because:
- Daily Coach is not a Conversational Domain
- Daily Coach is an Intelligence Engine
- Daily Coach should be standardized with other intelligence engines in Phase 2

---

## Recommendations

### Primary Recommendation

**Daily Coach should be classified as an Intelligence Engine, not a Conversational Domain.**

**Rationale**:
1. Daily Coach uses aiOrchestrator + CandidateAIBrain pattern
2. Daily Coach has structured input/output (not streaming)
3. Daily Coach has no conversation or chat interface
4. Daily Coach is synchronous, not streaming
5. Daily Coach matches 9/9 Intelligence Engine characteristics

### Secondary Recommendation

**Daily Coach should be standardized with other intelligence engines in Phase 2.**

**Rationale**:
1. Daily Coach already uses standard AI infrastructure
2. Daily Coach should follow Intelligence Engine Standard (to be defined in Phase 2)
3. Daily Coach should not be migrated to AI Domain Standard

### Tertiary Recommendation

**Update AI_COMPONENT_CLASSIFICATION.md and AI_PLATFORM_ROADMAP.md to reflect this finding.**

**Rationale**:
1. Remove Daily Coach from Conversational Domain list
2. Add Daily Coach to Intelligence Engine list
3. Note that Daily Coach is an Intelligence Engine
4. Intelligence Engine Standard should include Daily Coach

---

## Conclusion

Daily Coach is an Intelligence Engine, not a Conversational Domain. It follows the aiOrchestrator + CandidateAIBrain pattern with structured JSON output. Migrating Daily Coach to the AI Domain Standard is inappropriate because Daily Coach is not a Conversational Domain.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Next Steps**: Remove Daily Coach from AI Platform Roadmap Phase 1, add to Phase 2 (Intelligence Engine Standard)

**Decision**: STOP - Daily Coach is an Intelligence Engine and should not be migrated as a Conversational Domain.
