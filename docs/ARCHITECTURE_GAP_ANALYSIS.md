# Architecture Gap Analysis : V1 ↔ V2

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document analyse l'écart entre l'architecture actuelle (V1) et l'architecture cible (V2), en identifiant ce qui existe, ce qui sera supprimé, conservé, remplacé ou ajouté.

---

## Matrice des Composants

| Composant | V1 | V2 | Action | Justification |
|-----------|----|----|--------|---------------|
| **Audio** | | | | |
| Deepgram STT | Oui | Non | Remove | Remplacé par OpenAI Realtime API (STT intégré) |
| ElevenLabs TTS | Oui | Non/OpenAI | Replace | Remplacé par OpenAI Realtime API (TTS intégré) |
| WebRTC Audio | Oui | Oui | Keep | Conservé pour le transport audio temps réel |
| PCM Encoder | Oui | Non | Remove | Plus nécessaire avec OpenAI Realtime API |
| Speech Analyzer | Oui | Oui | Keep | Conservé pour l'analyse de la parole |
| **AI** | | | | |
| OpenAI API | Oui | Oui | Upgrade | Upgrade vers OpenAI Realtime API |
| Mistral API | Oui | Non | Remove | Simplification vers un seul provider |
| Prompt Builder (Simple) | Oui | Non | Replace | Remplacé par Prompt Orchestrator |
| Prompt Orchestrator | Non | Oui | New | Orchestration multi-couches des prompts |
| AI Guard | Non | Oui | New | Validation et correction des réponses LLM |
| Context Builder | Non | Oui | New | Filtrage et optimisation du contexte |
| **Domain** | | | | |
| InterviewSession | Oui | Oui | Refactor | Refactor avec Event Sourcing |
| PersonaParameters | Oui | Oui | Keep | Conservé avec améliorations |
| CandidateMemory | Oui | Oui | Refactor | Refactor avec Event Sourcing |
| CompetencyEvaluation | Oui | Oui | Refactor | Refactor avec Event Sourcing |
| ConversationState | Oui | Oui | Keep | Conservé |
| Planner | Non | Oui | New | Planification dynamique des entretiens |
| Director | Non | Oui | New | Décision de l'étape suivante |
| **Event** | | | | |
| WebSocket Events | Oui | Oui | Refactor | Refactor avec versioning |
| Domain Events | Partiel | Oui | Extend | Extension avec Event Sourcing complet |
| Event Store | Non | Oui | New | Redis Streams pour Event Sourcing |
| Snapshot Store | Non | Oui | New | Redis pour optimisation |
| **Data** | | | | |
| Supabase | Oui | Oui | Keep | Conservé comme base de données principale |
| Redis (Cache) | Oui | Oui | Extend | Extension vers Event Bus (Streams) |
| Prisma | Oui | Non | Remove | Remplacé par Supabase direct |
| **Gateway** | | | | |
| Voice Gateway | Oui | Oui | Upgrade | Upgrade vers Voice Runtime |
| WebSocket Adapter | Oui | Oui | Refactor | Refactor avec versioning |
| Session Manager | Oui | Oui | Refactor | Refactor avec Event Sourcing |
| **Replay** | | | | |
| Replay (Basique) | Oui | Non | Replace | Remplacé par Event Sourcing Replay |
| Event Replayer | Non | Oui | New | Reconstitution depuis les événements |
| State Reconstructor | Non | Oui | New | Reconstitution de l'état |
| **Monitoring** | | | | |
| Performance Monitor | Oui | Oui | Keep | Conservé avec améliorations |
| Sentry | Placeholder | Oui | Upgrade | Upgrade vers production-ready |
| OpenTelemetry | Placeholder | Oui | Upgrade | Upgrade vers production-ready |
| Prometheus | Non | Oui | New | Exposition des métriques |
| **Security** | | | | |
| JWT (Gateway) | Oui | Oui | Keep | Conservé avec améliorations |
| JWT (Web) | Supabase | Oui | Keep | Conservé (Supabase Auth) |
| RLS | Oui | Oui | Keep | Conservé
| RBAC | Oui | Oui | Keep | Conservé avec améliorations |
| Rate Limiting | Oui | Oui | Upgrade | Upgrade avec Redis |
| Prompt Sanitizer | Oui | Oui | Keep | Conservé |
| Secret Manager | Non | Oui | New | HashiCorp Vault ou AWS Secrets Manager |
| **Infrastructure** | | | | |
| DI Container | Oui | Oui | Keep | Conservé avec améliorations |
| Feature Flags | Oui | Oui | Keep | Conservé |
| Graceful Shutdown | Oui | Oui | Keep | Conservé |
| Circuit Breaker | Oui | Oui | Keep | Conservé |

---

## Analyse par Catégorie

### Audio

**Supprimé**
- Deepgram STT : Remplacé par OpenAI Realtime API
- ElevenLabs TTS : Remplacé par OpenAI Realtime API
- PCM Encoder : Plus nécessaire

**Conservé**
- WebRTC Audio : Transport audio temps réel
- Speech Analyzer : Analyse de la parole

**Remplacé**
- ElevenLabs → OpenAI Realtime API

**Ajouté**
- Aucun (OpenAI Realtime API remplace Deepgram + ElevenLabs)

---

### AI

**Supprimé**
- Mistral API : Simplification vers un seul provider
- Prompt Builder (Simple) : Remplacé par Prompt Orchestrator

**Conservé**
- OpenAI API : Upgrade vers Realtime API

**Remplacé**
- Prompt Builder → Prompt Orchestrator
- Mistral → OpenAI (simplification)

**Ajouté**
- Prompt Orchestrator : Orchestration multi-couches
- AI Guard : Validation et correction
- Context Builder : Filtrage et optimisation

---

### Domain

**Supprimé**
- Aucun

**Conservé**
- PersonaParameters : Avec améliorations
- ConversationState : Sans changement

**Remplacé**
- Aucun

**Ajouté**
- Planner : Planification dynamique
- Director : Décision de l'étape suivante

**Refactor**
- InterviewSession : Avec Event Sourcing
- CandidateMemory : Avec Event Sourcing
- CompetencyEvaluation : Avec Event Sourcing

---

### Event

**Supprimé**
- Aucun

**Conservé**
- WebSocket Events : Avec versioning

**Remplacé**
- Aucun

**Ajouté**
- Event Store : Redis Streams
- Snapshot Store : Redis
- Event Replayer : Reconstitution
- State Reconstructor : Reconstitution

**Extend**
- Domain Events : Event Sourcing complet

---

### Data

**Supprimé**
- Prisma : Remplacé par Supabase direct

**Conservé**
- Supabase : Base de données principale

**Remplacé**
- Prisma → Supabase direct

**Ajouté**
- Aucun

**Extend**
- Redis : De cache à Event Bus (Streams)

---

### Gateway

**Supprimé**
- Aucun

**Conservé**
- Voice Gateway : Upgrade vers Voice Runtime

**Remplacé**
- Aucun

**Ajouté**
- Aucun

**Refactor**
- WebSocket Adapter : Avec versioning
- Session Manager : Avec Event Sourcing

---

### Replay

**Supprimé**
- Replay (Basique) : Remplacé par Event Sourcing

**Conservé**
- Aucun

**Remplacé**
- Replay Basique → Event Sourcing Replay

**Ajouté**
- Event Replayer : Reconstitution
- State Reconstructor : Reconstitution

---

### Monitoring

**Supprimé**
- Aucun

**Conservé**
- Performance Monitor : Avec améliorations

**Remplacé**
- Aucun

**Ajouté**
- Prometheus : Exposition des métriques

**Upgrade**
- Sentry : De placeholder à production-ready
- OpenTelemetry : De placeholder à production-ready

---

### Security

**Supprimé**
- Aucun

**Conservé**
- JWT (Gateway) : Avec améliorations
- JWT (Web) : Supabase Auth
- RLS : Sans changement
- RBAC : Avec améliorations
- Rate Limiting : Avec améliorations
- Prompt Sanitizer : Sans changement

**Remplacé**
- Aucun

**Ajouté**
- Secret Manager : HashiCorp Vault ou AWS Secrets Manager

**Upgrade**
- Rate Limiting : Avec Redis

---

### Infrastructure

**Supprimé**
- Aucun

**Conservé**
- DI Container : Avec améliorations
- Feature Flags : Sans changement
- Graceful Shutdown : Sans changement
- Circuit Breaker : Sans changement

**Remplacé**
- Aucun

**Ajouté**
- Aucun

---

## Résumé des Actions

### Remove (5 composants)
1. Deepgram STT
2. ElevenLabs TTS
3. PCM Encoder
4. Mistral API
5. Prisma

### Keep (12 composants)
1. WebRTC Audio
2. Speech Analyzer
3. OpenAI API
4. PersonaParameters
5. ConversationState
6. Supabase
7. JWT (Gateway)
8. JWT (Web)
9. RLS
10. RBAC
11. Prompt Sanitizer
12. DI Container
13. Feature Flags
14. Graceful Shutdown
15. Circuit Breaker
16. Performance Monitor

### Replace (4 composants)
1. ElevenLabs → OpenAI Realtime API
2. Prompt Builder → Prompt Orchestrator
3. Mistral → OpenAI
4. Replay Basique → Event Sourcing Replay
5. Prisma → Supabase direct

### Refactor (5 composants)
1. InterviewSession (Event Sourcing)
2. CandidateMemory (Event Sourcing)
3. CompetencyEvaluation (Event Sourcing)
4. WebSocket Adapter (Versioning)
5. Session Manager (Event Sourcing)

### New (8 composants)
1. Prompt Orchestrator
2. AI Guard
3. Context Builder
4. Planner
5. Director
6. Event Store
7. Snapshot Store
8. Event Replayer
9. State Reconstructor
10. Secret Manager
11. Prometheus

### Upgrade (5 composants)
1. OpenAI API → OpenAI Realtime API
2. Sentry (Placeholder → Production-ready)
3. OpenTelemetry (Placeholder → Production-ready)
4. Rate Limiting (Avec Redis)
5. Voice Gateway → Voice Runtime

### Extend (2 composants)
1. Redis (Cache → Event Bus)
2. Domain Events (Event Sourcing complet)

---

## Impact de la Migration

### Complexité

**Augmentation**
- Event Sourcing : Ajout de complexité (reconstitution, snapshots)
- Prompt Orchestrator : Ajout de complexité (multi-couches)
- AI Guard : Ajout de complexité (validation)

**Réduction**
- Simplification provider : Un seul provider (OpenAI)
- Suppression Prisma : Simplification de la couche data
- Suppression Deepgram/ElevenLabs : Réduction des intégrations externes

### Risques

**Haut**
- Migration vers OpenAI Realtime API : Nouvelle API non testée
- Event Sourcing : Nouveau pattern non maîtrisé
- Secret Manager : Nouvelle infrastructure

**Moyen**
- Refactor InterviewSession : Risque de régression
- Refactor Session Manager : Risque de régression
- Upgrade Sentry/OpenTelemetry : Risque de configuration

**Bas**
- Suppression Mistral : Impact minimal
- Suppression Prisma : Impact minimal
- Suppression Deepgram/ElevenLabs : Impact minimal

### Effort

**Élevé**
- Event Sourcing : 3-4 semaines
- Prompt Orchestrator : 2-3 semaines
- AI Guard : 2-3 semaines
- Context Builder : 1-2 semaines
- Planner : 2-3 semaines
- Director : 2-3 semaines

**Moyen**
- Migration OpenAI Realtime API : 1-2 semaines
- Refactor InterviewSession : 1-2 semaines
- Refactor Session Manager : 1-2 semaines
- Secret Manager : 1-2 semaines

**Faible**
- Suppression Mistral : 2-3 jours
- Suppression Prisma : 2-3 jours
- Suppression Deepgram/ElevenLabs : 2-3 jours
- Upgrade Sentry/OpenTelemetry : 3-5 jours

### Dépendances

**Nouvelles dépendances**
- OpenAI Realtime API SDK
- HashiCorp Vault SDK ou AWS Secrets Manager SDK
- Prometheus client

**Dépendances supprimées**
- @deepgram/sdk
- @elevenlabs/sdk
- Mistral SDK
- Prisma

---

## Recommandations

### Priorité Haute

1. **Event Sourcing** : Implémenter en premier (fondation)
2. **Prompt Orchestrator** : Implémenter en second (core)
3. **AI Guard** : Implémenter en troisième (sécurité)
4. **Context Builder** : Implémenter en quatrième (optimisation)

### Priorité Moyenne

1. **Planner** : Implémenter après Event Sourcing
2. **Director** : Implémenter après Planner
3. **Migration OpenAI Realtime API** : Implémenter après Prompt Orchestrator
4. **Secret Manager** : Implémenter avant production

### Priorité Basse

1. **Suppression Mistral** : Faire après migration OpenAI
2. **Suppression Prisma** : Faire après migration Supabase direct
3. **Suppression Deepgram/ElevenLabs** : Faire après migration OpenAI Realtime
4. **Upgrade Sentry/OpenTelemetry** : Faire avant production

---

## Conclusion

L'architecture V2 représente une évolution significative vers une architecture plus robuste, scalable et maintenable. Les principaux changements sont :

1. **Simplification** : Un seul provider AI (OpenAI)
2. **Event Sourcing** : Reconstitution exacte de l'état
3. **Prompt Orchestrator** : Orchestration multi-couches
4. **AI Guard** : Validation et correction
5. **Context Builder** : Optimisation du contexte
6. **Planner/Director** : Planification et décision dynamiques
7. **Secret Manager** : Gestion sécurisée des secrets

La migration nécessite un effort significatif (12-16 semaines) mais apportera des bénéfices majeurs en durabilité, observabilité et maintenabilité.
