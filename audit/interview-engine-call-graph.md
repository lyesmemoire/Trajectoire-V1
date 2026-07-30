# Call Graph - Moteur d'Entretien

Ce graphe retrace les appels réels lors de l'envoi d'un message par l'utilisateur, basé sur le code actuel. Le flux théorique prévu par l'architecture DDD est comparé au flux réel.

## 1. Flux Réel (Ce qui tourne en production)

```mermaid
graph TD
    A[Client Web] -->|POST /api/simulation/message| B(route.ts)
    B -->|Validation Zod| C[SendMessageSchema]
    B -->|Check| D[BillingService & IdempotencyService]
    B -->|Container.resolve| E[ConversationService]
    
    E -->|1. verify auth & active session| F[(SessionRepository)]
    E -->|2. verify limits| G[RateLimiter & QuotaService]
    E -->|3. get message history| H[(MessageRepository)]
    
    E -->|4. Generate Response| I[InterviewService]
    
    I -->|slice-10| J[Troncature naïve de l'historique]
    I -->|Concaténation| K[System Prompt Statique]
    I -->|chatCompletion| L[OpenAI API GPT-4o]
    
    L -->|String Text| I
    I -->|Response| E
    
    E -->|5. Save AI Message| H
    E -->|6. Audit Log| M[AuditService]
    E -->|Return| B
    B -->|Redirect| A
```

### Constat sur le flux réel :
- L'appel direct de `ConversationService` à `InterviewService` ignore toute couche d'orchestration ou de logique métier avancée (Personas, Mémoire intelligente).
- Tout repose sur OpenAI, le code sert de simple tunnel.

---

## 2. Flux Théorique (Prévu par l'architecture, mais non connecté)

```mermaid
graph TD
    A[Client Web] --> B(route.ts)
    B --> E[ConversationService]
    
    E -->|Orchestration| O[Orchestrator / StateMachine]
    
    O -->|1. Récupère état| S[ConversationStateEntity]
    O -->|2. Choisit stratégie| P[RecruiterPersona]
    O -->|3. Définit difficulté| D[DifficultyLevelVO]
    
    O -->|4. Met à jour mémoire| M[MemoryManager]
    M -->|Sliding Window| M1[ConversationMemory]
    M -->|Archive| M2[SummaryMemory]
    
    O -->|5. Construit Prompt| PB[AdvancedPromptBuilder]
    PB -->|Couche 1| PB1[System Rules]
    PB -->|Couche 2| PB2[Persona Inject]
    PB -->|Couche 3| PB3[Memory Context]
    
    PB -->|6. Call LLM| I[InterviewService]
    I -->|chatCompletion| L[OpenAI API]
    
    L -->|Response| O
    O -->|7. Update State| S
    O -->|Return| E
```

### Analyse des divergences :
Le flux théorique a été partiellement codé (les briques `S`, `P`, `D`, `M`, `PB` existent dans le code), mais l'orchestrateur `O` qui était censé tout lier **n'existe pas**. En conséquence, l'application a court-circuité toutes les briques pour relier directement `E` à `I` via un appel `slice` brutal sur l'historique.
