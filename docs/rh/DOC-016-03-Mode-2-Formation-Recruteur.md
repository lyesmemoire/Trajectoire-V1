# DOC-016-03 : Mode 2 Formation Recruteur

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le Mode 2 Formation Recruteur pour MVP-016 Interview Simulator. Ce mode permet aux recruteurs et managers de s'entraîner à conduire des entretiens de qualité face à des candidats simulés avec différents profils.

---

## 2. Principe Fondateur

Le Mode 2 Formation Recruteur simule des candidats avec différents profils (idéal, sur-préparé, résistant, manipulateur, anxieux, sénior challenger) pour former les recruteurs à conduire des entretiens de qualité et à détecter les signaux faibles.

---

## 3. Scénarios Candidat

### SCÉNARIO 1 — Candidat Idéal (Facile)

**Description :** Candidat parfait qui répond de manière claire et structurée.

**Caractéristiques :**
- Réponses claires et structurées
- Exemples concrets avec résultats chiffrés
- Soft skills démontrés
- Communication fluide
- Positif et enthousiaste

**Objectif pédagogique :**
- Permettre au recruteur de se familiariser avec le déroulement
- Mettre en confiance le recruteur débutant
- Servir de benchmark pour les autres scénarios

---

### SCÉNARIO 2 — Candidat Sur-Préparé

**Description :** Candidat qui donne des réponses parfaites et creuses.

**Caractéristiques :**
- Réponses trop parfaites et génériques
- Absence d'exemples concrets
- Discours stéréotypé
- Évitement des questions personnelles
- Manque d'authenticité

**Objectif pédagogique :**
- Apprendre à détecter les réponses creuses
- Apprendre à relancer pour obtenir des exemples concrets
- Apprendre à challenger les réponses trop parfaites

---

### SCÉNARIO 3 — Candidat Résistant

**Description :** Candidat qui n'aime pas les questions directes.

**Caractéristiques :**
- Évitement des questions directes
- Réponses indirectes et floues
- Tentative de détourner l'entretien
- Irritation face aux questions précises
- Posture défensive

**Objectif pédagogique :**
- Apprendre à gérer la résistance
- Apprendre à reformuler les questions
- Apprendre à maintenir le cap sur l'objectif

---

### SCÉNARIO 4 — Candidat Manipulateur

**Description :** Candidat qui tente de prendre le contrôle de l'entretien.

**Caractéristiques :**
- Pose des questions au recruteur
- Tente de diriger l'entretien
- Utilise des techniques de manipulation
- Critique le processus d'entretien
- Cherche à impressionner plutôt qu'à répondre

**Objectif pédagogique :**
- Apprendre à reprendre le contrôle
- Apprendre à gérer les tentatives de manipulation
- Apprendre à maintenir une posture professionnelle

---

### SCÉNARIO 5 — Candidat Anxieux

**Description :** Candidat qui sous-performe par stress.

**Caractéristiques :**
- Réponses hésitantes et bégayantes
- Manque de confiance en soi
- Réponses courtes et superficielles
- Stress visible (bégaiements, sueurs, tremblements)
- Potentiel masqué par l'anxiété

**Objectif pédagogique :**
- Apprendre à mettre en confiance
- Apprendre à adapter le rythme
- Apprendre à détecter le potentiel malgré l'anxiété

---

### SCÉNARIO 6 — Candidat Sénior Challenger

**Description :** Candidat sénior qui challenge la légitimité du recruteur.

**Caractéristiques :**
- Remet en question les compétences du recruteur
- Critique le processus d'entretien
- Se positionne en supérieur
- Teste les limites du recruteur
- Exige des réponses à ses questions

**Objectif pédagogique :**
- Apprendre à gérer les candidats sénior
- Apprendre à maintenir sa légitimité
- Apprendre à répondre aux questions du candidat
- Apprendre à ne pas se laisser intimider

---

## 4. Évaluation du Recruteur

### 4.1 Critères d'Évaluation

**Qualité des Questions Posées (0-20) :**
- Pertinence des questions par rapport au poste
- Clarté et précision des questions
- Variété des questions (techniques, comportementales, culture)
- Profondeur des questions
- Adaptation aux réponses du candidat

**Détection des Signaux Faibles (0-20) :**
- Détection des réponses creuses
- Détection des signaux de risque
- Détection des incohérences
- Détection des soft skills faibles
- Détection de l'anxiété masquée

**Gestion du Temps (0-20) :**
- Respect du temps total
- Équilibre entre les différentes phases
- Temps par question approprié
- Capacité à accélérer ou ralentir selon besoin
- Gestion du temps de parole du candidat

**Posture et Bienveillance (0-20) :**
- Bienveillance et écoute active
- Posture professionnelle
- Respect du candidat
- Capacité à mettre en confiance
- Gestion des émotions du candidat

**Conformité Légale des Questions (0-20) :**
- Absence de questions illicites
- Respect des critères prohibés
- Conformité avec la législation
- Détection des questions borderline
- Correction des questions illicites

---

### 5. Détection des Questions Illicites

### 5.1 Critères Prohibés

**En France (Loi du 2 août 2021) :**
- Âge
- Origine, ethnie, nationalité
- Sexe, orientation sexuelle, identité de genre
- Situation familiale, grossesse
- Apparence physique
- Patronyme
- État de santé, handicap
- Caractéristiques génétiques
- Mœurs
- Appartenance ethnique
- Opinions politiques
- Activités syndicales
- Lieu de résidence

### 5.2 Algorithme de Détection

```typescript
function detectIllegalQuestion(question: string): { illegal: boolean; reason?: string } {
  const prohibitedPatterns = [
    { pattern: /\bâge\b/i, reason: 'Critère d\'âge prohibé' },
    { pattern: /\b(origine|ethnie|nationalité)\b/i, reason: 'Critère d\'origine prohibé' },
    { pattern: /\b(sexe|orientation sexuelle|identité de genre)\b/i, reason: 'Critère de genre prohibé' },
    { pattern: /\b(marié|célibataire|divorcé|veuf|famille|enfants)\b/i, reason: 'Critère de situation familiale prohibé' },
    { pattern: /\b(grossesse|enceinte)\b/i, reason: 'Critère de grossesse prohibé' },
    { pattern: /\b(apparence|physique|taille|poids)\b/i, reason: 'Critère d\'apparence physique prohibé' },
    { pattern: /\b(santé|maladie|handicap)\b/i, reason: 'Critère de santé prohibé' },
    { pattern: /\b(opinions politiques|syndicat)\b/i, reason: 'Critère d\'opinion prohibé' },
    { pattern: /\b(lieu de résidence|où habitez)\b/i, reason: 'Critère de lieu de résidence prohibé' }
  ];
  
  for (const { pattern, reason } of prohibitedPatterns) {
    if (pattern.test(question)) {
      return { illegal: true, reason };
    }
  }
  
  return { illegal: false };
}
```

### 5.3 Détection des Questions Borderline

**Questions borderline :** Questions qui ne sont pas illégales mais qui sont proches de la limite.

**Exemples :**
- "Avez-vous des enfants ?" → illégal
- "Comment gérez-vous votre équilibre vie pro/perso ?" → borderline
- "Quelle est votre situation familiale ?" → illégal
- "Avez-vous des contraintes de mobilité ?" → borderline

**Algorithme de détection :**
```typescript
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

## 6. Profondeur des Relances

### 6.1 Niveaux de Relance

**Niveau 0 — Pas de relance :**
- Le recruteur passe à la question suivante sans relancer
- Manque de profondeur dans l'évaluation

**Niveau 1 — Relance superficielle :**
- Le recruteur relance avec une question générique
- "Pouvez-vous me donner plus de détails ?"
- Manque de spécificité

**Niveau 2 — Relance ciblée :**
- Le recruteur relance sur un point spécifique
- "Vous avez mentionné X, pouvez-vous me donner un exemple ?"
- Relance pertinente mais peu profonde

**Niveau 3 — Relance profonde :**
- Le recruteur relance avec une question ciblée et profonde
- "Comment avez-vous géré la résistance de l'équipe sur cette décision ?"
- Relance qui révèle des informations importantes

### 6.2 Évaluation de la Profondeur

```typescript
function evaluateFollowUpDepth(followUp: string, previousResponse: string): number {
  if (!followUp) return 0;
  
  // Niveau 1 : Relance superficielle
  if (/\b(détails|plus|en dire plus|préciser)\b/i.test(followUp)) {
    return 1;
  }
  
  // Niveau 2 : Relance ciblée
  if (/\b(exemple|situation|moment|avez-vous)\b/i.test(followUp)) {
    return 2;
  }
  
  // Niveau 3 : Relance profonde
  if (/\b(comment|pourquoi|quelle|résistance|gestion)\b/i.test(followUp)) {
    return 3;
  }
  
  return 0;
}
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface RecruiterTraining {
  trainingId: string;
  recruiterId: string;
  scenario: 'ideal' | 'over_prepared' | 'resistant' | 'manipulative' | 'anxious' | 'senior_challenger';
  jobId: string;
  startedAt: Date;
  endedAt?: Date;
  
  interviewFlow: {
    question: string;
    questionQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'illegal';
    questionScore: number; // 0-20
    response: string;
    followUp?: string;
    followUpDepth: number; // 0-3
    timestamp: Date;
  }[];
  
  evaluation: RecruiterEvaluation;
}

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

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE recruiter_training (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  scenario VARCHAR(50) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  
  interview_flow JSON NOT NULL,
  evaluation JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (recruiter_id) REFERENCES recruiters(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_recruiter_training_recruiter ON recruiter_training(recruiter_id);
CREATE INDEX idx_recruiter_training_scenario ON recruiter_training(scenario);
```

---

## 9. API Endpoints

```typescript
// POST /api/recruiter-training/start
async function startRecruiterTraining(recruiterId: string, scenario: RecruiterTraining['scenario'], jobId: string): Promise<RecruiterTraining> {
  return await initializeTraining(recruiterId, scenario, jobId);
}

// POST /api/recruiter-training/:trainingId/submit-question
async function submitQuestion(trainingId: string, question: string): Promise<{ response: string; quality: string; score: number }> {
  return await processQuestion(trainingId, question);
}

// POST /api/recruiter-training/:trainingId/submit-followup
async function submitFollowUp(trainingId: string, followUp: string): Promise<{ response: string; depth: number }> {
  return await processFollowUp(trainingId, followUp);
}

// POST /api/recruiter-training/:trainingId/complete
async function completeTraining(trainingId: string): Promise<RecruiterEvaluation> {
  return await generateEvaluation(trainingId);
}

// GET /api/recruiter-training/:trainingId/evaluation
async function getEvaluation(trainingId: string): Promise<RecruiterEvaluation> {
  return await getTrainingEvaluation(trainingId);
}

// GET /api/recruiter-training/recruiter/:recruiterId
async function getRecruiterTrainings(recruiterId: string): Promise<RecruiterTraining[]> {
  return await getRecruiterTrainingHistory(recruiterId);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Simulations complétées / démarrées | ≥ 90% |
| Temps moyen de simulation | Durée moyenne d'une simulation | 30-45 minutes |
| Taux de réutilisation | Recruteurs qui refont une simulation | ≥ 60% |
| Satisfaction recruteur | Satisfaction avec la formation | ≥ 4.5/5 |

### 10.2 Métriques d'Amélioration

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration moyenne | Amélioration du score entre simulations | ≥ 25% |
| Réduction des questions illicites | Réduction des questions illicites | ≥ 80% |
| Augmentation de la profondeur | Augmentation de la profondeur des relances | ≥ 40% |
| Taux de certification | Recruteurs certifiés / formés | ≥ 70% |

---

## 11. Conclusion

Le Mode 2 Formation Recruteur permet aux recruteurs et managers de s'entraîner à conduire des entretiens de qualité face à des candidats simulés avec différents profils. Le système évalue la qualité des questions, la détection des signaux faibles, la gestion du temps, la posture, la conformité légale, et la profondeur des relances.

**Points clés :**
- 6 scénarios de candidats différents
- Évaluation sur 6 critères (qualité questions, détection signaux, temps, posture, conformité légale, profondeur relances)
- Détection automatique des questions illicites
- Détection des questions borderline
- Évaluation de la profondeur des relances
- Feedback structuré avec recommandations
- Certification possible pour les recruteurs
