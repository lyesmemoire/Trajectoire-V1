# Phase 3 - Event Sourcing

## Objectif

Transformer le replay en un système d'Event Sourcing complet, permettant la reconstitution exacte de l'état de l'entretien à tout moment.

---

## Principes de l'Event Sourcing

### Définition

L'Event Sourcing est un pattern où :
- **L'état** d'une entité est dérivé d'une **séquence d'événements**
- Les événements sont **immuables** et **append-only**
- L'état peut être **reconstitué** en rejouant les événements
- Les événements sont la **source de vérité**

### Avantages

1. **Audit trail complet** : Chaque changement est tracé
2. **Reconstitution exacte** : Replay parfait à tout moment
3. **Debugging** : Peut rejouer un scénario exact
4. **Analytics** : Analyse temporelle des décisions
5. **Rollback** : Peut revenir à un état précédent

### Inconvénients

1. **Complexité** : Plus complexe que CRUD
2. **Taille** : Beaucoup d'événements
3. **Performance** : Reconstitution peut être coûteuse
4. **Migration** : Schéma d'événements doit être versionné

---

## Architecture Event Sourcing

### Composants

```
┌─────────────────────────────────────────────────────────┐
│                    Event Store                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Redis Streams (Append-only log)                   │  │
│  │  - interview:{sessionId}                          │  │
│  │  - director:{sessionId}                           │  │
│  │  - evaluation:{sessionId}                          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Snapshot Store (Optimisation)                     │  │
│  │  - snapshots:{sessionId}                           │  │
│  │  - tous les 100 événements                         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              Event Aggregator                           │
│  - Agrège les événements par session                   │
│  - Calcule les métriques                              │
│  - Génère les rapports                                │
└─────────────────────────────────────────────────────────┘
         │
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              State Reconstructor                         │
│  - Reconstitue l'état depuis les événements            │
│  - Utilise les snapshots pour optimiser               │
│  - Retourne l'état à un moment donné                   │
└─────────────────────────────────────────────────────────┘
```

---

## Événements

### Taxonomie des événements

```typescript
// Événements de session
type SessionEvent =
  | InterviewCreated
  | InterviewInitialized
  | InterviewStarted
  | InterviewPaused
  | InterviewResumed
  | InterviewCompleted
  | InterviewCancelled
  | InterviewError;

// Événements de stage
type StageEvent =
  | StageStarted
  | StageCompleted
  | StageTransitionRequested
  | StageTransitionApproved
  | StageTransitionRejected;

// Événements de tour
type TurnEvent =
  | TurnStarted
  | TranscriptReceived
  | SpeechStarted
  | SpeechEnded
  | CandidateAnswered
  | TurnCompleted;

// Événements de décision
type DecisionEvent =
  | DirectorDecisionMade
  | PersonaAdjusted
  | DifficultyChanged;

// Événements d'évaluation
type EvaluationEvent =
  | EvaluationUpdated
  | CompetencyScoreUpdated
  | ContradictionDetected
  | BluffDetected;

// Événements de mémoire
type MemoryEvent =
  | MemoryUpdated
  | MemorySnapshotTaken
  | FactExtracted
  | ContradictionAdded;

// Événements OpenAI
type OpenAIEvent =
  | OpenAIRequestSent
  | OpenAIResponseReceived
  | OpenAIError;
```

### Structure d'un événement

```typescript
interface BaseEvent {
  id: string;
  type: string;
  sessionId: string;
  timestamp: Date;
  version: number;
  correlationId?: string;
  causationId?: string; // Event qui a causé cet event
}

interface InterviewCreated extends BaseEvent {
  type: 'InterviewCreated';
  payload: {
    userId: string;
    planId: string;
    targetRole: string;
    targetLevel: string;
  };
}

interface DirectorDecisionMade extends BaseEvent {
  type: 'DirectorDecisionMade';
  payload: {
    action: DirectorAction;
    currentStage: InterviewStage;
    currentCompetency: Competency;
    reasoning: string;
    confidence: number;
  };
}
```

---

## Event Store

### Interface

```typescript
interface EventStore {
  // Ajouter un événement
  append(sessionId: string, event: BaseEvent): Promise<void>;
  
  // Lire tous les événements d'une session
  getEvents(sessionId: string): Promise<BaseEvent[]>;
  
  // Lire les événements dans un intervalle
  getEventsRange(sessionId: string, from: Date, to: Date): Promise<BaseEvent[]>;
  
  // Lire les événements à partir d'une version
  getEventsFromVersion(sessionId: string, version: number): Promise<BaseEvent[]>;
  
  // Sauvegarder un snapshot
  saveSnapshot(sessionId: string, snapshot: StateSnapshot): Promise<void>;
  
  // Charger un snapshot
  loadSnapshot(sessionId: string): Promise<StateSnapshot | null>;
  
  // Supprimer les événements (GDPR)
  deleteEvents(sessionId: string): Promise<void>;
}
```

### Implémentation Redis Streams

```typescript
class RedisEventStore implements EventStore {
  constructor(private redis: Redis) {}

  async append(sessionId: string, event: BaseEvent): Promise<void> {
    const streamKey = `interview:${sessionId}`;
    const eventId = `${event.type}:${event.id}`;
    
    await this.redis.xadd(streamKey, '*', {
      eventId,
      type: event.type,
      sessionId: event.sessionId,
      timestamp: event.timestamp.toISOString(),
      version: event.version.toString(),
      payload: JSON.stringify(event),
    });
  }

  async getEvents(sessionId: string): Promise<BaseEvent[]> {
    const streamKey = `interview:${sessionId}`;
    const events = await this.redis.xrange(streamKey, '-', '+');
    
    return events.map(e => JSON.parse(e.payload as string));
  }

  async saveSnapshot(sessionId: string, snapshot: StateSnapshot): Promise<void> {
    const snapshotKey = `snapshot:${sessionId}`;
    await this.redis.set(snapshotKey, JSON.stringify(snapshot), 'EX', 86400); // 24h
  }

  async loadSnapshot(sessionId: string): Promise<StateSnapshot | null> {
    const snapshotKey = `snapshot:${sessionId}`;
    const data = await this.redis.get(snapshotKey);
    return data ? JSON.parse(data) : null;
  }
}
```

---

## State Reconstructor

### Responsabilités

- Reconstituer l'état depuis les événements
- Utiliser les snapshots pour optimiser
- Retourner l'état à un moment donné

### Interface

```typescript
interface StateReconstructor {
  // Reconstituer l'état actuel
  reconstruct(sessionId: string): Promise<InterviewState>;
  
  // Reconstituer l'état à un moment donné
  reconstructAt(sessionId: string, timestamp: Date): Promise<InterviewState>;
  
  // Reconstituer l'état à une version donnée
  reconstructAtVersion(sessionId: string, version: number): Promise<InterviewState>;
}
```

### Implémentation

```typescript
class InterviewStateReconstructor implements StateReconstructor {
  constructor(
    private eventStore: EventStore,
    private snapshotStore: SnapshotStore
  ) {}

  async reconstruct(sessionId: string): Promise<InterviewState> {
    // 1. Charger le snapshot le plus récent
    const snapshot = await this.snapshotStore.loadSnapshot(sessionId);
    
    // 2. Charger les événements depuis le snapshot
    const fromVersion = snapshot?.version ?? 0;
    const events = await this.eventStore.getEventsFromVersion(sessionId, fromVersion);
    
    // 3. Appliquer les événements à l'état
    const state = snapshot?.state ?? this.createInitialState();
    return this.applyEvents(state, events);
  }

  private applyEvents(state: InterviewState, events: BaseEvent[]): InterviewState {
    let currentState = state;
    
    for (const event of events) {
      currentState = this.applyEvent(currentState, event);
    }
    
    return currentState;
  }

  private applyEvent(state: InterviewState, event: BaseEvent): InterviewState {
    switch (event.type) {
      case 'InterviewCreated':
        return this.handleInterviewCreated(state, event);
      case 'StageStarted':
        return this.handleStageStarted(state, event);
      case 'DirectorDecisionMade':
        return this.handleDirectorDecision(state, event);
      // ... autres handlers
      default:
        return state;
    }
  }
}
```

---

## Snapshot Strategy

### Quand prendre un snapshot ?

```typescript
// Stratégie : Snapshot tous les 100 événements
const SNAPSHOT_INTERVAL = 100;

async shouldTakeSnapshot(sessionId: string): Promise<boolean> {
  const events = await eventStore.getEvents(sessionId);
  return events.length % SNAPSHOT_INTERVAL === 0;
}
```

### Structure d'un snapshot

```typescript
interface StateSnapshot {
  sessionId: string;
  version: number;
  timestamp: Date;
  state: InterviewState;
  metadata: {
    eventCount: number;
    lastEventType: string;
  };
}
```

---

## Event Versioning

### Gestion des versions d'événements

```typescript
interface EventVersion {
  version: number;
  schema: ZodSchema;
  migration?: (oldEvent: unknown) => BaseEvent;
}

const EVENT_VERSIONS: Record<string, EventVersion[]> = {
  'DirectorDecisionMade': [
    {
      version: 1,
      schema: DirectorDecisionMadeV1Schema,
    },
    {
      version: 2,
      schema: DirectorDecisionMadeV2Schema,
      migration: (oldEvent) => migrateV1ToV2(oldEvent),
    },
  ],
};
```

### Migration automatique

```typescript
async append(sessionId: string, event: BaseEvent): Promise<void> {
  const currentVersion = await getCurrentEventVersion(event.type);
  
  if (event.version < currentVersion) {
    event = await migrateEvent(event, currentVersion);
  }
  
  await redis.xadd(streamKey, '*', event);
}
```

---

## Event Aggregator

### Responsabilités

- Agréger les événements par session
- Calculer les métriques
- Générer les rapports

### Interface

```typescript
interface EventAggregator {
  // Agréger les événements d'une session
  aggregate(sessionId: string): Promise<SessionAggregate>;
  
  // Calculer les métriques
  calculateMetrics(sessionId: string): Promise<SessionMetrics>;
  
  // Générer un rapport
  generateReport(sessionId: string): Promise<InterviewReport>;
}
```

### Implémentation

```typescript
class RedisEventAggregator implements EventAggregator {
  async aggregate(sessionId: string): Promise<SessionAggregate> {
    const events = await this.eventStore.getEvents(sessionId);
    
    return {
      sessionId,
      eventCount: events.length,
      eventsByType: this.groupByType(events),
      timeline: this.buildTimeline(events),
      duration: this.calculateDuration(events),
    };
  }

  private groupByType(events: BaseEvent[]): Record<string, number> {
    return events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
```

---

## Optimisations

### 1. Compression

```typescript
// Compresser les payloads des événements
async append(sessionId: string, event: BaseEvent): Promise<void> {
  const compressed = gzip(JSON.stringify(event.payload));
  await redis.xadd(streamKey, '*', {
    ...event,
    payload: compressed,
  });
}
```

### 2. TTL

```typescript
// TTL sur les streams
await redis.xadd(streamKey, '*', event, 'MAXLEN', '~', 10000); // Garder 10k events
```

### 3. Indexation

```typescript
// Index par timestamp pour les requêtes rapides
await redis.xadd(streamKey, '*', event, {
  timestamp: event.timestamp.getTime(),
});
```

---

## Tests

### Tests unitaires

```typescript
describe('EventStore', () => {
  it('should append and retrieve events', async () => {
    const event = createTestEvent();
    await eventStore.append(sessionId, event);
    
    const events = await eventStore.getEvents(sessionId);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(event);
  });
  
  it('should save and load snapshots', async () => {
    const snapshot = createTestSnapshot();
    await eventStore.saveSnapshot(sessionId, snapshot);
    
    const loaded = await eventStore.loadSnapshot(sessionId);
    expect(loaded).toEqual(snapshot);
  });
});
```

### Tests d'intégration

```typescript
describe('StateReconstructor', () => {
  it('should reconstruct state from events', async () => {
    const events = createTestEvents();
    for (const event of events) {
      await eventStore.append(sessionId, event);
    }
    
    const state = await reconstructor.reconstruct(sessionId);
    expect(state.currentStage).toBe('deep');
    expect(state.turnCount).toBe(5);
  });
  
  it('should use snapshot for optimization', async () => {
    const snapshot = createTestSnapshot({ version: 100 });
    await eventStore.saveSnapshot(sessionId, snapshot);
    
    const state = await reconstructor.reconstruct(sessionId);
    // Vérifier que le snapshot est utilisé
  });
});
```

---

## Checklist

### Avant implémentation

- [ ] Event Store interface définie
- [ ] State Reconstructor interface définie
- [ ] Event Aggregator interface définie
- [ ] Schémas d'événements définis
- [ ] Versioning strategy définie
- [ ] Snapshot strategy définie

### Après implémentation

- [ ] Event Store Redis implémenté
- [ ] State Reconstructor implémenté
- [ ] Event Aggregator implémenté
- [ ] Snapshot automatique fonctionnel
- [ ] Event versioning fonctionnel
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Performance acceptable (< 100ms pour reconstitution)

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Event Store interface | 1 jour |
| Event Store Redis implémenté | 2 jours |
| State Reconstructor | 3 jours |
| Snapshot strategy | 2 jours |
| Event Aggregator | 2 jours |
| Event versioning | 2 jours |
| Tests | 2 jours |
| **Total** | **14 jours (~2 semaines)** |

---

## Conclusion

L'Event Sourcing permet :

1. **Audit trail complet** : Chaque décision est tracée
2. **Reconstitution exacte** : Replay parfait à tout moment
3. **Debugging avancé** : Peut rejouer un scénario exact
4. **Analytics temporelle** : Analyse des décisions dans le temps
5. **Rollback possible** : Peut revenir à un état précédent
6. **Optimisation** : Snapshots pour performance
7. **Versioning** : Migration des schémas d'événements
