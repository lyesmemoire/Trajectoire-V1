# DOC-022-01 : Brief du Module Diversity & Inclusion Engine

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-022 Diversity & Inclusion Engine. Ce module intègre la diversité et l'inclusion dans chaque étape du processus de recrutement, pas comme une case à cocher. Le module audite le processus de recrutement pour détecter les biais, recommande des viviers de candidats diversifiés, et produit des rapports D&I par recrutement et pour l'entreprise sur une période.

---

## 2. Principe Fondateur

La diversité n'est pas une contrainte. C'est un avantage compétitif démontré. Un grand cabinet mondial intègre D&I dans chaque étape du processus, pas comme une case à cocher. Ce module audite le processus de recrutement (offre d'emploi, sélection des CV, entretien, décision finale) pour détecter les biais, recommande des viviers de candidats diversifiés (écoles diverses, viviers spécifiques, critères élargis), et produit des rapports D&I par recrutement et pour l'entreprise sur une période avec recommandations d'amélioration.

---

## 3. Capacités du Module

### CAPACITÉ 1 — Audit D&I du Processus

Pour chaque processus de recrutement, le moteur audite :

**Étape 1 — L'offre d'emploi :**
- Détection du langage genré (mots masculins dominants : "dynamique, compétitif, assertif" → suggestion de neutralisation)
- Détection des critères non pertinents ("Bac+5 obligatoire" pour un poste qui ne le nécessite pas)
- Détection des biais d'expérience ("10 ans minimum" qui exclut les femmes ayant eu des interruptions)
- Accessibilité de l'annonce (lisible par tous les profils cibles)

**Étape 2 — La sélection des CV :**
- Alerte si le taux de sélection diffère significativement selon les groupes de candidats à compétences équivalentes
- Recommandation de CV anonymisé si le biais de sélection est détecté

**Étape 3 — L'entretien :**
- Détection des questions inadaptées
- Vérification de la grille d'évaluation (critères objectifs et mesurables)
- Alerte si la cotation diverge selon des variables non pertinentes

**Étape 4 — La décision finale :**
- Analyse de la décision finale sur critères objectifs uniquement
- Alerte si le raisonnement contient des éléments non pertinents

---

### CAPACITÉ 2 — Sourcing Diversifié

Le moteur recommande des viviers de candidats diversifiés :

**Écoles et universités diverses :**
- Pas seulement les grandes écoles
- Universités, IUT, alternance, autodidactes

**Viviers spécifiques :**
- Structures spécialisées handicap
- Associations pour les quartiers
- Programmes de reconversion
- Réseaux de femmes dans les métiers sous-représentés

**Critères de sourcing élargis :**
- Valoriser les parcours atypiques
- Valoriser les reconversions réussies
- Valoriser l'expérience internationale

---

### CAPACITÉ 3 — Rapport D&I par Recrutement

Pour chaque recrutement finalisé :
- Profil de diversité du pipeline
- Taux de sélection par étape
- Décision finale et profil retenu
- Écarts détectés et actions correctives

Pour l'entreprise sur une période :
- Évolution de la diversité des recrutements
- Comparaison avec les objectifs D&I
- Recommandations d'amélioration

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Audit d'une Offre d'Emploi

**Scénario :** Un recruteur rédige une offre d'emploi.

**Action :**
1. Le moteur analyse le langage de l'offre
2. Le moteur détecte les mots genrés dominants
3. Le moteur détecte les critères non pertinents
4. Le moteur détecte les biais d'expérience
5. Le moteur suggère des reformulations neutres

**Résultat :** Le recruteur dispose d'une offre d'emploi neutre et accessible à tous les profils cibles.

---

### CAS D'USAGE 2 — Audit de la Sélection des CV

**Scénario :** Un recruteur sélectionne des CV pour un poste.

**Action :**
1. Le moteur analyse le taux de sélection par groupe de candidats
2. Le moteur détecte les écarts significatifs à compétences équivalentes
3. Le moteur recommande le CV anonymisé si biais détecté
4. Le moteur alerte sur les critères de sélection potentiellement biaisés

**Résultat :** Le recruteur dispose d'une analyse de la sélection avec alertes et recommandations pour réduire les biais.

---

### CAS D'USAGE 3 — Recommandation de Viviers Diversifiés

**Scénario :** Un recruteur cherche à élargir son vivier de candidats.

**Action :**
1. Le moteur identifie les viviers actuels
2. Le moteur recommande des viviers diversifiés
3. Le moteur suggère des critères de sourcing élargis
4. Le moteur fournit des contacts et ressources pour les viviers recommandés

**Résultat :** Le recruteur dispose d'une liste de viviers diversifiés avec critères de sourcing élargis.

---

### CAS D'USAGE 4 — Rapport D&I par Recrutement

**Scénario :** Un recrutement est finalisé.

**Action :**
1. Le moteur analyse le profil de diversité du pipeline
2. Le moteur calcule le taux de sélection par étape
3. Le moteur identifie les écarts détectés
4. Le moteur recommande des actions correctives

**Résultat :** Le recruteur dispose d'un rapport D&I complet pour le recrutement avec recommandations d'amélioration.

---

### CAS D'USAGE 5 — Rapport D&I Périodique

**Scénario :** L'entreprise veut analyser l'évolution de la diversité des recrutements sur une période.

**Action :**
1. Le moteur agrège les données de tous les recrutements sur la période
2. Le moteur analyse l'évolution de la diversité
3. Le moteur compare avec les objectifs D&I
4. Le moteur recommande des améliorations

**Résultat :** L'entreprise dispose d'un rapport D&I périodique avec recommandations d'amélioration.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE DIVERSITY & INCLUSION ENGINE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES RECRUTEMENT                                   │   │
│ │ - Offres d'emploi                                    │   │
│ │ - CV des candidats                                   │   │
│ │ - Grilles d'évaluation                               │   │
│ │ - Décisions finales                                  │   │
│ │ - Pipeline de recrutement                            │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR D'AUDIT D&I                                  │   │
│ │ - Détection du langage genré                        │   │
│ │ - Détection des critères non pertinents             │   │
│ │ - Détection des biais d'expérience                  │   │
│ │ - Analyse du taux de sélection                     │   │
│ │ - Vérification des grilles d'évaluation             │   │
│ │ - Analyse de la décision finale                     │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS DIVERSITY & INCLUSION ENGINE              │   │
│ │ - Audit D&I du Processus                           │   │
│ │ - Sourcing Diversifié                              │   │
│ │ - Rapport D&I par Recrutement                      │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ RECOMMANDATIONS                                     │   │
│ │ - Reformulations neutres                           │   │
│ │ - Viviers diversifiés                              │   │
│ │ - Critères de sourcing élargis                     │   │
│ │ - Actions correctives                              │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ RAPPORTS D&I                                       │   │
│ │ - Rapport par recrutement                          │   │
│ │ - Rapport périodique                               │   │
│ │ - Comparaison avec objectifs D&I                   │   │
│ │ - Recommandations d'amélioration                   │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Audit en temps réel                              │   │
│ │ - Recommandations de sourcing                      │   │
│ │ - Rapports D&I                                    │   │
│ │ - Tableaux de bord                                 │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-003 Job Intelligence :**
- Utilisation des données de poste pour auditer les critères pertinents
- Utilisation des données de poste pour recommander des viviers adaptés

**MVP-001 CV Intelligence :**
- Utilisation des données CV pour analyser le profil de diversité du pipeline
- Utilisation des données CV pour détecter les parcours atypiques

**MVP-013 Interview Intelligence :**
- Utilisation des données d'entretien pour vérifier les grilles d'évaluation
- Utilisation des données d'entretien pour détecter les questions inadaptées

**MVP-004 Recruteur Workspace :**
- Intégration de l'audit D&I dans l'interface du recruteur
- Affichage des alertes et recommandations en temps réel

---

## 7. Structure de Données (TypeScript)

```typescript
interface DiversityInclusion {
  recruitmentId: string;
  auditedAt: Date;
  
  audit: DIProcessAudit;
  sourcingRecommendations?: SourcingRecommendations;
  report?: DIReport;
}

interface DIProcessAudit {
  auditId: string;
  recruitmentId: string;
  auditedAt: Date;
  
  jobOfferAudit: JobOfferAudit;
  cvSelectionAudit: CVSelectionAudit;
  interviewAudit: InterviewAudit;
  finalDecisionAudit: FinalDecisionAudit;
  
  overallScore: number; // 0-100
  alerts: DIAlert[];
  recommendations: DIRecommendation[];
}

interface JobOfferAudit {
  jobId: string;
  jobOfferText: string;
  
  genderedLanguage: {
    detected: boolean;
    masculineWords: string[];
    neutralizationSuggestions: string[];
  };
  
  irrelevantCriteria: {
    detected: boolean;
    criteria: string[];
    justification: string[];
  };
  
  experienceBias: {
    detected: boolean;
    requirements: string[];
    impact: string[];
  };
  
  accessibility: {
    score: number;
    issues: string[];
  };
}

interface CVSelectionAudit {
  selectionData: SelectionData;
  
  selectionRateByGroup: {
    group: string;
    selectionRate: number;
    candidateCount: number;
    selectedCount: number;
  }[];
  
  biasDetected: boolean;
  biasDetails: string[];
  
  anonymousCVRecommended: boolean;
  justification: string;
}

interface InterviewAudit {
  interviewData: InterviewData;
  
  inappropriateQuestions: {
    detected: boolean;
    questions: string[];
    alternatives: string[];
  };
  
  evaluationGrid: {
    verified: boolean;
    objectiveCriteria: string[];
    measurableCriteria: string[];
    issues: string[];
  };
  
  scoringBias: {
    detected: boolean;
    irrelevantVariables: string[];
    divergenceDetails: string[];
  };
}

interface FinalDecisionAudit {
  decisionData: DecisionData;
  
  objectiveCriteriaOnly: boolean;
  irrelevantElements: string[];
  
  reasoningAnalysis: {
    objective: string[];
    subjective: string[];
    irrelevant: string[];
  };
}

interface DIAlert {
  type: 'gendered_language' | 'irrelevant_criteria' | 'experience_bias' | 'selection_bias' | 'interview_bias' | 'decision_bias';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
}

interface SourcingRecommendations {
  recommendationId: string;
  recruitmentId: string;
  generatedAt: Date;
  
  currentPools: string[];
  recommendedPools: {
    name: string;
    type: 'university' | 'specialized' | 'network' | 'program';
    description: string;
    contacts: string[];
  }[];
  
  expandedCriteria: {
    criterion: string;
    description: string;
    examples: string[];
  }[];
}

interface DIReport {
  reportId: string;
  recruitmentId: string;
  generatedAt: Date;
  
  pipelineDiversityProfile: DiversityProfile;
  selectionRatesByStage: SelectionRatesByStage;
  
  finalDecision: {
    selectedProfile: DiversityProfile;
    justification: string;
  };
  
  detectedGaps: string[];
  correctiveActions: string[];
}

interface DiversityProfile {
  gender: {
    male: number;
    female: number;
    nonBinary: number;
    preferNotToSay: number;
  };
  
  age: {
    under25: number;
    age25to34: number;
    age35to44: number;
    age45to54: number;
    age55plus: number;
  };
  
  education: {
    grandesEcoles: number;
    universities: number;
    iut: number;
    alternance: number;
    autodidactes: number;
  };
  
  disability: {
    withDisability: number;
    withoutDisability: number;
    preferNotToSay: number;
  };
  
  socioeconomic: {
    priorityArea: number;
    nonPriorityArea: number;
    preferNotToSay: number;
  };
}

interface SelectionRatesByStage {
  stage: string;
  totalCandidates: number;
  diversityProfile: DiversityProfile;
  selectionRate: number;
}

interface PeriodicDIReport {
  reportId: string;
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  
  recruitmentCount: number;
  
  diversityEvolution: {
    period: string;
    diversityProfile: DiversityProfile;
  }[];
  
  comparisonWithObjectives: {
    objective: string;
    target: number;
    actual: number;
    gap: number;
  }[];
  
  improvementRecommendations: string[];
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'audit | Processus audités / total | ≥ 90% |
| Taux de détection de biais | Biais détectés / audits | ≥ 70% |
| Taux de correction | Recommandations appliquées / total | ≥ 60% |
| Satisfaction recruteur | Satisfaction avec les recommandations | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration de la diversité | Augmentation de la diversité des recrutements | ≥ 20% |
| Réduction des biais de sélection | Réduction des écarts de sélection | ≥ 30% |
| Élargissement des viviers | Augmentation du nombre de viviers utilisés | ≥ 50% |

---

## 9. Documents du Module

- **DOC-022-01** : Brief du Module (ce document)
- **DOC-022-02** : Audit D&I du Processus
- **DOC-022-03** : Sourcing Diversifié
- **DOC-022-04** : Rapport D&I et Indicateurs

---

## 10. Conclusion

MVP-022 Diversity & Inclusion Engine intègre la diversité et l'inclusion dans chaque étape du processus de recrutement, pas comme une case à cocher. Le module audite le processus de recrutement (offre d'emploi, sélection des CV, entretien, décision finale) pour détecter les biais, recommande des viviers de candidats diversifiés (écoles diverses, viviers spécifiques, critères élargis), et produit des rapports D&I par recrutement et pour l'entreprise sur une période avec recommandations d'amélioration. Le module est conforme au protocole anti-biais (RH-860) et s'intègre avec les modules existants.

**Points clés :**
- 4 étapes d'audit (offre d'emploi, sélection CV, entretien, décision finale)
- Détection du langage genré, critères non pertinents, biais d'expérience
- Analyse du taux de sélection par groupe
- Recommandation de CV anonymisé si biais détecté
- 3 types de viviers diversifiés (écoles, spécialisés, réseaux)
- Critères de sourcing élargis (parcours atypiques, reconversions, expérience internationale)
- Rapport D&I par recrutement et périodique
- Comparaison avec les objectifs D&I
- Conformité au protocole anti-biais (RH-860)
- Intégration avec les modules existants
