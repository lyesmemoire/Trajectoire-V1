# Application Use Cases - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

The Application Layer contains use cases that orchestrate domain logic and coordinate with infrastructure via ports. Each use case has a single responsibility and represents a specific application operation.

---

## Use Case: StartInterview

**Responsibility**: Start a new interview session

**Input**: `StartInterviewRequest`
- `candidateId`: string
- `interviewPlanId`: UUID (from Interview Preparation Engine)
- `voiceSettings`: VoiceSettings (optional, defaults applied)

**Output**: `StartInterviewResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `startedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- InterviewFlowService (domain service)
- InterviewPersistencePort (port)
- RuntimePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Create InterviewSessionAggregate
3. Initialize interview state
4. Load interview plan from Interview Preparation Engine (via RuntimePort)
5. Apply voice settings
6. Persist interview session (via InterviewPersistencePort)
7. Publish InterviewStarted event
8. Return response

**Error Handling**:
- Invalid interview plan → ValidationError
- Persistence failure → PersistenceError
- Runtime communication failure → RuntimeError

---

## Use Case: PauseInterview

**Responsibility**: Pause an in-progress interview session

**Input**: `PauseInterviewRequest`
- `sessionId`: UUID

**Output**: `PauseInterviewResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `pausedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- PauseResumeService (domain service)
- InterviewPersistencePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate pause operation (via PauseResumeService)
4. Transition state to PAUSED
5. Persist interview session (via InterviewPersistencePort)
6. Publish InterviewPaused event
7. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid state transition → StateTransitionError
- Persistence failure → PersistenceError

---

## Use Case: ResumeInterview

**Responsibility**: Resume a paused interview session

**Input**: `ResumeInterviewRequest`
- `sessionId`: UUID

**Output**: `ResumeInterviewResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `resumedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- PauseResumeService (domain service)
- InterviewPersistencePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate resume operation (via PauseResumeService)
4. Transition state to IN_PROGRESS
5. Persist interview session (via InterviewPersistencePort)
6. Publish InterviewResumed event
7. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid state transition → StateTransitionError
- Persistence failure → PersistenceError

---

## Use Case: StopInterview

**Responsibility**: Stop an interview session (normal completion)

**Input**: `StopInterviewRequest`
- `sessionId`: UUID

**Output**: `StopInterviewResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `stoppedAt`: Timestamp
- `progress`: InterviewProgress
- `statistics`: InterviewStatistics

**Dependencies**:
- InterviewSessionAggregate (domain)
- CompletionService (domain service)
- InterviewPersistencePort (port)
- RuntimePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate completion (via CompletionService)
4. Calculate completion metrics (via CompletionService)
5. Transition state to COMPLETED
6. Persist interview session (via InterviewPersistencePort)
7. Notify Runtime of completion (via RuntimePort)
8. Publish InterviewCompleted event
9. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid state transition → StateTransitionError
- Persistence failure → PersistenceError
- Runtime communication failure → RuntimeError

---

## Use Case: NextQuestion

**Responsibility**: Move to the next question in the interview

**Input**: `NextQuestionRequest`
- `sessionId`: UUID

**Output**: `NextQuestionResponse`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `state`: QuestionState

**Dependencies**:
- InterviewSessionAggregate (domain)
- InterviewFlowService (domain service)
- QuestionSelectionService (domain service)
- SpeechSynthesisPort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Determine next question (via InterviewFlowService, QuestionSelectionService)
4. Create QuestionExecution entity
5. Transition question state to STARTING
6. Start AI speech synthesis (via SpeechSynthesisPort)
7. Publish QuestionStarted event
8. Return response

**Error Handling**:
- Invalid session → ValidationError
- No more questions → CompletionError
- Speech synthesis failure → SpeechSynthesisError

---

## Use Case: SkipQuestion

**Responsibility**: Skip the current question

**Input**: `SkipQuestionRequest`
- `sessionId`: UUID
- `reason`: string (optional)

**Output**: `SkipQuestionResponse`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `skippedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- QuestionOrderPolicy (policy)
- InterviewPersistencePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate skip operation (via QuestionOrderPolicy)
4. Transition question state to SKIPPED
5. Update progress
6. Persist interview session (via InterviewPersistencePort)
7. Publish QuestionSkipped event
8. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid skip operation → ValidationError
- Persistence failure → PersistenceError

---

## Use Case: ReceiveTranscript

**Responsibility**: Receive transcript from STT

**Input**: `ReceiveTranscriptRequest`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `transcript`: string
- `isFinal`: boolean

**Output**: `ReceiveTranscriptResponse`
- `sessionId`: UUID
- `responseId`: UUID
- `transcript`: string

**Dependencies**:
- InterviewSessionAggregate (domain)
- CandidateResponse (entity)
- InterviewPersistencePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Create or update CandidateResponse entity
4. Update transcript
5. If isFinal, transition response state to COMPLETED
6. Persist interview session (via InterviewPersistencePort)
7. If isFinal, publish CandidateStoppedSpeaking event
8. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid question execution → ValidationError
- Persistence failure → PersistenceError

---

## Use Case: StartAIResponse

**Responsibility**: Start AI response (TTS)

**Input**: `StartAIResponseRequest`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `text`: string

**Output**: `StartAIResponseResponse`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `startedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- SpeechSynthesisPort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Start AI speech synthesis (via SpeechSynthesisPort)
4. Publish AIStartedSpeaking event
5. Return response

**Error Handling**:
- Invalid session → ValidationError
- Speech synthesis failure → SpeechSynthesisError

---

## Use Case: FinishAIResponse

**Responsibility**: Finish AI response (TTS)

**Input**: `FinishAIResponseRequest`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `duration`: number

**Output**: `FinishAIResponseResponse`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `finishedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Update timing
4. Publish AIStoppedSpeaking event
5. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid question execution → ValidationError

---

## Use Case: RegisterSilence

**Responsibility**: Register silence detection

**Input**: `RegisterSilenceRequest`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID (optional)
- `duration`: number

**Output**: `RegisterSilenceResponse`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `timestamp`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- MaxSilencePolicy (policy)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate silence (via MaxSilencePolicy)
4. If silence exceeded, handle timeout
5. Publish SilenceDetected event
6. Return response

**Error Handling**:
- Invalid session → ValidationError
- Silence exceeded → TimeoutError

---

## Use Case: RegisterInterruption

**Responsibility**: Register interruption detection

**Input**: `RegisterInterruptionRequest`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `interruptionType`: `CANDIDATE_INTERRUPTS_AI` | `AI_INTERRUPTS_CANDIDATE`

**Output**: `RegisterInterruptionResponse`
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `timestamp`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- InterruptionService (domain service)
- InterruptionPolicy (policy)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Detect interruption (via InterruptionService)
4. Validate interruption (via InterruptionPolicy)
5. Handle interruption (via InterruptionService)
6. Publish InterruptionDetected event
7. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid interruption → ValidationError

---

## Use Case: CompleteInterview

**Responsibility**: Complete the interview session

**Input**: `CompleteInterviewRequest`
- `sessionId`: UUID

**Output**: `CompleteInterviewResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `completedAt`: Timestamp
- `progress`: InterviewProgress
- `statistics`: InterviewStatistics

**Dependencies**:
- InterviewSessionAggregate (domain)
- CompletionService (domain service)
- InterviewPersistencePort (port)
- RuntimePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate completion (via CompletionService)
4. Calculate completion metrics (via CompletionService)
5. Transition state to COMPLETED
6. Persist interview session (via InterviewPersistencePort)
7. Notify Runtime of completion (via RuntimePort)
8. Publish InterviewCompleted event
9. Return response

**Error Handling**:
- Invalid session → ValidationError
- Invalid state transition → StateTransitionError
- Persistence failure → PersistenceError
- Runtime communication failure → RuntimeError

---

## Use Case: AbortInterview

**Responsibility**: Abort the interview session (emergency)

**Input**: `AbortInterviewRequest`
- `sessionId`: UUID
- `reason`: string

**Output**: `AbortInterviewResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `abortedAt`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- InterviewPersistencePort (port)
- RuntimePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Transition state to ABORTED
4. Persist interview session (via InterviewPersistencePort)
5. Notify Runtime of abort (via RuntimePort)
6. Publish InterviewCancelled event
7. Return response

**Error Handling**:
- Invalid session → ValidationError
- Persistence failure → PersistenceError
- Runtime communication failure → RuntimeError

---

## Use Case: GetInterviewStatus

**Responsibility**: Get the current status of an interview session

**Input**: `GetInterviewStatusRequest`
- `sessionId`: UUID

**Output**: `GetInterviewStatusResponse`
- `sessionId`: UUID
- `state`: InterviewState
- `progress`: InterviewProgress
- `currentQuestion`: QuestionExecution (optional)
- `statistics`: InterviewStatistics

**Dependencies**:
- InterviewSessionAggregate (domain)
- InterviewPersistencePort (port)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Extract status information
4. Return response

**Error Handling**:
- Invalid session → ValidationError
- Persistence failure → PersistenceError

---

## Use Case: HandleTimeout

**Responsibility**: Handle timeout (question or interview)

**Input**: `HandleTimeoutRequest`
- `sessionId`: UUID
- `timeoutType`: `QUESTION_TIMEOUT` | `INTERVIEW_TIMEOUT`
- `questionExecutionId`: UUID (optional)

**Output**: `HandleTimeoutResponse`
- `sessionId`: UUID
- `timeoutType`: string
- `timestamp`: Timestamp

**Dependencies**:
- InterviewSessionAggregate (domain)
- TimeLimitPolicy (policy)
- InterviewPersistencePort (port)
- EventBus (domain)

**Steps**:
1. Validate request
2. Load InterviewSessionAggregate
3. Validate timeout (via TimeLimitPolicy)
4. Handle timeout (skip question or complete interview)
5. Persist interview session (via InterviewPersistencePort)
6. Publish InterviewTimeout event
7. Return response

**Error Handling**:
- Invalid session → ValidationError
- Timeout exceeded → TimeoutError
- Persistence failure → PersistenceError

---

## Conclusion

The Application Layer contains 13 use cases that orchestrate domain logic and coordinate with infrastructure via ports. Each use case has a single responsibility and represents a specific application operation.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
