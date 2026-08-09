# DOC-C7-06 : Rapport de Calibration Mensuel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le rapport de calibration mensuel pour le Correctif 7 Scoring Calibration. Ce document structure le contenu et le format du rapport mensuel qui suit l'évolution de la calibration du moteur de scoring.

---

## 2. Principe Fondateur

Le rapport de calibration mensuel permet de suivre l'évolution de la calibration du moteur, d'identifier les écarts persistants, et de proposer des ajustements pour maintenir la cohérence avec l'expertise humaine.

---

## 3. Structure du Rapport

### 3.1 En-tête

**Informations générales :**
- Période : [Mois Année]
- Date de génération : [Date]
- Version du moteur : [Version]
- Nombre de cas évalués : [Nombre]
- Nombre de DRH évaluateurs : [Nombre]

### 3.2 Résumé Exécutif

**Points clés :**
- Écart moyen moteur / DRH : [X points]
- Écart maximum : [X points]
- Taux de cas acceptables : [X%]
- Tendance : [Amélioration / Stabilité / Dégradation]
- Actions recommandées : [Liste]

### 3.3 Métriques de Calibration

**Métriques globales :**
- Écart moyen moteur / DRH : [X points] (cible ≤ 5)
- Écart maximum : [X points] (cible ≤ 10)
- Taux de cas acceptables (écart ≤ 5) : [X%] (cible ≥ 80%)
- Taux de cas à analyser (écart 6-10) : [X%]
- Taux de cas à corriger (écart > 10) : [X%]

**Métriques par type de poste :**
- DRH : Écart moyen [X], Taux acceptable [X%]
- Manager RH : Écart moyen [X], Taux acceptable [X%]
- Responsable Paie : Écart moyen [X], Taux acceptable [X%]
- Commercial : Écart moyen [X], Taux acceptable [X%]
- Account Manager : Écart moyen [X], Taux acceptable [X%]
- Ingénieur : Écart moyen [X], Taux acceptable [X%]
- Développeur : Écart moyen [X], Taux acceptable [X%]
- Manager : Écart moyen [X], Taux acceptable [X%]
- Team Lead : Écart moyen [X], Taux acceptable [X%]

**Métriques par niveau d'expérience :**
- Junior : Écart moyen [X], Taux acceptable [X%]
- Intermédiaire : Écart moyen [X], Taux acceptable [X%]
- Senior : Écart moyen [X], Taux acceptable [X%]

### 3.4 Analyse des Écarts

**Cas avec écart > 10 points :**
- Cas [ID] : Écart [X points], Cause [Description], Action [Description]
- Cas [ID] : Écart [X points], Cause [Description], Action [Description]
- ...

**Causes principales des écarts :**
- Mauvaise application du Principe 1 : [X%]
- Mauvaise identification des lacunes critiques : [X%]
- Mauvaise application des pénalités de silence : [X%]
- Mauvaise évaluation de la cohérence : [X%]
- Pondération inadaptée des dimensions : [X%]
- Échelle de scoring mal calibrée : [X%]

### 3.5 Actions Correctives

**Actions réalisées :**
- Ajustement du coefficient lacunes critiques : [Description]
- Modification des critères de scoring : [Description]
- Amélioration de la détection des lacunes critiques : [Description]
- Raffinement de l'évaluation de la cohérence : [Description]
- Mise à jour des benchmarks : [Description]

**Actions recommandées :**
- [Action 1] : [Description], Priorité [Haute/Moyenne/Basse]
- [Action 2] : [Description], Priorité [Haute/Moyenne/Basse]
- [Action 3] : [Description], Priorité [Haute/Moyenne/Basse]

### 3.6 Évolution dans le Temps

**Graphiques :**
- Écart moyen moteur / DRH sur les 6 derniers mois
- Taux de cas acceptables sur les 6 derniers mois
- Distribution des écarts par mois

**Tendance :**
- Écart moyen : [Amélioration / Stabilité / Dégradation]
- Taux acceptable : [Amélioration / Stabilité / Dégradation]

### 3.7 Calibration par Rapport au Marché

**Profils rares identifiés :**
- [Type de poste] : [Nombre] profils rares, Ajustement moyen [X points]

**Ajustements appliqués :**
- [Type de poste] : Ajustement [X points], Raison [Description]

---

## 4. Format du Rapport

### 4.1 Format Markdown

**Structure :**
```markdown
# Rapport de Calibration Mensuel — [Mois Année]

## Résumé Exécutif
[Contenu]

## Métriques de Calibration
[Contenu]

## Analyse des Écarts
[Contenu]

## Actions Correctives
[Contenu]

## Évolution dans le Temps
[Contenu]

## Calibration par Rapport au Marché
[Contenu]
```

### 4.2 Format JSON

**Structure :**
```json
{
  "period": "2026-08",
  "generatedAt": "2026-08-04",
  "engineVersion": "1.0",
  "casesEvaluated": 50,
  "evaluators": 3,
  
  "summary": {
    "averageGap": 4.2,
    "maxGap": 9,
    "acceptableRate": 85,
    "trend": "improvement",
    "recommendedActions": ["Action 1", "Action 2"]
  },
  
  "metrics": {
    "global": {
      "averageGap": 4.2,
      "maxGap": 9,
      "acceptableRate": 85,
      "toAnalyzeRate": 12,
      "toCorrectRate": 3
    },
    "byPositionType": [...],
    "byExperienceLevel": [...]
  },
  
  "gapAnalysis": {
    "casesWithHighGap": [...],
    "mainCauses": [...]
  },
  
  "correctiveActions": {
    "completed": [...],
    "recommended": [...]
  },
  
  "evolution": {
    "averageGapHistory": [...],
    "acceptableRateHistory": [...],
    "gapDistributionHistory": [...]
  },
  
  "marketCalibration": {
    "rareProfilesIdentified": [...],
    "adjustmentsApplied": [...]
  }
}
```

---

## 5. Fréquence et Destinataires

### 5.1 Fréquence

**Mensuelle :**
- Génération le dernier jour du mois
- Couverture de tous les cas évalués pendant le mois

### 5.2 Destinataires

**Principaux :**
- Équipe technique du moteur de scoring
- DRH seniors impliqués dans la calibration
- Direction produit

**Secondaires :**
- Équipe recrutement
- Direction générale (résumé exécutif uniquement)

---

## 6. Structure de Données (TypeScript)

```typescript
interface MonthlyCalibrationReport {
  reportId: string;
  
  period: string;
  generatedAt: Date;
  engineVersion: string;
  casesEvaluated: number;
  evaluators: number;
  
  summary: {
    averageGap: number;
    maxGap: number;
    acceptableRate: number;
    trend: 'improvement' | 'stability' | 'degradation';
    recommendedActions: string[];
  };
  
  metrics: {
    global: {
      averageGap: number;
      maxGap: number;
      acceptableRate: number;
      toAnalyzeRate: number;
      toCorrectRate: number;
    };
    byPositionType: {
      drh: { averageGap: number; acceptableRate: number };
      managerRh: { averageGap: number; acceptableRate: number };
      responsablePaie: { averageGap: number; acceptableRate: number };
      commercial: { averageGap: number; acceptableRate: number };
      accountManager: { averageGap: number; acceptableRate: number };
      ingenieur: { averageGap: number; acceptableRate: number };
      developpeur: { averageGap: number; acceptableRate: number };
      manager: { averageGap: number; acceptableRate: number };
      teamLead: { averageGap: number; acceptableRate: number };
    };
    byExperienceLevel: {
      junior: { averageGap: number; acceptableRate: number };
      intermediate: { averageGap: number; acceptableRate: number };
      senior: { averageGap: number; acceptableRate: number };
    };
  };
  
  gapAnalysis: {
    casesWithHighGap: {
      caseId: string;
      gap: number;
      cause: string;
      action: string;
    }[];
    mainCauses: {
      principle1: number;
      criticalGaps: number;
      silencePenalties: number;
      coherence: number;
      weighting: number;
      scale: number;
    };
  };
  
  correctiveActions: {
    completed: {
      action: string;
      description: string;
      completedAt: Date;
    }[];
    recommended: {
      action: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
  
  evolution: {
    averageGapHistory: {
      period: string;
      value: number;
    }[];
    acceptableRateHistory: {
      period: string;
      value: number;
    }[];
    gapDistributionHistory: {
      period: string;
      acceptable: number;
      toAnalyze: number;
      toCorrect: number;
    }[];
  };
  
  marketCalibration: {
    rareProfilesIdentified: {
      positionType: string;
      count: number;
      averageAdjustment: number;
    }[];
    adjustmentsApplied: {
      positionType: string;
      adjustment: number;
      reason: string;
    }[];
  };
  
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
CREATE TABLE monthly_calibration_report (
  id VARCHAR(36) PRIMARY KEY,
  
  period VARCHAR(7) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  engine_version VARCHAR(20) NOT NULL,
  cases_evaluated INT NOT NULL,
  evaluators INT NOT NULL,
  
  summary JSON NOT NULL,
  metrics JSON NOT NULL,
  gap_analysis JSON NOT NULL,
  corrective_actions JSON NOT NULL,
  evolution JSON NOT NULL,
  market_calibration JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_monthly_calibration_report_period ON monthly_calibration_report(period);
```

---

## 8. API Endpoints

```typescript
// GET /api/monthly-calibration-report/:period
async function getMonthlyCalibrationReport(period: string): Promise<MonthlyCalibrationReport> {
  return await getMonthlyCalibrationReportByPeriod(period);
}

// POST /api/monthly-calibration-report/generate
async function generateMonthlyCalibrationReport(period: string): Promise<MonthlyCalibrationReport> {
  return await generateMonthlyCalibrationReport(period);
}

// GET /api/monthly-calibration-reports
async function getMonthlyCalibrationReports(limit?: number): Promise<MonthlyCalibrationReport[]> {
  return await getMonthlyCalibrationReports(limit);
}

// GET /api/monthly-calibration-reports/evolution
async function getCalibrationEvolution(months: number): Promise<any> {
  return await getCalibrationEvolution(months);
}

// POST /api/monthly-calibration-report/export
async function exportMonthlyCalibrationReport(period: string, format: 'markdown' | 'json' | 'pdf'): Promise<any> {
  return await exportMonthlyCalibrationReport(period, format);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Rapport

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Rapports générés / mois | 100% |
- Délai de génération | Temps entre fin de mois et génération | ≤ 2 jours |

### 9.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'amélioration | Mois avec amélioration / total | ≥ 70% |
- Taux d'actions complétées | Actions complétées / recommandées | ≥ 80% |

---

## 10. Conclusion

Le rapport de calibration mensuel structure le suivi de la calibration du moteur de scoring. Structure : Résumé exécutif (écart moyen, écart maximum, taux acceptable, tendance, actions recommandées), Métriques de calibration (globales, par type de poste, par niveau d'expérience), Analyse des écarts (cas avec écart > 10 points, causes principales), Actions correctives (réalisées, recommandées), Évolution dans le temps (graphiques sur 6 mois, tendance), Calibration par rapport au marché (profils rares identifiés, ajustements appliqués). Format : Markdown et JSON. Fréquence mensuelle, destinataires (équipe technique, DRH seniors, direction produit). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Structure du rapport mensuel
- Métriques de calibration
- Analyse des écarts
- Actions correctives
- Évolution dans le temps
- Calibration par rapport au marché
- Format Markdown et JSON
- Fréquence mensuelle
- Destinataires
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de rapport et de qualité
