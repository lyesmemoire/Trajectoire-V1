# ATS Architecture Audit

## Overview

Comprehensive audit of the ATS (Applicant Tracking System) domain to determine its architectural family and migration strategy.

**Date**: 2026-07-13  
**Context**: Sprint 6.8.2 - ATS Qualification  
**Objective**: Classify ATS into the appropriate AI component family  

---

## Component Inventory

### React Components (Client-Side)

| Component | Location | Purpose | AI Dependencies |
|-----------|----------|---------|----------------|
| ats-analysis-animation.tsx | components/candidate/ | Animation during analysis | None |
| ats-report-premium.tsx | components/candidate/ | Display ATS results | None |
| cv-upload-premium.tsx | components/candidate/ | CV upload interface | None |
| priority-matrix.tsx | components/candidate/ | Priority visualization | None |
| quick-wins.tsx | components/candidate/ | Quick wins display | None |
| client.tsx | app/(app)/dashboard/ats/ | Main ATS UI | None |

**Total**: 6 React components  
**AI Dependencies**: None (all presentational)

### Server Actions

| Action | Location | Purpose | AI Dependencies |
|--------|----------|---------|----------------|
| runATSAnalysis | app/(app)/dashboard/ats/actions.ts | Trigger ATS analysis | ATSAIEngine |

**Total**: 1 Server Action  
**AI Dependencies**: ATSAIEngine (intelligence engine)

### Services & Orchestrators

| Service | Location | Purpose | AI Dependencies |
|---------|----------|---------|----------------|
| ATSService | lib/ats/service.ts | ATS analysis service | processATSAnalysis |
| processATSAnalysis | lib/ats/orchestrator.ts | ATS orchestrator | Mistral LLM (generateObject) |
| processPremiumATSAnalysis | lib/ats/premium-orchestrator.ts | Premium ATS orchestrator | Mistral LLM (generateObject) |
| calculateATSScore | services/ats.ts | Heuristic scoring | None |
| calculateHeuristicScore | lib/ai/ats-heuristic.ts | Heuristic scoring | None |

**Total**: 5 services/orchestrators  
**AI Dependencies**: Mistral LLM (via generateObject)

### AI Engine

| Engine | Location | Purpose | AI Dependencies |
|--------|----------|---------|----------------|
| ATSAIEngine | core/intelligence/engines/atsAIEngine.ts | ATS intelligence engine | aiOrchestrator |

**Total**: 1 AI engine  
**AI Dependencies**: aiOrchestrator

### Sub-modules

| Module | Location | Purpose |
|--------|----------|---------|
| behavioral-logic | lib/ats/behavioral-logic/ | Recruiter grade analysis |
| contracts | lib/ats/contracts/ | Domain contracts |
| enrichment | lib/ats/enrichment/ | Feedback generation |
| extraction | lib/ats/extraction/ | PDF text extraction |
| normalization | lib/ats/normalization/ | Skill normalization |
| recruiter-signals | lib/ats/recruiter-signals/ | Recruiter signal detection |
| schemas | lib/ats/schemas/ | Zod schemas for AI |
| scoring | lib/ats/scoring/ | Scoring engines |

**Total**: 8 sub-modules

---

## Data Flow Analysis

### Current Flow

```
UI (client.tsx)
  ↓ User Action (button click)
Server Action (actions.ts)
  ↓ runATSAnalysis()
ATSAIEngine (core/intelligence/engines/atsAIEngine.ts)
  ↓ analyzeATS()
ATSService (lib/ats/service.ts)
  ↓ run()
processATSAnalysis (lib/ats/orchestrator.ts)
  ↓ parseJobOffer() + parseCVSkills()
Mistral LLM (generateObject)
  ↓ Structured JSON
Normalization (lib/ats/normalization/)
  ↓ normalizeSkills()
Scoring (lib/ats/scoring/)
  ↓ calculateSkillScore()
Enrichment (lib/ats/enrichment/)
  ↓ generateATSFeedback()
Mistral LLM (generateObject)
  ↓ Feedback text
ATSService (lib/ats/service.ts)
  ↓ filterResultByPlan()
Supabase (ats_reports table)
  ↓ Insert report
UI (client.tsx)
  ↓ Display results
```

### Flow Characteristics

- **Synchronous**: No streaming, single request/response
- **No Conversation**: No message history, no chat interface
- **Structured Input**: CV text + job description
- **Structured Output**: Score + matched/missing skills + feedback
- **Single Generation**: One-time analysis, not iterative
- **No useChat**: No chat hook, no streaming response

---

## AI Dependencies

### LLM Provider

- **Provider**: Mistral (via AI SDK)
- **Model**: mistralSmallModel, mistralModel
- **Usage**: generateObject (structured JSON generation)
- **Pattern**: Synchronous object generation, not streaming

### AI Orchestrator

- **Usage**: ATSAIEngine uses aiOrchestrator
- **Pattern**: Intelligence engine pattern (aiOrchestrator + CandidateAIBrain + EventBus)
- **Location**: core/intelligence/engines/atsAIEngine.ts

### Prompts

- **Location**: Inline prompts in orchestrator.ts and premium-orchestrator.ts
- **Pattern**: System prompts for generateObject
- **Content**: Job offer parsing, CV skill extraction, feedback generation

---

## Supabase Access

### Tables Accessed

- **cvs**: CV storage and retrieval
- **ats_reports**: ATS analysis results storage
- **subscriptions**: Subscription verification (via GetSubscriptionQuery)

### Access Pattern

- Server-side only (via createServerClient)
- No direct client-side Supabase access in ATS components

---

## Bundle Analysis

### Client Bundle

**React Components**:
- All ATS components are client-side ("use client")
- No direct AI engine imports
- No direct LLM provider imports
- No direct prompt imports
- Purely presentational

**Bundle Impact**:
- Minimal (presentational components only)
- No AI engines in client bundle
- No prompts in client bundle
- No LLM providers in client bundle

### Server Bundle

**Server Actions**:
- actions.ts imports ATSAIEngine
- ATSAIEngine imports aiOrchestrator
- Orchestrators import Mistral LLM

**Bundle Impact**:
- AI engines in server bundle (expected)
- LLM providers in server bundle (expected)
- Prompts in server bundle (expected)

---

## Architecture Pattern

### Current Pattern

ATS follows the **Intelligence Engine Pattern**:

1. **Synchronous Operation**: No streaming, single request/response
2. **Structured Input**: CV text + job description
3. **Structured Output**: Score + matched/missing skills + feedback
4. **aiOrchestrator Integration**: Uses aiOrchestrator for LLM calls
5. **CandidateAIBrain Integration**: Uses brain for historical context
6. **EventBus Integration**: Publishes events for system-wide communication
7. **No Streaming**: Unlike conversational domains
8. **No useChat**: Unlike conversational domains

### Pattern Comparison

| Characteristic | Conversational Domain | Intelligence Engine | ATS |
|----------------|---------------------|---------------------|-----|
| Streaming | ✅ Yes | ❌ No | ❌ No |
| Conversation | ✅ Yes | ❌ No | ❌ No |
| Message + History | ✅ Yes | ❌ No | ❌ No |
| useChat | ✅ Yes | ❌ No | ❌ No |
| Structured Input | ❌ No | ✅ Yes | ✅ Yes |
| Structured Output | ❌ No | ✅ Yes | ✅ Yes |
| aiOrchestrator | ❌ No | ✅ Yes | ✅ Yes |
| CandidateAIBrain | ❌ No | ✅ Yes | ✅ Yes |
| EventBus | ❌ No | ✅ Yes | ✅ Yes |

**Conclusion**: ATS matches the Intelligence Engine pattern, not the Conversational Domain pattern.

---

## Technical Debt

### Violations of AI Domain Standard

If ATS were to be migrated as a Conversational Domain:

1. **No Streaming**: ATS is synchronous, not streaming
2. **No Conversation**: ATS has no message history or chat interface
3. **No useChat**: ATS does not use useChat hook
4. **Inappropriate Abstractions**: Streaming pattern for synchronous analysis
5. **Wrong Pattern**: Conversational pattern for structured analysis

### Legacy Dependencies

1. **aiOrchestrator**: Uses legacy aiOrchestrator pattern
2. **CandidateAIBrain**: Uses legacy brain pattern
3. **EventBus**: Uses legacy event bus pattern
4. **Inline Prompts**: Prompts are inline, not in separate files

### Import Restrictions

**Current State**:
- UI components have no AI imports ✅
- Server actions import ATSAIEngine ✅
- ATSAIEngine imports aiOrchestrator ✅

**No Forbidden Imports**: Current architecture respects server-only boundaries.

---

## Opportunities for Mutualization

### Shared Abstractions

If ATS were to follow the Intelligence Engine Standard:

1. **aiOrchestrator Wrapper**: Common aiOrchestrator integration (24+ engines)
2. **CandidateAIBrain Wrapper**: Common brain integration (24+ engines)
3. **EventBus Wrapper**: Common event publishing (24+ engines)
4. **Prompt Builder**: Common prompt building logic (24+ engines)
5. **Error Handler**: Common error handling (24+ engines)

**Rule of Three**: 24+ intelligence engines exist, so extraction is appropriate.

---

## Complexity Assessment

### Complexity Level: High

**Reasons**:
1. Multiple orchestrators (orchestrator.ts, premium-orchestrator.ts)
2. 8 sub-modules with different responsibilities
3. AI SDK integration (generateObject)
4. Multiple LLM calls per analysis
5. Complex scoring logic
6. Subscription-based feature gating
7. Premium vs free tier differentiation

### Migration Effort

**Estimated Effort**: 2-3 weeks  
**Risk**: Medium  
**Complexity**: High

---

## Key Insights

### 1. ATS is NOT a Conversational Domain

ATS is an intelligence engine, not a conversational domain:

- **Pattern Mismatch**: Synchronous analysis vs streaming chat
- **Architecture Mismatch**: aiOrchestrator vs LLM Provider Port
- **Use Case Mismatch**: One-time analysis vs ongoing conversation
- **UI Mismatch**: Form-based vs chat-based

### 2. ATS Follows Intelligence Engine Pattern

ATS matches the Intelligence Engine pattern:

- ✅ Synchronous operation
- ✅ Structured input/output
- ✅ aiOrchestrator integration
- ✅ CandidateAIBrain integration
- ✅ EventBus integration
- ✅ No streaming
- ✅ No useChat

### 3. Current Architecture is Appropriate

ATS's current architecture is appropriate for its use case:

- ✅ Server-only protection
- ✅ No AI engines in client bundle
- ✅ No forbidden imports
- ✅ Clean separation of concerns

### 4. Migration to AI Domain Standard is Inappropriate

Migrating ATS to AI Domain Standard would be inappropriate:

- ❌ Would require forcing streaming pattern on synchronous analysis
- ❌ Would require adding useChat to non-chat system
- ❌ Would require adding message history to one-time analysis
- ❌ Would create unnecessary complexity
- ❌ Would violate the principle of appropriate abstractions

---

## Recommendations

### Primary Recommendation

**ATS should be classified as an Intelligence Engine, not a Conversational Domain.**

**Rationale**:
1. ATS follows the Intelligence Engine pattern (synchronous, structured I/O, aiOrchestrator)
2. ATS does not follow the Conversational Domain pattern (no streaming, no chat, no useChat)
3. Migrating to AI Domain Standard would be inappropriate and create unnecessary complexity
4. ATS should be standardized using the Intelligence Engine Standard (to be defined in Phase 2)

### Secondary Recommendation

**ATS should be included in Phase 2 (Intelligence Engine Standard) of the AI Platform Roadmap.**

**Rationale**:
1. 24+ intelligence engines exist, meeting Rule of Three
2. ATS is one of the 24+ engines
3. Intelligence Engine Standard should be defined in Sprint 6.12
4. ATS should be refactored to use the standard in Sprint 6.13+

### Tertiary Recommendation

**ATS should NOT be migrated in Sprint 6.8 (Conversational Domain Standard).**

**Rationale**:
1. ATS is not a conversational domain
2. Sprint 6.8 is for conversational domains (ATS, Learning, Daily Coach, Planning)
3. ATS should be removed from Sprint 6.8 roadmap
4. ATS should be added to Phase 2 (Intelligence Engine Standard) roadmap

---

## Conclusion

ATS is an intelligence engine, not a conversational domain. It follows the aiOrchestrator + CandidateAIBrain + EventBus pattern, with synchronous operation and structured input/output. Migrating ATS to the AI Domain Standard would be inappropriate and create unnecessary complexity. ATS should be classified as an Intelligence Engine and included in Phase 2 of the AI Platform Roadmap.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed
