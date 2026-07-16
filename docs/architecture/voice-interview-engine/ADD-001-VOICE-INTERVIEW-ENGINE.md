# ADD-001: Voice Interview Engine Architecture

**Status**: ACCEPTED  
**Date**: 2025-01-11  
**Context**: Phase 3A - Architecture & Domain Design

---

## Context

The Voice Interview Engine is responsible for orchestrating the entire flow of a voice interview. It receives the interview plan from the Interview Preparation Engine and manages the interview state, question selection, timing, turn-taking, and communication with STT, TTS, Live Analysis, and Runtime.

The engine must be completely independent of Runtime and infrastructure, following the same architectural principles as FEATURE_B5 Runtime Persistence and Interview Preparation Engine.

---

## Decision

### Architecture Pattern

**Decision**: Adopt Clean Architecture with Hexagonal Architecture (Ports & Adapters)

**Rationale**:
- Ensures domain independence from infrastructure
- Enables testing without external dependencies
- Facilitates infrastructure replacement
- Aligns with reference implementations (FEATURE_B5, Interview Preparation Engine)

### Layer Structure

**Decision**: Four-layer structure following Clean Architecture

**Layers**:
1. **Domain Layer** (innermost): Aggregates, Entities, Value Objects, Domain Services, Policies, Domain Events
2. **Application Layer**: Use Cases, Services, Orchestrators, Ports, DTOs
3. **Infrastructure Layer**: Adapters, Clients, Providers, Mappers
4. **Bootstrap Layer**: Engine, Containers

**Rationale**:
- Matches reference implementations
- Ensures dependency inversion
- Enables independent testing

### Domain Model

**Decision**: InterviewSessionAggregate as the aggregate root

**Aggregate**: InterviewSessionAggregate

**Entities**:
- InterviewSession
- QuestionExecution
- CandidateResponse
- InterviewTimeline
- InterviewProgress

**Value Objects**:
- InterviewState
- QuestionState
- ResponseState
- SessionTiming
- Turn
- Latency
- VoiceSettings
- SpeakingWindow
- SilenceTimeout
- InterruptionPolicy
- RetryPolicy
- SpeechQuality
- ConversationContext
- QuestionIndex
- InterviewStatistics

**Rationale**:
- Single aggregate root ensures consistency
- Value objects for immutable concepts
- Entities for identity and lifecycle

### Domain Services

**Decision**: Domain services for cross-entity operations

**Domain Services**:
- InterviewFlowService
- QuestionSelectionService
- TimeManagementService
- ConversationService
- TransitionService
- InterruptionService
- PauseResumeService
- CompletionService

**Rationale**:
- Encapsulates complex business logic
- Avoids anemic domain model
- Follows DDD best practices

### Policies

**Decision**: Policies for cross-cutting concerns

**Policies**:
- MaxSilencePolicy
- MaxRetriesPolicy
- TimeLimitPolicy
- QuestionOrderPolicy
- InterruptionPolicy
- CompletionPolicy

**Rationale**:
- Encapsulates business rules
- Enables policy replacement
- Follows Strategy pattern

### Domain Events

**Decision**: Event-driven architecture for decoupling

**Domain Events**:
- InterviewStarted
- QuestionStarted
- QuestionCompleted
- CandidateSpeaking
- CandidateStoppedSpeaking
- AIStartedSpeaking
- AIStoppedSpeaking
- SilenceDetected
- InterruptionDetected
- QuestionSkipped
- InterviewPaused
- InterviewResumed
- InterviewCompleted
- InterviewCancelled
- InterviewTimeout
- ConversationError

**Rationale**:
- Decouples domain from side effects
- Enables event sourcing
- Follows ADR-005 (Domain Events)

### Application Layer

**Decision**: Use Cases for application orchestration

**Use Cases**:
- StartInterview
- PauseInterview
- ResumeInterview
- StopInterview
- NextQuestion
- SkipQuestion
- ReceiveTranscript
- StartAIResponse
- FinishAIResponse
- RegisterSilence
- RegisterInterruption
- CompleteInterview
- AbortInterview
- GetInterviewStatus

**Rationale**:
- Encapsulates application logic
- Provides clear API
- Follows use case pattern

### Ports

**Decision**: Ports for infrastructure dependencies

**Ports**:
- SpeechRecognitionPort (STT)
- SpeechSynthesisPort (TTS)
- RuntimePort (Runtime communication)
- InterviewPersistencePort (persistence)
- TelemetryPort (telemetry)
- AnalyticsPort (analytics)
- LoggingPort (logging)
- ClockPort (time)
- UUIDPort (ID generation)

**Rationale**:
- Decouples application from infrastructure
- Enables infrastructure replacement
- Follows Hexagonal Architecture

### Infrastructure Adapters

**Decision**: Adapters for concrete implementations

**Adapters**:
- OpenAIRealtimeAdapter (STT + TTS)
- DeepgramAdapter (STT)
- AzureSpeechAdapter (STT + TTS)
- ElevenLabsAdapter (TTS)
- SupabaseAdapter (persistence)
- LoggerAdapter (logging)
- TelemetryAdapter (telemetry)
- AnalyticsAdapter (analytics)

**Rationale**:
- Implements ports
- Encapsulates external dependencies
- Follows Port-Adapter pattern

### Dependency Injection

**Decision**: Manual constructor injection with static Composition Root

**Rationale**:
- Matches reference implementations
- Follows ADR-007 (Composition Root)
- Follows ADR-008 (Dependency Injection Strategy)
- No IoC frameworks
- No service locator

### Runtime Independence

**Decision**: Voice Interview Engine completely independent of Runtime

**Rationale**:
- Engine communicates with Runtime via RuntimePort only
- No direct Runtime dependencies
- Enables independent testing
- Follows reference implementations

### Infrastructure Independence

**Decision**: Voice Interview Engine completely independent of infrastructure

**Rationale**:
- All infrastructure accessed via ports
- No direct dependencies on OpenAI, Deepgram, etc.
- Enables infrastructure replacement
- Follows Hexagonal Architecture

---

## Consequences

### Positive

- Domain completely independent of infrastructure
- Easy to test without external dependencies
- Infrastructure can be replaced without changing domain
- Aligns with reference implementations
- Follows all architectural principles

### Negative

- More boilerplate code (adapters, mappers)
- More complex structure
- Requires careful design of ports

### Mitigation

- Use code generation for repetitive patterns
- Follow reference implementations closely
- Document all ports and adapters

---

## Status

**Status**: ACCEPTED

**Implementation**: Phase 3A - Architecture & Domain Design

**Validation**: Architecture audits will validate compliance

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
