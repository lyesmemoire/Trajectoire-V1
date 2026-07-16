# Legacy Evidence Report

**Date:** 2026-07-14  
**Sprint:** 6.28  
**Scope:** Legacy Engine Evidence  
**Objective:** Document legacy usage with exact evidence

## Legacy Engine 1: careerCopilotProactiveEngine.ts

**File:** `c:\Trajectoire\core\intelligence\engines\careerCopilotProactiveEngine.ts`

### Evidence 1: aiOrchestrator Import

**Line:** 1

**Code:**
```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";
```

**Reason:** Imports legacy aiOrchestrator instead of intelligenceCoreModule

**Impact:** Engine depends on legacy orchestration layer

---

### Evidence 2: aiOrchestrator Usage

**Line:** 136

**Code:**
```typescript
const result = await aiOrchestrator.execute<ProactiveOutput>(
  careerCopilotProactiveV1,
  {
    candidateProfile: JSON.stringify(candidateProfile),
    candidateAutonomy: autonomyLevel,
    explanationNeed: explanationNeed,
    progressionPace: progressionPace,
    confidenceLevel: confidenceLevel,
    usageFrequency: usageFrequency,
    motivationLevel: motivationLevel,
    recommendationFollowThrough: followThrough,
    bestAdvice: bestAdvice,
    candidateGraph: candidateGraphData,
    historicalObservations: historicalObservations.join("\n"),
    recentInsights: recentInsights.join("\n"),
    currentGoals: currentGoals.join("\n"),
    previousInitiatives: previousInitiatives.join("\n"),
    previousRecommendations: previousRecs.join("\n"),
    recentEvents: recentEvents.join("\n"),
  },
  {
    provider: "openai",
    model: "gpt-4-turbo",
    promptId: "career-copilot-proactive",
    promptVersion: "v2",
    temperature: 0.7,
    maxTokens: 1500,
  }
);
```

**Reason:** Active usage of legacy aiOrchestrator.execute method

**Impact:** Engine executes AI through legacy orchestration layer

---

### Evidence 3: eventBus Import

**Line:** 4

**Code:**
```typescript
import { eventBus } from "../../ai/events/EventBus";
```

**Reason:** Imports legacy eventBus instead of EventPublisher

**Impact:** Engine depends on legacy event system

---

### Evidence 4: eventBus Usage

**Line:** 205

**Code:**
```typescript
eventBus.publish(initiativeEvent);
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

### Evidence 5: ObservationCreatedEvent Import

**Line:** 5

**Code:**
```typescript
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
```

**Reason:** Imports legacy event type

**Impact:** Engine uses legacy event type definitions

---

### Evidence 6: ObservationCreatedEvent Usage

**Line:** 191-203

**Code:**
```typescript
const initiativeEvent: ObservationCreatedEvent = {
  id: `proactive-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-proactive",
    observationType: "general",
    data: {
      initiatives: result.data.initiatives,
    },
    confidence: 0.9,
  },
};
```

**Reason:** Active usage of legacy event type

**Impact:** Engine creates legacy event objects

---

## Legacy Engine 2: careerCopilotReflectionIntelligenceEngine.ts

**File:** `c:\Trajectoire\core\intelligence\engines\careerCopilotReflectionIntelligenceEngine.ts`

### Evidence 1: aiOrchestrator Import

**Line:** 1

**Code:**
```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";
```

**Reason:** Imports legacy aiOrchestrator instead of intelligenceCoreModule

**Impact:** Engine depends on legacy orchestration layer

---

### Evidence 2: aiOrchestrator Usage

**Line:** 432

**Code:**
```typescript
const result = await aiOrchestrator.execute(
  careerCopilotReflectionIntelligenceV1,
  {
    candidateProfile: JSON.stringify(candidateProfile, null, 2),
    careerTimeline: careerTimelineText,
    skillsEvolution: skillsEvolutionText,
    achievements: achievementsText,
    goals: goalsText,
    careerNarrativeIntelligence: JSON.stringify(careerNarrativeContext, null, 2),
    decisionIntelligence: JSON.stringify(decisionContext, null, 2),
    forecastIntelligence: JSON.stringify(forecastContext, null, 2),
    evidenceIntelligence: JSON.stringify(evidenceContext, null, 2),
    missionIntelligence: JSON.stringify(missionContext, null, 2),
    knowledgeEvolution: JSON.stringify(knowledgeEvolutionContext, null, 2),
    scenarioIntelligence: JSON.stringify(forecastContext, null, 2),
    outcomeIntelligence: JSON.stringify(outcomeContext, null, 2),
    opportunityIntelligence: JSON.stringify(opportunityContext, null, 2),
    successIntelligence: JSON.stringify(successContext, null, 2),
    constraintIntelligence: JSON.stringify(constraintContext, null, 2),
    resourceIntelligence: JSON.stringify(resourceContext, null, 2),
    goalIntelligence: JSON.stringify(goalContext, null, 2),
    confidenceIntelligence: JSON.stringify(confidenceContext, null, 2),
    metaIntelligence: JSON.stringify(metaContext, null, 2),
    applicationIntelligence: JSON.stringify(applicationContext, null, 2),
    conversationIntelligence: JSON.stringify(conversationContext, null, 2),
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    promptId: "career-copilot-reflection-intelligence-v1",
  }
);
```

**Reason:** Active usage of legacy aiOrchestrator.execute method

**Impact:** Engine executes AI through legacy orchestration layer

---

### Evidence 3: eventBus Import

**Line:** 4

**Code:**
```typescript
import { eventBus } from "../../ai/events/EventBus";
```

**Reason:** Imports legacy eventBus instead of EventPublisher

**Impact:** Engine depends on legacy event system

---

### Evidence 4: eventBus Usage (Multiple)

**Line:** 481

**Code:**
```typescript
eventBus.publish({
  id: `reflection-completed-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      reflectionSummary: output.reflectionSummary,
      overallQuality: output.reflectionSummary.overallReflectionQuality,
    },
    confidence: output.reflectionSummary.overallReflectionQuality / 100,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

**Line:** 497

**Code:**
```typescript
eventBus.publish({
  id: `recommendation-improved-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      improvedRecommendations: output.recommendationReview.recommendations.filter(r => r.improvementSuggestion),
    },
    confidence: 0.8,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

**Line:** 513

**Code:**
```typescript
eventBus.publish({
  id: `blind-spot-detected-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      blindSpots: output.blindSpotDetection.blindSpots,
      priorityBlindSpots: output.blindSpotDetection.priorityBlindSpots,
    },
    confidence: 0.7,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

**Line:** 530

**Code:**
```typescript
eventBus.publish({
  id: `alternative-generated-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      alternatives: output.alternativeAnalysis.alternatives,
      preferredChoice: output.alternativeAnalysis.preferredChoice,
    },
    confidence: 0.8,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

**Line:** 547

**Code:**
```typescript
eventBus.publish({
  id: `confidence-recalibrated-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      calibrations: output.confidenceCalibration.calibrations,
      overallConfidence: output.confidenceCalibration.overallConfidence,
    },
    confidence: 0.9,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

**Line:** 564

**Code:**
```typescript
eventBus.publish({
  id: `evidence-strengthened-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      conclusionsNeedingStrengthening: output.evidenceReview.conclusions.filter(c => c.needsStrengthening),
      overallEvidenceQuality: output.evidenceReview.overallEvidenceQuality,
    },
    confidence: 0.8,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

**Line:** 580

**Code:**
```typescript
eventBus.publish({
  id: `reflection-updated-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "career-copilot-reflection-intelligence",
    observationType: "career",
    data: {
      reflectionSummary: output.reflectionSummary,
      explainability: output.explainability,
    },
    confidence: output.explainability.finalConfidence / 100,
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

## Legacy Engine 3: recommendationsAIEngine.ts

**File:** `c:\Trajectoire\core\intelligence\engines\recommendationsAIEngine.ts`

### Evidence 1: aiOrchestrator Import

**Line:** 1

**Code:**
```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";
```

**Reason:** Imports legacy aiOrchestrator instead of intelligenceCoreModule

**Impact:** Engine depends on legacy orchestration layer

---

### Evidence 2: aiOrchestrator Usage

**Line:** 61

**Code:**
```typescript
const result = await aiOrchestrator.execute(
  recommendationsV1,
  {
    candidateProfile: input.candidateProfile,
    assessmentResults: input.assessmentResults,
    careerGoals: input.careerGoals,
    marketContext: input.marketContext,
    historicalInsights: input.historicalInsights?.join(", ") || historicalInsights.join(", "),
    previousRecommendations: input.previousRecommendations?.join(", ") || previousRecommendations.join(", "),
    knownPatterns: input.knownPatterns?.join(", ") || knownPatterns.join(", "),
  },
  {
    provider: "openai",
    model: "gpt-4-turbo",
    promptId: "recommendations",
    promptVersion: "v1",
    temperature: 0.7,
    maxTokens: 2000,
  }
);
```

**Reason:** Active usage of legacy aiOrchestrator.execute method

**Impact:** Engine executes AI through legacy orchestration layer

---

### Evidence 3: eventBus Import

**Line:** 3

**Code:**
```typescript
import { eventBus } from "../../ai/events/EventBus";
```

**Reason:** Imports legacy eventBus instead of EventPublisher

**Impact:** Engine depends on legacy event system

---

### Evidence 4: eventBus Usage

**Line:** 108

**Code:**
```typescript
await eventBus.publish<RecommendationGeneratedEvent>({
  id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date(),
  type: "recommendation_generated",
  payload: {
    candidateId: input.candidateId,
    recommendations: result.data,
    metrics: {
      latency: result.metrics?.latency || 0,
      tokens: result.metrics?.totalTokens || 0,
      cost: result.metrics?.cost || 0,
    },
  },
});
```

**Reason:** Active usage of legacy eventBus.publish method

**Impact:** Engine publishes events through legacy event system

---

### Evidence 5: RecommendationGeneratedEvent Import

**Line:** 4

**Code:**
```typescript
import { RecommendationGeneratedEvent } from "../../ai/events/BrainEvents";
```

**Reason:** Imports legacy event type

**Impact:** Engine uses legacy event type definitions

---

### Evidence 6: RecommendationGeneratedEvent Usage

**Line:** 108-121

**Code:**
```typescript
await eventBus.publish<RecommendationGeneratedEvent>({
  id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date(),
  type: "recommendation_generated",
  payload: {
    candidateId: input.candidateId,
    recommendations: result.data,
    metrics: {
      latency: result.metrics?.latency || 0,
      tokens: result.metrics?.totalTokens || 0,
      cost: result.metrics?.cost || 0,
    },
  },
});
```

**Reason:** Active usage of legacy event type

**Impact:** Engine creates legacy event objects

---

## Summary

**Total Legacy Engines:** 3

**Total Legacy Evidence Points:** 18

**Evidence Distribution:**
- careerCopilotProactiveEngine.ts: 6 evidence points
- careerCopilotReflectionIntelligenceEngine.ts: 8 evidence points
- recommendationsAIEngine.ts: 4 evidence points

**Legacy Components Used:**
- aiOrchestrator: 3 engines
- eventBus: 3 engines
- ObservationCreatedEvent: 1 engine
- RecommendationGeneratedEvent: 1 engine

**Active Legacy Code:** All evidence points represent active code execution, not comments or dead code

---

**Report Generated:** 2026-07-14  
**Generated By:** Cascade AI Assistant  
**Sprint:** 6.28  
**Methodology:** Exact code evidence with line numbers
