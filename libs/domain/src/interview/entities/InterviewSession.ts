/**
 * InterviewSession - Domain Entity
 * 
 * Represents a complete interview session with its lifecycle,
 * state machine, and versioned transitions.
 */

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// ============================================================================
// Value Objects
// ============================================================================

export enum InterviewStage {
  INTRODUCTION = 'introduction',
  ICE_BREAKER = 'ice_breaker',
  PRESENTATION = 'presentation',
  EXPERIENCE = 'experience',
  LEADERSHIP = 'leadership',
  CONFLICT = 'conflict',
  ARCHITECTURE = 'architecture',
  SYSTEM_DESIGN = 'system_design',
  ALGORITHMS = 'algorithms',
  BEHAVIORAL = 'behavioral',
  CULTURE_FIT = 'culture_fit',
  CANDIDATE_QUESTIONS = 'candidate_questions',
  CONCLUSION = 'conclusion',
}

export enum InterviewState {
  CREATED = 'created',
  INITIALIZED = 'initialized',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

export enum Competency {
  LEADERSHIP = 'leadership',
  OWNERSHIP = 'ownership',
  COMMUNICATION = 'communication',
  ARCHITECTURE = 'architecture',
  ALGORITHMS = 'algorithms',
  PROBLEM_SOLVING = 'problem_solving',
  DEBUGGING = 'debugging',
  PRODUCT_SENSE = 'product_sense',
  MENTORING = 'mentoring',
  LEARNING = 'learning',
  CONFLICT = 'conflict',
  INFLUENCE = 'influence',
  DECISION_MAKING = 'decision_making',
  TECHNICAL_DEPTH = 'technical_depth',
  BUSINESS_IMPACT = 'business_impact',
}

export interface StageObjective {
  id: string;
  stage: InterviewStage;
  description: string;
  requiredCompetencies: Competency[];
  exitConditions: ExitCondition[];
  minDuration: number; // seconds
  maxDuration: number; // seconds
  successCriteria: string[];
}

export interface ExitCondition {
  type: 'competency_threshold' | 'time_elapsed' | 'question_count' | 'manual';
  value: number;
  operator: 'gte' | 'lte' | 'eq';
}

export interface InterviewTransition {
  id: string;
  fromStage: InterviewStage;
  toStage: InterviewStage;
  timestamp: Date;
  version: number;
  reason: string;
  triggeredBy: 'system' | 'director' | 'manual';
}

export interface InterviewPlan {
  id: string;
  stages: StageObjective[];
  transitions: InterviewTransition[];
  totalDuration: number;
  difficulty: number; // 0-100
  targetRole: string;
  targetLevel: string;
  version: string;
}

// ============================================================================
// Entity
// ============================================================================

export interface InterviewSessionProps {
  id?: string;
  userId: string;
  plan: InterviewPlan;
  state: InterviewState;
  currentStage: InterviewStage;
  currentObjective?: StageObjective;
  startedAt?: Date;
  completedAt?: Date;
  transitions: InterviewTransition[];
  version: number;
  metadata?: Record<string, unknown>;
}

export class InterviewSession {
  private readonly props: InterviewSessionProps;

  constructor(props: InterviewSessionProps) {
    this.props = {
      id: props.id || uuidv4(),
      transitions: props.transitions || [],
      version: props.version || 1,
      ...props,
    };
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get plan(): InterviewPlan {
    return this.props.plan;
  }

  get state(): InterviewState {
    return this.props.state;
  }

  get currentStage(): InterviewStage {
    return this.props.currentStage;
  }

  get currentObjective(): StageObjective | undefined {
    return this.props.currentObjective;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get transitions(): InterviewTransition[] {
    return this.props.transitions;
  }

  get version(): number {
    return this.props.version;
  }

  // Business Methods
  initialize(): void {
    if (this.props.state !== InterviewState.CREATED) {
      throw new Error('Session must be in CREATED state to initialize');
    }

    this.props.state = InterviewState.INITIALIZED;
    this.props.startedAt = new Date();
    this.props.currentStage = InterviewStage.INTRODUCTION;
    this.props.currentObjective = this.props.plan.stages[0];
  }

  start(): void {
    if (this.props.state !== InterviewState.INITIALIZED) {
      throw new Error('Session must be in INITIALIZED state to start');
    }

    this.props.state = InterviewState.IN_PROGRESS;
  }

  transitionTo(
    toStage: InterviewStage,
    reason: string,
    triggeredBy: 'system' | 'director' | 'manual' = 'system'
  ): void {
    if (this.props.state !== InterviewState.IN_PROGRESS) {
      throw new Error('Session must be in IN_PROGRESS state to transition');
    }

    const transition: InterviewTransition = {
      id: uuidv4(),
      fromStage: this.props.currentStage,
      toStage,
      timestamp: new Date(),
      version: this.props.version,
      reason,
      triggeredBy,
    };

    this.props.transitions.push(transition);
    this.props.currentStage = toStage;
    this.props.currentObjective = this.props.plan.stages.find(
      (s) => s.stage === toStage
    );
    this.props.version++;
  }

  pause(): void {
    if (this.props.state !== InterviewState.IN_PROGRESS) {
      throw new Error('Session must be in IN_PROGRESS state to pause');
    }

    this.props.state = InterviewState.PAUSED;
  }

  resume(): void {
    if (this.props.state !== InterviewState.PAUSED) {
      throw new Error('Session must be in PAUSED state to resume');
    }

    this.props.state = InterviewState.IN_PROGRESS;
  }

  complete(): void {
    if (this.props.state !== InterviewState.IN_PROGRESS) {
      throw new Error('Session must be in IN_PROGRESS state to complete');
    }

    this.props.state = InterviewState.COMPLETED;
    this.props.completedAt = new Date();
  }

  cancel(reason: string): void {
    if (
      this.props.state === InterviewState.COMPLETED ||
      this.props.state === InterviewState.CANCELLED
    ) {
      throw new Error('Session cannot be cancelled');
    }

    this.props.state = InterviewState.CANCELLED;
    this.props.completedAt = new Date();
    this.props.metadata = {
      ...this.props.metadata,
      cancellationReason: reason,
    };
  }

  error(error: string): void {
    this.props.state = InterviewState.ERROR;
    this.props.metadata = {
      ...this.props.metadata,
      error,
    };
  }

  // Domain Events
  getDomainEvents(): DomainEvent[] {
    return [];
  }

  clearDomainEvents(): void {
    // Implementation
  }

  // Persistence
  toPersistence(): InterviewSessionProps {
    return { ...this.props };
  }

  static fromPersistence(props: InterviewSessionProps): InterviewSession {
    return new InterviewSession(props);
  }
}

// ============================================================================
// Domain Events
// ============================================================================

export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: unknown;
  timestamp: Date;
  version: number;
}

export class InterviewSessionInitialized implements DomainEvent {
  readonly id = uuidv4();
  readonly type = 'InterviewSessionInitialized';
  readonly aggregateType = 'InterviewSession';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: { userId: string; planId: string },
    public readonly timestamp = new Date(),
    public readonly version = 1
  ) {}
}

export class InterviewSessionStarted implements DomainEvent {
  readonly id = uuidv4();
  readonly type = 'InterviewSessionStarted';
  readonly aggregateType = 'InterviewSession';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: { sessionId: string },
    public readonly timestamp = new Date(),
    public readonly version = 1
  ) {}
}

export class InterviewSessionCompleted implements DomainEvent {
  readonly id = uuidv4();
  readonly type = 'InterviewSessionCompleted';
  readonly aggregateType = 'InterviewSession';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sessionId: string;
      duration: number;
      transitions: InterviewTransition[];
    },
    public readonly timestamp = new Date(),
    public readonly version = 1
  ) {}
}

// ============================================================================
// Validation Schemas
// ============================================================================

export const InterviewStageSchema = z.enum([
  'introduction',
  'ice_breaker',
  'presentation',
  'experience',
  'leadership',
  'conflict',
  'architecture',
  'system_design',
  'algorithms',
  'behavioral',
  'culture_fit',
  'candidate_questions',
  'conclusion',
]);

export const CompetencySchema = z.enum([
  'leadership',
  'ownership',
  'communication',
  'architecture',
  'algorithms',
  'problem_solving',
  'debugging',
  'product_sense',
  'mentoring',
  'learning',
  'conflict',
  'influence',
  'decision_making',
  'technical_depth',
  'business_impact',
]);

export const StageObjectiveSchema = z.object({
  id: z.string().uuid(),
  stage: InterviewStageSchema,
  description: z.string(),
  requiredCompetencies: z.array(CompetencySchema),
  exitConditions: z.array(
    z.object({
      type: z.enum(['competency_threshold', 'time_elapsed', 'question_count', 'manual']),
      value: z.number(),
      operator: z.enum(['gte', 'lte', 'eq']),
    })
  ),
  minDuration: z.number().min(0),
  maxDuration: z.number().min(0),
  successCriteria: z.array(z.string()),
});

export const InterviewPlanSchema = z.object({
  id: z.string().uuid(),
  stages: z.array(StageObjectiveSchema),
  transitions: z.array(z.any()),
  totalDuration: z.number().min(0),
  difficulty: z.number().min(0).max(100),
  targetRole: z.string(),
  targetLevel: z.string(),
  version: z.string(),
});

export const InterviewSessionPropsSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  plan: InterviewPlanSchema,
  state: z.enum([
    'created',
    'initialized',
    'in_progress',
    'paused',
    'completed',
    'cancelled',
    'error',
  ]),
  currentStage: InterviewStageSchema,
  currentObjective: StageObjectiveSchema.optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  transitions: z.array(z.any()),
  version: z.number().min(1),
  metadata: z.record(z.unknown()).optional(),
});
