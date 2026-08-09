# DOC-013-05 : Grille Cotation Personnalisée

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la Grille de Cotation Personnalisée pour MVP-013 Interview Intelligence. Cette grille génère automatiquement des critères de cotation pondérés pour chaque poste, avec des échelles de cotation expliquées et des seuils de décision définis.

---

## 2. Principe Fondateur

La Grille de Cotation Personnalisée n'est pas une grille générique. Elle est générée spécifiquement pour chaque poste, avec des critères pondérés en fonction des priorités du poste, des échelles de cotation expliquées, et des seuils de décision clairs.

---

## 3. Structure de la Grille

### 3.1 Template de Grille

```
┌─────────────────────────────────────────┐
│ GRILLE DE COTATION PERSONNALISÉE       │
├─────────────────────────────────────────┤
│                                         │
| Poste : [Titre]                        │
| Département : [____]                    │
| Niveau : [____]                        │
| Date de création : [DD/MM/YYYY]        │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CRITÈRES DE COTATION                   │
├─────────────────────────────────────────┤
│                                         │
| Critère 1 : [____]                     │
│ • Pondération : [XX%]                  │
│ • Échelle de cotation :                 │
│   1 : [Description]                     │
│   2 : [Description]                     │
│   3 : [Description]                     │
│   4 : [Description]                     │
│   5 : [Description]                     │
│ • Seuil de décision : [X/5]            │
│ • Justification de la pondération :     │
│   [____]                               │
│                                         │
| Critère 2 : [____]                     │
│ • Pondération : [XX%]                  │
│ • Échelle de cotation :                 │
│   1 : [Description]                     │
│   2 : [Description]                     │
│   3 : [Description]                     │
│   4 : [Description]                     │
│   5 : [Description]                     │
│ • Seuil de décision : [X/5]            │
│ • Justification de la pondération :     │
│   [____]                               │
│                                         │
| Critère 3 : [____]                     │
│ • Pondération : [XX%]                  │
│ • Échelle de cotation :                 │
│   1 : [Description]                     │
│   2 : [Description]                     │
│   3 : [Description]                     │
│   4 : [Description]                     │
│   5 : [Description]                     │
│ • Seuil de décision : [X/5]            │
│ • Justification de la pondération :     │
│   [____]                               │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SCORE GLOBAL                           │
├─────────────────────────────────────────┤
│                                         │
| Formule :                              │
| [Formule de calcul]                    │
│                                         │
| Exemple :                              │
| Score = (Critère 1 × [XX%]) +          │
|          (Critère 2 × [XX%]) +          │
|          (Critère 3 × [XX%])            │
│                                         │
| Seuil de décision : [X/5]              │
│                                         │
| Interprétation :                       │
| • Score ≥ [X] : Recommandation forte    │
| • Score ≥ [X] : Recommandation modérée │
| • Score < [X] : Non recommandé          │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
| GUIDE DE COTATION                      │
├─────────────────────────────────────────┤
│                                         │
| Comment coter chaque critère :          │
│                                         │
| 1. Analyser les réponses du candidat   │
|    sur ce critère                      │
│ 2. Comparer avec les descriptions      │
|    de l'échelle                        │
| 3. Attribuer une note de 1 à 5        │
| 4. Justifier la note si nécessaire     │
│                                         │
| Principes de cotation :                │
| • Basé sur des preuves concrètes       │
| • Consistant avec les autres candidats  │
| • Justifié par des exemples            │
| • Réévalué si de nouvelles informations│
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface ScoringGrid {
  gridId: string;
  jobId: string;
  createdAt: Date;
  createdBy: string;
  
  criteria: {
    id: string;
    name: string;
    weight: number;
    scale: {
      level: number;
      description: string;
      indicators: string[];
    }[];
    decisionThreshold: number;
    weightJustification: string;
    critical: boolean;
  }[];
  
  globalScore: {
    formula: string;
    decisionThreshold: number;
    interpretation: {
      minScore: number;
      recommendation: string;
    }[];
  };
  
  scoringGuide: {
    howToScore: string[];
    principles: string[];
  };
}
```

---

## 5. Critères de Cotation Standards

### 5.1 Critères Techniques

| Critère | Description | Échelle |
|---------|-------------|---------|
| Compétences techniques | Niveau de maîtrise des compétences techniques requises | 1-5 |
| Expérience technique | Pertinence et profondeur de l'expérience technique | 1-5 |
| Capacité d'apprentissage | Vitesse et qualité d'apprentissage de nouvelles compétences | 1-5 |

### 5.2 Critères Comportementaux

| Critère | Description | Échelle |
|---------|-------------|---------|
| Communication | Qualité de la communication orale et écrite | 1-5 |
| Collaboration | Capacité à travailler en équipe | 1-5 |
| Résolution de problèmes | Capacité à analyser et résoudre des problèmes complexes | 1-5 |

### 5.3 Critères de Leadership

| Critère | Description | Échelle |
|---------|-------------|---------|
| Leadership | Capacité à diriger et inspirer une équipe | 1-5 |
| Prise de décision | Qualité et rapidité des décisions | 1-5 |
| Gestion de conflits | Capacité à gérer les conflits de manière constructive | 1-5 |

### 5.4 Critères Culturels

| Critère | Description | Échelle |
|---------|-------------|---------|
| Culture fit | Adéquation avec la culture de l'entreprise | 1-5 |
| Valeurs | Alignement des valeurs avec l'entreprise | 1-5 |
| Motivation | Niveau de motivation pour le poste et l'entreprise | 1-5 |

---

## 6. Génération Automatique de la Grille

### 6.1 Processus de Génération

```typescript
async function generateScoringGrid(jobId: string, createdBy: string): Promise<ScoringGrid> {
  // Étape 1 : Analyse du poste
  const jobAnalysis = await analyzeJob(jobId);
  
  // Étape 2 : Sélection des critères pertinents
  const criteria = await selectCriteria(jobAnalysis);
  
  // Étape 3 : Définition des pondérations
  const weightedCriteria = await defineWeights(criteria, jobAnalysis);
  
  // Étape 4 : Définition des échelles de cotation
  const scaledCriteria = await defineScales(weightedCriteria);
  
  // Étape 5 : Définition des seuils de décision
  const thresholdedCriteria = await defineThresholds(scaledCriteria);
  
  // Étape 6 : Définition du score global
  const globalScore = await defineGlobalScore(thresholdedCriteria);
  
  // Étape 7 : Définition du guide de cotation
  const scoringGuide = await defineScoringGuide();
  
  // Construction de la grille
  const grid: ScoringGrid = {
    gridId: generateGridId(),
    jobId,
    createdAt: new Date(),
    createdBy,
    
    criteria: thresholdedCriteria,
    globalScore,
    scoringGuide
  };
  
  // Sauvegarde de la grille
  await saveGrid(grid);
  
  return grid;
}
```

### 6.2 Sélection des Critères

```typescript
async function selectCriteria(jobAnalysis: JobAnalysis): Promise<ScoringGrid['criteria']> {
  const criteria: ScoringGrid['criteria'] = [];
  
  // Critères techniques
  if (jobAnalysis.requiresTechnicalSkills) {
    criteria.push({
      id: generateCriterionId('technical'),
      name: 'Compétences techniques',
      weight: 0,
      scale: [],
      decisionThreshold: 0,
      weightJustification: '',
      critical: jobAnalysis.technicalSkillsCritical
    });
  }
  
  // Critères comportementaux
  if (jobAnalysis.requiresTeamwork) {
    criteria.push({
      id: generateCriterionId('collaboration'),
      name: 'Collaboration',
      weight: 0,
      scale: [],
      decisionThreshold: 0,
      weightJustification: '',
      critical: jobAnalysis.teamworkCritical
    });
  }
  
  // Critères de leadership
  if (jobAnalysis.requiresLeadership) {
    criteria.push({
      id: generateCriterionId('leadership'),
      name: 'Leadership',
      weight: 0,
      scale: [],
      decisionThreshold: 0,
      weightJustification: '',
      critical: jobAnalysis.leadershipCritical
    });
  }
  
  // Critères culturels
  criteria.push({
    id: generateCriterionId('culture_fit'),
    name: 'Culture fit',
    weight: 0,
    scale: [],
    decisionThreshold: 0,
    weightJustification: '',
    critical: jobAnalysis.cultureFitCritical
  });
  
  return criteria;
}
```

### 6.3 Définition des Pondérations

```typescript
async function defineWeights(criteria: ScoringGrid['criteria'], jobAnalysis: JobAnalysis): Promise<ScoringGrid['criteria']> {
  // Calcul des pondérations basées sur l'analyse du poste
  const totalWeight = 1.0;
  
  // Répartition des pondérations
  let remainingWeight = totalWeight;
  
  for (const criterion of criteria) {
    if (criterion.critical) {
      criterion.weight = 0.3;
      criterion.weightJustification = 'Critère critique pour le poste';
      remainingWeight -= 0.3;
    }
  }
  
  // Répartition du poids restant
  const nonCriticalCriteria = criteria.filter(c => !c.critical);
  const weightPerCriterion = remainingWeight / nonCriticalCriteria.length;
  
  for (const criterion of nonCriticalCriteria) {
    criterion.weight = weightPerCriterion;
    criterion.weightJustification = 'Critère important mais non critique';
  }
  
  return criteria;
}
```

### 6.4 Définition des Échelles de Cotation

```typescript
async function defineScales(criteria: ScoringGrid['criteria']): Promise<ScoringGrid['criteria']> {
  for (const criterion of criteria) {
    criterion.scale = await generateScaleForCriterion(criterion.name);
    criterion.decisionThreshold = 3; // Seuil par défaut
  }
  
  return criteria;
}

async function generateScaleForCriterion(criterionName: string): Promise<ScoringGrid['criteria'][0]['scale']> {
  const scales: Record<string, ScoringGrid['criteria'][0]['scale']> = {
    'Compétences techniques': [
      {
        level: 1,
        description: 'Compétences insuffisantes pour le poste',
        indicators: ['Manque de compétences de base', 'Incapacité à effectuer les tâches requises']
      },
      {
        level: 2,
        description: 'Compétences partielles, nécessite formation',
        indicators: ['Compétences de base acquises', 'Besoin de supervision pour les tâches complexes']
      },
      {
        level: 3,
        description: 'Compétences adéquates pour le poste',
        indicators: ['Compétences requises maîtrisées', 'Autonomie sur les tâches standard']
      },
      {
        level: 4,
        description: 'Compétences solides, au-delà des attentes',
        indicators: ['Compétences avancées', 'Capacité à gérer des situations complexes']
      },
      {
        level: 5,
        description: 'Expertise exceptionnelle',
        indicators: ['Expertise reconnue', 'Capacité à innover et former']
      }
    ],
    'Collaboration': [
      {
        level: 1,
        description: 'Difficulté à travailler en équipe',
        indicators: ['Préfère travailler seul', 'Conflits fréquents']
      },
      {
        level: 2,
        description: 'Collaboration limitée',
        indicators: ['Travaille en équipe sous contrainte', 'Communication limitée']
      },
      {
        level: 3,
        description: 'Bonne collaboration',
        indicators: ['Travaille bien en équipe', 'Communication claire']
      },
      {
        level: 4,
        description: 'Collaboration excellente',
        indicators: ['Facilitateur naturel', 'Capacité à résoudre les conflits']
      },
      {
        level: 5,
        description: 'Leader de collaboration',
        indicators: ['Inspirant pour l\'équipe', 'Crée un environnement collaboratif']
      }
    ],
    'Leadership': [
      {
        level: 1,
        description: 'Pas de leadership démontré',
        indicators: ['Évite les responsabilités', 'Pas d\'expérience de management']
      },
      {
        level: 2,
        description: 'Leadership émergent',
        indicators: ['Prend des responsabilités ponctuelles', 'Potentiel de leadership']
      },
      {
        level: 3,
        description: 'Leadership solide',
        indicators: ['Expérience de management', 'Capacité à diriger une équipe']
      },
      {
        level: 4,
        description: 'Leadership excellent',
        indicators: ['Leadership éprouvé', 'Capacité à inspirer et motiver']
      },
      {
        level: 5,
        description: 'Leadership exceptionnel',
        indicators: ['Vision stratégique', 'Capacité à transformer une organisation']
      }
    ],
    'Culture fit': [
      {
        level: 1,
        description: 'Inadéquation culturelle majeure',
        indicators: ['Valeurs incompatibles', 'Style de travail incompatible']
      },
      {
        level: 2,
        description: 'Inadéquation culturelle partielle',
        indicators: ['Certaines valeurs incompatibles', 'Style de travail partiellement incompatible']
      },
      {
        level: 3,
        description: 'Adéquation culturelle adéquate',
        indicators: ['Valeurs alignées', 'Style de travail compatible']
      },
      {
        level: 4,
        description: 'Adéquation culturelle forte',
        indicators: ['Valeurs parfaitement alignées', 'Style de travail idéal']
      },
      {
        level: 5,
        description = 'Ambassadeur culturel',
        indicators: ['Incarnateur des valeurs', 'Promoteur de la culture']
      }
    ]
  };
  
  return scales[criterionName] || generateGenericScale();
}

function generateGenericScale(): ScoringGrid['criteria'][0]['scale'] {
  return [
    {
      level: 1,
      description: 'Insuffisant',
      indicators: ['Ne répond pas aux attentes minimales']
    },
    {
      level: 2,
      description: 'Partiel',
      indicators: ['Répond partiellement aux attentes']
    },
    {
      level: 3,
      description: 'Adéquat',
      indicators: ['Répond aux attentes']
    },
    {
      level: 4,
      description: 'Solide',
      indicators: ['Dépasse les attentes']
    },
    {
      level: 5,
      description: 'Exceptionnel',
      indicators: ['Dépasse largement les attentes']
    }
  ];
}
```

### 6.5 Définition du Score Global

```typescript
async function defineGlobalScore(criteria: ScoringGrid['criteria']): Promise<ScoringGrid['globalScore']> {
  // Formule de calcul
  const formula = criteria.map(c => `${c.name} × ${Math.round(c.weight * 100)}%`).join(' + ');
  
  // Seuil de décision
  const decisionThreshold = 3.5;
  
  // Interprétation
  const interpretation = [
    {
      minScore: 4.0,
      recommendation: 'Recommandation forte'
    },
    {
      minScore: 3.5,
      recommendation: 'Recommandation modérée'
    },
    {
      minScore: 0,
      recommendation: 'Non recommandé'
    }
  ];
  
  return {
    formula,
    decisionThreshold,
    interpretation
  };
}
```

---

## 7. Cotation en Temps Réel

### 7.1 Processus de Cotation

```typescript
async function rateCriterion(interviewId: string, criterionId: string, rating: number, justification?: string): Promise<void> {
  // Validation de la note
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  // Enregistrement de la cotation
  await saveRating({
    interviewId,
    criterionId,
    rating,
    justification,
    ratedAt: new Date()
  });
  
  // Recalcul du score global
  const grid = await getScoringGrid(interviewId);
  const ratings = await getRatings(interviewId);
  const globalScore = await calculateGlobalScore(grid, ratings);
  
  // Notification au recruteur
  await notifyRecruiter(interviewId, {
    type: 'rating_update',
    criterionId,
    rating,
    globalScore
  });
  
  // Alertes si seuil critique non atteint
  for (const criterion of grid.criteria) {
    const rating = ratings.find(r => r.criterionId === criterion.id);
    if (rating && rating.rating < criterion.decisionThreshold && criterion.critical) {
      await sendAlert(interviewId, {
        type: 'critical_threshold_not_met',
        criterion: criterion.name,
        rating: rating.rating,
        threshold: criterion.decisionThreshold
      });
    }
  }
}
```

### 7.2 Calcul du Score Global

```typescript
async function calculateGlobalScore(grid: ScoringGrid, ratings: Rating[]): Promise<number> {
  let totalScore = 0;
  
  for (const criterion of grid.criteria) {
    const rating = ratings.find(r => r.criterionId === criterion.id);
    if (rating) {
      totalScore += rating.rating * criterion.weight;
    }
  }
  
  return totalScore;
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE scoring_grid (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  
  criteria JSON NOT NULL,
  global_score JSON NOT NULL,
  scoring_guide JSON NOT NULL,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE rating (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  criterion_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL,
  justification TEXT,
  rated_at TIMESTAMP NOT NULL,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (criterion_id) REFERENCES scoring_criteria(id)
);

CREATE INDEX idx_grid_job ON scoring_grid(job_id);
CREATE INDEX idx_rating_interview ON rating(interview_id);
CREATE INDEX idx_rating_criterion ON rating(criterion_id);
```

---

## 9. API Endpoints

```typescript
// POST /api/scoring-grid
async function createScoringGrid(jobId: string, createdBy: string): Promise<ScoringGrid> {
  return await generateScoringGrid(jobId, createdBy);
}

// GET /api/scoring-grid/:id
async function getScoringGrid(id: string): Promise<ScoringGrid> {
  return await getGridById(id);
}

// GET /api/scoring-grid/job/:jobId
async function getScoringGridByJob(jobId: string): Promise<ScoringGrid> {
  return await getGridByJob(jobId);
}

// PUT /api/scoring-grid/:id
async function updateScoringGrid(id: string, grid: Partial<ScoringGrid>): Promise<ScoringGrid> {
  return await modifyGrid(id, grid);
}

// POST /api/scoring-grid/:gridId/rating
async function rateCriterion(gridId: string, criterionId: string, rating: number, justification?: string): Promise<void> {
  return await saveRating(gridId, criterionId, rating, justification);
}

// GET /api/scoring-grid/:gridId/ratings
async function getRatings(gridId: string): Promise<Rating[]> {
  return await getGridRatings(gridId);
}

// GET /api/scoring-grid/:gridId/global-score
async function getGlobalScore(gridId: string): Promise<number> {
  const grid = await getScoringGrid(gridId);
  const ratings = await getRatings(gridId);
  return await calculateGlobalScore(grid, ratings);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Critères cotés / total | 100% |
| Consistance des cotations | Variance des cotations pour même profil | ≤ 0.5 |
| Taux de justification | Cotations justifiées / total | ≥ 80% |
| Précision des décisions | Décisions correctes / total | ≥ 85% |

### 10.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Grilles utilisées / créées | ≥ 90% |
| Temps de cotation | Temps moyen de cotation par entretien | < 5 minutes |
| Satisfaction recruteur | Satisfaction avec la grille | ≥ 4/5 |

---

## 11. Conclusion

La Grille de Cotation Personnalisée génère automatiquement des critères de cotation pondérés pour chaque poste, avec des échelles de cotation expliquées et des seuils de décision définis. Elle n'est pas une grille générique mais est spécifique à chaque poste.

**Points clés :**
- Critères techniques (compétences, expérience, apprentissage)
- Critères comportementaux (communication, collaboration, résolution de problèmes)
- Critères de leadership (leadership, prise de décision, gestion de conflits)
- Critères culturels (culture fit, valeurs, motivation)
- Pondérations automatiques basées sur l'analyse du poste
- Échelles de cotation détaillées (1-5 avec descriptions et indicateurs)
- Seuils de décision par critère
- Score global avec formule et interprétation
- Guide de cotation pour les recruteurs
- Cotation en temps réel avec recalcul automatique
- Alertes si seuils critiques non atteints
