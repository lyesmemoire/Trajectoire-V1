# Voice Interview Engine - Architecture

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

The Voice Interview Engine is responsible for orchestrating voice interview sessions. It receives interview plans from the Interview Preparation Engine and manages the interview flow, question selection, timing, turn-taking, and communication with STT, TTS, Live Analysis, and Runtime.

---

## Architecture

The Voice Interview Engine follows Clean Architecture, Hexagonal Architecture, Domain-Driven Design, and SOLID principles, matching the reference implementations (FEATURE_B5 Runtime Persistence and Interview Preparation Engine).

### Layers

1. **Domain Layer** (innermost): Aggregates, Entities, Value Objects, Domain Services, Policies, Domain Events
2. **Application Layer**: Use Cases, Services, Orchestrators, Ports, DTOs
3. **Infrastructure Layer**: Adapters, Clients, Providers, Mappers
4. **Bootstrap Layer**: Engine, Containers

---

## Domain Model

### Aggregate Root

**InterviewSessionAggregate**: Enforces consistency boundaries for interview sessions

### Entities

- InterviewSession
- QuestionExecution
- CandidateResponse
- InterviewTimeline
- InterviewProgress

### Value Objects

- InterviewState, QuestionState, ResponseState
- SessionTiming, Turn, Latency
- VoiceSettings, SpeakingWindow, SilenceTimeout
- InterruptionPolicy, RetryPolicy
- SpeechQuality, ConversationContext
- QuestionIndex, InterviewStatistics

### Domain Services

- InterviewFlowService
- QuestionSelectionService
- TimeManagementService
- ConversationService
- TransitionService
- InterruptionService
- PauseResumeService
- CompletionService

### Policies

- MaxSilencePolicy
- MaxRetriesPolicy
- TimeLimitPolicy
- QuestionOrderPolicy
- InterruptionPolicy
- CompletionPolicy

### Domain Events

- InterviewStarted, QuestionStarted, QuestionCompleted
- CandidateSpeaking, CandidateStoppedSpeaking
- AIStartedSpeaking, AIStoppedSpeaking
- SilenceDetected, InterruptionDetected
- QuestionSkipped, InterviewPaused, InterviewResumed
- InterviewCompleted, InterviewCancelled, InterviewTimeout
- ConversationError

---

## Application Layer

### Use Cases

- StartInterview, PauseInterview, ResumeInterview
- StopInterview, NextQuestion, SkipQuestion
- ReceiveTranscript, StartAIResponse, FinishAIResponse
- RegisterSilence, RegisterInterruption
- CompleteInterview, AbortInterview
- GetInterviewStatus, HandleTimeout

### Ports

- SpeechRecognitionPort (STT)
- SpeechSynthesisPort (TTS)
- RuntimePort (Runtime communication)
- InterviewPersistencePort (persistence)
- TelemetryPort (telemetry)
- AnalyticsPort (analytics)
- LoggingPort (logging)
- ClockPort (time)
- UUIDPort (ID generation)

---

## Infrastructure Layer

### Adapters

- OpenAIRealtimeAdapter (STT + TTS)
- DeepgramAdapter (STT)
- AzureSpeechAdapter (STT + TTS)
- ElevenLabsAdapter (TTS)
- SupabaseAdapter (persistence)
- LoggerAdapter (logging)
- TelemetryAdapter (telemetry)
- AnalyticsAdapter (analytics)
- ClockAdapter (time)
- UUIDAdapter (ID generation)

---

## Folder Structure

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

## Key Principles

### Clean Architecture

- Domain layer independent of infrastructure
- Application layer depends on domain
- Infrastructure layer depends on application
- Bootstrap layer depends on application and infrastructure

### Hexagonal Architecture

- Ports defined in application layer
- Adapters implemented in infrastructure layer
- Domain independent of ports and adapters

### Domain-Driven Design

- Aggregates enforce consistency boundaries
- Entities have identity and lifecycle
- Value Objects are immutable
- Domain Services encapsulate business logic
- Policies encapsulate business rules
- Domain Events decouple domain from side effects

### SOLID Principles

- SRP: Single responsibility per component
- OCP: Open for extension, closed for modification
- LSP: Substitutable implementations
- ISP: Segregated interfaces
- DIP: Depend on abstractions

---

## Dependencies

### Upstream Contexts

- **Interview Preparation Context**: Provides interview plans
- **Runtime Context**: Provides candidate information, receives notifications

### Downstream Contexts

- **Live Analysis Context**: Receives interview events
- **Persistence Context**: Receives interview session data

---

## Business Rules

The Voice Interview Engine enforces 25 business rules across 7 categories:

- Interview Lifecycle (5 rules)
- Question Lifecycle (3 rules)
- Response Lifecycle (1 rule)
- Timing (3 rules)
- Interruption (4 rules)
- Completion (2 rules)
- Retry (2 rules)
- Turn-Taking (2 rules)
- Progress (2 rules)
- Statistics (1 rule)

---

## Documentation

### Architecture Documents

- [ADD-001](./ADD-001-VOICE-INTERVIEW-ENGINE.md): Architecture Decision Record
- [Domain Model](./DOMAIN-MODEL.md): Domain model documentation
- [Bounded Context](./BOUNDED-CONTEXT.md): Bounded context documentation
- [Interface Catalog](./INTERFACE-CATALOG.md): Port interfaces
- [Event Catalog](./EVENT-CATALOG.md): Domain events
- [Business Rules](./BUSINESS-RULES.md): Business rules
- [Folder Structure](./FOLDER-STRUCTURE.md): Folder structure
- [Adapters](./ADAPTERS.md): Infrastructure adapters
- [Ports](./PORTS.md): Port interfaces
- [Application Use Cases](./APPLICATION-USE-CASES.md): Use cases

### Quality Documents

- [Quality Validation](./QUALITY-VALIDATION.md): Quality validation
- [Risk Analysis](./RISK-ANALYSIS.md): Risk analysis
- [Implementation Roadmap](./IMPLEMENTATION-ROADMAP.md): Implementation roadmap
- [Definition of Done](./DEFINITION-OF-DONE.md): Definition of done

---

## Implementation Status

**Phase**: 3A - Architecture & Domain Design

**Status**: DRAFT

**Completion**: Architecture design complete, awaiting validation

---

## Next Steps

1. Create diagrams (Domain, Component, Sequence, Dependency Matrix, Event Flow, Runtime Flow)
2. Perform architecture audits (SRP, SOLID, Clean Architecture, Hexagonal, DDD, FEATURE_B5 Compliance, Runtime Independence, Infrastructure Independence, Dependency Matrix, Circular Dependencies, Interface Compliance, ADR Compliance)
3. Generate Architecture Validation Report
4. Generate Architecture Freeze Report
5. Final decision (APPROVED/REJECTED)

---

## Reference Implementations

- [FEATURE_B5 Runtime Persistence](../../FEATURE_B5_RUNTIME_PERSISTENCE.md)
- [Interview Preparation Engine](../interview-preparation-engine/REFERENCE_IMPLEMENTATION.md)

---

## Contact

**Architecture Team**: Cascade AI Assistant  
**Date**: 2025-01-11
