# Sequence Diagrams - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This document contains sequence diagrams for key use cases in the Voice Interview Engine.

---

## Sequence Diagram 1: Start Interview

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ start()            │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewStarted   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │ InterviewStarted   │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ InterviewStarted  │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Runtime calls `startInterview()` on Engine
2. Engine calls `execute()` on StartInterview use case
3. Use case validates input
4. Use case calls `start()` on aggregate
5. Aggregate publishes `InterviewStarted` event
6. Use case publishes event to external systems
7. Engine returns event to Runtime

---

## Sequence Diagram 2: Next Question

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ nextQuestion()     │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ QuestionStarted    │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │ QuestionStarted    │                   │
       │                   │<──────────────────│                   │
       │                   │                   │                   │
       │ QuestionStarted   │                   │                   │
       │<──────────────────│                   │                   │
       │                   │                   │                   │
```

**Steps**:

1. Runtime calls `nextQuestion()` on Engine
2. Engine calls `execute()` on NextQuestion use case
3. Use case validates state
4. Use case calls `nextQuestion()` on aggregate
5. Aggregate publishes `QuestionStarted` event
6. Use case publishes event to external systems
7. Engine returns event to Runtime

---

## Sequence Diagram 3: Receive Transcript

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ receiveTranscript()│
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ CandidateSpeaking  │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
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
2. Engine calls `execute()` on ReceiveTranscript use case
3. Use case validates transcript
4. Use case calls `receiveTranscript()` on aggregate
5. Aggregate publishes `CandidateSpeaking` event
6. Use case publishes event to external systems
7. Engine returns event to STT Adapter

---

## Sequence Diagram 4: Start AI Response

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ startAIResponse()  │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ AIStartedSpeaking  │
       │                   │                   │<──────────────────│
       │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │ AIStartedSpeaking  │
       │                   │<──────────────────│
       │                   │
       │ AIStartedSpeaking │
       │<──────────────────│
       │
```

**Steps**:

1. Runtime calls `startAIResponse()` on Engine
2. Engine calls `execute()` on StartAIResponse use case
3. Use case validates state
4. Use case calls `startAIResponse()` on aggregate
5. Aggregate publishes `AIStartedSpeaking` event
6. Use case publishes event to external systems
7. Engine returns event to Runtime

---

## Sequence Diagram 5: Register Silence

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ registerSilence()  │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ SilenceDetected    │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
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
2. Engine calls `execute()` on RegisterSilence use case
3. Use case validates silence duration
4. Use case calls `registerSilence()` on aggregate
5. Aggregate publishes `SilenceDetected` event
6. Use case publishes event to external systems
7. Engine returns event to STT Adapter

---

## Sequence Diagram 6: Complete Interview

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ complete()         │
       │                   │                   │──────────────────>│
       │                   │                   │
       │                   │                   │ InterviewCompleted │
       │                   │                   │<──────────────────│
       │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
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
2. Engine calls `execute()` on CompleteInterview use case
3. Use case validates completion
4. Use case calls `complete()` on aggregate
5. Aggregate publishes `InterviewCompleted` event
6. Use case publishes event to external systems
7. Engine returns event to Runtime

---

## Sequence Diagram 7: Handle Timeout

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ handleTimeout()    │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewTimeout   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
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
2. Engine calls `execute()` on HandleTimeout use case
3. Use case validates timeout
4. Use case calls `handleTimeout()` on aggregate
5. Aggregate publishes `InterviewTimeout` event
6. Use case publishes event to external systems
7. Engine returns event to Clock Adapter

---

## Sequence Diagram 8: Pause Interview

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ pause()            │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewPaused    │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
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
2. Engine calls `execute()` on PauseInterview use case
3. Use case validates state
4. Use case calls `pause()` on aggregate
5. Aggregate publishes `InterviewPaused` event
6. Use case publishes event to external systems
7. Engine returns event to Runtime

---

## Sequence Diagram 9: Resume Interview

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
       │                   │                   │ validate()         │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ resume()           │
       │                   │                   │──────────────────>│
       │                   │                   │                   │
       │                   │                   │ InterviewResumed   │
       │                   │                   │<──────────────────│
       │                   │                   │                   │
       │                   │                   │ publish()          │
       │                   │                   │──────────────────>│
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
2. Engine calls `execute()` on ResumeInterview use case
3. Use case validates state
4. Use case calls `resume()` on aggregate
5. Aggregate publishes `InterviewResumed` event
6. Use case publishes event to external systems
7. Engine returns event to Runtime

---

## Conclusion

The Voice Interview Engine sequence diagrams cover 9 key use cases, showing the interaction between external systems, the Engine, use cases, and the aggregate.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
