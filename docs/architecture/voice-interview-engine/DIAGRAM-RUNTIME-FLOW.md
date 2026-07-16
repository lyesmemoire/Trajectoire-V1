# Runtime Flow Diagram - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This document presents the runtime flow for the Voice Interview Engine, showing how the engine interacts with the Runtime system during interview execution.

---

## Runtime Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Runtime System                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Runtime Orchestrator                            │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  Runtime Responsibilities                                     │  │  │
│  │  │  - Manage interview lifecycle                                │  │  │
│  │  │  - Coordinate speech services                                │  │  │
│  │  │  - Handle timing and timeouts                                │  │  │
│  │  │  - Communicate with Voice Interview Engine                   │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Voice Interview Engine                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        Engine                                     │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  Engine Responsibilities                                     │  │  │
│  │  │  - Expose interview operations to Runtime                   │  │  │
│  │  │  - Coordinate use cases                                     │  │  │
│  │  │  - Publish events to Runtime                               │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Runtime Flow - Complete Interview Lifecycle

### Phase 1: Initialization

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │StartInterview│    │  Aggregate  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ startInterview()  │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ start()            │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewStarted   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ InterviewStarted   │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ InterviewStarted  │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Runtime calls `startInterview()` on Engine
2. Engine executes StartInterview use case
3. Use case calls `start()` on aggregate
4. Aggregate publishes `InterviewStarted` event
5. Event flows back to Runtime

---

### Phase 2: Question Execution

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │NextQuestion │    │  Aggregate  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ nextQuestion()    │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ nextQuestion()     │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ QuestionStarted    │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ QuestionStarted    │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ QuestionStarted   │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Runtime calls `nextQuestion()` on Engine
2. Engine executes NextQuestion use case
3. Use case calls `nextQuestion()` on aggregate
4. Aggregate publishes `QuestionStarted` event
5. Event flows back to Runtime

---

### Phase 3: AI Response

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │StartAIRes-  │    │  Aggregate  │
└─────────────┘    └─────────────┘    │   ponse      │    └─────────────┘
       │                   │            └─────────────┘
       │ startAIResponse() │                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │ execute()         │
       │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ startAIResponse()  │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ AIStartedSpeaking  │
       │                   │                   │<──────────────────│
       │                   │                   │
       │                   │ AIStartedSpeaking  │
       │                   │<──────────────────│
       │                   │
       │ AIStartedSpeaking │
       │<──────────────────│
       │
       │                   │
       │                   │
       │                   │
       │                   │
       │                   │
       │                   │
```

**Steps**:

1. Runtime calls `startAIResponse()` on Engine
2. Engine executes StartAIResponse use case
3. Use case calls `startAIResponse()` on aggregate
4. Aggregate publishes `AIStartedSpeaking` event
5. Event flows back to Runtime

---

### Phase 4: Candidate Speaking

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     STT     │    │   Engine    │    │ReceiveTrans-│    │  Aggregate  │
│   Adapter   │    │             │    │   cript      │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ transcript        │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ receiveTranscript()│
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ CandidateSpeaking  │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ CandidateSpeaking  │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ CandidateSpeaking │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. STT Adapter sends transcript to Engine
2. Engine executes ReceiveTranscript use case
3. Use case calls `receiveTranscript()` on aggregate
4. Aggregate publishes `CandidateSpeaking` event
5. Event flows back to STT Adapter

---

### Phase 5: Silence Detection

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│     STT     │    │   Engine    │    │RegisterSil-  │    │  Aggregate  │
│   Adapter   │    │             │    │   ence       │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ silence           │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ registerSilence()  │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ SilenceDetected    │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ SilenceDetected    │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ SilenceDetected   │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. STT Adapter sends silence to Engine
2. Engine executes RegisterSilence use case
3. Use case calls `registerSilence()` on aggregate
4. Aggregate publishes `SilenceDetected` event
5. Event flows back to STT Adapter

---

### Phase 6: Question Completion

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │FinishAIRes- │    │  Aggregate  │
└─────────────┘    └─────────────┘    │   ponse      │    └─────────────┘
       │                   │            └─────────────┘
       │ finishAIResponse()│                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │ execute()         │
       │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ finishAIResponse() │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ AIStoppedSpeaking  │
       │                   │                   │<──────────────────│
       │                   │                   │
       │                   │ AIStoppedSpeaking  │
       │                   │<──────────────────│
       │                   │
       │ AIStoppedSpeaking │
       │<──────────────────│
       │
```

**Steps**:

1. Runtime calls `finishAIResponse()` on Engine
2. Engine executes FinishAIResponse use case
3. Use case calls `finishAIResponse()` on aggregate
4. Aggregate publishes `AIStoppedSpeaking` event
5. Event flows back to Runtime

---

### Phase 7: Interview Completion

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │CompleteInter-│    │  Aggregate  │
└─────────────┘    └─────────────┘    │   view       │    └─────────────┘
       │                   │            └─────────────┘
       │ completeInterview│                   │
       │──────────────────>│                   │
       │                   │                   │
       │                   │ execute()         │
       │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ complete()         │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ InterviewCompleted │
       │                   │                   │<──────────────────│
       │                   │                   │
       │                   │ InterviewCompleted │
       │                   │<──────────────────│
       │                   │
       │ InterviewCompleted│
       │<──────────────────│
       │
```

**Steps**:

1. Runtime calls `completeInterview()` on Engine
2. Engine executes CompleteInterview use case
3. Use case calls `complete()` on aggregate
4. Aggregate publishes `InterviewCompleted` event
5. Event flows back to Runtime

---

## Runtime Flow - Pause/Resume

### Pause Interview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │PauseInterview│    │  Aggregate  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ pauseInterview()  │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ pause()            │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewPaused    │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ InterviewPaused    │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ InterviewPaused   │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Runtime calls `pauseInterview()` on Engine
2. Engine executes PauseInterview use case
3. Use case calls `pause()` on aggregate
4. Aggregate publishes `InterviewPaused` event
5. Event flows back to Runtime

---

### Resume Interview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Runtime   │    │   Engine    │    │ResumeInterview│    │  Aggregate  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ resumeInterview() │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ resume()           │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewResumed   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ InterviewResumed   │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ InterviewResumed  │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Runtime calls `resumeInterview()` on Engine
2. Engine executes ResumeInterview use case
3. Use case calls `resume()` on aggregate
4. Aggregate publishes `InterviewResumed` event
5. Event flows back to Runtime

---

## Runtime Flow - Error Handling

### Timeout Handling

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Clock     │    │   Engine    │    │HandleTimeout│    │  Aggregate  │
│   Adapter   │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ timeout           │                   │                   │
       │──────────────────>│                   │                   │
       │                   │                   │                   │
       │                   │ execute()         │                   │
       │                   │──────────────────>│                   │
       │                   │                   │                   │
       │                   │                   │ handleTimeout()    │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewTimeout   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │ InterviewTimeout   │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ InterviewTimeout  │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Clock Adapter sends timeout to Engine
2. Engine executes HandleTimeout use case
3. Use case calls `handleTimeout()` on aggregate
4. Aggregate publishes `InterviewTimeout` event
5. Event flows back to Clock Adapter

---

## Runtime Flow - State Transitions

### State Transition Diagram

```
┌──────────┐
│  IDLE    │
└────┬─────┘
     │ startInterview()
     ▼
┌──────────┐
│  ACTIVE  │◄────────┐
└────┬─────┘         │
     │               │
     │ pauseInterview()│ resumeInterview()
     ▼               │
┌──────────┐         │
│  PAUSED  │─────────┘
└────┬─────┘
     │ completeInterview()
     ▼
┌──────────┐
│COMPLETED │
└──────────┘
```

### State Descriptions

- **IDLE**: Interview not started
- **ACTIVE**: Interview in progress, questions being asked
- **PAUSED**: Interview paused, can be resumed
- **COMPLETED**: Interview finished successfully

---

## Runtime Flow - Communication Patterns

### Synchronous Communication

- Runtime → Engine: Method calls with immediate response
- Engine → Use Case: Method calls with immediate response
- Use Case → Aggregate: Method calls with immediate response

### Asynchronous Communication

- Aggregate → EventPublisher: Event publishing
- EventPublisher → Integration Layer: Event handling
- Integration Layer → Adapters: Event consumption
- Adapters → External Systems: External communication

---

## Runtime Flow - Error Recovery

### Retry Strategy

- Transient errors: Retry with exponential backoff
- Permanent errors: Log and notify
- Timeout errors: Abort and notify

### Fallback Strategy

- Speech recognition failure: Skip question or retry
- Speech synthesis failure: Use fallback TTS or skip
- Persistence failure: Cache locally and retry later

---

## Conclusion

The Voice Interview Engine runtime flow follows a clear pattern:

1. **Runtime** orchestrates the interview lifecycle
2. **Engine** exposes operations to Runtime
3. **Use Cases** execute business logic
4. **Aggregate** maintains state and publishes events
5. **Events** flow back to Runtime for coordination

The runtime flow ensures clear separation of concerns between the Runtime system and the Voice Interview Engine.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
