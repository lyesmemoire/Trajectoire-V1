# DOC-040-02 : Protocole d'Analyse des Feedbacks

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'analyse des feedbacks candidats pour MVP-040 Candidate Feedback Loop. Ce document structure l'analyse des 3 questions du feedback, l'intégration avec les autres MVPs, et les actions correctives selon les scores.

---

## 2. Principe Fondateur

Le moteur analyse les feedbacks pour identifier les points d'amélioration. Si le score est inférieur à 3 sur une question, le moteur identifie le MVP concerné et recommande des actions correctives. L'analyse est automatique et continue, permettant une amélioration constante de l'expérience candidat.

---

## 3. Analyse par Question

### 3.1 Question 1 — Écoute

**Question :**
"Avez-vous eu l'impression d'être vraiment écouté ?"

**Seuil d'alerte :**
Score < 3

**MVP concerné :**
MVP-036 Active Listening Engine

**Analyse :**
- Identifier la phase où l'écoute a été perçue comme insuffisante
- Analyser les signaux d'écoute utilisés
- Vérifier la fréquence des signaux d'écoute
- Identifier les moments de silence ou d'interruption

**Actions correctives :**
- Ajuster la bibliothèque de signaux d'écoute
- Augmenter la fréquence des signaux d'écoute
- Former les recruteurs sur l'écoute active
- Ajuster les paramètres du moteur

**KPIs :**
- Taux de feedbacks avec score < 3 sur écoute
- Évolution du score moyen sur écoute
- Temps de mise en œuvre des corrections

### 3.2 Question 2 — Pertinence

**Question :**
"Les questions posées vous ont-elles semblé pertinentes et professionnelles ?"

**Seuil d'alerte :**
Score < 3

**MVP concerné :**
Bibliothèque de Questions

**Analyse :**
- Identifier les questions mal perçues
- Analyser les commentaires libres pour comprendre pourquoi
- Vérifier la pertinence des questions par rapport au poste
- Identifier les questions trop génériques ou trop spécifiques

**Actions correctives :**
- Ajuster ou remplacer les questions problématiques
- Améliorer la formulation des questions
- Adapter les questions au contexte du poste
- Former les recruteurs sur la formulation des questions

**KPIs :**
- Taux de feedbacks avec score < 3 sur pertinence
- Évolution du score moyen sur pertinence
- Nombre de questions ajustées

### 3.3 Question 3 — Authenticité

**Question :**
"L'entretien vous a-t-il permis de montrer ce que vous êtes vraiment ?"

**Seuil d'alerte :**
Score < 3

**MVPs concernés :**
MVP-038 Stress Management Engine
MVP-039 Benevolent Unmasking Engine

**Analyse :**
- Vérifier si l'entretien était trop formel
- Vérifier si l'entretien était trop stressant
- Analyser le niveau de stress détecté
- Analyser le niveau de masque détecté
- Vérifier si les protocoles de désescalade ont été appliqués
- Vérifier si les techniques de démasquage ont été appliquées

**Actions correctives :**
- Ajuster les protocoles de désescalade (MVP-038)
- Ajuster les techniques de démasquage (MVP-039)
- Former les recruteurs sur la gestion du stress
- Former les recruteurs sur le démasquage bienveillant
- Ajuster les paramètres du moteur

**KPIs :**
- Taux de feedbacks avec score < 3 sur authenticité
- Évolution du score moyen sur authenticité
- Taux d'application des protocoles

---

## 4. Protocole d'Analyse Automatique

### 4.1 Déclenchement de l'Analyse

**Déclenchement :**
- À chaque nouveau feedback reçu
- Analyse immédiate du feedback
- Classification selon les scores

**Fréquence :**
- Analyse en temps réel
- Rapport quotidien
- Rapport hebdomadaire
- Rapport mensuel

### 4.2 Classification des Feedbacks

**Classification :**
- **Excellent** : Score moyen ≥ 4.5
- **Bon** : Score moyen 4.0-4.4
- **Satisfaisant** : Score moyen 3.5-3.9
- **À améliorer** : Score moyen 3.0-3.4
- **Insuffisant** : Score moyen < 3.0

**Actions par classe :**
- **Excellent** : Documenter les bonnes pratiques
- **Bon** : Maintenir les pratiques actuelles
- **Satisfaisant** : Identifier les points d'amélioration mineurs
- **À améliorer** : Identifier les points d'amélioration majeurs
- **Insuffisant** : Analyse approfondie et actions correctives immédiates

### 4.3 Analyse des Tendances

**Tendances à surveiller :**
- Baisse du score moyen sur une question
- Augmentation du taux de feedbacks avec score < 3
- Patterns dans les commentaires libres
- Variations par persona
- Variations par type de poste

**Alertes automatiques :**
- Si le score moyen baisse de 0.5 sur 7 jours
- Si le taux de feedbacks avec score < 3 augmente de 10% sur 7 jours
- Si un pattern négatif est détecté dans les commentaires

---

## 5. Intégration avec les Autres MVPs

### 5.1 MVP-036 Active Listening Engine

**Intégration :**
- Le moteur analyse les feedbacks avec score < 3 sur écoute
- Il identifie les entretiens concernés
- Il analyse les données de MVP-036 pour ces entretiens
- Il identifie les moments d'écoute insuffisante

**Actions :**
- Ajuster la bibliothèque de signaux d'écoute
- Augmenter la fréquence des signaux d'écoute
- Former les recruteurs sur l'écoute active
- Ajuster les paramètres du moteur

**Feedback loop :**
- Les ajustements sont testés
- Les nouveaux feedbacks sont analysés
- L'efficacité des ajustements est mesurée

### 5.2 Bibliothèque de Questions

**Intégration :**
- Le moteur analyse les feedbacks avec score < 3 sur pertinence
- Il identifie les questions mal perçues
- Il analyse les commentaires libres pour comprendre pourquoi
- Il identifie les patterns dans les questions problématiques

**Actions :**
- Ajuster ou remplacer les questions problématiques
- Améliorer la formulation des questions
- Adapter les questions au contexte du poste
- Former les recruteurs sur la formulation des questions

**Feedback loop :**
- Les ajustements sont testés
- Les nouveaux feedbacks sont analysés
- L'efficacité des ajustements est mesurée

### 5.3 MVP-038 Stress Management Engine

**Intégration :**
- Le moteur analyse les feedbacks avec score < 3 sur authenticité
- Il identifie les entretiens concernés
- Il analyse les données de MVP-038 pour ces entretiens
- Il vérifie si les protocoles de désescalade ont été appliqués

**Actions :**
- Ajuster les protocoles de désescalade
- Former les recruteurs sur la gestion du stress
- Ajuster les paramètres du moteur

**Feedback loop :**
- Les ajustements sont testés
- Les nouveaux feedbacks sont analysés
- L'efficacité des ajustements est mesurée

### 5.4 MVP-039 Benevolent Unmasking Engine

**Intégration :**
- Le moteur analyse les feedbacks avec score < 3 sur authenticité
- Il identifie les entretiens concernés
- Il analyse les données de MVP-039 pour ces entretiens
- Il vérifie si les techniques de démasquage ont été appliquées

**Actions :**
- Ajuster les techniques de démasquage
- Former les recruteurs sur le démasquage bienveillant
- Ajuster les paramètres du moteur

**Feedback loop :**
- Les ajustements sont testés
- Les nouveaux feedbacks sont analysés
- L'efficacité des ajustements est mesurée

---

## 6. Rapports d'Analyse

### 6.1 Rapport Quotidien

**Contenu :**
- Nombre de feedbacks reçus
- Score moyen par question
- Taux de feedbacks avec score < 3 par question
- Feedbacks avec score < 3 (détail)
- Actions recommandées

**Destinataires :**
- DRH
- Équipe produit
- Équipe technique

### 6.2 Rapport Hebdomadaire

**Contenu :**
- Évolution des scores moyens sur la semaine
- Évolution du taux de feedbacks avec score < 3
- Tendances identifiées
- Actions mises en œuvre
- Efficacité des actions
- Recommandations pour la semaine suivante

**Destinataires :**
- DRH
- Équipe produit
- Équipe technique
- Direction

### 6.3 Rapport Mensuel

**Contenu :**
- Évolution des scores moyens sur le mois
- Évolution du taux de feedbacks avec score < 3
- Tendances à long terme
- Actions mises en œuvre
- Efficacité des actions
- Comparaison avec les benchmarks
- Recommandations pour le mois suivant

**Destinataires :**
- DRH
- Équipe produit
- Équipe technique
- Direction
- Comité exécutif

---

## 7. Structure de Données (TypeScript)

```typescript
interface FeedbackAnalysis {
  analysisId: string;
  feedbackId: string;
  
  analyzedAt: Date;
  
  classification: {
    overallRating: number;
    class: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'insufficient';
  };
  
  questionAnalysis: {
    question1: {
      rating: number;
      threshold: number;
      alert: boolean;
      mvpConcerned: string;
      analysis: string[];
      recommendedActions: string[];
    };
    question2: {
      rating: number;
      threshold: number;
      alert: boolean;
      mvpConcerned: string;
      analysis: string[];
      recommendedActions: string[];
    };
    question3: {
      rating: number;
      threshold: number;
      alert: boolean;
      mvpConcerned: string[];
      analysis: string[];
      recommendedActions: string[];
    };
  };
  
  integration: {
    mvp036: {
      issue: boolean;
      interviewData: any;
      analysis: string[];
      actions: string[];
    };
    questionLibrary: {
      issue: boolean;
      problematicQuestions: string[];
      analysis: string[];
      actions: string[];
    };
    mvp038: {
      issue: boolean;
      interviewData: any;
      analysis: string[];
      actions: string[];
    };
    mvp039: {
      issue: boolean;
      interviewData: any;
      analysis: string[];
      actions: string[];
    };
  };
  
  trends: {
    scoreTrend: 'up' | 'down' | 'stable';
    alertTrend: 'up' | 'down' | 'stable';
    patterns: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface FeedbackAnalysisProtocol {
  protocolId: string;
  
  analysisTrigger: {
    trigger: string;
    frequency: string[];
  };
  
  classification: {
    excellent: {
      minScore: number;
      action: string;
    };
    good: {
      minScore: number;
      maxScore: number;
      action: string;
    };
    satisfactory: {
      minScore: number;
      maxScore: number;
      action: string;
    };
    needsImprovement: {
      minScore: number;
      maxScore: number;
      action: string;
    };
    insufficient: {
      maxScore: number;
      action: string;
    };
  };
  
  questionAnalysis: {
    question1: {
      threshold: number;
      mvpConcerned: string;
      analysisSteps: string[];
      correctiveActions: string[];
      kpis: string[];
    };
    question2: {
      threshold: number;
      mvpConcerned: string;
      analysisSteps: string[];
      correctiveActions: string[];
      kpis: string[];
    };
    question3: {
      threshold: number;
      mvpConcerned: string[];
      analysisSteps: string[];
      correctiveActions: string[];
      kpis: string[];
    };
  };
  
  trends: {
    toMonitor: string[];
    automaticAlerts: {
      scoreDrop: number;
      period: string;
      alertRateIncrease: number;
      period: string;
    };
  };
  
  integration: {
    mvp036: {
      analysisSteps: string[];
      actions: string[];
      feedbackLoop: string[];
    };
    questionLibrary: {
      analysisSteps: string[];
      actions: string[];
      feedbackLoop: string[];
    };
    mvp038: {
      analysisSteps: string[];
      actions: string[];
      feedbackLoop: string[];
    };
    mvp039: {
      analysisSteps: string[];
      actions: string[];
      feedbackLoop: string[];
    };
  };
  
  reports: {
    daily: {
      content: string[];
      recipients: string[];
    };
    weekly: {
      content: string[];
      recipients: string[];
    };
    monthly: {
      content: string[];
      recipients: string[];
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
CREATE TABLE feedback_analysis (
  id VARCHAR(36) PRIMARY KEY,
  feedback_id VARCHAR(36) NOT NULL,
  
  analyzed_at TIMESTAMP NOT NULL,
  
  classification JSON NOT NULL,
  question_analysis JSON NOT NULL,
  integration JSON NOT NULL,
  trends JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_analysis_feedback ON feedback_analysis(feedback_id);
CREATE INDEX idx_feedback_analysis_analyzed_at ON feedback_analysis(analyzed_at);

CREATE TABLE feedback_analysis_protocol (
  id VARCHAR(36) PRIMARY KEY,
  
  analysis_trigger JSON NOT NULL,
  classification JSON NOT NULL,
  question_analysis JSON NOT NULL,
  trends JSON NOT NULL,
  integration JSON NOT NULL,
  reports JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 9. API Endpoints

```typescript
// POST /api/candidate-feedback/analyze
async function analyzeFeedback(feedbackId: string): Promise<FeedbackAnalysis> {
  return await analyzeFeedback(feedbackId);
}

// GET /api/candidate-feedback/analysis/:analysisId
async function getFeedbackAnalysis(analysisId: string): Promise<FeedbackAnalysis> {
  return await getFeedbackAnalysisById(analysisId);
}

// GET /api/candidate-feedback/analysis/feedback/:feedbackId
async function getAnalysisByFeedback(feedbackId: string): Promise<FeedbackAnalysis> {
  return await getAnalysisByFeedback(feedbackId);
}

// GET /api/candidate-feedback/analysis/daily
async function getDailyAnalysis(): Promise<any> {
  return await getDailyAnalysis();
}

// GET /api/candidate-feedback/analysis/weekly
async function getWeeklyAnalysis(): Promise<any> {
  return await getWeeklyAnalysis();
}

// GET /api/candidate-feedback/analysis/monthly
async function getMonthlyAnalysis(): Promise<any> {
  return await getMonthlyAnalysis();
}

// GET /api/candidate-feedback/analysis-protocol
async function getFeedbackAnalysisProtocol(): Promise<FeedbackAnalysisProtocol> {
  return await getFeedbackAnalysisProtocol();
}

// PUT /api/candidate-feedback/analysis-protocol
async function updateFeedbackAnalysisProtocol(protocol: FeedbackAnalysisProtocol): Promise<FeedbackAnalysisProtocol> {
  return await updateFeedbackAnalysisProtocol(protocol);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques d'Analyse

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'analyse | Analyses / feedbacks reçus | 100% |
- Délai d'analyse | Temps moyen avant analyse | ≤ 5 minutes |
- Taux d'alertes | Alertes / analyses | Variable selon contexte |

### 10.2 Métriques d'Efficacité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de correction | Corrections mises en œuvre / alertes | ≥ 90% |
- Efficacité des corrections | Amélioration du score après correction | ≥ 0.5 |
- Temps de mise en œuvre | Temps moyen avant mise en œuvre | ≤ 7 jours |

---

## 11. Conclusion

Le protocole d'analyse des feedbacks structure l'analyse automatique des 3 questions du feedback candidat. Si le score est inférieur à 3 sur une question, le moteur identifie le MVP concerné et recommande des actions correctives. Question 1 (écoute) concerne MVP-036, Question 2 (pertinence) concerne la bibliothèque de questions, et Question 3 (authenticité) concerne MVP-038 et MVP-039. L'analyse est en temps réel avec des rapports quotidiens, hebdomadaires, et mensuels. Les actions correctives sont mises en œuvre et leur efficacité est mesurée dans un feedback loop continu.

**Points clés :**
- Analyse automatique des 3 questions
- Seuil d'alerte : score < 3
- Question 1 (écoute) → MVP-036 Active Listening
- Question 2 (pertinence) → Bibliothèque de Questions
- Question 3 (authenticité) → MVP-038 Stress + MVP-039 Authenticity
- Classification des feedbacks (Excellent, Bon, Satisfaisant, À améliorer, Insuffisant)
- Analyse des tendances avec alertes automatiques
- Intégration avec les autres MVPs
- Rapports quotidiens, hebdomadaires, mensuels
- Feedback loop pour mesurer l'efficacité des corrections
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'analyse et d'efficacité
