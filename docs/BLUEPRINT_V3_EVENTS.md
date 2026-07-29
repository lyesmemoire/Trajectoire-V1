# Blueprint V3 - Spécification Événements (Redis/BullMQ)

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Architecture Event Bus

### Composants

```
┌─────────────────────────────────────────────────────────┐
│                    Event Bus Layer                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Redis Streams (Real-time Events)                  │  │
│  │  - interview:{sessionId}                          │  │
│  │  - session:{sessionId}                            │  │
│  │  - evaluation:{sessionId}                         │  │
│  │  - director:{sessionId}                            │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  BullMQ (Async Jobs)                              │  │
│  │  - interview-creation-queue                       │  │
│  │  - evaluation-queue                               │  │
│  │  - report-generation-queue                        │  │
│  │  - notification-queue                             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Redis Streams

**Purpose** : Événements temps réel pour la communication entre services

**Caractéristiques** :
- Append-only log
- Consumer groups pour la consommation parallèle
- XREAD pour la lecture en temps réel
- XRANGE pour la lecture historique
- XTRIM pour la limitation de taille

### BullMQ

**Purpose** : Jobs asynchrones pour les tâches de fond

**Caractéristiques** :
- Queue de jobs
- Retry automatique
- Priorité
- Rate limiting
- Dead letter queue

---

## Redis Streams Configuration

### Stream Keys

```typescript
const STREAM_KEYS = {
  INTERVIEW: (sessionId: string) => `interview:${sessionId}`,
  SESSION: (sessionId: string) => `session:${sessionId}`,
  EVALUATION: (sessionId: string) => `evaluation:${sessionId}`,
  DIRECTOR: (sessionId: string) => `director:${sessionId}`,
  MEMORY: (sessionId: string) => `memory:${sessionId}`,
  SPEECH: (sessionId: string) => `speech:${sessionId}`,
  OPENAI: (sessionId: string) => `openai:${sessionId}`,
} as const;
```

### Consumer Groups

```typescript
const CONSUMER_GROUPS = {
  ORCHESTRATOR: 'orchestrator',
  EVALUATION: 'evaluation',
  REPORTING: 'reporting',
  NOTIFICATION: 'notification',
  ANALYTICS: 'analytics',
} as const;
```

### Stream Configuration

```typescript
const STREAM_CONFIG = {
  MAXLEN: 10000, // Garder 10k événements par stream
  TTL: 86400 * 7, // 7 jours de rétention
  BLOCK_MS: 5000, // 5 secondes de blocage pour XREAD
} as const;
```

---

## Event Publishing

### Publisher Interface

```typescript
interface EventPublisher {
  publish(streamKey: string, event: BaseEvent): Promise<string>;
  publishBatch(streamKey: string, events: BaseEvent[]): Promise<string[]>;
}

class RedisEventPublisher implements EventPublisher {
  constructor(private redis: Redis) {}

  async publish(streamKey: string, event: BaseEvent): Promise<string> {
    const eventId = `${event.eventType}:${event.eventId}`;
    
    const messageId = await this.redis.xadd(
      streamKey,
      '*',
      {
        eventId,
        eventType: event.eventType,
        sessionId: event.sessionId,
        timestamp: event.timestamp.toISOString(),
        version: event.version,
        payload: JSON.stringify(event),
      },
      {
        TRIM: {
          strategy: 'MAXLEN',
          threshold: STREAM_CONFIG.MAXLEN,
          approximate: true,
        },
      }
    );

    return messageId;
  }

  async publishBatch(streamKey: string, events: BaseEvent[]): Promise<string[]> {
    const pipeline = this.redis.pipeline();
    
    for (const event of events) {
      const eventId = `${event.eventType}:${event.eventId}`;
      pipeline.xadd(
        streamKey,
        '*',
        {
          eventId,
          eventType: event.eventType,
          sessionId: event.sessionId,
          timestamp: event.timestamp.toISOString(),
          version: event.version,
          payload: JSON.stringify(event),
        }
      );
    }

    const results = await pipeline.exec();
    return results?.map(r => r[1] as string) ?? [];
  }
}
```

---

## Event Consumption

### Consumer Interface

```typescript
interface EventConsumer {
  subscribe(
    streamKey: string,
    consumerGroup: string,
    consumerName: string,
    handler: EventHandler
  ): Promise<void>;
  unsubscribe(streamKey: string, consumerGroup: string, consumerName: string): Promise<void>;
}

type EventHandler = (event: BaseEvent) => Promise<void>;

class RedisEventConsumer implements EventConsumer {
  constructor(private redis: Redis) {}

  async subscribe(
    streamKey: string,
    consumerGroup: string,
    consumerName: string,
    handler: EventHandler
  ): Promise<void> {
    // Créer le consumer group si inexistant
    try {
      await this.redis.xgroup('CREATE', streamKey, consumerGroup, '0', 'MKSTREAM');
    } catch (error) {
      // Le group existe déjà
    }

    // Boucle de consommation
    while (true) {
      const messages = await this.redis.xreadgroup(
        'GROUP',
        consumerGroup,
        consumerName,
        'COUNT',
        10,
        'BLOCK',
        STREAM_CONFIG.BLOCK_MS,
        'STREAMS',
        streamKey,
        '>'
      );

      if (messages && messages.length > 0) {
        for (const message of messages) {
          const [stream, events] = message;
          
          for (const event of events) {
            const [id, fields] = event;
            const payload = JSON.parse(fields.payload as string);
            
            try {
              await handler(payload);
              
              // Acknowledge le message
              await this.redis.xack(streamKey, consumerGroup, id);
            } catch (error) {
              console.error('Error handling event:', error);
              // Le message sera retraité après le delivery timeout
            }
          }
        }
      }
    }
  }
}
```

---

## BullMQ Queues

### Queue Configuration

```typescript
const QUEUE_CONFIG = {
  INTERVIEW_CREATION: {
    name: 'interview-creation-queue',
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  },
  EVALUATION: {
    name: 'evaluation-queue',
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  },
  REPORT_GENERATION: {
    name: 'report-generation-queue',
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 50,
      removeOnFail: 25,
    },
  },
  NOTIFICATION: {
    name: 'notification-queue',
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 200,
      removeOnFail: 100,
    },
  },
} as const;
```

### Job Processor

```typescript
interface JobProcessor<T, R> {
  process(job: Job<T>): Promise<R>;
}

class EvaluationJobProcessor implements JobProcessor<EvaluationJobData, EvaluationResult> {
  async process(job: Job<EvaluationJobData>): Promise<EvaluationResult> {
    const { sessionId, transcript, turnNumber } = job.data;

    // Logique d'évaluation
    const result = await this.evaluationService.evaluate({
      sessionId,
      transcript,
      turnNumber,
    });

    return result;
  }
}
```

### Queue Manager

```typescript
class BullQueueManager {
  private queues: Map<string, Queue> = new Map();

  constructor(private redis: Redis) {}

  getQueue<T>(name: string, config: QueueConfig): Queue<T> {
    if (!this.queues.has(name)) {
      const queue = new Queue<T>(name, {
        connection: this.redis,
        defaultJobOptions: config.defaultJobOptions,
      });
      this.queues.set(name, queue);
    }

    return this.queues.get(name)!;
  }

  async addJob<T>(
    queueName: string,
    data: T,
    options?: JobsOptions
  ): Promise<Job<T>> {
    const config = QUEUE_CONFIG[queueName as keyof typeof QUEUE_CONFIG];
    const queue = this.getQueue<T>(queueName, config);

    return queue.add(data, options);
  }

  async getJob<T>(queueName: string, jobId: string): Promise<Job<T> | null> {
    const config = QUEUE_CONFIG[queueName as keyof typeof QUEUE_CONFIG];
    const queue = this.getQueue<T>(queueName, config);

    return queue.getJob(jobId);
  }
}
```

---

## Event Sourcing Implementation

### Event Store

```typescript
interface EventStore {
  append(sessionId: string, event: BaseEvent): Promise<void>;
  getEvents(sessionId: string): Promise<BaseEvent[]>;
  getEventsRange(sessionId: string, from: Date, to: Date): Promise<BaseEvent[]>;
  getEventsFromVersion(sessionId: string, version: number): Promise<BaseEvent[]>;
  deleteEvents(sessionId: string): Promise<void>;
}

class RedisEventStore implements EventStore {
  constructor(private redis: Redis) {}

  async append(sessionId: string, event: BaseEvent): Promise<void> {
    const streamKey = STREAM_KEYS.INTERVIEW(sessionId);
    const publisher = new RedisEventPublisher(this.redis);
    
    await publisher.publish(streamKey, event);
  }

  async getEvents(sessionId: string): Promise<BaseEvent[]> {
    const streamKey = STREAM_KEYS.INTERVIEW(sessionId);
    
    const events = await this.redis.xrange(streamKey, '-', '+');
    
    return events.map(e => {
      const fields = e[1] as Record<string, string>;
      return JSON.parse(fields.payload) as BaseEvent;
    });
  }

  async getEventsRange(sessionId: string, from: Date, fromTimestamp: number, to: Date, toTimestamp: number): Promise<BaseEvent[]> {
    const streamKey = STREAM_KEYS.INTERVIEW(sessionId);
    
    const events = await this.redis.xrange(
      streamKey,
      fromTimestamp.toString(),
      toTimestamp.toString()
    );
    
    return events.map(e => {
      const fields = e[1] as Record<string, string>;
      return JSON.parse(fields.payload) as BaseEvent;
    });
  }

  async getEventsFromVersion(sessionId: string, version: number): Promise<BaseEvent[]> {
    const allEvents = await this.getEvents(sessionId);
    
    return allEvents.filter(e => {
      const eventVersion = parseFloat(e.version);
      return eventVersion >= version;
    });
  }

  async deleteEvents(sessionId: string): Promise<void> {
    const streamKey = STREAM_KEYS.INTERVIEW(sessionId);
    await this.redis.del(streamKey);
  }
}
```

---

## Snapshot Strategy

### Snapshot Interface

```typescript
interface SnapshotStore {
  save(sessionId: string, snapshot: StateSnapshot): Promise<void>;
  load(sessionId: string): Promise<StateSnapshot | null>;
  delete(sessionId: string): Promise<void>;
}

class RedisSnapshotStore implements SnapshotStore {
  constructor(private redis: Redis) {}

  async save(sessionId: string, snapshot: StateSnapshot): Promise<void> {
    const key = `snapshot:${sessionId}`;
    const value = JSON.stringify(snapshot);
    
    await this.redis.set(key, value, 'EX', STREAM_CONFIG.TTL);
  }

  async load(sessionId: string): Promise<StateSnapshot | null> {
    const key = `snapshot:${sessionId}`;
    const value = await this.redis.get(key);
    
    return value ? JSON.parse(value) : null;
  }

  async delete(sessionId: string): Promise<void> {
    const key = `snapshot:${sessionId}`;
    await this.redis.del(key);
  }
}
```

### Snapshot Manager

```typescript
class SnapshotManager {
  private SNAPSHOT_INTERVAL = 100; // Snapshot tous les 100 événements

  constructor(
    private eventStore: EventStore,
    private snapshotStore: SnapshotStore
  ) {}

  async shouldTakeSnapshot(sessionId: string): Promise<boolean> {
    const events = await this.eventStore.getEvents(sessionId);
    return events.length % this.SNAPSHOT_INTERVAL === 0;
  }

  async takeSnapshot(sessionId: string, state: InterviewState): Promise<void> {
    const snapshot: StateSnapshot = {
      sessionId,
      version: state.version,
      timestamp: new Date(),
      state,
      metadata: {
        eventCount: await this.getEventCount(sessionId),
        lastEventType: await this.getLastEventType(sessionId),
      },
    };

    await this.snapshotStore.save(sessionId, snapshot);
  }

  private async getEventCount(sessionId: string): Promise<number> {
    const events = await this.eventStore.getEvents(sessionId);
    return events.length;
  }

  private async getLastEventType(sessionId: string): Promise<string> {
    const events = await this.eventStore.getEvents(sessionId);
    return events[events.length - 1]?.eventType ?? '';
  }
}
```

---

## Event Replay

### Replay Interface

```typescript
interface EventReplayer {
  replay(sessionId: string, toVersion?: number): Promise<InterviewState>;
  replayToTimestamp(sessionId: string, timestamp: Date): Promise<InterviewState>;
}

class RedisEventReplayer implements EventReplayer {
  constructor(
    private eventStore: EventStore,
    private snapshotStore: SnapshotStore,
    private stateReconstructor: StateReconstructor
  ) {}

  async replay(sessionId: string, toVersion?: number): Promise<InterviewState> {
    // Charger le snapshot le plus récent
    const snapshot = await this.snapshotStore.load(sessionId);
    
    let state: InterviewState;
    let fromVersion = 0;

    if (snapshot && (!toVersion || snapshot.version <= toVersion)) {
      state = snapshot.state;
      fromVersion = snapshot.version;
    } else {
      state = this.createInitialState();
    }

    // Charger les événements depuis le snapshot
    const events = toVersion
      ? await this.eventStore.getEventsFromVersion(sessionId, fromVersion)
      : await this.eventStore.getEvents(sessionId);

    // Filtrer jusqu'à la version cible
    const filteredEvents = toVersion
      ? events.filter(e => parseFloat(e.version) <= toVersion)
      : events;

    // Reconstituer l'état
    return this.stateReconstructor.reconstruct(state, filteredEvents);
  }

  async replayToTimestamp(sessionId: string, timestamp: Date): Promise<InterviewState> {
    const events = await this.eventStore.getEventsRange(sessionId, new Date(0), timestamp);
    
    const state = this.createInitialState();
    return this.stateReconstructor.reconstruct(state, events);
  }

  private createInitialState(): InterviewState {
    return {
      id: '',
      userId: '',
      planId: '',
      personaId: '',
      state: 'created',
      currentStage: 'introduction',
      currentScore: 0,
      currentDifficulty: 5,
      version: 0,
      createdAt: new Date(),
      startedAt: null,
      completedAt: null,
      duration: null,
    };
  }
}
```

---

## Monitoring

### Metrics

```typescript
interface EventMetrics {
  // Redis Streams
  streamLength: number;
  streamConsumerGroups: number;
  streamPendingMessages: number;
  
  // BullMQ
  queueSize: number;
  queueActive: number;
  queueCompleted: number;
  queueFailed: number;
  queueDelayed: number;
  
  // Event Store
  eventPublishRate: number;
  eventConsumeRate: number;
  eventLatency: number;
}

class EventMetricsCollector {
  constructor(private redis: Redis) {}

  async collectMetrics(sessionId: string): Promise<EventMetrics> {
    const streamKey = STREAM_KEYS.INTERVIEW(sessionId);
    
    const streamLength = await this.redis.xlen(streamKey);
    const streamInfo = await this.redis.xinfo('GROUPS', streamKey);
    const streamPending = await this.redis.xpending(streamKey, CONSUMER_GROUPS.ORCHESTRATOR);
    
    return {
      streamLength,
      streamConsumerGroups: streamInfo.length,
      streamPendingMessages: parseInt(streamPending[0] as string),
      queueSize: 0, // À implémenter pour BullMQ
      queueActive: 0,
      queueCompleted: 0,
      queueFailed: 0,
      queueDelayed: 0,
      eventPublishRate: 0, // À implémenter avec un counter
      eventConsumeRate: 0, // À implémenter avec un counter
      eventLatency: 0, // À implémenter avec un histogram
    };
  }
}
```

---

## Dead Letter Queue

### DLQ Configuration

```typescript
const DLQ_CONFIG = {
  name: 'event-dlq',
  TTL: 86400 * 30, // 30 jours
  MAX_SIZE: 10000,
} as const;

class DeadLetterQueue {
  constructor(private redis: Redis) {}

  async add(event: BaseEvent, error: Error): Promise<void> {
    const key = `${DLQ_CONFIG.name}:${event.sessionId}`;
    
    await this.redis.xadd(
      key,
      '*',
      {
        eventId: event.eventId,
        eventType: event.eventType,
        sessionId: event.sessionId,
        timestamp: event.timestamp.toISOString(),
        version: event.version,
        payload: JSON.stringify(event),
        error: error.message,
        stack: error.stack,
        failedAt: new Date().toISOString(),
      }
    );
  }

  async getFailedEvents(sessionId: string): Promise<BaseEvent[]> {
    const key = `${DLQ_CONFIG.name}:${sessionId}`;
    const events = await this.redis.xrange(key, '-', '+');
    
    return events.map(e => {
      const fields = e[1] as Record<string, string>;
      return JSON.parse(fields.payload) as BaseEvent;
    });
  }
}
```

---

## Tests

### Tests d'intégration

```typescript
describe('RedisEventBus', () => {
  let redis: Redis;
  let publisher: RedisEventPublisher;
  let consumer: RedisEventConsumer;

  beforeEach(async () => {
    redis = new Redis();
    publisher = new RedisEventPublisher(redis);
    consumer = new RedisEventConsumer(redis);
  });

  afterEach(async () => {
    await redis.quit();
  });

  it('should publish and consume event', async () => {
    const streamKey = STREAM_KEYS.INTERVIEW('test-session');
    const event = createTestEvent();

    const messageId = await publisher.publish(streamKey, event);
    expect(messageId).toBeDefined();

    let consumedEvent: BaseEvent | null = null;
    const handler = async (e: BaseEvent) => {
      consumedEvent = e;
    };

    // Subscribe et consommer
    await consumer.subscribe(streamKey, CONSUMER_GROUPS.ORCHESTRATOR, 'test-consumer', handler);

    // Attendre la consommation
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consumedEvent).toEqual(event);
  });

  it('should handle event batch', async () => {
    const streamKey = STREAM_KEYS.INTERVIEW('test-session');
    const events = [createTestEvent(), createTestEvent(), createTestEvent()];

    const messageIds = await publisher.publishBatch(streamKey, events);
    expect(messageIds).toHaveLength(3);

    const storedEvents = await redis.xrange(streamKey, '-', '+');
    expect(storedEvents).toHaveLength(3);
  });
});
```

---

## Checklist

### Avant implémentation

- [ ] Redis Streams configuration définie
- [ ] BullMQ configuration définie
- [ ] Event Publisher interface définie
- [ ] Event Consumer interface définie
- [ ] Event Store interface définie
- [ ] Snapshot Store interface définie
- [ ] Metrics collector interface définie

### Après implémentation

- [ ] Redis Streams implémenté
- [ ] BullMQ implémenté
- [ ] Event Publisher implémenté
- [ ] Event Consumer implémenté
- [ ] Event Store implémenté
- [ ] Snapshot Store implémenté
- [ ] Snapshot Manager implémenté
- [ ] Event Replayer implémenté
- [ ] Metrics Collector implémenté
- [ ] Dead Letter Queue implémenté
- [ ] Tests d'intégration passent
- [ ] Monitoring en place

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Configuration Redis Streams | 2 jours |
| Configuration BullMQ | 2 jours |
| Event Publisher | 2 jours |
| Event Consumer | 3 jours |
| Event Store | 3 jours |
| Snapshot Store | 2 jours |
| Snapshot Manager | 2 jours |
| Event Replayer | 2 jours |
| Metrics Collector | 2 jours |
| Dead Letter Queue | 1 jour |
| Tests | 3 jours |
| **Total** | **24 jours (~3 semaines)** |

---

## Conclusion

Ce document définit la spécification des événements pour Redis Streams et BullMQ, respectant les principes Event Sourcing, CQRS, et garantissant la scalabilité et la résilience de l'architecture V2 Enterprise.

**Prochaines étapes :**
- FSM détaillées
- Diagrammes de séquence complets
- Plan de migration zéro interruption
