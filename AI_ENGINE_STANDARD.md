# Intelligence Engine Standard

## Overview

This standard defines the architecture and implementation pattern for Intelligence Engines in Trajectoire. Intelligence Engines perform synchronous analysis with structured input/output, using aiOrchestrator, CandidateAIBrain, and EventBus.

**Status**: Official Standard  
**Version**: 1.0  
**Reference Implementations**: 24+ intelligence engines in `core/intelligence/engines/`  

---

## Architecture

### Pattern Characteristics

Intelligence Engines are characterized by:

- **Synchronous Operation**: No streaming, synchronous function calls
- **Structured Input**: Business data (CandidateGraph, events, etc.)
- **Structured Output**: JSON analysis, forecasts, recommendations
- **aiOrchestrator**: Uses AI orchestration layer for LLM calls
- **CandidateAIBrain**: Uses brain for historical context
- **EventBus**: Publishes events for system-wide communication
- **No Streaming**: Unlike conversational domains, no streaming responses
- **No useChat**: Unlike conversational domains, no chat interface

### Layered Architecture

```
UI Layer (Client)
  ↓ HTTP Request
Route Handler (HTTP Boundary)
  ↓ Factory (Composition)
Intelligence Engine (Application)
  ↓ Ports (Domain)
Infrastructure (Server)
  ↓ aiOrchestrator
External Service (LLM)
```

---

## Responsibilities

### Intelligence Engine Layer

- Perform synchronous analysis
- Use aiOrchestrator for LLM calls
- Use CandidateAIBrain for historical context
- Use EventBus for event publishing
- Return structured JSON output
- Handle errors gracefully

### Infrastructure Layer

- Implement aiOrchestrator integration
- Implement CandidateAIBrain integration
- Implement EventBus integration
- Handle external service calls
- Manage error handling

### Composition Layer

- Wire dependencies
- Create object graph
- Provide factory functions

---

## Data Flow

### Request Flow

```
1. User triggers analysis (e.g., button click)
2. UI sends HTTP request to route handler
3. Route handler validates input
4. Route handler creates intelligence engine via factory
5. Intelligence engine retrieves context from CandidateAIBrain
6. Intelligence engine calls aiOrchestrator with prompt
7. aiOrchestrator calls LLM (OpenAI GPT-4)
8. Response returned as structured JSON
9. Intelligence engine publishes event to EventBus
10. Intelligence engine saves observation to CandidateAIBrain
11. Route handler returns JSON response
12. UI displays analysis
```

### State Management

- **Analysis State**: Stored in CandidateAIBrain as observations
- **Event State**: Published to EventBus for system-wide communication
- **Context State**: Retrieved from CandidateAIBrain (historical observations, goals, etc.)

---

## Rules

### Server-Only Protection

All intelligence engine files must include:

```typescript
import "server-only";
```

**Protected Files**:
- All files in `core/intelligence/engines/`
- Factory files
- Infrastructure files

### Dependency Rules

- **Intelligence Engine Layer**: Can depend on aiOrchestrator, CandidateAIBrain, EventBus
- **Infrastructure Layer**: Can depend on external services
- **Composition Layer**: Server-only only
- **UI Layer**: No direct intelligence engine imports (use route handler)

### Import Restrictions

**Forbidden**:
- No imports from intelligence engines in UI
- No direct aiOrchestrator imports in UI
- No direct CandidateAIBrain imports in UI

**Allowed**:
- UI → Route Handler (HTTP)
- Route Handler → Factory
- Factory → Intelligence Engine
- Intelligence Engine → aiOrchestrator
- Intelligence Engine → CandidateAIBrain
- Intelligence Engine → EventBus

---

## Implementation Pattern

### Engine Structure

```typescript
import "server-only";

import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { promptTemplate } from "../../ai/Prompts/prompt-template";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";

export interface EngineInput {
  candidateGraph: any;
  // Add domain-specific input fields
}

export interface EngineOutput {
  // Add domain-specific output fields
}

export class Engine {
  static async analyze(input: EngineInput): Promise<EngineOutput> {
    // 1. Extract data from CandidateGraph
    const candidateProfile = { /* ... */ };

    // 2. Retrieve historical context from CandidateAIBrain
    const historicalObservations = candidateAIBrain.getObservations();
    const currentGoals = candidateAIBrain.getGoals();

    // 3. Call aiOrchestrator with prompt
    const result = await aiOrchestrator.execute<EngineOutput>(
      promptTemplate,
      {
        candidateProfile: JSON.stringify(candidateProfile),
        historicalObservations: historicalObservations.join("\n"),
        currentGoals: currentGoals.join("\n"),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!result.success || !result.data) {
      throw new Error("Failed to generate analysis");
    }

    // 4. Save observation to CandidateAIBrain
    candidateAIBrain.addObservation({
      timestamp: new Date(),
      source: "engine-name",
      type: "general",
      data: result.data,
      confidence: 0.8,
    });

    // 5. Publish event to EventBus
    const event = {
      id: `engine-${Date.now()}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "engine-name",
        observationType: "general",
        data: result.data,
        confidence: 0.8,
      },
    };

    eventBus.publish(event);

    return result.data;
  }
}
```

---

## Prompt Pattern

### Prompt Template

```typescript
import { PromptTemplate } from "../PromptTemplates/PromptRenderer";

export const promptTemplate: PromptTemplate = {
  system: `You are an expert in the domain.

ANALYSIS RULES:
- Use ONLY the provided data
- Be specific and actionable
- Provide confidence levels
- Explain reasoning

OUTPUT STRUCTURE:
The prompt must produce valid JSON only.

Expected JSON response format:
{
  // Define output structure
}`,

  user: `CANDIDATE PROFILE:
{{candidateProfile}}

HISTORICAL ANALYSES:
{{historicalObservations}}

CURRENT GOALS:
{{currentGoals}}

Generate analysis based on this data.`,

  variables: ["candidateProfile", "historicalObservations", "currentGoals"],
};
```

---

## Factory Pattern

### Factory Structure

```typescript
import "server-only";

import { Engine } from "./engine";

export function createEngine() {
  return Engine;
}
```

---

## Route Handler

### Route Handler Pattern

```typescript
import { NextRequest } from "next/server";
import { createEngine } from "@/core/intelligence/engines/engine.factory";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const input: EngineInput = {
      candidateGraph: body.candidateGraph,
    };

    const engine = createEngine();
    const output = await engine.analyze(input);

    return Response.json(output);
  } catch (error) {
    console.error("[Engine Route] Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Tests

### Unit Tests

Test engine logic in isolation:

```typescript
describe("Engine", () => {
  it("should analyze candidate graph", async () => {
    const input: EngineInput = {
      candidateGraph: mockCandidateGraph,
    };

    const output = await Engine.analyze(input);

    expect(output).toBeDefined();
    expect(output.field).toBeDefined();
  });
});
```

### Integration Tests

Test the full flow:

```typescript
describe("Engine Route", () => {
  it("should return analysis", async () => {
    const response = await fetch("/api/engine/analyze", {
      method: "POST",
      body: JSON.stringify({ candidateGraph }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toBeDefined();
  });
});
```

---

## Bundle

### Bundle Size

Intelligence engines are server-only, so they should not appear in client bundle.

**Verification**:
- Run bundle analysis
- Verify no intelligence engines in client bundle
- Verify no aiOrchestrator in client bundle
- Verify no CandidateAIBrain in client bundle

---

## CI

### Build Pipeline

All intelligence engines must pass:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

---

## Common Abstractions

### Potential Shared Abstractions

If 3+ intelligence engines share common patterns, extract to `intelligence-core`:

1. **aiOrchestrator Wrapper**: Common aiOrchestrator integration
2. **CandidateAIBrain Wrapper**: Common brain integration
3. **EventBus Wrapper**: Common event publishing
4. **Prompt Builder**: Common prompt building logic
5. **Error Handler**: Common error handling

**Rule of Three**: Only extract if used in 3+ engines.

---

## Examples

### Reference Implementations

- **CareerCopilotForecastEngine**: `core/intelligence/engines/careerCopilotForecastEngine.ts`
- **CareerCopilotMarketIntelligenceEngine**: `core/intelligence/engines/careerCopilotMarketIntelligenceEngine.ts`
- **CareerCopilotEvidenceIntelligenceEngine**: `core/intelligence/engines/careerCopilotEvidenceIntelligenceEngine.ts`
- **CareerCopilotResourceIntelligenceEngine**: `core/intelligence/engines/careerCopilotResourceIntelligenceEngine.ts`
- **CareerCopilotScenarioIntelligenceEngine**: `core/intelligence/engines/careerCopilotScenarioIntelligenceEngine.ts`

---

## Checklist

Before releasing a new intelligence engine:

- [ ] Architecture follows intelligence engine pattern
- [ ] Server-only protection on all engine files
- [ ] No forbidden imports in UI
- [ ] aiOrchestrator integration
- [ ] CandidateAIBrain integration
- [ ] EventBus integration
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Build passes
- [ ] No intelligence engines in client bundle
- [ ] Documentation updated

---

## Conclusion

This standard ensures consistency across all intelligence engines in Trajectoire. By following this standard, we maintain:

- **Security**: Server-only isolation prevents AI leaks
- **Consistency**: Common pattern across all engines
- **Maintainability**: Clear architecture reduces complexity
- **Testability**: Synchronous pattern enables easy testing
- **Scalability**: Standard pattern enables rapid engine creation

**Reference Implementations**: 24+ intelligence engines in `core/intelligence/engines/`  
**Common Abstractions**: To be extracted to `intelligence-core` if Rule of Three is met
