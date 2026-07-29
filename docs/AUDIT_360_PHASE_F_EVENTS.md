# Audit 360° - Phase F : Audit Événements

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Matrice des Événements

### Événements de Session

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `InterviewSessionInitialized` | InterviewSession | Orchestrator | Async | 1 | Session initialisée |
| `InterviewSessionStarted` | InterviewSession | Orchestrator | Async | 1 | Session démarrée |
| `InterviewSessionCompleted` | InterviewSession | Orchestrator, Reporting | Async | 1 | Session terminée |
| `InterviewCreated` | InterviewService | Orchestrator | Async | 1 | Entretien créé |
| `InterviewStarted` | InterviewService | Orchestrator | Async | 1 | Entretien démarré |
| `InterviewPaused` | InterviewSession | Orchestrator | Async | 1 | Entretien en pause |
| `InterviewResumed` | InterviewSession | Orchestrator | Async | 1 | Entretien repris |
| `InterviewCancelled` | InterviewSession | Orchestrator | Async | 1 | Entretien annulé |
| `InterviewError` | InterviewSession | Orchestrator | Async | 1 | Erreur d'entretien |

**Qui les produit**
- `libs/domain/src/interview/entities/InterviewSession.ts` : Domain events
- `apps/web/src/application/services/SimulationService.ts` : Simulation events

**Qui les consomme**
- Orchestrator : Coordination
- Reporting : Génération de rapports
- Analytics : Analyse

---

### Événements de Stage

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `StageStarted` | InterviewSession | Orchestrator | Async | 1 | Stage démarré |
| `StageCompleted` | InterviewSession | Orchestrator | Async | 1 | Stage terminé |
| `StageTransitionRequested` | Director | Orchestrator | Async | 1 | Transition de stage demandée |
| `StageTransitionApproved` | Director | Orchestrator | Async | 1 | Transition de stage approuvée |
| `StageTransitionRejected` | Director | Orchestrator | Async | 1 | Transition de stage rejetée |

**Qui les produit**
- `libs/domain/src/interview/entities/InterviewSession.ts` : Domain events
- `libs/domain/src/director/` : Director decisions

**Qui les consomme**
- Orchestrator : Coordination
- Director : Décisions

---

### Événements de Tour

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `TurnStarted` | Voice Orchestrator | Orchestrator | Async | 1 | Tour démarré |
| `TranscriptReceived` | STT Adapter | Voice Orchestrator | Async | 1 | Transcript reçu |
| `SpeechStarted` | Speech Analyzer | Voice Orchestrator | Async | 1 | Parole démarrée |
| `SpeechEnded` | Speech Analyzer | Voice Orchestrator | Async | 1 | Parole terminée |
| `CandidateAnswered` | Voice Orchestrator | Evaluation | Async | 1 | Candidat a répondu |
| `TurnCompleted` | Voice Orchestrator | Orchestrator | Async | 1 | Tour terminé |

**Qui les produit**
- `apps/realtime-gateway/src/voice-interview/core/voice-orchestrator.ts` : Voice orchestrator
- `apps/realtime-gateway/src/voice-interview/adapters/deepgram.ts` : STT adapter
- `apps/web/src/lib/audio/speech-analyzer.ts` : Speech analyzer

**Qui les consomme**
- Voice Orchestrator : Coordination
- Evaluation : Scoring
- Orchestrator : Coordination

---

### Événements de Décision

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `DirectorDecisionMade` | Director | Orchestrator | Async | 1 | Décision du director prise |
| `PersonaAdjusted` | Director | Voice Orchestrator | Async | 1 | Persona ajusté |
| `DifficultyChanged` | Director | Voice Orchestrator | Async | 1 | Difficulté changée |

**Qui les produit**
- `libs/domain/src/director/` : Director decisions

**Qui les consomme**
- Voice Orchestrator : Ajustement du comportement
- Orchestrator : Coordination

---

### Événements d'Évaluation

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `EvaluationUpdated` | Evaluation Engine | Orchestrator | Async | 1 | Évaluation mise à jour |
| `CompetencyScoreUpdated` | Evaluation Engine | Orchestrator | Async | 1 | Score de compétence mis à jour |
| `ContradictionDetected` | Memory Engine | Orchestrator | Async | 1 | Contradiction détectée |
| `BluffDetected` | Evaluation Engine | Orchestrator | Async | 1 | Bluff détecté |

**Qui les produit**
- `apps/realtime-gateway/src/voice-interview/core/evaluation.ts` : Evaluation engine
- `libs/domain/src/evaluation/` : Domain evaluation

**Qui les consomme**
- Voice Orchestrator : Ajustement du comportement
- Orchestrator : Coordination
- Reporting : Génération de rapports

---

### Événements de Mémoire

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `MemoryUpdated` | Memory Engine | Voice Orchestrator | Async | 1 | Mémoire mise à jour |
| `MemorySnapshotTaken` | Memory Engine | Event Store | Async | 1 | Snapshot de mémoire pris |
| `FactExtracted` | Memory Engine | Voice Orchestrator | Async | 1 | Fait extrait |
| `ContradictionAdded` | Memory Engine | Voice Orchestrator | Async | 1 | Contradiction ajoutée |

**Qui les produit**
- `libs/domain/src/memory/` : Domain memory
- `apps/web/src/lib/interview/behavioral-memory.ts` : Behavioral memory

**Qui les consomme**
- Voice Orchestrator : Ajustement du comportement
- Event Store : Persistence

---

### Événements OpenAI

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `OpenAIRequestSent` | LLM Strict | Monitoring | Async | 1 | Requête OpenAI envoyée |
| `OpenAIResponseReceived` | LLM Strict | Monitoring | Async | 1 | Réponse OpenAI reçue |
| `OpenAIError` | LLM Strict | Monitoring | Async | 1 | Erreur OpenAI |

**Qui les produit**
- `apps/realtime-gateway/src/llm-strict.ts` : LLM strict
- `apps/realtime-gateway/src/voice-interview/core/llm-strict.ts` : LLM strict

**Qui les consomme**
- Monitoring : Observabilité
- Analytics : Analyse

---

### Événements WebSocket

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `GatewayConnected` | Gateway | Client | Sync | 1 | Gateway connecté |
| `GatewayDisconnected` | Gateway | Client | Sync | 1 | Gateway déconnecté |
| `SessionStarted` | Gateway | Client | Sync | 1 | Session démarrée |
| `SessionEnded` | Gateway | Client | Sync | 1 | Session terminée |
| `AudioChunkReceived` | Gateway | STT Adapter | Sync | 1 | Chunk audio reçu |
| `TranscriptCreated` | STT Adapter | Voice Orchestrator | Async | 1 | Transcript créé |
| `QuestionAsked` | Voice Orchestrator | Client | Sync | 1 | Question posée |
| `AnswerReceived` | Voice Orchestrator | Evaluation | Async | 1 | Réponse reçue |
| `EvaluationUpdated` | Evaluation Engine | Client | Sync | 1 | Évaluation mise à jour |
| `ReplaySaved` | Replay Service | Client | Async | 1 | Replay sauvegardé |
| `Interrupted` | Gateway | Client | Sync | 1 | Interruption |

**Qui les produit**
- `apps/realtime-gateway/src/gateway.ts` : Gateway
- `apps/realtime-gateway/src/voice-interview/adapters/voice-websocket.ts` : Voice websocket

**Qui les consomme**
- Client : Frontend
- STT Adapter : Speech-to-text
- Voice Orchestrator : Coordination
- Evaluation Engine : Scoring

---

### Événements Audio

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `AudioChunk` | Client | Gateway | Sync | 1 | Chunk audio |
| `AudioStreamStarted` | Client | Gateway | Sync | 1 | Stream audio démarré |
| `AudioStreamEnded` | Client | Gateway | Sync | 1 | Stream audio terminé |
| `TTSStarted` | TTS Adapter | Gateway | Async | 1 | TTS démarré |
| `TTSCompleted` | TTS Adapter | Gateway | Async | 1 | TTS terminé |
| `TTSError` | TTS Adapter | Gateway | Async | 1 | Erreur TTS |

**Qui les produit**
- Client : Frontend
- `apps/realtime-gateway/src/voice-interview/adapters/tts/` : TTS adapters

**Qui les consomme**
- Gateway : Coordination
- STT Adapter : Speech-to-text

---

### Événements STT

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `STTTranscript` | Deepgram Adapter | Voice Orchestrator | Async | 1 | Transcript STT |
| `STTTranscriptFinal` | Deepgram Adapter | Voice Orchestrator | Async | 1 | Transcript final STT |
| `STTError` | Deepgram Adapter | Gateway | Async | 1 | Erreur STT |

**Qui les produit**
- `apps/realtime-gateway/src/voice-interview/adapters/deepgram.ts` : Deepgram adapter
- `apps/realtime-gateway/src/stt.ts` : STT wrapper

**Qui les consomme**
- Voice Orchestrator : Coordination
- Gateway : Error handling

---

### Événements Replay

| Event | Producer | Consumer | Sync/Async | Version | Description |
|-------|----------|----------|------------|---------|-------------|
| `ReplayStarted` | Replay Service | Client | Async | 1 | Replay démarré |
| `ReplayPaused` | Replay Service | Client | Async | 1 | Replay en pause |
| `ReplayResumed` | Replay Service | Client | Async | 1 | Replay repris |
| `ReplayStopped` | Replay Service | Client | Async | 1 | Replay arrêté |
| `ReplaySeeked` | Replay Service | Client | Async | 1 | Replay seek |
| `ReplaySpeedChanged` | Replay Service | Client | Async | 1 | Vitesse changée |

**Qui les produit**
- `apps/web/src/lib/replay/` : Replay service

**Qui les consomme**
- Client : Frontend
- Analytics : Analyse

---

## Architecture Event Bus

### Redis Streams

**Purpose** : Événements temps réel pour la communication entre services

**Stream Keys**
- `interview:{sessionId}` : Événements d'entretien
- `session:{sessionId}` : Événements de session
- `evaluation:{sessionId}` : Événements d'évaluation
- `director:{sessionId}` : Événements du director
- `memory:{sessionId}` : Événements de mémoire
- `speech:{sessionId}` : Événements de parole
- `openai:{sessionId}` : Événements OpenAI

**Consumer Groups**
- `orchestrator` : Orchestrator
- `evaluation` : Evaluation
- `reporting` : Reporting
- `notification` : Notification
- `analytics` : Analytics

**Configuration**
- `MAXLEN` : 10000 événements par stream
- `TTL` : 7 jours de rétention
- `BLOCK_MS` : 5 secondes de blocage pour XREAD

### BullMQ

**Purpose** : Jobs asynchrones pour les tâches de fond

**Queues**
- `interview-creation-queue` : Création d'entretien
- `evaluation-queue` : Évaluation
- `report-generation-queue` : Génération de rapport
- `notification-queue` : Notifications

**Configuration**
- `attempts` : 3 retries
- `backoff` : Exponential backoff
- `removeOnComplete` : 100 jobs
- `removeOnFail` : 50 jobs

---

## Event Sourcing

### Event Store

**Implementation** : Redis Streams

**Interface**
- `append(sessionId, event)` : Ajouter un événement
- `getEvents(sessionId)` : Lire tous les événements
- `getEventsRange(sessionId, from, to)` : Lire les événements dans un intervalle
- `getEventsFromVersion(sessionId, version)` : Lire les événements à partir d'une version
- `deleteEvents(sessionId)` : Supprimer les événements (GDPR)

### Snapshot Strategy

**Implementation** : Redis

**Interface**
- `save(sessionId, snapshot)` : Sauvegarder un snapshot
- `load(sessionId)` : Charger un snapshot
- `delete(sessionId)` : Supprimer un snapshot

**Strategy** : Snapshot tous les 100 événements

### Event Replayer

**Implementation** : State Reconstructor

**Interface**
- `replay(sessionId, toVersion)` : Rejouer jusqu'à une version
- `replayToTimestamp(sessionId, timestamp)` : Rejouer jusqu'à un timestamp

---

## Versioning

### Event Versioning

**Strategy** : Versioning des événements avec migration automatique

**Interface**
- `version` : Version de l'événement
- `schema` : Schéma Zod de validation
- `migration` : Fonction de migration

**Implementation**
- Migration automatique lors de l'append
- Validation Zod avant persistence

---

## Monitoring

### Metrics

**Redis Streams**
- `streamLength` : Longueur du stream
- `streamConsumerGroups` : Nombre de consumer groups
- `streamPendingMessages` : Nombre de messages en attente

**BullMQ**
- `queueSize` : Taille de la queue
- `queueActive` : Jobs actifs
- `queueCompleted` : Jobs complétés
- `queueFailed` : Jobs échoués
- `queueDelayed` : Jobs différés

**Event Store**
- `eventPublishRate` : Taux de publication
- `eventConsumeRate` : Taux de consommation
- `eventLatency` : Latence des événements

---

## Dead Letter Queue

### DLQ Configuration

**Name** : `event-dlq`

**TTL** : 30 jours

**MAX_SIZE** : 10000 événements

**Interface**
- `add(event, error)` : Ajouter un événement échoué
- `getFailedEvents(sessionId)` : Lire les événements échoués

---

## Conclusion

### Points forts

1. **Architecture Event Bus bien définie** : Redis Streams + BullMQ
2. **Event Sourcing implémenté** : Reconstitution exacte de l'état
3. **Snapshot Strategy** : Optimisation pour la reconstitution
4. **Versioning** : Événements versionnés avec migration
5. **Monitoring** : Métriques détaillées

### Points faibles

1. **Pas d'implémentation actuelle** : Architecture définie mais pas implémentée
2. **Pas de Dead Letter Queue** : DLQ définie mais pas implémentée
3. **Pas de compression** : Payloads non compressés
4. **Pas d'indexation** : Pas d'index par timestamp
5. **Pas de tests** : Tests définis mais pas implémentés

### Recommandations

1. **Implémenter Redis Streams** : Remplacer l'implémentation actuelle
2. **Implémenter BullMQ** : Pour les jobs asynchrones
3. **Implémenter Event Store** : Pour l'Event Sourcing
4. **Implémenter Snapshot Store** : Pour l'optimisation
5. **Implémenter Dead Letter Queue** : Pour la gestion des erreurs

**Prochaine phase** : Audit Données
