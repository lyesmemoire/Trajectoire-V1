# DOC-016-07 : Debriefing Post-Simulation

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système de debriefing post-simulation pour MVP-016 Interview Simulator. Ce système génère un debriefing structuré et détaillé après chaque simulation, que ce soit pour le candidat (Mode 1) ou pour le recruteur (Mode 2).

---

## 2. Principe Fondateur

Le debriefing post-simulation fournit un feedback structuré, constructif et actionnable. Pour le candidat, il identifie les points forts/faibles/dangereux et propose des reformulations. Pour le recruteur, il évalue ses compétences d'entretien et suggère des axes d'amélioration.

---

## 3. Debriefing Candidat (Mode 1)

### 3.1 Structure du Debriefing Candidat

**SECTION 1 — Points Forts**
- Question posée
- Réponse du candidat
- Pourquoi la réponse est forte
- Ce qui la distingue

**SECTION 2 — Points Faibles**
- Question posée
- Réponse du candidat
- Pourquoi la réponse est faible
- Reformulation recommandée

**SECTION 3 — Points Dangereux**
- Question posée
- Réponse du candidat
- Pourquoi la réponse est dangereuse
- Reformulation recommandée

**SECTION 4 — Niveau de Préparation Global**
- Statistiques (réponses fortes/faibles/dangereuses)
- Score moyen
- Niveau (excellent/bon/moyen/faible)

**SECTION 5 — Axes de Travail Prioritaires**
- Domaines à améliorer
- Actions concrètes
- Ressources d'apprentissage

---

### 3.2 Algorithme de Génération du Debriefing Candidat

```typescript
async function generateCandidateDebriefing(trainingId: string): Promise<CandidateDebriefing> {
  const training = await getTraining(trainingId);
  const interviewFlow = training.interviewFlow;
  
  // Évaluation de chaque réponse
  const evaluatedResponses = await evaluateAllResponses(interviewFlow);
  
  // Classification des réponses
  const strongPoints = evaluatedResponses.filter(r => r.quality === 'strong');
  const weakPoints = evaluatedResponses.filter(r => r.quality === 'weak');
  const dangerousPoints = evaluatedResponses.filter(r => r.quality === 'dangerous');
  
  // Génération des reformulations
  for (const point of [...weakPoints, ...dangerousPoints]) {
    point.recommendedReformulation = await generateReformulation(point.question, point.response);
  }
  
  // Calcul du niveau de préparation global
  const globalPreparation = await calculateGlobalPreparation(evaluatedResponses);
  
  // Génération des axes de travail
  const priorityWorkAreas = await generatePriorityWorkAreas(evaluatedResponses);
  
  // Construction du debriefing
  const debriefing: CandidateDebriefing = {
    debriefingId: generateDebriefingId(),
    trainingId,
    generatedAt: new Date(),
    
    strongPoints: strongPoints.map(p => ({
      questionId: p.questionId,
      question: p.question,
      response: p.response,
      whyStrong: await explainWhyStrong(p),
      whatDistinguishes: await explainWhatDistinguishes(p),
      score: p.score
    })),
    
    weakPoints: weakPoints.map(p => ({
      questionId: p.questionId,
      question: p.question,
      response: p.response,
      whyWeak: await explainWhyWeak(p),
      recommendedReformulation: p.recommendedReformulation,
      score: p.score
    })),
    
    dangerousPoints: dangerousPoints.map(p => ({
      questionId: p.questionId,
      question: p.question,
      response: p.response,
      whyDangerous: await explainWhyDangerous(p),
      recommendedReformulation: p.recommendedReformulation,
      score: p.score
    })),
    
    globalPreparationLevel: globalPreparation.level,
    
    statistics: {
      strongResponses: strongPoints.length,
      weakResponses: weakPoints.length,
      dangerousResponses: dangerousPoints.length,
      totalResponses: evaluatedResponses.length,
      averageScore: evaluatedResponses.reduce((sum, r) => sum + r.score, 0) / evaluatedResponses.length
    },
    
    priorityWorkAreas,
    
    recommendations: {
      practiceMore: globalPreparation.level !== 'excellent',
      focusAreas: priorityWorkAreas.map(a => a.area),
      nextSimulationDifficulty: globalPreparation.level === 'excellent' ? 'advanced' : 'standard'
    }
  };
  
  // Sauvegarde du debriefing
  await saveDebriefing(debriefing);
  
  return debriefing;
}

async function generateReformulation(question: string, response: string): Promise<string> {
  // Génération d'une reformulation recommandée
  const context = await extractContext(question);
  const missingElements = await identifyMissingElements(response);
  
  let reformulation = response;
  
  // Ajout d'exemple concret si manquant
  if (missingElements.includes('example')) {
    reformulation = await addConcreteExample(reformulation, context);
  }
  
  // Ajout de résultats chiffrés si manquant
  if (missingElements.includes('numbers')) {
    reformulation = await addQuantifiedResults(reformulation, context);
  }
  
  // Amélioration de la structure
  reformulation = await improveStructure(reformulation);
  
  return reformulation;
}

async function generatePriorityWorkAreas(responses: EvaluatedResponse[]): Promise<CandidateDebriefing['priorityWorkAreas']> {
  const areas: CandidateDebriefing['priorityWorkAreas'][] = [];
  
  // Analyse des réponses faibles
  const weakResponses = responses.filter(r => r.quality === 'weak');
  
  const weakPatterns = await identifyWeakPatterns(weakResponses);
  
  for (const pattern of weakPatterns) {
    areas.push({
      area: pattern.area,
      actions: pattern.actions,
      resources: pattern.resources
    });
  }
  
  // Analyse des réponses dangereuses
  const dangerousResponses = responses.filter(r => r.quality === 'dangerous');
  
  const dangerousPatterns = await identifyDangerousPatterns(dangerousResponses);
  
  for (const pattern of dangerousPatterns) {
    areas.push({
      area: pattern.area,
      actions: pattern.actions,
      resources: pattern.resources
    });
  }
  
  return areas;
}
```

---

## 4. Debriefing Recruteur (Mode 2)

### 4.1 Structure du Debriefing Recruteur

**SECTION 1 — Score Global**
- Score sur 100
- Niveau de performance
- Comparaison avec les benchmarks

**SECTION 2 — Détail par Critère**
- Qualité des questions (0-20)
- Détection des signaux faibles (0-20)
- Gestion du temps (0-20)
- Posture et bienveillance (0-20)
- Conformité légale (0-20)
- Profondeur des relances (0-20)

**SECTION 3 — Points Forts**
- Ce que le recruteur fait bien
- Exemples concrets de bonnes pratiques

**SECTION 4 — Points d'Amélioration**
- Ce qui doit être amélioré
- Exemples concrets de mauvaises pratiques
- Recommandations spécifiques

**SECTION 5 — Questions Illicites**
- Liste des questions illicites détectées
- Pourquoi elles sont illicites
- Reformulations recommandées

**SECTION 6 — Recommandations**
- Axes de travail prioritaires
- Ressources de formation
- Prochaines étapes

---

### 4.2 Algorithme de Génération du Debriefing Recruteur

```typescript
async function generateRecruiterDebriefing(trainingId: string): Promise<RecruiterDebriefing> {
  const training = await getTraining(trainingId);
  const evaluation = training.evaluation;
  
  // Génération des points forts
  const strengths = await generateRecruiterStrengths(evaluation);
  
  // Génération des points d'amélioration
  const improvements = await generateRecruiterImprovements(evaluation);
  
  // Génération des recommandations
  const recommendations = await generateRecruiterRecommendations(evaluation);
  
  // Construction du debriefing
  const debriefing: RecruiterDebriefing = {
    debriefingId: generateDebriefingId(),
    trainingId,
    recruiterId: training.recruiterId,
    generatedAt: new Date(),
    
    globalScore: evaluation.overallScore,
    performanceLevel: getPerformanceLevel(evaluation.overallScore),
    benchmark: await getBenchmark(evaluation.overallScore),
    
    criteriaDetail: {
      questionQuality: evaluation.questionQuality,
      signalDetection: evaluation.signalDetection,
      timeManagement: evaluation.timeManagement,
      posture: evaluation.posture,
      legalCompliance: evaluation.legalCompliance,
      followUpDepth: evaluation.followUpDepth
    },
    
    strengths,
    improvements,
    
    illegalQuestions: evaluation.legalCompliance.illegalQuestions.map(q => ({
      question: q.question,
      reason: q.reason,
      recommendedReformulation: await generateLegalReformulation(q.question)
    })),
    
    recommendations
  };
  
  // Sauvegarde du debriefing
  await saveDebriefing(debriefing);
  
  return debriefing;
}

async function generateRecruiterStrengths(evaluation: RecruiterEvaluation): Promise<string[]> {
  const strengths: string[] = [];
  
  // Qualité des questions
  if (evaluation.questionQuality.score >= 15) {
    strengths.push("Excellente qualité des questions : pertinentes, claires et variées");
  }
  
  Détection des signaux faibles
  if (evaluation.signalDetection.score >= 15) {
    strengths.push("Bonne détection des signaux faibles : réponses creuses et risques identifiés");
  }
  
  // Gestion du temps
  if (evaluation.timeManagement.score >= 15) {
    strengths.push("Bonne gestion du temps : respect du temps total et équilibre des phases");
  }
  
  // Posture
  if (evaluation.posture.score >= 15) {
    strengths.push("Posture professionnelle et bienveillante");
  }
  
  // Conformité légale
  if (evaluation.legalCompliance.score >= 18) {
    strengths.push("Excellente conformité légale : aucune question illicite");
  }
  
  // Profondeur des relances
  if (evaluation.followUpDepth.score >= 15) {
    strengths.push("Bonne profondeur des relances : questions ciblées et approfondies");
  }
  
  return strengths;
}

async function generateRecruiterImprovements(evaluation: RecruiterEvaluation): Promise<RecruiterDebriefing['improvements']> {
  const improvements: RecruiterDebriefing['improvements'][] = [];
  
  // Qualité des questions
  if (evaluation.questionQuality.score < 12) {
    improvements.push({
      area: "Qualité des questions",
      issue: "Questions peu pertinentes ou peu claires",
      example: await getWeakQuestionExample(evaluation),
      recommendation: "Améliorer la pertinence et la clarté des questions en utilisant la bibliothèque de questions expert"
    });
  }
  
  // Détection des signaux faibles
  if (evaluation.signalDetection.score < 12) {
    improvements.push({
      area: "Détection des signaux faibles",
      issue: "Manque de détection des réponses creuses et des signaux de risque",
      example: await getMissedSignalExample(evaluation),
      recommendation: "S'entraîner à détecter les réponses creuses et à relancer pour obtenir des exemples concrets"
    });
  }
  
  // Gestion du temps
  if (evaluation.timeManagement.score < 12) {
    improvements.push({
      area: "Gestion du temps",
      issue: "Mauvaise gestion du temps : dépassement ou déséquilibre des phases",
      example: await getTimeManagementIssue(evaluation),
      recommendation: "Surveiller le temps et équilibrer les phases de l'entretien"
    });
  }
  
  // Posture
  if (evaluation.posture.score < 12) {
    improvements.push({
      area: "Posture et bienveillance",
      issue: "Posture peu professionnelle ou manque de bienveillance",
      example: await getPostureIssue(evaluation),
      recommendation: "Travailler sur l'écoute active et la bienveillance"
    });
  }
  
  // Conformité légale
  if (evaluation.legalCompliance.score < 15) {
    improvements.push({
      area: "Conformité légale",
      issue: "Questions illicites ou borderline détectées",
      example: evaluation.legalCompliance.illegalQuestions[0]?.question,
      recommendation: "Réviser les critères prohibés et éviter les questions sur la vie personnelle"
    });
  }
  
  // Profondeur des relances
  if (evaluation.followUpDepth.score < 12) {
    improvements.push({
      area: "Profondeur des relances",
      issue: "Relances superficielles ou absentes",
      example: await getFollowUpIssue(evaluation),
      recommendation: "S'entraîner à relancer de manière ciblée et profonde"
    });
  }
  
  return improvements;
}

async function generateRecruiterRecommendations(evaluation: RecruiterEvaluation): Promise<RecruiterDebriefing['recommendations']> {
  const recommendations: RecruiterDebriefing['recommendations'] = {
    priorityWorkAreas: [],
    trainingResources: [],
    nextSteps: []
  };
  
  // Axes de travail prioritaires
  if (evaluation.questionQuality.score < 15) {
    recommendations.priorityWorkAreas.push("Qualité des questions");
  }
  if (evaluation.signalDetection.score < 15) {
    recommendations.priorityWorkAreas.push("Détection des signaux faibles");
  }
  if (evaluation.legalCompliance.score < 18) {
    recommendations.priorityWorkAreas.push("Conformité légale (priorité absolue)");
  }
  if (evaluation.followUpDepth.score < 15) {
    recommendations.priorityWorkAreas.push("Profondeur des relances");
  }
  
  // Ressources de formation
  if (evaluation.legalCompliance.score < 18) {
    recommendations.trainingResources.push("Formation sur la législation du recrutement et les critères prohibés");
  }
  if (evaluation.questionQuality.score < 15 || evaluation.followUpDepth.score < 15) {
    recommendations.trainingResources.push("Formation sur les techniques d'entretien comportemental");
  }
  if (evaluation.signalDetection.score < 15) {
    recommendations.trainingResources.push("Formation sur la détection des signaux faibles");
  }
  
  // Prochaines étapes
  if (evaluation.overallScore >= 70) {
    recommendations.nextSteps.push("Continuer à s'entraîner sur différents scénarios");
    recommendations.nextSteps.push("Envisager la certification");
  } else if (evaluation.overallScore >= 50) {
    recommendations.nextSteps.push("Refaire les simulations sur les scénarios difficiles");
    recommendations.nextSteps.push("Suivre les formations recommandées");
  } else {
    recommendations.nextSteps.push("Suivre impérativement les formations recommandées");
    recommendations.nextSteps.push("Refaire les simulations de base");
    recommendations.nextSteps.push("Demander un accompagnement par un mentor");
  }
  
  return recommendations;
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CandidateDebriefing {
  debriefingId: string;
  trainingId: string;
  generatedAt: Date;
  
  strongPoints: {
    questionId: string;
    question: string;
    response: string;
    whyStrong: string;
    whatDistinguishes: string;
    score: number;
  }[];
  
  weakPoints: {
    questionId: string;
    question: string;
    response: string;
    whyWeak: string;
    recommendedReformulation: string;
    score: number;
  }[];
  
  dangerousPoints: {
    questionId: string;
    question: string;
    response: string;
    whyDangerous: string;
    recommendedReformulation: string;
    score: number;
  }[];
  
  globalPreparationLevel: 'excellent' | 'good' | 'fair' | 'poor';
  
  statistics: {
    strongResponses: number;
    weakResponses: number;
    dangerousResponses: number;
    totalResponses: number;
    averageScore: number;
  };
  
  priorityWorkAreas: {
    area: string;
    actions: string[];
    resources: string[];
  }[];
  
  recommendations: {
    practiceMore: boolean;
    focusAreas: string[];
    nextSimulationDifficulty: 'standard' | 'advanced' | 'expert';
  };
}

interface RecruiterDebriefing {
  debriefingId: string;
  trainingId: string;
  recruiterId: string;
  generatedAt: Date;
  
  globalScore: number;
  performanceLevel: 'exceptional' | 'excellent' | 'good' | 'satisfactory' | 'medium' | 'insufficient';
  benchmark: {
    average: number;
    percentile: number;
  };
  
  criteriaDetail: {
    questionQuality: RecruiterEvaluation['questionQuality'];
    signalDetection: RecruiterEvaluation['signalDetection'];
    timeManagement: RecruiterEvaluation['timeManagement'];
    posture: RecruiterEvaluation['posture'];
    legalCompliance: RecruiterEvaluation['legalCompliance'];
    followUpDepth: RecruiterEvaluation['followUpDepth'];
  };
  
  strengths: string[];
  
  improvements: {
    area: string;
    issue: string;
    example: string;
    recommendation: string;
  }[];
  
  illegalQuestions: {
    question: string;
    reason: string;
    recommendedReformulation: string;
  }[];
  
  recommendations: {
    priorityWorkAreas: string[];
    trainingResources: string[];
    nextSteps: string[];
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE candidate_debriefing (
  id VARCHAR(36) PRIMARY KEY,
  training_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  strong_points JSON NOT NULL,
  weak_points JSON NOT NULL,
  dangerous_points JSON NOT NULL,
  
  global_preparation_level VARCHAR(20) NOT NULL,
  statistics JSON NOT NULL,
  priority_work_areas JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (training_id) REFERENCES candidate_training(id)
);

CREATE TABLE recruiter_debriefing (
  id VARCHAR(36) PRIMARY KEY,
  training_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  global_score INT NOT NULL CHECK (global_score >= 0 AND global_score <= 100),
  performance_level VARCHAR(20) NOT NULL,
  benchmark JSON NOT NULL,
  
  criteria_detail JSON NOT NULL,
  strengths JSON NOT NULL,
  improvements JSON NOT NULL,
  illegal_questions JSON NOT NULL,
  recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (training_id) REFERENCES recruiter_training(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_debriefing_training ON candidate_debriefing(training_id);
CREATE INDEX idx_recruiter_debriefing_training ON recruiter_debriefing(training_id);
CREATE INDEX idx_recruiter_debriefing_recruiter ON recruiter_debriefing(recruiter_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/candidate-debriefing
async function generateCandidateDebriefing(trainingId: string): Promise<CandidateDebriefing> {
  return await generateCandidateDebriefing(trainingId);
}

// GET /api/candidate-debriefing/:id
async function getCandidateDebriefing(id: string): Promise<CandidateDebriefing> {
  return await getCandidateDebriefingById(id);
}

// GET /api/candidate-debriefing/training/:trainingId
async function getCandidateDebriefingByTraining(trainingId: string): Promise<CandidateDebriefing> {
  return await getCandidateDebriefingByTrainingId(trainingId);
}

// POST /api/recruiter-debriefing
async function generateRecruiterDebriefing(trainingId: string): Promise<RecruiterDebriefing> {
  return await generateRecruiterDebriefing(trainingId);
}

// GET /api/recruiter-debriefing/:id
async function getRecruiterDebriefing(id: string): Promise<RecruiterDebriefing> {
  return await getRecruiterDebriefingById(id);
}

// GET /api/recruiter-debriefing/training/:trainingId
async function getRecruiterDebriefingByTraining(trainingId: string): Promise<RecruiterDebriefing> {
  return await getRecruiterDebriefingByTrainingId(trainingId);
}

// GET /api/recruiter-debriefing/recruiter/:recruiterId
async function getRecruiterDebriefings(recruiterId: string): Promise<RecruiterDebriefing[]> {
  return await getRecruiterDebriefingHistory(recruiterId);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Debriefings générés / simulations complétées | 100% |
| Satisfaction candidat | Satisfaction avec le debriefing | ≥ 4/5 |
| Satisfaction recruteur | Satisfaction avec le debriefing | ≥ 4.5/5 |
| Utilité perçue | Utilité perçue du debriefing | ≥ 4/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration candidat | Amélioration entre simulations après debriefing | ≥ 25% |
| Amélioration recruteur | Amélioration entre simulations après debriefing | ≥ 30% |
| Taux d'action | Utilisation des recommandations | ≥ 70% |

---

## 9. Conclusion

Le debriefing post-simulation fournit un feedback structuré, constructif et actionnable. Pour le candidat, il identifie les points forts/faibles/dangereux et propose des reformulations. Pour le recruteur, il évalue ses compétences d'entretien et suggère des axes d'amélioration.

**Points clés :**
- Debriefing candidat : points forts/faibles/dangereux, reformulations, niveau de préparation, axes de travail
- Debriefing recruteur : score global, détail par critère, points forts/amélioration, questions illicites, recommandations
- Génération automatique basée sur l'analyse des réponses/questions
- Reformulations recommandées pour les réponses faibles/dangereuses
- Recommandations de formation et de pratique
- Suivi de l'amélioration dans le temps
