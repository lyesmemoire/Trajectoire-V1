# Domain Model - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

The Voice Interview Engine domain model follows Domain-Driven Design principles with a single aggregate root, entities, value objects, domain services, policies, and domain events.

---

## Aggregate

### InterviewSessionAggregate

**Responsibility**: Aggregate root for interview session management. Enforces consistency boundaries and invariants for the entire interview session.

**Invariants**:
- Interview state transitions are valid
- Question execution order is respected
- Time limits are enforced
- Turn-taking rules are respected
- Interruption policies are enforced

**Methods**:
- `start()`: Start the interview session
- `pause()`: Pause the interview session
- `resume()`: Resume the interview session
- `stop()`: Stop the interview session
- `nextQuestion()`: Move to the next question
- `skipQuestion()`: Skip the current question
- `receiveTranscript()`: Receive transcript from STT
- `startAIResponse()`: Start AI response
- `finishAIResponse()`: Finish AI response
- `registerSilence()`: Register silence detection
- `registerInterruption()`: Register interruption detection
- `complete()`: Complete the interview session
- `abort()`: Abort the interview session

**NO business logic, NO reasoning, NO analysis. ONLY aggregate consistency enforcement.**

---

## Entities

### InterviewSession

**Responsibility**: Represents the interview session with identity and lifecycle.

**Identity**: `sessionId` (UUID)

**Attributes**:
- `sessionId`: UUID
- `candidateId`: string
- `interviewPlanId`: UUID (from Interview Preparation Engine)
- `state`: InterviewState (Value Object)
- `progress`: InterviewProgress (Entity)
- `timeline`: InterviewTimeline (Entity)
- `statistics`: InterviewStatistics (Value Object)
- `voiceSettings`: VoiceSettings (Value Object)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `completedAt`: Timestamp (optional)

**Behavior**:
- State transitions
- Progress tracking
- Timeline recording

---

### QuestionExecution

**Responsibility**: Represents the execution of a single question.

**Identity**: `questionExecutionId` (UUID)

**Attributes**:
- `questionExecutionId`: UUID
- `sessionId`: UUID
- `questionId`: string (from interview plan)
- `index`: QuestionIndex (Value Object)
- `state`: QuestionState (Value Object)
- `response`: CandidateResponse (Entity, optional)
- `timing`: SessionTiming (Value Object)
- `startedAt`: Timestamp (optional)
- `completedAt`: Timestamp (optional)
- `skippedAt`: Timestamp (optional)

**Behavior**:
- Question state transitions
- Response recording
- Timing tracking

---

### CandidateResponse

**Responsibility**: Represents the candidate's response to a question.

**Identity**: `responseId` (UUID)

**Attributes**:
- `responseId`: UUID
- `questionExecutionId`: UUID
- `transcript`: string (from STT)
- `state`: ResponseState (Value Object)
- `quality`: SpeechQuality (Value Object, optional)
- `duration`: number (milliseconds)
- `startedAt`: Timestamp
- `completedAt`: Timestamp (optional)
- `interruptedAt`: Timestamp (optional)

**Behavior**:
- Response state transitions
- Quality assessment
- Duration tracking

---

### InterviewTimeline

**Responsibility**: Represents the timeline of the interview session.

**Identity**: `timelineId` (UUID)

**Attributes**:
- `timelineId`: UUID
- `sessionId`: UUID
- `turns`: Turn[] (Value Object array)
- `events`: DomainEvent[] (array)

**Behavior**:
- Turn recording
- Event recording

---

### InterviewProgress

**Responsibility**: Represents the progress of the interview session.

**Identity**: `progressId` (UUID)

**Attributes**:
- `progressId`: UUID
- `sessionId`: UUID
- `currentQuestionIndex`: number
- `completedQuestions`: number
- `totalQuestions`: number
- `skippedQuestions`: number
- `percentage`: number

**Behavior**:
- Progress calculation
- Question tracking

---

## Value Objects

### InterviewState

**Responsibility**: Represents the state of the interview session.

**Values**:
- `NOT_STARTED`
- `STARTING`
- `IN_PROGRESS`
- `PAUSED`
- `COMPLETING`
- `COMPLETED`
- `CANCELLING`
- `CANCELLED`
- `ABORTING`
- `ABORTED`
- `TIMEOUT`

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### QuestionState

**Responsibility**: Represents the state of a question execution.

**Values**:
- `PENDING`
- `STARTING`
- `ASKING`
- `WAITING_RESPONSE`
- `LISTENING`
- `PROCESSING_RESPONSE`
- `COMPLETED`
- `SKIPPED`
- `TIMEOUT`

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### ResponseState

**Responsibility**: Represents the state of a candidate response.

**Values**:
- `NOT_STARTED`
- `SPEAKING`
- `SILENCE`
- `INTERRUPTED`
- `COMPLETED`
- `TIMEOUT`

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### SessionTiming

**Responsibility**: Represents timing information for a session or question.

**Attributes**:
- `startedAt`: Timestamp (optional)
- `completedAt`: Timestamp (optional)
- `duration`: number (milliseconds, optional)
- `latency`: Latency (Value Object, optional)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### Turn

**Responsibility**: Represents a turn in the conversation.

**Attributes**:
- `turnId`: UUID
- `type`: `CANDIDATE` | `AI`
- `startedAt`: Timestamp
- `completedAt`: Timestamp (optional)
- `duration`: number (milliseconds, optional)
- `content`: string (optional)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### Latency

**Responsibility**: Represents latency measurements.

**Attributes**:
- `sttLatency`: number (milliseconds, optional)
- `ttsLatency`: number (milliseconds, optional)
- `processingLatency`: number (milliseconds, optional)
- `totalLatency`: number (milliseconds, optional)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### VoiceSettings

**Responsibility**: Represents voice settings for the interview.

**Attributes**:
- `language`: string (e.g., "en-US", "fr-FR")
- `voice`: string (AI voice)
- `speakingWindow`: SpeakingWindow (Value Object)
- `silenceTimeout`: SilenceTimeout (Value Object)
- `interruptionPolicy`: InterruptionPolicy (Value Object)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### SpeakingWindow

**Responsibility**: Represents the speaking window configuration.

**Attributes**:
- `minDuration`: number (milliseconds)
- `maxDuration`: number (milliseconds)
- `silenceThreshold`: number (milliseconds)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### SilenceTimeout

**Responsibility**: Represents the silence timeout configuration.

**Attributes**:
- `initialTimeout`: number (milliseconds)
- `subsequentTimeout`: number (milliseconds)
- `maxTimeouts`: number

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### InterruptionPolicy

**Responsibility**: Represents the interruption policy configuration.

**Attributes**:
- `allowInterruption`: boolean
- `interruptionThreshold`: number (milliseconds)
- `interruptionCooldown`: number (milliseconds)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### RetryPolicy

**Responsibility**: Represents the retry policy configuration.

**Attributes**:
- `maxRetries`: number
- `retryDelay`: number (milliseconds)
- `backoffMultiplier`: number

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### SpeechQuality

**Responsibility**: Represents speech quality metrics.

**Attributes**:
- `clarity`: number (0-1)
- `volume`: number (0-1)
- `noiseLevel`: number (0-1)
- `overallScore`: number (0-1)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### ConversationContext

**Responsibility**: Represents the conversation context.

**Attributes**:
- `previousQuestions`: string[]
- `previousResponses`: string[]
- `currentTopic`: string (optional)
- `contextWindow`: number

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### QuestionIndex

**Responsibility**: Represents the index of a question.

**Attributes**:
- `sectionIndex`: number
- `questionIndex`: number
- `globalIndex`: number

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

### InterviewStatistics

**Responsibility**: Represents interview statistics.

**Attributes**:
- `totalDuration`: number (milliseconds)
- `speakingDuration`: number (milliseconds)
- `silenceDuration`: number (milliseconds)
- `interruptionCount`: number
- `skippedCount`: number
- `averageResponseTime`: number (milliseconds)
- `averageResponseLength`: number (characters)

**Immutability**: ✅ Immutable

**Equality**: Value-based equality

---

## Domain Services

### InterviewFlowService

**Responsibility**: Orchestrates the overall interview flow.

**Methods**:
- `determineNextQuestion()`: Determines the next question to ask
- `validateTransition()`: Validates state transitions
- `calculateProgress()`: Calculates interview progress

**Dependencies**: None

**NO state, NO persistence, ONLY business logic.**

---

### QuestionSelectionService

**Responsibility**: Selects the next question based on context.

**Methods**:
- `selectNextQuestion()`: Selects the next question
- `validateQuestion()`: Validates a question

**Dependencies**: ConversationContext, QuestionIndex

**NO state, NO persistence, ONLY business logic.**

---

### TimeManagementService

**Responsibility**: Manages timing for the interview.

**Methods**:
- `calculateDuration()`: Calculates duration
- `checkTimeout()`: Checks if timeout occurred
- `validateTiming()`: Validates timing constraints

**Dependencies**: SessionTiming, SilenceTimeout

**NO state, NO persistence, ONLY business logic.**

---

### ConversationService

**Responsibility**: Manages conversation flow and context.

**Methods**:
- `updateContext()`: Updates conversation context
- `validateTurn()`: Validates turn-taking
- `detectInterruption()`: Detects interruption

**Dependencies**: ConversationContext, Turn, InterruptionPolicy

**NO state, NO persistence, ONLY business logic.**

---

### TransitionService

**Responsibility**: Manages state transitions.

**Methods**:
- `validateTransition()`: Validates state transition
- `executeTransition()`: Executes state transition

**Dependencies**: InterviewState, QuestionState, ResponseState

**NO state, NO persistence, ONLY business logic.**

---

### InterruptionService

**Responsibility**: Manages interruption handling.

**Methods**:
- `detectInterruption()`: Detects interruption
- `validateInterruption()`: Validates interruption
- `handleInterruption()`: Handles interruption

**Dependencies**: InterruptionPolicy, Turn

**NO state, NO persistence, ONLY business logic.**

---

### PauseResumeService

**Responsibility**: Manages pause and resume operations.

**Methods**:
- `validatePause()`: Validates pause operation
- `validateResume()`: Validates resume operation
- `calculatePauseDuration()`: Calculates pause duration

**Dependencies**: InterviewState, SessionTiming

**NO state, NO persistence, ONLY business logic.**

---

### CompletionService

**Responsibility**: Manages interview completion.

**Methods**:
- `validateCompletion()`: Validates completion
- `calculateCompletion()`: Calculates completion metrics
- `generateSummary()`: Generates completion summary

**Dependencies**: InterviewProgress, InterviewStatistics

**NO state, NO persistence, ONLY business logic.**

---

## Policies

### MaxSilencePolicy

**Responsibility**: Enforces maximum silence policy.

**Methods**:
- `validateSilence()`: Validates silence duration
- `isSilenceExceeded()`: Checks if silence exceeded

**Dependencies**: SilenceTimeout

**NO state, ONLY policy logic.**

---

### MaxRetriesPolicy

**Responsibility**: Enforces maximum retry policy.

**Methods**:
- `validateRetry()`: Validates retry attempt
- `isRetryExceeded()`: Checks if retry exceeded

**Dependencies**: RetryPolicy

**NO state, ONLY policy logic.**

---

### TimeLimitPolicy

**Responsibility**: Enforces time limit policy.

**Methods**:
- `validateTimeLimit()`: Validates time limit
- `isTimeLimitExceeded()`: Checks if time limit exceeded

**Dependencies**: SessionTiming

**NO state, ONLY policy logic.**

---

### QuestionOrderPolicy

**Responsibility**: Enforces question order policy.

**Methods**:
- `validateOrder()`: Validates question order
- `isOrderValid()`: Checks if order is valid

**Dependencies**: QuestionIndex

**NO state, ONLY policy logic.**

---

### InterruptionPolicy

**Responsibility**: Enforces interruption policy.

**Methods**:
- `validateInterruption()`: Validates interruption
- `isInterruptionAllowed()`: Checks if interruption is allowed

**Dependencies**: InterruptionPolicy (Value Object)

**NO state, ONLY policy logic.**

---

### CompletionPolicy

**Responsibility**: Enforces completion policy.

**Methods**:
- `validateCompletion()`: Validates completion
- `isCompletionAllowed()`: Checks if completion is allowed

**Dependencies**: InterviewProgress, InterviewStatistics

**NO state, ONLY policy logic.**

---

## Domain Events

### InterviewStarted

**Payload**:
- `sessionId`: UUID
- `candidateId`: string
- `interviewPlanId`: UUID
- `timestamp`: Timestamp

**Raised When**: Interview session is started

---

### QuestionStarted

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `timestamp`: Timestamp

**Raised When**: Question execution is started

---

### QuestionCompleted

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `responseId`: UUID (optional)
- `timestamp`: Timestamp

**Raised When**: Question execution is completed

---

### CandidateSpeaking

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID
- `timestamp`: Timestamp

**Raised When**: Candidate starts speaking

---

### CandidateStoppedSpeaking

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID
- `duration`: number
- `timestamp`: Timestamp

**Raised When**: Candidate stops speaking

---

### AIStartedSpeaking

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `timestamp`: Timestamp

**Raised When**: AI starts speaking

---

### AIStoppedSpeaking

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `duration`: number
- `timestamp`: Timestamp

**Raised When**: AI stops speaking

---

### SilenceDetected

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID (optional)
- `duration`: number
- `timestamp`: Timestamp

**Raised When**: Silence is detected

---

### InterruptionDetected

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `interruptionType`: `CANDIDATE_INTERRUPTS_AI` | `AI_INTERRUPTS_CANDIDATE`
- `timestamp`: Timestamp

**Raised When**: Interruption is detected

---

### QuestionSkipped

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `reason`: string
- `timestamp`: Timestamp

**Raised When**: Question is skipped

---

### InterviewPaused

**Payload**:
- `sessionId`: UUID
- `timestamp`: Timestamp

**Raised When**: Interview is paused

---

### InterviewResumed

**Payload**:
- `sessionId`: UUID
- `timestamp`: Timestamp

**Raised When**: Interview is resumed

---

### InterviewCompleted

**Payload**:
- `sessionId`: UUID
- `candidateId`: string
- `progress`: InterviewProgress
- `statistics`: InterviewStatistics
- `timestamp`: Timestamp

**Raised When**: Interview is completed

---

### InterviewCancelled

**Payload**:
- `sessionId`: UUID
- `reason`: string
- `timestamp`: Timestamp

**Raised When**: Interview is cancelled

---

### InterviewTimeout

**Payload**:
- `sessionId`: UUID
- `timeoutType`: `QUESTION_TIMEOUT` | `INTERVIEW_TIMEOUT`
- `timestamp`: Timestamp

**Raised When**: Interview or question times out

---

### ConversationError

**Payload**:
- `sessionId`: UUID
- `errorType`: string
- `errorMessage`: string
- `timestamp`: Timestamp

**Raised When**: Conversation error occurs

---

## Conclusion

The Voice Interview Engine domain model follows DDD principles with a single aggregate root, clear separation between entities and value objects, domain services for business logic, policies for cross-cutting concerns, and domain events for decoupling.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
