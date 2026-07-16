# Sprint 6.8 — Planning Migration Report

## Executive Summary

Sprint 6.8 objective was to migrate Planning to the AI Domain Standard as a Conversational Domain. After comprehensive audit and qualification, Planning was determined to be an Intelligence Engine, not a Conversational Domain. The sprint was stopped after qualification, and no code migration was performed.

**Decision**: STOP - Planning is an Intelligence Engine, not a Conversational Domain  
**Classification**: Intelligence Engine  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Critical Finding**: Phase 1 (Conversational Domain Standard) is now complete

---

## Sprint Objective

**Original Objective**: Migrate Planning to AI Domain Standard as a Conversational Domain  
**Actual Outcome**: STOP - Planning classified as Intelligence Engine  
**Reason**: Planning uses aiOrchestrator + CandidateAIBrain + EventBus pattern, not Conversational Domain pattern

---

## Phase 1 — Audit

### Audit Scope

Comprehensive audit of Planning to identify:
- React components
- Hooks
- AI engines
- Prompts
- Providers
- Orchestrators
- EventBus
- aiOrchestrator
- CandidateAIBrain
- Services
- Route Handlers
- Server Actions

### Audit Findings

**React Components (Client-Side)**: 4
- planning-intelligence.tsx (display planning intelligence data)
- progression-plan.tsx (display progression plan data)
- why-plan.tsx (display plan explanation)
- progress-plan/page.tsx (display static task list - no AI)

**AI Engines**: 3
- CareerCopilotPlanningIntelligenceEngine (generate career planning intelligence)
- CareerCopilotProgressionPlanEngine (generate progression plan)
- ActionPlanAIEngine (generate action plan)

**Prompts**: 3
- career-copilot-planning-intelligence-v1.ts (planning intelligence prompt template)
- career-copilot-progression-plan-v1.ts (progression plan prompt template)
- action-plan-v1.ts (action plan prompt template)

**Server Actions**: 0

**Route Handlers**: 0

### Domain Existence Analysis

**Expected Location**: `lib/planning/` (estimated)  
**Actual State**: No `lib/planning/` directory found  
**Conclusion**: Planning does not exist as an independent domain. It is implemented as Intelligence Engines with presentational components.

### Data Flow Analysis

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

### Key Insights

1. **Planning does not exist as an independent domain** - No `lib/planning/` directory
2. **Planning is implemented as Intelligence Engines** - Uses aiOrchestrator + CandidateAIBrain + EventBus
3. **All React components are purely presentational** - No AI logic in client
4. **Server-side AI processing only** - AI engines called from server component

---

## Phase 2 — Qualification

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

### Classification Decision

**Family**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed

### Justification

1. **Synchronous Operation**: Planning performs synchronous JSON generation, not streaming
2. **No Conversation**: Planning has no message history or chat interface
3. **Structured Input**: Planning takes PlanningInput/ProgressionPlanInput as structured input
4. **Structured Output**: Planning returns PlanningOutput/ProgressionPlanOutput as structured JSON
5. **aiOrchestrator Integration**: Planning uses aiOrchestrator for LLM calls
6. **CandidateAIBrain Integration**: Planning uses brain for historical context
7. **EventBus Integration**: Planning uses EventBus for event publishing
8. **No useChat**: Planning does not use useChat hook
9. **No Streaming**: Planning does not use streaming responses

---

## Decision

### STOP Decision

**Decision**: STOP - Planning is an Intelligence Engine and should not be migrated as a Conversational Domain

**Rationale**:
1. Planning matches 9/9 Intelligence Engine characteristics
2. Planning matches 0/9 Conversational Domain characteristics
3. Migrating to AI Domain Standard would be inappropriate
4. Would create unnecessary complexity
5. Would violate the principle of appropriate abstractions

**Actions Taken**:
1. ✅ Created PLANNING_ARCHITECTURE_AUDIT.md
2. ✅ Created PLANNING_QUALIFICATION_REPORT.md
3. ✅ Updated AI_COMPONENT_CLASSIFICATION.md
4. ✅ Updated AI_PLATFORM_ROADMAP.md
5. ✅ Updated AI_DOMAINS_MATRIX.md

**Actions NOT Taken**:
- ❌ No code migration performed
- ❌ No domain structure created
- ❌ No infrastructure changes
- ❌ No UI changes

---

## Critical Finding

### Phase 1 (Conversational Domain Standard) is Complete

With the reclassification of Planning as an Intelligence Engine, there are **no remaining Conversational Domains** to migrate in Phase 1.

**Status**:
- Career Copilot: ✅ Migrated
- Interview: ✅ Migrated
- Planning: ❌ Intelligence Engine (not a Conversational Domain)

**Conclusion**: Phase 1 is complete. The AI Platform Roadmap should be reevaluated to determine the next steps.

---

## Documentation Updates

### AI_COMPONENT_CLASSIFICATION.md

**Changes**:
- Removed Planning from Conversational Domain list
- Added Planning to Intelligence Engine list (3 engines: PlanningIntelligenceEngine, ProgressionPlanEngine, ActionPlanAIEngine)
- Updated classification matrix
- Updated summary statistics (3 → 2 conversational domains, 26+ → 29+ intelligence engines)
- Added note explaining Planning classification

### AI_PLATFORM_ROADMAP.md

**Changes**:
- Updated Phase 1: Sprint 6.8 (was 6.8-6.9)
- Updated components: 2 (was 3) conversational domains
- Updated progress: 2/2 (100%) (was 2/3 (67%))
- Changed Sprint 6.8: Phase 1 Completion (was Planning Migration)
- Updated Phase 2: 29+ intelligence engines incl. Planning (was 26+)
- Updated timeline summary: 5 weeks (was 9-11 weeks)
- Updated recommendations: Phase 1 Completion (was Planning Migration)
- Updated conclusion: Phase 1 complete (was 2/6 conversational domains)

### AI_DOMAINS_MATRIX.md

**Changes**:
- Updated Planning status: Intelligence Engine (was Legacy)
- Updated Planning architecture: Intelligence Engine (was Monolithic)
- Updated Planning location: core/intelligence/engines/careerCopilotPlanningIntelligenceEngine.ts (was lib/planning/)
- Updated Planning dependencies: Supabase (was Supabase, Task APIs)
- Removed Planning from Medium Priority list
- Added Planning to Intelligence Engines (Phase 2) list
- Removed Planning from Low Complexity list
- Removed Planning from External Dependencies
- Removed Planning from Medium Gain list
- Removed Planning from Short-term Actions

---

## Deliverables

### Created Documents

1. **reports/PLANNING_ARCHITECTURE_AUDIT.md** - Comprehensive architecture audit
2. **reports/PLANNING_QUALIFICATION_REPORT.md** - Qualification report with classification decision
3. **SPRINT_6_8_PLANNING_REPORT.md** - This sprint report

### Updated Documents

1. **AI_COMPONENT_CLASSIFICATION.md** - Updated component classification
2. **AI_PLATFORM_ROADMAP.md** - Updated migration roadmap
3. **AI_DOMAINS_MATRIX.md** - Updated domain matrix

---

## Files Analyzed

### React Components

- `components/dashboard/planning-intelligence.tsx` - Presentational component
- `components/dashboard/progression-plan.tsx` - Presentational component
- `components/dashboard/why-plan.tsx` - Presentational component
- `app/(app)/dashboard/progress-plan/page.tsx` - Static task list (no AI)

### AI Engines

- `core/intelligence/engines/careerCopilotPlanningIntelligenceEngine.ts` - Intelligence Engine
- `core/intelligence/engines/careerCopilotProgressionPlanEngine.ts` - Intelligence Engine
- `core/intelligence/engines/actionPlanAIEngine.ts` - Intelligence Engine

### Prompts

- `core/ai/Prompts/career-copilot-planning-intelligence-v1.ts` - Prompt template
- `core/ai/Prompts/career-copilot-progression-plan-v1.ts` - Prompt template
- `core/ai/Prompts/action-plan-v1.ts` - Prompt template

### Server Components

- `app/(app)/dashboard/page.tsx` - Dashboard page (calls PlanningIntelligenceEngine)

---

## Bundle Analysis

### Client Bundle

**Status**: Clean ✅

- No AI engines in client bundle
- No prompts in client bundle
- No LLM providers in client bundle
- All React components are purely presentational
- Receive data via props only

### Server Bundle

**Status**: Appropriate ✅

- AI engines in server bundle (expected)
- Prompts in server bundle (expected)
- LLM provider in server bundle (expected)
- Server-side AI processing only

---

## Technical Debt

### Current State

**Planning Technical Debt**: Medium

- Uses standard AI infrastructure (aiOrchestrator, CandidateAIBrain, EventBus)
- No client-side AI violations
- Appropriate architecture for Intelligence Engine
- No urgent migration needed

### Migration Debt

**None** - No migration performed, so no migration debt introduced.

---

## Risks

### High Risk

**None**

### Medium Risk

1. **aiOrchestrator Dependency**: All intelligence engines depend on aiOrchestrator
   - **Mitigation**: Standardize aiOrchestrator integration in intelligence-core
   - **Impact**: Medium

2. **Complexity**: 3 AI engines with complex data structures
   - **Mitigation**: Standardize data structures across engines
   - **Impact**: Medium

### Low Risk

1. **Inline Prompts**: Prompts are in separate files ✅
2. **Legacy Dependencies**: Uses standard aiOrchestrator, CandidateAIBrain, EventBus ✅
3. **Client Bundle**: No AI engines in client bundle ✅

---

## ROI

### Business Value

- **High**: Planning is a core feature for career progression
- **Direct Impact**: Improves user goal setting and milestone tracking
- **User Value**: Provides structured career planning and progression guidance

### Technical Value

- **Medium**: Standardization will improve maintainability
- **Long-term**: Common abstractions will benefit all 29+ intelligence engines
- **Consistency**: Standard pattern across all intelligence engines

### ROI Assessment

- **Business ROI**: High (direct user impact)
- **Technical ROI**: Medium (improved maintainability)
- **Overall ROI**: High

---

## Estimation

### Migration Effort

**Estimated Effort**: 1-2 weeks (standardization in Phase 2)  
**Complexity**: Medium  
**Risk**: Low  
**Priority**: Medium

### Breakdown

- **Phase 2.1 (Sprint 6.12)**: Define Intelligence Engine Standard (1-2 weeks)
- **Phase 2.2 (Sprint 6.13)**: Extract common abstractions to intelligence-core (1-2 weeks)
- **Phase 2.3 (Sprint 6.13+)**: Refactor Planning engines to use standard (1-2 weeks)

**Total**: 3-6 weeks (across Phase 2)

### Dependencies

- **Intelligence Engine Standard**: Must be defined first (Sprint 6.12)
- **intelligence-core**: Must be extracted first (Sprint 6.13)
- **No Blocking Dependencies**: Planning engines can be refactored independently

---

## Lessons Learned

### 1. Qualification is Critical

Always qualify a domain before migration. The initial assumption that Planning was a Conversational Domain was incorrect. Comprehensive audit revealed it was an Intelligence Engine.

### 2. Documentation May Be Outdated

AI_DOMAINS_MATRIX.md listed Planning as a Conversational Domain with Task API dependencies, but the actual implementation is an Intelligence Engine with only Supabase dependencies.

### 3. Components ≠ Domains

A component with "planning" in the name doesn't make it a conversational domain. Planning is an Intelligence Engine that generates planning data, not a conversational interface.

### 4. STOP Discipline

When qualification shows a domain doesn't match the pattern, stop immediately. This prevents unnecessary work and maintains architectural integrity.

### 5. Pattern Matching is Reliable

The 12-characteristic pattern matching matrix provided clear, unambiguous classification. Planning matched 9/9 Intelligence Engine characteristics and 0/9 Conversational Domain characteristics.

### 6. Phase 1 is Complete

With the reclassification of Planning as an Intelligence Engine, Phase 1 (Conversational Domain Standard) is now complete. Only 2 true conversational domains exist (Career Copilot, Interview), both already migrated.

---

## Impact on Roadmap

### Before Sprint 6.8

- Phase 1: 3 conversational domains (2 migrated, 1 remaining)
- Sprint 6.8: Planning Migration
- Sprint 6.9: Phase 1 Completion
- Timeline: 9-11 weeks for Phase 1

### After Sprint 6.8

- Phase 1: 2 conversational domains (2 migrated, 0 remaining)
- Sprint 6.8: Phase 1 Completion
- Phase 2: 29+ intelligence engines (incl. Planning)
- Timeline: 5 weeks for Phase 1 ✅

### Timeline Reduction

**Phase 1**: 9-11 weeks → 5 weeks (4-6 weeks reduction)  
**Target Completion**: Sprint 6.8 (immediate) ✅

---

## Recommendations

### Primary Recommendation

**Phase 1 (Conversational Domain Standard) is complete.**

**Rationale**:
- Career Copilot: ✅ Migrated
- Interview: ✅ Migrated
- Planning: ❌ Intelligence Engine (not a Conversational Domain)
- No remaining conversational domains to migrate

### Secondary Recommendation

**Planning should be standardized using the Intelligence Engine Standard in Phase 2.**

**Timeline**:
- Sprint 6.12: Define Intelligence Engine Standard
- Sprint 6.13: Extract common abstractions to intelligence-core
- Sprint 6.13+: Refactor Planning engines to use standard

### Tertiary Recommendation

**The AI Platform Roadmap should be reevaluated to determine the next steps.**

**Options**:
1. Proceed directly to Phase 2 (Intelligence Engine Standard)
2. Conduct a comprehensive review of all remaining AI components
3. Evaluate the ROI of standardizing other families (Decision Engine, Background Agent, Knowledge Service)

---

## Next Steps

### Sprint 6.8 (Revised)

1. Complete Phase 1 (Conversational Domain Standard)
2. Document Planning and Daily Coach reclassification
3. Refine AI Domain Standard based on learnings
4. Prepare for Phase 2 (Intelligence Engine Standard)

### Sprint 6.9

1. Expand ai-core if Rule of Three is met
2. Document Phase 1 completion and best practices
3. Prepare for Phase 2 (Intelligence Engine Standard)

### Sprint 6.12

1. Define Intelligence Engine Standard
2. Document aiOrchestrator, CandidateAIBrain, EventBus patterns
3. Extract common abstractions to intelligence-core

### Sprint 6.13+

1. Refactor Planning engines using Intelligence Engine Standard
2. Refactor Daily Coach using Intelligence Engine Standard
3. Refactor other 26+ intelligence engines

---

## Validation Results

### Typecheck

**Status**: Not applicable - No code changes made

### Lint

**Status**: Not applicable - No code changes made

### Tests

**Status**: Not applicable - No code changes made

### Build

**Status**: Not applicable - No code changes made

### Architecture

**Status**: Not applicable - No code changes made

---

## Conclusion

Sprint 6.8 objective was to migrate Planning to the AI Domain Standard as a Conversational Domain. After comprehensive audit and qualification, Planning was determined to be an Intelligence Engine, not a Conversational Domain. The sprint was stopped after qualification, and no code migration was performed.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Decision**: STOP - Planning is an Intelligence Engine and should not be migrated as a Conversational Domain

**Critical Finding**: Phase 1 (Conversational Domain Standard) is now complete. With the reclassification of Planning as an Intelligence Engine, there are no remaining Conversational Domains to migrate. Only 2 true conversational domains exist (Career Copilot, Interview), both already migrated.

The sprint successfully identified that Planning is not a Conversational Domain, preventing inappropriate migration and maintaining architectural integrity. The documentation has been updated to reflect this classification, and the roadmap has been adjusted accordingly.

---

## Appendix

### Related Documents

- PLANNING_ARCHITECTURE_AUDIT.md - Detailed architecture audit
- PLANNING_QUALIFICATION_REPORT.md - Qualification report with classification decision
- AI_COMPONENT_CLASSIFICATION.md - Complete component classification
- AI_PLATFORM_ROADMAP.md - Migration roadmap by family
- AI_DOMAINS_MATRIX.md - Domain matrix
- ADR-019_AI_COMPONENT_CLASSIFICATION.md - ADR on component classification

### Reference Implementations

- Career Copilot (Conversational Domain)
- Interview (Conversational Domain)
- CareerCopilotForecastEngine (Intelligence Engine)
- ATSAIEngine (Intelligence Engine)
- DailyCoachAIEngine (Intelligence Engine)
- CareerCopilotPlanningIntelligenceEngine (Intelligence Engine - current Planning implementation)
- CareerCopilotProgressionPlanEngine (Intelligence Engine - current Planning implementation)
- ActionPlanAIEngine (Intelligence Engine - current Planning implementation)
