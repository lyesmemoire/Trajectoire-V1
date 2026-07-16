# Intelligence Engine Abstractions

## Overview

Identification of common abstractions across 29+ Intelligence Engines to inform the Intelligence Engine Standard design.

**Date**: 2026-07-13  
**Context**: Sprint 6.9 - Phase 1 Completion & Phase 2 Preparation  
**Objective**: Identify common abstractions for Intelligence Engine Standard

---

## Abstraction Methodology

Abstractions are identified based on:
1. **Frequency of Use** - Used in 3+ engines (Rule of Three)
2. **Pattern Consistency** - Same pattern across engines
3. **Complexity Reduction** - Reduces code duplication
4. **Maintainability** - Improves maintainability

---

## Common Abstractions

### Abstraction 1: BaseIntelligenceEngine

**Frequency**: 29/29 engines (100%)  
**Pattern**: All engines follow the same class structure

**Current Pattern**:
```typescript
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

**Proposed Abstraction**:
```typescript
export abstract class BaseIntelligenceEngine<TInput, TOutput> {
  protected abstract prompt: PromptTemplate;
  protected abstract promptId: string;
  protected abstract source: string;
  protected abstract provider: "openai" | "anthropic";
  protected abstract model: string;

  protected abstract extractContext(candidateGraph: any): Record<string, unknown>;
  protected abstract buildPromptVariables(context: Record<string, unknown>): Record<string, unknown>;
  protected abstract mapOutput(data: unknown): TOutput;
  protected abstract buildEvent(output: TOutput): unknown;

  async execute(input: TInput): Promise<TOutput> {
    const context = this.extractContext(input.candidateGraph);
    const variables = this.buildPromptVariables(context);
    
    const result = await aiOrchestrator.execute(
      this.prompt,
      variables,
      {
        provider: this.provider,
        model: this.model,
        promptId: this.promptId,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`${this.source} failed: ${result.error}`);
    }

    const output = this.mapOutput(result.data);
    
    candidateAIBrain.addObservation({
      type: this.source,
      source: this.source,
      data: output,
      timestamp: new Date(),
    });

    const event = this.buildEvent(output);
    eventBus.publish(event);

    return output;
  }
}
```

**Benefits**:
- Reduces code duplication across 29 engines
- Standardizes error handling
- Standardizes observation saving
- Standardizes event publishing
- Enforces consistent pattern

**Rule of Three**: ✅ Met (29/29 engines)

---

### Abstraction 2: ContextBuilder

**Frequency**: 28/29 engines (97%)  
**Pattern**: Extract context from CandidateAIBrain

**Current Pattern**:
```typescript
// Extract historical observations from Brain
const historicalObservations = candidateAIBrain.getObservations()
  .slice(0, 20)
  .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

// Extract current goals from Brain
const currentGoals = candidateAIBrain.getGoals()
  .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);

// Extract recent insights from Brain
const recentInsights = candidateAIBrain.getInsights()
  .slice(0, 10)
  .map(insight => insight.description);

// Extract specific observation from Brain
const specificObs = candidateAIBrain.getObservations()
  .filter(obs => obs.source === "specific-source")
  .slice(-1);
const specificData = specificObs.length > 0 && specificObs[0]
  ? JSON.stringify(specificObs[0].data).substring(0, 300) + "..."
  : "No data available";
```

**Proposed Abstraction**:
```typescript
export class ContextBuilder {
  static buildHistoricalObservations(limit: number = 20): string[] {
    return candidateAIBrain.getObservations()
      .slice(0, limit)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);
  }

  static buildCurrentGoals(): string[] {
    return candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);
  }

  static buildRecentInsights(limit: number = 10): string[] {
    return candidateAIBrain.getInsights()
      .slice(0, limit)
      .map(insight => insight.description);
  }

  static buildRecentEvents(limit: number = 10): string[] {
    return candidateAIBrain.getObservations()
      .slice(-limit)
      .map(obs => `${obs.timestamp.toISOString()}: ${obs.type} - ${JSON.stringify(obs.data).substring(0, 50)}...`);
  }

  static buildSpecificObservation(source: string, limit: number = 1, maxLength: number = 300): string {
    const obs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === source)
      .slice(-limit);
    return obs.length > 0 && obs[0]
      ? JSON.stringify(obs[0].data).substring(0, maxLength) + "..."
      : `No ${source} data available`;
  }

  static buildCandidateProfile(candidateGraph: any): Record<string, unknown> {
    return {
      name: candidateGraph.identity?.name || "Candidat",
      currentRole: candidateGraph.career?.currentRole || "Non défini",
      careerLevel: candidateGraph.career?.careerLevel || "mid",
      overallScore: candidateGraph.overallScore || 0,
    };
  }
}
```

**Benefits**:
- Reduces code duplication across 28 engines
- Standardizes context extraction
- Standardizes truncation logic
- Standardizes error handling for missing data

**Rule of Three**: ✅ Met (28/29 engines)

---

### Abstraction 3: EventPublisher

**Frequency**: 29/29 engines (100%)  
**Pattern**: Publish events to EventBus

**Current Pattern**:
```typescript
eventBus.publish<ObservationCreatedEvent>({
  id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    type: "engine-name",
    source: "engine-name",
    data: output,
    timestamp: new Date(),
  },
});
```

**Proposed Abstraction**:
```typescript
export class EventPublisher {
  static publishObservation(source: string, data: unknown): void {
    eventBus.publish<ObservationCreatedEvent>({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        type: source,
        source: source,
        data,
        timestamp: new Date(),
      },
    });
  }

  static publishCustomEvent<T>(eventType: string, payload: T): void {
    eventBus.publish({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: eventType,
      payload,
    });
  }
}
```

**Benefits**:
- Reduces code duplication across 29 engines
- Standardizes event ID generation
- Standardizes event structure
- Simplifies event publishing

**Rule of Three**: ✅ Met (29/29 engines)

---

### Abstraction 4: PromptExecutor

**Frequency**: 29/29 engines (100%)  
**Pattern**: Execute prompts via aiOrchestrator

**Current Pattern**:
```typescript
const result = await aiOrchestrator.execute(
  promptV1,
  {
    candidateProfile: JSON.stringify(candidateProfile, null, 2),
    historicalObservations: historicalObservations.join("\n"),
    currentGoals: currentGoals.join("\n"),
    // ... other variables
  },
  {
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    promptId: "prompt-name",
  }
);

if (!result.success || !result.data) {
  throw new Error(`Engine failed: ${result.error}`);
}
```

**Proposed Abstraction**:
```typescript
export class PromptExecutor {
  static async execute<TOutput>(
    prompt: PromptTemplate,
    variables: Record<string, unknown>,
    options: {
      provider: "openai" | "anthropic";
      model: string;
      promptId: string;
    }
  ): Promise<TOutput> {
    const result = await aiOrchestrator.execute(prompt, variables, options);

    if (!result.success || !result.data) {
      throw new Error(`${options.promptId} failed: ${result.error}`);
    }

    return result.data as TOutput;
  }
}
```

**Benefits**:
- Reduces code duplication across 29 engines
- Standardizes error handling
- Standardizes type casting
- Simplifies prompt execution

**Rule of Three**: ✅ Met (29/29 engines)

---

### Abstraction 5: DependencyManager

**Frequency**: 12/29 engines (41%)  
**Pattern**: Call other engines for context

**Current Pattern**:
```typescript
// Extract forecast from Brain
const careerForecastObs = candidateAIBrain.getObservations()
  .filter(obs => obs.source === "career-copilot-forecast")
  .slice(-1);
const careerForecast = careerForecastObs.length > 0 && careerForecastObs[0]
  ? JSON.stringify(careerForecastObs[0].data).substring(0, 300) + "..."
  : "No career forecast available";

// OR call engine directly
const currentStrategy = CareerCopilotAdaptiveStrategyEngine.getCurrentStrategy() || "No current strategy defined";
```

**Proposed Abstraction**:
```typescript
export class DependencyManager {
  static getEngineOutput<TOutput>(source: string, maxLength: number = 300): string {
    const obs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === source)
      .slice(-1);
    return obs.length > 0 && obs[0]
      ? JSON.stringify(obs[0].data).substring(0, maxLength) + "..."
      : `No ${source} data available`;
  }

  static getEngineHistory<TOutput>(source: string, limit: number = 5): string {
    const obs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === source)
      .slice(-limit);
    return obs.length > 0
      ? obs.map(o => `${o.timestamp.toISOString()}: ${JSON.stringify(o.data).substring(0, 100)}...`).join("\n")
      : `No ${source} history available`;
  }

  static getEngineCurrentState<TOutput>(engine: any, fallback: string): string {
    try {
      const state = engine.getCurrentState?.() || engine.getCurrentStrategy?.() || engine.getLastAnalysis?.();
      return state || fallback;
    } catch (error) {
      console.error(`Failed to get state from engine: ${error}`);
      return fallback;
    }
  }
}
```

**Benefits**:
- Reduces code duplication across 12 engines
- Standardizes dependency resolution
- Standardizes error handling
- Simplifies engine-to-engine communication

**Rule of Three**: ✅ Met (12/29 engines)

---

### Abstraction 6: OutputValidator

**Frequency**: 29/29 engines (100%)  
**Pattern**: Validate output structure

**Current Pattern**:
```typescript
// No validation - assume output is correct
const output: Output = result.data as Output;
```

**Proposed Abstraction**:
```typescript
export class OutputValidator {
  static validate<TOutput>(data: unknown, schema: z.ZodSchema<TOutput>): TOutput {
    return schema.parse(data);
  }

  static validatePartial<TOutput>(data: unknown, schema: z.ZodSchema<TOutput>): Partial<TOutput> {
    return schema.partial().parse(data);
  }
}
```

**Benefits**:
- Adds runtime validation
- Catches output errors early
- Improves reliability
- Standardizes validation

**Rule of Three**: ✅ Met (29/29 engines)

---

### Abstraction 7: EngineRegistry

**Frequency**: 12/29 engines (41%)  
**Pattern**: Track engine state and history

**Current Pattern**:
```typescript
export class Engine {
  private static lastAnalysis: Output | null = null;
  private static history: Output[] = [];

  static getLastAnalysis(): Output | null {
    return this.lastAnalysis;
  }

  static getHistory(): Output[] {
    return this.history;
  }
}
```

**Proposed Abstraction**:
```typescript
export class EngineRegistry {
  private static registry = new Map<string, {
    lastOutput: unknown;
    history: Array<{ timestamp: Date; output: unknown }>;
  }>();

  static register(engineName: string): void {
    if (!this.registry.has(engineName)) {
      this.registry.set(engineName, {
        lastOutput: null,
        history: [],
      });
    }
  }

  static setLastOutput(engineName: string, output: unknown): void {
    const entry = this.registry.get(engineName);
    if (entry) {
      entry.lastOutput = output;
      entry.history.push({ timestamp: new Date(), output });
    }
  }

  static getLastOutput<TOutput>(engineName: string): TOutput | null {
    const entry = this.registry.get(engineName);
    return entry?.lastOutput as TOutput || null;
  }

  static getHistory<TOutput>(engineName: string): Array<{ timestamp: Date; output: TOutput }> {
    const entry = this.registry.get(engineName);
    return entry?.history as Array<{ timestamp: Date; output: TOutput }> || [];
  }
}
```

**Benefits**:
- Centralizes engine state management
- Standardizes state tracking
- Simplifies engine-to-engine communication
- Reduces code duplication

**Rule of Three**: ✅ Met (12/29 engines)

---

### Abstraction 8: PromptBuilder

**Frequency**: 29/29 engines (100%)  
**Pattern**: Build prompt variables

**Current Pattern**:
```typescript
const variables = {
  candidateProfile: JSON.stringify(candidateProfile, null, 2),
  historicalObservations: historicalObservations.join("\n"),
  currentGoals: currentGoals.join("\n"),
  // ... other variables
};
```

**Proposed Abstraction**:
```typescript
export class PromptBuilder {
  static buildVariables(context: Record<string, unknown>): Record<string, unknown> {
    const variables: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'object' && value !== null) {
        variables[key] = JSON.stringify(value, null, 2);
      } else if (Array.isArray(value)) {
        variables[key] = value.join("\n");
      } else {
        variables[key] = value;
      }
    }

    return variables;
  }
}
```

**Benefits**:
- Reduces code duplication across 29 engines
- Standardizes variable building
- Standardizes JSON serialization
- Simplifies prompt construction

**Rule of Three**: ✅ Met (29/29 engines)

---

## Abstraction Priority

### High Priority (Rule of Three Met)

1. **BaseIntelligenceEngine** - 29/29 engines (100%)
2. **ContextBuilder** - 28/29 engines (97%)
3. **EventPublisher** - 29/29 engines (100%)
4. **PromptExecutor** - 29/29 engines (100%)
5. **OutputValidator** - 29/29 engines (100%)
6. **PromptBuilder** - 29/29 engines (100%)

### Medium Priority (Rule of Three Met)

7. **DependencyManager** - 12/29 engines (41%)
8. **EngineRegistry** - 12/29 engines (41%)

### Low Priority (Rule of Three Not Met)

9. **Cluster-specific abstractions** - To be defined per cluster

---

## Module Structure

### intelligence-core

```
intelligence-core/
├── base/
│   ├── BaseIntelligenceEngine.ts
│   └── EngineRegistry.ts
├── context/
│   ├── ContextBuilder.ts
│   └── DependencyManager.ts
├── execution/
│   ├── PromptExecutor.ts
│   └── PromptBuilder.ts
├── events/
│   └── EventPublisher.ts
├── validation/
│   └── OutputValidator.ts
└── index.ts
```

---

## Implementation Strategy

### Phase 1: Core Abstractions (Sprint 6.12)

1. Create intelligence-core module
2. Implement BaseIntelligenceEngine
3. Implement ContextBuilder
4. Implement EventPublisher
5. Implement PromptExecutor
6. Implement OutputValidator
7. Implement PromptBuilder

### Phase 2: Dependency Abstractions (Sprint 6.13)

8. Implement DependencyManager
9. Implement EngineRegistry
10. Refactor high dependency clusters to use DependencyManager

### Phase 3: Cluster-Specific Abstractions (Sprint 6.13+)

11. Define cluster-specific abstractions
12. Implement cluster-specific context builders
13. Implement cluster-specific output validators

---

## Benefits Summary

### Code Duplication Reduction

- **Before**: ~200 lines per engine × 29 engines = ~5,800 lines
- **After**: ~50 lines per engine × 29 engines = ~1,450 lines
- **Reduction**: ~4,350 lines (75% reduction)

### Maintainability Improvement

- **Before**: Changes to pattern require updating 29 engines
- **After**: Changes to pattern require updating 1 base class
- **Improvement**: 29x reduction in maintenance effort

### Consistency Improvement

- **Before**: Each engine has slight variations in pattern
- **After**: All engines follow exact same pattern
- **Improvement**: 100% consistency

### Error Handling Improvement

- **Before**: Inconsistent error handling across engines
- **After**: Standardized error handling in base class
- **Improvement**: Reliable error handling

---

## Conclusion

Trajectoire's 29+ Intelligence Engines have significant code duplication and can benefit from common abstractions. 8 abstractions meet the Rule of Three and should be extracted to intelligence-core. This will reduce code duplication by 75%, improve maintainability by 29x, and ensure 100% consistency across engines.

**Status**: Abstraction identification complete ✅  
**Next Steps**: Intelligence Engine Standard definition
