# DOC-016-02 : Mode 1 Entraînement Candidat

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le Mode 1 Entraînement Candidat pour MVP-016 Interview Simulator. Ce mode permet aux candidats de s'entraîner face à un DRH Expert simulé qui conduit un entretien réaliste et produit un debriefing détaillé.

---

## 2. Principe Fondateur

Le Mode 1 Entraînement Candidat simule un entretien réel avec un DRH Expert qui pose les vraies questions d'un grand cabinet, challenge sans agresser, détecte les réponses faibles et relance de manière pertinente. Le candidat reçoit un debriefing complet post-simulation.

---

## 3. Flux de la Simulation

### 3.1 Phase de Préparation

**Étape 1 : Sélection du Poste**
- Le candidat sélectionne le poste visé
- Le système charge le profil du poste (MVP-003)
- Le système charge les questions pertinentes (MVP-013)

**Étape 2 : Chargement du CV (Optionnel)**
- Le candidat peut uploader son CV
- Le système analyse le CV (MVP-001)
- Le système adapte les questions au profil du candidat

**Étape 3 : Configuration de la Simulation**
- Durée de l'entretien (30, 45, 60 minutes)
- Niveau de difficulté (standard, avancé, expert)
- Focus spécifique (technique, soft skills, mixte)

---

### 3.2 Phase de Simulation

**Étape 1 : Introduction**
- Le DRH Expert simulé se présente
- Le DRH explique le déroulement de l'entretien
- Le DRH pose les questions de brise-glace

**Étape 2 : Questions Techniques**
- Le DRH pose des questions techniques adaptées au poste
- Le candidat répond (oral ou écrit)
- Le DRH évalue la réponse en temps réel
- Le DRH relance si nécessaire

**Étape 3 : Questions d'Observation Comportementale**
- Le DRH pose des questions d'observation (MVP-014)
- Le candidat répond avec des exemples concrets
- Le DRH détecte les preuves comportementales
- Le DRH relance pour approfondir

**Étape 4 : Questions de Culture Fit**
- Le DRH pose des questions sur les valeurs et le style de travail
- Le candidat répond
- Le DRH évalue l'adéquation culturelle

**Étape 5 : Conclusion**
- Le DRH permet au candidat de poser des questions
- Le DRH conclut l'entretien
- Le DRH informe que le debriefing sera généré

---

### 3.3 Phase de Debriefing

**Étape 1 : Génération du Debriefing**
- Le système analyse toutes les réponses
- Le système évalue la qualité de chaque réponse
- Le système identifie les points forts/faibles/dangereux
- Le système génère des reformulations recommandées

**Étape 2 : Présentation du Debriefing**
- Le système présente le debriefing structuré
- Le candidat peut naviguer entre les sections
- Le candidat peut voir les détails de chaque réponse

**Étape 3 : Axes de Travail**
- Le système suggère des axes de travail prioritaires
- Le système propose des ressources d'apprentissage
- Le système recommande des simulations supplémentaires

---

## 4. Évaluation des Réponses

### 4.1 Critères d'Évaluation

| Critère | Description | Poids |
|---------|-------------|-------|
| Pertinence | La réponse répond-elle à la question ? | 25% |
| Concrétude | La réponse contient-elle des exemples concrets ? | 25% |
| Spécificité | La réponse est-elle précise et détaillée ? | 20% |
| Structure | La réponse est-elle bien structurée ? | 15% |
| Impact | La réponse montre-t-elle un impact ou un résultat ? | 15% |

### 4.2 Niveaux de Qualité

**Réponse Forte (Strong) :**
- Répond directement à la question
- Contient des exemples concrets
- Est précise et détaillée
- Est bien structurée
- Montre un impact ou un résultat

**Réponse Faible (Weak) :**
- Répond partiellement à la question
- Contient des exemples vagues ou génériques
- Manque de détails ou de précision
- Est mal structurée
- Ne montre pas d'impact

**Réponse Dangereuse (Dangerous) :**
- Ne répond pas à la question
- Contient des signaux de risque (critique employeurs, discours victimaire)
- Est contradictoire ou incohérente
- Contient des éléments illégaux ou non professionnels
- Peut nuire à la candidature

---

## 5. Détection et Relance

### 5.1 Détection des Réponses Faibles

**Indicateurs de réponse faible :**
- Réponse générique sans exemple concret
- Usage excessif du "on/nous" diluant la responsabilité
- Réponse théorique sans application pratique
- Évitement de la question
- Réponse trop courte ou superficielle

**Algorithme de détection :**
```typescript
function detectWeakResponse(response: string, question: string): boolean {
  const indicators = {
    generic: /\b(généralement|souvent|en général|d'habitude)\b/i.test(response),
    vague: /\b(quelque chose|un peu|plutôt|environ)\b/i.test(response),
    dilution: /\b(on|nous|l'équipe|les gens)\b/gi.test(response),
    theoretical: /\b(théoriquement|en théorie|en principe)\b/i.test(response),
    avoidance: /\b(c'est compliqué|je ne sais pas|je préfère ne pas répondre)\b/i.test(response)
  };
  
  const weakCount = Object.values(indicators).filter(Boolean).length;
  const length = response.split(' ').length;
  
  return weakCount >= 2 || length < 20;
}
```

### 5.2 Relance Automatique

**Objectif de la relance :**
- Amener le candidat à donner un exemple concret
- Clarifier une réponse vague
- Approfondir un point intéressant
- Challenger une réponse trop parfaite

**Types de relance :**
- **Relance pour exemple concret :** "Pouvez-vous me donner un exemple concret d'une situation où vous avez..."
- **Relance pour clarification :** "Qu'entendez-vous par..."
- **Relance pour approfondissement :** "Pouvez-vous me dire plus en détail comment vous avez..."
- **Relance pour challenge :** "Comment avez-vous géré la résistance de l'équipe sur cette décision ?"

---

## 6. Structure du Debriefing Candidat

### 6.1 Points Forts

**Description :** Réponses qui ont été jugées fortes.

**Contenu :**
- Question posée
- Réponse du candidat
- Pourquoi la réponse est forte
- Ce qui la distingue

**Exemple :**
```
Question : "Parlez-moi d'un projet complexe que vous avez géré."

Réponse : "En 2023, j'ai géré la refonte du site e-commerce de mon entreprise.
J'ai coordonné une équipe de 5 personnes sur 6 mois. Nous avons augmenté
les ventes de 20% et réduit le temps de chargement de 50%. Le projet a été
livré dans les délais et sous budget."

Pourquoi fort : Réponse concrète avec contexte, équipe, durée, résultats chiffrés.
Ce qui distingue : Résultats mesurables et leadership démontré.
```

---

### 6.2 Points Faibles

**Description :** Réponses qui ont été jugées faibles.

**Contenu :**
- Question posée
- Réponse du candidat
- Pourquoi la réponse est faible
- Reformulation recommandée

**Exemple :**
```
Question : "Parlez-moi d'un projet complexe que vous avez géré."

Réponse : "J'ai géré plusieurs projets complexes dans ma carrière.
Généralement, ça se passe bien et on arrive à livrer dans les délais."

Pourquoi faible : Réponse générique sans exemple concret, pas de détails,
pas de résultats chiffrés.

Reformulation recommandée : "En 2023, j'ai géré la refonte du site e-commerce
de mon entreprise. J'ai coordonné une équipe de 5 personnes sur 6 mois.
Nous avons augmenté les ventes de 20% et réduit le temps de chargement de 50%."
```

---

### 6.3 Points Dangereux

**Description :** Réponses qui ont été jugées dangereuses.

**Contenu :**
- Question posée
- Réponse du candidat
- Pourquoi la réponse est dangereuse
- Reformulation recommandée

**Exemple :**
```
Question : "Pourquoi voulez-vous quitter votre entreprise actuelle ?"

Réponse : "Mon manager est incompétent et l'ambiance est toxique.
Les gens ne savent pas ce qu'ils font et c'est le chaos complet."

Pourquoi dangereux : Critique systématique de l'employeur, discours victimaire,
signaux de risque pour la collaboration.

Reformulation recommandée : "Je cherche de nouveaux défis et souhaite évoluer
vers un environnement où je pourrai développer mes compétences en gestion de projet
à plus grande échelle."
```

---

### 6.4 Niveau de Préparation Global

**Critères d'évaluation :**
- Pourcentage de réponses fortes
- Pourcentage de réponses faibles
- Pourcentage de réponses dangereuses
- Capacité à fournir des exemples concrets
- Capacité à structurer les réponses

**Niveaux :**
- **Excellent :** ≥ 70% de réponses fortes, ≤ 10% de réponses faibles, 0% de réponses dangereuses
- **Bon :** 50-69% de réponses fortes, ≤ 20% de réponses faibles, ≤ 5% de réponses dangereuses
- **Moyen :** 30-49% de réponses fortes, ≤ 30% de réponses faibles, ≤ 10% de réponses dangereuses
- **Faible :** < 30% de réponses fortes, > 30% de réponses faibles, > 10% de réponses dangereuses

---

### 6.5 Axes de Travail Prioritaires

**Basés sur :**
- Points faibles identifiés
- Réponses dangereuses
- Soft skills à améliorer
- Compétences techniques à renforcer

**Exemple :**
```
Axe 1 : Fournir des exemples concrets
Actions :
- Préparer 3 exemples par compétence clé
- Utiliser la méthode STAR (Situation, Tâche, Action, Résultat)
- Inclure des résultats chiffrés quand possible

Axe 2 : Éviter la critique des employeurs
Actions :
- Se concentrer sur les opportunités de croissance
- Formuler positivement les raisons de départ
- Pratiquer les réponses sur "pourquoi partir"

Axe 3 : Structurer les réponses
Actions :
- Utiliser des connecteurs logiques
- Commencer par la conclusion
- Être concis et précis
```

---

## 7. Structure de Données (TypeScript)

```typescript
interface CandidateTraining {
  trainingId: string;
  candidateId: string;
  jobId: string;
  startedAt: Date;
  endedAt?: Date;
  
  configuration: {
    duration: number; // minutes
    difficulty: 'standard' | 'advanced' | 'expert';
    focus: 'technical' | 'soft_skills' | 'mixed';
  };
  
  interviewFlow: {
    phase: 'introduction' | 'technical' | 'behavioral' | 'cultural_fit' | 'conclusion';
    questionId: string;
    question: string;
    response: string;
    responseQuality: 'strong' | 'weak' | 'dangerous';
    responseScore: number; // 0-100
    followUp?: string;
    timestamp: Date;
  }[];
  
  debriefing: CandidateDebriefing;
}

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
    nextSimulationDifficulty: string;
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE candidate_training (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  
  configuration JSON NOT NULL,
  interview_flow JSON NOT NULL,
  debriefing JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_training_candidate ON candidate_training(candidate_id);
CREATE INDEX idx_training_job ON candidate_training(job_id);
```

---

## 9. API Endpoints

```typescript
// POST /api/candidate-training/start
async function startCandidateTraining(candidateId: string, jobId: string, configuration: CandidateTraining['configuration']): Promise<CandidateTraining> {
  return await initializeTraining(candidateId, jobId, configuration);
}

// POST /api/candidate-training/:trainingId/submit-response
async function submitResponse(trainingId: string, questionId: string, response: string): Promise<{ quality: string; followUp?: string; score: number }> {
  return await processResponse(trainingId, questionId, response);
}

// POST /api/candidate-training/:trainingId/complete
async function completeTraining(trainingId: string): Promise<CandidateDebriefing> {
  return await generateDebriefing(trainingId);
}

// GET /api/candidate-training/:trainingId/debriefing
async function getDebriefing(trainingId: string): Promise<CandidateDebriefing> {
  return await getTrainingDebriefing(trainingId);
}

// GET /api/candidate-training/candidate/:candidateId
async function getCandidateTrainings(candidateId: string): Promise<CandidateTraining[]> {
  return await getCandidateTrainingHistory(candidateId);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Simulations complétées / démarrées | ≥ 80% |
| Temps moyen de simulation | Durée moyenne d'une simulation | 30-45 minutes |
| Taux de réutilisation | Candidats qui refont une simulation | ≥ 40% |
| Satisfaction candidat | Satisfaction avec la simulation | ≥ 4/5 |

### 10.2 Métriques d'Amélioration

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration moyenne | Amélioration du score entre simulations | ≥ 20% |
| Réduction des réponses dangereuses | Réduction des réponses dangereuses | ≥ 50% |
| Augmentation des réponses fortes | Augmentation des réponses fortes | ≥ 30% |
| Taux de recommandation | Candidats recommandant la simulation | ≥ 85% |

---

## 11. Conclusion

Le Mode 1 Entraînement Candidat permet aux candidats de s'entraîner face à un DRH Expert simulé qui conduit un entretien réaliste et produit un debriefing détaillé. Le candidat reçoit des points forts/faibles/dangereux, des reformulations recommandées, et des axes de travail prioritaires.

**Points clés :**
- DRH Expert simulé réaliste et bienveillant
- Questions de qualité adaptées au poste
- Détection automatique des réponses faibles/dangereuses
- Relance automatique pour améliorer les réponses
- Debriefing structuré avec points forts/faibles/dangereux
- Reformulations recommandées pour chaque réponse
- Niveau de préparation global
- Axes de travail prioritaires avec ressources
