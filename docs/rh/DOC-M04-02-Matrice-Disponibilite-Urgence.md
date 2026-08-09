# DOC-M04-02 : Matrice Disponibilité / Urgence

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la matrice disponibilité / urgence pour le MVP-META-04 Timing Intelligence Engine. Ce document structure la matrice qui croise la disponibilité du candidat avec l'urgence opérationnelle du poste pour déterminer la compatibilité du timing.

---

## 2. Principe Fondateur

La disponibilité du candidat doit être croisée avec l'urgence du poste. Un candidat disponible dans 2 semaines est idéal pour une urgence, mais inacceptable pour un poste sans urgence si le candidat est disponible dans 6 mois.

---

## 3. Matrice Disponibilité / Urgence

### 3.1 Définition des Niveaux de Disponibilité

| Niveau | Délai | Description |
|--------|-------|-------------|
| Immédiat | 0-2 semaines | Candidat disponible immédiatement |
| Court | 2-4 semaines | Candidat disponible dans le mois |
| Moyen | 1-3 mois | Candidat disponible dans le trimestre |
| Long | 3-6 mois | Candidat disponible dans le semestre |
| Très long | > 6 mois | Candidat disponible dans l'année |

### 3.2 Définition des Niveaux d'Urgence

| Niveau | Délai | Description |
|--------|-------|-------------|
| Critique | < 2 semaines | Poste à pourvoir en urgence absolue |
| Élevée | 2-4 semaines | Poste à pourvoir rapidement |
| Modérée | 1-3 mois | Poste à pourvoir dans le trimestre |
| Faible | 3-6 mois | Poste à pourvoir dans le semestre |
| Nulle | > 6 mois | Poste à pourvoir dans l'année |

---

## 4. Matrice de Décision

### 4.1 Scénarios et Recommandations

**Scénario 1 : Candidat disponible dans 2 semaines + Urgence opérationnelle**
- **Timing :** Optimal
- **Recommandation :** Décider immédiatement
- **Risque de désistement :** Faible (< 10%)
- **Action :** Proposer l'offre dans les 48h

**Scénario 2 : Candidat disponible dans 6 mois + Urgence opérationnelle**
- **Timing :** Incompatible
- **Recommandation :** Chercher une solution alternative
- **Options :**
  1. Chercher une solution transitoire (intérim, consultant)
  2. Chercher un autre candidat
- **Risque :** Échec du recrutement si on attend

**Scénario 3 : Candidat disponible dans 6 mois + Pas d'urgence**
- **Timing :** Acceptable
- **Recommandation :** Décision possible mais risque à surveiller
- **Risque de désistement :** Modéré (20-30%)
- **Action :** Maintenir le contact, proposer une offre avec date de début différée

**Scénario 4 : Candidat disponible dans 2 semaines + Pas d'urgence**
- **Timing :** Optimal
- **Recommandation :** Décider maintenant
- **Risque de désistement :** Faible (< 10%)
- **Action :** Profiter de l'opportunité

**Scénario 5 : Candidat disponible dans 3 mois + Urgence modérée**
- **Timing :** Acceptable
- **Recommandation :** Décider avec délai
- **Risque de désistement :** Modéré (15-20%)
- **Action :** Proposer une offre avec date de début différée

**Scénario 6 : Candidat disponible dans 1 mois + Urgence critique**
- **Timing :** Tension
- **Recommandation :** Décider rapidement
- **Risque de désistement :** Faible (10-15%)
- **Action :** Accélérer le processus, proposer l'offre dans la semaine

---

## 5. Structure de Données (TypeScript)

```typescript
interface AvailabilityLevel {
  level: 'immediate' | 'short' | 'medium' | 'long' | 'veryLong';
  delayMin: number; // en jours
  delayMax: number; // en jours
  description: string;
}

interface UrgencyLevel {
  level: 'critical' | 'high' | 'moderate' | 'low' | 'none';
  delayMin: number; // en jours
  delayMax: number; // en jours
  description: string;
}

interface TimingScenario {
  scenarioId: string;
  availabilityLevel: AvailabilityLevel;
  urgencyLevel: UrgencyLevel;
  
  timing: 'optimal' | 'acceptable' | 'tension' | 'incompatible';
  recommendation: string;
  
  withdrawalRisk: number; // en pourcentage
  actions: string[];
  
  alternatives?: {
    option1: string;
    option2: string;
  };
}

interface AvailabilityUrgencyMatrix {
  matrixId: string;
  
  availabilityLevels: {
    immediate: AvailabilityLevel;
    short: AvailabilityLevel;
    medium: AvailabilityLevel;
    long: AvailabilityLevel;
    veryLong: AvailabilityLevel;
  };
  
  urgencyLevels: {
    critical: UrgencyLevel;
    high: UrgencyLevel;
    moderate: UrgencyLevel;
    low: UrgencyLevel;
    none: UrgencyLevel;
  };
  
  scenarios: TimingScenario[];
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface TimingEvaluation {
  evaluationId: string;
  candidateId: string;
  recruitmentId: string;
  
  availability: {
    level: AvailabilityLevel;
    delay: number; // en jours
    estimatedAvailabilityDate: Date;
  };
  
  urgency: {
    level: UrgencyLevel;
    requiredBy: Date;
  };
  
  scenario: TimingScenario;
  
  compatibility: {
    score: number; // 0-10
    rating: 'optimal' | 'acceptable' | 'tension' | 'incompatible';
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
CREATE TABLE availability_urgency_matrix (
  id VARCHAR(36) PRIMARY KEY,
  
  availability_levels JSON NOT NULL,
  urgency_levels JSON NOT NULL,
  scenarios JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE timing_evaluation (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  availability JSON NOT NULL,
  urgency JSON NOT NULL,
  scenario JSON NOT NULL,
  compatibility JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_timing_evaluation_candidate ON timing_evaluation(candidate_id);
CREATE INDEX idx_timing_evaluation_recruitment ON timing_evaluation(recruitment_id);
```

---

## 7. API Endpoints

```typescript
// GET /api/availability-urgency-matrix
async function getAvailabilityUrgencyMatrix(): Promise<AvailabilityUrgencyMatrix> {
  return await getAvailabilityUrgencyMatrix();
}

// PUT /api/availability-urgency-matrix
async function updateAvailabilityUrgencyMatrix(matrix: AvailabilityUrgencyMatrix): Promise<AvailabilityUrgencyMatrix> {
  return await updateAvailabilityUrgencyMatrix(matrix);
}

// POST /api/timing-evaluation/evaluate
async function evaluateTiming(candidateId: string, recruitmentId: string): Promise<TimingEvaluation> {
  return await evaluateTiming(candidateId, recruitmentId);
}

// GET /api/timing-evaluation/:candidateId/:recruitmentId
async function getTimingEvaluation(candidateId: string, recruitmentId: string): Promise<TimingEvaluation> {
  return await getTimingEvaluation(candidateId, recruitmentId);
}

// GET /api/timing-evaluation/scenario/:scenarioId
async function getTimingScenario(scenarioId: string): Promise<TimingScenario> {
  return await getTimingScenario(scenarioId);
}

// POST /api/timing-evaluation/recruitment/:recruitmentId
async function getTimingEvaluationsByRecruitment(recruitmentId: string): Promise<TimingEvaluation[]> {
  return await getTimingEvaluationsByRecruitment(recruitmentId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'évaluation | Évaluations effectuées / candidats évalués | 100% |
- Taux de compatibilité optimale | Scénarios optimaux / totaux | ≥ 60% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Évaluations consultées / effectuées | ≥ 80% |
- Taux d'impact sur décision | Décisions influencées par timing / décisions totales | ≥ 60% |

---

## 9. Conclusion

La matrice disponibilité / urgence structure la matrice qui croise la disponibilité du candidat avec l'urgence opérationnelle du poste. 5 niveaux de disponibilité (Immédiat, Court, Moyen, Long, Très long). 5 niveaux d'urgence (Critique, Élevée, Modérée, Faible, Nulle). 6 scénarios principaux avec recommandations spécifiques. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Matrice disponibilité / urgence
- 5 niveaux de disponibilité
- 5 niveaux d'urgence
- 6 scénarios principaux
- Recommandations par scénario
- Évaluation du risque de désistement
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
