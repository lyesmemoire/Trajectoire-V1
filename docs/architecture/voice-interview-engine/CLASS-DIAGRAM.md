# Class Diagram - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This document describes the class diagram for the Voice Interview Engine, showing the relationships between domain, application, infrastructure, and integration layers.

---

## Domain Layer Classes

### Aggregate Root

#### InterviewSessionAggregate

```typescript
class InterviewSessionAggregate {
  private interviewSession: InterviewSession;
  private questionExecutions: Map<string, QuestionExecution>;
  private candidateResponses: Map<string, CandidateResponse>;
  private timeline: InterviewTimeline;
  private progress: InterviewProgress;
  private domainEvents: DomainEvent[];

  constructor(
    interviewSession: InterviewSession,
    timeline: InterviewTimeline,
    progress: InterviewProgress
  ) {
    this.interviewSession = interviewSession;
    this.questionExecutions = new Map();
    this.candidateResponses = new Map();
    this.timeline = timeline;
    this.progress = progress;
    this.domainEvents = [];
  }

  // Aggregate methods
  startInterview(): void;
  pauseInterview(): void;
  resumeInterview(): void;
  stopInterview(): void;
  nextQuestion(): void;
  skipQuestion(): void;
  receiveTranscript(transcript: string): void;
  startAIResponse(): void;
  finishAIResponse(): void;
  registerSilence(duration: number): void;
  registerInterruption(): void;
  completeInterview(): void;
  abortInterview(): void;
  handleTimeout(): void;

  // Event management
  pullDomainEvents(): DomainEvent[];
  clearDomainEvents(): void;
}
```

**Relationships**:
- Composes InterviewSession
- Composes QuestionExecution (1..*)
- Composes CandidateResponse (1..*)
- Composes InterviewTimeline
- Composes InterviewProgress
- Publishes DomainEvent (0..*)

---

### Entities

#### InterviewSession

```typescript
class InterviewSession {
  private id: string;
  private candidateId: string;
  private interviewPlanId: string;
  private state: InterviewState;
  private voiceSettings: VoiceSettings;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    candidateId: string,
    interviewPlanId: string,
    voiceSettings: VoiceSettings
  ) {
    this.id = id;
    this.candidateId = candidateId;
    this.interviewPlanId = interviewPlanId;
    this.state = InterviewState.NOT_STARTED;
    this.voiceSettings = voiceSettings;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Entity methods
  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
  complete(): void;
  cancel(): void;
  timeout(): void;

  // Getters
  getId(): string;
  getCandidateId(): string;
  getInterviewPlanId(): string;
  getState(): InterviewState;
  getVoiceSettings(): VoiceSettings;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
}
```

**Relationships**:
- Uses InterviewState (Value Object)
- Composes VoiceSettings (Value Object)

---

#### QuestionExecution

```typescript
class QuestionExecution {
  private id: string;
  private interviewSessionId: string;
  private questionIndex: QuestionIndex;
  private questionText: string;
  private state: QuestionState;
  private startedAt: Date;
  private completedAt?: Date;
  private skippedAt?: Date;

  constructor(
    id: string,
    interviewSessionId: string,
    questionIndex: QuestionIndex,
    questionText: string
  ) {
    this.id = id;
    this.interviewSessionId = interviewSessionId;
    this.questionIndex = questionIndex;
    this.questionText = questionText;
    this.state = QuestionState.PENDING;
    this.startedAt = new Date();
  }

  // Entity methods
  start(): void;
  complete(): void;
  skip(): void;
  timeout(): void;

  // Getters
  getId(): string;
  getInterviewSessionId(): string;
  getQuestionIndex(): QuestionIndex;
  getQuestionText(): string;
  getState(): QuestionState;
  getStartedAt(): Date;
  getCompletedAt(): Date | undefined;
  getSkippedAt(): Date | undefined;
}
```

**Relationships**:
- Uses QuestionIndex (Value Object)
- Uses QuestionState (Value Object)

---

#### CandidateResponse

```typescript
class CandidateResponse {
  private id: string;
  private questionExecutionId: string;
  private transcript: string;
  private state: ResponseState;
  private startedAt: Date;
  private completedAt?: Date;
  private speechQuality: SpeechQuality;

  constructor(
    id: string,
    questionExecutionId: string,
    transcript: string,
    speechQuality: SpeechQuality
  ) {
    this.id = id;
    this.questionExecutionId = questionExecutionId;
    this.transcript = transcript;
    this.state = ResponseState.SPEAKING;
    this.startedAt = new Date();
    this.speechQuality = speechQuality;
  }

  // Entity methods
  start(): void;
  complete(): void;
  silence(): void;

  // Getters
  getId(): string;
  getQuestionExecutionId(): string;
  getTranscript(): string;
  getState(): ResponseState;
  getStartedAt(): Date;
  getCompletedAt(): Date | undefined;
  getSpeechQuality(): SpeechQuality;
}
```

**Relationships**:
- Uses ResponseState (Value Object)
- Composes SpeechQuality (Value Object)

---

#### InterviewTimeline

```typescript
class InterviewTimeline {
  private id: string;
  private interviewSessionId: string;
  private turns: Turn[];

  constructor(id: string, interviewSessionId: string) {
    this.id = id;
    this.interviewSessionId = interviewSessionId;
    this.turns = [];
  }

  // Entity methods
  addTurn(turn: Turn): void;
  getTurns(): Turn[];
  getTurnCount(): number;
  getLastTurn(): Turn | undefined;
}
```

**Relationships**:
- Composes Turn (Value Object) (0..*)

---

#### InterviewProgress

```typescript
class InterviewProgress {
  private id: string;
  private interviewSessionId: string;
  private currentIndex: QuestionIndex;
  private totalQuestions: number;
  private completedQuestions: number;
  private skippedQuestions: number;

  constructor(
    id: string,
    interviewSessionId: string,
    totalQuestions: number
  ) {
    this.id = id;
    this.interviewSessionId = interviewSessionId;
    this.currentIndex = new QuestionIndex(0);
    this.totalQuestions = totalQuestions;
    this.completedQuestions = 0;
    this.skippedQuestions = 0;
  }

  // Entity methods
  advance(): void;
  completeQuestion(): void;
  skipQuestion(): void;
  getCompletionPercentage(): number;

  // Getters
  getCurrentIndex(): QuestionIndex;
  getTotalQuestions(): number;
  getCompletedQuestions(): number;
  getSkippedQuestions(): number;
}
```

**Relationships**:
- Uses QuestionIndex (Value Object)

---

### Value Objects

#### InterviewState

```typescript
enum InterviewState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  TIMEOUT = "TIMEOUT"
}
```

**Immutability**: Immutable enum

---

#### QuestionState

```typescript
enum QuestionState {
  PENDING = "PENDING",
  ASKING = "ASKING",
  LISTENING = "LISTENING",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
  TIMEOUT = "TIMEOUT"
}
```

**Immutability**: Immutable enum

---

#### ResponseState

```typescript
enum ResponseState {
  SPEAKING = "SPEAKING",
  SILENCE = "SILENCE",
  COMPLETED = "COMPLETED"
}
```

**Immutability**: Immutable enum

---

#### SessionTiming

```typescript
class SessionTiming {
  private readonly startTime: Date;
  private readonly endTime?: Date;
  private readonly duration: number;

  constructor(startTime: Date, endTime?: Date) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = endTime ? endTime.getTime() - startTime.getTime() : 0;
  }

  getStartTime(): Date;
  getEndTime(): Date | undefined;
  getDuration(): number;
}
```

**Immutability**: Immutable

---

#### Turn

```typescript
class Turn {
  private readonly speaker: "CANDIDATE" | "AI";
  private readonly startTime: Date;
  private readonly endTime?: Date;
  private readonly transcript?: string;

  constructor(
    speaker: "CANDIDATE" | "AI",
    startTime: Date,
    endTime?: Date,
    transcript?: string
  ) {
    this.speaker = speaker;
    this.startTime = startTime;
    this.endTime = endTime;
    this.transcript = transcript;
  }

  getSpeaker(): "CANDIDATE" | "AI";
  getStartTime(): Date;
  getEndTime(): Date | undefined;
  getTranscript(): string | undefined;
  getDuration(): number;
}
```

**Immutability**: Immutable

---

#### Latency

```typescript
class Latency {
  private readonly value: number;
  private readonly unit: "ms" | "s";

  constructor(value: number, unit: "ms" | "s" = "ms") {
    this.value = value;
    this.unit = unit;
  }

  getValue(): number;
  getUnit(): "ms" | "s";
}
```

**Immutability**: Immutable

---

#### VoiceSettings

```typescript
class VoiceSettings {
  private readonly language: string;
  private readonly speakingRate: number;
  private readonly pitch: number;
  private readonly silenceTimeout: SilenceTimeout;
  private readonly speakingWindow: SpeakingWindow;
  private readonly interruptionPolicy: InterruptionPolicy;

  constructor(
    language: string,
    speakingRate: number,
    pitch: number,
    silenceTimeout: SilenceTimeout,
    speakingWindow: SpeakingWindow,
    interruptionPolicy: InterruptionPolicy
  ) {
    this.language = language;
    this.speakingRate = speakingRate;
    this.pitch = pitch;
    this.silenceTimeout = silenceTimeout;
    this.speakingWindow = speakingWindow;
    this.interruptionPolicy = interruptionPolicy;
  }

  getLanguage(): string;
  getSpeakingRate(): number;
  getPitch(): number;
  getSilenceTimeout(): SilenceTimeout;
  getSpeakingWindow(): SpeakingWindow;
  getInterruptionPolicy(): InterruptionPolicy;
}
```

**Immutability**: Immutable

---

#### SpeakingWindow

```typescript
class SpeakingWindow {
  private readonly minDuration: number;
  private readonly maxDuration: number;

  constructor(minDuration: number, maxDuration: number) {
    this.minDuration = minDuration;
    this.maxDuration = maxDuration;
  }

  getMinDuration(): number;
  getMaxDuration(): number;
}
```

**Immutability**: Immutable

---

#### SilenceTimeout

```typescript
class SilenceTimeout {
  private readonly duration: number;
  private readonly unit: "ms" | "s";

  constructor(duration: number, unit: "ms" | "s" = "ms") {
    this.duration = duration;
    this.unit = unit;
  }

  getDuration(): number;
  getUnit(): "ms" | "s";
}
```

**Immutability**: Immutable

---

#### InterruptionPolicy

```typescript
class InterruptionPolicy {
  private readonly allowInterruption: boolean;
  private readonly interruptionThreshold: number;
  private readonly resumeAfterInterruption: boolean;

  constructor(
    allowInterruption: boolean,
    interruptionThreshold: number,
    resumeAfterInterruption: boolean
  ) {
    this.allowInterruption = allowInterruption;
    this.interruptionThreshold = interruptionThreshold;
    this.resumeAfterInterruption = resumeAfterInterruption;
  }

  getAllowInterruption(): boolean;
  getInterruptionThreshold(): number;
  getResumeAfterInterruption(): boolean;
}
```

**Immutability**: Immutable

---

#### RetryPolicy

```typescript
class RetryPolicy {
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(maxRetries: number, retryDelay: number) {
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  getMaxRetries(): number;
  getRetryDelay(): number;
}
```

**Immutability**: Immutable

---

#### SpeechQuality

```typescript
class SpeechQuality {
  private readonly confidence: number;
  private readonly clarity: number;
  private readonly noiseLevel: number;

  constructor(confidence: number, clarity: number, noiseLevel: number) {
    this.confidence = confidence;
    this.clarity = clarity;
    this.noiseLevel = noiseLevel;
  }

  getConfidence(): number;
  getClarity(): number;
  getNoiseLevel(): number;
}
```

**Immutability**: Immutable

---

#### ConversationContext

```typescript
class ConversationContext {
  private readonly previousQuestions: string[];
  private readonly previousResponses: string[];
  private readonly currentTopic: string;

  constructor(
    previousQuestions: string[],
    previousResponses: string[],
    currentTopic: string
  ) {
    this.previousQuestions = previousQuestions;
    this.previousResponses = previousResponses;
    this.currentTopic = currentTopic;
  }

  getPreviousQuestions(): string[];
  getPreviousResponses(): string[];
  getCurrentTopic(): string;
}
```

**Immutability**: Immutable

---

#### QuestionIndex

```typescript
class QuestionIndex {
  private readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  getValue(): number;
  next(): QuestionIndex;
  equals(other: QuestionIndex): boolean;
}
```

**Immutability**: Immutable

---

#### InterviewStatistics

```typescript
class InterviewStatistics {
  private readonly totalTurns: number;
  private readonly totalSpeakingTime: number;
  private readonly totalSilenceTime: number;
  private readonly averageResponseTime: number;

  constructor(
    totalTurns: number,
    totalSpeakingTime: number,
    totalSilenceTime: number,
    averageResponseTime: number
  ) {
    this.totalTurns = totalTurns;
    this.totalSpeakingTime = totalSpeakingTime;
    this.totalSilenceTime = totalSilenceTime;
    this.averageResponseTime = averageResponseTime;
  }

  getTotalTurns(): number;
  getTotalSpeakingTime(): number;
  getTotalSilenceTime(): number;
  getAverageResponseTime(): number;
}
```

**Immutability**: Immutable

---

### Domain Services

#### InterviewFlowService

```typescript
class InterviewFlowService {
  constructor(
    private readonly questionSelectionService: QuestionSelectionService,
    private readonly transitionService: TransitionService
  ) {}

  orchestrateInterviewFlow(aggregate: InterviewSessionAggregate): void;
}
```

**Relationships**:
- Uses QuestionSelectionService
- Uses TransitionService
- Uses InterviewSessionAggregate

---

#### QuestionSelectionService

```typescript
class QuestionSelectionService {
  selectNextQuestion(
    currentIndex: QuestionIndex,
    totalQuestions: number
  ): QuestionIndex | null;
}
```

**Relationships**:
- Uses QuestionIndex

---

#### TimeManagementService

```typescript
class TimeManagementService {
  constructor(private readonly clockPort: ClockPort) {}

  trackSessionTiming(aggregate: InterviewSessionAggregate): SessionTiming;
  trackTurnTiming(aggregate: InterviewSessionAggregate): Latency;
  checkTimeout(aggregate: InterviewSessionAggregate): boolean;
}
```

**Relationships**:
- Uses ClockPort
- Uses InterviewSessionAggregate
- Returns SessionTiming
- Returns Latency

---

#### ConversationService

```typescript
class ConversationService {
  constructor(
    private readonly speechRecognitionPort: SpeechRecognitionPort,
    private readonly speechSynthesisPort: SpeechSynthesisPort
  ) {}

  startListening(aggregate: InterviewSessionAggregate): Promise<void>;
  stopListening(aggregate: InterviewSessionAggregate): Promise<void>;
  startSpeaking(text: string, aggregate: InterviewSessionAggregate): Promise<void>;
  stopSpeaking(aggregate: InterviewSessionAggregate): Promise<void>;
}
```

**Relationships**:
- Uses SpeechRecognitionPort
- Uses SpeechSynthesisPort
- Uses InterviewSessionAggregate

---

#### TransitionService

```typescript
class TransitionService {
  transitionToNextQuestion(aggregate: InterviewSessionAggregate): void;
  transitionToPause(aggregate: InterviewSessionAggregate): void;
  transitionToResume(aggregate: InterviewSessionAggregate): void;
  transitionToCompletion(aggregate: InterviewSessionAggregate): void;
  transitionToCancellation(aggregate: InterviewSessionAggregate): void;
}
```

**Relationships**:
- Uses InterviewSessionAggregate

---

#### InterruptionService

```typescript
class InterruptionService {
  constructor(private readonly interruptionPolicy: InterruptionPolicy) {}

  detectInterruption(aggregate: InterviewSessionAggregate): boolean;
  handleInterruption(aggregate: InterviewSessionAggregate): void;
}
```

**Relationships**:
- Uses InterruptionPolicy
- Uses InterviewSessionAggregate

---

#### PauseResumeService

```typescript
class PauseResumeService {
  pause(aggregate: InterviewSessionAggregate): void;
  resume(aggregate: InterviewSessionAggregate): void;
}
```

**Relationships**:
- Uses InterviewSessionAggregate

---

#### CompletionService

```typescript
class CompletionService {
  constructor(
    private readonly completionPolicy: CompletionPolicy,
    private readonly interviewPersistencePort: InterviewPersistencePort
  ) {}

  checkCompletion(aggregate: InterviewSessionAggregate): boolean;
  finalizeInterview(aggregate: InterviewSessionAggregate): Promise<void>;
}
```

**Relationships**:
- Uses CompletionPolicy
- Uses InterviewPersistencePort
- Uses InterviewSessionAggregate

---

### Policies

#### MaxSilencePolicy

```typescript
class MaxSilencePolicy {
  constructor(private readonly maxSilenceDuration: number) {}

  evaluate(silenceDuration: number): boolean;
}
```

**Relationships**: None

---

#### MaxRetriesPolicy

```typescript
class MaxRetriesPolicy {
  constructor(private readonly maxRetries: number) {}

  evaluate(retryCount: number): boolean;
}
```

**Relationships**: None

---

#### TimeLimitPolicy

```typescript
class TimeLimitPolicy {
  constructor(private readonly maxDuration: number) {}

  evaluate(duration: number): boolean;
}
```

**Relationships**: None

---

#### QuestionOrderPolicy

```typescript
class QuestionOrderPolicy {
  constructor(private readonly order: "SEQUENTIAL" | "RANDOM" | "ADAPTIVE") {}

  evaluate(currentIndex: QuestionIndex, totalQuestions: number): QuestionIndex;
}
```

**Relationships**:
- Uses QuestionIndex

---

#### CompletionPolicy

```typescript
class CompletionPolicy {
  constructor(
    private readonly requireAllQuestions: boolean,
    private readonly minCompletionPercentage: number
  ) {}

  evaluate(progress: InterviewProgress): boolean;
}
```

**Relationships**:
- Uses InterviewProgress

---

### Domain Events

#### InterviewStarted

```typescript
class InterviewStarted extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly candidateId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### QuestionStarted

```typescript
class QuestionStarted extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly questionIndex: number,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### QuestionCompleted

```typescript
class QuestionCompleted extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly questionIndex: number,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### CandidateSpeaking

```typescript
class CandidateSpeaking extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### CandidateStoppedSpeaking

```typescript
class CandidateStoppedSpeaking extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly transcript: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### AIStartedSpeaking

```typescript
class AIStartedSpeaking extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### AIStoppedSpeaking

```typescript
class AIStoppedSpeaking extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### SilenceDetected

```typescript
class SilenceDetected extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly duration: number,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### InterruptionDetected

```typescript
class InterruptionDetected extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### QuestionSkipped

```typescript
class QuestionSkipped extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly questionExecutionId: string,
    readonly questionIndex: number,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### InterviewPaused

```typescript
class InterviewPaused extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### InterviewResumed

```typescript
class InterviewResumed extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### InterviewCompleted

```typescript
class InterviewCompleted extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly candidateId: string,
    readonly statistics: InterviewStatistics,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent, Uses InterviewStatistics

---

#### InterviewCancelled

```typescript
class InterviewCancelled extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly reason: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### InterviewTimeout

```typescript
class InterviewTimeout extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly duration: number,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

#### ConversationError

```typescript
class ConversationError extends DomainEvent {
  constructor(
    readonly interviewSessionId: string,
    readonly error: string,
    readonly timestamp: Date
  ) {
    super();
  }
}
```

**Relationships**: Extends DomainEvent

---

## Application Layer Classes

### Use Cases

#### StartInterview

```typescript
class StartInterview {
  constructor(
    private readonly aggregateFactory: InterviewSessionAggregateFactory,
    private readonly interviewFlowService: InterviewFlowService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly runtimePort: RuntimePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: StartInterviewInput): Promise<StartInterviewOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateFactory
- Uses InterviewFlowService
- Uses InterviewPersistencePort
- Uses RuntimePort
- Uses EventBus

---

#### PauseInterview

```typescript
class PauseInterview {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly pauseResumeService: PauseResumeService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: PauseInterviewInput): Promise<PauseInterviewOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses PauseResumeService
- Uses InterviewPersistencePort
- Uses EventBus

---

#### ResumeInterview

```typescript
class ResumeInterview {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly pauseResumeService: PauseResumeService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: ResumeInterviewInput): Promise<ResumeInterviewOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses PauseResumeService
- Uses InterviewPersistencePort
- Uses EventBus

---

#### StopInterview

```typescript
class StopInterview {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly completionService: CompletionService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly runtimePort: RuntimePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: StopInterviewInput): Promise<StopInterviewOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses CompletionService
- Uses InterviewPersistencePort
- Uses RuntimePort
- Uses EventBus

---

#### NextQuestion

```typescript
class NextQuestion {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly questionSelectionService: QuestionSelectionService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: NextQuestionInput): Promise<NextQuestionOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses QuestionSelectionService
- Uses InterviewPersistencePort
- Uses EventBus

---

#### SkipQuestion

```typescript
class SkipQuestion {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: SkipQuestionInput): Promise<SkipQuestionOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses InterviewPersistencePort
- Uses EventBus

---

#### ReceiveTranscript

```typescript
class ReceiveTranscript {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: ReceiveTranscriptInput): Promise<ReceiveTranscriptOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses InterviewPersistencePort
- Uses EventBus

---

#### StartAIResponse

```typescript
class StartAIResponse {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly conversationService: ConversationService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: StartAIResponseInput): Promise<StartAIResponseOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses ConversationService
- Uses InterviewPersistencePort
- Uses EventBus

---

#### FinishAIResponse

```typescript
class FinishAIResponse {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly conversationService: ConversationService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: FinishAIResponseInput): Promise<FinishAIResponseOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses ConversationService
- Uses InterviewPersistencePort
- Uses EventBus

---

#### RegisterSilence

```typescript
class RegisterSilence {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly maxSilencePolicy: MaxSilencePolicy,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: RegisterSilenceInput): Promise<RegisterSilenceOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses MaxSilencePolicy
- Uses InterviewPersistencePort
- Uses EventBus

---

#### RegisterInterruption

```typescript
class RegisterInterruption {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly interruptionService: InterruptionService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: RegisterInterruptionInput): Promise<RegisterInterruptionOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses InterruptionService
- Uses InterviewPersistencePort
- Uses EventBus

---

#### CompleteInterview

```typescript
class CompleteInterview {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly completionService: CompletionService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly runtimePort: RuntimePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: CompleteInterviewInput): Promise<CompleteInterviewOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses CompletionService
- Uses InterviewPersistencePort
- Uses RuntimePort
- Uses EventBus

---

#### AbortInterview

```typescript
class AbortInterview {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly runtimePort: RuntimePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: AbortInterviewInput): Promise<AbortInterviewOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses InterviewPersistencePort
- Uses RuntimePort
- Uses EventBus

---

#### GetInterviewStatus

```typescript
class GetInterviewStatus {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository
  ) {}

  async execute(input: GetInterviewStatusInput): Promise<GetInterviewStatusOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository

---

#### HandleTimeout

```typescript
class HandleTimeout {
  constructor(
    private readonly aggregateRepository: InterviewSessionAggregateRepository,
    private readonly timeManagementService: TimeManagementService,
    private readonly interviewPersistencePort: InterviewPersistencePort,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: HandleTimeoutInput): Promise<HandleTimeoutOutput>;
}
```

**Relationships**:
- Uses InterviewSessionAggregateRepository
- Uses TimeManagementService
- Uses InterviewPersistencePort
- Uses EventBus

---

### DTOs

#### StartInterviewInput

```typescript
interface StartInterviewInput {
  candidateId: string;
  interviewPlanId: string;
  voiceSettings: VoiceSettings;
}
```

---

#### StartInterviewOutput

```typescript
interface StartInterviewOutput {
  interviewSessionId: string;
  state: InterviewState;
}
```

---

#### PauseInterviewInput

```typescript
interface PauseInterviewInput {
  interviewSessionId: string;
}
```

---

#### PauseInterviewOutput

```typescript
interface PauseInterviewOutput {
  interviewSessionId: string;
  state: InterviewState;
}
```

---

#### ResumeInterviewInput

```typescript
interface ResumeInterviewInput {
  interviewSessionId: string;
}
```

---

#### ResumeInterviewOutput

```typescript
interface ResumeInterviewOutput {
  interviewSessionId: string;
  state: InterviewState;
}
```

---

#### StopInterviewInput

```typescript
interface StopInterviewInput {
  interviewSessionId: string;
}
```

---

#### StopInterviewOutput

```typescript
interface StopInterviewOutput {
  interviewSessionId: string;
  state: InterviewState;
}
```

---

#### NextQuestionInput

```typescript
interface NextQuestionInput {
  interviewSessionId: string;
}
```

---

#### NextQuestionOutput

```typescript
interface NextQuestionOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  questionIndex: number;
  questionText: string;
}
```

---

#### SkipQuestionInput

```typescript
interface SkipQuestionInput {
  interviewSessionId: string;
  questionExecutionId: string;
}
```

---

#### SkipQuestionOutput

```typescript
interface SkipQuestionOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  state: QuestionState;
}
```

---

#### ReceiveTranscriptInput

```typescript
interface ReceiveTranscriptInput {
  interviewSessionId: string;
  questionExecutionId: string;
  transcript: string;
  speechQuality: SpeechQuality;
}
```

---

#### ReceiveTranscriptOutput

```typescript
interface ReceiveTranscriptOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  responseId: string;
  state: ResponseState;
}
```

---

#### StartAIResponseInput

```typescript
interface StartAIResponseInput {
  interviewSessionId: string;
  questionExecutionId: string;
  text: string;
}
```

---

#### StartAIResponseOutput

```typescript
interface StartAIResponseOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  state: QuestionState;
}
```

---

#### FinishAIResponseInput

```typescript
interface FinishAIResponseInput {
  interviewSessionId: string;
  questionExecutionId: string;
}
```

---

#### FinishAIResponseOutput

```typescript
interface FinishAIResponseOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  state: QuestionState;
}
```

---

#### RegisterSilenceInput

```typescript
interface RegisterSilenceInput {
  interviewSessionId: string;
  questionExecutionId: string;
  duration: number;
}
```

---

#### RegisterSilenceOutput

```typescript
interface RegisterSilenceOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  action: "CONTINUE" | "TIMEOUT" | "PROMPT";
}
```

---

#### RegisterInterruptionInput

```typescript
interface RegisterInterruptionInput {
  interviewSessionId: string;
  questionExecutionId: string;
}
```

---

#### RegisterInterruptionOutput

```typescript
interface RegisterInterruptionOutput {
  interviewSessionId: string;
  questionExecutionId: string;
  action: "RESUME" | "REPEAT" | "SKIP";
}
```

---

#### CompleteInterviewInput

```typescript
interface CompleteInterviewInput {
  interviewSessionId: string;
}
```

---

#### CompleteInterviewOutput

```typescript
interface CompleteInterviewOutput {
  interviewSessionId: string;
  state: InterviewState;
  statistics: InterviewStatistics;
}
```

---

#### AbortInterviewInput

```typescript
interface AbortInterviewInput {
  interviewSessionId: string;
  reason: string;
}
```

---

#### AbortInterviewOutput

```typescript
interface AbortInterviewOutput {
  interviewSessionId: string;
  state: InterviewState;
}
```

---

#### GetInterviewStatusInput

```typescript
interface GetInterviewStatusInput {
  interviewSessionId: string;
}
```

---

#### GetInterviewStatusOutput

```typescript
interface GetInterviewStatusOutput {
  interviewSessionId: string;
  state: InterviewState;
  progress: InterviewProgress;
  currentQuestion: QuestionExecution | null;
}
```

---

#### HandleTimeoutInput

```typescript
interface HandleTimeoutInput {
  interviewSessionId: string;
}
```

---

#### HandleTimeoutOutput

```typescript
interface HandleTimeoutOutput {
  interviewSessionId: string;
  state: InterviewState;
}
```

---

### Repository

#### InterviewSessionAggregateRepository

```typescript
interface InterviewSessionAggregateRepository {
  save(aggregate: InterviewSessionAggregate): Promise<void>;
  findById(id: string): Promise<InterviewSessionAggregate | null>;
  findByCandidateId(candidateId: string): Promise<InterviewSessionAggregate[]>;
}
```

**Relationships**: None

---

### Factory

#### InterviewSessionAggregateFactory

```typescript
class InterviewSessionAggregateFactory {
  constructor(
    private readonly uuidPort: UUIDPort,
    private readonly clockPort: ClockPort
  ) {}

  create(
    candidateId: string,
    interviewPlanId: string,
    voiceSettings: VoiceSettings,
    totalQuestions: number
  ): InterviewSessionAggregate;
}
```

**Relationships**:
- Uses UUIDPort
- Uses ClockPort
- Returns InterviewSessionAggregate

---

## Infrastructure Layer Classes

### Adapters

#### OpenAIRealtimeAdapter

```typescript
class OpenAIRealtimeAdapter implements SpeechRecognitionPort, SpeechSynthesisPort {
  constructor(private readonly config: OpenAIConfig) {}

  // SpeechRecognitionPort
  async startListening(sessionId: string): Promise<void>;
  async stopListening(sessionId: string): Promise<void>;
  async getTranscript(sessionId: string): Promise<string>;
  onTranscript(callback: (transcript: string) => void): void;

  // SpeechSynthesisPort
  async speak(text: string, sessionId: string): Promise<void>;
  async stopSpeaking(sessionId: string): Promise<void>;
  onSpeakingStarted(callback: () => void): void;
  onSpeakingCompleted(callback: () => void): void;
}
```

**Relationships**:
- Implements SpeechRecognitionPort
- Implements SpeechSynthesisPort
- Uses OpenAIConfig

---

#### DeepgramAdapter

```typescript
class DeepgramAdapter implements SpeechRecognitionPort {
  constructor(private readonly config: DeepgramConfig) {}

  async startListening(sessionId: string): Promise<void>;
  async stopListening(sessionId: string): Promise<void>;
  async getTranscript(sessionId: string): Promise<string>;
  onTranscript(callback: (transcript: string) => void): void;
}
```

**Relationships**:
- Implements SpeechRecognitionPort
- Uses DeepgramConfig

---

#### AzureSpeechAdapter

```typescript
class AzureSpeechAdapter implements SpeechRecognitionPort, SpeechSynthesisPort {
  constructor(private readonly config: AzureSpeechConfig) {}

  // SpeechRecognitionPort
  async startListening(sessionId: string): Promise<void>;
  async stopListening(sessionId: string): Promise<void>;
  async getTranscript(sessionId: string): Promise<string>;
  onTranscript(callback: (transcript: string) => void): void;

  // SpeechSynthesisPort
  async speak(text: string, sessionId: string): Promise<void>;
  async stopSpeaking(sessionId: string): Promise<void>;
  onSpeakingStarted(callback: () => void): void;
  onSpeakingCompleted(callback: () => void): void;
}
```

**Relationships**:
- Implements SpeechRecognitionPort
- Implements SpeechSynthesisPort
- Uses AzureSpeechConfig

---

#### ElevenLabsAdapter

```typescript
class ElevenLabsAdapter implements SpeechSynthesisPort {
  constructor(private readonly config: ElevenLabsConfig) {}

  async speak(text: string, sessionId: string): Promise<void>;
  async stopSpeaking(sessionId: string): Promise<void>;
  onSpeakingStarted(callback: () => void): void;
  onSpeakingCompleted(callback: () => void): void;
}
```

**Relationships**:
- Implements SpeechSynthesisPort
- Uses ElevenLabsConfig

---

#### SupabaseAdapter

```typescript
class SupabaseAdapter implements InterviewPersistencePort {
  constructor(private readonly config: SupabaseConfig) {}

  async saveInterviewSession(session: InterviewSession): Promise<void>;
  async loadInterviewSession(id: string): Promise<InterviewSession | null>;
  async saveQuestionExecution(execution: QuestionExecution): Promise<void>;
  async loadQuestionExecutions(sessionId: string): Promise<QuestionExecution[]>;
  async saveCandidateResponse(response: CandidateResponse): Promise<void>;
  async loadCandidateResponses(questionExecutionId: string): Promise<CandidateResponse[]>;
  async saveTimeline(timeline: InterviewTimeline): Promise<void>;
  async loadTimeline(sessionId: string): Promise<InterviewTimeline | null>;
  async saveProgress(progress: InterviewProgress): Promise<void>;
  async loadProgress(sessionId: string): Promise<InterviewProgress | null>;
}
```

**Relationships**:
- Implements InterviewPersistencePort
- Uses SupabaseConfig

---

#### LoggerAdapter

```typescript
class LoggerAdapter implements LoggingPort {
  constructor(private readonly config: LoggingConfig) {}

  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}
```

**Relationships**:
- Implements LoggingPort
- Uses LoggingConfig

---

#### TelemetryAdapter

```typescript
class TelemetryAdapter implements TelemetryPort {
  constructor(private readonly config: TelemetryConfig) {}

  trackEvent(name: string, properties?: Record<string, unknown>): void;
  trackMetric(name: string, value: number): void;
  trackException(exception: Error): void;
}
```

**Relationships**:
- Implements TelemetryPort
- Uses TelemetryConfig

---

#### AnalyticsAdapter

```typescript
class AnalyticsAdapter implements AnalyticsPort {
  constructor(private readonly config: AnalyticsConfig) {}

  trackEvent(name: string, properties?: Record<string, unknown>): void;
  trackUser(userId: string, properties?: Record<string, unknown>): void;
  flush(): Promise<void>;
}
```

**Relationships**:
- Implements AnalyticsPort
- Uses AnalyticsConfig

---

#### ClockAdapter

```typescript
class ClockAdapter implements ClockPort {
  now(): Date;
}
```

**Relationships**:
- Implements ClockPort

---

#### UUIDAdapter

```typescript
class UUIDAdapter implements UUIDPort {
  generate(): string;
}
```

**Relationships**:
- Implements UUIDPort

---

## Integration Layer Classes

### Event Handlers

#### InterviewEventHandler

```typescript
class InterviewEventHandler {
  constructor(
    private readonly runtimePort: RuntimePort,
    private readonly analyticsPort: AnalyticsPort,
    private readonly telemetryPort: TelemetryPort
  ) {}

  handle(event: InterviewStarted): void;
  handle(event: QuestionStarted): void;
  handle(event: QuestionCompleted): void;
  handle(event: CandidateSpeaking): void;
  handle(event: CandidateStoppedSpeaking): void;
  handle(event: AIStartedSpeaking): void;
  handle(event: AIStoppedSpeaking): void;
  handle(event: SilenceDetected): void;
  handle(event: InterruptionDetected): void;
  handle(event: QuestionSkipped): void;
  handle(event: InterviewPaused): void;
  handle(event: InterviewResumed): void;
  handle(event: InterviewCompleted): void;
  handle(event: InterviewCancelled): void;
  handle(event: InterviewTimeout): void;
  handle(event: ConversationError): void;
}
```

**Relationships**:
- Uses RuntimePort
- Uses AnalyticsPort
- Uses TelemetryPort
- Handles all DomainEvent subclasses

---

### Integration

#### InterviewIntegration

```typescript
class InterviewIntegration {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventHandler: InterviewEventHandler
  ) {}

  initialize(): void;
}
```

**Relationships**:
- Uses EventBus
- Uses InterviewEventHandler

---

## Bootstrap Layer Classes

### Composition Root

#### VoiceInterviewCompositionRoot

```typescript
class VoiceInterviewCompositionRoot {
  private static instance: VoiceInterviewCompositionRoot;

  private constructor() {
    this.configurePorts();
    this.configureAdapters();
    this.configureDomainServices();
    this.configureUseCases();
    this.configureRepositories();
    this.configureEventHandlers();
  }

  static getInstance(): VoiceInterviewCompositionRoot;

  private configurePorts(): void;
  private configureAdapters(): void;
  private configureDomainServices(): void;
  private configureUseCases(): void;
  private configureRepositories(): void;
  private configureEventHandlers(): void;

  getStartInterview(): StartInterview;
  getPauseInterview(): PauseInterview;
  getResumeInterview(): ResumeInterview;
  getStopInterview(): StopInterview;
  getNextQuestion(): NextQuestion;
  getSkipQuestion(): SkipQuestion;
  getReceiveTranscript(): ReceiveTranscript;
  getStartAIResponse(): StartAIResponse;
  getFinishAIResponse(): FinishAIResponse;
  getRegisterSilence(): RegisterSilence;
  getRegisterInterruption(): RegisterInterruption;
  getCompleteInterview(): CompleteInterview;
  getAbortInterview(): AbortInterview;
  getInterviewStatus(): GetInterviewStatus;
  getHandleTimeout(): HandleTimeout;
}
```

**Relationships**:
- Creates and manages all dependencies
- Returns use case instances

---

## Class Diagram Summary

### Layer Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     Bootstrap Layer                          │
│  VoiceInterviewCompositionRoot                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ creates
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  Use Cases | DTOs | Repository | Factory | EventBus         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ depends on
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  Aggregate | Entities | Value Objects | Services | Policies │
│  | Events                                                    │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ implements
                              │
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                         │
│  Adapters (implement Ports)                                  │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ implements
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  Ports (Interfaces)                                          │
└─────────────────────────────────────────────────────────────┘
```

### Key Relationships

- **Domain Layer**: Independent of all other layers
- **Application Layer**: Depends on Domain Layer, defines Ports
- **Infrastructure Layer**: Implements Ports, depends on Application Layer
- **Bootstrap Layer**: Creates and wires all dependencies
- **Integration Layer**: Handles domain events, depends on Ports

---

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
