# SPRINT 14.1.1 — Event Driven Brain

## Architecture

**Découplage complet** entre engines et brain via EventBus.

**Flow:**
```
Engine → EventBus → CandidateAIBrain → Memory
```

**Caractéristiques:**
- Engines ne connaissent plus le brain
- Brain ne connaît plus les engines
- Communication unidirectionnelle via événements
- Aucune modification UI
- Aucun changement React

---

## Événements Créés

### 1. ObservationCreatedEvent
**Type:** `observation_created`

**Payload:**
- `source` - Prompt ID
- `observationType` - Type d'observation (interview, ats, communication, leadership, career, general)
- `data` - Données de l'observation
- `confidence` - Score de confiance (0-1)
- `metadata` - Métadonnées optionnelles

### 2. InterviewAnalyzedEvent
**Type:** `interview_analyzed`

**Payload:**
- `interviewId` - ID de l'entretien
- `transcript` - Transcript de l'entretien
- `analysis` - Résultat de l'analyse (unknown pour flexibilité)
- `metrics` - Latence, tokens, coût

### 3. ATSCompletedEvent
**Type:** `ats_completed`

**Payload:**
- `cvId` - ID du CV
- `jobDescriptionId` - ID de la description de poste
- `analysis` - Résultat de l'analyse ATS (unknown pour flexibilité)
- `metrics` - Latence, tokens, coût

### 4. CareerUpdatedEvent
**Type:** `career_updated`

**Payload:**
- `candidateId` - ID du candidat
- `analysis` - Résultat de l'analyse carrière (unknown pour flexibilité)
- `metrics` - Latence, tokens, coût

### 5. RecommendationGeneratedEvent
**Type:** `recommendation_generated`

**Payload:**
- `candidateId` - ID du candidat
- `recommendations` - Recommandations générées (unknown pour flexibilité)
- `metrics` - Latence, tokens, coût

### 6. GoalCompletedEvent
**Type:** `goal_completed`

**Payload:**
- `goalId` - ID de l'objectif
- `description` - Description de l'objectif
- `target` - Cible
- `achievedValue` - Valeur atteinte
- `targetValue` - Valeur cible
- `unit` - Unité de mesure
- `timeToAchieve` - Temps pour atteindre (jours)

---

## EventBus

**Fichier:** `core/ai/events/EventBus.ts`

**Fonctionnalités:**
- `subscribe()` - S'abonner à un type d'événement
- `unsubscribe()` - Se désabonner
- `publish()` - Publier un événement
- `subscribeAll()` - S'abonner à tous les événements
- `getHistory()` - Historique des événements
- `getHistoryByType()` - Historique par type
- `getHistoryByDateRange()` - Historique par plage de dates
- `clearHistory()` - Effacer l'historique
- `clearSubscriptions()` - Effacer tous les abonnements

**Options de subscription:**
- `filter` - Filtrer les événements
- `once` - S'exécuter une seule fois

**Singleton:** `eventBus` - Instance globale

---

## Abonnements Brain

**Fichier:** `core/ai/brain/CandidateAIBrain.ts`

**Méthode:** `setupEventSubscriptions()`

**Abonnements:**
1. `observation_created` → `handleObservationCreated()`
2. `interview_analyzed` → `handleInterviewAnalyzed()`
3. `ats_completed` → `handleATSCompleted()`
4. `career_updated` → `handleCareerUpdated()`
5. `recommendation_generated` → `handleRecommendationGenerated()`
6. `goal_completed` → `handleGoalCompleted()`

**Handlers:**
- Ajoutent observations à BrainMemory
- Ajoutent entrées à BrainHistory
- Déclenchent détection patterns
- Déclenchent détection insights
- Loguent événements dans BrainEvents
- Ajoutent milestones à BrainTimeline

---

## Intégration AI Engines

### InterviewAnalyzerAIEngine
**Modification:** `analyzeInterview(input, interviewId)`

**Nouveau paramètre:** `interviewId: string`

**Publication:**
```typescript
await eventBus.publish<InterviewAnalyzedEvent>({
  id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  timestamp: new Date(),
  type: "interview_analyzed",
  payload: {
    interviewId,
    transcript: input.transcript,
    analysis: result.data,
    metrics: { latency, tokens, cost }
  }
});
```

### ATSAIEngine
**Modification:** `analyzeATS(input)`

**Nouveaux paramètres optionnels:** `cvId?: string`, `jobDescriptionId?: string`

**Publication:** Si IDs fournis, publie `ATSCompletedEvent`

### CareerAnalysisAIEngine
**Modification:** `analyzeCareer(input)`

**Nouveau paramètre optionnel:** `candidateId?: string`

**Publication:** Si candidateId fourni, publie `CareerUpdatedEvent`

### RecommendationsAIEngine
**Modification:** `generateRecommendations(input)`

**Nouveau paramètre optionnel:** `candidateId?: string`

**Publication:** Si candidateId fourni, publie `RecommendationGeneratedEvent`

---

## Nouveaux Fichiers

**Événements:**
- `core/ai/events/BrainEvents.ts` - Définitions événements métier
- `core/ai/events/EventBus.ts` - Système pub/sub

**Modifiés:**
- `core/ai/brain/CandidateAIBrain.ts` - Abonnements EventBus
- `core/intelligence/engines/interviewAnalyzerAIEngine.ts` - Publication événements
- `core/intelligence/engines/atsAIEngine.ts` - Publication événements
- `core/intelligence/engines/careerAnalysisAIEngine.ts` - Publication événements
- `core/intelligence/engines/recommendationsAIEngine.ts` - Publication événements

---

## Validation

✅ **Lint:** Tous les fichiers passent ESLint (0 warnings)
✅ **Architecture:** Découplage complet engines/brain
✅ **EventBus:** Pub/sub fonctionnel
✅ **Abonnements:** Brain s'abonne automatiquement
✅ **Publication:** Engines publient événements
✅ **Type safety:** Types TypeScript stricts
✅ **Flexibilité:** `unknown` pour payloads flexibles

---

## Flow Complet

```
Interview terminé
    ↓
InterviewAnalyzerAIEngine.analyzeInterview(interviewId)
    ↓
AIOrchestrator.execute()
    ↓
Résultat IA
    ↓
eventBus.publish(InterviewAnalyzedEvent)
    ↓
CandidateAIBrain.handleInterviewAnalyzed()
    ↓
BrainMemory.addObservation()
BrainHistory.addEntry()
BrainPatterns.detectPatterns()
BrainInsights.detectInsights()
    ↓
État brain enrichi
```

---

## Avantages

**Découplage:**
- Engines ne connaissent pas le brain
- Brain ne connaît pas les engines
- Ajout de nouveaux abonnés sans modifier engines

**Extensibilité:**
- Nouveaux événements facilement ajoutés
- Nouveaux abonnés facilement ajoutés
- Pattern pub/sub standard

**Testabilité:**
- Engines testables sans brain
- Brain testable sans engines
- EventBus testable isolément

**Observabilité:**
- Historique événements complet
- Tracking flux de données
- Debug facilité
