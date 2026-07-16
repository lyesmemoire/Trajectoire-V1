# ADR-021: Création de lib/intelligence-runtime

## Status

**Status**: Proposed  
**Date**: 2026-07-13  
**Décideurs**: Architecture Trajectoire  
**Context**: Sprint 6.11B - Architecture Blueprint pour lib/intelligence-runtime

---

## Contexte

### Problème rencontré pendant la migration de Forecast

Lors de la Sprint 6.11, l'audit de Forecast Intelligence Engine a révélé que le moteur dépend de plusieurs composants transverses qui ne relèvent ni du domaine métier ni de `lib/intelligence-core` :

- **aiOrchestrator** - Combine sélection de provider, rendu de prompt, validation JSON, retry logic, et cost tracking
- **CandidateAIBrain** - Couche mémoire pour les connaissances générées par l'IA
- **EventBus** - Système pub/sub pour communication découplée
- **RetryPolicy** - Logic de retry avec backoff exponentiel
- **CostTracker** - Tracking de coûts et métriques
- **aiExecutionLogger** - Logging d'exécution
- **AIMode** - Détection de mode IA

Ces composants sont actuellement dans `core/ai/` et sont utilisés par plusieurs moteurs, créant :
- Couplage fort entre moteurs et `core/ai/`
- Absence de séparation claire entre abstraction provider et capacités runtime
- Difficulté à tester les moteurs en isolation
- Potentiel de duplication de code entre moteurs

### Pourquoi intelligence-core ne doit pas absorber ces responsabilités

`lib/intelligence-core` (Sprint 6.10) fournit une abstraction minimale pour les opérations IA :

- **Provider abstraction** (IntelligenceProviderPort)
- **DTO standardization** (IntelligenceRequest, IntelligenceResponse)
- **Minimal use case orchestration** (IntelligenceUseCase)
- **Error handling** (ErrorAdapter)

intelligence-core est conçu comme une fondation minimale et stable. Absorber les capacités runtime violerait ce principe :

1. **Violation de la responsabilité unique** : intelligence-core deviendrait à la fois abstraction provider ET runtime capabilities
2. **Instabilité accrue** : Les capacités runtime évoluent plus fréquemment que l'abstraction provider
3. **Complexité injustifiée** : intelligence-core perdrait sa simplicité et sa clarté
4. **Dépendances croisées** : intelligence-core dépendrait de composants qui ne sont pas purement liés aux providers

### Pourquoi un runtime partagé est nécessaire

L'analyse de Forecast a identifié 11 composants transverses qui fournissent des capacités runtime partagées par tous les moteurs :

1. **Retry logic** - Gestion des échecs avec backoff exponentiel
2. **Cost tracking** - Tracking des coûts et métriques
3. **Execution logging** - Logging d'exécution et observabilité
4. **Event publishing** - Communication découplée entre moteurs et Brain
5. **Memory management** - Gestion de la mémoire (CandidateAIBrain)
6. **Context building** - Construction de contexte depuis plusieurs sources
7. **Dependency resolution** - Résolution des dépendances moteur-à-moteur

Sans un runtime partagé, chaque moteur devrait réimplémenter ces capacités, entraînant :
- Duplication de code (estimée à 4,350+ lignes)
- Incohérence entre moteurs
- Charge de maintenance élevée
- Difficulté à garantir la cohérence du comportement

---

## Décision

### Créer lib/intelligence-runtime

Un nouveau module `lib/intelligence-runtime` est créé pour héberger les capacités runtime transverses.

### Architecture cible

```
UI
        │
        ▼
Intelligence Engine
        │
        ▼
Intelligence Runtime
        │
        ▼
Intelligence Core
        │
        ▼
Providers
        │
        ▼
AI SDK
```

### Responsabilités de intelligence-runtime

**Autorisées** :
- Context orchestration (construction de contexte depuis plusieurs sources)
- Event publishing (communication découplée)
- Dependency management (résolution dépendances moteur-à-moteur)
- Execution pipeline (pipeline d'exécution composable)
- Retry (logic de retry avec backoff)
- Timeout (timeout des appels LLM)
- Circuit breaker (prévention des cascades de défaillance)
- Telemetry (tracking performance et usage)
- Metrics (métriques d'exécution)
- Logging (logging structuré)
- Prompt orchestration (gestion des versions de prompts)
- Cost tracking (tracking des coûts)
- Usage tracking (tracking de l'usage)

**Interdites** :
- Logique métier spécifique aux moteurs
- Abstraction provider (responsabilité d'intelligence-core)
- Logique de prompt rendering (responsabilité infrastructure partagée)
- Dépendances directes sur AI SDK (responsabilité des providers)
- Logique React/Next.js (server-only uniquement)
- Logique de persistance spécifique (responsabilité infrastructure partagée)

---

## Alternatives étudiées et rejetées

### Alternative 1: Ajouter les capacités runtime à intelligence-core

**Description** : Étendre intelligence-core pour inclure retry, cost tracking, logging, events, memory.

**Pros** :
- Un seul module pour toutes les capacités IA
- Moins de fichiers à gérer

**Cons** :
- Violation de la responsabilité unique
- intelligence-core devient instable (évolutions fréquentes)
- Complexité accrue
- Difficile à maintenir la stabilité d'intelligence-core

**Rejeté** : intelligence-core doit rester minimal et stable.

### Alternative 2: Garder les capacités dans core/ai/

**Description** : Ne pas créer de nouveau module, garder les composants dans core/ai/.

**Pros** :
- Aucun refactoring nécessaire
- Pas de nouveau module

**Cons** :
- Pas de séparation claire entre abstraction provider et runtime
- Couplage fort entre moteurs et core/ai/
- Difficulté à tester en isolation
- Pas de standardisation des capacités runtime

**Rejeté** : Pas de séparation architecturale claire.

### Alternative 3: Chaque moteur implémente ses propres capacités runtime

**Description** : Chaque moteur réimplémente retry, cost tracking, logging, etc.

**Pros** :
- Flexibilité maximale pour chaque moteur
- Pas de dépendance partagée

**Cons** :
- Duplication de code massive (4,350+ lignes)
- Incohérence entre moteurs
- Charge de maintenance élevée
- Difficile à garantir la cohérence

**Rejeté** : Duplication de code inacceptable.

### Alternative 4: Créer un module par capacité runtime

**Description** : Créer lib/retry, lib/cost-tracking, lib/logging, etc.

**Pros** :
- Séparation fine des responsabilités
- Chaque module est simple

**Cons** :
- Trop de modules à gérer
- Dépendances complexes entre modules
- Difficile à voir l'ensemble des capacités runtime
- Fragmentation de l'architecture

**Rejeté** : Fragmentation excessive.

---

## Conséquences

### Positives

1. **Séparation claire des responsabilités**
   - intelligence-core : Abstraction provider
   - intelligence-runtime : Capacités runtime
   - Moteurs : Logique métier

2. **Architecture Clean respectée**
   - Hiérarchie de dépendances claire
   - Pas de dépendances inverses
   - Pas de dépendances circulaires
   - Dependency inversion respecté

3. **Réutilisabilité**
   - 11 composants transverses partagés par 29+ moteurs
   - Pas de duplication de code
   - Comportement cohérent entre moteurs

4. **Testabilité**
   - Composants testables en isolation
   - Mock des capacités runtime pour les tests moteur
   - Interfaces claires pour mocking

5. **Maintenabilité**
   - Source unique de vérité pour les capacités runtime
   - Les changements affectent tous les moteurs
   - Plus facile à déboguer et monitorer

6. **Évolutivité**
   - Facile d'ajouter de nouvelles capacités runtime (cache, timeout, circuit breaker)
   - Architecture future-proof
   - Support pour les besoins futurs

### Négatives

1. **Complexité accrue**
   - Un module supplémentaire à gérer
   - Plus de fichiers à maintenir
   - Courbe d'apprentissage pour l'équipe

2. **Effort de migration**
   - Migration de 29+ moteurs requis
   - 4-7 semaines estimées
   - Risque de régressions temporaires

3. **Dépendances**
   - Moteurs dépendent maintenant de deux modules (intelligence-core + intelligence-runtime)
   - Plus de points de défaillance potentiels

### Atténuations

1. **Migration incrémentale**
   - Migrer par cluster, pas tout à la fois
   - Maintenir la compatibilité pendant la migration
   - Tests complets à chaque étape
   - Plan de rollback pour chaque migration

2. **Documentation**
   - Documentation claire et complète
   - Exemples d'utilisation
   - Guide de migration
   - Formation de l'équipe

3. **Support**
   - Pair programming pendant la migration
   - Code reviews approfondis
   - Monitoring continu
   - Support technique disponible

---

## Règles de dépendance

### Dépendances autorisées

```
Engines
↓
intelligence-runtime
↓
intelligence-core
↓
Providers
↓
AI SDK
```

### Dépendances interdites

- ❌ intelligence-core → intelligence-runtime (pas de dépendance inverse)
- ❌ intelligence-core → Engines (pas de dépendance inverse)
- ❌ intelligence-runtime → Engines (pas de dépendance inverse)
- ❌ Providers → intelligence-runtime (pas de dépendance inverse)
- ❌ AI SDK → intelligence-core (pas de dépendance inverse)

### Pas de dépendances circulaires

- ✅ Aucune dépendance circulaire dans l'architecture proposée
- ✅ Hiérarchie de dépendances claire
- ✅ Dependency inversion respecté

---

## Principes d'évolution

### intelligence-core : Évolution très rare

- **Stabilité** : intelligence-core doit évoluer très rarement
- **Breaking changes** : Éviter les breaking changes
- **Backward compatibility** : Maintenir la compatibilité autant que possible
- **Justification** : intelligence-core est une fondation stable pour tous les moteurs

### intelligence-runtime : Évolution pour intégrer de nouvelles capacités techniques

- **Évolution** : intelligence-runtime peut évoluer pour intégrer de nouvelles capacités techniques
- **Ajouts** : Ajouter de nouvelles capacités (cache, timeout, circuit breaker, telemetry)
- **Améliorations** : Améliorer les capacités existantes
- **Justification** : intelligence-runtime fournit des capacités techniques qui évoluent avec les besoins

### Intelligence Engines : Jamais réimplémenter les capacités présentes dans le runtime

- **Réutilisation** : Les moteurs ne doivent jamais réimplémenter des capacités présentes dans intelligence-runtime
- **Dépendance** : Les moteurs doivent dépendre de intelligence-runtime pour les capacités runtime
- **Standardisation** : Tous les moteurs utilisent les mêmes capacités runtime
- **Justification** : Éviter la duplication de code et garantir la cohérence

---

## Critères de succès

La décision est considérée appliquée lorsque :

- ✅ intelligence-runtime créé avec toutes les capacités proposées
- ✅ Tous les composants ont des tests unitaires
- ✅ Build, typecheck, eslint passent
- ✅ Diagramme de dépendances respecté
- ✅ Aucune dépendance circulaire
- ✅ Compliance Clean Architecture vérifiée
- ✅ Forecast migré pour utiliser intelligence-runtime + intelligence-core
- ✅ Forecast tests passent
- ✅ Comportement Forecast inchangé (pas de régression)
- ✅ Build, typecheck, eslint passent
- ✅ Rapport de migration créé

---

## Références

- `SPRINT_611_ARCHITECTURE_GAP_ANALYSIS.md` - Analyse des dépendances de Forecast
- `INTELLIGENCE_RUNTIME_PROPOSAL.md` - Proposition détaillée pour intelligence-runtime
- `INTELLIGENCE_CORE_IMPLEMENTATION.md` - Implémentation d'intelligence-core
- `ADR-017_SERVER_ONLY_AI_ARCHITECTURE.md` - Architecture IA server-only
- `ADR-018_INTERVIEW_AI_DOMAIN.md` - Standard AI Domain pour Interview
- `ADR-019_AI_COMPONENT_CLASSIFICATION.md` - Classification des composants IA
- `ADR-020_INTELLIGENCE_ENGINE_STANDARD.md` - Standard Intelligence Engine
- `AI_COMPONENT_CLASSIFICATION.md` - Classification complète des composants IA
- `INTELLIGENCE_ENGINE_STANDARD_V1.md` - Standard V1 pour Intelligence Engines

---

## Conclusion

L'analyse de Forecast a révélé 11 composants transverses qui fournissent des capacités runtime partagées par tous les moteurs mais n'appartiennent ni au domaine métier ni à `lib/intelligence-core`.

La recommandation est de créer `lib/intelligence-runtime` pour héberger ces capacités runtime, avec une séparation claire des responsabilités :
- intelligence-core : Abstraction provider minimal et stable
- intelligence-runtime : Capacités runtime évolutives
- Moteurs : Logique métier spécifique

**Statut** : Proposé ✅  
**Prochaine phase** : Création de la documentation d'architecture (INTELLIGENCE_RUNTIME_ARCHITECTURE.md)
