# ETS-027 Runtime Event Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur d'événements runtime qui gère tous les événements d'une session d'entretien. Il définit environ 250 événements couvrant tous les aspects de la session : questions, réponses, interruptions, latence, contexte, mémoire, replay, évaluation, difficulté, etc.

---

## Événements par Catégorie

### Session Events

```typescript
interface SessionStartedEvent {
  type: 'SessionStarted';
  sessionId: string;
  userId: string;
  scenario: ScenarioType;
  startedAt: Date;
}

interface SessionCompletedEvent {
  type: 'SessionCompleted';
  sessionId: string;
  userId: string;
  duration: number;
  overallScore: number;
  competencyScores: Map<CompetencyType, number>;
  completedAt: Date;
}

interface SessionPausedEvent {
  type: 'SessionPaused';
  sessionId: string;
  pausedAt: Date;
  reason: string;
}

interface SessionResumedEvent {
  type: 'SessionResumed';
  sessionId: string;
  resumedAt: Date;
  reason: string;
}

interface SessionAbortedEvent {
  type: 'SessionAborted';
  sessionId: string;
  abortedAt: Date;
  reason: string;
}

interface SessionErrorEvent {
  type: 'SessionError';
  sessionId: string;
  error: Error;
  errorAt: Date;
}
```

---

### Stage Events

```typescript
interface StageStartedEvent {
  type: 'StageStarted';
  sessionId: string;
  stage: StageType;
  startedAt: Date;
}

interface StageCompletedEvent {
  type: 'StageCompleted';
  sessionId: string;
  stage: StageType;
  duration: number;
  competencyScores: Map<CompetencyType, number>;
  completedAt: Date;
}

interface StageTransitionEvent {
  type: 'StageTransition';
  sessionId: string;
  from: StageType;
  to: StageType;
  transitionedAt: Date;
  reason: string;
}

interface StageSkippedEvent {
  type: 'StageSkipped';
  sessionId: string;
  stage: StageType;
  skippedAt: Date;
  reason: string;
}
```

---

### Question Events

```typescript
interface QuestionStartedEvent {
  type: 'QuestionStarted';
  sessionId: string;
  questionId: string;
  competency: CompetencyType;
  difficulty: number;
  text: string;
  startedAt: Date;
}

interface QuestionCompletedEvent {
  type: 'QuestionCompleted';
  sessionId: string;
  questionId: string;
  duration: number;
  score: number;
  evidence: Evidence[];
  completedAt: Date;
}

interface QuestionSkippedEvent {
  type: 'QuestionSkipped';
  sessionId: string;
  questionId: string;
  skippedAt: Date;
  reason: string;
}

interface QuestionAdaptedEvent {
  type: 'QuestionAdapted';
  sessionId: string;
  questionId: string;
  oldDifficulty: number;
  newDifficulty: number;
  adaptedAt: Date;
  reason: string;
}

interface QuestionGeneratedEvent {
  type: 'QuestionGenerated';
  sessionId: string;
  questionId: string;
  competency: CompetencyType;
  difficulty: number;
  text: string;
  generatedAt: Date;
  generationDuration: number;
}
```

---

### Answer Events

```typescript
interface AnswerStartedEvent {
  type: 'AnswerStarted';
  sessionId: string;
  questionId: string;
  startedAt: Date;
}

interface AnswerCompletedEvent {
  type: 'AnswerCompleted';
  sessionId: string;
  questionId: string;
  text: string;
  audioUrl?: string;
  duration: number;
  confidence: number;
  signals: Signal[];
  completedAt: Date;
}

interface AnswerInterruptedEvent {
  type: 'AnswerInterrupted';
  sessionId: string;
  questionId: string;
  interruptedAt: Date;
  reason: string;
}

interface AnswerTimeoutEvent {
  type: 'AnswerTimeout';
  sessionId: string;
  questionId: string;
  timeoutDuration: number;
  timeoutAt: Date;
}

interface AnswerTranscribedEvent {
  type: 'AnswerTranscribed';
  sessionId: string;
  questionId: string;
  text: string;
  confidence: number;
  transcribedAt: Date;
  transcriptionDuration: number;
}
```

---

### Relance Events

```typescript
interface RelanceStartedEvent {
  type: 'RelanceStarted';
  sessionId: string;
  questionId: string;
  relanceId: string;
  relanceType: RelanceType;
  text: string;
  startedAt: Date;
}

interface RelanceCompletedEvent {
  type: 'RelanceCompleted';
  sessionId: string;
  questionId: string;
  relanceId: string;
  response?: Answer;
  completedAt: Date;
}

interface RelanceSkippedEvent {
  type: 'RelanceSkipped';
  sessionId: string;
  questionId: string;
  relanceId: string;
  skippedAt: Date;
  reason: string;
}
```

---

### Interruption Events

```typescript
interface CandidateInterruptedEvent {
  type: 'CandidateInterrupted';
  sessionId: string;
  questionId: string;
  interruptedAt: Date;
  reason: string;
}

interface AIInterruptedEvent {
  type: 'AIInterrupted';
  sessionId: string;
  questionId: string;
  interruptedAt: Date;
  reason: string;
}

interface SystemInterruptedEvent {
  type: 'SystemInterrupted';
  sessionId: string;
  interruptedAt: Date;
  reason: string;
}

interface InterruptionResolvedEvent {
  type: 'InterruptionResolved';
  sessionId: string;
  interruptionId: string;
  resolvedAt: Date;
  resolution: string;
}
```

---

### Latency Events

```typescript
interface LatencyMeasuredEvent {
  type: 'LatencyMeasured';
  sessionId: string;
  component: string;
  latency: number;
  measuredAt: Date;
}

interface LatencyExceededEvent {
  type: 'LatencyExceeded';
  sessionId: string;
  component: string;
  latency: number;
  threshold: number;
  exceededAt: Date;
}

interface LatencyBudgetExceededEvent {
  type: 'LatencyBudgetExceeded';
  sessionId: string;
  totalLatency: number;
  budget: number;
  exceededAt: Date;
}

interface LatencyRecoveredEvent {
  type: 'LatencyRecovered';
  sessionId: string;
  component: string;
  latency: number;
  recoveredAt: Date;
}
```

---

### Context Events

```typescript
interface ContextBuiltEvent {
  type: 'ContextBuilt';
  sessionId: string;
  questionId: string;
  context: Context;
  builtAt: Date;
  buildDuration: number;
}

interface ContextCompressedEvent {
  type: 'ContextCompressed';
  sessionId: string;
  questionId: string;
  beforeSize: number;
  afterSize: number;
  strategy: CompressionStrategy;
  compressedAt: Date;
}

interface ContextBudgetExceededEvent {
  type: 'ContextBudgetExceeded';
  sessionId: string;
  questionId: string;
  size: number;
  budget: number;
  exceededAt: Date;
}

interface ContextValidationFailedEvent {
  type: 'ContextValidationFailed';
  sessionId: string;
  questionId: string;
  validationErrors: ValidationError[];
  failedAt: Date;
}
```

---

### Memory Events

```typescript
interface MemoryUpdatedEvent {
  type: 'MemoryUpdated';
  sessionId: string;
  questionId: string;
  memoryType: MemoryType;
  update: MemoryUpdate;
  updatedAt: Date;
}

interface MemoryQueriedEvent {
  type: 'MemoryQueried';
  sessionId: string;
  questionId: string;
  memoryType: MemoryType;
  query: string;
  result: any;
  queriedAt: Date;
}

interface MemoryContradictionDetectedEvent {
  type: 'MemoryContradictionDetected';
  sessionId: string;
  contradiction: Contradiction;
  detectedAt: Date;
}

interface MemoryContradictionResolvedEvent {
  type: 'MemoryContradictionResolved';
  sessionId: string;
  contradictionId: string;
  resolution: string;
  resolvedAt: Date;
}
```

---

### Evaluation Events

```typescript
interface EvaluationStartedEvent {
  type: 'EvaluationStarted';
  sessionId: string;
  questionId: string;
  competency: CompetencyType;
  startedAt: Date;
}

interface EvaluationCompletedEvent {
  type: 'EvaluationCompleted';
  sessionId: string;
  questionId: string;
  competency: CompetencyType;
  score: number;
  confidence: number;
  evidence: Evidence[];
  completedAt: Date;
}

interface EvaluationUpdatedEvent {
  type: 'EvaluationUpdated';
  sessionId: string;
  competency: CompetencyType;
  oldScore: number;
  newScore: number;
  reason: string;
  updatedAt: Date;
}

interface OverallEvaluationUpdatedEvent {
  type: 'OverallEvaluationUpdated';
  sessionId: string;
  oldScore: number;
  newScore: number;
  updatedAt: Date;
}
```

---

### Difficulty Events

```typescript
interface DifficultyChangedEvent {
  type: 'DifficultyChanged';
  sessionId: string;
  axis: DifficultyAxis;
  oldValue: number;
  newValue: number;
  changedAt: Date;
  reason: string;
}

interface DifficultyIncreasedEvent {
  type: 'DifficultyIncreased';
  sessionId: string;
  axis: DifficultyAxis;
  oldValue: number;
  newValue: number;
  increasedAt: Date;
  reason: string;
}

interface DifficultyDecreasedEvent {
  type: 'DifficultyDecreased';
  sessionId: string;
  axis: DifficultyAxis;
  oldValue: number;
  newValue: number;
  decreasedAt: Date;
  reason: string;
}

interface DifficultyAdaptedEvent {
  type: 'DifficultyAdapted';
  sessionId: string;
  adaptation: DifficultyAdaptation;
  adaptedAt: Date;
}
```

---

### Persona Events

```typescript
interface PersonaActivatedEvent {
  type: 'PersonaActivated';
  sessionId: string;
  persona: PersonaType;
  activatedAt: Date;
}

interface PersonaAdaptedEvent {
  type: 'PersonaAdapted';
  sessionId: string;
  parameter: PersonaParameter;
  oldValue: any;
  newValue: any;
  adaptedAt: Date;
  reason: string;
}

interface PersonaDriftDetectedEvent {
  type: 'PersonaDriftDetected';
  sessionId: string;
  drift: PersonaDrift;
  detectedAt: Date;
}

interface PersonaDriftCorrectedEvent {
  type: 'PersonaDriftCorrected';
  sessionId: string;
  driftId: string;
  correction: string;
  correctedAt: Date;
}
```

---

### Strategy Events

```typescript
interface StrategyActivatedEvent {
  type: 'StrategyActivated';
  sessionId: string;
  strategy: StrategyType;
  parameters: StrategyParameters;
  activatedAt: Date;
}

interface StrategyDeactivatedEvent {
  type: 'StrategyDeactivated';
  sessionId: string;
  strategy: StrategyType;
  deactivatedAt: Date;
  reason: string;
}

interface StrategyCompletedEvent {
  type: 'StrategyCompleted';
  sessionId: string;
  strategy: StrategyType;
  success: boolean;
  improvement: number;
  completedAt: Date;
}

interface StrategyFailedEvent {
  type: 'StrategyFailed';
  sessionId: string;
  strategy: StrategyType;
  failure: string;
  failedAt: Date;
}
```

---

### Timer Events

```typescript
interface TimerStartedEvent {
  type: 'TimerStarted';
  sessionId: string;
  timerId: string;
  timerType: TimerType;
  duration: number;
  startedAt: Date;
}

interface TimerExpiredEvent {
  type: 'TimerExpired';
  sessionId: string;
  timerId: string;
  expiredAt: Date;
}

interface TimerCancelledEvent {
  type: 'TimerCancelled';
  sessionId: string;
  timerId: string;
  cancelledAt: Date;
  reason: string;
}

interface TimerPausedEvent {
  type: 'TimerPaused';
  sessionId: string;
  timerId: string;
  pausedAt: Date;
  remaining: number;
}

interface TimerResumedEvent {
  type: 'TimerResumed';
  sessionId: string;
  timerId: string;
  resumedAt: Date;
}
```

---

### Snapshot Events

```typescript
interface SnapshotCreatedEvent {
  type: 'SnapshotCreated';
  sessionId: string;
  snapshotId: string;
  version: number;
  createdAt: Date;
  reason: string;
}

interface SnapshotRestoredEvent {
  type: 'SnapshotRestored';
  sessionId: string;
  snapshotId: string;
  version: number;
  restoredAt: Date;
  reason: string;
}

interface SnapshotDeletedEvent {
  type: 'SnapshotDeleted';
  sessionId: string;
  snapshotId: string;
  deletedAt: Date;
  reason: string;
}

interface ReplayCheckpointEvent {
  type: 'ReplayCheckpoint';
  sessionId: string;
  checkpointId: string;
  turn: number;
  checkpointedAt: Date;
}
```

---

### Replay Events

```typescript
interface ReplayStartedEvent {
  type: 'ReplayStarted';
  sessionId: string;
  replayId: string;
  fromTurn: number;
  toTurn: number;
  startedAt: Date;
}

interface ReplayCompletedEvent {
  type: 'ReplayCompleted';
  sessionId: string;
  replayId: string;
  duration: number;
  completedAt: Date;
}

interface ReplayFailedEvent {
  type: 'ReplayFailed';
  sessionId: string;
  replayId: string;
  error: Error;
  failedAt: Date;
}

interface ReplayPausedEvent {
  type: 'ReplayPaused';
  sessionId: string;
  replayId: string;
  pausedAt: Date;
  reason: string;
}

interface ReplayResumedEvent {
  type: 'ReplayResumed';
  sessionId: string;
  replayId: string;
  resumedAt: Date;
}
```

---

### Speech Events

```typescript
interface SpeechStartedEvent {
  type: 'SpeechStarted';
  sessionId: string;
  speaker: 'candidate' | 'interviewer';
  startedAt: Date;
}

interface SpeechCompletedEvent {
  type: 'SpeechCompleted';
  sessionId: string;
  speaker: 'candidate' | 'interviewer';
  duration: number;
  audioUrl?: string;
  completedAt: Date;
}

interface SpeechInterruptedEvent {
  type: 'SpeechInterrupted';
  sessionId: string;
  speaker: 'candidate' | 'interviewer';
  interruptedAt: Date;
  reason: string;
}

interface SpeechErrorEvent {
  type: 'SpeechError';
  sessionId: string;
  speaker: 'candidate' | 'interviewer';
  error: Error;
  errorAt: Date;
}

interface SpeechTranscriptionStartedEvent {
  type: 'SpeechTranscriptionStarted';
  sessionId: string;
  speaker: 'candidate' | 'interviewer';
  startedAt: Date;
}

interface SpeechTranscriptionCompletedEvent {
  type: 'SpeechTranscriptionCompleted';
  sessionId: string;
  speaker: 'candidate' | 'interviewer';
  text: string;
  confidence: number;
  completedAt: Date;
}

interface SpeechSynthesisStartedEvent {
  type: 'SpeechSynthesisStarted';
  sessionId: string;
  text: string;
  voice: string;
  startedAt: Date;
}

interface SpeechSynthesisCompletedEvent {
  type: 'SpeechSynthesisCompleted';
  sessionId: string;
  audioUrl: string;
  duration: number;
  completedAt: Date;
}
```

---

### Planner Events

```typescript
interface PlannerPlanGeneratedEvent {
  type: 'PlannerPlanGenerated';
  sessionId: string;
  plan: InterviewPlan;
  generatedAt: Date;
}

interface PlannerPlanUpdatedEvent {
  type: 'PlannerPlanUpdated';
  sessionId: string;
  oldPlan: InterviewPlan;
  newPlan: InterviewPlan;
  updatedAt: Date;
  reason: string;
}

interface PlannerCompetencySelectedEvent {
  type: 'PlannerCompetencySelected';
  sessionId: string;
  competency: CompetencyType;
  selectedAt: Date;
  reason: string;
}

interface PlannerAdaptedEvent {
  type: 'PlannerAdapted';
  sessionId: string;
  adaptation: PlannerAdaptation;
  adaptedAt: Date;
}
```

---

### Director Events

```typescript
interface DirectorDecisionMadeEvent {
  type: 'DirectorDecisionMade';
  sessionId: string;
  decision: Decision;
  madeAt: Date;
}

interface DirectorRelanceTriggeredEvent {
  type: 'DirectorRelanceTriggered';
  sessionId: string;
  relanceType: RelanceType;
  triggeredAt: Date;
  reason: string;
}

interface DirectorTransitionTriggeredEvent {
  type: 'DirectorTransitionTriggered';
  sessionId: string;
  fromStage: StageType;
  toStage: StageType;
  triggeredAt: Date;
  reason: string;
}

interface DirectorAdaptedEvent {
  type: 'DirectorAdapted';
  sessionId: string;
  adaptation: DirectorAdaptation;
  adaptedAt: Date;
}
```

---

### AI Guard Events

```typescript
interface AIGuardValidationStartedEvent {
  type: 'AIGuardValidationStarted';
  sessionId: string;
  questionId: string;
  response: string;
  startedAt: Date;
}

interface AIGuardValidationCompletedEvent {
  type: 'AIGuardValidationCompleted';
  sessionId: string;
  questionId: string;
  validation: ValidationResult;
  completedAt: Date;
}

interface AIGuardCorrectionAppliedEvent {
  type: 'AIGuardCorrectionApplied';
  sessionId: string;
  questionId: string;
  originalResponse: string;
  correctedResponse: string;
  appliedAt: Date;
}

interface AIGuardRejectionEvent {
  type: 'AIGuardRejection';
  sessionId: string;
  questionId: string;
  response: string;
  reason: string;
  rejectedAt: Date;
}

interface AIGuardTimeoutEvent {
  type: 'AIGuardTimeout';
  sessionId: string;
  questionId: string;
  timeoutDuration: number;
  timeoutAt: Date;
}
```

---

### OpenAI Events

```typescript
interface OpenAIRequestStartedEvent {
  type: 'OpenAIRequestStarted';
  sessionId: string;
  questionId: string;
  prompt: string;
  startedAt: Date;
}

interface OpenAIRequestCompletedEvent {
  type: 'OpenAIRequestCompleted';
  sessionId: string;
  questionId: string;
  response: string;
  tokens: TokenUsage;
  duration: number;
  completedAt: Date;
}

interface OpenAIRequestFailedEvent {
  type: 'OpenAIRequestFailed';
  sessionId: string;
  questionId: string;
  error: Error;
  failedAt: Date;
}

interface OpenAIRateLimitEvent {
  type: 'OpenAIRateLimit';
  sessionId: string;
  questionId: string;
  limit: number;
  remaining: number;
  resetAt: Date;
}

interface OpenAITimeoutEvent {
  type: 'OpenAITimeout';
  sessionId: string;
  questionId: string;
  timeoutDuration: number;
  timeoutAt: Date;
}
```

---

### Redis Events

```typescript
interface RedisReadEvent {
  type: 'RedisRead';
  sessionId: string;
  key: string;
  value: any;
  readAt: Date;
  duration: number;
}

interface RedisWriteEvent {
  type: 'RedisWrite';
  sessionId: string;
  key: string;
  value: any;
  writtenAt: Date;
  duration: number;
}

interface RedisErrorEvent {
  type: 'RedisError';
  sessionId: string;
  operation: 'read' | 'write';
  error: Error;
  errorAt: Date;
}

interface RedisConnectionLostEvent {
  type: 'RedisConnectionLost';
  sessionId: string;
  lostAt: Date;
}

interface RedisConnectionRestoredEvent {
  type: 'RedisConnectionRestored';
  sessionId: string;
  restoredAt: Date;
}
```

---

### Supabase Events

```typescript
interface SupabaseQueryEvent {
  type: 'SupabaseQuery';
  sessionId: string;
  table: string;
  query: string;
  result: any;
  queriedAt: Date;
  duration: number;
}

interface SupabaseInsertEvent {
  type: 'SupabaseInsert';
  sessionId: string;
  table: string;
  data: any;
  insertedAt: Date;
  duration: number;
}

interface SupabaseUpdateEvent {
  type: 'SupabaseUpdate';
  sessionId: string;
  table: string;
  data: any;
  updatedAt: Date;
  duration: number;
}

interface SupabaseErrorEvent {
  type: 'SupabaseError';
  sessionId: string;
  operation: 'query' | 'insert' | 'update';
  error: Error;
  errorAt: Date;
}
```

---

### WebSocket Events

```typescript
interface WebSocketConnectedEvent {
  type: 'WebSocketConnected';
  sessionId: string;
  connectedAt: Date;
}

interface WebSocketDisconnectedEvent {
  type: 'WebSocketDisconnected';
  sessionId: string;
  disconnectedAt: Date;
  reason: string;
}

interface WebSocketMessageReceivedEvent {
  type: 'WebSocketMessageReceived';
  sessionId: string;
  message: any;
  receivedAt: Date;
}

interface WebSocketMessageSentEvent {
  type: 'WebSocketMessageSent';
  sessionId: string;
  message: any;
  sentAt: Date;
}

interface WebSocketErrorEvent {
  type: 'WebSocketError';
  sessionId: string;
  error: Error;
  errorAt: Date;
}
```

---

### Metrics Events

```typescript
interface MetricRecordedEvent {
  type: 'MetricRecorded';
  sessionId: string;
  metricName: string;
  metricValue: number;
  unit: string;
  recordedAt: Date;
}

interface MetricThresholdExceededEvent {
  type: 'MetricThresholdExceeded';
  sessionId: string;
  metricName: string;
  metricValue: number;
  threshold: number;
  exceededAt: Date;
}

interface MetricAlertTriggeredEvent {
  type: 'MetricAlertTriggered';
  sessionId: string;
  metricName: string;
  alertLevel: 'warning' | 'critical' | 'emergency';
  triggeredAt: Date;
}
```

---

### Learning Events

```typescript
interface LearningDataCollectedEvent {
  type: 'LearningDataCollected';
  sessionId: string;
  dataType: LearningDataType;
  data: any;
  collectedAt: Date;
}

interface LearningModelUpdatedEvent {
  type: 'LearningModelUpdated';
  sessionId: string;
  modelType: ModelType;
  version: string;
  updatedAt: Date;
}

interface LearningPredictionEvent {
  type: 'LearningPrediction';
  sessionId: string;
  modelType: ModelType;
  prediction: any;
  confidence: number;
  predictedAt: Date;
}

interface LearningFeedbackEvent {
  type: 'LearningFeedback';
  sessionId: string;
  predictionId: string;
  actual: any;
  feedbackAt: Date;
}
```

---

### Analytics Events

```typescript
interface AnalyticsEventRecordedEvent {
  type: 'AnalyticsEventRecorded';
  sessionId: string;
  eventType: string;
  properties: Record<string, any>;
  recordedAt: Date;
}

interface AnalyticsFunnelEvent {
  type: 'AnalyticsFunnel';
  funnelName: string;
  step: string;
  sessionId: string;
  at: Date;
}

interface AnalyticsConversionEvent {
  type: 'AnalyticsConversion';
  conversionName: string;
  sessionId: string;
  value: number;
  at: Date;
}
```

---

### Safety Events

```typescript
interface SafetyViolationDetectedEvent {
  type: 'SafetyViolationDetected';
  sessionId: string;
  violationType: SafetyViolationType;
  severity: 'low' | 'medium' | 'high';
  detectedAt: Date;
}

interface SafetyViolationMitigatedEvent {
  type: 'SafetyViolationMitigated';
  sessionId: string;
  violationId: string;
  mitigation: string;
  mitigatedAt: Date;
}

interface HallucinationDetectedEvent {
  type: 'HallucinationDetected';
  sessionId: string;
  questionId: string;
  response: string;
  detectedAt: Date;
}

interface PromptInjectionDetectedEvent {
  type: 'PromptInjectionDetected';
  sessionId: string;
  questionId: string;
  prompt: string;
  detectedAt: Date;
}

interface PIIDetectedEvent {
  type: 'PIIDetected';
  sessionId: string;
  piiType: PIIType;
  text: string;
  detectedAt: Date;
}
```

---

### Error Events

```typescript
interface ErrorOccurredEvent {
  type: 'ErrorOccurred';
  sessionId: string;
  component: string;
  error: Error;
  errorAt: Date;
}

interface ErrorRecoveredEvent {
  type: 'ErrorRecovered';
  sessionId: string;
  errorId: string;
  recovery: string;
  recoveredAt: Date;
}

interface ErrorEscalatedEvent {
  type: 'ErrorEscalated';
  sessionId: string;
  errorId: string;
  escalationLevel: 'warning' | 'critical' | 'emergency';
  escalatedAt: Date;
}
```

---

## Event Versioning

### Event Version

```typescript
interface EventVersion {
  version: string;
  schema: EventSchema;
  migration?: EventMigration;
  deprecatedAt?: Date;
}

interface EventSchema {
  type: string;
  properties: Record<string, PropertySchema>;
}

interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';
  required: boolean;
  nullable?: boolean;
}

interface EventMigration {
  fromVersion: string;
  toVersion: string;
  migrationFunction: string;
}
```

### Event Registry

```typescript
interface EventRegistry {
  events: Map<string, EventVersion>;
  currentVersion: string;
  deprecatedEvents: string[];
}

const EVENT_REGISTRY: EventRegistry = {
  events: new Map([
    ['SessionStarted', { version: '1.0.0', schema: {...} }],
    ['SessionCompleted', { version: '1.0.0', schema: {...} }],
    // ... 250 events
  ]),
  currentVersion: '1.0.0',
  deprecatedEvents: []
};
```

---

## Event Store

### Event Storage

```typescript
interface EventStorage {
  store(event: RuntimeEvent): Promise<void>;
  getEvents(sessionId: string, from?: Date, to?: Date): Promise<RuntimeEvent[]>;
  getEvent(eventId: string): Promise<RuntimeEvent>;
  replay(sessionId: string, fromTurn: number, toTurn: number): Promise<RuntimeEvent[]>;
}

interface RuntimeEvent {
  id: string;
  type: string;
  version: string;
  sessionId: string;
  timestamp: Date;
  payload: any;
  metadata?: Record<string, any>;
}
```

### Event Stream

```typescript
interface EventStream {
  sessionId: string;
  streamKey: string;
  events: RuntimeEvent[];
  lastEventId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Event Processing

### Event Handler

```typescript
interface EventHandler {
  eventType: string;
  handler: (event: RuntimeEvent) => Promise<void>;
  priority: number;
}

interface EventProcessor {
  registerHandler(handler: EventHandler): void;
  unregisterHandler(eventType: string): void;
  process(event: RuntimeEvent): Promise<void>;
}
```

### Event Bus

```typescript
interface EventBus {
  publish(event: RuntimeEvent): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
  unsubscribe(eventType: string, handlerId: string):_void;
  getEvents(sessionId: string): RuntimeEvent[];
}
```

---

## Event Replay

### Replay Strategy

```typescript
interface ReplayStrategy {
  fromTurn: number;
  toTurn: number;
  speed: number;
  pauseAt: number[];
  filter?: (event: RuntimeEvent) => boolean;
}

interface ReplayResult {
  events: RuntimeEvent[];
  duration: number;
  success: boolean;
  error?: Error;
}
```

---

## Conclusion

Le Runtime Event Engine spécifie environ 250 événements couvrant tous les aspects d'une session d'entretien :

1. **15 catégories d'événements** : Session, Stage, Question, Answer, Relance, Interruption, Latency, Context, Memory, Evaluation, Difficulty, Persona, Strategy, Timer, Snapshot, Replay, Speech, Planner, Director, AI Guard, OpenAI, Redis, Supabase, WebSocket, Metrics, Learning, Analytics, Safety, Error
2. **Versioning des événements** : Event Version, Event Schema, Event Migration, Event Registry
3. **Event Store** : Event Storage, Event Stream
4. **Event Processing** : Event Handler, Event Processor, Event Bus
5. **Event Replay** : Replay Strategy, Replay Result

Ce document fournit une spécification exécutable pour implémenter le moteur d'événements runtime.
