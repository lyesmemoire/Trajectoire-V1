# DOC-M01-06 : Protocole de Test (20 Entretiens Simulés pour Valider l'Auto-Évaluation)

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour valider l'auto-évaluation du MVP-META-01 Méta-Cognition Engine. Ce document structure le processus de validation utilisant 20 entretiens simulés pour vérifier la capacité du moteur à s'auto-évaluer correctement.

---

## 2. Principe Fondateur

La validation de l'auto-évaluation est essentielle pour garantir que le moteur peut correctement identifier ses propres erreurs et limitations. Le protocole utilise 20 entretiens simulés avec des scénarios contrôlés pour valider chaque dimension de l'auto-évaluation.

---

## 3. Processus de Test

### 3.1 Préparation des Cas de Test

**Sélection des 20 cas :**
- 5 cas DRH (2 junior, 2 intermédiaire, 1 senior)
- 5 cas Manager RH (2 junior, 2 intermédiaire, 1 senior)
- 5 cas Commercial (2 junior, 2 intermédiaire, 1 senior)
- 5 cas Technique (2 junior, 2 intermédiaire, 1 senior)

**Caractéristiques des cas :**
- Cas avec zones manquantes connues
- Cas avec creusage insuffisant connu
- Cas avec biais connus
- Cas avec questions non posées connues
- Cas avec incohérences de scoring connues

### 3.2 Exécution des Entretiens Simulés

**Processus :**
1. Le moteur conduit chaque entretien simulé
2. Le moteur produit son auto-évaluation
3. Un évaluateur humain expert évalue la qualité de l'auto-évaluation
4. Comparaison entre l'auto-évaluation du moteur et l'évaluation humaine

### 3.3 Critères de Validation

**Critères de succès :**
- Le moteur détecte ≥ 80% des zones manquantes connues
- Le moteur détecte ≥ 80% des creusages insuffisants connus
- Le moteur détecte ≥ 80% des biais connus
- Le moteur détecte ≥ 80% des questions non posées connues
- Le moteur détecte ≥ 80% des incohérences de scoring connues
- Le score global de l'auto-évaluation est cohérent avec l'évaluation humaine (écart ≤ 1 point)

---

## 4. Structure des 20 Cas de Test

### 4.1 Cas DRH (5 cas)

**Cas DRH-1 (Junior) :**
- Zones manquantes : Budget RH
- Creusage insuffisant : Relations sociales
- Biais : Aucun
- Questions non posées : Stratégie
- Incohérences de scoring : Aucune

**Cas DRH-2 (Junior) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Management
- Biais : Biais de halo
- Questions non posées : Aucune
- Incohérences de scoring : Soft skills élevé sans preuve

**Cas DRH-3 (Intermédiaire) :**
- Zones manquantes : Droit du travail
- Creusage insuffisant : Aucun
- Biais : Biais de confirmation
- Questions non posées : Budget RH
- Incohérences de scoring : Aucune

**Cas DRH-4 (Intermédiaire) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Relations sociales
- Biais : Aucun
- Questions non posées : Stratégie
- Incohérences de scoring : Compétences élevé sans preuve

**Cas DRH-5 (Senior) :**
- Zones manquantes : Budget RH
- Creusage insuffisant : Droit du travail
- Biais : Biais d'affinité
- Questions non posées : Aucune
- Incohérences de scoring : Aucune

### 4.2 Cas Manager RH (5 cas)

**Cas MRH-1 (Junior) :**
- Zones manquantes : Gestion de paie
- Creusage insuffisant : Administration
- Biais : Aucun
- Questions non posées : Management
- Incohérences de scoring : Aucune

**Cas MRH-2 (Junior) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Gestion de paie
- Biais : Biais de récence
- Questions non posées : Aucune
- Incohérences de scoring : Soft skills élevé sans preuve

**Cas MRH-3 (Intermédiaire) :**
- Zones manquantes : Administration
- Creusage insuffisant : Aucun
- Biais : Biais culturel
- Questions non posées : Gestion de paie
- Incohérences de scoring : Aucune

**Cas MRH-4 (Intermédiaire) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Management
- Biais : Aucun
- Questions non posées : Administration
- Incohérences de scoring : Compétences élevé sans preuve

**Cas MRH-5 (Senior) :**
- Zones manquantes : Gestion de paie
- Creusage insuffisant : Administration
- Biais : Biais d'ancrage
- Questions non posées : Aucune
- Incohérences de scoring : Aucune

### 4.3 Cas Commercial (5 cas)

**Cas COM-1 (Junior) :**
- Zones manquantes : Négociation
- Creusage insuffisant : Communication
- Biais : Aucun
- Questions non posées : Vente
- Incohérences de scoring : Aucune

**Cas COM-2 (Junior) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Négociation
- Biais : Biais de disponibilité
- Questions non posées : Aucune
- Incohérences de scoring : Soft skills élevé sans preuve

**Cas COM-3 (Intermédiaire) :**
- Zones manquantes : Vente
- Creusage insuffisant : Aucun
- Biais : Biais de contraste
- Questions non posées : Négociation
- Incohérences de scoring : Aucune

**Cas COM-4 (Intermédiaire) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Communication
- Biais : Aucun
- Questions non posées : Vente
- Incohérences de scoring : Compétences élevé sans preuve

**Cas COM-5 (Senior) :**
- Zones manquantes : Négociation
- Creusage insuffisant : Vente
- Biais : Biais de projection
- Questions non posées : Aucune
- Incohérences de scoring : Aucune

### 4.4 Cas Technique (5 cas)

**Cas TECH-1 (Junior) :**
- Zones manquantes : Architecture
- Creusage insuffisant : Développement
- Biais : Aucun
- Questions non posées : Tests
- Incohérences de scoring : Aucune

**Cas TECH-2 (Junior) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Architecture
- Biais : Biais de similarité
- Questions non posées : Aucune
- Incohérences de scoring : Soft skills élevé sans preuve

**Cas TECH-3 (Intermédiaire) :**
- Zones manquantes : Tests
- Creusage insuffisant : Aucun
- Biais : Biais d'affinité
- Questions non posées : Architecture
- Incohérences de scoring : Aucune

**Cas TECH-4 (Intermédiaire) :**
- Zones manquantes : Aucune
- Creusage insuffisant : Développement
- Biais : Aucun
- Questions non posées : Tests
- Incohérences de scoring : Compétences élevé sans preuve

**Cas TECH-5 (Senior) :**
- Zones manquantes : Architecture
- Creusage insuffisant : Tests
- Biais : Biais de halo
- Questions non posées : Aucune
- Incohérences de scoring : Aucune

---

## 5. Protocole d'Évaluation

### 5.1 Évaluation par Expert Humain

**Processus :**
1. L'expert humain analyse chaque entretien simulé
2. L'expert humain identifie les zones manquantes
3. L'expert humain identifie les creusages insuffisants
4. L'expert humain identifie les biais
5. L'expert humain identifie les questions non posées
6. L'expert humain identifie les incohérences de scoring
7. L'expert humain attribue un score global de qualité (0-10)

### 5.2 Comparaison Moteur / Expert Humain

**Processus :**
1. Comparaison des zones manquantes détectées
2. Comparaison des creusages insuffisants détectés
3. Comparaison des biais détectés
4. Comparaison des questions non posées détectées
5. Comparaison des incohérences de scoring détectées
6. Comparaison des scores globaux

### 5.3 Calcul du Taux de Détection

**Formule :**
Taux de détection = (Éléments détectés par le moteur / Éléments connus) × 100

**Exemple :**
Zones manquantes connues : 5
Zones manquantes détectées par le moteur : 4
Taux de détection = (4 / 5) × 100 = 80%

### 5.4 Critères de Validation

**Critères de succès par dimension :**
- Couverture des zones critiques : Taux de détection ≥ 80%
- Qualité du creusage : Taux de détection ≥ 80%
- Détection des biais : Taux de détection ≥ 80%
- Questions non posées : Taux de détection ≥ 80%
- Cohérence du scoring : Taux de détection ≥ 80%
- Score global : Écart moteur / expert ≤ 1 point

**Critère de succès global :**
- Tous les critères de succès par dimension sont atteints
- Taux de succès global ≥ 80%

---

## 6. Structure de Données (TypeScript)

```typescript
interface TestCase {
  caseId: string;
  caseType: 'DRH' | 'MRH' | 'COM' | 'TECH';
  experienceLevel: 'junior' | 'intermediate' | 'senior';
  
  knownIssues: {
    missingZones: string[];
    insufficientDrilling: string[];
    biases: string[];
    unaskedQuestions: string[];
    scoringInconsistencies: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface TestExecution {
  executionId: string;
  testCaseId: string;
  
  executedAt: Date;
  
  engineEvaluation: {
    missingZonesDetected: string[];
    insufficientDrillingDetected: string[];
    biasesDetected: string[];
    unaskedQuestionsDetected: string[];
    scoringInconsistenciesDetected: string[];
    globalScore: number;
  };
  
  humanEvaluation: {
    missingZonesDetected: string[];
    insufficientDrillingDetected: string[];
    biasesDetected: string[];
    unaskedQuestionsDetected: string[];
    scoringInconsistenciesDetected: string[];
    globalScore: number;
  };
  
  comparison: {
    missingZonesDetectionRate: number;
    insufficientDrillingDetectionRate: number;
    biasesDetectionRate: number;
    unaskedQuestionsDetectionRate: number;
    scoringInconsistenciesDetectionRate: number;
    globalScoreGap: number;
  };
  
  validation: {
    passed: boolean;
    criteria: {
      missingZones: boolean;
      insufficientDrilling: boolean;
      biases: boolean;
      unaskedQuestions: boolean;
      scoringInconsistencies: boolean;
      globalScore: boolean;
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface TestProtocol {
  protocolId: string;
  
  testCases: TestCase[];
  
  executionProcess: {
    preparation: string;
    execution: string;
    evaluation: string;
    comparison: string;
  };
  
  validationCriteria: {
    detectionThreshold: number;
    scoreGapThreshold: number;
    globalSuccessThreshold: number;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface TestResults {
  resultsId: string;
  
  protocolId: string;
  executedAt: Date;
  
  executions: TestExecution[];
  
  summary: {
    totalCases: number;
    passedCases: number;
    failedCases: number;
    successRate: number;
    
    averageDetectionRates: {
      missingZones: number;
      insufficientDrilling: number;
      biases: number;
      unaskedQuestions: number;
      scoringInconsistencies: number;
    };
    
    averageScoreGap: number;
  };
  
  validation: {
    passed: boolean;
    criteria: {
      missingZones: boolean;
      insufficientDrilling: boolean;
      biases: boolean;
      unaskedQuestions: boolean;
      scoringInconsistencies: boolean;
      globalScore: boolean;
    };
  };
  
  recommendations: string[];
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE test_case (
  id VARCHAR(36) PRIMARY KEY,
  case_type VARCHAR(10) NOT NULL,
  experience_level VARCHAR(20) NOT NULL,
  
  known_issues JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_case_type ON test_case(case_type);

CREATE TABLE test_execution (
  id VARCHAR(36) PRIMARY KEY,
  test_case_id VARCHAR(36) NOT NULL,
  
  executed_at TIMESTAMP NOT NULL,
  
  engine_evaluation JSON NOT NULL,
  human_evaluation JSON NOT NULL,
  comparison JSON NOT NULL,
  validation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_execution_case ON test_execution(test_case_id);

CREATE TABLE test_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  test_cases JSON NOT NULL,
  execution_process JSON NOT NULL,
  validation_criteria JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE test_results (
  id VARCHAR(36) PRIMARY KEY,
  
  protocol_id VARCHAR(36) NOT NULL,
  executed_at TIMESTAMP NOT NULL,
  
  executions JSON NOT NULL,
  summary JSON NOT NULL,
  validation JSON NOT NULL,
  recommendations JSON,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_results_protocol ON test_results(protocol_id);
```

---

## 8. API Endpoints

```typescript
// GET /api/test-protocol
async function getTestProtocol(): Promise<TestProtocol> {
  return await getTestProtocol();
}

// PUT /api/test-protocol
async function updateTestProtocol(protocol: TestProtocol): Promise<TestProtocol> {
  return await updateTestProtocol(protocol);
}

// POST /api/test-case/create
async function createTestCase(testCase: TestCase): Promise<TestCase> {
  return await createTestCase(testCase);
}

// GET /api/test-cases
async function getTestCases(): Promise<TestCase[]> {
  return await getTestCases();
}

// POST /api/test-execution/execute
async function executeTest(testCaseId: string): Promise<TestExecution> {
  return await executeTest(testCaseId);
}

// GET /api/test-execution/:executionId
async function getTestExecution(executionId: string): Promise<TestExecution> {
  return await getTestExecutionById(executionId);
}

// POST /api/test-results/generate
async function generateTestResults(protocolId: string): Promise<TestResults> {
  return await generateTestResults(protocolId);
}

// GET /api/test-results/:resultsId
async function getTestResults(resultsId: string): Promise<TestResults> {
  return await getTestResultsById(resultsId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Test

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection moyen | Moyenne des taux de détection | ≥ 80% |
- Taux de succès global | Cas validés / total | ≥ 80% |
- Écart moyen score global | Écart moyen moteur / expert | ≤ 1 point |

### 9.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de détection par dimension | Chaque dimension ≥ 80% | 100% |
- Taux de validation par cas | Cas validés / total | ≥ 80% |

---

## 10. Conclusion

Le protocole de test valide l'auto-évaluation du moteur en utilisant 20 entretiens simulés. Structure des 20 cas : 5 cas DRH (2 junior, 2 intermédiaire, 1 senior), 5 cas Manager RH (2 junior, 2 intermédiaire, 1 senior), 5 cas Commercial (2 junior, 2 intermédiaire, 1 senior), 5 cas Technique (2 junior, 2 intermédiaire, 1 senior). Chaque cas contient des zones manquantes connues, des creusages insuffisants connus, des biais connus, des questions non posées connues, des incohérences de scoring connues. Processus de test : Exécution des entretiens simulés, auto-évaluation du moteur, évaluation par expert humain, comparaison moteur / expert, calcul du taux de détection. Critères de validation : Taux de détection ≥ 80% pour chaque dimension, écart score global ≤ 1 point, taux de succès global ≥ 80%. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 20 cas de test structurés
- 5 cas par type de poste
- Zones manquantes connues
- Creusages insuffisants connus
- Biais connus
- Questions non posées connues
- Incohérences de scoring connues
- Processus de test détaillé
- Évaluation par expert humain
- Comparaison moteur / expert
- Critères de validation
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de test et de qualité
