# DOC-C1-05 : Protocole de Test

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour le Correctif 1 Deep Drilling Engine. Ce document structure la méthodologie de calibration du moteur avec 30 réponses vagues simulées, les critères d'évaluation, le protocole d'exécution, et les critères de succès.

---

## 2. Principe Fondateur

Le moteur doit être calibré avant d'être déployé en production. Le protocole de test utilise 30 réponses vagues simulées couvrant les 8 critères de vague et les 3 niveaux de creusage. L'objectif est de valider que le moteur détecte correctement les réponses vagues, sélectionne les questions de creusage appropriées, et ajuste les scores correctement.

---

## 3. Méthodologie de Test

### 3.1 Panel de Réponses Simulées

30 réponses vagues simulées sont créées pour couvrir :

**Par critère de vague :**
- Critère 1 (absence de chiffres) : 4 réponses
- Critère 2 (vocabulaire générique) : 4 réponses
- Critère 3 (absence d'exemple) : 4 réponses
- Critère 4 (dilution de responsabilité) : 4 réponses
- Critère 5 (réponse trop courte) : 4 réponses
- Critère 6 (absence de temporalité) : 4 réponses
- Critère 7 (absence de contexte) : 3 réponses
- Critère 8 (conclusion sans cause) : 3 réponses

**Par niveau de vague :**
- Niveau léger (3-4 critères) : 10 réponses
- Niveau modéré (5-6 critères) : 10 réponses
- Niveau critique (7-8 critères) : 10 réponses

**Par cas de réponse vague :**
- Cas 1 (expérience non maîtrisée) : 8 réponses
- Cas 2 (réponse préparée) : 7 réponses
- Cas 3 (mauvaise communication) : 8 réponses
- Cas 4 (manque de confiance) : 7 réponses

### 3.2 Réponses de Creusage Simulées

Pour chaque réponse vague initiale, des réponses de creusage sont simulées :

**Pour Niveau 1 :**
- Réponse 1 : Riche + Cohérente + Ouverte
- Réponse 2 : Standard + Cohérente + Ouverte
- Réponse 3 : Pauvre + Cohérente + Ouverte

**Pour Niveau 2 :**
- Réponse 1 : Riche + Cohérente + Ouverte
- Réponse 2 : Standard + Incohérente + Ouverte
- Réponse 3 : Pauvre + Cohérente + Défensive

**Pour Niveau 3 :**
- Réponse 1 : Standard + Incohérente + Défensive
- Réponse 2 : Pauvre + Incohérente + Évasive
- Réponse 3 : Pauvre + Incohérente + Défensive

---

## 4. Critères d'Évaluation

### 4.1 Critère 1 — Précision de Détection

**Définition :**
Pourcentage de réponses vagues correctement détectées par le moteur.

**Calcul :**
Précision = (Vrais Positifs + Vrais Négatifs) / Total

**Cible :**
≥ 90%

**Évaluation :**
- Vrai Positif : Réponse vague détectée comme vague
- Faux Positif : Réponse non vague détectée comme vague
- Vrai Négatif : Réponse non vague détectée comme non vague
- Faux Négatif : Réponse vague détectée comme non vague

### 4.2 Critère 2 — Précision du Score de Vague

**Définition :**
Pourcentage de réponses avec le bon score de vague (0-8).

**Calcul :**
Précision Score = Réponses avec bon score / Total

**Cible :**
≥ 85%

**Évaluation :**
- Score exact : Score calculé = Score attendu
- Score ±1 : Score calculé = Score attendu ± 1
- Score > ±1 : Score calculé diffère de plus de 1

### 4.3 Critère 3 — Pertinence du Niveau de Creusage

**Définition :**
Pourcentage de réponses avec le bon niveau de creusage (1, 2, 3).

**Calcul :**
Pertinence Niveau = Réponses avec bon niveau / Total

**Cible :**
≥ 85%

**Évaluation :**
- Niveau exact : Niveau calculé = Niveau attendu
- Niveau adjacent : Niveau calculé = Niveau attendu ± 1
- Niveau distant : Niveau calculé diffère de plus de 1

### 4.4 Critère 4 — Pertinence de la Question de Creusage

**Définition :**
Pourcentage de questions de creusage pertinentes selon le critère de vague détecté.

**Calcul :**
Pertinence Question = Questions pertinentes / Total

**Cible :**
≥ 80%

**Évaluation :**
- Pertinent : Question cible le critère de vague détecté
- Partiellement pertinent : Question cible partiellement le critère
- Non pertinent : Question ne cible pas le critère

### 4.5 Critère 5 — Précision de l'Ajustement du Score

**Définition :**
Pourcentage d'ajustements de score corrects selon la grille d'interprétation.

**Calcul :**
Précision Ajustement = Ajustements corrects / Total

**Cible :**
≥ 85%

**Évaluation :**
- Exact : Ajustement calculé = Ajustement attendu
- Proche : Ajustement calculé = Ajustement attendu ± 5%
- Distant : Ajustement calculé diffère de plus de 5%

### 4.6 Critère 6 — Identification du Cas de Vague

**Définition :**
Pourcentage de cas de vague correctement identifiés (1-4).

**Calcul :**
Identification Cas = Cas corrects / Total

**Cible :**
≥ 75%

**Évaluation :**
- Exact : Cas identifié = Cas attendu
- Proche : Cas identifié = Cas attendu ± 1
- Distant : Cas identifié diffère de plus de 1

---

## 5. Protocole d'Exécution

### 5.1 Phase 1 — Préparation

**Actions :**
- Créer les 30 réponses vagues simulées
- Créer les réponses de creusage simulées
- Définir les scores de vague attendus
- Définir les niveaux de creusage attendus
- Définir les ajustements de score attendus
- Définir les cas de vague attendus

**Responsable :**
- Équipe produit
- Équipe technique

### 5.2 Phase 2 — Exécution

**Actions :**
- Exécuter le moteur sur les 30 réponses
- Enregistrer les résultats de détection
- Enregistrer les scores de vague calculés
- Enregistrer les niveaux de creusage
- Enregistrer les questions de creusage sélectionnées
- Enregistrer les ajustements de score
- Enregistrer les cas de vague identifiés

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
- Ajuster les questions de creusage si nécessaire
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

**Critère 1 — Précision de Détection :**
- Cible : ≥ 90%
- Minimum acceptable : 85%

**Critère 2 — Précision du Score de Vague :**
- Cible : ≥ 85%
- Minimum acceptable : 80%

**Critère 3 — Pertinence du Niveau de Creusage :**
- Cible : ≥ 85%
- Minimum acceptable : 80%

**Critère 4 — Pertinence de la Question de Creusage :**
- Cible : ≥ 80%
- Minimum acceptable : 75%

**Critère 5 — Précision de l'Ajustement du Score :**
- Cible : ≥ 85%
- Minimum acceptable : 80%

**Critère 6 — Identification du Cas de Vague :**
- Cible : ≥ 75%
- Minimum acceptable : 70%

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
- Résultats par critère de vague
- Résultats par niveau de vague
- Résultats par cas de vague

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
      levelRelevance: number;
      questionRelevance: number;
      adjustmentPrecision: number;
      caseIdentification: number;
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
      criterion6: {
        target: number;
        actual: number;
        status: 'pass' | 'fail';
      };
    };
    byVaguenessCriteria: {
      criterion1: {
        tested: number;
        correct: number;
        precision: number;
      };
      criterion2: {
        tested: number;
        correct: number;
        precision: number;
      };
      // ... etc pour les 8 critères
    };
    byVaguenessLevel: {
      light: {
        tested: number;
        correct: number;
        precision: number;
      };
      moderate: {
        tested: number;
        correct: number;
        precision: number;
      };
      critical: {
        tested: number;
        correct: number;
        precision: number;
      };
    };
    byVaguenessCase: {
      case1: {
        tested: number;
        correct: number;
        precision: number;
      };
      case2: {
        tested: number;
        correct: number;
        precision: number;
      };
      case3: {
        tested: number;
        correct: number;
        precision: number;
      };
      case4: {
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
    lastUpdated: Date;
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
    vaguenessScore: number;
    vaguenessLevel: number;
    drillingLevel: number;
    drillingQuestions: string[];
    adjustment: number;
    vaguenessCase: number;
  };
  
  actual: {
    vaguenessScore: number;
    vaguenessLevel: number;
    drillingLevel: number;
    drillingQuestions: string[];
    adjustment: number;
    vaguenessCase: number;
  };
  
  evaluation: {
    detectionCorrect: boolean;
    scoreCorrect: boolean;
    levelCorrect: boolean;
    questionRelevant: boolean;
    adjustmentCorrect: boolean;
    caseCorrect: boolean;
  };
  
  drillingResponses: {
    level1: string[];
    level2: string[];
    level3: string[];
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
    criterion6: {
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
  
  expected_vagueness_score INT NOT NULL,
  expected_vagueness_level INT NOT NULL,
  expected_drilling_level INT NOT NULL,
  expected_drilling_questions JSON NOT NULL,
  expected_adjustment DECIMAL(5,2) NOT NULL,
  expected_vagueness_case INT NOT NULL,
  
  actual_vagueness_score INT NOT NULL,
  actual_vagueness_level INT NOT NULL,
  actual_drilling_level INT NOT NULL,
  actual_drilling_questions JSON NOT NULL,
  actual_adjustment DECIMAL(5,2) NOT NULL,
  actual_vagueness_case INT NOT NULL,
  
  evaluation JSON NOT NULL,
  drilling_responses JSON NOT NULL,
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
// POST /api/deep-drilling/test/execute
async function executeTest(protocolId: string): Promise<TestReport> {
  return await executeTest(protocolId);
}

// GET /api/deep-drilling/test/report/:reportId
async function getTestReport(reportId: string): Promise<TestReport> {
  return await getTestReportById(reportId);
}

// GET /api/deep-drilling/test/responses
async function getTestResponses(): Promise<TestResponse[]> {
  return await getTestResponses();
}

// POST /api/deep-drilling/test/responses
async function createTestResponse(response: TestResponse): Promise<TestResponse> {
  return await createTestResponse(response);
}

// PUT /api/deep-drilling/test/responses/:responseId
async function updateTestResponse(responseId: string, response: TestResponse): Promise<TestResponse> {
  return await updateTestResponse(responseId, response);
}

// GET /api/deep-drilling/test/protocol
async function getTestProtocol(): Promise<TestProtocol> {
  return await getTestProtocol();
}

// PUT /api/deep-drilling/test/protocol
async function updateTestProtocol(protocol: TestProtocol): Promise<TestProtocol> {
  return await updateTestProtocol(protocol);
}

// POST /api/deep-drilling/test/iterate
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
- Précision du score de vague | Scores corrects / Total | ≥ 85% |
- Pertinence du niveau de creusage | Niveaux corrects / Total | ≥ 85% |
- Pertinence de la question | Questions pertinentes / Total | ≥ 80% |
- Précision de l'ajustement | Ajustements corrects / Total | ≥ 85% |
- Identification du cas | Cas corrects / Total | ≥ 75% |

### 12.2 Métriques d'Itération

| Métrique | Description | Cible |
|----------|-------------|-------|
- Nombre d'itérations | Itérations effectuées | ≤ 3 |
- Amélioration par itération | Gain de précision / itération | ≥ 5% |
- Temps par itération | Durée moyenne d'une itération | ≤ 2 jours |

---

## 13. Conclusion

Le protocole de test structure la calibration du moteur Deep Drilling Engine avec 30 réponses vagues simulées. Les 6 critères d'évaluation mesurent la précision de détection, la précision du score de vague, la pertinence du niveau de creusage, la pertinence de la question de creusage, la précision de l'ajustement du score, et l'identification du cas de vague. Le protocole d'exécution comprend 5 phases (préparation, exécution, analyse, ajustement, validation). Les critères de succès définissent les seuils pour chaque métrique. Le rapport de test documente les résultats, les écarts, et les apprentissages. Maximum 3 itérations sont autorisées pour atteindre les critères de succès.

**Points clés :**
- 30 réponses vagues simulées
- Couverture des 8 critères de vague
- Couverture des 3 niveaux de vague
- Couverture des 4 cas de vague
- 6 critères d'évaluation avec cibles (75% à 90%)
- Protocole d'exécution en 5 phases
- Critères de succès globaux
- Rapport de test structuré
- Maximum 3 itérations
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour le test
- Métriques de test et d'itération
