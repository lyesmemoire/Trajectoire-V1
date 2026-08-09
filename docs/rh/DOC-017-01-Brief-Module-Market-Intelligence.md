# DOC-017-01 : Brief du Module Market Intelligence

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-017 Market Intelligence. Ce module fournit une intelligence du marché du travail en temps réel pour permettre aux recruteurs de prendre des décisions éclairées sur les salaires, la tension du marché, les attentes des candidats, et les délais de recrutement.

---

## 2. Principe Fondateur

Un grand cabinet mondial ne recrute jamais sans connaître parfaitement le marché. Il sait ce que vaut réellement un profil sur le marché, où sont les viviers de talents, quels sont les délais réels de recrutement, quelles sont les attentes réelles des candidats, ce que font les concurrents, et quels sont les signaux de tension du marché. Ce module construit cette intelligence.

---

## 3. Capacités du Module

### CAPACITÉ 1 — Benchmark Salarial Temps Réel

Pour chaque poste ouvert, le moteur produit une fourchette salariale marché ajustée par secteur, taille d'entreprise, zone géographique, niveau d'expérience, stack technologique, et rareté du profil.

**Fourchette marché :**
- Percentile 25 : Offre basse du marché
- Médiane : Offre standard du marché
- Percentile 75 : Offre compétitive
- Percentile 90 : Offre premium (pour attirer les meilleurs profils)

**Alerte de cohérence :**
Si l'enveloppe budgétaire du client est inférieure au percentile 25 du marché, alerte immédiate avec recommandations.

---

### CAPACITÉ 2 — Tension du Marché par Profil

Pour chaque type de profil, le moteur évalue l'indice de tension (Faible/Modéré/Élevé/Critique) et fournit des conséquences sur la stratégie (délai de recrutement, nombre de candidatures espérées, niveau de sélectivité, stratégie de sourcing, arguments de séduction, risque de contre-offre).

---

### CAPACITÉ 3 — Intelligence des Attentes Candidats

Ce que les candidats de ce profil valorisent réellement en ce moment (télétravail, progression de carrière, impact, rémunération, management, culture, technologies, réputation). Le moteur alerte sur les gaps entre ce que l'entreprise offre et ce que le marché attend.

---

### CAPACITÉ 4 — Benchmark Délais de Recrutement

Par type de poste et niveau : délai moyen du marché, délai interne historique, écart et recommandations pour l'accélérer, étapes qui allongent inutilement le processus.

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Ouverture de Poste

**Scénario :** Un recruteur ouvre un nouveau poste.

**Action :**
1. Le moteur génère automatiquement le benchmark salarial pour ce poste
2. Le moteur évalue la tension du marché pour ce profil
3. Le moteur identifie les attentes candidates pour ce profil
4. Le moteur fournit le délai de recrutement estimé

**Résultat :** Le recruteur dispose de toutes les informations nécessaires pour définir une stratégie de recrutement réaliste et compétitive.

---

### CAS D'USAGE 2 — Ajustement Budgétaire

**Scénario :** Le budget proposé est inférieur au marché.

**Action :**
1. Le moteur détecte l'incohérence budgétaire
2. Le moteur alerte le recruteur
3. Le moteur propose des options : réviser le budget, réviser le profil, réviser les critères non négociables

**Résultat :** Le recruteur peut prendre une décision éclairée et éviter de perdre du temps sur un budget irréaliste.

---

### CAS D'USAGE 3 — Stratégie de Sourcing

**Scénario :** Le recruteur doit définir sa stratégie de sourcing.

**Action :**
1. Le moteur fournit l'indice de tension du marché
2. Le moteur recommande la stratégie de sourcing adaptée
3. Le moteur identifie les viviers de talents potentiels
4. Le moteur suggère les arguments de séduction prioritaires

**Résultat :** Le recruteur adapte sa stratégie à la réalité du marché et maximise ses chances de succès.

---

### CAS D'USAGE 4 — Optimisation du Processus

**Scénario :** L'entreprise veut réduire ses délais de recrutement.

**Action :**
1. Le moteur fournit le benchmark des délais de recrutement
2. Le moteur compare avec les délais internes historiques
3. Le moteur identifie les étapes qui allongent inutilement le processus
4. Le moteur recommande des actions pour accélérer

**Résultat :** L'entreprise optimise son processus et réduit ses délais de recrutement.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE MARKET INTELLIGENCE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DONNÉES MARCHÉ (Sources Externes)                  │   │
│  │ - Sites d'offres d'emploi                          │   │
│  │ - Plateformes de salaire                           │   │
│  │ - Enquêtes RH                                      │   │
│  │ - Rapports sectoriels                              │   │
│  │ - Données gouvernementales                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ MOTEUR D'AGRÉGATION ET D'ANALYSE                   │   │
│  │ - Collecte des données                             │   │
│  │ - Normalisation                                     │   │
│  │ - Calcul des percentiles                            │   │
│  │ - Évaluation de la tension                         │   │
│  │ - Analyse des tendances                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CAPACITÉS MARKET INTELLIGENCE                      │   │
│  │ - Benchmark Salarial Temps Réel                     │   │
│  │ - Tension du Marché par Profil                      │   │
│  │ - Intelligence des Attentes Candidats              │   │
│  │ - Benchmark Délais de Recrutement                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ INTERFACE UTILISATEUR                              │   │
│  │ - Dashboard Market Intelligence                     │   │
│  │ - Alertes et Recommandations                       │   │
│  │ - Rapports et Analyses                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-003 Job Intelligence :**
- Utilisation des données de poste pour le benchmark salarial
- Enrichissement des fiches de poste avec les données marché

**MVP-004 Recruteur Workspace :**
- Intégration du benchmark salarial dans le workspace
- Alertes budgétaires lors de la création de poste
- Recommandations de sourcing dans le workspace

**MVP-006 Recruiter Copilot :**
- Suggestions de salaire basées sur le marché
- Recommandations d'arguments de séduction
- Alertes sur les gaps entre offre et attentes

**MVP-013 Interview Intelligence :**
- Utilisation des données marché pour l'entretien
- Alertes sur les risques de contre-offre

---

## 7. Structure de Données (TypeScript)

```typescript
interface MarketIntelligence {
  jobId: string;
  generatedAt: Date;
  
  salaryBenchmark: {
    percentile25: number;
    median: number;
    percentile75: number;
    percentile90: number;
    
    adjustments: {
      sector: string;
      companySize: string;
      location: string;
      experienceLevel: string;
      techStack?: string[];
      rarity: string;
    };
    
    budgetAlert?: {
      alert: boolean;
      budget: number;
      gap: number;
      recommendations: string[];
    };
  };
  
  marketTension: {
    index: 'low' | 'moderate' | 'high' | 'critical';
    score: number; // 0-100
    
    consequences: {
      estimatedRecruitmentDelay: number;
      expectedApplications: number;
      recommendedSelectivity: 'low' | 'medium' | 'high';
      sourcingStrategy: string[];
      prioritySeductionArguments: string[];
      counterOfferRisk: 'low' | 'medium' | 'high';
    };
  };
  
  candidateExpectations: {
    remoteWork: number; // 0-100
    careerProgression: number; // 0-100
    impact: number; // 0-100
    compensation: number; // 0-100
    management: number; // 0-100
    companyCulture: number; // 0-100
    technologies?: number; // 0-100 (profils tech)
    companyReputation: number; // 0-100
    
    gaps: {
      expectation: string;
      companyOffer: string;
      gap: number;
      severity: 'low' | 'medium' | 'high';
    }[];
  };
  
  recruitmentDelayBenchmark: {
    marketAverage: number; // jours
    internalHistorical: number; // jours
    gap: number;
    
    recommendations: {
      accelerate: boolean;
      stepsToOptimize: string[];
      estimatedImprovement: number; // jours
    };
  };
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'utilisation | Postes avec benchmark / total | ≥ 90% |
| Taux d'alerte budgétaire | Alertes déclenchées / postes ouverts | ≥ 80% |
| Taux de conformité | Postes avec budget conforme / total | ≥ 70% |
| Satisfaction recruteur | Satisfaction avec Market Intelligence | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction délais de recrutement | Réduction après utilisation | ≥ 20% |
| Amélioration taux d'acceptation | Amélioration des offres acceptées | ≥ 15% |
| Réduction des contre-offres | Réduction des départs après acceptation | ≥ 25% |

---

## 9. Documents du Module

- **DOC-017-01** : Brief du Module (ce document)
- **DOC-017-02** : Benchmark Salarial Temps Réel
- **DOC-017-03** : Tension du Marché par Profil
- **DOC-017-04** : Intelligence des Attentes Candidats
- **DOC-017-05** : Benchmark Délais de Recrutement

---

## 10. Conclusion

MVP-017 Market Intelligence fournit une intelligence du marché du travail en temps réel pour permettre aux recruteurs de prendre des décisions éclairées sur les salaires, la tension du marché, les attentes des candidats, et les délais de recrutement. Ce module s'intègre avec les modules existants (Job Intelligence, Recruteur Workspace, Recruiter Copilot, Interview Intelligence) pour enrichir l'expérience de recrutement.

**Points clés :**
- 4 capacités principales : Benchmark Salarial, Tension du Marché, Attentes Candidats, Délais de Recrutement
- Données marché en temps réel
- Alertes et recommandations automatiques
- Intégration avec les modules existants
- Indicateurs de suivi et d'impact
