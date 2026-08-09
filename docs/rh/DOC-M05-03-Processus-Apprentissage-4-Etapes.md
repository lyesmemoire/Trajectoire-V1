# DOC-M05-03 : Processus d'Apprentissage en 4 Étapes

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le processus d'apprentissage par les résultats pour le MVP-META-05 Feedback Intelligence Engine. Ce document structure le processus en 4 étapes pour identifier les écarts entre prédiction et réalité, et modifier les règles du moteur.

---

## 2. Principe Fondateur

Le moteur doit apprendre de ses erreurs. Pour chaque écart entre prédiction et réalité à 12 mois, un processus d'apprentissage en 4 étapes permet d'identifier la cause, modifier la règle, tester la modification, et déployer si amélioration confirmée.

---

## 3. Les 4 Étapes du Processus d'Apprentissage

### 3.1 ÉTAPE 1 — Identification de l'Écart

**Objectif :**
Identifier et documenter l'écart entre la prédiction du moteur et la réalité observée.

**Format :**
```
Le moteur avait prédit [X].
La réalité est [Y].
Écart : [mesure].
```

**Exemple :**
```
Le moteur avait prédit : Score de maturité 4/5.
La réalité est : Score de maturité 2/5.
Écart : -2 points (50% d'erreur).
```

**Données collectées :**
- Prédiction du moteur (rappel automatique)
- Réalité observée (questionnaire J+365)
- Mesure de l'écart (calcul automatique)
- Amplitude de l'erreur (en points ou pourcentage)

---

### 3.2 ÉTAPE 2 — Recherche de la Cause

**Objectif :**
Identifier la cause de la prédiction incorrecte.

**Questions analysées :**
- Quelle règle a produit cette prédiction incorrecte ?
- Quelle donnée a été mal interprétée ?
- Quel signal a été manqué ?
- Quel signal a été surpondéré ?

**Processus :**
1. Analyse de la trace de décision du moteur
2. Identification des règles appliquées
3. Comparaison des données utilisées vs réalité
4. Identification des signaux manqués ou surpondérés

**Exemple :**
```
Règle : Score de maturité basé sur l'expérience professionnelle.
Donnée mal interprétée : Le candidat avait 5 ans d'expérience mais dans un contexte junior.
Signal manqué : Le candidat n'avait jamais géré d'équipe.
Signal surpondéré : Le candidat avait un titre senior sans responsabilités réelles.
```

---

### 3.3 ÉTAPE 3 — Modification de la Règle

**Objectif :**
Proposer et valider une modification de la règle.

**Processus :**
1. Proposition de modification (générée par le moteur)
2. Validation par DRH humain
3. Mise à jour du Knowledge Pack
4. Traçabilité de la modification

**Format de proposition :**
```
Règle actuelle : [description]
Problème identifié : [description]
Proposition de modification : [description]
Impact attendu : [description]
```

**Validation par DRH humain :**
- Approuvé
- Rejeté avec raison
- Modification demandée

**Traçabilité :**
- Date de la modification
- Auteur de la modification (moteur + DRH)
- Raison de la modification
- Version précédente de la règle
- Version nouvelle de la règle

---

### 3.4 ÉTAPE 4 — Test de la Modification

**Objectif :**
Tester la modification sur les cas similaires avant déploiement.

**Processus :**
1. Identification des 20 derniers cas similaires
2. Application de la modification sur ces cas
3. Comparaison des résultats avec et sans modification
4. Amélioration confirmée : déploiement
5. Pas d'amélioration : révision

**Critères de succès :**
- Amélioration de la précision ≥ 5%
- Pas de dégradation sur d'autres dimensions
- Stabilité des résultats sur les cas test

**Décision :**
- Déploiement : La modification est déployée en production
- Révision : La modification est révisée et testée à nouveau
- Abandon : La modification est abandonnée

---

## 4. Structure de Données (TypeScript)

```typescript
interface GapIdentification {
  gapId: string;
  candidateId: string;
  recruitmentId: string;
  
  enginePrediction: string;
  observedReality: string;
  gapMeasure: number;
  gapAmplitude: string;
  
  predictionDate: Date;
  realityDate: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface CauseAnalysis {
  analysisId: string;
  gapId: string;
  
  ruleProducedPrediction: string;
  misinterpretedData: string[];
  missedSignals: string[];
  overweightedSignals: string[];
  
  decisionTrace: string;
  
  analyzedAt: Date;
  analyzedBy: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface RuleModification {
  modificationId: string;
  analysisId: string;
  
  currentRule: string;
  identifiedProblem: string;
  proposedModification: string;
  expectedImpact: string;
  
  validationStatus: 'pending' | 'approved' | 'rejected' | 'revisionRequested';
  validatedBy?: string;
  validatedAt?: Date;
  rejectionReason?: string;
  
  knowledgePackUpdate: {
    previousVersion: string;
    newVersion: string;
    updateDate: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ModificationTest {
  testId: string;
  modificationId: string;
  
  similarCases: {
    caseId: string;
    candidateId: string;
    recruitmentId: string;
  }[];
  
  testResults: {
    withModification: {
      accuracy: number;
      correctPredictions: number;
      totalCases: number;
    };
    withoutModification: {
      accuracy: number;
      correctPredictions: number;
      totalCases: number;
    };
    improvement: number;
  };
  
  testStatus: 'pending' | 'completed' | 'deployed' | 'revised' | 'abandoned';
  decision: string;
  decisionReason: string;
  
  testedAt: Date;
  testedBy: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface LearningProcess {
  processId: string;
  candidateId: string;
  recruitmentId: string;
  
  gapIdentification: GapIdentification;
  causeAnalysis: CauseAnalysis;
  ruleModification: RuleModification;
  modificationTest: ModificationTest;
  
  overallStatus: 'pending' | 'inProgress' | 'completed' | 'abandoned';
  
  startedAt: Date;
  completedAt?: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE gap_identification (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  engine_prediction TEXT NOT NULL,
  observed_reality TEXT NOT NULL,
  gap_measure DECIMAL(5,2) NOT NULL,
  gap_amplitude VARCHAR(50) NOT NULL,
  
  prediction_date TIMESTAMP NOT NULL,
  reality_date TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_gap_identification_candidate ON gap_identification(candidate_id);
CREATE INDEX idx_gap_identification_recruitment ON gap_identification(recruitment_id);

CREATE TABLE cause_analysis (
  id VARCHAR(36) PRIMARY KEY,
  gap_id VARCHAR(36) NOT NULL,
  
  rule_produced_prediction TEXT NOT NULL,
  misinterpreted_data JSON NOT NULL,
  missed_signals JSON NOT NULL,
  overweighted_signals JSON NOT NULL,
  
  decision_trace TEXT NOT NULL,
  
  analyzed_at TIMESTAMP NOT NULL,
  analyzed_by VARCHAR(100) NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_cause_analysis_gap ON cause_analysis(gap_id);

CREATE TABLE rule_modification (
  id VARCHAR(36) PRIMARY KEY,
  analysis_id VARCHAR(36) NOT NULL,
  
  current_rule TEXT NOT NULL,
  identified_problem TEXT NOT NULL,
  proposed_modification TEXT NOT NULL,
  expected_impact TEXT NOT NULL,
  
  validation_status VARCHAR(30) NOT NULL,
  validated_by VARCHAR(100),
  validated_at TIMESTAMP,
  rejection_reason TEXT,
  
  knowledge_pack_update JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_rule_modification_analysis ON rule_modification(analysis_id);

CREATE TABLE modification_test (
  id VARCHAR(36) PRIMARY KEY,
  modification_id VARCHAR(36) NOT NULL,
  
  similar_cases JSON NOT NULL,
  test_results JSON NOT NULL,
  
  test_status VARCHAR(30) NOT NULL,
  decision TEXT NOT NULL,
  decision_reason TEXT NOT NULL,
  
  tested_at TIMESTAMP NOT NULL,
  tested_by VARCHAR(100) NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_modification_test_modification ON modification_test(modification_id);

CREATE TABLE learning_process (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  gap_identification_id VARCHAR(36) NOT NULL,
  cause_analysis_id VARCHAR(36) NOT NULL,
  rule_modification_id VARCHAR(36) NOT NULL,
  modification_test_id VARCHAR(36) NOT NULL,
  
  overall_status VARCHAR(30) NOT NULL,
  
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_process_candidate ON learning_process(candidate_id);
CREATE INDEX idx_learning_process_recruitment ON learning_process(recruitment_id);
```

---

## 6. API Endpoints

```typescript
// POST /api/learning-process/identify-gap
async function identifyGap(candidateId: string, recruitmentId: string): Promise<GapIdentification> {
  return await identifyGap(candidateId, recruitmentId);
}

// POST /api/learning-process/analyze-cause
async function analyzeCause(gapId: string): Promise<CauseAnalysis> {
  return await analyzeCause(gapId);
}

// POST /api/learning-process/propose-modification
async function proposeModification(analysisId: string): Promise<RuleModification> {
  return await proposeModification(analysisId);
}

// PUT /api/learning-process/validate-modification/:modificationId
async function validateModification(modificationId: string, status: 'approved' | 'rejected' | 'revisionRequested', reason?: string): Promise<RuleModification> {
  return await validateModification(modificationId, status, reason);
}

// POST /api/learning-process/test-modification
async function testModification(modificationId: string): Promise<ModificationTest> {
  return await testModification(modificationId);
}

// PUT /api/learning-process/deploy-modification/:testId
async function deployModification(testId: string, decision: string, reason: string): Promise<ModificationTest> {
  return await deployModification(testId, decision, reason);
}

// GET /api/learning-process/:candidateId/:recruitmentId
async function getLearningProcess(candidateId: string, recruitmentId: string): Promise<LearningProcess> {
  return await getLearningProcess(candidateId, recruitmentId);
}

// GET /api/learning-process/gaps
async function getAllGaps(): Promise<GapIdentification[]> {
  return await getAllGaps();
}

// GET /api/learning-process/modifications
async function getAllModifications(): Promise<RuleModification[]> {
  return await getAllModifications();
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'identification | Écarts identifiés / écarts totaux | 100% |
- Taux d'analyse | Causes analysées / écarts identifiés | 100% |
- Taux de validation | Modifications validées / proposées | ≥ 80% |
- Taux de déploiement | Modifications déployées / validées | ≥ 70% |

### 7.2 Métriques d'Apprentissage

| Métrique | Description | Cible |
|----------|-------------|-------|
- Amélioration de précision | Delta de précision après modification | ≥ 5% |
- Taux de succès des tests | Tests réussis / totaux | ≥ 70% |
- Temps de cycle moyen | Temps moyen du processus d'apprentissage | < 30 jours |

---

## 8. Conclusion

Le processus d'apprentissage en 4 étapes structure l'apprentissage par les résultats. ÉTAPE 1 : Identification de l'écart (prédiction vs réalité, mesure de l'écart). ÉTAPE 2 : Recherche de la cause (règle produisant la prédiction, donnée mal interprétée, signal manqué, signal surpondéré). ÉTAPE 3 : Modification de la règle (proposition, validation par DRH humain, mise à jour du Knowledge Pack, traçabilité). ÉTAPE 4 : Test de la modification (test sur 20 cas similaires, comparaison des résultats, déploiement si amélioration confirmée). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 étapes du processus d'apprentissage
- ÉTAPE 1 : Identification de l'écart
- ÉTAPE 2 : Recherche de la cause
- ÉTAPE 3 : Modification de la règle
- ÉTAPE 4 : Test de la modification
- Validation par DRH humain
- Traçabilité des modifications
- Test sur cas similaires
- Déploiement conditionnel
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'apprentissage
