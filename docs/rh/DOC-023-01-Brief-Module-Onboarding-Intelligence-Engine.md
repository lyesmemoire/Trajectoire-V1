# DOC-023-01 : Brief du Module Onboarding Intelligence Engine

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-023 Onboarding Intelligence Engine. Ce module génère un plan d'onboarding personnalisé à partir du profil du candidat retenu et surveille les signaux d'alerte pendant la période d'onboarding pour réduire les échecs de recrutement dus à un mauvais onboarding (50% des échecs).

---

## 2. Principe Fondateur

50% des échecs de recrutement ne viennent pas du mauvais choix. Ils viennent du mauvais onboarding. Un grand cabinet ne s'arrête pas à la signature du contrat. Ce module génère un plan d'onboarding personnalisé (Semaine 1 Découverte, Mois 1 Installation, Mois 3 Confirmation, Mois 6 Autonomie) basé sur les forces et zones de développement du candidat, et surveille les signaux d'alerte (absentéisme, feedbacks négatifs, isolement, non-atteinte des objectifs, questionnements) pour déclencher des alertes au DRH et au manager avec analyse des causes et plan d'action correctif.

---

## 3. Capacités du Module

### CAPACITÉ 1 — Plan d'Onboarding Personnalisé

Généré automatiquement à partir du profil du candidat retenu.

**Semaine 1 — Découverte :**
- Priorités d'intégration basées sur les forces du candidat et ses zones de développement
- Personnes clés à rencontrer en priorité
- Documents et processus à maîtriser d'abord
- Points de vigilance pour le manager

**Mois 1 — Installation :**
- Objectifs de fin de mois
- Premiers livrables attendus
- Points de feedback planifiés
- Signaux de succès à surveiller
- Signaux d'alerte à surveiller

**Mois 3 — Confirmation :**
- Bilan à 90 jours structuré
- Évaluation de l'adéquation réelle
- Ajustement du plan si nécessaire
- Décision de confirmation de période d'essai

**Mois 6 — Autonomie :**
- Bilan à 6 mois
- Comparaison avec les prédictions du moteur (MVP-021)
- Axes de développement pour l'année 1

---

### CAPACITÉ 2 — Alertes Onboarding

Le moteur surveille les signaux d'alerte pendant la période d'onboarding.

**Signaux d'alerte précoce :**
- Absentéisme les premières semaines
- Feedbacks négatifs du manager
- Isolement dans l'équipe
- Non-atteinte des premiers objectifs
- Questionnements sur le poste ou l'entreprise

**Protocole d'alerte :**
Si un signal est détecté :
- Alerte au DRH et au manager
- Analyse des causes possibles
- Plan d'action correctif suggéré
- Suivi renforcé planifié

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Génération du Plan d'Onboarding

**Scénario :** Un candidat est retenu pour un poste.

**Action :**
1. Le moteur collecte les données du candidat (CV, entretiens, évaluations)
2. Le moteur identifie les forces et zones de développement
3. Le moteur génère le plan d'onboarding personnalisé (Semaine 1, Mois 1, Mois 3, Mois 6)
4. Le moteur fournit les priorités d'intégration, personnes clés, documents à maîtriser
5. Le moteur fournit les objectifs, livrables, points de feedback

**Résultat :** Le manager dispose d'un plan d'onboarding personnalisé avec priorités, objectifs, et points de vigilance.

---

### CAS D'USAGE 2 — Surveillance des Signaux d'Alerte

**Scénario :** Un nouveau collaborateur est en période d'onboarding.

**Action :**
1. Le moteur surveille les signaux d'alerte (absentéisme, feedbacks, isolement, objectifs, questionnements)
2. Le moteur détecte un signal d'alerte (ex: absentéisme les premières semaines)
3. Le moteur envoie une alerte au DRH et au manager
4. Le moteur analyse les causes possibles
5. Le moteur suggère un plan d'action correctif
6. Le moteur planifie un suivi renforcé

**Résultat :** Le DRH et le manager sont alertés précocement et disposent d'un plan d'action correctif.

---

### CAS D'USAGE 3 — Bilan à 90 Jours

**Scénario :** Le collaborateur atteint 90 jours dans le poste.

**Action :**
1. Le moteur génère un bilan structuré à 90 jours
2. Le moteur évalue l'adéquation réelle avec le poste
3. Le moteur compare avec les prédictions du moteur (MVP-021)
4. Le moteur suggère des ajustements du plan si nécessaire
5. Le moteur recommande la décision de confirmation de période d'essai

**Résultat :** Le manager dispose d'un bilan structuré avec recommandation de décision.

---

### CAS D'USAGE 4 — Bilan à 6 Mois

**Scénario :** Le collaborateur atteint 6 mois dans le poste.

**Action :**
1. Le moteur génère un bilan à 6 mois
2. Le moteur compare avec les prédictions du moteur (MVP-021)
3. Le moteur identifie les écarts entre prédictions et réalité
4. Le moteur définit les axes de développement pour l'année 1
5. Le moteur fournit des recommandations pour la suite

**Résultat :** Le manager dispose d'un bilan à 6 mois avec axes de développement pour l'année 1.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE ONBOARDING INTELLIGENCE ENGINE                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES CANDIDAT                                     │   │
│ │ - CV et parcours                                    │   │
│ │ - Entretiens réalisés                               │   │
│ │ - Évaluations (soft skills, compétences)            │   │
│ │ - Prédictions de succès (MVP-021)                   │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR DE GÉNÉRATION DE PLAN                       │   │
│ │ - Identification des forces et zones de développement│   │
│ │ - Génération du plan Semaine 1                      │   │
│ │ - Génération du plan Mois 1                         │   │
│ │ - Génération du plan Mois 3                         │   │
│ │ - Génération du plan Mois 6                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS ONBOARDING INTELLIGENCE ENGINE           │   │
│ │ - Plan d'Onboarding Personnalisé                   │   │
│ │ - Alertes Onboarding                               │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ SURVEILLANCE DES SIGNAUX D'ALERTE                  │   │
│ │ - Absentéisme                                       │   │
│ │ - Feedbacks du manager                              │   │
│ │ - Isolement dans l'équipe                           │   │
│ │ - Non-atteinte des objectifs                        │   │
│ │ - Questionnements                                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ PROTOCOLE D'ALERTE                                 │   │
│ │ - Alerte au DRH et au manager                       │   │
│ │ - Analyse des causes possibles                      │   │
│ │ - Plan d'action correctif suggéré                   │   │
│ │ - Suivi renforcé planifié                           │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ BILANS ET ÉVALUATIONS                              │   │
│ │ - Bilan à 90 jours                                 │   │
│ │ - Bilan à 6 mois                                   │   │
│ │ - Comparaison avec prédictions (MVP-021)            │   │
│ │ - Axes de développement                            │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Plan d'onboarding personnalisé                   │   │
│ │ - Alertes en temps réel                            │   │
│ │ - Bilans structurés                                │   │
│ │ - Recommandations d'action                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-001 CV Intelligence :**
- Utilisation des données CV pour identifier les forces et zones de développement
- Utilisation des données de parcours pour adapter le plan d'onboarding

**MVP-013 Interview Intelligence :**
- Utilisation des données d'entretien pour identifier les motivations et attentes
- Utilisation des données d'entretien pour adapter les priorités d'intégration

**MVP-014 Soft Skills Intelligence :**
- Utilisation des données de soft skills pour adapter le style de management
- Utilisation des données de soft skills pour adapter les points de vigilance

**MVP-021 Predictive Success Engine :**
- Utilisation des prédictions de succès pour adapter le plan d'onboarding
- Comparaison des résultats réels avec les prédictions à 6 mois

---

## 7. Structure de Données (TypeScript)

```typescript
interface Onboarding {
  onboardingId: string;
  candidateId: string;
  jobId: string;
  startDate: Date;
  
  personalizedPlan: PersonalizedOnboardingPlan;
  alerts?: OnboardingAlert[];
  reviews?: OnboardingReview[];
}

interface PersonalizedOnboardingPlan {
  planId: string;
  candidateId: string;
  jobId: string;
  generatedAt: Date;
  
  week1Discovery: Week1Discovery;
  month1Installation: Month1Installation;
  month3Confirmation: Month3Confirmation;
  month6Autonomy: Month6Autonomy;
}

interface Week1Discovery {
  integrationPriorities: {
    priority: string;
    description: string;
    basedOn: 'strength' | 'development_zone';
  }[];
  
  keyPeopleToMeet: {
    name: string;
    role: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  
  documentsToMaster: {
    document: string;
    priority: 'high' | 'medium' | 'low';
    deadline: string;
  }[];
  
  managerWatchPoints: {
    point: string;
    description: string;
    action: string;
  }[];
}

interface Month1Installation {
  monthEndObjectives: {
    objective: string;
    description: string;
    measurable: boolean;
  }[];
  
  firstDeliverables: {
    deliverable: string;
    deadline: string;
    criteria: string[];
  }[];
  
  feedbackPoints: {
    date: Date;
    type: 'formal' | 'informal';
    focus: string[];
  }[];
  
  successSignals: string[];
  alertSignals: string[];
}

interface Month3Confirmation {
  ninetyDayReview: {
    structure: string[];
    evaluationCriteria: string[];
  };
  
  realFitAssessment: {
    criteria: string[];
    rating: number;
    comments: string;
  };
  
  planAdjustments: {
    adjustment: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  
  probationDecision: {
    recommendation: 'confirm' | 'extend' | 'terminate';
    justification: string;
    conditions?: string[];
  };
}

interface Month6Autonomy {
  sixMonthReview: {
    structure: string[];
    evaluationCriteria: string[];
  };
  
  predictionComparison: {
    prediction: SuccessPrediction;
    actualResults: ActualResults;
    gaps: string[];
  };
  
  developmentAxes: {
    axis: string;
    description: string;
    timeline: string;
    resources: string[];
  }[];
}

interface OnboardingAlert {
  alertId: string;
  onboardingId: string;
  candidateId: string;
  detectedAt: Date;
  
  signal: 'absenteeism' | 'negative_feedback' | 'isolation' | 'objective_miss' | 'questioning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  details: string;
  
  causeAnalysis: {
    possibleCauses: string[];
    likelyCause: string;
    confidence: number;
  };
  
  correctiveAction: {
    action: string;
    timeline: string;
    responsible: string;
  };
  
  enhancedFollowUp: {
    frequency: string;
    focus: string[];
    responsible: string;
  };
  
  notifiedTo: string[];
}

interface OnboardingReview {
  reviewId: string;
  onboardingId: string;
  candidateId: string;
  reviewDate: Date;
  
  type: '90_day' | '6_month';
  
  reviewData: any;
  
  outcomes: {
    objectivesMet: boolean;
    performanceRating: number;
    satisfactionRating: number;
    nextSteps: string[];
  };
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération de plans | Plans générés / recrutements | ≥ 90% |
| Taux de détection d'alertes | Alertes détectes / onboardings | ≥ 70% |
| Taux de correction | Actions correctives appliquées / alertes | ≥ 80% |
| Satisfaction manager | Satisfaction avec les plans d'onboarding | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des échecs d'onboarding | Réduction des départs < 6 mois | ≥ 40% |
| Amélioration de l'intégration | Satisfaction des nouveaux collaborateurs | ≥ 4.5/5 |
- Amélioration de la performance à 6 mois | Performance vs prédictions (MVP-021) | ≥ 80% |

---

## 9. Documents du Module

- **DOC-023-01** : Brief du Module (ce document)
- **DOC-023-02** : Plan d'Onboarding Personnalisé
- **DOC-023-03** : Alertes Onboarding et Protocole

---

## 10. Conclusion

MVP-023 Onboarding Intelligence Engine génère un plan d'onboarding personnalisé à partir du profil du candidat retenu et surveille les signaux d'alerte pendant la période d'onboarding pour réduire les échecs de recrutement dus à un mauvais onboarding (50% des échecs). Le plan d'onboarding couvre 4 phases (Semaine 1 Découverte, Mois 1 Installation, Mois 3 Confirmation, Mois 6 Autonomie) avec priorités d'intégration, objectifs, livrables, points de feedback, et bilans structurés. Le système surveille les signaux d'alerte (absentéisme, feedbacks négatifs, isolement, non-atteinte des objectifs, questionnements) et déclenche des alertes au DRH et au manager avec analyse des causes et plan d'action correctif. Le module s'intègre avec les modules existants (MVP-001, MVP-013, MVP-014, MVP-021).

**Points clés :**
- 4 phases d'onboarding (Semaine 1, Mois 1, Mois 3, Mois 6)
- Plan personnalisé basé sur les forces et zones de développement
- Priorités d'intégration, personnes clés, documents à maîtriser
- Objectifs, livrables, points de feedback planifiés
- Bilans structurés à 90 jours et 6 mois
- Comparaison avec les prédictions du moteur (MVP-021)
- 5 signaux d'alerte surveillés (absentéisme, feedbacks, isolement, objectifs, questionnements)
- Protocole d'alerte avec analyse des causes et plan d'action correctif
- Intégration avec les modules existants
