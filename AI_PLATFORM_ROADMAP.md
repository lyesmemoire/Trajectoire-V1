# AI Platform Roadmap

## Overview

This roadmap outlines the migration and standardization strategy for all AI components in Trajectoire, organized by family (Conversational Domain, Intelligence Engine, Decision Engine, Background Agent, Knowledge Service).

**Current Status**: Phase 1 Complete ✅ | Phase 2 Ready  
**Reference Implementations**: Career Copilot, Interview (Conversational Domains)  

**Classification**: See AI_COMPONENT_CLASSIFICATION.md for complete component classification by family.  

---

## Migration Strategy

### Principles

1. **Family-Based Migration**: Migrate components by family (Conversational Domain → Intelligence Engine → Decision Engine)
2. **High ROI First**: Prioritize components with high business value and medium complexity
3. **Rule of Three**: Only extract common abstractions when used in 3+ components
4. **Incremental**: Migrate one component per sprint to maintain quality
5. **Learn and Adapt**: Use learnings from each migration to improve the process

### Migration Process

For each component:

1. **Audit** (1 day): Analyze current architecture, dependencies, and complexity
2. **Design** (1 day): Plan new architecture, identify ports and use cases
3. **Implement** (3-5 days): Implement new architecture using template
4. **Test** (2 days): Write unit and integration tests
5. **Validate** (1 day): Verify bundle size, architecture, and build
6. **Deploy** (1 day): Deploy to production and monitor

**Total per component**: 8-10 days (1 sprint)

---

## Sprint Roadmap by Family

### Phase 1: Conversational Domain Standard (Sprint 6.8)

**Standard**: AI Domain Standard  
**Components**: 2 (2 migrated, 0 remaining)  
**Progress**: 2/2 (100%) ✅

**Note**: ATS has been reclassified as an Intelligence Engine (see ADR-019). Learning is not an independent AI domain (it is a Digital Twin feature). Daily Coach is an Intelligence Engine, not a Conversational Domain. Planning is an Intelligence Engine, not a Conversational Domain.

**Status**: Phase 1 Complete ✅

---

### Sprint 6.9: Phase 1 Completion & Phase 2 Preparation

**Priority**: High  
**Effort**: 1 week  
**Risk**: Low  
**ROI**: High  

**Dependencies**: None  

**Objectives**:
- Complete Phase 1 audit and documentation
- Validate AI Domain Standard through retrospective
- Inventory all 29+ Intelligence Engines
- Cluster Intelligence Engines by functionality
- Identify common abstractions
- Define Intelligence Engine Standard V1
- Create ADR for Intelligence Engine Standard
- Update roadmap for Phase 2

**Deliverables**:
- PHASE1_COMPLETION_AUDIT.md
- AI_DOMAIN_STANDARD_RETROSPECTIVE.md
- INTELLIGENCE_ENGINE_INVENTORY.md
- INTELLIGENCE_ENGINE_CLUSTERING.md
- INTELLIGENCE_ENGINE_ABSTRACTIONS.md
- INTELLIGENCE_ENGINE_STANDARD_V1.md
- ADR-020_INTELLIGENCE_ENGINE_STANDARD.md
- Updated AI_PLATFORM_ROADMAP.md

**Success Criteria**:
- ✅ Phase 1 audit complete
- ✅ AI Domain Standard validated
- ✅ 29+ Intelligence Engines inventoried
- ✅ Intelligence Engines clustered
- ✅ Common abstractions identified
- ✅ Intelligence Engine Standard V1 defined
- ✅ ADR-020 created
- ✅ Roadmap updated for Phase 2

---

### Phase 2: Intelligence Engine Standard (Sprint 6.10-6.12+)

**Standard**: Intelligence Engine Standard V1 ✅  
**Components**: 29+ intelligence engines (incl. Daily Coach, Planning)  
**Progress**: 0/29+ (0%)

**Note**: Intelligence engines use aiOrchestrator + CandidateAIBrain + EventBus pattern. Standard defined in Sprint 6.9.

#### Sprint 6.10: intelligence-core Module Creation

**Priority**: High  
**Effort**: 1-2 weeks  
**Risk**: Low  
**ROI**: High  

**Objectives**:
- Create intelligence-core module
- Implement BaseIntelligenceEngine
- Implement ContextBuilder
- Implement DependencyManager
- Implement EventPublisher
- Implement PromptExecutor
- Implement PromptBuilder
- Implement OutputValidator
- Implement EngineRegistry

**Deliverables**:
- intelligence-core module
- Unit tests for all abstractions
- Integration tests
- Documentation

**Success Criteria**:
- ✅ intelligence-core module created
- ✅ All abstractions implemented
- ✅ Tests pass
- ✅ Documentation complete

---

#### Sprint 6.11: High Dependency Clusters Migration

**Priority**: High  
**Effort**: 2-3 weeks  
**Risk**: Medium  
**ROI**: High

**Objectives**:
- Migrate Planning Intelligence (18 dependencies)
- Migrate Goal & Execution (14 dependencies)
- Migrate Scenario & Digital Twin (14 dependencies)
- Migrate Career Analysis (12 dependencies)
- Migrate Application & Opportunity (10 dependencies)

**Deliverables**:
- 5 clusters migrated to Intelligence Engine Standard
- Updated tests
- Updated documentation

**Success Criteria**:
- ✅ 5 clusters migrated
- ✅ Tests pass
- ✅ No regressions

#### Sprint 6.12: Low Dependency Clusters Migration

**Priority**: Medium  
**Effort**: 1-2 weeks  
**Risk**: Low  
**ROI**: Medium

**Objectives**:
- Migrate Decision & Strategy (9-10 dependencies)
- Migrate Constraint & Resource (0-1 dependency)
- Migrate Outcome & Learning (0-3 dependencies)
- Migrate Coaching & Reflection (0-1 dependency)
- Migrate Specialized Analysis (0 dependencies)
- Migrate External Analysis (0 dependencies)

**Deliverables**:
- 6 clusters migrated to Intelligence Engine Standard
- Updated tests
- Updated documentation

**Success Criteria**:
- ✅ 6 clusters migrated
- ✅ Tests pass
- ✅ No regressions

---

### Phase 3: Decision Engine Standard (Sprint 6.13-6.14+)

**Standard**: Decision Engine Standard  
**Components**: 10+ decision engines  
**Progress**: 0/10+ (0%)

**Note**: Decision engines are rule-based, deterministic, no AI/LLM required. Standard defined but not yet applied.

#### Sprint 6.13: Decision Engine Standard Application

**Priority**: Medium  
**Effort**: 2-3 weeks  
**Risk**: Low  
**ROI**: Medium  

**Objectives**:
- Extract common abstractions to decision-core
- Refactor decision engines to use standard
- Add comprehensive tests

**Deliverables**:
- decision-core module
- Refactored decision engines
- Unit tests and integration tests

**Success Criteria**:
- ✅ Common abstractions extracted
- ✅ Engines refactored
- ✅ Tests pass

---

### Phase 4: Background Agent Standard (Sprint 6.14+)

**Standard**: Background Agent Standard (draft)  
**Components**: 3 background agents  
**Progress**: 0/3 (0%)

**Note**: Only 3 agents exist (below Rule of Three). Standard documented but formalization deferred.

#### Sprint 6.14: Background Agent Evaluation

**Priority**: Low  
**Effort**: 1 week  
**Risk**: Low  
**ROI**: Low  

**Objectives**:
- Evaluate if more agents are needed
- Decide on formal standardization

**Deliverables**:
- Evaluation report
- Decision on standardization

**Success Criteria**:
- ✅ Evaluation complete
- ✅ Decision documented

---

### Phase 5: Knowledge Service Standard (Sprint 6.14+)

**Standard**: Knowledge Service Standard (to be defined)  
**Components**: 3 knowledge services  
**Progress**: 0/3 (0%)

**Note**: Only 3 services exist (below Rule of Three). Standard to be defined if more services are created.

#### Sprint 6.14+: Knowledge Service Evaluation

**Priority**: Low  
**Effort**: 1 week  
**Risk**: Low  
**ROI**: Low  

**Objectives**:
- Evaluate if more services are needed
- Decide on standardization

**Deliverables**:
- Evaluation report
- Decision on standardization

**Success Criteria**:
- ✅ Evaluation complete
- ✅ Decision documented

---

## Component Migration Details by Family

### Conversational Domains

#### Planning
**Current State**: Legacy, monolithic  
**Target State**: Clean architecture, server-only  
**Complexity**: Medium  
**Effort**: 1-2 weeks  
**Risk**: Low  

**Key Challenges**:
- Task API integration
- Goal setting logic
- Resource allocation

**Mitigation**:
- Task adapter
- Logic isolation
- Simple allocation

---

### Intelligence Engines

**Note**: 29+ intelligence engines exist. All follow similar pattern (aiOrchestrator + CandidateAIBrain + EventBus). Standard to be defined in Phase 2.

**Key Engines**:
- ATSAIEngine (ATS analysis)
- DailyCoachAIEngine (daily coaching)
- CareerCopilotPlanningIntelligenceEngine (planning intelligence)
- CareerCopilotProgressionPlanEngine (progression plan)
- ActionPlanAIEngine (action plan)
- CareerCopilotForecastEngine (forecast analysis)
- CareerCopilotMarketIntelligenceEngine (market trends)
- CareerCopilotEvidenceIntelligenceEngine (evidence validation)
- CareerCopilotResourceIntelligenceEngine (resource analysis)
- CareerCopilotScenarioIntelligenceEngine (scenario simulation)
- CareerCopilotSuccessIntelligenceEngine (success optimization)
- CareerCopilotConstraintIntelligenceEngine (constraint analysis)
- CareerCopilotOutcomeIntelligenceEngine (outcome prediction)
- CareerCopilotDigitalTwinEngine (digital twin modeling)
- ... and 16+ more

**Common Pattern**:
- Uses aiOrchestrator for LLM calls
- Uses CandidateAIBrain for historical context
- Uses EventBus for event publishing
- Synchronous operation
- Structured JSON output

---

### Decision Engines

**Note**: 10+ decision engines exist. All are rule-based, deterministic, no AI/LLM. Standard defined but not yet applied.

**Key Engines**:
- careerEngine.ts (career progression logic)
- candidateProfile.ts (profile management)
- careerAnalysisAIEngine.ts (analysis logic)
- scoreEngine (score calculation)
- coachEngine (coaching logic)
- recommendationEngine (recommendations)
- progressEngine (progress tracking)
- insightEngine (insight generation)
- decisionEngine (decision logic)
- memoryEngine (memory tracking)

**Common Pattern**:
- Rule-based logic
- Deterministic output
- No AI/LLM required
- Pure TypeScript

---

### Background Agents

**Note**: Only 3 agents exist (below Rule of Three). Standard documented but formalization deferred.

**Agents**:
- behavior.agent.ts (behavior tracking)
- billing.agent.ts (billing automation)
- interview.agent.ts (interview automation)

**Common Pattern**:
- Autonomous execution
- Scheduled or event-triggered
- EventBus integration

---

### Knowledge Services

**Note**: Only 3 services exist (below Rule of Three). Standard to be defined if more services are created.

**Services**:
- embedding-provider.port.ts (embedding interface)
- rag.ts (RAG implementation)
- track-skills.ts (skill tracking with embeddings)

**Common Pattern**:
- Vector embeddings
- Semantic search
- RAG (Retrieval-Augmented Generation)

---

## Risk Assessment by Family

### Conversational Domains

**High Risk**:
- **ATS**: External API dependencies

**Medium Risk**:
- None

**Low Risk**:
- **Learning**: Simple API integration
- **Daily Coach**: Simple API integration
- **Planning**: Simple API integration

**Mitigation**:
- API abstraction layer
- Integration tests
- Gradual rollout

### Intelligence Engines

**High Risk**:
- None (engines are server-only, well-isolated)

**Medium Risk**:
- **aiOrchestrator dependency**: All engines depend on aiOrchestrator

**Low Risk**:
- All engines follow similar pattern

**Mitigation**:
- Standardize aiOrchestrator integration
- Extract common abstractions

### Decision Engines

**High Risk**:
- None (rule-based, deterministic)

**Medium Risk**:
- None

**Low Risk**:
- All engines (pure TypeScript, no external dependencies)

**Mitigation**:
- Extract common abstractions
- Add comprehensive tests

### Background Agents

**High Risk**:
- None

**Medium Risk**:
- **EventBus dependency**: All agents depend on EventBus

**Low Risk**:
- Only 3 agents exist

**Mitigation**:
- Standardize EventBus integration
- Evaluate if more agents needed

### Knowledge Services

**High Risk**:
- None

**Medium Risk**:
- **Embedding Provider dependency**: Services depend on embedding provider

**Low Risk**:
- Only 3 services exist

**Mitigation**:
- Standardize embedding provider integration
- Evaluate if more services needed

---

## Dependencies by Family

### Conversational Domains
- **External APIs**: ATS, Learning, Daily Coach, Planning
- **Migration Priority**: Medium
- **Action**: Create API abstraction layer

### Intelligence Engines
- **aiOrchestrator**: All 24+ engines
- **CandidateAIBrain**: All 24+ engines
- **EventBus**: All 24+ engines
- **Migration Priority**: High
- **Action**: Standardize integration patterns

### Decision Engines
- **Data Sources**: Profile, job, interview data
- **Migration Priority**: Low
- **Action**: Extract common abstractions

### Background Agents
- **EventBus**: All 3 agents
- **Scheduler**: Scheduled agents
- **Migration Priority**: Low
- **Action**: Standardize EventBus integration

### Knowledge Services
- **Embedding Provider**: All 3 services
- **Vector Store**: RAG implementation
- **Migration Priority**: Low
- **Action**: Standardize embedding provider integration

---

## Success Metrics by Family

### Conversational Domains
- ✅ Build passes
- ✅ Tests pass (unit + integration)
- ✅ Architecture test passes
- ✅ Bundle size < 50 kB
- ✅ No AI engines in client bundle
- ✅ Server-only protection active
- ✅ No forbidden imports

### Intelligence Engines
- ✅ Build passes
- ✅ Tests pass
- ✅ Server-only protection active
- ✅ No engines in client bundle
- ✅ Standard integration patterns

### Decision Engines
- ✅ Build passes
- ✅ Tests pass
- ✅ No AI/LLM dependencies
- ✅ Deterministic output
- ✅ Common abstractions extracted

### Background Agents
- ✅ Build passes
- ✅ Tests pass
- ✅ Server-only protection active
- ✅ EventBus integration

### Knowledge Services
- ✅ Build passes
- ✅ Tests pass
- ✅ Server-only protection active
- ✅ Embedding provider integration

### Overall
- ✅ 100% components standardized
- ✅ Zero AI engine leaks
- ✅ Zero prompt leaks
- ✅ All builds passing
- ✅ All tests passing

---

## Timeline Summary by Family

| Phase | Family | Sprint | Status | Effort |
|-------|--------|--------|--------|--------|
| Phase 1 | Conversational Domain | 6.7 | Career Copilot | ✅ Complete | 2 weeks |
| Phase 1 | Conversational Domain | 6.7.3 | Interview | ✅ Complete | 2 weeks |
| Phase 1 | Conversational Domain | 6.9 | Phase 1 Completion & Phase 2 Prep | ✅ Complete | 1 week |
| Phase 2 | Intelligence Engine | 6.10 | intelligence-core Creation | 📋 Planned | 1-2 weeks |
| Phase 2 | Intelligence Engine | 6.11 | High Dependency Clusters | 📋 Planned | 2-3 weeks |
| Phase 2 | Intelligence Engine | 6.12 | Low Dependency Clusters | 📋 Planned | 1-2 weeks |
| Phase 3 | Decision Engine | 6.13 | Standard Application | 📋 Planned | 2-3 weeks |
| Phase 4 | Background Agent | 6.14 | Evaluation | 📋 Planned | 1 week |
| Phase 5 | Knowledge Service | 6.14+ | Evaluation | 📋 Planned | 1 week |

**Total Estimated Effort**: 5 weeks (conversational domains) + 4-7 weeks (intelligence engines) + TBD (other families)  
**Target Completion**: Sprint 6.9 (Phase 1 & Phase 2 Prep) ✅  
**Full Completion**: Sprint 6.14+ (all families)

---

## Recommendations

### Immediate (Sprint 6.9)
1. ✅ Complete Phase 1 audit and documentation
2. ✅ Validate AI Domain Standard through retrospective
3. ✅ Inventory all 29+ Intelligence Engines
4. ✅ Cluster Intelligence Engines by functionality
5. ✅ Identify common abstractions
6. ✅ Define Intelligence Engine Standard V1
7. ✅ Create ADR for Intelligence Engine Standard
8. ✅ Update roadmap for Phase 2

### Short-term (Sprint 6.10)
1. Create intelligence-core module
2. Implement BaseIntelligenceEngine
3. Implement ContextBuilder
4. Implement DependencyManager
5. Implement EventPublisher
6. Implement PromptExecutor
7. Implement PromptBuilder
8. Implement OutputValidator
9. Implement EngineRegistry

### Medium-term (Sprint 6.11-6.12)
1. Migrate high dependency clusters (Planning, Goal & Execution, Scenario & Digital Twin, Career Analysis, Application & Opportunity)
2. Migrate low dependency clusters (Decision & Strategy, Constraint & Resource, Outcome & Learning, Coaching & Reflection, Specialized Analysis, External Analysis)
3. Verify all engines migrated
4. Verify no regressions

### Medium-term (Sprint 6.13)
1. Apply Decision Engine Standard (10+ engines meet Rule of Three)
2. Extract common abstractions to decision-core
3. Refactor decision engines to use standard

### Long-term (Sprint 6.14+)
1. Evaluate Background Agent standardization (only 3 agents)
2. Evaluate Knowledge Service standardization (only 3 services)
3. Continuous improvement of AI Platform

---

## Conclusion

The AI Platform roadmap provides a clear path to standardize all AI components in Trajectoire, organized by family. Phase 1 (Conversational Domain Standard) is complete with 2/2 conversational domains migrated (Career Copilot, Interview). Phase 2 preparation is complete with Intelligence Engine Standard V1 defined and ready for implementation. Planning and Daily Coach have been reclassified as Intelligence Engines and will be standardized in Phase 2.

**Current Progress**: Phase 1 Complete ✅ | Phase 2 Ready ✅  
**Target Progress**: Phase 1 Complete by Sprint 6.9 ✅ | Phase 2 Ready by Sprint 6.9 ✅  
**Full Standardization**: All families by Sprint 6.14+

**Key Insight**: Not all AI components are conversational domains. The platform has 6 distinct families, each requiring its own standard. The AI Domain Standard remains valid for conversational domains, while other families have their own standards. The Intelligence Engine Standard V1 is now defined and ready for implementation, with 29+ engines to migrate across 11 clusters.
