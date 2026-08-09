# DOC-027-01 : Brief du Module Internal Mobility & Succession Planning

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-027 Internal Mobility & Succession Planning. Ce module analyse la base des talents internes avant de lancer un recrutement externe, génère un matching interne automatique (compétences actuelles, compétences en développement, aspirations de carrière, performance et potentiel, disponibilité et appétence pour la mobilité), produit une cartographie des talents internes (matrice performance/potentiel avec hauts potentiels, piliers de l'organisation, talents à développer, profils à risque), et génère un plan de succession pour chaque poste clé (successeurs identifiés N+1/N+2, niveau de préparation, plan de développement, délai avant succession possible, risque si le titulaire part).

---

## 2. Principe Fondateur

Avant de recruter à l'extérieur, un grand DRH regarde toujours à l'intérieur. La mobilité interne coûte 3 fois moins qu'un recrutement externe, réduit le délai d'opérationnalité, améliore la rétention globale, et valorise les talents existants. Ce module analyse la base des talents internes avant de lancer un recrutement externe, génère un matching interne automatique avec score de matching interne (candidats internes potentiels classés, écarts de compétences évalués, plan de développement pour combler les écarts, délai avant opérationnalité estimé), produit une cartographie des talents internes (matrice performance/potentiel avec hauts potentiels, piliers de l'organisation, talents à développer, profils à risque) avec actions recommandées, plan de rétention ou développement, opportunités de mobilité identifiées, risques de départ estimés, et génère un plan de succession pour chaque poste clé (successeurs identifiés N+1/N+2, niveau de préparation de chaque successeur, plan de développement pour chaque successeur, délai avant succession possible, risque si le titulaire part demain).

---

## 3. Capacités du Module

### CAPACITÉ 1 — Matching Interne Automatique

Quand un poste s'ouvre, avant de lancer le recrutement externe, le moteur analyse la base des talents internes.

**Pour chaque salarié :**
- Compétences actuelles
- Compétences en développement
- Aspirations de carrière déclarées
- Performance et potentiel évalués
- Disponibilité et appétence pour la mobilité

**Score de matching interne :**
- Candidats internes potentiels classés
- Écarts de compétences évalués
- Plan de développement pour combler les écarts
- Délai avant opérationnalité estimé

---

### CAPACITÉ 2 — Cartographie des Talents Internes

Vue globale des talents de l'entreprise :

**Matrice Performance / Potentiel :**
- Hauts potentiels (High Potentials)
- Piliers de l'organisation (Solid Performers)
- Talents à développer (Developing Talents)
- Profils à risque (Under Performers)

**Pour chaque quadrant :**
- Actions recommandées
- Plan de rétention ou développement
- Opportunités de mobilité identifiées
- Risques de départ estimés

---

### CAPACITÉ 3 — Plan de Succession

Pour chaque poste clé :
- Successeurs identifiés (N+1 / N+2)
- Niveau de préparation de chaque successeur
- Plan de développement pour chaque successeur
- Délai avant succession possible
- Risque si le titulaire part demain

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Matching Interne Automatique

**Scénario :** Un poste s'ouvre dans l'entreprise.

**Action :**
1. Le moteur analyse la base des talents internes
2. Le moteur évalue chaque salarié (compétences, aspirations, performance, potentiel, disponibilité)
3. Le moteur génère un score de matching interne
4. Le moteur classe les candidats internes potentiels
5. Le moteur évalue les écarts de compétences et génère un plan de développement

**Résultat :** Le DRH dispose d'une liste de candidats internes potentiels classés avec écarts de compétences et plan de développement.

---

### CAS D'USAGE 2 — Cartographie des Talents Internes

**Scénario :** L'entreprise veut avoir une vue globale de ses talents.

**Action :**
1. Le moteur analyse la performance et le potentiel de chaque salarié
2. Le moteur classe les salariés dans la matrice performance/potentiel
3. Le moteur génère des actions recommandées pour chaque quadrant
4. Le moteur identifie les opportunités de mobilité
5. Le moteur estime les risques de départ

**Résultat :** L'entreprise dispose d'une cartographie complète de ses talents avec actions recommandées.

---

### CAS D'USAGE 3 — Plan de Succession

**Scénario :** L'entreprise veut préparer la succession pour un poste clé.

**Action :**
1. Le moteur identifie les successeurs potentiels (N+1 / N+2)
2. Le moteur évalue le niveau de préparation de chaque successeur
3. Le moteur génère un plan de développement pour chaque successeur
4. Le moteur estime le délai avant succession possible
5. Le moteur évalue le risque si le titulaire part demain

**Résultat :** L'entreprise dispose d'un plan de succession complet avec successeurs identifiés et plans de développement.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE INTERNAL MOBILITY & SUCCESSION PLANNING        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ BASE DES TALENTS INTERNES                         │   │
│ │ - Compétences actuelles                            │   │
│ │ - Compétences en développement                     │   │
│ │ - Aspirations de carrière                          │   │
│ │ - Performance et potentiel                         │   │
│ │ - Disponibilité et appétence mobilité             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR DE MATCHING INTERNE                       │   │
│ │ - Analyse des compétences                         │   │
│ │ - Analyse des aspirations                         │   │
│ │ - Analyse de la performance et du potentiel       │   │
│ │ - Calcul du score de matching interne             │   │
│ │ - Évaluation des écarts de compétences            │   │
│ │ - Génération du plan de développement            │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS INTERNAL MOBILITY & SUCCESSION PLANNING │   │
│ │ - Matching Interne Automatique                   │   │
│ │ - Cartographie des Talents Internes               │   │
│ │ - Plan de Succession                             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MATRICE PERFORMANCE / POTENTIEL                   │   │
│ │ - Hauts potentiels (High Potentials)              │   │
│ │ - Piliers de l'organisation (Solid Performers)    │   │
│ │ - Talents à développer (Developing Talents)       │   │
│ │ - Profils à risque (Under Performers)             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ PLAN DE SUCCESSION                                │   │
│ │ - Successeurs identifiés (N+1 / N+2)             │   │
│ │ - Niveau de préparation                          │   │
│ │ - Plan de développement                          │   │
│ │ - Délai avant succession possible                 │   │
│ │ - Risque si le titulaire part demain             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Matching interne automatique                   │   │
│ │ - Cartographie des talents internes              │   │
│ │ - Plan de succession                             │   │
│ │ - Recommandations d'action                       │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-001 CV Intelligence :**
- Utilisation des données de compétences actuelles des salariés
- Utilisation des données de parcours pour évaluer le potentiel

**MVP-002 Matching Engine :**
- Utilisation de l'algorithme de matching pour le matching interne
- Utilisation des données de similarité pour identifier les candidats internes

**MVP-021 Predictive Success Engine :**
- Utilisation des prédictions de succès pour évaluer le potentiel des candidats internes
- Utilisation des prédictions pour le plan de succession

**MVP-024 Talent Retention Engine :**
- Utilisation des données de risque de départ pour la cartographie des talents
- Utilisation des plans de rétention pour les profils à risque

---

## 7. Structure de Données (TypeScript)

```typescript
interface InternalMobility {
  mobilityId: string;
  jobId: string;
  analyzedAt: Date;
  
  internalMatching: InternalMatching;
  talentMapping?: TalentMapping;
  successionPlan?: SuccessionPlan;
}

interface InternalMatching {
  matchingId: string;
  jobId: string;
  analyzedAt: Date;
  
  internalCandidates: {
    employeeId: string;
    employeeName: string;
    currentRole: string;
    
    currentSkills: string[];
    developingSkills: string[];
    careerAspirations: string[];
    performance: number;
    potential: number;
    mobilityAvailability: boolean;
    mobilityAppetite: number;
    
    matchingScore: number;
    skillGaps: string[];
    developmentPlan: string[];
    estimatedTimeToOperational: string;
  }[];
}

interface TalentMapping {
  mappingId: string;
  analyzedAt: Date;
  
  performancePotentialMatrix: {
    highPotentials: Employee[];
    solidPerformers: Employee[];
    developingTalents: Employee[];
    underPerformers: Employee[];
  };
  
  quadrantActions: {
    quadrant: string;
    recommendedActions: string[];
    retentionPlan?: string;
    developmentPlan?: string;
    mobilityOpportunities: string[];
    departureRisk: number;
  }[];
}

interface SuccessionPlan {
  successionId: string;
  jobId: string;
  analyzedAt: Date;
  
  successors: {
    employeeId: string;
    employeeName: string;
    currentRole: string;
    
    level: 'N+1' | 'N+2';
    readinessLevel: 'ready' | 'needs_development' | 'not_ready';
    developmentPlan: string[];
    estimatedTimeToSuccession: string;
    
    riskIfDepartureTomorrow: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

interface Employee {
  employeeId: string;
  employeeName: string;
  currentRole: string;
  department: string;
  
  performance: number;
  potential: number;
  
  skills: string[];
  careerAspirations: string[];
  
  mobilityAvailability: boolean;
  mobilityAppetite: number;
  
  departureRisk: number;
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de matching interne | Postes avec matching interne / total | ≥ 80% |
| Taux de mobilité interne | Mobilités internes réalisées / identifiées | ≥ 50% |
| Taux de succession préparée | Postes clés avec succession préparée / total | ≥ 90% |
| Satisfaction DRH | Satisfaction avec le module | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des coûts de recrutement | Économie sur les coûts de recrutement externe | ≥ 30% |
- Réduction du délai d'opérationnalité | Réduction du délai d'opérationnalité | ≥ 50% |
- Amélioration de la rétention | Amélioration de la rétention globale | ≥ 20% |

---

## 9. Documents du Module

- **DOC-027-01** : Brief du Module (ce document)
- **DOC-027-02** : Matching Interne Automatique
- **DOC-027-03** : Cartographie des Talents Internes
- **DOC-027-04** : Plan de Succession

---

## 10. Conclusion

MVP-027 Internal Mobility & Succession Planning analyse la base des talents internes avant de lancer un recrutement externe, génère un matching interne automatique (compétences actuelles, compétences en développement, aspirations de carrière, performance et potentiel, disponibilité et appétence pour la mobilité) avec score de matching interne (candidats internes potentiels classés, écarts de compétences évalués, plan de développement pour combler les écarts, délai avant opérationnalité estimé), produit une cartographie des talents internes (matrice performance/potentiel avec hauts potentiels, piliers de l'organisation, talents à développer, profils à risque) avec actions recommandées, plan de rétention ou développement, opportunités de mobilité identifiées, risques de départ estimés, et génère un plan de succession pour chaque poste clé (successeurs identifiés N+1/N+2, niveau de préparation de chaque successeur, plan de développement pour chaque successeur, délai avant succession possible, risque si le titulaire part demain). Le module permet à l'entreprise de valoriser les talents existants et de réduire les coûts de recrutement. Le module s'intègre avec les modules existants (MVP-001, MVP-002, MVP-021, MVP-024).

**Points clés :**
- 5 critères d'analyse pour chaque salarié (compétences, aspirations, performance, potentiel, disponibilité)
- Score de matching interne avec classement
- Écarts de compétences évalués
- Plan de développement pour combler les écarts
- 4 quadrants de la matrice performance/potentiel
- Actions recommandées par quadrant
- Opportunités de mobilité identifiées
- Risques de départ estimés
- Successeurs identifiés N+1/N+2
- Niveau de préparation et plan de développement
- Délai avant succession possible
- Risque si le titulaire part demain
- Intégration avec les modules existants
