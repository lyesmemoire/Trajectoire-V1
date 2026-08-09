# DOC-M08-04 : Template Rapport Trimestriel

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template du rapport trimestriel d'erreurs de recrutement pour le MVP-META-08 Error Learning Engine. Ce document structure le format du rapport qui synthétise les faux positifs et faux négatifs identifiés.

---

## 2. Principe Fondateur

Le rapport trimestriel d'erreurs de recrutement synthétise les faux positifs et faux négatifs identifiés, analyse les causes, et documente les corrections apportées aux règles d'évaluation. Ce rapport est anonymisé et utilisé en interne pour l'amélioration continue.

---

## 3. Format du Rapport

### 3.1 En-tête

```markdown
RAPPORT D'ERREURS DE RECRUTEMENT
Période : [Trimestre/Année]
Généré le : [Date]
Version : [Numéro de version]
```

---

### 3.2 Résumé Exécutif

```markdown
RÉSUMÉ EXÉCUTIF

FAUX POSITIFS IDENTIFIÉS : N
FAUX NÉGATIFS IDENTIFIÉS : N
TAUX D'ERREUR GLOBAL : X%
TENDANCE : [amélioration/stable/dégradation]
```

---

### 3.3 Section Faux Positifs

```markdown
FAUX POSITIFS IDENTIFIÉS : N

Cas 1 (anonymisé) :
  Profil : [description générique]
  Ce qu'on a mal évalué : [analyse]
  Correction apportée : [règle modifiée]

Cas 2 (anonymisé) :
  Profil : [description générique]
  Ce qu'on a mal évalué : [analyse]
  Correction apportée : [règle modifiée]

[...]
```

---

### 3.4 Section Faux Négatifs

```markdown
FAUX NÉGATIFS IDENTIFIÉS : N

Cas 1 (anonymisé) :
  Profil : [description générique]
  Pourquoi refusé : [critère]
  Ce qu'on a raté : [analyse]
  Correction apportée : [règle modifiée]

Cas 2 (anonymisé) :
  Profil : [description générique]
  Pourquoi refusé : [critère]
  Ce qu'on a raté : [analyse]
  Correction apportée : [règle modifiée]

[...]
```

---

### 3.5 Section Taux d'Erreur

```markdown
TAUX D'ERREUR GLOBAL : X%

Détail :
- Taux de faux positifs : X% (candidats recrutés à tort / total recrutés)
- Taux de faux négatifs : X% (candidats refusés à tort / total refusés)

Comparaison avec trimestre précédent :
- Variation : ± X%
- Tendance : [amélioration/stable/dégradation]
```

---

### 3.6 Section Règles Modifiées

```markdown
RÈGLES MODIFIÉES CE TRIMESTRE :

Règle 1 :
  Ancienne règle : [description]
  Nouvelle règle : [description]
  Justification : [analyse des cas]
  Impact attendu : [description]

Règle 2 :
  Ancienne règle : [description]
  Nouvelle règle : [description]
  Justification : [analyse des cas]
  Impact attendu : [description]

[...]
```

---

### 3.7 Section Recommandations

```markdown
RECOMMANDATIONS :

1. [Recommandation 1]
   Priorité : [haute/moyenne/basse]
   Délai : [trimestre suivant / court terme / long terme]

2. [Recommandation 2]
   Priorité : [haute/moyenne/basse]
   Délai : [trimestre suivant / court terme / long terme]

[...]
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface QuarterlyErrorReport {
  reportId: string;
  period: {
    startDate: Date;
    endDate: Date;
    quarter: string;
    year: number;
  };
  
  summary: {
    falsePositivesIdentified: number;
    falseNegativesIdentified: number;
    globalErrorRate: number;
    trend: 'improvement' | 'stable' | 'degradation';
  };
  
  falsePositives: {
    caseId: string;
    profile: string;
    whatWasMisEvaluated: string;
    correctionApplied: string;
  }[];
  
  falseNegatives: {
    caseId: string;
    profile: string;
    whyRejected: string;
    whatWasMissed: string;
    correctionApplied: string;
  }[];
  
  errorRateDetails: {
    falsePositiveRate: number;
    falseNegativeRate: number;
    comparisonWithPreviousQuarter: {
      variation: number;
      trend: 'improvement' | 'stable' | 'degradation';
    };
  };
  
  rulesModified: {
    ruleId: string;
    oldRule: string;
    newRule: string;
    justification: string;
    expectedImpact: string;
  }[];
  
  recommendations: {
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[];
  
  generatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE quarterly_error_report (
  id VARCHAR(36) PRIMARY KEY,
  
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  quarter VARCHAR(10) NOT NULL,
  year INT NOT NULL,
  
  summary JSON NOT NULL,
  false_positives JSON NOT NULL,
  false_negatives JSON NOT NULL,
  error_rate_details JSON NOT NULL,
  rules_modified JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_quarterly_error_report_period ON quarterly_error_report(period_start_date, period_end_date);
CREATE INDEX idx_quarterly_error_report_quarter ON quarterly_error_report(quarter, year);
```

---

## 6. API Endpoints

```typescript
// POST /api/error-report/generate
async function generateQuarterlyErrorReport(quarter: string, year: number): Promise<QuarterlyErrorReport> {
  return await generateQuarterlyErrorReport(quarter, year);
}

// GET /api/error-report/:reportId
async function getQuarterlyErrorReport(reportId: string): Promise<QuarterlyErrorReport> {
  return await getQuarterlyErrorReport(reportId);
}

// GET /api/error-report/quarter/:quarter/year/:year
async function getQuarterlyErrorReportByPeriod(quarter: string, year: number): Promise<QuarterlyErrorReport> {
  return await getQuarterlyErrorReportByPeriod(quarter, year);
}

// GET /api/error-report/list
async function listQuarterlyErrorReports(limit?: number, offset?: number): Promise<QuarterlyErrorReport[]> {
  return await listQuarterlyErrorReports(limit, offset);
}

// GET /api/error-report/trend
async function getErrorRateTrend(year: number): Promise<any> {
  return await getErrorRateTrend(year);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Rapport

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Rapports générés / trimestres | 100% |
- Délai de génération | Temps entre fin de trimestre et rapport | ≤ 15 jours |

### 7.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'anonymisation | Cas anonymisés / totaux | 100% |
- Taux d'analyse complétée | Analyses complétées / détectées | 100% |

---

## 8. Exemple Complet

```markdown
RAPPORT D'ERREURS DE RECRUTEMENT
Période : T2 2026
Généré le : 2026-07-15
Version : 1.0

RÉSUMÉ EXÉCUTIF

FAUX POSITIFS IDENTIFIÉS : 3
FAUX NÉGATIFS IDENTIFIÉS : 5
TAUX D'ERREUR GLOBAL : 8%
TENDANCE : amélioration

FAUX POSITIFS IDENTIFIÉS : 3

Cas 1 (anonymisé) :
  Profil : Senior Developer avec forte ambition
  Ce qu'on a mal évalué : Signal de réponse préparée sur les motivations
  Correction apportée : Ajouter une question de suivi sur les motivations profondes

Cas 2 (anonymisé) :
  Profil : Product Manager avec expérience limitée
  Ce qu'on a mal évalué : Lacune de leadership sous-estimée
  Correction apportée : Augmenter le poids du critère de leadership

Cas 3 (anonymisé) :
  Profil : Data Scientist avec culture fit partiel
  Ce qu'on a mal évalué : Conflit relationnel non détecté
  Correction apportée : Ajouter un test de compatibilité manager

FAUX NÉGATIFS IDENTIFIÉS : 5

Cas 1 (anonymisé) :
  Profil : Lead Developer avec culture fit 2.5/5
  Pourquoi refusé : Culture fit partiel
  Ce qu'on a raté : Performance exceptionnelle dans nouveau poste
  Correction apportée : Réduire le poids du culture fit dans la grille

Cas 2 (anonymisé) :
  Profil : Senior Engineer avec ambition supérieure
  Pourquoi refusé : Ambition supérieure au poste
  Ce qu'on a raté : Promotion rapide dans nouveau poste
  Correction apportée : Créer un chemin de progression explicite

[...]

TAUX D'ERREUR GLOBAL : 8%

Détail :
- Taux de faux positifs : 5% (3/60 recrutés)
- Taux de faux négatifs : 12% (5/42 refusés suivis)

Comparaison avec trimestre précédent :
- Variation : -2%
- Tendance : amélioration

RÈGLES MODIFIÉES CE TRIMESTRE :

Règle 1 :
  Ancienne règle : Culture fit poids 20%
  Nouvelle règle : Culture fit poids 15%
  Justification : 3 faux négatifs liés à culture fit partiel
  Impact attendu : Réduction des faux négatifs

Règle 2 :
  Ancienne règle : Leadership poids 10%
  Nouvelle règle : Leadership poids 15%
  Justification : 1 faux positif lié à lacune de leadership
  Impact attendu : Réduction des faux positifs

[...]

RECOMMANDATIONS :

1. Améliorer la détection des réponses préparées
   Priorité : haute
   Délai : trimestre suivant

2. Créer un chemin de progression explicite pour les candidats ambitieux
   Priorité : moyenne
   Délai : court terme

[...]
```

---

## 9. Conclusion

Le template du rapport trimestriel d'erreurs de recrutement structure le format du rapport qui synthétise les faux positifs et faux négatifs identifiés. Format en 7 sections : En-tête, Résumé exécutif, Section faux positifs, Section faux négatifs, Section taux d'erreur, Section règles modifiées, Section recommandations. Anonymisation des cas. Comparaison avec trimestre précédent. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Format structuré en 7 sections
- Anonymisation des cas
- Synthèse des faux positifs et faux négatifs
- Taux d'erreur global et détaillé
- Comparaison avec trimestre précédent
- Règles modifiées avec justification
- Recommandations avec priorité
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de rapport et de qualité
