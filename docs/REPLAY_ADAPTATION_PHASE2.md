# Phase 2 - Adapter Replay pour V2

## Objectif

Adapter le système de replay existant pour enregistrer les nouvelles données V2 :
- Director Decisions
- Planner State
- Persona State
- Difficulty
- Memory Snapshot
- Evaluation Snapshot
- Speech Metrics
- Events complets
- OpenAI Events

---

## Replay Actuel vs Replay V2

### Replay Actuel

**Données enregistrées**
- Audio
- Transcript
- Messages
- Events (pressure_peak, interruption, hesitation, recovery, strong_answer, evasion, milestone)
- Pressure curve
- Archetype

**Structure**

```typescript
interface SessionReplay {
  sessionId: string;
  events: ReplayEvent[];
  pressureCurve: { time: number; level: number }[];
  archetype: string;
  overallCoaching: string;
}

interface ReplayEvent {
  id: string;
  timestamp: number;
  type: ReplayEventType;
  title: string;
  description: string;
  pressureLevel: number;
  triggerSignal?: string;
  coachingAdvice?: string;
  originalText?: string;
  betterVersion?: string;
}
```

### Replay V2

**Nouvelles données à enregistrer**

```typescript
interface SessionReplayV2 {
  sessionId: string;
  userId: string;
  startedAt: Date;
  completedAt: Date;
  
  // Events complets (Event Sourcing)
  events: InterviewEvent[];
  
  // Director Decisions
  directorDecisions: DirectorDecision[];
  
  // Planner State
  plannerState: PlannerState;
  
  // Persona State
  personaState: PersonaState;
  
  // Difficulty
  difficultyHistory: DifficultySnapshot[];
  
  // Memory Snapshot
  memorySnapshots: MemorySnapshot[];
  
  // Evaluation Snapshot
  evaluationSnapshots: EvaluationSnapshot[];
  
  // Speech Metrics
  speechMetrics: SpeechMetrics[];
  
  // OpenAI Events
  openaiEvents: OpenAIEvent[];
  
  // Replay V1 (compatibilité)
  legacyReplay?: SessionReplay;
}
```

---

## Stratégie d'Adaptation

### 1. Event Sourcing

**Principe** : Un entretien devient une suite d'événements

**Événements à enregistrer**

```typescript
type InterviewEvent =
  | InterviewCreated
  | InterviewInitialized
  | InterviewStarted
  | StageStarted
  | StageCompleted
  | StageTransitionRequested
  | StageTransitionApproved
  | StageTransitionRejected
  | TurnStarted
  | TranscriptReceived
  | SpeechStarted
  | SpeechEnded
  | CandidateAnswered
  | EvaluationUpdated
  | MemoryUpdated
  | DifficultyChanged
  | PersonaAdjusted
  | DirectorDecisionMade
  | OpenAIRequestSent
  | OpenAIResponseReceived
  | InterviewCompleted
  | InterviewCancelled;
```

**Structure d'un événement**

```typescript
interface InterviewEvent {
  id: string;
  type: InterviewEventType;
  sessionId: string;
  timestamp: Date;
  version: number;
  payload: unknown;
  correlationId?: string;
}
```

### 2. Director Decisions

**Structure**

```typescript
interface DirectorDecision {
  id: string;
  sessionId: string;
  timestamp: Date;
  action: DirectorAction;
  currentStage: InterviewStage;
  currentCompetency: Competency;
  candidateState: CandidateStateSnapshot;
  targetCompetency?: Competency;
  targetStage?: InterviewStage;
  strategy?: string;
  intensity?: number;
  reasoning: string;
  personaAdjustments?: PersonaAdjustments;
  confidence: number;
  requiresApproval: boolean;
}
```

**Enregistrement**

```typescript
// Dans l'Orchestrator
async recordDecision(decision: DirectorDecision): Promise<void> {
  await this.eventStore.append(decision.sessionId, {
    type: 'DirectorDecisionMade',
    payload: decision,
  });
}
```

### 3. Planner State

**Structure**

```typescript
interface PlannerState {
  sessionId: string;
  timestamp: Date;
  currentStage: InterviewStage;
  currentObjective: StageObjective;
  completedStages: InterviewStage[];
  remainingStages: InterviewStage[];
  totalDuration: number;
  elapsedTime: number;
  questionsAsked: number;
  questionsRemaining: number;
}
```

**Enregistrement**

```typescript
// Snapshot à chaque transition de stage
async recordPlannerState(state: PlannerState): Promise<void> {
  await this.eventStore.append(state.sessionId, {
    type: 'PlannerStateSnapshot',
    payload: state,
  });
}
```

### 4. Persona State

**Structure**

```typescript
interface PersonaState {
  sessionId: string;
  timestamp: Date;
  personaId: string;
  parameters: PersonaParameters;
  adjustments: PersonaAdjustments[];
  history: PersonaAdjustment[];
}
```

**Enregistrement**

```typescript
// Snapshot à chaque ajustement de persona
async recordPersonaState(state: PersonaState): Promise<void> {
  await this.eventStore.append(state.sessionId, {
    type: 'PersonaStateSnapshot',
    payload: state,
  });
}
```

### 5. Difficulty

**Structure**

```typescript
interface DifficultySnapshot {
  sessionId: string;
  timestamp: Date;
  stage: InterviewStage;
  difficulty: number;
  factors: DifficultyFactors;
  trend: 'increasing' | 'decreasing' | 'stable';
}
```

**Enregistrement**

```typescript
// Snapshot à chaque changement de difficulté
async recordDifficulty(snapshot: DifficultySnapshot): Promise<void> {
  await this.eventStore.append(snapshot.sessionId, {
    type: 'DifficultyChanged',
    payload: snapshot,
  });
}
```

### 6. Memory Snapshot

**Structure**

```typescript
interface MemorySnapshot {
  sessionId: string;
  timestamp: Date;
  turnNumber: number;
  projects: Project[];
  companies: Company[];
  skills: Skill[];
  achievements: Achievement[];
  contradictions: Contradiction[];
  pendingTopics: PendingTopic[];
}
```

**Enregistrement**

```typescript
// Snapshot à chaque tour (tous les 5 tours pour optimiser)
async recordMemorySnapshot(snapshot: MemorySnapshot): Promise<void> {
  await this.eventStore.append(snapshot.sessionId, {
    type: 'MemorySnapshot',
    payload: snapshot,
  });
}
```

### 7. Evaluation Snapshot

**Structure**

```typescript
interface EvaluationSnapshot {
  sessionId: string;
  timestamp: Date;
  turnNumber: number;
  competencies: Record<Competency, CompetencyScore>;
  overallScore: number;
  topStrengths: Competency[];
  topWeaknesses: Competency[];
}
```

**Enregistrement**

```typescript
// Snapshot à chaque tour
async recordEvaluationSnapshot(snapshot: EvaluationSnapshot): Promise<void> {
  await this.eventStore.append(snapshot.sessionId, {
    type: 'EvaluationSnapshot',
    payload: snapshot,
  });
}
```

### 8. Speech Metrics

**Structure**

```typescript
interface SpeechMetrics {
  sessionId: string;
  timestamp: Date;
  turnNumber: number;
  fillers: FillerAnalysis;
  hesitations: HesitationAnalysis;
  speechRate: SpeechRateAnalysis;
  clarity: ClarityAnalysis;
  energy: EnergyAnalysis;
  emotion: EmotionAnalysis;
}
```

**Enregistrement**

```typescript
// À chaque tour de parole
async recordSpeechMetrics(metrics: SpeechMetrics): Promise<void> {
  await this.eventStore.append(metrics.sessionId, {
    type: 'SpeechMetrics',
    payload: metrics,
  });
}
```

### 9. OpenAI Events

**Structure**

```typescript
interface OpenAIEvent {
  sessionId: string;
  timestamp: Date;
  turnNumber: number;
  type: 'request' | 'response' | 'error';
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latency: number;
  model: string;
  promptPreview?: string;
}
```

**Enregistrement**

```typescript
// À chaque appel OpenAI
async recordOpenAIEvent(event: OpenAIEvent): Promise<void> {
  await this.eventStore.append(event.sessionId, {
    type: 'OpenAIEvent',
    payload: event,
  });
}
```

---

## Implémentation

### Étape 1 : Event Store

**Nouveau service** : `apps/interview-orchestrator/src/shared/infrastructure/event-store.ts`

**Responsabilités**
- Stocker les événements dans Redis Streams
- Permettre la reconstitution d'état
- Gérer la rétention des événements

**Interface**

```typescript
interface EventStore {
  append(sessionId: string, event: InterviewEvent): Promise<void>;
  getEvents(sessionId: string): Promise<InterviewEvent[]>;
  getEventsRange(sessionId: string, from: Date, to: Date): Promise<InterviewEvent[]>;
  deleteEvents(sessionId: string): Promise<void>;
}
```

### Étape 2 : Replay Generator V2

**Nouveau service** : `apps/interview-orchestrator/src/modules/replay/replay-generator-v2.ts`

**Responsabilités**
- Générer le replay complet à partir des événements
- Compatibilité avec le replay V1
- Export en JSON/PDF

**Interface**

```typescript
interface ReplayGeneratorV2 {
  generate(sessionId: string): Promise<SessionReplayV2>;
  generateTimeline(sessionId: string): Promise<ReplayTimeline>;
  generateReport(sessionId: string): Promise<InterviewReport>;
  exportPDF(sessionId: string): Promise<Buffer>;
}
```

### Étape 3 : Compatibilité V1

**Adapter le replay existant**

```typescript
// Dans replay-generator.ts
async generate(sessionId: string): Promise<SessionReplay> {
  const v2Replay = await this.replayGeneratorV2.generate(sessionId);
  
  // Convertir V2 → V1 pour compatibilité
  return {
    sessionId: v2Replay.sessionId,
    events: this.convertEvents(v2Replay.events),
    pressureCurve: this.extractPressureCurve(v2Replay.directorDecisions),
    archetype: this.extractArchetype(v2Replay.evaluationSnapshots),
    overallCoaching: this.generateCoaching(v2Replay),
  };
}
```

### Étape 4 : UI Replay V2

**Nouveaux composants** : `apps/web/src/components/replay-v2/`

**Composants**
- `ReplayTimelineV2.tsx` - Timeline enrichie
- `DirectorDecisionCard.tsx` - Carte décision Director
- `PersonaStateCard.tsx` - Carte état Persona
- `MemorySnapshotCard.tsx` - Carte Memory
- `EvaluationRadar.tsx` - Radar évaluation
- `SpeechMetricsChart.tsx` - Graphique speech metrics

---

## Optimisations

### 1. Compression

**Compresser les événements**

```typescript
// Stocker uniquement les snapshots pertinents
- Memory snapshot : tous les 5 tours
- Evaluation snapshot : tous les 3 tours
- Speech metrics : tous les tours
```

### 2. Rétention

**Politique de rétention**

```typescript
// Événements récents : 30 jours
// Événements archivés : 1 an (compressés)
// Événements supprimés : > 1 an
```

### 3. Indexation

**Indexer les événements**

```typescript
// Index par sessionId
// Index par timestamp
// Index par eventType
// Index par userId
```

---

## Tests

### Tests unitaires

```typescript
describe('ReplayGeneratorV2', () => {
  it('should generate replay from events', async () => {
    const events = [/* events de test */];
    await eventStore.append(sessionId, events);
    
    const replay = await replayGenerator.generate(sessionId);
    
    expect(replay.sessionId).toBe(sessionId);
    expect(replay.events).toHaveLength(events.length);
  });
  
  it('should convert V2 to V1 for compatibility', async () => {
    const v2Replay = await replayGeneratorV2.generate(sessionId);
    const v1Replay = await replayGenerator.generate(sessionId);
    
    expect(v1Replay).toBeDefined();
    expect(v1Replay.events).toBeDefined();
  });
});
```

### Tests d'intégration

```typescript
describe('Replay Integration', () => {
  it('should record all events during interview', async () => {
    const session = await startInterview();
    await processTurn(session, 'Je suis développeur...');
    
    const events = await eventStore.getEvents(session.sessionId);
    expect(events.length).toBeGreaterThan(10);
  });
  
  it('should replay interview from events', async () => {
    const session = await startInterview();
    await completeInterview(session);
    
    const replay = await replayGenerator.generate(session.sessionId);
    expect(replay.directorDecisions).toBeDefined();
    expect(replay.evaluationSnapshots).toBeDefined();
  });
});
```

---

## Checklist

### Avant adaptation

- [ ] Event Store implémenté
- [ ] Replay Generator V2 implémenté
- [ ] Compatibilité V1 testée
- [ ] UI Replay V2 prête
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent

### Après adaptation

- [ ] Tous les événements enregistrés
- [ ] Director Decisions enregistrés
- [ ] Planner State enregistré
- [ ] Persona State enregistré
- [ ] Difficulty enregistré
- [ ] Memory Snapshot enregistré
- [ ] Evaluation Snapshot enregistré
- [ ] Speech Metrics enregistrés
- [ ] OpenAI Events enregistrés
- [ ] Replay V2 fonctionnel
- [ ] Compatibilité V1 maintenue

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Event Store | 3 jours |
| Replay Generator V2 | 4 jours |
| Compatibilité V1 | 2 jours |
| UI Replay V2 | 5 jours |
| Tests | 2 jours |
| **Total** | **16 jours (~2 semaines)** |

---

## Conclusion

L'adaptation du replay pour V2 permet :

1. **Event Sourcing complet** : Tous les événements enregistrés
2. **Reconstitution exacte** : Replay parfait de l'entretien
3. **Compatibilité V1** : Pas de rupture pour l'existant
4. **Analytics avancés** : Director Decisions, Persona State, etc.
5. **Optimisations** : Compression, rétention, indexation
