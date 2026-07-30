# Plan de Migration HIIOS vers IOS

**Date**: 30 juillet 2026  
**Objectif**: Migrer le moteur HIIOS legacy vers l'architecture IOS moderne  
**Statut**: EN ATTENTE VALIDATION

---

## 1. Inventaire Complet des Composants Legacy

### 1.1 Layer 0 - Kernel (11 composants)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| BayesianEngine | BayesianEngine.ts | 11.1 KB | Calcul bayésien des probabilités |
| BiasEngine | BiasEngine.ts | 11.2 KB | Détection des biais cognitifs |
| ConfidenceEngine | ConfidenceEngine.ts | 10.9 KB | Calcul de confiance par compétence |
| ContradictionEngine | ContradictionEngine.ts | 11.1 KB | Détection des contradictions |
| EvidenceEngine | EvidenceEngine.ts | 10.4 KB | Extraction et qualification des preuves |
| HypothesisEngine | HypothesisEngine.ts | 15.8 KB | Génération et mise à jour des hypothèses |
| KernelState | KernelState.ts | 12.5 KB | État global du kernel |
| MemoryEngine | MemoryEngine.ts | 11.5 KB | Gestion de la mémoire candidat |
| QuestionPlanner | QuestionPlanner.ts | 21.2 KB | Planification des questions |
| SkillGraph | SkillGraph.ts | 12.6 KB | Graphe des compétences |
| TimelineEngine | TimelineEngine.ts | 11.4 KB | Gestion de la timeline d'entretien |

### 1.2 Layer 1 - Identity (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| IdentityEngine | IdentityEngine.ts | 19.4 KB | Construction de l'identité candidat |

### 1.3 Layer 2 - Reasoning (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| ReasoningEngine | ReasoningEngine.ts | 23.9 KB | Raisonnement logique |

### 1.4 Layer 3 - Competence (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| CompetenceGraphEngine | CompetenceGraphEngine.ts | 25.2 KB | Graphe des compétences avancé |

### 1.5 Layer 4 - State (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| InterviewStateMachine | InterviewStateMachine.ts | 18.9 KB | Machine à états de l'entretien |

### 1.6 Layer 5 - Decision (2 composants)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| DecisionEngine | DecisionEngine.ts | 23.7 KB | Moteur de décision |
| DecisionLedger | DecisionLedger.ts | 20.0 KB | Journal des décisions |

### 1.7 Layer 6 - Growth (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| GrowthEngine | GrowthEngine.ts | 26.5 KB | Analyse de croissance |

### 1.8 Layer 7 - Explainability (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| ExplainabilityEngine | ExplainabilityEngine.ts | 55.9 KB | Explicabilité des décisions |

### 1.9 Layer 8 - Learning (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| LearningEngine | LearningEngine.ts | 58.8 KB | Apprentissage automatique |

### 1.10 Interfaces (1 composant)

| Composant | Fichier | Taille | Description |
|-----------|---------|--------|-------------|
| IHIIOSKernel | IHIIOSKernel.ts | 11.3 KB | Interface principale du kernel |

**Total Legacy**: 20 composants, ~326 KB de code

---

## 2. Inventaire du Nouveau Runtime

### 2.1 Domaine Cognitif (16 entités)

| Entité | Statut | Tests |
|--------|--------|-------|
| CognitiveState | ✅ Implémenté | ✅ Tests |
| KnowledgeGraph | ✅ Implémenté | ✅ Tests |
| Evidence | ✅ Implémenté | ✅ Tests |
| Competency | ✅ Implémenté | ✅ Tests |
| Confidence | ✅ Implémenté | ✅ Tests |
| Hypothesis | ✅ Implémenté | ✅ Tests |
| Unknown | ✅ Implémenté | ✅ Tests |
| WeakSignal | ✅ Implémenté | ✅ Tests |
| Risk | ✅ Implémenté | ✅ Tests |
| Decision | ✅ Implémenté | ✅ Tests |
| Strategy | ✅ Implémenté | ✅ Tests |
| InterviewBudget | ✅ Implémenté | ✅ Tests |
| InterviewGoal | ✅ Implémenté | ✅ Tests |
| Node | ✅ Implémenté | ✅ Tests |
| Edge | ✅ Implémenté | ✅ Tests |

### 2.2 Moteurs AI (2 moteurs implémentés)

| Moteur | Statut | Tests |
|--------|--------|-------|
| PerceptionEngine | ✅ Implémenté | ✅ Tests |
| EvidenceEngine | ✅ Implémenté | ✅ Tests |

### 2.3 Infrastructure Runtime

| Composant | Statut | Tests |
|----------|--------|-------|
| EngineRegistry | ✅ Implémenté | ❌ Tests |
| CognitivePipeline | 🟡 Partiel | ❌ Tests |
| CostGuard | ✅ Implémenté | ❌ Tests |
| SafetyLayer | ✅ Implémenté | ❌ Tests |
| StructuredLLMProvider | 🟡 Partiel | ❌ Tests |

---

## 3. Tableau de Correspondance Legacy → Nouvelle Architecture

| Legacy Component | New Component | Status | Migration Strategy |
|-----------------|---------------|--------|-------------------|
| **Layer 0 - Kernel** | | | |
| EvidenceEngine | EvidenceEngine (lib/ai) | ✅ Implémenté | Refactor pour aligner avec contrat Engine |
| HypothesisEngine | Hypothesis (domain) + Engine | 🟡 Domaine OK, Engine manquant | Créer HypothesisEngine implémentant Engine |
| ConfidenceEngine | Confidence (domain) + Engine | 🟡 Domaine OK, Engine manquant | Créer ConfidenceEngine implémentant Engine |
| ContradictionEngine | Contradiction (domain) + Engine | 🟡 Domaine OK, Engine manquant | Créer ContradictionEngine implémentant Engine |
| BayesianEngine | Bayesian logic dans Hypothesis | ❌ Non implémenté | Intégrer logique bayésienne dans HypothesisEngine |
| BiasEngine | Bias detection dans EvidenceEngine | ❌ Non implémenté | Ajouter détection de biais dans EvidenceEngine |
| MemoryEngine | Memory (lib/ai/memory) | 🟡 Partiel | Compléter MemoryEngine |
| QuestionPlanner | QuestionPlanner (à créer) | ❌ Non implémenté | Créer QuestionPlannerEngine |
| SkillGraph | KnowledgeGraph (domain) | ✅ Implémenté | Mapper vers KnowledgeGraph |
| TimelineEngine | Timeline (à créer) | ❌ Non implémenté | Créer TimelineEngine |
| KernelState | CognitiveState (domain) | ✅ Implémenté | Mapper vers CognitiveState |
| **Layer 1 - Identity** | | | |
| IdentityEngine | Identity (à créer) | ❌ Non implémenté | Créer IdentityEngine |
| **Layer 2 - Reasoning** | | | |
| ReasoningEngine | Reasoning (à créer) | ❌ Non implémenté | Créer ReasoningEngine |
| **Layer 3 - Competence** | | | |
| CompetenceGraphEngine | KnowledgeGraph + Competency | ✅ Implémenté | Utiliser KnowledgeGraph existant |
| **Layer 4 - State** | | | |
| InterviewStateMachine | InterviewPhase (CognitiveState) | ✅ Implémenté | Utiliser InterviewPhase existant |
| **Layer 5 - Decision** | | | |
| DecisionEngine | Decision (domain) + Engine | 🟡 Domaine OK, Engine manquant | Créer DecisionEngine |
| DecisionLedger | DecisionLog (à créer) | ❌ Non implémenté | Créer DecisionLog |
| **Layer 6 - Growth** | | | |
| GrowthEngine | Growth (à créer) | ❌ Non implémenté | Créer GrowthEngine |
| **Layer 7 - Explainability** | | | |
| ExplainabilityEngine | Explainability (à créer) | ❌ Non implémenté | Créer ExplainabilityEngine |
| **Layer 8 - Learning** | | | |
| LearningEngine | Learning (à créer) | ❌ Non implémenté | Créer LearningEngine (post-MVP) |

---

## 4. Composants à Migrer

### 4.1 Priorité P0 (MVP Core)

| Composant | Effort Estimé | Dépendances | Blockers |
|-----------|---------------|-------------|----------|
| EvidenceEngine refactor | 2 jours | PerceptionEngine | Aucun |
| HypothesisEngine | 5 jours | EvidenceEngine, Bayesian logic | Bayesian logic |
| ConfidenceEngine | 3 jours | HypothesisEngine | HypothesisEngine |
| ContradictionEngine | 4 jours | EvidenceEngine, HypothesisEngine | HypothesisEngine |
| QuestionPlannerEngine | 5 jours | HypothesisEngine, InterviewBudget | HypothesisEngine |
| DecisionEngine | 4 jours | ConfidenceEngine, Decision | ConfidenceEngine |

**Total P0**: 23 jours

### 4.2 Priorité P1 (Intelligence)

| Composant | Effort Estimé | Dépendances | Blockers |
|-----------|---------------|-------------|----------|
| IdentityEngine | 4 jours | MemoryEngine | MemoryEngine |
| ReasoningEngine | 5 jours | HypothesisEngine | HypothesisEngine |
| GrowthEngine | 4 jours | Competency, Decision | DecisionEngine |
| TimelineEngine | 3 jours | CognitiveState | Aucun |

**Total P1**: 16 jours

### 4.3 Priorité P2 (Advanced)

| Composant | Effort Estimé | Dépendances | Blockers |
|-----------|---------------|-------------|----------|
| ExplainabilityEngine | 7 jours | DecisionEngine, HypothesisEngine | DecisionEngine |
| LearningEngine | 10 jours | Tous les moteurs | Tous les moteurs |
| BayesianEngine (standalone) | 3 jours | HypothesisEngine | HypothesisEngine |

**Total P2**: 20 jours

---

## 5. Composants à Remplacer

### 5.1 Remplacements Directs

| Legacy | Nouveau | Stratégie |
|--------|---------|-----------|
| KernelState | CognitiveState | Mapping direct |
| SkillGraph | KnowledgeGraph | Mapping direct |
| InterviewStateMachine | InterviewPhase | Mapping direct |
| CompetencyGraphEngine | KnowledgeGraph + Competency | Mapping direct |

### 5.2 Remplacements avec Refactor

| Legacy | Nouveau | Stratégie |
|--------|---------|-----------|
| EvidenceEngine | EvidenceEngine (nouveau) | Refactor pour contrat Engine |
| IHIIOSKernel | EngineRegistry + CognitivePipeline | Remplacer par pipeline |

---

## 6. Composants à Supprimer (Fin de Migration)

### 6.1 Layer 0 - Kernel

**À supprimer après migration**:
- BayesianEngine.ts (logique intégrée dans HypothesisEngine)
- BiasEngine.ts (logique intégrée dans EvidenceEngine)
- ConfidenceEngine.ts (remplacé par ConfidenceEngine nouveau)
- ContradictionEngine.ts (remplacé par ContradictionEngine nouveau)
- EvidenceEngine.ts (remplacé par EvidenceEngine nouveau)
- HypothesisEngine.ts (remplacé par HypothesisEngine nouveau)
- KernelState.ts (remplacé par CognitiveState)
- MemoryEngine.ts (remplacé par Memory nouveau)
- QuestionPlanner.ts (remplacé par QuestionPlannerEngine)
- SkillGraph.ts (remplacé par KnowledgeGraph)
- TimelineEngine.ts (remplacé par TimelineEngine)

### 6.2 Layers 1-8

**À supprimer après migration**:
- IdentityEngine.ts (remplacé par IdentityEngine nouveau)
- ReasoningEngine.ts (remplacé par ReasoningEngine nouveau)
- CompetenceGraphEngine.ts (remplacé par KnowledgeGraph)
- InterviewStateMachine.ts (remplacé par InterviewPhase)
- DecisionEngine.ts (remplacé par DecisionEngine nouveau)
- DecisionLedger.ts (remplacé par DecisionLog)
- GrowthEngine.ts (remplacé par GrowthEngine nouveau)
- ExplainabilityEngine.ts (remplacé par ExplainabilityEngine nouveau)
- LearningEngine.ts (remplacé par LearningEngine nouveau)

### 6.3 Interfaces

**À supprimer après migration**:
- IHIIOSKernel.ts (remplacé par EngineRegistry + contrats)

**Total à supprimer**: 20 fichiers

---

## 7. Ordre Exact des Migrations

### Phase 1: Infrastructure (3 jours)

**Objectif**: Préparer l'infrastructure de base

1. **Compléter CognitivePipeline** (1 jour)
   - Implémenter toutes les méthodes marquées TODO
   - Intégrer EngineRegistry
   - Tests unitaires

2. **Compléter StructuredLLMProvider** (1 jour)
   - Finaliser l'interface
   - Ajouter support pour OpenAI/Anthropic/Gemini
   - Tests d'intégration

3. **Compléter Memory** (1 jour)
   - Finaliser MemoryEngine
   - Tests unitaires

**Validation**: Pipeline peut exécuter PerceptionEngine et EvidenceEngine

### Phase 2: Core Engines (10 jours)

**Objectif**: Migrer les moteurs cognitifs de base

4. **Refactor EvidenceEngine** (2 jours)
   - Aligner avec contrat Engine
   - Ajouter détection de biais
   - Tests de régression

5. **Implémenter Bayesian Logic** (2 jours)
   - Créer module bayésien indépendant
   - Intégrer dans domaine cognitif
   - Tests mathématiques

6. **Créer HypothesisEngine** (3 jours)
   - Implémenter contrat Engine
   - Intégrer logique bayésienne
   - Tests d'intégration

7. **Créer ConfidenceEngine** (2 jours)
   - Implémenter contrat Engine
   - Utiliser domaine Confidence
   - Tests d'intégration

8. **Créer ContradictionEngine** (1 jour)
   - Implémenter contrat Engine
   - Tests d'intégration

**Validation**: Pipeline peut exécuter Perception → Evidence → Hypothesis → Confidence → Contradiction

### Phase 3: Decision & Planning (10 jours)

**Objectif**: Migrer la prise de décision et planification

9. **Créer QuestionPlannerEngine** (5 jours)
   - Implémenter contrat Engine
   - Intégrer InterviewBudget
   - Tests d'intégration

10. **Créer DecisionEngine** (4 jours)
    - Implémenter contrat Engine
    - Utiliser domaine Decision
    - Tests d'intégration

11. **Créer DecisionLog** (1 jour)
    - Implémenter journal des décisions
    - Tests unitaires

**Validation**: Pipeline complet de perception à décision

### Phase 4: Intelligence (16 jours)

**Objectif**: Migrer les moteurs d'intelligence avancée

12. **Créer IdentityEngine** (4 jours)
    - Implémenter contrat Engine
    - Tests d'intégration

13. **Créer ReasoningEngine** (5 jours)
    - Implémenter contrat Engine
    - Tests d'intégration

14. **Créer GrowthEngine** (4 jours)
    - Implémenter contrat Engine
    - Tests d'intégration

15. **Créer TimelineEngine** (3 jours)
    - Implémenter contrat Engine
    - Tests d'intégration

**Validation**: Pipeline avec intelligence avancée

### Phase 5: Advanced (20 jours)

**Objectif**: Migrer les fonctionnalités avancées

16. **Créer ExplainabilityEngine** (7 jours)
    - Implémenter contrat Engine
    - Tests d'intégration

17. **Créer LearningEngine** (10 jours)
    - Implémenter contrat Engine
    - Tests d'intégration
    - Tests de performance

18. **Créer BayesianEngine standalone** (3 jours)
    - Optionnel pour usage externe
    - Tests unitaires

**Validation**: Pipeline complet avec toutes les fonctionnalités

### Phase 6: Integration & Cleanup (5 jours)

**Objectif**: Intégrer et nettoyer

19. **Intégration E2E** (2 jours)
    - Tests de bout en bout
    - Validation du pipeline complet

20. **Migration des appelants** (2 jours)
    - Mettre à jour tous les appelants de HIIOS
    - Tests de régression

21. **Cleanup Legacy** (1 jour)
    - Marquer legacy comme deprecated
    - Documentation de migration

**Validation**: Système entièrement migré

---

## 8. Risques

### 8.1 Risques Critiques (🔴)

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Perte de logique métier lors de la migration | 🔴 Critique | 🟡 Moyenne | Tests de régression complets |
| Performance dégradée du nouveau pipeline | 🔴 Critique | 🟡 Moyenne | Benchmarks comparatifs |
| Incompatibilité avec les données existantes | 🔴 Critique | 🟡 Faible | Migration de données testée |
| Bugs dans la logique bayésienne | 🔴 Critique | 🟡 Moyenne | Tests mathématiques rigoureux |

### 8.2 Risques Moyens (🟡)

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Dépendances circulaires entre moteurs | 🟡 Moyen | 🟡 Moyenne | Architecture en couches stricte |
| Tests insuffisants pour couvrir tous les cas | 🟡 Moyen | 🟡 Moyenne | Couverture de tests > 80% |
| Difficulté à reproduire les résultats legacy | 🟡 Moyen | 🟡 Faible | Logging détaillé |
| Problèmes d'intégration avec les providers LLM | 🟡 Moyen | 🟡 Moyenne | Abstraction complète |

### 8.3 Risques Faibles (🟢)

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Documentation incomplète | 🟢 Faible | 🟡 Moyenne | Documentation continue |
| Noms de composants incohérents | 🟢 Faible | 🟡 Faible | Convention de naming stricte |
| Dépendances externes obsolètes | 🟢 Faible | 🟡 Faible | Mises à jour régulières |

---

## 9. Dépendances

### 9.1 Dépendances Techniques

| Composant | Dépendances |
|-----------|-------------|
| CognitivePipeline | EngineRegistry, tous les moteurs |
| PerceptionEngine | StructuredLLMProvider |
| EvidenceEngine | PerceptionEngine, StructuredLLMProvider |
| HypothesisEngine | EvidenceEngine, Bayesian logic |
| ConfidenceEngine | HypothesisEngine, Confidence (domain) |
| ContradictionEngine | EvidenceEngine, HypothesisEngine |
| QuestionPlannerEngine | HypothesisEngine, InterviewBudget |
| DecisionEngine | ConfidenceEngine, Decision (domain) |
| IdentityEngine | MemoryEngine |
| ReasoningEngine | HypothesisEngine |
| GrowthEngine | Competency, Decision |
| TimelineEngine | CognitiveState |
| ExplainabilityEngine | DecisionEngine, HypothesisEngine |
| LearningEngine | Tous les moteurs |

### 9.2 Dépendances de Migration

| Phase | Dépendances |
|-------|-------------|
| Phase 1 | Aucune |
| Phase 2 | Phase 1 |
| Phase 3 | Phase 2 |
| Phase 4 | Phase 3 |
| Phase 5 | Phase 4 |
| Phase 6 | Phase 5 |

---

## 10. Critères de Validation par Étape

### Phase 1: Infrastructure

**Critères de validation**:
- [ ] CognitivePipeline exécute PerceptionEngine et EvidenceEngine
- [ ] StructuredLLMProvider supporte au moins un provider (OpenAI)
- [ ] MemoryEngine peut stocker et récupérer des données
- [ ] Tests unitaires passent avec > 80% de couverture
- [ ] Aucune dépendance circulaire

### Phase 2: Core Engines

**Critères de validation**:
- [ ] EvidenceEngine refactor respecte le contrat Engine
- [ ] Bayesian logic produit les mêmes résultats mathématiques
- [ ] HypothesisEngine génère et met à jour des hypothèses correctement
- [ ] ConfidenceEngine calcule la confiance correctement
- [ ] ContradictionEngine détecte les contradictions
- [ ] Pipeline complet fonctionne de bout en bout
- [ ] Tests d'intégration passent
- [ ] Performance équivalente ou meilleure que legacy

### Phase 3: Decision & Planning

**Critères de validation**:
- [ ] QuestionPlannerEngine génère des questions pertinentes
- [ ] DecisionEngine prend des décisions cohérentes
- [ ] DecisionLog enregistre correctement les décisions
- [ ] Pipeline de perception à décision fonctionne
- [ ] Tests E2E passent
- [ ] Aucune régression par rapport à legacy

### Phase 4: Intelligence

**Critères de validation**:
- [ ] IdentityEngine construit une identité cohérente
- [ ] ReasoningEngine effectue un raisonnement logique
- [ ] GrowthEngine analyse la croissance correctement
- [ ] TimelineEngine gère la timeline correctement
- [ ] Pipeline avec intelligence fonctionne
- [ ] Tests d'intégration passent

### Phase 5: Advanced

**Critères de validation**:
- [ ] ExplainabilityEngine fournit des explications cohérentes
- [ ] LearningEngine apprend et s'améliore
- [ ] BayesianEngine standalone fonctionne correctement
- [ ] Pipeline complet fonctionne
- [ ] Tests de performance passent
- [ ] Aucune régression

### Phase 6: Integration & Cleanup

**Critères de validation**:
- [ ] Tests E2E complets passent
- [ ] Tous les appelants sont migrés
- [ ] Legacy marqué comme deprecated
- [ ] Documentation de migration complète
- [ ] Aucun avertissement de build
- [ ] Performance acceptable en production

---

## 11. Estimation de l'Effort par Module

### 11.1 Résumé par Phase

| Phase | Durée | Jours-Homme | Complexité |
|-------|-------|-------------|------------|
| Phase 1: Infrastructure | 3 jours | 3 | 🟡 Moyenne |
| Phase 2: Core Engines | 10 jours | 10 | 🔴 Élevée |
| Phase 3: Decision & Planning | 10 jours | 10 | 🔴 Élevée |
| Phase 4: Intelligence | 16 jours | 16 | 🔴 Élevée |
| Phase 5: Advanced | 20 jours | 20 | 🔴 Très élevée |
| Phase 6: Integration & Cleanup | 5 jours | 5 | 🟡 Moyenne |
| **Total** | **64 jours** | **64** | **🔴 Élevée** |

### 11.2 Estimation par Composant

| Composant | Jours | Complexité | Tests | Documentation |
|-----------|-------|------------|-------|---------------|
| CognitivePipeline | 1 | 🟡 | 0.5 | 0.5 |
| StructuredLLMProvider | 1 | 🟡 | 0.5 | 0.5 |
| Memory | 1 | 🟡 | 0.5 | 0.5 |
| EvidenceEngine refactor | 2 | 🟡 | 1 | 1 |
| Bayesian Logic | 2 | 🔴 | 1 | 1 |
| HypothesisEngine | 3 | 🔴 | 1.5 | 1.5 |
| ConfidenceEngine | 2 | 🟡 | 1 | 1 |
| ContradictionEngine | 1 | 🟡 | 0.5 | 0.5 |
| QuestionPlannerEngine | 5 | 🔴 | 2.5 | 2.5 |
| DecisionEngine | 4 | 🔴 | 2 | 2 |
| DecisionLog | 1 | 🟢 | 0.5 | 0.5 |
| IdentityEngine | 4 | 🔴 | 2 | 2 |
| ReasoningEngine | 5 | 🔴 | 2.5 | 2.5 |
| GrowthEngine | 4 | 🔴 | 2 | 2 |
| TimelineEngine | 3 | 🟡 | 1.5 | 1.5 |
| ExplainabilityEngine | 7 | 🔴 | 3.5 | 3.5 |
| LearningEngine | 10 | 🔴 Très élevée | 5 | 5 |
| BayesianEngine standalone | 3 | 🟡 | 1.5 | 1.5 |
| Integration E2E | 2 | 🟡 | 2 | 0 |
| Migration appelants | 2 | 🟡 | 1 | 1 |
| Cleanup Legacy | 1 | 🟢 | 0 | 1 |

**Total**: 64 jours (incluant tests et documentation)

---

## 12. Blockers Identifiés

### 12.1 Blockers Critiques

| Blocker | Impact | Résolution | Estimation |
|---------|--------|------------|------------|
| Logique bayésienne non implémentée | 🔴 Bloque Phase 2 | Implémenter Bayesian Logic | 2 jours |
| Tests de régression manquants | 🔴 Bloque toutes phases | Créer suite de tests E2E | 5 jours |
| Benchmarks de performance manquants | 🟡 Bloque validation | Créer suite de benchmarks | 3 jours |

### 12.2 Blockers Techniques

| Blocker | Impact | Résolution | Estimation |
|---------|--------|------------|------------|
| StructuredLLMProvider incomplet | 🟡 Bloque Phase 1 | Finaliser l'interface | 1 jour |
| MemoryEngine incomplet | 🟡 Bloque Phase 1 | Finaliser MemoryEngine | 1 jour |
| CognitivePipeline vide | 🟡 Bloque Phase 1 | Implémenter méthodes | 1 jour |

### 12.3 Blockers de Connaissance

| Blocker | Impact | Résolution | Estimation |
|---------|--------|------------|------------|
| Compréhension incomplète de la logique legacy | 🔴 Bloque migration | Documentation détaillée | 3 jours |
| Mapping inconnu entre concepts legacy/nouveaux | 🟡 Bloque migration | Analyse comparative | 2 jours |

---

## 13. Stratégie de Rollback

### 13.1 Points de Rollback

| Phase | Point de Rollback | Critère |
|-------|-------------------|---------|
| Phase 1 | Après Infrastructure | Tests infrastructure passent |
| Phase 2 | Après Core Engines | Pipeline core fonctionne |
| Phase 3 | Après Decision & Planning | Pipeline décision fonctionne |
| Phase 4 | Après Intelligence | Pipeline intelligence fonctionne |
| Phase 5 | Après Advanced | Pipeline complet fonctionne |
| Phase 6 | Après Integration | Système complet migré |

### 13.2 Procédure de Rollback

1. **Identifier la phase échouée**
2. **Restaurer l'état précédent**
3. **Exécuter les tests legacy**
4. **Valider le système fonctionne**
5. **Documenter l'échec**
6. **Analyser la cause racine**
7. **Corriger avant de réessayer**

---

## 14. Recommandations

### 14.1 Recommandations Immédiates

1. **Créer une branche de migration**: `feature/ios-migration`
2. **Implémenter les tests de régression**: Avant toute modification
3. **Documenter la logique legacy**: Compréhension complète
4. **Créer les benchmarks**: Baseline de performance
5. **Implémenter les blockers techniques**: Phase 1

### 14.2 Recommandations de Process

1. **Revue de code obligatoire** pour chaque moteur
2. **Tests d'intégration obligatoires** avant merge
3. **Documentation obligatoire** pour chaque composant
4. **Performance monitoring** continu pendant la migration
5. **Communication régulière** avec l'équipe produit

### 14.3 Recommandations d'Architecture

1. **Maintenir l'architecture Event-Driven**: Runtime → Engines → Events → Reducer → Snapshot
2. **Découpler les providers LLM**: Abstraction complète
3. **Logique métier déterministe**: TypeScript pur
4. **LLM comme coprocesseur**: Extraction uniquement
5. **Tests de régression continus**: CI/CD intégré

---

## 15. Conclusion

### 15.1 Résumé

- **Composants legacy**: 20 fichiers, ~326 KB
- **Composants nouveaux**: 16 entités domaine + 2 moteurs + infrastructure
- **Durée estimée**: 64 jours (12.8 semaines)
- **Complexité**: Élevée
- **Risques**: Critiques mais gérables

### 15.2 Prochaines Étapes

1. **Valider ce plan** avec l'équipe
2. **Créer la branche de migration**
3. **Implémenter les tests de régression**
4. **Commencer Phase 1: Infrastructure**

### 15.3 Critères de Succès

- [ ] Tous les moteurs migrés
- [ ] Tests E2E passent
- [ ] Performance équivalente ou meilleure
- [ ] Aucune régression
- [ ] Legacy peut être supprimé
- [ ] Documentation complète

---

**Document créé le 30 juillet 2026**
**En attente de validation avant toute implémentation**
