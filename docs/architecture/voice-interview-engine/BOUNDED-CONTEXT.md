# Bounded Context - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

The Voice Interview Engine is a bounded context within the Trajectoire domain, responsible for orchestrating voice interview sessions.

---

## Context Name

**Voice Interview Context**

---

## Core Domain

Interview Orchestration

---

## Ubiquitous Language

| Term | Definition |
|------|------------|
| Interview Session | A complete voice interview session with a candidate |
| Question Execution | The execution of a single question within an interview |
| Candidate Response | The candidate's spoken response to a question |
| Interview Timeline | The chronological record of the interview |
| Interview Progress | The current progress of the interview |
| Interview State | The current state of the interview (e.g., IN_PROGRESS, PAUSED) |
| Question State | The current state of a question (e.g., ASKING, LISTENING) |
| Response State | The current state of a response (e.g., SPEAKING, SILENCE) |
| Turn | A single turn in the conversation (candidate or AI) |
| Silence Timeout | The maximum allowed silence duration |
| Interruption Policy | The policy for handling interruptions |
| Voice Settings | Configuration for voice synthesis and recognition |
| Speaking Window | The allowed speaking duration window |

---

## Bounded Context Responsibilities

### In Scope

- Interview session orchestration
- Question selection and execution
- Turn-taking management
- Timing management
- Interruption handling
- Pause/resume operations
- Interview completion
- Interview cancellation
- Communication with STT (Speech-to-Text)
- Communication with TTS (Text-to-Speech)
- Communication with Runtime
- Domain event publishing

### Out of Scope

- AI analysis (handled by Live Analysis)
- Interview plan generation (handled by Interview Preparation Engine)
- Report generation (handled by Runtime)
- Persistence (handled by InterviewPersistencePort)
- Authentication (handled by Runtime)
- Authorization (handled by Runtime)

---

## Context Relationships

### Upstream Contexts

**Interview Preparation Context**
- Provides interview plans
- Relationship: Upstream
- Integration: RuntimePort

**Runtime Context**
- Provides candidate information
- Receives interview completion notifications
- Relationship: Upstream
- Integration: RuntimePort

### Downstream Contexts

**Live Analysis Context**
- Receives interview events
- Relationship: Downstream
- Integration: Domain Events

**Persistence Context**
- Receives interview session data
- Relationship: Downstream
- Integration: InterviewPersistencePort

### Peer Contexts

None

---

## Context Mapping

### Customer/Supplier

**Interview Preparation Context → Voice Interview Context**
- Type: Customer/Supplier
- Relationship: Interview Preparation is supplier, Voice Interview is customer
- Integration: RuntimePort (getInterviewPlan)
- Conformity: Voice Interview conforms to Interview Preparation's interview plan format

**Voice Interview Context → Runtime Context**
- Type: Customer/Supplier
- Relationship: Voice Interview is supplier, Runtime is customer
- Integration: RuntimePort (notifyInterviewStarted, notifyInterviewCompleted, notifyInterviewCancelled)
- Conformity: Runtime conforms to Voice Interview's notification format

### Anticorruption Layer

**Voice Interview Context → Live Analysis Context**
- Type: Anticorruption Layer
- Relationship: Voice Interview publishes domain events, Live Analysis consumes
- Integration: Domain Events
- Conformity: Live Analysis conforms to Voice Interview's event format

### Open Host Service

**Voice Interview Context → Persistence Context**
- Type: Open Host Service
- Relationship: Voice Interview uses InterviewPersistencePort
- Integration: InterviewPersistencePort
- Conformance: Persistence conforms to Voice Interview's persistence interface

---

## Domain Model Summary

### Aggregate Root

**InterviewSessionAggregate**
- Enforces consistency boundaries
- Manages interview lifecycle
- Coordinates question execution

### Entities

- InterviewSession
- QuestionExecution
- CandidateResponse
- InterviewTimeline
- InterviewProgress

### Value Objects

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

---

## Application Layer Summary

### Use Cases

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
- HandleTimeout

### Ports

- SpeechRecognitionPort
- SpeechSynthesisPort
- RuntimePort
- InterviewPersistencePort
- TelemetryPort
- AnalyticsPort
- LoggingPort
- ClockPort
- UUIDPort

---

## Infrastructure Layer Summary

### Adapters

- OpenAIRealtimeAdapter (SpeechRecognitionPort, SpeechSynthesisPort)
- DeepgramAdapter (SpeechRecognitionPort)
- AzureSpeechAdapter (SpeechRecognitionPort, SpeechSynthesisPort)
- ElevenLabsAdapter (SpeechSynthesisPort)
- SupabaseAdapter (InterviewPersistencePort)
- LoggerAdapter (LoggingPort)
- TelemetryAdapter (TelemetryPort)
- AnalyticsAdapter (AnalyticsPort)
- ClockAdapter (ClockPort)
- UUIDAdapter (UUIDPort)

---

## Integration Layer Summary

### Event Handlers

- InterviewEventHandler

### Integration

- InterviewIntegration

---

## Architecture Principles

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

## Conclusion

The Voice Interview Engine bounded context is responsible for orchestrating voice interview sessions, with clear relationships to upstream and downstream contexts. It follows Clean Architecture, Hexagonal Architecture, DDD, and SOLID principles.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
