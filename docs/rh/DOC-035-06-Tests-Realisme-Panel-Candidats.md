# DOC-035-06 : Tests de Réalisme (Panel de Candidats Test)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de tests de réalisme pour MVP-035 Voice & Avatar Authenticity. Ce protocole structure les tests avec un panel de candidats pour valider le réalisme de la voix synthétique et de l'avatar vidéo, incluant la méthodologie, les critères d'évaluation, les scénarios de test, et les métriques de succès.

---

## 2. Principe Fondateur

Le réalisme de la voix et de l'avatar doit être validé par des tests empiriques avec un panel de candidats réels. Les tests doivent mesurer la perception du réalisme, la qualité de l'expérience, et l'acceptabilité éthique. Le candidat ne doit pas être certain qu'il parle à une IA, mais la transparence est obligatoire.

---

## 3. Méthodologie de Test

### 3.1 Panel de Candidats

**Composition du panel :**
- Nombre de candidats : 50 minimum
- Diversité des profils : Junior, confirmé, senior
- Diversité des secteurs : Tech, finance, marketing, RH
- Diversité des âges : 22-55 ans
- Diversité des genres : Équilibré
- Diversité des origines : Représentative

**Recrutement du panel :**
- Candidats réels en recherche d'emploi
- Candidats volontaires pour le test
- Rémunération possible pour participation
- Consentement explicite pour le test

### 3.2 Protocole de Test

**Avant le test :**
- Information sur la nature du système (IA)
- Consentement explicite
- Information sur l'enregistrement pour analyse
- Information sur l'anonymisation des données

**Pendant le test :**
- Entretien simulé de 15-20 minutes
- Questions standardisées
- Enregistrement audio et vidéo
- Observation du comportement du candidat

**Après le test :**
- Questionnaire de feedback
- Entretien de debrief
- Mesure de la perception du réalisme
- Mesure de la satisfaction

### 3.3 Scénarios de Test

**Scénario 1 — Entretien standard :**
- Candidat : Profil junior
- Persona : DRH Senior Bienveillant
- Durée : 15 minutes
- Objectif : Valider le réalisme dans un contexte standard

**Scénario 2 — Entretien technique :**
- Candidat : Profil tech
- Persona : DRH Technique
- Durée : 20 minutes
- Objectif : Valider le réalisme dans un contexte technique

**Scénario 3 — Entretien senior :**
- Candidat : Profil senior
- Persona : DRH Executive
- Durée : 20 minutes
- Objectif : Valider le réalisme dans un contexte senior

**Scénario 4 — Entretien startup :**
- Candidat : Profil créatif
- Persona : DRH Startup
- Durée : 15 minutes
- Objectif : Valider le réalisme dans un contexte startup

---

## 4. Critères d'Évaluation

### 4.1 Critères de Réalisme Vocale

**Timbre :**
- Note : 1-5
- Question : "La voix sonne-t-elle naturelle ?"
- Cible : ≥ 4.0/5

**Débit :**
- Note : 1-5
- Question : "Le débit de parole est-il naturel ?"
- Cible : ≥ 4.0/5

**Intonation :**
- Note : 1-5
- Question : "L'intonation est-elle naturelle ?"
- Cible : ≥ 4.0/5

**Chaleur :**
- Note : 1-5
- Question : "La voix est-elle chaleureuse ?"
- Cible : ≥ 4.0/5

**Authenticité :**
- Note : 1-5
- Question : "La voix sonne-t-elle authentique ?"
- Cible : ≥ 4.0/5

### 4.2 Critères de Réalisme Visuel (si activé)

**Photo-réalisme :**
- Note : 1-5
- Question : "L'avatar ressemble-t-il à un humain ?"
- Cible : ≥ 4.5/5

**Expressions naturelles :**
- Note : 1-5
- Question : "Les expressions faciales sont-elles naturelles ?"
- Cible : ≥ 4.5/5

**Mouvements fluides :**
- Note : 1-5
- Question : "Les mouvements sont-ils fluides ?"
- Cible : ≥ 4.5/5

**Contact visuel :**
- Note : 1-5
- Question : "Le contact visuel est-il naturel ?"
- Cible : ≥ 4.5/5

### 4.3 Critères de Qualité de l'Expérience

**Fluidité de l'interaction :**
- Note : 1-5
- Question : "L'interaction est-elle fluide ?"
- Cible : ≥ 4.0/5

**Compréhension des questions :**
- Note : 1-5
- Question : "Les questions sont-elles claires ?"
- Cible : ≥ 4.0/5

**Adaptation au candidat :**
- Note : 1-5
- Question : "Le système s'adapte-t-il à votre profil ?"
- Cible : ≥ 4.0/5

**Satisfaction globale :**
- Note : 1-5
- Question : "Êtes-vous satisfait de l'expérience ?"
- Cible : ≥ 4.0/5

### 4.4 Critères Éthiques

**Transparence :**
- Note : 1-5
- Question : "L'information sur l'IA était-elle claire ?"
- Cible : ≥ 4.5/5

**Consentement :**
- Note : 1-5
- Question : "Le consentement était-il clair ?"
- Cible : ≥ 4.5/5

**Confiance :**
- Note : 1-5
- Question : "Avez-vous confiance dans le système ?"
- Cible : ≥ 4.0/5

**Acceptabilité :**
- Note : 1-5
- Question : "Accepteriez-vous un entretien réel avec ce système ?"
- Cible : ≥ 3.5/5

---

## 5. Questionnaire de Feedback

### 5.1 Section Réalisme

**Questions :**
1. Sur une échelle de 1 à 5, à quel point la voix sonne-t-elle naturelle ?
2. Sur une échelle de 1 à 5, à quel point l'avatar (si activé) ressemble-t-il à un humain ?
3. Avez-vous eu l'impression de parler à une IA ? (Oui / Non / Pas sûr)
4. Quels éléments vous ont fait penser que c'était une IA ?
5. Quels éléments vous ont fait penser que c'était un humain ?

### 5.2 Section Qualité

**Questions :**
1. Sur une échelle de 1 à 5, à quel point l'interaction était-elle fluide ?
2. Sur une échelle de 1 à 5, à quel point les questions étaient-elles claires ?
3. Sur une échelle de 1 à 5, à quel point le système s'adaptait-il à votre profil ?
4. Y a-t-il eu des moments où l'interaction était difficile ? (Oui / Non)
5. Si oui, quels étaient ces moments ?

### 5.3 Section Éthique

**Questions :**
1. L'information sur la nature du système (IA) était-elle claire ? (Oui / Non)
2. Le consentement était-il clair ? (Oui / Non)
3. Sur une échelle de 1 à 5, à quel point avez-vous confiance dans le système ?
4. Sur une échelle de 1 à 5, accepteriez-vous un entretien réel avec ce système ?
5. Quels sont vos commentaires sur l'aspect éthique ?

### 5.4 Section Ouverte

**Questions :**
1. Qu'avez-vous aimé dans cette expérience ?
2. Qu'avez-vous n'aimé pas dans cette expérience ?
3. Quels sont vos suggestions d'amélioration ?
4. Autres commentaires ?

---

## 6. Protocole d'Analyse

### 6.1 Analyse Quantitative

**Métriques calculées :**
- Moyenne de chaque critère
- Écart-type de chaque critère
- Distribution des réponses
- Corrélation entre critères
- Comparaison par scénario

**Analyse statistique :**
- Test t pour comparer les scénarios
- ANOVA pour comparer les profils
- Régression pour identifier les facteurs de succès
- Analyse de cluster pour identifier les segments

### 6.2 Analyse Qualitative

**Analyse des commentaires :**
- Thématisation des commentaires
- Identification des points positifs
- Identification des points négatifs
- Identification des suggestions d'amélioration

**Analyse des comportements :**
- Observation des réactions du candidat
- Identification des moments de confusion
- Identification des moments d'engagement
- Identification des moments de désengagement

### 6.3 Rapport de Test

**Structure du rapport :**
1. Résumé exécutif
2. Méthodologie
3. Résultats quantitatifs
4. Résultats qualitatifs
5. Analyse par scénario
6. Recommandations
7. Plan d'action

---

## 7. Critères de Succès

### 7.1 Critères de Réalisme

| Critère | Cible |
|----------|-------|
- Réalisme vocal moyen | ≥ 4.0/5 |
- Réalisme visuel moyen (si activé) | ≥ 4.5/5 |
- Taux de détection IA | ≤ 30% |
- Taux d'incertitude | ≥ 40% |

### 7.2 Critères de Qualité

| Critère | Cible |
|----------|-------|
- Fluidité de l'interaction | ≥ 4.0/5 |
- Compréhension des questions | ≥ 4.0/5 |
- Adaptation au candidat | ≥ 4.0/5 |
- Satisfaction globale | ≥ 4.0/5 |

### 7.3 Critères Éthiques

| Critère | Cible |
|----------|-------|
- Clarté de l'information | ≥ 4.5/5 |
- Clarté du consentement | ≥ 4.5/5 |
- Confiance dans le système | ≥ 4.0/5 |
- Acceptabilité | ≥ 3.5/5 |

---

## 8. Structure de Données (TypeScript)

```typescript
interface RealismTest {
  testId: string;
  testName: string;
  
  panel: {
    candidateId: string;
    profile: 'junior' | 'confirmed' | 'senior';
    sector: string;
    age: number;
    gender: string;
    origin: string;
  }[];
  
  protocol: {
    preTest: {
      information: boolean;
      consent: boolean;
      recording: boolean;
      anonymization: boolean;
    };
    duringTest: {
      duration: number;
      standardizedQuestions: boolean;
      audioRecording: boolean;
      videoRecording: boolean;
      behaviorObservation: boolean;
    };
    postTest: {
      feedbackQuestionnaire: boolean;
      debriefInterview: boolean;
      realismMeasurement: boolean;
      satisfactionMeasurement: boolean;
    };
  };
  
  scenarios: {
    scenarioId: string;
    scenarioName: string;
    candidateProfile: string;
    persona: string;
    duration: number;
    objective: string;
  }[];
  
  evaluationCriteria: {
    vocalRealism: {
      timbre: number;
      pace: number;
      intonation: number;
      warmth: number;
      authenticity: number;
    };
    visualRealism: {
      photorealism: number;
      naturalExpressions: number;
      fluidMovements: number;
      eyeContact: number;
    };
    experienceQuality: {
      interactionFluidity: number;
      questionClarity: number;
      candidateAdaptation: number;
      overallSatisfaction: number;
    };
    ethical: {
      transparency: number;
      consent: number;
      trust: number;
      acceptability: number;
    };
  };
  
  feedback: {
    candidateId: string;
    scenarioId: string;
    realism: {
      voiceRating: number;
      avatarRating: number;
      aiDetection: 'yes' | 'no' | 'unsure';
      aiIndicators: string[];
      humanIndicators: string[];
    };
    quality: {
      interactionFluidity: number;
      questionClarity: number;
      candidateAdaptation: number;
      difficultMoments: string[];
    };
    ethical: {
      informationClarity: 'yes' | 'no';
      consentClarity: 'yes' | 'no';
      trust: number;
      acceptability: number;
      comments: string;
    };
    open: {
      liked: string[];
      disliked: string[];
      suggestions: string[];
      other: string;
    };
  }[];
  
  analysis: {
    quantitative: {
      means: Record<string, number>;
      standardDeviations: Record<string, number>;
      distributions: Record<string, number[]>;
      correlations: Record<string, number>;
      scenarioComparisons: Record<string, number>;
    };
    qualitative: {
      themes: string[];
      positivePoints: string[];
      negativePoints: string[];
      suggestions: string[];
    };
    behavior: {
      reactions: string[];
      confusionMoments: string[];
      engagementMoments: string[];
      disengagementMoments: string[];
    };
  };
  
  successCriteria: {
    realism: {
      vocalMean: number;
      visualMean: number;
      aiDetectionRate: number;
      uncertaintyRate: number;
    };
    quality: {
      interactionFluidity: number;
      questionClarity: number;
      candidateAdaptation: number;
      overallSatisfaction: number;
    };
    ethical: {
      informationClarity: number;
      consentClarity: number;
      trust: number;
      acceptability: number;
    };
  };
  
  report: {
    executiveSummary: string;
    methodology: string;
    quantitativeResults: string;
    qualitativeResults: string;
    scenarioAnalysis: string;
    recommendations: string[];
    actionPlan: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
    status: 'planned' | 'in_progress' | 'completed';
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE realism_test (
  id VARCHAR(36) PRIMARY KEY,
  test_name VARCHAR(255) NOT NULL,
  
  panel JSON NOT NULL,
  protocol JSON NOT NULL,
  scenarios JSON NOT NULL,
  evaluation_criteria JSON NOT NULL,
  feedback JSON NOT NULL,
  analysis JSON NOT NULL,
  success_criteria JSON NOT NULL,
  report JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_realism_test_status ON realism_test((metadata->>'$.status'));
```

---

## 10. API Endpoints

```typescript
// POST /api/voice/realism-test/create
async function createRealismTest(test: RealismTest): Promise<RealismTest> {
  return await createRealismTest(test);
}

// GET /api/voice/realism-test/:testId
async function getRealismTest(testId: string): Promise<RealismTest> {
  return await getRealismTestById(testId);
}

// GET /api/voice/realism-tests
async function getRealismTests(): Promise<RealismTest[]> {
  return await getRealismTests();
}

// POST /api/voice/realism-test/:testId/feedback
async function submitFeedback(testId: string, feedback: any): Promise<RealismTest> {
  return await submitFeedback(testId, feedback);
}

// POST /api/voice/realism-test/:testId/analyze
async function analyzeRealismTest(testId: string): Promise<RealismTest> {
  return await analyzeRealismTest(testId);
}

// POST /api/voice/realism-test/:testId/report
async function generateReport(testId: string): Promise<RealismTest> {
  return await generateReport(testId);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Test

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de participation | Candidats participants / invités | ≥ 80% |
- Taux de complétion | Tests complétés / commencés | ≥ 90% |
- Temps moyen de test | Minutes par candidat | ≤ 30 minutes |

### 11.2 Métriques de Résultats

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réalisme vocal moyen | Note moyenne | ≥ 4.0/5 |
- Réalisme visuel moyen | Note moyenne | ≥ 4.5/5 |
- Satisfaction globale | Note moyenne | ≥ 4.0/5 |
- Acceptabilité | Note moyenne | ≥ 3.5/5 |

---

## 12. Conclusion

Le protocole de tests de réalisme structure les tests avec un panel de candidats pour valider le réalisme de la voix synthétique et de l'avatar vidéo. Les tests mesurent la perception du réalisme, la qualité de l'expérience, et l'acceptabilité éthique. Les critères de succès sont définis pour valider le déploiement du système.

**Points clés :**
- Panel de 50 candidats minimum diversifié
- Protocole de test (avant, pendant, après)
- 4 scénarios de test (standard, technique, senior, startup)
- Critères d'évaluation (réalisme, qualité, éthique)
- Questionnaire de feedback structuré
- Analyse quantitative et qualitative
- Rapport de test complet
- Critères de succès définis
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de test et de résultats
