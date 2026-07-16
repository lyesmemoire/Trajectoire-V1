# Sprint 6.29 Pre-Migration Audit

**Date:** 2026-07-14  
**Sprint:** 6.29  
**Scope:** Legacy Engine Audit  
**Objective:** Analyze 3 legacy engines before migration

## Engine 1: careerCopilotProactiveEngine

**File:** `c:\Trajectoire\core\intelligence\engines\careerCopilotProactiveEngine.ts`

### Business Responsibilities

**Responsability:** Generate proactive initiatives based on candidate evolution

**Input:** ProactiveInput (candidateGraph)

**Output:** ProactiveOutput (initiatives array)

**Business Logic:**
- Extract candidate profile from CandidateGraph
- Extract historical observations, insights, goals from CandidateAIBrain
- Derive adaptive profile (autonomy, explanation need, progression pace, confidence, usage frequency, motivation, follow-through, best advice)
- Format CandidateGraph data for AI prompt
- Generate proactive initiatives via AI
- Save initiatives to CandidateAIBrain as observations
- Publish initiative events

---

### Legacy Dependencies

**aiOrchestrator**
- Import: Line 1
- Usage: Line 136
- Code: `await aiOrchestrator.execute<ProactiveOutput>(careerCopilotProactiveV1, {...}, {...})`

**eventBus**
- Import: Line 4
- Usage: Line 205
- Code: `eventBus.publish(initiativeEvent)`

**ObservationCreatedEvent**
- Import: Line 5
- Usage: Line 191
- Code: `const initiativeEvent: ObservationCreatedEvent = {...}`

---

### Required Runtime Dependencies

**IntelligenceUseCase**
- Reason: Replace aiOrchestrator.execute
- Priority: P1 - Critical

**EventPublisher**
- Reason: Replace eventBus.publish
- Priority: P1 - Critical

**BrainContextBuilder**
- Reason: Standardize context building from CandidateAIBrain
- Priority: P2 - Recommended

**IntelligenceRequest**
- Reason: Standardize request format
- Priority: P1 - Critical

---

### Migration Complexity

**Complexity:** Medium

**Reasons:**
- Single AI call
- Simple event publishing (1 event)
- Moderate context building (11 derived fields)
- Uses CandidateAIBrain (retained)

**Estimated Effort:** 2 hours

---

## Engine 2: careerCopilotReflectionIntelligenceEngine

**File:** `c:\Trajectoire\core\intelligence\engines\careerCopilotReflectionIntelligenceEngine.ts`

### Business Responsibilities

**Responsability:** Perform critical reflection on recommendations and reasoning

**Input:** ReflectionInput (candidateGraph, currentEvent)

**Output:** ReflectionOutput (9 analysis sections)

**Business Logic:**
- Extract candidate profile, career timeline, skills evolution, achievements, goals from CandidateGraph
- Get context from 19 other intelligence engines
- Perform reflection analysis via AI
- Analyze: recommendation review, alternative analysis, assumption detection, blind spot detection, contradiction detection, evidence review, confidence calibration
- Save reflection to CandidateAIBrain
- Publish 7 different reflection events

---

### Legacy Dependencies

**aiOrchestrator**
- Import: Line 1
- Usage: Line 432
- Code: `await aiOrchestrator.execute(careerCopilotReflectionIntelligenceV1, {...}, {...})`

**eventBus**
- Import: Line 4
- Usage: Lines 481, 497, 513, 530, 547, 564, 580
- Code: 7 eventBus.publish calls

---

### Required Runtime Dependencies

**IntelligenceUseCase**
- Reason: Replace aiOrchestrator.execute
- Priority: P1 - Critical

**EventPublisher**
- Reason: Replace 7 eventBus.publish calls
- Priority: P1 - Critical

**IntelligenceRequest**
- Reason: Standardize request format
- Priority: P1 - Critical

**BrainContextBuilder**
- Reason: Standardize context building from CandidateAIBrain
- Priority: P2 - Recommended

---

### Migration Complexity

**Complexity:** High

**Reasons:**
- Single AI call
- Complex event publishing (7 different events)
- Heavy context building (19 other engines)
- Large output structure (9 sections)
- Maintains internal state (lastReflectionAnalysis, reflectionHistory)

**Estimated Effort:** 4 hours

---

## Engine 3: recommendationsAIEngine

**File:** `c:\Trajectoire\core\intelligence\engines\recommendationsAIEngine.ts`

### Business Responsibilities

**Responsability:** Generate AI-powered recommendations

**Input:** RecommendationsInput (candidateProfile, assessmentResults, careerGoals, marketContext, candidateId, historicalInsights, previousRecommendations, knownPatterns)

**Output:** Recommendations data

**Business Logic:**
- Check for recent analysis in CandidateAIBrain cache
- Decide whether to reuse cached analysis (7 days old + no new observations)
- Generate new analysis with historical context from CandidateAIBrain
- Generate recommendations via AI
- Store analysis in CandidateAIBrain history
- Publish recommendation event if candidateId provided

---

### Legacy Dependencies

**aiOrchestrator**
- Import: Line 1
- Usage: Line 61
- Code: `await aiOrchestrator.execute(recommendationsV1, {...}, {...})`

**eventBus**
- Import: Line 3
- Usage: Line 108
- Code: `await eventBus.publish<RecommendationGeneratedEvent>({...})`

**RecommendationGeneratedEvent**
- Import: Line 4
- Usage: Line 108
- Code: `await eventBus.publish<RecommendationGeneratedEvent>({...})`

---

### Required Runtime Dependencies

**IntelligenceUseCase**
- Reason: Replace aiOrchestrator.execute
- Priority: P1 - Critical

**EventPublisher**
- Reason: Replace eventBus.publish
- Priority: P1 - Critical

**IntelligenceRequest**
- Reason: Standardize request format
- Priority: P1 - Critical

**BrainContextBuilder**
- Reason: Standardize context building from CandidateAIBrain
- Priority: P2 - Recommended

---

### Migration Complexity

**Complexity:** Low

**Reasons:**
- Single AI call
- Simple event publishing (1 event, conditional)
- Simple context building (insights, observations, patterns)
- Cache logic (retained in CandidateAIBrain)
- No internal state

**Estimated Effort:** 1.5 hours

---

## Summary

**Total Legacy Engines:** 3

**Total Legacy Dependencies:**
- aiOrchestrator: 3 engines
- eventBus: 3 engines
- ObservationCreatedEvent: 1 engine
- RecommendationGeneratedEvent: 1 engine

**Total Event Publications:**
- careerCopilotProactiveEngine: 1 event
- careerCopilotReflectionIntelligenceEngine: 7 events
- recommendationsAIEngine: 1 event (conditional)

**Total Estimated Effort:** 7.5 hours

**Migration Priority:**
1. recommendationsAIEngine (Low complexity, 1.5 hours)
2. careerCopilotProactiveEngine (Medium complexity, 2 hours)
3. careerCopilotReflectionIntelligenceEngine (High complexity, 4 hours)

**CandidateAIBrain Usage:** All 3 engines use CandidateAIBrain (retained)

**Business Logic Changes:** None (only infrastructure changes)

---

**Report Generated:** 2026-07-14  
**Generated By:** Cascade AI Assistant  
**Sprint:** 6.28  
**Methodology:** Code analysis with evidence
