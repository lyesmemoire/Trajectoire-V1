# Sequence Diagram - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This document describes the sequence diagrams for the Voice Interview Engine, showing the interaction flows between actors, use cases, domain services, aggregates, and infrastructure adapters.

---

## Sequence Diagram 1: Start Interview

### Actors
- External Client (API/Web)
- StartInterview Use Case
- InterviewSessionAggregateFactory
- InterviewSessionAggregate
- InterviewFlowService
- InterviewPersistencePort (SupabaseAdapter)
- RuntimePort
- EventBus

### Flow

```
External Client → StartInterview: execute(StartInterviewInput)
StartInterview → InterviewSessionAggregateFactory: create(candidateId, interviewPlanId, voiceSettings, totalQuestions)
InterviewSessionAggregateFactory → UUIDPort: generate()
UUIDPort → InterviewSessionAggregateFactory: uuid
InterviewSessionAggregateFactory → ClockPort: now()
ClockPort → InterviewSessionAggregateFactory: timestamp
InterviewSessionAggregateFactory → StartInterview: InterviewSessionAggregate
StartInterview → InterviewSessionAggregate: startInterview()
InterviewSessionAggregate → InterviewSession: start()
InterviewSession → InterviewSession: state = IN_PROGRESS
InterviewSessionAggregate → InterviewTimeline: addTurn(Turn)
InterviewSessionAggregate → EventBus: publish(InterviewStarted)
EventBus → InterviewEventHandler: handle(InterviewStarted)
InterviewEventHandler → RuntimePort: notifyInterviewStarted()
InterviewEventHandler → AnalyticsPort: trackEvent()
StartInterview → InterviewFlowService: orchestrateInterviewFlow(aggregate)
InterviewFlowService → QuestionSelectionService: selectNextQuestion(currentIndex, totalQuestions)
QuestionSelectionService → InterviewFlowService: QuestionIndex
InterviewFlowService → InterviewSessionAggregate: nextQuestion()
InterviewSessionAggregate → QuestionExecution: start()
InterviewSessionAggregate → EventBus: publish(QuestionStarted)
EventBus → InterviewEventHandler: handle(QuestionStarted)
StartInterview → InterviewPersistencePort: saveInterviewSession(session)
InterviewPersistencePort → SupabaseAdapter: saveInterviewSession()
StartInterview → InterviewPersistencePort: saveTimeline(timeline)
InterviewPersistencePort → SupabaseAdapter: saveTimeline()
StartInterview → InterviewPersistencePort: saveProgress(progress)
InterviewPersistencePort → SupabaseAdapter: saveProgress()
StartInterview → External Client: StartInterviewOutput
```

### Description
1. External client requests to start an interview with candidate details and voice settings
2. Use case creates a new aggregate via factory with UUID and timestamp
3. Aggregate starts the interview session, updates state, and records timeline
4. Domain event InterviewStarted is published and handled
5. Interview flow service orchestrates the flow and selects the first question
6. Question is started and domain event published
7. Aggregate state is persisted to database
8. Response returned to client with session ID and state

---

## Sequence Diagram 2: Receive Candidate Transcript

### Actors
- External Client (Speech Recognition)
- ReceiveTranscript Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → ReceiveTranscript: execute(ReceiveTranscriptInput)
ReceiveTranscript → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewPersistencePort → InterviewSessionAggregateRepository: InterviewSession
InterviewSessionAggregateRepository → InterviewPersistencePort: loadQuestionExecutions(sessionId)
InterviewPersistencePort → SupabaseAdapter: loadQuestionExecutions()
InterviewSessionAggregateRepository → InterviewPersistencePort: loadTimeline(sessionId)
InterviewPersistencePort → SupabaseAdapter: loadTimeline()
InterviewSessionAggregateRepository → InterviewPersistencePort: loadProgress(sessionId)
InterviewPersistencePort → SupabaseAdapter: loadProgress()
InterviewSessionAggregateRepository → ReceiveTranscript: InterviewSessionAggregate
ReceiveTranscript → InterviewSessionAggregate: receiveTranscript(transcript, speechQuality)
InterviewSessionAggregate → CandidateResponse: complete(transcript, speechQuality)
InterviewSessionAggregate → InterviewTimeline: addTurn(Turn)
InterviewSessionAggregate → EventBus: publish(CandidateStoppedSpeaking)
EventBus → InterviewEventHandler: handle(CandidateStoppedSpeaking)
InterviewEventHandler → AnalyticsPort: trackEvent()
InterviewSessionAggregate → EventBus: publish(QuestionCompleted)
EventBus → InterviewEventHandler: handle(QuestionCompleted)
ReceiveTranscript → InterviewPersistencePort: saveCandidateResponse(response)
InterviewPersistencePort → SupabaseAdapter: saveCandidateResponse()
ReceiveTranscript → InterviewPersistencePort: saveTimeline(timeline)
InterviewPersistencePort → SupabaseAdapter: saveTimeline()
ReceiveTranscript → External Client: ReceiveTranscriptOutput
```

### Description
1. Speech recognition service sends transcript with speech quality metrics
2. Use case loads aggregate from repository with all entities
3. Aggregate processes the transcript, completes the response, and updates timeline
4. Domain events published for candidate stopped speaking and question completed
5. Response persisted to database
6. Response returned to client

---

## Sequence Diagram 3: Start AI Response

### Actors
- External Client (AI Service)
- StartAIResponse Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- ConversationService
- SpeechSynthesisPort (OpenAIRealtimeAdapter)
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → StartAIResponse: execute(StartAIResponseInput)
StartAIResponse → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
StartAIResponse → InterviewSessionAggregate: startAIResponse(text)
InterviewSessionAggregate → QuestionExecution: state = ASKING
InterviewSessionAggregate → EventBus: publish(AIStartedSpeaking)
EventBus → InterviewEventHandler: handle(AIStartedSpeaking)
InterviewEventHandler → AnalyticsPort: trackEvent()
StartAIResponse → ConversationService: startSpeaking(text, aggregate)
ConversationService → SpeechSynthesisPort: speak(text, sessionId)
SpeechSynthesisPort → OpenAIRealtimeAdapter: speak()
SpeechSynthesisPort → ConversationService: onSpeakingStarted callback
ConversationService → InterviewSessionAggregate: timeline.addTurn(Turn)
InterviewSessionAggregate → EventBus: publish(AIStartedSpeaking)
StartAIResponse → InterviewPersistencePort: saveQuestionExecution(execution)
InterviewPersistencePort → SupabaseAdapter: saveQuestionExecution()
StartAIResponse → InterviewPersistencePort: saveTimeline(timeline)
InterviewPersistencePort → SupabaseAdapter: saveTimeline()
StartAIResponse → External Client: StartAIResponseOutput
```

### Description
1. AI service sends response text to speak
2. Use case loads aggregate from repository
3. Aggregate updates question state to ASKING
4. Domain event published for AI started speaking
5. Conversation service initiates speech synthesis via port
6. Speech synthesis adapter processes the text
7. Timeline updated with AI turn
8. Question execution persisted
9. Response returned to client

---

## Sequence Diagram 4: Register Silence

### Actors
- External Client (Timer Service)
- RegisterSilence Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- MaxSilencePolicy
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → RegisterSilence: execute(RegisterSilenceInput)
RegisterSilence → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
RegisterSilence → MaxSilencePolicy: evaluate(silenceDuration)
MaxSilencePolicy → RegisterSilence: boolean
RegisterSilence → InterviewSessionAggregate: registerSilence(duration)
InterviewSessionAggregate → EventBus: publish(SilenceDetected)
EventBus → InterviewEventHandler: handle(SilenceDetected)
InterviewEventHandler → AnalyticsPort: trackEvent()
if (silenceDuration > maxSilenceDuration) {
  InterviewSessionAggregate → QuestionExecution: timeout()
  InterviewSessionAggregate → EventBus: publish(QuestionSkipped)
  EventBus → InterviewEventHandler: handle(QuestionSkipped)
  action = "TIMEOUT"
} else if (silenceDuration > promptThreshold) {
  action = "PROMPT"
} else {
  action = "CONTINUE"
}
RegisterSilence → InterviewPersistencePort: saveQuestionExecution(execution)
InterviewPersistencePort → SupabaseAdapter: saveQuestionExecution()
RegisterSilence → External Client: RegisterSilenceOutput
```

### Description
1. Timer service reports silence duration
2. Use case loads aggregate from repository
3. Policy evaluates if silence exceeds maximum allowed duration
4. Aggregate registers silence and publishes domain event
5. If silence exceeds max, question is marked as timeout/skipped
6. Question execution persisted
7. Action returned to client (CONTINUE, PROMPT, or TIMEOUT)

---

## Sequence Diagram 5: Register Interruption

### Actors
- External Client (Speech Recognition)
- RegisterInterruption Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- InterruptionService
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → RegisterInterruption: execute(RegisterInterruptionInput)
RegisterInterruption → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
RegisterInterruption → InterruptionService: detectInterruption(aggregate)
InterruptionService → InterviewSessionAggregate: getVoiceSettings()
InterruptionService → InterruptionPolicy: getAllowInterruption()
InterruptionService → RegisterInterruption: boolean
if (interruptionDetected) {
  RegisterInterruption → InterviewSessionAggregate: registerInterruption()
  InterviewSessionAggregate → EventBus: publish(InterruptionDetected)
  EventBus → InterviewEventHandler: handle(InterruptionDetected)
  InterviewEventHandler → AnalyticsPort: trackEvent()
  if (resumeAfterInterruption) {
    action = "RESUME"
  } else if (repeatQuestion) {
    action = "REPEAT"
  } else {
    action = "SKIP"
  }
} else {
  action = "CONTINUE"
}
RegisterInterruption → InterviewPersistencePort: saveTimeline(timeline)
InterviewPersistencePort → SupabaseAdapter: saveTimeline()
RegisterInterruption → External Client: RegisterInterruptionOutput
```

### Description
1. Speech recognition detects candidate interruption
2. Use case loads aggregate from repository
3. Interruption service evaluates if interruption is valid based on policy
4. If valid, aggregate registers interruption and publishes domain event
5. Action determined based on interruption policy (RESUME, REPEAT, SKIP)
6. Timeline persisted
7. Action returned to client

---

## Sequence Diagram 6: Pause Interview

### Actors
- External Client (API/Web)
- PauseInterview Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- PauseResumeService
- InterviewPersistencePort (SupabaseAdapter)
- RuntimePort
- EventBus

### Flow

```
External Client → PauseInterview: execute(PauseInterviewInput)
PauseInterview → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
PauseInterview → InterviewSessionAggregate: pauseInterview()
InterviewSessionAggregate → InterviewSession: pause()
InterviewSession → InterviewSession: state = PAUSED
InterviewSessionAggregate → EventBus: publish(InterviewPaused)
EventBus → InterviewEventHandler: handle(InterviewPaused)
InterviewEventHandler → RuntimePort: notifyInterviewPaused()
InterviewEventHandler → AnalyticsPort: trackEvent()
PauseInterview → InterviewPersistencePort: saveInterviewSession(session)
InterviewPersistencePort → SupabaseAdapter: saveInterviewSession()
PauseInterview → External Client: PauseInterviewOutput
```

### Description
1. Client requests to pause interview
2. Use case loads aggregate from repository
3. Aggregate pauses the interview session
4. Domain event published and handled
5. Runtime notified of pause
6. Session state persisted
7. Response returned to client

---

## Sequence Diagram 7: Resume Interview

### Actors
- External Client (API/Web)
- ResumeInterview Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- PauseResumeService
- InterviewPersistencePort (SupabaseAdapter)
- RuntimePort
- EventBus

### Flow

```
External Client → ResumeInterview: execute(ResumeInterviewInput)
ResumeInterview → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
ResumeInterview → InterviewSessionAggregate: resumeInterview()
InterviewSessionAggregate → InterviewSession: resume()
InterviewSession → InterviewSession: state = IN_PROGRESS
InterviewSessionAggregate → EventBus: publish(InterviewResumed)
EventBus → InterviewEventHandler: handle(InterviewResumed)
InterviewEventHandler → RuntimePort: notifyInterviewResumed()
InterviewEventHandler → AnalyticsPort: trackEvent()
ResumeInterview → InterviewPersistencePort: saveInterviewSession(session)
InterviewPersistencePort → SupabaseAdapter: saveInterviewSession()
ResumeInterview → External Client: ResumeInterviewOutput
```

### Description
1. Client requests to resume interview
2. Use case loads aggregate from repository
3. Aggregate resumes the interview session
4. Domain event published and handled
5. Runtime notified of resume
6. Session state persisted
7. Response returned to client

---

## Sequence Diagram 8: Next Question

### Actors
- External Client (API/Web)
- NextQuestion Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- QuestionSelectionService
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → NextQuestion: execute(NextQuestionInput)
NextQuestion → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
NextQuestion → QuestionSelectionService: selectNextQuestion(currentIndex, totalQuestions)
QuestionSelectionService → NextQuestion: QuestionIndex | null
if (nextIndex !== null) {
  NextQuestion → InterviewSessionAggregate: nextQuestion()
  InterviewSessionAggregate → InterviewProgress: advance()
  InterviewSessionAggregate → QuestionExecution: start()
  InterviewSessionAggregate → EventBus: publish(QuestionStarted)
  EventBus → InterviewEventHandler: handle(QuestionStarted)
  InterviewEventHandler → AnalyticsPort: trackEvent()
  NextQuestion → InterviewPersistencePort: saveQuestionExecution(execution)
  InterviewPersistencePort → SupabaseAdapter: saveQuestionExecution()
  NextQuestion → InterviewPersistencePort: saveProgress(progress)
  InterviewPersistencePort → SupabaseAdapter: saveProgress()
  output = { questionExecutionId, questionIndex, questionText }
} else {
  output = { error: "No more questions" }
}
NextQuestion → External Client: NextQuestionOutput
```

### Description
1. Client requests next question
2. Use case loads aggregate from repository
3. Question selection service determines next question index
4. If next question exists, aggregate advances progress and starts question
5. Domain event published
6. Question execution and progress persisted
7. Response returned with question details or error

---

## Sequence Diagram 9: Complete Interview

### Actors
- External Client (API/Web)
- CompleteInterview Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- CompletionService
- CompletionPolicy
- InterviewPersistencePort (SupabaseAdapter)
- RuntimePort
- EventBus

### Flow

```
External Client → CompleteInterview: execute(CompleteInterviewInput)
CompleteInterview → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
CompleteInterview → CompletionService: checkCompletion(aggregate)
CompletionService → CompletionPolicy: evaluate(progress)
CompletionPolicy → CompletionService: boolean
if (completionCriteriaMet) {
  CompleteInterview → InterviewSessionAggregate: completeInterview()
  InterviewSessionAggregate → InterviewSession: complete()
  InterviewSession → InterviewSession: state = COMPLETED
  InterviewSessionAggregate → InterviewProgress: getCompletionPercentage()
  InterviewSessionAggregate → InterviewTimeline: calculateStatistics()
  InterviewSessionAggregate → EventBus: publish(InterviewCompleted)
  EventBus → InterviewEventHandler: handle(InterviewCompleted)
  InterviewEventHandler → RuntimePort: notifyInterviewCompleted()
  InterviewEventHandler → AnalyticsPort: trackEvent()
  CompleteInterview → InterviewPersistencePort: saveInterviewSession(session)
  InterviewPersistencePort → SupabaseAdapter: saveInterviewSession()
  CompleteInterview → InterviewPersistencePort: saveProgress(progress)
  InterviewPersistencePort → SupabaseAdapter: saveProgress()
  CompleteInterview → InterviewPersistencePort: saveTimeline(timeline)
  InterviewPersistencePort → SupabaseAdapter: saveTimeline()
  output = { state: COMPLETED, statistics }
} else {
  output = { error: "Completion criteria not met" }
}
CompleteInterview → External Client: CompleteInterviewOutput
```

### Description
1. Client requests to complete interview
2. Use case loads aggregate from repository
3. Completion service checks if completion criteria met via policy
4. If criteria met, aggregate completes interview
5. Statistics calculated from timeline
6. Domain event published and handled
7. Runtime notified of completion
8. All entities persisted
9. Response returned with state and statistics

---

## Sequence Diagram 10: Abort Interview

### Actors
- External Client (API/Web)
- AbortInterview Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- InterviewPersistencePort (SupabaseAdapter)
- RuntimePort
- EventBus

### Flow

```
External Client → AbortInterview: execute(AbortInterviewInput)
AbortInterview → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
AbortInterview → InterviewSessionAggregate: abortInterview(reason)
InterviewSessionAggregate → InterviewSession: cancel()
InterviewSession → InterviewSession: state = CANCELLED
InterviewSessionAggregate → EventBus: publish(InterviewCancelled)
EventBus → InterviewEventHandler: handle(InterviewCancelled)
InterviewEventHandler → RuntimePort: notifyInterviewCancelled()
InterviewEventHandler → AnalyticsPort: trackEvent()
AbortInterview → InterviewPersistencePort: saveInterviewSession(session)
InterviewPersistencePort → SupabaseAdapter: saveInterviewSession()
AbortInterview → External Client: AbortInterviewOutput
```

### Description
1. Client requests to abort interview with reason
2. Use case loads aggregate from repository
3. Aggregate cancels the interview session
4. Domain event published and handled
5. Runtime notified of cancellation
6. Session state persisted
7. Response returned to client

---

## Sequence Diagram 11: Handle Timeout

### Actors
- External Client (Timer Service)
- HandleTimeout Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- TimeManagementService
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → HandleTimeout: execute(HandleTimeoutInput)
HandleTimeout → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
HandleTimeout → TimeManagementService: checkTimeout(aggregate)
TimeManagementService → ClockPort: now()
ClockPort → TimeManagementService: timestamp
TimeManagementService → InterviewSessionAggregate: getCreatedAt()
TimeManagementService → HandleTimeout: boolean
if (timeoutExceeded) {
  HandleTimeout → InterviewSessionAggregate: handleTimeout()
  InterviewSessionAggregate → InterviewSession: timeout()
  InterviewSession → InterviewSession: state = TIMEOUT
  InterviewSessionAggregate → EventBus: publish(InterviewTimeout)
  EventBus → InterviewEventHandler: handle(InterviewTimeout)
  InterviewEventHandler → AnalyticsPort: trackEvent()
  HandleTimeout → InterviewPersistencePort: saveInterviewSession(session)
  InterviewPersistencePort → SupabaseAdapter: saveInterviewSession()
  output = { state: TIMEOUT }
} else {
  output = { state: current state }
}
HandleTimeout → External Client: HandleTimeoutOutput
```

### Description
1. Timer service checks for interview timeout
2. Use case loads aggregate from repository
3. Time management service checks if duration exceeded
4. If timeout exceeded, aggregate handles timeout
5. Domain event published and handled
6. Session state persisted
7. Response returned with state

---

## Sequence Diagram 12: Get Interview Status

### Actors
- External Client (API/Web)
- GetInterviewStatus Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate

### Flow

```
External Client → GetInterviewStatus: execute(GetInterviewStatusInput)
GetInterviewStatus → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
GetInterviewStatus → InterviewSessionAggregate: getState()
InterviewSessionAggregate → GetInterviewStatus: InterviewState
GetInterviewStatus → InterviewSessionAggregate: getProgress()
InterviewSessionAggregate → GetInterviewStatus: InterviewProgress
GetInterviewStatus → InterviewSessionAggregate: getCurrentQuestion()
InterviewSessionAggregate → GetInterviewStatus: QuestionExecution | null
GetInterviewStatus → External Client: GetInterviewStatusOutput
```

### Description
1. Client requests interview status
2. Use case loads aggregate from repository
3. Aggregate returns state, progress, and current question
4. Response returned to client

---

## Sequence Diagram 13: Skip Question

### Actors
- External Client (API/Web)
- SkipQuestion Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → SkipQuestion: execute(SkipQuestionInput)
SkipQuestion → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
SkipQuestion → InterviewSessionAggregate: skipQuestion(questionExecutionId)
InterviewSessionAggregate → QuestionExecution: skip()
InterviewSessionAggregate → InterviewProgress: skipQuestion()
InterviewSessionAggregate → EventBus: publish(QuestionSkipped)
EventBus → InterviewEventHandler: handle(QuestionSkipped)
InterviewEventHandler → AnalyticsPort: trackEvent()
SkipQuestion → InterviewPersistencePort: saveQuestionExecution(execution)
InterviewPersistencePort → SupabaseAdapter: saveQuestionExecution()
SkipQuestion → InterviewPersistencePort: saveProgress(progress)
InterviewPersistencePort → SupabaseAdapter: saveProgress()
SkipQuestion → External Client: SkipQuestionOutput
```

### Description
1. Client requests to skip a question
2. Use case loads aggregate from repository
3. Aggregate skips the question execution and updates progress
4. Domain event published and handled
5. Question execution and progress persisted
6. Response returned to client

---

## Sequence Diagram 14: Finish AI Response

### Actors
- External Client (Speech Synthesis)
- FinishAIResponse Use Case
- InterviewSessionAggregateRepository
- InterviewSessionAggregate
- ConversationService
- SpeechSynthesisPort (OpenAIRealtimeAdapter)
- InterviewPersistencePort (SupabaseAdapter)
- EventBus

### Flow

```
External Client → FinishAIResponse: execute(FinishAIResponseInput)
FinishAIResponse → InterviewSessionAggregateRepository: findById(interviewSessionId)
InterviewSessionAggregateRepository → InterviewPersistencePort: loadInterviewSession(id)
InterviewPersistencePort → SupabaseAdapter: loadInterviewSession()
InterviewSessionAggregateRepository → InterviewSessionAggregate
FinishAIResponse → InterviewSessionAggregate: finishAIResponse()
InterviewSessionAggregate → QuestionExecution: state = LISTENING
InterviewSessionAggregate → EventBus: publish(AIStoppedSpeaking)
EventBus → InterviewEventHandler: handle(AIStoppedSpeaking)
InterviewEventHandler → AnalyticsPort: trackEvent()
FinishAIResponse → ConversationService: stopSpeaking(aggregate)
ConversationService → SpeechSynthesisPort: stopSpeaking(sessionId)
SpeechSynthesisPort → OpenAIRealtimeAdapter: stopSpeaking()
FinishAIResponse → InterviewPersistencePort: saveQuestionExecution(execution)
InterviewPersistencePort → SupabaseAdapter: saveQuestionExecution()
FinishAIResponse → External Client: FinishAIResponseOutput
```

### Description
1. Speech synthesis notifies that AI response finished
2. Use case loads aggregate from repository
3. Aggregate updates question state to LISTENING
4. Domain event published and handled
5. Conversation service stops speaking via port
6. Question execution persisted
7. Response returned to client

---

## Sequence Diagram Summary

### Key Patterns

1. **Repository Pattern**: All use cases load aggregates via repository, which uses persistence port
2. **Event-Driven**: Domain events are published and handled asynchronously
3. **Port-Adapter Pattern**: Infrastructure concerns abstracted behind ports
4. **Aggregate Consistency**: All state changes go through aggregate root
5. **Persistence**: State is persisted after each significant change

### Error Handling Flows

All sequence diagrams include implicit error handling:
- If aggregate not found: Return error response
- If persistence fails: Log error and return error response
- If port operation fails: Log error and return error response
- If policy evaluation fails: Apply default behavior

### Async Event Handling

Domain events are published asynchronously:
- EventBus publishes event
- Event handlers subscribe to events
- Handlers perform side effects (analytics, telemetry, runtime notifications)
- Event handling failures do not block main flow

---

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
