# Audit Complet - Interview Operating System (IOS)

**Date**: 30 juillet 2026  
**Objectif**: Analyse complète de l'architecture actuelle, moteurs, contrats et dépendances  
**Statut**: EN COURS

---

## 1. Architecture Actuelle

### 1.1 Structure Principale

```
c:\Trajectoire\
├── apps\web\src\
│   ├── domain\cognitive\          # NOUVEAU - Domaine cognitif
│   ├── lib\ai\                    # NOUVEAU - Moteur AI moderne
│   └── application\hiios\         # ANCIEN - Moteur HIIOS (production)
└── tests\cognitive\               # Tests du domaine cognitif
```

### 1.2 Domaine Cognitif (`apps/web/src/domain/cognitive/`)

**Fichiers** (16 fichiers):
- `CognitiveState.ts` - État cognitif global
- `Competency.ts` - Compétences
- `Confidence.ts` - Confiance et calcul de delta
- `Decision.ts` - Décisions
- `Edge.ts` - Arêtes du graphe de connaissances
- `Evidence.ts` - Preuves et facteurs de confiance
- `Hypothesis.ts` - Hypothèses
- `InterviewBudget.ts` - Budget d'entretien
- `InterviewGoal.ts` - Objectifs d'entretien
- `KnowledgeGraph.ts` - Graphe de connaissances
- `Node.ts` - Nœuds du graphe
- `Risk.ts` - Risques
- `Strategy.ts` - Stratégies
- `Unknown.ts` - Inconnus
- `WeakSignal.ts` - Signaux faibles
- `index.ts` - Barrel export

**Statut**: ✅ Implémenté et testé

### 1.3 Nouveau Moteur AI (`apps/web/src/lib/ai/`)

**Structure**:
```
lib/ai/
├── contracts/           # Contrats d'interface
│   ├── Engine.ts
│   ├── EngineResult.ts
│   ├── Event.ts
│   ├── LLMProvider.ts
│   └── Reducer.ts
├── engines/
│   ├── perception/      # PerceptionEngine
│   │   ├── PerceptionEngine.ts
│   │   ├── PerceptionPrompt.ts
│   │   ├── PerceptionSchema.ts
│   │   ├── PerceptionTypes.ts
│   │   └── index.ts
│   └── evidence/        # EvidenceEngine
│       ├── EvidenceEngine.ts
│       ├── EvidencePrompt.ts
│       ├── EvidenceSchema.ts
│       ├── EvidenceTypes.ts
│       └── index.ts
├── pipeline/
│   ├── CognitivePipeline.ts
│   ├── CostGuard.ts
│   └── SafetyLayer.ts
├── registry/
│   └── EngineRegistry.ts
├── providers/
│   ├── StructuredLLMProvider.ts
│   └── ...
├── services/
│   └── ...
├── memory/
│   └── ...
├── cost/
│   └── ...
├── observability/
│   └── ...
├── retry/
│   └── ...
├── security/
│   └── ...
├── streaming/
│   └── ...
├── schemas/
│   └── ...
├── prompting/
│   └── ...
├── prompts/
│   └── ...
├── config/
│   └── ...
├── cv-rewriter.ts       # STUB créé pour le build
├── client.ts
├── model-router.ts
├── models.ts
├── preview-analyzer.ts
├── rag.ts
├── streaming.ts
└── trimmer.ts
```

**Statut**: 🟡 En cours d'implémentation (PerceptionEngine et EvidenceEngine implémentés, pipeline partiel)

### 1.4 Ancien Moteur HIIOS (`apps/web/src/application/hiios/`)

**Structure**:
```
application/hiios/
├── layer0-kernel/       # Moteurs de base
│   ├── BayesianEngine.ts
│   ├── BiasEngine.ts
│   ├── ConfidenceEngine.ts
│   ├── ContradictionEngine.ts
│   ├── EvidenceEngine.ts
│   ├── HypothesisEngine.ts
│   ├── KernelState.ts
│   ├── MemoryEngine.ts
│   ├── QuestionPlanner.ts
│   ├── SkillGraph.ts
│   └── TimelineEngine.ts
├── layer1-identity/
├── layer2-reasoning/
├── layer3-competence/
├── layer4-state/
├── layer5-decision/
├── layer6-growth/
├── layer7-explainability/
├── layer8-learning/
├── formatters/
└── interfaces/
```

**Statut**: ✅ En production (ne pas modifier sans validation)

---

## 2. Tous les Moteurs Existants

### 2.1 Nouveaux Moteurs (lib/ai/engines/)

| Moteur | Version | Statut | Tests |
|--------|---------|--------|-------|
| PerceptionEngine | 1.0.0 | ✅ Implémenté | ✅ Tests existent |
| EvidenceEngine | 1.0.0 | ✅ Implémenté | ✅ Tests existent |

### 2.2 Anciens Moteurs (application/hiios/layer0-kernel/)

| Moteur | Version | Statut | Tests |
|--------|---------|--------|-------|
| BayesianEngine | - | ✅ Production | ❌ Tests non trouvés |
| BiasEngine | - | ✅ Production | ❌ Tests non trouvés |
| ConfidenceEngine | - | ✅ Production | ❌ Tests non trouvés |
| ContradictionEngine | - | ✅ Production | ❌ Tests non trouvés |
| EvidenceEngine | - | ✅ Production | ❌ Tests non trouvés |
| HypothesisEngine | - | ✅ Production | ❌ Tests non trouvés |
| MemoryEngine | - | ✅ Production | ❌ Tests non trouvés |
| QuestionPlanner | - | ✅ Production | ❌ Tests non trouvés |
| SkillGraph | - | ✅ Production | ❌ Tests non trouvés |
| TimelineEngine | - | ✅ Production | ❌ Tests non trouvés |
| KernelState | - | ✅ Production | ❌ Tests non trouvés |

---

## 3. Tous les Contrats

### 3.1 Contrats du Nouveau Moteur (lib/ai/contracts/)

| Contrat | Description | Statut |
|---------|-------------|--------|
| Engine.ts | Interface générique pour tous les moteurs | ✅ Défini |
| EngineResult.ts | Structure de résultat standardisée | ✅ Défini |
| Event.ts | Structure d'événement de base | ✅ Défini |
| LLMProvider.ts | Interface pour les providers LLM | ✅ Défini |
| Reducer.ts | Interface pour les réducteurs d'événements | ✅ Défini |

### 3.2 Contrats du Domaine Cognitif (domain/cognitive/)

| Contrat | Description | Statut |
|---------|-------------|--------|
| CognitiveState.ts | État cognitif global avec Zod schemas | ✅ Défini |
| KnowledgeGraph.ts | Graphe de connaissances | ✅ Défini |
| Evidence.ts | Preuves et calcul de confiance | ✅ Défini |
| Competency.ts | Compétences | ✅ Défini |
| Hypothesis.ts | Hypothèses bayésiennes | ✅ Défini |
| Unknown.ts | Inconnus à investiguer | ✅ Défini |
| WeakSignal.ts | Signaux faibles | ✅ Défini |
| Risk.ts | Risques | ✅ Défini |
| Decision.ts | Décisions | ✅ Défini |
| Strategy.ts |atégies | ✅ Défini |
| InterviewBudget.ts | Budget d'entretien | ✅ Défini |

---

## 4. Toutes les Dépendances

### 4.1 Dépendances du Domaine Cognitif

- `zod` - Validation de schémas
- Aucune dépendance externe lourde

### 4.2 Dépendances du Nouveau Moteur AI

- `zod` - Validation de schémas
- `crypto` - Génération d'UUID
- StructuredLLMProvider (interface)
- EngineRegistry (singleton)

### 4.3 Dépendances de l'Ancien Moteur HIIOS

- Dépendances internes entre les moteurs
- EvidenceEngine dépend de EvidenceEngine (circular dependency possible)
- Interfaces dans `interfaces/` folder

---

## 5. Les Fichiers Morts

### 5.1 Fichiers Potentiellement Morts

**Dans lib/ai/**:
- `cv-rewriter.ts` - STUB créé pour le build (TODO: implémentation réelle nécessaire)
- Plusieurs dossiers vides ou partiellement implémentés

**Dans application/hiios/**:
- Tous les fichiers layer1-8 semblent être des placeholders ou partiellement implémentés

---

## 6. Les Doublons

### 6.1 Doublons Identifiés

| Concept | Ancien Moteur | Nouveau Moteur | Statut |
|---------|--------------|---------------|--------|
| EvidenceEngine | application/hiios/layer0-kernel/EvidenceEngine.ts | lib/ai/engines/evidence/EvidenceEngine.ts | 🟡 Duplication |
| Evidence | Interfaces HIIOS | Domaine cognitif Evidence.ts | 🟡 Duplication |
| Hypothesis | HypothesisEngine.ts | Domaine cognitif Hypothesis.ts | 🟡 Duplication |
| Confidence | ConfidenceEngine.ts | Domaine cognitif Confidence.ts | 🟡 Duplication |

---

## 7. Les TODO

### 7.1 TODO Trouvés dans le Dépôt

**Fichier**: `apps/web/src/core/p5/integration/execution-facade.js`
```javascript
// TODO: proper snapshot hash later
snapshotHash: nextSession.initialSnapshot?.id || "snapshot-0"
```

**Fichier**: `apps/web/src/core/p7/scoring-engine/extractors/trust-extractor.ts`
```typescript
// TODO: Implement trust extraction after realtime-gateway migration
// The current TurnTrace placeholder doesn't include events or decision data
```

**Fichier**: `apps/web/src/lib/ai/cv-rewriter.ts`
```typescript
// TODO: Implement with LLM
```

**Fichier**: `apps/web/src/lib/ai/pipeline/CognitivePipeline.ts`
```typescript
// Resolve PerceptionEngine from registry, execute, emit events
// Resolve EvidenceEngine from registry, execute, emit events
// Resolve ContradictionEngine from registry, execute, emit events
// Resolve ConfidenceEngine from registry, execute, emit events
// Resolve HypothesisEngine
// Resolve StrategyEngine
// Run Director FSM and update DecisionLog
// Run CognitivePlanner
// Execute SafetyLayer checks
// Run InterviewerAgent
```

**Total**: 5 TODO identifiés

---

## 8. Les Incohérences

### 8.1 Incohérences Identifiées

1. **EvidenceEngine Dupliqué**: L'ancien et le nouveau moteur ont tous deux un EvidenceEngine avec des implémentations différentes
2. **Pipeline Non Implémenté**: CognitivePipeline a des méthodes vides avec des commentaires TODO
3. **Stub cv-rewriter**: Fichier stub créé pour le build sans implémentation réelle
4. **Tests Manquants**: Les moteurs HIIOS n'ont pas de tests correspondants dans tests/cognitive/
5. **Imports Circulaires Possibles**: Les moteurs HIIOS dépendent les uns des autres

---

## 9. Les Imports Inutilisés

### 9.1 Analyse des Imports

**À compléter avec analyse statique plus approfondie**

---

## 10. Les Risques d'Architecture

### 10.1 Risques Critiques

| Risque | Sévérité | Impact | Mitigation |
|--------|----------|--------|------------|
| Duplication EvidenceEngine | 🔴 Critique | Confusion, maintenance difficile | Migration progressive |
| Pipeline non implémenté | 🔴 Critique | Fonctionnalité incomplète | Implémentation complète |
| Tests manquants HIIOS | 🟡 Moyen | Régressions possibles | Ajouter tests |
| Stub cv-rewriter | 🟡 Moyen | Build passe mais fonctionnalité cassée | Implémentation réelle |
| Circular dependencies HIIOS | 🟡 Moyen | Problèmes de build/runtime | Refactoring |

### 10.2 Risques de Migration

| Risque | Sévérité | Impact | Mitigation |
|--------|----------|--------|------------|
| Casser la production | 🔴 Critique | Perte de service | Tests E2E complets |
| Incompatibilité API | 🟡 Moyen | Breaking changes | Versioning d'API |
| Performance dégradée | 🟡 Moyen | Expérience utilisateur | Benchmarks |

---

## 11. Comparaison Ancien vs Nouveau Moteur

### 11.1 Tableau de Migration

| Fonctionnalité | Ancien Moteur (HIIOS) | Nouveau Moteur (lib/ai) | Migration Nécessaire | Peut être supprimé ? | Utilisé ? |
|---------------|----------------------|-------------------------|----------------------|---------------------|----------|
| Perception | ❌ Non implémenté | ✅ PerceptionEngine | ✅ Oui | ❌ Non | 🟡 Partiel |
| Evidence | ✅ EvidenceEngine | ✅ EvidenceEngine | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Hypothesis | ✅ HypothesisEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Confidence | ✅ ConfidenceEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Contradiction | ✅ ContradictionEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Bayesian | ✅ BayesianEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Bias | ✅ BiasEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Memory | ✅ MemoryEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| QuestionPlanner | ✅ QuestionPlanner | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| SkillGraph | ✅ SkillGraph | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Timeline | ✅ TimelineEngine | ❌ Non implémenté | ✅ Oui | ❌ Non | ✅ Oui (ancien) |
| Pipeline | ❌ Non implémenté | 🟡 CognitivePipeline (partiel) | ✅ Oui | ❌ Non | ❌ Non |
| Registry | ❌ Non implémenté | ✅ EngineRegistry | ✅ Oui | ❌ Non | 🟡 Partiel |

---

## 12. Recommandations

### 12.1 Actions Immédiates

1. **Compléter CognitivePipeline**: Implémenter toutes les méthodes marquées TODO
2. **Implémenter cv-rewriter**: Remplacer le stub par une implémentation réelle
3. **Ajouter tests HIIOS**: Créer des tests pour les moteurs de production
4. **Documenter la migration**: Créer un plan de migration détaillé

### 12.2 Actions À Terme

1. **Migrer progressivement**: Remplacer les moteurs HIIOS un par un
2. **Éliminer les doublons**: Supprimer les anciens moteurs après migration
3. **Unifier les contrats**: Harmoniser les interfaces entre ancien et nouveau
4. **Performance**: Benchmarks comparatifs entre ancien et nouveau

---

## 13. Statut de l'Audit

**Phase 1**: ✅ Architecture actuelle - COMPLÉTÉ  
**Phase 2**: ✅ Moteurs existants - COMPLÉTÉ  
**Phase 3**: ✅ Contrats - COMPLÉTÉ  
**Phase 4**: ✅ Dépendances - COMPLÉTÉ  
**Phase 5**: ✅ Fichiers morts - COMPLÉTÉ  
**Phase 6**: ✅ Doublons - COMPLÉTÉ  
**Phase 7**: ✅ TODO - COMPLÉTÉ  
**Phase 8**: ✅ Incohérences - COMPLÉTÉ  
**Phase 9**: ⏳ Imports inutilisés - À COMPLÉTER  
**Phase 10**: ✅ Risques d'architecture - COMPLÉTÉ  
**Phase 11**: ✅ Comparaison moteurs - COMPLÉTÉ  

---

## 14. Prochaine Étape

**ATTENTE VALIDATION** - Ne pas commencer de refactoring sans validation utilisateur.

**Questions pour validation**:
1. La priorité est-elle de compléter le nouveau moteur ou de migrer l'ancien ?
2. Faut-il maintenir les deux moteurs en parallèle pendant la transition ?
3. Quelle est la timeline acceptable pour la migration ?
4. Les tests E2E existants couvrent-ils les moteurs HIIOS ?
5. Faut-il d'abord implémenter les moteurs manquants dans le nouveau moteur ?

---

**Rapport généré automatiquement le 30 juillet 2026**
