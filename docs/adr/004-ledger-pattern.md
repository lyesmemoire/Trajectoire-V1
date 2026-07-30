# ADR-004: Ledger Pattern

## Status
Accepted

## Context
The Runtime needs to record all decisions made by engines for:
- **Audit trail** - Who decided what and when
- **Replay capability** - Reconstruct state from decisions
- **Debugging** - Understand why a decision was made
- **Compliance** - Prove decisions were made correctly

Simple logging is insufficient because:
- No structured query capability
- No metadata for traceability
- No relationship to events
- No replay support

## Decision
Implement **Ledger Pattern** with the following characteristics:

### Ledger Structure
Each ledger entry contains complete metadata:
```typescript
interface LedgerEntry {
  id: string;
  timestamp: Date;
  ruleId: string;
  ruleVersion: string;
  traceId: string;
  correlationId: string;
  sessionId: string;
  engineVersion: string;
  promptVersion?: string;
  provider?: string;
  // ... domain-specific fields
}
```

### Ledger Types
1. **ContradictionLedger** - Records contradiction detections
   - `observationAId`, `observationBId`
   - `assessment` (hasContradiction, severity, confidence)
   - `policy` (which policies were applied)
   - `resolvedAt`, `resolutionMethod`

2. **EvidenceLedger** - Records evidence assessments
   - `originObservationId`
   - `evidenceType`, `strength`
   - `hasEvidence`, `confidence`

3. **ConfidenceLedger** - Records confidence calculations
   - `overallConfidence`
   - `breakdown` (evidence, contradiction, temporal, factuality)
   - `factors` (weighted contributions)

### Ledger Capabilities
- Query by ID, session, trace, severity
- Query by time range
- Get statistics (total, by type, by severity)
- Mark as resolved with resolution method

## Consequences
### Positive
- Complete audit trail for all decisions
- Easy to query and analyze decisions
- Supports compliance and debugging
- Enables replay of decision history

### Negative
- Additional storage overhead
- Requires discipline to record all decisions
- More complex than simple logging

## Alternatives Considered
1. **Simple logging** - Rejected because no structured query capability
2. **EventStore only** - Rejected because events don't capture decision context
3. **No audit trail** - Rejected because compliance requires it

## References
- [ADR-001: Runtime Architecture](./001-runtime-architecture.md)
- [ADR-005: Event Sourcing](./005-event-sourcing.md)
