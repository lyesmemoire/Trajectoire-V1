# DOC-C4-03 : Algorithme de Décision Pression / Relâchement

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'algorithme de décision pression / relâchement pour le Correctif 4 Pressure Management. Ce document structure le processus de décision en 4 questions clés pour déterminer quand maintenir la pression et quand la réduire.

---

## 2. Principe Fondateur

La décision de maintenir ou réduire la pression n'est pas aléatoire. Elle repose sur un algorithme de 4 questions clés qui évaluent la criticité de la compétence, l'évitement du candidat, l'origine de la difficulté, et l'obtention de l'information nécessaire.

---

## 3. Algorithme de Décision

### 3.1 Question 1 — Criticité de la Compétence

**Question :**
Cette compétence est-elle critique pour le poste ?

**Réponse :**
- OUI → Maintenir la pression
- NON → Réduire ou passer

**Évaluation :**
- Compétence critique : essentielle pour le poste, impact direct sur la performance
- Compétence non critique : secondaire, accessoire, peut être développée

**Exemples :**

**Compétence critique :**
- DRH : procédure de licenciement protégé
- Juridique : analyse de contrat
- RH Senior : gestion de conflit

**Compétence non critique :**
- DRH : connaissance d'un outil spécifique
- Juridique : connaissance d'une jurisprudence mineure
- RH Senior : expérience sur un type de contrat rare

### 3.2 Question 2 — Évitement de la Question

**Question :**
Le candidat évite-t-il la question ?

**Réponse :**
- OUI → Maintenir et insister
- NON → Évaluer la qualité de la réponse

**Évaluation :**
- Évitement : changement de sujet, réponse tangentielle, réponse sur autre sujet
- Non-évitement : réponse directe, même si incomplète

**Signaux d'évitement :**
- Changement de sujet
- Réponse tangentielle
- Évitement direct
- Réponse sur autre sujet
- Réponse générique sur point spécifique

**Signaux de non-évitement :**
- Réponse directe
- Tentative de réponse
- Admission de ne pas savoir
- Demande de clarification

### 3.3 Question 3 — Origine de la Difficulté

**Question :**
La difficulté vient-elle du stress de contexte ou du manque de compétence ?

**Réponse :**
- Stress de contexte → Réduire
- Manque de compétence → Maintenir

**Évaluation :**
- Stress de contexte : stress visible sur TOUTES les questions, même faciles
- Manque de compétence : difficulté ciblée sur une question spécifique

**Signaux de stress de contexte :**
- Stress sur toutes les questions
- Tremblement, bégaiement constant
- Anxiété généralisée
- Difficulté même sur questions simples

**Signaux de manque de compétence :**
- Difficulté ciblée sur une question
- Hésitation sur point spécifique
- Réponse incomplète sur sujet précis
- Évitement sur point critique

### 3.4 Question 4 — Obtention de l'Information

**Question :**
A-t-on obtenu l'information nécessaire ?

**Réponse :**
- OUI → Relâcher et passer
- NON → Maintenir

**Évaluation :**
- Information obtenue : réponse précise et complète
- Information non obtenue : réponse vague ou incomplète

**Critères d'information obtenue :**
- Réponse précise
- Réponse complète
- Réponse avec exemples concrets
- Réponse avec détails spécifiques

**Critères d'information non obtenue :**
- Réponse vague
- Réponse incomplète
- Réponse générique
- Réponse sans exemples

---

## 4. Arbre de Décision

### 4.1 Structure de l'Arbre

```
DÉBUT
  │
  ├─ Question 1 : Compétence critique ?
  │   │
  │   ├─ OUI → Question 2 : Évitement ?
  │   │   │
  │   │   ├─ OUI → Maintenir et insister
  │   │   │
  │   │   └─ NON → Question 3 : Origine difficulté ?
  │   │       │
  │   │       ├─ Stress de contexte → Réduire
  │   │       │
  │   │       └─ Manque de compétence → Question 4 : Info obtenue ?
  │   │           │
  │   │           ├─ OUI → Relâcher et passer
  │   │           │
  │   │           └─ NON → Maintenir
  │   │
  │   └─ NON → Réduire ou passer
  │
  └─ FIN
```

### 4.2 Scénarios Types

**Scénario 1 — Compétence critique + Évitement :**
- Q1 : OUI (critique)
- Q2 : OUI (évitement)
- Décision : Maintenir et insister

**Scénario 2 — Compétence critique + Non-évitement + Manque compétence + Info obtenue :**
- Q1 : OUI (critique)
- Q2 : NON (non-évitement)
- Q3 : Manque de compétence
- Q4 : OUI (info obtenue)
- Décision : Relâcher et passer

**Scénario 3 — Compétence critique + Non-évitement + Manque compétence + Info non obtenue :**
- Q1 : OUI (critique)
- Q2 : NON (non-évitement)
- Q3 : Manque de compétence
- Q4 : NON (info non obtenue)
- Décision : Maintenir

**Scénario 4 — Compétence critique + Non-évitement + Stress de contexte :**
- Q1 : OUI (critique)
- Q2 : NON (non-évitement)
- Q3 : Stress de contexte
- Décision : Réduire

**Scénario 5 — Compétence non critique :**
- Q1 : NON (non critique)
- Décision : Réduire ou passer

---

## 5. Adaptation par Persona

### 5.1 Persona Senior

**Question 1 — Criticité :**
- Tolérance légèrement plus élevée pour compétences non critiques
- Focus sur l'expérience

**Question 2 — Évitement :**
- Tolérance pour les réponses indirectes
- Insistance modérée

**Question 3 — Origine :**
- Tolérance légèrement plus élevée pour stress de contexte
- Focus sur la compétence

**Question 4 — Information :**
- Tolérance pour réponses partielles
- Focus sur la pertinence

### 5.2 Persona Executive

**Question 1 — Criticité :**
- Tolérance minimale pour compétences non critiques
- Focus sur la prise de décision

**Question 2 — Évitement :**
- Tolérance minimale pour l'évitement
- Insistance maximale

**Question 3 — Origine :**
- Tolérance minimale pour stress de contexte
- Focus sur la compétence

**Question 4 — Information :**
- Tolérance minimale pour réponses partielles
- Focus sur la précision

### 5.3 Persona Startup

**Question 1 — Criticité :**
- Tolérance modérée pour compétences non critiques
- Focus sur l'adaptabilité

**Question 2 — Évitement :**
- Tolérance modérée pour les réponses indirectes
- Insistance modérée

**Question 3 — Origine :**
- Tolérance modérée pour stress de contexte
- Focus sur la résolution de problèmes

**Question 4 — Information :**
- Tolérance pour réponses partielles
- Focus sur l'action

### 5.4 Persona Technical

**Question 1 — Criticité :**
- Tolérance élevée pour compétences non critiques techniques
- Focus sur la compétence technique

**Question 2 — Évitement :**
- Tolérance pour les réponses indirectes
- Insistance sur la précision technique

**Question 3 — Origine :**
- Tolérance élevée pour stress de contexte
- Focus sur la compétence technique

**Question 4 — Information :**
- Tolérance pour réponses partielles
- Focus sur la précision technique

---

## 6. Implémentation Technique

### 6.1 Structure de Données (TypeScript)

```typescript
interface PressureDecision {
  decisionId: string;
  responseId: string;
  candidateId: string;
  interviewId: string;
  
  decidedAt: Date;
  
  question1: {
    question: string;
    answer: 'yes' | 'no';
    evaluation: string;
    decision: string;
  };
  
  question2: {
    question: string;
    answer: 'yes' | 'no';
    evaluation: string;
    decision: string;
  };
  
  question3: {
    question: string;
    answer: 'context_stress' | 'competence_gap';
    evaluation: string;
    decision: string;
  };
  
  question4: {
    question: string;
    answer: 'yes' | 'no';
    evaluation: string;
    decision: string;
  };
  
  finalDecision: {
    action: 'maintain' | 'reduce' | 'pass';
    technique: string | null;
    rationale: string;
  };
  
  persona: 'senior' | 'executive' | 'startup' | 'technical';
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface PressureDecisionAlgorithm {
  algorithmId: string;
  
  decisionTree: {
    question1: {
      question: string;
      yes: string;
      no: string;
      evaluation: string;
    };
    question2: {
      question: string;
      yes: string;
      no: string;
      evaluation: string;
    };
    question3: {
      question: string;
      contextStress: string;
      competenceGap: string;
      evaluation: string;
    };
    question4: {
      question: string;
      yes: string;
      no: string;
      evaluation: string;
    };
  };
  
  scenarios: {
    scenario1: {
      path: string[];
      decision: string;
    };
    scenario2: {
      path: string[];
      decision: string;
    };
    scenario3: {
      path: string[];
      decision: string;
    };
    scenario4: {
      path: string[];
      decision: string;
    };
    scenario5: {
      path: string[];
      decision: string;
    };
  };
  
  personaAdaptation: {
    senior: {
      question1: string;
      question2: string;
      question3: string;
      question4: string;
    };
    executive: {
      question1: string;
      question2: string;
      question3: string;
      question4: string;
    };
    startup: {
      question1: string;
      question2: string;
      question3: string;
      question4: string;
    };
    technical: {
      question1: string;
      question2: string;
      question3: string;
      question4: string;
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
CREATE TABLE pressure_decision (
  id VARCHAR(36) PRIMARY KEY,
  response_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  decided_at TIMESTAMP NOT NULL,
  
  question1 JSON NOT NULL,
  question2 JSON NOT NULL,
  question3 JSON NOT NULL,
  question4 JSON NOT NULL,
  final_decision JSON NOT NULL,
  persona VARCHAR(20) NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_pressure_decision_response ON pressure_decision(response_id);
CREATE INDEX idx_pressure_decision_candidate ON pressure_decision(candidate_id);
CREATE INDEX idx_pressure_decision_interview ON pressure_decision(interview_id);

CREATE TABLE pressure_decision_algorithm (
  id VARCHAR(36) PRIMARY KEY,
  
  decision_tree JSON NOT NULL,
  scenarios JSON NOT NULL,
  persona_adaptation JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 8. API Endpoints

```typescript
// POST /api/pressure-decision
async function makePressureDecision(responseId: string, question: string, response: string, persona: string, signals: any): Promise<PressureDecision> {
  return await makePressureDecision(responseId, question, response, persona, signals);
}

// GET /api/pressure-decision/:decisionId
async function getPressureDecision(decisionId: string): Promise<PressureDecision> {
  return await getPressureDecisionById(decisionId);
}

// GET /api/pressure-decisions/response/:responseId
async function getDecisionsByResponse(responseId: string): Promise<PressureDecision[]> {
  return await getDecisionsByResponse(responseId);
}

// GET /api/pressure-decisions/candidate/:candidateId
async function getDecisionsByCandidate(candidateId: string): Promise<PressureDecision[]> {
  return await getDecisionsByCandidate(candidateId);
}

// GET /api/pressure-decision-algorithm
async function getPressureDecisionAlgorithm(): Promise<PressureDecisionAlgorithm> {
  return await getPressureDecisionAlgorithm();
}

// PUT /api/pressure-decision-algorithm
async function updatePressureDecisionAlgorithm(algorithm: PressureDecisionAlgorithm): Promise<PressureDecisionAlgorithm> {
  return await updatePressureDecisionAlgorithm(algorithm);
}

// POST /api/pressure-decision/evaluate-criticality
async function evaluateCompetencyCriticality(competency: string, position: string): Promise<any> {
  return await evaluateCompetencyCriticality(competency, position);
}

// POST /api/pressure-decision/detect-avoidance
async function detectAvoidance(response: string, question: string): Promise<any> {
  return await detectAvoidance(response, question);
}

// POST /api/pressure-decision/identify-difficulty-origin
async function identifyDifficultyOrigin(signals: any, context: string): Promise<any> {
  return await identifyDifficultyOrigin(signals, context);
}

// POST /api/pressure-decision/check-information-obtained
async function checkInformationObtained(response: string, question: string): Promise<any> {
  return await checkInformationObtained(response, question);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Décision

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de maintien | Maintenir / total | Variable selon contexte |
- Taux de réduction | Réduire / total | Variable selon contexte |
- Distribution par scénario | % par scénario | Variable |

### 9.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de décisions correctes | Décisions correctes / total | ≥ 90% |
- Taux de décisions adaptées persona | Décisions adaptées / total | ≥ 85% |

---

## 10. Conclusion

L'algorithme de décision pression / relâchement structure le processus en 4 questions clés. Question 1 : compétence critique pour le poste ? (OUI → Maintenir, NON → Réduire ou passer). Question 2 : candidat évite-t-il la question ? (OUI → Maintenir et insister, NON → Évaluer la qualité). Question 3 : difficulté vient-elle du stress de contexte ou du manque de compétence ? (Stress → Réduire, Manque → Maintenir). Question 4 : a-t-on obtenu l'information nécessaire ? (OUI → Relâcher, NON → Maintenir). Arbre de décision avec 5 scénarios types. Adaptation par persona (Senior, Executive, Startup, Technical) avec tolérances différentes pour chaque question.

**Points clés :**
- 4 questions clés de décision
- Question 1 : criticité de la compétence
- Question 2 : évitement de la question
- Question 3 : origine de la difficulté
- Question 4 : obtention de l'information
- Arbre de décision structuré
- 5 scénarios types
- Adaptation par persona
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la décision
- Métriques de décision et de qualité
