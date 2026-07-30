# ADR-006: Scheduler

## Status
Accepted

## Context
The Runtime needs a mechanism for:
- **Scheduling engine execution** based on dependencies
- **Parallel execution** where possible
- **Retry logic** for failed engines
- **Timeout handling** for long-running engines
- **Priority-based execution** for critical engines

Simple sequential execution is insufficient because:
- No parallelization of independent engines
- No retry logic for transient failures
- No timeout protection
- No priority handling for critical paths

## Decision
Implement **Scheduler** with the following characteristics:

### Core Features
1. **Dependency Resolution**
   - Topological sort of engine dependencies
   - Identify parallelizable execution paths
   - Detect circular dependencies

2. **Execution Orchestration**
   - Parallel execution of independent engines
   - Sequential execution of dependent engines
   - Fallback to alternative engines

3. **Retry Logic**
   - Configurable retry policies per engine
   - Exponential backoff
   - Max retry limits
   - Retry success/failure tracking

4. **Timeout Handling**
   - Per-engine timeout configuration
   - Global timeout for entire execution
   - Timeout cancellation and cleanup

5. **Priority Management**
   - Priority-based execution ordering
   - Critical path prioritization
   - Preemption for high-priority tasks

### Scheduler Interface
```typescript
interface Scheduler {
  schedule(executionPlan: ExecutionPlan): Promise<ExecutionResult>;
  retry(engineId: string, context: ExecutionContext): Promise<ExecutionResult>;
  cancel(executionId: string): void;
  getQueueStatus(): QueueStatus;
}
```

### Integration with ExecutionGraph
- Scheduler uses ExecutionGraph for dependency resolution
- Scheduler records execution metrics in RuntimeMetricsAggregator
- Scheduler publishes events to EventBus for execution tracking

## Consequences
### Positive
- Efficient parallel execution of independent engines
- Resilient execution with retry logic
- Timeout protection for long-running engines
- Priority handling for critical paths

### Negative
- Additional complexity in execution orchestration
- Need for careful dependency management
- Potential for deadlocks in circular dependencies

## Alternatives Considered
1. **Sequential execution only** - Rejected because no parallelization
2. **No retry logic** - Rejected because no resilience
3. **No timeout handling** - Rejected because no protection against hangs

## References
- [ADR-001: Runtime Architecture](./ADR-001-runtime.md)
- [ADR-005: Event Sourcing](./005-event-sourcing.md)
