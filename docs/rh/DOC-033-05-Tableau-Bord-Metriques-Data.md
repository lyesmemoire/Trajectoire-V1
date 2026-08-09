# DOC-033-05 : Tableau de Bord des Métriques Data

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le tableau de bord des métriques data pour MVP-033 Real Data Foundation. Ce tableau de bord permet de surveiller en temps réel la qualité, le volume, la fraîcheur, et l'impact des données collectées, avec des alertes automatiques pour identifier les problèmes potentiels.

---

## 2. Principe Fondateur

Ce qui ne se mesure pas ne s'améliore pas. Le tableau de bord des métriques data permet de surveiller la santé de la base de données en temps réel, d'identifier les problèmes potentiels, et de prendre des décisions basées sur des données factuelles.

---

## 3. Structure du Tableau de Bord

### 3.1 Vue d'Ensemble

**KPI Principaux :**
```
VOLUME TOTAL
Entretiens anonymisés : 750 / 1000 (75%)
Paires CV/Poste : 450 / 1000 (45%)
Patterns identifiés : 65 / 100 (65%)

QUALITÉ
Taux de données complètes : 82%
Taux de données avec résultats à 12 mois : 68%
Taux de validation des patterns : 74%

FRAÎCHEUR
< 1 an : 45%
1-3 ans : 35%
> 3 ans : 20%

IMPACT
Accord moteur / humain : 72%
Taux de succès à 12 mois : +28%
Satisfaction recruteurs : 4.3/5
```

---

### 3.2 Métriques de Volume

**Volume par Source :**
```
Cabinets de recrutement : 450 entretiens
Entreprises beta : 300 entretiens
Données publiques : 0 entretiens
Usage propre : 0 entretiens
```

**Volume par Phase :**
```
Phase 1 (Historiques) : 250 entretiens ✓
Phase 2 (Temps réel) : 500 entretiens ✓
Phase 3 (Profondes) : 0 entretiens (en cours)
Phase 4 (Continu) : 0 entretiens (à venir)
```

**Progression mensuelle :**
```
Mois | Entretiens | Paires CV/Poste | Patterns
-----|-----------|----------------|----------
M1   | 50        | 20             | 10
M2   | 200       | 80             | 40
M3   | 350       | 150            | 55
M4   | 500       | 250            | 65
M5   | 650       | 350            | 70
M6   | 750       | 450            | 65
```

---

### 3.3 Métriques de Qualité

**Complétude des Données :**
```
Entretiens complets : 82%
  - Transcription : 90%
  - Évaluation : 85%
  - Décision : 95%
  - Résultats : 68%

Paires CV/Poste complètes : 78%
  - CV : 95%
  - Fiche de poste : 90%
  - Décision humaine : 85%
  - Résultats : 65%
```

**Distribution Sectorielle :**
```
Technologie : 35%
Finance : 25%
Industrie : 20%
Santé : 10%
Autres : 10%
```

**Distribution Géographique :**
```
Île-de-France : 40%
Auvergne-Rhône-Alpes : 20%
Hauts-de-France : 15%
Autres : 25%
```

---

### 3.4 Métriques de Fraîcheur

**Âge des Données :**
```
< 6 mois : 25%
6-12 mois : 20%
1-2 ans : 30%
2-3 ans : 15%
> 3 ans : 10%
```

**Taux de Renouvellement :**
```
Nouvelles données (dernier mois) : 150
Données mises à jour (dernier mois) : 50
Taux de renouvellement : 20%
```

---

### 3.5 Métriques d'Impact

**Performance du Moteur :**
```
Accord moteur / humain : 72%
  - Compétences techniques : 78%
  - Soft skills : 68%
  - Motivations : 70%
  - Culture fit : 65%

Évolution mensuelle :
  M1 : 65%
  M2 : 68%
  M3 : 70%
  M4 : 71%
  M5 : 72%
  M6 : 72%
```

**Taux de Succès à 12 Mois :**
```
Avec moteur : 78%
Sans moteur : 50%
Amélioration : +28%
```

**Satisfaction des Recruteurs :**
```
Satisfaction moyenne : 4.3/5
  - Pertinence des suggestions : 4.2/5
  - Facilité d'utilisation : 4.5/5
  - Confiance dans le système : 4.1/5
  - Impact sur la qualité : 4.4/5
```

---

### 3.6 Alertes Automatiques

**Alertes Actives :**
```
⚠️ ALERTE : Taux de données avec résultats à 12 mois < 70%
   Valeur actuelle : 68%
   Action requise : Renforcer le suivi des recrutements

⚠️ ALERTE : Distribution sectorielle déséquilibrée
   Technologie : 35% (cible : ≤ 30%)
   Action requise : Diversifier les sources

✅ INFO : Volume de données sur la bonne trajectoire
   Progression : +150 entretiens ce mois
   Cible Phase 2 atteinte
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface DataMetricsDashboard {
  dashboardId: string;
  version: string;
  generatedAt: Date;
  
  overview: {
    volume: {
      totalInterviews: number;
      totalInterviewsTarget: number;
      totalCvPostePairs: number;
      totalCvPostePairsTarget: number;
      totalPatterns: number;
      totalPatternsTarget: number;
    };
    quality: {
      completeDataRate: number;
      results12MonthsRate: number;
      patternValidationRate: number;
    };
    freshness: {
      lessThan1Year: number;
      oneTo3Years: number;
      moreThan3Years: number;
    };
    impact: {
      engineHumanAgreement: number;
      successRate12Months: number;
      successRateImprovement: number;
      recruiterSatisfaction: number;
    };
  };
  
  volumeMetrics: {
    bySource: {
      recruitmentCabinets: number;
      betaCompanies: number;
      publicData: number;
      ownUsage: number;
    };
    byPhase: {
      phase1: number;
      phase2: number;
      phase3: number;
      phase4: number;
    };
    monthlyProgression: {
      month: string;
      interviews: number;
      cvPostePairs: number;
      patterns: number;
    }[];
  };
  
  qualityMetrics: {
    completeness: {
      interviewCompleteness: number;
      interviewBreakdown: {
        transcription: number;
        evaluation: number;
        decision: number;
        results: number;
      };
      cvPosteCompleteness: number;
      cvPosteBreakdown: {
        cv: number;
        jobDescription: number;
        humanDecision: number;
        results: number;
      };
    };
    distribution: {
      sectoral: {
        [sector: string]: number;
      };
      geographical: {
        [region: string]: number;
      };
    };
  };
  
  freshnessMetrics: {
    ageDistribution: {
      lessThan6Months: number;
      sixTo12Months: number;
      oneTo2Years: number;
      twoTo3Years: number;
      moreThan3Years: number;
    };
    renewalRate: {
      newDataLastMonth: number;
      updatedDataLastMonth: number;
      renewalRate: number;
    };
  };
  
  impactMetrics: {
    enginePerformance: {
      overallAgreement: number;
      breakdown: {
        technicalSkills: number;
        softSkills: number;
        motivations: number;
        cultureFit: number;
      };
      monthlyEvolution: {
        month: string;
        agreement: number;
      }[];
    };
    successRate: {
      withEngine: number;
      withoutEngine: number;
      improvement: number;
    };
    satisfaction: {
      average: number;
      breakdown: {
        suggestionRelevance: number;
        easeOfUse: number;
        systemTrust: number;
        qualityImpact: number;
      };
    };
  };
  
  alerts: {
    active: Alert[];
    history: Alert[];
  };
  
  metadata: {
    lastUpdated: Date;
    status: 'active' | 'archived';
  };
}

interface Alert {
  alertId: string;
  timestamp: Date;
  
  type: 'warning' | 'info' | 'critical';
  category: 'volume' | 'quality' | 'freshness' | 'impact';
  
  message: string;
  currentValue: number;
  targetValue: number;
  
  actionRequired: string;
  status: 'active' | 'acknowledged' | 'resolved';
  
  acknowledgedAt?: Date;
  resolvedAt?: Date;
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE data_metrics_dashboard (
  id VARCHAR(36) PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  overview JSON NOT NULL,
  volume_metrics JSON NOT NULL,
  quality_metrics JSON NOT NULL,
  freshness_metrics JSON NOT NULL,
  impact_metrics JSON NOT NULL,
  alerts JSON NOT NULL,
  metadata JSON NOT NULL,
  
  UNIQUE KEY idx_data_metrics_version (version)
);

CREATE TABLE data_alert (
  id VARCHAR(36) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  
  type VARCHAR(20) NOT NULL CHECK (type IN ('warning', 'info', 'critical')),
  category VARCHAR(20) NOT NULL CHECK (category IN ('volume', 'quality', 'freshness', 'impact')),
  
  message TEXT NOT NULL,
  current_value DECIMAL(5,2),
  target_value DECIMAL(5,2),
  
  action_required TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'acknowledged', 'resolved')),
  
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_data_alert_status ON data_alert(status);
CREATE INDEX idx_data_alert_category ON data_alert(category);
CREATE INDEX idx_data_alert_timestamp ON data_alert(timestamp);
```

---

## 6. API Endpoints

```typescript
// GET /api/data/metrics/dashboard
async function getDataMetricsDashboard(): Promise<DataMetricsDashboard> {
  return await getDataMetricsDashboard();
}

// GET /api/data/metrics/dashboard/:version
async function getDataMetricsDashboardByVersion(version: string): Promise<DataMetricsDashboard> {
  return await getDataMetricsDashboardByVersion(version);
}

// PUT /api/data/metrics/dashboard/generate
async function generateDataMetricsDashboard(): Promise<DataMetricsDashboard> {
  return await generateDataMetricsDashboard();
}

// GET /api/data/alerts
async function getDataAlerts(status?: string): Promise<Alert[]> {
  return await getDataAlerts(status);
}

// PUT /api/data/alerts/:alertId/acknowledge
async function acknowledgeAlert(alertId: string): Promise<Alert> {
  return await acknowledgeAlert(alertId);
}

// PUT /api/data/alerts/:alertId/resolve
async function resolveAlert(alertId: string): Promise<Alert> {
  return await resolveAlert(alertId);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Volume

| Métrique | Description | Cible Phase 1 | Cible Phase 2 | Cible Phase 3 |
|----------|-------------|---------------|---------------|---------------|
| Entretiens anonymisés | Entretiens collectés | 250 | 750 | 1000 |
- Paires CV/Poste | Paires collectées | 100 | 500 | 1000 |
- Patterns identifiés | Patterns identifiés | 50 | 75 | 100 |

### 7.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de données complètes | Données complètes / total | ≥ 80% |
- Taux de données avec résultats à 12 mois | Données avec résultats / total | ≥ 70% |
- Taux de validation des patterns | Patterns validés / identifiés | ≥ 75% |

### 7.3 Métriques de Fraîcheur

| Métrique | Description | Cible |
|----------|-------------|-------|
- Données < 1 an | % de données fraîches | ≥ 40% |
- Taux de renouvellement | Nouvelles données / total | ≥ 15% |

### 7.4 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Accord moteur / humain | Accord / total | ≥ 75% |
- Amélioration du taux de succès | Amélioration / baseline | ≥ 25% |
- Satisfaction recruteurs | Satisfaction moyenne | ≥ 4.5/5 |

---

## 8. Configuration des Alertes

### 8.1 Seuils d'Alerte

**Volume :**
```
Volume mensuel < 50 : Critical
Volume mensuel < 100 : Warning
Volume mensuel ≥ 100 : OK
```

**Qualité :**
```
Taux de données complètes < 70% : Critical
Taux de données complètes < 80% : Warning
Taux de données complètes ≥ 80% : OK
```

**Fraîcheur :**
```
Données < 1 an < 30% : Warning
Données < 1 an < 20% : Critical
Données < 1 an ≥ 30% : OK
```

**Impact :**
```
Accord moteur / humain < 65% : Warning
Accord moteur / humain < 60% : Critical
Accord moteur / humain ≥ 70% : OK
```

### 8.2 Fréquence de Génération

**Tableau de bord :**
- Génération automatique : Quotidienne à 8h00
- Mise à jour en temps réel : Toutes les heures
- Rapport hebdomadaire : Tous les lundis à 9h00

**Alertes :**
- Vérification automatique : Toutes les heures
- Notification immédiate : Pour les alertes Critical
- Notification quotidienne : Pour les alertes Warning

---

## 9. Conclusion

Le tableau de bord des métriques data permet de surveiller en temps réel la qualité, le volume, la fraîcheur, et l'impact des données collectées. Le tableau de bord inclut une vue d'ensemble, des métriques détaillées (volume, qualité, fraîcheur, impact), des alertes automatiques, et une configuration flexible des seuils.

**Points clés :**
- Vue d'ensemble avec KPI principaux
- Métriques de volume par source et phase
- Métriques de qualité (complétude, distribution)
- Métriques de fraîcheur (âge, renouvellement)
- Métriques d'impact (performance, succès, satisfaction)
- Alertes automatiques avec seuils configurables
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Fréquence de génération configurable
- Indicateurs de suivi par phase
