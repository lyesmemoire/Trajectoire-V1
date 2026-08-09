# DOC-008-10 : Protocole de Mesure de l'Accord Moteur / Humain

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de mesure de l'accord entre le moteur de raisonnement et les décisions humaines. Ce protocole est utilisé pour valider la performance du moteur avant et après chaque cycle d'apprentissage, avec le golden dataset comme référence.

---

## 2. Principe Fondateur

Mesurer l'accord moteur / humain sur le golden dataset. Objectif MVP : > 75% d'accord. Objectif V2 : > 85% d'accord. Après chaque cycle d'apprentissage : recalculer l'accord sur le golden dataset. Si l'accord baisse : rollback immédiat.

---

## 3. Définition de l'Accord

### 3.1 Accord de Décision

L'accord de décision mesure si le moteur et l'humain prennent la même décision (retenu / refusé).

```typescript
function calculateDecisionAgreement(engineDecision: string, humanDecision: string): boolean {
  // Normalisation des décisions
  const normalizedEngine = normalizeDecision(engineDecision);
  const normalizedHuman = normalizeDecision(humanDecision);
  
  return normalizedEngine === normalizedHuman;
}

function normalizeDecision(decision: string): string {
  if (decision === 'recommend' || decision === 'retained') return 'retained';
  if (decision === 'not_recommend' || decision === 'rejected') return 'rejected';
  if (decision === 'recommend_with_conditions' || decision === 'pending') return 'pending';
  return decision;
}
```

### 3.2 Accord de Confiance

L'accord de confiance mesure si le niveau de confiance du moteur est aligné avec la difficulté du cas.

```typescript
function calculateConfidenceAgreement(engineConfidence: string, caseDifficulty: string): boolean {
  const confidenceMapping = {
    'easy': 'high',
    'medium': 'medium',
    'hard': 'medium',
    'ambiguous': 'low'
  };
  
  const expectedConfidence = confidenceMapping[caseDifficulty];
  return engineConfidence === expectedConfidence;
}
```

### 3.3 Accord de Justification

L'accord de justification mesure si les facteurs déterminants du moteur correspondent à ceux de l'humain.

```typescript
function calculateJustificationAgreement(engineFactors: string[], humanFactor: string): boolean {
  return engineFactors.includes(humanFactor) || 
         engineFactors.some(f => isSimilarFactor(f, humanFactor));
}

function isSimilarFactor(factor1: string, factor2: string): boolean {
  const similarFactors = {
    'technical_skill': ['skill', 'competence', 'expertise'],
    'sector_experience': ['experience', 'background'],
    'soft_skills': ['communication', 'teamwork'],
    'culture_fit': ['fit', 'alignment']
  };
  
  for (const [key, synonyms] of Object.entries(similarFactors)) {
    if (synonyms.includes(factor1) && synonyms.includes(factor2)) {
      return true;
    }
  }
  
  return false;
}
```

---

## 4. Score d'Accord Global

### 4.1 Calcul du Score

Le score d'accord global est une combinaison pondérée des différents types d'accord :

```typescript
interface AgreementScore {
  decisionAgreement: number; // 0-1
  confidenceAgreement: number; // 0-1
  justificationAgreement: number; // 0-1
  overallScore: number; // 0-1
}

function calculateOverallAgreementScore(dataset: GoldenDatasetCase[]): AgreementScore {
  let decisionAgreements = 0;
  let confidenceAgreements = 0;
  let justificationAgreements = 0;
  
  for (const case_ of dataset) {
    const engineDecision = getEngineDecision(case_.cv.id, case_.job.id);
    
    // Accord de décision
    if (calculateDecisionAgreement(engineDecision.recommendation, case_.humanDecision.decision)) {
      decisionAgreements++;
    }
    
    // Accord de confiance
    if (calculateConfidenceAgreement(engineDecision.confidence, case_.caseClassification.difficulty)) {
      confidenceAgreements++;
    }
    
    // Accord de justification
    if (calculateJustificationAgreement(engineDecision.determiningFactors, case_.humanDecision.determiningFactor)) {
      justificationAgreements++;
    }
  }
  
  const total = dataset.length;
  
  return {
    decisionAgreement: decisionAgreements / total,
    confidenceAgreement: confidenceAgreements / total,
    justificationAgreement: justificationAgreements / total,
    overallScore: (
      (decisionAgreements / total) * 0.5 +
      (confidenceAgreements / total) * 0.3 +
      (justificationAgreements / total) * 0.2
    )
  };
}
```

### 4.2 Pondération

| Type d'Accord | Pondération | Justification |
|----------------|-------------|---------------|
| Accord de décision | 50% | L'accord sur la décision est le plus critique |
| Accord de confiance | 30% | La confiance appropriée est importante |
| Accord de justification | 20% | La justification est utile mais moins critique |

---

## 5. Protocole de Mesure

### 5.1 Mesure Pré-Déploiement

Avant le déploiement de MVP-008 :

```typescript
async function measurePreDeploymentAgreement(): PreDeploymentMeasurement {
  const dataset = loadGoldenDataset();
  const score = calculateOverallAgreementScore(dataset);
  
  const measurement: PreDeploymentMeasurement = {
    timestamp: new Date(),
    engineVersion: getCurrentVersion(),
    datasetVersion: dataset.version,
    score,
    target: 0.75,
    meetsTarget: score.overallScore >= 0.75,
    details: calculateDetailedScores(dataset)
  };
  
  await saveMeasurement(measurement);
  
  return measurement;
}
```

### 5.2 Mesure Post-Déploiement

Après chaque cycle d'apprentissage :

```typescript
async function measurePostDeploymentAgreement(): PostDeploymentMeasurement {
  const dataset = loadGoldenDataset();
  const score = calculateOverallAgreementScore(dataset);
  
  const previousMeasurement = getLatestMeasurement();
  const delta = score.overallScore - previousMeasurement.score.overallScore;
  
  const measurement: PostDeploymentMeasurement = {
    timestamp: new Date(),
    engineVersion: getCurrentVersion(),
    datasetVersion: dataset.version,
    score,
    previousScore: previousMeasurement.score,
    delta,
    target: 0.75,
    meetsTarget: score.overallScore >= 0.75,
    requiresRollback: delta < -0.05,
    details: calculateDetailedScores(dataset)
  };
  
  await saveMeasurement(measurement);
  
  if (measurement.requiresRollback) {
    await triggerRollback('Score golden dataset en baisse significative');
  }
  
  return measurement;
}
```

---

## 6. Analyse Détaillée

### 6.1 Analyse par Difficulté

```typescript
function analyzeAgreementByDifficulty(dataset: GoldenDatasetCase[]): DifficultyAnalysis {
  const byDifficulty = {
    easy: [] as GoldenDatasetCase[],
    medium: [] as GoldenDatasetCase[],
    hard: [] as GoldenDatasetCase[],
    ambiguous: [] as GoldenDatasetCase[]
  };
  
  for (const case_ of dataset) {
    byDifficulty[case_.caseClassification.difficulty].push(case_);
  }
  
  const analysis: DifficultyAnalysis = {};
  
  for (const [difficulty, cases] of Object.entries(byDifficulty)) {
    analysis[difficulty] = calculateOverallAgreementScore(cases);
  }
  
  return analysis;
}
```

### 6.2 Analyse par Type de Profil

```typescript
function analyzeAgreementByProfileType(dataset: GoldenDatasetCase[]): ProfileTypeAnalysis {
  const byProfileType = {
    standard: [] as GoldenDatasetCase[],
    atypical: [] as GoldenDatasetCase[],
    edge_case: [] as GoldenDatasetCase[]
  };
  
  for (const case_ of dataset) {
    byProfileType[case_.caseClassification.profileType].push(case_);
  }
  
  const analysis: ProfileTypeAnalysis = {};
  
  for (const [profileType, cases] of Object.entries(byProfileType)) {
    analysis[profileType] = calculateOverallAgreementScore(cases);
  }
  
  return analysis;
}
```

### 6.3 Analyse par Secteur

```typescript
function analyzeAgreementBySector(dataset: GoldenDatasetCase[]): SectorAnalysis {
  const bySector: Record<string, GoldenDatasetCase[]> = {};
  
  for (const case_ of dataset) {
    if (!bySector[case_.job.sector]) {
      bySector[case_.job.sector] = [];
    }
    bySector[case_.job.sector].push(case_);
  }
  
  const analysis: SectorAnalysis = {};
  
  for (const [sector, cases] of Object.entries(bySector)) {
    analysis[sector] = calculateOverallAgreementScore(cases);
  }
  
  return analysis;
}
```

### 6.4 Analyse par Niveau d'Expérience

```typescript
function analyzeAgreementByExperienceLevel(dataset: GoldenDatasetCase[]): ExperienceLevelAnalysis {
  const byExperienceLevel = {
    junior: [] as GoldenDatasetCase[],
    mid: [] as GoldenDatasetCase[],
    senior: [] as GoldenDatasetCase[],
    executive: [] as GoldenDatasetCase[]
  };
  
  for (const case_ of dataset) {
    byExperienceLevel[case_.caseClassification.experienceLevel].push(case_);
  }
  
  const analysis: ExperienceLevelAnalysis = {};
  
  for (const [experienceLevel, cases] of Object.entries(byExperienceLevel)) {
    analysis[experienceLevel] = calculateOverallAgreementScore(cases);
  }
  
  return analysis;
}
```

---

## 7. Objectifs de Performance

### 7.1 Objectifs Globaux

| Métrique | Objectif MVP | Objectif V2 |
|----------|--------------|-------------|
| Accord global | ≥ 75% | ≥ 85% |
| Accord de décision | ≥ 80% | ≥ 90% |
| Accord de confiance | ≥ 70% | ≥ 80% |
| Accord de justification | ≥ 65% | ≥ 75% |

### 7.2 Objectifs par Difficulté

| Difficulté | Objectif MVP | Objectif V2 |
|------------|--------------|-------------|
| Easy | ≥ 90% | ≥ 95% |
| Medium | ≥ 75% | ≥ 85% |
| Hard | ≥ 60% | ≥ 75% |
| Ambiguous | ≥ 50% | ≥ 65% |

### 7.3 Objectifs par Type de Profil

| Type de Profil | Objectif MVP | Objectif V2 |
|----------------|--------------|-------------|
| Standard | ≥ 85% | ≥ 90% |
| Atypique | ≥ 65% | ≥ 80% |
| Edge case | ≥ 50% | ≥ 65% |

---

## 8. Critères de Rollback

### 8.1 Critère Principal

Le rollback est déclenché si :

- Le score d'accord global baisse de plus de 5% par rapport à la mesure précédente

### 8.2 Critères Secondaires

Alerte est déclenchée si :

- Le score d'accord global baisse de plus de 2% mais moins de 5%
- Le score d'accord pour une sous-catégorie baisse de plus de 10%
- Le score d'accord pour les cas atypiques baisse de plus de 15%

### 8.3 Algorithme de Décision

```typescript
function determineRollbackRequirement(measurement: PostDeploymentMeasurement): RollbackDecision {
  const decision: RollbackDecision = {
    requiresRollback: false,
    requiresAlert: false,
    reason: null
  };
  
  // Critère principal
  if (measurement.delta < -0.05) {
    decision.requiresRollback = true;
    decision.reason = `Score global en baisse significative : ${measurement.delta.toFixed(2)}`;
    return decision;
  }
  
  // Critères secondaires
  if (measurement.delta < -0.02) {
    decision.requiresAlert = true;
    decision.reason = `Score global en baisse modérée : ${measurement.delta.toFixed(2)}`;
  }
  
  // Vérification des sous-catégories
  for (const [category, score] of Object.entries(measurement.details.byDifficulty)) {
    const previousScore = measurement.previousScore.details.byDifficulty[category];
    const delta = score - previousScore;
    
    if (delta < -0.10) {
      decision.requiresAlert = true;
      decision.reason = `Score ${category} en baisse significative : ${delta.toFixed(2)}`;
    }
  }
  
  return decision;
}
```

---

## 9. Rapport de Mesure

### 9.1 Structure du Rapport

```typescript
interface AgreementMeasurementReport {
  id: string;
  timestamp: Date;
  engineVersion: string;
  datasetVersion: string;
  
  // Score global
  overallScore: AgreementScore;
  
  // Analyse détaillée
  details: {
    byDifficulty: DifficultyAnalysis;
    byProfileType: ProfileTypeAnalysis;
    bySector: SectorAnalysis;
    byExperienceLevel: ExperienceLevelAnalysis;
  };
  
  // Comparaison avec la mesure précédente
  comparison?: {
    previousScore: AgreementScore;
    delta: number;
    deltaByCategory: Record<string, number>;
  };
  
  // Objectifs
  targets: {
    current: number;
    mvp: number;
    v2: number;
    meetsMVP: boolean;
    meetsV2: boolean;
  };
  
  // Décision
  decision: {
    requiresRollback: boolean;
    requiresAlert: boolean;
    reason?: string;
  };
  
  // Recommandations
  recommendations: string[];
}
```

### 9.2 Exemple de Rapport

```
RAPPORT DE MESURE D'ACCORD MOTEUR / HUMAIN

Date : 2026-08-03
Version moteur : v1.1.0
Version dataset : v1.0

SCORE GLOBAL
-----------
Accord global : 82% (cible MVP : 75%, cible V2 : 85%)
- Accord de décision : 85%
- Accord de confiance : 78%
- Accord de justification : 75%

ANALYSE PAR DIFFICULTÉ
----------------------
Easy : 92% (cible MVP : 90%)
Medium : 78% (cible MVP : 75%)
Hard : 65% (cible MVP : 60%)
Ambiguous : 55% (cible MVP : 50%)

ANALYSE PAR TYPE DE PROFIL
-------------------------
Standard : 88% (cible MVP : 85%)
Atypique : 70% (cible MVP : 65%)
Edge case : 52% (cible MVP : 50%)

COMPARAISON AVEC LA MESURE PRÉCÉDENTE
-----------------------------------
Score précédent : 80%
Delta : +2% ✓

DÉCISION
--------
Rollback requis : Non
Alerte requise : Non

RECOMMANDATIONS
--------------
1. Continuer à améliorer la performance sur les cas ambigus
2. Renforcer l'apprentissage sur les profils atypiques
3. Surveiller le score sur les cas hard
```

---

## 10. Fréquence de Mesure

### 10.1 Mesures Régulières

| Type de Mesure | Fréquence | Contexte |
|----------------|-----------|----------|
| Mesure pré-déploiement | Une fois | Avant déploiement MVP-008 |
| Mesure post-apprentissage | Après chaque cycle | Après validation et déploiement |
| Mesure trimestrielle | Trimestrielle | Dans le cadre de l'audit trimestriel |
| Mesure ad hoc | Sur demande | En cas de suspicion de problème |

### 10.2 Historique de Mesures

Toutes les mesures sont stockées pour permettre l'analyse des tendances :

```sql
CREATE TABLE agreement_measurements (
  id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  engine_version VARCHAR(20) NOT NULL,
  dataset_version VARCHAR(20) NOT NULL,
  
  overall_score FLOAT NOT NULL,
  decision_agreement FLOAT NOT NULL,
  confidence_agreement FLOAT NOT NULL,
  justification_agreement FLOAT NOT NULL,
  
  details JSON,
  
  comparison_delta FLOAT,
  comparison_previous_score JSON,
  
  requires_rollback BOOLEAN,
  requires_alert BOOLEAN,
  reason TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_measurements_timestamp ON agreement_measurements(timestamp);
CREATE INDEX idx_measurements_version ON agreement_measurements(engine_version);
```

---

## 11. Analyse des Tendances

### 11.1 Tendance sur 6 Mois

```typescript
function analyzeSixMonthTrend(): TrendAnalysis {
  const measurements = getMeasurementsLast6Months();
  
  const scores = measurements.map(m => m.overallScore);
  
  const trend = calculateLinearTrend(scores);
  
  return {
    startScore: scores[0],
    endScore: scores[scores.length - 1],
    delta: scores[scores.length - 1] - scores[0],
    trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
    trendRate: trend,
    volatility: calculateVolatility(scores)
  };
}
```

### 11.2 Tendance par Catégorie

```typescript
function analyzeCategoryTrends(): CategoryTrendAnalysis {
  const measurements = getMeasurementsLast6Months();
  
  const trends = {
    byDifficulty: analyzeTrendByCategory(measurements, 'byDifficulty'),
    byProfileType: analyzeTrendByCategory(measurements, 'byProfileType'),
    bySector: analyzeTrendByCategory(measurements, 'bySector'),
    byExperienceLevel: analyzeTrendByCategory(measurements, 'byExperienceLevel')
  };
  
  return trends;
}
```

---

## 12. Intégration avec le Golden Dataset

### 12.1 Utilisation du Golden Dataset

Le golden dataset (DOC-008-09) est utilisé comme référence pour toutes les mesures :

- **Composition :** 100 cas avec décision humaine connue
- **Diversité :** 10 secteurs, 5 niveaux d'expérience, profils atypiques inclus
- **Qualité :** Cas validés par le comité de gouvernance

### 12.2 Mise à jour du Dataset

Lorsque le golden dataset est mis à jour :

- Recalculer le score d'accord avec le nouveau dataset
- Comparer avec le score précédent
- Si différence significative (> 5%) : investigation requise

---

## 13. Intégration avec les Autres Garde-Fous

### 13.1 Intégration avec Garde-Fou 4 (Rollback)

Le protocole de mesure d'accord déclenche le rollback si :

- Le score d'accord baisse de plus de 5%
- Le score d'accord passe sous le seuil MVP (75%)

### 13.2 Intégration avec Garde-Fou 5 (Audit Trimestriel)

Le score d'accord est inclus dans le rapport d'audit trimestriel :

- Tendance sur le trimestre
- Comparaison avec les objectifs
- Recommandations si nécessaire

---

## 14. Métriques de Suivi

### 14.1 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Accord global | Score d'accord global | ≥ 75% (MVP), ≥ 85% (V2) |
| Accord par difficulté (easy) | Score pour cas faciles | ≥ 90% (MVP), ≥ 95% (V2) |
| Accord par difficulté (hard) | Score pour cas difficiles | ≥ 60% (MVP), ≥ 75% (V2) |
| Accord par profil (standard) | Score pour profils standards | ≥ 85% (MVP), ≥ 90% (V2) |
| Accord par profil (atypique) | Score pour profils atypiques | ≥ 65% (MVP), ≥ 80% (V2) |

### 14.2 Métriques de Stabilité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Tendance 6 mois | Évolution sur 6 mois | ≥ 0% (croissance ou stable) |
| Volatilité | Variabilité des scores | ≤ 10% |
| Taux de rollback | Rollbacks / mesures | ≤ 5% |

---

## 15. Interface de Visualisation

### 15.1 Dashboard de Performance

```
┌─────────────────────────────────────────┐
│ ACCORD MOTEUR / HUMAIN                 │
├─────────────────────────────────────────┤
│                                         │
│ Score global : 82%                      │
│ Cible MVP : 75% ✓                      │
│ Cible V2 : 85%                         │
│                                         │
│ Tendance : ▲ +2% (dernier mois)        │
│                                         │
│ Détail par catégorie :                 │
│ ┌─────────────────────────────────┐   │
│ │ Easy     : 92% ████████████████ │   │
│ │ Medium   : 78% ████████████    │   │
│ │ Hard     : 65% ████████       │   │
│ │ Ambiguous: 55% ██████         │   │
│ └─────────────────────────────────┘   │
│                                         │
│ Par type de profil :                   │
│ ┌─────────────────────────────────┐   │
│ │ Standard : 88% ███████████████ │   │
│ │ Atypique : 70% ██████████     │   │
│ │ Edge case: 52% ██████         │   │
│ └─────────────────────────────────┘   │
│                                         │
│ Historique :                            │
│ ┌─────────────────────────────────┐   │
│ │ 80% ────────────────────────    │   │
│ │ 82% ────────────────────────    │   │
│ │ 81% ────────────────────────    │   │
│ │ 82% ────────────────────────    │   │
│ └─────────────────────────────────┘   │
│                                         │
│ [Voir détails]  [Exporter le rapport] │
└─────────────────────────────────────────┘
```

---

## 16. Conclusion

Le protocole de mesure de l'accord moteur / humain garantit :

- **Mesure objective** de la performance du moteur
- **Validation continue** avant et après chaque apprentissage
- **Rollback automatique** si l'accord baisse significativement
- **Analyse détaillée** par catégorie pour identifier les faiblesses
- **Suivi des tendances** pour évaluer l'amélioration continue
- **Traçabilité complète** de toutes les mesures
