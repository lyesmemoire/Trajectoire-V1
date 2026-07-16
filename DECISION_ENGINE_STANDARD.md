# Decision Engine Standard

## Overview

This standard defines the architecture and implementation pattern for Decision Engines in Trajectoire. Decision Engines perform rule-based scoring and recommendations without AI/LLM, using deterministic logic.

**Status**: Official Standard  
**Version**: 1.0  
**Reference Implementations**: 10+ engines in `core/intelligence/engines/`  

---

## Architecture

### Pattern Characteristics

Decision Engines are characterized by:

- **Rule-Based Logic**: No AI/LLM required
- **Deterministic Output**: Same input always produces same output
- **Score Calculation**: Numerical scoring and ranking
- **Recommendation Generation**: Context-aware recommendations
- **Pure TypeScript**: No external AI dependencies
- **Synchronous**: No streaming
- **No useChat**: No chat interface

### Layered Architecture

```
UI Layer (Client)
  ↓ Function Call
Decision Engine (Application)
  ↓ Rules (Domain)
Infrastructure (Server)
  ↓ Data Access
Database / State
```

---

## Responsibilities

### Decision Engine Layer

- Calculate scores from multiple data sources
- Apply business rules
- Generate recommendations
- Provide reasoning
- Normalize scores
- Detect patterns

### Infrastructure Layer

- Implement data access
- Implement rule storage
- Handle caching
- Manage error handling

### Composition Layer

- Wire dependencies
- Create object graph
- Provide factory functions

---

## Data Flow

### Request Flow

```
1. User action (e.g., view dashboard)
2. UI calls decision engine function
3. Decision engine retrieves data
4. Decision engine applies rules
5. Decision engine calculates scores
6. Decision engine generates recommendations
7. Decision engine returns results
8. UI displays results
```

### State Management

- **Rule State**: Stored as code or configuration
- **Data State**: Retrieved from database or state
- **Score State**: Calculated on demand (cached if needed)

---

## Rules

### Server-Only Protection

Decision engines can be server-only or client-side depending on use case:

- **Server-Only**: If accessing database or sensitive data
- **Client-Side**: If using only local state and no sensitive data

**Server-Only Files**: Must include `import "server-only";`

### Dependency Rules

- **Decision Engine Layer**: Can depend on data sources, rule storage
- **Infrastructure Layer**: Can depend on database, cache
- **Composition Layer**: Server-only only (if applicable)
- **UI Layer**: Can call decision engine functions directly (if client-side)

### Import Restrictions

**Allowed**:
- UI → Decision Engine (if client-side)
- UI → Route Handler → Decision Engine (if server-side)
- Decision Engine → Data Sources
- Decision Engine → Rule Storage

**Forbidden**:
- No AI/LLM dependencies
- No streaming dependencies
- No external AI service dependencies

---

## Implementation Pattern

### Engine Structure

```typescript
export interface EngineInput {
  profile: any;
  job?: any;
  interview?: any;
  // Add domain-specific input fields
}

export interface EngineOutput {
  scores: {
    overall: number;
    breakdown: Record<string, number>;
  };
  recommendations: string[];
  reasoning: string[];
}

export class Engine {
  static calculate(input: EngineInput): EngineOutput {
    // 1. Calculate scores
    const scores = this.calculateScores(input);

    // 2. Generate recommendations
    const recommendations = this.generateRecommendations(input, scores);

    // 3. Generate reasoning
    const reasoning = this.generateReasoning(input, scores);

    return {
      scores,
      recommendations,
      reasoning,
    };
  }

  private static calculateScores(input: EngineInput) {
    // Implement scoring logic
    return {
      overall: 75,
      breakdown: {
        communication: 80,
        leadership: 70,
        confidence: 75,
      },
    };
  }

  private static generateRecommendations(input: EngineInput, scores: any) {
    // Implement recommendation logic
    return [
      "Improve communication skills",
      "Practice leadership scenarios",
    ];
  }

  private static generateReasoning(input: EngineInput, scores: any) {
    // Implement reasoning logic
    return [
      "Communication score is strong",
      "Leadership needs improvement",
    ];
  }
}
```

---

## Rule Pattern

### Rule Structure

```typescript
export interface Rule {
  id: string;
  condition: (input: EngineInput) => boolean;
  action: (input: EngineInput) => any;
  priority: number;
}

export class RuleEngine {
  private rules: Rule[] = [];

  addRule(rule: Rule) {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  execute(input: EngineInput) {
    for (const rule of this.rules) {
      if (rule.condition(input)) {
        return rule.action(input);
      }
    }
    return null;
  }
}
```

---

## Scoring Pattern

### Score Calculation

```typescript
export interface ScoreConfig {
  weights: Record<string, number>;
  normalizers: Record<string, (value: number) => number>;
}

export class ScoreCalculator {
  calculate(input: EngineInput, config: ScoreConfig): number {
    let total = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(config.weights)) {
      const value = input[key] || 0;
      const normalized = config.normalizers[key]?.(value) || value;
      total += normalized * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? total / totalWeight : 0;
  }
}
```

---

## Recommendation Pattern

### Recommendation Generation

```typescript
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  impact: string;
  effort: "low" | "medium" | "high";
}

export class RecommendationEngine {
  generate(input: EngineInput, scores: any): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Generate recommendations based on scores
    if (scores.breakdown.communication < 70) {
      recommendations.push({
        id: "comm-1",
        title: "Improve Communication",
        description: "Practice active listening and clear expression",
        priority: "high",
        impact: "High impact on interview performance",
        effort: "medium",
      });
    }

    // Sort by priority
    recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return recommendations;
  }
}
```

---

## Factory Pattern

### Factory Structure

```typescript
export function createEngine() {
  return Engine;
}
```

---

## Tests

### Unit Tests

Test engine logic in isolation:

```typescript
describe("Engine", () => {
  it("should calculate scores", () => {
    const input: EngineInput = {
      profile: mockProfile,
    };

    const output = Engine.calculate(input);

    expect(output.scores).toBeDefined();
    expect(output.scores.overall).toBeGreaterThanOrEqual(0);
    expect(output.scores.overall).toBeLessThanOrEqual(100);
  });

  it("should generate recommendations", () => {
    const input: EngineInput = {
      profile: mockProfile,
    };

    const output = Engine.calculate(input);

    expect(output.recommendations).toBeDefined();
    expect(output.recommendations.length).toBeGreaterThan(0);
  });
});
```

### Rule Tests

Test rule logic:

```typescript
describe("RuleEngine", () => {
  it("should execute matching rule", () => {
    const engine = new RuleEngine();
    engine.addRule({
      id: "rule-1",
      condition: (input) => input.value > 10,
      action: (input) => "matched",
      priority: 1,
    });

    const result = engine.execute({ value: 15 });
    expect(result).toBe("matched");
  });
});
```

---

## Bundle

### Bundle Size

Decision engines can be client-side or server-side:

**Client-Side**:
- Bundle size should be minimal
- No external dependencies
- Pure TypeScript

**Server-Side**:
- Should not appear in client bundle
- Server-only protection

**Verification**:
- Run bundle analysis
- Verify appropriate placement

---

## CI

### Build Pipeline

All decision engines must pass:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

---

## Common Abstractions

### Potential Shared Abstractions

If 3+ decision engines share common patterns, extract to `decision-core`:

1. **Rule Engine**: Common rule execution logic
2. **Score Calculator**: Common scoring logic
3. **Recommendation Engine**: Common recommendation generation
4. **Normalizer**: Common score normalization

**Rule of Three**: Only extract if used in 3+ engines.

**Current Status**: 10+ engines exist, extraction is appropriate.

---

## Examples

### Reference Implementations

- **careerEngine.ts**: `core/intelligence/engines/careerEngine.ts`
- **candidateProfile.ts**: `core/intelligence/engines/candidateProfile.ts`
- **careerAnalysisAIEngine.ts**: `core/intelligence/engines/careerAnalysisAIEngine.ts`
- **scoreEngine**: `core/intelligence/engines/scoreEngine`
- **coachEngine**: `core/intelligence/engines/coachEngine`
- **recommendationEngine**: `core/intelligence/engines/recommendationEngine`
- **progressEngine**: `core/intelligence/engines/progressEngine`
- **insightEngine**: `core/intelligence/engines/insightEngine`
- **decisionEngine**: `core/intelligence/engines/decisionEngine`
- **memoryEngine**: `core/intelligence/engines/memoryEngine`

---

## Checklist

Before releasing a new decision engine:

- [ ] Architecture follows decision engine pattern
- [ ] No AI/LLM dependencies
- [ ] Deterministic output
- [ ] Unit tests written
- [ ] Rule tests written
- [ ] Build passes
- [ ] Type-check passes
- [ ] Bundle size appropriate
- [ ] Documentation updated

---

## Conclusion

This standard ensures consistency across all decision engines in Trajectoire. By following this standard, we maintain:

- **Determinism**: Same input always produces same output
- **Performance**: No external AI dependencies
- **Testability**: Pure functions enable easy testing
- **Maintainability**: Clear architecture reduces complexity
- **Transparency**: Rule-based logic is transparent

**Reference Implementations**: 10+ engines in `core/intelligence/engines/`  
**Common Abstractions**: Extract to `decision-core` (Rule of Three met)
