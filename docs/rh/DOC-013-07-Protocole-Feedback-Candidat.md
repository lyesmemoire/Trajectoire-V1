# DOC-013-07 : Protocole Feedback Candidat

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de feedback candidat pour MVP-013 Interview Intelligence. Ce protocole définit comment fournir un feedback constructif et personnalisé aux candidats après l'entretien, en respectant les meilleures pratiques de l'expérience candidat.

---

## 2. Principe Fondateur

Le feedback candidat n'est pas une obligation légale mais une marque d'excellence. Un feedback constructif et personnalisé améliore l'expérience candidat, renforce la marque employeur, et permet aux candidats de progresser.

---

## 3. Principes du Feedback

### 3.1 Principes Fondamentaux

| Principe | Description |
|----------|-------------|
| Constructif | Le feedback doit être utile et permettre au candidat de progresser |
| Personnalisé | Le feedback doit être spécifique au candidat et à l'entretien |
| Équilibré | Le feedback doit inclure des points forts et des axes d'amélioration |
| Honnête | Le feedback doit être honnête mais diplomate |
| Timely | Le feedback doit être fourni dans un délai raisonnable (48h) |
| Confidential | Le feedback doit être confidentiel et partagé uniquement avec le candidat |

### 3.2 Ce que le Feedback Doit Contenir

- **Résumé de l'entretien** : Contexte et durée
- **Points forts** : Ce que le candidat a bien fait
- **Axes d'amélioration** : Ce que le candidat peut améliorer
- **Décision** : Acceptation ou refus (si applicable)
- **Justification** : Raison de la décision (si applicable)
- **Recommandations** : Conseils pour les futurs entretiens

---

## 4. Structure du Feedback

### 4.1 Template de Feedback

```
┌─────────────────────────────────────────┐
│ FEEDBACK CANDIDAT                      │
├─────────────────────────────────────────┤
│                                         │
| Candidat : [Nom]                        │
| Poste : [Titre]                        │
| Date entretien : [DD/MM/YYYY]          │
| Date feedback : [DD/MM/YYYY]          │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RÉSUMÉ DE L'ENTRETIEN                 │
├─────────────────────────────────────────┤
│                                         │
| Nous avons apprécié notre échange du    │
| [DD/MM/YYYY] pour le poste de [Titre].│
|                                         │
| Durée de l'entretien : [MM:SS]         │
|                                         │
| Nous tenions à vous remercier pour     │
| votre intérêt pour [Entreprise] et      │
| pour le temps que vous nous avez        │
| consacré.                               │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ POINTS FORTS                           │
├─────────────────────────────────────────┤
│                                         │
| Compétences techniques :               │
| • [Point fort 1]                       │
| • [Point fort 2]                       │
│                                         │
| Expérience :                           │
| • [Point fort 1]                       │
| • [Point fort 2]                       │
│                                         │
| Comportement :                         │
| • [Point fort 1]                       │
| • [Point fort 2]                       │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ AXES D'AMÉLIORATION                    │
├─────────────────────────────────────────┤
│                                         │
| Compétences techniques :               │
| • [Axe d'amélioration 1]               │
| • [Axe d'amélioration 2]               │
│                                         │
| Expérience :                           │
| • [Axe d'amélioration 1]               │
| • [Axe d'amélioration 2]               │
│                                         │
| Comportement :                         │
| • [Axe d'amélioration 1]               │
| • [Axe d'amélioration 2]               │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ DÉCISION                               │
├─────────────────────────────────────────┤
│                                         │
| ○ Nous sommes ravis de vous proposer  │
|   une offre pour ce poste.             │
│                                         │
| ○ Nous ne pouvons pas vous proposer   │
|   une offre pour ce poste à ce stade.  │
│                                         │
| ○ Nous poursuivons notre processus    │
|   de recrutement et vous recontacterons│
|   dans les prochains jours.            │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ JUSTIFICATION (si applicable)          │
├─────────────────────────────────────────┤
│                                         │
| [Justification de la décision]         │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RECOMMANDATIONS POUR VOS FUTURS        │
│ ENTRETIENS                              │
├─────────────────────────────────────────┤
│                                         │
| • [Recommandation 1]                   │
| • [Recommandation 2]                   │
| • [Recommandation 3]                   │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ CONCLUSION                              │
├─────────────────────────────────────────┤
│                                         │
| Nous vous souhaitons beaucoup de succès│
| dans votre recherche et espérons avoir │
| l'occasion de vous recontacter à       │
| l'avenir.                              │
│                                         │
| Cordialement,                           │
│                                         │
| [Nom du recruteur]                     │
| [Titre]                                │
│ [Entreprise]                           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CandidateFeedback {
  feedbackId: string;
  interviewId: string;
  candidateId: string;
  jobId: string;
  recruiterId: string;
  interviewDate: Date;
  feedbackDate: Date;
  
  interviewSummary: string;
  
  strengths: {
    technical: string[];
    experience: string[];
    behavioral: string[];
  };
  
  improvementAreas: {
    technical: string[];
    experience: string[];
    behavioral: string[];
  };
  
  decision: {
    type: 'offer' | 'rejection' | 'ongoing';
    justification?: string;
  };
  
  recommendations: string[];
  
  conclusion: string;
  
  status: 'draft' | 'sent' | 'acknowledged';
  sentAt?: Date;
  acknowledgedAt?: Date;
}
```

---

## 6. Génération Automatique du Feedback

### 6.1 Processus de Génération

```typescript
async function generateCandidateFeedback(interviewId: string, recruiterId: string): Promise<CandidateFeedback> {
  // Étape 1 : Récupération de la synthèse de l'entretien
  const summary = await getInterviewSummary(interviewId);
  
  // Étape 2 : Génération du résumé de l'entretien
  const interviewSummary = await generateInterviewSummaryText(summary);
  
  // Étape 3 : Extraction des points forts
  const strengths = await extractStrengthsFromSummary(summary);
  
  // Étape 4 : Extraction des axes d'amélioration
  const improvementAreas = await extractImprovementAreasFromSummary(summary);
  
  // Étape 5 : Détermination de la décision
  const decision = await determineDecision(summary);
  
  // Étape 6 : Génération des recommandations
  const recommendations = await generateRecommendations(summary);
  
  // Étape 7 : Génération de la conclusion
  const conclusion = await generateConclusion(decision);
  
  // Construction du feedback
  const feedback: CandidateFeedback = {
    feedbackId: generateFeedbackId(),
    interviewId,
    candidateId: summary.candidateId,
    jobId: summary.jobId,
    recruiterId,
    interviewDate: summary.interviewDate,
    feedbackDate: new Date(),
    
    interviewSummary,
    strengths,
    improvementAreas,
    decision,
    recommendations,
    conclusion,
    
    status: 'draft'
  };
  
  // Sauvegarde du feedback
  await saveFeedback(feedback);
  
  return feedback;
}
```

### 6.2 Génération du Résumé de l'Entretien

```typescript
async function generateInterviewSummaryText(summary: InterviewSummary): Promise<string> {
  return `Nous avons apprécié notre échange du ${formatDate(summary.interviewDate)} pour le poste de ${summary.jobTitle}. Durée de l'entretien : ${formatDuration(summary.duration)}. Nous tenions à vous remercier pour votre intérêt pour ${summary.companyName} et pour le temps que vous nous avez consacré.`;
}
```

### 6.3 Extraction des Points Forts

```typescript
async function extractStrengthsFromSummary(summary: InterviewSummary): Promise<CandidateFeedback['strengths']> {
  return {
    technical: summary.strengths.technical,
    experience: summary.strengths.experience,
    behavioral: summary.strengths.behavioral
  };
}
```

### 6.4 Extraction des Axes d'Amélioration

```typescript
async function extractImprovementAreasFromSummary(summary: InterviewSummary): Promise<CandidateFeedback['improvementAreas']> {
  return {
    technical: summary.weaknesses.technical,
    experience: summary.weaknesses.experience,
    behavioral: summary.weaknesses.behavioral
  };
}
```

### 6.5 Détermination de la Décision

```typescript
async function determineDecision(summary: InterviewSummary): Promise<CandidateFeedback['decision']> {
  const decision = summary.finalRecommendation.decision;
  
  let justification: string | undefined;
  
  if (decision === 'not_recommend') {
    justification = summary.finalRecommendation.justification;
  }
  
  return {
    type: decision === 'strong_recommend' ? 'offer' : decision === 'moderate_recommend' ? 'ongoing' : 'rejection',
    justification
  };
}
```

### 6.6 Génération des Recommandations

```typescript
async function generateRecommendations(summary: InterviewSummary): Promise<string[]> {
  const recommendations: string[] = [];
  
  // Recommandations basées sur les points faibles
  for (const weakness of summary.weaknesses.technical) {
    if (weakness.includes('vague')) {
      recommendations.push('Pour vos futurs entretiens, n\'hésitez pas à donner des exemples concrets et chiffrés de vos réalisations.');
    }
    if (weakness.includes('structure')) {
      recommendations.push('Structurez vos réponses en utilisant la méthode STAR (Situation, Tâche, Action, Résultat) pour plus de clarté.');
    }
  }
  
  for (const weakness of summary.weaknesses.behavioral) {
    if (weakness.includes('communication')) {
      recommendations.push('Travaillez votre communication en vous entraînant à synthétiser vos réponses.');
    }
    if (weakness.includes('équipe')) {
      recommendations.push('Mettez en avant vos expériences de collaboration et de travail en équipe.');
    }
  }
  
  // Recommandations génériques
  recommendations.push('Préparez-vous en recherchant des informations sur l\'entreprise et le poste.');
  recommendations.push('Préparez des questions pertinentes à poser en fin d\'entretien.');
  
  return recommendations.slice(0, 3);
}
```

### 6.7 Génération de la Conclusion

```typescript
async function generateConclusion(decision: CandidateFeedback['decision']): Promise<string> {
  if (decision.type === 'offer') {
    return 'Nous sommes ravis de vous proposer une offre pour ce poste. Notre équipe vous contactera très prochainement pour les détails.';
  } else if (decision.type === 'ongoing') {
    return 'Nous poursuivons notre processus de recrutement et vous recontacterons dans les prochains jours.';
  } else {
    return 'Nous vous souhaitons beaucoup de succès dans votre recherche et espérons avoir l\'occasion de vous recontacter à l\'avenir.';
  }
}
```

---

## 7. Personnalisation du Feedback

### 7.1 Options de Personnalisation

| Option | Description | Défaut |
|--------|-------------|--------|
| Ton | Formel / Semi-formel | Formel |
| Niveau de détail | Concis / Détaillé | Détaillé |
| Inclusion de la décision | Oui / Non | Oui |
| Inclusion de la justification | Oui / Non | Oui (si rejet) |
| Recommandations | Oui / Non | Oui |

### 7.2 Processus de Personnalisation

```typescript
async function customizeFeedback(feedbackId: string, options: FeedbackCustomizationOptions): Promise<CandidateFeedback> {
  const feedback = await getFeedback(feedbackId);
  
  // Personnalisation du ton
  if (options.tone === 'semi_formal') {
    feedback.interviewSummary = makeSemiFormal(feedback.interviewSummary);
    feedback.conclusion = makeSemiFormal(feedback.conclusion);
  }
  
  // Personnalisation du niveau de détail
  if (options.detailLevel === 'concise') {
    feedback.strengths = {
      technical: feedback.strengths.technical.slice(0, 1),
      experience: feedback.strengths.experience.slice(0, 1),
      behavioral: feedback.strengths.behavioral.slice(0, 1)
    };
    feedback.improvementAreas = {
      technical: feedback.improvementAreas.technical.slice(0, 1),
      experience: feedback.improvementAreas.experience.slice(0, 1),
      behavioral: feedback.improvementAreas.behavioral.slice(0, 1)
    };
  }
  
  // Personnalisation de la décision
  if (!options.includeDecision) {
    feedback.decision = {
      type: 'ongoing',
      justification: undefined
    };
  }
  
  // Personnalisation de la justification
  if (!options.includeJustification) {
    feedback.decision.justification = undefined;
  }
  
  // Personnalisation des recommandations
  if (!options.includeRecommendations) {
    feedback.recommendations = [];
  }
  
  // Sauvegarde du feedback personnalisé
  await saveFeedback(feedback);
  
  return feedback;
}
```

---

## 8. Envoi du Feedback

### 8.1 Processus d'Envoi

```typescript
async function sendFeedback(feedbackId: string, channel: 'email' | 'portal'): Promise<void> {
  const feedback = await getFeedback(feedbackId);
  
  if (channel === 'email') {
    await sendFeedbackByEmail(feedback);
  } else if (channel === 'portal') {
    await sendFeedbackToPortal(feedback);
  }
  
  // Mise à jour du statut
  feedback.status = 'sent';
  feedback.sentAt = new Date();
  
  await saveFeedback(feedback);
}
```

### 8.2 Email de Feedback

**Objet :** Feedback suite à votre entretien pour le poste de [Titre]

**Corps :**

```
Bonjour [Nom du candidat],

Nous avons apprécié notre échange du [DD/MM/YYYY] pour le poste de [Titre].
Durée de l'entretien : [MM:SS]

Nous tenions à vous remercier pour votre intérêt pour [Entreprise] et pour le temps que vous nous avez consacré.

POINTS FORTS

Compétences techniques :
• [Point fort 1]
• [Point fort 2]

Expérience :
• [Point fort 1]
• [Point fort 2]

Comportement :
• [Point fort 1]
• [Point fort 2]

AXES D'AMÉLIORATION

Compétences techniques :
• [Axe d'amélioration 1]
• [Axe d'amélioration 2]

Expérience :
• [Axe d'amélioration 1]
• [Axe d'amélioration 2]

Comportement :
• [Axe d'amélioration 1]
• [Axe d'amélioration 2]

DÉCISION

[Decision]

[Justification si applicable]

RECOMMANDATIONS POUR VOS FUTURS ENTRETIENS

• [Recommandation 1]
• [Recommandation 2]
• [Recommandation 3]

Nous vous souhaitons beaucoup de succès dans votre recherche et espérons avoir l'occasion de vous recontacter à l'avenir.

Cordialement,

[Nom du recruteur]
[Titre]
[Entreprise]
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE candidate_feedback (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) UNIQUE NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  interview_date TIMESTAMP NOT NULL,
  feedback_date TIMESTAMP NOT NULL,
  
  interview_summary TEXT NOT NULL,
  strengths JSON NOT NULL,
  improvement_areas JSON NOT NULL,
  decision JSON NOT NULL,
  recommendations JSON NOT NULL,
  conclusion TEXT NOT NULL,
  
  status VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP,
  acknowledged_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview_copilot(id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id)
);

CREATE INDEX idx_feedback_interview ON candidate_feedback(interview_id);
CREATE INDEX idx_feedback_candidate ON candidate_feedback(candidate_id);
CREATE INDEX idx_feedback_status ON candidate_feedback(status);
```

---

## 10. API Endpoints

```typescript
// POST /api/candidate-feedback
async function generateFeedback(interviewId: string, recruiterId: string): Promise<CandidateFeedback> {
  return await generateCandidateFeedback(interviewId, recruiterId);
}

// GET /api/candidate-feedback/:id
async function getFeedback(id: string): Promise<CandidateFeedback> {
  return await getFeedbackById(id);
}

// GET /api/candidate-feedback/interview/:interviewId
async function getFeedbackByInterview(interviewId: string): Promise<CandidateFeedback> {
  return await getFeedbackByInterviewId(interviewId);
}

// PUT /api/candidate-feedback/:id
async function updateFeedback(id: string, feedback: Partial<CandidateFeedback>): Promise<CandidateFeedback> {
  return await modifyFeedback(id, feedback);
}

// POST /api/candidate-feedback/:id/customize
async function customizeFeedback(id: string, options: FeedbackCustomizationOptions): Promise<CandidateFeedback> {
  return await customizeFeedback(id, options);
}

// POST /api/candidate-feedback/:id/send
async function sendFeedback(id: string, channel: 'email' | 'portal'): Promise<void> {
  return await sendFeedback(id, channel);
}

// POST /api/candidate-feedback/:id/acknowledge
async function acknowledgeFeedback(id: string): Promise<void> {
  return await markAsAcknowledged(id);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Feedbacks générés / entretiens terminés | 100% |
| Taux d'envoi | Feedbacks envoyés / générés | ≥ 90% |
| Taux d'acknowledgment | Feedbacks acknowledgés / envoyés | ≥ 70% |
| Satisfaction candidat | Satisfaction avec le feedback | ≥ 4/5 |

### 11.2 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Temps de génération | Temps moyen de génération | < 1 minute |
| Délai d'envoi | Délai moyen entre entretien et envoi | < 48h |
| Taux de personnalisation | Feedbacks personnalisés / total | ≥ 50% |

---

## 12. Bonnes Pratiques

### 12.1 À Faire

- **Être constructif** : Le feedback doit aider le candidat à progresser
- **Être spécifique** : Donner des exemples concrets
- **Être équilibré** : Inclure des points forts et des axes d'amélioration
- **Être honnête** : Dire la vérité avec diplomatie
- **Être timely** : Envoyer le feedback dans les 48h
- **Respecter la confidentialité** : Ne partager qu'avec le candidat

### 12.2 À Éviter

- **Être vague** : Ne pas donner de feedback générique
- **Être négatif** : Ne pas se concentrer uniquement sur les points faibles
- **Être injuste** : Ne pas critiquer sans preuve
- **Être en retard** : Ne pas attendre trop longtemps pour envoyer
- **Violer la confidentialité** : Ne pas partager avec d'autres personnes

---

## 13. Conclusion

Le protocole de feedback candidat définit comment fournir un feedback constructif et personnalisé aux candidats après l'entretien. Un feedback de qualité améliore l'expérience candidat, renforce la marque employeur, et permet aux candidats de progresser.

**Points clés :**
- Principes fondamentaux (constructif, personnalisé, équilibré, honnête, timely, confidentiel)
- Structure du feedback (résumé, points forts, axes d'amélioration, décision, justification, recommandations, conclusion)
- Génération automatique basée sur la synthèse de l'entretien
- Options de personnalisation (ton, niveau de détail, inclusion décision/justification/recommandations)
- Envoi par email ou portail candidat
- Bonnes pratiques à suivre et à éviter
