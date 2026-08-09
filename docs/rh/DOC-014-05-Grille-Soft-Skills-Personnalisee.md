# DOC-014-05 : Grille Soft Skills Personnalisée

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la Grille Soft Skills Personnalisée pour MVP-014 Soft Skills Intelligence. Cette grille génère automatiquement une configuration de soft skills pondérée pour chaque poste, avec des seuils de décision définis.

---

## 2. Principe Fondateur

La Grille Soft Skills Personnalisée n'est pas une grille générique. Elle est générée spécifiquement pour chaque poste, avec des soft skills pondérés en fonction des priorités du poste, des seuils de décision clairs, et des recommandations basées sur les scores.

---

## 3. Structure de la Grille

### 3.1 Template de Grille

```
┌─────────────────────────────────────────┐
│ GRILLE SOFT SKILLS PERSONNALISÉE       │
├─────────────────────────────────────────┤
│                                         │
| Poste : [Titre]                        │
| Département : [____]                    │
| Niveau : [____]                        │
| Date de création : [DD/MM/YYYY]        │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SOFT SKILLS ÉVALUÉS                    │
├─────────────────────────────────────────┤
│                                         │
| Soft Skill 1 : [____]                   │
| • Pondération : [XX%]                  │
| • Seuil de décision : [X/5]            │
| • Importance : [Critical/High/Medium/Low]│
| • Justification de la pondération :     │
│   [____]                               │
│                                         │
| Soft Skill 2 : [____]                   │
| • Pondération : [XX%]                  │
| • Seuil de décision : [X/5]            │
| • Importance : [Critical/High/Medium/Low]│
| • Justification de la pondération :     │
│   [____]                               │
│                                         │
| Soft Skill 3 : [____]                   │
| • Pondération : [XX%]                  │
| • Seuil de décision : [X/5]            │
| • Importance : [Critical/High/Medium/Low]│
| • Justification de la pondération :     │
│   [____]                               │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SCORE GLOBAL SOFT SKILLS               │
├─────────────────────────────────────────┤
│                                         │
| Formule :                              │
| [Formule de calcul]                    │
│                                         │
| Exemple :                              │
| Score = (Soft Skill 1 × [XX%]) +        │
|          (Soft Skill 2 × [XX%]) +        │
|          (Soft Skill 3 × [XX%])          │
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
| RECOMMANDATIONS PAR SCORE              │
├─────────────────────────────────────────┤
│                                         │
| Score 1 (Absent/Négatif) :              │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
│                                         │
| Score 2 (Faible) :                      │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
│                                         │
| Score 3 (Standard) :                    │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
│                                         │
| Score 4 (Fort) :                        │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
│                                         │
| Score 5 (Exceptionnel) :                │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface SoftSkillsGrid {
  gridId: string;
  jobId: string;
  createdAt: Date;
  createdBy: string;
  
  skills: {
    skillId: string;
    skillName: string;
    weight: number;
    decisionThreshold: number;
    importance: 'critical' | 'high' | 'medium' | 'low';
    weightJustification: string;
  }[];
  
  globalScore: {
    formula: string;
    decisionThreshold: number;
    interpretation: {
      minScore: number;
      recommendation: string;
    }[];
  };
  
  scoreRecommendations: {
    score: number;
    recommendations: string[];
  }[];
}
```

---

## 5. Génération Automatique de la Grille

### 5.1 Processus de Génération

```typescript
async function generateSoftSkillsGrid(jobId: string, createdBy: string): Promise<SoftSkillsGrid> {
  // Étape 1 : Analyse du poste
  const jobAnalysis = await analyzeJob(jobId);
  
  // Étape 2 : Sélection des soft skills pertinents
  const skills = await selectSoftSkills(jobAnalysis);
  
  // Étape 3 : Définition des pondérations
  const weightedSkills = await defineWeights(skills, jobAnalysis);
  
  // Étape 4 : Définition des seuils de décision
  const thresholdedSkills = await defineThresholds(weightedSkills);
  
  // Étape 5 : Définition du score global
  const globalScore = await defineGlobalScore(thresholdedSkills);
  
  // Étape 6 : Définition des recommandations par score
  const scoreRecommendations = await defineScoreRecommendations();
  
  // Construction de la grille
  const grid: SoftSkillsGrid = {
    gridId: generateGridId(),
    jobId,
    createdAt: new Date(),
    createdBy,
    
    skills: thresholdedSkills,
    globalScore,
    scoreRecommendations
  };
  
  // Sauvegarde de la grille
  await saveGrid(grid);
  
  return grid;
}
```

### 5.2 Sélection des Soft Skills

```typescript
async function selectSoftSkills(jobAnalysis: JobAnalysis): Promise<SoftSkillsGrid['skills']> {
  const skills: SoftSkillsGrid['skills'] = [];
  
  // Sélection basée sur le rôle
  const roleSkills = getSkillsByRole(jobAnalysis.role);
  
  for (const skill of roleSkills) {
    skills.push({
      skillId: skill.id,
      skillName: skill.name,
      weight: 0,
      decisionThreshold: 0,
      importance: skill.importance,
      weightJustification: ''
    });
  }
  
  return skills;
}

function getSkillsByRole(role: string): Array<{ id: string; name: string; importance: 'critical' | 'high' | 'medium' | 'low' }> {
  const roleSkillsMap: Record<string, Array<{ id: string; name: string; importance: 'critical' | 'high' | 'medium' | 'low' }>> = {
    junior: [
      { id: 'SS-003', name: 'Adaptabilité & Résilience', importance: 'critical' },
      { id: 'SS-004', name: 'Pensée Critique', importance: 'high' },
      { id: 'SS-005', name: 'Communication & Impact', importance: 'high' },
      { id: 'SS-006', name: 'Orientation Résultats', importance: 'medium' },
      { id: 'SS-007', name: 'Travail en Équipe', importance: 'high' },
      { id: 'SS-008', name: 'Apprentissage Continu', importance: 'critical' },
      { id: 'SS-009', name: 'Intégrité & Éthique', importance: 'high' },
      { id: 'SS-012', name: 'Culture Fit', importance: 'high' }
    ],
    intermediate: [
      { id: 'SS-001', name: 'Leadership & Influence', importance: 'medium' },
      { id: 'SS-002', name: 'Intelligence Émotionnelle', importance: 'high' },
      { id: 'SS-003', name: 'Adaptabilité & Résilience', importance: 'high' },
      { id: 'SS-004', name: 'Pensée Critique', importance: 'high' },
      { id: 'SS-005', name: 'Communication & Impact', importance: 'high' },
      { id: 'SS-006', name: 'Orientation Résultats', importance: 'high' },
      { id: 'SS-007', name: 'Travail en Équipe', importance: 'high' },
      { id: 'SS-008', name: 'Apprentissage Continu', importance: 'high' },
      { id: 'SS-009', name: 'Intégrité & Éthique', importance: 'high' },
      { id: 'SS-010', name: 'Gestion du Stress', importance: 'medium' },
      { id: 'SS-011', name: 'Vision Stratégique', importance: 'low' },
      { id: 'SS-012', name: 'Culture Fit', importance: 'high' }
    ],
    senior: [
      { id: 'SS-001', name: 'Leadership & Influence', importance: 'high' },
      { id: 'SS-002', name: 'Intelligence Émotionnelle', importance: 'high' },
      { id: 'SS-003', name: 'Adaptabilité & Résilience', importance: 'high' },
      { id: 'SS-004', name: 'Pensée Critique', importance: 'high' },
      { id: 'SS-005', name: 'Communication & Impact', importance: 'high' },
      { id: 'SS-006', name: 'Orientation Résultats', importance: 'high' },
      { id: 'SS-007', name: 'Travail en Équipe', importance: 'high' },
      { id: 'SS-008', name: 'Apprentissage Continu', importance: 'high' },
      { id: 'SS-009', name: 'Intégrité & Éthique', importance: 'high' },
      { id: 'SS-010', name: 'Gestion du Stress', importance: 'high' },
      { id: 'SS-011', name: 'Vision Stratégique', importance: 'high' },
      { id: 'SS-012', name: 'Culture Fit', importance: 'high' }
    ],
    manager: [
      { id: 'SS-001', name: 'Leadership & Influence', importance: 'critical' },
      { id: 'SS-002', name: 'Intelligence Émotionnelle', importance: 'critical' },
      { id: 'SS-003', name: 'Adaptabilité & Résilience', importance: 'high' },
      { id: 'SS-004', name: 'Pensée Critique', importance: 'high' },
      { id: 'SS-005', name: 'Communication & Impact', importance: 'critical' },
      { id: 'SS-006', name: 'Orientation Résultats', importance: 'high' },
      { id: 'SS-007', name: 'Travail en Équipe', importance: 'critical' },
      { id: 'SS-008', name: 'Apprentissage Continu', importance: 'high' },
      { id: 'SS-009', name: 'Intégrité & Éthique', importance: 'critical' },
      { id: 'SS-010', name: 'Gestion du Stress', importance: 'critical' },
      { id: 'SS-011', name: 'Vision Stratégique', importance: 'critical' },
      { id: 'SS-012', name: 'Culture Fit', importance: 'high' }
    ],
    expert: [
      { id: 'SS-001', name: 'Leadership & Influence', importance: 'high' },
      { id: 'SS-002', name: 'Intelligence Émotionnelle', importance: 'high' },
      { id: 'SS-003', name: 'Adaptabilité & Résilience', importance: 'high' },
      { id: 'SS-004', name: 'Pensée Critique', importance: 'critical' },
      { id: 'SS-005', name: 'Communication & Impact', importance: 'high' },
      { id: 'SS-006', name: 'Orientation Résultats', importance: 'high' },
      { id: 'SS-007', name: 'Travail en Équipe', importance: 'medium' },
      { id: 'SS-008', name: 'Apprentissage Continu', importance: 'high' },
      { id: 'SS-009', name: 'Intégrité & Éthique', importance: 'high' },
      { id: 'SS-010', name: 'Gestion du Stress', importance: 'high' },
      { id: 'SS-011', name: 'Vision Stratégique', importance: 'critical' },
      { id: 'SS-012', name: 'Culture Fit', importance: 'high' }
    ]
  };
  
  return roleSkillsMap[role] || roleSkillsMap['intermediate'];
}
```

### 5.3 Définition des Pondérations

```typescript
async function defineWeights(skills: SoftSkillsGrid['skills'], jobAnalysis: JobAnalysis): Promise<SoftSkillsGrid['skills']> {
  // Calcul des pondérations basées sur l'importance
  const totalWeight = 1.0;
  
  // Attribution des pondérations de base
  for (const skill of skills) {
    if (skill.importance === 'critical') {
      skill.weight = 0.15;
      skill.weightJustification = 'Soft skill critique pour le poste';
    } else if (skill.importance === 'high') {
      skill.weight = 0.10;
      skill.weightJustification = 'Soft skill important pour le poste';
    } else if (skill.importance === 'medium') {
      skill.weight = 0.05;
      skill.weightJustification = 'Soft skill modérément important pour le poste';
    } else {
      skill.weight = 0.02;
      skill.weightJustification = 'Soft skill secondaire pour le poste';
    }
  }
  
  // Normalisation pour atteindre 100%
  const currentTotal = skills.reduce((sum, skill) => sum + skill.weight, 0);
  const normalizationFactor = totalWeight / currentTotal;
  
  for (const skill of skills) {
    skill.weight = skill.weight * normalizationFactor;
  }
  
  return skills;
}
```

### 5.4 Définition des Seuils de Décision

```typescript
async function defineThresholds(skills: SoftSkillsGrid['skills']): Promise<SoftSkillsGrid['skills']> {
  for (const skill of skills) {
    if (skill.importance === 'critical') {
      skill.decisionThreshold = 4;
    } else if (skill.importance === 'high') {
      skill.decisionThreshold = 3;
    } else {
      skill.decisionThreshold = 2;
    }
  }
  
  return skills;
}
```

### 5.5 Définition du Score Global

```typescript
async function defineGlobalScore(skills: SoftSkillsGrid['skills']): Promise<SoftSkillsGrid['globalScore']> {
  // Formule de calcul
  const formula = skills.map(s => `${s.skillName} × ${Math.round(s.weight * 100)}%`).join(' + ');
  
  // Seuil de décision
  const decisionThreshold = 3.5;
  
  // Interprétation
  const interpretation = [
    {
      minScore: 4.0,
      recommendation: 'Recommandation forte : Profil soft skills exceptionnel'
    },
    {
      minScore: 3.5,
      recommendation: 'Recommandation modérée : Profil soft skills solide'
    },
    {
      minScore: 0,
      recommendation: 'Non recommandé : Profil soft skills insuffisant'
    }
  ];
  
  return {
    formula,
    decisionThreshold,
    interpretation
  };
}
```

### 5.6 Définition des Recommandations par Score

```typescript
async function defineScoreRecommendations(): Promise<SoftSkillsGrid['scoreRecommendations']> {
  return [
    {
      score: 1,
      recommendations: [
        'Ce soft skill est absent ou négatif. Il est recommandé de ne pas poursuivre le candidat pour ce poste.',
        'Si ce soft skill est critique, le candidat n\'est pas adapté au poste.',
        'Envisager un développement ciblé si le candidat présente d\'autres soft skills exceptionnels.'
      ]
    },
    {
      score: 2,
      recommendations: [
        'Ce soft skill est faible. Des preuves partielles ou floues ont été détectées.',
        'Si ce soft skill est critique, le candidat nécessite un accompagnement important.',
        'Envisager un plan de développement si d\'autres soft skills sont forts.'
      ]
    },
    {
      score: 3,
      recommendations: [
        'Ce soft skill est au niveau standard attendu pour le poste.',
        'Le candidat répond aux attentes sans excéder.',
        'Ce niveau est acceptable pour un recrutement standard.'
      ]
    },
    {
      score: 4,
      recommendations: [
        'Ce soft skill est fort. Le candidat dépasse les attentes.',
        'Preuves solides avec exemples précis et chiffrés.',
        'Ce candidat peut être un atout pour l\'équipe sur ce soft skill.'
      ]
    },
    {
      score: 5,
      recommendations: [
        'Ce soft skill est exceptionnel. Le candidat présente un marqueur de potentiel élevé.',
        'Preuves remarquables avec pattern récurrent.',
        'Ce candidat peut être un leader ou expert sur ce soft skill.'
      ]
    }
  ];
}
```

---

## 6. Cotation en Temps Réel

### 6.1 Processus de Cotation

```typescript
async function rateSoftSkill(interviewId: string, skillId: string, rating: number, evidence: SoftSkillRating['evidence']): Promise<void> {
  // Validation de la note
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  // Validation de la preuve
  if (rating > 1 && evidence.length === 0) {
    throw new Error('Rating > 1 requires at least one evidence');
  }
  
  // Enregistrement de la cotation
  await saveSoftSkillRating({
    interviewId,
    skillId,
    rating,
    evidence,
    ratedAt: new Date()
  });
  
  // Recalcul du score global
  const grid = await getSoftSkillsGrid(interviewId);
  const ratings = await getSoftSkillRatings(interviewId);
  const globalScore = await calculateGlobalSoftSkillsScore(ratings, grid.skills);
  
  // Notification au recruteur
  await notifyRecruiter(interviewId, {
    type: 'soft_skill_rating_update',
    skillId,
    rating,
    globalScore
  });
  
  // Alertes si seuil critique non atteint
  for (const skill of grid.skills) {
    const rating = ratings.find(r => r.skillId === skill.skillId);
    if (rating && rating.rating < skill.decisionThreshold && skill.importance === 'critical') {
      await sendAlert(interviewId, {
        type: 'critical_soft_skill_threshold_not_met',
        skill: skill.skillName,
        rating: rating.rating,
        threshold: skill.decisionThreshold
      });
    }
  }
}
```

### 6.2 Calcul du Score Global

```typescript
async function calculateGlobalSoftSkillsScore(ratings: SoftSkillRating[], skills: SoftSkillsGrid['skills']): Promise<number> {
  let totalScore = 0;
  
  for (const skill of skills) {
    const rating = ratings.find(r => r.skillId === skill.skillId);
    if (rating) {
      totalScore += rating.rating * skill.weight;
    }
  }
  
  return totalScore;
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE soft_skills_grid (
  id VARCHAR(36) PRIMARY KEY,
  job_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  
  skills JSON NOT NULL,
  global_score JSON NOT NULL,
  score_recommendations JSON NOT NULL,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE soft_skill_rating (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  skill_id VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  evidence JSON NOT NULL,
  rated_at TIMESTAMP NOT NULL,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (skill_id) REFERENCES soft_skills(id)
);

CREATE INDEX idx_soft_grid_job ON soft_skills_grid(job_id);
CREATE INDEX idx_soft_rating_interview ON soft_skill_rating(interview_id);
CREATE INDEX idx_soft_rating_skill ON soft_skill_rating(skill_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/soft-skills-grid
async function createSoftSkillsGrid(jobId: string, createdBy: string): Promise<SoftSkillsGrid> {
  return await generateSoftSkillsGrid(jobId, createdBy);
}

// GET /api/soft-skills-grid/:id
async function getSoftSkillsGrid(id: string): Promise<SoftSkillsGrid> {
  return await getGridById(id);
}

// GET /api/soft-skills-grid/job/:jobId
async function getSoftSkillsGridByJob(jobId: string): Promise<SoftSkillsGrid> {
  return await getGridByJob(jobId);
}

// PUT /api/soft-skills-grid/:id
async function updateSoftSkillsGrid(id: string, grid: Partial<SoftSkillsGrid>): Promise<SoftSkillsGrid> {
  return await modifyGrid(id, grid);
}

// POST /api/soft-skills-grid/:gridId/rating
async function rateSoftSkill(gridId: string, skillId: string, rating: number, evidence: SoftSkillRating['evidence']): Promise<void> {
  return await saveSoftSkillRating(gridId, skillId, rating, evidence);
}

// GET /api/soft-skills-grid/:gridId/ratings
async function getSoftSkillRatings(gridId: string): Promise<SoftSkillRating[]> {
  return await getGridRatings(gridId);
}

// GET /api/soft-skills-grid/:gridId/global-score
async function getGlobalSoftSkillsScore(gridId: string): Promise<number> {
  const grid = await getSoftSkillsGrid(gridId);
  const ratings = await getSoftSkillRatings(gridId);
  return await calculateGlobalSoftSkillsScore(ratings, grid.skills);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Soft skills cotés / total | 100% |
| Consistance des cotations | Variance des cotations pour même profil | 0.5 |
| Taux de preuve | Cotations avec preuve / total | ≥ 95% |
| Précision des décisions | Décisions correctes / total | ≥ 85% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Grilles utilisées / créées | ≥ 90% |
| Temps de cotation | Temps moyen de cotation par soft skill | < 2 minutes |
| Satisfaction recruteur | Satisfaction avec la grille | ≥ 4/5 |

---

## 10. Conclusion

La Grille Soft Skills Personnalisée génère automatiquement une configuration de soft skills pondérée pour chaque poste, avec des seuils de décision clairs et des recommandations basées sur les scores. Elle n'est pas une grille générique mais est spécifique à chaque poste.

**Points clés :**
- Sélection automatique des soft skills selon le rôle (junior, confirmé, senior, manager, expert)
- Pondérations basées sur l'importance (critical, high, medium, low)
- Seuils de décision variables selon l'importance
- Score global avec formule et interprétation
- Recommandations par score (1-5)
- Cotation en temps réel avec recalcul automatique
- Alertes si seuils critiques non atteints
