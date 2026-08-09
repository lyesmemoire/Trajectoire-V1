# DOC-026-01 : Brief du Module Employer Branding & Candidate Experience

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-026 Employer Branding & Candidate Experience. Ce module analyse et synthétise la marque employeur (ce que les candidats disent, ce que l'entreprise promet, les gaps détectés) et mesure et optimise l'expérience candidat à chaque étape (découverte de l'offre, processus de candidature, entretiens, décision) pour améliorer l'attractivité de l'entreprise et l'expérience des candidats.

---

## 2. Principe Fondateur

Un grand cabinet sait que les meilleurs candidats choisissent l'entreprise autant que l'entreprise les choisit. Ce module analyse et synthétise la marque employeur (analyse des avis Glassdoor/Indeed, analyse des feedbacks candidats, détection des points de friction dans l'expérience candidat, analyse des offres d'emploi et messages RH, cohérence entre la promesse et la réalité perçue, gaps détectés entre ce que l'entreprise dit et ce que les candidats et salariés disent, plan d'action pour réduire ces gaps). Le module mesure et optimise l'expérience candidat à chaque étape (découverte de l'offre, processus de candidature, entretiens, décision) avec indicateurs (clarté et attractivité de l'annonce, temps de lecture estimé, taux de candidature estimé, complexité du formulaire, délai de première réponse, qualité de l'accusé de réception, délai entre les étapes, qualité de la préparation des interviewers, expérience vécue par le candidat, délai d'annonce de la décision, qualité du feedback en cas de refus, Net Promoter Score candidat).

---

## 3. Capacités du Module

### CAPACITÉ 1 — Analyse de la Marque Employeur

Le moteur analyse et synthétise :

**Ce que les candidats disent :**
- Analyse des avis Glassdoor / Indeed
- Analyse des feedbacks candidats après les processus de recrutement
- Détection des points de friction dans l'expérience candidat

**Ce que l'entreprise promet :**
- Analyse des offres d'emploi
- Analyse des messages RH
- Cohérence entre la promesse et la réalité perçue

**Les gaps détectés :**
- Ce que l'entreprise dit qu'elle est
- Ce que les candidats et salariés disent qu'elle est vraiment
- Plan d'action pour réduire ces gaps

---

### CAPACITÉ 2 — Expérience Candidat

Le moteur mesure et optimise l'expérience candidat à chaque étape :

**Étape 1 — Découverte de l'offre :**
- Clarté et attractivité de l'annonce
- Temps de lecture estimé
- Taux de candidature estimé

**Étape 2 — Processus de candidature :**
- Complexité du formulaire
- Délai de première réponse
- Qualité de l'accusé de réception

**Étape 3 — Entretiens :**
- Délai entre les étapes
- Qualité de la préparation des interviewers
- Expérience vécue par le candidat

**Étape 4 — Décision :**
- Délai d'annonce de la décision
- Qualité du feedback en cas de refus
- Net Promoter Score candidat (recommanderait-il ce processus ?)

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Analyse de la Marque Employeur

**Scénario :** L'entreprise veut analyser sa marque employeur.

**Action :**
1. Le moteur analyse les avis Glassdoor/Indeed
2. Le moteur analyse les feedbacks candidats
3. Le moteur analyse les offres d'emploi et messages RH
4. Le moteur détecte les gaps entre promesse et réalité
5. Le moteur génère un plan d'action pour réduire les gaps

**Résultat :** L'entreprise dispose d'une analyse complète de sa marque employeur avec gaps détectés et plan d'action.

---

### CAS D'USAGE 2 — Mesure de l'Expérience Candidat

**Scénario :** L'entreprise veut mesurer l'expérience candidat à chaque étape.

**Action :**
1. Le moteur mesure l'expérience à l'étape de découverte de l'offre
2. Le moteur mesure l'expérience à l'étape de candidature
3. Le moteur mesure l'expérience à l'étape des entretiens
4. Le moteur mesure l'expérience à l'étape de décision
5. Le moteur calcule le Net Promoter Score candidat

**Résultat :** L'entreprise dispose d'une mesure complète de l'expérience candidat avec indicateurs par étape.

---

### CAS D'USAGE 3 — Optimisation de l'Expérience Candidat

**Scénario :** L'entreprise veut optimiser l'expérience candidat.

**Action :**
1. Le moteur identifie les points de friction dans l'expérience candidat
2. Le moteur recommande des optimisations (amélioration de l'annonce, simplification du formulaire, réduction des délais, amélioration du feedback)
3. Le moteur estime l'impact des optimisations sur le Net Promoter Score

**Résultat :** L'entreprise dispose de recommandations d'optimisation avec impact estimé.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE EMPLOYER BRANDING & CANDIDATE EXPERIENCE       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES MARQUE EMPLOYEUR                           │   │
│ │ - Avis Glassdoor / Indeed                         │   │
│ │ - Feedbacks candidats                             │   │
│ │ - Offres d'emploi                                 │   │
│ │ - Messages RH                                     │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR D'ANALYSE DE LA MARQUE EMPLOYEUR          │   │
│ │ - Analyse des avis Glassdoor / Indeed             │   │
│ │ - Analyse des feedbacks candidats                 │   │
│ │ - Analyse des offres d'emploi                     │   │
│ │ - Analyse des messages RH                          │   │
│ │ - Détection des gaps                             │   │
│ │ - Génération du plan d'action                    │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS EMPLOYER BRANDING & CANDIDATE EXPERIENCE│   │
│ │ - Analyse de la Marque Employeur                 │   │
│ │ - Expérience Candidat                             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MESURE DE L'EXPÉRIENCE CANDIDAT                  │   │
│ │ - Étape 1 : Découverte de l'offre                │   │
│ │ - Étape 2 : Processus de candidature              │   │
│ │ - Étape 3 : Entretiens                            │   │
│ │ - Étape 4 : Décision                              │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ NET PROMOTER SCORE CANDIDAT                       │   │
│ │ - Score NPS                                        │   │
│ │ - Recommandation                                   │   │
│ │ - Impact sur l'attractivité                       │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Analyse de la marque employeur                  │   │
│ │ - Mesure de l'expérience candidat                │   │
│ │ - Recommandations d'optimisation                 │   │
│ │ - Net Promoter Score candidat                     │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-003 Job Intelligence :**
- Utilisation des données des offres d'emploi pour analyser la promesse de l'entreprise
- Utilisation des données de clarté et attractivité des annonces

**MVP-013 Interview Intelligence :**
- Utilisation des données d'entretien pour mesurer l'expérience candidat
- Utilisation des données de préparation des interviewers

**MVP-017 Market Intelligence :**
- Utilisation des données de marché pour comparer la marque employeur avec les concurrents

---

## 7. Structure de Données (TypeScript)

```typescript
interface EmployerBranding {
  brandingId: string;
  analyzedAt: Date;
  
  candidatePerception: CandidatePerception;
  companyPromise: CompanyPromise;
  detectedGaps: DetectedGap[];
  actionPlan: ActionPlan;
}

interface CandidatePerception {
  glassdoorReviews: {
    averageRating: number;
    totalReviews: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
  };
  
  indeedReviews: {
    averageRating: number;
    totalReviews: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
  };
  
  candidateFeedbacks: {
    averageRating: number;
    totalFeedbacks: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyThemes: string[];
  };
  
  frictionPoints: string[];
}

interface CompanyPromise {
  jobOffers: {
    clarity: number;
    attractiveness: number;
    keyMessages: string[];
  };
  
  hrMessages: {
    clarity: number;
    attractiveness: number;
    keyMessages: string[];
  };
  
  overallPromise: string[];
}

interface DetectedGap {
  gap: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  impact: string;
}

interface ActionPlan {
  actions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[];
}

interface CandidateExperience {
  experienceId: string;
  candidateId: string;
  recruitmentId: string;
  measuredAt: Date;
  
  stage1Discovery: {
    clarity: number;
    attractiveness: number;
    estimatedReadingTime: number;
    estimatedApplicationRate: number;
  };
  
  stage2Application: {
    formComplexity: number;
    firstResponseDelay: number;
    acknowledgmentQuality: number;
  };
  
  stage3Interviews: {
    stageDelay: number;
    interviewerPreparationQuality: number;
    candidateExperience: number;
  };
  
  stage4Decision: {
    decisionAnnouncementDelay: number;
    rejectionFeedbackQuality: number;
  };
  
  netPromoterScore: {
    score: number;
    recommendation: string;
  };
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de collecte de feedbacks | Feedbacks collectés / candidats | ≥ 70% |
| Taux de détection de gaps | Gaps détectés / gaps réels | ≥ 80% |
| Taux d'adoption des actions | Actions appliquées / recommandées | ≥ 70% |
| Satisfaction DRH | Satisfaction avec l'analyse | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration du NPS candidat | Amélioration du Net Promoter Score | ≥ 20% |
- Amélioration de l'attractivité | Amélioration du taux de candidature | ≥ 15% |
- Réduction des gaps | Réduction des gaps promesse/réalité | ≥ 30% |

---

## 9. Documents du Module

- **DOC-026-01** : Brief du Module (ce document)
- **DOC-026-02** : Analyse de la Marque Employeur
- **DOC-026-03** : Expérience Candidat et Optimisation

---

## 10. Conclusion

MVP-026 Employer Branding & Candidate Experience analyse et synthétise la marque employeur (ce que les candidats disent via Glassdoor/Indeed et feedbacks, ce que l'entreprise promet via offres d'emploi et messages RH, gaps détectés entre promesse et réalité, plan d'action pour réduire les gaps) et mesure et optimise l'expérience candidat à chaque étape (découverte de l'offre, processus de candidature, entretiens, décision) avec indicateurs (clarté, attractivité, délais, qualité, Net Promoter Score). Le module permet à l'entreprise d'améliorer son attractivité et l'expérience des candidats pour attirer les meilleurs talents. Le module s'intègre avec les modules existants (MVP-003, MVP-013, MVP-017).

**Points clés :**
- Analyse des avis Glassdoor/Indeed et feedbacks candidats
- Analyse des offres d'emploi et messages RH
- Détection des gaps promesse/réalité
- Plan d'action pour réduire les gaps
- 4 étapes de l'expérience candidat mesurées
- 11 indicateurs d'expérience candidat
- Net Promoter Score candidat
- Recommandations d'optimisation
- Intégration avec les modules existants
