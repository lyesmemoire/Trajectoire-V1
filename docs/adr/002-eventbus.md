# ADR-002: EventBus

## Status
Accepted

## Context
The Runtime needs a mechanism for engines to communicate asynchronously. Engines produce events that need to be:
- Consumed by other engines
- Stored for replay/debugging
- Aggregated for metrics
- Filtered by type or session

## Decision
Implement an **EventBus** with the following characteristics:

### Core Features
1. **Publish/Subscribe Pattern**
   - Engines publish events via `publish(event)`
   - Subscribers register via `subscribe(eventType, handler)`
   - Multiple subscribers per event type

2. **Event Filtering**
   - Filter by `eventType`
   - Filter by `sessionId`
   - Filter by `engine`
   - Filter by custom metadata

3. **Event Persistence**
   - All events are stored in EventStore
   - Enables replay for debugging
   - Enables state reconstruction

4. **Event Ordering**
   - Sequence numbers per session
   - Timestamp-based ordering
   - Guarantees in-order delivery within session

### Event Structure
```typescript
interface BaseEvent {
  id: string;
  sessionId: string;
  sequence: number;
  engine: string;
  eventType: string;
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

### Integration with EventStore
- EventBus delegates persistence to EventStore
- EventStore provides `append()`, `stream()`, `replay()`
- EventBus uses EventStore for replay scenarios

## Consequences
### Positive
- Decoupled engines (no direct dependencies)
- Easy to add new event consumers
- Complete event history for debugging
- Supports event sourcing pattern

### Negative
- Additional latency from async processing
- Requires careful error handling in subscribers
- Potential for event ordering issues across sessions

## Alternatives Considered
1. **Direct engine-to-engine calls** - Rejected because it creates tight coupling
2. **Message queue (RabbitMQ, Kafka)** - Rejected because overkill for in-memory use case
3. **No event system** - Rejected because engines need to communicate

## References
- [ADR-001: Runtime Architecture](./001-runtime-architecture.md)
- [ADR-005: Event Sourcing](./005-event-sourcing.md)
