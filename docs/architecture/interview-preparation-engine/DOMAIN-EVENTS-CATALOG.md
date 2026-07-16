# Interview Preparation Engine - Domain Events Catalog

## Overview
This document defines all domain events for the Interview Preparation Engine, following the event-driven architecture pattern established in ADR-005.

---

## Event Categories

### 1. Planning Events
### 2. Generation Events
### 3. Validation Events
### 4. Modification Events
### 5. Completion Events

---

## 1. Planning Events

### InterviewPlanRequested

**Trigger**: User or system requests interview plan generation
**Payload**:
```typescript
{
  eventId: string;
  eventType: "InterviewPlanRequested";
  timestamp: Date;
  correlationId: string;
  data: {
    candidateId: string;
    jobOfferId: string;
    matchingId: string;
    requestedBy: string;
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    constraints?: InterviewConstraints;
    customRequirements?: string[];
  };
}
```

**Consumers**: InterviewPlanningService, QuestionGenerationService
**Side Effects**: Initiates plan generation workflow
**Failure Handling**: Event retried, alert sent if retry limit exceeded

---

### InterviewPlanGenerationStarted

**Trigger**: Plan generation process begins
**Payload**:
```typescript
{
  eventId: string;
  eventType: "InterviewPlanGenerationStarted";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    candidateId: string;
    jobOfferId: string;
    matchingId: string;
    estimatedDuration: number;
  };
}
```

**Consumers**: DiagnosticCollector, MonitoringService
**Side Effects**: Logs generation start, begins performance tracking
**Failure Handling**: None (informational)

---

## 2. Generation Events

### InterviewPlanGenerated

**Trigger**: Interview plan successfully generated
**Payload**:
```typescript
{
  eventId: string;
  eventType: "InterviewPlanGenerated";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    candidateId: string;
    jobOfferId: string;
    matchingId: string;
    totalQuestions: number;
    totalDuration: number;
    sections: string[];
    coverageMatrix: CoverageMatrix;
    summary: InterviewSummary;
  };
}
```

**Consumers**: InterviewValidationService, NotificationService, AnalyticsService
**Side Effects**: Triggers validation, sends notification, records analytics
**Failure Handling**: Event retried, plan marked as "pending validation"

---

### QuestionGenerated

**Trigger**: Individual question generated (by AI or template)
**Payload**:
```typescript
{
  eventId: string;
  eventType: "QuestionGenerated";
  timestamp: Date;
  correlationId: string;
  data: {
    questionId: string;
    planId: string;
    sectionId: string;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    competencyIds: string[];
    generator: "AI" | "TEMPLATE" | "HYBRID";
    generationTime: number;
  };
}
```

**Consumers**: QuestionOrderingService, CoverageAnalysisService
**Side Effects**: Adds question to plan, updates coverage matrix
**Failure Handling**: Question discarded, alternative generated

---

### SectionGenerated

**Trigger**: Interview section created
**Payload**:
```typescript
{
  eventId: string;
  eventType: "SectionGenerated";
  timestamp: Date;
  correlationId: string;
  data: {
    sectionId: string;
    planId: string;
    name: string;
    objective: string;
    questionCount: number;
    duration: number;
  };
}
```

**Consumers**: QuestionOrderingService, TimingCalculationService
**Side Effects**: Adds section to plan, calculates timing
**Failure Handling**: Section rejected, plan generation fails

---

## 3. Validation Events

### CoverageCompleted

**Trigger**: Competency coverage analysis completed
**Payload**:
```typescript
{
  eventId: string;
  eventType: "CoverageCompleted";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    coverageMatrix: CoverageMatrix;
    overallCoverage: number;
    gaps: string[];
    isSufficient: boolean;
  };
}
```

**Consumers**: InterviewValidationService, AdaptiveRules
**Side Effects**: Triggers validation, triggers adaptation if gaps found
**Failure Handling**: Coverage marked as "incomplete", plan rejected

---

### PlanValidated

**Trigger**: Interview plan passes all validations
**Payload**:
```typescript
{
  eventId: string;
  eventType: "PlanValidated";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    validationResults: ValidationResult;
    score: number;
    passedRules: string[];
    failedRules: string[];
    warnings: string[];
  };
}
```

**Consumers**: InterviewPlanningService, NotificationService
**Side Effects**: Plan marked as "validated", notification sent
**Failure Handling**: None (success event)

---

### PlanRejected

**Trigger**: Interview plan fails validation
**Payload**:
```typescript
{
  eventId: string;
  eventType: "PlanRejected";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    rejectionReason: string;
    failedRules: string[];
    canRetry: boolean;
    retryAfter?: Date;
  };
}
```

**Consumers**: InterviewPlanningService, NotificationService, MonitoringService
**Side Effects**: Plan marked as "rejected", notification sent, retry initiated if possible
**Failure Handling**: Alert sent to monitoring, manual intervention required

---

### ValidationFailed

**Trigger**: Validation process encounters error
**Payload**:
```typescript
{
  eventId: string;
  eventType: "ValidationFailed";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    error: string;
    errorType: string;
    stackTrace?: string;
  };
}
```

**Consumers**: MonitoringService, ErrorHandlingService
**Side Effects**: Error logged, alert sent
**Failure Handling**: Validation retried, manual intervention if retry fails

---

## 4. Modification Events

### QuestionAdded

**Trigger**: Question added to plan (manual or automatic)
**Payload**:
```typescript
{
  eventId: string;
  eventType: "QuestionAdded";
  timestamp: Date;
  correlationId: string;
  data: {
    questionId: string;
    planId: string;
    sectionId: string;
    addedBy: string;
    reason: string;
  };
}
```

**Consumers**: CoverageAnalysisService, QuestionOrderingService
**Side Effects**: Updates coverage matrix, reorders questions
**Failure Handling**: Question not added, error logged

---

### QuestionRemoved

**Trigger**: Question removed from plan
**Payload**:
```typescript
{
  eventId: string;
  eventType: "QuestionRemoved";
  timestamp: Date;
  correlationId: string;
  data: {
    questionId: string;
    planId: string;
    sectionId: string;
    removedBy: string;
    reason: string;
  };
}
```

**Consumers**: CoverageAnalysisService, QuestionOrderingService
**Side Effects**: Updates coverage matrix, reorders questions
**Failure Handling**: Question not removed, error logged

---

### QuestionReordered

**Trigger**: Question order changed
**Payload**:
```typescript
{
  eventId: string;
  eventType: "QuestionReordered";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    sectionId: string;
    questionIds: string[];
    reorderedBy: string;
    reason: string;
  };
}
```

**Consumers**: QuestionOrderingService, DependencyValidator
**Side Effects**: Validates dependencies, updates order
**Failure Handling**: Order not changed, dependency violation logged

---

### DifficultyAdjusted

**Trigger**: Question difficulty adjusted (adaptive or manual)
**Payload**:
```typescript
{
  eventId: string;
  eventType: "DifficultyAdjusted";
  timestamp: Date;
  correlationId: string;
  data: {
    questionId: string;
    planId: string;
    sectionId: string;
    oldDifficulty: QuestionDifficulty;
    newDifficulty: QuestionDifficulty;
    adjustedBy: string;
    reason: string;
  };
}
```

**Consumers**: DifficultyPolicy, CoverageAnalysisService
**Side Effects**: Validates difficulty progression, updates coverage
**Failure Handling**: Adjustment rejected, policy violation logged

---

### SectionReordered

**Trigger**: Section order changed
**Payload**:
```typescript
{
  eventId: string;
  eventType: "SectionReordered";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    sectionIds: string[];
    reorderedBy: string;
    reason: string;
  };
}
```

**Consumers**: QuestionOrderingService, TimingCalculationService
**Side Effects**: Recalculates timing, validates logical order
**Failure Handling**: Order not changed, logical order violation logged

---

### PlanModified

**Trigger**: Interview plan modified (generic event)
**Payload**:
```typescript
{
  eventId: string;
  eventType: "PlanModified";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    modifiedBy: string;
    modificationType: "QUESTION_ADDED" | "QUESTION_REMOVED" | "REORDERED" | "DIFFICULTY_ADJUSTED" | "CUSTOM";
    changes: Record<string, unknown>;
  };
}
```

**Consumers**: InterviewValidationService, NotificationService
**Side Effects**: Triggers revalidation, notification sent
**Failure Handling**: Modification not applied, error logged

---

## 5. Completion Events

### InterviewPlanCompleted

**Trigger**: Interview plan generation and validation complete
**Payload**:
```typescript
{
  eventId: string;
  eventType: "InterviewPlanCompleted";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    candidateId: string;
    jobOfferId: string;
    status: "APPROVED" | "PENDING_REVIEW" | "REJECTED";
    totalDuration: number;
    totalQuestions: number;
    generationDuration: number;
    validationScore: number;
  };
}
```

**Consumers**: Voice Interview Engine, NotificationService, AnalyticsService
**Side Effects**: Plan available for execution, notification sent, analytics recorded
**Failure Handling**: None (completion event)

---

### InterviewPlanApproved

**Trigger**: Interview plan approved (manual or automatic)
**Payload**:
```typescript
{
  eventId: string;
  eventType: "InterviewPlanApproved";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    approvedBy: string;
    approvalType: "AUTOMATIC" | "MANUAL";
    comments?: string;
  };
}
```

**Consumers**: Voice Interview Engine, NotificationService
**Side Effects**: Plan marked as "approved", ready for execution
**Failure Handling**: Approval not applied, error logged

---

### InterviewPlanArchived

**Trigger**: Interview plan archived (after execution or expiration)
**Payload**:
```typescript
{
  eventId: string;
  eventType: "InterviewPlanArchived";
  timestamp: Date;
  correlationId: string;
  data: {
    planId: string;
    archivedBy: string;
    reason: "EXECUTED" | "EXPIRED" | "CANCELLED" | "REPLACED";
    archiveDate: Date;
  };
}
```

**Consumers**: ArchiveService, AnalyticsService
**Side Effects**: Plan moved to archive, analytics recorded
**Failure Handling**: Archive failed, plan remains active

---

## Event Flow

### Typical Generation Flow
```
InterviewPlanRequested
  ↓
InterviewPlanGenerationStarted
  ↓
SectionGenerated (multiple)
  ↓
QuestionGenerated (multiple)
  ↓
CoverageCompleted
  ↓
PlanValidated
  ↓
InterviewPlanCompleted
  ↓
InterviewPlanApproved
```

### Modification Flow
```
PlanModified
  ↓
QuestionAdded / QuestionRemoved / QuestionReordered / DifficultyAdjusted
  ↓
CoverageCompleted
  ↓
PlanValidated
  ↓
InterviewPlanCompleted
```

### Failure Flow
```
InterviewPlanRequested
  ↓
InterviewPlanGenerationStarted
  ↓
[Error occurs]
  ↓
ValidationFailed
  ↓
PlanRejected
```

---

## Event Handling

### Event Bus
- Implementation follows ADR-005 (Domain Events)
- LocalEventBus for in-process events
- Future: Kafka/Redis for distributed events

### Event Subscribers
- InterviewPlanningService: Planning events
- QuestionGenerationService: Generation events
- InterviewValidationService: Validation events
- CoverageAnalysisService: Coverage events
- QuestionOrderingService: Ordering events
- NotificationService: All events (notifications)
- MonitoringService: All events (monitoring)
- AnalyticsService: Completion events

### Event Guarantees
- At-least-once delivery
- Idempotent event handlers
- Retry with exponential backoff
- Dead letter queue for failed events

---

## Event Correlation

### Correlation ID
- All events in a flow share the same correlationId
- Correlation ID generated on initial request
- Used for tracing and debugging

### Event Ordering
- Events within a flow are ordered
- Timestamp-based ordering
- Sequence numbers for critical ordering

### Event Aggregation
- Related events can be aggregated for analytics
- Aggregation based on correlationId
- Time-windowed aggregation

---

## Event Schema Evolution

### Versioning
- Each event has a schema version
- Backward-compatible changes preferred
- Breaking changes require new event type

### Deprecation
- Deprecated events marked with @deprecated
- Grace period for migration
- Clear communication of changes

### Extension
- Events can be extended with optional fields
- Consumers ignore unknown fields
- Validation ensures required fields present
