# DOC-M05-04 : Template Rapport de Précision Mensuel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template du rapport de précision mensuel pour le MVP-META-05 Feedback Intelligence Engine. Ce document structure le format du rapport mensuel qui synthétise la précision du moteur et les modifications apportées.

---

## 2. Principe Fondateur

Le rapport de précision mensuel permet de suivre l'évolution de la précision du moteur, identifier les erreurs récurrentes, et mesurer l'impact des modifications apportées au modèle.

---

## 3. Format du Rapport

### 3.1 En-tête

```markdown
# RAPPORT DE PRÉCISION DU MOTEUR

Période : [Mois/Année]
Généré le : [Date]
```

### 3.2 Résumé Exécutif

```markdown
## RÉSUMÉ EXÉCUTIF

Recrutements suivis ce mois : N

Précision globale à 90 jours : X%
Précision globale à 12 mois : Y%

Tendance : [amélioration / stable / dégradation]
```

---

## 4. Sections du Rapport

### 4.1 Recrutements Suivis

```markdown
## RECRUTEMENTS SUIVIS CE MOIS

Recrutements suivis ce mois : N
Recrutements avec suivi complet : M
Recrutements avec suivi partiel : P
```

### 4.2 Précision à 90 Jours

```markdown
## PRÉCISION À 90 JOURS

Prédictions correctes : X%
Prédictions incorrectes : Y%

Principales erreurs :
- [Erreur 1] : [description]
- [Erreur 2] : [description]
- [Erreur 3] : [description]
```

### 4.3 Précision à 12 Mois

```markdown
## PRÉCISION À 12 MOIS

Taux de succès prédit : X%
Taux de succès réel   : Y%
Écart               : Z%

Dimensions où le moteur surprédit :
- [Dimension 1] : +X points
- [Dimension 2] : +Y points

Dimensions où le moteur sous-prédit :
- [Dimension 1] : -X points
- [Dimension 2] : -Y points
```

### 4.4 Faux Positifs et Faux Négatifs

```markdown
## FAUX POSITIFS IDENTIFIÉS CE MOIS : N

[Cas 1]
- Candidat : [anonymisé]
- Prédiction : Succès
- Réalité : Échec
- Raison : [explication]

[Cas 2]
- Candidat : [anonymisé]
- Prédiction : Succès
- Réalité : Échec
- Raison : [explication]

## FAUX NÉGATIFS IDENTIFIÉS CE MOIS : N

[Cas 1]
- Candidat : [anonymisé]
- Prédiction : Échec
- Réalité : Succès
- Raison : [explication]

[Cas 2]
- Candidat : [anonymisé]
- Prédiction : Échec
- Réalité : Succès
- Raison : [explication]
```

### 4.5 Modifications Apportées au Modèle

```markdown
## MODIFICATIONS APPORTÉES AU MODÈLE

[Modification 1]
- Règle modifiée : [description]
- Raison : [explication]
- Impact attendu : [description]
- Date de déploiement : [date]

[Modification 2]
- Règle modifiée : [description]
- Raison : [explication]
- Impact attendu : [description]
- Date de déploiement : [date]
```

### 4.6 Progression vs Mois Précédent

```markdown
## PROGRESSION VS MOIS PRÉCÉDENT

Précision globale :
- Mois précédent : X%
- Mois courant : Y%
- Delta : Z%

Tendance : [amélioration / stable / dégradation]

Dimensions avec amélioration :
- [Dimension 1] : +X%
- [Dimension 2] : +Y%

Dimensions avec dégradation :
- [Dimension 1] : -X%
- [Dimension 2] : -Y%
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface PrecisionReport {
  reportId: string;
  period: {
    month: number;
    year: number;
  };
  generatedAt: Date;
  
  summary: {
    recruitmentsFollowed: number;
    precision90Days: number;
    precision12Months: number;
    trend: 'improvement' | 'stable' | 'degradation';
  };
  
  recruitmentsFollowed: {
    total: number;
    complete: number;
    partial: number;
  };
  
  precision90Days: {
    correctPredictions: number;
    incorrectPredictions: number;
    accuracy: number;
    mainErrors: {
      error: string;
      description: string;
      count: number;
    }[];
  };
  
  precision12Months: {
    predictedSuccessRate: number;
    actualSuccessRate: number;
    gap: number;
    
    overpredictedDimensions: {
      dimension: string;
      overprediction: number;
    }[];
    
    underpredictedDimensions: {
      dimension: string;
      underprediction: number;
    }[];
  };
  
  falsePositives: {
    count: number;
    cases: {
      candidateId: string;
      prediction: string;
      reality: string;
      reason: string;
    }[];
  };
  
  falseNegatives: {
    count: number;
    cases: {
      candidateId: string;
      prediction: string;
      reality: string;
      reason: string;
    }[];
  };
  
  modelModifications: {
    count: number;
    modifications: {
      ruleModified: string;
      reason: string;
      expectedImpact: string;
      deploymentDate: Date;
    }[];
  };
  
  progression: {
    previousMonth: {
      globalPrecision: number;
    };
    currentMonth: {
      globalPrecision: number;
    };
    delta: number;
    trend: 'improvement' | 'stable' | 'degradation';
    
    improvedDimensions: {
      dimension: string;
      improvement: number;
    }[];
    
    degradedDimensions: {
      dimension: string;
      degradation: number;
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

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE precision_report (
  id VARCHAR(36) PRIMARY KEY,
  
  period_month INT NOT NULL,
  period_year INT NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  summary JSON NOT NULL,
  recruitments_followed JSON NOT NULL,
  precision_90_days JSON NOT NULL,
  precision_12_months JSON NOT NULL,
  false_positives JSON NOT NULL,
  false_negatives JSON NOT NULL,
  model_modifications JSON NOT NULL,
  progression JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_precision_report_period ON precision_report(period_year, period_month);
```

---

## 7. API Endpoints

```typescript
// POST /api/precision-report/generate
async function generatePrecisionReport(month: number, year: number): Promise<PrecisionReport> {
  return await generatePrecisionReport(month, year);
}

// GET /api/precision-report/:month/:year
async function getPrecisionReport(month: number, year: number): Promise<PrecisionReport> {
  return await getPrecisionReport(month, year);
}

// GET /api/precision-report/latest
async function getLatestPrecisionReport(): Promise<PrecisionReport> {
  return await getLatestPrecisionReport();
}

// GET /api/precision-report/recent/:months
async function getRecentPrecisionReports(months: number): Promise<PrecisionReport[]> {
  return await getRecentPrecisionReports(months);
}

// POST /api/precision-report/:reportId/export
async function exportPrecisionReport(reportId: string, format: 'markdown' | 'pdf' | 'json'): Promise<any> {
  return await exportPrecisionReport(reportId, format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Rapports générés / mois | 100% |
- Taux de complétude | Rapports complets / générés | 100% |

### 8.2 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
- Précision globale à 90 jours | Prédictions correctes / totales | ≥ 85% |
- Précision globale à 12 mois | Prédictions correctes / totales | ≥ 80% |
- Taux d'amélioration mensuelle | Delta de précision / mois | ≥ 1% |

---

## 9. Exemple Complet

```markdown
# RAPPORT DE PRÉCISION DU MOTEUR

Période : Août 2026
Généré le : 2026-08-31

---

## RÉSUMÉ EXÉCUTIF

Recrutements suivis ce mois : 25

Précision globale à 90 jours : 87%
Précision globale à 12 mois : 82%

Tendance : amélioration

---

## RECRUTEMENTS SUIVIS CE MOIS

Recrutements suivis ce mois : 25
Recrutements avec suivi complet : 23
Recrutements avec suivi partiel : 2

---

## PRÉCISION À 90 JOURS

Prédictions correctes : 87%
Prédictions incorrectes : 13%

Principales erreurs :
- Surévaluation de la maturité : 5 cas
- Sous-évaluation du culture fit : 3 cas
- Erreur sur le potentiel : 2 cas

---

## PRÉCISION À 12 MOIS

Taux de succès prédit : 85%
Taux de succès réel   : 82%
Écart               : -3%

Dimensions où le moteur surprédit :
- Maturité : +0.5 points
- Potentiel : +0.3 points

Dimensions où le moteur sous-prédit :
- Culture fit : -0.4 points
- Soft skills : -0.2 points

---

## FAUX POSITIFS IDENTIFIÉS CE MOIS : 3

[Cas 1]
- Candidat : CAND-XXX
- Prédiction : Succès
- Réalité : Échec
- Raison : Maturité surestimée

[Cas 2]
- Candidat : CAND-YYY
- Prédiction : Succès
- Réalité : Échec
- Raison : Culture fit insuffisant

[Cas 3]
- Candidat : CAND-ZZZ
- Prédiction : Succès
- Réalité : Échec
- Raison : Potentiel surestimé

## FAUX NÉGATIFS IDENTIFIÉS CE MOIS : 2

[Cas 1]
- Candidat : CAND-AAA
- Prédiction : Échec
- Réalité : Succès
- Raison : Soft skills sous-évalués

[Cas 2]
- Candidat : CAND-BBB
- Prédiction : Échec
- Réalité : Succès
- Raison : Culture fit sous-évalué

---

## MODIFICATIONS APPORTÉES AU MODÈLE

[Modification 1]
- Règle modifiée : Calcul de la maturité
- Raison : Surévaluation systématique
- Impact attendu : Réduction de 0.3 points
- Date de déploiement : 2026-08-15

[Modification 2]
- Règle modifiée : Pondération du culture fit
- Raison : Sous-évaluation systématique
- Impact attendu : Augmentation de 0.2 points
- Date de déploiement : 2026-08-20

---

## PROGRESSION VS MOIS PRÉCÉDENT

Précision globale :
- Mois précédent : 80%
- Mois courant : 82%
- Delta : +2%

Tendance : amélioration

Dimensions avec amélioration :
- Culture fit : +3%
- Soft skills : +2%

Dimensions avec dégradation :
- Maturité : -1%
```

---

## 10. Conclusion

Le template du rapport de précision mensuel structure le format du rapport mensuel. En-tête avec période et date de génération. Résumé exécutif avec nombre de recrutements suivis, précision à 90 et 12 mois, tendance. Recrutements suivis ce mois. Précision à 90 jours avec prédictions correctes/incorrectes et principales erreurs. Précision à 12 mois avec taux de succès prédit/réel, écart, dimensions surprédites/sous-prédites. Faux positifs et faux négatifs identifiés. Modifications apportées au modèle. Progression vs mois précédent avec delta et tendance. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Template de rapport mensuel
- Résumé exécutif
- Recrutements suivis
- Précision à 90 jours
- Précision à 12 mois
- Faux positifs et faux négatifs
- Modifications du modèle
- Progression vs mois précédent
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et de performance
