# DOC-007b-05 : Intégration avec MVP-008

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'intégration entre MVP-007b (Extension Doute Structuré) et MVP-008 (Learning Engine). Les traces de doute servent de données d'entraînement pour améliorer la détection d'incertitude dans le temps.

---

## 2. Principe d'Intégration

Les traces de doute enregistrées par MVP-007b alimentent MVP-008 Learning Engine pour :

- Améliorer la précision de la détection d'incertitude
- Ajuster les seuils de détection
- Optimiser les formulations de doute
- Identifier de nouveaux types de situations de doute
- Améliorer les recommandations de résolution

---

## 3. Flux de Données

### 3.1 Architecture de l'Intégration

```
MVP-007b (Doute Structuré)
    ↓
Enregistrement des traces (DoubtTraceRepository)
    ↓
Anonymisation (DoubtTraceAnonymizer)
    ↓
Export périodique (DoubtTraceExporter)
    ↓
MVP-008 (Learning Engine)
    ↓
Analyse et apprentissage
    ↓
Améliorations proposées
    ↓
Validation et déploiement
    ↓
MVP-007b (Version améliorée)
```

### 3.2 Fréquence d'Export

| Type d'Export | Fréquence | Volume Estimé |
|---------------|-----------|---------------|
| Export incrémental | Quotidien | ~100 traces/jour |
| Export complet | Hebdomadaire | ~700 traces/semaine |
| Export historique | Mensuel | ~3000 traces/mois |

---

## 4. Format des Données d'Apprentissage

### 4.1 Structure de Donnée d'Apprentissage

```typescript
interface DoubtTrainingData {
  // Identifiant unique (anonymisé)
  id: string;
  
  // Timestamp
  timestamp: Date;
  
  // Type de doute
  level: number;
  type: string;
  severity: string;
  
  // Caractéristiques du doute
  features: {
    missingDataCount: number;
    contradictionsCount: number;
    indicatorsCount: number;
    risksCount: number;
    cvCompleteness: number;
    jobCompleteness: number;
    experienceCount: number;
    skillCount: number;
  };
  
  // Formulation
  formulation: {
    certainFactsCount: number;
    reservedEstimatesCount: number;
    unknownsCount: number;
    recommendationsCount: number;
  };
  
  // Résolution (si disponible)
  resolution?: {
    recruiterAction: string;
    resolutionOutcome: string;
    resolutionTime: number; // en heures
    recruiterFeedback: string;
    accuracyRating: number;
  };
  
  // Labels d'apprentissage
  labels: {
    isValidDoubt: boolean;
    isCorrectLevel: boolean;
    isHelpful: boolean;
    resolutionSuccessful: boolean;
  };
  
  // Métadonnées
  metadata: {
    engineVersion: string;
    anonymized: true;
    exportBatch: string;
  };
}
```

### 4.2 Processus d'Anonymisation

```typescript
function anonymizeDoubtTrace(trace: DoubtTrace): DoubtTrainingData {
  return {
    id: hash(trace.id), // Hash de l'ID original
    timestamp: trace.timestamp,
    level: trace.level,
    type: trace.type,
    severity: trace.severity,
    features: extractFeatures(trace),
    formulation: extractFormulationFeatures(trace),
    resolution: trace.resolution ? {
      recruiterAction: trace.recruiterAction,
      resolutionOutcome: trace.resolutionOutcome,
      resolutionTime: calculateResolutionTime(trace),
      recruiterFeedback: trace.recruiterFeedback,
      accuracyRating: trace.accuracyRating,
    } : undefined,
    labels: generateLabels(trace),
    metadata: {
      engineVersion: trace.engineVersion,
      anonymized: true,
      exportBatch: generateBatchId(),
    },
  };
}

function extractFeatures(trace: DoubtTrace): TrainingFeatures {
  return {
    missingDataCount: trace.missingData.length,
    contradictionsCount: trace.contradictions.length,
    indicatorsCount: trace.indicators.length,
    risksCount: trace.risks.length,
    cvCompleteness: calculateCVCompleteness(trace),
    jobCompleteness: calculateJobCompleteness(trace),
    experienceCount: trace.certainFacts.filter(f => f.includes('expérience')).length,
    skillCount: trace.certainFacts.filter(f => f.includes('compétence')).length,
  };
}

function generateLabels(trace: DoubtTrace): TrainingLabels {
  return {
    isValidDoubt: trace.resolutionOutcome !== 'unresolved',
    isCorrectLevel: trace.accuracyRating >= 3,
    isHelpful: trace.accuracyRating >= 4,
    resolutionSuccessful: trace.resolutionOutcome === 'resolved',
  };
}
```

---

## 5. Pipeline d'Apprentissage

### 5.1 Étape 1 : Collecte des Données

**Source :** DoubtTraceRepository

**Filtres appliqués :**
- Traces avec résolution complète uniquement
- Traces avec feedback du recruteur
- Traces âgées d'au moins 7 jours (pour permettre la résolution)

**Volume cible :** 10 000 traces minimum pour l'entraînement initial

### 5.2 Étape 2 : Prétraitement

**Opérations :**
- Nettoyage des données (suppression des traces invalides)
- Normalisation des features
- Équilibrage des classes (sur/sous-échantillonnage)
- Encodage des variables catégorielles

```typescript
function preprocessTrainingData(data: DoubtTrainingData[]): ProcessedTrainingData {
  // Nettoyage
  const cleaned = data.filter(d => d.labels.isValidDoubt);
  
  // Normalisation
  const normalized = normalizeFeatures(cleaned);
  
  // Équilibrage
  const balanced = balanceClasses(normalized);
  
  // Encodage
  const encoded = encodeCategoricalVariables(balanced);
  
  return encoded;
}
```

### 5.3 Étape 3 : Entraînement des Modèles

**Modèles entraînés :**

#### 5.3.1 Modèle de Classification de Niveau de Doute

**Objectif :** Prédire le niveau de doute (1-4) à partir des features

**Algorithme :** Random Forest ou Gradient Boosting

**Features :**
- Complétude CV
- Complétude fiche de poste
- Nombre de données manquantes
- Nombre de contradictions
- Nombre d'indicateurs de zone grise

**Labels :** Niveau de doute (1-4)

**Métriques cibles :**
- Accuracy : ≥ 0.90
- F1-score : ≥ 0.85

#### 5.3.2 Modèle de Détection de Type de Doute

**Objectif :** Prédire le type de doute (DI-1.1, SC-2.1, etc.)

**Algorithme :** Multi-class Classification

**Features :**
- Pattern de données manquantes
- Pattern de contradictions
- Caractéristiques du CV
- Caractéristiques du poste

**Labels :** Type de doute (sous-catégories)

**Métriques cibles :**
- Accuracy : ≥ 0.85
- F1-score macro : ≥ 0.80

#### 5.3.3 Modèle de Prédiction de Résolution

**Objectif :** Prédire si un doute sera résolu avec succès

**Algorithme :** Binary Classification

**Features :**
- Niveau de doute
- Type de doute
- Nombre de recommandations
- Complexité de la formulation

**Labels :** Résolution réussie (oui/non)

**Métriques cibles :**
- Accuracy : ≥ 0.80
- Recall : ≥ 0.75

### 5.4 Étape 4 : Validation

**Validation croisée :** 5-fold cross-validation

**Dataset de test :** 20% des données (non utilisé pour l'entraînement)

**Métriques de validation :**
- Accuracy
- Precision
- Recall
- F1-score
- AUC-ROC

### 5.5 Étape 5 : Déploiement

**Processus de déploiement :**

1. **Tests sur golden dataset** : Valider sur le dataset de test de DOC-007-06
2. **Validation par experts RH** : Revue manuelle des prédictions
3. **A/B testing en production** : Déploiement progressif avec comparaison
4. **Approbation par comité d'éthique** : Validation des implications éthiques
5. **Déploiement complet** : Mise en production

---

## 6. Boucle de Rétroaction

### 6.1 Améliorations Proposées par MVP-008

MVP-008 peut proposer les types d'améliorations suivants :

#### 6.1.1 Ajustement des Seuils de Détection

**Exemple :**
- Seuil de complétude CV : passer de 3 compétences à 2 compétences
- Seuil de contradiction : ajuster la sensibilité de la détection
- Seuil de confiance : ajuster le score de confiance

**Implémentation :**
```typescript
interface ThresholdAdjustment {
  parameter: string;
  currentValue: number;
  proposedValue: number;
  expectedImpact: string;
  confidence: number;
}
```

#### 6.1.2 Amélioration des Formulations

**Exemple :**
- Ajout de nouvelles formulations pour des cas fréquents
- Amélioration de la clarté des formulations existantes
- Personnalisation des formulations par contexte

**Implémentation :**
```typescript
interface FormulationImprovement {
  level: number;
  type: string;
  currentFormulation: string;
  proposedFormulation: string;
  expectedImprovement: string;
  confidence: number;
}
```

#### 6.1.3 Ajout de Nouveaux Types de Doute

**Exemple :**
- Nouvelle sous-catégorie détectée automatiquement
- Nouveau pattern de contradiction
- Nouveau type de risque éthique

**Implémentation :**
```typescript
interface NewDoubtType {
  level: number;
  type: string;
  description: string;
  detectionCriteria: string[];
  formulationTemplate: string;
  confidence: number;
}
```

#### 6.1.4 Optimisation des Recommandations

**Exemple :**
- Amélioration de la pertinence des recommandations
- Ajout de nouvelles actions recommandées
- Personnalisation des recommandations par contexte

**Implémentation :**
```typescript
interface RecommendationOptimization {
  level: number;
  type: string;
  currentRecommendations: string[];
  proposedRecommendations: string[];
  expectedImprovement: string;
  confidence: number;
}
```

### 6.2 Processus de Validation des Améliorations

**Étape 1 : Revue Technique**
- Revue par l'équipe technique
- Validation de l'implémentation
- Tests unitaires et d'intégration

**Étape 2 : Revue Métier**
- Revue par les experts RH
- Validation de la pertinence métier
- Tests sur cas réels

**Étape 3 : Validation Éthique**
- Revue par le comité d'éthique
- Validation de la conformité RH-000 et RH-860
- Analyse des risques potentiels

**Étape 4 : A/B Testing**
- Déploiement progressif
- Comparaison avec la version actuelle
- Analyse des métriques

**Étape 5 : Approbation Finale**
- Approbation par le comité de changement
- Documentation de la modification
- Plan de rollback si nécessaire

---

## 7. API d'Intégration

### 7.1 Endpoint d'Export

```
POST /api/mvp-007b/doubt-traces/export
```

**Body :**
```json
{
  "period": {
    "from": "2026-08-01T00:00:00Z",
    "to": "2026-08-03T23:59:59Z"
  },
  "filters": {
    "level": [1, 2, 3, 4],
    "withResolution": true,
    "withFeedback": true
  },
  "format": "json",
  "anonymized": true
}
```

**Response :**
```json
{
  "batchId": "batch-2026-08-03-001",
  "count": 150,
  "downloadUrl": "https://...",
  "expiresAt": "2026-08-10T00:00:00Z"
}
```

### 7.2 Endpoint de Réception des Améliorations

```
POST /api/mvp-007b/doubt-detection/improvements
```

**Body :**
```json
{
  "batchId": "batch-2026-08-03-001",
  "improvements": [
    {
      "type": "threshold_adjustment",
      "parameter": "cvCompletenessThreshold",
      "currentValue": 3,
      "proposedValue": 2,
      "expectedImpact": "Augmentation de 5% de la détection de doutes NIVEAU 1",
      "confidence": 0.85
    }
  ]
}
```

**Response :**
```json
{
  "status": "received",
  "improvementIds": ["imp-001", "imp-002"],
  "reviewScheduled": "2026-08-04T10:00:00Z"
}
```

### 7.3 Endpoint de Statistiques d'Apprentissage

```
GET /api/mvp-007b/doubt-detection/learning-stats
```

**Response :**
```json
{
  "totalTraces": 10000,
  "trainingDataSize": 8500,
  "modelAccuracy": 0.92,
  "lastTrainingDate": "2026-08-01T00:00:00Z",
  "nextTrainingScheduled": "2026-08-08T00:00:00Z",
  "improvementsPending": 5,
  "improvementsDeployed": 23
}
```

---

## 8. Métriques de Suivi

### 8.1 Métriques d'Apprentissage

| Métrique | Description | Cible |
|----------|-------------|-------|
| Volume de données d'entraînement | Nombre de traces utilisées pour l'entraînement | ≥ 10 000 |
| Fréquence de réentraînement | Périodicité du réentraînement des modèles | Hebdomadaire |
| Accuracy du modèle | Précision de la classification | ≥ 0.90 |
| F1-score du modèle | Score F1 moyen | ≥ 0.85 |
| Temps d'entraînement | Durée d'entraînement des modèles | < 2 heures |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration de la précision de détection | Comparaison avant/après déploiement | ≥ +5% |
| Réduction des faux positifs | Comparaison avant/après déploiement | ≥ -10% |
| Satisfaction du recruteur | Moyenne des accuracy ratings | ≥ 4.5/5 |
| Taux d'adoption des améliorations | Pourcentage d'améliorations déployées | ≥ 80% |

---

## 9. Gouvernance

### 9.1 Comité de Revue

Un comité de revue supervise l'intégration avec MVP-008 :

**Membres :**
- Lead Technique MVP-007
- Lead Technique MVP-008
- Expert RH Senior
- Expert Conformité
- Expert Éthique

**Responsabilités :**
- Valider les améliorations proposées
- Approuver les déploiements
- Surveiller les métriques d'impact
- Gérer les risques éthiques

### 9.2 Processus de Gouvernance

**Réunion hebdomadaire :**
- Revue des améliorations proposées
- Analyse des métriques
- Décision sur les déploiements

**Rapport mensuel :**
- État de l'intégration
- Métriques d'impact
- Risques identifiés
- Recommandations

**Audit trimestriel :**
- Audit de conformité
- Audit éthique
- Audit de performance

---

## 10. Sécurité et Confidentialité

### 10.1 Protection des Données

Les données exportées vers MVP-008 doivent être :

- **Anonymisées** : Suppression des identifiants personnels
- **Chiffrées** : Chiffrement pendant le transit et au repos
- **Contrôlées** : Accès restreint aux équipes autorisées

### 10.2 Conformité RGPD

L'intégration doit respecter le RGPD :

- **Base légale** : Intérêt légitime pour l'amélioration du système
- **Minimisation des données** : Export uniquement des données nécessaires
- **Limitation de la conservation** : Conservation limitée à 2 ans
- **Droit d'opposition** : Possibilité pour les candidats de s'opposer

### 10.3 Audit de Sécurité

Un audit de sécurité doit être effectué :

- **Fréquence :** Annuelle
- **Scope :** Pipeline d'export, stockage, accès
- **Rapport :** Documenté et partagé avec le comité de gouvernance

---

## 11. Cas d'Utilisation

### 11.1 Cas 1 : Amélioration de la Détection de Données Insuffisantes

**Situation :** Le modèle détecte que le seuil de complétude CV est trop élevé.

**Action MVP-008 :**
- Analyse des traces de doutes NIVEAU 1
- Identification du seuil optimal
- Proposition d'ajustement de 3 à 2 compétences

**Validation :**
- Tests sur golden dataset
- Validation par experts RH
- A/B testing en production

**Résultat :** Augmentation de 8% de la détection de doutes NIVEAU 1 avec réduction de 5% des faux positifs.

### 11.2 Cas 2 : Nouveau Type de Contradiction Détecté

**Situation :** Le modèle identifie un nouveau pattern de contradiction non couvert par la taxonomie.

**Action MVP-008 :**
- Clustering des traces de doutes NIVEAU 2
- Identification d'un cluster distinct
- Proposition d'un nouveau type SC-2.5

**Validation :**
- Revue par experts RH
- Définition de la formulation
- Ajout à la taxonomie

**Résultat :** Ajout de SC-2.5 "Incohérence de progression salariale" à la taxonomie.

### 11.3 Cas 3 : Optimisation des Recommandations

**Situation :** Les recommandations pour les doutes NIVEAU 3 ont un faible taux de résolution.

**Action MVP-008 :**
- Analyse des traces de résolution
- Identification des recommandations les plus efficaces
- Proposition d'optimisation

**Validation :**
- Tests A/B
- Validation par experts RH

**Résultat :** Amélioration de 15% du taux de résolution pour les doutes NIVEAU 3.

---

## 12. Maintenance

### 12.1 Maintenance du Pipeline

Le pipeline d'intégration doit être maintenu :

- **Mise à jour des schémas** : Lors de l'évolution des structures de données
- **Optimisation des performances** : Amélioration continue du temps de traitement
- **Surveillance des erreurs** : Monitoring et correction des erreurs

### 12.2 Maintenance des Modèles

Les modèles d'apprentissage doivent être maintenus :

- **Réentraînement régulier** : Hebdomadaire
- **Monitoring du drift** : Surveillance de la dégradation des performances
- **Mise à jour des algorithmes** : Adoption de nouvelles techniques si pertinent

### 12.3 Documentation

La documentation doit être maintenue à jour :

- **Mise à jour des spécifications** : Lors des changements
- **Documentation des améliorations** : Historique des modifications
- **Guides d'utilisation** : Pour les équipes techniques et métier

---

## 13. Conclusion

L'intégration avec MVP-008 garantit :

- **Amélioration continue** de la détection d'incertitude
- **Adaptation** aux nouveaux cas d'usage
- **Optimisation** des performances du système
- **Traçabilité** des améliorations
- **Conformité** éthique et réglementaire
- **Transparence** du processus d'apprentissage
