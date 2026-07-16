# Engine Migration Playbook

## Overview

**Purpose**: Guide opérationnel standard pour migrer les Intelligence Engines vers l'architecture cible  
**Based on**: Sprint 6.15 — Forecast Golden Reference  
**Target Audience**: Développeurs effectuant les migrations

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
- INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- ENGINE_MIGRATION_MATRIX.md

### Outils

- IDE (VS Code)
- Git
- Node.js
- npm

---

## Checklist Pré-Migration

### Étape 1: Préparation

- [ ] Lire la documentation requise
- [ ] Consulter ENGINE_MIGRATION_MATRIX.md pour la classification du moteur
- [ ] Identifier la classe du moteur (A, B, ou C)
- [ ] Consulter INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- [ ] Consulter tools/intelligence-engine-migration/migration-rules.md pour les règles de migration
- [ ] Créer une branche de migration: `migration/engine-name`

### Étape 2: Analyse du moteur

- [ ] Lire le fichier du moteur
- [ ] Identifier les dépendances legacy (aiOrchestrator, eventBus, etc.)
- [ ] Identifier les dépendances contextuelles (autres moteurs, brain, prompts)
- [ ] Identifier les spécificités du moteur (pipeline, contexte, DTO)
- [ ] Estimer l'effort de migration (référence: ENGINE_MIGRATION_MATRIX.md)

### Étape 3: Préparation de l'environnement

- [ ] S'assurer que les variables d'environnement sont configurées
- [ ] Vérifier que intelligence-core et intelligence-runtime sont à jour
- [ ] Lancer les tests existants pour s'assurer qu'ils passent

---

## Étapes Techniques

### Étape 1: Remplacement des Imports

**Objectif**: Remplacer les imports legacy par les imports runtime/core.

**Actions**:

1. **Supprimer les imports legacy**:
```typescript
// Supprimer
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { eventBus } from "../../ai/events/EventBus";
import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";
```

2. **Ajouter les imports runtime/core**:
```typescript
// Ajouter
import { RuntimeContext } from "@/lib/intelligence-runtime/domain/context/RuntimeContext";
import { ExecutionPipeline } from "@/lib/intelligence-runtime/application/ExecutionPipeline";
import { EventPublisher } from "@/lib/intelligence-runtime/application/EventPublisher";
import { intelligenceCoreModule } from "@/lib/intelligence-core";
import { IntelligenceRequest } from "@/lib/intelligence-core";
```

**Validation**:
- [ ] Aucun import legacy ne subsiste
- [ ] Tous les imports runtime/core sont présents

### Étape 2: Remplacement de aiOrchestrator

**Objectif**: Remplacer aiOrchestrator.execute() par IntelligenceUseCase.execute().

**Actions**:

1. **Créer IntelligenceUseCase**:
```typescript
const promptTemplate = promptTemplate.system || promptTemplate.user;
const intelligenceUseCase = intelligenceCoreModule.createUseCase<OutputType>(promptTemplate);
```

2. **Créer IntelligenceRequest**:
```typescript
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
```

3. **Exécuter IntelligenceUseCase**:
```typescript
const result = await intelligenceUseCase.execute(request);
```

4. **Adapter le résultat**:
```typescript
// Avant: aiResult.data
// Après: aiResult.output
if (!result.success || !result.output) {
  throw new Error("Failed to execute engine");
}
return result.output;
```

**Validation**:
- [ ] aiOrchestrator.execute() remplacé par IntelligenceUseCase.execute()
- [ ] IntelligenceRequest créé correctement
- [ ] Résultat adapté (.output au lieu de .data)

### Étape 3: Remplacement de eventBus

**Objectif**: Remplacer eventBus.publish() par EventPublisher.publish().

**Actions**:

1. **Créer EventPublisher**:
```typescript
const eventPublisher = new EventPublisher();
```

2. **Publier l'évent**:
```typescript
// Avant
eventBus.publish(event);

// Après
eventPublisher.publish("event-type", {
  source: "engine-id",
  data: result,
  confidence: 0.8,
  timestamp: new Date().toISOString(),
});
```

**Validation**:
- [ ] eventBus.publish() remplacé par EventPublisher.publish()
- [ ] Structure de l'évent adaptée

### Étape 4: Adaptation du Contexte (si applicable)

**Objectif**: Adapter le contexte pour RuntimeContext.

**Actions**:

1. **Créer RuntimeContext**:
```typescript
const context = new RuntimeContext();
```

2. **Stocker les données dans le contexte**:
```typescript
context.set("candidateProfile", candidateProfile);
context.set("historicalObservations", historicalObservations);
context.set("currentGoals", currentGoals);
// ... autres données
```

3. **Récupérer les données du contexte**:
```typescript
const candidateProfile = context.get("candidateProfile");
const historicalObservations = context.get("historicalObservations");
// ... autres données
```

**Validation**:
- [ ] RuntimeContext utilisé correctement
- [ ] Données stockées et récupérées correctement

### Étape 5: Adaptation du Pipeline (si applicable)

**Objectif**: Adapter le pipeline pour ExecutionPipeline.

**Actions**:

1. **Créer ExecutionPipeline**:
```typescript
const pipeline = new ExecutionPipeline();
```

2. **Définir les stages**:
```typescript
const aiExecutionStage = {
  name: "ai-execution",
  execute: async (input: any, ctx: RuntimeContext) => {
    // Logique d'exécution
    return result;
  },
};
```

3. **Exécuter le pipeline**:
```typescript
const result = await pipeline.execute(
  input,
  [aiExecutionStage],
  context
);
```

**Validation**:
- [ ] ExecutionPipeline utilisé correctement
- [ ] Stages définis correctement
- [ ] Pipeline exécuté correctement

---

## Validations

### Étape 1: Validation des Dépendances

**Objectif**: S'assurer que le moteur dépend uniquement de intelligence-runtime et intelligence-core.

**Actions**:

1. **Vérifier les imports**:
```bash
grep -r "aiOrchestrator" core/intelligence/engines/[engine-file].ts
grep -r "eventBus" core/intelligence/engines/[engine-file].ts
```

Ces commandes ne doivent rien retourner.

2. **Vérifier les dépendances IA**:
- [ ] Aucune dépendance directe à AI SDK
- [ ] Aucune dépendance directe à Mistral
- [ ] Aucune dépendance directe à OpenAIProvider

3. **Vérifier les dépendances runtime/core**:
- [ ] Dépendances runtime/core présentes
- [ ] Dépendances IA directes absentes

**Validation**:
- [ ] Aucune dépendance legacy détectée
- [ ] Dépendances runtime/core présentes

### Étape 2: Validation Architecturale

**Objectif**: S'assurer que le moteur respecte le Intelligence Engine Standard.

**Critères**:

- [ ] Architecture cible respectée (Engine → Runtime → IntelligenceUseCase → Provider → AI SDK)
- [ ] Clean Architecture respectée
- [ ] SOLID respecté
- [ ] Dependency Inversion respecté
- [ ] Ports & Adapters respecté
- [ ] Server Only AI respecté
- [ ] TypeScript strict respecté (aucun `any` sauf placeholders)

**Validation**:
- [ ] Tous les critères respectés

### Étape 3: Validation des Tests

**Objectif**: S'assurer que les tests passent.

**Actions**:

1. **Lancer les tests existants**:
```bash
npm test -- --run tests/unit/[engine-name]
```

2. **Vérifier les résultats**:
- [ ] Tests existants passent
- [ ] Aucune régression

**Validation**:
- [ ] Tests passent

### Étape 4: Validation Build/Typecheck/ESLint

**Objectif**: S'assurer que le build, typecheck et ESLint passent.

**Actions**:

1. **Build**:
```bash
npm run build
```

2. **Typecheck**:
```bash
npm run typecheck
```

3. **ESLint**:
```bash
npm run lint
```

**Validation**:
- [ ] Build réussi
- [ ] Typecheck réussi
- [ ] ESLint réussi

---

## Critères de Succès

La migration est réussie si:

1. **Dépendances**
   - [ ] Aucune dépendance legacy ne subsiste
   - [ ] Dépendances runtime/core présentes
   - [ ] Dépendances IA directes absentes

2. **Architecture**
   - [ ] Architecture cible respectée
   - [ ] Clean Architecture respectée
   - [ ] SOLID respecté
   - [ ] Dependency Inversion respecté
   - [ ] Ports & Adapters respecté
   - [ ] Server Only AI respecté
   - [ ] TypeScript strict respecté

3. **Tests**
   - [ ] Tests existants passent
   - [ ] Aucune régression

4. **Build**
   - [ ] Build réussi
   - [ ] Typecheck réussi
   - [ ] ESLint réussi

---

## Points d'Attention

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

### Piège 5: Dépendances contextuelles

**Problème**: Certains moteurs dépendent d'autres moteurs pour le contexte.

**Solution**: Conserver ces dépendances car elles ne sont pas des providers IA.

### Piège 6: Tests d'intégration

**Problème**: Les tests d'intégration nécessitent des mocks HTTP.

**Solution**: Les tests d'intégration complets seront ajoutés dans une phase ultérieure avec des mocks HTTP.

---

## Erreurs Fréquentes

### Erreur 1: Import legacy oublié

**Symptôme**: L'import legacy est toujours présent.

**Solution**: Vérifier tous les imports et supprimer les imports legacy.

### Erreur 2: aiOrchestrator.execute() non remplacé

**Symptôme**: aiOrchestrator.execute() est toujours appelé.

**Solution**: Remplacer par IntelligenceUseCase.execute().

### Erreur 3: eventBus.publish() non remplacé

**Symptôme**: eventBus.publish() est toujours appelé.

**Solution**: Remplacer par EventPublisher.publish().

### Erreur 4: IntelligenceRequest mal structuré

**Symptôme**: TypeScript error sur IntelligenceRequest.

**Solution**: Vérifier la structure de IntelligenceRequest et adapter.

### Erreur 5: .data au lieu de .output

**Symptôme**: TypeScript error sur .data.

**Solution**: Remplacer .data par .output.

### Erreur 6: Tests échouent

**Symptôme**: Tests échouent après migration.

**Solution**: Vérifier que la logique n'a pas été modifiée, seulement l'infrastructure.

---

## Rollback

### Quand faire un rollback

- Si les tests échouent de manière critique
- Si le build échoue de manière critique
- Si des régressions sont détectées
- Si la migration prend plus de temps que prévu

### Comment faire un rollback

1. **Annuler les changements**:
```bash
git checkout -- core/intelligence/engines/[engine-file].ts
```

2. **Supprimer la branche**:
```bash
git branch -D migration/engine-name
```

3. **Documenter le problème**:
- Créer un ticket Jira/GitHub
- Documenter l'erreur
- Proposer une solution

---

## Documentation Post-Migration

### Actions

1. **Mettre à jour la documentation du moteur**:
- [ ] Mettre à jour les commentaires
- [ ] Mettre à jour les JSDoc
- [ ] Mettre à jour les README

2. **Créer un rapport de migration** (si nécessaire):
- [ ] Documenter les changements
- [ ] Documenter les problèmes rencontrés
- [ ] Documenter les solutions appliquées

3. **Mettre à jour ENGINE_MIGRATION_MATRIX.md**:
- [ ] Marquer le moteur comme migré
- [ ] Documenter l'effort réel
- [ ] Documenter les leçons apprises

---

## Support

### Documentation

- ADR-020: Intelligence Engine Standard
- ADR-021: Intelligence Runtime Architecture
- SPRINT_614_PROVIDER_IMPLEMENTATION.md
- SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- ENGINE_MIGRATION_MATRIX.md

### Exemples

- Forecast (Golden Reference)
- `core/intelligence/engines/careerCopilotForecastEngine.ts`

### Questions

Pour toute question sur la migration, consulter:
- L'équipe architecture
- Le rapport SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- Le présent playbook
- INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md

---

## Conclusion

Ce playbook est basé sur l'expérience de migration de Forecast (Sprint 6.15) et l'analyse des 28 moteurs restants (Sprint 6.16). Il est conçu pour être un guide opérationnel reproductible pour migrer tous les moteurs vers l'architecture cible.

En suivant ce playbook, chaque migration devrait:
- Être cohérente avec les autres migrations
- Respecter le Intelligence Engine Standard
- Minimiser les risques de régression
- Être documentée de manière standardisée

**Forecast est la Golden Reference. Utilisez-le comme modèle.**
