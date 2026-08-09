# DOC-024-03 : Plan de Rétention Personnalisé et Analyse de Coûts

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de plan de rétention personnalisé et analyse de coûts pour MVP-024 Talent Retention Engine. Ce système génère un plan de rétention personnalisé pour chaque talent à risque identifié, recommande des actions (entretien de rétention, révision salariale, plan de carrière, nouveau périmètre, projet spécial, formation), calcule et compare le coût de la rétention vs coût du remplacement, et calcule le ROI de la rétention.

---

## 2. Principe Fondateur

Pour chaque talent à risque identifié, le moteur génère un plan de rétention personnalisé avec actions recommandées (entretien de rétention structuré, révision salariale ciblée, plan de carrière accéléré, nouveau périmètre de responsabilités, projet spécial motivant, formation ou certification valorisante). Le moteur calcule et compare le coût de la rétention vs coût du remplacement (recrutement + onboarding + montée en compétence = 6 à 18 mois de salaire), et calcule le ROI de la rétention (toujours positif).

---

## 3. Actions Recommandées

### 3.1 Entretien de Rétention Structuré

**Description :**
Entretien structuré avec le talent pour comprendre les motivations et attentes.

**Objectifs :**
- Comprendre les raisons du désengagement
- Identifier les attentes non satisfaites
- Explorer les solutions possibles
- Renforcer la relation

**Structure de l'entretien :**
1. Ouverture et contexte
2. Revue de la performance et contributions
3. Exploration des motivations et attentes
4. Identification des points de friction
5. Discussion des solutions possibles
6. Plan d'action conjoint

**Responsable :** Manager et DRH

---

### 3.2 Révision Salariale Ciblée

**Description :**
Révision salariale ciblée pour aligner le salaire avec le marché et la performance.

**Critères :**
- Performance élevée
- Salaire en dessous du marché (réf. MVP-017)
- Stagnation salariale > 2 ans

**Calcul de l'augmentation :**
- Basée sur l'écart avec le marché
- Basée sur la performance
- Basée sur la stagnation

**Responsable :** DRH avec validation direction

---

### 3.3 Plan de Carrière Accéléré

**Description :**
Plan de carrière accéléré pour offrir des perspectives d'évolution.

**Composants :**
- Promotion ciblée avec timeline
- Nouvelles responsabilités
- Plan de développement
- Mentoring

**Responsable :** Manager et DRH

---

### 3.4 Nouveau Périmètre de Responsabilités

**Description :**
Nouveau périmètre de responsabilités pour offrir de nouveaux défis.

**Types de changements :**
- Élargissement du périmètre actuel
- Changement de périmètre (nouveau domaine)
- Leadership de projet spécial
- Responsabilité transverse

**Responsable :** Manager

---

### 3.5 Projet Spécial Motivant

**Description :**
Projet spécial motivant pour réengager le talent.

**Types de projets :**
- Projet d'innovation
- Projet stratégique
- Projet de transformation
- Projet de développement

**Responsable :** Manager

---

### 3.6 Formation ou Certification Valorisante

**Description :**
Formation ou certification valorisante pour le développement du talent.

**Types de formations :**
- Certification professionnelle
- Formation technique avancée
- Formation leadership
- Formation spécialisée

**Responsable :** DRH

---

## 4. Analyse de Coûts

### 4.1 Coût de Remplacement Estimé

**Composants :**
- Coût de recrutement (frais de chasse, entretiens, etc.)
- Coût d'onboarding (formation, intégration)
- Coût de montée en compétence (période de productivité réduite)
- Coût de productivité perdue

**Calcul :**
- Coût de recrutement : 20-30% du salaire annuel
- Coût d'onboarding : 10-20% du salaire annuel
- Coût de montée en compétence : 50-100% du salaire annuel (6-12 mois)
- Coût de productivité perdue : 30-50% du salaire annuel

**Total :** 6 à 18 mois de salaire

---

### 4.2 Coût de la Rétention Proposée

**Composants :**
- Augmentation salariale
- Promotion (si applicable)
- Formation ou certification
- Projet spécial (coût additionnel)

**Calcul :**
- Augmentation salariale : 5-20% du salaire annuel
- Promotion : 10-30% du salaire annuel
- Formation : 5-15% du salaire annuel
- Projet spécial : 5-10% du salaire annuel

**Total :** 25-75% du salaire annuel

---

### 4.3 ROI de la Rétention

**Calcul :**
ROI = (Coût de remplacement évité - Coût de rétention) / Coût de rétention

**Exemple :**
- Coût de remplacement : 12 mois de salaire = 100 000€
- Coût de rétention : 6 mois de salaire = 50 000€
- ROI = (100 000€ - 50 000€) / 50 000€ = 100%

**Conclusion :** Le ROI de la rétention est toujours positif.

---

## 5. Algorithme de Génération du Plan de Rétention

### 5.1 Processus Global

```typescript
async function generateRetentionPlan(talentId: string, riskAssessment: DepartureRiskAssessment): Promise<RetentionPlan> {
  // 1. Récupération des données du talent
  const talent = await getTalent(talentId);
  
  // 2. Analyse des facteurs de risque
  const riskFactors = await analyzeRiskFactors(riskAssessment);
  
  // 3. Génération des actions recommandées
  const recommendedActions = await generateRecommendedActions(talent, riskFactors);
  
  // 4. Calcul du coût de la rétention
  const retentionCost = await calculateRetentionCost(recommendedActions, talent);
  
  // 5. Calcul du coût du remplacement
  const replacementCost = await calculateReplacementCost(talent);
  
  // 6. Calcul du ROI
  const roi = await calculateROI(retentionCost, replacementCost);
  
  // 7. Construction du plan de rétention
  const plan: RetentionPlan = {
    planId: generatePlanId(),
    talentId,
    generatedAt: new Date(),
    
    recommendedActions,
    
    costAnalysis: {
      retentionCost,
      replacementCost,
      roi,
      paybackPeriod: calculatePaybackPeriod(retentionCost, replacementCost)
    }
  };
  
  // 8. Sauvegarde du plan
  await saveRetentionPlan(plan);
  
  return plan;
}
```

---

### 5.2 Génération des Actions Recommandées

```typescript
async function generateRecommendedActions(talent: Talent, riskFactors: string[]): Promise<{
  action: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
}[]> {
  const actions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[] = [];
  
  // Action 1 : Entretien de rétention structuré (toujours recommandé)
  actions.push({
    action: 'Entretien de rétention structuré',
    description: 'Organiser un entretien structuré avec le talent pour comprendre les motivations et attentes',
    priority: 'high',
    timeline: '1 semaine'
  });
  
  // Action 2 : Révision salariale (si stagnation salariale)
  if (riskFactors.includes('Stagnation salariale > 2 ans')) {
    actions.push({
      action: 'Révision salariale ciblée',
      description: 'Proposer une augmentation salariale pour aligner avec le marché et la performance',
      priority: 'high',
      timeline: '1 mois'
    });
  }
  
  // Action 3 : Plan de carrière accéléré (si absence de promotion)
  if (riskFactors.includes('Absence de promotion promise')) {
    actions.push({
      action: 'Plan de carrière accéléré',
      description: 'Proposer un plan de carrière accéléré avec promotion ciblée',
      priority: 'high',
      timeline: '3-6 mois'
    });
  }
  
  // Action 4 : Nouveau périmètre de responsabilités (si poste sous-dimensionné)
  if (riskFactors.includes('Poste sous-dimensionné vs potentiel')) {
    actions.push({
      action: 'Nouveau périmètre de responsabilités',
      description: 'Proposer un nouveau périmètre de responsabilités pour offrir de nouveaux défis',
      priority: 'medium',
      timeline: '1-2 mois'
    });
  }
  
  // Action 5 : Projet spécial motivant (si diminution des initiatives)
  if (riskFactors.includes('Diminution des initiatives')) {
    actions.push({
      action: 'Projet spécial motivant',
      description: 'Proposer un projet spécial motivant pour réengager le talent',
      priority: 'medium',
      timeline: '1-3 mois'
    });
  }
  
  // Action 6 : Formation ou certification valorisante (si besoin de développement)
  actions.push({
    action: 'Formation ou certification valorisante',
    description: 'Proposer une formation ou certification valorisante pour le développement du talent',
    priority: 'low',
    timeline: '3-6 mois'
  });
  
  return actions;
}
```

---

### 5.3 Calcul du Coût de la Rétention

```typescript
async function calculateRetentionCost(actions: any[], talent: Talent): Promise<number> {
  let totalCost = 0;
  
  const annualSalary = talent.annualSalary;
  
  for (const action of actions) {
    switch (action.action) {
      case 'Révision salariale ciblée':
        totalCost += annualSalary * 0.15; // 15% d'augmentation
        break;
      case 'Plan de carrière accéléré':
        totalCost += annualSalary * 0.20; // 20% pour la promotion
        break;
      case 'Formation ou certification valorisante':
        totalCost += annualSalary * 0.10; // 10% pour la formation
        break;
      case 'Projet spécial motivant':
        totalCost += annualSalary * 0.05; // 5% pour le projet
        break;
      default:
        // Pas de coût direct
        break;
    }
  }
  
  return totalCost;
}
```

---

### 5.4 Calcul du Coût du Remplacement

```typescript
async function calculateReplacementCost(talent: Talent): Promise<number> {
  const annualSalary = talent.annualSalary;
  
  // Coût de recrutement : 25% du salaire annuel
  const recruitmentCost = annualSalary * 0.25;
  
  // Coût d'onboarding : 15% du salaire annuel
  const onboardingCost = annualSalary * 0.15;
  
  // Coût de montée en compétence : 75% du salaire annuel (9 mois)
  const rampUpCost = annualSalary * 0.75;
  
  // Coût de productivité perdue : 40% du salaire annuel
  const lostProductivityCost = annualSalary * 0.40;
  
  const totalCost = recruitmentCost + onboardingCost + rampUpCost + lostProductivityCost;
  
  return totalCost;
}
```

---

### 5.5 Calcul du ROI

```typescript
async function calculateROI(retentionCost: number, replacementCost: number): Promise<{
  value: number;
  percentage: number;
}> {
  const value = replacementCost - retentionCost;
  const percentage = (value / retentionCost) * 100;
  
  return {
    value,
    percentage
  };
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface RetentionPlan {
  planId: string;
  talentId: string;
  generatedAt: Date;
  
  recommendedActions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[];
  
  costAnalysis: {
    retentionCost: number;
    replacementCost: number;
    roi: {
      value: number;
      percentage: number;
    };
    paybackPeriod: string;
  };
}

interface CostAnalysis {
  retentionCost: {
    salaryIncrease: number;
    promotionCost: number;
    trainingCost: number;
    projectCost: number;
    total: number;
  };
  
  replacementCost: {
    recruitmentCost: number;
    onboardingCost: number;
    rampUpCost: number;
    lostProductivityCost: number;
    total: number;
  };
  
  roi: {
    value: number;
    percentage: number;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE retention_plan (
  id VARCHAR(36) PRIMARY KEY,
  talent_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  recommended_actions JSON NOT NULL,
  
  retention_cost DECIMAL(15,2) NOT NULL,
  replacement_cost DECIMAL(15,2) NOT NULL,
  roi_value DECIMAL(15,2) NOT NULL,
  roi_percentage DECIMAL(10,2) NOT NULL,
  payback_period VARCHAR(50) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (talent_id) REFERENCES talents(id)
);

CREATE INDEX idx_retention_plan_talent ON retention_plan(talent_id);
CREATE INDEX idx_retention_plan_date ON retention_plan(generated_at);
CREATE INDEX idx_retention_plan_roi ON retention_plan(roi_percentage);
```

---

## 8. API Endpoints

```typescript
// POST /api/talent-retention/retention-plan
async function generateRetentionPlan(talentId: string, riskAssessmentId: string): Promise<RetentionPlan> {
  return await generateRetentionPlan(talentId, riskAssessmentId);
}

// GET /api/talent-retention/retention-plan/:planId
async function getRetentionPlan(planId: string): Promise<RetentionPlan> {
  return await getRetentionPlanById(planId);
}

// GET /api/talent-retention/retention-plan/talent/:talentId
async function getRetentionPlanByTalent(talentId: string): Promise<RetentionPlan> {
  return await getRetentionPlanByTalentId(talentId);
}

// PUT /api/talent-retention/retention-plan/:planId
async function updateRetentionPlan(planId: string, updates: Partial<RetentionPlan>): Promise<RetentionPlan> {
  return await updateRetentionPlanById(planId, updates);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération de plans | Plans générés / talents à risque | ≥ 90% |
| Taux d'adoption des actions | Actions appliquées / recommandées | ≥ 70% |
| Taux de rétention réussie | Talents retenus / talents à risque | ≥ 70% |
| Satisfaction DRH | Satisfaction avec les plans | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du taux de départ | Réduction des départs de talents clés | ≥ 30% |
| Économie sur les coûts | Économie réalisée / coût de remplacement évité | ≥ 50% |
- ROI moyen | ROI moyen des plans de rétention | ≥ 100% |

---

## 10. Conclusion

Le système de plan de rétention personnalisé et analyse de coûts génère un plan de rétention personnalisé pour chaque talent à risque identifié, recommande des actions (entretien de rétention structuré, révision salariale ciblée, plan de carrière accéléré, nouveau périmètre de responsabilités, projet spécial motivant, formation ou certification valorisante), calcule et compare le coût de la rétention vs coût du remplacement (6 à 18 mois de salaire), et calcule le ROI de la rétention (toujours positif). Le système permet de prendre des décisions éclairées basées sur le coût et le ROI de la rétention. Le système s'intègre avec les modules existants (MVP-017, MVP-021).

**Points clés :**
- 6 actions de rétention recommandées
- Plan personnalisé basé sur les facteurs de risque
- Coût de remplacement estimé (6 à 18 mois de salaire)
- Coût de rétention calculé (25-75% du salaire annuel)
- ROI de la rétention (toujours positif)
- Comparaison coût rétention vs coût remplacement
- Période de retour sur investissement calculée
- Intégration avec les modules existants
