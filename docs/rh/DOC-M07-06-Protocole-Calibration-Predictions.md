# DOC-M07-06 : Protocole de Calibration des Prédictions

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de calibration des prédictions pour le MVP-META-07 Predictive Intelligence Engine. Ce document structure le processus de comparaison entre les prédictions et la réalité terrain pour améliorer la précision du modèle.

---

## 2. Principe Fondateur

Les prédictions doivent être calibrées régulièrement en comparant les résultats prédits avec la réalité terrain. Ce processus d'apprentissage continu permet d'ajuster les poids des facteurs et d'améliorer la précision du modèle.

---

## 3. Processus de Calibration

### 3.1 Étape 1 — Collecte des Données Terrain

**Données collectées :**
- Statut du candidat à 12 mois (actif / parti)
- Date de départ (si applicable)
- Raison du départ (si applicable)
- Épisodes de burn-out (si applicable)
- Conflits documentés (si applicable)
- Évolution de carrière réelle (poste, durée)

**Période de collecte :**
- À 6 mois : Collecte intermédiaire
- À 12 mois : Collecte finale
- À 24 mois : Collecte long terme

---

### 3.2 Étape 2 — Comparaison Prédiction vs Réalité

**Métriques de comparaison :**

Pour le risque de départ :
- Prédiction : Probabilité estimée
- Réalité : 1 si parti, 0 si actif
- Écart : |Prédiction - Réalité|

Pour le risque de burn-out :
- Prédiction : Niveau de risque
- Réalité : 1 si burn-out documenté, 0 sinon
- Écart : |Prédiction - Réalité|

Pour le risque de conflit :
- Prédiction : Niveau de risque
- Réalité : 1 si conflit documenté, 0 sinon
- Écart : |Prédiction - Réalité|

Pour l'évolution de carrière :
- Prédiction : Durée estimée
- Réalité : Durée réelle
- Écart : |Prédiction - Réalité|

---

### 3.3 Étape 3 — Analyse des Écarts

**Classification des écarts :**
- **Écart faible :** Écart ≤ 10%
- **Écart modéré :** 10% < Écart ≤ 30%
- **Écart élevé :** Écart > 30%

**Analyse des causes :**
- Facteurs mal pondérés
- Nouveaux facteurs non identifiés
- Contexte spécifique non pris en compte
- Données insuffisantes

---

### 3.4 Étape 4 — Ajustement des Poids

**Règles d'ajustement :**
- Si écart faible : Ajustement ± 5%
- Si écart modéré : Ajustement ± 10%
- Si écart élevé : Ajustement ± 20%

**Processus d'ajustement :**
- Réduire le poids des facteurs surestimés
- Augmenter le poids des facteurs sous-estimés
- Ajouter de nouveaux facteurs si nécessaire
- Supprimer les facteurs non pertinents

---

### 3.5 Étape 5 — Validation du Modèle

**Métriques de validation :**
- Taux de précision global : Prédictions correctes / totales
- Taux de précision par type de risque
- Écart moyen global
- Écart moyen par type de risque

**Seuils de validation :**
- Taux de précision global ≥ 70%
- Taux de précision par type ≥ 65%
- Écart moyen global ≤ 15%

---

## 4. Fréquence de Calibration

### 4.1 Calibration Continue

- **Mensuelle :** Collecte des données terrain
- **Trimestrielle :** Analyse des écarts
- **Semestrielle :** Ajustement des poids
- **Annuelle :** Validation du modèle

### 4.2 Calibration Ponctuelle

- **Après changement majeur :** Restructuration, nouveau marché
- **Après alerte qualité :** Taux de précision < 60%
- **Sur demande :** Analyse spécifique

---

## 5. Structure de Données (TypeScript)

```typescript
interface CalibrationData {
  calibrationId: string;
  predictionId: string;
  recruitmentId: string;
  candidateId: string;
  
  predictionType: 'departure' | 'burnout' | 'conflict' | 'evolution';
  
  prediction: {
    value: number;
    level?: string;
  };
  
  reality: {
    value: number;
    level?: string;
    details?: string;
  };
  
  gap: {
    absolute: number;
    percentage: number;
    classification: 'low' | 'moderate' | 'high';
  };
  
  collectedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface CalibrationReport {
  reportId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  predictionType: 'departure' | 'burnout' | 'conflict' | 'evolution';
  
  summary: {
    totalPredictionsReviewed: number;
    accuracyRate: number;
    averageGap: number;
    lowGapCount: number;
    moderateGapCount: number;
    highGapCount: number;
  };
  
  weightAdjustments: {
    factorType: string;
    oldWeight: number;
    newWeight: number;
    reason: string;
  }[];
  
  recommendations: string[];
  
  generatedAt: Date;
  
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
CREATE TABLE calibration_data (
  id VARCHAR(36) PRIMARY KEY,
  prediction_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  prediction_type VARCHAR(20) NOT NULL,
  
  prediction JSON NOT NULL,
  reality JSON NOT NULL,
  gap JSON NOT NULL,
  
  collected_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_calibration_data_prediction ON calibration_data(prediction_id);
CREATE INDEX idx_calibration_data_type ON calibration_data(prediction_type);
CREATE INDEX idx_calibration_data_collected ON calibration_data(collected_at);

CREATE TABLE calibration_report (
  id VARCHAR(36) PRIMARY KEY,
  
  period JSON NOT NULL,
  prediction_type VARCHAR(20) NOT NULL,
  
  summary JSON NOT NULL,
  weight_adjustments JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_calibration_report_type ON calibration_report(prediction_type);
CREATE INDEX idx_calibration_report_generated ON calibration_report(generated_at);
```

---

## 7. API Endpoints

```typescript
// POST /api/calibration/collect
async function collectCalibrationData(predictionId: string, reality: any): Promise<CalibrationData> {
  return await collectCalibrationData(predictionId, reality);
}

// GET /api/calibration/data/:calibrationId
async function getCalibrationData(calibrationId: string): Promise<CalibrationData> {
  return await getCalibrationData(calibrationId);
}

// POST /api/calibration/report/generate
async function generateCalibrationReport(predictionType: string, startDate: Date, endDate: Date): Promise<CalibrationReport> {
  return await generateCalibrationReport(predictionType, startDate, endDate);
}

// GET /api/calibration/report/:reportId
async function getCalibrationReport(reportId: string): Promise<CalibrationReport> {
  return await getCalibrationReport(reportId);
}

// PUT /api/calibration/weights/adjust
async function adjustWeights(adjustments: any[]): Promise<void> {
  return await adjustWeights(adjustments);
}

// GET /api/calibration/accuracy
async function getAccuracyMetrics(): Promise<any> {
  return await getAccuracyMetrics();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de précision global | Prédictions correctes / totales | ≥ 70% |
- Taux de précision par type | Prédictions correctes / totales par type | ≥ 65% |
- Écart moyen global | Écart moyen / totales | ≤ 15% |

### 8.2 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de collecte | Données collectées / prédictions totales | ≥ 90% |
- Taux d'ajustement | Ajustements appliqués / recommandés | ≥ 80% |

---

## 9. Exemple Complet

```markdown
RAPPORT DE CALIBRATION — RISQUE DE DÉPART

Période : 2026-01-01 à 2026-06-30
Type de prédiction : Départ

Résumé :
- Prédictions revues : 50
- Taux de précision : 72%
- Écart moyen : 12%
- Écarts faibles : 30
- Écarts modérés : 15
- Écarts élevés : 5

Ajustements de poids :
→ Manager incompatible détecté : 25% → 30% (sous-estimé)
→ Culture fit partiel : 15% → 10% (surestimé)

Recommandations :
→ Améliorer la détection du facteur "Manager incompatible"
→ Réévaluer le poids du facteur "Culture fit partiel"
→ Ajouter un facteur "Opportunités externes"
```

---

## 10. Conclusion

Le protocole de calibration des prédictions structure le processus de comparaison entre les prédictions et la réalité terrain. Processus en 5 étapes : Collecte des données terrain (à 6, 12, 24 mois), Comparaison prédiction vs réalité (4 types de risque), Analyse des écarts (faible/modéré/élevé), Ajustement des poids (±5%/±10%/±20%), Validation du modèle (taux de précision ≥ 70%). Fréquence de calibration (mensuelle, trimestrielle, semestrielle, annuelle). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Processus en 5 étapes
- Collecte des données terrain
- Comparaison prédiction vs réalité
- Analyse des écarts
- Ajustement des poids
- Validation du modèle
- Fréquence de calibration
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et de processus
