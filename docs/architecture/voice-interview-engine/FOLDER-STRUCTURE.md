# Folder Structure - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

The Voice Interview Engine follows the same folder structure as FEATURE_B5 and Interview Preparation Engine, ensuring consistency across reference implementations.

---

## Root Structure

```
core/voice-interview/
├── domain/
│   ├── aggregates/
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   ├── policies/
│   ├── events/
│   ├── errors/
│   └── types.ts
├── application/
│   ├── use-cases/
│   ├── services/
│   ├── orchestrators/
│   ├── ports/
│   ├── dtos/
│   ├── events/
│   └── types.ts
├── infrastructure/
│   ├── adapters/
│   ├── clients/
│   ├── providers/
│   ├── mappers/
│   ├── configuration/
│   └── types.ts
├── integration/
│   ├── handlers/
│   ├── integration/
│   └── types.ts
├── bootstrap/
│   ├── engine.ts
│   └── container.ts
└── __tests__/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── integration/
```

---

## Domain Layer

### aggregates/

**Purpose**: Aggregate roots that enforce consistency boundaries

**Files**:
- `InterviewSessionAggregate.ts`

**Responsibility**: Aggregate root for interview session management

---

### entities/

**Purpose**: Entities with identity and lifecycle

**Files**:
- `InterviewSession.ts`
- `QuestionExecution.ts`
- `CandidateResponse.ts`
- `InterviewTimeline.ts`
- `InterviewProgress.ts`

**Responsibility**: Domain entities with identity

---

### value-objects/

**Purpose**: Immutable value objects

**Files**:
- `InterviewState.ts`
- `QuestionState.ts`
- `ResponseState.ts`
- `SessionTiming.ts`
- `Turn.ts`
- `Latency.ts`
- `VoiceSettings.ts`
- `SpeakingWindow.ts`
- `SilenceTimeout.ts`
- `InterruptionPolicy.ts`
- `RetryPolicy.ts`
- `SpeechQuality.ts`
- `ConversationContext.ts`
- `QuestionIndex.ts`
- `InterviewStatistics.ts`

**Responsibility**: Immutable value objects

---

### services/

**Purpose**: Domain services for cross-entity operations

**Files**:
- `InterviewFlowService.ts`
- `QuestionSelectionService.ts`
- `TimeManagementService.ts`
- `ConversationService.ts`
- `TransitionService.ts`
- `InterruptionService.ts`
- `PauseResumeService.ts`
- `CompletionService.ts`

**Responsibility**: Domain services with business logic

---

### policies/

**Purpose**: Policies for cross-cutting concerns

**Files**:
- `MaxSilencePolicy.ts`
- `MaxRetriesPolicy.ts`
- `TimeLimitPolicy.ts`
- `QuestionOrderPolicy.ts`
- `InterruptionPolicy.ts`
- `CompletionPolicy.ts`

**Responsibility**: Business rule policies

---

### events/

**Purpose**: Domain events

**Files**:
- `InterviewStarted.ts`
- `QuestionStarted.ts`
- `QuestionCompleted.ts`
- `CandidateSpeaking.ts`
- `CandidateStoppedSpeaking.ts`
- `AIStartedSpeaking.ts`
- `AIStoppedSpeaking.ts`
- `SilenceDetected.ts`
- `InterruptionDetected.ts`
- `QuestionSkipped.ts`
- `InterviewPaused.ts`
- `InterviewResumed.ts`
- `InterviewCompleted.ts`
- `InterviewCancelled.ts`
- `InterviewTimeout.ts`
- `ConversationError.ts`

**Responsibility**: Domain events

---

### errors/

**Purpose**: Domain errors

**Files**:
- `InterviewError.ts`
- `QuestionError.ts`
- `ResponseError.ts`
- `StateTransitionError.ts`
- `TimeoutError.ts`
- `ValidationError.ts`

**Responsibility**: Domain error types

---

### types.ts

**Purpose**: Shared domain types

**Content**: Shared types used across domain layer

---

## Application Layer

### use-cases/

**Purpose**: Use cases for application orchestration

**Files**:
- `StartInterview.ts`
- `PauseInterview.ts`
- `ResumeInterview.ts`
- `StopInterview.ts`
- `NextQuestion.ts`
- `SkipQuestion.ts`
- `ReceiveTranscript.ts`
- `StartAIResponse.ts`
- `FinishAIResponse.ts`
- `RegisterSilence.ts`
- `RegisterInterruption.ts`
- `CompleteInterview.ts`
- `AbortInterview.ts`
- `GetInterviewStatus.ts`
- `HandleTimeout.ts`

**Responsibility**: Application use cases

---

### services/

**Purpose**: Application services

**Files**:
- `InterviewOrchestrator.ts`
- `EventPublisher.ts`

**Responsibility**: Application-level services

---

### orchestrators/

**Purpose**: Orchestrators for complex workflows

**Files**:
- `InterviewFlowOrchestrator.ts`

**Responsibility**: Complex workflow orchestration

---

### ports/

**Purpose**: Ports (interfaces) for infrastructure dependencies

**Files**:
- `SpeechRecognitionPort.ts`
- `SpeechSynthesisPort.ts`
- `RuntimePort.ts`
- `InterviewPersistencePort.ts`
- `TelemetryPort.ts`
- `AnalyticsPort.ts`
- `LoggingPort.ts`
- `ClockPort.ts`
- `UUIDPort.ts`

**Responsibility**: Infrastructure interfaces

---

### dtos/

**Purpose**: Data Transfer Objects

**Files**:
- `StartInterviewRequest.ts`
- `StartInterviewResponse.ts`
- `PauseInterviewRequest.ts`
- `PauseInterviewResponse.ts`
- `ResumeInterviewRequest.ts`
- `ResumeInterviewResponse.ts`
- `StopInterviewRequest.ts`
- `StopInterviewResponse.ts`
- `NextQuestionRequest.ts`
- `NextQuestionResponse.ts`
- `SkipQuestionRequest.ts`
- `SkipQuestionResponse.ts`
- `ReceiveTranscriptRequest.ts`
- `ReceiveTranscriptResponse.ts`
- `StartAIResponseRequest.ts`
- `StartAIResponseResponse.ts`
- `FinishAIResponseRequest.ts`
- `FinishAIResponseResponse.ts`
- `RegisterSilenceRequest.ts`
- `RegisterSilenceResponse.ts`
- `RegisterInterruptionRequest.ts`
- `RegisterInterruptionResponse.ts`
- `CompleteInterviewRequest.ts`
- `CompleteInterviewResponse.ts`
- `AbortInterviewRequest.ts`
- `AbortInterviewResponse.ts`
- `GetInterviewStatusRequest.ts`
- `GetInterviewStatusResponse.ts`
- `HandleTimeoutRequest.ts`
- `HandleTimeoutResponse.ts`

**Responsibility**: Request/response DTOs

---

### events/

**Purpose**: Application events

**Files**:
- `InterviewEvent.ts`

**Responsibility**: Application-level events

---

### types.ts

**Purpose**: Shared application types

**Content**: Shared types used across application layer

---

## Infrastructure Layer

### adapters/

**Purpose**: Adapters for concrete implementations

**Files**:
- `OpenAIRealtimeAdapter.ts`
- `DeepgramAdapter.ts`
- `AzureSpeechAdapter.ts`
- `ElevenLabsAdapter.ts`
- `SupabaseAdapter.ts`
- `LoggerAdapter.ts`
- `TelemetryAdapter.ts`
- `AnalyticsAdapter.ts`
- `ClockAdapter.ts`
- `UUIDAdapter.ts`

**Responsibility**: Concrete implementations of ports

---

### clients/

**Purpose**: External service clients

**Files**:
- `OpenAIClient.ts`
- `DeepgramClient.ts`
- `AzureSpeechClient.ts`
- `ElevenLabsClient.ts`
- `SupabaseClient.ts`

**Responsibility**: External service communication

---

### providers/

**Purpose**: Configuration providers

**Files**:
- `ConfigurationService.ts`

**Responsibility**: Configuration management

---

### mappers/

**Purpose**: Data mappers

**Files**:
- `InterviewSessionMapper.ts`

**Responsibility**: Data transformation

---

### configuration/

**Purpose**: Configuration types

**Files**:
- `OpenAIConfig.ts`
- `DeepgramConfig.ts`
- `AzureSpeechConfig.ts`
- `ElevenLabsConfig.ts`
- `SupabaseConfig.ts`
- `TelemetryConfig.ts`
- `AnalyticsConfig.ts`
- `LoggingConfig.ts`

**Responsibility**: Configuration types

---

### types.ts

**Purpose**: Shared infrastructure types

**Content**: Shared types used across infrastructure layer

---

## Integration Layer

### handlers/

**Purpose**: Event handlers

**Files**:
- `InterviewEventHandler.ts`

**Responsibility**: Domain event handling

---

### integration/

**Purpose**: Integration coordination

**Files**:
- `InterviewIntegration.ts`

**Responsibility**: Integration orchestration

---

### types.ts

**Purpose**: Shared integration types

**Content**: Shared types used across integration layer

---

## Bootstrap Layer

### engine.ts

**Purpose**: Engine bootstrap

**Responsibility**: Engine initialization

---

### container.ts

**Purpose**: Composition root

**Responsibility**: Dependency assembly

---

## Tests

### domain/

**Purpose**: Domain tests

**Files**:
- `InterviewSessionAggregate.test.ts`
- `InterviewFlowService.test.ts`
- `QuestionSelectionService.test.ts`
- `MaxSilencePolicy.test.ts`
- etc.

**Responsibility**: Domain layer tests

---

### application/

**Purpose**: Application tests

**Files**:
- `StartInterview.test.ts`
- `PauseInterview.test.ts`
- `ResumeInterview.test.ts`
- etc.

**Responsibility**: Application layer tests

---

### infrastructure/

**Purpose**: Infrastructure tests

**Files**:
- `OpenAIRealtimeAdapter.test.ts`
- `SupabaseAdapter.test.ts`
- etc.

**Responsibility**: Infrastructure layer tests

---

### integration/

**Purpose**: Integration tests

**Files**:
- `InterviewIntegration.test.ts`

**Responsibility**: Integration tests

---

## Conclusion

The Voice Interview Engine folder structure follows the same pattern as FEATURE_B5 and Interview Preparation Engine, ensuring consistency across reference implementations.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
