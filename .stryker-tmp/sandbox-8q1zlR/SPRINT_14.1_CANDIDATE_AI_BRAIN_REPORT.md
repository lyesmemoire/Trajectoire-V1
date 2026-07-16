# SPRINT 14.1 — CandidateAIBrain

## Architecture

**Couche mémoire indépendante** pour centraliser les observations IA.

**Ne modifie pas:**
- CandidateGraph
- Intelligence Engines
- AIOrchestrator
- AI Providers
- AI Prompts

**Responsabilité unique:** Mémoriser les connaissances produites par les engines.

---

## Nouveaux Fichiers

### 1. BrainMemory.ts
**Fichier:** `core/ai/brain/BrainMemory.ts`

**Interfaces:**
- `BrainObservation` - Observation IA avec source, type, data, confidence
- `BrainPattern` - Pattern détecté avec fréquence, catégorie
- `BrainInsight` - Insight (strength, weakness, contradiction, progress, regression)
- `BrainGoal` - Objectif avec progression et deadline

**Fonctionnalités:**
- Stockage observations, patterns, insights, goals
- Détection automatique contradictions
- Détection automatique progressions/régressions
- Export/import JSON

### 2. BrainEvents.ts
**Fichier:** `core/ai/brain/BrainEvents.ts`

**Interface:**
- `BrainEvent` - Événement significatif (observation, insight, goal, contradiction, progress, regression)

**Fonctionnalités:**
- Tracking événements chronologiques
- Filtrage par type, sévérité, date
- Événements récents

### 3. BrainHistory.ts
**Fichier:** `core/ai/brain/BrainHistory.ts`

**Interface:**
- `BrainHistoryEntry` - Entrée historique avec prompt, input, output, metrics

**Fonctionnalités:**
- Historique complet exécutions IA
- Évolution par prompt ID
- Tendance (improving, declining, stable)
- Latence moyenne, coût moyen, taux succès

### 4. BrainTimeline.ts
**Fichier:** `core/ai/brain/BrainTimeline.ts`

**Interface:**
- `TimelineEvent` - Événement timeline avec impact (low, medium, high)

**Fonctionnalités:**
- Visualisation chronologique
- Événements high-impact
- Résumé par type et impact

### 5. BrainPatterns.ts
**Fichier:** `core/ai/brain/BrainPatterns.ts`

**Interface:**
- `PatternMatch` - Pattern détecté avec confidence, occurrences, catégorie

**Fonctionnalités:**
- Détection patterns depuis observations
- Catégorisation (strength, weakness, behavior, skill, risk)
- Évolution patterns dans le temps

### 6. CandidateAIBrain.ts
**Fichier:** `core/ai/brain/CandidateAIBrain.ts`

**Classe principale** orchestrant tous les composants brain.

**Composants:**
- `BrainMemory` - Stockage
- `BrainEvents` - Événements
- `BrainHistory` - Historique
- `BrainTimeline` - Timeline

---

## API Publique

### addObservation()
```typescript
addObservation(observation: Omit<BrainObservation, "id">): BrainObservation
```
Ajoute une observation depuis un AI engine.

**Exemple:**
```typescript
candidateAIBrain.addObservation({
  timestamp: new Date(),
  source: "interview-analysis",
  type: "interview",
  data: { score: 85, dimensions: {...} },
  confidence: 0.9
});
```

### addHistoryEntry()
```typescript
addHistoryEntry(entry: Omit<BrainHistoryEntry, "id">): BrainHistoryEntry
```
Ajoute une entrée historique d'exécution IA.

### addGoal()
```typescript
addGoal(goal: Omit<BrainGoal, "id" | "createdAt" | "updatedAt">): BrainGoal
```
Ajoute un objectif de développement.

### updateGoalProgress()
```typescript
updateGoalProgress(goalId: string, current: number): void
```
Met à jour la progression d'un objectif.

### getCurrentState()
```typescript
getCurrentState(): BrainState
```
Retourne l'état actuel du brain:
- Observations
- Patterns
- Insights
- Goals
- Résumé (counts)

### getHistory()
```typescript
getHistory(): BrainHistorySummary
```
Retourne l'historique avec évolution et métriques.

### getPatterns()
```typescript
getPatterns(): BrainPatternsSummary
```
Retourne les patterns:
- Tous les patterns
- Patterns récurrents (≥3 occurrences)
- Strengths
- Weaknesses
- Risks

### getRecommendationsContext()
```typescript
getRecommendationsContext(): BrainRecommendationsContext
```
Retourne le contexte complet pour recommandations:
- État actuel
- Historique
- Patterns
- Insights actionnables
- Goals en attente
- Événements récents

### getCoachingHistory()
```typescript
getCoachingHistory(): BrainInsight[]
```
Retourne l'historique de coaching.

### getStrengths()
```typescript
getStrengths(): PatternMatch[]
```
Retourne les forces détectées.

### getWeaknesses()
```typescript
getWeaknesses(): PatternMatch[]
```
Retourne les faiblesses détectées.

### getRecurringPatterns()
```typescript
getRecurringPatterns(): PatternMatch[]
```
Retourne les patterns récurrents.

### getImprovements()
```typescript
getImprovements(): BrainInsight[]
```
Retourne les améliorations détectées.

### getRegressions()
```typescript
getRegressions(): BrainInsight[]
```
Retourne les régressions détectées.

### getTimeline()
```typescript
getTimeline(): TimelineEvent[]
```
Retourne la timeline complète.

### getRecentEvents()
```typescript
getRecentEvents(limit?: number): BrainEvent[]
```
Retourne les événements récents.

### export()
```typescript
export(): string
```
Exporte toutes les données brain en JSON.

### import()
```typescript
import(json: string): void
```
Importe les données brain depuis JSON.

### clear()
```typescript
clear(): void
```
Efface toutes les données brain.

---

## Caractéristiques

**Sans dépendances:**
- ✅ Aucune dépendance React
- ✅ Aucun appel OpenAI
- ✅ Aucune UI
- ✅ Pure TypeScript

**Détection automatique:**
- ✅ Contradictions entre observations
- ✅ Progressions (amélioration scores)
- ✅ Régressions (déclin scores)
- ✅ Patterns récurrents

**Tracking:**
- ✅ Observations par type/source
- ✅ Événements chronologiques
- ✅ Historique exécutions IA
- ✅ Timeline avec impact
- ✅ Évolution patterns

---

## Validation

✅ **Lint:** `core/ai/brain/**/*.ts` passe ESLint (0 warnings)
✅ **Architecture:** Séparation claire avec couches existantes
✅ **API:** Interface publique complète
✅ **Idempotent:** Opérations idempotentes
✅ **Export/Import:** Persistance JSON

---

## Usage Exemple

```typescript
import { candidateAIBrain } from "./core/ai/brain/CandidateAIBrain";

// Après analyse ATS
candidateAIBrain.addObservation({
  timestamp: new Date(),
  source: "ats-analysis",
  type: "ats",
  data: atsResult,
  confidence: 0.85
});

// Après simulation entretien
candidateAIBrain.addObservation({
  timestamp: new Date(),
  source: "interview-analysis",
  type: "interview",
  data: interviewResult,
  confidence: 0.9
});

// Ajouter objectif
candidateAIBrain.addGoal({
  description: "Améliorer communication",
  target: "communication_score",
  current: 65,
  targetValue: 80,
  unit: "points",
  status: "pending"
});

// Obtenir état actuel
const state = candidateAIBrain.getCurrentState();
console.log(`Observations: ${state.summary.totalObservations}`);
console.log(`Strengths: ${state.summary.strengthsCount}`);
console.log(`Weaknesses: ${state.summary.weaknessesCount}`);

// Obtenir contexte recommandations
const context = candidateAIBrain.getRecommendationsContext();
// Utiliser pour générer recommandations personnalisées
```

---

## Intégration Future

**Avec AIOrchestrator:**
- Appel automatique `addObservation()` après chaque analyse
- Appel automatique `addHistoryEntry()` après chaque exécution

**Avec Intelligence Engines:**
- Enrichissement brain après chaque génération
- Contextualisation basée sur historique brain

**Avec CandidateGraph:**
- Projection brain → CandidateGraph
- Synchronisation patterns avec graph
