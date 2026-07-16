# ATS Qualification Report

## Executive Summary

ATS (Applicant Tracking System) has been qualified as an **Intelligence Engine**, not a Conversational Domain. This decision is based on architectural analysis, pattern matching, and use case evaluation.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined in Phase 2)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Decision**: Remove from Sprint 6.8 (Conversational Domain), add to Phase 2 (Intelligence Engine)

---

## Classification Decision

### Family: Intelligence Engine

ATS is classified as an Intelligence Engine based on the following characteristics:

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

**Pattern Match**: 9/9 characteristics match Intelligence Engine pattern  
**Pattern Mismatch**: 0/9 characteristics match Conversational Domain pattern

### Justification

1. **Synchronous Operation**: ATS performs synchronous analysis, not streaming
2. **No Conversation**: ATS has no message history or chat interface
3. **Structured Input**: ATS takes CV text + job description as structured input
4. **Structured Output**: ATS returns score + matched/missing skills + feedback as structured JSON
5. **aiOrchestrator Integration**: ATS uses aiOrchestrator for LLM calls
6. **CandidateAIBrain Integration**: ATS uses brain for historical context
7. **EventBus Integration**: ATS publishes events for system-wide communication
8. **No useChat**: ATS does not use useChat hook
9. **No Streaming**: ATS does not use streaming responses

**Conclusion**: ATS is an Intelligence Engine, not a Conversational Domain.

---

## Current Architecture

### Component Inventory

**React Components (Client-Side)**: 6
- ats-analysis-animation.tsx (animation)
- ats-report-premium.tsx (results display)
- cv-upload-premium.tsx (upload interface)
- priority-matrix.tsx (visualization)
- quick-wins.tsx (quick wins display)
- client.tsx (main UI)

**Server Actions**: 1
- runATSAnalysis (trigger analysis)

**Services & Orchestrators**: 5
- ATSService (analysis service)
- processATSAnalysis (orchestrator)
- processPremiumATSAnalysis (premium orchestrator)
- calculateATSScore (heuristic scoring)
- calculateHeuristicScore (heuristic scoring)

**AI Engine**: 1
- ATSAIEngine (intelligence engine)

**Sub-modules**: 8
- behavioral-logic, contracts, enrichment, extraction, normalization, recruiter-signals, schemas, scoring

### Data Flow

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

### AI Dependencies

- **Provider**: Mistral (via AI SDK)
- **Model**: mistralSmallModel, mistralModel
- **Usage**: generateObject (structured JSON generation)
- **Pattern**: Synchronous object generation, not streaming
- **Orchestrator**: aiOrchestrator
- **Brain**: CandidateAIBrain
- **Events**: EventBus

### Supabase Access

- **Tables**: cvs, ats_reports, subscriptions
- **Access Pattern**: Server-side only (via createServerClient)
- **No Direct Client Access**: All Supabase access is server-side

---

## Target Architecture

### Standard: Intelligence Engine Standard

ATS will be standardized using the Intelligence Engine Standard (to be defined in Phase 2).

### Target Structure

```
lib/ats/
  domain/
    contracts/
      ats.dto.ts
      ats.errors.ts
      ats.events.ts
    ports/
      ats-context-builder.port.ts
      ats-engine.port.ts
  application/
    use-cases/
      ats-analysis.use-case.ts
  infrastructure/
    adapters/
      mistral-ats.provider.ts
    builders/
      supabase-ats-context.builder.ts
    engines/
      ats.engine.ts
  composition/
    ats.factory.ts
  tests/
    unit/
    integration/
```

### Key Changes

1. **Clean Architecture**: Separate domain, application, infrastructure layers
2. **Port Pattern**: Define ports for context builder and engine
3. **Factory Pattern**: Use factory for dependency injection
4. **Server-Only Protection**: Ensure all files have "server-only"
5. **Common Abstractions**: Extract common patterns to intelligence-core

---

## Risks

### High Risk

**None**

### Medium Risk

1. **aiOrchestrator Dependency**: All intelligence engines depend on aiOrchestrator
   - **Mitigation**: Standardize aiOrchestrator integration in intelligence-core
   - **Impact**: Medium

2. **Complexity**: ATS has 8 sub-modules with different responsibilities
   - **Mitigation**: Incremental refactoring, one module at a time
   - **Impact**: Medium

### Low Risk

1. **Inline Prompts**: Prompts are inline, not in separate files
   - **Mitigation**: Extract prompts to separate files during refactoring
   - **Impact**: Low

2. **Legacy Dependencies**: Uses legacy aiOrchestrator, CandidateAIBrain, EventBus
   - **Mitigation**: These are the standard patterns for intelligence engines
   - **Impact**: Low

---

## ROI

### Business Value

- **High**: ATS is a core feature for premium users
- **Direct Impact**: Improves CV optimization and job matching
- **User Value**: Helps users optimize their CVs for specific job offers

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

**Estimated Effort**: 2-3 weeks  
**Complexity**: High  
**Risk**: Medium  
**Priority**: Medium

### Breakdown

- **Phase 2.1 (Sprint 6.12)**: Define Intelligence Engine Standard (1-2 weeks)
- **Phase 2.2 (Sprint 6.13)**: Extract common abstractions to intelligence-core (1-2 weeks)
- **Phase 2.3 (Sprint 6.13+)**: Refactor ATS to use standard (1-2 weeks)

**Total**: 3-6 weeks (across Phase 2)

### Dependencies

- **Intelligence Engine Standard**: Must be defined first (Sprint 6.12)
- **intelligence-core**: Must be extracted first (Sprint 6.13)
- **No Blocking Dependencies**: ATS can be refactored independently

---

## Dependencies

### External Dependencies

- **Mistral LLM**: Used for generateObject (structured JSON generation)
- **AI SDK**: Used for LLM integration
- **Supabase**: Used for data storage (cvs, ats_reports, subscriptions)

### Internal Dependencies

- **aiOrchestrator**: Used for LLM calls
- **CandidateAIBrain**: Used for historical context
- **EventBus**: Used for event publishing
- **GetSubscriptionQuery**: Used for subscription verification

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
- ✅ No forbidden imports in UI
- ✅ Clean architecture (domain, application, infrastructure layers)
- ✅ Port pattern implemented
- ✅ Factory pattern implemented

### Business Criteria

- ✅ No functional changes
- ✅ No regression in ATS analysis quality
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

**ATS should be classified as an Intelligence Engine and included in Phase 2 of the AI Platform Roadmap.**

**Actions**:
1. ✅ Remove ATS from Sprint 6.8 (Conversational Domain)
2. ✅ Add ATS to Phase 2 (Intelligence Engine Standard)
3. ✅ Update AI_COMPONENT_CLASSIFICATION.md
4. ✅ Update AI_PLATFORM_ROADMAP.md
5. ✅ Create ATS_ARCHITECTURE_AUDIT.md (completed)
6. ✅ Create ATS_QUALIFICATION_REPORT.md (this document)

### Secondary Recommendation

**ATS should NOT be migrated to the AI Domain Standard.**

**Rationale**:
1. ATS is not a conversational domain
2. Migrating to AI Domain Standard would be inappropriate
3. Would create unnecessary complexity
4. Would violate the principle of appropriate abstractions

### Tertiary Recommendation

**ATS should be refactored using the Intelligence Engine Standard in Phase 2.**

**Timeline**:
- Sprint 6.12: Define Intelligence Engine Standard
- Sprint 6.13: Extract common abstractions to intelligence-core
- Sprint 6.13+: Refactor ATS to use standard

---

## Conclusion

ATS is an Intelligence Engine, not a Conversational Domain. It follows the aiOrchestrator + CandidateAIBrain + EventBus pattern, with synchronous operation and structured input/output. Migrating ATS to the AI Domain Standard would be inappropriate and create unnecessary complexity.

**Classification**: Intelligence Engine  
**Standard**: Intelligence Engine Standard (to be defined)  
**Migration Phase**: Phase 2 (Sprint 6.12-6.14+)  
**Current Status**: Appropriate architecture, no urgent migration needed  
**Next Steps**: Define Intelligence Engine Standard in Sprint 6.12

**Decision**: Remove ATS from Sprint 6.8, add to Phase 2.

---

## Appendix

### Related Documents

- ATS_ARCHITECTURE_AUDIT.md - Detailed architecture audit
- AI_COMPONENT_CLASSIFICATION.md - Complete component classification
- AI_ENGINE_STANDARD.md - Intelligence Engine Standard (to be defined)
- ADR-019_AI_COMPONENT_CLASSIFICATION.md - ADR on component classification
- AI_PLATFORM_ROADMAP.md - Migration roadmap by family

### Reference Implementations

- Career Copilot (Conversational Domain)
- Interview (Conversational Domain)
- CareerCopilotForecastEngine (Intelligence Engine)
- ATSAIEngine (Intelligence Engine - current ATS implementation)
