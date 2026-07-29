# Blueprint V3 - FSM Détaillées

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Principes

### 1. Déterminisme

Les FSM sont **déterministes** :
- Même état + même événement = même transition
- Pas de comportement non déterministe
- Tests reproductibles

### 2. Validation des transitions

Toutes les transitions sont **validées** :
- Conditions de sortie explicites
- Guards pour vérifier les préconditions
- Actions de transition bien définies

### 3. Versionnement

Les FSM sont **versionnées** :
- Chaque version a un schéma Zod
- Migration entre versions
- Backward compatibility

### 4. Observabilité

Les FSM sont **observables** :
- Logging de chaque transition
- Metrics pour chaque état
- Tracing distribué

---

## Interview FSM

### États

```typescript
export enum InterviewState {
  CREATED = 'created',
  INITIALIZED = 'initialized',
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}
```

### Transitions

```typescript
export interface InterviewTransition {
  from: InterviewState;
  to: InterviewState;
  event: InterviewEvent;
  guard?: TransitionGuard;
  action?: TransitionAction;
}

export type InterviewEvent =
  | 'Initialize'
  | 'Start'
  | 'Pause'
  | 'Resume'
  | 'Complete'
  | 'Cancel'
  | 'Error';
```

### Définition de la FSM

```typescript
import { z } from 'zod';

/**
 * FSM pour le cycle de vie d'un entretien
 * @version 1.0.0
 */
export const InterviewFSMSchema = z.object({
  version: z.literal('1.0.0'),
  states: z.array(z.enum([
    InterviewState.CREATED,
    InterviewState.INITIALIZED,
    InterviewState.STARTED,
    InterviewState.IN_PROGRESS,
    InterviewState.PAUSED,
    InterviewState.COMPLETED,
    InterviewState.CANCELLED,
    InterviewState.ERROR,
  ])),
  transitions: z.array(z.object({
    from: z.enum([
      InterviewState.CREATED,
      InterviewState.INITIALIZED,
      InterviewState.STARTED,
      InterviewState.IN_PROGRESS,
      InterviewState.PAUSED,
      InterviewState.COMPLETED,
      InterviewState.CANCELLED,
      InterviewState.ERROR,
    ]),
    to: z.enum([
      InterviewState.CREATED,
      InterviewState.INITIALIZED,
      InterviewState.STARTED,
      InterviewState.IN_PROGRESS,
      InterviewState.PAUSED,
      InterviewState.COMPLETED,
      InterviewState.CANCELLED,
      InterviewState.ERROR,
    ]),
    event: z.enum([
      'Initialize',
      'Start',
      'Pause',
      'Resume',
      'Complete',
      'Cancel',
      'Error',
    ]),
  })),
  initialState: z.literal(InterviewState.CREATED),
  finalStates: z.array(z.enum([
    InterviewState.COMPLETED,
    InterviewState.CANCELLED,
    InterviewState.ERROR,
  ])),
});

export type InterviewFSM = z.infer<typeof InterviewFSMSchema>;

export const INTERVIEW_FSM_V1: InterviewFSM = {
  version: '1.0.0',
  states: [
    InterviewState.CREATED,
    InterviewState.INITIALIZED,
    InterviewState.STARTED,
    InterviewState.IN_PROGRESS,
    InterviewState.PAUSED,
    InterviewState.COMPLETED,
    InterviewState.CANCELLED,
    InterviewState.ERROR,
  ],
  transitions: [
    { from: InterviewState.CREATED, to: InterviewState.INITIALIZED, event: 'Initialize' },
    { from: InterviewState.INITIALIZED, to: InterviewState.STARTED, event: 'Start' },
    { from: InterviewState.STARTED, to: InterviewState.IN_PROGRESS, event: 'Start' },
    { from: InterviewState.IN_PROGRESS, to: InterviewState.PAUSED, event: 'Pause' },
    { from: InterviewState.PAUSED, to: InterviewState.IN_PROGRESS, event: 'Resume' },
    { from: InterviewState.IN_PROGRESS, to: InterviewState.COMPLETED, event: 'Complete' },
    { from: InterviewState.IN_PROGRESS, to: InterviewState.CANCELLED, event: 'Cancel' },
    { from: InterviewState.PAUSED, to: InterviewState.CANCELLED, event: 'Cancel' },
    { from: InterviewState.STARTED, to: InterviewState.CANCELLED, event: 'Cancel' },
    { from: InterviewState.INITIALIZED, to: InterviewState.CANCELLED, event: 'Cancel' },
    { from: InterviewState.CREATED, to: InterviewState.CANCELLED, event: 'Cancel' },
    { from: InterviewState.IN_PROGRESS, to: InterviewState.ERROR, event: 'Error' },
    { from: InterviewState.PAUSED, to: InterviewState.ERROR, event: 'Error' },
    { from: InterviewState.STARTED, to: InterviewState.ERROR, event: 'Error' },
    { from: InterviewState.INITIALIZED, to: InterviewState.ERROR, event: 'Error' },
  ],
  initialState: InterviewState.CREATED,
  finalStates: [
    InterviewState.COMPLETED,
    InterviewState.CANCELLED,
    InterviewState.ERROR,
  ],
};
```

### Guards

```typescript
export interface TransitionGuard {
  name: string;
  check: (context: InterviewContext) => Promise<boolean>;
  errorMessage?: string;
}

export interface InterviewContext {
  interviewId: string;
  userId: string;
  planId: string;
  personaId: string;
  currentStage: string;
  currentScore: number;
  currentDifficulty: number;
  turnCount: number;
  duration: number;
}

export const INTERVIEW_GUARDS: Record<string, TransitionGuard> = {
  CanInitialize: {
    name: 'CanInitialize',
    check: async (context: InterviewContext) => {
      return context.currentStage === 'created';
    },
    errorMessage: 'Interview must be in created state to initialize',
  },
  CanStart: {
    name: 'CanStart',
    check: async (context: InterviewContext) => {
      return context.currentStage === 'initialized';
    },
    errorMessage: 'Interview must be initialized to start',
  },
  CanComplete: {
    name: 'CanComplete',
    check: async (context: InterviewContext) => {
      return context.turnCount >= 10 && context.duration >= 300; // Au moins 10 tours et 5 minutes
    },
    errorMessage: 'Interview must have at least 10 turns and 5 minutes duration',
  },
  CanPause: {
    name: 'CanPause',
    check: async (context: InterviewContext) => {
      return context.currentStage === 'in_progress';
    },
    errorMessage: 'Interview must be in progress to pause',
  },
  CanResume: {
    name: 'CanResume',
    check: async (context: InterviewContext) => {
      return context.currentStage === 'paused';
    },
    errorMessage: 'Interview must be paused to resume',
  },
};
```

### Actions

```typescript
export interface TransitionAction {
  name: string;
  execute: (context: InterviewContext) => Promise<void>;
}

export const INTERVIEW_ACTIONS: Record<string, TransitionAction> = {
  OnInitialize: {
    name: 'OnInitialize',
    execute: async (context: InterviewContext) => {
      // Logique d'initialisation
      console.log(`[InterviewFSM] Initializing interview ${context.interviewId}`);
    },
  },
  OnStart: {
    name: 'OnStart',
    execute: async (context: InterviewContext) => {
      // Logique de démarrage
      console.log(`[InterviewFSM] Starting interview ${context.interviewId}`);
    },
  },
  OnComplete: {
    name: 'OnComplete',
    execute: async (context: InterviewContext) => {
      // Logique de complétion
      console.log(`[InterviewFSM] Completing interview ${context.interviewId}`);
    },
  },
  OnCancel: {
    name: 'OnCancel',
    execute: async (context: InterviewContext) => {
      // Logique d'annulation
      console.log(`[InterviewFSM] Cancelling interview ${context.interviewId}`);
    },
  },
  OnError: {
    name: 'OnError',
    execute: async (context: InterviewContext) => {
      // Logique d'erreur
      console.log(`[InterviewFSM] Error in interview ${context.interviewId}`);
    },
  },
};
```

### FSM Engine

```typescript
export class FSMEngine<TState, TEvent, TContext> {
  constructor(
    private fsm: FSMDefinition<TState, TEvent>,
    private guards: Record<string, TransitionGuard<TContext>> = {},
    private actions: Record<string, TransitionAction<TContext>> = {}
  ) {}

  async transition(
    currentState: TState,
    event: TEvent,
    context: TContext
  ): Promise<TState> {
    // Trouver la transition correspondante
    const transition = this.fsm.transitions.find(
      t => t.from === currentState && t.event === event
    );

    if (!transition) {
      throw new Error(`No transition from ${currentState} on event ${event}`);
    }

    // Exécuter le guard si présent
    if (transition.guard) {
      const guard = this.guards[transition.guard];
      if (guard) {
        const canTransition = await guard.check(context);
        if (!canTransition) {
          throw new Error(guard.errorMessage || 'Guard failed');
        }
      }
    }

    // Exécuter l'action si présente
    if (transition.action) {
      const action = this.actions[transition.action];
      if (action) {
        await action.execute(context);
      }
    }

    // Logger la transition
    this.logTransition(currentState, transition.to, event, context);

    // Retourner le nouvel état
    return transition.to;
  }

  private logTransition(
    from: TState,
    to: TState,
    event: TEvent,
    context: TContext
  ): void {
    console.log(`[FSM] Transition: ${from} -> ${to} on event ${event}`);
  }

  canTransition(currentState: TState, event: TEvent): boolean {
    return this.fsm.transitions.some(
      t => t.from === currentState && t.event === event
    );
  }

  isFinalState(state: TState): boolean {
    return this.fsm.finalStates.includes(state);
  }
}

interface FSMDefinition<TState, TEvent> {
  version: string;
  states: TState[];
  transitions: Array<{
    from: TState;
    to: TState;
    event: TEvent;
    guard?: string;
    action?: string;
  }>;
  initialState: TState;
  finalStates: TState[];
}
```

---

## Stage FSM

### États

```typescript
export enum StageState {
  INTRODUCTION = 'introduction',
  ICE_BREAKER = 'ice_breaker',
  EXPERIENCE = 'experience',
  ARCHITECTURE = 'architecture',
  SYSTEM_DESIGN = 'system_design',
  ALGORITHMS = 'algorithms',
  LEADERSHIP = 'leadership',
  BEHAVIORAL = 'behavioral',
  CONFLICT = 'conflict',
  CULTURE_FIT = 'culture_fit',
  PRESENTATION = 'presentation',
  CANDIDATE_QUESTIONS = 'candidate_questions',
  CONCLUSION = 'conclusion',
}
```

### Transitions

```typescript
export const STAGE_FSM_V1: FSMDefinition<StageState, StageEvent> = {
  version: '1.0.0',
  states: [
    StageState.INTRODUCTION,
    StageState.ICE_BREAKER,
    StageState.EXPERIENCE,
    StageState.ARCHITECTURE,
    StageState.SYSTEM_DESIGN,
    StageState.ALGORITHMS,
    StageState.LEADERSHIP,
    StageState.BEHAVIORAL,
    StageState.CONFLICT,
    StageState.CULTURE_FIT,
    StageState.PRESENTATION,
    StageState.CANDIDATE_QUESTIONS,
    StageState.CONCLUSION,
  ],
  transitions: [
    { from: StageState.INTRODUCTION, to: StageState.ICE_BREAKER, event: 'Next' },
    { from: StageState.ICE_BREAKER, to: StageState.EXPERIENCE, event: 'Next' },
    { from: StageState.EXPERIENCE, to: StageState.ARCHITECTURE, event: 'Next' },
    { from: StageState.ARCHITECTURE, to: StageState.SYSTEM_DESIGN, event: 'Next' },
    { from: StageState.SYSTEM_DESIGN, to: StageState.ALGORITHMS, event: 'Next' },
    { from: StageState.ALGORITHMS, to: StageState.LEADERSHIP, event: 'Next' },
    { from: StageState.LEADERSHIP, to: StageState.BEHAVIORAL, event: 'Next' },
    { from: StageState.BEHAVIORAL, to: StageState.CONFLICT, event: 'Next' },
    { from: StageState.CONFLICT, to: StageState.CULTURE_FIT, event: 'Next' },
    { from: StageState.CULTURE_FIT, to: StageState.PRESENTATION, event: 'Next' },
    { from: StageState.PRESENTATION, to: StageState.CANDIDATE_QUESTIONS, event: 'Next' },
    { from: StageState.CANDIDATE_QUESTIONS, to: StageState.CONCLUSION, event: 'Next' },
    // Transitions conditionnelles
    { from: StageState.EXPERIENCE, to: StageState.LEADERSHIP, event: 'SkipTechnical', guard: 'CanSkipTechnical' },
    { from: StageState.ARCHITECTURE, to: StageState.BEHAVIORAL, event: 'SkipSystemDesign', guard: 'CanSkipSystemDesign' },
  ],
  initialState: StageState.INTRODUCTION,
  finalStates: [StageState.CONCLUSION],
};

export type StageEvent =
  | 'Next'
  | 'SkipTechnical'
  | 'SkipSystemDesign'
  | 'JumpTo';
```

### Guards

```typescript
export const STAGE_GUARDS: Record<string, TransitionGuard<StageContext>> = {
  CanSkipTechnical: {
    name: 'CanSkipTechnical',
    check: async (context: StageContext) => {
      return context.targetRole === 'Manager' || context.targetRole === 'Product Manager';
    },
    errorMessage: 'Cannot skip technical stages for technical roles',
  },
  CanSkipSystemDesign: {
    name: 'CanSkipSystemDesign',
    check: async (context: StageContext) => {
      return context.experienceLevel === 'Junior';
    },
    errorMessage: 'Cannot skip system design for senior roles',
  },
  CanJumpTo: {
    name: 'CanJumpTo',
    check: async (context: StageContext) => {
      return context.isPilotMode;
    },
    errorMessage: 'Cannot jump to stage in normal mode',
  },
};

export interface StageContext {
  interviewId: string;
  currentStage: StageState;
  targetStage?: StageState;
  targetRole: string;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  isPilotMode: boolean;
  stageScores: Record<StageState, number>;
}
```

---

## Turn FSM

### États

```typescript
export enum TurnState {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  SPEAKING = 'speaking',
  INTERRUPTED = 'interrupted',
  COMPLETED = 'completed',
}
```

### Transitions

```typescript
export const TURN_FSM_V1: FSMDefinition<TurnState, TurnEvent> = {
  version: '1.0.0',
  states: [
    TurnState.IDLE,
    TurnState.LISTENING,
    TurnState.PROCESSING,
    TurnState.SPEAKING,
    TurnState.INTERRUPTED,
    TurnState.COMPLETED,
  ],
  transitions: [
    { from: TurnState.IDLE, to: TurnState.LISTENING, event: 'StartListening' },
    { from: TurnState.LISTENING, to: TurnState.PROCESSING, event: 'TranscriptReceived' },
    { from: TurnState.PROCESSING, to: TurnState.SPEAKING, event: 'ResponseReady' },
    { from: TurnState.SPEAKING, to: TurnState.COMPLETED, event: 'SpeechCompleted' },
    { from: TurnState.COMPLETED, to: TurnState.IDLE, event: 'NextTurn' },
    // Interruption
    { from: TurnState.SPEAKING, to: TurnState.INTERRUPTED, event: 'Interrupt' },
    { from: TurnState.INTERRUPTED, to: TurnState.LISTENING, event: 'ResumeListening' },
    // Timeout
    { from: TurnState.LISTENING, to: TurnState.IDLE, event: 'Timeout' },
    { from: TurnState.PROCESSING, to: TurnState.IDLE, event: 'Error' },
  ],
  initialState: TurnState.IDLE,
  finalStates: [TurnState.COMPLETED],
};

export type TurnEvent =
  | 'StartListening'
  | 'TranscriptReceived'
  | 'ResponseReady'
  | 'SpeechCompleted'
  | 'NextTurn'
  | 'Interrupt'
  | 'ResumeListening'
  | 'Timeout'
  | 'Error';
```

### Guards

```typescript
export const TURN_GUARDS: Record<string, TransitionGuard<TurnContext>> = {
  CanInterrupt: {
    name: 'CanInterrupt',
    check: async (context: TurnContext) => {
      return context.currentState === TurnState.SPEAKING && context.interruptAllowed;
    },
    errorMessage: 'Cannot interrupt when not speaking or interrupt not allowed',
  },
  CanResume: {
    name: 'CanResume',
    check: async (context: TurnContext) => {
      return context.currentState === TurnState.INTERRUPTED;
    },
    errorMessage: 'Cannot resume when not interrupted',
  },
};

export interface TurnContext {
  interviewId: string;
  sessionId: string;
  turnNumber: number;
  currentState: TurnState;
  interruptAllowed: boolean;
  speechDuration: number;
  timeoutMs: number;
}
```

---

## Evaluation FSM

### États

```typescript
export enum EvaluationState {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

### Transitions

```typescript
export const EVALUATION_FSM_V1: FSMDefinition<EvaluationState, EvaluationEvent> = {
  version: '1.0.0',
  states: [
    EvaluationState.PENDING,
    EvaluationState.IN_PROGRESS,
    EvaluationState.COMPLETED,
    EvaluationState.FAILED,
  ],
  transitions: [
    { from: EvaluationState.PENDING, to: EvaluationState.IN_PROGRESS, event: 'Start' },
    { from: EvaluationState.IN_PROGRESS, to: EvaluationState.COMPLETED, event: 'Complete' },
    { from: EvaluationState.IN_PROGRESS, to: EvaluationState.FAILED, event: 'Error' },
    { from: EvaluationState.FAILED, to: EvaluationState.IN_PROGRESS, event: 'Retry', guard: 'CanRetry' },
  ],
  initialState: EvaluationState.PENDING,
  finalStates: [EvaluationState.COMPLETED, EvaluationState.FAILED],
};

export type EvaluationEvent =
  | 'Start'
  | 'Complete'
  | 'Error'
  | 'Retry';
```

### Guards

```typescript
export const EVALUATION_GUARDS: Record<string, TransitionGuard<EvaluationContext>> = {
  CanRetry: {
    name: 'CanRetry',
    check: async (context: EvaluationContext) => {
      return context.retryCount < 3;
    },
    errorMessage: 'Maximum retry attempts exceeded',
  },
};

export interface EvaluationContext {
  interviewId: string;
  turnNumber: number;
  retryCount: number;
  lastError?: Error;
}
```

---

## FSM Composition

### Composite FSM

```typescript
export class CompositeFSM {
  constructor(
    private interviewFSM: FSMEngine<InterviewState, InterviewEvent, InterviewContext>,
    private stageFSM: FSMEngine<StageState, StageEvent, StageContext>,
    private turnFSM: FSMEngine<TurnState, TurnEvent, TurnContext>,
    private evaluationFSM: FSMEngine<EvaluationState, EvaluationEvent, EvaluationContext>
  ) {}

  async handleInterviewEvent(
    event: InterviewEvent,
    context: InterviewContext
  ): Promise<InterviewState> {
    return this.interviewFSM.transition(context.currentStage, event, context);
  }

  async handleStageEvent(
    event: StageEvent,
    context: StageContext
  ): Promise<StageState> {
    return this.stageFSM.transition(context.currentStage, event, context);
  }

  async handleTurnEvent(
    event: TurnEvent,
    context: TurnContext
  ): Promise<TurnState> {
    return this.turnFSM.transition(context.currentState, event, context);
  }

  async handleEvaluationEvent(
    event: EvaluationEvent,
    context: EvaluationContext
  ): Promise<EvaluationState> {
    return this.evaluationFSM.transition(context.currentState, event, context);
  }
}
```

---

## Tests

### Tests de FSM

```typescript
describe('InterviewFSM', () => {
  let fsm: FSMEngine<InterviewState, InterviewEvent, InterviewContext>;
  let context: InterviewContext;

  beforeEach(() => {
    fsm = new FSMEngine(
      INTERVIEW_FSM_V1,
      INTERVIEW_GUARDS,
      INTERVIEW_ACTIONS
    );
    context = createTestInterviewContext();
  });

  it('should transition from CREATED to INITIALIZED on Initialize', async () => {
    const newState = await fsm.transition(InterviewState.CREATED, 'Initialize', context);
    
    expect(newState).toBe(InterviewState.INITIALIZED);
  });

  it('should transition from INITIALIZED to STARTED on Start', async () => {
    const newState = await fsm.transition(InterviewState.INITIALIZED, 'Start', context);
    
    expect(newState).toBe(InterviewState.STARTED);
  });

  it('should reject invalid transition', async () => {
    await expect(
      fsm.transition(InterviewState.CREATED, 'Complete', context)
    ).rejects.toThrow('No transition');
  });

  it('should execute guard and reject if guard fails', async () => {
    context.turnCount = 5; // Moins de 10 tours
    
    await expect(
      fsm.transition(InterviewState.IN_PROGRESS, 'Complete', context)
    ).rejects.toThrow('Guard failed');
  });

  it('should execute action on transition', async () => {
    const actionSpy = jest.spyOn(INTERVIEW_ACTIONS.OnStart, 'execute');
    
    await fsm.transition(InterviewState.INITIALIZED, 'Start', context);
    
    expect(actionSpy).toHaveBeenCalled();
  });
});
```

---

## Monitoring

### Metrics

```typescript
interface FSMMetrics {
  transitionCount: number;
  transitionByState: Record<string, number>;
  transitionByEvent: Record<string, number>;
  guardFailureCount: number;
  actionFailureCount: number;
  averageTransitionTime: number;
}

class FSMMetricsCollector {
  private metrics: FSMMetrics = {
    transitionCount: 0,
    transitionByState: {},
    transitionByEvent: {},
    guardFailureCount: 0,
    actionFailureCount: 0,
    averageTransitionTime: 0,
  };

  recordTransition(from: string, to: string, event: string, duration: number): void {
    this.metrics.transitionCount++;
    this.metrics.transitionByState[from] = (this.metrics.transitionByState[from] || 0) + 1;
    this.metrics.transitionByEvent[event] = (this.metrics.transitionByEvent[event] || 0) + 1;
    
    // Moyenne mobile
    this.metrics.averageTransitionTime =
      (this.metrics.averageTransitionTime * (this.metrics.transitionCount - 1) + duration) /
      this.metrics.transitionCount;
  }

  recordGuardFailure(guardName: string): void {
    this.metrics.guardFailureCount++;
  }

  recordActionFailure(actionName: string): void {
    this.metrics.actionFailureCount++;
  }

  getMetrics(): FSMMetrics {
    return { ...this.metrics };
  }
}
```

---

## Checklist

### Avant implémentation

- [ ] Interview FSM définie
- [ ] Stage FSM définie
- [ ] Turn FSM définie
- [ ] Evaluation FSM définie
- [ ] Guards définis
- [ ] Actions définies
- [ ] FSM Engine implémenté

### Après implémentation

- [ ] Interview FSM implémentée
- [ ] Stage FSM implémentée
- [ ] Turn FSM implémentée
- [ ] Evaluation FSM implémentée
- [ ] Guards implémentés
- [ ] Actions implémentées
- [ ] Composite FSM implémentée
- [ ] Metrics Collector implémenté
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Interview FSM | 2 jours |
| Stage FSM | 2 jours |
| Turn FSM | 2 jours |
| Evaluation FSM | 1 jour |
| Guards | 2 jours |
| Actions | 1 jour |
| FSM Engine | 2 jours |
| Composite FSM | 1 jour |
| Metrics | 1 jour |
| Tests | 2 jours |
| **Total** | **16 jours (~2 semaines)** |

---

## Conclusion

Ce document définit les FSM détaillées pour l'architecture V2 Enterprise, respectant les principes State Machines, Guards, Actions, et garantissant le déterminisme et la validation des transitions.

**Prochaines étapes :**
- Diagrammes de séquence complets
- Plan de migration zéro interruption
