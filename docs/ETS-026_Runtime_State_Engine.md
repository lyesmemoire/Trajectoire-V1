# ETS-026 Runtime State Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur d'état runtime qui gère l'état complet d'une session d'entretien. Il définit toutes les transitions, tous les timers, tous les timeouts et tous les snapshots nécessaires pour exécuter une session de manière déterministe et reproductible.

---

## État Runtime Complet

### InterviewRuntimeState

```typescript
interface InterviewRuntimeState {
  // Session
  session: SessionState;
  
  // Planner
  planner: PlannerState;
  
  // Director
  director: DirectorState;
  
  // Evaluation
  evaluation: EvaluationState;
  
  // Memory
  memory: MemoryState;
  
  // Speech
  speech: SpeechState;
  
  // Persona
  persona: PersonaState;
  
  // Difficulty
  difficulty: DifficultyState;
  
  // Latency
  latency: LatencyState;
  
  // Timers
  timers: TimersState;
  
  // Interruptions
  interruptions: InterruptionsState;
  
  // Goals
  goals: GoalsState;
  
  // Strategies
  strategies: StrategiesState;
  
  // Metrics
  metrics: MetricsState;
}
```

---

## Session State

```typescript
interface SessionState {
  sessionId: string;
  userId: string;
  scenario: ScenarioType;
  startedAt: Date;
  endedAt?: Date;
  status: SessionStatus;
  currentStage: StageType;
  stageHistory: StageTransition[];
  turnCount: number;
  maxTurns: number;
  totalDuration: number;
  snapshotVersion: number;
  lastSnapshotAt?: Date;
}

type SessionStatus = 
  | 'initializing'
  | 'active'
  | 'paused'
  | 'completed'
  | 'aborted'
  | 'error';

type StageType = 
  | 'introduction'
  | 'technical'
  | 'behavioral'
  | 'system_design'
  | 'architecture'
  | 'live_coding'
  | 'incident'
  | 'evaluation'
  | 'closing';

interface StageTransition {
  from: StageType;
  to: StageType;
  at: Date;
  reason: string;
}
```

---

## Planner State

```typescript
interface PlannerState {
  currentPlan: InterviewPlan;
  planHistory: InterviewPlan[];
  planVersion: number;
  lastPlanUpdate: Date;
  nextCompetency: CompetencyType;
  pendingCompetencies: CompetencyType[];
  completedCompetencies: CompetencyType[];
  adaptationCount: number;
}

interface InterviewPlan {
  id: string;
  version: number;
  stages: PlannedStage[];
  estimatedDuration: number;
  actualDuration?: number;
  createdAt: Date;
}

interface PlannedStage {
  stage: StageType;
  competencies: CompetencyType[];
  questions: PlannedQuestion[];
  estimatedDuration: number;
  actualDuration?: number;
}

interface PlannedQuestion {
  id: string;
  competency: CompetencyType;
  difficulty: number;
  expectedDuration: number;
  actualDuration?: number;
  status: QuestionStatus;
}

type QuestionStatus = 
  | 'pending'
  | 'active'
  | 'completed'
  | 'skipped';
```

---

## Director State

```typescript
interface DirectorState {
  currentDecision: Decision;
  decisionHistory: Decision[];
  decisionVersion: number;
  lastDecisionAt: Date;
  activeStrategies: StrategyType[];
  strategyHistory: StrategyTransition[];
  adaptationCount: number;
}

interface Decision {
  id: string;
  type: DecisionType;
  action: ActionType;
  competency?: CompetencyType;
  stage?: StageType;
  reason: string;
  confidence: number;
  at: Date;
}

type DecisionType = 
  | 'continue'
  | 'relance'
  | 'transition'
  | 'adapt'
  | 'complete';

type ActionType = 
  | 'clarification'
  | 'evidence'
  | 'challenge'
  | 'ownership'
  | 'metrics'
  | 'tradeoffs'
  | 'failure'
  | 'next_question'
  | 'next_stage'
  | 'end';

interface StrategyTransition {
  strategy: StrategyType;
  action: 'activate' | 'deactivate';
  at: Date;
  reason: string;
}
```

---

## Evaluation State

```typescript
interface EvaluationState {
  competencyScores: Map<CompetencyType, CompetencyScore>;
  overallScore: number;
  evaluationHistory: EvaluationSnapshot[];
  lastEvaluationAt: Date;
  evaluationVersion: number;
}

interface CompetencyScore {
  competency: CompetencyType;
  score: number;
  confidence: number;
  evidence: Evidence[];
  lastUpdated: Date;
  history: ScoreHistory[];
}

interface Evidence {
  id: string;
  type: EvidenceType;
  description: string;
  strength: number;
  at: Date;
  turnId: string;
}

type EvidenceType = 
  | 'quantitative'
  | 'qualitative'
  | 'direct'
  | 'indirect';

interface ScoreHistory {
  score: number;
  at: Date;
  reason: string;
}

interface EvaluationSnapshot {
  overallScore: number;
  competencyScores: Map<CompetencyType, number>;
  at: Date;
  reason: string;
}
```

---

## Memory State

```typescript
interface MemoryState {
  candidateMemory: CandidateMemory;
  conversationMemory: ConversationMemory;
  contextMemory: ContextMemory;
  lastUpdated: Date;
  memoryVersion: number;
}

interface CandidateMemory {
  profile: CandidateProfile;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  achievements: Achievement[];
  contradictions: Contradiction[];
}

interface CandidateProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface Skill {
  name: string;
  category: SkillCategory;
  level: number;
  lastMentioned: Date;
  evidence: Evidence[];
}

interface Experience {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  responsibilities: string[];
  achievements: Achievement[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  startDate: Date;
  endDate?: Date;
  achievements: Achievement[];
}

interface Achievement {
  description: string;
  metrics?: Metric[];
  at: Date;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
}

interface Contradiction {
  description: string;
  sourceA: string;
  sourceB: string;
  detectedAt: Date;
  resolved?: boolean;
}

interface ConversationMemory {
  turns: Turn[];
  topics: Topic[];
  patterns: Pattern[];
}

interface Turn {
  id: string;
  number: number;
  question: Question;
  answer: Answer;
  relances?: Relance[];
  evaluation?: TurnEvaluation;
  startedAt: Date;
  completedAt: Date;
  duration: number;
}

interface Question {
  id: string;
  text: string;
  competency: CompetencyType;
  difficulty: number;
  goal: string;
  expectedSignals: string[];
}

interface Answer {
  id: string;
  text: string;
  audioUrl?: string;
  duration: number;
  confidence: number;
  signals: Signal[];
}

interface Signal {
  type: SignalType;
  description: string;
  strength: number;
  at: number;
}

type SignalType = 
  | 'evidence'
  | 'vague'
  | 'evasive'
  | 'confident'
  | 'stressed'
  | 'ownership'
  | 'metrics'
  | 'tradeoffs';

interface Relance {
  id: string;
  type: RelanceType;
  text: string;
  at: Date;
  response?: Answer;
}

type RelanceType = 
  | 'clarification'
  | 'evidence'
  | 'challenge'
  | 'ownership'
  | 'metrics'
  | 'tradeoffs';

interface TurnEvaluation {
  competency: CompetencyType;
  score: number;
  evidence: Evidence[];
  reason: string;
}

interface Topic {
  id: string;
  name: string;
  mentions: TopicMention[];
  firstMentionedAt: Date;
  lastMentionedAt: Date;
}

interface TopicMention {
  turnId: string;
  at: Date;
  context: string;
}

interface Pattern {
  type: PatternType;
  description: string;
  occurrences: PatternOccurrence[];
  firstDetectedAt: Date;
  lastDetectedAt: Date;
}

type PatternType = 
  | 'avoidance'
  | 'overconfidence'
  | 'underconfidence'
  | 'repetition'
  | 'contradiction'
  | 'bullshit';

interface PatternOccurrence {
  turnId: string;
  at: Date;
  context: string;
}

interface ContextMemory {
  currentContext: Context;
  contextHistory: ContextSnapshot[];
  compressionHistory: CompressionEvent[];
}

interface Context {
  systemPrompt: string;
  persona: string;
  memory: string;
  evaluation: string;
  planner: string;
  ats: string;
  careerDNA: string;
  conversation: string;
  user: string;
  totalTokens: number;
}

interface ContextSnapshot {
  context: Context;
  at: Date;
  reason: string;
}

interface CompressionEvent {
  before: Context;
  after: Context;
  strategy: CompressionStrategy;
  at: Date;
}
```

---

## Speech State

```typescript
interface SpeechState {
  audio: AudioState;
  transcription: TranscriptionState;
  synthesis: SynthesisState;
}

interface AudioState {
  status: AudioStatus;
  inputStream?: MediaStream;
  outputStream?: MediaStream;
  sampleRate: number;
  channels: number;
  bufferSize: number;
  latency: number;
  jitter: number;
  packetLoss: number;
}

type AudioStatus = 
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

interface TranscriptionState {
  status: TranscriptionStatus;
  currentText: string;
  confidence: number;
  language: string;
  lastUpdated: Date;
  segments: TranscriptionSegment[];
}

type TranscriptionStatus = 
  | 'idle'
  | 'transcribing'
  | 'completed'
  | 'error';

interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker: 'candidate' | 'interviewer';
}

interface SynthesisState {
  status: SynthesisStatus;
  currentText: string;
  audioUrl?: string;
  voice: string;
  speed: number;
  pitch: number;
  lastUpdated: Date;
}

type SynthesisStatus = 
  | 'idle'
  | 'synthesizing'
  | 'completed'
  | 'error';
```

---

## Persona State

```typescript
interface PersonaState {
  persona: PersonaType;
  parameters: PersonaParameters;
  adaptation: PersonaAdaptation;
  drift: PersonaDrift;
}

type PersonaType = 
  | 'google'
  | 'amazon'
  | 'meta'
  | 'microsoft'
  | 'startup'
  | 'cto'
  | 'lead'
  | 'hr'
  | 'engineering_manager';

interface PersonaParameters {
  questioningStyle: QuestioningStyle;
  silenceDuration: number;
  tolerancePrecision: number;
  challengeLevel: number;
  interruptionLevel: number;
  tone: Tone;
}

type QuestioningStyle = 
  | 'open'
  | 'specific'
  | 'hypothetical'
  | 'behavioral';

type Tone = 
  | 'curious'
  | 'direct'
  | 'empathetic'
  | 'strategic'
  | 'pragmatic'
  | 'energetic';

interface PersonaAdaptation {
  adaptations: Adaptation[];
  lastAdaptationAt: Date;
  adaptationCount: number;
}

interface Adaptation {
  parameter: keyof PersonaParameters;
  oldValue: any;
  newValue: any;
  reason: string;
  at: Date;
}

interface PersonaDrift {
  detectedDrifts: DriftDetection[];
  lastDriftCheckAt: Date;
  driftScore: number;
}

interface DriftDetection {
  type: DriftType;
  description: string;
  severity: number;
  detectedAt: Date;
}

type DriftType = 
  | 'tone'
  | 'style'
  | 'tolerance'
  | 'challenge';
```

---

## Difficulty State

```typescript
interface DifficultyState {
  overall: number;
  axes: DifficultyAxes;
  adaptationHistory: DifficultyAdaptation[];
  lastAdaptationAt: Date;
}

interface DifficultyAxes {
  questionComplexity: number;
  ambiguity: number;
  interruptions: number;
  timePressure: number;
  challenge: number;
  hints: number;
  silence: number;
}

interface DifficultyAdaptation {
  axis: keyof DifficultyAxes;
  oldValue: number;
  newValue: number;
  reason: string;
  at: Date;
}
```

---

## Latency State

```typescript
interface LatencyState {
  current: number;
  history: LatencySample[];
  p50: number;
  p95: number;
  p99: number;
  budget: LatencyBudget;
  exceededCount: number;
  lastExceededAt?: Date;
}

interface LatencySample {
  value: number;
  at: Date;
  component: string;
}

interface LatencyBudget {
  total: number;
  gateway: number;
  redis: number;
  sessionManager: number;
  planner: number;
  director: number;
  contextBuilder: number;
  promptOrchestrator: number;
  aiGuard: number;
  openai: number;
  voiceReturn: number;
}
```

---

## Timers State

```typescript
interface TimersState {
  activeTimers: Map<string, Timer>;
  timerHistory: TimerEvent[];
}

interface Timer {
  id: string;
  type: TimerType;
  startedAt: Date;
  duration: number;
  remaining: number;
  status: TimerStatus;
  callback: string;
  metadata?: Record<string, any>;
}

type TimerType = 
  | 'silence'
  | 'response'
  | 'turn'
  | 'stage'
  | 'session'
  | 'latency'
  | 'snapshot';

type TimerStatus = 
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'expired';

interface TimerEvent {
  timerId: string;
  type: TimerEventType;
  at: Date;
  metadata?: Record<string, any>;
}

type TimerEventType = 
  | 'started'
  | 'paused'
  | 'resumed'
  | 'completed'
  | 'cancelled'
  | 'expired';
```

---

## Interruptions State

```typescript
interface InterruptionsState {
  activeInterruptions: Map<string, Interruption>;
  interruptionHistory: InterruptionEvent[];
  interruptionCount: number;
  lastInterruptionAt?: Date;
}

interface Interruption {
  id: string;
  type: InterruptionType;
  source: InterruptionSource;
  target: InterruptionTarget;
  startedAt: Date;
  duration?: number;
  status: InterruptionStatus;
  reason: string;
}

type InterruptionType = 
  | 'candidate'
  | 'ai'
  | 'system'
  | 'timeout';

type InterruptionSource = 
  | 'candidate'
  | 'interviewer'
  | 'system';

type InterruptionTarget = 
  | 'candidate'
  | 'interviewer';

type InterruptionStatus = 
  | 'active'
  | 'completed'
  | 'cancelled';

interface InterruptionEvent {
  interruptionId: string;
  type: InterruptionEventType;
  at: Date;
  metadata?: Record<string, any>;
}

type InterruptionEventType = 
  | 'started'
  | 'completed'
  | 'cancelled';
```

---

## Goals State

```typescript
interface GoalsState {
  currentGoal: Goal;
  nextGoal?: Goal;
  goalHistory: GoalTransition[];
  pendingTopics: Topic[];
  completedTopics: Topic[];
}

interface Goal {
  id: string;
  competency: CompetencyType;
  description: string;
  expectedSignals: string[];
  exitConditions: string[];
  failureConditions: string[];
  startedAt: Date;
  completedAt?: Date;
  status: GoalStatus;
}

type GoalStatus = 
  | 'active'
  | 'completed'
  | 'failed'
  | 'abandoned';

interface GoalTransition {
  from: Goal;
  to: Goal;
  at: Date;
  reason: string;
}
```

---

## Strategies State

```typescript
interface StrategiesState {
  activeStrategies: Map<StrategyType, Strategy>;
  strategyHistory: StrategyTransition[];
  strategyPerformance: Map<StrategyType, StrategyPerformance>;
}

interface Strategy {
  id: string;
  type: StrategyType;
  parameters: StrategyParameters;
  activatedAt: Date;
  deactivatedAt?: Date;
  status: StrategyStatus;
}

type StrategyType = 
  | 'clarification'
  | 'evidence'
  | 'challenge'
  | 'ownership'
  | 'metrics'
  | 'tradeoffs'
  | 'failure'
  | 'leadership'
  | 'architecture'
  | 'debugging'
  | 'product'
  | 'behavior';

interface StrategyParameters {
  intensity: number;
  persistence: number;
  adaptability: number;
}

type StrategyStatus = 
  | 'active'
  | 'completed'
  | 'abandoned';

interface StrategyPerformance {
  strategy: StrategyType;
  successCount: number;
  failureCount: number;
  averageImprovement: number;
  lastUsed: Date;
}
```

---

## Metrics State

```typescript
interface MetricsState {
  sessionMetrics: SessionMetrics;
  turnMetrics: TurnMetrics;
  componentMetrics: ComponentMetrics;
  customMetrics: Map<string, CustomMetric>;
}

interface SessionMetrics {
  totalTurns: number;
  totalDuration: number;
  averageTurnDuration: number;
  totalRelances: number;
  averageRelancesPerTurn: number;
  totalInterruptions: number;
  overallScore: number;
  competencyScores: Map<CompetencyType, number>;
}

interface TurnMetrics {
  currentTurn: number;
  turnDuration: number;
  questionDuration: number;
  answerDuration: number;
  relanceCount: number;
  interruptionCount: number;
  latency: number;
}

interface ComponentMetrics {
  gateway: ComponentMetric;
  redis: ComponentMetric;
  sessionManager: ComponentMetric;
  planner: ComponentMetric;
  director: ComponentMetric;
  contextBuilder: ComponentMetric;
  promptOrchestrator: ComponentMetric;
  aiGuard: ComponentMetric;
  openai: ComponentMetric;
  voiceReturn: ComponentMetric;
}

interface ComponentMetric {
  latency: number;
  p50: number;
  p95: number;
  p99: number;
  errorCount: number;
  successCount: number;
}

interface CustomMetric {
  name: string;
  value: number;
  unit: string;
  lastUpdated: Date;
}
```

---

## Transitions

### Session Transitions

```typescript
interface SessionTransition {
  from: SessionStatus;
  to: SessionStatus;
  trigger: TransitionTrigger;
  guard?: TransitionGuard;
  action?: TransitionAction;
}

type TransitionTrigger = 
  | 'session_started'
  | 'session_completed'
  | 'session_paused'
  | 'session_resumed'
  | 'session_aborted'
  | 'session_error'
  | 'timeout'
  | 'user_action';

interface TransitionGuard {
  condition: string;
  parameters?: Record<string, any>;
}

interface TransitionAction {
  type: string;
  parameters?: Record<string, any>;
}
```

### Stage Transitions

```typescript
interface StageTransitionRule {
  from: StageType;
  to: StageType;
  condition: StageTransitionCondition;
  action?: StageTransitionAction;
}

interface StageTransitionCondition {
  type: 'time' | 'competency' | 'score' | 'manual';
  threshold?: number;
  competencies?: CompetencyType[];
  score?: number;
}

interface StageTransitionAction {
  type: 'snapshot' | 'cleanup' | 'adaptation';
  parameters?: Record<string, any>;
}
```

### Timer Transitions

```typescript
interface TimerTransition {
  timer: Timer;
  from: TimerStatus;
  to: TimerStatus;
  trigger: TimerTrigger;
  action?: TimerAction;
}

type TimerTrigger = 
  | 'expired'
  | 'cancelled'
  | 'completed'
  | 'manual';

interface TimerAction {
  type: 'callback' | 'notification' | 'adaptation';
  parameters?: Record<string, any>;
}
```

---

## Snapshots

### Snapshot Strategy

```typescript
interface SnapshotStrategy {
  interval: number;
  trigger: SnapshotTrigger;
  compression: boolean;
  retention: number;
}

type SnapshotTrigger = 
  | 'time'
  | 'stage'
  | 'turn'
  | 'manual';
```

### Snapshot Creation

```typescript
interface SnapshotCreation {
  state: InterviewRuntimeState;
  version: number;
  createdAt: Date;
  reason: string;
  compression: boolean;
}
```

### Snapshot Restoration

```typescript
interface SnapshotRestoration {
  snapshot: SnapshotCreation;
  restoredAt: Date;
  reason: string;
  validation: boolean;
}
```

---

## Timeouts

### Timeout Configuration

```typescript
interface TimeoutConfiguration {
  silence: number;
  response: number;
  turn: number;
  stage: number;
  session: number;
  latency: number;
}

interface TimeoutHandler {
  type: TimeoutType;
  action: TimeoutAction;
  parameters?: Record<string, any>;
}

type TimeoutType = 
  | 'silence'
  | 'response'
  | 'turn'
  | 'stage'
  | 'session'
  | 'latency';

type TimeoutAction = 
  | 'relance'
  | 'hint'
  | 'transition'
  | 'abort'
  | 'adapt';
```

---

## Validation

### State Validation

```typescript
interface StateValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error';
}

interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}
```

### State Invariants

```typescript
interface StateInvariant {
  name: string;
  condition: string;
  description: string;
}

const STATE_INVARIANTS: StateInvariant[] = [
  {
    name: 'session_status_consistency',
    condition: 'session.status === "active" implies session.startedAt !== undefined',
    description: 'Session cannot be active without a start time'
  },
  {
    name: 'turn_count_consistency',
    condition: 'turnCount === turns.length',
    description: 'Turn count must match the number of turns'
  },
  {
    name: 'competency_score_range',
    condition: 'competencyScores.every(score => score >= 0 && score <= 100)',
    description: 'Competency scores must be between 0 and 100'
  },
  {
    name: 'difficulty_range',
    condition: 'difficulty.overall >= 1 && difficulty.overall <= 10',
    description: 'Overall difficulty must be between 1 and 10'
  },
  {
    name: 'timer_consistency',
    condition: 'activeTimers.every(timer => timer.status === "active")',
    description: 'Active timers must have active status'
  }
];
```

---

## Serialization

### State Serialization

```typescript
interface StateSerialization {
  version: string;
  state: InterviewRuntimeState;
  serializedAt: Date;
  compression: boolean;
  checksum: string;
}

interface StateDeserialization {
  serialized: StateSerialization;
  state: InterviewRuntimeState;
  deserializedAt: Date;
  validation: StateValidation;
}
```

---

## Conclusion

Le Runtime State Engine spécifie l'état complet d'une session d'entretien avec :

1. **15 sous-états** : Session, Planner, Director, Evaluation, Memory, Speech, Persona, Difficulty, Latency, Timers, Interruptions, Goals, Strategies, Metrics
2. **Transitions** : Session, Stage, Timer
3. **Snapshots** : Strategy, Creation, Restoration
4. **Timeouts** : Configuration, Handler
5. **Validation** : State Validation, State Invariants
6. **Serialization** : State Serialization, State Deserialization

Ce document fournit une spécification exécutable pour implémenter le moteur d'état runtime.
