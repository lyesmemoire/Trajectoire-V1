# ADR-005: Event Sourcing

## Status
Accepted

## Context
The Runtime needs to:
- **Reconstruct state** at any point in time
- **Debug issues** by replaying events
- **Analyze patterns** in decision-making
- **Support rollback** to previous states

Traditional CRUD storage is insufficient because:
- Only current state is stored (no history)
- Cannot reconstruct how state was reached
- Cannot replay events for debugging
- Cannot analyze decision patterns over time

## Decision
Implement **Event Sourcing** with the following characteristics:

### Core Principles
1. **State is derived from events**
   - Events are the source of truth
   - Current state is computed by replaying events
   - Snapshots are optimizations for performance

2. **Immutable event log**
   - Events are never modified
   - Only new events are appended
   - Sequence numbers guarantee ordering

3. **Event replay**
   - Replay events from any point
   - Reconstruct state at any time
   - Debug by stepping through events

### EventStore Implementation
```typescript
interface EventStore {
  append(event: StoredEvent): void;
  appendAll(events: StoredEvent[]): void;
  stream(options?: EventStreamOptions): EventStreamResult;
  replay(sessionId: string, fromSequence?: number): StoredEvent[];
  getLatestSequence(sessionId: string): number;
}
```

### Snapshot Strategy
- **SnapshotRepository** stores periodic snapshots
- Snapshots contain full CognitiveState
- Replay from latest snapshot + events since snapshot
- Snapshot interval configurable (e.g., every 100 events)

### Event Structure
```typescript
interface StoredEvent {
  id: string;
  sessionId: string;
  sequence: number;
  eventType: string;
  engine: string;
  engineVersion: string;
  payload: any;
  createdAt: Date;
  metadata?: {
    traceId?: string;
    correlationId?: string;
    ruleId?: string;
    ruleVersion?: string;
  };
}
```

## Consequences
### Positive
- Complete event history for debugging
- State reconstruction at any point
- Pattern analysis over time
- Natural audit trail

### Negative
- More complex than CRUD
- Requires snapshot strategy for performance
- Event schema changes require migration strategy
- Higher storage requirements

## Alternatives Considered
1. **CRUD with audit log** - Rejected because audit log is secondary, not primary
2. **No history** - Rejected because debugging requires history
3. **State-based only** - Rejected because cannot reconstruct how state was reached

## References
- [ADR-001: Runtime Architecture](./001-runtime-architecture.md)
- [ADR-002: EventBus](./002-eventbus.md)
- [ADR-003: Repository Pattern](./003-repository-pattern.md)
