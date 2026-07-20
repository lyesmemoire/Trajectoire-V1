# ANALYSE COMPARATIVE - DecisionEngine

**Date** : 18 juillet 2026
**Fichiers comparés** :
- A : `apps/web/src/application/adaptive-intelligence/DecisionEngine.ts`
- B : `apps/web/src/hiios/engines/DecisionEngine.ts`

---

## CONCLUSION

**CE NE SONT PAS DES DOUBLONS**

Les deux moteurs ont des objectifs complètement différents :

- **Version A** : Moteur de décision pour l'orchestration d'engines IA (adaptation UX)
- **Version B** : Moteur de décision pour les entretiens de recrutement (évaluation candidat)

---

## COMPARAISON DÉTAILLÉE

### Version A - application/adaptive-intelligence/DecisionEngine.ts

**Objectif** : Orchestrateur d'engines IA pour adapter l'expérience utilisateur

**Taille** : 630 lignes

**Fonctionnalités** :
- Singleton pattern
- 12 règles de décision basées sur le contexte utilisateur
- Actions : intervene, guide, recommend, analyze, evaluate, adapt, train
- Focalisé sur l'état utilisateur (stress, confidence, engagement)
- Gestion de priorités d'actions
- Filtrage par valeur et risque
- Limitation d'actions concurrentes

**Cas d'usage** :
- Intervention en cas de stress élevé
- Building de confiance
- Re-engagement
- Support de goals
- Analyse de performance
- Recommandations d'apprentissage

**Dépendances** :
- IAdaptiveIntelligenceOrchestrator interfaces
- ContextAnalyzer
- UserContext, ContextAnalysis

---

### Version B - hiios/engines/DecisionEngine.ts

**Objectif** : Synthèse des preuves pour recommandation de recrutement

**Taille** : 669 lignes

**Fonctionnalités** :
- Implémente IDecisionEngine interface
- Évaluation par compétence (SkillAssessment)
- Calcul de recommandation (STRONG_YES, YES, YES_WITH_RESERVES, NEUTRAL, NO, HARD_NO, INSUFFICIENT_DATA)
- Validation épistémique (Constitution HIIOS)
- Traçabilité complète (audit trail)
- Détection de biais
- Explication des décisions
- Scénarios what-if

**Cas d'usage** :
- Décision de recrutement basée sur les preuves
- Évaluation de compétences critiques
- Vérification de critères éliminatoires
- Génération de rationale
- Recommandation d'étapes suivantes

**Dépendances** :
- Kernel interfaces (IDecisionEngine, SessionState, Decision)
- CoverageEngine
- MetaReasoningEngine
- Constitution HIIOS (FR-006)
- Terminology HIIOS

---

## DÉCISION

**Action** : AUCUNE - Garder les deux versions

**Raison** :
- Les deux moteurs ont des objectifs différents
- Version A : Orchestration UX (Adaptive Intelligence)
- Version B : Décision de recrutement (HIIOS Core)
- Aucun overlap fonctionnel significatif

**Statut** : ✅ VALIDÉ - Pas de doublon

---

## RECOMMANDATIONS

1. **Renommer pour clarté** (optionnel) :
   - Version A → `UXDecisionEngine` ou `AdaptiveDecisionEngine`
   - Version B → `RecruitmentDecisionEngine` (déjà clair via emplacement hiios/)

2. **Documentation** :
   - Ajouter des JSDoc clarifiant le cas d'usage de chaque moteur
   - Documenter les différences dans le README HIIOS

3. **Imports** :
   - Vérifier que les imports sont corrects et pointent vers la bonne version
