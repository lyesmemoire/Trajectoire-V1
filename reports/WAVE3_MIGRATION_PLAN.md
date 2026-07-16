# Wave 3 Migration Plan

## Overview
- **Date**: 2026-07-13
- **Objective**: Migrate 4 complex Wave 3 engines to new platform architecture
- **Strategy**: Option A - Migrate with existing components (no platform evolution needed)
- **Estimated Duration**: 14-18 hours
- **Risk Level**: Medium (due to complexity of engines)

## Migration Strategy

### Decision: Option A
Migrate all 4 engines using existing platform components (intelligence-core, intelligence-runtime, EventPublisher, BrainContextBuilder).

**Justification:**
- No technical pattern shared by at least 2 engines
- All identified gaps are business logic specific
- Current architecture covers all technical needs
- Migration rules R001-R016 are sufficient
- Risk of over-engineering with Option B

## Migration Order

### Phase 1: CareerCopilotDigitalTwinEngine
**Priority**: 1 (Lowest complexity)
**Duration**: 2-3 hours
**Risk**: Low

**Steps:**
1. Replace imports (aiOrchestrator → intelligence-core, eventBus → EventPublisher)
2. Replace aiOrchestrator.execute with intelligenceCoreModule.createUseCase
3. Update request structure (IntelligenceRequest with context)
4. Replace result.data with result.output
5. Replace eventBus.publish with EventPublisher.publish
6. Validate build, typecheck, ESLint
7. Run unit tests
8. Document changes

**Dependencies:**
- CareerCopilotOpportunityIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotApplicationIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotSuccessIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotScenarioIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotConstraintIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotResourceIntelligenceEngine (Wave 2 - already migrated)

**Specific Adaptations:**
- Preserve 6 engine dependencies (getCurrentXxx() calls)
- Preserve 12 prompt variables (use engineContext)
- No state management to preserve
- No conditional logic to preserve

---

### Phase 2: CareerCopilotAdaptiveStrategyEngine
**Priority**: 2 (Medium complexity)
**Duration**: 3-4 hours
**Risk**: Low-Medium

**Steps:**
1. Replace imports (aiOrchestrator → intelligence-core, eventBus → EventPublisher)
2. Replace aiOrchestrator.execute with intelligenceCoreModule.createUseCase
3. Update request structure (IntelligenceRequest with context)
4. Replace result.data with result.output
5. Replace eventBus.publish with EventPublisher.publish
6. **Preserve conditional logic** (save/publish only if strategyChangeRequired)
7. **Preserve utility methods** (getCurrentStrategy(), getStrategyHistory())
8. Validate build, typecheck, ESLint
9. Run unit tests
10. Test conditional logic specifically
11. Document changes

**Dependencies:**
- CareerCopilotMarketIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotOpportunityIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotApplicationIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotSuccessIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotScenarioIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotConstraintIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotResourceIntelligenceEngine (Wave 2 - already migrated)

**Specific Adaptations:**
- Preserve 7 engine dependencies (getCurrentXxx() calls)
- Preserve 17 prompt variables (use engineContext)
- Preserve conditional save/publish logic
- Preserve utility methods: getCurrentStrategy(), getStrategyHistory()
- Test: Verify conditional logic works correctly

---

### Phase 3: CareerCopilotAutonomousIntelligenceEngine
**Priority**: 3 (High complexity)
**Duration**: 4-5 hours
**Risk**: Medium

**Steps:**
1. Replace imports (aiOrchestrator → intelligence-core, eventBus → EventPublisher)
2. Replace aiOrchestrator.execute with intelligenceCoreModule.createUseCase
3. Update request structure (IntelligenceRequest with context)
4. Replace result.data with result.output
5. Replace eventBus.publish with EventPublisher.publish
6. **Preserve internal state** (lastOrchestration, orchestrationHistory)
7. **Preserve utility methods** (getLastOrchestration(), getOrchestrationHistory(), calculateDataFreshness())
8. **Preserve history limit** (keep only 50 orchestrations)
9. Validate build, typecheck, ESLint
10. Run unit tests
11. Test meta-orchestration logic specifically
12. Test state management specifically
13. Document changes

**Dependencies:**
- CareerCopilotConstraintIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotResourceIntelligenceEngine (Wave 2 - already migrated)

**Specific Adaptations:**
- Preserve 2 engine dependencies (getCurrentXxx() calls)
- Preserve 8 prompt variables (use engineContext)
- Preserve internal state: lastOrchestration, orchestrationHistory
- Preserve private method: calculateDataFreshness()
- Preserve public methods: getLastOrchestration(), getOrchestrationHistory()
- Preserve history limit (50 orchestrations)
- Test: Verify meta-orchestration decisions (EXECUTE/REUSE/IGNORE/REVISION)
- Test: Verify state management and history

---

### Phase 4: CareerCopilotMetaIntelligenceEngine
**Priority**: 4 (Highest complexity)
**Duration**: 5-6 hours
**Risk**: Medium-High

**Steps:**
1. Replace imports (aiOrchestrator → intelligence-core, eventBus → EventPublisher)
2. Replace aiOrchestrator.execute with intelligenceCoreModule.createUseCase
3. Update request structure (IntelligenceRequest with context)
4. Replace result.data with result.output
5. Replace eventBus.publish with EventPublisher.publish
6. **Preserve conditional logic** (3 event types: incoherence-detected, conflict-resolved, sync-action)
7. **Preserve optional inputs** (currentForecast, currentProgressionPlan, currentDigitalTwin)
8. Validate build, typecheck, ESLint
9. Run unit tests
10. Test conditional logic for all 3 event types specifically
11. Test optional inputs handling
12. Document changes

**Dependencies:**
- CareerCopilotAdaptiveStrategyEngine (Wave 3 - migrated in Phase 2)
- CareerCopilotDecisionIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotAccountabilityEngine (Wave 2 - already migrated)
- CareerCopilotSelfReviewEngine (Wave 2 - already migrated)
- CareerCopilotConfidenceEngine (Wave 2 - already migrated)
- CareerCopilotOpportunityIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotApplicationIntelligenceEngine (Wave 1 - already migrated)
- CareerCopilotSuccessIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotConstraintIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotResourceIntelligenceEngine (Wave 2 - already migrated)
- CareerCopilotKnowledgeEvolutionEngine (Wave 2 - already migrated)

**Specific Adaptations:**
- Preserve 11 engine dependencies (getCurrentXxx() calls)
- Preserve 18 prompt variables (use engineContext)
- Preserve conditional logic for 3 event types
- Preserve optional inputs: currentForecast, currentProgressionPlan, currentDigitalTwin
- Test: Verify all 3 conditional event types
- Test: Verify optional inputs handling
- Test: Verify meta-coordination logic

---

## Migration Rules Application

### R001-R016 Checklist

For each engine, apply the following rules:

- [ ] **R001**: Replace aiOrchestrator import with intelligence-core imports
- [ ] **R002**: Replace aiOrchestrator.execute with intelligenceCoreModule.createUseCase
- [ ] **R003**: Replace eventBus import with EventPublisher import
- [ ] **R004**: Replace eventBus.publish with EventPublisher.publish
- [ ] **R005**: Use BrainContextBuilder for context construction (if applicable)
- [ ] **R006**: Replace result.data with result.output
- [ ] **R007**: Update request structure to IntelligenceRequest interface
- [ ] **R008**: Add engineContext to context for engine-specific data
- [ ] **R009**: Update options structure (provider, model, temperature, maxTokens, timeout)
- [ ] **R010**: Remove legacy event types (ObservationCreatedEvent)
- [ ] **R011**: Simplify event publishing to plain objects
- [ ] **R012**: Add timestamp to event payloads
- [ ] **R013**: Preserve existing prompts and DTOs
- [ ] **R014**: Preserve business logic and data transformations
- [ ] **R015**: Update imports to use new abstractions
- [ ] **R016**: Remove legacy imports

---

## Validation Strategy

### Per-Phase Validation

After each engine migration:

1. **Build Validation**
   ```bash
   npm run build
   ```

2. **Typecheck Validation**
   ```bash
   npx tsc --noEmit
   ```

3. **ESLint Validation**
   ```bash
   npx eslint core/intelligence/engines/[engine-name].ts
   ```

4. **Unit Tests**
   ```bash
   npm test -- [engine-name]
   ```

5. **Manual Testing**
   - Test engine-specific logic (conditional, state management, etc.)
   - Verify event publishing
   - Verify Brain integration

### Final Validation

After all 4 engines are migrated:

1. **Full Build**
   ```bash
   npm run build
   ```

2. **Full Typecheck**
   ```bash
   npx tsc --noEmit
   ```

3. **Full ESLint**
   ```bash
   npx eslint core/intelligence/engines/
   ```

4. **Full Test Suite**
   ```bash
   npm test
   ```

5. **Integration Testing**
   - Test engine-to-engine calls
   - Test meta-orchestration (Autonomous)
   - Test meta-coordination (MetaIntelligence)

---

## Risk Mitigation

### Risk Matrix

| Phase | Risk | Mitigation |
|-------|------|------------|
| DigitalTwin | Low | Standard migration pattern, 6 dependencies but simple logic |
| AdaptiveStrategy | Low-Medium | Test conditional logic thoroughly, preserve utility methods |
| Autonomous | Medium | Test meta-orchestration, verify state management, test history limit |
| MetaIntelligence | Medium-High | Test all 3 conditional event types, verify 11 dependencies, test optional inputs |

### Rollback Strategy

If a migration fails validation:

1. Revert changes to the specific engine file
2. Document the failure
3. Analyze the root cause
4. Fix the issue
5. Retry the migration

### Contingency Plans

**If build fails:**
- Check imports paths
- Verify IntelligenceRequest structure
- Verify EventPublisher usage

**If typecheck fails:**
- Check type casting (result.output as OutputType)
- Verify interface definitions
- Check optional inputs handling

**If ESLint fails:**
- Run `npx eslint --fix` to auto-fix
- Remove unused imports manually
- Fix `any` types if critical

**If tests fail:**
- Verify business logic preservation
- Check conditional logic
- Verify state management
- Check event publishing

---

## Timeline

### Estimated Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 1: DigitalTwin | 2-3h | Day 1 | Day 1 |
| Phase 2: AdaptiveStrategy | 3-4h | Day 1 | Day 2 |
| Phase 3: Autonomous | 4-5h | Day 2 | Day 3 |
| Phase 4: MetaIntelligence | 5-6h | Day 3 | Day 4 |
| Validation & Testing | 2-3h | Day 4 | Day 4 |
| **Total** | **14-18h** | **Day 1** | **Day 4** |

### Milestones

- **Milestone 1**: DigitalTwin migrated and validated (Day 1)
- **Milestone 2**: AdaptiveStrategy migrated and validated (Day 2)
- **Milestone 3**: Autonomous migrated and validated (Day 3)
- **Milestone 4**: MetaIntelligence migrated and validated (Day 4)
- **Milestone 5**: Full validation complete (Day 4)

---

## Success Criteria

### Per-Phase Success Criteria

- [ ] Build passes
- [ ] Typecheck passes
- [ ] ESLint passes (0 errors)
- [ ] Unit tests pass
- [ ] Engine-specific logic tested
- [ ] Documentation updated

### Overall Success Criteria

- [ ] All 4 engines migrated
- [ ] Build passes
- [ ] Typecheck passes
- [ ] ESLint passes
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Migration report created
- [ ] No platform evolution needed

---

## Post-Migration Activities

### Cleanup

1. Remove any remaining legacy imports (if any)
2. Remove unused dependencies (if any)
3. Update documentation
4. Create final migration report

### Documentation

1. Update migration playbook with Wave 3 learnings
2. Document any new patterns discovered
3. Update engine dependency graph
4. Create migration summary for stakeholders

### Monitoring

1. Monitor engine performance post-migration
2. Monitor error rates
3. Monitor LLM costs (especially for Autonomous)
4. Monitor event publishing

---

## Appendix

### File Changes Summary

| Engine | File | Lines Changed | Complexity |
|--------|------|---------------|------------|
| DigitalTwin | careerCopilotDigitalTwinEngine.ts | ~50 | Low |
| AdaptiveStrategy | careerCopilotAdaptiveStrategyEngine.ts | ~60 | Medium |
| Autonomous | careerCopilotAutonomousIntelligenceEngine.ts | ~70 | High |
| MetaIntelligence | careerCopilotMetaIntelligenceEngine.ts | ~80 | Very High |

### Dependency Graph After Migration

```
DigitalTwin
├── OpportunityIntelligence (Wave 1)
├── ApplicationIntelligence (Wave 1)
├── SuccessIntelligence (Wave 2)
├── ScenarioIntelligence (Wave 2)
├── ConstraintIntelligence (Wave 2)
└── ResourceIntelligence (Wave 2)

AdaptiveStrategy
├── MarketIntelligence (Wave 1)
├── OpportunityIntelligence (Wave 1)
├── ApplicationIntelligence (Wave 1)
├── SuccessIntelligence (Wave 2)
├── ScenarioIntelligence (Wave 2)
├── ConstraintIntelligence (Wave 2)
└── ResourceIntelligence (Wave 2)

Autonomous
├── ConstraintIntelligence (Wave 2)
└── ResourceIntelligence (Wave 2)

MetaIntelligence
├── AdaptiveStrategy (Wave 3)
├── DecisionIntelligence (Wave 2)
├── AccountabilityEngine (Wave 2)
├── SelfReviewEngine (Wave 2)
├── ConfidenceEngine (Wave 2)
├── OpportunityIntelligence (Wave 1)
├── ApplicationIntelligence (Wave 1)
├── SuccessIntelligence (Wave 2)
├── ConstraintIntelligence (Wave 2)
├── ResourceIntelligence (Wave 2)
└── KnowledgeEvolution (Wave 2)
```

### Migration Checklist

- [ ] Phase 1: DigitalTwin
  - [ ] Replace imports
  - [ ] Replace orchestration
  - [ ] Replace event publishing
  - [ ] Validate build
  - [ ] Validate typecheck
  - [ ] Validate ESLint
  - [ ] Run tests
  - [ ] Document

- [ ] Phase 2: AdaptiveStrategy
  - [ ] Replace imports
  - [ ] Replace orchestration
  - [ ] Replace event publishing
  - [ ] Preserve conditional logic
  - [ ] Preserve utility methods
  - [ ] Validate build
  - [ ] Validate typecheck
  - [ ] Validate ESLint
  - [ ] Run tests
  - [ ] Test conditional logic
  - [ ] Document

- [ ] Phase 3: Autonomous
  - [ ] Replace imports
  - [ ] Replace orchestration
  - [ ] Replace event publishing
  - [ ] Preserve internal state
  - [ ] Preserve utility methods
  - [ ] Validate build
  - [ ] Validate typecheck
  - [ ] Validate ESLint
  - [ ] Run tests
  - [ ] Test meta-orchestration
  - [ ] Test state management
  - [ ] Document

- [ ] Phase 4: MetaIntelligence
  - [ ] Replace imports
  - [ ] Replace orchestration
  - [ ] Replace event publishing
  - [ ] Preserve conditional logic (3 events)
  - [ ] Preserve optional inputs
  - [ ] Validate build
  - [ ] Validate typecheck
  - [ ] Validate ESLint
  - [ ] Run tests
  - [ ] Test all 3 event types
  - [ ] Test optional inputs
  - [ ] Document

- [ ] Final Validation
  - [ ] Full build
  - [ ] Full typecheck
  - [ ] Full ESLint
  - [ ] Full test suite
  - [ ] Integration tests
  - [ ] Final report

---

## Conclusion

This migration plan provides a structured approach to migrating the 4 complex Wave 3 engines using the existing platform architecture. The strategy is conservative (Option A) to minimize risk and leverage the proven migration patterns from Waves 1 and 2.

**Key Points:**
- No platform evolution needed
- All engines are migrable with existing components
- Migration order from least to most complex
- Comprehensive validation at each phase
- Risk mitigation strategies defined
- Clear success criteria

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 1 (DigitalTwin)
3. Follow the checklist systematically
4. Validate at each phase
5. Document learnings
6. Complete final validation

**Estimated Completion:** 4 days (14-18 hours)
