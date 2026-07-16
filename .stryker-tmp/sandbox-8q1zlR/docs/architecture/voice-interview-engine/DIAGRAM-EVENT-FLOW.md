# Event Flow Diagram - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This document presents the event flow for the Voice Interview Engine, showing how domain events are generated, published, and consumed.

---

## Event Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Domain Layer                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           InterviewSessionAggregate                                │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  Domain Event Generation                                     │  │  │
│  │  │  - InterviewStarted                                          │  │  │
│  │  │  - QuestionStarted                                           │  │  │
│  │  │  - QuestionCompleted                                        │  │  │
│  │  │  - CandidateSpeaking                                         │  │  │
│  │  │  - CandidateStoppedSpeaking                                 │  │  │
│  │  │  - AIStartedSpeaking                                        │  │  │
│  │  │  - AIStoppedSpeaking                                         │  │  │
│  │  │  - SilenceDetected                                           │  │  │
│  │  │  - InterruptionDetected                                     │  │  │
│  │  │  - QuestionSkipped                                           │  │  │
│  │  │  - InterviewPaused                                           │  │  │
│  │  │  - InterviewResumed                                          │  │  │
│  │  │  - InterviewCompleted                                        │  │  │
│  │  │  - InterviewCancelled                                        │  │  │
│  │  │  - InterviewTimeout                                          │  │  │
│  │  │  - ConversationError                                         │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Application Layer                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    EventPublisher                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  Event Publishing                                            │  │  │
│  │  │  - Publish to Integration Layer                              │  │  │
│  │  │  - Publish to Ports (Telemetry, Analytics, Logging)         │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Integration Layer                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    InterviewEventHandler                             │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  Event Handling                                             │  │  │
│  │  │  - Subscribe to Domain Events                               │  │  │
│  │  │  - Route events to external systems                         │  │  │
│  │  │  - Trigger side effects                                      │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Infrastructure Layer                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        Adapters                                     │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                       │  │
│  │  │TelemetryAdapter  │  │AnalyticsAdapter │                       │  │
│  │  │                  │  │                  │                       │  │
│  │  │- Log events      │  │- Track events    │                       │  │
│  │  │- Send metrics    │  │- Send analytics   │                       │  │
│  │  └──────────────────┘  └──────────────────┘                       │  │
│  │  ┌──────────────────┐                                               │  │
│  │  │LoggerAdapter     │                                               │  │
│  │  │                  │                                               │  │
│  │  │- Log events      │                                               │  │
│  │  └──────────────────┘                                               │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        External Systems                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │Telemetry     │  │Analytics     │  │Logging      │                   │
│  │Service       │  │Service       │  │Service      │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Event Lifecycle

### 1. Event Generation

**Location**: Domain Layer (InterviewSessionAggregate)

**Trigger**: Business logic execution in aggregate methods

**Process**:
1. Aggregate method executes business logic
2. Aggregate validates state transitions
3. Aggregate creates domain event
4. Aggregate adds event to event collection
5. Aggregate returns event to use case

### 2. Event Publishing

**Location**: Application Layer (EventPublisher)

**Trigger**: Use case receives event from aggregate

**Process**:
1. Use case receives event from aggregate
2. Use case calls EventPublisher.publish()
3. EventPublisher validates event
4. EventPublisher publishes to Integration Layer
5. EventPublisher publishes to Ports (Telemetry, Analytics, Logging)

### 3. Event Handling

**Location**: Integration Layer (InterviewEventHandler)

**Trigger**: Event published from Application Layer

**Process**:
1. InterviewEventHandler receives event
2. InterviewEventHandler identifies event type
3. InterviewEventHandler routes to appropriate handler
4. Handler executes side effects
5. Handler publishes to external systems

### 4. Event Consumption

**Location**: Infrastructure Layer (Adapters)

**Trigger**: Event received from Integration Layer

**Process**:
1. Adapter receives event
2. Adapter transforms event to external format
3. Adapter sends to external system
4. Adapter handles errors
5. Adapter returns result

---

## Event Flow by Event Type

### Interview Lifecycle Events

#### InterviewStarted

```
Aggregate.start() → InterviewStarted → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interview start
- AnalyticsAdapter: Track interview start
- LoggerAdapter: Log interview start

#### InterviewPaused

```
Aggregate.pause() → InterviewPaused → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interview pause
- AnalyticsAdapter: Track interview pause
- LoggerAdapter: Log interview pause

#### InterviewResumed

```
Aggregate.resume() → InterviewResumed → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interview resume
- AnalyticsAdapter: Track interview resume
- LoggerAdapter: Log interview resume

#### InterviewCompleted

```
Aggregate.complete() → InterviewCompleted → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interview completion
- AnalyticsAdapter: Track interview completion
- LoggerAdapter: Log interview completion
- InterviewPersistencePort: Save interview state

#### InterviewCancelled

```
Aggregate.cancel() → InterviewCancelled → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interview cancellation
- AnalyticsAdapter: Track interview cancellation
- LoggerAdapter: Log interview cancellation

#### InterviewTimeout

```
Aggregate.handleTimeout() → InterviewTimeout → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interview timeout
- AnalyticsAdapter: Track interview timeout
- LoggerAdapter: Log interview timeout

### Question Lifecycle Events

#### QuestionStarted

```
Aggregate.nextQuestion() → QuestionStarted → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log question start
- AnalyticsAdapter: Track question start
- LoggerAdapter: Log question start

#### QuestionCompleted

```
Aggregate.completeQuestion() → QuestionCompleted → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log question completion
- AnalyticsAdapter: Track question completion
- LoggerAdapter: Log question completion

#### QuestionSkipped

```
Aggregate.skipQuestion() → QuestionSkipped → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log question skip
- AnalyticsAdapter: Track question skip
- LoggerAdapter: Log question skip

### Conversation Events

#### CandidateSpeaking

```
Aggregate.receiveTranscript() → CandidateSpeaking → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log candidate speaking
- AnalyticsAdapter: Track candidate speaking
- LoggerAdapter: Log candidate speaking

#### CandidateStoppedSpeaking

```
Aggregate.stopSpeaking() → CandidateStoppedSpeaking → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log candidate stopped speaking
- AnalyticsAdapter: Track candidate stopped speaking
- LoggerAdapter: Log candidate stopped speaking

#### AIStartedSpeaking

```
Aggregate.startAIResponse() → AIStartedSpeaking → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log AI started speaking
- AnalyticsAdapter: Track AI started speaking
- LoggerAdapter: Log AI started speaking

#### AIStoppedSpeaking

```
Aggregate.finishAIResponse() → AIStoppedSpeaking → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log AI stopped speaking
- AnalyticsAdapter: Track AI stopped speaking
- LoggerAdapter: Log AI stopped speaking

### Detection Events

#### SilenceDetected

```
Aggregate.registerSilence() → SilenceDetected → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log silence detection
- AnalyticsAdapter: Track silence detection
- LoggerAdapter: Log silence detection

#### InterruptionDetected

```
Aggregate.registerInterruption() → InterruptionDetected → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log interruption detection
- AnalyticsAdapter: Track interruption detection
- LoggerAdapter: Log interruption detection

### Error Events

#### ConversationError

```
Aggregate.handleError() → ConversationError → EventPublisher → InterviewEventHandler → Telemetry/Analytics/Logging
```

**Consumers**:
- TelemetryAdapter: Log conversation error
- AnalyticsAdapter: Track conversation error
- LoggerAdapter: Log conversation error

---

## Event Flow Diagram (Detailed)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Use Case  │    │   Aggregate │    │   Event     │    │   Event     │
└─────────────┘    └─────────────┘    │  Publisher  │    │  Handler    │
       │                   │            └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ execute()         │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ business logic    │                   │
       │                   │───────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │ event             │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │                   │                   │ publish()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │                   │ handle()
       │                   │                   │                   │
       │                   │                   │                   │──────────>│
       │                   │                   │                   │           │
       │                   │                   │                   │           │
       │                   │                   │                   │           │
       │                   │                   │                   │           ▼
       │                   │                   │                   │    ┌─────────────┐
       │                   │                   │                   │    │  Adapters  │
       │                   │                   │                   │    └─────────────┘
       │                   │                   │                   │           │
       │                   │                   │                   │           │
       │                   │                   │                   │           ▼
       │                   │                   │                   │    ┌─────────────┐
       │                   │                   │                   │    │  External   │
       │                   │                   │                   │    │  Systems   │
       │                   │                   │                   │    └─────────────┘
```

---

## Event Ordering

### Guaranteed Ordering

Events within a single aggregate operation are guaranteed to be in order.

### Cross-Aggregate Ordering

Events across different aggregates are not guaranteed to be in order.

### Event Timestamps

All events include a timestamp for ordering and debugging.

---

## Event Idempotency

### Idempotent Events

All events are idempotent. Receiving the same event multiple times has no additional effect.

### Event Deduplication

EventPublisher includes deduplication logic to prevent duplicate event publishing.

---

## Event Error Handling

### Publishing Errors

If EventPublisher fails to publish an event:
1. Log error
2. Retry with exponential backoff
3. After max retries, store event in dead letter queue

### Handling Errors

If InterviewEventHandler fails to handle an event:
1. Log error
2. Retry with exponential backoff
3. After max retries, store event in dead letter queue

### Consumption Errors

If Adapter fails to consume an event:
1. Log error
2. Retry with exponential backoff
3. After max retries, store event in dead letter queue

---

## Conclusion

The Voice Interview Engine event flow follows a clear pattern:

1. **Generation**: Domain Layer (Aggregate)
2. **Publishing**: Application Layer (EventPublisher)
3. **Handling**: Integration Layer (InterviewEventHandler)
4. **Consumption**: Infrastructure Layer (Adapters)

All 17 domain events follow this flow, ensuring consistency and traceability.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
