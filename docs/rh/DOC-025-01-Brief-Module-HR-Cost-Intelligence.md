# DOC-025-01 : Brief du Module HR Cost Intelligence

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-025 HR Cost Intelligence. Ce module calcule le coût complet d'un recrutement (coûts directs, coûts indirects, coût d'un mauvais recrutement), produit un tableau de bord financier RH (coût moyen par recrutement, délai moyen, taux de réussite, ROI global), et génère un budget prévisionnel de recrutement (budget total, budget par poste et trimestre, alertes si budget sous-dimensionné, recommandations d'optimisation).

---

## 2. Principe Fondateur

Un grand DRH parle le langage du Comité de Direction. Il quantifie. Il justifie. Il pilote par les coûts. Ce module calcule pour chaque recrutement le coût complet (coûts directs : frais de sourcing, cabinet, évaluation, administratif ; coûts indirects : temps DRH, manager, interviewers, non-production, surcharge équipe ; coût d'un mauvais recrutement : 1 à 2 fois le salaire annuel brut). Le module produit un tableau de bord financier RH (coût moyen par recrutement par type de poste, délai moyen time-to-hire par profil, taux de réussite à 12 mois, ROI global de la fonction recrutement) et génère un budget prévisionnel de recrutement (budget total estimé, budget par poste et trimestre, alertes si budget sous-dimensionné, recommandations d'optimisation).

---

## 3. Capacités du Module

### CAPACITÉ 1 — Coût Complet d'un Recrutement

Pour chaque recrutement, le moteur calcule :

**Coûts directs :**
- Frais de sourcing (jobboards, LinkedIn)
- Frais de cabinet si externalisé
- Frais d'évaluation (tests, assessment)
- Coût administratif du processus

**Coûts indirects :**
- Temps DRH mobilisé (heures × coût horaire)
- Temps manager mobilisé
- Temps des interviewers
- Coût de la non-production pendant la vacance
- Coût de la surcharge de l'équipe pendant la vacance

**Coût d'un mauvais recrutement :**
- Coût d'un départ avant 12 mois = 1 à 2 fois le salaire annuel brut
- Décomposition : renouvellement du processus de recrutement, perte de productivité, impact sur l'équipe, coût de l'onboarding perdu

**Tableau de bord financier RH :**
- Coût moyen par recrutement par type de poste
- Délai moyen time-to-hire par profil
- Taux de réussite à 12 mois
- ROI global de la fonction recrutement

---

### CAPACITÉ 2 — Budget Prévisionnel Recrutement

Sur la base du plan de recrutement :
- Budget total estimé
- Budget par poste et par trimestre
- Alertes si le budget est sous-dimensionné
- Recommandations d'optimisation

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Calcul du Coût Complet d'un Recrutement

**Scénario :** Un recrutement est finalisé.

**Action :**
1. Le moteur collecte les données du processus de recrutement
2. Le moteur calcule les coûts directs (sourcing, cabinet, évaluation, administratif)
3. Le moteur calcule les coûts indirects (temps DRH, manager, interviewers, non-production, surcharge)
4. Le moteur calcule le coût total du recrutement
5. Le moteur compare avec le coût moyen pour le type de poste

**Résultat :** Le DRH dispose du coût complet du recrutement avec détail des coûts directs et indirects.

---

### CAS D'USAGE 2 — Calcul du Coût d'un Mauvais Recrutement

**Scénario :** Un collaborateur part avant 12 mois.

**Action :**
1. Le moteur identifie le départ avant 12 mois
2. Le moteur calcule le coût du mauvais recrutement (1 à 2 fois le salaire annuel brut)
3. Le moteur décompose le coût (renouvellement, perte de productivité, impact équipe, onboarding perdu)
4. Le moteur met à jour le tableau de bord financier

**Résultat :** Le DRH dispose du coût du mauvais recrutement avec décomposition et impact sur le ROI.

---

### CAS D'USAGE 3 — Tableau de Bord Financier RH

**Scénario :** Le DRH veut présenter les résultats de la fonction recrutement au Comité de Direction.

**Action :**
1. Le moteur agrège les données de tous les recrutements
2. Le moteur calcule le coût moyen par recrutement par type de poste
3. Le moteur calcule le délai moyen time-to-hire par profil
4. Le moteur calcule le taux de réussite à 12 mois
5. Le moteur calcule le ROI global de la fonction recrutement

**Résultat :** Le DRH dispose d'un tableau de bord financier RH complet pour présenter au Comité de Direction.

---

### CAS D'USAGE 4 — Budget Prévisionnel Recrutement

**Scénario :** L'entreprise établit son plan de recrutement annuel.

**Action :**
1. Le moteur analyse le plan de recrutement
2. Le moteur calcule le budget total estimé
3. Le moteur calcule le budget par poste et par trimestre
4. Le moteur génère des alertes si le budget est sous-dimensionné
5. Le moteur recommande des optimisations

**Résultat :** Le DRH dispose d'un budget prévisionnel détaillé avec alertes et recommandations.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE HR COST INTELLIGENCE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES RECRUTEMENT                                  │   │
│ │ - Coûts directs (sourcing, cabinet, évaluation)     │   │
│ │ - Temps mobilisé (DRH, manager, interviewers)       │   │
│ │ - Vacance du poste                                  │   │
│ │ - Surcharge de l'équipe                             │   │
│ │ - Résultats (réussite/échec à 12 mois)            │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR DE CALCUL DES COÛTS                         │   │
│ │ - Calcul des coûts directs                         │   │
│ │ - Calcul des coûts indirects                       │   │
│ │ - Calcul du coût total                             │   │
│ │ - Calcul du coût d'un mauvais recrutement          │   │
│ │ - Calcul du ROI                                    │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS HR COST INTELLIGENCE                    │   │
│ │ - Coût Complet d'un Recrutement                   │   │
│ │ - Budget Prévisionnel Recrutement                 │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ TABLEAU DE BORD FINANCIER RH                       │   │
│ │ - Coût moyen par recrutement par type de poste     │   │
│ │ - Délai moyen time-to-hire par profil             │   │
│ │ - Taux de réussite à 12 mois                      │   │
│ │ - ROI global de la fonction recrutement           │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ BUDGET PRÉVISIONNEL                               │   │
│ │ - Budget total estimé                              │   │
│ │ - Budget par poste et par trimestre               │   │
│ │ - Alertes si budget sous-dimensionné              │   │
│ │ - Recommandations d'optimisation                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Coût complet par recrutement                    │   │
│ │ - Tableau de bord financier RH                    │   │
│ │ - Budget prévisionnel                             │   │
│ │ - Alertes et recommandations                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-004 Recruteur Workspace :**
- Utilisation des données de temps mobilisé (DRH, manager, interviewers)
- Utilisation des données de sourcing (jobboards, LinkedIn)

**MVP-017 Market Intelligence :**
- Utilisation des données salariales pour calculer le coût d'un mauvais recrutement
- Utilisation des données de marché pour optimiser le budget

**MVP-021 Predictive Success Engine :**
- Utilisation des prédictions de succès pour calculer le risque de mauvais recrutement
- Utilisation des résultats réels pour calculer le taux de réussite

---

## 7. Structure de Données (TypeScript)

```typescript
interface RecruitmentCost {
  recruitmentId: string;
  jobId: string;
  calculatedAt: Date;
  
  directCosts: DirectCosts;
  indirectCosts: IndirectCosts;
  badHireCost?: BadHireCost;
  
  totalCost: number;
  averageCostComparison: {
    jobType: string;
    averageCost: number;
    variance: number;
    variancePercentage: number;
  };
}

interface DirectCosts {
  sourcingCosts: {
    jobboards: number;
    linkedIn: number;
    other: number;
    total: number;
  };
  
  agencyCosts: {
    agencyFee: number;
    total: number;
  };
  
  assessmentCosts: {
    tests: number;
    assessment: number;
    total: number;
  };
  
  administrativeCosts: {
    administrative: number;
    total: number;
  };
  
  total: number;
}

interface IndirectCosts {
  hrTimeCosts: {
    hours: number;
    hourlyRate: number;
    total: number;
  };
  
  managerTimeCosts: {
    hours: number;
    hourlyRate: number;
    total: number;
  };
  
  interviewerTimeCosts: {
    hours: number;
    hourlyRate: number;
    total: number;
  };
  
  nonProductionCosts: {
    vacancyDuration: number;
    dailyCost: number;
    total: number;
  };
  
  teamOverloadCosts: {
    overtimeCost: number;
    total: number;
  };
  
  total: number;
}

interface BadHireCost {
  departureDate: Date;
  tenure: number; // in months
  
  costCalculation: {
    annualSalary: number;
    multiplier: number; // 1 to 2
    total: number;
  };
  
  breakdown: {
    recruitmentRenewal: number;
    lostProductivity: number;
    teamImpact: number;
    lostOnboarding: number;
    total: number;
  };
}

interface FinancialDashboard {
  dashboardId: string;
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  
  averageCostByJobType: {
    jobType: string;
    averageCost: number;
    recruitmentCount: number;
  }[];
  
  averageTimeToHireByProfile: {
    profile: string;
    averageDays: number;
    recruitmentCount: number;
  }[];
  
  successRate12Months: {
    rate: number;
    totalRecruitments: number;
    successfulRecruitments: number;
  };
  
  globalROI: {
    totalCost: number;
    totalValue: number;
    roi: number;
    roiPercentage: number;
  };
}

interface RecruitmentBudget {
  budgetId: string;
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  
  totalBudget: number;
  
  budgetByJobAndQuarter: {
    jobId: string;
    jobTitle: string;
    quarter: string;
    budget: number;
  }[];
  
  alerts: {
    type: 'under_budgeted' | 'over_budgeted';
    jobId: string;
    jobTitle: string;
    currentBudget: number;
    recommendedBudget: number;
    gap: number;
  }[];
  
  optimizationRecommendations: {
    recommendation: string;
    potentialSavings: number;
    priority: 'high' | 'medium' | 'low';
  }[];
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de calcul des coûts | Recrutements avec coût calculé / total | ≥ 95% |
| Précision du budget | Écart budget réel / budget prévisionnel | ≤ 10% |
| Taux d'alerte budgétaire | Alertes détectées / budget sous-dimensionné | ≥ 90% |
| Satisfaction DRH | Satisfaction avec les tableaux de bord | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du coût moyen | Réduction du coût moyen par recrutement | ≥ 15% |
- Amélioration du ROI | Amélioration du ROI global de la fonction recrutement | ≥ 20% |
- Réduction des mauvais recrutements | Réduction du taux de départ < 12 mois | ≥ 30% |

---

## 9. Documents du Module

- **DOC-025-01** : Brief du Module (ce document)
- **DOC-025-02** : Coût Complet d'un Recrutement et Tableau de Bord Financier
- **DOC-025-03** : Budget Prévisionnel Recrutement et Optimisation

---

## 10. Conclusion

MVP-025 HR Cost Intelligence calcule le coût complet d'un recrutement (coûts directs : frais de sourcing, cabinet, évaluation, administratif ; coûts indirects : temps DRH, manager, interviewers, non-production, surcharge équipe ; coût d'un mauvais recrutement : 1 à 2 fois le salaire annuel brut), produit un tableau de bord financier RH (coût moyen par recrutement par type de poste, délai moyen time-to-hire par profil, taux de réussite à 12 mois, ROI global de la fonction recrutement), et génère un budget prévisionnel de recrutement (budget total estimé, budget par poste et trimestre, alertes si budget sous-dimensionné, recommandations d'optimisation). Le module permet au DRH de quantifier, justifier et piloter par les coûts pour le Comité de Direction. Le module s'intègre avec les modules existants (MVP-004, MVP-017, MVP-021).

**Points clés :**
- 4 catégories de coûts directs (sourcing, cabinet, évaluation, administratif)
- 5 catégories de coûts indirects (temps DRH, manager, interviewers, non-production, surcharge)
- Coût d'un mauvais recrutement (1 à 2 fois le salaire annuel brut)
- 4 indicateurs du tableau de bord financier (coût moyen, délai moyen, taux de réussite, ROI)
- Budget prévisionnel par poste et trimestre
- Alertes si budget sous-dimensionné
- Recommandations d'optimisation
- Intégration avec les modules existants
