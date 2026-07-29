# Blueprint V3 - Contrats TypeScript (DTO, Events, Commands)

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Principes

### 1. Versioning

Tous les contrats sont versionnés selon **Semantic Versioning** :
- `MAJOR` : Breaking change incompatible
- `MINOR` : Ajout de fonctionnalités (backward compatible)
- `PATCH` : Correction de bugs (backward compatible)

### 2. Séparation des préoccupations

Les contrats sont organisés selon **CQRS** :
- **Commands** : Intentions (écriture)
- **Events** : Faits (lecture)
- **DTOs** : Transfert de données
- **Value Objects** : Objets de valeur du domaine

### 3. Immutabilité

Tous les contrats sont **immutables** :
- Utilisation de `readonly`
- Pas de mutation après création
- Validation à la construction

### 4. Validation

Tous les contrats sont validés avec **Zod** :
- Schémas Zod pour chaque contrat
- Validation à la construction
- Erreurs descriptives

---

## Structure des Contrats

```
libs/contracts/src/
├── commands/
│   ├── interview/
│   │   ├── v1/
│   │   │   ├── create-interview.command.ts
│   │   │   ├── start-interview.command.ts
│   │   │   ├── complete-interview.command.ts
│   │   │   └── index.ts
│   │   └── v2/ (future)
│   └── session/
│       ├── v1/
│       │   ├── create-session.command.ts
│       │   ├── join-session.command.ts
│       │   └── index.ts
├── events/
│   ├── interview/
│   │   ├── v1/
│   │   │   ├── interview-created.event.ts
│   │   │   ├── interview-started.event.ts
│   │   │   ├── interview-completed.event.ts
│   │   │   └── index.ts
│   │   └── v2/ (future)
│   ├── session/
│   │   ├── v1/
│   │   │   ├── session-created.event.ts
│   │   │   ├── session-joined.event.ts
│   │   │   └── index.ts
│   └── evaluation/
│       ├── v1/
│       │   ├── evaluation-updated.event.ts
│       │   └── index.ts
├── dtos/
│   ├── interview/
│   │   ├── v1/
│   │   │   ├── interview.dto.ts
│   │   │   └── index.ts
│   └── session/
│       ├── v1/
│       │   ├── session.dto.ts
│       │   └── index.ts
└── shared/
    ├── v1/
    │   ├── pagination.dto.ts
    │   └── index.ts
```

---

## Commands

### Interview Commands

#### CreateInterviewCommand

**Version** : 1.0.0  
**Purpose** : Créer une nouvelle entretien

```typescript
import { z } from 'zod';

/**
 * Commande pour créer un entretien
 * @version 1.0.0
 */
export const CreateInterviewCommandSchema = z.object({
  /** ID de la commande (UUID v4) */
  commandId: z.string().uuid(),
  /** ID de l'utilisateur */
  userId: z.string().uuid(),
  /** ID du plan d'entretien */
  planId: z.string().uuid(),
  /** ID du persona */
  personaId: z.string().uuid(),
  /** Niveau de difficulté initial (1-10) */
  initialDifficulty: z.number().min(1).max(10).default5),
  /** Timestamp de la commande */
  timestamp: z.date(),
  /** Corrélation ID pour le tracing distribué */
  correlationId: z.string().uuid().optional(),
  /** Causation ID (commande qui a causé cette commande) */
  causationId: z.string().uuid().optional(),
});

export type CreateInterviewCommand = z.infer<typeof CreateInterviewCommandSchema>;

/**
 * Factory pour créer une commande
 */
export class CreateInterviewCommandFactory {
  static create(input: {
    userId: string;
    planId: string;
    personaId: string;
    initialDifficulty?: number;
    correlationId?: string;
    causationId?: string;
  }): CreateInterviewCommand {
    return {
      commandId: crypto.randomUUID(),
      userId: input.userId,
      planId: input.planId,
      personaId: input.personaId,
      initialDifficulty: input.initialDifficulty ?? 5,
      timestamp: new Date(),
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

#### StartInterviewCommand

**Version** : 1.0.0  
**Purpose** : Démarrer un entretien

```typescript
import { z } from 'zod';

/**
 * Commande pour démarrer un entretien
 * @version 1.0.0
 */
export const StartInterviewCommandSchema = z.object({
  commandId: z.string().uuid(),
  interviewId: z.string().uuid(),
  timestamp: z.date(),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type StartInterviewCommand = z.infer<typeof StartInterviewCommandSchema>;

export class StartInterviewCommandFactory {
  static create(input: {
    interviewId: string;
    correlationId?: string;
    causationId?: string;
  }): StartInterviewCommand {
    return {
      commandId: crypto.randomUUID(),
      interviewId: input.interviewId,
      timestamp: new Date(),
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

#### CompleteInterviewCommand

**Version** : 1.0.0  
**Purpose** : Compléter un entretien

```typescript
import { z } from 'zod';

/**
 * Commande pour compléter un entretien
 * @version 1.0.0
 */
export const CompleteInterviewCommandSchema = z.object({
  commandId: z.string().uuid(),
  interviewId: z.string().uuid(),
  /** Raison de la complétion */
  reason: z.enum(['completed', 'cancelled', 'timeout', 'error']),
  /** Message d'erreur si reason = error */
  errorMessage: z.string().optional(),
  timestamp: z.date(),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type CompleteInterviewCommand = z.infer<typeof CompleteInterviewCommandSchema>;

export class CompleteInterviewCommandFactory {
  static create(input: {
    interviewId: string;
    reason: 'completed' | 'cancelled' | 'timeout' | 'error';
    errorMessage?: string;
    correlationId?: string;
    causationId?: string;
  }): CompleteInterviewCommand {
    return {
      commandId: crypto.randomUUID(),
      interviewId: input.interviewId,
      reason: input.reason,
      errorMessage: input.errorMessage,
      timestamp: new Date(),
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

### Session Commands

#### CreateSessionCommand

**Version** : 1.0.0  
**Purpose** : Créer une session vocale

```typescript
import { z } from 'zod';

/**
 * Commande pour créer une session vocale
 * @version 1.0.0
 */
export const CreateSessionCommandSchema = z.object({
  commandId: z.string().uuid(),
  interviewId: z.string().uuid(),
  /** ID de la session (UUID v4) */
  sessionId: z.string().uuid(),
  /** Token JWT pour l'authentification */
  jwtToken: z.string(),
  timestamp: z.date(),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type CreateSessionCommand = z.infer<typeof CreateSessionCommandSchema>;

export class CreateSessionCommandFactory {
  static create(input: {
    interviewId: string;
    jwtToken: string;
    correlationId?: string;
    causationId?: string;
  }): CreateSessionCommand {
    return {
      commandId: crypto.randomUUID(),
      interviewId: input.interviewId,
      sessionId: crypto.randomUUID(),
      jwtToken: input.jwtToken,
      timestamp: new Date(),
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

---

## Events

### Interview Events

#### InterviewCreatedEvent

**Version** : 1.0.0  
**Purpose** : Événement émis lors de la création d'un entretien

```typescript
import { z } from 'zod';

/**
 * Événement émis lors de la création d'un entretien
 * @version 1.0.0
 */
export const InterviewCreatedEventSchema = z.object({
  /** ID de l'événement (UUID v4) */
  eventId: z.string().uuid(),
  /** Type de l'événement */
  eventType: z.literal('InterviewCreated'),
  /** ID de l'entretien */
  interviewId: z.string().uuid(),
  /** ID de l'utilisateur */
  userId: z.string().uuid(),
  /** ID du plan d'entretien */
  planId: z.string().uuid(),
  /** ID du persona */
  personaId: z.string().uuid(),
  /** Niveau de difficulté initial */
  initialDifficulty: z.number().min(1).max(10),
  /** Timestamp de l'événement */
  timestamp: z.date(),
  /** Version du schéma de l'événement */
  version: z.literal('1.0.0'),
  /** Corrélation ID pour le tracing distribué */
  correlationId: z.string().uuid().optional(),
  /** Causation ID (événement qui a causé cet événement) */
  causationId: z.string().uuid().optional(),
});

export type InterviewCreatedEvent = z.infer<typeof InterviewCreatedEventSchema>;

export class InterviewCreatedEventFactory {
  static create(input: {
    interviewId: string;
    userId: string;
    planId: string;
    personaId: string;
    initialDifficulty: number;
    correlationId?: string;
    causationId?: string;
  }): InterviewCreatedEvent {
    return {
      eventId: crypto.randomUUID(),
      eventType: 'InterviewCreated',
      interviewId: input.interviewId,
      userId: input.userId,
      planId: input.planId,
      personaId: input.personaId,
      initialDifficulty: input.initialDifficulty,
      timestamp: new Date(),
      version: '1.0.0',
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

#### InterviewStartedEvent

**Version** : 1.0.0  
**Purpose** : Événement émis lors du démarrage d'un entretien

```typescript
import { z } from 'zod';

/**
 * Événement émis lors du démarrage d'un entretien
 * @version 1.0.0
 */
export const InterviewStartedEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal('InterviewStarted'),
  interviewId: z.string().uuid(),
  timestamp: z.date(),
  version: z.literal('1.0.0'),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type InterviewStartedEvent = z.infer<typeof InterviewStartedEventSchema>;

export class InterviewStartedEventFactory {
  static create(input: {
    interviewId: string;
    correlationId?: string;
    causationId?: string;
  }): InterviewStartedEvent {
    return {
      eventId: crypto.randomUUID(),
      eventType: 'InterviewStarted',
      interviewId: input.interviewId,
      timestamp: new Date(),
      version: '1.0.0',
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

#### InterviewCompletedEvent

**Version** : 1.0.0  
**Purpose** : Événement émis lors de la complétion d'un entretien

```typescript
import { z } from 'zod';

/**
 * Événement émis lors de la complétion d'un entretien
 * @version 1.0.0
 */
export const InterviewCompletedEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal('InterviewCompleted'),
  interviewId: z.string().uuid(),
  /** Raison de la complétion */
  reason: z.enum(['completed', 'cancelled', 'timeout', 'error']),
  /** Score final de l'entretien */
  finalScore: z.number().min(0).max(100),
  /** Durée de l'entretien en secondes */
  duration: z.number().min(0),
  timestamp: z.date(),
  version: z.literal('1.0.0'),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type InterviewCompletedEvent = z.infer<typeof InterviewCompletedEventSchema>;

export class InterviewCompletedEventFactory {
  static create(input: {
    interviewId: string;
    reason: 'completed' | 'cancelled' | 'timeout' | 'error';
    finalScore: number;
    duration: number;
    correlationId?: string;
    causationId?: string;
  }): InterviewCompletedEvent {
    return {
      eventId: crypto.randomUUID(),
      eventType: 'InterviewCompleted',
      interviewId: input.interviewId,
      reason: input.reason,
      finalScore: input.finalScore,
      duration: input.duration,
      timestamp: new Date(),
      version: '1.0.0',
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

### Session Events

#### SessionCreatedEvent

**Version** : 1.0.0  
**Purpose** : Événement émis lors de la création d'une session

```typescript
import { z } from 'zod';

/**
 * Événement émis lors de la création d'une session
 * @version 1.0.0
 */
export const SessionCreatedEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal('SessionCreated'),
  sessionId: z.string().uuid(),
  interviewId: z.string().uuid(),
  timestamp: z.date(),
  version: z.literal('1.0.0'),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type SessionCreatedEvent = z.infer<typeof SessionCreatedEventSchema>;

export class SessionCreatedEventFactory {
  static create(input: {
    sessionId: string;
    interviewId: string;
    correlationId?: string;
    causationId?: string;
  }): SessionCreatedEvent {
    return {
      eventId: crypto.randomUUID(),
      eventType: 'SessionCreated',
      sessionId: input.sessionId,
      interviewId: input.interviewId,
      timestamp: new Date(),
      version: '1.0.0',
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

#### TranscriptReceivedEvent

**Version** : 1.0.0  
**Purpose** : Événement émis lors de la réception d'un transcript

```typescript
import { z } from 'zod';

/**
 * Événement émis lors de la réception d'un transcript
 * @version 1.0.0
 */
export const TranscriptReceivedEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal('TranscriptReceived'),
  sessionId: z.string().uuid(),
  interviewId: z.string().uuid(),
  /** Numéro du tour */
  turnNumber: z.number().min(1),
  /** Transcript du candidat */
  transcript: z.string().min(1),
  /** Indique si le transcript est final */
  isFinal: z.boolean(),
  timestamp: z.date(),
  version: z.literal('1.0.0'),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type TranscriptReceivedEvent = z.infer<typeof TranscriptReceivedEventSchema>;

export class TranscriptReceivedEventFactory {
  static create(input: {
    sessionId: string;
    interviewId: string;
    turnNumber: number;
    transcript: string;
    isFinal: boolean;
    correlationId?: string;
    causationId?: string;
  }): TranscriptReceivedEvent {
    return {
      eventId: crypto.randomUUID(),
      eventType: 'TranscriptReceived',
      sessionId: input.sessionId,
      interviewId: input.interviewId,
      turnNumber: input.turnNumber,
      transcript: input.transcript,
      isFinal: input.isFinal,
      timestamp: new Date(),
      version: '1.0.0',
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

### Evaluation Events

#### EvaluationUpdatedEvent

**Version** : 1.0.0  
**Purpose** : Événement émis lors de la mise à jour de l'évaluation

```typescript
import { z } from 'zod';

/**
 * Événement émis lors de la mise à jour de l'évaluation
 * @version 1.0.0
 */
export const EvaluationUpdatedEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal('EvaluationUpdated'),
  interviewId: z.string().uuid(),
  /** Numéro du tour */
  turnNumber: z.number().min(1),
  /** Score global */
  overallScore: z.number().min(0).max(100),
  /** Scores par compétence */
  competencies: z.record(
    z.string(),
    z.object({
      score: z.number().min(0).max(100),
      confidence: z.number().min(0).max(1),
      evidence: z.array(z.string()),
    })
  ),
  timestamp: z.date(),
  version: z.literal('1.0.0'),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
});

export type EvaluationUpdatedEvent = z.infer<typeof EvaluationUpdatedEventSchema>;

export class EvaluationUpdatedEventFactory {
  static create(input: {
    interviewId: string;
    turnNumber: number;
    overallScore: number;
    competencies: Record<string, {
      score: number;
      confidence: number;
      evidence: string[];
    }>;
    correlationId?: string;
    causationId?: string;
  }): EvaluationUpdatedEvent {
    return {
      eventId: crypto.randomUUID(),
      eventType: 'EvaluationUpdated',
      interviewId: input.interviewId,
      turnNumber: input.turnNumber,
      overallScore: input.overallScore,
      competencies: input.competencies,
      timestamp: new Date(),
      version: '1.0.0',
      correlationId: input.correlationId,
      causationId: input.causationId,
    };
  }
}
```

---

## DTOs

### Interview DTO

#### InterviewDTO

**Version** : 1.0.0  
**Purpose** : DTO pour transférer les données d'un entretien

```typescript
import { z } from 'zod';

/**
 * DTO pour transférer les données d'un entretien
 * @version 1.0.0
 */
export const InterviewDTOSchema = z.object({
  interviewId: z.string().uuid(),
  userId: z.string().uuid(),
  planId: z.string().uuid(),
  personaId: z.string().uuid(),
  /** État de l'entretien */
  state: z.enum(['created', 'started', 'in_progress', 'completed', 'cancelled']),
  /** Stage actuel */
  currentStage: z.string(),
  /** Score actuel */
  currentScore: z.number().min(0).max(100),
  /** Difficulté actuelle */
  currentDifficulty: z.number().min(1).max(10),
  /** Timestamp de création */
  createdAt: z.date(),
  /** Timestamp de début */
  startedAt: z.date().nullable(),
  /** Timestamp de fin */
  completedAt: z.date().nullable(),
  /** Durée en secondes */
  duration: z.number().min(0).nullable(),
});

export type InterviewDTO = z.infer<typeof InterviewDTOSchema>;

export class InterviewDTOFactory {
  static fromDomain(domain: InterviewEntity): InterviewDTO {
    return {
      interviewId: domain.id,
      userId: domain.userId,
      planId: domain.planId,
      personaId: domain.personaId,
      state: domain.state,
      currentStage: domain.currentStage,
      currentScore: domain.currentScore,
      currentDifficulty: domain.currentDifficulty,
      createdAt: domain.createdAt,
      startedAt: domain.startedAt,
      completedAt: domain.completedAt,
      duration: domain.duration,
    };
  }
}
```

### Session DTO

#### SessionDTO

**Version** : 1.0.0  
**Purpose** : DTO pour transférer les données d'une session

```typescript
import { z } from 'zod';

/**
 * DTO pour transférer les données d'une session
 * @version 1.0.0
 */
export const SessionDTOSchema = z.object({
  sessionId: z.string().uuid(),
  interviewId: z.string().uuid(),
  /** État de la session */
  state: z.enum(['created', 'active', 'disconnected', 'completed']),
  /** Timestamp de création */
  createdAt: z.date(),
  /** Timestamp de connexion */
  connectedAt: z.date().nullable(),
  /** Timestamp de déconnexion */
  disconnectedAt: z.date().nullable(),
  /** Durée en secondes */
  duration: z.number().min(0).nullable(),
});

export type SessionDTO = z.infer<typeof SessionDTOSchema>;

export class SessionDTOFactory {
  static fromDomain(domain: SessionEntity): SessionDTO {
    return {
      sessionId: domain.id,
      interviewId: domain.interviewId,
      state: domain.state,
      createdAt: domain.createdAt,
      connectedAt: domain.connectedAt,
      disconnectedAt: domain.disconnectedAt,
      duration: domain.duration,
    };
  }
}
```

---

## Shared DTOs

### Pagination DTO

**Version** : 1.0.0  
**Purpose** : DTO pour la pagination

```typescript
import { z } from 'zod';

/**
 * DTO pour la pagination
 * @version 1.0.0
 */
export const PaginationDTOSchema = z.object({
  /** Numéro de page (1-based) */
  page: z.number().min(1).default(1),
  /** Nombre d'éléments par page */
  limit: z.number().min(1).max(100).default(20),
  /** Nombre total d'éléments */
  total: z.number().min(0),
  /** Nombre total de pages */
  totalPages: z.number().min(0),
});

export type PaginationDTO = z.infer<typeof PaginationDTOSchema>;

export class PaginationDTOFactory {
  static create(input: {
    page?: number;
    limit?: number;
    total: number;
  }): PaginationDTO {
    const limit = input.limit ?? 20;
    const totalPages = Math.ceil(input.total / limit);

    return {
      page: input.page ?? 1,
      limit,
      total: input.total,
      totalPages,
    };
  }
}
```

---

## Versioning Strategy

### Migration des contrats

Lorsqu'un contrat doit évoluer vers une nouvelle version majeure :

1. **Créer le nouveau contrat** dans le dossier `v2/`
2. **Implémenter un migrateur** pour convertir v1 → v2
3. **Déployer le nouveau contrat** avec feature flag
4. **Migrer les données existantes** en arrière-plan
5. **Activer le nouveau contrat** progressivement
6. **Supprimer l'ancien contrat** après migration complète

### Exemple de migration

```typescript
/**
 * Migrateur pour InterviewCreatedEvent v1 → v2
 */
export class InterviewCreatedEventMigrator {
  static migrateV1ToV2(event: InterviewCreatedEventV1): InterviewCreatedEventV2 {
    return {
      eventId: event.eventId,
      eventType: 'InterviewCreated',
      interviewId: event.interviewId,
      userId: event.userId,
      planId: event.planId,
      personaId: event.personaId,
      initialDifficulty: event.initialDifficulty,
      // Nouveau champ ajouté en v2
      targetRole: this.inferTargetRole(event.planId),
      timestamp: event.timestamp,
      version: '2.0.0',
      correlationId: event.correlationId,
      causationId: event.causationId,
    };
  }

  private static inferTargetRole(planId: string): string {
    // Logique pour inférer le rôle cible
    return 'Software Engineer';
  }
}
```

---

## Validation

### Validation à la construction

Tous les contrats sont validés à la construction :

```typescript
import { CreateInterviewCommandSchema } from './commands/interview/v1/create-interview.command';

const command = CreateInterviewCommandFactory.create({
  userId: 'invalid-uuid', // UUID invalide
  planId: crypto.randomUUID(),
  personaId: crypto.randomUUID(),
});

const result = CreateInterviewCommandSchema.safeParse(command);

if (!result.success) {
  console.error('Validation error:', result.error);
  // Gérer l'erreur
}
```

### Validation des événements

Les événements sont validés avant publication :

```typescript
const event = InterviewCreatedEventFactory.create({
  interviewId: crypto.randomUUID(),
  userId: crypto.randomUUID(),
  planId: crypto.randomUUID(),
  personaId: crypto.randomUUID(),
  initialDifficulty: 5,
});

const result = InterviewCreatedEventSchema.safeParse(event);

if (!result.success) {
  throw new Error(`Invalid event: ${result.error.message}`);
}

await eventBus.publish(event);
```

---

## Observability

### Tracing distribué

Tous les contrats incluent des champs pour le tracing distribué :

- `correlationId` : ID de corrélation pour tracer une requête à travers les services
- `causationId` : ID de l'événement/commande qui a causé cet événement/commande

### Exemple de tracing

```typescript
// Commande avec correlationId
const command = CreateInterviewCommandFactory.create({
  userId: userId,
  planId: planId,
  personaId: personaId,
  correlationId: traceId, // ID de trace OpenTelemetry
});

// Événement avec causationId
const event = InterviewCreatedEventFactory.create({
  interviewId: interviewId,
  userId: userId,
  planId: planId,
  personaId: personaId,
  initialDifficulty: 5,
  causationId: command.commandId, // Lien avec la commande
});
```

---

## Backward Compatibility

### Règles de compatibilité

1. **Ajouter des champs** : OK (backward compatible)
2. **Supprimer des champs** : Breaking change (nouvelle version majeure)
3. **Renommer des champs** : Breaking change (nouvelle version majeure)
4. **Changer le type d'un champ** : Breaking change (nouvelle version majeure)
5. **Changer les contraintes** : Breaking change (nouvelle version majeure)

### Exemple d'ajout de champ (backward compatible)

```typescript
// v1.0.0
export const InterviewCreatedEventSchemaV1 = z.object({
  eventId: z.string().uuid(),
  eventType: z.literal('InterviewCreated'),
  interviewId: z.string().uuid(),
  userId: z.string().uuid(),
  planId: z.string().uuid(),
  personaId: z.string().uuid(),
  initialDifficulty: z.number().min(1).max(10),
  timestamp: z.date(),
  version: z.literal('1.0.0'),
});

// v1.1.0 (backward compatible)
export const InterviewCreatedEventSchemaV1_1 = InterviewCreatedEventSchemaV1.extend({
  // Nouveau champ optionnel
  targetRole: z.string().optional(),
  version: z.literal('1.1.0'),
});
```

---

## Tests

### Tests de validation

```typescript
describe('CreateInterviewCommand', () => {
  it('should validate a valid command', () => {
    const command = CreateInterviewCommandFactory.create({
      userId: crypto.randomUUID(),
      planId: crypto.randomUUID(),
      personaId: crypto.randomUUID(),
    });

    const result = CreateInterviewCommandSchema.safeParse(command);

    expect(result.success).toBe(true);
  });

  it('should reject invalid userId', () => {
    const command = CreateInterviewCommandFactory.create({
      userId: 'invalid-uuid',
      planId: crypto.randomUUID(),
      personaId: crypto.randomUUID(),
    });

    const result = CreateInterviewCommandSchema.safeParse(command);

    expect(result.success).toBe(false);
  });

  it('should reject invalid initialDifficulty', () => {
    const command = CreateInterviewCommandFactory.create({
      userId: crypto.randomUUID(),
      planId: crypto.randomUUID(),
      personaId: crypto.randomUUID(),
      initialDifficulty: 15, // > 10
    });

    const result = CreateInterviewCommandSchema.safeParse(command);

    expect(result.success).toBe(false);
  });
});
```

---

## Conclusion

Ce document définit les contrats TypeScript versionnés pour l'architecture V2 Enterprise. Les contrats respectent les principes DDD, CQRS, Event Sourcing, et garantissent la backward compatibility.

**Prochaines étapes :**
- Spécification des événements (Redis/BullMQ)
- FSM détaillées
- Diagrammes de séquence complets
- Plan de migration zéro interruption
