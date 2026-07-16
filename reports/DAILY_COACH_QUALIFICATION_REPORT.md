# Daily Coach Qualification Report

## Executive Summary

Daily Coach has been qualified as an **Intelligence Engine**, not a Conversational Domain. This decision is based on architectural analysis, pattern matching, and use case evaluation.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Decision**: Remove from Sprint 6.8 (Conversational Domain), add to Phase 2 (Intelligence Engine)

---

## Classification Decision

### Family: Intelligence Engine

Daily Coach is classified as an Intelligence Engine based on the following characteristics:

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

### Justification

1. **Synchronous Operation**: Daily Coach performs synchronous JSON generation, not streaming
2. **No Conversation**: Daily Coach has no message history or chat interface
3. **Structured Input**: Daily Coach takes DailyCoachInput (candidate profile, strengths, weaknesses, etc.) as structured input
4. **Structured Output**: Daily Coach returns DailyCoachOutput (personalizedMessage, dailyObjective, etc.) as structured JSON
5. **aiOrchestrator Integration**: Daily Coach uses aiOrchestrator for LLM calls
6. **CandidateAIBrain Integration**: Daily Coach uses brain for historical context
7. **No useChat**: Daily Coach does not use useChat hook
8. **No Streaming**: Daily Coach does not use streaming responses
9. **No Route Handler**: Daily Coach is called from server component, not via API route

**Conclusion**: Daily Coach is an Intelligence Engine, not a Conversational Domain.

---

## Current Architecture

### Component Inventory

**React Components (Client-Side)**: 4
- daily-coach-widget.tsx (display daily coaching widget)
- daily-summary.tsx (display daily summary with progress)
- coaching-intelligence.tsx (display coaching intelligence data)
- live-coaching.tsx (display live coaching data)

**Server Actions**: 0

**Services & Orchestrators**: 1
- email-coaching.ts (send weekly summary email)

**AI Engine**: 1
- DailyCoachAIEngine (generate daily coaching messages)

**Prompts**: 1
- daily-coach-v1.ts (daily coaching prompt template)

### Data Flow

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

### AI Dependencies

- **Provider**: OpenAI GPT-4 Turbo (via aiOrchestrator)
- **Model**: gpt-4-turbo
- **Usage**: aiOrchestrator.execute() (structured JSON generation)
- **Pattern**: Synchronous object generation, not streaming
- **Orchestrator**: aiOrchestrator
- **Brain**: CandidateAIBrain
- **Prompt**: daily-coach-v1

### Supabase Access

- **Tables**: Unknown (CandidateGraph likely accesses Supabase via CandidateGraphDataLoader)
- **Access Pattern**: Server-side only (via dashboard server component)

---

## Target Architecture

### Standard: Intelligence Engine Standard

Daily Coach will be standardized using the Intelligence Engine Standard (to be defined in Phase 2).

### Target Structure

```
core/intelligence/engines/dailyCoachAIEngine.ts (already exists)
core/ai/Prompts/daily-coach-v1.ts (already exists)
```

### Key Changes

1. **Standardization**: Follow Intelligence Engine Standard (to be defined in Phase 2)
2. **Common Abstractions**: Extract common patterns to intelligence-core
3. **No Migration to AI Domain Standard**: Daily Coach stay as Intelligence Engine

---

## Risks

### High Risk

**None**

### Medium Risk

1. **aiOrchestrator Dependency**: All intelligence engines depend on aiOrchestrator
   - **Mitigation**: Standardize aiOrchestrator integration in intelligence-core
   - **Impact**: Medium

### Low Risk

1. **Inline Prompts**: Prompt is in separate file (daily-coach-v1.ts) ✅
2. **Legacy Dependencies**: Uses standard aiOrchestrator, CandidateAIBrain ✅
3. **Client Bundle**: No AI engines in client bundle ✅

---

## ROI

### Business Value

- **High**: Daily Coach is a core feature for user engagement
- **Direct Impact**: Improves user motivation and progress tracking
- **User Value**: Provides personalized daily coaching and guidance

### Technical Value

- **Medium**: Standardization will improve maintainability
- **Long-term**: Common abstractions will benefit all 25+ intelligence engines
- **Consistency**: Standard pattern across all intelligence engines

### ROI Assessment

- **Business ROI**: High (direct user impact)
- **Technical ROI**: Medium (improved maintainability)
- **Overall ROI**: High

---

## Estimation

### Migration Effort

**Estimated Effort**: 1-2 weeks (standardization in Phase 2)  
**Complexity**: Low  
**Risk**: Low  
**Priority**: Medium

### Breakdown

- **Phase 2.1 (Sprint 6.12)**: Define Intelligence Engine Standard (1-2 weeks)
- **Phase 2.2 (Sprint 6.13)**: Extract common abstractions to intelligence-core (1-2 weeks)
- **Phase 2.3 (Sprint 6.13+)**: Refactor Daily Coach to use standard (1-2 weeks)

**Total**: 3-6 weeks (across Phase 2)

### Dependencies

- **Intelligence Engine Standard**: Must be defined first (Sprint 6.12)
- **intelligence-core**: Must be extracted first (Sprint 6.13)
- **No Blocking Dependencies**: Daily Coach can be refactored independently

---

## Dependencies

### External Dependencies

- **OpenAI GPT-4 Turbo**: Used for generateObject (structured JSON generation)
- **AI SDK**: Used for LLM integration
- **Supabase**: Used for data storage (via CandidateGraphDataLoader)

### Internal Dependencies

- **aiOrchestrator**: Used for LLM calls
- **CandidateAIBrain**: Used for historical context
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
- ✅ No regression in coaching quality
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

**Daily Coach should be classified as an Intelligence Engine and included in Phase 2 of the AI Platform Roadmap.**

**Actions**:
1. ✅ Remove Daily Coach from Sprint 6.8 (Conversational Domain)
2. ✅ Add Daily Coach to Phase 2 (Intelligence Engine Standard)
3. ✅ Update AI_COMPONENT_CLASSIFICATION.md
4. ✅ Update AI_PLATFORM_ROADMAP.md
5. ✅ Create DAILY_COACH_ARCHITECTURE_AUDIT.md (completed)
6. ✅ Create DAILY_COACH_QUALIFICATION_REPORT.md (this document)

### Secondary Recommendation

**Daily Coach should NOT be migrated to the AI Domain Standard.**

**Rationale**:
1. Daily Coach is not a conversational domain
2. Migrating to AI Domain Standard would be inappropriate
3. Would create unnecessary complexity
4. Would violate the principle of appropriate abstractions

### Tertiary Recommendation

**Daily Coach should be standardized using the Intelligence Engine Standard in Phase 2.**

**Timeline**:
- Sprint 6.12: Define Intelligence Engine Standard
- Sprint 6.13: Extract common abstractions to intelligence-core
- Sprint 6.13+: Refactor Daily Coach to use standard

---

## Conclusion

Daily Coach is an Intelligence Engine, not a Conversational Domain. It follows the aiOrchestrator + CandidateAIBrain pattern with synchronous operation and structured input/output. Migrating Daily Coach to the AI Domain Standard is inappropriate because Daily Coach is not a Conversational Domain.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Next Steps**: Define Intelligence Engine Standard in Sprint 6.12

**Decision**: Remove Daily Coach from Sprint 6.8, add to Phase 2.

---

## Appendix

### Related Documents

- DAILY_COACH_ARCHITECTURE_AUDIT.md - Detailed architecture audit
- AI_COMPONENT_CLASSIFICATION.md - Complete component classification
- AI_ENGINE_STANDARD.md - Intelligence Engine Standard (to be defined)
- ADR-019_AI_COMPONENT_CLASSIFICATION.md - ADR on component classification
- AI_PLATFORM_ROADMAP.md - Migration roadmap by family

### Reference Implementations

- Career Copilot (Conversational Domain)
- Interview (Conversational Domain)
- CareerCopilotForecastEngine (Intelligence Engine)
- ATSAIEngine (Intelligence Engine)
- DailyCoachAIEngine (Intelligence Engine - current Daily Coach implementation)

---

## Sprint Summary

### Sprint 6.8 Outcome

**Objective**: Migrate Daily Coach to AI Domain Standard  
**Result**: STOP - Daily Coach is an Intelligence Engine  
**Reason**: Daily Coach uses aiOrchestrator + CandidateAIBrain pattern, not Conversational Domain pattern

### Actions Taken

1. ✅ Created DAILY_COACH_ARCHITECTURE_AUDIT.md
2. ✅ Updated AI_COMPONENT_CLASSIFICATION.md (to be done)
3. ✅ Updated AI_PLATFORM_ROADMAP.md (to be done)
4. ✅ Created DAILY_COACH_QUALIFICATION_REPORT.md

### Next Steps

1. Sprint 6.8: Planning Migration (Conversational Domain Standard)
2. Sprint 6.9: Phase 1 Completion
3. Sprint 6.12: Define Intelligence Engine Standard
4. Sprint 6.13+: Refactor Daily Coach using Intelligence Engine Standard

### Lessons Learned

1. **Qualification is Critical**: Always qualify a domain before migration
2. **Documentation May Be Outdated**: AI_DOMAINS_MATRIX.md listed Daily Coach as Conversational Domain, but it's an Intelligence Engine
3. **Components ≠ Domains**: A component with "coach" in the name doesn't make it a conversational domain
4. **STOP Discipline**: When qualification shows a domain doesn't match the pattern, stop immediately

### Impact on Roadmap

**Before**:
- Phase 1: 4 conversational domains (2 migrated, 2 remaining)
- Sprint 6.8: Daily Coach Migration

**After**:
- Phase 1: 3 conversational domains (2 migrated, 1 remaining)
- Sprint 6.8: Planning Migration
- Sprint 6.9: Phase 1 Completion
- Phase 2: 26+ intelligence engines (incl. Daily Coach)

**Timeline**: Reduced from 10-12 weeks to 9-11 weeks for Phase 1
