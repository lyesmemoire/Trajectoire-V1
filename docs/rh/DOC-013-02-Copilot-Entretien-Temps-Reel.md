# DOC-013-02 : Copilot Entretien Temps Réel

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le Copilot Entretien Temps Réel pour MVP-013 Interview Intelligence. Ce copilot accompagne le recruteur pendant l'entretien en temps réel avec des suggestions de relance, une gestion du temps, et une cotation en direct.

---

## 2. Principe Fondateur

Le Copilot Entretien Temps Réel transforme un entretien standardisé en entretien dynamique et adaptatif. Il analyse les réponses du candidat en temps réel et suggère des relances chirurgicales pour creuser les zones d'ombre et détecter les signaux.

---

## 3. Interface du Copilot

### 3.1 Layout à 3 Panneaux

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ COPILOT ENTRETIEN TEMPS RÉEL                                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌──────────────────────┬──────────────────────────────────┬──────────────────┐ │
│ │ PANNEAU GAUCHE       │ PANNEAU CENTRAL                   │ PANNEAU DROIT    │ │
│ │ Contexte permanent   │ Fil de l'entretien                │ Analyse temps réel│ │
│ ├──────────────────────┼──────────────────────────────────┼──────────────────┤ │
│ │                      │                                  │                  │ │
│ │ Fiche poste résumée │ Question en cours :              │ Notes :          │ │
│ │ • Titre : [____]    │ [Question affichée]               │ [Zone de notes]  │ │
│ │ • Département : [__] │                                  │                  │ │
│ │ • Type : [____]      │ Éléments de relance :             │ Cotation :       │ │
│ │ • Niveau : [____]    │ • [Suggestion 1]                 │ Critère 1 : [X]  │ │
│ │                      │ • [Suggestion 2]                 │ Critère 2 : [X]  │ │
│ │ Points clés profil : │ • [Suggestion 3]                 │ Critère 3 : [X]  │ │
│ │ • [Point 1]         │                                  │ Score : [XX]     │ │
│ │ • [Point 2]         │ Signaux à surveiller :            │                  │ │
│ │ • [Point 3]         │ • [Signal 1]                     │ Alertes :        │ │
│ │                      │ • [Signal 2]                     │ ⚠ [Alerte 1]    │ │
│ │ Questions préparées :│                                  │ ⚠ [Alerte 2]    │ │
│ │ ✓ Question 1        │ Réponse candidat :               │                  │ │
│ │ ✓ Question 2        │ [Transcription en temps réel]     │ Signaux détectés│ │
│ │ ○ Question 3        │                                  │ │
│ │ ○ Question 4        │ Analyse en temps réel :           │ ✅ [Positif 1]   │ │
│ │ ○ Question 5        │ • [Analyse 1]                     │ ✅ [Positif 2]   │ │
│ │                      │ • [Analyse 2]                     │ ⚠️ [Vigilance 1] │ │
│ │ Timer :             │                                  │ ⚠️ [Vigilance 2] │ │
│ │ Phase 1 : [MM:SS]   │                                  │                  │
│ │ Phase 2 : [MM:SS]   │                                  │                  │
│ │ Phase 3 : [MM:SS]   │                                  │                  │
│ │ Total : [MM:SS]      │                                  │                  │
│ │                      │                                  │                  │
│ └──────────────────────┴──────────────────────────────────┴──────────────────┘ │
│                                                                                 │
│ Contrôles : [Démarrer] [Pause] [Question suivante] [Terminer]                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Panneau Gauche : Contexte Permanent

### 4.1 Fiche Poste Résumée

```typescript
interface JobSummary {
  title: string;
  department: string;
  type: 'permanent' | 'contract' | 'internship';
  level: 'junior' | 'intermediate' | 'senior' | 'expert';
  location: string;
  salaryRange: string;
  keyRequirements: string[];
  niceToHave: string[];
}
```

### 4.2 Points Clés du Profil

```typescript
interface ProfileKeyPoints {
  summary: string;
  profileType: string;
  careerStage: string;
  strengths: string[];
  areasToExplore: string[];
  redFlags: string[];
}
```

### 4.3 Questions Préparées avec Statut

```typescript
interface PreparedQuestion {
  id: string;
  question: string;
  objective: string;
  status: 'pending' | 'asked' | 'skipped';
  askedAt?: Date;
  response?: string;
  rating?: number;
}
```

### 4.4 Gestion du Temps

```typescript
interface TimeManagement {
  phases: {
    name: string;
    duration: number;
    elapsed: number;
    remaining: number;
  }[];
  totalDuration: number;
  totalElapsed: number;
  totalRemaining: number;
  alerts: {
    phase: string;
    type: 'warning' | 'critical';
    message: string;
  }[];
}
```

---

## 5. Panneau Central : Fil de l'Entretien

### 5.1 Question en Cours

```typescript
interface CurrentQuestion {
  id: string;
  question: string;
  objective: string;
  signalSought: string;
  followUpIfEvasive: string;
  askedAt: Date;
  duration: number;
}
```

### 5.2 Éléments de Relance Suggérés

```typescript
interface FollowUpSuggestion {
  id: string;
  suggestion: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  triggeredBy: 'vague_response' | 'positive_signal' | 'inconsistency' | 'missing_info';
}
```

### 5.3 Signaux à Surveiller

```typescript
interface SignalToWatch {
  id: string;
  signal: string;
  description: string;
  type: 'positive' | 'vigilance' | 'risk';
  detected: boolean;
  detectedAt?: Date;
}
```

### 5.4 Réponse Candidat

```typescript
interface CandidateResponse {
  questionId: string;
  response: string;
  transcription: string;
  duration: number;
  startedAt: Date;
  endedAt: Date;
  analysis: ResponseAnalysis;
}
```

### 5.5 Analyse en Temps Réel

```typescript
interface ResponseAnalysis {
  clarity: number;
  specificity: number;
  concreteness: number;
  structure: number;
  honesty: number;
  signals: {
    positive: string[];
    vigilance: string[];
    risk: string[];
  };
  suggestions: string[];
}
```

---

## 6. Panneau Droit : Analyse en Temps Réel

### 6.1 Notes du Recruteur

```typescript
interface RecruiterNotes {
  questionId: string;
  notes: string;
  timestamp: Date;
  tags: string[];
}
```

### 6.2 Cotation en Direct

```typescript
interface RealTimeScoring {
  criteria: {
    name: string;
    weight: number;
    rating: number;
    ratedAt: Date;
  }[];
  globalScore: number;
  calculatedAt: Date;
  alerts: {
    criterion: string;
    message: string;
  }[];
}
```

### 6.3 Alertes

```typescript
interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}
```

### 6.4 Signaux Détectés

```typescript
interface DetectedSignal {
  id: string;
  type: 'positive' | 'vigilance' | 'risk';
  signal: string;
  description: string;
  confidence: number;
  detectedAt: Date;
  acknowledged: boolean;
}
```

---

## 7. Suggestions de Relance en Temps Réel

### 7.1 Processus de Génération

```typescript
async function generateFollowUpSuggestions(response: CandidateResponse, context: InterviewContext): Promise<FollowUpSuggestion[]> {
  const suggestions: FollowUpSuggestion[] = [];
  
  // Analyse de la réponse
  const analysis = await analyzeResponse(response);
  
  // Si réponse vague
  if (analysis.clarity < 0.5) {
    suggestions.push({
      id: generateId(),
      suggestion: 'Cette réponse est vague. Pouvez-vous me donner un exemple concret ?',
      reason: 'Réponse vague détectée',
      priority: 'high',
      triggeredBy: 'vague_response'
    });
  }
  
  // Si signal positif détecté
  if (analysis.signals.positive.length > 0) {
    const positiveSignal = analysis.signals.positive[0];
    suggestions.push({
      id: generateId(),
      suggestion: `Signal positif détecté : ${positiveSignal}. Explorer avec : Pouvez-vous me donner plus de détails sur cette expérience ?`,
      reason: 'Signal positif à creuser',
      priority: 'medium',
      triggeredBy: 'positive_signal'
    });
  }
  
  // Si incohérence détectée
  if (analysis.signals.vigilance.some(s => s.includes('incohérence'))) {
    suggestions.push({
      id: generateId(),
      suggestion: 'Incohérence détectée avec votre CV. Pouvez-vous clarifier ce point ?',
      reason: 'Incohérence avec le CV',
      priority: 'high',
      triggeredBy: 'inconsistency'
    });
  }
  
  // Si information manquante
  if (analysis.specificity < 0.5) {
    suggestions.push({
      id: generateId(),
      suggestion: 'Cette réponse manque de précision. Quelles actions avez-vous concrètement menées ?',
      reason: 'Information manquante',
      priority: 'medium',
      triggeredBy: 'missing_info'
    });
  }
  
  return suggestions;
}
```

### 7.2 Types de Relances

| Type de relance | Déclencheur | Exemple |
|-----------------|-------------|---------|
| Clarification | Réponse vague | "Pouvez-vous me donner un exemple concret ?" |
| Creusage | Signal positif | "Pouvez-vous me donner plus de détails sur cette expérience ?" |
| Incohérence | Contradiction CV | "Incohérence détectée avec votre CV. Pouvez-vous clarifier ?" |
| Quantification | Pas de chiffres | "Quels résultats chiffrés avez-vous obtenus ?" |
| Responsabilité | Dilution "on/nous" | "Qu'avez-vous fait personnellement dans ce projet ?" |

---

## 8. Gestion du Temps

### 8.1 Processus de Gestion

```typescript
async function manageTimeManagement(interviewId: string): Promise<TimeManagement> {
  const interview = await getInterview(interviewId);
  const timeManagement: TimeManagement = {
    phases: [],
    totalDuration: interview.totalDuration,
    totalElapsed: 0,
    totalRemaining: interview.totalDuration,
    alerts: []
  };
  
  // Calcul du temps écoulé par phase
  for (const phase of interview.phases) {
    const elapsed = await calculatePhaseElapsed(phase);
    const remaining = phase.duration - elapsed;
    
    timeManagement.phases.push({
      name: phase.name,
      duration: phase.duration,
      elapsed,
      remaining
    });
    
    // Alertes si une phase prend trop de temps
    if (remaining < 0) {
      timeManagement.alerts.push({
        phase: phase.name,
        type: 'critical',
        message: `Phase ${phase.name} dépasse le temps imparti de ${Math.abs(remaining)} minutes`
      });
    } else if (remaining < 5) {
      timeManagement.alerts.push({
        phase: phase.name,
        type: 'warning',
        message: `Phase ${phase.name} termine dans ${remaining} minutes`
      });
    }
  }
  
  // Calcul du temps total
  timeManagement.totalElapsed = timeManagement.phases.reduce((sum, p) => sum + p.elapsed, 0);
  timeManagement.totalRemaining = timeManagement.phases.reduce((sum, p) => sum + p.remaining, 0);
  
  return timeManagement;
}
```

### 8.2 Suggestions de Gestion du Temps

```typescript
async function generateTimeSuggestions(timeManagement: TimeManagement): Promise<string[]> {
  const suggestions: string[] = [];
  
  for (const phase of timeManagement.phases) {
    if (phase.remaining < 0) {
      suggestions.push(`Accélérer la phase ${phase.name} pour rattraper le retard`);
    } else if (phase.remaining < 5) {
      suggestions.push(`Conclure la phase ${phase.name} dans les 5 prochaines minutes`);
    }
  }
  
  if (timeManagement.totalRemaining < 10) {
    suggestions.push('Passer aux questions de conclusion');
  }
  
  return suggestions;
}
```

---

## 9. Cotation en Direct

### 9.1 Processus de Cotation

```typescript
async function calculateRealTimeScore(interviewId: string, criteria: ScoringCriteria[]): Promise<RealTimeScoring> {
  const realTimeScoring: RealTimeScoring = {
    criteria: [],
    globalScore: 0,
    calculatedAt: new Date(),
    alerts: []
  };
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  for (const criterion of criteria) {
    const rating = await getCriterionRating(interviewId, criterion.name);
    
    realTimeScoring.criteria.push({
      name: criterion.name,
      weight: criterion.weight,
      rating,
      ratedAt: new Date()
    });
    
    totalWeightedScore += rating * criterion.weight;
    totalWeight += criterion.weight;
    
    // Alertes si un critère critique n'a pas encore été évalué
    if (rating === 0 && criterion.critical) {
      realTimeScoring.alerts.push({
        criterion: criterion.name,
        message: `Critère critique ${criterion.name} n'a pas encore été évalué`
      });
    }
  }
  
  // Calcul du score global
  realTimeScoring.globalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  
  return realTimeScoring;
}
```

### 9.2 Mise à jour en Temps Réel

```typescript
async function updateRealTimeScore(interviewId: string, criterionName: string, rating: number): Promise<void> {
  // Mise à jour de la cotation
  await updateCriterionRating(interviewId, criterionName, rating);
  
  // Recalcul du score global
  const criteria = await getScoringCriteria(interviewId);
  const realTimeScoring = await calculateRealTimeScore(interviewId, criteria);
  
  // Notification au recruteur
  await notifyRecruiter(interviewId, {
    type: 'score_update',
    globalScore: realTimeScoring.globalScore,
    criteria: realTimeScoring.criteria
  });
}
```

---

## 10. Structure de Données Complète (TypeScript)

```typescript
interface InterviewCopilot {
  interviewId: string;
  briefId: string;
  candidateId: string;
  jobId: string;
  recruiterId: string;
  startedAt: Date;
  endedAt?: Date;
  
  leftPanel: {
    jobSummary: JobSummary;
    profileKeyPoints: ProfileKeyPoints;
    preparedQuestions: PreparedQuestion[];
    timeManagement: TimeManagement;
  };
  
  centerPanel: {
    currentQuestion?: CurrentQuestion;
    followUpSuggestions: FollowUpSuggestion[];
    signalsToWatch: SignalToWatch[];
    candidateResponses: CandidateResponse[];
  };
  
  rightPanel: {
    recruiterNotes: RecruiterNotes[];
    realTimeScoring: RealTimeScoring;
    alerts: Alert[];
    detectedSignals: DetectedSignal[];
  };
  
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
}
```

---

## 11. API Endpoints

```typescript
// POST /api/interview-copilot/start
async function startCopilot(briefId: string): Promise<InterviewCopilot> {
  return await initializeCopilot(briefId);
}

// POST /api/interview-copilot/:interviewId/question
async function askQuestion(interviewId: string, questionId: string): Promise<void> {
  return await markQuestionAsAsked(interviewId, questionId);
}

// POST /api/interview-copilot/:interviewId/response
async function recordResponse(interviewId: string, questionId: string, response: string): Promise<CandidateResponse> {
  return await processResponse(interviewId, questionId, response);
}

// GET /api/interview-copilot/:interviewId/suggestions
async function getFollowUpSuggestions(interviewId: string, questionId: string): Promise<FollowUpSuggestion[]> {
  return await generateFollowUpSuggestions(await getLatestResponse(interviewId, questionId), await getContext(interviewId));
}

// POST /api/interview-copilot/:interviewId/notes
async function addNotes(interviewId: string, questionId: string, notes: string): Promise<RecruiterNotes> {
  return await saveNotes(interviewId, questionId, notes);
}

// POST /api/interview-copilot/:interviewId/rating
async function rateCriterion(interviewId: string, criterionName: string, rating: number): Promise<void> {
  return await updateRealTimeScore(interviewId, criterionName, rating);
}

// GET /api/interview-copilot/:interviewId/time
async function getTimeManagement(interviewId: string): Promise<TimeManagement> {
  return await manageTimeManagement(interviewId);
}

// POST /api/interview-copilot/:interviewId/pause
async function pauseCopilot(interviewId: string): Promise<void> {
  return await pauseInterview(interviewId);
}

// POST /api/interview-copilot/:interviewId/resume
async function resumeCopilot(interviewId: string): Promise<void> {
  return await resumeInterview(interviewId);
}

// POST /api/interview-copilot/:interviewId/complete
async function completeCopilot(interviewId: string): Promise<InterviewSummary> {
  return await finalizeInterview(interviewId);
}
```

---

## 12. Stockage et Gestion

### 12.1 Schéma SQL

```sql
CREATE TABLE interview_copilot (
  id VARCHAR(36) PRIMARY KEY,
  brief_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  status VARCHAR(20) NOT NULL,
  
  left_panel JSON NOT NULL,
  center_panel JSON NOT NULL,
  right_panel JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (brief_id) REFERENCES interview_brief(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_copilot_brief ON interview_copilot(brief_id);
CREATE INDEX idx_copilot_candidate ON interview_copilot(candidate_id);
CREATE INDEX idx_copilot_status ON interview_copilot(status);
```

---

## 13. Indicateurs de Suivi

### 13.1 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Latence des suggestions | Temps de génération des suggestions | < 2 secondes |
| Précision des suggestions | Suggestions pertinentes / total | ≥ 80% |
| Taux d'adoption | Suggestions utilisées / suggérées | ≥ 60% |
| Latence de cotation | Temps de calcul du score | < 1 seconde |

### 13.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Entretiens avec copilot / total | ≥ 90% |
| Temps moyen par entretien | Durée moyenne des entretiens | - |
| Taux de complétion | Entretiens complétés / démarrés | ≥ 95% |

---

## 14. Conclusion

Le Copilot Entretien Temps Réel accompagne le recruteur pendant l'entretien avec des suggestions de relance, une gestion du temps, et une cotation en direct. Il transforme un entretien standardisé en entretien dynamique et adaptatif.

**Points clés :**
- Layout à 3 panneaux (contexte, fil, analyse)
- Suggestions de relance en temps réel (clarification, creusage, incohérence, quantification, responsabilité)
- Gestion du temps par phase avec alertes
- Cotation en direct avec recalcul automatique
- Détection de signaux en temps réel (positifs, vigilance, risque)
- Notes et alertes intégrées
