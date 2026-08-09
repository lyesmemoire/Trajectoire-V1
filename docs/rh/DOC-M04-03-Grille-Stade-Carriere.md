# DOC-M04-03 : Grille du Stade de Carrière

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la grille du stade de carrière pour le MVP-META-04 Timing Intelligence Engine. Ce document structure la grille qui analyse si le poste arrive au bon moment dans la trajectoire de carrière du candidat.

---

## 2. Principe Fondateur

Le bon candidat au mauvais stade de carrière = échec. Le moteur analyse si le poste représente la prochaine marche logique dans la progression du candidat, ni trop tôt ni trop tard.

---

## 3. Les 3 Stades de Carrière

### 3.1 Stade 1 — Trop Tôt dans la Carrière

**Définition :**
Le candidat n'est pas encore prêt pour ce niveau de responsabilité. Le poste est au-dessus de son niveau actuel.

**Signaux :**
- Score de maturité < 3/5
- Expérience professionnelle insuffisante
- Poste = saut de niveau trop important

**Risques :**
- Échec dans le poste
- Départ rapide (burnout, perte de confiance)
- Impact négatif sur l'équipe

**Recommandation :**
- Ne pas recruter
- Proposer un poste de niveau inférieur si disponible
- Revoir le candidat dans 2-3 ans

**Format de sortie :**
```
Stade de carrière détecté : Trop tôt
Adéquation avec ce poste : Faible
Risque temporel : Élevé
Recommandation : Ne pas recruter
```

---

### 3.2 Stade 2 — Stade Optimal

**Définition :**
Le poste représente la prochaine marche logique dans la progression du candidat. Ni trop petit ni trop grand.

**Signaux :**
- Score de maturité 4-5/5
- Score de potentiel 3-4/5
- Poste = progression naturelle
- Expérience alignée avec les exigences

**Avantages :**
- Candidat motivé par la progression
- Risque de départ réduit
- Performance optimale

**Recommandation :**
- Recruter
- Offrir un parcours d'évolution clair
- Investir dans l'onboarding

**Format de sortie :**
```
Stade de carrière détecté : Optimal
Adéquation avec ce poste : Excellente
Risque temporel : Faible
Recommandation : Recruter
```

---

### 3.3 Stade 3 — Trop Tard dans la Carrière

**Définition :**
Le poste est en dessous du niveau atteint par le candidat. Le candidat est surqualifié.

**Signaux :**
- Poste = régression par rapport aux expériences passées
- Candidat a déjà occupé des postes de niveau supérieur
- Score de maturité 5/5 mais potentiel 0-2/5

**Risques :**
- Ennui rapide
- Départ rapide (pour un poste plus élevé)
- Surcoût salarial

**Recommandation :**
- Ne pas recruter
- Proposer un poste de niveau supérieur si disponible
- Reconsidérer le niveau du poste

**Format de sortie :**
```
Stade de carrière détecté : Trop tard
Adéquation avec ce poste : Faible
Risque temporel : Élevé
Recommandation : Ne pas recruter
```

---

## 4. Grille de Décision

### 4.1 Matrice Maturité / Potentiel

| Maturité | Potentiel | Stade | Recommandation |
|----------|-----------|-------|----------------|
| 0-2 | 0-2 | Trop tôt | Ne pas recruter |
| 0-2 | 3-5 | Trop tôt | Ne pas recruter |
| 3 | 0-2 | Trop tôt | Ne pas recruter |
| 3 | 3-5 | Transitionnel | Évaluer avec prudence |
| 4-5 | 0-2 | Trop tard | Ne pas recruter |
| 4-5 | 3-4 | Optimal | Recruter |
| 4-5 | 5 | Surqualifié | Évaluer le risque |

### 4.2 Indicateurs Complémentaires

**Indicateurs de progression logique :**
- Le candidat a occupé des postes de niveau progressivement croissant
- Chaque changement de poste a duré au moins 2 ans
- Les compétences acquises sont transférables au poste

**Indicateurs de régression :**
- Le candidat a occupé des postes de niveau supérieur
- Le salaire actuel est supérieur au salaire proposé
- Le candidat exprime des attentes de progression

**Indicateurs de saut de niveau :**
- Le candidat n'a jamais occupé de poste de responsabilité
- Le candidat n'a jamais géré d'équipe
- Le candidat n'a jamais géré de budget

---

## 5. Structure de Données (TypeScript)

```typescript
interface CareerStage {
  stage: 'tooEarly' | 'optimal' | 'tooLate' | 'transitional' | 'overqualified';
  
  maturityScore: number; // 0-5
  potentialScore: number; // 0-5
  
  careerTrajectory: {
    currentLevel: string;
    targetLevel: string;
    progressionLogical: boolean;
    regression: boolean;
    levelJump: boolean;
  };
  
  indicators: {
    progressionLogical: boolean;
    regression: boolean;
    levelJump: boolean;
    salaryRegression: boolean;
    experienceGap: boolean;
  };
  
  adequacy: 'excellent' | 'good' | 'acceptable' | 'poor';
  temporalRisk: 'low' | 'moderate' | 'high';
  
  recommendation: string;
  rationale: string;
}

interface CareerStageGrid {
  gridId: string;
  
  stages: {
    tooEarly: {
      description: string;
      signals: string[];
      risks: string[];
      recommendation: string;
    };
    optimal: {
      description: string;
      signals: string[];
      advantages: string[];
      recommendation: string;
    };
    tooLate: {
      description: string;
      signals: string[];
      risks: string[];
      recommendation: string;
    };
  };
  
  decisionMatrix: {
    byMaturityPotential: {
      maturity_0_2_potential_0_2: string;
      maturity_0_2_potential_3_5: string;
      maturity_3_potential_0_2: string;
      maturity_3_potential_3_5: string;
      maturity_4_5_potential_0_2: string;
      maturity_4_5_potential_3_4: string;
      maturity_4_5_potential_5: string;
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface CareerStageEvaluation {
  evaluationId: string;
  candidateId: string;
  recruitmentId: string;
  
  careerStage: CareerStage;
  
  careerHistory: {
    positions: {
      title: string;
      level: string;
      duration: number; // en mois
      progression: boolean;
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
CREATE TABLE career_stage_grid (
  id VARCHAR(36) PRIMARY KEY,
  
  stages JSON NOT NULL,
  decision_matrix JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE career_stage_evaluation (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  career_stage JSON NOT NULL,
  career_history JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_career_stage_evaluation_candidate ON career_stage_evaluation(candidate_id);
CREATE INDEX idx_career_stage_evaluation_recruitment ON career_stage_evaluation(recruitment_id);
```

---

## 7. API Endpoints

```typescript
// GET /api/career-stage-grid
async function getCareerStageGrid(): Promise<CareerStageGrid> {
  return await getCareerStageGrid();
}

// PUT /api/career-stage-grid
async function updateCareerStageGrid(grid: CareerStageGrid): Promise<CareerStageGrid> {
  return await updateCareerStageGrid(grid);
}

// POST /api/career-stage-evaluation/evaluate
async function evaluateCareerStage(candidateId: string, recruitmentId: string): Promise<CareerStageEvaluation> {
  return await evaluateCareerStage(candidateId, recruitmentId);
}

// GET /api/career-stage-evaluation/:candidateId/:recruitmentId
async function getCareerStageEvaluation(candidateId: string, recruitmentId: string): Promise<CareerStageEvaluation> {
  return await getCareerStageEvaluation(candidateId, recruitmentId);
}

// POST /api/career-stage-evaluation/recruitment/:recruitmentId
async function getCareerStageEvaluationsByRecruitment(recruitmentId: string): Promise<CareerStageEvaluation[]> {
  return await getCareerStageEvaluationsByRecruitment(recruitmentId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'évaluation | Évaluations effectuées / candidats évalués | 100% |
- Taux de stade optimal | Candidats au stade optimal / totaux | ≥ 50% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Évaluations consultées / effectuées | ≥ 80% |
- Taux d'impact sur décision | Décisions influencées par stade de carrière / décisions totales | ≥ 60% |

---

## 9. Conclusion

La grille du stade de carrière structure l'analyse de si le poste arrive au bon moment dans la trajectoire de carrière du candidat. 3 stades principaux : Trop tôt (candidat pas prêt, maturité < 3/5), Optimal (poste = prochaine marche logique, maturité 4-5/5 + potentiel 3-4/5), Trop tard (poste = régression, surqualifié). Matrice de décision maturité / potentiel. Indicateurs complémentaires (progression logique, régression, saut de niveau). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 3 stades de carrière
- Trop tôt dans la carrière
- Stade optimal
- Trop tard dans la carrière
- Matrice de décision maturité / potentiel
- Indicateurs complémentaires
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
