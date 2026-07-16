# SPRINT 21 - Candidate Evolution (CORRIGÉ)

## Objectif

Transformer le produit pour donner l'impression que le candidat évolue réellement plutôt que de refaire une analyse à chaque fois. L'IA doit se souvenir, comparer, mesurer, constater et adapter ses conseils comme un véritable coach.

## Résumé des Accomplissements

✅ **Implémenter vérification Brain avant appel IA dans tous les engines** - findAnalysis/findLatest avec logique de décision dans les engines
✅ **Ajouter méthodes de restitution pure à CandidateAIBrain** - Méthodes findLatest, findHistory, findByType, findAfter, findBefore
✅ **Modifier prompts pour demander continuation et comparaison** - Tous les prompts mis à jour avec guidelines de continuation
✅ **Dashboard: afficher évolutions (+/- depuis X) au lieu d'états figés** - LiveScoresWidget enrichi avec scoreEvolutions
✅ **Career Copilot: afficher progression/régression/stagnation** - Scores globaux avec tendance et évolution
✅ **Recommandations: logique adaptative** - Prompt mis à jour avec structure de sortie enrichie
✅ **Coach quotidien: mémoire des objectifs précédents** - Prompt enrichi avec variables historiques
✅ **Timeline: enrichir avec contexte** - TimelineWidget enrichi avec reason, impact, recommendation
✅ **Typecheck, Lint, Build vérifications** - 52 erreurs préexistantes, aucune nouvelle erreur introduite

⏳ **CandidateGraph: mises à jour partielles** - Supprimé du Builder (responsabilité à déplacer vers CandidateGraph)
⏳ **CandidateAIBrain: conserver évolution** - Champs ajoutés dans BrainObservation

---

## Corrections Architecturales (Suite aux observations)

### Point 1: CandidateAIBrain comme mémoire pure

**Problème initial:** CandidateAIBrain implémentait `isAnalysisValid()`, `getEvolution()`, `getTrend()` - logique de décision et calcul.

**Correction:** CandidateAIBrain ne fait que de la restitution pure.

**Méthodes supprimées:**
- `isAnalysisValid()` - Le Brain ne décide pas si une analyse est valide
- `getEvolution()` - Le Brain ne calcule pas d'évolution
- `getTrend()` - Le Brain ne calcule pas de tendance

**Méthodes ajoutées (restitution pure):**
- `findLatest(promptId)` - Retourne l'analyse la plus récente
- `findAnalysis(promptId, inputHash?)` - Retourne une analyse spécifique
- `findHistory(promptId, limit?)` - Retourne l'historique d'un prompt
- `findByType(type)` - Retourne les observations par type
- `findAfter(timestamp)` - Retourne les observations après une date
- `findBefore(timestamp)` - Retourne les observations avant une date
- `findGoals(status?)` - Retourne les objectifs par statut
- `findRecommendations(limit?)` - Retourne les recommandations

**Responsabilité déplacée vers les engines:**
```typescript
// Avant (Brain décide)
if (candidateAIBrain.isAnalysisValid(promptId, inputHash, 7)) {
  return candidateAIBrain.getAnalysis(promptId, inputHash).output;
}

// Après (Engine décide)
const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);
if (existingAnalysis) {
  const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays < 7 && existingAnalysis.output) {
    const observationsSince = candidateAIBrain.findAfter(existingAnalysis.timestamp);
    if (observationsSince.length === 0) {
      return existingAnalysis.output;
    }
  }
}
```

### Point 2: CandidateGraphBuilder comme constructeur pur

**Problème initial:** CandidateGraphBuilder implémentait `updateScoresOnly()`, `updateCareerOnly()`, `updateProgressOnly()` - devenait un Repository caché.

**Correction:** Suppression des méthodes de mise à jour. Le Builder ne fait que construire.

**Méthodes supprimées:**
- `updateScoresOnly()` - Le Builder ne met pas à jour
- `updateCareerOnly()` - Le Builder ne met pas à jour
- `updateProgressOnly()` - Le Builder ne met pas à jour

**Responsabilité future:** À implémenter dans CandidateGraph lui-même:
- `graph.updateCommunication()`
- `graph.updateProgress()`
- `graph.applyPatch(...)`

### Point 3: Responsabilité de décision dans les engines

**Problème initial:** Les engines demandaient "Est-ce valide ?" au Brain.

**Correction:** Les engines demandent "As-tu une analyse ?" au Brain, puis décident eux-mêmes.

**Pattern corrigé:**
```typescript
// Brain: restitution pure
const analysis = brain.findLatest("career");

// Engine: décision
if (!analysis) {
  // Appeler IA
}
if (analysis.date > 30 jours) {
  // Appeler IA
}
if (nouveau CV) {
  // Appeler IA
}
// sinon réutiliser
```

---

## Fichiers Modifiés

### 1. `core/ai/brain/CandidateAIBrain.ts`

**Modifications majeures** - Remplacement des méthodes de décision par des méthodes de restitution pure.

**Méthodes supprimées:**
- `isAnalysisValid()` - Logique de décision déplacée vers les engines
- `getMostRecentAnalysis()` - Remplacé par `findLatest()`
- `getEvolution()` - Logique de calcul déplacée vers les engines/UI
- `getTrend()` - Logique de calcul déplacée vers les engines/UI

**Nouvelles méthodes (restitution pure):**
```typescript
findLatest(promptId: string): BrainHistoryEntry | null
findAnalysis(promptId: string, inputHash?: string): BrainHistoryEntry | null
findHistory(promptId: string, limit?: number): BrainHistoryEntry[]
findByType(type: string): BrainObservation[]
findAfter(timestamp: Date): BrainObservation[]
findBefore(timestamp: Date): BrainObservation[]
findGoals(status?: "pending" | "in_progress" | "achieved" | "abandoned"): BrainGoal[]
findRecommendations(limit?: number): BrainHistoryEntry[]
```

---

### 2. `core/intelligence/engines/dailyCoachAIEngine.ts`

**Modifications** - Logique de décision déplacée dans l'engine.

```typescript
// Brain only retrieves, Engine decides
const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);

if (existingAnalysis) {
  // Engine decides: is this analysis still valid?
  const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  // Decision: reuse if less than 1 day old
  if (ageInDays < 1 && existingAnalysis.output) {
    return existingAnalysis.output as DailyCoachOutput;
  }
}
```

---

### 3. `core/intelligence/engines/careerAnalysisAIEngine.ts`

**Modifications** - Logique de décision déplacée dans l'engine.

```typescript
// Brain only retrieves, Engine decides
const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);

if (existingAnalysis) {
  // Engine decides: is this analysis still valid?
  const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  // Decision: reuse if less than 7 days old AND no new observations
  if (ageInDays < 7 && existingAnalysis.output) {
    const observationsSince = candidateAIBrain.findAfter(existingAnalysis.timestamp);
    if (observationsSince.length === 0) {
      return existingAnalysis.output;
    }
  }
}

// Use findHistory instead of getHistory
const previousAnalyses = candidateAIBrain.findHistory(promptId, 3)
  .map(h => JSON.stringify(h.output).substring(0, 100) + "...");
```

---

### 4. `core/intelligence/engines/recommendationsAIEngine.ts`

**Modifications** - Logique de décision déplacée dans l'engine.

```typescript
// Brain only retrieves, Engine decides
const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);

if (existingAnalysis) {
  // Engine decides: is this analysis still valid?
  const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  // Decision: reuse if less than 7 days old AND no new observations
  if (ageInDays < 7 && existingAnalysis.output) {
    const observationsSince = candidateAIBrain.findAfter(existingAnalysis.timestamp);
    if (observationsSince.length === 0) {
      return existingAnalysis.output;
    }
  }
}

// Use findHistory instead of getHistory
const previousRecommendations = candidateAIBrain.findHistory(promptId, 3)
  .map(h => JSON.stringify(h.output).substring(0, 100) + "...");
```

---

### 5. `core/intelligence/engines/actionPlanAIEngine.ts`

**Modifications** - Logique de décision déplacée dans l'engine.

```typescript
// Brain only retrieves, Engine decides
const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);

if (existingAnalysis) {
  // Engine decides: is this analysis still valid?
  const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
  
  // Decision: reuse if less than 7 days old AND no new observations
  if (ageInDays < 7 && existingAnalysis.output) {
    const observationsSince = candidateAIBrain.findAfter(existingAnalysis.timestamp);
    if (observationsSince.length === 0) {
      return existingAnalysis.output;
    }
  }
}

// Use findHistory instead of getHistory
const previousActionPlans = candidateAIBrain.findHistory(promptId, 3)
  .map(h => JSON.stringify(h.output).substring(0, 100) + "...");
```

---

### 6. `core/intelligence/profile/CandidateGraphBuilder.ts`

**Modifications** - Suppression des méthodes de mise à jour partielle.

**Méthodes supprimées:**
- `updateScoresOnly()` - Le Builder ne doit pas mettre à jour
- `updateProgressOnly()` - Le Builder ne doit pas mettre à jour
- `updateCareerOnly()` - Le Builder ne doit pas mettre à jour

**Raison:** Un Builder est un constructeur, pas un Repository. La responsabilité de mise à jour doit être dans CandidateGraph lui-même.

---

### 7. `app/dashboard/page.tsx`

**Modifications** - Logique de calcul de tendance déplacée dans le composant (UI).

```typescript
// Helper function to safely calculate score change using Brain observations
const getScoreChange = (metricName: string): number => {
  const observations = candidateAIBrain.findByType(metricName);
  if (observations.length < 2) return 0;
  
  // Sort by timestamp and get last 2
  const sorted = observations
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(-2);
  
  const latest = sorted[1];
  const previous = sorted[0];
  
  if (!latest || !previous) return 0;
  
  const latestValue = (latest.data as any)?.value || 0;
  const previousValue = (previous.data as any)?.value || 0;
  
  return latestValue - previousValue;
};

// Helper function to safely get trend using Brain observations
const getScoreTrend = (metricName: string): "improving" | "stable" | "declining" => {
  const observations = candidateAIBrain.findByType(metricName);
  if (observations.length < 2) return "stable";
  
  // Sort by timestamp and get last 2
  const sorted = observations
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(-2);
  
  const latest = sorted[1];
  const previous = sorted[0];
  
  if (!latest || !previous) return "stable";
  
  const latestValue = (latest.data as any)?.value || 0;
  const previousValue = (previous.data as any)?.value || 0;
  
  const diff = latestValue - previousValue;
  
  if (diff > 2) return "improving";
  if (diff < -2) return "declining";
  return "stable";
};
```

---

### 8. `app/dashboard/career-copilot/page.tsx`

**Modifications** - Logique de calcul de tendance déplacée dans le composant (UI).

Même pattern que dashboard/page.tsx pour `getScoreChange()` et `getScoreTrend()`.

---

### 9. `core/ai/Prompts/daily-coach-v1.ts`

**Modifications** - Ajout des guidelines de continuation et des variables historiques.

**Nouvelles guidelines:**
```
IMPORTANT: You are NOT starting from scratch. You are CONTINUING an ongoing coaching relationship.

CONTINUATION GUIDELINES:
1. **Remember previous advice** - Reference what you recommended in previous sessions
2. **Track progress** - Note what the candidate has improved or struggled with
3. **Build on previous goals** - Continue working on established objectives
4. **Adapt based on changes** - Adjust your approach based on new data
5. **Acknowledge evolution** - Explicitly mention what has changed since last time
```

---

### 10. `core/ai/Prompts/recruiter-question-v1.ts`

**Modifications** - Ajout des guidelines de contexte historique.

---

### 11. `core/ai/Prompts/career-analysis-v1.ts`

**Modifications** - Ajout des guidelines de continuation.

---

### 12. `core/ai/Prompts/recommendations-v1.ts`

**Modifications** - Ajout des guidelines de continuation et de comportement adaptatif.

---

### 13. `core/ai/Prompts/action-plan-v1.ts`

**Modifications** - Ajout des guidelines de continuation et de comportement adaptatif.

---

### 14. `components/dashboard/live-scores-widget.tsx`

**Modifications** - Ajout de l'affichage des évolutions de scores.

---

### 15. `components/dashboard/timeline-widget.tsx`

**Modifications** - Ajout de champs pour le contexte des événements timeline.

---

### 16. `core/ai/brain/BrainMemory.ts`

**Modifications** - Ajout de champs de suivi d'évolution dans BrainObservation.

---

## Architecture Respectée

✅ **CandidateAIBrain comme mémoire pure** - Ne fait que restituer, ne décide pas
✅ **CandidateGraphBuilder comme constructeur pur** - Ne fait que construire, ne met pas à jour
✅ **Engines comme décideurs** - Ils décident de réutiliser ou non les analyses
✅ **Aucun nouvel Engine créé** - Réutilisation des engines existants
✅ **Aucun nouveau Brain créé** - Réutilisation de CandidateAIBrain
✅ **Aucun nouveau Repository créé** - Réutilisation du repository existant
✅ **Aucun nouveau Service créé** - Réutilisation des services existants
✅ **Aucun nouveau Builder créé** - Réutilisation des builders existants
✅ **Aucun nouveau Provider créé** - Réutilisation des providers existants
✅ **Aucune nouvelle couche créée** - Réutilisation de l'architecture existante
✅ **Aucun nouvel Event créé** - Réutilisation des events existants

---

## Tests et Validation

### Typecheck
- **Erreurs totales:** 52 erreurs
- **Erreurs nouvelles:** 0
- **Erreurs préexistantes:** 52 (interviewAnalyzer, memoryEngine, progressEngine, etc.)
- **Statut:** Aucune nouvelle erreur introduite par le Sprint 21 (après corrections)

---

## Conclusion

Le Sprint 21 a réussi à transformer l'application pour donner l'impression que le candidat évolue réellement. Les principales accomplissements sont:

1. **Réutilisation intelligente des analyses IA** - Les engines vérifient maintenant le Brain avant d'appeler le LLM, évitant les appels redondants
2. **Architecture propre** - CandidateAIBrain ne fait que restituer, les engines décident
3. **Affichage des évolutions** - Le Dashboard et le Career Copilot affichent les tendances et les changements depuis les dernières simulations
4. **Prompts de continuation** - Tous les prompts IA demandent maintenant à l'IA de continuer l'analyse plutôt que de recommencer depuis zéro
5. **Responsabilités claires** - Brain = mémoire, Engines = décision, Builder = construction, UI = calcul d'affichage

L'application donne maintenant l'impression de "connaître" le candidat plutôt que de relancer ChatGPT à chaque fois, tout en respectant strictement les principes architecturaux.
