# DOC-040-01 : Questionnaire Feedback Candidat

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le questionnaire de feedback candidat pour MVP-040 Candidate Feedback Loop. Ce document structure les 3 questions posées dans les 5 minutes après l'entretien pour mesurer l'expérience candidat, incluant le formulaire, le protocole d'envoi, et l'intégration avec les autres MVPs.

---

## 2. Principe Fondateur

Le moteur apprend des recruteurs et doit aussi apprendre des candidats. Les candidats sont les utilisateurs finaux de l'expérience. Leur perception est une donnée aussi précieuse que les résultats des recrutements. Le questionnaire immédiat post-entretien mesure exactement ce qui compte pour l'expérience candidat : écoute, pertinence des questions, et authenticité.

---

## 3. Questionnaire

### 3.1 Question 1 — Écoute

**Question :**
"Avez-vous eu l'impression d'être vraiment écouté ?"

**Échelle :**
1 = Pas du tout
2 = Un peu
3 = Moyennement
4 = Plutôt
5 = Tout à fait

**Ligne libre :**
"Expliquez votre réponse en une ligne (optionnel)"

**Ce que cela mesure :**
- Perception de l'écoute active (MVP-036)
- Qualité de la connexion humaine
- Respect du candidat

### 3.2 Question 2 — Pertinence

**Question :**
"Les questions posées vous ont-elles semblé pertinentes et professionnelles ?"

**Échelle :**
1 = Pas du tout
2 = Un peu
3 = Moyennement
4 = Plutôt
5 = Tout à fait

**Ligne libre :**
"Expliquez votre réponse en une ligne (optionnel)"

**Ce que cela mesure :**
- Qualité de la bibliothèque de questions
- Professionnalisme de l'entretien
- Pertinence par rapport au poste

### 3.3 Question 3 — Authenticité

**Question :**
"L'entretien vous a-t-il permis de montrer ce que vous êtes vraiment ?"

**Échelle :**
1 = Pas du tout
2 = Un peu
3 = Moyennement
4 = Plutôt
5 = Tout à fait

**Ligne libre :**
"Expliquez votre réponse en une ligne (optionnel)"

**Ce que cela mesure :**
- Efficacité de la gestion du stress (MVP-038)
- Efficacité du démasquage bienveillant (MVP-039)
- Capacité à être authentique

---

## 4. Protocole d'Envoi

### 4.1 Timing

**Moment d'envoi :**
- Dans les 5 minutes après la fin de l'entretien
- Immédiatement après la conclusion de l'entretien
- Avant que le candidat ne quitte l'environnement

**Pourquoi 5 minutes :**
- L'expérience est encore fraîche dans l'esprit du candidat
- Le candidat est encore disponible
- Le feedback est plus précis et honnête
- Taux de réponse plus élevé

### 4.2 Canal d'Envoi

**Canaux possibles :**
- Email (recommandé)
- SMS
- Notification dans l'application
- Lien dans le chat de l'entretien

**Recommandation :**
- Email pour les entretiens asynchrones
- Notification dans l'application pour les entretiens synchrones
- SMS comme rappel si pas de réponse dans 10 minutes

### 4.3 Email d'Envoi

**Objet :**
"Votre feedback sur notre entretien"

**Corps :**
```
Bonjour [Prénom],

Merci pour le temps que vous nous avez consacré aujourd'hui.

Votre avis est précieux pour nous améliorer notre processus.
Cela ne prendra que 2 minutes.

3 questions simples :
1. Avez-vous eu l'impression d'être vraiment écouté ?
   [1-5]

2. Les questions posées vous ont-elles semblé pertinentes et professionnelles ?
   [1-5]

3. L'entretien vous a-t-il permis de montrer ce que vous êtes vraiment ?
   [1-5]

Répondez ici : [Lien]

Merci encore pour votre intérêt pour [Entreprise].

Bien à vous,
[Persona DRH]
```

### 4.4 Rappels

**Rappel 1 (10 minutes après) :**
Si pas de réponse, envoyer un rappel par email ou notification.

**Rappel 2 (24 heures après) :**
Si toujours pas de réponse, dernier rappel.

**Arrêt :**
- Après 2 rappels
- Ne pas spammer le candidat
- Respecter la décision de ne pas répondre

---

## 5. Intégration avec les Autres MVPs

### 5.1 MVP-036 Active Listening Engine

**Si score < 3 sur "vraiment écouté" :**
- Revoir MVP-036 (Active Listening)
- Identifier la phase où l'écoute a été perçue comme insuffisante
- Ajuster la bibliothèque de signaux d'écoute
- Ajuster la fréquence des signaux d'écoute

**Actions :**
- Analyser l'entretien pour identifier les moments d'écoute insuffisante
- Former les recruteurs sur l'écoute active
- Ajuster les paramètres du moteur

### 5.2 Bibliothèque de Questions

**Si score < 3 sur "questions pertinentes" :**
- Revoir la bibliothèque de questions
- Identifier les questions mal perçues
- Ajuster ou remplacer les questions problématiques

**Actions :**
- Analyser les feedbacks pour identifier les questions problématiques
- Ajuster la bibliothèque de questions
- Former les recruteurs sur la formulation des questions

### 5.3 MVP-038 Stress Management Engine

**Si score < 3 sur "montrer ce qu'il est" :**
- Revoir MVP-038 (Stress Management)
- Identifier si l'entretien était trop stressant
- Ajuster les protocoles de désescalade

**Actions :**
- Analyser le niveau de stress détecté
- Vérifier si les protocoles de désescalade ont été appliqués
- Ajuster les paramètres du moteur

### 5.4 MVP-039 Benevolent Unmasking Engine

**Si score < 3 sur "montrer ce qu'il est" :**
- Revoir MVP-039 (Authenticity)
- Identifier si l'entretien était trop formel
- Ajuster les techniques de démasquage

**Actions :**
- Analyser le niveau de masque détecté
- Vérifier si les techniques de démasquage ont été appliquées
- Ajuster les paramètres du moteur

---

## 6. Structure de Données (TypeScript)

```typescript
interface CandidateFeedback {
  feedbackId: string;
  candidateId: string;
  interviewId: string;
  
  sentAt: Date;
  respondedAt?: Date;
  channel: 'email' | 'sms' | 'notification' | 'chat';
  
  question1: {
    rating: number;
    comment?: string;
  };
  
  question2: {
    rating: number;
    comment?: string;
  };
  
  question3: {
    rating: number;
    comment?: string;
  };
  
  overallRating: number;
  
  integration: {
    activeListeningIssue: boolean;
    questionQualityIssue: boolean;
    stressManagementIssue: boolean;
    authenticityIssue: boolean;
  };
  
  reminders: {
    reminder1SentAt?: Date;
    reminder2SentAt?: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FeedbackQuestionnaire {
  questionnaireId: string;
  
  questions: {
    question1: {
      text: string;
      scale: {
        min: number;
        max: number;
        labels: string[];
      };
      commentRequired: boolean;
      measures: string[];
    };
    question2: {
      text: string;
      scale: {
        min: number;
        max: number;
        labels: string[];
      };
      commentRequired: boolean;
      measures: string[];
    };
    question3: {
      text: string;
      scale: {
        min: number;
        max: number;
        labels: string[];
      };
      commentRequired: boolean;
      measures: string[];
    };
  };
  
  sendingProtocol: {
    timing: {
      minutesAfterInterview: number;
    };
    channels: string[];
    recommendedChannel: string;
  };
  
  emailTemplate: {
    subject: string;
    body: string;
  };
  
  reminders: {
    reminder1: {
      delay: string;
      channel: string;
    };
    reminder2: {
      delay: string;
      channel: string;
    };
    stopAfter: number;
  };
  
  integration: {
    mvp036: {
      threshold: number;
      action: string[];
    };
    questionLibrary: {
      threshold: number;
      action: string[];
    };
    mvp038: {
      threshold: number;
      action: string[];
    };
    mvp039: {
      threshold: number;
      action: string[];
    };
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE candidate_feedback (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  sent_at TIMESTAMP NOT NULL,
  responded_at TIMESTAMP,
  channel VARCHAR(20) NOT NULL,
  
  question1_rating INT NOT NULL,
  question1_comment TEXT,
  question2_rating INT NOT NULL,
  question2_comment TEXT,
  question3_rating INT NOT NULL,
  question3_comment TEXT,
  
  overall_rating INT NOT NULL,
  
  integration JSON NOT NULL,
  reminders JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_feedback_candidate ON candidate_feedback(candidate_id);
CREATE INDEX idx_candidate_feedback_interview ON candidate_feedback(interview_id);
CREATE INDEX idx_candidate_feedback_responded_at ON candidate_feedback(responded_at);

CREATE TABLE feedback_questionnaire (
  id VARCHAR(36) PRIMARY KEY,
  
  questions JSON NOT NULL,
  sending_protocol JSON NOT NULL,
  email_template JSON NOT NULL,
  reminders JSON NOT NULL,
  integration JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 8. API Endpoints

```typescript
// POST /api/candidate-feedback/send
async function sendCandidateFeedback(candidateId: string, interviewId: string, channel?: string): Promise<CandidateFeedback> {
  return await sendCandidateFeedback(candidateId, interviewId, channel);
}

// POST /api/candidate-feedback/submit
async function submitCandidateFeedback(feedbackId: string, responses: any): Promise<CandidateFeedback> {
  return await submitCandidateFeedback(feedbackId, responses);
}

// GET /api/candidate-feedback/:feedbackId
async function getCandidateFeedback(feedbackId: string): Promise<CandidateFeedback> {
  return await getCandidateFeedbackById(feedbackId);
}

// GET /api/candidate-feedback/candidate/:candidateId
async function getCandidateFeedbackByCandidate(candidateId: string): Promise<CandidateFeedback[]> {
  return await getCandidateFeedbackByCandidate(candidateId);
}

// GET /api/candidate-feedback/interview/:interviewId
async function getCandidateFeedbackByInterview(interviewId: string): Promise<CandidateFeedback> {
  return await getCandidateFeedbackByInterview(interviewId);
}

// POST /api/candidate-feedback/:feedbackId/remind
async function sendReminder(feedbackId: string, reminderNumber: number): Promise<CandidateFeedback> {
  return await sendReminder(feedbackId, reminderNumber);
}

// GET /api/candidate-feedback/questionnaire
async function getFeedbackQuestionnaire(): Promise<FeedbackQuestionnaire> {
  return await getFeedbackQuestionnaire();
}

// PUT /api/candidate-feedback/questionnaire
async function updateFeedbackQuestionnaire(questionnaire: FeedbackQuestionnaire): Promise<FeedbackQuestionnaire> {
  return await updateFeedbackQuestionnaire(questionnaire);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques d'Envoi

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'envoi | Envois / entretiens terminés | 100% |
- Taux de réponse | Réponses / envois | ≥ 80% |
- Délai moyen de réponse | Temps moyen avant réponse | ≤ 10 minutes |

### 9.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Note moyenne "vraiment écouté" | Moyenne Q1 | ≥ 4.0/5 |
- Note moyenne "questions pertinentes" | Moyenne Q2 | ≥ 4.0/5 |
- Note moyenne "montrer ce qu'il est" | Moyenne Q3 | ≥ 4.0/5 |
- Note moyenne globale | Moyenne Q1+Q2+Q3 | ≥ 4.0/5 |

---

## 10. Conclusion

Le questionnaire de feedback candidat structure les 3 questions posées dans les 5 minutes après l'entretien pour mesurer l'expérience candidat. Question 1 mesure la perception de l'écoute (MVP-036), Question 2 mesure la pertinence des questions, et Question 3 mesure l'authenticité (MVP-038 et MVP-039). Le questionnaire est envoyé par email ou notification, avec des rappels si nécessaire. Les feedbacks sont analysés et intégrés avec les autres MVPs pour améliorer continuellement l'expérience candidat.

**Points clés :**
- 3 questions (écoute, pertinence, authenticité)
- Échelle 1-5 + ligne libre pour chaque question
- Envoi dans les 5 minutes après l'entretien
- Canaux : email, SMS, notification, chat
- Rappels à 10 minutes et 24 heures
- Intégration avec MVP-036 (Active Listening)
- Intégration avec la bibliothèque de questions
- Intégration avec MVP-038 (Stress Management)
- Intégration avec MVP-039 (Authenticity)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'envoi et de qualité
