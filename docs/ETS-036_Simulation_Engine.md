# ETS-036 Simulation Engine

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft  
**Type** : Execution Specification

---

## Objectif

Ce document spécifie le moteur de simulation qui pilote tous les scénarios d'entretien : Google, Amazon, Meta, CTO, Startup, Architecture, Behavior, Coding, Incident. Il définit comment chaque scénario configure automatiquement le Planner, le Director, la Persona, la Difficulty, l'Evaluation, l'ATS, la Memory et le Learning.

---

## Scénarios de Simulation

### Simulation Scenario

```typescript
interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  persona: PersonaType;
  configuration: ScenarioConfiguration;
  stages: SimulationStage[];
  evaluation: ScenarioEvaluation;
  constraints: ScenarioConstraints;
}
```

---

### Scenario Configuration

```typescript
interface ScenarioConfiguration {
  planner: PlannerConfiguration;
  director: DirectorConfiguration;
  difficulty: DifficultyConfiguration;
  evaluation: EvaluationConfiguration;
  ats: ATSConfiguration;
  memory: MemoryConfiguration;
  learning: LearningConfiguration;
}

interface PlannerConfiguration {
  strategy: PlannerStrategy;
  adaptability: number;
  planningHorizon: number;
  contingencyPlanning: boolean;
}

type PlannerStrategy = 
  | 'linear'
  | 'adaptive'
  | 'exploratory'
  | 'targeted';

interface DirectorConfiguration {
  decisionStyle: DecisionStyle;
  interruptionLevel: number;
  challengeLevel: number;
  feedbackFrequency: number;
}

type DecisionStyle = 
  | 'strict'
  | 'balanced'
  | 'lenient'
  | 'adaptive';

interface DifficultyConfiguration {
  initialAxes: DifficultyAxes;
  adaptationEnabled: boolean;
  adaptationSpeed: number;
  constraints: DifficultyConstraints;
}

interface EvaluationConfiguration {
  criteria: EvaluationCriteria[];
  weighting: Map<string, number>;
  threshold: number;
  feedbackEnabled: boolean;
}

interface EvaluationCriteria {
  competency: CompetencyType;
  weight: number;
  threshold: number;
  evidenceRequired: boolean;
}

interface ATSConfiguration {
  enabled: boolean;
  matchingStrategy: MatchingStrategy;
  priority: number;
}

type MatchingStrategy = 
  | 'exact'
  | 'fuzzy'
  | 'semantic'
  | 'hybrid';

interface MemoryConfiguration {
  retention: MemoryRetention;
  compression: MemoryCompression;
  prioritization: MemoryPrioritization;
}

interface MemoryRetention {
  shortTerm: number;
  longTerm: number;
  archival: number;
}

interface MemoryCompression {
  enabled: boolean;
  threshold: number;
  strategy: CompressionStrategy;
}

interface MemoryPrioritization {
  strategy: PrioritizationStrategy;
  factors: PrioritizationFactor[];
}

type PrioritizationStrategy = 
  | 'recency'
  | 'relevance'
  | 'importance'
  | 'hybrid';

interface PrioritizationFactor {
  factor: string;
  weight: number;
}

interface LearningConfiguration {
  enabled: boolean;
  adaptationSpeed: number;
  feedbackIntegration: boolean;
  modelUpdate: boolean;
}
```

---

### Simulation Stage

```typescript
interface SimulationStage {
  id: string;
  name: string;
  description: string;
  duration: number;
  competencies: CompetencyType[];
  questions: StageQuestion[];
  evaluation: StageEvaluation;
  transitions: StageTransition[];
}

interface StageQuestion {
  id: string;
  competency: CompetencyType;
  difficulty: number;
  text: string;
  expectedSignals: ExpectedSignal[];
  followups: Followup[];
}

interface StageEvaluation {
  criteria: EvaluationCriteria[];
  weight: number;
  passingThreshold: number;
}

interface StageTransition {
  condition: TransitionCondition;
  targetStage: string;
  action: TransitionAction;
}

interface TransitionCondition {
  type: 'score' | 'time' | 'competency' | 'manual';
  threshold?: number;
  competency?: CompetencyType;
}

interface TransitionAction {
  type: 'continue' | 'skip' | 'adapt' | 'end';
  parameters?: Record<string, any>;
}
```

---

### Scenario Evaluation

```typescript
interface ScenarioEvaluation {
  overall: OverallEvaluation;
  competencies: CompetencyEvaluation[];
  behavior: BehaviorEvaluation;
  communication: CommunicationEvaluation;
  fit: FitEvaluation;
}

interface OverallEvaluation {
  score: number;
  confidence: number;
  recommendation: Recommendation;
  reasoning: string;
}

type Recommendation = 
  | 'strong_hire'
  | 'hire'
  | 'consider'
  | 'reject'
  | 'strong_reject';

interface CompetencyEvaluation {
  competency: CompetencyType;
  score: number;
  confidence: number;
  evidence: Evidence[];
  strengths: string[];
  weaknesses: string[];
}

interface BehaviorEvaluation {
  teamwork: number;
  leadership: number;
  adaptability: number;
  communication: number;
  conflict: number;
  motivation: number;
}

interface CommunicationEvaluation {
  clarity: number;
  structure: number;
  vocabulary: number;
  listening: number;
  nonverbal: number;
}

interface FitEvaluation {
  culture: number;
  values: number;
  team: number;
  role: number;
}
```

---

### Scenario Constraints

```typescript
interface ScenarioConstraints {
  time: TimeConstraints;
  questions: QuestionConstraints;
  difficulty: DifficultyConstraints;
  resources: ResourceConstraints;
}

interface TimeConstraints {
  maxDuration: number;
  perStage: number;
  perQuestion: number;
  strict: boolean;
}

interface QuestionConstraints {
  maxQuestions: number;
  perCompetency: number;
  perStage: number;
  mandatory: string[];
}

interface DifficultyConstraints {
  minLevel: number;
  maxLevel: number;
  adaptationRange: number;
  strict: boolean;
}

interface ResourceConstraints {
  maxTokens: number;
  maxMemory: number;
  maxCompute: number;
}
```

---

## Scénarios Prédéfinis

### Google Scenario

```typescript
const GOOGLE_SCENARIO: SimulationScenario = {
  id: 'scenario-google',
  name: 'Google Interview',
  description: 'Interview style Google - focus on problem solving and structured thinking',
  persona: 'google',
  configuration: {
    planner: {
      strategy: 'adaptive',
      adaptability: 0.8,
      planningHorizon: 5,
      contingencyPlanning: true
    },
    director: {
      decisionStyle: 'balanced',
      interruptionLevel: 3,
      challengeLevel: 7,
      feedbackFrequency: 0.3
    },
    difficulty: {
      initialAxes: {
        questionComplexity: 7,
        ambiguity: 5,
        interruptions: 3,
        timePressure: 5,
        challenge: 7,
        hints: 4,
        silence: 4
      },
      adaptationEnabled: true,
      adaptationSpeed: 0.5,
      constraints: {
        minQuestionComplexity: 3,
        maxQuestionComplexity: 10,
        minAmbiguity: 3,
        maxAmbiguity: 8,
        minInterruptions: 1,
        maxInterruptions: 6,
        minTimePressure: 3,
        maxTimePressure: 8,
        minChallenge: 5,
        maxChallenge: 10,
        minHints: 2,
        maxHints: 7,
        minSilence: 2,
        maxSilence: 7
      }
    },
    evaluation: {
      criteria: [
        { competency: 'problem_solving', weight: 0.3, threshold: 70, evidenceRequired: true },
        { competency: 'architecture', weight: 0.25, threshold: 65, evidenceRequired: true },
        { competency: 'communication', weight: 0.2, threshold: 60, evidenceRequired: true },
        { competency: 'leadership', weight: 0.15, threshold: 55, evidenceRequired: false },
        { competency: 'adaptability', weight: 0.1, threshold: 50, evidenceRequired: false }
      ],
      weighting: new Map([
        ['problem_solving', 0.3],
        ['architecture', 0.25],
        ['communication', 0.2],
        ['leadership', 0.15],
        ['adaptability', 0.1]
      ]),
      threshold: 65,
      feedbackEnabled: true
    },
    ats: {
      enabled: true,
      matchingStrategy: 'semantic',
      priority: 0.7
    },
    memory: {
      retention: {
        shortTerm: 10,
        longTerm: 30,
        archival: 90
      },
      compression: {
        enabled: true,
        threshold: 2000,
        strategy: 'prioritization'
      },
      prioritization: {
        strategy: 'relevance',
        factors: [
          { factor: 'recency', weight: 0.3 },
          { factor: 'importance', weight: 0.5 },
          { factor: 'relevance', weight: 0.2 }
        ]
      }
    },
    learning: {
      enabled: true,
      adaptationSpeed: 0.5,
      feedbackIntegration: true,
      modelUpdate: true
    }
  },
  stages: [
    {
      id: 'stage-1',
      name: 'Introduction',
      description: 'Introduction and background',
      duration: 5,
      competencies: ['communication'],
      questions: [],
      evaluation: {
        criteria: [],
        weight: 0.1,
        passingThreshold: 50
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-2',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-2',
      name: 'Problem Solving',
      description: 'Problem solving and algorithms',
      duration: 20,
      competencies: ['problem_solving'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'problem_solving', weight: 1.0, threshold: 70, evidenceRequired: true }
        ],
        weight: 0.4,
        passingThreshold: 70
      },
      transitions: [
        {
          condition: { type: 'score', threshold: 70 },
          targetStage: 'stage-3',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-3',
      name: 'Architecture',
      description: 'System design and architecture',
      duration: 25,
      competencies: ['architecture'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'architecture', weight: 1.0, threshold: 65, evidenceRequired: true }
        ],
        weight: 0.3,
        passingThreshold: 65
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-4',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-4',
      name: 'Behavioral',
      description: 'Behavioral questions',
      duration: 15,
      competencies: ['leadership', 'adaptability'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'leadership', weight: 0.6, threshold: 55, evidenceRequired: false },
          { competency: 'adaptability', weight: 0.4, threshold: 50, evidenceRequired: false }
        ],
        weight: 0.2,
        passingThreshold: 55
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-5',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-5',
      name: 'Closing',
      description: 'Closing and feedback',
      duration: 5,
      competencies: ['communication'],
      questions: [],
      evaluation: {
        criteria: [],
        weight: 0.0,
        passingThreshold: 0
      },
      transitions: []
    }
  ],
  evaluation: {
    overall: {
      score: 0,
      confidence: 0,
      recommendation: 'consider',
      reasoning: ''
    },
    competencies: [],
    behavior: {
      teamwork: 0,
      leadership: 0,
      adaptability: 0,
      communication: 0,
      conflict: 0,
      motivation: 0
    },
    communication: {
      clarity: 0,
      structure: 0,
      vocabulary: 0,
      listening: 0,
      nonverbal: 0
    },
    fit: {
      culture: 0,
      values: 0,
      team: 0,
      role: 0
    }
  },
  constraints: {
    time: {
      maxDuration: 70,
      perStage: 25,
      perQuestion: 5,
      strict: false
    },
    questions: {
      maxQuestions: 15,
      perCompetency: 5,
      perStage: 5,
      mandatory: []
    },
    difficulty: {
      minLevel: 3,
      maxLevel: 10,
      adaptationRange: 3,
      strict: false
    },
    resources: {
      maxTokens: 2500,
      maxMemory: 1000,
      maxCompute: 100
    }
  }
};
```

---

### Amazon Scenario

```typescript
const AMAZON_SCENARIO: SimulationScenario = {
  id: 'scenario-amazon',
  name: 'Amazon Interview',
  description: 'Interview style Amazon - focus on behavioral questions and ownership',
  persona: 'amazon',
  configuration: {
    planner: {
      strategy: 'targeted',
      adaptability: 0.6,
      planningHorizon: 3,
      contingencyPlanning: false
    },
    director: {
      decisionStyle: 'strict',
      interruptionLevel: 5,
      challengeLevel: 8,
      feedbackFrequency: 0.5
    },
    difficulty: {
      initialAxes: {
        questionComplexity: 6,
        ambiguity: 4,
        interruptions: 5,
        timePressure: 6,
        challenge: 8,
        hints: 3,
        silence: 5
      },
      adaptationEnabled: true,
      adaptationSpeed: 0.3,
      constraints: {
        minQuestionComplexity: 3,
        maxQuestionComplexity: 9,
        minAmbiguity: 2,
        maxAmbiguity: 7,
        minInterruptions: 3,
        maxInterruptions: 8,
        minTimePressure: 4,
        maxTimePressure: 9,
        minChallenge: 6,
        maxChallenge: 10,
        minHints: 1,
        maxHints: 6,
        minSilence: 3,
        maxSilence: 8
      }
    },
    evaluation: {
      criteria: [
        { competency: 'ownership', weight: 0.3, threshold: 70, evidenceRequired: true },
        { competency: 'problem_solving', weight: 0.25, threshold: 65, evidenceRequired: true },
        { competency: 'communication', weight: 0.2, threshold: 60, evidenceRequired: true },
        { competency: 'leadership', weight: 0.15, threshold: 55, evidenceRequired: false },
        { competency: 'adaptability', weight: 0.1, threshold: 50, evidenceRequired: false }
      ],
      weighting: new Map([
        ['ownership', 0.3],
        ['problem_solving', 0.25],
        ['communication', 0.2],
        ['leadership', 0.15],
        ['adaptability', 0.1]
      ]),
      threshold: 65,
      feedbackEnabled: true
    },
    ats: {
      enabled: true,
      matchingStrategy: 'exact',
      priority: 0.8
    },
    memory: {
      retention: {
        shortTerm: 15,
        longTerm: 30,
        archival: 90
      },
      compression: {
        enabled: true,
        threshold: 1800,
        strategy: 'truncation'
      },
      prioritization: {
        strategy: 'importance',
        factors: [
          { factor: 'importance', weight: 0.7 },
          { factor: 'recency', weight: 0.3 }
        ]
      }
    },
    learning: {
      enabled: true,
      adaptationSpeed: 0.3,
      feedbackIntegration: true,
      modelUpdate: true
    }
  },
  stages: [
    {
      id: 'stage-1',
      name: 'Introduction',
      description: 'Introduction and background',
      duration: 5,
      competencies: ['communication'],
      questions: [],
      evaluation: {
        criteria: [],
        weight: 0.1,
        passingThreshold: 50
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-2',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-2',
      name: 'Behavioral',
      description: 'Behavioral questions (STAR)',
      duration: 25,
      competencies: ['ownership', 'leadership'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'ownership', weight: 0.6, threshold: 70, evidenceRequired: true },
          { competency: 'leadership', weight: 0.4, threshold: 55, evidenceRequired: false }
        ],
        weight: 0.4,
        passingThreshold: 65
      },
      transitions: [
        {
          condition: { type: 'score', threshold: 65 },
          targetStage: 'stage-3',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-3',
      name: 'Problem Solving',
      description: 'Problem solving and metrics',
      duration: 20,
      competencies: ['problem_solving'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'problem_solving', weight: 1.0, threshold: 65, evidenceRequired: true }
        ],
        weight: 0.3,
        passingThreshold: 65
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-4',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-4',
      name: 'Closing',
      description: 'Closing and feedback',
      duration: 5,
      competencies: ['communication'],
      questions: [],
      evaluation: {
        criteria: [],
        weight: 0.0,
        passingThreshold: 0
      },
      transitions: []
    }
  ],
  evaluation: {
    overall: {
      score: 0,
      confidence: 0,
      recommendation: 'consider',
      reasoning: ''
    },
    competencies: [],
    behavior: {
      teamwork: 0,
      leadership: 0,
      adaptability: 0,
      communication: 0,
      conflict: 0,
      motivation: 0
    },
    communication: {
      clarity: 0,
      structure: 0,
      vocabulary: 0,
      listening: 0,
      nonverbal: 0
    },
    fit: {
      culture: 0,
      values: 0,
      team: 0,
      role: 0
    }
  },
  constraints: {
    time: {
      maxDuration: 55,
      perStage: 25,
      perQuestion: 5,
      strict: true
    },
    questions: {
      maxQuestions: 12,
      perCompetency: 4,
      perStage: 4,
      mandatory: []
    },
    difficulty: {
      minLevel: 3,
      maxLevel: 9,
      adaptationRange: 2,
      strict: true
    },
    resources: {
      maxTokens: 2500,
      maxMemory: 1000,
      maxCompute: 100
    }
  }
};
```

---

### Meta Scenario

```typescript
const META_SCENARIO: SimulationScenario = {
  id: 'scenario-meta',
  name: 'Meta Interview',
  description: 'Interview style Meta - focus on impact and speed',
  persona: 'meta',
  configuration: {
    planner: {
      strategy: 'adaptive',
      adaptability: 0.9,
      planningHorizon: 3,
      contingencyPlanning: true
    },
    director: {
      decisionStyle: 'balanced',
      interruptionLevel: 7,
      challengeLevel: 9,
      feedbackFrequency: 0.4
    },
    difficulty: {
      initialAxes: {
        questionComplexity: 7,
        ambiguity: 6,
        interruptions: 7,
        timePressure: 8,
        challenge: 9,
        hints: 2,
        silence: 3
      },
      adaptationEnabled: true,
      adaptationSpeed: 0.7,
      constraints: {
        minQuestionComplexity: 4,
        maxQuestionComplexity: 10,
        minAmbiguity: 4,
        maxAmbiguity: 9,
        minInterruptions: 5,
        maxInterruptions: 10,
        minTimePressure: 6,
        maxTimePressure: 10,
        minChallenge: 7,
        maxChallenge: 10,
        minHints: 1,
        maxHints: 5,
        minSilence: 2,
        maxSilence: 6
      }
    },
    evaluation: {
      criteria: [
        { competency: 'problem_solving', weight: 0.3, threshold: 70, evidenceRequired: true },
        { competency: 'adaptability', weight: 0.25, threshold: 65, evidenceRequired: true },
        { competency: 'communication', weight: 0.2, threshold: 60, evidenceRequired: true },
        { competency: 'leadership', weight: 0.15, threshold: 55, evidenceRequired: false },
        { competency: 'ownership', weight: 0.1, threshold: 50, evidenceRequired: false }
      ],
      weighting: new Map([
        ['problem_solving', 0.3],
        ['adaptability', 0.25],
        ['communication', 0.2],
        ['leadership', 0.15],
        ['ownership', 0.1]
      ]),
      threshold: 65,
      feedbackEnabled: true
    },
    ats: {
      enabled: true,
      matchingStrategy: 'semantic',
      priority: 0.6
    },
    memory: {
      retention: {
        shortTerm: 8,
        longTerm: 25,
        archival: 60
      },
      compression: {
        enabled: true,
        threshold: 2200,
        strategy: 'prioritization'
      },
      prioritization: {
        strategy: 'recency',
        factors: [
          { factor: 'recency', weight: 0.6 },
          { factor: 'relevance', weight: 0.4 }
        ]
      }
    },
    learning: {
      enabled: true,
      adaptationSpeed: 0.7,
      feedbackIntegration: true,
      modelUpdate: true
    }
  },
  stages: [
    {
      id: 'stage-1',
      name: 'Introduction',
      description: 'Introduction and background',
      duration: 3,
      competencies: ['communication'],
      questions: [],
      evaluation: {
        criteria: [],
        weight: 0.05,
        passingThreshold: 50
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-2',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-2',
      name: 'Impact',
      description: 'Impact and results',
      duration: 20,
      competencies: ['problem_solving', 'adaptability'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'problem_solving', weight: 0.6, threshold: 70, evidenceRequired: true },
          { competency: 'adaptability', weight: 0.4, threshold: 65, evidenceRequired: true }
        ],
        weight: 0.5,
        passingThreshold: 68
      },
      transitions: [
        {
          condition: { type: 'score', threshold: 68 },
          targetStage: 'stage-3',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-3',
      name: 'Speed',
      description: 'Speed and execution',
      duration: 15,
      competencies: ['problem_solving'],
      questions: [],
      evaluation: {
        criteria: [
          { competency: 'problem_solving', weight: 1.0, threshold: 65, evidenceRequired: true }
        ],
        weight: 0.3,
        passingThreshold: 65
      },
      transitions: [
        {
          condition: { type: 'time' },
          targetStage: 'stage-4',
          action: { type: 'continue' }
        }
      ]
    },
    {
      id: 'stage-4',
      name: 'Closing',
      description: 'Closing and feedback',
      duration: 2,
      competencies: ['communication'],
      questions: [],
      evaluation: {
        criteria: [],
        weight: 0.0,
        passingThreshold: 0
      },
      transitions: []
    }
  ],
  evaluation: {
    overall: {
      score: 0,
      confidence: 0,
      recommendation: 'consider',
      reasoning: ''
    },
    competencies: [],
    behavior: {
      teamwork: 0,
      leadership: 0,
      adaptability: 0,
      communication: 0,
      conflict: 0,
      motivation: 0
    },
    communication: {
      clarity: 0,
      structure: 0,
      vocabulary: 0,
      listening: 0,
      nonverbal: 0
    },
    fit: {
      culture: 0,
      values: 0,
      team: 0,
      role: 0
    }
  },
  constraints: {
    time: {
      maxDuration: 40,
      perStage: 20,
      perQuestion: 3,
      strict: true
    },
    questions: {
      maxQuestions: 10,
      perCompetency: 3,
      perStage: 3,
      mandatory: []
    },
    difficulty: {
      minLevel: 4,
      maxLevel: 10,
      adaptationRange: 3,
      strict: true
    },
    resources: {
      maxTokens: 2500,
      maxMemory: 1000,
      maxCompute: 100
    }
  }
};
```

---

## Simulation Engine

### Simulation Engine Interface

```typescript
interface SimulationEngine {
  loadScenario(scenarioId: string): SimulationScenario;
  startSimulation(scenario: SimulationScenario): SimulationSession;
  advanceStage(session: SimulationSession): void;
  evaluateSession(session: SimulationSession): ScenarioEvaluation;
  adaptConfiguration(session: SimulationSession, feedback: SimulationFeedback): void;
  stopSimulation(session: SimulationSession): void;
}

interface SimulationSession {
  id: string;
  scenario: SimulationScenario;
  state: SessionState;
  currentStage: number;
  startTime: Date;
  endTime?: Date;
  configuration: ScenarioConfiguration;
  evaluation: ScenarioEvaluation;
}

interface SessionState {
  status: 'initializing' | 'active' | 'paused' | 'completed' | 'aborted';
  turnCount: number;
  currentQuestion?: string;
  answers: Answer[];
  metrics: SessionMetrics;
}

interface SessionMetrics {
  duration: number;
  questionsAsked: number;
  relancesCount: number;
  adaptationCount: number;
  overallScore: number;
}

interface SimulationFeedback {
  stage: number;
  score: number;
  difficulty: number;
  stress: number;
  confidence: number;
  comments: string;
}
```

---

### Simulation Engine Implementation

```typescript
class SimulationEngineImpl implements SimulationEngine {
  private scenarios: Map<string, SimulationScenario> = new Map();
  private sessions: Map<string, SimulationSession> = new Map();

  constructor() {
    // Charger les scénarios prédéfinis
    this.scenarios.set('google', GOOGLE_SCENARIO);
    this.scenarios.set('amazon', AMAZON_SCENARIO);
    this.scenarios.set('meta', META_SCENARIO);
  }

  loadScenario(scenarioId: string): SimulationScenario {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }
    return scenario;
  }

  startSimulation(scenario: SimulationScenario): SimulationSession {
    const session: SimulationSession = {
      id: generateId(),
      scenario,
      state: {
        status: 'initializing',
        turnCount: 0,
        answers: [],
        metrics: {
          duration: 0,
          questionsAsked: 0,
          relancesCount: 0,
          adaptationCount: 0,
          overallScore: 0
        }
      },
      currentStage: 0,
      startTime: new Date(),
      configuration: { ...scenario.configuration },
      evaluation: {
        overall: {
          score: 0,
          confidence: 0,
          recommendation: 'consider',
          reasoning: ''
        },
        competencies: [],
        behavior: {
          teamwork: 0,
          leadership: 0,
          adaptability: 0,
          communication: 0,
          conflict: 0,
          motivation: 0
        },
        communication: {
          clarity: 0,
          structure: 0,
          vocabulary: 0,
          listening: 0,
          nonverbal: 0
        },
        fit: {
          culture: 0,
          values: 0,
          team: 0,
          role: 0
        }
      }
    };

    this.sessions.set(session.id, session);
    return session;
  }

  advanceStage(session: SimulationSession): void {
    const currentStage = session.scenario.stages[session.currentStage];
    const transition = currentStage.transitions[0];

    if (transition) {
      const targetStageIndex = session.scenario.stages.findIndex(
        s => s.id === transition.targetStage
      );

      if (targetStageIndex !== -1) {
        session.currentStage = targetStageIndex;
      }
    }
  }

  evaluateSession(session: SimulationSession): ScenarioEvaluation {
    // Calculer le score global
    const overallScore = this.calculateOverallScore(session);
    
    // Calculer les scores de compétences
    const competencyScores = this.calculateCompetencyScores(session);
    
    // Calculer les scores comportementaux
    const behaviorScores = this.calculateBehaviorScores(session);
    
    // Calculer les scores de communication
    const communicationScores = this.calculateCommunicationScores(session);
    
    // Calculer les scores de fit
    const fitScores = this.calculateFitScores(session);
    
    // Déterminer la recommandation
    const recommendation = this.determineRecommendation(overallScore);
    
    session.evaluation = {
      overall: {
        score: overallScore,
        confidence: 0.8,
        recommendation,
        reasoning: this.generateReasoning(session)
      },
      competencies: competencyScores,
      behavior: behaviorScores,
      communication: communicationScores,
      fit: fitScores
    };

    return session.evaluation;
  }

  calculateOverallScore(session: SimulationSession): number {
    let totalScore = 0;
    let totalWeight = 0;

    session.scenario.evaluation.criteria.forEach(criterion => {
      const competencyScore = session.evaluation.competencies.find(
        c => c.competency === criterion.competency
      );
      
      if (competencyScore) {
        totalScore += competencyScore.score * criterion.weight;
        totalWeight += criterion.weight;
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  calculateCompetencyScores(session: SimulationSession): CompetencyEvaluation[] {
    const scores: CompetencyEvaluation[] = [];

    session.scenario.evaluation.criteria.forEach(criterion => {
      const evidence = session.state.answers
        .filter(a => a.signals.some(s => s.type === criterion.competency))
        .map(a => ({
          id: a.id,
          type: 'direct' as const,
          description: a.text,
          strength: a.signals.find(s => s.type === criterion.competency)?.strength || 0,
          at: a.startedAt,
          turnId: a.id
        }));

      const score = evidence.length > 0 
        ? evidence.reduce((sum, e) => sum + e.strength, 0) / evidence.length * 100
        : 0;

      scores.push({
        competency: criterion.competency,
        score,
        confidence: Math.min(1, evidence.length / 3),
        evidence,
        strengths: this.extractStrengths(evidence),
        weaknesses: this.extractWeaknesses(evidence)
      });
    });

    return scores;
  }

  calculateBehaviorScores(session: SimulationSession): BehaviorEvaluation {
    // Calculer les scores comportementaux basés sur les réponses
    return {
      teamwork: 0,
      leadership: 0,
      adaptability: 0,
      communication: 0,
      conflict: 0,
      motivation: 0
    };
  }

  calculateCommunicationScores(session: SimulationSession): CommunicationEvaluation {
    // Calculer les scores de communication basés sur les réponses
    return {
      clarity: 0,
      structure: 0,
      vocabulary: 0,
      listening: 0,
      nonverbal: 0
    };
  }

  calculateFitScores(session: SimulationSession): FitEvaluation {
    // Calculer les scores de fit basés sur les réponses
    return {
      culture: 0,
      values: 0,
      team: 0,
      role: 0
    };
  }

  determineRecommendation(score: number): Recommendation {
    if (score >= 85) return 'strong_hire';
    if (score >= 70) return 'hire';
    if (score >= 55) return 'consider';
    if (score >= 40) return 'reject';
    return 'strong_reject';
  }

  generateReasoning(session: SimulationSession): string {
    const overallScore = session.evaluation.overall.score;
    const strengths = session.evaluation.competencies
      .filter(c => c.score >= 70)
      .map(c => c.competency);
    const weaknesses = session.evaluation.competencies
      .filter(c => c.score < 50)
      .map(c => c.competency);

    let reasoning = `Overall score: ${overallScore.toFixed(0)}/100. `;
    
    if (strengths.length > 0) {
      reasoning += `Strengths: ${strengths.join(', ')}. `;
    }
    
    if (weaknesses.length > 0) {
      reasoning += `Weaknesses: ${weaknesses.join(', ')}. `;
    }

    return reasoning;
  }

  extractStrengths(evidence: Evidence[]): string[] {
    return evidence
      .filter(e => e.strength > 0.7)
      .map(e => e.description);
  }

  extractWeaknesses(evidence: Evidence[]): string[] {
    return evidence
      .filter(e => e.strength < 0.4)
      .map(e => e.description);
  }

  adaptConfiguration(session: SimulationSession, feedback: SimulationFeedback): void {
    // Adapter la configuration en fonction du feedback
    if (feedback.score < session.scenario.evaluation.threshold) {
      // Réduire la difficulté
      session.configuration.difficulty.initialAxes.questionComplexity = Math.max(
        1,
        session.configuration.difficulty.initialAxes.questionComplexity - 1
      );
      session.state.metrics.adaptationCount++;
    } else if (feedback.score > session.scenario.evaluation.threshold + 15) {
      // Augmenter la difficulté
      session.configuration.difficulty.initialAxes.questionComplexity = Math.min(
        10,
        session.configuration.difficulty.initialAxes.questionComplexity + 1
      );
      session.state.metrics.adaptationCount++;
    }
  }

  stopSimulation(session: SimulationSession): void {
    session.state.status = 'completed';
    session.endTime = new Date();
    session.state.metrics.duration = 
      session.endTime.getTime() - session.startTime.getTime();
  }
}

function generateId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

---

## Conclusion

Le Simulation Engine spécifie le moteur de simulation qui pilote tous les scénarios d'entretien avec :

1. **Scénarios de simulation** : Google, Amazon, Meta, CTO, Startup, Architecture, Behavior, Coding, Incident
2. **Scenario Configuration** : planner, director, difficulty, evaluation, ats, memory, learning
3. **Simulation Stage** : id, name, description, duration, competencies, questions, evaluation, transitions
4. **Scenario Evaluation** : overall, competencies, behavior, communication, fit
5. **Scenario Constraints** : time, questions, difficulty, resources
6. **Scénarios prédéfinis** : Google, Amazon, Meta avec configurations détaillées
7. **Simulation Engine Interface** : loadScenario, startSimulation, advanceStage, evaluateSession, adaptConfiguration, stopSimulation
8. **Simulation Engine Implementation** : calcul des scores, détermination de la recommandation, adaptation de la configuration

Ce document fournit une spécification exécutable pour implémenter le moteur de simulation.
