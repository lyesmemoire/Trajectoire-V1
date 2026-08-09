# DOC-037-04 : Enquête de Satisfaction Candidat (Template)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template d'enquête de satisfaction candidat pour MVP-037 Candidate Experience Engine. Ce document structure l'enquête envoyée 24h après la décision, incluant les questions, l'échelle de notation, le protocole d'envoi, et l'analyse des données pour alimenter l'amélioration continue.

---

## 2. Principe Fondateur

L'enquête de satisfaction candidat est envoyée 24h après la décision. Elle est courte (2 minutes), simple, et ciblée. Les données collectées alimentent MVP-026 (Employer Brand Intelligence), MVP-029 (Institutional Memory), et l'amélioration continue du moteur. L'enquête mesure la perception de l'évaluation, la qualité de l'expérience, et la recommandation (NPS).

---

## 3. Template d'Enquête

### 3.1 Email d'Envoi

**Template :**
```
Bonjour [Prénom],

J'espère que vous allez bien.

Afin d'améliorer notre processus de recrutement, nous aimerions avoir votre retour sur votre expérience.

Cette enquête ne prend que 2 minutes :

[Lien vers l'enquête]

Merci pour votre temps et votre feedback.

Bien à vous,
[Persona DRH]
[Poste]
[Entreprise]
```

### 3.2 Questions de l'Enquête

**Question 1 — Perception de l'Évaluation**
```
Avez-vous senti que votre profil a été vraiment évalué ?

Échelle : 1 à 5
1 = Pas du tout
2 = Un peu
3 = Moyennement
4 = Plutôt
5 = Tout à fait
```

**Question 2 — Qualité de l'Expérience**
```
L'entretien vous a-t-il semblé professionnel et bienveillant ?

Échelle : 1 à 5
1 = Pas du tout
2 = Un peu
3 = Moyennement
4 = Plutôt
5 = Tout à fait
```

**Question 3 — Recommandation (NPS)**
```
Recommanderiez-vous ce processus à un pair ?

Échelle : 0 à 10
0 = Pas du tout probable
10 = Extrêmement probable
```

**Question 4 — Mot Libre**
```
Un mot pour décrire votre expérience ?

[Champ texte libre]
```

---

## 4. Protocole d'Envoi

### 4.1 Timing

**Envoi :**
- 24h après la décision (retenu ou refusé)
- Heure optimale : 10h-12h ou 14h-16h (jours ouvrés)
- Éviter les week-ends et jours fériés

**Rappel :**
- 1 rappel 48h après l'envoi initial (si pas de réponse)
- Maximum 2 envois (initial + rappel)

### 4.2 Canal

**Canal principal :**
- Email avec lien vers l'enquête en ligne
- Lien direct (pas de connexion requise)
- Mobile-friendly

**Canal alternatif :**
- SMS (si consentement préalable)
- Lien court pour facilité d'accès

### 4.3 Personnalisation

**Éléments personnalisés :**
- Nom du candidat
- Nom du DRH
- Intitulé du poste
- Date de l'entretien
- Persona DRH

---

## 5. Protocole d'Analyse

### 5.1 Calcul du NPS

**Formule :**
```
NPS = % Promoteurs - % Détracteurs

Promoteurs : Notes 9-10
Passifs : Notes 7-8
Détracteurs : Notes 0-6
```

**Interprétation :**
- NPS ≥ 50 : Excellent
- NPS 30-49 : Bon
- NPS 10-29 : Moyen
- NPS < 10 : Faible
- NPS < 0 : Critique

### 5.2 Analyse des Questions 1 et 2

**Moyenne :**
- Calcul de la moyenne pour chaque question
- Comparaison par persona
- Comparaison par stade du processus

**Distribution :**
- Distribution des notes (1-5)
- Identification des outliers
- Analyse des tendances

### 5.3 Analyse du Mot Libre

**Thématisation :**
- Analyse des mots-clés
- Identification des thèmes positifs
- Identification des thèmes négatifs
- Classification par sentiment

**Nuage de mots :**
- Visualisation des mots les plus fréquents
- Identification des tendances
- Suivi de l'évolution dans le temps

---

## 6. Intégration avec les Autres MVPs

### 6.1 MVP-026 — Employer Brand Intelligence

**Données transmises :**
- NPS candidat
- Moyenne de perception de l'évaluation
- Moyenne de qualité de l'expérience
- Thèmes du mot libre

**Utilisation :**
- Mesure de la marque employeur
- Comparaison avec les benchmarks
- Identification des points d'amélioration
- Communication interne et externe

### 6.2 MVP-029 — Institutional Memory

**Données transmises :**
- Historique des NPS
- Historique des moyennes
- Historique des thèmes
- Évolution dans le temps

**Utilisation :**
- Apprentissage institutionnel
- Identification des patterns
- Amélioration continue
- Documentation des meilleures pratiques

### 6.3 Amélioration Continue du Moteur

**Données utilisées :**
- NPS par persona
- Moyennes par stade du processus
- Thèmes par situation
- Feedback spécifique

**Actions :**
- Ajustement des templates d'emails
- Ajustement des scripts d'appels
- Ajustement des guides de feedback
- Ajustement des protocoles de communication

---

## 7. Structure de Données (TypeScript)

```typescript
interface SatisfactionSurvey {
  surveyId: string;
  candidateId: string;
  jobId: string;
  
  sentAt: Date;
  respondedAt?: Date;
  
  questions: {
    evaluationPerception: {
      question: string;
      answer: number;
      scale: 1 | 2 | 3 | 4 | 5;
    };
    experienceQuality: {
      question: string;
      answer: number;
      scale: 1 | 2 | 3 | 4 | 5;
    };
    recommendation: {
      question: string;
      answer: number;
      scale: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    };
    freeWord: {
      question: string;
      answer: string;
    };
  };
  
  calculatedMetrics: {
    nps: number;
    npsCategory: 'excellent' | 'good' | 'average' | 'low' | 'critical';
    evaluationPerceptionMean: number;
    experienceQualityMean: number;
  };
  
  persona: string;
  processStage: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface SurveyTemplate {
  templateId: string;
  
  emailTemplate: {
    subject: string;
    body: string;
    variables: string[];
  };
  
  questions: {
    evaluationPerception: {
      question: string;
      scale: number[];
      labels: Record<number, string>;
    };
    experienceQuality: {
      question: string;
      scale: number[];
      labels: Record<number, string>;
    };
    recommendation: {
      question: string;
      scale: number[];
      labels: Record<number, string>;
    };
    freeWord: {
      question: string;
      maxLength: number;
    };
  };
  
  sendingProtocol: {
    timing: {
      hoursAfterDecision: number;
      optimalHours: number[];
      avoidDays: string[];
    };
    reminder: {
      enabled: boolean;
      hoursAfterFirst: number;
      maxSends: number;
    };
    channel: {
      primary: string;
      alternative: string;
    };
    personalization: {
      elements: string[];
    };
  };
  
  analysisProtocol: {
    nps: {
      formula: string;
      interpretation: Record<string, string>;
    };
    questions12: {
      mean: boolean;
      distribution: boolean;
      comparison: string[];
    };
    freeWord: {
      thematization: boolean;
      wordCloud: boolean;
      sentimentAnalysis: boolean;
    };
  };
  
  integration: {
    mvp026: {
      dataTransmitted: string[];
      usage: string[];
    };
    mvp029: {
      dataTransmitted: string[];
      usage: string[];
    };
    continuousImprovement: {
      dataUsed: string[];
      actions: string[];
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

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE satisfaction_survey (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  
  sent_at TIMESTAMP NOT NULL,
  responded_at TIMESTAMP,
  
  evaluation_perception INT NOT NULL,
  experience_quality INT NOT NULL,
  recommendation INT NOT NULL,
  free_word TEXT,
  
  nps INT,
  nps_category VARCHAR(20),
  
  persona VARCHAR(50),
  process_stage VARCHAR(50),
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_satisfaction_survey_candidate ON satisfaction_survey(candidate_id);
CREATE INDEX idx_satisfaction_survey_job ON satisfaction_survey(job_id);
CREATE INDEX idx_satisfaction_survey_sent_at ON satisfaction_survey(sent_at);

CREATE TABLE survey_template (
  id VARCHAR(36) PRIMARY KEY,
  
  email_template JSON NOT NULL,
  questions JSON NOT NULL,
  sending_protocol JSON NOT NULL,
  analysis_protocol JSON NOT NULL,
  integration JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 9. API Endpoints

```typescript
// POST /api/candidate-experience/survey/send
async function sendSurvey(candidateId: string, decision: string): Promise<void> {
  return await sendSurvey(candidateId, decision);
}

// POST /api/candidate-experience/survey/respond
async function respondToSurvey(surveyId: string, responses: any): Promise<SatisfactionSurvey> {
  return await respondToSurvey(surveyId, responses);
}

// GET /api/candidate-experience/surveys
async function getSurveys(filters?: any): Promise<SatisfactionSurvey[]> {
  return await getSurveys(filters);
}

// GET /api/candidate-experience/survey/:surveyId
async function getSurvey(surveyId: string): Promise<SatisfactionSurvey> {
  return await getSurveyById(surveyId);
}

// GET /api/candidate-experience/survey/analytics
async function getSurveyAnalytics(filters?: any): Promise<any> {
  return await getSurveyAnalytics(filters);
}

// GET /api/candidate-experience/survey-template
async function getSurveyTemplate(): Promise<SurveyTemplate> {
  return await getSurveyTemplate();
}

// PUT /api/candidate-experience/survey-template
async function updateSurveyTemplate(template: SurveyTemplate): Promise<SurveyTemplate> {
  return await updateSurveyTemplate(template);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques d'Envoi

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'envoi | Enquêtes envoyées / décisions | 100% |
- Taux de réponse | Réponses / envoyées | ≥ 40% |
- Temps moyen de réponse | Heures après envoi | ≤ 48 heures |

### 10.2 Métriques de Satisfaction

| Métrique | Description | Cible |
|----------|-------------|-------|
- NPS candidat | Note NPS moyenne | ≥ 50 |
- Perception de l'évaluation | Note moyenne | ≥ 4.0/5 |
- Qualité de l'expérience | Note moyenne | ≥ 4.0/5 |
- Taux de recommandation | Promoteurs / total | ≥ 60% |

---

## 11. Conclusion

L'enquête de satisfaction candidat est envoyée 24h après la décision. Elle est courte (2 minutes), simple, et ciblée avec 3 questions (perception de l'évaluation, qualité de l'expérience, recommandation NPS) et 1 question ouverte (mot libre). Les données collectées alimentent MVP-026 (Employer Brand Intelligence), MVP-029 (Institutional Memory), et l'amélioration continue du moteur.

**Points clés :**
- Enquête courte (2 minutes) envoyée 24h après la décision
- 3 questions (perception de l'évaluation, qualité de l'expérience, recommandation NPS)
- 1 question ouverte (mot libre)
- Protocole d'envoi (timing, canal, personnalisation)
- Protocole d'analyse (NPS, moyenne, distribution, thématisation)
- Intégration avec MVP-026 et MVP-029
- Amélioration continue du moteur
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'envoi et de satisfaction
