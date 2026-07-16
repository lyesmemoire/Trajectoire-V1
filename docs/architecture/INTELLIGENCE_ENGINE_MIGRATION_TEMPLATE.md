# Intelligence Engine Migration Template

## Overview

**Purpose**: Guide officiel pour migrer les Intelligence Engines vers l'architecture cible (Runtime → IntelligenceUseCase → Provider → AI SDK).

**Based on**: Sprint 6.15 — Forecast Golden Reference

**Target Audience**: Développeurs travaillant sur la migration des 28 moteurs restants.

---

## Prérequis

### Connaissance requise

- Clean Architecture
- SOLID principles
- Dependency Inversion
- Ports & Adapters
- Server Only AI
- TypeScript strict

### Documentation à lire

- ADR-020: Intelligence Engine Standard
- ADR-021: Intelligence Runtime Architecture
- SPRINT_614_PROVIDER_IMPLEMENTATION.md
- SPRINT_615_FORECAST_GOLDEN_REFERENCE.md

---

## Architecture Cible

```
Intelligence Engine
  ↓
RuntimeContext (intelligence-runtime)
  ↓
ExecutionPipeline (intelligence-runtime)
  ↓
IntelligenceUseCase (intelligence-core)
  ↓
Provider (intelligence-core)
  ↓
AI SDK (infrastructure existante)

EventPublisher (intelligence-runtime)
  ↓
Events
```

---

## Étape 1: Audit

### Objectif

Identifier les dépendances legacy et les dépendances runtime/core.

### Actions

1. **Identifier les dépendances legacy**

Chercher les imports suivants dans le fichier du moteur:
- `aiOrchestrator`
- `eventBus`
- `ObservationCreatedEvent`
- Dépendances directes à AI SDK
- Dépendances directes à Mistral
- Dépendances directes à OpenAIProvider

```bash
grep -r "aiOrchestrator" core/intelligence/engines/
grep -r "eventBus" core/intelligence/engines/
grep -r "ObservationCreatedEvent" core/intelligence/engines/
```

2. **Identifier les dépendances runtime/core**

Chercher les imports suivants:
- `RuntimeContext`
- `ExecutionPipeline`
- `EventPublisher`
- `IntelligenceUseCase`
- `IntelligenceRequest`

3. **Identifier les dépendances contextuelles**

Identifier les dépendances qui fournissent des données contextuelles:
- Autres moteurs d'intelligence
- Brain
- Prompts historiques

### Checklist

- [ ] Liste des dépendances legacy identifiée
- [ ] Liste des dépendances runtime/core identifiée
- [ ] Liste des dépendances contextuelles identifiée

---

## Étape 2: Remplacement des Composants Legacy

### 2.1 Remplacer aiOrchestrator

**Avant**:
```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";

const result = await aiOrchestrator.execute<OutputType>(
  promptTemplate,
  variables,
  {
    provider: "openai",
    model: "gpt-4",
    promptId: "engine-id",
    promptVersion: "v1",
    temperature: 0.7,
    maxTokens: 1500,
  }
);
```

**Après**:
```typescript
import { intelligenceCoreModule } from "@/lib/intelligence-core";
import { IntelligenceRequest } from "@/lib/intelligence-core";

const intelligenceUseCase = intelligenceCoreModule.createUseCase<OutputType>(promptTemplate.system);

const request: IntelligenceRequest<OutputType> = {
  id: `request-${Date.now()}`,
  type: "engine-type",
  input: {} as any, // Placeholder si non utilisé
  context: {
    candidateProfile: {},
    historicalObservations: [],
    currentGoals: [],
    recentInsights: [],
    engineContext: {
      // Variables du prompt
      ...variables,
    },
  },
  options: {
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 1500,
    timeout: 30000,
  },
};

const result = await intelligenceUseCase.execute(request);
```

### 2.2 Remplacer eventBus

**Avant**:
```typescript
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";

const event: ObservationCreatedEvent = {
  id: `event-${Date.now()}`,
  timestamp: new Date(),
  type: "observation_created",
  payload: {
    source: "engine-id",
    observationType: "general",
    data: result,
    confidence: 0.8,
  },
};

eventBus.publish(event);
```

**Après**:
```typescript
import { EventPublisher } from "@/lib/intelligence-runtime/application/EventPublisher";

const eventPublisher = new EventPublisher();

eventPublisher.publish("event-type", {
  source: "engine-id",
  data: result,
  confidence: 0.8,
  timestamp: new Date().toISOString(),
});
```

### 2.3 Remplacer AIOrchestrationConfig

**Avant**:
```typescript
const config: AIOrchestrationConfig = {
  provider: "openai",
  model: "gpt-4",
  promptId: "engine-id",
  promptVersion: "v1",
  temperature: 0.7,
  maxTokens: 1500,
};
```

**Après**:
```typescript
const options: IntelligenceOptions = {
  provider: "openai",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 1500,
  timeout: 30000,
};
```

### Checklist

- [ ] aiOrchestrator remplacé par IntelligenceUseCase
- [ ] eventBus remplacé par EventPublisher
- [ ] AIOrchestrationConfig remplacé par IntelligenceRequest
- [ ] Imports legacy supprimés
- [ ] Imports runtime/core ajoutés

---

## Étape 3: Nettoyage

### Actions

1. **Supprimer les imports legacy**

Supprimer les imports suivants:
- `aiOrchestrator`
- `eventBus`
- `ObservationCreatedEvent`
- Dépendances directes IA

2. **Supprimer le code mort**

Supprimer:
- Commentaires TODO
- Méthodes non utilisées
- Variables non utilisées

3. **Supprimer les commentaires legacy**

Supprimer les commentaires qui mentionnent:
- "legacy"
- "to be removed"
- "TODO"

### Checklist

- [ ] Imports legacy supprimés
- [ ] Code mort supprimé
- [ ] Commentaires legacy supprimés

---

## Étape 4: Validation des Dépendances

### Objectif

S'assurer que le moteur dépend uniquement de intelligence-runtime et intelligence-core.

### Actions

1. **Vérifier les imports**

```bash
grep -r "from.*ai/AIOrchestrator" core/intelligence/engines/[engine-file].ts
grep -r "from.*ai/events/EventBus" core/intelligence/engines/[engine-file].ts
```

Ces commandes ne doivent rien retourner.

2. **Vérifier les dépendances IA**

Le moteur ne doit pas dépendre directement de:
- AI SDK
- Mistral
- OpenAIProvider
- Anciens orchestrateurs

3. **Vérifier les dépendances runtime/core**

Le moteur doit dépendre de:
- intelligence-runtime (RuntimeContext, ExecutionPipeline, EventPublisher)
- intelligence-core (intelligenceCoreModule, IntelligenceRequest)

### Checklist

- [ ] Aucune dépendance legacy détectée
- [ ] Dépendances runtime/core présentes
- [ ] Dépendances IA directes absentes

---

## Étape 5: Validation Architecturale

### Objectif

S'assurer que le moteur respecte le Intelligence Engine Standard.

### Critères

1. **Architecture cible**

Le moteur doit suivre:
```
Engine → RuntimeContext → ExecutionPipeline → IntelligenceUseCase → Provider → AI SDK
```

2. **Clean Architecture**

- Domain layer isolé
- Application layer isolé
- Infrastructure layer isolé

3. **SOLID**

- Single Responsibility: chaque classe a une seule responsabilité
- Dependency Inversion: dépend des abstractions

4. **Ports & Adapters**

- Adapters pour infrastructure existante
- Ports pour les abstractions

5. **Server Only AI**

- Aucun code client-side
- Aucune logique React
- Aucune logique Next.js

6. **TypeScript strict**

- Aucun `any`
- Types stricts
- Types inférés

### Checklist

- [ ] Architecture cible respectée
- [ ] Clean Architecture respectée
- [ ] SOLID respecté
- [ ] Dependency Inversion respecté
- [ ] Ports & Adapters respecté
- [ ] Server Only AI respecté
- [ ] TypeScript strict respecté

---

## Étape 6: Tests

### Actions

1. **Tests existants**

S'assurer que les tests existants passent:
```bash
npm test -- --run tests/unit/[engine-name]
```

2. **Tests d'intégration**

Ajouter des tests d'intégration pour:
- RuntimeContext
- ExecutionPipeline
- IntelligenceUseCase
- EventPublisher

**Note**: Les tests d'intégration nécessitent des mocks HTTP pour éviter les appels API réels.

### Checklist

- [ ] Tests existants passent
- [ ] Tests d'intégration ajoutés (si applicable)

---

## Étape 7: Build, Typecheck, ESLint

### Actions

1. **Build**
```bash
npm run build
```

2. **Typecheck**
```bash
npm run typecheck
```

3. **ESLint**
```bash
npm run lint
```

### Checklist

- [ ] Build réussi
- [ ] Typecheck réussi
- [ ] ESLint réussi

---

## Pièges Courants

### Piège 1: IntelligenceRequest vs PromptTemplate

**Problème**: `IntelligenceRequest` utilise une structure différente de `PromptTemplate`.

**Solution**: Convertir `PromptTemplate` en `IntelligenceRequest`:
- `prompt` ← `promptTemplate.system`
- `context.engineContext` ← variables du prompt
- `options` ← configuration du provider

### Piège 2: IntelligenceResponse.data vs .output

**Problème**: `IntelligenceResponse` utilise `.output` au lieu de `.data`.

**Solution**: Adapter le code pour utiliser `.output` au lieu de `.data`.

### Piège 3: IntelligenceRequest.input

**Problème**: `IntelligenceRequest.input` est requis mais le moteur n'utilise pas ce champ.

**Solution**: Passer `input: {} as any` (placeholder).

### Piège 4: IntelligenceOptions.streaming

**Problème**: `IntelligenceOptions` n'a pas de champ `streaming`.

**Solution**: Supprimer le champ `streaming` des options.

### Piège 5: Tests d'intégration

**Problème**: Les tests d'intégration nécessitent des mocks HTTP.

**Solution**: Les tests d'intégration complets seront ajoutés dans une phase ultérieure avec des mocks HTTP.

---

## Composants à Remplacer

### 1. aiOrchestrator

**Remplacer par**: `IntelligenceUseCase`

**Pattern**:
```typescript
// Avant
const result = await aiOrchestrator.execute(prompt, variables, config);

// Après
const intelligenceUseCase = intelligenceCoreModule.createUseCase(prompt);
const request: IntelligenceRequest = { /* ... */ };
const result = await intelligenceUseCase.execute(request);
```

### 2. EventBus

**Remplacer par**: `EventPublisher`

**Pattern**:
```typescript
// Avant
eventBus.publish(event);

// Après
eventPublisher.publish(eventType, eventData);
```

### 3. AIOrchestrationConfig

**Remplacer par**: `IntelligenceRequest`

**Pattern**:
```typescript
// Avant
const config: AIOrchestrationConfig = { /* ... */ };

// Après
const request: IntelligenceRequest = { /* ... */ };
```

---

## Composants à Conserver

### 1. RuntimeContext

**Raison**: Gestion du contexte entre les étapes du pipeline.

**Utilisation**: Stocker et récupérer les données contextuelles.

### 2. ExecutionPipeline

**Raison**: Orchestration des étapes d'exécution.

**Utilisation**: Définir et exécuter les stages du pipeline.

### 3. EventPublisher

**Raison**: Publication d'évents standardisés.

**Utilisation**: Publier les résultats aux consommateurs.

### 4. Dépendances contextuelles

**Raison**: Fournir des données contextuelles nécessaires.

**Utilisation**: Autres moteurs d'intelligence, brain, prompts.

---

## Validations Obligatoires

### 1. Suppression des dépendances legacy

- [ ] aiOrchestrator
- [ ] eventBus
- [ ] ObservationCreatedEvent
- [ ] Dépendance directe à AI SDK
- [ ] Dépendance directe à Mistral
- [ ] Dépendance directe à OpenAIProvider

### 2. Ajout des dépendances runtime/core

- [ ] RuntimeContext
- [ ] ExecutionPipeline
- [ ] EventPublisher
- [ ] IntelligenceUseCase
- [ ] IntelligenceRequest

### 3. Conformité au Intelligence Engine Standard

- [ ] Architecture cible respectée
- [ ] Clean Architecture
- [ ] SOLID
- [ ] Dependency Inversion
- [ ] Ports & Adapters
- [ ] Server Only AI
- [ ] TypeScript strict

### 4. Tests

- [ ] Tests existants passent
- [ ] Tests d'intégration (si applicable)

### 5. Build, Typecheck, ESLint

- [ ] Build réussi
- [ ] Typecheck réussi
- [ ] ESLint réussi

---

## Checklist de Fin de Migration

### Étape 1: Audit

- [ ] Identifier les dépendances legacy
- [ ] Identifier les dépendances runtime/core
- [ ] Identifier les dépendances contextuelles

### Étape 2: Remplacement

- [ ] Remplacer aiOrchestrator par IntelligenceUseCase
- [ ] Remplacer eventBus par EventPublisher
- [ ] Remplacer AIOrchestrationConfig par IntelligenceRequest

### Étape 3: Nettoyage

- [ ] Supprimer les imports legacy
- [ ] Supprimer le code mort
- [ ] Supprimer les commentaires TODO

### Étape 4: Validation

- [ ] Vérifier les dépendances IA
- [ ] Vérifier les dépendances runtime/core
- [ ] Vérifier la conformité au standard

### Étape 5: Tests

- [ ] Tests existants passent
- [ ] Tests d'intégration (si applicable)

### Étape 6: Build

- [ ] Build réussi
- [ ] Typecheck réussi
- [ ] ESLint réussi

### Étape 7: Documentation

- [ ] Mettre à jour la documentation du moteur
- [ ] Créer un rapport de migration (si nécessaire)

---

## Exemple Complet: Forecast

### Avant

```typescript
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { careerCopilotForecastV1 } from "../../ai/Prompts/career-copilot-forecast-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";

export class CareerCopilotForecastEngine {
  static async generateForecast(input: ForecastInput): Promise<ForecastOutput> {
    const context = new RuntimeContext();
    const eventPublisher = new EventPublisher();

    // ... context setup ...

    const aiResult = await aiOrchestrator.execute<ForecastOutput>(
      careerCopilotForecastV1,
      variables,
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "career-copilot-forecast",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    // Save to Brain
    candidateAIBrain.addObservation({ /* ... */ });

    // Publish to EventPublisher
    eventPublisher.publish("forecast-generated", { /* ... */ });

    // Publish to EventBus (legacy)
    const forecastEvent: ObservationCreatedEvent = { /* ... */ };
    eventBus.publish(forecastEvent);

    return aiResult.data;
  }
}
```

### Après

```typescript
import { careerCopilotForecastV1 } from "../../ai/Prompts/career-copilot-forecast-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";
import { RuntimeContext } from "@/lib/intelligence-runtime/domain/context/RuntimeContext";
import { ExecutionPipeline } from "@/lib/intelligence-runtime/application/ExecutionPipeline";
import { EventPublisher } from "@/lib/intelligence-runtime/application/EventPublisher";
import { intelligenceCoreModule } from "@/lib/intelligence-core";
import { IntelligenceRequest } from "@/lib/intelligence-core";

export class CareerCopilotForecastEngine {
  static async generateForecast(input: ForecastInput): Promise<ForecastOutput> {
    const context = new RuntimeContext();
    const eventPublisher = new EventPublisher();

    // ... context setup ...

    const intelligenceUseCase = intelligenceCoreModule.createUseCase<ForecastOutput>(promptTemplate);
    const request: IntelligenceRequest<ForecastOutput> = {
      id: `forecast-${Date.now()}`,
      type: "forecast",
      input: {} as any,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: { /* variables */ },
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 1500,
        timeout: 30000,
      },
    };

    const aiResult = await intelligenceUseCase.execute(request);

    // Save to Brain
    candidateAIBrain.addObservation({ /* ... */ });

    // Publish to EventPublisher
    eventPublisher.publish("forecast-generated", { /* ... */ });

    return aiResult.output;
  }
}
```

---

## Support

### Documentation

- ADR-020: Intelligence Engine Standard
- ADR-021: Intelligence Runtime Architecture
- SPRINT_614_PROVIDER_IMPLEMENTATION.md
- SPRINT_615_FORECAST_GOLDEN_REFERENCE.md

### Exemples

- Forecast (Golden Reference)
- `core/intelligence/engines/careerCopilotForecastEngine.ts`

### Questions

Pour toute question sur la migration, consulter:
- L'équipe architecture
- Le rapport SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- Le présent template

---

## Conclusion

Ce template est basé sur l'expérience de migration de Forecast (Sprint 6.15). Il est conçu pour être un guide reproductible pour migrer les 28 moteurs restants vers l'architecture cible.

En suivant ce template, chaque migration devrait:
- Être cohérente avec les autres migrations
- Respecter le Intelligence Engine Standard
- Minimiser les risques de régression
- Être documentée de manière standardisée

**Forecast est la Golden Reference. Utilisez-le comme modèle.**
