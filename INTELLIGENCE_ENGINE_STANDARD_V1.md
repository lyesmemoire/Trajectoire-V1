# Intelligence Engine Standard V1

## Overview

The Intelligence Engine Standard defines the architecture, interfaces, ports, and responsibilities for Intelligence Engines in Trajectoire. This standard is based on the analysis of 29+ existing Intelligence Engines and the common abstractions identified.

**Version**: 1.0  
**Date**: 2026-07-13  
**Context**: Sprint 6.9 - Phase 1 Completion & Phase 2 Preparation  
**Status**: Proposed

---

## Scope

### In Scope

Intelligence Engines are synchronous AI components that:
- Perform structured analysis with structured input/output
- Use aiOrchestrator for LLM calls
- Use CandidateAIBrain for historical context
- Use EventBus for event publishing
- Do not use streaming
- Do not use conversational interfaces

### Out of Scope

- Conversational Domains (Career Copilot, Interview) - use AI Domain Standard
- Decision Engines - use Decision Engine Standard
- Background Agents - use Background Agent Standard
- Knowledge Services - use Knowledge Service Standard

---

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Server Actions / Route Handlers)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│  (Use Cases / Orchestration)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Domain Layer                   │
│  (Intelligence Engines)                 │
│  - BaseIntelligenceEngine               │
│  - ContextBuilder                       │
│  - DependencyManager                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Infrastructure Layer               │
│  - aiOrchestrator                       │
│  - CandidateAIBrain                     │
│  - EventBus                             │
│  - LLM Providers                        │
└─────────────────────────────────────────┘
```

### Module Structure

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

## Interfaces

### IIntelligenceEngine

```typescript
export interface IIntelligenceEngine<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
  getLastOutput(): TOutput | null;
  getHistory(): Array<{ timestamp: Date; output: TOutput }>;
}
```

### IContextBuilder

```typescript
export interface IContextBuilder {
  buildHistoricalObservations(limit?: number): string[];
  buildCurrentGoals(): string[];
  buildRecentInsights(limit?: number): string[];
  buildRecentEvents(limit?: number): string[];
  buildSpecificObservation(source: string, limit?: number, maxLength?: number): string;
  buildCandidateProfile(candidateGraph: any): Record<string, unknown>;
}
```

### IEventPublisher

```typescript
export interface IEventPublisher {
  publishObservation(source: string, data: unknown): void;
  publishCustomEvent<T>(eventType: string, payload: T): void;
}
```

### IPromptExecutor

```typescript
export interface IPromptExecutor {
  execute<TOutput>(
    prompt: PromptTemplate,
    variables: Record<string, unknown>,
    options: {
      provider: "openai" | "anthropic";
      model: string;
      promptId: string;
    }
  ): Promise<TOutput>;
}
```

### IOutputValidator

```typescript
export interface IOutputValidator {
  validate<TOutput>(data: unknown, schema: z.ZodSchema<TOutput>): TOutput;
  validatePartial<TOutput>(data: unknown, schema: z.ZodSchema<TOutput>): Partial<TOutput>;
}
```

### IDependencyManager

```typescript
export interface IDependencyManager {
  getEngineOutput<TOutput>(source: string, maxLength?: number): string;
  getEngineHistory<TOutput>(source: string, limit?: number): string;
  getEngineCurrentState<TOutput>(engine: any, fallback: string): string;
}
```

---

## Ports

### ILLMProviderPort

```typescript
export interface ILLMProviderPort {
  execute(
    prompt: string,
    variables: Record<string, unknown>,
    options: {
      provider: "openai" | "anthropic";
      model: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
    metrics?: {
      latency: number;
      totalTokens: number;
      cost: number;
    };
  }>;
}
```

### IBrainPort

```typescript
export interface IBrainPort {
  getObservations(): Observation[];
  addObservation(observation: Observation): void;
  getGoals(): Goal[];
  addGoal(goal: Goal): void;
  getInsights(): Insight[];
  addInsight(insight: Insight): void;
}
```

### IEventBusPort

```typescript
export interface IEventBusPort {
  publish<T>(event: T): Promise<void>;
  subscribe<T>(eventType: string, handler: (event: T) => void): void;
  unsubscribe(eventType: string, handler: Function): void;
}
```

---

## BaseIntelligenceEngine

### Abstract Class

```typescript
export abstract class BaseIntelligenceEngine<TInput, TOutput> implements IIntelligenceEngine<TInput, TOutput> {
  protected abstract prompt: PromptTemplate;
  protected abstract promptId: string;
  protected abstract source: string;
  protected abstract provider: "openai" | "anthropic";
  protected abstract model: string;
  protected abstract outputSchema: z.ZodSchema<TOutput>;

  protected abstract extractContext(candidateGraph: any): Record<string, unknown>;
  protected abstract buildPromptVariables(context: Record<string, unknown>): Record<string, unknown>;
  protected abstract buildEvent(output: TOutput): unknown;

  private lastOutput: TOutput | null = null;
  private history: Array<{ timestamp: Date; output: TOutput }> = [];

  async execute(input: TInput): Promise<TOutput> {
    // Extract context
    const context = this.extractContext(input.candidateGraph);
    
    // Build prompt variables
    const variables = this.buildPromptVariables(context);
    
    // Execute prompt
    const result = await PromptExecutor.execute<TOutput>(
      this.prompt,
      variables,
      {
        provider: this.provider,
        model: this.model,
        promptId: this.promptId,
      }
    );

    // Validate output
    const output = OutputValidator.validate(result, this.outputSchema);
    
    // Save to brain
    candidateAIBrain.addObservation({
      type: this.source,
      source: this.source,
      data: output,
      timestamp: new Date(),
    });

    // Publish event
    const event = this.buildEvent(output);
    EventPublisher.publishObservation(this.source, output);

    // Update state
    this.lastOutput = output;
    this.history.push({ timestamp: new Date(), output });

    return output;
  }

  getLastOutput(): TOutput | null {
    return this.lastOutput;
  }

  getHistory(): Array<{ timestamp: Date; output: TOutput }> {
    return this.history;
  }
}
```

### Implementation Example

```typescript
export class CareerCopilotForecastEngine extends BaseIntelligenceEngine<ForecastInput, ForecastOutput> {
  protected prompt = careerCopilotForecastV1;
  protected promptId = "career-copilot-forecast";
  protected source = "career-copilot-forecast";
  protected provider = "anthropic" as const;
  protected model = "claude-3-5-sonnet-20241022";
  protected outputSchema = ForecastOutputSchema;

  protected extractContext(candidateGraph: any): Record<string, unknown> {
    return {
      candidateProfile: ContextBuilder.buildCandidateProfile(candidateGraph),
      historicalObservations: ContextBuilder.buildHistoricalObservations(20),
      currentGoals: ContextBuilder.buildCurrentGoals(),
      recentInsights: ContextBuilder.buildRecentInsights(10),
    };
  }

  protected buildPromptVariables(context: Record<string, unknown>): Record<string, unknown> {
    return PromptBuilder.buildVariables(context);
  }

  protected buildEvent(output: ForecastOutput): unknown {
    return {
      type: "forecast_generated",
      source: this.source,
      data: output,
    };
  }
}
```

---

## Responsibilities

### Presentation Layer

**Responsibilities**:
- Receive HTTP requests
- Validate inputs
- Call application layer
- Return HTTP responses

**Constraints**:
- No business logic
- No AI logic
- No direct access to aiOrchestrator
- No direct access to CandidateAIBrain

### Application Layer

**Responsibilities**:
- Orchestrate use cases
- Coordinate multiple engines
- Handle business logic
- Manage transactions

**Constraints**:
- No direct access to aiOrchestrator
- No direct access to LLM providers
- Use domain layer for AI operations

### Domain Layer

**Responsibilities**:
- Implement intelligence engines
- Extract context from CandidateAIBrain
- Execute prompts via aiOrchestrator
- Validate outputs
- Publish events

**Constraints**:
- No HTTP logic
- No database logic
- Use infrastructure layer for AI operations

### Infrastructure Layer

**Responsibilities**:
- Implement aiOrchestrator
- Implement CandidateAIBrain
- Implement EventBus
- Implement LLM provider adapters

**Constraints**:
- No business logic
- No domain logic

---

## Context Building

### ContextBuilder

```typescript
export class ContextBuilder implements IContextBuilder {
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

### DependencyManager

```typescript
export class DependencyManager implements IDependencyManager {
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

---

## Event Publishing

### EventPublisher

```typescript
export class EventPublisher implements IEventPublisher {
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

---

## Prompt Execution

### PromptExecutor

```typescript
export class PromptExecutor implements IPromptExecutor {
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

### PromptBuilder

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

---

## Output Validation

### OutputValidator

```typescript
export class OutputValidator implements IOutputValidator {
  static validate<TOutput>(data: unknown, schema: z.ZodSchema<TOutput>): TOutput {
    return schema.parse(data);
  }

  static validatePartial<TOutput>(data: unknown, schema: z.ZodSchema<TOutput>): Partial<TOutput> {
    return schema.partial().parse(data);
  }
}
```

---

## Engine Registry

### EngineRegistry

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

---

## Migration Strategy

### Phase 1: Create intelligence-core (Sprint 6.12)

1. Create `intelligence-core` module
2. Implement BaseIntelligenceEngine
3. Implement ContextBuilder
4. Implement DependencyManager
5. Implement EventPublisher
6. Implement PromptExecutor
7. Implement PromptBuilder
8. Implement OutputValidator
9. Implement EngineRegistry

### Phase 2: Migrate High Dependency Clusters (Sprint 6.13)

1. Migrate Planning Intelligence (18 dependencies)
2. Migrate Goal & Execution (14 dependencies)
3. Migrate Scenario & Digital Twin (14 dependencies)
4. Migrate Career Analysis (12 dependencies)
5. Migrate Application & Opportunity (10 dependencies)

### Phase 3: Migrate Low Dependency Clusters (Sprint 6.13+)

1. Migrate Decision & Strategy (9-10 dependencies)
2. Migrate Constraint & Resource (0-1 dependency)
3. Migrate Outcome & Learning (0-3 dependencies)
4. Migrate Coaching & Reflection (0-1 dependency)
5. Migrate Specialized Analysis (0 dependencies)
6. Migrate External Analysis (0 dependencies)

### Phase 4: Verification (Sprint 6.14)

1. Verify all engines migrated
2. Verify no regressions
3. Verify tests passing
4. Verify build passing
5. Verify performance maintained

---

## Best Practices

### 1. Use BaseIntelligenceEngine

Always extend BaseIntelligenceEngine for new engines. This ensures consistency and reduces code duplication.

### 2. Use ContextBuilder

Always use ContextBuilder for context extraction. This standardizes context building and reduces code duplication.

### 3. Use DependencyManager

Always use DependencyManager for engine-to-engine dependencies. This standardizes dependency resolution and reduces code duplication.

### 4. Use EventPublisher

Always use EventPublisher for event publishing. This standardizes event structure and reduces code duplication.

### 5. Use OutputValidator

Always use OutputValidator for output validation. This adds runtime validation and improves reliability.

### 6. Define Output Schemas

Always define Zod schemas for output validation. This ensures type safety and catches errors early.

### 7. Use EngineRegistry

Always use EngineRegistry for engine state management. This centralizes state tracking and simplifies engine-to-engine communication.

### 8. Keep Engines Simple

Keep engines focused on a single responsibility. Complex logic should be in the application layer.

### 9. Avoid Circular Dependencies

Avoid circular dependencies between engines. Use CandidateAIBrain for context sharing instead.

### 10. Document Context Sources

Document which context sources each engine uses. This improves maintainability and debugging.

---

## Anti-Patterns

### 1. Direct aiOrchestrator Calls

**Anti-Pattern**: Call aiOrchestrator directly in engine

```typescript
// Bad
const result = await aiOrchestrator.execute(prompt, variables, options);
```

**Correct Pattern**: Use PromptExecutor

```typescript
// Good
const result = await PromptExecutor.execute<TOutput>(prompt, variables, options);
```

### 2. Direct CandidateAIBrain Calls

**Anti-Pattern**: Call candidateAIBrain directly in engine

```typescript
// Bad
const observations = candidateAIBrain.getObservations();
```

**Correct Pattern**: Use ContextBuilder

```typescript
// Good
const observations = ContextBuilder.buildHistoricalObservations();
```

### 3. Direct EventBus Calls

**Anti-Pattern**: Call eventBus directly in engine

```typescript
// Bad
eventBus.publish(event);
```

**Correct Pattern**: Use EventPublisher

```typescript
// Good
EventPublisher.publishObservation(source, data);
```

### 4. No Output Validation

**Anti-Pattern**: Assume output is correct

```typescript
// Bad
const output = result.data as Output;
```

**Correct Pattern**: Validate output

```typescript
// Good
const output = OutputValidator.validate(result.data, OutputSchema);
```

### 5. Circular Dependencies

**Anti-Pattern**: Engine A calls Engine B, Engine B calls Engine A

```typescript
// Bad
// Engine A
const outputB = EngineB.execute(input);
// Engine B
const outputA = EngineA.execute(input);
```

**Correct Pattern**: Use CandidateAIBrain for context sharing

```typescript
// Good
// Engine A
const outputB = DependencyManager.getEngineOutput("engine-b");
// Engine B
const outputA = DependencyManager.getEngineOutput("engine-a");
```

---

## Metrics

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

---

## Conclusion

The Intelligence Engine Standard V1 defines a comprehensive architecture for Intelligence Engines in Trajectoire. Based on the analysis of 29+ existing engines, this standard identifies common abstractions and provides a clear migration path. The standard will reduce code duplication by 75%, improve maintainability by 29x, and ensure 100% consistency across engines.

**Status**: Proposed ✅  
**Next Steps**: ADR creation and roadmap update
