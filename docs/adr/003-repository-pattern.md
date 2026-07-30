# ADR-003: Repository Pattern

## Status
Accepted

## Context
The Runtime needs to store and retrieve various data types:
- **Facts** (observations, entities, evidence)
- **Snapshots** (CognitiveState snapshots)
- **Events** (engine events for event sourcing)

Direct database access would:
- Create tight coupling to storage implementation
- Make testing difficult
- Prevent switching storage backends
- Mix persistence logic with business logic

## Decision
Implement **Repository Pattern** with the following structure:

### Repository Interfaces
1. **FactRepository**
   - `findFactsByType()`, `findFactsByEntity()`, `findLatestFacts()`
   - `findById()`, `findBySession()`, `findByConfidence()`
   - `findRelated()`, `getAll()`, `add()`, `addAll()`, `remove()`, `clear()`
   - `getStatistics()`

2. **SnapshotRepository**
   - `save()`, `findById()`, `findLatest()`
   - `findBySession()`, `findByTimeRange()`
   - `getAll()`, `remove()`, `clear()`
   - `getStatistics()`

3. **EventStore**
   - `append()`, `appendAll()`, `stream()`
   - `replay()`, `getLatestSequence()`
   - `findById()`, `getAll()`, `clear()`
   - `getStatistics()`

### Memory Implementations
- **MemoryFactRepository** - In-memory Map-based implementation
- **MemorySnapshotRepository** - In-memory Map-based implementation
- **MemoryEventStore** - In-memory Map with sequence tracking

### Usage Pattern
```typescript
// FactQueryService uses FactRepository
class FactQueryService {
  constructor(private readonly repository: FactRepository) {}
  
  findFactsByType<T>(type: string) {
    return this.repository.findFactsByType<T>(type);
  }
}
```

## Consequences
### Positive
- Storage implementation can be swapped (PostgreSQL, MongoDB, etc.)
- Easy to test with in-memory implementations
- Clear separation between business logic and persistence
- Consistent query interface across data types

### Negative
- Additional abstraction layer
- Slight performance overhead from interface indirection
- Need to maintain multiple implementations

## Alternatives Considered
1. **Direct database access** - Rejected because it creates tight coupling
2. **ORM (TypeORM, Prisma)** - Rejected because it still couples to specific database
3. **No abstraction** - Rejected because it prevents storage flexibility

## References
- [ADR-001: Runtime Architecture](./001-runtime-architecture.md)
- [ADR-005: Event Sourcing](./005-event-sourcing.md)
