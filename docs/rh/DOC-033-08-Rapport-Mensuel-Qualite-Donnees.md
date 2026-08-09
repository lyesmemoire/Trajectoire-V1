# DOC- 033-08 : Rapport Mensuel de Qualité des Données

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template du rapport mensuel de qualité des données pour MVP-033 Real Data Foundation. Ce rapport permet de suivre mensuellement la qualité, le volume, la fraîcheur, et l'impact des données collectées, avec une analyse des tendances et des recommandations d'amélioration.

---

## 2. Principe Fondateur

La transparence est essentielle pour la confiance. Le rapport mensuel de qualité des données fournit une vue d'ensemble de la santé de la base de données, identifie les problèmes potentiels, et propose des actions correctives. Le rapport est partagé avec le Comité Data et les partenaires data.

---

## 3. Structure du Rapport

### 3.1 En-tête du Rapport

```
RAPPORT MENSUEL DE QUALITÉ DES DONNÉES

Période : [Mois Année]
Généré le : [Date]
Version : [Version]
Préparé par : [Nom]
Destinataires : Comité Data, Partenaires Data
```

---

### 3.2 Résumé Exécutif

**Points clés du mois :**
- Volume total de données collectées
- Taux de qualité des données
- Principaux problèmes identifiés
- Actions correctives en cours
- Recommandations pour le mois prochain

**Exemple :**
```
RÉSUMÉ EXÉCUTIF

Au cours du mois de [Mois], nous avons collecté 150 entretiens anonymisés
supplémentaires, atteignant un total de 750 entretiens. Le taux de qualité
des données est de 82%, en hausse de 2% par rapport au mois précédent.

Un problème a été identifié : le taux de données avec résultats à 12 mois
est de 68%, en dessous de la cible de 70%. Une action corrective est en cours
pour renforcer le suivi des recrutements.

Recommandation : Prioriser le suivi des recrutements pour atteindre la cible
de 70% de données avec résultats à 12 mois d'ici le mois prochain.
```

---

### 3.3 Métriques de Volume

**Volume total :**
```
Entretiens anonymisés : 750 / 1000 (75%)
Paires CV/Poste : 450 / 1000 (45%)
Patterns identifiés : 65 / 100 (65%)
```

**Volume par source :**
```
Cabinets de recrutement : 450 entretiens (60%)
Entreprises beta : 300 entretiens (40%)
Données publiques : 0 entretiens (0%)
Usage propre : 0 entretiens (0%)
```

**Volume par phase :**
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

### 3.4 Métriques de Qualité

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

### 3.5 Métriques de Fraîcheur

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

### 3.6 Métriques d'Impact

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

### 3.7 Alertes et Problèmes

**Alertes Actives :**
```
⚠️ ALERTE : Taux de données avec résultats à 12 mois < 70%
   Valeur actuelle : 68%
   Impact : Validation des patterns limitée
   Action requise : Renforcer le suivi des recrutements
   Responsable : Équipe Data
   Échéance : Mois prochain

⚠️ ALERTE : Distribution sectorielle déséquilibrée
   Technologie : 35% (cible : ≤ 30%)
   Impact : Biais sectoriel potentiel
   Action requise : Diversifier les sources
   Responsable : Équipe Partenariats
   Échéance : 3 mois
```

---

### 3.8 Actions Correctives

**Actions en cours :**
```
ACTION 1 : Renforcer le suivi des recrutements
   Description : Mettre en place un système de suivi automatique
   des recrutements pour améliorer le taux de résultats à 12 mois
   Responsable : Équipe Data
   Début : 01/06/2026
   Échéance : 01/07/2026
   Statut : En cours
   Progression : 50%

ACTION 2 : Diversifier les sources de données
   Description : Identifier et contacter des partenaires dans
   les secteurs sous-représentés (Santé, Industrie)
   Responsable : Équipe Partenariats
   Début : 01/06/2026
   Échéance : 01/09/2026
   Statut : En cours
   Progression : 30%
```

---

### 3.9 Recommandations

**Recommandations pour le mois prochain :**
```
1. Prioriser le suivi des recrutements pour atteindre la cible
   de 70% de données avec résultats à 12 mois

2. Identifier 2 nouveaux partenaires dans le secteur Santé pour
   équilibrer la distribution sectorielle

3. Mettre à jour le protocole d'anonymisation pour améliorer
   le taux de validation des données

4. Préparer l'audit trimestriel du Comité Data
```

---

### 3.10 Annexes

**Annexe A : Données brutes**
- Tableau détaillé des métriques
- Données par partenaire
- Données par secteur
- Données par région

**Annexe B : Méthodologie**
- Définition des métriques
- Formules de calcul
- Sources de données

**Annexe C : Historique**
- Rapports des mois précédents
- Évolution des métriques
- Actions correctives passées

---

## 4. Structure de Données (TypeScript)

```typescript
interface MonthlyDataQualityReport {
  reportId: string;
  reportNumber: string;
  
  period: {
    month: number;
    year: number;
    startDate: Date;
    endDate: Date;
  };
  
  generatedAt: Date;
  generatedBy: string;
  version: string;
  
  recipients: string[];
  
  executiveSummary: {
    keyPoints: string[];
    totalVolume: number;
    qualityRate: number;
    issuesIdentified: string[];
    correctiveActionsInProgress: string[];
    recommendations: string[];
  };
  
  volumeMetrics: {
    total: {
      interviews: number;
      interviewsTarget: number;
      cvPostePairs: number;
      cvPostePairsTarget: number;
      patterns: number;
      patternsTarget: number;
    };
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
    active: {
      alertId: string;
      type: 'warning' | 'info' | 'critical';
      category: string;
      message: string;
      currentValue: number;
      targetValue: number;
      impact: string;
      actionRequired: string;
      responsible: string;
      deadline: Date;
    }[];
    history: {
      alertId: string;
      resolvedAt: Date;
      resolution: string;
    }[];
  };
  
  correctiveActions: {
    inProgress: {
      actionId: string;
      description: string;
      responsible: string;
      startDate: Date;
      deadline: Date;
      status: 'in_progress' | 'completed' | 'delayed';
      progression: number;
    }[];
  };
  
  recommendations: string[];
  
  annexes: {
    rawData: string;
    methodology: string;
    history: string;
  };
  
  metadata: {
    lastUpdated: Date;
    status: 'draft' | 'final' | 'archived';
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE monthly_data_quality_report (
  id VARCHAR(36) PRIMARY KEY,
  report_number VARCHAR(50) NOT NULL UNIQUE,
  
  period JSON NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  generated_by VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  recipients JSON NOT NULL,
  
  executive_summary JSON NOT NULL,
  volume_metrics JSON NOT NULL,
  quality_metrics JSON NOT NULL,
  freshness_metrics JSON NOT NULL,
  impact_metrics JSON NOT NULL,
  alerts JSON NOT NULL,
  corrective_actions JSON NOT NULL,
  recommendations JSON NOT NULL,
  annexes JSON NOT NULL,
  metadata JSON NOT NULL,
  
  UNIQUE KEY idx_monthly_report_period (period->>'$.month', period->>'$.year')
);

CREATE INDEX idx_monthly_report_period ON monthly_data_quality_report((period->>'$.month'), (period->>'$.year'));
CREATE INDEX idx_monthly_report_generated ON monthly_data_quality_report(generated_at);

CREATE TABLE corrective_action (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) NOT NULL,
  
  description TEXT NOT NULL,
  responsible VARCHAR(255) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  deadline TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('in_progress', 'completed', 'delayed')),
  progression INT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (report_id) REFERENCES monthly_data_quality_report(id)
);

CREATE INDEX idx_corrective_action_report ON corrective_action(report_id);
CREATE INDEX idx_corrective_action_status ON corrective_action(status);
```

---

## 6. API Endpoints

```typescript
// POST /api/data/reports/monthly
async function generateMonthlyReport(month: number, year: number): Promise<MonthlyDataQualityReport> {
  return await generateMonthlyReport(month, year);
}

// GET /api/data/reports/monthly/:reportId
async function getMonthlyReport(reportId: string): Promise<MonthlyDataQualityReport> {
  return await getMonthlyReportById(reportId);
}

// GET /api/data/reports/monthly/period/:month/:year
async function getMonthlyReportByPeriod(month: number, year: number): Promise<MonthlyDataQualityReport> {
  return await getMonthlyReportByPeriod(month, year);
}

// GET /api/data/reports/monthly/latest
async function getLatestMonthlyReport(): Promise<MonthlyDataQualityReport> {
  return await getLatestMonthlyReport();
}

// PUT /api/data/reports/monthly/:reportId/finalize
async function finalizeReport(reportId: string): Promise<MonthlyDataQualityReport> {
  return await finalizeReport(reportId);
}

// POST /api/data/reports/monthly/:reportId/action
async function addCorrectiveAction(reportId: string, action: any): Promise<CorrectiveAction> {
  return await addCorrectiveAction(reportId, action);
}

// PUT /api/data/reports/monthly/action/:actionId
async function updateCorrectiveAction(actionId: string, progression: number): Promise<CorrectiveAction> {
  return await updateCorrectiveAction(actionId, progression);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Rapport

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétudedu rapport | Sections complètes / total | 100% |
- Délai de génération | Jours de fin de mois à génération | ≤ 5 jours |
- Taux de lecture | Rapports lus / envoyés | ≥ 80% |

### 7.2 Métriques d'Action

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de résolution des alertes | Alertes résolues / totales | ≥ 90% |
- Taux de complétion des actions | Actions complétées / totales | ≥ 80% |
- Temps moyen de résolution | Jours de détection à résolution | ≤ 30 jours |

---

## 8. Distribution du Rapport

### 8.1 Destinataires

**Comité Data :**
- DRH Senior
- DPO
- Data Scientist
- Juriste

**Partenaires Data :**
- Cabinets de recrutement actifs
- Entreprises beta actives

**Direction :**
- CEO
- CTO
- CPO

### 8.2 Fréquence

**Génération :**
- Mensuelle (premier mardi du mois suivant)

**Distribution :**
- Email avec PDF attaché
- Accès via portail en ligne
- Archivage dans le système de gestion de documents

---

## 9. Conclusion

Le rapport mensuel de qualité des données fournit une vue d'ensemble de la santé de la base de données avec des métriques de volume, qualité, fraîcheur, et impact. Le rapport inclut un résumé exécutif, des alertes actives, des actions correctives en cours, et des recommandations pour le mois prochain.

**Points clés :**
- Structure du rapport en 10 sections
- Résumé exécutif concis
- Métriques détaillées (volume, qualité, fraîcheur, impact)
- Alertes et problèmes identifiés
- Actions correctives en cours
- Recommandations pour le mois prochain
- Annexes avec données brutes et méthodologie
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Distribution aux destinataires appropriés
- Fréquence mensuelle
