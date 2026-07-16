# Background Agent Standard

## Overview

This standard defines the architecture and implementation pattern for Background Agents in Trajectoire. Background Agents perform autonomous, scheduled, or event-driven automation without user interaction.

**Status**: Draft Standard  
**Version**: 1.0  
**Reference Implementations**: 3 agents in `lib/agents/`  

**Note**: Only 3 agents exist (below Rule of Three). This standard documents the pattern but defers formal standardization until more agents are created.

---

## Architecture

### Pattern Characteristics

Background Agents are characterized by:

- **Autonomous Execution**: No user interaction required
- **Scheduled or Event-Triggered**: Runs on schedule or in response to events
- **Event Bus Integration**: Publishes and subscribes to events
- **Background Processing**: Runs in background, not user-facing
- **Server-Only**: All processing on server
- **No Streaming**: No streaming responses
- **No useChat**: No chat interface

### Layered Architecture

```
Scheduler / Event Trigger
  ↓
Background Agent (Application)
  ↓ Ports (Domain)
Infrastructure (Server)
  ↓ External Services
```

---

## Responsibilities

### Background Agent Layer

- Execute autonomous tasks
- Respond to scheduled triggers
- Respond to event triggers
- Publish events to EventBus
- Perform background processing
- Handle errors gracefully

### Infrastructure Layer

- Implement scheduler integration
- Implement event subscription
- Implement external service calls
- Manage error handling

### Composition Layer

- Wire dependencies
- Create object graph
- Provide factory functions

---

## Data Flow

### Scheduled Execution Flow

```
1. Scheduler triggers agent
2. Agent retrieves current state
3. Agent performs autonomous task
4. Agent publishes events to EventBus
5. Agent updates state
6. Agent completes
```

### Event-Triggered Execution Flow

```
1. Event published to EventBus
2. Agent subscribes to event
3. Agent receives event
4. Agent processes event
5. Agent performs autonomous task
6. Agent publishes result events
7. Agent completes
```

---

## Rules

### Server-Only Protection

All background agent files must include:

```typescript
import "server-only";
```

**Protected Files**:
- All files in `lib/agents/`
- Factory files
- Infrastructure files

### Dependency Rules

- **Background Agent Layer**: Can depend on EventBus, external services
- **Infrastructure Layer**: Can depend on external services
- **Composition Layer**: Server-only only
- **UI Layer**: No direct agent imports

### Import Restrictions

**Forbidden**:
- No imports from background agents in UI
- No direct scheduler imports in UI

**Allowed**:
- Agent → EventBus
- Agent → External Services
- Scheduler → Agent
- EventBus → Agent

---

## Implementation Pattern

### Agent Structure

```typescript
import "server-only";

import { eventBus } from "@/core/ai/events/EventBus";

export class Agent {
  private interval: NodeJS.Timeout | null = null;

  start() {
    // Start scheduled execution
    this.interval = setInterval(() => {
      this.execute();
    }, this.getInterval());
  }

  stop() {
    // Stop scheduled execution
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  async execute() {
    try {
      // Perform autonomous task
      const result = await this.performTask();

      // Publish event
      eventBus.publish({
        id: `agent-${Date.now()}`,
        timestamp: new Date(),
        type: "agent_completed",
        payload: result,
      });
    } catch (error) {
      console.error("[Agent] Error:", error);
    }
  }

  private async performTask() {
    // Implement agent-specific logic
    return {};
  }

  private getInterval(): number {
    // Return interval in milliseconds
    return 60000; // 1 minute
  }
}
```

---

## Event-Triggered Pattern

### Event Subscription

```typescript
import "server-only";

import { eventBus } from "@/core/ai/events/EventBus";

export class Agent {
  constructor() {
    // Subscribe to events
    eventBus.subscribe("event_type", this.handleEvent.bind(this));
  }

  private async handleEvent(event: any) {
    try {
      // Process event
      const result = await this.processEvent(event);

      // Publish result event
      eventBus.publish({
        id: `agent-${Date.now()}`,
        timestamp: new Date(),
        type: "agent_event_processed",
        payload: result,
      });
    } catch (error) {
      console.error("[Agent] Event error:", error);
    }
  }

  private async processEvent(event: any) {
    // Implement event processing logic
    return {};
  }
}
```

---

## Factory Pattern

### Factory Structure

```typescript
import "server-only";

import { Agent } from "./agent";

export function createAgent() {
  const agent = new Agent();
  agent.start();
  return agent;
}
```

---

## Tests

### Unit Tests

Test agent logic in isolation:

```typescript
describe("Agent", () => {
  it("should execute task", async () => {
    const agent = new Agent();
    const result = await agent.execute();
    expect(result).toBeDefined();
  });
});
```

### Integration Tests

Test event subscription:

```typescript
describe("Agent Events", () => {
  it("should handle event", async () => {
    const agent = new Agent();
    const event = { type: "event_type", payload: {} };
    
    await agent.handleEvent(event);
    
    // Verify event was processed
  });
});
```

---

## Bundle

### Bundle Size

Background agents are server-only, so they should not appear in client bundle.

**Verification**:
- Run bundle analysis
- Verify no background agents in client bundle

---

## CI

### Build Pipeline

All background agents must pass:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

---

## Common Abstractions

### Potential Shared Abstractions

If 3+ background agents share common patterns, extract to `agent-core`:

1. **Scheduler Wrapper**: Common scheduler integration
2. **EventBus Wrapper**: Common event subscription
3. **Task Executor**: Common task execution logic
4. **Error Handler**: Common error handling

**Rule of Three**: Only extract if used in 3+ agents.

**Current Status**: Only 3 agents exist, defer extraction.

---

## Examples

### Reference Implementations

- **behavior.agent.ts**: `lib/agents/behavior.agent.ts`
- **billing.agent.ts**: `lib/agents/billing.agent.ts`
- **interview.agent.ts**: `lib/agents/interview.agent.ts`

---

## Checklist

Before releasing a new background agent:

- [ ] Architecture follows background agent pattern
- [ ] Server-only protection on all agent files
- [ ] No forbidden imports in UI
- [ ] Scheduler or event trigger implemented
- [ ] EventBus integration
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Build passes
- [ ] No background agents in client bundle
- [ ] Documentation updated

---

## Conclusion

This standard documents the pattern for background agents. Currently, only 3 agents exist (below Rule of Three), so formal standardization is deferred until more agents are created.

**Reference Implementations**: 3 agents in `lib/agents/`  
**Standard Status**: Draft (defer formalization until Rule of Three is met)
