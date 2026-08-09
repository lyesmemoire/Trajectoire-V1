# DOC-015-03 : Évaluation Structurée 5 Dimensions

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'évaluation structurée sur 5 dimensions pour MVP-015 Debrief Expert. Ce système évalue le candidat sur 5 dimensions clés, chacune notée sur 20, pour un score global sur 100.

---

## 2. Principe Fondateur

L'évaluation structurée sur 5 dimensions fournit une vue complète et équilibrée du candidat : compétences techniques, expérience pertinente, soft skills globaux, adéquation culturelle, et potentiel d'évolution. Chaque dimension est notée sur 20 avec des preuves concrètes.

---

## 3. Les 5 Dimensions

### DIMENSION 1 — Compétences Techniques (0-20)

**Ce qu'on évalue :**
- Niveau de maîtrise des compétences techniques requises
- Adéquation avec les exigences techniques du poste
- Capacité à appliquer les compétences en situation réelle

**Critères d'évaluation :**
| Score | Description | Indicateurs |
|-------|-------------|-------------|
| 16-20 | Exceptionnel | Maîtrise experte, au-delà des attentes, capacité à innover |
| 12-15 | Fort | Maîtrise solide, répond aux exigences, quelques points forts |
| 8-11 | Standard | Maîtrise adéquate, répond aux attentes minimales |
| 4-7 | Faible | Maîtrise partielle, lacunes significatives |
| 0-3 | Insuffisant | Maîtrise insuffisante, incompétent sur les compétences clés |

**Sources de données :**
- Analyse CV (MVP-001)
- Réponses aux questions techniques (MVP-013)
- Test technique si applicable
- Matching score compétences (MVP-002)

**Preuves requises :**
- Citations exactes de l'entretien sur les compétences
- Exemples concrets d'application
- Résultats chiffrés si disponibles

---

### DIMENSION 2 — Expérience Pertinente (0-20)

**Ce qu'on évalue :**
- Pertinence de l'expérience par rapport au poste
- Profondeur et diversité de l'expérience
- Progression de carrière cohérente

**Critères d'évaluation :**
| Score | Description | Indicateurs |
|-------|-------------|-------------|
| 16-20 | Exceptionnel | Expérience parfaitement alignée, progression rapide, leadership démontré |
| 12-15 | Fort | Expérience pertinente, progression cohérente, quelques réalisations notables |
| 8-11 | Standard | Expérience adéquate, progression normale, répond aux attentes |
| 4-7 | Faible | Expérience partiellement pertinente, progression limitée |
| 0-3 | Insuffisant | Expérience non pertinente, progression incohérente |

**Sources de données :**
- Analyse CV (MVP-001)
- Réponses sur les expériences passées (MVP-013)
- Historique des postes
- Durée moyenne dans les postes

**Preuves requises :**
- Exemples de projets pertinents cités
- Durée et contexte des expériences
- Résultats obtenus dans les postes précédents

---

### DIMENSION 3 — Soft Skills Globaux (0-20)

**Ce qu'on évalue :**
- Score global des 12 soft skills fondamentaux
- Pondération selon les priorités du poste
- Équilibre entre les différentes catégories de soft skills

**Critères d'évaluation :**
| Score | Description | Indicateurs |
|-------|-------------|-------------|
| 16-20 | Exceptionnel | Soft skills exceptionnels, marqueur de potentiel élevé |
| 12-15 | Fort | Soft skills solides, au-dessus des attentes |
| 8-11 | Standard | Soft skills adéquats, niveau attendu |
| 4-7 | Faible | Soft skills faibles, lacunes significatives |
| 0-3 | Insuffisant | Soft skills insuffisants, inadaptés au poste |

**Sources de données :**
- Cotations Soft Skills (MVP-014)
- Preuves comportementales (MVP-014)
- Synthèse Soft Skills (MVP-014)

**Preuves requises :**
- Détail par soft skill avec score
- Preuves comportementales pour chaque soft skill
- Exemples concrets observés

---

### DIMENSION 4 — Adéquation Culturelle (0-20)

**Ce qu'on évalue :**
- Alignement des valeurs avec l'entreprise
- Compatibilité avec le style de management
- Compatibilité avec la dynamique d'équipe

**Critères d'évaluation :**
| Score | Description | Indicateurs |
|-------|-------------|-------------|
| 16-20 | Exceptionnel | Alignement parfait, valeurs identiques, style idéal |
| 12-15 | Fort | Alignement solide, valeurs compatibles, style adapté |
| 8-11 | Standard | Alignement adéquat, valeurs compatibles, quelques différences mineures |
| 4-7 | Faible | Alignement partiel, valeurs partiellement compatibles |
| 0-3 | Insuffisant | Inadéquation culturelle majeure, valeurs incompatibles |

**Sources de données :**
- Réponses sur les préférences de travail (MVP-014)
- Observations comportementales (MVP-013)
- Culture fit score (MVP-014)

**Preuves requises :**
- Comportements observés pendant l'entretien
- Réponses sur les environnements préférés
- Exemples d'adaptation culturelle passée

---

### DIMENSION 5 — Potentiel d'Évolution (0-20)

**Ce qu'on évalue :**
- Capacité d'apprentissage et de développement
- Ambition et vision à moyen terme
- Signaux de potentiel élevé

**Critères d'évaluation :**
| Score | Description | Indicateurs |
|-------|-------------|-------------|
| 16-20 | Exceptionnel | Potentiel exceptionnel, marqueur de leadership futur, vision claire |
| 12-15 | Fort | Potentiel solide, capacité d'évolution démontrée |
| 8-11 | Standard | Potentiel adéquat, capacité d'évolution normale |
| 4-7 | Faible | Potentiel limité, capacité d'évolution restreinte |
| 0-3 | Insuffisant | Pas de potentiel d'évolution, plateau atteint |

**Sources de données :**
- Apprentissage continu (MVP-014)
- Vision stratégique (MVP-014)
- Orientation résultats (MVP-014)
- Progression de carrière passée

**Preuves requises :**
- Exemples d'apprentissage récent
- Vision à 3-5 ans
- Signaux de potentiel détectés

---

## 4. Structure de Données (TypeScript)

```typescript
interface StructuredEvaluation {
  evaluationId: string;
  interviewId: string;
  candidateId: string;
  jobId: string;
  evaluatedAt: Date;
  
  dimensions: {
    technicalSkills: {
      score: number; // 0-20
      criteria: {
        mastery: number; // 0-5
        alignment: number; // 0-5
        application: number; // 0-5
        innovation: number; // 0-5
      };
      evidence: string[];
    };
    
    relevantExperience: {
      score: number; // 0-20
      criteria: {
        relevance: number; // 0-5
        depth: number; // 0-5
        diversity: number; // 0-5
        progression: number; // 0-5
      };
      evidence: string[];
    };
    
    softSkills: {
      score: number; // 0-20
      detail: {
        skillId: string;
        skillName: string;
        score: number; // 0-5
        weight: number;
      }[];
      evidence: string[];
    };
    
    culturalFit: {
      score: number; // 0-20
      criteria: {
        valuesAlignment: number; // 0-5
        managementStyle: number; // 0-5
        teamDynamics: number; // 0-5
        adaptability: number; // 0-5
      };
      evidence: string[];
    };
    
    evolutionPotential: {
      score: number; // 0-20
      criteria: {
        learningAbility: number; // 0-5
        ambition: number; // 0-5
        vision: number; // 0-5
        growthSignals: number; // 0-5
      };
      evidence: string[];
    };
  };
  
  globalScore: number; // 0-100
  
  confidence: number; // 0-1
  
  validation: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Date;
    comments?: string;
  };
}
```

---

## 5. Algorithmes d'Évaluation

### 5.1 Évaluation Compétences Techniques

```typescript
async function evaluateTechnicalSkills(data: DebriefData): Promise<StructuredEvaluation['dimensions']['technicalSkills']> {
  const criteria = {
    mastery: await evaluateMastery(data),
    alignment: await evaluateAlignment(data),
    application: await evaluateApplication(data),
    innovation: await evaluateInnovation(data)
  };
  
  const score = Object.values(criteria).reduce((sum, val) => sum + val, 0);
  
  const evidence = await extractTechnicalEvidence(data);
  
  return {
    score,
    criteria,
    evidence
  };
}

async function evaluateMastery(data: DebriefData): Promise<number> {
  // Évaluation de la maîtrise des compétences
  const cvAnalysis = data.cvAnalysis;
  const jobRequirements = data.jobAnalysis.requiredSkills;
  
  let masteryScore = 0;
  
  for (const requirement of jobRequirements) {
    const candidateSkill = cvAnalysis.skills.find(s => s.id === requirement.id);
    if (candidateSkill) {
      masteryScore += Math.min(candidateSkill.level / requirement.level, 1) * 5;
    }
  }
  
  return Math.min(5, masteryScore / jobRequirements.length);
}

async function evaluateAlignment(data: DebriefData): Promise<number> {
  // Évaluation de l'alignement avec les exigences
  const matchingScore = data.cvAnalysis.matchingScore;
  
  return matchingScore / 20; // Normalisation sur 5
}

async function evaluateApplication(data: DebriefData): Promise<number> {
  // Évaluation de la capacité à appliquer les compétences
  const responses = data.responses.filter(r => r.question.category === 'technical');
  
  let applicationScore = 0;
  
  for (const response of responses) {
    if (response.analysis.hasConcreteExample && response.analysis.hasQuantifiedResult) {
      applicationScore += 5;
    } else if (response.analysis.hasConcreteExample) {
      applicationScore += 3;
    }
  }
  
  return Math.min(5, applicationScore / Math.max(1, responses.length));
}

async function evaluateInnovation(data: DebriefData): Promise<number> {
  // Évaluation de la capacité à innover
  const innovationIndicators = [
    'créatif',
    'innovant',
    'nouvelle approche',
    'solution originale',
    'hors des sentiers battus'
  ];
  
  const responses = data.responses.filter(r => r.question.category === 'technical');
  
  let innovationCount = 0;
  
  for (const response of responses) {
    const text = response.transcription.toLowerCase();
    if (innovationIndicators.some(indicator => text.includes(indicator))) {
      innovationCount++;
    }
  }
  
  return Math.min(5, innovationCount / Math.max(1, responses.length) * 5);
}
```

### 5.2 Évaluation Expérience Pertinente

```typescript
async function evaluateRelevantExperience(data: DebriefData): Promise<StructuredEvaluation['dimensions']['relevantExperience']> {
  const criteria = {
    relevance: await evaluateRelevance(data),
    depth: await evaluateDepth(data),
    diversity: await evaluateDiversity(data),
    progression: await evaluateProgression(data)
  };
  
  const score = Object.values(criteria).reduce((sum, val) => sum + val, 0);
  
  const evidence = await extractExperienceEvidence(data);
  
  return {
    score,
    criteria,
    evidence
  };
}

async function evaluateRelevance(data: DebriefData): Promise<number> {
  // Évaluation de la pertinence de l'expérience
  const cvAnalysis = data.cvAnalysis;
  const jobRequirements = data.jobAnalysis.requiredExperience;
  
  let relevanceScore = 0;
  
  for (const requirement of jobRequirements) {
    const candidateExperience = cvAnalysis.experience.find(e => e.type === requirement.type);
    if (candidateExperience && candidateExperience.duration >= requirement.duration) {
      relevanceScore += 5;
    } else if (candidateExperience) {
      relevanceScore += 3;
    }
  }
  
  return Math.min(5, relevanceScore / Math.max(1, jobRequirements.length));
}

async function evaluateDepth(data: DebriefData): Promise<number> {
  // Évaluation de la profondeur de l'expérience
  const cvAnalysis = data.cvAnalysis;
  
  const totalExperience = cvAnalysis.experience.reduce((sum, exp) => sum + exp.duration, 0);
  
  if (totalExperience >= 10) return 5;
  if (totalExperience >= 7) return 4;
  if (totalExperience >= 5) return 3;
  if (totalExperience >= 3) return 2;
  if (totalExperience >= 1) return 1;
  
  return 0;
}

async function evaluateDiversity(data: DebriefData): Promise<number> {
  // Évaluation de la diversité de l'expérience
  const cvAnalysis = data.cvAnalysis;
  
  const uniqueIndustries = new Set(cvAnalysis.experience.map(e => e.industry));
  const uniqueRoles = new Set(cvAnalysis.experience.map(e => e.role));
  
  const diversityScore = (uniqueIndustries.size / 5) * 2.5 + (uniqueRoles.size / 5) * 2.5;
  
  return Math.min(5, diversityScore);
}

async function evaluateProgression(data: DebriefData): Promise<number> {
  // Évaluation de la progression de carrière
  const cvAnalysis = data.cvAnalysis;
  
  let progressionCount = 0;
  
  for (let i = 1; i < cvAnalysis.experience.length; i++) {
    const current = cvAnalysis.experience[i];
    const previous = cvAnalysis.experience[i - 1];
    
    if (current.level > previous.level) {
      progressionCount++;
    }
  }
  
  return Math.min(5, progressionCount * 2);
}
```

### 5.3 Évaluation Soft Skills

```typescript
async function evaluateSoftSkills(data: DebriefData): Promise<StructuredEvaluation['dimensions']['softSkills']> {
  const softSkillsRatings = data.softSkillsRatings;
  const grid = await getSoftSkillsGrid(data.interviewId);
  
  // Calcul du score global soft skills
  let weightedSum = 0;
  let totalWeight = 0;
  
  const detail: StructuredEvaluation['dimensions']['softSkills']['detail'] = [];
  
  for (const softSkill of softSkillsRatings) {
    const skillInGrid = grid.skills.find(s => s.skillId === softSkill.skillId);
    const weight = skillInGrid ? skillInGrid.weight : 1;
    
    weightedSum += softSkill.rating * weight;
    totalWeight += weight;
    
    detail.push({
      skillId: softSkill.skillId,
      skillName: await getSkillName(softSkill.skillId),
      score: softSkill.rating,
      weight
    });
  }
  
  const globalScore = totalWeight > 0 ? (weightedSum / totalWeight) * 4 : 0; // Normalisation sur 20
  
  const evidence = await extractSoftSkillsEvidence(data);
  
  return {
    score: Math.round(globalScore),
    detail,
    evidence
  };
}
```

### 5.4 Évaluation Adéquation Culturelle

```typescript
async function evaluateCulturalFit(data: DebriefData): Promise<StructuredEvaluation['dimensions']['culturalFit']> {
  const criteria = {
    valuesAlignment: await evaluateValuesAlignment(data),
    managementStyle: await evaluateManagementStyle(data),
    teamDynamics: await evaluateTeamDynamics(data),
    adaptability: await evaluateCulturalAdaptability(data)
  };
  
  const score = Object.values(criteria).reduce((sum, val) => sum + val, 0);
  
  const evidence = await extractCulturalEvidence(data);
  
  return {
    score,
    criteria,
    evidence
  };
}

async function evaluateValuesAlignment(data: DebriefData): Promise<number> {
  // Évaluation de l'alignement des valeurs
  const companyValues = data.job.companyValues;
  const candidateValues = data.candidate.values;
  
  let alignmentScore = 0;
  
  for (const companyValue of companyValues) {
    const candidateValue = candidateValues.find(v => v.category === companyValue.category);
    if (candidateValue && Math.abs(candidateValue.score - companyValue.score) <= 1) {
      alignmentScore += 5;
    } else if (candidateValue) {
      alignmentScore += 3;
    }
  }
  
  return Math.min(5, alignmentScore / Math.max(1, companyValues.length));
}

async function evaluateManagementStyle(data: DebriefData): Promise<number> {
  // Évaluation de la compatibilité avec le style de management
  const jobManagementStyle = data.job.managementStyle;
  const candidatePreference = data.candidate.managementPreference;
  
  if (jobManagementStyle === candidatePreference) {
    return 5;
  } else if (isCompatibleStyle(jobManagementStyle, candidatePreference)) {
    return 3;
  }
  
  return 1;
}

async function evaluateTeamDynamics(data: DebriefData): Promise<number> {
  // Évaluation de la compatibilité avec la dynamique d'équipe
  const teamDynamics = data.job.teamDynamics;
  const candidatePreference = data.candidate.teamPreference;
  
  if (teamDynamics === candidatePreference) {
    return 5;
  } else if (isCompatibleDynamics(teamDynamics, candidatePreference)) {
    return 3;
  }
  
  return 1;
}

async function evaluateCulturalAdaptability(data: DebriefData): Promise<number> {
  // Évaluation de la capacité d'adaptation culturelle
  const adaptabilityScore = data.softSkillsRatings.find(r => r.skillId === 'SS-003')?.rating || 0;
  
  return adaptabilityScore; // Déjà sur 5
}
```

### 5.5 Évaluation Potentiel d'Évolution

```typescript
async function evaluateEvolutionPotential(data: DebriefData): Promise<StructuredEvaluation['dimensions']['evolutionPotential']> {
  const criteria = {
    learningAbility: await evaluateLearningAbility(data),
    ambition: await evaluateAmbition(data),
    vision: await evaluateVision(data),
    growthSignals: await evaluateGrowthSignals(data)
  };
  
  const score = Object.values(criteria).reduce((sum, val) => sum + val, 0);
  
  const evidence = await extractPotentialEvidence(data);
  
  return {
    score,
    criteria,
    evidence
  };
}

async function evaluateLearningAbility(data: DebriefData): Promise<number> {
  // Évaluation de la capacité d'apprentissage
  const learningScore = data.softSkillsRatings.find(r => r.skillId === 'SS-008')?.rating || 0;
  
  return learningScore; // Déjà sur 5
}

async function evaluateAmbition(data: DebriefData): Promise<number> {
  // Évaluation de l'ambition
  const ambitionScore = data.softSkillsRatings.find(r => r.skillId === 'SS-006')?.rating || 0;
  
  return ambitionScore; // Déjà sur 5
}

async function evaluateVision(data: DebriefData): Promise<number> {
  // Évaluation de la vision
  const visionScore = data.softSkillsRatings.find(r => r.skillId === 'SS-011')?.rating || 0;
  
  return visionScore; // Déjà sur 5
}

async function evaluateGrowthSignals(data: DebriefData): Promise<number> {
  // Évaluation des signaux de croissance
  const cvAnalysis = data.cvAnalysis;
  
  let growthSignals = 0;
  
  // Progression rapide
  if (cvAnalysis.progressionRate > 0.5) growthSignals += 2;
  
  // Promotions
  if (cvAnalysis.promotions.length > 0) growthSignals += 2;
  
  // Responsabilités croissantes
  if (cvAnalysis.responsibilityGrowth > 0.3) growthSignals += 1;
  
  return Math.min(5, growthSignals);
}
```

---

## 6. Calcul du Score Global

```typescript
async function calculateGlobalScore(dimensions: StructuredEvaluation['dimensions']): Promise<number> {
  const globalScore = 
    dimensions.technicalSkills.score +
    dimensions.relevantExperience.score +
    dimensions.softSkills.score +
    dimensions.culturalFit.score +
    dimensions.evolutionPotential.score;
  
  return Math.min(100, globalScore);
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE structured_evaluation (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  evaluated_at TIMESTAMP NOT NULL,
  
  dimensions JSON NOT NULL,
  global_score INT NOT NULL CHECK (global_score >= 0 AND global_score <= 100),
  confidence DECIMAL(3,2) NOT NULL,
  
  validated BOOLEAN DEFAULT FALSE,
  validated_by VARCHAR(36),
  validated_at TIMESTAMP,
  validation_comments TEXT,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_eval_interview ON structured_evaluation(interview_id);
CREATE INDEX idx_eval_candidate ON structured_evaluation(candidate_id);
CREATE INDEX idx_eval_global_score ON structured_evaluation(global_score);
```

---

## 8. API Endpoints

```typescript
// POST /api/structured-evaluation
async function createEvaluation(interviewId: string): Promise<StructuredEvaluation> {
  return await generateStructuredEvaluation(interviewId);
}

// GET /api/structured-evaluation/:id
async function getEvaluation(id: string): Promise<StructuredEvaluation> {
  return await getEvaluationById(id);
}

// GET /api/structured-evaluation/interview/:interviewId
async function getEvaluationByInterview(interviewId: string): Promise<StructuredEvaluation> {
  return await getEvaluationByInterviewId(interviewId);
}

// PUT /api/structured-evaluation/:id
async function updateEvaluation(id: string, evaluation: Partial<StructuredEvaluation>): Promise<StructuredEvaluation> {
  return await modifyEvaluation(id, evaluation);
}

// POST /api/structured-evaluation/:id/validate
async function validateEvaluation(id: string, validation: StructuredEvaluation['validation']): Promise<void> {
  return await markAsValidated(id, validation);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Évaluations validées / total | 100% |
| Taux de preuves | Dimensions avec preuves / total | 100% |
| Consistance | Variance des évaluations pour même profil | ≤ 0.5 |
| Précision | Prédictions correctes / total | ≥ 85% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Évaluations utilisées / générées | ≥ 90% |
| Satisfaction recruteur | Satisfaction avec l'évaluation | ≥ 4.5/5 |
| Impact sur décision | Décisions basées sur évaluation / total | ≥ 80% |

---

## 10. Conclusion

L'évaluation structurée sur 5 dimensions fournit une vue complète et équilibrée du candidat. Chaque dimension est notée sur 20 avec des critères détaillés et des preuves concrètes, pour un score global sur 100.

**Points clés :**
- 5 dimensions : Compétences techniques, Expérience pertinente, Soft skills globaux, Adéquation culturelle, Potentiel d'évolution
- Chaque dimension notée sur 20 avec 4 critères (0-5 chacun)
- Score global sur 100
- Preuves concrètes obligatoires pour chaque dimension
- Algorithmes d'évaluation spécifiques par dimension
- Validation obligatoire avant utilisation
