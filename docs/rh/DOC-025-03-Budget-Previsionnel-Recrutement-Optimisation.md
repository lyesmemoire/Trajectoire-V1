# DOC-025-03 : Budget Prévisionnel Recrutement et Optimisation

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de budget prévisionnel recrutement et optimisation pour MVP-025 HR Cost Intelligence. Ce système génère un budget prévisionnel de recrutement sur la base du plan de recrutement (budget total estimé, budget par poste et par trimestre), génère des alertes si le budget est sous-dimensionné, et recommande des optimisations pour réduire les coûts et améliorer l'efficacité.

---

## 2. Principe Fondateur

Sur la base du plan de recrutement, le moteur génère un budget prévisionnel détaillé (budget total estimé, budget par poste et par trimestre). Le moteur génère des alertes si le budget est sous-dimensionné par rapport aux coûts historiques ou aux coûts du marché, et recommande des optimisations pour réduire les coûts (réduction des coûts de sourcing, optimisation du temps mobilisé, réduction du taux de mauvais recrutement) et améliorer l'efficacité (amélioration du time-to-hire, amélioration du taux de réussite).

---

## 3. Budget Prévisionnel

### 3.1 Budget Total Estimé

**Description :**
Budget total estimé pour le plan de recrutement.

**Calcul :**
- Budget total = somme des coûts estimés pour chaque poste

**Composants :**
- Coûts directs estimés (sourcing, cabinet, évaluation, administratif)
- Coûts indirects estimés (temps DRH, manager, interviewers, non-production, surcharge)
- Marge de sécurité (généralement 10-20%)

---

### 3.2 Budget par Poste et par Trimestre

**Description :**
Budget détaillé par poste et par trimestre.

**Calcul :**
- Budget par poste = coût moyen pour le type de poste × nombre de recrutements
- Budget par trimestre = répartition des recrutements par trimestre

**Répartition trimestrielle :**
- T1 (Janvier-Mars)
- T2 (Avril-Juin)
- T3 (Juillet-Septembre)
- T4 (Octobre-Décembre)

---

### 3.3 Alertes si Budget Sous-Dimensionné

**Description :**
Alertes générées si le budget est sous-dimensionné.

**Critères d'alerte :**
- Budget < coût historique moyen × nombre de recrutements
- Budget < coût du marché × nombre de recrutements
- Budget < coût estimé avec marge de sécurité

**Types d'alertes :**
- Alerte de sous-budget (budget insuffisant)
- Alerte de sur-budget (budget excessif)

---

### 3.4 Recommandations d'Optimisation

**Description :**
Recommandations pour optimiser le budget et améliorer l'efficacité.

**Types d'optimisations :**
- Réduction des coûts de sourcing
- Optimisation du temps mobilisé
- Réduction du taux de mauvais recrutement
- Amélioration du time-to-hire
- Amélioration du taux de réussite

---

## 4. Algorithme de Génération du Budget Prévisionnel

### 4.1 Processus Global

```typescript
async function generateRecruitmentBudget(recruitmentPlan: RecruitmentPlan): Promise<RecruitmentBudget> {
  // 1. Analyse du plan de recrutement
  const planAnalysis = await analyzeRecruitmentPlan(recruitmentPlan);
  
  // 2. Calcul du budget total estimé
  const totalBudget = await calculateTotalBudget(planAnalysis);
  
  // 3. Calcul du budget par poste et par trimestre
  const budgetByJobAndQuarter = await calculateBudgetByJobAndQuarter(planAnalysis);
  
  // 4. Génération des alertes
  const alerts = await generateBudgetAlerts(totalBudget, budgetByJobAndQuarter);
  
  // 5. Génération des recommandations d'optimisation
  const optimizationRecommendations = await generateOptimizationRecommendations(planAnalysis, alerts);
  
  // 6. Construction du budget
  const budget: RecruitmentBudget = {
    budgetId: generateBudgetId(),
    periodStart: recruitmentPlan.periodStart,
    periodEnd: recruitmentPlan.periodEnd,
    generatedAt: new Date(),
    
    totalBudget,
    
    budgetByJobAndQuarter,
    
    alerts,
    
    optimizationRecommendations
  };
  
  // 7. Sauvegarde du budget
  await saveRecruitmentBudget(budget);
  
  return budget;
}
```

---

### 4.2 Calcul du Budget Total Estimé

```typescript
async function calculateTotalBudget(planAnalysis: any): Promise<number> {
  let totalBudget = 0;
  
  // Pour chaque poste dans le plan
  for (const job of planAnalysis.jobs) {
    // Coût moyen pour le type de poste
    const averageCost = await getAverageCostByJobType(job.jobType);
    
    // Coût estimé pour le poste
    const estimatedCost = averageCost * job.recruitmentCount;
    
    // Ajout au budget total
    totalBudget += estimatedCost;
  }
  
  // Ajout de la marge de sécurité (15%)
  totalBudget *= 1.15;
  
  return totalBudget;
}
```

---

### 4.3 Calcul du Budget par Poste et par Trimestre

```typescript
async function calculateBudgetByJobAndQuarter(planAnalysis: any): Promise<{
  jobId: string;
  jobTitle: string;
  quarter: string;
  budget: number;
}[]> {
  const budgetByJobAndQuarter: {
    jobId: string;
    jobTitle: string;
    quarter: string;
    budget: number;
  }[] = [];
  
  const quarters = ['T1', 'T2', 'T3', 'T4'];
  
  // Pour chaque poste dans le plan
  for (const job of planAnalysis.jobs) {
    // Coût moyen pour le type de poste
    const averageCost = await getAverageCostByJobType(job.jobType);
    
    // Pour chaque trimestre
    for (const quarter of quarters) {
      // Nombre de recrutements pour ce poste dans ce trimestre
      const recruitmentCount = job.quarterlyRecruitmentCount[quarter] || 0;
      
      // Budget pour ce poste dans ce trimestre
      const budget = averageCost * recruitmentCount;
      
      budgetByJobAndQuarter.push({
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        quarter,
        budget
      });
    }
  }
  
  return budgetByJobAndQuarter;
}
```

---

### 4.4 Génération des Alertes

```typescript
async function generateBudgetAlerts(
  totalBudget: number,
  budgetByJobAndQuarter: any[]
): Promise<{
  type: 'under_budgeted' | 'over_budgeted';
  jobId: string;
  jobTitle: string;
  currentBudget: number;
  recommendedBudget: number;
  gap: number;
}[]> {
  const alerts: {
    type: 'under_budgeted' | 'over_budgeted';
    jobId: string;
    jobTitle: string;
    currentBudget: number;
    recommendedBudget: number;
    gap: number;
  }[] = [];
  
  // Pour chaque poste
  for (const budget of budgetByJobAndQuarter) {
    // Coût historique moyen pour le type de poste
    const historicalAverageCost = await getHistoricalAverageCostByJob(budget.jobId);
    
    // Budget actuel pour le poste
    const currentBudget = budget.budget;
    
    // Budget recommandé (avec marge de sécurité de 15%)
    const recommendedBudget = historicalAverageCost * 1.15;
    
    // Écart
    const gap = recommendedBudget - currentBudget;
    
    // Si l'écart est significatif (> 20%), générer une alerte
    if (Math.abs(gap) / recommendedBudget > 0.2) {
      alerts.push({
        type: gap > 0 ? 'under_budgeted' : 'over_budgeted',
        jobId: budget.jobId,
        jobTitle: budget.jobTitle,
        currentBudget,
        recommendedBudget,
        gap
      });
    }
  }
  
  return alerts;
}
```

---

### 4.5 Génération des Recommandations d'Optimisation

```typescript
async function generateOptimizationRecommendations(
  planAnalysis: any,
  alerts: any[]
): Promise<{
  recommendation: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
}[]> {
  const recommendations: {
    recommendation: string;
    potentialSavings: number;
    priority: 'high' | 'medium' | 'low';
  }[] = [];
  
  // Recommandation 1 : Réduction des coûts de sourcing
  const sourcingSavings = await calculateSourcingSavings(planAnalysis);
  if (sourcingSavings > 0) {
    recommendations.push({
      recommendation: 'Réduire les coûts de sourcing en optimisant l\'utilisation des jobboards et LinkedIn',
      potentialSavings: sourcingSavings,
      priority: 'medium'
    });
  }
  
  // Recommandation 2 : Optimisation du temps mobilisé
  const timeSavings = await calculateTimeSavings(planAnalysis);
  if (timeSavings > 0) {
    recommendations.push({
      recommendation: 'Optimiser le temps mobilisé en utilisant l\'automatisation (MVP-006 Recruiter Copilot)',
      potentialSavings: timeSavings,
      priority: 'high'
    });
  }
  
  // Recommandation 3 : Réduction du taux de mauvais recrutement
  const badHireSavings = await calculateBadHireSavings(planAnalysis);
  if (badHireSavings > 0) {
    recommendations.push({
      recommendation: 'Réduire le taux de mauvais recrutement en utilisant MVP-021 Predictive Success Engine',
      potentialSavings: badHireSavings,
      priority: 'high'
    });
  }
  
  // Recommandation 4 : Amélioration du time-to-hire
  const timeToHireSavings = await calculateTimeToHireSavings(planAnalysis);
  if (timeToHireSavings > 0) {
    recommendations.push({
      recommendation: 'Améliorer le time-to-hire en utilisant MVP-005 Semantic Talent Search',
      potentialSavings: timeToHireSavings,
      priority: 'medium'
    });
  }
  
  // Recommandation 5 : Amélioration du taux de réussite
  const successRateSavings = await calculateSuccessRateSavings(planAnalysis);
  if (successRateSavings > 0) {
    recommendations.push({
      recommendation: 'Améliorer le taux de réussite en utilisant MVP-013 Interview Intelligence',
      potentialSavings: successRateSavings,
      priority: 'medium'
    });
  }
  
  return recommendations;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
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

interface RecruitmentPlan {
  planId: string;
  periodStart: Date;
  periodEnd: Date;
  
  jobs: {
    jobId: string;
    jobTitle: string;
    jobType: string;
    recruitmentCount: number;
    quarterlyRecruitmentCount: {
      T1: number;
      T2: number;
      T3: number;
      T4: number;
    };
  }[];
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE recruitment_budget (
  id VARCHAR(36) PRIMARY KEY,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  total_budget DECIMAL(15,2) NOT NULL,
  
  budget_by_job_and_quarter JSON NOT NULL,
  
  alerts JSON NOT NULL,
  
  optimization_recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recruitment_budget_period ON recruitment_budget(period_start, period_end);
CREATE INDEX idx_recruitment_budget_date ON recruitment_budget(generated_at);
```

---

## 7. API Endpoints

```typescript
// POST /api/hr-cost/budget
async function generateRecruitmentBudget(recruitmentPlan: RecruitmentPlan): Promise<RecruitmentBudget> {
  return await generateRecruitmentBudget(recruitmentPlan);
}

// GET /api/hr-cost/budget/:budgetId
async function getRecruitmentBudget(budgetId: string): Promise<RecruitmentBudget> {
  return await getRecruitmentBudgetById(budgetId);
}

// GET /api/hr-cost/budget/period/:periodStart/:periodEnd
async function getRecruitmentBudgetByPeriod(periodStart: Date, periodEnd: Date): Promise<RecruitmentBudget> {
  return await getRecruitmentBudgetByPeriod(periodStart, periodEnd);
}

// PUT /api/hr-cost/budget/:budgetId
async function updateRecruitmentBudget(budgetId: string, updates: Partial<RecruitmentBudget>): Promise<RecruitmentBudget> {
  return await updateRecruitmentBudgetById(budgetId, updates);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération de budgets | Budgets générés / plans de recrutement | ≥ 95% |
| Précision du budget | Écart budget réel / budget prévisionnel | ≤ 10% |
| Taux d'alerte budgétaire | Alertes détectées / budget sous-dimensionné | ≥ 90% |
| Taux d'adoption des recommandations | Recommandations appliquées / total | ≥ 70% |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des coûts | Réduction du coût moyen par recrutement | ≥ 15% |
- Économies réalisées | Économies réalisées / budget total | ≥ 10% |
- Amélioration de l'efficacité | Amélioration du ROI global de la fonction recrutement | ≥ 20% |

---

## 9. Conclusion

Le système de budget prévisionnel recrutement et optimisation génère un budget prévisionnel de recrutement sur la base du plan de recrutement (budget total estimé, budget par poste et par trimestre), génère des alertes si le budget est sous-dimensionné par rapport aux coûts historiques ou aux coûts du marché, et recommande des optimisations pour réduire les coûts (réduction des coûts de sourcing, optimisation du temps mobilisé, réduction du taux de mauvais recrutement) et améliorer l'efficacité (amélioration du time-to-hire, amélioration du taux de réussite). Le système permet au DRH de planifier et optimiser le budget de recrutement pour le Comité de Direction. Le système s'intègre avec les modules existants (MVP-005, MVP-006, MVP-013, MVP-021).

**Points clés :**
- Budget total estimé avec marge de sécurité (15%)
- Budget par poste et par trimestre
- 4 trimestres (T1, T2, T3, T4)
- Alertes si budget sous-dimensionné ou sur-budgeté
- 5 types de recommandations d'optimisation
- Calcul des économies potentielles
- Priorisation des recommandations (haute, moyenne, basse)
- Intégration avec les modules existants
