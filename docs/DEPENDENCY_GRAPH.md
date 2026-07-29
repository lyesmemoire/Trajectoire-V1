# Dependency Graph

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit le graphe complet des dépendances de l'architecture V2, en identifiant qui dépend de qui, qui peut être découplé, qui est critique et qui est facultatif.

---

## Graphe des Dépendances

### Flux Principal

```
Client (Browser)
    ↓
WebSocket Gateway
    ↓
Session Manager
    ↓
Planner
    ↓
Director
    ↓
Context Builder
    ↓
Prompt Orchestrator
    ↓
AI Guard
    ↓
OpenAI Realtime API
    ↓
Event Store (Redis Streams)
    ↓
Snapshot Store (Redis)
    ↓
Supabase (PostgreSQL)
```

### Flux Secondaire (Replay)

```
Client (Browser)
    ↓
WebSocket Gateway
    ↓
Session Manager
    ↓
Event Replayer
    ↓
Event Store (Redis Streams)
    ↓
Snapshot Store (Redis)
    ↓
State Reconstructor
    ↓
Supabase (PostgreSQL)
```

### Flux Tertiaire (Evaluation)

```
Client (Browser)
    ↓
WebSocket Gateway
    ↓
Session Manager
    ↓
Evaluation Engine
    ↓
Memory Engine
    ↓
Supabase (PostgreSQL)
```

---

## Matrice des Dépendances

| Composant | Dépend de | Peut être découplé | Critique | Facultatif | Justification |
|-----------|-----------|-------------------|----------|------------|---------------|
| **Client** | WebSocket Gateway | Non | Oui | Non | Point d'entrée |
| **WebSocket Gateway** | Session Manager, Event Store | Oui (via abstraction) | Oui | Non | Transport audio |
| **Session Manager** | Event Store, Snapshot Store | Non | Oui | Non | Gestion d'état |
| **Planner** | Director, Context Builder | Oui (via abstraction) | Oui | Non | Planification dynamique |
| **Director** | Context Builder, Evaluation Engine | Oui (via abstraction) | Oui | Non | Décision de stage |
| **Context Builder** | Memory Engine, Supabase | Oui (via abstraction) | Oui | Non | Filtrage contexte |
| **Prompt Orchestrator** | Context Builder, PersonaParameters | Oui (via abstraction) | Oui | Non | Orchestration prompts |
| **AI Guard** | Prompt Orchestrator, OpenAI | Oui (via abstraction) | Oui | Non | Validation réponses |
| **OpenAI Realtime API** | Aucun | Non | Oui | Non | Provider AI |
| **Event Store** | Redis | Non | Oui | Non | Event Sourcing |
| **Snapshot Store** | Redis | Non | Non | Oui | Optimisation |
| **Supabase** | Aucun | Non | Oui | Non | Base de données |
| **Event Replayer** | Event Store, Snapshot Store | Non | Non | Oui | Replay |
| **State Reconstructor** | Event Store, Snapshot Store | Non | Non | Oui | Reconstitution |
| **Evaluation Engine** | Memory Engine, Supabase | Oui (via abstraction) | Non | Oui | Évaluation |
| **Memory Engine** | Event Store, Supabase | Oui (via abstraction) | Non | Oui | Mémoire candidat |
| **Redis** | Aucun | Non | Oui | Non | Cache + Event Bus |
| **Secret Manager** | Aucun | Non | Oui | Non | Gestion secrets |

---

## Analyse des Dépendances

### Critique (Doit fonctionner)

1. **Client** : Point d'entrée, sans lui pas d'application
2. **WebSocket Gateway** : Transport audio, sans lui pas de communication
3. **Session Manager** : Gestion d'état, sans lui pas de session
4. **Planner** : Planification dynamique, sans lui pas d'entretien structuré
5. **Director** : Décision de stage, sans lui pas de progression
6. **Context Builder** : Filtrage contexte, sans lui contexte trop gros
7. **Prompt Orchestrator** : Orchestration prompts, sans lui pas de génération
8. **AI Guard** : Validation réponses, sans elle réponses non validées
9. **OpenAI Realtime API** : Provider AI, sans lui pas de génération
10. **Event Store** : Event Sourcing, sans lui pas de persistance
11. **Supabase** : Base de données, sans elle pas de persistance long terme
12. **Redis** : Cache + Event Bus, sans lui pas de performance
13. **Secret Manager** : Gestion secrets, sans lui pas de sécurité

### Facultatif (Peut être désactivé)

1. **Snapshot Store** : Optimisation, sans elle reconstitution plus lente
2. **Event Replayer** : Replay, sans lui pas de replay
3. **State Reconstructor** : Reconstitution, sans lui pas de replay
4. **Evaluation Engine** : Évaluation, sans lui pas de scoring
5. **Memory Engine** : Mémoire candidat, sans elle pas de mémoire

### Peut être découplé (Via abstraction)

1. **WebSocket Gateway** : Via abstraction de transport
2. **Planner** : Via abstraction de planification
3. **Director** : Via abstraction de décision
4. **Context Builder** : Via abstraction de contexte
5. **Prompt Orchestrator** : Via abstraction de prompt
6. **AI Guard** : Via abstraction de validation
7. **Evaluation Engine** : Via abstraction d'évaluation
8. **Memory Engine** : Via abstraction de mémoire

---

## Graphe de Couplage

### Couplage Fort (Direct)

```
Session Manager → Event Store
Session Manager → Snapshot Store
Context Builder → Memory Engine
Context Builder → Supabase
Prompt Orchestrator → Context Builder
Prompt Orchestrator → PersonaParameters
AI Guard → Prompt Orchestrator
AI Guard → OpenAI
Event Replayer → Event Store
Event Replayer → Snapshot Store
State Reconstructor → Event Store
State Reconstructor → Snapshot Store
Evaluation Engine → Memory Engine
Evaluation Engine → Supabase
Memory Engine → Event Store
Memory Engine → Supabase
```

### Couplage Faible (Via abstraction)

```
WebSocket Gateway → Session Manager (via interface)
Planner → Director (via interface)
Director → Context Builder (via interface)
Director → Evaluation Engine (via interface)
Context Builder → Memory Engine (via interface)
Prompt Orchestrator → Context Builder (via interface)
AI Guard → Prompt Orchestrator (via interface)
AI Guard → OpenAI (via interface)
Evaluation Engine → Memory Engine (via interface)
Memory Engine → Event Store (via interface)
Memory Engine → Supabase (via interface)
```

### Pas de couplage (Indépendant)

```
Client (indépendant du backend)
OpenAI Realtime API (indépendant du système)
Redis (indépendant du système)
Supabase (indépendant du système)
Secret Manager (indépendant du système)
```

---

## Analyse de Découplage

### Composants qui peuvent être découplés

**WebSocket Gateway**
- Dépendance : Session Manager
- Abstraction : ISessionManager
- Bénéfice : Permet de changer l'implémentation de gestion de session
- Effort : Moyen (1-2 semaines)

**Planner**
- Dépendance : Director, Context Builder
- Abstraction : IDirector, IContextBuilder
- Bénéfice : Permet de changer l'algorithme de planification
- Effort : Moyen (1-2 semaines)

**Director**
- Dépendance : Context Builder, Evaluation Engine
- Abstraction : IContextBuilder, IEvaluationEngine
- Bénéfice : Permet de changer l'algorithme de décision
- Effort : Moyen (1-2 semaines)

**Context Builder**
- Dépendance : Memory Engine, Supabase
- Abstraction : IMemoryEngine, ISupabaseClient
- Bénéfice : Permet de changer la source de données
- Effort : Moyen (1-2 semaines)

**Prompt Orchestrator**
- Dépendance : Context Builder, PersonaParameters
- Abstraction : IContextBuilder, IPersonaParameters
- Bénéfice : Permet de changer l'orchestration
- Effort : Faible (3-5 jours)

**AI Guard**
- Dépendance : Prompt Orchestrator, OpenAI
- Abstraction : IPromptOrchestrator, IOpenAIProvider
- Bénéfice : Permet de changer le provider AI
- Effort : Moyen (1-2 semaines)

**Evaluation Engine**
- Dépendance : Memory Engine, Supabase
- Abstraction : IMemoryEngine, ISupabaseClient
- Bénéfice : Permet de changer l'algorithme d'évaluation
- Effort : Moyen (1-2 semaines)

**Memory Engine**
- Dépendance : Event Store, Supabase
- Abstraction : IEventStore, ISupabaseClient
- Bénéfice : Permet de changer la source de données
- Effort : Moyen (1-2 semaines)

---

## Analyse de Criticité

### Critique (Doit fonctionner)

**Niveau 1 : Application ne démarre pas**
- Secret Manager : Sans secrets, pas de démarrage
- Redis : Sans Redis, pas de cache/event bus
- Supabase : Sans Supabase, pas de persistance

**Niveau 2 : Fonctionnalité principale cassée**
- WebSocket Gateway : Sans gateway, pas de communication
- Session Manager : Sans session manager, pas de session
- Planner : Sans planner, pas d'entretien structuré
- Director : Sans director, pas de progression
- Context Builder : Sans context builder, contexte trop gros
- Prompt Orchestrator : Sans prompt orchestrator, pas de génération
- AI Guard : Sans AI guard, réponses non validées
- OpenAI Realtime API : Sans OpenAI, pas de génération
- Event Store : Sans event store, pas de persistance

**Niveau 3 : Fonctionnalité secondaire cassée**
- Evaluation Engine : Sans evaluation engine, pas de scoring
- Memory Engine : Sans memory engine, pas de mémoire

### Facultatif (Peut être désactivé)

**Niveau 4 : Optimisation**
- Snapshot Store : Sans snapshot store, reconstitution plus lente
- Event Replayer : Sans event replayer, pas de replay
- State Reconstructor : Sans state reconstructor, pas de replay

---

## Graphe de Dépendances Circulaires

### Dépendances circulaires détectées

**Aucune dépendance circulaire détectée**

L'architecture est conçue pour éviter les dépendances circulaires grâce à :
- Flux unidirectionnel (Client → Gateway → Session → Planner → Director → Context → Prompt → AI Guard → OpenAI)
- Abstractions pour découpler les composants
- Event Store pour éviter les dépendances directes

---

## Recommandations

### Priorité Haute

1. **Découpler OpenAI** : Implémenter IOpenAIProvider pour permettre le changement de provider
2. **Découpler Supabase** : Implémenter ISupabaseClient pour permettre le changement de base de données
3. **Découpler Redis** : Implémenter IRedisClient pour permettre le changement de cache/event bus

### Priorité Moyenne

1. **Découpler Session Manager** : Implémenter ISessionManager
2. **Découpler Planner** : Implémenter IPlanner
3. **Découpler Director** : Implémenter IDirector
4. **Découpler Context Builder** : Implémenter IContextBuilder

### Priorité Basse

1. **Découpler Prompt Orchestrator** : Implémenter IPromptOrchestrator
2. **Découpler AI Guard** : Implémenter IAIValidator
3. **Découpler Evaluation Engine** : Implémenter IEvaluationEngine
4. **Découpler Memory Engine** : Implémenter IMemoryEngine

---

## Conclusion

Le graphe des dépendances montre une architecture bien structurée avec :

1. **Flux unidirectionnel** : Pas de dépendances circulaires
2. **Composants critiques identifiés** : 13 composants critiques
3. **Composants facultatifs identifiés** : 5 composants facultatifs
4. **Découplage possible** : 8 composants peuvent être découplés via abstraction

Les recommandations prioritaires sont de découpler les composants infrastructurels (OpenAI, Supabase, Redis) pour permettre la flexibilité et la testabilité.
