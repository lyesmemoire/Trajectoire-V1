# DOC-M10-07 : Protocole de Calibration (Validation sur 50 Binômes Réels)

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de calibration pour le MVP-META-10 Manager Compatibility Engine. Ce document structure le processus de validation de l'algorithme de scoring sur 50 binômes candidat/manager réels.

---

## 2. Principe Fondateur

La calibration consiste à valider l'algorithme de scoring de compatibilité sur un échantillon de 50 binômes réels. L'objectif est de comparer les scores prédits avec les résultats observés (rétention, performance, satisfaction) et d'ajuster l'algorithme si nécessaire.

---

## 3. Échantillon de Calibration

### 3.1 Sélection des Binômes

**Critères de sélection :**
- 50 binômes candidat/manager ayant travaillé ensemble pendant au moins 6 mois
- Diversité des secteurs d'activité
- Diversité des tailles d'entreprise
- Diversité des profils de manager
- Diversité des profils de candidat

**Répartition :**
- 25 binômes avec rétention réussie (≥ 12 mois)
- 25 binômes avec rétention échouée (< 12 mois)

---

### 3.2 Données Collectées

**Pour chaque binôme :**
- Profil du candidat (10 dimensions)
- Profil du manager (5 dimensions)
- Score de compatibilité calculé
- Résultat observé (rétention, performance, satisfaction)
- Date de début et fin de la relation

---

## 4. Processus de Calibration

### 4.1 Étape 1 — Calcul des Scores Prédits

```typescript
function calculatePredictedScores(pairs: Pair[]): PredictedScore[] {
  return pairs.map(pair => {
    const compatibilityMatrix = generateCompatibilityMatrix(pair.recruitmentId, pair.candidateId, pair.managerId);
    const compatibilityScore = calculateGlobalScore(compatibilityMatrix.dimensions);
    
    return {
      pairId: pair.id,
      predictedScore: compatibilityScore.global,
      interpretation: interpretScore(compatibilityScore.global)
    };
  });
}
```

---

### 4.2 Étape 2 — Comparaison avec les Résultats Observés

```typescript
function comparePredictedVsObserved(predictedScores: PredictedScore[], observedResults: ObservedResult[]): CalibrationResult[] {
  return predictedScores.map(predicted => {
    const observed = observedResults.find(r => r.pairId === predicted.pairId);
    
    return {
      pairId: predicted.pairId,
      predictedScore: predicted.predictedScore,
      predictedInterpretation: predicted.interpretation,
      observedRetention: observed.retention,
      observedPerformance: observed.performance,
      observedSatisfaction: observed.satisfaction,
      accuracy: calculateAccuracy(predicted.predictedScore, observed)
    };
  });
}
```

---

### 4.3 Étape 3 — Analyse des Écarts

**Métriques d'analyse :**
- Taux de précision : Scores corrects / totaux
- Taux de faux positifs : Scores élevés mais échec observé
- Taux de faux négatifs : Scores faibles mais succès observé
- Corrélation score-résultat : Pearson entre score et rétention

---

### 4.4 Étape 4 — Ajustement de l'Algorithme

**Si taux de précision < 75% :**
- Réviser les critères de compatibilité par dimension
- Ajuster les pondérations des dimensions
- Modifier les seuils d'interprétation

**Si taux de faux positifs > 20% :**
- Renforcer les critères de compatibilité
- Augmenter le seuil d'alerte critique

**Si taux de faux négatifs > 20% :**
- Assouplir les critères de compatibilité
- Diminuer le seuil d'alerte critique

---

## 5. Structure de Données (TypeScript)

```typescript
interface CalibrationPair {
  pairId: string;
  candidateId: string;
  managerId: string;
  recruitmentId: string;
  
  candidateProfile: {
    workStyle: string;
    communication: string;
    structureNeed: string;
    errorTolerance: string;
    availability: string;
    ambition: string;
    values: string;
    feedback: string;
    decision: string;
    culture: string;
  };
  
  managerProfile: {
    managementStyle: string;
    controlNeed: string;
    communicationStyle: string;
    errorTolerance: string;
    implicitExpectations: string;
  };
  
  startDate: Date;
  endDate?: Date;
  duration: number; // en moi
}

interface ObservedResult {
  pairId: string;
  retention: 'success' | 'failure';
  retentionDuration: number; // en mois
  performance: 'high' | 'medium' | 'low';
  satisfaction: 'high' | 'medium' | 'low';
  departureReason?: string;
}

interface CalibrationResult {
  pairId: string;
  predictedScore: number;
  predictedInterpretation: string;
  observedRetention: string;
  observedPerformance: string;
  observedSatisfaction: string;
  accuracy: boolean;
  errorType?: 'false_positive' | 'false_negative' | null;
}

interface CalibrationReport {
  reportId: string;
  calibrationDate: Date;
  
  sampleSize: number;
  sampleComposition: {
    successRetention: number;
    failureRetention: number;
  };
  
  metrics: {
    accuracyRate: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
    correlation: number;
  };
  
  results: CalibrationResult[];
  
  recommendations: string[];
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE calibration_pair (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  manager_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  candidate_profile JSON NOT NULL,
  manager_profile JSON NOT NULL,
  
  start_date DATE NOT NULL,
  end_date DATE,
  duration INTEGER NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE observed_result (
  id VARCHAR(36) PRIMARY KEY,
  pair_id VARCHAR(36) NOT NULL,
  
  retention VARCHAR(10) NOT NULL,
  retention_duration INTEGER NOT NULL,
  performance VARCHAR(10) NOT NULL,
  satisfaction VARCHAR(10) NOT NULL,
  departure_reason TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE calibration_report (
  id VARCHAR(36) PRIMARY KEY,
  calibration_date DATE NOT NULL,
  
  sample_size INTEGER NOT NULL,
  sample_composition JSON NOT NULL,
  metrics JSON NOT NULL,
  results JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_calibration_pair_candidate ON calibration_pair(candidate_id);
CREATE INDEX idx_calibration_pair_manager ON calibration_pair(manager_id);
CREATE INDEX idx_observed_result_pair ON observed_result(pair_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/calibration/pair/create
async function createCalibrationPair(pair: CalibrationPair): Promise<CalibrationPair> {
  return await createCalibrationPair(pair);
}

// POST /api/calibration/result/create
async function createObservedResult(result: ObservedResult): Promise<ObservedResult> {
  return await createObservedResult(result);
}

// POST /api/calibration/run
async function runCalibration(): Promise<CalibrationReport> {
  return await runCalibration();
}

// GET /api/calibration/report/:reportId
async function getCalibrationReport(reportId: string): Promise<CalibrationReport> {
  return await getCalibrationReport(reportId);
}

// GET /api/calibration/reports
async function listCalibrationReports(limit?: number, offset?: number): Promise<CalibrationReport[]> {
  return await listCalibrationReports(limit, offset);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Calibration

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de précision | Scores corrects / totaux | ≥ 75% |
- Taux de faux positifs | Faux positifs / totaux | ≤ 20% |
- Taux de faux négatifs | Faux négatifs / totaux | ≤ 20% |
- Corrélation score-résultat | Pearson | ≥ 0.6 |

### 8.2 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de complétion échantillon | Pairs complétés / 50 | 100% |
- Latence de calibration | Temps de calibration | ≤ 1 heure |

---

## 9. Exemple Complet

```markdown
RAPPORT DE CALIBRATION

Date de calibration : 2026-08-04
ID du rapport : CAL-2026-001

ÉCHANTILLON :
→ Taille : 50 binômes
→ Rétention réussie : 25
→ Rétention échouée : 25

MÉTRIQUES :
→ Taux de précision : 78%
→ Taux de faux positifs : 12%
→ Taux de faux négatifs : 10%
→ Corrélation score-résultat : 0.72

RÉSULTATS PAR BINÔME :
→ Binôme 1 : Score prédit 16 (excellent) - Rétention succès - Précision correcte
→ Binôme 2 : Score prédit 4 (incompatible) - Rétention échec - Précision correcte
→ Binôme 3 : Score prédit 14 (bon) - Rétention échec - Faux positif
→ Binôme 4 : Score prédit 6 (faible) - Rétention succès - Faux négatif
...

RECOMMANDATIONS :
→ Maintenir l'algorithme actuel (taux de précision ≥ 75%)
→ Surveiller les faux positifs sur la dimension "Ambition"
→ Ajuster légèrement la pondération de la dimension "Feedback"
→ Répéter la calibration sur 50 binômes supplémentaires dans 6 mois
```

---

## 10. Conclusion

Le protocole de calibration structure le processus de validation de l'algorithme de scoring sur 50 binômes réels. Échantillon : 50 binômes (25 rétention réussie, 25 rétention échouée). Processus en 4 étapes : Calcul scores prédits, Comparaison résultats observés, Analyse écarts, Ajustement algorithme. Métriques : Taux de précision ≥ 75%, Faux positifs ≤ 20%, Faux négatifs ≤ 20%, Corrélation ≥ 0.6. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Échantillon de 50 binômes réels
- Processus de calibration en 4 étapes
- Métriques de précision et d'écarts
- Ajustement de l'algorithme si nécessaire
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de calibration et de processus
- Rapport de calibration avec recommandations
