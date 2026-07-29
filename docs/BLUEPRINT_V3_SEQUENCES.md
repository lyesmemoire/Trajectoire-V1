# Blueprint V3 - Diagrammes de Séquence Complets

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Diagramme 1 : Création d'Entretien

### Acteurs

- **Frontend** : Application Next.js
- **API** : API NestJS
- **Interview Orchestrator** : Service NestJS
- **Event Bus** : Redis Streams + BullMQ
- **Database** : Supabase (PostgreSQL)

### Séquence

```
Frontend → API: POST /api/interviews
API → Interview Orchestrator: CreateInterviewCommand
Interview Orchestrator → Interview Orchestrator: Validate command
Interview Orchestrator → Database: Save interview entity
Database → Interview Orchestrator: Interview saved
Interview Orchestrator → Event Bus: Publish InterviewCreatedEvent
Event Bus → Interview Orchestrator: Event published
Interview Orchestrator → API: InterviewDTO
API → Frontend: 201 Created { interviewId, ... }
```

### Détails

1. **Frontend** envoie une commande de création d'entretien
2. **API** valide la requête et transmet la commande à l'Orchestrator
3. **Interview Orchestrator** valide la commande
4. **Interview Orchestrator** sauvegarde l'entretien dans la base de données
5. **Interview Orchestrator** publie l'événement `InterviewCreatedEvent` sur l'Event Bus
6. **Interview Orchestrator** retourne le DTO à l'API
7. **API** retourne la réponse au Frontend

### Contrats

**Commande**
```typescript
CreateInterviewCommand {
  commandId: UUID
  userId: UUID
  planId: UUID
  personaId: UUID
  initialDifficulty: number (1-10)
  timestamp: DateTime
}
```

**Événement**
```typescript
InterviewCreatedEvent {
  eventId: UUID
  eventType: "InterviewCreated"
  interviewId: UUID
  userId: UUID
  planId: UUID
  personaId: UUID
  initialDifficulty: number
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 2 : Démarrage d'Entretien

### Acteurs

- **Frontend** : Application Next.js
- **Gateway** : Fastify Gateway
- **Interview Orchestrator** : Service NestJS
- **Event Bus** : Redis Streams
- **Database** : Supabase

### Séquence

```
Frontend → Gateway: WebSocket connect { jwtToken }
Gateway → Gateway: Validate JWT
Gateway → Interview Orchestrator: CreateSessionCommand
Interview Orchestrator → Database: Save session
Interview Orchestrator → Event Bus: Publish SessionCreatedEvent
Interview Orchestrator → Gateway: SessionDTO
Gateway → Frontend: WebSocket connected { sessionId }
Frontend → Gateway: Start interview { sessionId }
Gateway → Interview Orchestrator: StartInterviewCommand
Interview Orchestrator → Database: Update interview state
Interview Orchestrator → Event Bus: Publish InterviewStartedEvent
Interview Orchestrator → Conversation Director: Initialize
Conversation Director → Interview Planner: Get initial stage
Interview Planner → Conversation Director: Stage { introduction }
Conversation Director → Prompt Orchestrator: Build prompt
Prompt Orchestrator → Context Builder: Build context
Context Builder → Prompt Orchestrator: FilteredContext
Prompt Orchestrator → Conversation Director: PromptResult
Conversation Director → OpenAI Realtime: Generate question
OpenAI Realtime → Conversation Director: Question
Conversation Director → AI Guard: Validate response
AI Guard → Conversation Director: Valid
Conversation Director → Gateway: Send question
Gateway → Frontend: WebSocket message { type: "question", text: "..." }
```

### Détails

1. **Frontend** se connecte via WebSocket avec un JWT token
2. **Gateway** valide le JWT et crée une session
3. **Interview Orchestrator** sauvegarde la session et publie l'événement
4. **Frontend** demande de démarrer l'entretien
5. **Interview Orchestrator** met à jour l'état et publie l'événement
6. **Conversation Director** initialise et demande le stage initial au Planner
7. **Conversation Director** demande au Prompt Orchestrator de construire le prompt
8. **Prompt Orchestrator** demande au Context Builder de filtrer le contexte
9. **Prompt Orchestrator** retourne le prompt au Director
10. **Conversation Director** demande à OpenAI de générer la question
11. **AI Guard** valide la réponse
12. **Gateway** envoie la question au Frontend

### Contrats

**Commande**
```typescript
StartInterviewCommand {
  commandId: UUID
  interviewId: UUID
  timestamp: DateTime
}
```

**Événement**
```typescript
InterviewStartedEvent {
  eventId: UUID
  eventType: "InterviewStarted"
  interviewId: UUID
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 3 : Tour de Parole (Transcript)

### Acteurs

- **Frontend** : Application Next.js
- **Gateway** : Fastify Gateway
- **Interview Orchestrator** : Service NestJS
- **Event Bus** : Redis Streams
- **Conversation Director** : Service NestJS
- **Speech Analyzer** : Service NestJS
- **Evaluation Engine** : Service NestJS
- **Memory Engine** : Service NestJS
- **OpenAI Realtime** : OpenAI API

### Séquence

```
Frontend → Gateway: WebSocket message { type: "transcript", text: "..." }
Gateway → Event Bus: Publish TranscriptReceivedEvent
Event Bus → Interview Orchestrator: Event received
Interview Orchestrator → Conversation Director: Process transcript
Conversation Director → Speech Analyzer: Analyze speech
Speech Analyzer → Conversation Director: SpeechMetrics
Conversation Director → Memory Engine: Update memory
Memory Engine → Conversation Director: MemorySnapshot
Conversation Director → Evaluation Engine: Evaluate
Evaluation Engine → Conversation Director: EvaluationSnapshot
Conversation Director → Conversation Director: Make decision
Conversation Director → Prompt Orchestrator: Build prompt
Prompt Orchestrator → Context Builder: Build context
Context Builder → Prompt Orchestrator: FilteredContext
Prompt Orchestrator → Conversation Director: PromptResult
Conversation Director → OpenAI Realtime: Generate response
OpenAI Realtime → Conversation Director: Response
Conversation Director → AI Guard: Validate response
AI Guard → Conversation Director: Valid
Conversation Director → Event Bus: Publish DirectorDecisionMadeEvent
Event Bus → Interview Orchestrator: Event received
Interview Orchestrator → Gateway: Send response
Gateway → Frontend: WebSocket message { type: "question", text: "..." }
```

### Détails

1. **Frontend** envoie le transcript via WebSocket
2. **Gateway** publie l'événement `TranscriptReceivedEvent`
3. **Interview Orchestrator** reçoit l'événement et transmet au Director
4. **Conversation Director** demande au Speech Analyzer d'analyser la parole
5. **Conversation Director** demande au Memory Engine de mettre à jour la mémoire
6. **Conversation Director** demande à l'Evaluation Engine d'évaluer
7. **Conversation Director** prend une décision
8. **Conversation Director** demande au Prompt Orchestrator de construire le prompt
9. **Conversation Director** demande à OpenAI de générer la réponse
10. **AI Guard** valide la réponse
11. **Conversation Director** publie l'événement `DirectorDecisionMadeEvent`
12. **Gateway** envoie la réponse au Frontend

### Contrats

**Événement**
```typescript
TranscriptReceivedEvent {
  eventId: UUID
  eventType: "TranscriptReceived"
  sessionId: UUID
  interviewId: UUID
  turnNumber: number
  transcript: string
  isFinal: boolean
  timestamp: DateTime
  version: "1.0.0"
}
```

**Événement**
```typescript
DirectorDecisionMadeEvent {
  eventId: UUID
  eventType: "DirectorDecisionMade"
  sessionId: UUID
  interviewId: UUID
  turnNumber: number
  action: DirectorAction
  currentStage: InterviewStage
  currentCompetency: Competency
  reasoning: string
  confidence: number
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 4 : Transition de Stage

### Acteurs

- **Conversation Director** : Service NestJS
- **Interview Planner** : Service NestJS
- **Event Bus** : Redis Streams
- **Database** : Supabase

### Séquence

```
Conversation Director → Interview Planner: Check stage transition
Interview Planner → Interview Planner: Evaluate stage completion
Interview Planner → Conversation Director: StageTransitionRequest { from, to }
Conversation Director → Event Bus: Publish StageTransitionRequestedEvent
Event Bus → Interview Orchestrator: Event received
Interview Orchestrator → Interview Orchestrator: Validate transition
Interview Orchestrator → Event Bus: Publish StageTransitionApprovedEvent
Event Bus → Conversation Director: Event received
Conversation Director → Interview Planner: Get next stage
Interview Planner → Conversation Director: NextStage { stage }
Conversation Director → Event Bus: Publish StageStartedEvent
Event Bus → Interview Orchestrator: Event received
Interview Orchestrator → Database: Update current stage
```

### Détails

1. **Conversation Director** demande au Planner si une transition est possible
2. **Interview Planner** évalue si le stage est complété
3. **Interview Planner** retourne une demande de transition
4. **Conversation Director** publie l'événement `StageTransitionRequestedEvent`
5. **Interview Orchestrator** valide la transition
6. **Interview Orchestrator** publie l'événement `StageTransitionApprovedEvent`
7. **Conversation Director** demande le prochain stage au Planner
8. **Conversation Director** publie l'événement `StageStartedEvent`
9. **Interview Orchestrator** met à jour le stage dans la base de données

### Contrats

**Événement**
```typescript
StageTransitionRequestedEvent {
  eventId: UUID
  eventType: "StageTransitionRequested"
  interviewId: UUID
  fromStage: InterviewStage
  toStage: InterviewStage
  timestamp: DateTime
  version: "1.0.0"
}
```

**Événement**
```typescript
StageStartedEvent {
  eventId: UUID
  eventType: "StageStarted"
  interviewId: UUID
  stage: InterviewStage
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 5 : Complétion d'Entretien

### Acteurs

- **Frontend** : Application Next.js
- **Gateway** : Fastify Gateway
- **Interview Orchestrator** : Service NestJS
- **Event Bus** : Redis Streams
- **Report Generator** : Service NestJS
- **Database** : Supabase

### Séquence

```
Frontend → Gateway: WebSocket message { type: "complete" }
Gateway → Interview Orchestrator: CompleteInterviewCommand
Interview Orchestrator → Interview Orchestrator: Validate completion
Interview Orchestrator → Database: Update interview state
Interview Orchestrator → Event Bus: Publish InterviewCompletedEvent
Event Bus → Report Generator: Event received
Report Generator → Event Store: Get all events
Event Store → Report Generator: Events
Report Generator → Report Generator: Generate report
Report Generator → Database: Save report
Report Generator → Event Bus: Publish ReportGeneratedEvent
Interview Orchestrator → Gateway: InterviewDTO
Gateway → Frontend: WebSocket message { type: "completed", reportId }
Frontend → API: GET /api/reports/{reportId}
API → Database: Get report
Database → API: Report
API → Frontend: 200 OK { report }
```

### Détails

1. **Frontend** demande de compléter l'entretien
2. **Interview Orchestrator** valide et met à jour l'état
3. **Interview Orchestrator** publie l'événement `InterviewCompletedEvent`
4. **Report Generator** reçoit l'événement et récupère tous les événements
5. **Report Generator** génère le rapport
6. **Report Generator** sauvegarde le rapport
7. **Report Generator** publie l'événement `ReportGeneratedEvent`
8. **Gateway** retourne le DTO au Frontend
9. **Frontend** récupère le rapport via l'API

### Contrats

**Commande**
```typescript
CompleteInterviewCommand {
  commandId: UUID
  interviewId: UUID
  reason: "completed" | "cancelled" | "timeout" | "error"
  errorMessage?: string
  timestamp: DateTime
}
```

**Événement**
```typescript
InterviewCompletedEvent {
  eventId: UUID
  eventType: "InterviewCompleted"
  interviewId: UUID
  reason: "completed" | "cancelled" | "timeout" | "error"
  finalScore: number (0-100)
  duration: number (seconds)
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 6 : Replay d'Entretien

### Acteurs

- **Frontend** : Application Next.js
- **API** : NestJS API
- **Replay Generator** : Service NestJS
- **Event Store** : Redis Streams
- **Snapshot Store** : Redis

### Séquence

```
Frontend → API: GET /api/interviews/{interviewId}/replay
API → Replay Generator: Generate replay
Replay Generator → Snapshot Store: Load snapshot
Snapshot Store → Replay Generator: Snapshot
Replay Generator → Event Store: Get events from snapshot version
Event Store → Replay Generator: Events
Replay Generator → Replay Generator: Reconstruct state
Replay Generator → Replay Generator: Generate timeline
Replay Generator → Replay Generator: Generate report
Replay Generator → API: SessionReplayV2
API → Frontend: 200 OK { replay }
```

### Détails

1. **Frontend** demande le replay d'un entretien
2. **Replay Generator** charge le snapshot le plus récent
3. **Replay Generator** récupère les événements depuis la version du snapshot
4. **Replay Generator** reconstitue l'état en appliquant les événements
5. **Replay Generator** génère la timeline et le rapport
6. **Replay Generator** retourne le replay à l'API
7. **API** retourne le replay au Frontend

### Contrats

**DTO**
```typescript
SessionReplayV2 {
  sessionId: UUID
  userId: UUID
  startedAt: DateTime
  completedAt: DateTime
  events: InterviewEvent[]
  directorDecisions: DirectorDecision[]
  plannerState: PlannerState
  personaState: PersonaState
  difficultyHistory: DifficultySnapshot[]
  memorySnapshots: MemorySnapshot[]
  evaluationSnapshots: EvaluationSnapshot[]
  speechMetrics: SpeechMetrics[]
  openaiEvents: OpenAIEvent[]
}
```

---

## Diagramme 7 : Interruption (Barge-in)

### Acteurs

- **Frontend** : Application Next.js
- **Gateway** : Fastify Gateway
- **Turn FSM** : Service NestJS
- **Conversation Director** : Service NestJS
- **OpenAI Realtime** : OpenAI API

### Séquence

```
Frontend → Gateway: WebSocket message { type: "interrupt" }
Gateway → Turn FSM: Interrupt event
Turn FSM → Turn FSM: Validate interrupt
Turn FSM → Turn FSM: Transition to INTERRUPTED
Turn FSM → OpenAI Realtime: Stop speech
OpenAI Realtime → Turn FSM: Speech stopped
Turn FSM → Turn FSM: Transition to LISTENING
Turn FSM → Gateway: Ack interrupt
Gateway → Frontend: WebSocket message { type: "interrupt_ack" }
```

### Détails

1. **Frontend** envoie une interruption
2. **Turn FSM** valide que l'interruption est possible
3. **Turn FSM** transitionne à l'état INTERRUPTED
4. **Turn FSM** demande à OpenAI d'arrêter la parole
5. **Turn FSM** transitionne à l'état LISTENING
6. **Gateway** acknowledge l'interruption au Frontend

### Contrats

**Événement**
```typescript
InterruptEvent {
  eventId: UUID
  eventType: "Interrupt"
  sessionId: UUID
  interviewId: UUID
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 8 : Gestion d'Erreur

### Acteurs

- **Frontend** : Application Next.js
- **Gateway** : Fastify Gateway
- **Interview Orchestrator** : Service NestJS
- **Event Bus** : Redis Streams
- **Dead Letter Queue** : Redis

### Séquence

```
Gateway → Interview Orchestrator: Process event
Interview Orchestrator → Interview Orchestrator: Error occurred
Interview Orchestrator → Event Bus: Publish ErrorEvent
Event Bus → Dead Letter Queue: Add failed event
Interview Orchestrator → Gateway: Error response
Gateway → Frontend: WebSocket message { type: "error", message: "..." }
```

### Détails

1. **Interview Orchestrator** rencontre une erreur
2. **Interview Orchestrator** publie l'événement d'erreur
3. **Dead Letter Queue** ajoute l'événement échoué
4. **Gateway** retourne l'erreur au Frontend

### Contrats

**Événement**
```typescript
ErrorEvent {
  eventId: UUID
  eventType: "Error"
  sessionId: UUID
  interviewId: UUID
  errorMessage: string
  stackTrace?: string
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 9 : Evaluation Continue

### Acteurs

- **Conversation Director** : Service NestJS
- **Evaluation Engine** : Service NestJS
- **Event Bus** : Redis Streams
- **Database** : Supabase

### Séquence

```
Conversation Director → Evaluation Engine: Evaluate transcript
Evaluation Engine → Evaluation Engine: Analyze competencies
Evaluation Engine → Evaluation Engine: Calculate scores
Evaluation Engine → Event Bus: Publish EvaluationUpdatedEvent
Event Bus → Database: Update evaluation snapshot
Database → Evaluation Engine: Snapshot saved
Evaluation Engine → Conversation Director: EvaluationSnapshot
```

### Détails

1. **Conversation Director** demande l'évaluation d'un transcript
2. **Evaluation Engine** analyse les compétences
3. **Evaluation Engine** calcule les scores
4. **Evaluation Engine** publie l'événement `EvaluationUpdatedEvent`
5. **Database** sauvegarde le snapshot d'évaluation
6. **Evaluation Engine** retourne le snapshot au Director

### Contrats

**Événement**
```typescript
EvaluationUpdatedEvent {
  eventId: UUID
  eventType: "EvaluationUpdated"
  interviewId: UUID
  turnNumber: number
  overallScore: number (0-100)
  competencies: Record<Competency, {
    score: number (0-100)
    confidence: number (0-1)
    evidence: string[]
  }>
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Diagramme 10 : Adaptation de Difficulté

### Acteurs

- **Conversation Director** : Service NestJS
- **Difficulty Engine** : Service NestJS
- **Event Bus** : Redis Streams

### Séquence

```
Conversation Director → Difficulty Engine: Adjust difficulty
Difficulty Engine → Difficulty Engine: Analyze performance
Difficulty Engine → Difficulty Engine: Calculate new difficulty
Difficulty Engine → Event Bus: Publish DifficultyChangedEvent
Event Bus → Conversation Director: Event received
Difficulty Engine → Conversation Director: NewDifficulty { difficulty }
```

### Détails

1. **Conversation Director** demande l'adaptation de la difficulté
2. **Difficulty Engine** analyse la performance du candidat
3. **Difficulty Engine** calcule la nouvelle difficulté
4. **Difficulty Engine** publie l'événement `DifficultyChangedEvent`
5. **Difficulty Engine** retourne la nouvelle difficulté au Director

### Contrats

**Événement**
```typescript
DifficultyChangedEvent {
  eventId: UUID
  eventType: "DifficultyChanged"
  interviewId: UUID
  stage: InterviewStage
  difficulty: number (1-10)
  factors: DifficultyFactors
  trend: "increasing" | "decreasing" | "stable"
  timestamp: DateTime
  version: "1.0.0"
}
```

---

## Checklist

### Avant implémentation

- [ ] Diagramme 1 : Création d'entretien défini
- [ ] Diagramme 2 : Démarrage d'entretien défini
- [ ] Diagramme 3 : Tour de parole défini
- [ ] Diagramme 4 : Transition de stage défini
- [ ] Diagramme 5 : Complétion d'entretien défini
- [ ] Diagramme 6 : Replay d'entretien défini
- [ ] Diagramme 7 : Interruption défini
- [ ] Diagramme 8 : Gestion d'erreur défini
- [ ] Diagramme 9 : Evaluation continue défini
- [ ] Diagramme 10 : Adaptation de difficulté défini

### Après implémentation

- [ ] Tous les diagrammes implémentés
- [ ] Contrats cohérents avec les diagrammes
- [ ] Tests E2E pour chaque diagramme
- [ ] Documentation mise à jour

---

## Timeline

| Tâche | Durée |
|-------|-------|
| Diagramme 1 | 1 jour |
| Diagramme 2 | 1 jour |
| Diagramme 3 | 2 jours |
| Diagramme 4 | 1 jour |
| Diagramme 5 | 1 jour |
| Diagramme 6 | 1 jour |
| Diagramme 7 | 1 jour |
| Diagramme 8 | 1 jour |
| Diagramme 9 | 1 jour |
| Diagramme 10 | 1 jour |
| Tests E2E | 3 jours |
| **Total** | **14 jours (~2 semaines)** |

---

## Conclusion

Ce document définit les diagrammes de séquence complets pour l'architecture V2 Enterprise, couvrant tous les flux principaux du système. Les diagrammes sont cohérents avec les contrats TypeScript et l'architecture Event Sourcing.

**Prochaine étape :**
- Plan de migration zéro interruption
