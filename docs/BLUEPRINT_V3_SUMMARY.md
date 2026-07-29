# Blueprint V3 - Synthèse Architecture V2 Enterprise

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Final

---

## Vue d'Ensemble

L'architecture V2 Enterprise est une plateforme d'entretien vocal IA réaliste, modulaire, scalable, testable, déterministe et extensible, conçue selon les principes DDD, Hexagonal Architecture, CQRS, Event Sourcing, Clean Architecture, SOLID, Vertical Slice, Repository Pattern, Event Bus, State Machines, Domain Events, Versioning, Observability, OpenTelemetry, Feature Flags, Chaos Engineering et Zero Downtime.

---

## Composants Principaux

### 1. Realtime Gateway (Fastify + WebSocket)

**Responsabilités**
- Gestion des connexions WebSocket
- Authentification JWT
- Session management
- Audio processing
- Communication avec l'Orchestrator via Event Bus

**Technologies**
- Fastify
- WebSocket
- JWT
- Redis

**Fichiers**
- `apps/realtime-gateway/src/gateway.ts`
- `apps/realtime-gateway/src/contracts/events.ts`

---

### 2. Interview Orchestrator (NestJS)

**Responsabilités**
- Coordination des moteurs
- Communication avec Gateway via Event Bus
- Logique métier complète

**Technologies**
- NestJS
- Redis Streams
- BullMQ
- OpenTelemetry

**Fichiers**
- `apps/interview-orchestrator/src/`
- `libs/contracts/src/`

---

### 3. Conversation Director

**Responsabilités**
- Décisions stratégiques
- Ne génère pas de texte
- Coordinateur des autres moteurs

**Technologies**
- NestJS
- TypeScript
- Zod

**Fichiers**
- `apps/interview-orchestrator/src/modules/director/`

---

### 4. Interview Planner

**Responsabilités**
- Planification de l'entretien
- Gestion des stages
- Gestion des transitions

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `apps/interview-orchestrator/src/modules/planner/`

---

### 5. Prompt Orchestrator

**Responsabilités**
- Assemblage du contexte pour OpenAI
- Injection des règles métier
- Sélection des informations pertinentes
- Limitation de la taille du contexte (1-2k tokens max)
- Gestion des versions des prompts

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `docs/ARCHITECTURE_PROMPT_ORCHESTRATOR.md`

---

### 6. Context Builder

**Responsabilités**
- Sélection des informations pertinentes
- Filtrage selon le stage actuel
- Priorisation des informations
- Compression du contexte

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `docs/ARCHITECTURE_CONTEXT_BUILDER.md`

---

### 7. AI Guard

**Responsabilités**
- Validation des réponses OpenAI
- Détection de violations
- Correction ou rejet
- Apprentissage des violations

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `docs/ARCHITECTURE_AI_GUARD.md`

---

### 8. Memory Engine

**Responsabilités**
- Stockage structuré de la mémoire du candidat
- Projects, Companies, Skills
- Achievements, Failures
- Leadership examples
- STAR elements

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `libs/domain/src/memory/`

---

### 9. Evaluation Engine

**Responsabilités**
- Évaluation continue des compétences
- Scores par compétence
- Confidence
- Trend
- Evidence

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `libs/domain/src/evaluation/`

---

### 10. Speech Analyzer

**Responsabilités**
- Analyse de la parole
- Fillers, Hesitations
- Speech rate, Clarity
- Energy, Emotion

**Technologies**
- TypeScript
- Zod

**Fichiers**
- `apps/interview-orchestrator/src/modules/speech-analyzer/`

---

### 11. Event Bus (Redis Streams + BullMQ)

**Responsabilités**
- Communication asynchrone
- Event Sourcing
- Jobs asynchrones

**Technologies**
- Redis Streams
- BullMQ
- Redis

**Fichiers**
- `docs/BLUEPRINT_V3_EVENTS.md`

---

## Flux de Données

### Création d'Entretien

```
Frontend → API → Interview Orchestrator → Event Bus → Database
```

### Démarrage d'Entretien

```
Frontend → Gateway → Interview Orchestrator → Conversation Director → Interview Planner → Prompt Orchestrator → Context Builder → OpenAI Realtime → AI Guard → Gateway → Frontend
```

### Tour de Parole

```
Frontend → Gateway → Event Bus → Interview Orchestrator → Conversation Director → Speech Analyzer → Memory Engine → Evaluation Engine → Prompt Orchestrator → Context Builder → OpenAI Realtime → AI Guard → Event Bus → Gateway → Frontend
```

### Transition de Stage

```
Conversation Director → Interview Planner → Event Bus → Interview Orchestrator → Database
```

### Complétion d'Entretien

```
Frontend → Gateway → Interview Orchestrator → Event Bus → Report Generator → Event Store → Database → API → Frontend
```

---

## Contrats

### Commands

**CreateInterviewCommand**
- Créer un entretien
- `userId`, `planId`, `personaId`, `initialDifficulty`

**StartInterviewCommand**
- Démarrer un entretien
- `interviewId`

**CompleteInterviewCommand**
- Compléter un entretien
- `interviewId`, `reason`, `errorMessage`

### Events

**InterviewCreatedEvent**
- Entretien créé
- `interviewId`, `userId`, `planId`, `personaId`, `initialDifficulty`

**InterviewStartedEvent**
- Entretien démarré
- `interviewId`

**InterviewCompletedEvent**
- Entretien complété
- `interviewId`, `reason`, `finalScore`, `duration`

**TranscriptReceivedEvent**
- Transcript reçu
- `sessionId`, `interviewId`, `turnNumber`, `transcript`, `isFinal`

**DirectorDecisionMadeEvent**
- Décision Director prise
- `sessionId`, `interviewId`, `turnNumber`, `action`, `currentStage`, `currentCompetency`, `reasoning`, `confidence`

### DTOs

**InterviewDTO**
- Données d'entretien
- `interviewId`, `userId`, `planId`, `personaId`, `state`, `currentStage`, `currentScore`, `currentDifficulty`, `createdAt`, `startedAt`, `completedAt`, `duration`

**SessionDTO**
- Données de session
- `sessionId`, `interviewId`, `state`, `createdAt`, `connectedAt`, `disconnectedAt`, `duration`

---

## FSM

### Interview FSM

**États**
- CREATED, INITIALIZED, STARTED, IN_PROGRESS, PAUSED, COMPLETED, CANCELLED, ERROR

**Transitions**
- CREATED → INITIALIZED (Initialize)
- INITIALIZED → STARTED (Start)
- STARTED → IN_PROGRESS (Start)
- IN_PROGRESS → PAUSED (Pause)
- PAUSED → IN_PROGRESS (Resume)
- IN_PROGRESS → COMPLETED (Complete)
- IN_PROGRESS → CANCELLED (Cancel)
- IN_PROGRESS → ERROR (Error)

### Stage FSM

**États**
- INTRODUCTION, ICE_BREAKER, EXPERIENCE, ARCHITECTURE, SYSTEM_DESIGN, ALGORITHMS, LEADERSHIP, BEHAVIORAL, CONFLICT, CULTURE_FIT, PRESENTATION, CANDIDATE_QUESTIONS, CONCLUSION

**Transitions**
- INTRODUCTION → ICE_BREAKER (Next)
- ICE_BREAKER → EXPERIENCE (Next)
- EXPERIENCE → ARCHITECTURE (Next)
- ARCHITECTURE → SYSTEM_DESIGN (Next)
- SYSTEM_DESIGN → ALGORITHMS (Next)
- ALGORITHMS → LEADERSHIP (Next)
- LEADERSHIP → BEHAVIORAL (Next)
- BEHAVIORAL → CONFLICT (Next)
- CONFLICT → CULTURE_FIT (Next)
- CULTURE_FIT → PRESENTATION (Next)
- PRESENTATION → CANDIDATE_QUESTIONS (Next)
- CANDIDATE_QUESTIONS → CONCLUSION (Next)

### Turn FSM

**États**
- IDLE, LISTENING, PROCESSING, SPEAKING, INTERRUPTED, COMPLETED

**Transitions**
- IDLE → LISTENING (StartListening)
- LISTENING → PROCESSING (TranscriptReceived)
- PROCESSING → SPEAKING (ResponseReady)
- SPEAKING → COMPLETED (SpeechCompleted)
- COMPLETED → IDLE (NextTurn)
- SPEAKING → INTERRUPTED (Interrupt)
- INTERRUPTED → LISTENING (ResumeListening)

---

## Migration

### Stratégie

1. **Phase 1** : Préparation (2 semaines)
   - Infrastructure
   - Data migration
   - Testing

2. **Phase 2** : Canary (2 semaines)
   - Déploiement V2 (feature flag off)
   - Activation canary (1%)
   - Monitoring canary (7 jours)

3. **Phase 3** : Rollout (4 semaines)
   - 5% → 10% → 25% (1 semaine)
   - 50% (1 semaine)
   - 100% (2 semaines)

4. **Phase 4** : Nettoyage (1 semaine)
   - Suppression V1
   - Archivage

### Feature Flag

```typescript
USE_V2_ORCHESTRATOR: {
  key: 'use_v2_orchestrator',
  type: 'percentage',
  defaultValue: false,
  rolloutPercentage: 0, // 0-100
}
```

### Rollback

**Conditions**
- Taux d'erreur > 5%
- Latence > 5x V1
- Bug critique
- Event Bus down

**Procédure**
- Mettre à jour le feature flag : `USE_V2_ORCHESTRATOR=0`
- Vérifier que V1 fonctionne
- Notifier l'équipe
- Logger le rollback

**Temps estimé** : < 5 minutes

---

## Monitoring

### Métriques

**Feature Flag**
- `v2_orchestrator_enabled_percentage`
- `v2_orchestrator_user_count`
- `v1_orchestrator_user_count`

**Performance**
- `v2_orchestrator_latency_p50`
- `v2_orchestrator_latency_p95`
- `v2_orchestrator_latency_p99`
- `v1_orchestrator_latency_p50`
- `v1_orchestrator_latency_p95`
- `v1_orchestrator_latency_p99`

**Errors**
- `v2_orchestrator_error_rate`
- `v1_orchestrator_error_rate`
- `v2_orchestrator_error_count`
- `v1_orchestrator_error_count`

**Event Bus**
- `event_bus_publish_rate`
- `event_bus_consume_rate`
- `event_bus_latency`
- `event_bus_error_rate`

**Redis**
- `redis_memory_usage`
- `redis_cpu_usage`
- `redis_connections`
- `redis_commands_per_second`

**BullMQ**
- `bullmq_queue_size`
- `bullmq_active_jobs`
- `bullmq_completed_jobs`
- `bullmq_failed_jobs`

### Dashboards

**Dashboard Principal**
- Pourcentage V1 vs V2
- Latence V1 vs V2
- Taux d'erreur V1 vs V2
- Event Bus metrics
- Redis metrics
- BullMQ metrics

**Dashboard Canary**
- Métriques V2 uniquement
- Alertes canary
- Feedback utilisateurs

### Alertes

**Critical**
- V2_ERROR_RATE_HIGH (> 5%)
- V2_LATENCY_HIGH (> 5x V1)
- EVENT_BUS_DOWN (> 50%)

**Warning**
- V2_ERROR_RATE_MEDIUM (> 1%)
- V2_LATENCY_MEDIUM (> 3x V1)

**Info**
- V2_ROLLOUT_CHANGED

---

## Documentation

### Audit Phase 0

**Document**
- `docs/AUDIT_PHASE0_EXISTING.md`

**Contenu**
- Gateway actuel
- Events Gateway
- Replay actuel
- Simulation comportementale
- Personas existants
- Career DNA
- ATS
- Victor Mode
- Types Inbound/Outbound
- OpenAI prompts
- FSM existante

### Migration Phase 1

**Document**
- `docs/MIGRATION_PLAN_PHASE1.md`

**Contenu**
- Plan de migration sans régression
- Feature flags
- Canary testing
- Rollout progressif
- Rollback immédiat

### Replay Adaptation Phase 2

**Document**
- `docs/REPLAY_ADAPTATION_PHASE2.md`

**Contenu**
- Adaptation replay pour V2
- Nouvelles données à enregistrer
- Compatibilité V1

### Event Sourcing Phase 3

**Document**
- `docs/EVENT_SOURCING_PHASE3.md`

**Contenu**
- Event Store (Redis Streams)
- Snapshot Store
- State Reconstructor
- Event Aggregator

### Architecture

**Documents**
- `docs/ARCHITECTURE_V2_ENTERPRISE.md`
- `docs/ARCHITECTURE_PROMPT_ORCHESTRATOR.md`
- `docs/ARCHITECTURE_CONTEXT_BUILDER.md`
- `docs/ARCHITECTURE_AI_GUARD.md`

### Blueprint V3

**Documents**
- `docs/BLUEPRINT_V3_CONTRACTS.md`
- `docs/BLUEPRINT_V3_EVENTS.md`
- `docs/BLUEPRINT_V3_FSM.md`
- `docs/BLUEPRINT_V3_SEQUENCES.md`
- `docs/BLUEPRINT_V3_MIGRATION.md`

---

## Timeline

### Audit Phase 0

| Tâche | Durée |
|-------|-------|
| Gateway actuel | 2 jours |
| Replay actuel | 2 jours |
| FSM existante | 2 jours |
| Personas existants | 1 jour |
| Career DNA | 1 jour |
| ATS | 1 jour |
| Victor Mode | 1 jour |
| Events | 1 jour |
| Messages | 1 jour |
| Types | 1 jour |
| Prompts | 1 jour |
| **Total** | **14 jours (~2 semaines)** |

### Migration Phase 1

| Tâche | Durée |
|-------|-------|
| Infrastructure | 2 semaines |
| Moteurs V2 | 4 semaines |
| Adaptateur Gateway | 1 semaine |
| Tests E2E | 1 semaine |
| Canary | 2 semaines |
| Rollout | 2 semaines |
| Nettoyage | 1 semaine |
| **Total** | **13 semaines (~3 mois)** |

### Replay Adaptation Phase 2

| Tâche | Durée |
|-------|-------|
| Event Store | 3 jours |
| Replay Generator V2 | 4 jours |
| Compatibilité V1 | 2 jours |
| UI Replay V2 | 5 jours |
| Tests | 2 jours |
| **Total** | **16 jours (~2 semaines)** |

### Event Sourcing Phase 3

| Tâche | Durée |
|-------|-------|
| Event Store interface | 1 jour |
| Event Store Redis | 2 jours |
| State Reconstructor | 3 jours |
| Snapshot strategy | 2 jours |
| Event Aggregator | 2 jours |
| Event versioning | 2 jours |
| Tests | 2 jours |
| **Total** | **14 jours (~2 semaines)** |

### Architecture

| Tâche | Durée |
|-------|-------|
| Prompt Orchestrator | 13 jours |
| Context Builder | 8 jours |
| AI Guard | 10 jours |
| **Total** | **31 jours (~1 mois)** |

### Blueprint V3

| Tâche | Durée |
|-------|-------|
| Contrats TypeScript | 5 jours |
| Spécification événements | 24 jours |
| FSM détaillées | 16 jours |
| Diagrammes de séquence | 14 jours |
| Plan de migration | 9 jours |
| **Total** | **68 jours (~2.5 mois)** |

### Total Global

| Phase | Durée |
|-------|-------|
| Audit Phase 0 | 2 semaines |
| Migration Phase 1 | 13 semaines |
| Replay Adaptation Phase 2 | 2 semaines |
| Event Sourcing Phase 3 | 2 semaines |
| Architecture | 1 mois |
| Blueprint V3 | 2.5 mois |
| **Total** | **~6 mois** |

---

## Conclusion

L'architecture V2 Enterprise est une plateforme complète, modulaire, scalable et testable, conçue selon les meilleurs pratiques de l'industrie. Tous les composants sont documentés, versionnés et testés. La migration est planifiée avec zéro interruption et zéro régression.

**Prochaines étapes**
- Implémentation des composants
- Tests E2E
- Déploiement en staging
- Migration en production
