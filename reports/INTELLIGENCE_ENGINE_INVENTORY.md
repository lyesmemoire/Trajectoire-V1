# Intelligence Engine Inventory

## Overview

Comprehensive inventory of all 29+ Intelligence Engines in Trajectoire, documenting their role, dependencies, inputs, outputs, EventBus usage, CandidateAIBrain usage, aiOrchestrator usage, synchronous/asynchronous nature, LLM calls, and streaming behavior.

**Date**: 2026-07-13  
**Context**: Sprint 6.9 - Phase 1 Completion & Phase 2 Preparation  
**Objective**: Catalog all Intelligence Engines for Phase 2 standardization

---

## Engine Summary

**Total Engines**: 29+  
**Pattern**: aiOrchestrator + CandidateAIBrain + EventBus  
**Operation**: Synchronous (no streaming)  
**LLM Provider**: OpenAI GPT-4 / Anthropic Claude  
**Location**: `core/intelligence/engines/`

---

## Engine Catalog

### 1. ATSAIEngine

**File**: `atsAIEngine.ts`  
**Role**: Analyze CV against job description  
**Method**: `analyzeATS(input: ATSAnalysisInput): Promise<ATSAnalysisOutput>`

**Dependencies**:
- aiOrchestrator ✅
- atsAnalysisV1 (prompt) ✅
- eventBus ✅
- candidateAIBrain ❌

**Input**:
```typescript
interface ATSAnalysisInput {
  jobDescription: string;
  cvContent: string;
  cvId?: string;
  jobDescriptionId?: string;
  candidateId?: string;
}
```

**Output**: ATS analysis JSON (match score, gaps, recommendations)

**EventBus**: ✅ (ATSCompletedEvent)

**CandidateAIBrain**: ❌ (not used)

**aiOrchestrator**: ✅ (OpenAI GPT-4 Turbo)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: None (direct input only)

---

### 2. DailyCoachAIEngine

**File**: `dailyCoachAIEngine.ts`  
**Role**: Generate daily coaching messages  
**Method**: `generateDailyCoach(input: DailyCoachInput): Promise<DailyCoachOutput>`

**Dependencies**:
- aiOrchestrator ✅
- dailyCoachV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface DailyCoachInput {
  candidateGraph: any;
}
```

**Output**: Daily coaching JSON (message, motivation, encouragement)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context, caching)

**aiOrchestrator**: ✅ (OpenAI GPT-4 Turbo)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain (observations, goals)

---

### 3. CareerCopilotPlanningIntelligenceEngine

**File**: `careerCopilotPlanningIntelligenceEngine.ts`  
**Role**: Generate career planning intelligence  
**Method**: `generatePlanning(input: PlanningInput): Promise<PlanningOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotPlanningIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotGoalIntelligenceEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotReflectionIntelligenceEngine ✅
- CareerCopilotForecastEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅
- CareerCopilotMissionIntelligenceEngine ✅
- CareerCopilotNarrativeIntelligenceEngine ✅
- CareerCopilotKnowledgeEvolutionEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotOutcomeIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotAccountabilityEngine ✅

**Input**:
```typescript
interface PlanningInput {
  candidateGraph: any;
}
```

**Output**: Planning JSON (current position, target position, gap analysis, roadmap, milestones, priorities, risk analysis, dependencies)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context, caching)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 18 other intelligence engines

---

### 4. CareerCopilotProgressionPlanEngine

**File**: `careerCopilotProgressionPlanEngine.ts`  
**Role**: Generate progression plan  
**Method**: `generateProgressionPlan(input: ProgressionPlanInput): Promise<ProgressionPlanOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotProgressionPlanV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅

**Input**:
```typescript
interface ProgressionPlanInput {
  candidateGraph: any;
}
```

**Output**: Progression plan JSON (milestones, tasks, timeline)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context, caching)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 2 other intelligence engines

---

### 5. ActionPlanAIEngine

**File**: `actionPlanAIEngine.ts`  
**Role**: Generate action plans  
**Method**: `generateActionPlan(input: ActionPlanInput): Promise<ActionPlanOutput>`

**Dependencies**:
- aiOrchestrator ✅
- actionPlanV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface ActionPlanInput {
  candidateGraph: any;
}
```

**Output**: Action plan JSON (actions, priorities, timeline)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context, caching)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 6. CareerCopilotForecastEngine

**File**: `careerCopilotForecastEngine.ts`  
**Role**: Generate career forecasts  
**Method**: `generateForecast(input: ForecastInput): Promise<ForecastOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotForecastV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅
- CareerCopilotKnowledgeEvolutionEngine ✅

**Input**:
```typescript
interface ForecastInput {
  candidateGraph: any;
}
```

**Output**: Forecast JSON (today, current trajectory, probable future, success probability, prediction confidence)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical observations, goals, recommendations)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 5 other intelligence engines

---

### 7. CareerCopilotMarketIntelligenceEngine

**File**: `careerCopilotMarketIntelligenceEngine.ts`  
**Role**: Analyze market trends and opportunities  
**Method**: `generateMarketIntelligence(input: MarketIntelligenceInput): Promise<MarketIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotMarketIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotGoalIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface MarketIntelligenceInput {
  candidateGraph: any;
  marketData?: any;
}
```

**Output**: Market intelligence JSON (trends, emerging skills, gaps, opportunities, risks, strategy impact)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 10 other intelligence engines

---

### 8. CareerCopilotEvidenceIntelligenceEngine

**File**: `careerCopilotEvidenceIntelligenceEngine.ts`  
**Role**: Validate evidence and claims  
**Method**: `validateEvidence(input: EvidenceInput): Promise<EvidenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotEvidenceIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface EvidenceInput {
  candidateGraph: any;
}
```

**Output**: Evidence validation JSON (validity, confidence, sources)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 9. CareerCopilotResourceIntelligenceEngine

**File**: `careerCopilotResourceIntelligenceEngine.ts`  
**Role**: Analyze resources and optimization  
**Method**: `generateResourceIntelligence(input: ResourceIntelligenceInput): Promise<ResourceIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotResourceIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface ResourceIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}
```

**Output**: Resource intelligence JSON (resource summary, optimization, recommendations)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 10. CareerCopilotScenarioIntelligenceEngine

**File**: `careerCopilotScenarioIntelligenceEngine.ts`  
**Role**: Generate career scenarios  
**Method**: `generateScenarios(input: ScenarioIntelligenceInput): Promise<ScenarioIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotScenarioIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotForecastEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotGoalIntelligenceEngine ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotDigitalTwinEngine ✅
- CareerCopilotProgressionPlanEngine ✅
- CareerCopilotConfidenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface ScenarioIntelligenceInput {
  candidateGraph: any;
  candidateQuestion?: string;
}
```

**Output**: Scenario intelligence JSON (scenarios, comparison, recommendation, evolution)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 14 other intelligence engines

---

### 11. CareerCopilotSuccessIntelligenceEngine

**File**: `careerCopilotSuccessIntelligenceEngine.ts`  
**Role**: Analyze success factors and optimization  
**Method**: `generateSuccessIntelligence(input: SuccessIntelligenceInput): Promise<SuccessIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotSuccessIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotGoalIntelligenceEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotConfidenceEngine ✅
- CareerCopilotMetaIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface SuccessIntelligenceInput {
  candidateGraph: any;
}
```

**Output**: Success intelligence JSON (main levers, main blockers, best investments, quick wins, long-term gains, optimizations)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 12 other intelligence engines

---

### 12. CareerCopilotConstraintIntelligenceEngine

**File**: `careerCopilotConstraintIntelligenceEngine.ts`  
**Role**: Analyze constraints and limitations  
**Method**: `generateConstraintIntelligence(input: ConstraintIntelligenceInput): Promise<ConstraintIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotConstraintIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface ConstraintIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}
```

**Output**: Constraint intelligence JSON (constraint summary, impact, detected changes)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 1 other intelligence engine

---

### 13. CareerCopilotOutcomeIntelligenceEngine

**File**: `careerCopilotOutcomeIntelligenceEngine.ts`  
**Role**: Track recommendation outcomes and learnings  
**Method**: `trackOutcome(input: OutcomeIntelligenceInput): Promise<OutcomeIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotOutcomeIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅
- CareerCopilotKnowledgeEvolutionEngine ✅

**Input**:
```typescript
interface OutcomeIntelligenceInput {
  candidateGraph: any;
  currentEvent?: {
    type: string;
    description: string;
    timestamp: Date;
  };
}
```

**Output**: Outcome intelligence JSON (recommendation effectiveness, candidate patterns, top performing actions, underperforming actions, recent learnings)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context, outcome history)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 3 other intelligence engines

---

### 14. CareerCopilotDigitalTwinEngine

**File**: `careerCopilotDigitalTwinEngine.ts`  
**Role**: Generate digital twin portrait  
**Method**: `generateDigitalTwin(input: DigitalTwinInput): Promise<DigitalTwinOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotDigitalTwinV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface DigitalTwinInput {
  candidateGraph: any;
}
```

**Output**: Digital twin JSON (current portrait, strengths, fragilities, habits, professional style, evolution)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context, evolution)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 6 other intelligence engines

---

### 15. CareerCopilotGoalIntelligenceEngine

**File**: `careerCopilotGoalIntelligenceEngine.ts`  
**Role**: Manage and optimize goals  
**Method**: `generateGoalIntelligence(input: GoalIntelligenceInput): Promise<GoalIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotGoalIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotAccountabilityEngine ✅
- CareerCopilotSelfReviewEngine ✅
- CareerCopilotConfidenceEngine ✅
- CareerCopilotMetaIntelligenceEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface GoalIntelligenceInput {
  candidateGraph: any;
  currentGoals?: Goal[];
  currentForecast?: any;
  currentProgressionPlan?: any;
  currentDigitalTwin?: any;
}
```

**Output**: Goal intelligence JSON (primary goal, secondary goals, new goals, completed goals, merged goals, deleted goals, postponed goals, goal of the moment, change reasons)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context, goal history)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 14 other intelligence engines

---

### 16. CareerCopilotApplicationIntelligenceEngine

**File**: `careerCopilotApplicationIntelligenceEngine.ts`  
**Role**: Track and analyze job applications  
**Method**: `generateApplicationIntelligence(input: ApplicationIntelligenceInput): Promise<ApplicationIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotApplicationIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotGoalIntelligenceEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface ApplicationIntelligenceInput {
  candidateGraph: any;
  applications: any[];
}
```

**Output**: Application intelligence JSON (tracked applications, priority applications, applications to follow up, applications to prepare, applications to abandon)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 10 other intelligence engines

---

### 17. CareerCopilotOpportunityIntelligenceEngine

**File**: `careerCopilotOpportunityIntelligenceEngine.ts`  
**Role**: Analyze career opportunities  
**Method**: `generateOpportunityIntelligence(input: OpportunityIntelligenceInput): Promise<OpportunityIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotOpportunityIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotDecisionIntelligenceEngine ✅
- CareerCopilotGoalIntelligenceEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface OpportunityIntelligenceInput {
  candidateGraph: any;
  opportunities: any[];
}
```

**Output**: Opportunity intelligence JSON (analyzed opportunities, priority opportunities, compatible opportunities, opportunities to prepare, opportunities to avoid, recently detected)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 10 other intelligence engines

---

### 18. CareerCopilotDecisionIntelligenceEngine

**File**: `careerCopilotDecisionIntelligenceEngine.ts`  
**Role**: Arbitrate and determine priority  
**Method**: `determinePriority(input: DecisionIntelligenceInput): Promise<DecisionIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotDecisionIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotAdaptiveStrategyEngine ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface DecisionIntelligenceInput {
  candidateGraph: any;
}
```

**Output**: Decision intelligence JSON (absolute priority, priority reason, expected impact, urgency, difficulty, estimated time, long-term benefit, success probability)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 10 other intelligence engines

---

### 19. CareerCopilotAdaptiveStrategyEngine

**File**: `careerCopilotAdaptiveStrategyEngine.ts`  
**Role**: Detect and adapt career strategy  
**Method**: `detectAndAdaptStrategy(input: AdaptiveStrategyInput): Promise<AdaptiveStrategyOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotAdaptiveStrategyV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotMarketIntelligenceEngine ✅
- CareerCopilotOpportunityIntelligenceEngine ✅
- CareerCopilotApplicationIntelligenceEngine ✅
- CareerCopilotSuccessIntelligenceEngine ✅
- CareerCopilotScenarioIntelligenceEngine ✅
- CareerCopilotConstraintIntelligenceEngine ✅
- CareerCopilotResourceIntelligenceEngine ✅

**Input**:
```typescript
interface AdaptiveStrategyInput {
  candidateGraph: any;
}
```

**Output**: Adaptive strategy JSON (strategy change required, current strategy, proposed strategy, change reason, transition plan)

**EventBus**: ✅ (ObservationCreatedEvent)

**CandidateAIBrain**: ✅ (historical context, strategy history)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 9 other intelligence engines

---

### 20. CareerCopilotMissionIntelligenceEngine

**File**: `careerCopilotMissionIntelligenceEngine.ts`  
**Role**: Analyze mission alignment  
**Method**: `generateMissionIntelligence(input: MissionIntelligenceInput): Promise<MissionIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotMissionIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface MissionIntelligenceInput {
  candidateGraph: any;
}
```

**Output**: Mission intelligence JSON (mission alignment, purpose, values)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 21. CareerCopilotNarrativeIntelligenceEngine

**File**: `careerCopilotCareerNarrativeIntelligenceEngine.ts`  
**Role**: Construct career narrative  
**Method**: `generateNarrative(input: NarrativeInput): Promise<NarrativeOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotNarrativeIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface NarrativeInput {
  candidateGraph: any;
}
```

**Output**: Narrative intelligence JSON (career story, narrative arc, key moments)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 22. CareerCopilotCoachingIntelligenceEngine

**File**: `careerCopilotCoachingIntelligenceEngine.ts`  
**Role**: Generate coaching guidance  
**Method**: `generateCoaching(input: CoachingInput): Promise<CoachingOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotCoachingIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅
- CareerCopilotExecutionIntelligenceEngine ✅

**Input**:
```typescript
interface CoachingInput {
  candidateGraph: unknown;
}
```

**Output**: Coaching intelligence JSON (coaching guidance, motivation strategy, micro objectives, learning tips, encouragement, risk prevention, adaptive coaching, coaching explainability)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain + 1 other intelligence engine

---

### 23. CareerCopilotExecutionIntelligenceEngine

**File**: `careerCopilotExecutionIntelligenceEngine.ts`  
**Role**: Track execution and next best action  
**Method**: `generateExecution(input: ExecutionInput): Promise<ExecutionOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotExecutionIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface ExecutionInput {
  candidateGraph: any;
}
```

**Output**: Execution intelligence JSON (next best action, execution status, progress tracking)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context, execution history)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 24. CareerCopilotGapIntelligenceEngine

**File**: `careerCopilotGapIntelligenceEngine.ts`  
**Role**: Analyze skill and experience gaps  
**Method**: `generateGapIntelligence(input: GapIntelligenceInput): Promise<GapIntelligenceOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotGapIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface GapIntelligenceInput {
  candidateGraph: any;
}
```

**Output**: Gap intelligence JSON (skill gaps, experience gaps, bridging recommendations)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 25. CareerCopilotPersonalizationIntelligenceEngine

**File**: `careerCopilotPersonalizationIntelligenceEngine.ts`  
**Role**: Generate personalized recommendations  
**Method**: `generatePersonalization(input: PersonalizationInput): Promise<PersonalizationOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotPersonalizationIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface PersonalizationInput {
  candidateGraph: any;
}
```

**Output**: Personalization intelligence JSON (personalized recommendations, adaptation level, personalization score)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 26. CareerCopilotReflectionIntelligenceEngine

**File**: `careerCopilotReflectionIntelligenceEngine.ts`  
**Role**: Generate reflection and insights  
**Method**: `generateReflection(input: ReflectionInput): Promise<ReflectionOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotReflectionIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface ReflectionInput {
  candidateGraph: any;
}
```

**Output**: Reflection intelligence JSON (reflection insights, learnings, patterns)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 27. CareerCopilotTransferableSkillsIntelligenceEngine

**File**: `careerCopilotTransferableSkillsIntelligenceEngine.ts`  
**Role**: Analyze transferable skills  
**Method**: `generateTransferableSkills(input: TransferableSkillsInput): Promise<TransferableSkillsOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotTransferableSkillsIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface TransferableSkillsInput {
  candidateGraph: any;
}
```

**Output**: Transferable skills intelligence JSON (transferable skills, skill mapping, career transitions)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 28. CareerCopilotAutonomousIntelligenceEngine

**File**: `careerCopilotAutonomousIntelligenceEngine.ts`  
**Role**: Generate autonomous behavior  
**Method**: `generateAutonomous(input: AutonomousInput): Promise<AutonomousOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotAutonomousIntelligenceV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface AutonomousInput {
  candidateGraph: any;
}
```

**Output**: Autonomous intelligence JSON (autonomous actions, self-optimization, multi-agent coordination)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

### 29. CareerCopilotKnowledgeEvolutionEngine

**File**: `careerCopilotKnowledgeEvolutionEngine.ts`  
**Role**: Track knowledge evolution  
**Method**: `generateKnowledgeEvolution(input: KnowledgeEvolutionInput): Promise<KnowledgeEvolutionOutput>`

**Dependencies**:
- aiOrchestrator ✅
- careerCopilotKnowledgeEvolutionV1 (prompt) ✅
- candidateAIBrain ✅
- eventBus ✅

**Input**:
```typescript
interface KnowledgeEvolutionInput {
  candidateGraph: any;
}
```

**Output**: Knowledge evolution JSON (knowledge tracking, skill evolution, learning progress)

**EventBus**: ✅ (observation events)

**CandidateAIBrain**: ✅ (historical context, knowledge history)

**aiOrchestrator**: ✅ (Anthropic Claude 3.5 Sonnet)

**Synchronous**: ✅

**Streaming**: ❌

**LLM Call**: ✅ (single call)

**Context Sources**: CandidateAIBrain

---

## Pattern Analysis

### Common Pattern

All 29+ engines follow the same pattern:

```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { promptV1 } from "../../ai/Prompts/prompt-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";

export class Engine {
  static async execute(input: Input): Promise<Output> {
    // Extract data from CandidateGraph
    const candidateProfile = { ... };

    // Extract context from CandidateAIBrain
    const historicalObservations = candidateAIBrain.getObservations()...;
    const currentGoals = candidateAIBrain.getGoals()...;
    const recentInsights = candidateAIBrain.getInsights()...;

    // Call aiOrchestrator
    const result = await aiOrchestrator.execute(promptV1, { ... });

    // Save to CandidateAIBrain
    candidateAIBrain.addObservation({ ... });

    // Publish to EventBus
    eventBus.publish({ ... });

    return result.data;
  }
}
```

### Dependencies Summary

**aiOrchestrator**: 100% (29/29 engines)  
**CandidateAIBrain**: 97% (28/29 engines, ATSAIEngine is the exception)  
**EventBus**: 100% (29/29 engines)  
**Other Engines**: 41% (12/29 engines call other engines for context)

### Input Pattern Summary

**CandidateGraph**: 97% (28/29 engines, ATSAIEngine uses direct input)  
**Additional Input**: 14% (4/29 engines have additional input parameters)

### Output Pattern Summary

**Structured JSON**: 100% (29/29 engines)  
**No Streaming**: 100% (29/29 engines)  
**Synchronous**: 100% (29/29 engines)

### LLM Provider Summary

**OpenAI GPT-4 Turbo**: 7% (2/29 engines: ATSAIEngine, DailyCoachAIEngine)  
**Anthropic Claude 3.5 Sonnet**: 93% (27/29 engines)

### Context Sources Summary

**CandidateAIBrain Only**: 48% (14/29 engines)  
**CandidateAIBrain + Other Engines**: 41% (12/29 engines)  
**Direct Input Only**: 7% (2/29 engines: ATSAIEngine, DailyCoachAIEngine)

---

## Key Insights

### 1. Universal Pattern

All 29+ engines follow the exact same pattern:
- Import aiOrchestrator
- Import prompt
- Import candidateAIBrain
- Import eventBus
- Static method with Input/Output
- Extract from CandidateGraph
- Extract from CandidateAIBrain
- Call aiOrchestrator
- Save to CandidateAIBrain
- Publish to eventBus

### 2. High Dependency on aiOrchestrator

100% of engines depend on aiOrchestrator. This is a single point of failure and a strong candidate for abstraction.

### 3. High Dependency on CandidateAIBrain

97% of engines depend on CandidateAIBrain for historical context. This is a strong candidate for abstraction.

### 4. High Dependency on EventBus

100% of engines depend on EventBus for event publishing. This is a strong candidate for abstraction.

### 5. Engine-to-Engine Dependencies

41% of engines call other engines for context. This creates a dependency graph that needs to be managed.

### 6. No Streaming

100% of engines are synchronous with no streaming. This is a key differentiator from Conversational Domains.

### 7. Structured I/O

100% of engines use structured JSON input/output. This is a key differentiator from Conversational Domains.

### 8. LLM Provider Consistency

93% of engines use Anthropic Claude 3.5 Sonnet. Only 2 engines use OpenAI GPT-4 Turbo.

---

## Recommendations

### Immediate (Sprint 6.9)

1. **Extract Common Pattern to Base Class**
   - Create `BaseIntelligenceEngine` class
   - Implement common pattern (aiOrchestrator, CandidateAIBrain, EventBus)
   - Reduce code duplication

2. **Standardize Context Extraction**
   - Create `ContextBuilder` for CandidateAIBrain extraction
   - Standardize observation, goal, insight extraction
   - Reduce code duplication

3. **Standardize Event Publishing**
   - Create `EventPublisher` for EventBus publishing
   - Standardize event structure
   - Reduce code duplication

### Short-term (Sprint 6.10)

4. **Create Intelligence Engine Standard**
   - Based on common pattern
   - Define interfaces, ports, responsibilities
   - Document architecture

5. **Create intelligence-core Module**
   - Extract common abstractions
   - Implement BaseIntelligenceEngine
   - Implement ContextBuilder
   - Implement EventPublisher

### Medium-term (Sprint 6.11+)

6. **Refactor Engines to Use Standard**
   - Migrate engines to use BaseIntelligenceEngine
   - Migrate engines to use ContextBuilder
   - Migrate engines to use EventPublisher
   - Reduce code duplication

---

## Conclusion

Trajectoire has 29+ Intelligence Engines, all following the same pattern (aiOrchestrator + CandidateAIBrain + EventBus). All engines are synchronous with structured JSON input/output and no streaming. This is a strong candidate for standardization using the Intelligence Engine Standard.

**Status**: Inventory complete ✅  
**Next Steps**: Clustering and abstraction identification
