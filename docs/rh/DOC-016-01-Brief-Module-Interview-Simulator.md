# DOC-016-01 : Brief du Module Interview Simulator

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le brief du module MVP-016 Interview Simulator. Ce module permet aux candidats de s'entraîner face à un DRH Expert simulé, et aux recruteurs de former leurs managers à conduire des entretiens de qualité.

---

## 2. Principe Fondateur

L'Interview Simulator est un module à double usage : entraînement des candidats face à un DRH Expert simulé, et formation des recruteurs/managers à conduire des entretiens de qualité. Le moteur simule des entretiens réalistes et fournit des debriefings détaillés.

---

## 3. Deux Modes d'Utilisation

### MODE 1 — Entraînement Candidat

**Description :** Le candidat s'entraîne face au moteur qui joue le DRH Expert.

**Capacités du moteur :**
- Conduit un entretien réaliste et complet
- Pose les vraies questions d'un grand cabinet
- Challenge sans agresser
- Détecte les réponses faibles et relance
- Produit un debriefing complet post-simulation

**Debriefing candidat :**
- Ce qui était fort
- Ce qui était faible
- Ce qui était dangereux
- La reformulation recommandée pour chaque réponse
- Le niveau de préparation global
- Les axes de travail prioritaires

---

### MODE 2 — Formation Recruteur

**Description :** Le moteur joue le candidat. Le manager apprend à conduire l'entretien.

**Scénarios disponibles :**
- Candidat idéal (facile)
- Candidat sur-préparé (qui donne des réponses parfaites et creuses)
- Candidat résistant (qui n'aime pas les questions directes)
- Candidat manipulateur (qui tente de prendre le contrôle)
- Candidat anxieux (qui sous-performe par stress)
- Candidat sénior qui challenge la légitimité du recruteur

**Évaluation du manager recruteur :**
- Qualité des questions posées
- Détection des signaux faibles
- Gestion du temps
- Posture et bienveillance
- Conformité légale des questions (détection des questions illicites)
- Profondeur des relances

---

## 4. Cas d'Usage

### 4.1 Cas d'Usage Candidat

**Candidat en recherche d'emploi :**
- S'entraîne avant un entretien réel
- Identifie ses points faibles
- Améliore ses réponses
- Gagne en confiance

**Candidat en reconversion :**
- S'entraîne sur des postes différents
- Comprend les attentes des recruteurs
- Adapte son discours

**Candidat senior :**
- S'entraîne sur des entretiens de niveau élevé
- Prépare des réponses aux questions de légitimité
- Améliore sa communication

---

### 4.2 Cas d'Usage Recruteur

**Formation des nouveaux recruteurs :**
- Apprendre les bonnes pratiques d'entretien
- S'entraîner sur différents scénarios
- Recevoir un feedback structuré

**Formation des managers :**
- Apprendre à conduire des entretiens
- Détecter les signaux faibles
- Éviter les questions illicites

**Certification des recruteurs :**
- Valider les compétences d'entretien
- Standardiser les pratiques
- Assurer la qualité des recrutements

---

## 5. Architecture du Module

### 5.1 Composants Principaux

**Moteur DRH Expert Simulé :**
- Simule un DRH Expert réaliste
- Pose des questions de qualité
- Gère le temps et le rythme
- Détecte les réponses faibles
- Relance de manière pertinente

**Moteur Candidat Simulé :**
- Simule différents profils de candidats
- Répond selon le scénario choisi
- Manifeste des comportements spécifiques
- Challenge le recruteur selon le scénario

**Moteur d'Évaluation :**
- Évalue les réponses du candidat
- Évalue les questions du recruteur
- Détecte les signaux faibles
- Vérifie la conformité légale

**Moteur de Debriefing :**
- Produit un debriefing structuré
- Identifie les points forts/faibles
- Propose des reformulations
- Suggère des axes de travail

---

### 5.2 Intégration avec les Autres Modules

**MVP-013 Interview Intelligence :**
- Utilise les questions de la bibliothèque expert
- Utilise les signaux de détection
- Utilise la grille de cotation personnalisée

**MVP-014 Soft Skills Intelligence :**
- Évalue les soft skills pendant la simulation
- Détecte les preuves comportementales
- Produit une synthèse soft skills

**MVP-015 Debrief Expert :**
- Produit un debriefing structuré
- Formule une décision argumentée
- Génère un feedback candidat

---

## 6. Structure de Données (TypeScript)

```typescript
interface InterviewSimulator {
  simulatorId: string;
  mode: 'candidate_training' | 'recruiter_training';
  
  candidateTraining?: {
    candidateId: string;
    jobId: string;
    simulationStartedAt: Date;
    simulationEndedAt?: Date;
    
    interviewFlow: {
      questionId: string;
      question: string;
      response: string;
      responseQuality: 'strong' | 'weak' | 'dangerous';
      followUp?: string;
      timestamp: Date;
    }[];
    
    debriefing: CandidateDebriefing;
  };
  
  recruiterTraining?: {
    recruiterId: string;
    scenario: 'ideal' | 'over_prepared' | 'resistant' | 'manipulative' | 'anxious' | 'senior_challenger';
    simulationStartedAt: Date;
    simulationEndedAt?: Date;
    
    interviewFlow: {
      question: string;
      questionQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'illegal';
      response: string;
      timestamp: Date;
    }[];
    
    evaluation: RecruiterEvaluation;
  };
}

interface CandidateDebriefing {
  debriefingId: string;
  simulationId: string;
  generatedAt: Date;
  
  strongPoints: {
    question: string;
    response: string;
    whyStrong: string;
  }[];
  
  weakPoints: {
    question: string;
    response: string;
    whyWeak: string;
    recommendedReformulation: string;
  }[];
  
  dangerousPoints: {
    question: string;
    response: string;
    whyDangerous: string;
    recommendedReformulation: string;
  }[];
  
  globalPreparationLevel: 'excellent' | 'good' | 'fair' | 'poor';
  
  priorityWorkAreas: {
    area: string;
    actions: string[];
  }[];
}

interface RecruiterEvaluation {
  evaluationId: string;
  simulationId: string;
  recruiterId: string;
  generatedAt: Date;
  
  questionQuality: {
    score: number; // 0-100
    criteria: {
      relevance: number; // 0-20
      depth: number; // 0-20
      clarity: number; // 0-20
      legalCompliance: number; // 0-20
      followUpQuality: number; // 0-20
    };
  };
  
  signalDetection: {
    score: number; // 0-100
    detectedSignals: string[];
    missedSignals: string[];
  };
  
  timeManagement: {
    score: number; // 0-100
    totalTime: number;
    timePerQuestion: number[];
    balance: string;
  };
  
  posture: {
    score: number; // 0-100
    benevolence: number; // 0-50
    professionalism: number; // 0-50
  };
  
  legalCompliance: {
    score: number; // 0-100
    illegalQuestions: string[];
    borderlineQuestions: string[];
  };
  
  overallScore: number; // 0-100
  
  feedback: string;
  
  recommendations: string[];
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques Mode Candidat

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Simulations complétées / démarrées | ≥ 80% |
| Amélioration moyenne | Amélioration du score entre simulations | ≥ 20% |
| Satisfaction candidat | Satisfaction avec la simulation | ≥ 4/5 |
| Taux de recommandation | Candidats recommandant la simulation | ≥ 85% |

### 7.2 Métriques Mode Recruteur

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Simulations complétées / démarrées | ≥ 90% |
| Amélioration moyenne | Amélioration du score entre simulations | ≥ 25% |
| Satisfaction recruteur | Satisfaction avec la formation | ≥ 4.5/5 |
| Taux de certification | Recruteurs certifiés / formés | ≥ 70% |

---

## 8. Conclusion

L'Interview Simulator est un module à double usage qui permet aux candidats de s'entraîner face à un DRH Expert simulé, et aux recruteurs de former leurs managers à conduire des entretiens de qualité. Le module fournit des debriefings détaillés et des évaluations structurées.

**Points clés :**
- 2 modes : Entraînement candidat et Formation recruteur
- Mode candidat : DRH Expert simulé avec debriefing détaillé
- Mode recruteur : 6 scénarios de candidats différents
- Évaluation structurée des compétences d'entretien
- Détection des questions illicites
- Intégration avec MVP-013, MVP-014, MVP-015
