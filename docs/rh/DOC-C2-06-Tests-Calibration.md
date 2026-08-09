# DOC-C2-06 : Tests de Calibration

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour le Correctif 2 Detection of Prepared Responses. Ce document structure la méthodologie de calibration du moteur avec 20 réponses préparées simulées, les critères d'évaluation, le protocole d'exécution, et les critères de succès.

---

## 2. Principe Fondateur

Le moteur doit être calibré avant d'être déployé en production. Le protocole de test utilise 20 réponses préparées simulées couvrant les 3 niveaux de détection et les 4 niveaux de classification. L'objectif est de valider que le moteur détecte correctement les réponses préparées, sélectionne les techniques de démasquage appropriées, et ajuste les scores correctement.

---

## 3. Méthodologie de Test

### 3.1 Panel de Réponses Simulées

20 réponses préparées simulées sont créées pour couvrir :

**Par niveau de préparation :**
- Score 0-2 (authentique) : 5 réponses
- Score 3-5 (possiblement préparée) : 5 réponses
- Score 6-8 (probablement préparée) : 5 réponses
- Score 9-11 (intensément préparée) : 5 réponses

**Par niveau de classification :**
- Niveau 1 (authentique confirmée) : 5 réponses
- Niveau 2 (probablement préparée mais fondée) : 5 réponses
- Niveau 3 (préparée sans fond confirmé) : 5 réponses
- Niveau 4 (manifestement non fondée) : 5 réponses

**Par type de réponse :**
- Réponse avec exemple unique : 5 réponses
- Réponse trop fluide : 5 réponses
- Réponse parfaite : 5 réponses
- Réponse avec détails généraux : 5 réponses

### 3.2 Réponses de Démasquage Simulées

Pour chaque réponse préparée initiale, des réponses de démasquage sont simulées :

**Pour Niveau 1 (authentique) :**
- Réponse spontanée aux questions impossibles à préparer
- Détails spécifiques et variés
- Émotion présente
- Capacité à changer de contexte
- Détails précis au zoom
- Réaction calme au silence
- Regret identifié

**Pour Niveau 2 (probablement préparée mais fondée) :**
- Réponse partiellement spontanée
- Quelques détails spécifiques
- Émotion modérément présente
- Capacité limitée à changer de contexte
- Détails partiellement précis au zoom
- Réaction légèrement anxieuse au silence
- Regret générique

**Pour Niveau 3 (préparée sans fond confirmé) :**
- Réponse peu spontanée
- Détails génériques
- Émotion absente
- Incapacité à changer de contexte
- Détails vagues au zoom
- Réaction anxieuse au silence
- Aucun regret identifié

**Pour Niveau 4 (manifestement non fondée) :**
- Réponse non spontanée
- Détails très génériques ou incohérents
- Émotion totalement absente
- Incapacité totale à changer de contexte
- Détails incohérents au zoom
- Réaction très anxieuse au silence
- Aucun regret ou refus de répondre

---

## 4. Critères d'Évaluation

### 4.1 Critère 1 — Précision de Détection de Préparation

**Définition :**
Pourcentage de réponses préparées correctement détectées par le moteur.

**Calcul :**
Précision = (Vrais Positifs + Vrais Négatifs) / Total

**Cible :**
≥ 90%

**Évaluation :**
- Vrai Positif : Réponse préparée détectée comme préparée
- Faux Positif : Réponse non préparée détectée comme préparée
- Vrai Négatif : Réponse non préparée détectée comme non préparée
- Faux Négatif : Réponse préparée détectée comme non préparée

### 4.2 Critère 2 — Précision du Score de Préparation

**Définition :**
Pourcentage de réponses avec le bon score de préparation (0-11).

**Calcul :**
Précision Score = Réponses avec bon score / Total

**Cible :**
≥ 85%

**Évaluation :**
- Score exact : Score calculé = Score attendu
- Score ±1 : Score calculé = Score attendu ± 1
- Score > ±1 : Score calculé diffère de plus de 1

### 4.3 Critère 3 — Pertinence de la Technique de Démasquage

**Définition :**
Pourcentage de techniques de démasquage pertinentes selon le niveau de préparation détecté.

**Calcul :**
Pertinence Technique = Techniques pertinentes / Total

**Cible :**
≥ 80%

**Évaluation :**
- Pertinent : Technique adaptée au niveau de préparation
- Partiellement pertinent : Technique partiellement adaptée
- Non pertinent : Technique non adaptée

### 4.4 Critère 4 — Précision de la Classification

**Définition :**
Pourcentage de réponses avec le bon niveau de classification (1-4).

**Calcul :**
Précision Classification = Réponses avec bon niveau / Total

**Cible :**
≥ 85%

**Évaluation :**
- Niveau exact : Niveau calculé = Niveau attendu
- Niveau adjacent : Niveau calculé = Niveau attendu ± 1
- Niveau distant : Niveau calculé diffère de plus de 1

### 4.5 Critère 5 — Précision de l'Ajustement du Score

**Définition :**
Pourcentage d'ajustements de score corrects selon les règles de scoring.

**Calcul :**
Précision Ajustement = Ajustements corrects / Total

**Cible :**
≥ 85%

**Évaluation :**
- Exact : Ajustement calculé = Ajustement attendu
- Proche : Ajustement calculé = Ajustement attendu ± 5%
- Distant : Ajustement calculé diffère de plus de 5%

---

## 5. Protocole d'Exécution

### 5.1 Phase 1 — Préparation

**Actions :**
- Créer les 20 réponses préparées simulées
- Créer les réponses de démasquage simulées
- Définir les scores de préparation attendus
- Définir les niveaux de classification attendus
- Définir les ajustements de score attendus

**Responsable :**
- Équipe produit
- Équipe technique

### 5.2 Phase 2 — Exécution

**Actions :**
- Exécuter le moteur sur les 20 réponses
- Enregistrer les résultats de détection
- Enregistrer les scores de préparation calculés
- Enregistrer les techniques de démasquage sélectionnées
- Enregistrer les ajustements de score
- Enregistrer les classifications finales

**Responsable :**
- Équipe technique

### 5.3 Phase 3 — Analyse

**Actions :**
- Comparer les résultats aux attendus
- Calculer les métriques d'évaluation
- Identifier les écarts
- Analyser les causes des écarts
- Documenter les apprentissages

**Responsable :**
- Équipe produit
- Équipe technique

### 5.4 Phase 4 — Ajustement

**Actions :**
- Ajuster les seuils de détection si nécessaire
- Ajuster les techniques de démasquage si nécessaire
- Ajuster les règles de scoring si nécessaire
- Réexécuter le test
- Valider les ajustements

**Responsable :**
- Équipe technique
- Équipe produit

### 5.5 Phase 5 — Validation

**Actions :**
- Valider que tous les critères de succès sont atteints
- Documenter les résultats finaux
- Approuver le déploiement en production

**Responsable :**
- DRH
- Équipe produit
- Équipe technique

---

## 6. Critères de Succès

### 6.1 Critères Globaux

**Critère 1 — Précision de Détection de Préparation :**
- Cible : ≥ 90%
- Minimum acceptable : 85%

**Critère 2 — Précision du Score de Préparation :**
- Cible : ≥ 85%
- Minimum acceptable : 80%

**Critère 3 — Pertinence de la Technique de Démasquage :**
- Cible : ≥ 80%
- Minimum acceptable : 75%

**Critère 4 — Précision de la Classification :**
- Cible : ≥ 85%
- Minimum acceptable : 80%

**Critère 5 — Précision de l'Ajustement du Score :**
- Cible : ≥ 85%
- Minimum acceptable : 80%

### 6.2 Critère de Succès Global

**Succès :**
- Tous les critères ≥ cible

**Succès avec réserves :**
- Tous les critères ≥ minimum acceptable
- Au moins 3 critères ≥ cible

**Échec :**
- Au moins 1 critère < minimum acceptable

---

## 7. Rapport de Test

### 7.1 Structure du Rapport

**Résumé Exécutif :**
- Statut du test (Succès / Succès avec réserves / Échec)
- Métriques globales
- Recommandation

**Résultats Détaillés :**
- Résultats par critère d'évaluation
- Résultats par niveau de préparation
- Résultats par niveau de classification
- Résultats par type de réponse

**Analyse des Écarts :**
- Écarts identifiés
- Causes des écarts
- Actions correctives

**Apprentissages :**
- Ce qui fonctionne bien
- Ce qui doit être amélioré
- Recommandations pour l'avenir

### 7.2 Format du Rapport

```typescript
interface TestReport {
  reportId: string;
  testDate: Date;
  
  executiveSummary: {
    status: 'success' | 'success_with_reservations' | 'failure';
    globalMetrics: {
      detectionPrecision: number;
      scorePrecision: number;
      techniqueRelevance: number;
      classificationPrecision: number;
      adjustmentPrecision: number;
    };
    recommendation: string;
  };
  
  detailedResults: {
    byEvaluationCriteria: {
      criterion1: {
        target: number;
        actual: number;
        status: 'pass' | 'fail';
      };
      criterion2: {
        target: number;
        actual: number;
        status: 'pass' | 'fail';
      };
      criterion3: {
        target: number;
        actual: number;
        status: 'pass' | 'fail';
      };
      criterion4: {
        target: number;
        actual: number;
        status: 'pass' | 'fail';
      };
      criterion5: {
        target: number;
        actual: number;
        status: 'pass' | 'fail';
      };
    };
    byPreparationLevel: {
      authentic: {
        tested: number;
        correct: number;
        precision: number;
      };
      possiblyPrepared: {
        tested: number;
        correct: number;
        precision: number;
      };
      probablyPrepared: {
        tested: number;
        correct: number;
        precision: number;
      };
      intensivelyPrepared: {
        tested: number;
        correct: number;
        precision: number;
      };
    };
    byClassificationLevel: {
      level1: {
        tested: number;
        correct: number;
        precision: number;
      };
      level2: {
        tested: number;
        correct: number;
        precision: number;
      };
      level3: {
        tested: number;
        correct: number;
        precision: number;
      };
      level4: {
        tested: number;
        correct: number;
        precision: number;
      };
    };
    byResponseType: {
      uniqueExample: {
        tested: number;
        correct: number;
        precision: number;
      };
      tooFluent: {
        tested: number;
        correct: number;
        precision: number;
      };
      perfect: {
        tested: number;
        correct: number;
        precision: number;
      };
      genericDetails: {
        tested: number;
        correct: number;
        precision: number;
      };
    };
  };
  
  gapAnalysis: {
    gaps: {
      gapId: string;
      criterion: string;
      expected: any;
      actual: any;
      difference: any;
      cause: string;
      correctiveAction: string;
    }[];
  };
  
  learnings: {
    whatWorks: string[];
    whatNeedsImprovement: string[];
    recommendations: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
  };
}
```

---

## 8. Itérations

### 8.1 Nombre Maximum d'Itérations

**Maximum :**
- 3 itérations

**Raison :**
- Au-delà de 3 itérations, les ajustements deviennent trop spécifiques aux données de test
- Risque de sur-ajustement (overfitting)

### 8.2 Critère d'Arrêt

**Arrêt si :**
- Tous les critères ≥ cible
- OU 3 itérations complétées

### 8.3 Documentation des Itérations

Chaque itération est documentée avec :
- Ajustements effectués
- Résultats avant/après
- Analyse de l'impact

---

## 9. Structure de Données (TypeScript)

```typescript
interface TestResponse {
  responseId: string;
  
  initialResponse: string;
  
  expected: {
    preparationScore: number;
    preparationLevel: string;
    classificationLevel: number;
    unmaskingTechniques: number[];
    adjustment: number;
  };
  
  actual: {
    preparationScore: number;
    preparationLevel: string;
    classificationLevel: number;
    unmaskingTechniques: number[];
    adjustment: number;
  };
  
  evaluation: {
    detectionCorrect: boolean;
    scoreCorrect: boolean;
    techniqueRelevant: boolean;
    classificationCorrect: boolean;
    adjustmentCorrect: boolean;
  };
  
  unmaskingResponses: {
    technique1: string[];
    technique2: string[];
    technique3: string[];
    technique4: string[];
    technique5: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
  };
}

interface TestProtocol {
  protocolId: string;
  
  simulatedResponses: TestResponse[];
  
  evaluationCriteria: {
    criterion1: {
      name: string;
      target: number;
      minimumAcceptable: number;
      calculation: string;
    };
    criterion2: {
      name: string;
      target: number;
      minimumAcceptable: number;
      calculation: string;
    };
    criterion3: {
      name: string;
      target: number;
      minimumAcceptable: number;
      calculation: string;
    };
    criterion4: {
      name: string;
      target: number;
      minimumAcceptable: number;
      calculation: string;
    };
    criterion5: {
      name: string;
      target: number;
      minimumAcceptable: number;
      calculation: string;
    };
  };
  
  executionProtocol: {
    phase1: {
      name: string;
      actions: string[];
      responsible: string[];
    };
    phase2: {
      name: string;
      actions: string[];
      responsible: string[];
    };
    phase3: {
      name: string;
      actions: string[];
      responsible: string[];
    };
    phase4: {
      name: string;
      actions: string[];
      responsible: string[];
    };
    phase5: {
      name: string;
      actions: string[];
      responsible: string[];
    };
  };
  
  successCriteria: {
    global: {
      allTargetsMet: boolean;
      allMinimumsMet: boolean;
      atLeast3TargetsMet: boolean;
    };
    status: 'success' | 'success_with_reservations' | 'failure';
  };
  
  iterations: {
    maxIterations: number;
    currentIteration: number;
    stopCriteria: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 10. Stockage et Gestion

### 10.1 Schéma SQL

```sql
CREATE TABLE test_response (
  id VARCHAR(36) PRIMARY KEY,
  
  initial_response TEXT NOT NULL,
  
  expected_preparation_score INT NOT NULL,
  expected_preparation_level VARCHAR(30) NOT NULL,
  expected_classification_level INT NOT NULL,
  expected_unmasking_techniques INT NOT NULL,
  expected_adjustment DECIMAL(5,2) NOT NULL,
  
  actual_preparation_score INT NOT NULL,
  actual_preparation_level VARCHAR(30) NOT NULL,
  actual_classification_level INT NOT NULL,
  actual_unmasking_techniques INT NOT NULL,
  actual_adjustment DECIMAL(5,2) NOT NULL,
  
  evaluation JSON NOT NULL,
  unmasking_responses JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE test_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  simulated_responses JSON NOT NULL,
  evaluation_criteria JSON NOT NULL,
  execution_protocol JSON NOT NULL,
  success_criteria JSON NOT NULL,
  iterations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 11. API Endpoints

```typescript
// POST /api/prepared-response/test/execute
async function executeTest(protocolId: string): Promise<TestReport> {
  return await executeTest(protocolId);
}

// GET /api/prepared-response/test/report/:reportId
async function getTestReport(reportId: string): Promise<TestReport> {
  return await getTestReportById(reportId);
}

// GET /api/prepared-response/test/responses
async function getTestResponses(): Promise<TestResponse[]> {
  return await getTestResponses();
}

// POST /api/prepared-response/test/responses
async function createTestResponse(response: TestResponse): Promise<TestResponse> {
  return await createTestResponse(response);
}

// PUT /api/prepared-response/test/responses/:responseId
async function updateTestResponse(responseId: string, response: TestResponse): Promise<TestResponse> {
  return await updateTestResponse(responseId, response);
}

// GET /api/prepared-response/test/protocol
async function getTestProtocol(): Promise<TestProtocol> {
  return await getTestProtocol();
}

// PUT /api/prepared-response/test/protocol
async function updateTestProtocol(protocol: TestProtocol): Promise<TestProtocol> {
  return await updateTestProtocol(protocol);
}

// POST /api/prepared-response/test/iterate
async function iterateTest(protocolId: string, adjustments: any): Promise<TestReport> {
  return await iterateTest(protocolId, adjustments);
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de Test

| Métrique | Description | Cible |
|----------|-------------|-------|
| Précision de détection | Vrais / Total | ≥ 90% |
- Précision du score de préparation | Scores corrects / Total | ≥ 85% |
- Pertinence de la technique | Techniques pertinentes / Total | ≥ 80% |
- Précision de la classification | Niveaux corrects / Total | ≥ 85% |
- Précision de l'ajustement | Ajustements corrects / Total | ≥ 85% |

### 12.2 Métriques d'Itération

| Métrique | Description | Cible |
|----------|-------------|-------|
- Nombre d'itérations | Itérations effectuées | ≤ 3 |
- Amélioration par itération | Gain de précision / itération | ≥ 5% |
- Temps par itération | Durée moyenne d'une itération | ≤ 2 jours |

---

## 13. Conclusion

Le protocole de test structure la calibration du moteur Detection of Prepared Responses avec 20 réponses préparées simulées. Les 5 critères d'évaluation mesurent la précision de détection de préparation, la précision du score de préparation, la pertinence de la technique de démasquage, la précision de la classification, et la précision de l'ajustement. Le protocole d'exécution comprend 5 phases (préparation, exécution, analyse, ajustement, validation). Les critères de succès définissent les seuils pour chaque métrique. Le rapport de test documente les résultats, les écarts, et les apprentissages. Maximum 3 itérations sont autorisées pour atteindre les critères de succès.

**Points clés :**
- 20 réponses préparées simulées
- Couverture des 4 niveaux de préparation (0-2, 3-5, 6-8, 9-11)
- Couverture des 4 niveaux de classification (1-4)
- Couverture des 4 types de réponse
- 5 critères d'évaluation avec cibles (80% à 90%)
- Protocole d'exécution en 5 phases
- Critères de succès globaux
- Rapport de test structuré
- Maximum 3 itérations
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour le test
- Métriques de test et d'itération
