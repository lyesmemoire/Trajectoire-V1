# Sprint 6.11 - Pré-Migration Review

## Overview

**Date**: 2026-07-13  
**Sprint**: 6.11 (Preparation)  
**Status**: Review Phase

Cette revue structurelle vise à valider que le module `lib/intelligence-core/` est prêt pour la migration des 29+ Intelligence Engines.

---

## Points de Vérification Structurelle

### 1. Interfaces du Domaine - Généricité

#### IntelligenceProviderPort

**Analyse**:
- ✅ **Générique**: L'interface utilise des generics `TOutput` pour s'adapter à tous les moteurs
- ✅ **Flexible**: `variables: Record<string, unknown>` permet n'importe quelle structure de données
- ✅ **Extensible**: `ProviderOptions` inclut les options standards (provider, model, temperature, maxTokens, timeout)
- ⚠️ **Limitation**: `provider` est restreint à `"openai" | "anthropic"` - ne supporte pas Mistral ou autres fournisseurs

**Recommandation**:
- Étendre `ProviderOptions.provider` pour inclure `"mistral"` ou utiliser `string` avec validation
- Ajouter `streaming?: boolean` pour les moteurs qui utilisent le streaming (Career Copilot, Interview)

#### IntelligenceRequest

**Analyse**:
- ✅ **Générique**: `TInput` permet n'importe quelle structure d'entrée spécifique au moteur
- ✅ **Flexible**: `IntelligenceContext` inclut `engineContext?: Record<string, unknown>` pour contexte spécifique
- ✅ **Extensible**: `IntelligenceOptions` couvre les options standards
- ✅ **Immutabilité**: Tous les champs sont `readonly`

**Recommandation**:
- Aucune évolution cassante nécessaire
- Les generics `TInput` et `TContext` suffisent pour tous les cas

#### IntelligenceResponse

**Analyse**:
- ✅ **Générique**: `TOutput` permet n'importe quelle structure de sortie spécifique au moteur
- ✅ **Flexible**: `IntelligenceMetadata` inclut `additional?: Record<string, unknown>` pour métadonnées spécifiques
- ✅ **Immutabilité**: Tous les champs sont `readonly`
- ✅ **Erreur handling**: `error?: IntelligenceError` pour les cas d'échec

**Recommandation**:
- Aucune évolution cassante nécessaire
- Les generics `TOutput` suffisent pour tous les cas

**Conclusion**: ✅ Les interfaces sont suffisamment génériques pour couvrir les ~29 moteurs, avec une extension mineure recommandée pour supporter d'autres providers.

---

### 2. Conteneur de Composition - Logique Métier

#### container.ts

**Analyse**:
- ✅ **Pas de logique métier**: Le conteneur ne fait que de l'instantiation
- ✅ **Câblage de dépendances**: Seulement `new IntelligenceUseCase(provider, promptTemplate)`
- ✅ **Stub provider**: Le stub provider est une implémentation vide pour tests
- ✅ **Pas de règles métier**: Aucune validation, transformation, ou logique conditionnelle

**Code analysé**:
```typescript
export const intelligenceCoreModule = {
  createUseCase<TInput = unknown, TOutput = unknown>(promptTemplate: string): IntelligenceUseCase<TInput, TOutput> {
    const provider = { /* stub implementation */ };
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },
  createUseCaseWithProvider<TInput = unknown, TOutput = unknown>(provider: unknown, promptTemplate: string): IntelligenceUseCase<TInput, TOutput> {
    return new IntelligenceUseCase<TInput, TOutput>(provider, promptTemplate);
  },
};
```

**Conclusion**: ✅ Le conteneur ne contient aucune logique métier et se limite strictement au câblage des dépendances.

---

### 3. Erreurs - Typage Complet

#### intelligence-errors.ts

**Analyse**:
- ✅ **Hiérarchie d'erreurs**: Base `IntelligenceError` avec sous-classes spécialisées
- ✅ **Codes d'erreur**: Chaque erreur a un code string (`VALIDATION_ERROR`, `PROVIDER_ERROR`, etc.)
- ✅ **Sérialisation**: Méthode `toJSON()` pour sérialisation
- ✅ **Détails**: Champ `details?: Record<string, unknown>` pour contexte additionnel
- ✅ **Héritage**: Toutes les erreurs étendent `IntelligenceError` qui étend `Error`

**Hiérarchie**:
```
IntelligenceError (abstract)
├── ValidationError
├── ProviderError
├── EngineExecutionError
├── TimeoutError
├── RateLimitError
├── AuthenticationError
└── ConfigurationError
```

**Tests de validation**:
- ✅ 9 tests couvrent tous les types d'erreurs
- ✅ Sérialisation JSON testée
- ✅ Création avec détails testée

**Conclusion**: ✅ Les erreurs sont entièrement typées avec une hiérarchie claire, garantissant un comportement homogène sur tous les moteurs.

---

### 4. Adaptateurs d'Infrastructure - Isolation SDK IA

#### result.adapter.ts

**Analyse**:
- ✅ **Pas de SDK IA**: L'adaptateur ne connaît aucun SDK (AI SDK v6, Mistral)
- ✅ **Transformation pure**: Transforme `ProviderResult` en `IntelligenceResponse`
- ✅ **Indépendance**: Ne dépend que des types du domaine
- ✅ **Statique**: Méthodes statiques sans état

**Code analysé**:
```typescript
export class ResultAdapter {
  static adapt<TOutput = unknown>(
    providerResult: ProviderResult<TOutput>,
    requestId: string,
    requestType: string,
    provider: "openai" | "anthropic",
    model: string
  ): IntelligenceResponse<TOutput> { /* transformation */ }
  
  static adaptError(error: Error): { code: string; message: string }, details?: Record<string, unknown> } { /* adaptation */ }
}
```

**⚠️ Problème identifié**:
- Il n'y a PAS d'adaptateur concret pour AI SDK v6 ou Mistral
- Le `IntelligenceProviderPort` est une interface sans implémentation
- Le stub provider dans `container.ts` est une implémentation vide

**Recommandation**:
- Créer `lib/intelligence-core/infrastructure/adapters/ai-sdk-v6.adapter.ts` pour AI SDK v6
- Créer `lib/intelligence-core/infrastructure/adapters/mistral.adapter.ts` pour Mistral
- Ces adaptateurs seront les seuls à connaître les SDKs IA
- Le domaine reste indépendant des fournisseurs

**Conclusion**: ⚠️ Les adaptateurs d'infrastructure existants sont isolés des SDKs IA, mais il manque les adaptateurs concrets pour AI SDK v6 et Mistral. À créer avant Sprint 6.11.

---

## Recommandations pour Sprint 6.11

### Ordre de Migration par Clusters

#### Cluster Foundation (Priorité 1)
1. **Forecast** - Base pour de nombreuses analyses
2. **Career Intelligence** - Contexte central
3. **Planning** - Dépend de nombreux autres moteurs

**Rationale**: Ces moteurs servent de fondation et permettront de valider le socle.

#### Cluster Recommandation (Priorité 2)
4. **ATS** - Analyse CV vs job description
5. **CV Analysis** - Analyse de CV
6. **Matching** - Matching candidat/offre
7. **Skills Gap** - Analyse des écarts de compétences

**Rationale**: Ces moteurs partagent des patterns similaires d'analyse et de recommandation.

#### Cluster Coaching (Priorité 3)
8. **Daily Coach** - Coaching quotidien
9. **Weekly Coach** - Coaching hebdomadaire
10. **Career Advisor** - Conseiller carrière

**Rationale**: Ces moteurs sont orientés coaching et guidance.

#### Cluster Simulation (Priorité 4)
11. **Salary** - Simulation salariale
12. **Mobility** - Simulation mobilité
13. **Scenario** - Scénarios de carrière
14. **Forecast avancé** - Prédictions avancées

**Rationale**: Ces moteurs impliquent des simulations et prédictions complexes.

---

## Définition de Fin (Definition of Done)

Pour chaque moteur migré, les critères suivants doivent être remplis :

### Build & Qualité
- ✅ Build vert
- ✅ Typecheck vert
- ✅ ESLint vert
- ✅ Tests unitaires verts

### API & Fonctionnalité
- ✅ Aucune modification de l'API publique
- ✅ Aucune régression fonctionnelle

### Architecture
- ✅ Suppression de la logique IA du moteur historique
- ✅ Utilisation exclusive de `lib/intelligence-core`
- ✅ Conformité au `INTELLIGENCE_ENGINE_STANDARD_V1`

---

## Actions Requises Avant Sprint 6.11

### 1. Étendre ProviderOptions pour supporter d'autres providers

**Fichier**: `lib/intelligence-core/domain/ports/intelligence-provider.port.ts`

```typescript
export interface ProviderOptions {
  readonly provider: "openai" | "anthropic" | "mistral" | string;
  // ... autres champs
}
```

### 2. Ajouter support streaming

**Fichier**: `lib/intelligence-core/domain/ports/intelligence-provider.port.ts`

```typescript
export interface ProviderOptions {
  readonly streaming?: boolean;
  // ... autres champs
}
```

### 3. Créer adaptateur AI SDK v6

**Nouveau fichier**: `lib/intelligence-core/infrastructure/adapters/ai-sdk-v6.adapter.ts`

- Implémente `IntelligenceProviderPort`
- Utilise AI SDK v6
- Transforme les résultats en `ProviderResult`

### 4. Créer adaptateur Mistral

**Nouveau fichier**: `lib/intelligence-core/infrastructure/adapters/mistral.adapter.ts`

- Implémente `IntelligenceProviderPort`
- Utilise Mistral SDK
- Transforme les résultats en `ProviderResult`

### 5. Mettre à jour container.ts

**Fichier**: `lib/intelligence-core/composition/container.ts`

- Ajouter méthode pour créer use case avec AI SDK v6
- Ajouter méthode pour créer use case avec Mistral

---

## Conclusion

### État Actuel

| Point de Vérification | État | Action Requise |
|---------------------|------|----------------|
| Interfaces génériques | ✅ Pass | Extension mineure (providers, streaming) |
| Conteneur sans logique métier | ✅ Pass | Aucune |
| Erreurs entièrement typées | ✅ Pass | Aucune |
| Adaptateurs isolés SDK IA | ⚠️ Partial | Créer adaptateurs concrets |

### Prêt pour Sprint 6.11?

**Conditionnel**: OUI, après avoir complété les actions requises ci-dessus.

- Les interfaces sont génériques et flexibles
- Le conteneur est propre (pas de logique métier)
- Les erreurs sont bien typées
- Il manque les adaptateurs concrets pour AI SDK v6 et Mistral

**Estimation**: 2-3 heures pour compléter les actions requises.

---

## Prochaines Étapes

1. ✅ Compléter les actions requises (extensions + adaptateurs)
2. ✅ Mettre à jour les tests pour les nouveaux adaptateurs
3. ✅ Valider typecheck, tests, lint
4. ✅ Démarrer Sprint 6.11 avec Cluster Foundation
