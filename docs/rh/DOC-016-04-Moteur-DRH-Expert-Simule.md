# DOC-016-04 : Moteur DRH Expert Simulé

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le Moteur DRH Expert Simulé pour MVP-016 Interview Simulator. Ce moteur simule un DRH Expert réaliste qui conduit un entretien complet, pose des questions de qualité, challenge sans agresser, détecte les réponses faibles et relance de manière pertinente.

---

## 2. Principe Fondateur

Le Moteur DRH Expert Simulé reproduit le comportement d'un DRH Expert d'un grand cabinet : professionnel, bienveillant, exigeant sans agresser, capable de détecter les réponses faibles et de relancer pour obtenir des exemples concrets.

---

## 3. Caractéristiques du DRH Expert Simulé

### 3.1 Posture Professionnelle

**Ton :**
- Professionnel et courtois
- Bienveillant mais exigeant
- Respectueux du candidat
- Clair et précis

**Style de communication :**
- Écoute active
- Reformulation pour confirmer la compréhension
- Positif dans le feedback
- Constructif dans les relances

---

### 3.2 Capacités du Moteur

**Conduite de l'entretien :**
- Introduction structurée
- Enchaînement logique des questions
- Gestion du temps
- Adaptation au candidat

**Qualité des questions :**
- Questions de la bibliothèque expert (MVP-013)
- Adaptées au poste et au candidat
- Pertinentes et variées
- Profondes et ciblées

**Détection des réponses :**
- Évaluation en temps réel de la qualité
- Détection des réponses faibles
- Détection des réponses dangereuses
- Identification des signaux de risque

**Relance automatique :**
- Relance pour obtenir des exemples concrets
- Relance pour clarifier une réponse vague
- Relance pour approfondir un point intéressant
- Relance pour challenger une réponse trop parfaite

---

## 4. Algorithme de Conduite de l'Entretien

### 4.1 Processus Global

```typescript
async function conductInterview(simulationId: string, candidateId: string, jobId: string): Promise<InterviewFlow> {
  const flow: InterviewFlow = {
    simulationId,
    candidateId,
    jobId,
    startedAt: new Date(),
    phases: [],
    currentPhase: 'introduction'
  };
  
  // Phase 1 : Introduction
  await conductIntroductionPhase(flow);
  
  // Phase 2 : Questions techniques
  await conductTechnicalPhase(flow);
  
  // Phase 3 : Questions d'observation comportementale
  await conductBehavioralPhase(flow);
  
  // Phase 4 : Questions de culture fit
  await conductCulturalFitPhase(flow);
  
  // Phase 5 : Conclusion
  await conductConclusionPhase(flow);
  
  flow.endedAt = new Date();
  
  return flow;
}
```

### 4.2 Phase d'Introduction

```typescript
async function conductIntroductionPhase(flow: InterviewFlow): Promise<void> {
  flow.currentPhase = 'introduction';
  
  // Salutation
  await askQuestion(flow, {
    question: "Bonjour, merci d'être venu aujourd'hui. Je suis [Nom], DRH chez [Entreprise]. Commençons par vous faire présenter en quelques minutes.",
    type: 'icebreaker',
    category: 'introduction'
  });
  
  // Présentation du poste
  const job = await getJob(flow.jobId);
  await askQuestion(flow, {
    question: `Le poste pour lequel vous êtes candidat est ${job.title}. Pourriez-vous me dire ce qui vous attire particulièrement dans ce poste ?`,
    type: 'motivation',
    category: 'introduction'
  });
  
  // Brise-glace
  await askQuestion(flow, {
    question: "Pour commencer, pourriez-vous me parler d'une réalisation dont vous êtes particulièrement fier ?",
    type: 'icebreaker',
    category: 'introduction'
  });
}
```

### 4.3 Phase Technique

```typescript
async function conductTechnicalPhase(flow: InterviewFlow): Promise<void> {
  flow.currentPhase = 'technical';
  
  const job = await getJob(flow.jobId);
  const technicalSkills = job.requiredSkills.filter(s => s.category === 'technical');
  
  for (const skill of technicalSkills.slice(0, 3)) {
    const question = await selectTechnicalQuestion(skill, flow);
    await askQuestion(flow, question);
    
    // Évaluation de la réponse
    const response = flow.phases[flow.phases.length - 1].response;
    const quality = await evaluateResponseQuality(response, question);
    
    // Relance si nécessaire
    if (quality === 'weak') {
      const followUp = await generateFollowUp(question, response, 'clarification');
      await askFollowUp(flow, followUp);
    }
  }
}
```

### 4.4 Phase Comportementale

```typescript
async function conductBehavioralPhase(flow: InterviewFlow): Promise<void> {
  flow.currentPhase = 'behavioral';
  
  const job = await getJob(flow.jobId);
  const criticalSoftSkills = job.requiredSoftSkills.filter(s => s.importance === 'critical');
  
  for (const skill of criticalSoftSkills.slice(0, 4)) {
    const question = await selectBehavioralQuestion(skill, flow);
    await askQuestion(flow, question);
    
    // Évaluation de la réponse
    const response = flow.phases[flow.phases.length - 1].response;
    const quality = await evaluateResponseQuality(response, question);
    
    // Relance si nécessaire
    if (quality === 'weak' || quality === 'dangerous') {
      const followUp = await generateFollowUp(question, response, 'example');
      await askFollowUp(flow, followUp);
    }
  }
}
```

### 4.5 Phase Culture Fit

```typescript
async function conductCulturalFitPhase(flow: InterviewFlow): Promise<void> {
  flow.currentPhase = 'cultural_fit';
  
  await askQuestion(flow, {
    question: "Quel type d'environnement de travail vous permet de vous épanouir le plus ?",
    type: 'cultural_fit',
    category: 'behavioral'
  });
  
  await askQuestion(flow, {
    question: "Comment décririez-vous votre style de travail idéal ?",
    type: 'cultural_fit',
    category: 'behavioral'
  });
  
  await askQuestion(flow, {
    question: "Quelles sont les valeurs qui sont les plus importantes pour vous dans une entreprise ?",
    type: 'cultural_fit',
    category: 'behavioral'
  });
}
```

### 4.6 Phase de Conclusion

```typescript
async function conductConclusionPhase(flow: InterviewFlow): Promise<void> {
  flow.currentPhase = 'conclusion';
  
  // Questions du candidat
  await askQuestion(flow, {
    question: "Avez-vous des questions sur le poste ou l'entreprise ?",
    type: 'candidate_questions',
    category: 'conclusion'
  });
  
  // Conclusion
  await say(flow, {
    message: "Merci pour cet échange. Nous reviendrons vers vous rapidement avec une réponse.",
    type: 'closing'
  });
}
```

---

## 5. Algorithme de Détection des Réponses Faibles

### 5.1 Indicateurs de Réponse Faible

```typescript
interface WeakResponseIndicators {
  generic: boolean;
  vague: boolean;
  dilution: boolean;
  theoretical: boolean;
  avoidance: boolean;
  tooShort: boolean;
  noExample: boolean;
  noNumbers: boolean;
}

async function detectWeakResponse(response: string, question: string): Promise<WeakResponseIndicators> {
  const indicators: WeakResponseIndicators = {
    generic: /\b(généralement|souvent|en général|d'habitude|toujours)\b/i.test(response),
    vague: /\b(quelque chose|un peu|plutôt|environ|en gros)\b/i.test(response),
    dilution: (response.match(/\b(on|nous|l'équipe|les gens)\b/gi) || []).length > 3,
    theoretical: /\b(théoriquement|en théorie|en principe|conceptuellement)\b/i.test(response),
    avoidance: /\b(c'est compliqué|je ne sais pas|je préfère ne pas répondre|je ne suis pas sûr)\b/i.test(response),
    tooShort: response.split(' ').length < 20,
    noExample: !/\b(exemple|situation|moment|projet|expérience|une fois|lors de)\b/i.test(response),
    noNumbers: !/\b(\d+|%|\d+%\d+)\b/.test(response)
  };
  
  return indicators;
}
```

### 5.2 Score de Qualité de Réponse

```typescript
async function calculateResponseQuality(response: string, question: string): Promise<{ quality: 'strong' | 'weak' | 'dangerous'; score: number }> {
  const indicators = await detectWeakResponse(response, question);
  
  let score = 100;
  
  // Pénalités pour indicateurs faibles
  if (indicators.generic) score -= 20;
  if (indicators.vague) score -= 15;
  if (indicators.dilution) score -= 15;
  if (indicators.theoretical) score -= 20;
  if (indicators.avoidance) score -= 25;
  if (indicators.tooShort) score -= 10;
  if (indicators.noExample) score -= 25;
  if (indicators.noNumbers) score -= 10;
  
  // Bonus pour indicateurs forts
  if (/\b(j'ai|j'ai géré|j'ai dirigé|j'ai créé|j'ai développé)\b/i.test(response)) score += 10;
  if (/\b(\d+|%|\d+%\d+)\b/.test(response)) score += 15;
  if (/\b(résultat|succès|amélioration|augmentation|réduction)\b/i.test(response)) score += 10;
  
  // Normalisation
  score = Math.max(0, Math.min(100, score));
  
  // Détermination de la qualité
  let quality: 'strong' | 'weak' | 'dangerous';
  
  if (score >= 70) {
    quality = 'strong';
  } else if (score >= 40) {
    quality = 'weak';
  } else {
    quality = 'dangerous';
  }
  
  return { quality, score };
}
```

---

## 6. Algorithme de Génération de Relance

### 6.1 Types de Relance

```typescript
interface FollowUpType {
  type: 'clarification' | 'example' | 'deepening' | 'challenge';
  template: string;
}

const followUpTemplates: Record<string, FollowUpType> = {
  clarification: {
    type: 'clarification',
    template: "Qu'entendez-vous par [mot clé] ?"
  },
  example: {
    type: 'example',
    template: "Pouvez-vous me donner un exemple concret d'une situation où vous avez [action] ?"
  },
  deepening: {
    type: 'deepening',
    template: "Comment avez-vous géré [aspect spécifique] dans cette situation ?"
  },
  challenge: {
    type: 'challenge',
    template: "Qu'avez-vous fait face à [obstacle] ?"
  }
};
```

### 6.2 Génération de Relance

```typescript
async function generateFollowUp(
  question: string,
  response: string,
  followUpType: 'clarification' | 'example' | 'deepening' | 'challenge'
): Promise<string> {
  const indicators = await detectWeakResponse(response, question);
  
  let followUp: string;
  
  if (followUpType === 'clarification') {
    // Extraction du mot clé vague
    const vagueWord = extractVagueWord(response);
    followUp = `Qu'entendez-vous par "${vagueWord}" ?`;
  } else if (followUpType === 'example') {
    // Extraction de l'action mentionnée
    const action = extractAction(question);
    followUp = `Pouvez-vous me donner un exemple concret d'une situation où vous avez ${action} ?`;
  } else if (followUpType === 'deepening') {
    // Extraction de l'aspect à approfondir
    const aspect = extractAspectToDeepen(response);
    followUp = `Comment avez-vous géré ${aspect} dans cette situation ?`;
  } else if (followUpType === 'challenge') {
    // Extraction de l'obstacle potentiel
    const obstacle = extractPotentialObstacle(response);
    followUp = `Qu'avez-vous fait face à ${obstacle} ?`;
  }
  
  return followUp;
}

function extractVagueWord(response: string): string {
  const vagueWords = ['quelque chose', 'un peu', 'plutôt', 'environ', 'en gros'];
  
  for (const word of vagueWords) {
    if (response.toLowerCase().includes(word)) {
      return word;
    }
  }
  
  return 'ce point';
}

function extractAction(question: string): string {
  // Extraction du verbe d'action de la question
  const actionMatch = question.match(/(avez-vous|pouvez-vous|parlez-moi de)\s+(\w+)/i);
  
  if (actionMatch) {
    return actionMatch[2];
  }
  
  return 'fait cela';
}

function extractAspectToDeepen(response: string): string {
  // Extraction d'un aspect potentiel à approfondir
  const aspects = ['la résistance', 'les difficultés', 'les obstacles', 'les défis', 'les conflits'];
  
  for (const aspect of aspects) {
    if (response.toLowerCase().includes(aspect)) {
      return aspect;
    }
  }
  
  return 'la situation';
}

function extractPotentialObstacle(response: string): string {
  // Extraction d'un obstacle potentiel
  const obstacles = ['les résistances', 'les difficultés', 'les contraintes', 'les limites', 'les défis'];
  
  for (const obstacle of obstacles) {
    if (response.toLowerCase().includes(obstacle)) {
      return obstacle;
    }
  }
  
  return 'les obstacles';
}
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface ExpertHRSimulator {
  simulatorId: string;
  simulationId: string;
  candidateId: string;
  jobId: string;
  
  personality: {
    tone: 'professional' | 'friendly' | 'formal';
    style: 'direct' | 'indirect' | 'balanced';
    challengeLevel: 'low' | 'medium' | 'high';
  };
  
  interviewFlow: {
    phase: 'introduction' | 'technical' | 'behavioral' | 'cultural_fit' | 'conclusion';
    questionId: string;
    question: string;
    response: string;
    responseQuality: 'strong' | 'weak' | 'dangerous';
    responseScore: number;
    followUp?: string;
    timestamp: Date;
  }[];
  
  state: {
    currentPhase: string;
    questionIndex: number;
    timeElapsed: number;
    timeRemaining: number;
  };
}

interface InterviewFlow {
  simulationId: string;
  candidateId: string;
  jobId: string;
  startedAt: Date;
  endedAt?: Date;
  
  phases: {
    phase: string;
    questions: {
      questionId: string;
      question: string;
      response: string;
      responseQuality: 'strong' | 'weak' | 'dangerous';
      responseScore: number;
      followUp?: string;
      timestamp: Date;
    }[];
  }[];
  
  currentPhase: string;
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE expert_hr_simulator (
  id VARCHAR(36) PRIMARY KEY,
  simulation_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  
  personality JSON NOT NULL,
  interview_flow JSON NOT NULL,
  state JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_simulator_simulation ON expert_hr_simulator(simulation_id);
```

---

## 9. API Endpoints

```typescript
// POST /api/expert-hr-simulator/start
async function startSimulation(candidateId: string, jobId: string, personality: ExpertHRSimulator['personality']): Promise<ExpertHRSimulator> {
  return await initializeSimulation(candidateId, jobId, personality);
}

// POST /api/expert-hr-simulator/:simulatorId/submit-response
async function submitResponse(simulatorId: string, response: string): Promise<{ followUp?: string; quality: string; score: number }> {
  return await processResponse(simulatorId, response);
}

// POST /api/expert-hr-simulator/:simulatorId/next-question
async function getNextQuestion(simulatorId: string): Promise<{ question: string; phase: string }> {
  return await generateNextQuestion(simulatorId);
}

// POST /api/expert-hr-simulator/:simulatorId/complete
async function completeSimulation(simulatorId: string): Promise<InterviewFlow> {
  return await finalizeSimulation(simulatorId);
}

// GET /api/expert-hr-simulator/:simulatorId
async function getSimulator(simulatorId: string): Promise<ExpertHRSimulator> {
  return await getSimulatorById(simulatorId);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection de réponses faibles | Réponses faibles détectées / total | ≥ 90% |
| Taux de relance pertinente | Relances pertinentes / total | ≥ 85% |
| Temps de réponse moyen | Temps moyen de génération de question | < 2 secondes |
| Satisfaction candidat | Satisfaction avec le DRH simulé | ≥ 4/5 |

### 10.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Simulations complétées / démarrées | ≥ 80% |
| Temps moyen de simulation | Durée moyenne d'une simulation | 30-45 minutes |
| Taux d'amélioration candidat | Amélioration entre simulations | ≥ 20% |

---

## 11. Conclusion

Le Moteur DRH Expert Simulé reproduit le comportement d'un DRH Expert réaliste qui conduit un entretien complet, pose des questions de qualité, challenge sans agresser, détecte les réponses faibles et relance de manière pertinente.

**Points clés :**
- Posture professionnelle et bienveillante
- Questions de qualité adaptées au poste
- Détection automatique des réponses faibles/dangereuses
- Relance automatique pour améliorer les réponses
- Gestion du temps et des phases de l'entretien
- Évaluation en temps réel de la qualité des réponses
- Adaptation au candidat et au poste
