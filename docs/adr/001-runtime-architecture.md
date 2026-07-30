# ADR-001: Runtime Architecture

## Status
Accepted

## Context
The Trajectoire AI Operating System requires a unified runtime to orchestrate multiple cognitive engines (Evidence, Contradiction, Temporal, Confidence). Each engine needs to:
- Accept structured inputs
- Process data using deterministic rules or LLM calls
- Produce events with complete metadata
- Integrate with a central event store
- Be observable through metrics

## Decision
Implement a **Runtime** with the following architecture:

### Core Components
1. **BaseEngine** - Abstract base class for all engines
   - Standardized `execute()` method
   - EngineManifest for capabilities declaration
   - Built-in error handling and retries
   - Metadata tracking (RuleId, RuleVersion, TraceId, CorrelationId)

2. **EngineManifest** - Declarative engine specification
   - `id`, `version`, `description`
   - `consumes` (input types)
   - `produces` (output types)
   - `facts` (fact types used)
   - `events` (event types emitted)
   - `providers` (LLM providers used)
   - `timeout`, `retries`

3. **ExecutionGraph** - Orchestrates engine execution
   - Topological sort for dependency resolution
   - Parallel execution where possible
   - Fallback and retry strategies
   - Cost and duration estimation

4. **RuntimeMetricsAggregator** - Observability
   - LLM cost, time, tokens
   - TypeScript processing time
   - Policy evaluation time
   - Cache hit rate
   - Memory usage
   - Fact consumption/production

### Separation of Concerns
- **Engines** orchestrate but don't contain business logic
- **Catalogs** contain business logic (types, patterns)
- **Policies** contain evaluation rules
- **Validators** contain validation rules
- **Ledgers** record all decisions with complete metadata

## Consequences
### Positive
- Consistent engine interface across all cognitive capabilities
- Complete observability through RuntimeMetrics
- Replay capability through EventStore
- Easy to add new engines by extending BaseEngine
- Clear separation between orchestration and business logic

### Negative
- Additional boilerplate for new engines
- Requires discipline to keep business logic out of engines
- Slight performance overhead from abstraction layers

## Alternatives Considered
1. **Direct LLM calls in engines** - Rejected because it makes testing difficult and hides business logic
2. **No engine abstraction** - Rejected because it would lead to inconsistent interfaces
3. **Event-driven only** - Rejected because some engines need synchronous execution

## References
- [ADR-002: EventBus](./002-eventbus.md)
- [ADR-003: Repository Pattern](./003-repository.md)
- [ADR-004: Ledger Pattern](./004-ledger.md)
