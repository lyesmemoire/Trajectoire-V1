# Domain Diagram - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This diagram represents the domain model of the Voice Interview Engine.

---

## Aggregate Root

```
┌─────────────────────────────────────────────────────────────┐
│                    InterviewSessionAggregate                  │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce consistency boundaries               │
│                                                              │
│ Methods:                                                     │
│   - start()                                                  │
│   - pause()                                                  │
│   - resume()                                                 │
│   - stop()                                                   │
│   - nextQuestion()                                           │
│   - skipQuestion()                                           │
│   - receiveTranscript()                                      │
│   - startAIResponse()                                        │
│   - finishAIResponse()                                       │
│   - registerSilence()                                        │
│   - registerInterruption()                                   │
│   - complete()                                                │
│   - abort()                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Entities

```
┌─────────────────────────────────────────────────────────────┐
│                      InterviewSession                         │
├─────────────────────────────────────────────────────────────┤
│ Identity: sessionId (UUID)                                    │
│                                                              │
│ Attributes:                                                  │
│   - sessionId: UUID                                          │
│   - candidateId: string                                      │
│   - interviewPlanId: UUID                                    │
│   - state: InterviewState                                    │
│   - progress: InterviewProgress                              │
│   - timeline: InterviewTimeline                              │
│   - statistics: InterviewStatistics                           │
│   - voiceSettings: VoiceSettings                             │
│   - createdAt: Timestamp                                     │
│   - updatedAt: Timestamp                                     │
│   - completedAt: Timestamp (optional)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     QuestionExecution                         │
├─────────────────────────────────────────────────────────────┤
│ Identity: questionExecutionId (UUID)                          │
│                                                              │
│ Attributes:                                                  │
│   - questionExecutionId: UUID                                │
│   - sessionId: UUID                                          │
│   - questionId: string                                       │
│   - index: QuestionIndex                                     │
│   - state: QuestionState                                     │
│   - response: CandidateResponse (optional)                    │
│   - timing: SessionTiming                                    │
│   - startedAt: Timestamp (optional)                          │
│   - completedAt: Timestamp (optional)                        │
│   - skippedAt: Timestamp (optional)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     CandidateResponse                         │
├─────────────────────────────────────────────────────────────┤
│ Identity: responseId (UUID)                                   │
│                                                              │
│ Attributes:                                                  │
│   - responseId: UUID                                         │
│   - questionExecutionId: UUID                                │
│   - transcript: string                                       │
│   - state: ResponseState                                     │
│   - quality: SpeechQuality (optional)                        │
│   - duration: number                                         │
│   - startedAt: Timestamp                                     │
│   - completedAt: Timestamp (optional)                        │
│   - interruptedAt: Timestamp (optional)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     InterviewTimeline                         │
├─────────────────────────────────────────────────────────────┤
│ Identity: timelineId (UUID)                                   │
│                                                              │
│ Attributes:                                                  │
│   - timelineId: UUID                                         │
│   - sessionId: UUID                                          │
│   - turns: Turn[]                                            │
│   - events: DomainEvent[]                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     InterviewProgress                        │
├─────────────────────────────────────────────────────────────┤
│ Identity: progressId (UUID)                                   │
│                                                              │
│ Attributes:                                                  │
│   - progressId: UUID                                         │
│   - sessionId: UUID                                          │
│   - currentQuestionIndex: number                             │
│   - completedQuestions: number                               │
│   - totalQuestions: number                                   │
│   - skippedQuestions: number                                 │
│   - percentage: number                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Value Objects

```
┌─────────────────────────────────────────────────────────────┐
│                      InterviewState                          │
├─────────────────────────────────────────────────────────────┤
│ Values: NOT_STARTED, STARTING, IN_PROGRESS,                   │
│         PAUSED, COMPLETING, COMPLETED,                        │
│         CANCELLING, CANCELLED, ABORTING, ABORTED, TIMEOUT    │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       QuestionState                          │
├─────────────────────────────────────────────────────────────┤
│ Values: PENDING, STARTING, ASKING, WAITING_RESPONSE,        │
│         LISTENING, PROCESSING_RESPONSE, COMPLETED,            │
│         SKIPPED, TIMEOUT                                     │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       ResponseState                          │
├─────────────────────────────────────────────────────────────┤
│ Values: NOT_STARTED, SPEAKING, SILENCE, INTERRUPTED,         │
│         COMPLETED, TIMEOUT                                   │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       SessionTiming                          │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - startedAt: Timestamp (optional)                          │
│   - completedAt: Timestamp (optional)                        │
│   - duration: number (optional)                              │
│   - latency: Latency (optional)                              │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                           Turn                               │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - turnId: UUID                                             │
│   - type: CANDIDATE | AI                                     │
│   - startedAt: Timestamp                                     │
│   - completedAt: Timestamp (optional)                        │
│   - duration: number (optional)                               │
│   - content: string (optional)                               │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          Latency                             │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - sttLatency: number (optional)                            │
│   - ttsLatency: number (optional)                            │
│   - processingLatency: number (optional)                     │
│   - totalLatency: number (optional)                          │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      VoiceSettings                           │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - language: string                                         │
│   - voice: string                                            │
│   - speakingWindow: SpeakingWindow                           │
│   - silenceTimeout: SilenceTimeout                           │
│   - interruptionPolicy: InterruptionPolicy                   │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SpeakingWindow                            │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - minDuration: number                                     │
│   - maxDuration: number                                     │
│   - silenceThreshold: number                                 │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SilenceTimeout                            │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - initialTimeout: number                                   │
│   - subsequentTimeout: number                                │
│   - maxTimeouts: number                                     │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 InterruptionPolicy                           │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - allowInterruption: boolean                               │
│   - interruptionThreshold: number                            │
│   - interruptionCooldown: number                             │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      RetryPolicy                             │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - maxRetries: number                                      │
│   - retryDelay: number                                      │
│   - backoffMultiplier: number                               │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SpeechQuality                            │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - clarity: number (0-1)                                    │
│   - volume: number (0-1)                                     │
│   - noiseLevel: number (0-1)                                 │
│   - overallScore: number (0-1)                                │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 ConversationContext                          │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - previousQuestions: string[]                              │
│   - previousResponses: string[]                              │
│   - currentTopic: string (optional)                          │
│   - contextWindow: number                                    │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      QuestionIndex                            │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - sectionIndex: number                                     │
│   - questionIndex: number                                    │
│   - globalIndex: number                                      │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  InterviewStatistics                         │
├─────────────────────────────────────────────────────────────┤
│ Attributes:                                                  │
│   - totalDuration: number                                    │
│   - speakingDuration: number                                 │
│   - silenceDuration: number                                  │
│   - interruptionCount: number                                 │
│   - skippedCount: number                                     │
│   - averageResponseTime: number                              │
│   - averageResponseLength: number                            │
│                                                              │
│ Immutability: ✅ Immutable                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Domain Services

```
┌─────────────────────────────────────────────────────────────┐
│                  InterviewFlowService                        │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Orchestrate interview flow                   │
│                                                              │
│ Methods:                                                     │
│   - determineNextQuestion()                                   │
│   - validateTransition()                                      │
│   - calculateProgress()                                      │
│                                                              │
│ Dependencies: None                                            │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                QuestionSelectionService                       │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Select next question                          │
│                                                              │
│ Methods:                                                     │
│   - selectNextQuestion()                                     │
│   - validateQuestion()                                       │
│                                                              │
│ Dependencies: ConversationContext, QuestionIndex             │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 TimeManagementService                        │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Manage timing                                 │
│                                                              │
│ Methods:                                                     │
│   - calculateDuration()                                       │
│   - checkTimeout()                                            │
│   - validateTiming()                                         │
│                                                              │
│ Dependencies: SessionTiming, SilenceTimeout                  │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ConversationService                         │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Manage conversation flow                      │
│                                                              │
│ Methods:                                                     │
│   - updateContext()                                          │
│   - validateTurn()                                           │
│   - detectInterruption()                                     │
│                                                              │
│ Dependencies: ConversationContext, Turn, InterruptionPolicy   │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    TransitionService                         │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Manage state transitions                      │
│                                                              │
│ Methods:                                                     │
│   - validateTransition()                                      │
│   - executeTransition()                                      │
│                                                              │
│ Dependencies: InterviewState, QuestionState, ResponseState    │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  InterruptionService                          │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Manage interruption handling                  │
│                                                              │
│ Methods:                                                     │
│   - detectInterruption()                                      │
│   - validateInterruption()                                   │
│   - handleInterruption()                                     │
│                                                              │
│ Dependencies: InterruptionPolicy, Turn                        │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   PauseResumeService                         │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Manage pause/resume operations              │
│                                                              │
│ Methods:                                                     │
│   - validatePause()                                          │
│   - validateResume()                                         │
│   - calculatePauseDuration()                                 │
│                                                              │
│ Dependencies: InterviewState, SessionTiming                  │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CompletionService                          │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Manage interview completion                   │
│                                                              │
│ Methods:                                                     │
│   - validateCompletion()                                     │
│   - calculateCompletion()                                    │
│   - generateSummary()                                        │
│                                                              │
│ Dependencies: InterviewProgress, InterviewStatistics         │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Policies

```
┌─────────────────────────────────────────────────────────────┐
│                     MaxSilencePolicy                         │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce maximum silence policy               │
│                                                              │
│ Methods:                                                     │
│   - validateSilence()                                         │
│   - isSilenceExceeded()                                      │
│                                                              │
│ Dependencies: SilenceTimeout                                  │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     MaxRetriesPolicy                          │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce maximum retry policy                 │
│                                                              │
│ Methods:                                                     │
│   - validateRetry()                                           │
│   - isRetryExceeded()                                        │
│                                                              │
│ Dependencies: RetryPolicy                                    │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     TimeLimitPolicy                           │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce time limit policy                     │
│                                                              │
│ Methods:                                                     │
│   - validateTimeLimit()                                      │
│   - isTimeLimitExceeded()                                    │
│                                                              │
│ Dependencies: SessionTiming                                  │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   QuestionOrderPolicy                         │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce question order policy                │
│                                                              │
│ Methods:                                                     │
│   - validateOrder()                                           │
│   - isOrderValid()                                           │
│                                                              │
│ Dependencies: QuestionIndex                                  │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 InterruptionPolicy (Policy)                  │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce interruption policy                   │
│                                                              │
│ Methods:                                                     │
│   - validateInterruption()                                    │
│   - isInterruptionAllowed()                                  │
│                                                              │
│ Dependencies: InterruptionPolicy (Value Object)              │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CompletionPolicy                          │
├─────────────────────────────────────────────────────────────┤
│ Responsibility: Enforce completion policy                   │
│                                                              │
│ Methods:                                                     │
│   - validateCompletion()                                     │
│   - isCompletionAllowed()                                    │
│                                                              │
│ Dependencies: InterviewProgress, InterviewStatistics         │
│ State: ❌ Stateless                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Domain Events

```
┌─────────────────────────────────────────────────────────────┐
│                     InterviewStarted                         │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - candidateId: string                                      │
│   - interviewPlanId: UUID                                    │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     QuestionStarted                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - questionId: string                                       │
│   - index: QuestionIndex                                     │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    QuestionCompleted                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - questionId: string                                       │
│   - index: QuestionIndex                                     │
│   - responseId: UUID (optional)                              │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CandidateSpeaking                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - responseId: UUID                                         │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 CandidateStoppedSpeaking                      │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - responseId: UUID                                         │
│   - duration: number                                         │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     AIStartedSpeaking                         │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AIStoppedSpeaking                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - duration: number                                         │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SilenceDetected                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - responseId: UUID (optional)                              │
│   - duration: number                                         │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  InterruptionDetected                         │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - interruptionType: CANDIDATE_INTERRUPTS_AI |               │
│                       AI_INTERRUPTS_CANDIDATE                  │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     QuestionSkipped                           │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - questionExecutionId: UUID                                │
│   - questionId: string                                       │
│   - index: QuestionIndex                                     │
│   - reason: string                                           │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     InterviewPaused                           │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     InterviewResumed                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    InterviewCompleted                         │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - candidateId: string                                      │
│   - progress: InterviewProgress                              │
│   - statistics: InterviewStatistics                           │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    InterviewCancelled                         │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - reason: string                                           │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     InterviewTimeout                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - timeoutType: QUESTION_TIMEOUT | INTERVIEW_TIMEOUT        │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ConversationError                          │
├─────────────────────────────────────────────────────────────┤
│ Payload:                                                     │
│   - sessionId: UUID                                          │
│   - errorType: string                                        │
│   - errorMessage: string                                     │
│   - timestamp: Timestamp                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Conclusion

The Voice Interview Engine domain model consists of 1 aggregate root, 5 entities, 15 value objects, 8 domain services, 6 policies, and 16 domain events.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
