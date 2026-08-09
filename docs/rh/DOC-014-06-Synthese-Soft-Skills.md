# DOC-014-06 : Synthèse Soft Skills

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la Synthèse Soft Skills pour MVP-014 Soft Skills Intelligence. Cette synthèse générée automatiquement après l'évaluation compile les cotations, les preuves comportementales, et formule une recommandation structurée sur les soft skills du candidat.

---

## 2. Principe Fondateur

La Synthèse Soft Skills compile toutes les données de l'évaluation des soft skills (cotations, preuves, observations) pour générer une recommandation structurée avec des points forts, des axes d'amélioration, et une décision finale basée exclusivement sur des preuves concrètes.

---

## 3. Structure de la Synthèse

### 3.1 Template de Synthèse

```
┌─────────────────────────────────────────┐
│ SYNTHÈSE SOFT SKILLS                    │
├─────────────────────────────────────────┤
│                                         │
| Candidat : [Nom]                        │
| Poste : [Titre]                        │
| Date évaluation : [DD/MM/YYYY]         │
| Évaluateur : [Nom]                      │
│ Synthèse générée : [DD/MM/YYYY HH:MM]  │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RÉSUMÉ EXÉCUTIF                       │
├─────────────────────────────────────────┤
│                                         │
| Score global soft skills : [X/5]       │
| Recommandation :                       │
| ○ Recommandation forte                │
| ○ Recommandation modérée              │
| ○ Non recommandé                      │
│                                         │
| Points clés :                          │
| • [Point clé 1]                        │
| • [Point clé 2]                        │
| • [Point clé 3]                        │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ COTATIONS PAR SOFT SKILL               │
├─────────────────────────────────────────┤
│                                         │
| Soft Skill 1 : [____]                   │
| • Score : [X/5]                         │
| • Seuil : [X/5]                        │
| • Statut : ✓ Au-dessus du seuil / ✗ En dessous du seuil│
| • Importance : [Critical/High/Medium/Low]│
| • Preuves : [nombre]                   │
| • Justification : [____]               │
│                                         │
| Soft Skill 2 : [____]                   │
| • Score : [X/5]                         │
| • Seuil : [X/5]                        │
| • Statut : ✓ Au-dessus du seuil / ✗ En dessous du seuil│
| • Importance : [Critical/High/Medium/Low]│
| • Preuves : [nombre]                   │
| • Justification : [____]               │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ POINTS FORTS                           │
├─────────────────────────────────────────┤
│                                         │
| Soft Skills avec score ≥ 4 :            │
│                                         │
| [Soft Skill 1] : [Score/5]              │
| • [Preuve 1]                           │
| • [Preuve 2]                           │
│                                         │
| [Soft Skill 2] : [Score/5]              │
| • [Preuve 1]                           │
| • [Preuve 2]                           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ AXES D'AMÉLIORATION                    │
├─────────────────────────────────────────┤
│                                         │
| Soft Skills avec score ≤ 2 :            │
│                                         │
| [Soft Skill 1] : [Score/5]              │
| • [Manque 1]                           │
| • [Manque 2]                           │
| • Recommandation : [____]              │
│                                         │
| [Soft Skill 2] : [Score/5]              │
| • [Manque 1]                           │
| • [Manque 2]                           │
| • Recommandation : [____]              │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ PREUVES COMPORTEMENTALES               │
├─────────────────────────────────────────┤
│                                         │
| Preuves détectées par type :            │
│                                         │
| Exemples concrets : [nombre]           │
| • [Preuve 1]                           │
| • [Preuve 2]                           │
│                                         │
| Résultats chiffrés : [nombre]           │
| • [Preuve 1]                           │
| • [Preuve 2]                           │
│                                         │
| Patterns récurrents : [nombre]           │
| • [Preuve 1]                           │
| • [Preuve 2]                           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RECOMMANDATION FINALE                  │
├─────────────────────────────────────────┤
│                                         │
| Décision :                             │
| ○ Recommandation forte                │
| ○ Recommandation modérée              │
| ○ Non recommandé                      │
│                                         │
| Justification :                         │
| [Justification détaillée]              │
│                                         │
| Conditions (si recommandation modérée) :│
| • [Condition 1]                        │
| • [Condition 2]                        │
│                                         │
| Étapes suivantes :                     │
| • [Étape 1]                           │
| • [Étape 2]                           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
| NOTES DE L'ÉVALUATEUR                 │
├─────────────────────────────────────────┤
│                                         │
| [Notes libres de l'évaluateur]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface SoftSkillsSummary {
  summaryId: string;
  interviewId: string;
  candidateId: string;
  jobId: string;
  evaluatorId: string;
  evaluationDate: Date;
  generatedAt: Date;
  
  executiveSummary: {
    globalScore: number;
    recommendation: 'strong_recommend' | 'moderate_recommend' | 'not_recommend';
    keyPoints: string[];
  };
  
  skillRatings: {
    skillId: string;
    skillName: string;
    rating: number;
    threshold: number;
    status: 'above_threshold' | 'below_threshold';
    importance: 'critical' | 'high' | 'medium' | 'low';
    evidenceCount: number;
    justification: string;
  }[];
  
  strengths: {
    skillId: string;
    skillName: string;
    rating: number;
    evidence: string[];
  }[];
  
  improvementAreas: {
    skillId: string;
    skillName: string;
    rating: number;
    gaps: string[];
    recommendation: string;
  }[];
  
  behavioralEvidence: {
    type: 'concrete_example' | 'quantified_result' | 'recurring_pattern' | 'recognition' | 'testimony';
    count: number;
    evidence: string[];
  };
  
  finalRecommendation: {
    decision: 'strong_recommend' | 'moderate_recommend' | 'not_recommend';
    justification: string;
    conditions?: string[];
    nextSteps: string[];
  };
  
  evaluatorNotes: string;
}
```

---

## 5. Génération de la Synthèse

### 5.1 Processus de Génération

```typescript
async function generateSoftSkillsSummary(interviewId: string, evaluatorId: string): Promise<SoftSkillsSummary> {
  // Étape 1 : Récupération des données de l'évaluation
  const ratings = await getSoftSkillRatings(interviewId);
  const evidence = await getBehavioralEvidence(interviewId);
  const grid = await getSoftSkillsGrid(interviewId);
  
  // Étape 2 : Génération du résumé exécutif
  const executiveSummary = await generateExecutiveSummary(ratings, grid);
  
  // Étape 3 : Compilation des cotations par soft skill
  const skillRatings = await compileSkillRatings(ratings, grid);
  
  // Étape 4 : Extraction des points forts
  const strengths = await extractStrengths(ratings, evidence);
  
  // Étape 5 : Extraction des axes d'amélioration
  const improvementAreas = await extractImprovementAreas(ratings, evidence);
  
  // Étape 6 : Compilation des preuves comportementales
  const behavioralEvidence = await compileBehavioralEvidence(evidence);
  
  // Étape 7 : Génération de la recommandation finale
  const finalRecommendation = await generateFinalRecommendation(executiveSummary, skillRatings);
  
  // Construction de la synthèse
  const summary: SoftSkillsSummary = {
    summaryId: generateSummaryId(),
    interviewId,
    candidateId: await getCandidateId(interviewId),
    jobId: await getJobId(interviewId),
    evaluatorId,
    evaluationDate: await getEvaluationDate(interviewId),
    generatedAt: new Date(),
    
    executiveSummary,
    skillRatings,
    strengths,
    improvementAreas,
    behavioralEvidence,
    finalRecommendation,
    evaluatorNotes: ''
  };
  
  // Sauvegarde de la synthèse
  await saveSummary(summary);
  
  return summary;
}
```

### 5.2 Génération du Résumé Exécutif

```typescript
async function generateExecutiveSummary(ratings: SoftSkillRating[], grid: SoftSkillsGrid): Promise<SoftSkillsSummary['executiveSummary']> {
  // Calcul du score global
  const globalScore = await calculateGlobalSoftSkillsScore(ratings, grid.skills);
  
  // Détermination de la recommandation
  const recommendation = await determineRecommendation(globalScore, ratings, grid);
  
  // Extraction des points clés
  const keyPoints = await extractKeyPoints(ratings, grid);
  
  return {
    globalScore,
    recommendation,
    keyPoints
  };
}

async function determineRecommendation(
  globalScore: number,
  ratings: SoftSkillRating[],
  grid: SoftSkillsGrid
): Promise<'strong_recommend' | 'moderate_recommend' | 'not_recommend'> {
  // Vérification des soft skills critiques
  const criticalSkills = grid.skills.filter(s => s.importance === 'critical');
  
  for (const criticalSkill of criticalSkills) {
    const rating = ratings.find(r => r.skillId === criticalSkill.skillId);
    if (rating && rating.rating < criticalSkill.decisionThreshold) {
      return 'not_recommend';
    }
  }
  
  // Si score élevé et aucun soft skill critique en dessous du seuil
  if (globalScore >= 4.0) {
    return 'strong_recommend';
  }
  
  // Si score moyen
  if (globalScore >= 3.5) {
    return 'moderate_recommend';
  }
  
  // Si score faible
  return 'not_recommend';
}
```

### 5.3 Extraction des Points Forts

```typescript
async function extractStrengths(ratings: SoftSkillRating[], evidence: BehavioralEvidence[]): Promise<SoftSkillsSummary['strengths']> {
  const strengths: SoftSkillsSummary['strengths'] = [];
  
  // Soft skills avec score ≥ 4
  for (const rating of ratings) {
    if (rating.rating >= 4) {
      const skillEvidence = evidence.filter(e => e.skillId === rating.skillId);
      
      strengths.push({
        skillId: rating.skillId,
        skillName: await getSkillName(rating.skillId),
        rating: rating.rating,
        evidence: skillEvidence.map(e => e.text).slice(0, 3)
      });
    }
  }
  
  return strengths;
}
```

### 5.4 Extraction des Axes d'Amélioration

```typescript
async function extractImprovementAreas(ratings: SoftSkillRating[], evidence: BehavioralEvidence[]): Promise<SoftSkillsSummary['improvementAreas']> {
  const improvementAreas: SoftSkillsSummary['improvementAreas'] = [];
  
  // Soft skills avec score ≤ 2
  for (const rating of ratings) {
    if (rating.rating <= 2) {
      const skillEvidence = evidence.filter(e => e.skillId === rating.skillId);
      
      improvementAreas.push({
        skillId: rating.skillId,
        skillName: await getSkillName(rating.skillId),
        rating: rating.rating,
        gaps: skillEvidence.length === 0 
          ? ['Aucune preuve détectée'] 
          : ['Preuves partielles ou floues'],
        recommendation: await getRecommendationForScore(rating.rating)
      });
    }
  }
  
  return improvementAreas;
}

async function getRecommendationForScore(score: number): Promise<string> {
  if (score === 1) {
    return 'Ce soft skill est absent ou négatif. Développement intensif requis.';
  } else if (score === 2) {
    return 'Ce soft skill est faible. Développement ciblé recommandé.';
  }
  return '';
}
```

### 5.5 Compilation des Preuves Comportementales

```typescript
async function compileBehavioralEvidence(evidence: BehavioralEvidence[]): Promise<SoftSkillsSummary['behavioralEvidence']> {
  const behavioralEvidence: SoftSkillsSummary['behavioralEvidence'] = {
    concrete_example: { type: 'concrete_example', count: 0, evidence: [] },
    quantified_result: { type: 'quantified_result', count: 0, evidence: [] },
    recurring_pattern: { type: 'recurring_pattern', count: 0, evidence: [] },
    recognition: { type: 'recognition', count: 0, evidence: [] },
    testimony: { type: 'testimony', count: 0, evidence: [] }
  };
  
  for (const ev of evidence) {
    if (behavioralEvidence[ev.type]) {
      behavioralEvidence[ev.type].count++;
      behavioralEvidence[ev.type].evidence.push(ev.text);
    }
  }
  
  return behavioralEvidence;
}
```

### 5.6 Génération de la Recommandation Finale

```typescript
async function generateFinalRecommendation(
  executiveSummary: SoftSkillsSummary['executiveSummary'],
  skillRatings: SoftSkillsSummary['skillRatings']
): Promise<SoftSkillsSummary['finalRecommendation']> {
  const decision = executiveSummary.recommendation;
  
  let justification = '';
  let conditions: string[] | undefined;
  const nextSteps: string[] = [];
  
  if (decision === 'strong_recommend') {
    justification = `Le candidat obtient un score global soft skills de ${executiveSummary.globalScore}/5, au-dessus du seuil de recommandation. Les points forts incluent ${executiveSummary.keyPoints.join(', ')}. Aucun soft skill critique en dessous du seuil.`;
    nextSteps.push('Proposer une offre');
    nextSteps.push('Planifier l\'onboarding');
  } else if (decision === 'moderate_recommend') {
    justification = `Le candidat obtient un score global soft skills de ${executiveSummary.globalScore}/5, légèrement au-dessus du seuil. Certains soft skills nécessitent un développement : ${skillRatings.filter(s => s.status === 'below_threshold').map(s => s.skillName).join(', ')}.`;
    conditions = ['Plan de développement ciblé sur les soft skills faibles', 'Suivi régulier pendant les 6 premiers mois'];
    nextSteps.push('Proposer une offre avec plan de développement');
    nextSteps.push('Planifier un suivi régulier');
  } else {
    justification = `Le candidat obtient un score global soft skills de ${executiveSummary.globalScore}/5, en dessous du seuil de recommandation. Les soft skills critiques en dessous du seuil sont : ${skillRatings.filter(s => s.status === 'below_threshold' && s.importance === 'critical').map(s => s.skillName).join(', ')}.`;
    nextSteps.push('Informer le candidat du rejet');
    nextSteps.push('Archiver le dossier');
  }
  
  return {
    decision,
    justification,
    conditions,
    nextSteps
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE soft_skills_summary (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  evaluator_id VARCHAR(36) NOT NULL,
  evaluation_date TIMESTAMP NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  executive_summary JSON NOT NULL,
  skill_ratings JSON NOT NULL,
  strengths JSON NOT NULL,
  improvement_areas JSON NOT NULL,
  behavioral_evidence JSON NOT NULL,
  final_recommendation JSON NOT NULL,
  evaluator_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (evaluator_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_soft_summary_interview ON soft_skills_summary(interview_id);
CREATE INDEX idx_soft_summary_candidate ON soft_skills_summary(candidate_id);
CREATE INDEX idx_soft_summary_job ON soft_skills_summary(job_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/soft-skills-summary
async function generateSummary(interviewId: string, evaluatorId: string): Promise<SoftSkillsSummary> {
  return await generateSoftSkillsSummary(interviewId, evaluatorId);
}

// GET /api/soft-skills-summary/:id
async function getSummary(id: string): Promise<SoftSkillsSummary> {
  return await getSummaryById(id);
}

// GET /api/soft-skills-summary/interview/:interviewId
async function getSummaryByInterview(interviewId: string): Promise<SoftSkillsSummary> {
  return await getSummaryByInterviewId(interviewId);
}

// GET /api/soft-skills-summary/candidate/:candidateId
async function getSummariesByCandidate(candidateId: string): Promise<SoftSkillsSummary[]> {
  return await getCandidateSummaries(candidateId);
}

// PUT /api/soft-skills-summary/:id
async function updateSummary(id: string, summary: Partial<SoftSkillsSummary>): Promise<SoftSkillsSummary> {
  return await modifySummary(id, summary);
}

// POST /api/soft-skills-summary/:id/approve
async function approveSummary(id: string, evaluatorNotes?: string): Promise<void> {
  return await markAsApproved(id, evaluatorNotes);
}

// POST /api/soft-skills-summary/:id/export
async function exportSummary(id: string, format: 'pdf' | 'docx'): Promise<Buffer> {
  return await exportToFormat(id, format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération réussie | Synthèses générées / évaluations terminées | 100% |
| Temps de génération | Temps moyen de génération | < 30 secondes |
| Précision de la recommandation | Recommandations correctes / total | ≥ 85% |
| Satisfaction évaluateur | Satisfaction avec la synthèse | ≥ 4/5 |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Synthèses consultées / générées | ≥ 90% |
| Taux d'approbation | Synthèses approuvées / total | ≥ 95% |
| Taux d'export | Synthèses exportées / total | ≥ 60% |

---

## 9. Conclusion

La Synthèse Soft Skills compile toutes les données de l'évaluation pour générer une recommandation structurée avec des points forts, des axes d'amélioration, et une décision finale basée exclusivement sur des preuves concrètes.

**Points clés :**
- Résumé exécutif (score global, recommandation, points clés)
- Cotations par soft skill (score, seuil, statut, importance, preuves)
- Points forts (soft skills avec score ≥ 4 et preuves)
- Axes d'amélioration (soft skills avec score ≤ 2 et recommandations)
- Preuves comportementales par type (exemples concrets, résultats chiffrés, patterns récurrents)
- Recommandation finale (décision, justification, conditions, étapes suivantes)
- Notes de l'évaluateur
