# Legacy Usage Details Report

**Date:** 2026-07-14  
**Sprint:** 6.28  
**Scope:** Legacy Component Usage  
**Objective:** Document all legacy component usage with classification

## Scan Results

### aiOrchestrator

**Total Occurrences:** 25

**Active Code:** 3 occurrences
- careerCopilotProactiveEngine.ts (line 1 - import, line 136 - usage)
- careerCopilotReflectionIntelligenceEngine.ts (line 1 - import, line 432 - usage)
- recommendationsAIEngine.ts (line 1 - import, line 61 - usage)

**Comments:** 22 occurrences
- recruiterNotesAIEngine.ts (line 8 - comment)
- recommendationsAIEngine.ts (line 10 - comment)
- interviewAnalyzerAIEngine.ts (line 11 - comment)
- executiveSummaryAIEngine.ts (line 8 - comment)
- decisionEstimationAIEngine.ts (line 8 - comment)
- careerCopilotSuccessIntelligenceEngine.ts (line 204 - comment, line 406 - comment)
- careerCopilotSelfReviewEngine.ts (line 88 - comment)
- careerCopilotProgressionPlanEngine.ts (line 52 - comment)
- careerCopilotProactiveEngine.ts (line 29 - comment)
- careerCopilotMetaIntelligenceEngine.ts (line 73 - comment)
- careerCopilotKnowledgeEvolutionEngine.ts (line 127 - comment)
- careerCopilotGoalIntelligenceEngine.ts (line 109 - comment)
- careerCopilotForecastEngine.ts (line 118 - comment)
- careerCopilotExecutionIntelligenceEngine.ts (line 211 - comment)
- careerCopilotDigitalTwinEngine.ts (line 61 - comment)
- careerCopilotDecisionIntelligenceEngine.ts (line 42 - comment)
- careerCopilotDailySummaryEngine.ts (line 56 - comment)
- careerCopilotConversationEngine.ts (line 47 - comment)
- careerCopilotConfidenceEngine.ts (line 93 - comment)
- careerCopilotCoachingIntelligenceEngine.ts (line 201 - comment)

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:** 
- Active: 3 engines
- Comments only: 22 engines

---

### eventBus

**Total Occurrences:** 25

**Active Code:** 3 occurrences
- careerCopilotProactiveEngine.ts (line 4 - import, line 205 - usage)
- careerCopilotReflectionIntelligenceEngine.ts (line 4 - import, lines 481, 497, 513, 530, 547, 564, 580 - usage)
- recommendationsAIEngine.ts (line 3 - import, line 108 - usage)

**Comments:** 22 occurrences
- careerCopilotSuccessIntelligenceEngine.ts (line 204 - comment)
- careerCopilotSelfReviewEngine.ts (line 344 - comment)
- careerCopilotScenarioIntelligenceEngine.ts (line 350 - comment)
- careerCopilotProgressionPlanEngine.ts (line 216 - comment)
- careerCopilotProactiveEngine.ts (line 190 - comment)
- careerCopilotMetaIntelligenceEngine.ts (line 335 - comment)
- careerCopilotGoalIntelligenceEngine.ts (line 434 - comment)
- careerCopilotExecutionIntelligenceEngine.ts (line 260 - comment)
- careerCopilotDigitalTwinEngine.ts (line 246 - comment)
- careerCopilotDecisionIntelligenceEngine.ts (line 319 - comment)
- careerCopilotConversationEngine.ts (line 800 - comment)
- careerCopilotDailySummaryEngine.ts (line 260 - comment)
- careerCopilotCoachingIntelligenceEngine.ts (line 253 - comment)
- careerCopilotConstraintIntelligenceEngine.ts (line 300 - comment, line 479 - comment)
- careerCopilotOutcomeIntelligenceEngine.ts (line 393 - comment)
- careerCopilotOpportunityIntelligenceEngine.ts (line 420 - comment)
- careerCopilotMissionIntelligenceEngine.ts (line 469 - comment)
- careerCopilotMarketIntelligenceEngine.ts (line 397 - comment)
- careerCopilotKnowledgeEvolutionEngine.ts (line 305 - comment)
- careerCopilotResourceIntelligenceEngine.ts (line 367 - comment, line 525 - comment)
- careerCopilotApplicationIntelligenceEngine.ts (line 173 - comment)
- careerCopilotAccountabilityEngine.ts (line 360 - comment)
- careerCopilotAdaptiveStrategyEngine.ts (line 309 - comment)

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:**
- Active: 3 engines
- Comments only: 22 engines

---

### ObservationCreatedEvent

**Total Occurrences:** 2

**Active Code:** 1 occurrence
- careerCopilotProactiveEngine.ts (line 5 - import, line 191 - usage)

**Comments:** 1 occurrence
- careerCopilotProactiveEngine.ts (line 190 - comment)

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:**
- Active: 1 engine
- Comments only: 1 engine

---

### OpenAIProvider

**Total Occurrences:** 0

**Active Code:** 0 occurrences

**Comments:** 0 occurrences

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:** Not found

---

### MistralProvider

**Total Occurrences:** 0

**Active Code:** 0 occurrences

**Comments:** 0 occurrences

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:** Not found

---

### OpenAI SDK

**Total Occurrences:** 0

**Active Code:** 0 occurrences

**Comments:** 0 occurrences

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:** Not found

---

### Mistral SDK

**Total Occurrences:** 0

**Active Code:** 0 occurrences

**Comments:** 0 occurrences

**Dead Code:** 0 occurrences

**Unused Imports:** 0 occurrences

**Classification:** Not found

---

## Summary

**Legacy Components with Active Usage:**
1. aiOrchestrator: 3 engines
2. eventBus: 3 engines
3. ObservationCreatedEvent: 1 engine

**Legacy Components with Comments Only:**
1. aiOrchestrator: 22 engines
2. eventBus: 22 engines
3. ObservationCreatedEvent: 1 engine

**Legacy Components Not Found:**
1. OpenAIProvider
2. MistralProvider
3. OpenAI SDK
4. Mistral SDK

**Total Active Legacy Usage:** 7 occurrences across 3 engines

**Total Comment References:** 45 occurrences across 22 engines

**Engines with Active Legacy Usage:**
1. careerCopilotProactiveEngine.ts
2. careerCopilotReflectionIntelligenceEngine.ts
3. recommendationsAIEngine.ts

**Engines with Legacy Comments Only:**
1. recruiterNotesAIEngine.ts
2. interviewAnalyzerAIEngine.ts
3. executiveSummaryAIEngine.ts
4. decisionEstimationAIEngine.ts
5. careerCopilotSuccessIntelligenceEngine.ts
6. careerCopilotSelfReviewEngine.ts
7. careerCopilotProgressionPlanEngine.ts
8. careerCopilotMetaIntelligenceEngine.ts
9. careerCopilotKnowledgeEvolutionEngine.ts
10. careerCopilotGoalIntelligenceEngine.ts
11. careerCopilotForecastEngine.ts
12. careerCopilotExecutionIntelligenceEngine.ts
13. careerCopilotDigitalTwinEngine.ts
14. careerCopilotDecisionIntelligenceEngine.ts
15. careerCopilotDailySummaryEngine.ts
16. careerCopilotConversationEngine.ts
17. careerCopilotConfidenceEngine.ts
18. careerCopilotCoachingIntelligenceEngine.ts
19. careerCopilotConstraintIntelligenceEngine.ts
20. careerCopilotOutcomeIntelligenceEngine.ts
21. careerCopilotOpportunityIntelligenceEngine.ts
22. careerCopilotMissionIntelligenceEngine.ts
23. careerCopilotMarketIntelligenceEngine.ts
24. careerCopilotResourceIntelligenceEngine.ts
25. careerCopilotApplicationIntelligenceEngine.ts
26. careerCopilotAccountabilityEngine.ts
27. careerCopilotAdaptiveStrategyEngine.ts
28. careerCopilotScenarioIntelligenceEngine.ts

---

**Report Generated:** 2026-07-14  
**Generated By:** Cascade AI Assistant  
**Sprint:** 6.28  
**Methodology:** Scan-based classification (active/comment/dead/unused)
