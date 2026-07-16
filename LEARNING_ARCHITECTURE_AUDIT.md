# Learning Architecture Audit

## Overview

Comprehensive audit of the Learning domain to determine its architectural family and migration strategy.

**Date**: 2026-07-13  
**Context**: Sprint 6.8 - Learning Migration  
**Objective**: Classify Learning into the appropriate AI component family  

---

## Component Inventory

### React Components (Client-Side)

| Component | Location | Purpose | AI Dependencies |
|-----------|----------|---------|----------------|
| LearningProfile.tsx | components/dashboard/digital-twin/sections/ | Display learning profile in Digital Twin | None |

**Total**: 1 React component  
**AI Dependencies**: None (presentational only)

### Server Actions

**None found**

### Services & Orchestrators

**None found**

### AI Engine

**None found**

### Sub-modules

**None found**

---

## Domain Existence Analysis

### Expected Location

According to `reports/AI_DOMAINS_MATRIX.md`:
- **Expected Location**: `lib/learning/`
- **Status**: Legacy (Not Migrated)
- **Architecture**: Monolithic with client-side AI
- **Features**: Learning path recommendations, skill gap analysis, course suggestions, progress tracking
- **Dependencies**: Supabase, Content API

### Actual State

**Search Results**:
- ❌ No `lib/learning/` directory found
- ❌ No Learning-specific services found
- ❌ No Learning AI engines found
- ❌ No Learning route handlers found
- ❌ No Learning prompts found
- ✅ Only `LearningProfile.tsx` component (part of Digital Twin)

### Conclusion

**The Learning domain does not exist as an independent domain.**

The only Learning-related component is `LearningProfile.tsx`, which is a presentational component within the Digital Twin domain. This component displays learning characteristics extracted from the Digital Twin's learning profile data.

**Learning is not a standalone AI domain** - it is a feature/sub-component of the Digital Twin domain.

---

## Data Flow Analysis

### Current Flow

```
Digital Twin (components/dashboard/digital-twin/)
  ↓ DigitalTwin type
LearningProfile.tsx (presentational)
  ↓ Display learning profile data
UI (render learning characteristics)
```

### Flow Characteristics

- **No AI Processing**: No AI/LLM calls
- **No Streaming**: No streaming responses
- **No Conversation**: No chat interface
- **No useChat**: No chat hook
- **No AI Engine**: No intelligence engine
- **No Provider**: No LLM provider
- **No Prompt**: No AI prompts
- **Purely Presentational**: Component only displays data

---

## AI Dependencies

### LLM Provider

**None**

### AI Orchestrator

**None**

### Prompts

**None**

---

## Supabase Access

### Tables Accessed

**Unknown** - LearningProfile component receives data via props from Digital Twin, which likely accesses Supabase.

### Access Pattern

**Unknown** - No direct Supabase access in LearningProfile component.

---

## Bundle Analysis

### Client Bundle

**React Components**:
- LearningProfile.tsx is client-side ("use client")
- No AI engine imports
- No LLM provider imports
- No prompt imports
- Purely presentational

**Bundle Impact**:
- Minimal (presentational component only)
- No AI engines in client bundle
- No prompts in client bundle
- No LLM providers in client bundle

### Server Bundle

**No server-side Learning components found.**

---

## Architecture Pattern

### Current Pattern

Learning does not follow any AI pattern:

1. **No AI Processing**: No AI/LLM calls
2. **No Streaming**: No streaming responses
3. **No Conversation**: No chat interface
4. **No useChat**: No chat hook
5. **No Structured Input**: No structured AI input
6. **No Structured Output**: No structured AI output
7. **No aiOrchestrator**: No aiOrchestrator integration
8. **No CandidateAIBrain**: No brain integration
9. **No EventBus**: No event bus integration

### Pattern Comparison

| Characteristic | Conversational Domain | Intelligence Engine | Decision Engine | Background Agent | Knowledge Service | Learning |
|----------------|---------------------|---------------------|-----------------|------------------|------------------|----------|
| Streaming | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Conversation | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Message + History | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| useChat | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Structured Input | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| Structured Output | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ❌ No |
| aiOrchestrator | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| CandidateAIBrain | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| EventBus | ❌ No | ✅ Yes | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Rule-based | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No | ❌ No |
| Autonomous | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No | ❌ No |
| Embeddings | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ❌ No |

**Conclusion**: Learning does not match any AI component family pattern. It is a presentational component, not an AI domain.

---

## Technical Debt

### Violations of AI Domain Standard

**Not applicable** - Learning is not an AI domain.

### Legacy Dependencies

**None found** - No Learning-specific dependencies.

### Import Restrictions

**Current State**:
- LearningProfile component has no AI imports ✅
- No forbidden imports ✅

**No Forbidden Imports**: Current state respects server-only boundaries.

---

## Opportunities for Mutualization

**None** - Learning is not an AI domain and has no AI logic to mutualize.

---

## Complexity Assessment

### Complexity Level: None

**Reasons**:
1. No AI processing
2. No AI engines
3. No AI services
4. No AI orchestration
5. Purely presentational component

### Migration Effort

**Estimated Effort**: Not applicable  
**Risk**: None  
**Complexity**: None

---

## Key Insights

### 1. Learning Does Not Exist as an Independent Domain

Learning is not a standalone AI domain. It is a presentational component within the Digital Twin domain.

### 2. LearningProfile is Purely Presentational

LearningProfile.tsx only displays data. It has no AI processing, no AI engines, no AI providers, and no AI prompts.

### 3. Learning Does Not Match Any AI Pattern

Learning does not match any AI component family pattern:
- ❌ Not a Conversational Domain (no streaming, no chat, no useChat)
- ❌ Not an Intelligence Engine (no AI processing, no aiOrchestrator)
- ❌ Not a Decision Engine (no rule-based logic)
- ❌ Not a Background Agent (not autonomous)
- ❌ Not a Knowledge Service (no embeddings)

### 4. Learning is a Digital Twin Feature

Learning is a feature/sub-component of the Digital Twin domain, which is classified as a complex domain with very high complexity.

### 5. Migration to AI Domain Standard is Inappropriate

Migrating Learning to AI Domain Standard is inappropriate because:
- Learning is not an AI domain
- Learning has no AI logic to migrate
- Learning is purely presentational
- Learning is part of Digital Twin, which should be migrated as a whole

---

## Recommendations

### Primary Recommendation

**Learning should be removed from the AI Platform Roadmap as a standalone domain.**

**Rationale**:
1. Learning does not exist as an independent domain
2. Learning is a presentational component within Digital Twin
3. Learning has no AI logic to migrate
4. Learning should be migrated as part of Digital Twin (if at all)

### Secondary Recommendation

**Learning should be classified as a Digital Twin feature, not an AI domain.**

**Rationale**:
1. LearningProfile is part of the Digital Twin domain
2. Digital Twin is already classified as a complex domain
3. Learning should be migrated with Digital Twin, not separately

### Tertiary Recommendation

**Update AI_COMPONENT_CLASSIFICATION.md and AI_PLATFORM_ROADMAP.md to reflect this finding.**

**Rationale**:
1. Remove Learning from Conversational Domain list
2. Remove Learning from AI Platform Roadmap
3. Note that Learning is a Digital Twin feature
4. Digital Twin migration should include Learning features

---

## Conclusion

Learning does not exist as an independent AI domain. It is a presentational component within the Digital Twin domain, with no AI processing, no AI engines, and no AI logic. Migrating Learning to the AI Domain Standard is inappropriate because Learning is not an AI domain.

**Classification**: Not an AI domain (Digital Twin feature)  
**Standard**: Not applicable  
**Migration Phase**: Not applicable (migrate with Digital Twin if needed)  
**Current Status**: Presentational component only, no AI logic  
**Next Steps**: Remove Learning from AI Platform Roadmap, migrate with Digital Twin if needed

**Decision**: STOP - Learning is not an AI domain and should not be migrated as a standalone domain.
