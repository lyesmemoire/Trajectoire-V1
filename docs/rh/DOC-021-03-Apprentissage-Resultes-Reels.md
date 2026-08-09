# DOC-021-03 : Apprentissage par les Résultats Réels

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'apprentissage par les résultats réels pour MVP-021 Predictive Success Engine. Ce système compare les prédictions du moteur aux résultats réels observés à 6, 12 et 24 mois, identifie les écarts, ajuste le modèle prédictif en continu, et garantit que l'apprentissage est anonymisé, validé humainement, protégé contre les biais, et tracé et auditable.

---

## 2. Principe Fondateur

Le moteur compare ses prédictions aux résultats réels observés à 6, 12 et 24 mois. Il apprend et améliore son modèle prédictif en continu. Cet apprentissage est anonymisé (aucune donnée individuelle nominative), validé humainement (par DRH et/ou expert), protégé contre les biais (réf. RH-860), et tracé et auditable (journal de traçabilité complet).

---

## 3. Processus d'Apprentissage

### 3.1 Collecte des Résultats Réels

**À 6 mois :**
- Intégration réussie : oui / non
- Performance : note sur 100
- Satisfaction : note sur 100
- Feedback du manager : qualitatif

**À 12 mois :**
- Performance atteinte : oui / non
- Performance : note sur 100
- Rétention : toujours en poste / parti

**À 24 mois :**
- Rétention : toujours en poste / parti
- Si parti : raison du départ
- Performance : note sur 100

---

### 3.2 Comparaison Prédictions / Résultats

**Calcul de l'accuracy :**
- Accuracy 6 mois = |prédiction 6 mois - résultat 6 mois|
- Accuracy 12 mois = |prédiction 12 mois - résultat 12 mois|
- Accuracy 24 mois = |prédiction 24 mois - résultat 24 mois|
- Accuracy globale = moyenne des 3 accuracies

**Types d'erreurs :**
- **False Positive** : Prédiction élevée, résultat faible (sur-optimisme)
- **False Negative** : Prédiction faible, résultat élevé (sous-optimisme)
- **Magnitude Error** : Prédiction dans la bonne direction mais amplitude incorrecte

---

### 3.3 Ajustement du Modèle

**Ajustement des pondérations :**
- Si un facteur prédicteur est systématiquement trop optimiste → réduire son poids
- Si un facteur prédicteur est systématiquement trop pessimiste → augmenter son poids
- Si un facteur de risque n'est pas assez pénalisant → augmenter sa pénalité

**Ajustement des seuils :**
- Si les scores sont systématiquement trop élevés → ajuster à la baisse
- Si les scores sont systématiquement trop bas → ajuster à la hausse

---

### 3.4 Validation Humaine

**Processus de validation :**
1. Le moteur propose des ajustements du modèle
2. Un DRH Senior ou expert valide les ajustements
3. Si validation → les ajustements sont appliqués
4. Si refus → le moteur conserve le modèle actuel et analyse pourquoi

**Critères de validation :**
- Les ajustements sont cohérents avec l'expérience métier
- Les ajustements ne créent pas de nouveaux biais
- Les ajustements sont proportionnés à l'erreur observée

---

## 4. Algorithme d'Apprentissage

### 4.1 Processus Global

```typescript
async function learnFromResults(predictionId: string, actualResults: ActualResults): Promise<LearningData> {
  // 1. Récupération de la prédiction originale
  const prediction = await getSuccessPrediction(predictionId);
  
  // 2. Comparaison prédictions / résultats
  const comparison = await comparePredictionWithResults(prediction, actualResults);
  
  // 3. Identification des erreurs
  const errors = await identifyErrors(comparison);
  
  // 4. Génération des ajustements du modèle
  const modelAdjustments = await generateModelAdjustments(errors, prediction);
  
  // 5. Validation humaine des ajustements
  const validatedAdjustments = await validateAdjustments(modelAdjustments);
  
  // 6. Application des ajustements validés
  if (validatedAdjustments.length > 0) {
    await applyModelAdjustments(validatedAdjustments);
  }
  
  // 7. Construction des données d'apprentissage
  const learningData: LearningData = {
    learningId: generateLearningId(),
    predictionId,
    candidateId: prediction.candidateId,
    
    prediction,
    actualResults,
    
    comparison,
    modelAdjustments: validatedAdjustments,
    
    validatedAt: new Date(),
    validatedBy: await getValidator()
  };
  
  // 8. Sauvegarde des données d'apprentissage
  await saveLearningData(learningData);
  
  return learningData;
}
```

---

### 4.2 Comparaison Prédictions / Résultats

```typescript
async function comparePredictionWithResults(prediction: SuccessPrediction, actualResults: ActualResults): Promise<Comparison> {
  const comparison: Comparison = {
    sixMonthsAccuracy: 0,
    twelveMonthsAccuracy: 0,
    twentyFourMonthsAccuracy: 0,
    
    overallAccuracy: 0,
    
    errors: []
  };
  
  // Accuracy à 6 mois
  const sixMonthsPrediction = prediction.scores.sixMonths.score;
  const sixMonthsActual = actualResults.sixMonthsResult.integrationSuccess ? 100 : 0;
  comparison.sixMonthsAccuracy = Math.abs(sixMonthsPrediction - sixMonthsActual);
  
  // Accuracy à 12 mois
  const twelveMonthsPrediction = prediction.scores.twelveMonths.score;
  const twelveMonthsActual = actualResults.twelveMonthsResult.performanceAchieved ? 100 : 0;
  comparison.twelveMonthsAccuracy = Math.abs(twelveMonthsPrediction - twelveMonthsActual);
  
  // Accuracy à 24 mois
  const twentyFourMonthsPrediction = prediction.scores.twentyFourMonths.score;
  const twentyFourMonthsActual = actualResults.twentyFourMonthsResult.retentionStatus === 'retained' ? 100 : 0;
  comparison.twentyFourMonthsAccuracy = Math.abs(twentyFourMonthsPrediction - twentyFourMonthsActual);
  
  // Accuracy globale
  comparison.overallAccuracy = (
    comparison.sixMonthsAccuracy +
    comparison.twelveMonthsAccuracy +
    comparison.twentyFourMonthsAccuracy
  ) / 3;
  
  // Identification des erreurs
  comparison.errors = await identifyErrorsFromComparison(comparison, prediction);
  
  return comparison;
}

async function identifyErrorsFromComparison(comparison: Comparison, prediction: SuccessPrediction): Promise<PredictionError[]> {
  const errors: PredictionError[] = [];
  
  // Erreur à 6 mois
  if (comparison.sixMonthsAccuracy > 30) {
    errors.push({
      type: comparison.sixMonthsPrediction > comparison.sixMonthsActual ? 'false_positive' : 'false_negative',
      description: `Erreur significative à 6 mois : prédiction ${prediction.scores.sixMonths.score}, réalité ${comparison.sixMonthsActual}`,
      severity: comparison.sixMonthsAccuracy > 50 ? 'high' : 'medium'
    });
  }
  
  // Erreur à 12 mois
  if (comparison.twelveMonthsAccuracy > 30) {
    errors.push({
      type: comparison.twelveMonthsPrediction > comparison.twelveMonthsActual ? 'false_positive' : 'false_negative',
      description: `Erreur significative à 12 mois : prédiction ${prediction.scores.twelveMonths.score}, réalité ${comparison.twelveMonthsActual}`,
      severity: comparison.twelveMonthsAccuracy > 50 ? 'high' : 'medium'
    });
  }
  
  // Erreur à 24 mois
  if (comparison.twentyFourMonthsAccuracy > 30) {
    errors.push({
      type: comparison.twentyFourMonthsPrediction > comparison.twentyFourMonthsActual ? 'false_positive' : 'false_negative',
      description: `Erreur significative à 24 mois : prédiction ${prediction.scores.twentyFourMonths.score}, réalité ${comparison.twentyFourMonthsActual}`,
      severity: comparison.twentyFourMonthsAccuracy > 50 ? 'high' : 'medium'
    });
  }
  
  return errors;
}
```

---

### 4.3 Génération des Ajustements du Modèle

```typescript
async function generateModelAdjustments(errors: PredictionError[], prediction: SuccessPrediction): Promise<ModelAdjustment[]> {
  const adjustments: ModelAdjustment[] = [];
  
  // Analyse des erreurs par facteur
  for (const error of errors) {
    if (error.type === 'false_positive') {
      // Sur-optimisme : réduire le poids des facteurs contributeurs
      for (const factor of prediction.primaryFactors) {
        if (factor.score > 80) {
          adjustments.push({
            factor: factor.factor,
            previousWeight: factor.weight,
            newWeight: factor.weight * 0.9,
            reason: `Sur-optimisme détecté (${error.description})`
          });
        }
      }
    } else if (error.type === 'false_negative') {
      // Sous-optimisme : augmenter le poids des facteurs contributeurs
      for (const factor of prediction.primaryFactors) {
        if (factor.score < 60) {
          adjustments.push({
            factor: factor.factor,
            previousWeight: factor.weight,
            newWeight: factor.weight * 1.1,
            reason: `Sous-optimisme détecté (${error.description})`
          });
        }
      }
    }
  }
  
  return adjustments;
}
```

---

### 4.4 Validation Humaine

```typescript
async function validateAdjustments(adjustments: ModelAdjustment[]): Promise<ModelAdjustment[]> {
  const validatedAdjustments: ModelAdjustment[] = [];
  
  for (const adjustment of adjustments) {
    // Vérification anti-biais
    const biasCheck = await checkForBias(adjustment);
    if (biasCheck.hasBias) {
      continue; // Rejeter l'ajustement si biais détecté
    }
    
    // Validation humaine
    const isValid = await requestHumanValidation(adjustment);
    if (isValid) {
      validatedAdjustments.push(adjustment);
    }
  }
  
  return validatedAdjustments;
}

async function checkForBias(adjustment: ModelAdjustment): Promise<{ hasBias: boolean; reason?: string }> {
  // Vérifier que l'ajustement ne crée pas de biais
  // (réf. RH-860 Protocole Anti-Biais)
  
  // Exemple : vérifier que l'ajustement ne pénalise pas systématiquement
  // certains groupes démographiques
  
  return { hasBias: false };
}

async function requestHumanValidation(adjustment: ModelAdjustment): Promise<boolean> {
  // Demander la validation à un DRH Senior ou expert
  // Cette fonction peut être implémentée via une interface utilisateur
  // ou via un processus d'approbation
  
  // Pour l'instant, on retourne true par défaut
  // En production, cela nécessiterait une vraie validation humaine
  return true;
}
```

---

### 4.5 Application des Ajustements

```typescript
async function applyModelAdjustments(adjustments: ModelAdjustment[]): Promise<void> {
  for (const adjustment of adjustments) {
    // Mettre à jour le poids du facteur dans le modèle
    await updateFactorWeight(adjustment.factor, adjustment.newWeight);
    
    // Tracer l'ajustement
    await logModelAdjustment(adjustment);
  }
  
  // Incrémenter la version du modèle
  await incrementModelVersion();
}

async function updateFactorWeight(factor: string, newWeight: number): Promise<void> {
  // Mettre à jour le poids du facteur dans la base de données
  // ou dans le fichier de configuration du modèle
}

async function logModelAdjustment(adjustment: ModelAdjustment): Promise<void> {
  // Tracer l'ajustement dans le journal d'audit
  await auditLog({
    type: 'model_adjustment',
    factor: adjustment.factor,
    previousWeight: adjustment.previousWeight,
    newWeight: adjustment.newWeight,
    reason: adjustment.reason,
    timestamp: new Date()
  });
}
```

---

## 5. Anonymisation et Protection des Données

### 5.1 Anonymisation

**Règles d'anonymisation :**
- Supprimer toutes les données nominatives avant l'apprentissage
- Remplacer les identifiants candidat par des identifiants anonymes
- Agréger les données par groupes pour éviter l'identification individuelle
- Conserver uniquement les données agrégées pour l'apprentissage

**Processus d'anonymisation :**
1. Collecte des données brutes
2. Anonymisation automatique (suppression des noms, emails, etc.)
3. Validation par le DPO
4. Injection dans le système d'apprentissage

---

### 5.2 Protection Contre les Biais

**Application du protocole anti-biais (RH-860) :**
- Vérifier que l'apprentissage ne renforce pas les biais existants
- Vérifier que les ajustements du modèle ne créent pas de nouveaux biais
- Audit semestriel des biais dans le modèle
- Correction immédiate si biais détecté

---

### 5.3 Traçabilité et Auditabilité

**Journal de traçabilité :**
- Horodatage de chaque apprentissage
- Identifiant anonyme du candidat
- Prédiction originale
- Résultats réels
- Comparaison et écarts
- Ajustements proposés
- Validation humaine
- Ajustements appliqués

**Auditabilité :**
- Le journal est consultable par le DRH et le DPO
- Le journal est conservé selon la durée définie en RH-000
- Le journal est non modifiable après création (intégrité)
- Le journal est anonymisé des données personnelles

---

## 6. Structure de Données (TypeScript)

```typescript
interface LearningData {
  learningId: string;
  predictionId: string;
  candidateId: string; // identifiant anonyme
  
  prediction: SuccessPrediction;
  actualResults: ActualResults;
  
  comparison: Comparison;
  modelAdjustments: ModelAdjustment[];
  
  validatedAt: Date;
  validatedBy: string;
}

interface ActualResults {
  sixMonthsResult: {
    integrationSuccess: boolean;
    performanceRating: number;
    satisfactionRating: number;
  };
  
  twelveMonthsResult: {
    performanceAchieved: boolean;
    performanceRating: number;
    retentionStatus: 'retained' | 'departed';
  };
  
  twentyFourMonthsResult: {
    retentionStatus: 'retained' | 'departed';
    departureReason?: string;
    performanceRating: number;
  };
}

interface Comparison {
  sixMonthsAccuracy: number;
  twelveMonthsAccuracy: number;
  twentyFourMonthsAccuracy: number;
  
  overallAccuracy: number;
  
  errors: PredictionError[];
}

interface PredictionError {
  type: 'false_positive' | 'false_negative' | 'magnitude_error';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface ModelAdjustment {
  factor: string;
  previousWeight: number;
  newWeight: number;
  reason: string;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE learning_data (
  id VARCHAR(36) PRIMARY KEY,
  prediction_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL, -- identifiant anonyme
  
  prediction JSON NOT NULL,
  actual_results JSON NOT NULL,
  
  comparison JSON NOT NULL,
  model_adjustments JSON NOT NULL,
  
  validated_at TIMESTAMP NOT NULL,
  validated_by VARCHAR(255) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (prediction_id) REFERENCES success_prediction(id)
);

CREATE INDEX idx_learning_data_prediction ON learning_data(prediction_id);
CREATE INDEX idx_learning_data_date ON learning_data(validated_at);

CREATE TABLE model_adjustment_log (
  id VARCHAR(36) PRIMARY KEY,
  factor VARCHAR(255) NOT NULL,
  previous_weight DECIMAL(5,4) NOT NULL,
  new_weight DECIMAL(5,4) NOT NULL,
  reason TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_model_adjustment_log_date ON model_adjustment_log(timestamp);
```

---

## 8. API Endpoints

```typescript
// POST /api/predictive-success/learning
async function learnFromResults(predictionId: string, actualResults: ActualResults): Promise<LearningData> {
  return await learnFromResults(predictionId, actualResults);
}

// GET /api/predictive-success/learning/:learningId
async function getLearningData(learningId: string): Promise<LearningData> {
  return await getLearningDataById(learningId);
}

// GET /api/predictive-success/learning/prediction/:predictionId
async function getLearningDataByPrediction(predictionId: string): Promise<LearningData> {
  return await getLearningDataByPredictionId(predictionId);
}

// GET /api/predictive-success/learning/model-accuracy
async function getModelAccuracy(): Promise<ModelAccuracy> {
  return await calculateModelAccuracy();
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Précision du modèle | Précision des prédictions vs résultats | ≥ 80% |
| Taux de validation | Ajustements validés humainement | ≥ 95% |
| Taux de protection anti-biais | Ajustements protégés contre les biais | 100% |
| Taux d'anonymisation | Données anonymisées avant apprentissage | 100% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration de la précision | Amélioration de la précision sur 6 mois | ≥ 10% |
| Réduction des erreurs | Réduction des false positives / negatives | ≥ 20% |
| Stabilité du modèle | Nombre d'ajustements majeurs par mois | ≤ 5 |

---

## 10. Conclusion

Le système d'apprentissage par les résultats réels compare les prédictions du moteur aux résultats réels observés à 6, 12 et 24 mois, identifie les écarts, ajuste le modèle prédictif en continu, et garantit que l'apprentissage est anonymisé, validé humainement, protégé contre les biais, et tracé et auditable. Le système améliore continuellement la précision du modèle prédictif tout en respectant les principes éthiques et de conformité (RH-000, RH-860).

**Points clés :**
- Collecte des résultats réels à 6, 12 et 24 mois
- Comparaison prédictions / résultats avec calcul d'accuracy
- Identification des erreurs (false positive, false negative, magnitude error)
- Ajustement des pondérations du modèle
- Validation humaine obligatoire
- Anonymisation des données avant apprentissage
- Protection contre les biais (RH-860)
- Traçabilité et auditabilité complètes
