# DOC-025-02 : Coût Complet d'un Recrutement et Tableau de Bord Financier

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de calcul du coût complet d'un recrutement et tableau de bord financier pour MVP-025 HR Cost Intelligence. Ce système calcule le coût complet de chaque recrutement (coûts directs, coûts indirects, coût d'un mauvais recrutement), compare avec le coût moyen pour le type de poste, et produit un tableau de bord financier RH (coût moyen par recrutement par type de poste, délai moyen time-to-hire par profil, taux de réussite à 12 mois, ROI global de la fonction recrutement).

---

## 2. Principe Fondateur

Pour chaque recrutement, le moteur calcule le coût complet (coûts directs : frais de sourcing, cabinet, évaluation, administratif ; coûts indirects : temps DRH, manager, interviewers, non-production, surcharge équipe). Le moteur calcule également le coût d'un mauvais recrutement (1 à 2 fois le salaire annuel brut) avec décomposition (renouvellement, perte de productivité, impact équipe, onboarding perdu). Le moteur produit un tableau de bord financier RH (coût moyen par recrutement par type de poste, délai moyen time-to-hire par profil, taux de réussite à 12 mois, ROI global de la fonction recrutement) pour permettre au DRH de quantifier et justifier les coûts pour le Comité de Direction.

---

## 3. Coûts Directs

### 3.1 Frais de Sourcing

**Description :**
Coûts liés au sourcing des candidats.

**Composants :**
- Jobboards (APEC, Indeed, Monster, etc.)
- LinkedIn (InMail, Job Slots, etc.)
- Autres (réseaux spécialisés, événements, etc.)

**Calcul :**
- Coût total = somme des frais de sourcing

---

### 3.2 Frais de Cabinet si Externalisé

**Description :**
Frais de cabinet de recrutement si le processus est externalisé.

**Composants :**
- Frais de cabinet (généralement 15-25% du salaire annuel)
- Frais additionnels (recherche, évaluation, etc.)

**Calcul :**
- Coût total = frais de cabinet + frais additionnels

---

### 3.3 Frais d'Évaluation

**Description :**
Frais liés à l'évaluation des candidats.

**Composants :**
- Tests de personnalité
- Tests techniques
- Assessment center
- Outils d'évaluation en ligne

**Calcul :**
- Coût total = somme des frais d'évaluation

---

### 3.4 Coût Administratif du Processus

**Description :**
Coûts administratifs liés au processus de recrutement.

**Composants :**
- Outils de recrutement (ATS)
- Logiciels de visioconférence
- Frais de déplacement pour entretiens
- Autres frais administratifs

**Calcul :**
- Coût total = somme des coûts administratifs

---

## 4. Coûts Indirects

### 4.1 Temps DRH Mobilisé

**Description :**
Coût du temps mobilisé par le DRH pour le recrutement.

**Calcul :**
- Coût = heures mobilisées × coût horaire du DRH

**Activités :**
- Définition du poste
- Validation des candidats
- Participation aux entretiens
- Coordination du processus

---

### 4.2 Temps Manager Mobilisé

**Description :**
Coût du temps mobilisé par le manager pour le recrutement.

**Calcul :**
- Coût = heures mobilisées × coût horaire du manager

**Activités :**
- Définition des besoins
- Participation aux entretiens
- Validation du candidat
- Intégration du nouveau collaborateur

---

### 4.3 Temps des Interviewers

**Description :**
Coût du temps mobilisé par les interviewers pour le recrutement.

**Calcul :**
- Coût = somme des heures mobilisées × coût horaire de chaque interviewer

**Activités :**
- Entretiens techniques
- Entretiens comportementaux
- Évaluation des candidats

---

### 4.4 Coût de la Non-Production Pendant la Vacance

**Description :**
Coût de la non-production pendant la vacance du poste.

**Calcul :**
- Coût = durée de la vacance (jours) × coût journalier de la non-production

**Facteurs :**
- Impact sur les projets
- Retard dans les livrables
- Perte d'opportunités

---

### 4.5 Coût de la Surcharge de l'Équipe Pendant la Vacance

**Description :**
Coût de la surcharge de l'équipe pendant la vacance du poste.

**Calcul :**
- Coût = heures supplémentaires × coût horaire + coûts d'intérim

**Facteurs :**
- Heures supplémentaires
- Intérim
- Stress et burnout

---

## 5. Coût d'un Mauvais Recrutement

### 5.1 Calcul du Coût

**Description :**
Coût d'un départ avant 12 mois.

**Calcul :**
- Coût = 1 à 2 fois le salaire annuel brut

**Multiplicateur :**
- 1x si départ < 6 mois
- 1.5x si départ entre 6 et 12 mois
- 2x si départ < 3 mois (impact élevé)

---

### 5.2 Décomposition du Coût

**Renouvellement du processus de recrutement :**
- Coût du nouveau recrutement (coûts directs + indirects)
- Temps mobilisé pour le nouveau processus

**Perte de productivité :**
- Perte de productivité pendant la vacance
- Perte de productivité pendant l'onboarding du nouveau collaborateur

**Impact sur l'équipe :**
- Surcharge de l'équipe
- Stress et burnout
- Perte de motivation

**Coût de l'onboarding perdu :**
- Coût de l'onboarding du collaborateur parti
- Coût de l'onboarding du nouveau collaborateur

---

## 6. Algorithme de Calcul du Coût Complet

### 6.1 Processus Global

```typescript
async function calculateRecruitmentCost(recruitmentId: string): Promise<RecruitmentCost> {
  // 1. Récupération des données du recrutement
  const recruitment = await getRecruitment(recruitmentId);
  
  // 2. Calcul des coûts directs
  const directCosts = await calculateDirectCosts(recruitment);
  
  // 3. Calcul des coûts indirects
  const indirectCosts = await calculateIndirectCosts(recruitment);
  
  // 4. Calcul du coût total
  const totalCost = directCosts.total + indirectCosts.total;
  
  // 5. Comparaison avec le coût moyen
  const averageCostComparison = await compareWithAverageCost(recruitment.jobId, totalCost);
  
  // 6. Construction du coût de recrutement
  const cost: RecruitmentCost = {
    recruitmentId,
    jobId: recruitment.jobId,
    calculatedAt: new Date(),
    
    directCosts,
    indirectCosts,
    
    totalCost,
    averageCostComparison
  };
  
  // 7. Sauvegarde du coût
  await saveRecruitmentCost(cost);
  
  return cost;
}
```

---

### 6.2 Calcul des Coûts Directs

```typescript
async function calculateDirectCosts(recruitment: Recruitment): Promise<DirectCosts> {
  // Frais de sourcing
  const sourcingCosts = {
    jobboards: recruitment.sourcingCosts.jobboards || 0,
    linkedIn: recruitment.sourcingCosts.linkedIn || 0,
    other: recruitment.sourcingCosts.other || 0,
    total: (recruitment.sourcingCosts.jobboards || 0) + 
           (recruitment.sourcingCosts.linkedIn || 0) + 
           (recruitment.sourcingCosts.other || 0)
  };
  
  // Frais de cabinet
  const agencyCosts = {
    agencyFee: recruitment.agencyCosts.agencyFee || 0,
    total: recruitment.agencyCosts.agencyFee || 0
  };
  
  // Frais d'évaluation
  const assessmentCosts = {
    tests: recruitment.assessmentCosts.tests || 0,
    assessment: recruitment.assessmentCosts.assessment || 0,
    total: (recruitment.assessmentCosts.tests || 0) + 
           (recruitment.assessmentCosts.assessment || 0)
  };
  
  // Coût administratif
  const administrativeCosts = {
    administrative: recruitment.administrativeCosts.administrative || 0,
    total: recruitment.administrativeCosts.administrative || 0
  };
  
  const total = sourcingCosts.total + agencyCosts.total + 
               assessmentCosts.total + administrativeCosts.total;
  
  return {
    sourcingCosts,
    agencyCosts,
    assessmentCosts,
    administrativeCosts,
    total
  };
}
```

---

### 6.3 Calcul des Coûts Indirects

```typescript
async function calculateIndirectCosts(recruitment: Recruitment): Promise<IndirectCosts> {
  // Temps DRH mobilisé
  const hrTimeCosts = {
    hours: recruitment.hrTime.hours || 0,
    hourlyRate: recruitment.hrTime.hourlyRate || 0,
    total: (recruitment.hrTime.hours || 0) * (recruitment.hrTime.hourlyRate || 0)
  };
  
  // Temps manager mobilisé
  const managerTimeCosts = {
    hours: recruitment.managerTime.hours || 0,
    hourlyRate: recruitment.managerTime.hourlyRate || 0,
    total: (recruitment.managerTime.hours || 0) * (recruitment.managerTime.hourlyRate || 0)
  };
  
  // Temps des interviewers
  const interviewerTimeCosts = {
    hours: recruitment.interviewerTime.hours || 0,
    hourlyRate: recruitment.interviewerTime.hourlyRate || 0,
    total: (recruitment.interviewerTime.hours || 0) * (recruitment.interviewerTime.hourlyRate || 0)
  };
  
  // Coût de la non-production
  const nonProductionCosts = {
    vacancyDuration: recruitment.vacancyDuration || 0,
    dailyCost: recruitment.dailyCost || 0,
    total: (recruitment.vacancyDuration || 0) * (recruitment.dailyCost || 0)
  };
  
  // Coût de la surcharge de l'équipe
  const teamOverloadCosts = {
    overtimeCost: recruitment.teamOverload.overtimeCost || 0,
    total: recruitment.teamOverload.overtimeCost || 0
  };
  
  const total = hrTimeCosts.total + managerTimeCosts.total + 
               interviewerTimeCosts.total + nonProductionCosts.total + 
               teamOverloadCosts.total;
  
  return {
    hrTimeCosts,
    managerTimeCosts,
    interviewerTimeCosts,
    nonProductionCosts,
    teamOverloadCosts,
    total
  };
}
```

---

### 6.4 Calcul du Coût d'un Mauvais Recrutement

```typescript
async function calculateBadHireCost(recruitmentId: string, departureDate: Date): Promise<BadHireCost> {
  const recruitment = await getRecruitment(recruitmentId);
  const candidate = await getCandidate(recruitment.selectedCandidateId);
  
  // Calcul de l'ancienneté
  const hireDate = recruitment.hireDate;
  const tenure = (departureDate.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30); // en mois
  
  // Détermination du multiplicateur
  let multiplier: number;
  if (tenure < 3) {
    multiplier = 2;
  } else if (tenure < 6) {
    multiplier = 1;
  } else {
    multiplier = 1.5;
  }
  
  // Calcul du coût
  const annualSalary = candidate.annualSalary;
  const total = annualSalary * multiplier;
  
  // Décomposition
  const breakdown = {
    recruitmentRenewal: total * 0.4,
    lostProductivity: total * 0.3,
    teamImpact: total * 0.2,
    lostOnboarding: total * 0.1,
    total
  };
  
  const badHireCost: BadHireCost = {
    departureDate,
    tenure,
    
    costCalculation: {
      annualSalary,
      multiplier,
      total
    },
    
    breakdown
  };
  
  return badHireCost;
}
```

---

## 7. Tableau de Bord Financier RH

### 7.1 Coût Moyen par Recrutement par Type de Poste

**Description :**
Coût moyen par recrutement pour chaque type de poste.

**Calcul :**
- Coût moyen = somme des coûts / nombre de recrutements

**Types de poste :**
- Cadres dirigeants
- Cadres supérieurs
- Cadres
- Employés
- Ouvriers

---

### 7.2 Délai Moyen Time-to-Hire par Profil

**Description :**
Délai moyen de recrutement pour chaque profil.

**Calcul :**
- Délai moyen = somme des délais / nombre de recrutements

**Profils :**
- Profil technique
- Profil commercial
- Profil marketing
- Profil administratif
- Autres profils

---

### 7.3 Taux de Réussite à 12 Mois

**Description :**
Taux de réussite des recrutements à 12 mois.

**Calcul :**
- Taux de réussite = (recrutements réussis / total recrutements) × 100

**Critère de réussite :**
- Collaborateur toujours en poste après 12 mois
- Performance satisfaisante

---

### 7.4 ROI Global de la Fonction Recrutement

**Description :**
ROI global de la fonction recrutement.

**Calcul :**
- ROI = (valeur créée - coût total) / coût total

**Valeur créée :**
- Productivité des recrutements
- Contribution aux objectifs de l'entreprise
- Réduction des coûts de remplacement

---

## 8. Structure de Données (TypeScript)

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
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE recruitment_cost (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  calculated_at TIMESTAMP NOT NULL,
  
  direct_costs JSON NOT NULL,
  indirect_costs JSON NOT NULL,
  bad_hire_cost JSON,
  
  total_cost DECIMAL(15,2) NOT NULL,
  average_cost_comparison JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (recruitment_id) REFERENCES recruitments(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_recruitment_cost_recruitment ON recruitment_cost(recruitment_id);
CREATE INDEX idx_recruitment_cost_job ON recruitment_cost(job_id);
CREATE INDEX idx_recruitment_cost_date ON recruitment_cost(calculated_at);
```

---

## 10. API Endpoints

```typescript
// POST /api/hr-cost/recruitment-cost
async function calculateRecruitmentCost(recruitmentId: string): Promise<RecruitmentCost> {
  return await calculateRecruitmentCost(recruitmentId);
}

// GET /api/hr-cost/recruitment-cost/:costId
async function getRecruitmentCost(costId: string): Promise<RecruitmentCost> {
  return await getRecruitmentCostById(costId);
}

// GET /api/hr-cost/recruitment-cost/recruitment/:recruitmentId
async function getRecruitmentCostByRecruitment(recruitmentId: string): Promise<RecruitmentCost> {
  return await getRecruitmentCostByRecruitmentId(recruitmentId);
}

// POST /api/hr-cost/bad-hire-cost
async function calculateBadHireCost(recruitmentId: string, departureDate: Date): Promise<BadHireCost> {
  return await calculateBadHireCost(recruitmentId, departureDate);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de calcul des coûts | Recrutements avec coût calculé / total | ≥ 95% |
| Précision du calcul | Écart coût réel / coût calculé | ≤ 10% |
| Taux de comparaison | Recrutements comparés / total | ≥ 90% |
| Satisfaction DRH | Satisfaction avec les coûts | ≥ 4.5/5 |

### 11.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du coût moyen | Réduction du coût moyen par recrutement | ≥ 15% |
- Amélioration du ROI | Amélioration du ROI global de la fonction recrutement | ≥ 20% |
- Réduction des mauvais recrutements | Réduction du taux de départ < 12 mois | ≥ 30% |

---

## 12. Conclusion

Le système de calcul du coût complet d'un recrutement et tableau de bord financier calcule le coût complet de chaque recrutement (coûts directs : frais de sourcing, cabinet, évaluation, administratif ; coûts indirects : temps DRH, manager, interviewers, non-production, surcharge équipe), compare avec le coût moyen pour le type de poste, et calcule le coût d'un mauvais recrutement (1 à 2 fois le salaire annuel brut) avec décomposition. Le système produit un tableau de bord financier RH (coût moyen par recrutement par type de poste, délai moyen time-to-hire par profil, taux de réussite à 12 mois, ROI global de la fonction recrutement) pour permettre au DRH de quantifier et justifier les coûts pour le Comité de Direction. Le système s'intègre avec les modules existants (MVP-004, MVP-017, MVP-021).

**Points clés :**
- 4 catégories de coûts directs (sourcing, cabinet, évaluation, administratif)
- 5 catégories de coûts indirects (temps DRH, manager, interviewers, non-production, surcharge)
- Coût d'un mauvais recrutement (1 à 2 fois le salaire annuel brut)
- 4 composants de décomposition du coût d'un mauvais recrutement
- 4 indicateurs du tableau de bord financier
- Comparaison avec le coût moyen par type de poste
- Calcul du ROI global de la fonction recrutement
- Intégration avec les modules existants
