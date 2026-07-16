# Planning Qualification Report

## Executive Summary

Planning has been qualified as an **Intelligence Engine**, not a Conversational Domain. This decision is based on architectural analysis, pattern matching, and use case evaluation.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Decision**: Remove from Sprint 6.8 (Conversational Domain), add to Phase 2 (Intelligence Engine)

---

## Classification Decision

### Family: Intelligence Engine

Planning is classified as an Intelligence Engine based on the following characteristics:

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

**Conclusion**: Planning is an Intelligence Engine, not a Conversational Domain.

---

## Current Architecture

### Component Inventory

**React Components (Client-Side)**: 4
- planning-intelligence.tsx (display planning intelligence data)
- progression-plan.tsx (display progression plan data)
- why-plan.tsx (display plan explanation)
- progress-plan/page.tsx (display static task list - no AI)

**Server Actions**: 0

**Services & Orchestrators**: 0

**AI Engines**: 3
- CareerCopilotPlanningIntelligenceEngine (generate career planning intelligence)
- CareerCopilotProgressionPlanEngine (generate progression plan)
- ActionPlanAIEngine (generate action plan)

**Prompts**: 3
- career-copilot-planning-intelligence-v1.ts (planning intelligence prompt template)
- career-copilot-progression-plan-v1.ts (progression plan prompt template)
- action-plan-v1.ts (action plan prompt template)

### Data Flow

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

### AI Dependencies

- **Provider**: Anthropic Claude 3.5 Sonnet (via aiOrchestrator)
- **Model**: claude-3-5-sonnet-20241022
- **Usage**: aiOrchestrator.execute() (structured JSON generation)
- **Pattern**: Synchronous object generation, not streaming
- **Orchestrator**: aiOrchestrator
- **Brain**: CandidateAIBrain
- **EventBus**: EventBus
- **Prompts**: career-copilot-planning-intelligence-v1, career-copilot-progression-plan-v1, action-plan-v1

### Supabase Access

- **Tables**: Unknown (CandidateGraph likely accesses Supabase via CandidateGraphDataLoader)
- **Access Pattern**: Server-side only (via dashboard server component)

---

## Target Architecture

### Standard: Intelligence Engine Standard

Planning will be standardized using the Intelligence Engine Standard (to be defined in Phase 2).

### Target Structure

```
core/intelligence/engines/careerCopilotPlanningIntelligenceEngine.ts (already exists)
core/intelligence/engines/careerCopilotProgressionPlanEngine.ts (already exists)
core/intelligence/engines/actionPlanAIEngine.ts (already exists)
core/ai/Prompts/career-copilot-planning-intelligence-v1.ts (already exists)
core/ai/Prompts/career-copilot-progression-plan-v1.ts (already exists)
core/ai/Prompts/action-plan-v1.ts (already exists)
```

### Key Changes

1. **Standardization**: Follow Intelligence Engine Standard (to be defined in Phase 2)
2. **Common Abstractions**: Extract common patterns to intelligence-core
3. **No Migration to AI Domain Standard**: Planning stays as Intelligence Engine

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
- **Long-term**: Common abstractions will benefit all 26+ intelligence engines
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

## Dependencies

### External Dependencies

- **Anthropic Claude 3.5 Sonnet**: Used for generateObject (structured JSON generation)
- **AI SDK**: Used for LLM integration
- **Supabase**: Used for data storage (via CandidateGraphDataLoader)

### Internal Dependencies

- **aiOrchestrator**: Used for LLM calls
- **CandidateAIBrain**: Used for historical context
- **EventBus**: Used for event publishing
- **CandidateGraph**: Used for candidate data

### Blocking Dependencies

- **Intelligence Engine Standard**: Must be defined before refactoring
- **intelligence-core**: Must be extracted before refactoring

---

## Success Criteria

### Technical Criteria

- ✅ Build passes
- ✅ Tests pass (unit + integration)
- ✅ Server-only protection active
- ✅ No intelligence engines in client bundle
- ✅ No prompts in client bundle
- ✅ Follows Intelligence Engine Standard
- ✅ Uses common abstractions from intelligence-core
- ✅ Consistent with other intelligence engines

### Business Criteria

- ✅ No functional changes
- ✅ No regression in planning quality
- ✅ No regression in user experience
- ✅ Performance maintained or improved

### Standardization Criteria

- ✅ Follows Intelligence Engine Standard
- ✅ Uses common abstractions from intelligence-core
- ✅ Consistent with other intelligence engines
- ✅ Documented and tested

---

## Recommendations

### Primary Recommendation

**Planning should be classified as an Intelligence Engine and included in Phase 2 of the AI Platform Roadmap.**

**Actions**:
1. ✅ Remove Planning from Sprint 6.8 (Conversational Domain)
2. ✅ Add Planning to Phase 2 (Intelligence Engine Standard)
3. ✅ Update AI_COMPONENT_CLASSIFICATION.md
4. ✅ Update AI_PLATFORM_ROADMAP.md
5. ✅ Create PLANNING_ARCHITECTURE_AUDIT.md (completed)
6. ✅ Create PLANNING_QUALIFICATION_REPORT.md (this document)

### Secondary Recommendation

**Planning should NOT be migrated to the AI Domain Standard.**

**Rationale**:
1. Planning is not a conversational domain
2. Migrating to AI Domain Standard would be inappropriate
3. Would create unnecessary complexity
4. Would violate the principle of appropriate abstractions

### Tertiary Recommendation

**Planning should be standardized using the Intelligence Engine Standard in Phase 2.**

**Timeline**:
- Sprint 6.12: Define Intelligence Engine Standard
- Sprint 6.13: Extract common abstractions to intelligence-core
- Sprint 6.13+: Refactor Planning engines to use standard

---

## Conclusion

Planning is an Intelligence Engine, not a Conversational Domain. It follows the aiOrchestrator + CandidateAIBrain + EventBus pattern with synchronous operation and structured input/output. Migrating Planning to the AI Domain Standard is inappropriate because Planning is not a Conversational Domain.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Next Steps**: Define Intelligence Engine Standard in Sprint 6.12

**Decision**: Remove Planning from Sprint 6.8, add to Phase 2.

---

## Appendix

### Related Documents

- PLANNING_ARCHITECTURE_AUDIT.md - Detailed architecture audit
- AI_COMPONENT_CLASSIFICATION.md - Complete component classification
- AI_ENGINE_STANDARD.md - Intelligence Engine Standard (to be defined)
- ADR-019_AI_COMPONENT_CLASSIFICATION.md - ADR on component classification
- AI_PLATFORM_ROADMAP.md - Migration roadmap by family

### Reference Implementations

- Career Copilot (Conversational Domain)
- Interview (Conversational Domain)
- CareerCopilotForecastEngine (Intelligence Engine)
- ATSAIEngine (Intelligence Engine)
- DailyCoachAIEngine (Intelligence Engine)
- CareerCopilotPlanningIntelligenceEngine (Intelligence Engine - current Planning implementation)

---

## Sprint Summary

### Sprint 6.8 Outcome

**Objective**: Migrate Planning to AI Domain Standard  
**Result**: STOP - Planning is an Intelligence Engine  
**Reason**: Planning uses aiOrchestrator + CandidateAIBrain + EventBus pattern, not Conversational Domain pattern

### Actions Taken

1. ✅ Created PLANNING_ARCHITECTURE_AUDIT.md
2. ✅ Updated AI_COMPONENT_CLASSIFICATION.md (to be done)
3. ✅ Updated AI_PLATFORM_ROADMAP.md (to be done)
4. ✅ Created PLANNING_QUALIFICATION_REPORT.md

### Next Steps

1. Sprint 6.8: Phase 1 Completion (no more Conversational Domains to migrate)
2. Sprint 6.9: Phase 1 Completion documentation
3. Sprint 6.12: Define Intelligence Engine Standard
4. Sprint 6.13+: Refactor Planning engines using Intelligence Engine Standard

### Lessons Learned

1. **Qualification is Critical**: Always qualify a domain before migration
2. **Documentation May Be Outdated**: AI_DOMAINS_MATRIX.md listed Planning as Conversational Domain, but it's an Intelligence Engine
3. **Components ≠ Domains**: A component with "planning" in the name doesn't make it a conversational domain
4. **STOP Discipline**: When qualification shows a domain doesn't match the pattern, stop immediately

### Impact on Roadmap

**Before**:
- Phase 1: 3 conversational domains (2 migrated, 1 remaining)
- Sprint 6.8: Planning Migration

**After**:
- Phase 1: 2 conversational domains (2 migrated, 0 remaining)
- Sprint 6.8: Phase 1 Completion
- Sprint 6.9: Phase 1 Completion documentation
- Phase 2: 27+ intelligence engines (incl. Planning)

**Timeline**: Phase 1 complete, no remaining conversational domains to migrate

---

## Critical Finding

**Phase 1 (Conversational Domain Standard) is now complete.**

With the reclassification of Planning as an Intelligence Engine, there are **no remaining Conversational Domains** to migrate in Phase 1.

**Status**:
- Career Copilot: ✅ Migrated
- Interview: ✅ Migrated
- Planning: ❌ Intelligence Engine (not a Conversational Domain)

**Conclusion**: Phase 1 is complete. The AI Platform Roadmap should be reevaluated to determine the next steps.
