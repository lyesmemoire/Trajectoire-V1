# Migration Checklist

## Overview

**Purpose**: Checklist standard pour migrer les Intelligence Engines vers l'architecture cible  
**Based on**: Migration Rules  
**Target**: Wave 1 (8 moteurs)

---

## Pré-Migration

### Étape 1: Préparation

- [ ] Lire `migration-rules.md`
- [ ] Lire `ENGINE_MIGRATION_PLAYBOOK.md`
- [ ] Consulter `ENGINE_MIGRATION_MATRIX.md` pour la classification du moteur
- [ ] Identifier la classe du moteur (A, B, ou C)
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

## Migration

### Étape 4: Application des Règles

#### R001 — Supprimer aiOrchestrator

- [ ] Supprimer `import { aiOrchestrator } from "../../ai/AIOrchestrator";`
- [ ] Ajouter `import { intelligenceCoreModule } from "@/lib/intelligence-core";`
- [ ] Ajouter `import { IntelligenceRequest } from "@/lib/intelligence-core";`

#### R002 — Supprimer eventBus (si applicable)

- [ ] Supprimer `import { eventBus } from "../../ai/events/EventBus";`
- [ ] Supprimer `import { ObservationCreatedEvent } from "../../ai/events/BrainEvents";` (ou autres events)
- [ ] Ajouter `import { EventPublisher } from "@/lib/intelligence-runtime/application/EventPublisher";`

#### R003 — Ajouter RuntimeContext (si applicable)

- [ ] Ajouter `import { RuntimeContext } from "@/lib/intelligence-runtime/domain/context/RuntimeContext";`
- [ ] Créer `const context = new RuntimeContext();`
- [ ] Stocker les données dans le contexte
- [ ] Récupérer les données du contexte

#### R004 — Ajouter ExecutionPipeline (si applicable)

- [ ] Ajouter `import { ExecutionPipeline } from "@/lib/intelligence-runtime/application/ExecutionPipeline";`
- [ ] Créer `const pipeline = new ExecutionPipeline();`
- [ ] Définir les stages
- [ ] Exécuter le pipeline

#### R005 — Remplacer aiOrchestrator.execute()

- [ ] Créer `const intelligenceUseCase = intelligenceCoreModule.createUseCase<OutputType>(promptTemplate);`
- [ ] Créer `const request: IntelligenceRequest<OutputType> = { ... };`
- [ ] Remplacer `await aiOrchestrator.execute()` par `await intelligenceUseCase.execute(request)`

#### R006 — Remplacer result.data par result.output

- [ ] Remplacer `result.data` par `result.output`
- [ ] Vérifier toutes les occurrences

#### R007 — Remplacer eventBus.publish() (si applicable)

- [ ] Créer `const eventPublisher = new EventPublisher();`
- [ ] Remplacer `eventBus.publish()` par `eventPublisher.publish()`

#### R008 — Conserver candidateAIBrain (si utilisé)

- [ ] Vérifier que `import { candidateAIBrain }` est conservé
- [ ] Vérifier que l'utilisation de candidateAIBrain est conservée

#### R009 — Conserver les prompts

- [ ] Vérifier que `import { promptV1 }` est conservé
- [ ] Vérifier que l'utilisation du prompt est conservée

#### R010 — Conserver les DTOs

- [ ] Vérifier que les interfaces Input/Output sont conservées
- [ ] Vérifier qu'aucune modification fonctionnelle n'a été apportée

#### R011 — Utiliser un chemin relatif pour les imports intelligence-core

- [ ] Remplacer `@/lib/intelligence-core` par `../../../lib/intelligence-core`
- [ ] Vérifier que le chemin relatif pointe correctement vers `lib/intelligence-core`

#### R012 — Ajouter une assertion de type pour IntelligenceResponse.output

- [ ] Ajouter `as OutputType` après `result.output` si nécessaire
- [ ] Vérifier que l'assertion de type correspond au type de retour attendu

#### R013 — Simplifier les metrics pour candidateAIBrain.addHistoryEntry()

- [ ] Simplifier les metrics (latency: 0, tokens: 0, cost: 0)
- [ ] Vérifier que la structure des metrics correspond à celle attendue par candidateAIBrain.addHistoryEntry()

#### R014 — Standardiser la construction de IntelligenceRequest

- [ ] Utiliser la structure standardisée de IntelligenceRequest
- [ ] Vérifier que tous les champs obligatoires sont présents

#### R015 — Standardiser la construction de engineContext

- [ ] Utiliser le pattern standardisé pour engineContext
- [ ] Vérifier que toutes les variables du prompt sont passées dans engineContext

#### R016 — Standardiser la création de IntelligenceUseCase

- [ ] Utiliser le pattern standardisé pour créer IntelligenceUseCase
- [ ] Vérifier que le promptTemplate est correctement extrait et passé à createUseCase

---

## Post-Migration

### Étape 5: Validation des Dépendances

- [ ] Vérifier qu'aucun import legacy ne subsiste
- [ ] Vérifier que les imports runtime/core sont présents
- [ ] Vérifier qu'aucune dépendance IA directe ne subsiste

### Étape 6: Validation Architecturale

- [ ] Vérifier que l'architecture cible est respectée
- [ ] Vérifier que Clean Architecture est respectée
- [ ] Vérifier que SOLID est respecté
- [ ] Vérifier que Dependency Inversion est respecté
- [ ] Vérifier que Ports & Adapters est respecté
- [ ] Vérifier que Server Only AI est respecté
- [ ] Vérifier que TypeScript strict est respecté (aucun `any` sauf placeholders)

### Étape 7: Validation des Tests

- [ ] Lancer les tests existants
- [ ] Vérifier que les tests passent
- [ ] Vérifier qu'aucune régression n'est détectée

### Étape 8: Validation Build/Typecheck/ESLint

- [ ] Lancer `npm run build`
- [ ] Lancer `npm run typecheck`
- [ ] Lancer `npm run lint`
- [ ] Vérifier que tout passe

---

## Documentation

### Étape 9: Documentation Post-Migration

- [ ] Mettre à jour les commentaires du moteur
- [ ] Mettre à jour les JSDoc
- [ ] Mettre à jour les README (si applicable)
- [ ] Documenter les changements (si nécessaire)

### Étape 10: Mise à jour ENGINE_MIGRATION_MATRIX.md

- [ ] Marquer le moteur comme migré
- [ ] Documenter l'effort réel
- [ ] Documenter les leçons apprises

---

## Critères de Succès

La migration est réussie si:

- [ ] Aucune dépendance legacy ne subsiste
- [ ] Dépendances runtime/core présentes
- [ ] Dépendances IA directes absentes
- [ ] Architecture cible respectée
- [ ] Clean Architecture respectée
- [ ] SOLID respecté
- [ ] Dependency Inversion respecté
- [ ] Ports & Adapters respecté
- [ ] Server Only AI respecté
- [ ] TypeScript strict respecté
- [ ] Tests existants passent
- [ ] Aucune régression
- [ ] Build réussi
- [ ] Typecheck réussi
- [ ] ESLint réussi

---

## Rollback

### Quand faire un rollback

- [ ] Si les tests échouent de manière critique
- [ ] Si le build échoue de manière critique
- [ ] Si des régressions sont détectées
- [ ] Si la migration prend plus de temps que prévu

### Comment faire un rollback

- [ ] Annuler les changements: `git checkout -- core/intelligence/engines/[engine-file].ts`
- [ ] Supprimer la branche: `git branch -D migration/engine-name`
- [ ] Documenter le problème
- [ ] Créer un ticket Jira/GitHub
- [ ] Proposer une solution

---

## Support

### Documentation

- ADR-020: Intelligence Engine Standard
- ADR-021: Intelligence Runtime Architecture
- SPRINT_614_PROVIDER_IMPLEMENTATION.md
- SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- INTELLIGENCE_ENGINE_MIGRATION_TEMPLATE.md
- ENGINE_MIGRATION_MATRIX.md
- ENGINE_MIGRATION_PLAYBOOK.md

### Exemples

- Forecast (Golden Reference)
- `core/intelligence/engines/careerCopilotForecastEngine.ts`

### Questions

Pour toute question sur la migration, consulter:
- L'équipe architecture
- Le rapport SPRINT_615_FORECAST_GOLDEN_REFERENCE.md
- Le présent checklist
- migration-rules.md
