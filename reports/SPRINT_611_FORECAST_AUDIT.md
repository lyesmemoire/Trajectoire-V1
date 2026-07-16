# Sprint 6.11 - Forecast Intelligence Engine Audit

## Overview

**Date**: 2026-07-13  
**Engine**: CareerCopilotForecastEngine  
**Status**: Audit Complete  
**Next Step**: Compare with INTELLIGENCE_ENGINE_STANDARD_V1

---

## État Initial

### Fichier Principal
- **Location**: `core/intelligence/engines/careerCopilotForecastEngine.ts`
- **Pattern**: Intelligence Engine (synchronous analysis, NOT conversational)
- **Lines**: 294

### Architecture Actuelle

```
CareerCopilotForecastEngine.generateForecast()
↓
Extract data from CandidateGraph
↓
Extract observations from CandidateAIBrain
↓
Extract context from other engines (Success, Scenario, Constraint, Resource, KnowledgeEvolution)
↓
aiOrchestrator.execute(careerCopilotForecastV1, variables, config)
↓
Save result to CandidateAIBrain
↓
Publish event to EventBus
↓
Return ForecastOutput
```

---

## Logique IA Identifiée

### Appel LLM Direct
```typescript
const result = await aiOrchestrator.execute<ForecastOutput>(
  careerCopilotForecastV1,
  { /* 15 variables */ },
  {
    provider: "openai",
    model: "gpt-4-turbo",
    promptId: "career-copilot-forecast",
    promptVersion: "v1",
    temperature: 0.7,
    maxTokens: 1500,
  }
);
```

### Prompt
- **File**: `core/ai/Prompts/career-copilot-forecast-v1.ts`
- **Variables**: 15 variables (candidateProfile, candidateGraph, historicalObservations, currentGoals, recommendations, progressionPlan, digitalTwin, dailySummary, trends, previousForecasts, successContext, scenarioContext, constraintContext, resourceContext, knowledgeEvolutionContext)

### Transformations
- Extraction de données depuis CandidateGraph
- Extraction d'observations depuis CandidateAIBrain
- Extraction de contexte depuis 6 autres engines
- Formatage en JSON string pour variables de prompt

---

## DTO Identifiés

### ForecastInput
```typescript
export interface ForecastInput {
  candidateGraph: any;  // ⚠️ VIOLATION: any type
}
```

### ForecastOutput
```typescript
export interface ForecastOutput {
  today: {
    score: number;
    employability: number;
    mainObjective: string;
    currentTrend: string;
  };
  currentTrajectory: {
    trend: "improving" | "stable" | "declining";
    pace: "fast" | "moderate" | "slow";
    description: string;
  };
  probableFuture: { /* ... */ };
  why: { /* ... */ };
  whatCanAccelerate: { /* ... */ };
  whatCanSlowDown: { /* ... */ };
  successProbability: { /* ... */ };
  predictionConfidence: { /* ... */ };
  priorityActions: string[];
}
```

**Observations**:
- DTO bien structuré avec types stricts
- Pas de Date objects (bon)
- Immutabilité non explicite (readonly manquant)

---

## Dépendances Identifiées

### Dépendances Directes
1. `aiOrchestrator` - Appel LLM
2. `candidateAIBrain` - Stockage observations
3. `eventBus` - Publication événements
4. `careerCopilotForecastV1` - Prompt template

### Dépendances d'Engines
1. `CareerCopilotSuccessIntelligenceEngine` - Contexte optimisation succès
2. `CareerCopilotScenarioIntelligenceEngine` - Contexte scénarios multi-futurs
3. `CareerCopilotConstraintIntelligenceEngine` - Contexte contraintes
4. `CareerCopilotResourceIntelligenceEngine` - Contexte ressources
5. `CareerCopilotKnowledgeEvolutionEngine` - Contexte évolution connaissance

### Dépendances de Données
- `CandidateGraph` - Données candidat
- `CandidateAIBrain` - Observations historiques

---

## Violations des Contraintes

### 1. Type `any` dans DTO
- **Location**: `ForecastInput.candidateGraph: any`
- **Violation**: Interdiction d'utiliser `any`
- **Impact**: Type safety compromis
- **Correction requise**: Remplacer par type CandidateGraph strict

### 2. Utilisation de `new Date()`
- **Locations**: 
  - Ligne 269: `timestamp: new Date()`
  - Ligne 279: `timestamp: new Date()`
- **Violation**: Interdiction d'utiliser Date dans DTO (ISO strings requis)
- **Impact**: Sérialisation problématique
- **Correction requise**: Utiliser `new Date().toISOString()`

### 3. DTOs non immutables
- **Location**: ForecastOutput (tous les champs)
- **Violation**: DTOs doivent être immutables (readonly)
- **Impact**: Possibilité de mutation accidentelle
- **Correction requise**: Ajouter `readonly` à tous les champs

---

## Appels SDK IA Identifiés

### Direct AI SDK Access
- **Component**: `aiOrchestrator`
- **Method**: `execute()`
- **Provider**: "openai"
- **Model**: "gpt-4-turbo"
- **Status**: ❌ DOIT être remplacé par lib/intelligence-core

### Prompt Location
- **File**: `core/ai/Prompts/career-copilot-forecast-v1.ts`
- **Status**: ❌ DOIT être déplacé vers infrastructure

---

## Risques Identifiés

### Risques Techniques
1. **Coupling fort avec aiOrchestrator**: Migration nécessitera refactoring
2. **DTO violations**: `any` type et Date objects nécessitent correction
3. **Complexité des dépendances**: 6 engines dépendants nécessitent coordination
4. **EventBus coupling**: Publication d'événements nécessite adaptation

### Risques Fonctionnels
1. **Régression potentielle**: Changement d'orchestrateur peut affecter résultats
2. **Perte de contexte**: Migration peut perdre subtilités de contexte
3. **Performance**: Nouvelle architecture peut avoir performance différente

---

## Complexité Estimée

### Migration Complexity: **HIGH**

**Raisons**:
- 6 dépendances d'engines à coordonner
- DTO violations à corriger
- Complexité de contexte (15 variables)
- EventBus integration à adapter
- Historique d'observations à migrer

### Estimation: 4-6 heures

---

## Recommandations

### Avant Migration
1. Corriger les violations de DTO (any, Date, readonly)
2. Documenter le comportement exact actuel
3. Créer tests de régression complets

### Pendant Migration
1. Migrer infrastructure uniquement (domain inchangé)
2. Conserver API publique inchangée
3. Utiliser lib/intelligence-core pour orchestration
4. Adapter EventBus integration

### Après Migration
1. Tests de régression complets
2. Performance testing
3. Validation fonctionnelle

---

## État Actuel vs Cible

### État Actuel
- ❌ Utilise aiOrchestrator directement
- ❌ DTO violations (any, Date, non-readonly)
- ❌ Prompt dans core/ai/Prompts
- ❌ Coupling fort avec legacy components

### État Cible
- ✅ Utilise IntelligenceUseCase de lib/intelligence-core
- ✅ DTOs immutables, sans any, sans Date
- ✅ Prompt dans infrastructure
- ✅ Coupling faible via ports

---

## Prochaine Étape

Comparer avec INTELLIGENCE_ENGINE_STANDARD_V1 pour identifier les écarts architecturaux.
