# DOC-016-06 : Évaluation Recruteur

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le système d'évaluation du recruteur pour MVP-016 Interview Simulator Mode 2 Formation Recruteur. Ce système évalue la qualité des questions posées, la détection des signaux faibles, la gestion du temps, la posture, la conformité légale, et la profondeur des relances.

---

## 2. Principe Fondateur

L'évaluation du recruteur est basée sur des critères objectifs et mesurables. Chaque critère est évalué sur 20 points, pour un score global sur 100.

---

## 3. Critères d'Évaluation

### CRITÈRE 1 — Qualité des Questions Posées (0-20)

**Sous-critères :**
- Pertinence (0-4) : La question est-elle pertinente par rapport au poste ?
- Clarté (0-4) : La question est-elle claire et précise ?
- Variété (0-4) : Les questions sont-elles variées (techniques, comportementales, culture) ?
- Profondeur (0-4) : Les questions sont-elles profondes et ciblées ?
- Adaptation (0-4) : Le recruteur adapte-t-il ses questions aux réponses du candidat ?

**Algorithme d'évaluation :**
```typescript
async function evaluateQuestionQuality(question: string, context: InterviewContext): Promise<number> {
  let score = 0;
  
  // Pertinence
  const relevance = await evaluateRelevance(question, context);
  score += relevance;
  
  // Clarté
  const clarity = await evaluateClarity(question);
  score += clarity;
  
  // Variété
  const variety = await evaluateVariety(question, context);
  score += variety;
  
  // Profondeur
  const depth = await evaluateDepth(question);
  score += depth;
  
  // Adaptation
  const adaptation = await evaluateAdaptation(question, context);
  score += adaptation;
  
  return score;
}

async function evaluateRelevance(question: string, context: InterviewContext): Promise<number> {
  const job = context.job;
  const jobKeywords = job.requiredSkills.map(s => s.name.toLowerCase());
  
  const questionLower = question.toLowerCase();
  const matches = jobKeywords.filter(keyword => questionLower.includes(keyword));
  
  if (matches.length >= 2) return 4;
  if (matches.length === 1) return 3;
  if (questionLower.includes('compétence') || questionLower.includes('expérience')) return 2;
  return 1;
}

async function evaluateClarity(question: string): Promise<number> {
  const length = question.split(' ').length;
  
  if (length >= 10 && length <= 25) return 4;
  if (length >= 8 && length <= 30) return 3;
  if (length >= 5 && length <= 35) return 2;
  return 1;
}

async function evaluateDepth(question: string): Promise<number> {
  const depthIndicators = [
    'comment',
    'pourquoi',
    'quelle',
    'de quelle manière',
    'qu\'avez-vous fait',
    'comment avez-vous géré'
  ];
  
  const questionLower = question.toLowerCase();
  const matches = depthIndicators.filter(indicator => questionLower.includes(indicator));
  
  if (matches.length >= 2) return 4;
  if (matches.length === 1) return 3;
  if (questionLower.includes('parlez-moi')) return 2;
  return 1;
}
```

---

### CRITÈRE 2 — Détection des Signaux Faibles (0-20)

**Sous-critères :**
- Détection des réponses creuses (0-5)
- Détection des signaux de risque (0-5)
- Détection des incohérences (0-5)
- Détection des soft skills faibles (0-5)

**Signaux à détecter :**
- Réponses creuses : génériques, vagues, sans exemples
- Signaux de risque : critique employeurs, discours victimaire
- Incohérences : contradictions dans les réponses
- Soft skills faibles : leadership, communication, adaptabilité

**Algorithme de détection :**
```typescript
async function evaluateSignalDetection(recruiterQuestions: string[], candidateResponses: string[]): Promise<number> {
  let score = 0;
  
  // Détection des réponses creuses
  const hollowResponses = candidateResponses.filter(r => isHollowResponse(r));
  const detectedHollow = recruiterQuestions.filter(q => isFollowUpForHollow(q)).length;
  score += Math.min(5, (detectedHollow / Math.max(1, hollowResponses.length)) * 5);
  
  // Détection des signaux de risque
  const riskSignals = candidateResponses.filter(r => hasRiskSignals(r));
  const detectedRisk = recruiterQuestions.filter(q => isFollowUpForRisk(q)).length;
  score += Math.min(5, (detectedRisk / Math.max(1, riskSignals.length)) * 5);
  
  // Détection des incohérences
  const inconsistencies = detectInconsistencies(candidateResponses);
  const detectedInconsistencies = recruiterQuestions.filter(q => isFollowUpForInconsistency(q)).length;
  score += Math.min(5, (detectedInconsistencies / Math.max(1, inconsistencies.length)) * 5);
  
  // Détection des soft skills faibles
  const weakSoftSkills = detectWeakSoftSkills(candidateResponses);
  const detectedWeakSoftSkills = recruiterQuestions.filter(q => isFollowUpForWeakSoftSkill(q)).length;
  score += Math.min(5, (detectedWeakSoftSkills / Math.max(1, weakSoftSkills.length)) * 5);
  
  return Math.round(score);
}

function isHollowResponse(response: string): boolean {
  const indicators = ['généralement', 'souvent', 'en général', 'd\'habitude', 'toujours'];
  return indicators.some(indicator => response.toLowerCase().includes(indicator)) &&
         !response.toLowerCase().includes('exemple');
}

function hasRiskSignals(response: string): boolean {
  const riskIndicators = ['incompétent', 'toxique', 'chaos', 'mauvais', 'injuste'];
  return riskIndicators.some(indicator => response.toLowerCase().includes(indicator));
}

function isFollowUpForHollow(question: string): boolean {
  const followUpIndicators = ['exemple', 'concret', 'situation', 'moment'];
  return followUpIndicators.some(indicator => question.toLowerCase().includes(indicator));
}

function isFollowUpForRisk(question: string): boolean {
  const followUpIndicators = ['pourquoi', 'comment', 'géré'];
  return followUpIndicators.some(indicator => question.toLowerCase().includes(indicator));
}
```

---

### CRITÈRE 3 — Gestion du Temps (0-20)

**Sous-critères :**
- Respect du temps total (0-5)
- Équilibre entre les phases (0-5)
- Temps par question approprié (0-5)
- Capacité à accélérer ou ralentir (0-5)

**Algorithme d'évaluation :**
```typescript
async function evaluateTimeManagement(interviewFlow: InterviewFlow): Promise<number> {
  let score = 0;
  
  const totalTime = interviewFlow.endedAt.getTime() - interviewFlow.startedAt.getTime();
  const targetTime = interviewFlow.configuration.duration * 60 * 1000;
  
  // Respect du temps total
  const timeDeviation = Math.abs(totalTime - targetTime) / targetTime;
  if (timeDeviation <= 0.1) score += 5;
  else if (timeDeviation <= 0.2) score += 4;
  else if (timeDeviation <= 0.3) score += 3;
  else if (timeDeviation <= 0.4) score += 2;
  else score += 1;
  
  // Équilibre entre les phases
  const phaseTimes = calculatePhaseTimes(interviewFlow);
  const balance = calculateBalance(phaseTimes);
  score += balance;
  
  // Temps par question approprié
  const questionTimes = calculateQuestionTimes(interviewFlow);
  const appropriateTimeCount = questionTimes.filter(t => t >= 60 && t <= 300).length;
  score += (appropriateTimeCount / Math.max(1, questionTimes.length)) * 5;
  
  // Capacité à accélérer ou ralentir
  const adaptation = evaluateTimeAdaptation(interviewFlow);
  score += adaptation;
  
  return Math.round(score);
}

function calculateBalance(phaseTimes: Record<string, number>): number {
  const times = Object.values(phaseTimes);
  const average = times.reduce((sum, t) => sum + t, 0) / times.length;
  const variance = times.reduce((sum, t) => sum + Math.pow(t - average, 2), 0) / times.length;
  
  if (variance <= 0.1 * average) return 5;
  if (variance <= 0.2 * average) return 4;
  if (variance <= 0.3 * average) return 3;
  if (variance <= 0.4 * average) return 2;
  return 1;
}
```

---

### CRITÈRE 4 — Posture et Bienveillance (0-20)

**Sous-critères :**
- Bienveillance (0-10) : Le recruteur est-il bienveillant et à l'écoute ?
- Professionnalisme (0-10) : Le recruteur maintient-il une posture professionnelle ?

**Indicateurs de bienveillance :**
- Écoute active (reformulation, confirmation)
- Positivité (feedback positif, encouragement)
- Respect du candidat (politesse, courtoisie)
- Mise en confiance (accueil, rassurance)

**Indicateurs de professionnalisme :**
- Ton professionnel
- Maintien du cadre de l'entretien
- Gestion des émotions
- Respect du temps

**Algorithme d'évaluation :**
```typescript
async function evaluatePosture(interviewFlow: InterviewFlow): Promise<number> {
  let benevolence = 0;
  let professionalism = 0;
  
  // Bienveillance
  const questions = interviewFlow.interviewFlow.map(f => f.question);
  
  const activeListening = questions.filter(q => 
    q.toLowerCase().includes('je comprends') || 
    q.toLowerCase().includes('si je comprends bien') ||
    q.toLowerCase().includes('merci pour cette réponse')
  ).length;
  benevolence += Math.min(3, activeListening);
  
  const positivity = questions.filter(q => 
    q.toLowerCase().includes('excellent') || 
    q.toLowerCase().includes('intéressant') ||
    q.toLowerCase().includes('c\'est une bonne réponse')
  ).length;
  benevolence += Math.min(3, positivity);
  
  const respect = questions.filter(q => 
    q.toLowerCase().includes('merci') || 
    q.toLowerCase().includes('s\'il vous plaît') ||
    q.toLowerCase().includes('je vous écoute')
  ).length;
  benevolence += Math.min(4, respect);
  
  // Professionnalisme
  const professionalTone = questions.filter(q => !isInformal(q)).length;
  professionalism += (professionalTone / Math.max(1, questions.length)) * 5;
  
  const frameMaintenance = evaluateFrameMaintenance(interviewFlow);
  professionalism += frameMaintenance;
  
  const emotionManagement = evaluateEmotionManagement(interviewFlow);
  professionalism += emotionManagement;
  
  return benevolence + professionalism;
}

function isInformal(question: string): boolean {
  const informalIndicators = ['super', 'top', 'cool', 'génial', 'mec', 'meuf'];
  return informalIndicators.some(indicator => question.toLowerCase().includes(indicator));
}
```

---

### CRITÈRE 5 — Conformité Légale des Questions (0-20)

**Sous-critères :**
- Absence de questions illicites (0-10)
- Détection des questions borderline (0-5)
- Correction des questions illicites (0-5)

**Critères prohibés :**
- Âge, origine, ethnie, nationalité
- Sexe, orientation sexuelle, identité de genre
- Situation familiale, grossesse
- Apparence physique
- État de santé, handicap
- Opinions politiques, activités syndicales
- Lieu de résidence

**Algorithme de détection :**
```typescript
async function evaluateLegalCompliance(questions: string[]): Promise<number> {
  let score = 20;
  
  const illegalQuestions: string[] = [];
  const borderlineQuestions: string[] = [];
  
  for (const question of questions) {
    const detection = detectIllegalQuestion(question);
    if (detection.illegal) {
      illegalQuestions.push(question);
      score -= 10;
    }
    
    const borderlineDetection = detectBorderlineQuestion(question);
    if (borderlineDetection.borderline) {
      borderlineQuestions.push(question);
      score -= 2;
    }
  }
  
  // Correction des questions illicites
  const correctedQuestions = illegalQuestions.filter(q => wasCorrected(q, questions));
  score += correctedQuestions.length * 5;
  
  return Math.max(0, Math.min(20, score));
}

function detectIllegalQuestion(question: string): { illegal: boolean; reason?: string } {
  const prohibitedPatterns = [
    { pattern: /\bâge\b/i, reason: 'Critère d\'âge prohibé' },
    { pattern: /\b(origine|ethnie|nationalité)\b/i, reason: 'Critère d\'origine prohibé' },
    { pattern: /\b(sexe|orientation sexuelle|identité de genre)\b/i, reason: 'Critère de genre prohibé' },
    { pattern: /\b(marié|célibataire|divorcé|veuf|famille|enfants)\b/i, reason: 'Critère de situation familiale prohibé' },
    { pattern: /\b(grossesse|enceinte)\b/i, reason: 'Critère de grossesse prohibé' },
    { pattern: /\b(apparence|physique|taille|poids)\b/i, reason: 'Critère d\'apparence physique prohibé' },
    { pattern: /\b(santé|maladie|handicap)\b/i, reason: 'Critère de santé prohibé' }
  ];
  
  for (const { pattern, reason } of prohibitedPatterns) {
    if (pattern.test(question)) {
      return { illegal: true, reason };
    }
  }
  
  return { illegal: false };
}

function detectBorderlineQuestion(question: string): { borderline: boolean; reason?: string } {
  const borderlinePatterns = [
    { pattern: /\b(équilibre|vie pro|vie perso|temps libre)\b/i, reason: 'Question sur la vie personnelle' },
    { pattern: /\b(mobilité|déplacement|transport)\b/i, reason: 'Question sur la mobilité' },
    { pattern: /\b(disponibilité|horaires|week-end)\b/i, reason: 'Question sur la disponibilité' }
  ];
  
  for (const { pattern, reason } of borderlinePatterns) {
    if (pattern.test(question)) {
      return { borderline: true, reason };
    }
  }
  
  return { borderline: false };
}
```

---

### CRITÈRE 6 — Profondeur des Relances (0-20)

**Sous-critères :**
- Taux de relance (0-5)
- Qualité des relances (0-5)
- Profondeur moyenne (0-5)
- Distribution des niveaux (0-5)

**Niveaux de relance :**
- Niveau 0 : Pas de relance
- Niveau 1 : Relance superficielle ("Pouvez-vous me donner plus de détails ?")
- Niveau 2 : Relance ciblée ("Vous avez mentionné X, pouvez-vous me donner un exemple ?")
- Niveau 3 : Relance profonde ("Comment avez-vous géré la résistance de l'équipe ?")

**Algorithme d'évaluation :**
```typescript
async function evaluateFollowUpDepth(interviewFlow: InterviewFlow): Promise<number> {
  let score = 0;
  
  const followUps = interviewFlow.interviewFlow.filter(f => f.followUp);
  const totalQuestions = interviewFlow.interviewFlow.length;
  
  // Taux de relance
  const followUpRate = followUps.length / Math.max(1, totalQuestions);
  score += Math.min(5, followUpRate * 10);
  
  // Qualité des relances
  const qualityScores = followUps.map(f => evaluateFollowUpQuality(f.followUp));
  const averageQuality = qualityScores.reduce((sum, q) => sum + q, 0) / Math.max(1, qualityScores.length);
  score += averageQuality;
  
  // Profondeur moyenne
  const depths = followUps.map(f => evaluateFollowUpDepth(f.followUp));
  const averageDepth = depths.reduce((sum, d) => sum + d, 0) / Math.max(1, depths.length);
  score += averageDepth * (5 / 3);
  
  // Distribution des niveaux
  const distribution = calculateDepthDistribution(depths);
  const idealDistribution = { level0: 0.2, level1: 0.2, level2: 0.3, level3: 0.3 };
  const distributionScore = compareDistributions(distribution, idealDistribution);
  score += distributionScore;
  
  return Math.round(score);
}

function evaluateFollowUpQuality(followUp: string): number {
  if (followUp.length < 10) return 1;
  if (followUp.length < 20) return 2;
  if (followUp.length < 30) return 3;
  if (followUp.length < 40) return 4;
  return 5;
}

function evaluateFollowUpDepth(followUp: string): number {
  if (/\b(détails|plus|en dire plus|préciser)\b/i.test(followUp)) return 1;
  if (/\b(exemple|situation|moment|avez-vous)\b/i.test(followUp)) return 2;
  if (/\b(comment|pourquoi|quelle|résistance|gestion)\b/i.test(followUp)) return 3;
  return 0;
}

function calculateDepthDistribution(depths: number[]): Record<string, number> {
  const distribution = { level0: 0, level1: 0, level2: 0, level3: 0 };
  
  for (const depth of depths) {
    if (depth === 0) distribution.level0++;
    else if (depth === 1) distribution.level1++;
    else if (depth === 2) distribution.level2++;
    else if (depth === 3) distribution.level3++;
  }
  
  const total = Math.max(1, depths.length);
  return {
    level0: distribution.level0 / total,
    level1: distribution.level1 / total,
    level2: distribution.level2 / total,
    level3: distribution.level3 / total
  };
}
```

---

## 4. Score Global

### 4.1 Calcul du Score Global

```typescript
async function calculateGlobalScore(evaluation: RecruiterEvaluation): Promise<number> {
  const scores = [
    evaluation.questionQuality.score,
    evaluation.signalDetection.score,
    evaluation.timeManagement.score,
    evaluation.posture.score,
    evaluation.legalCompliance.score,
    evaluation.followUpDepth.score
  ];
  
  const globalScore = scores.reduce((sum, score) => sum + score, 0);
  
  return Math.round(globalScore);
}
```

### 4.2 Niveaux de Performance

| Score | Niveau | Description |
|-------|--------|-------------|
| 90-100 | Exceptionnel | Recruteur expert, prêt à certifier |
| 80-89 | Excellent | Recruteur très compétent |
| 70-79 | Bon | Recruteur compétent |
| 60-69 | Satisfaisant | Recruteur avec des axes d'amélioration |
| 50-59 | Moyen | Recruteur nécessitant une formation |
| < 50 | Insuffisant | Recruteur non prêt à conduire des entretiens |

---

## 5. Structure de Données (TypeScript)

```typescript
interface RecruiterEvaluation {
  evaluationId: string;
  trainingId: string;
  recruiterId: string;
  generatedAt: Date;
  
  questionQuality: {
    score: number; // 0-20
    criteria: {
      relevance: number; // 0-4
      clarity: number; // 0-4
      variety: number; // 0-4
      depth: number; // 0-4
      adaptation: number; // 0-4
    };
  };
  
  signalDetection: {
    score: number; // 0-20
    detectedSignals: string[];
    missedSignals: string[];
  };
  
  timeManagement: {
    score: number; // 0-20
    totalTime: number;
    timePerQuestion: number[];
    balance: string;
  };
  
  posture: {
    score: number; // 0-20
    benevolence: number; // 0-10
    professionalism: number; // 0-10
  };
  
  legalCompliance: {
    score: number; // 0-20
    illegalQuestions: {
      question: string;
      reason: string;
      timestamp: Date;
    }[];
    borderlineQuestions: {
      question: string;
      reason: string;
      timestamp: Date;
    }[];
  };
  
  followUpDepth: {
    score: number; // 0-20
    averageDepth: number;
    depthDistribution: {
      level0: number;
      level1: number;
      level2: number;
      level3: number;
    };
  };
  
  overallScore: number; // 0-100
  
  feedback: string;
  
  recommendations: {
    areasToImprove: string[];
    strengths: string[];
    nextSteps: string[];
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE recruiter_evaluation (
  id VARCHAR(36) PRIMARY KEY,
  training_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  generated_at TIMESTAMP NOT NULL,
  
  question_quality JSON NOT NULL,
  signal_detection JSON NOT NULL,
  time_management JSON NOT NULL,
  posture JSON NOT NULL,
  legal_compliance JSON NOT NULL,
  follow_up_depth JSON NOT NULL,
  
  overall_score INT NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  
  feedback TEXT NOT NULL,
  recommendations JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (training_id) REFERENCES recruiter_training(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_evaluation_training ON recruiter_evaluation(training_id);
CREATE INDEX idx_evaluation_recruiter ON recruiter_evaluation(recruiter_id);
CREATE INDEX idx_evaluation_score ON recruiter_evaluation(overall_score);
```

---

## 7. API Endpoints

```typescript
// POST /api/recruiter-evaluation
async function createEvaluation(trainingId: string): Promise<RecruiterEvaluation> {
  return await generateEvaluation(trainingId);
}

// GET /api/recruiter-evaluation/:id
async function getEvaluation(id: string): Promise<RecruiterEvaluation> {
  return await getEvaluationById(id);
}

// GET /api/recruiter-evaluation/training/:trainingId
async function getEvaluationByTraining(trainingId: string): Promise<RecruiterEvaluation> {
  return await getEvaluationByTrainingId(trainingId);
}

// GET /api/recruiter-evaluation/recruiter/:recruiterId
async function getRecruiterEvaluations(recruiterId: string): Promise<RecruiterEvaluation[]> {
  return await getRecruiterEvaluationHistory(recruiterId);
}

// POST /api/recruiter-evaluation/:id/certify
async function certifyRecruiter(id: string): Promise<void> {
  return await markAsCertified(id);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de certification | Recruteurs certifiés / évalués | ≥ 70% |
| Score moyen | Score moyen des évaluations | ≥ 75/100 |
| Réduction des questions illicites | Réduction entre simulations | ≥ 80% |
| Amélioration de la profondeur | Amélioration entre simulations | ≥ 40% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Évaluations consultées / générées | ≥ 90% |
| Satisfaction recruteur | Satisfaction avec l'évaluation | ≥ 4.5/5 |
| Impact sur performance | Amélioration réelle des recruteurs | ≥ 30% |

---

## 9. Conclusion

L'évaluation du recruteur est basée sur 6 critères objectifs et mesurables : qualité des questions, détection des signaux faibles, gestion du temps, posture, conformité légale, et profondeur des relances. Chaque critère est évalué sur 20 points, pour un score global sur 100.

**Points clés :**
- 6 critères d'évaluation (0-20 chacun)
- Score global sur 100
- Détection automatique des questions illicites
- Évaluation de la profondeur des relances
- Feedback structuré avec recommandations
- Certification possible pour les recruteurs
- Suivi de l'amélioration dans le temps
