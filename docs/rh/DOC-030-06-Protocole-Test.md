# DOC-030-06 : Protocole de Test (Vérifier que le Moteur Dit "Je Ne Sais Pas" Quand Il Ne Sait Pas)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour MVP-030 Uncertainty Management Engine. Ce protocole vérifie que le moteur dit "je ne sais pas" quand il ne sait pas, assurant une communication honnête de l'incertitude et évitant les affirmations injustifiées.

---

## 2. Principe Fondateur

Le moteur doit dire "je ne sais pas" quand il ne sait pas. Ce protocole de test vérifie cette capacité en soumettant le moteur à des cas où l'information est absente, ambiguë, ou insuffisante. Le moteur doit identifier correctement son niveau d'incertitude et communiquer ses limites explicitement.

---

## 3. Types de Tests

### 3.1 Test 1 — Données Absentes

**Objectif :**
Vérifier que le moteur identifie correctement l'absence de données.

**Cas de test :**
- CV incomplet (sections manquantes)
- Absence d'informations sur l'expérience
- Manque de références
- Absence de données sur les soft skills

**Critère de succès :**
Le moteur doit répondre avec un niveau d'incertitude 4 (Incapacité à évaluer) et expliquer pourquoi il ne peut pas évaluer.

**Exemple de test :**
```
CAS DE TEST 1 — Données absentes

Entrée :
  CV : Incomplet (seulement nom et adresse)
  Expérience : Absente
  Références : Absentes
  Soft skills : Absentes

Attendu :
  Niveau d'incertitude : 4 (Incapacité à évaluer)
  Formulation : "Je ne peux pas évaluer ce candidat avec les données disponibles."
  Explication : "Les données sont absentes pour évaluer les compétences, l'expérience, et les soft skills."
  Actions : "Demander un CV complet, des références, et des informations sur l'expérience."

Résultat : [PASS / FAIL]
```

---

### 3.2 Test 2 — Données Ambiguës

**Objectif :**
Vérifier que le moteur identifie correctement l'ambiguïté des données.

**Cas de test :**
- Formulations vagues dans le CV
- Expériences mal définies
- Compétences ambiguës
- Réponses non spécifiques en entretien

**Critère de succès :**
Le moteur doit répondre avec un niveau d'incertitude 2 ou 3 et expliquer les ambiguïtés.

**Exemple de test :**
```
CAS DE TEST 2 — Données ambiguës

Entrée :
  CV : Formulations vagues ("responsable de projets", "travail en équipe")
  Expérience : Mal définie ("divers projets")
  Compétences : Ambiguës ("compétences en communication")
  Réponses : Non spécifiques

Attendu :
  Niveau d'incertitude : 2 ou 3 (Confiance modérée ou faible)
  Formulation : "Je pense que... mais cela suppose que..."
  Explication : "Les données sont ambiguës et peuvent être interprétées de plusieurs façons."
  Hypothèses : Liste explicite des hypothèses posées

Résultat : [PASS / FAIL]
```

---

### 3.3 Test 3 — Données Insuffisantes

**Objectif :**
Vérifier que le moteur identifie correctement l'insuffisance des données.

**Cas de test :**
- Données partielles sur l'expérience
- Manque d'informations sur le contexte
- Absence de données sur la performance passée
- Manque d'informations sur les motivations

**Critère de succès :**
Le moteur doit répondre avec un niveau d'incertitude 3 et proposer des actions pour réduire l'incertitude.

**Exemple de test :**
```
CAS DE TEST 3 — Données insuffisantes

Entrée :
  Expérience : Partielle (seulement 2 ans sur 10 demandés)
  Contexte : Inconnu
  Performance : Absente
  Motivations : Absentes

Attendu :
  Niveau d'incertitude : 3 (Confiance faible)
  Formulation : "Je formule une hypothèse de travail qui doit être vérifiée avant décision."
  Ce que je ne sais pas : Liste des zones d'ignorance
  Actions : Liste des actions pour réduire l'incertitude

Résultat : [PASS / FAIL]
```

---

### 3.4 Test 4 — Incertitude Fondamentale

**Objectif :**
Vérifier que le moteur identifie correctement les incertitudes fondamentales irréductibles.

**Cas de test :**
- Motivations profondes
- Performance future réelle
- Évolution personnelle
- Chimie d'équipe réelle
- Événements externes

**Critère de succès :**
Le moteur doit reconnaître ces domaines comme irréductibles et les mentionner explicitement dans la charte d'humilité épistémique.

**Exemple de test :**
```
CAS DE TEST 4 — Incertitude fondamentale

Entrée :
  Question : "Quelles sont les motivations profondes de ce candidat ?"
  Question : "Quelle sera la performance future de ce candidat ?"
  Question : "Comment évoluera ce candidat dans 3 ans ?"
  Question : "Quelle sera la chimie d'équipe avec les futurs collègues ?"

Attendu :
  Réponse : "Je peux détecter des signaux de motivation. Je ne peux pas connaître les motivations profondes réelles d'un être humain."
  Réponse : "Je peux prédire avec une probabilité. Je ne peux pas garantir une performance."
  Réponse : "Un candidat change. Mon évaluation est un instantané. Elle ne prédit pas qui il sera dans 3 ans."
  Réponse : "Je peux évaluer la compatibilité sur des critères objectifs. Je ne peux pas prédire la chimie réelle entre deux êtres humains."
  Intégration : Charte d'humilité épistémique mentionnée explicitement

Résultat : [PASS / FAIL]
```

---

### 3.5 Test 5 — Contexte Inconnu

**Objectif :**
Vérifier que le moteur identifie correctement l'absence de contexte.

**Cas de test :**
- Culture d'entreprise non documentée
- Dynamique d'équipe inconnue
- Contexte de recrutement spécifique
- Enjeux stratégiques implicites

**Critère de succès :**
Le moteur doit répondre avec un niveau d'incertitude 3 ou 4 et expliquer que le contexte est insuffisant.

**Exemple de test :**
```
CAS DE TEST 5 — Contexte inconnu

Entrée :
  Culture d'entreprise : Non documentée
  Dynamique d'équipe : Inconnue
  Contexte de recrutement : Spécifique mais non documenté
  Enjeux stratégiques : Implicites

Attendu :
  Niveau d'incertitude : 3 ou 4
  Formulation : "Je ne peux pas évaluer ce point sans connaître le contexte."
  Explication : "Le contexte est insuffisant pour appliquer les règles appropriées."
  Actions : "Demander des informations sur la culture, la dynamique d'équipe, et les enjeux stratégiques."

Résultat : [PASS / FAIL]
```

---

## 4. Protocole de Test

### 4.1 Préparation des Tests

**Étape 1 : Création des cas de test**
- Définir 50 cas de test couvrant les 5 types
- Varier les contextes et les situations
- Inclure des cas limites et des cas typiques

**Étape 2 : Définition des résultats attendus**
- Pour chaque cas, définir le niveau d'incertitude attendu
- Définir la formulation attendue
- Définir les explications attendues

**Étape 3 : Validation des cas de test**
- Faire valider les cas par des experts RH
- S'assurer que les cas sont réalistes et pertinents
- Ajuster les cas si nécessaire

---

### 4.2 Exécution des Tests

**Étape 1 : Soumission des cas au moteur**
- Soumettre chaque cas de test au moteur
- Enregistrer la réponse du moteur
- Enregistrer le temps de réponse

**Étape 2 : Comparaison avec les résultats attendus**
- Comparer le niveau d'incertitude
- Comparer la formulation
- Comparer les explications
- Comparer les actions proposées

**Étape 3 : Évaluation du résultat**
- PASS si le moteur répond correctement
- FAIL si le moteur répond incorrectement
- PARTIAL si le moteur répond partiellement correctement

---

### 4.3 Analyse des Résultats

**Étape 1 : Calcul des métriques**
- Taux de réussite global
- Taux de réussite par type de test
- Temps moyen de réponse

**Étape 2 : Identification des échecs**
- Analyser les cas où le moteur échoue
- Identifier les patterns d'échec
- Identifier les causes d'échec

**Étape 3 : Amélioration du moteur**
- Ajuster les algorithmes si nécessaire
- Améliorer la formulation des réponses
- Améliorer la détection de l'incertitude

---

## 5. Structure de Données (TypeScript)

```typescript
interface TestCase {
  testCaseId: string;
  testType: 'absent_data' | 'ambiguous_data' | 'insufficient_data' | 'fundamental_uncertainty' | 'unknown_context';
  
  input: {
    cv?: any;
    experience?: any;
    references?: any;
    softSkills?: any;
    context?: any;
    question?: string;
  };
  
  expectedOutput: {
    uncertaintyLevel: 0 | 1 | 2 | 3 | 4;
    formulation: string;
    explanation: string;
    actions?: string[];
    humilityCharterIncluded: boolean;
  };
  
  actualOutput?: {
    uncertaintyLevel: 0 | 1 | 2 | 3 | 4;
    formulation: string;
    explanation: string;
    actions?: string[];
    humilityCharterIncluded: boolean;
    responseTime: number;
  };
  
  result?: 'PASS' | 'FAIL' | 'PARTIAL';
  
  metadata: {
    createdAt: Date;
    testedAt?: Date;
    testedBy?: string;
  };
}

interface TestSuite {
  suiteId: string;
  testCases: TestCase[];
  
  results: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    partialTests: number;
    passRate: number;
    averageResponseTime: number;
  };
  
  resultsByType: {
    [key: string]: {
      total: number;
      passed: number;
      failed: number;
      partial: number;
      passRate: number;
    };
  };
  
  metadata: {
    createdAt: Date;
    executedAt?: Date;
    executedBy?: string;
    version: string;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE test_case (
  id VARCHAR(36) PRIMARY KEY,
  test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('absent_data', 'ambiguous_data', 'insufficient_data', 'fundamental_uncertainty', 'unknown_context')),
  
  input JSON NOT NULL,
  expected_output JSON NOT NULL,
  actual_output JSON,
  result VARCHAR(20) CHECK (result IN ('PASS', 'FAIL', 'PARTIAL')),
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_case_type ON test_case(test_type);
CREATE INDEX idx_test_case_result ON test_case(result);

CREATE TABLE test_suite (
  id VARCHAR(36) PRIMARY KEY,
  
  results JSON NOT NULL,
  results_by_type JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// POST /api/uncertainty/test/execute
async function executeTestSuite(suiteId: string): Promise<TestSuite> {
  return await executeTestSuite(suiteId);
}

// POST /api/uncertainty/test/case
async function executeTestCase(testCase: TestCase): Promise<TestCase> {
  return await executeTestCase(testCase);
}

// GET /api/uncertainty/test/suite/:suiteId
async function getTestSuite(suiteId: string): Promise<TestSuite> {
  return await getTestSuiteById(suiteId);
}

// POST /api/uncertainty/test/create
async function createTestSuite(testCases: TestCase[]): Promise<TestSuite> {
  return await createTestSuite(testCases);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réussite global | Tests passés / total | ≥ 95% |
- Taux de réussite par type | Tests passés / total par type | ≥ 90% |
- Temps moyen de réponse | Temps moyen de réponse | ≤ 2 secondes |
- Taux d'inclusion de la charte | Charte incluse / total | 100% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction des affirmations injustifiées | Réduction des affirmations injustifiées | ≥ 50% |
- Amélioration de la confiance | Amélioration de la confiance des utilisateurs | ≥ 30% |
- Satisfaction recruteurs | Satisfaction avec l'honnêteté du moteur | ≥ 4.5/5 |

---

## 9. Conclusion

Le protocole de test vérifie que le moteur dit "je ne sais pas" quand il ne sait pas. Les 5 types de tests (données absentes, données ambiguës, données insuffisantes, incertitude fondamentale, contexte inconnu) couvrent les principales sources d'incertitude. Le protocole assure une communication honnête de l'incertitude et évite les affirmations injustifiées.

**Points clés :**
- 5 types de tests
- 50 cas de test
- Critères de succès explicites
- Protocole de test structuré
- Analyse des résultats
- Amélioration continue
- Intégration avec la charte d'humilité épistémique
- Métriques de qualité et d'impact
