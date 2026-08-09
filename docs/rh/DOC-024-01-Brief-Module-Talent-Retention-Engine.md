# DOC-024-01 : Brief du Module Talent Retention Engine

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-024 Talent Retention Engine. Ce module détecte précocement le risque de départ des talents en analysant les signaux faibles de désengagement et les facteurs de risque structurels, génère un score de risque de départ, et propose un plan de rétention personnalisé avec comparaison du coût de rétention vs coût du remplacement.

---

## 2. Principe Fondateur

Le meilleur recrutement est celui qu'on n'a pas à faire parce qu'on a gardé le talent. Ce module détecte précocement le risque de départ des talents en analysant les signaux faibles de désengagement (baisse de performance, absence aux réunions, diminution des initiatives, feedbacks négatifs, demandes d'aménagements, mise à jour LinkedIn) et les facteurs de risque structurels (stagnation salariale, absence de promotion, changement de manager, réorganisation, concurrent qui recrute, poste sous-dimensionné). Le module génère un score de risque de départ (Faible / Modéré / Élevé / Critique) avec délai estimé et facteurs déclencheurs, et propose un plan de rétention personnalisé avec comparaison du coût de rétention vs coût du remplacement (6 à 18 mois de salaire).

---

## 3. Capacités du Module

### CAPACITÉ 1 — Détection Précoce du Risque de Départ

Le moteur analyse les signaux faibles de désengagement.

**Signaux observables :**
- Baisse de performance soudaine
- Absence à des réunions habituelles
- Diminution des initiatives
- Feedbacks négatifs en entretien annuel
- Demandes d'aménagements inhabituels
- Mise à jour du profil LinkedIn détectée (si autorisation)

**Facteurs de risque structurels :**
- Stagnation salariale > 2 ans
- Absence de promotion promise
- Changement de manager
- Réorganisation de l'équipe
- Concurrent qui recrute activement
- Poste sous-dimensionné vs potentiel

**Score de risque de départ :**
- Faible / Modéré / Élevé / Critique
- Délai estimé avant départ potentiel
- Facteurs déclencheurs identifiés

---

### CAPACITÉ 2 — Plan de Rétention Personnalisé

Pour chaque talent à risque identifié :

**Actions recommandées :**
- Entretien de rétention structuré
- Révision salariale ciblée
- Plan de carrière accéléré
- Nouveau périmètre de responsabilités
- Projet spécial motivant
- Formation ou certification valorisante

**Coût de la rétention vs coût du remplacement :**
- Le moteur calcule et compare
- Coût de remplacement estimé (recrutement + onboarding + montée en compétence = 6 à 18 mois de salaire)
- Coût de la rétention proposée
- ROI de la rétention : toujours positif

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Surveillance Continue du Risque de Départ

**Scénario :** L'entreprise veut surveiller en continu le risque de départ de ses talents.

**Action :**
1. Le moteur analyse en continu les signaux faibles de désengagement
2. Le moteur évalue les facteurs de risque structurels
3. Le moteur calcule le score de risque de départ pour chaque talent
4. Le moteur identifie les talents à risque
5. Le moteur alerte le DRH et le manager pour les talents à risque élevé ou critique

**Résultat :** Le DRH et le manager disposent d'une liste de talents à risque avec scores et facteurs déclencheurs.

---

### CAS D'USAGE 2 — Génération de Plan de Rétention

**Scénario :** Un talent est identifié comme à risque élevé de départ.

**Action :**
1. Le moteur génère un plan de rétention personnalisé
2. Le moteur recommande des actions (entretien de rétention, révision salariale, plan de carrière, etc.)
3. Le moteur calcule le coût de la rétention proposée
4. Le moteur calcule le coût du remplacement estimé
5. Le moteur compare et calcule le ROI de la rétention

**Résultat :** Le DRH et le manager disposent d'un plan de rétention personnalisé avec comparaison de coûts et ROI.

---

### CAS D'USAGE 3 — Analyse des Facteurs de Risque Structurels

**Scénario :** L'entreprise veut comprendre les facteurs de risque structurels de départ.

**Action :**
1. Le moteur analyse les facteurs de risque structurels pour l'ensemble des talents
2. Le moteur identifie les facteurs les plus fréquents
3. Le moteur recommande des actions structurelles pour réduire le risque de départ

**Résultat :** L'entreprise dispose d'une analyse des facteurs de risque structurels avec recommandations d'action.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE TALENT RETENTION ENGINE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES TALENT                                      │   │
│ │ - Performance et objectifs                         │   │
│ │ - Participation aux réunions                       │   │
│ │ - Initiatives et contributions                    │   │
│ │ - Feedbacks et entretiens                          │   │
│ │ - Demandes et aménagements                        │   │
│ │ - Profil LinkedIn (si autorisation)               │   │
│ │ - Historique salarial et promotions                │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR DE DÉTECTION DU RISQUE                     │   │
│ │ - Analyse des signaux faibles                     │   │
│ │ - Analyse des facteurs de risque structurels       │   │
│ │ - Calcul du score de risque de départ             │   │
│ │ - Estimation du délai avant départ               │   │
│ │ - Identification des facteurs déclencheurs        │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS TALENT RETENTION ENGINE                 │   │
│ │ - Détection Précoce du Risque de Départ          │   │
│ │ - Plan de Rétention Personnalisé                 │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ SCORE DE RISQUE DE DÉPART                        │   │
│ │ - Niveau de risque (Faible / Modéré / Élevé / Critique)│   │
│ │ - Délai estimé avant départ potentiel             │   │
│ │ - Facteurs déclencheurs identifiés               │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ PLAN DE RÉTENTION PERSONNALISÉ                   │   │
│ │ - Actions recommandées                            │   │
│ │ - Coût de la rétention                            │   │
│ │ - Coût du remplacement                            │   │
│ │ - ROI de la rétention                             │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Tableau de bord des talents à risque            │   │
│ │ - Scores de risque de départ                      │   │
│ │ - Plans de rétention                              │   │
│ │ - Comparaison de coûts et ROI                     │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-021 Predictive Success Engine :**
- Utilisation des prédictions de succès pour identifier les talents à fort potentiel
- Comparaison des prédictions avec les signaux de désengagement

**MVP-023 Onboarding Intelligence Engine :**
- Utilisation des données d'onboarding pour identifier les problèmes d'intégration précoces
- Utilisation des alertes d'onboarding comme signaux de risque

**MVP-017 Market Intelligence :**
- Utilisation des données de marché pour identifier les concurrents qui recrutent activement
- Utilisation des données salariales pour identifier la stagnation salariale

---

## 7. Structure de Données (TypeScript)

```typescript
interface TalentRetention {
  talentId: string;
  analyzedAt: Date;
  
  riskAssessment: DepartureRiskAssessment;
  retentionPlan?: RetentionPlan;
}

interface DepartureRiskAssessment {
  assessmentId: string;
  talentId: string;
  analyzedAt: Date;
  
  observableSignals: ObservableSignal[];
  structuralRiskFactors: StructuralRiskFactor[];
  
  riskScore: {
    level: 'low' | 'moderate' | 'high' | 'critical';
    score: number; // 0-100
    estimatedDepartureTimeframe: string;
  };
  
  triggeringFactors: string[];
}

interface ObservableSignal {
  signal: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
  details: string;
  detectedAt: Date;
}

interface StructuralRiskFactor {
  factor: string;
  present: boolean;
  severity: 'low' | 'medium' | 'high';
  details: string;
}

interface RetentionPlan {
  planId: string;
  talentId: string;
  generatedAt: Date;
  
  recommendedActions: {
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeline: string;
  }[];
  
  costAnalysis: {
    retentionCost: number;
    replacementCost: number;
    roi: number;
    paybackPeriod: string;
  };
}

interface CostAnalysis {
  retentionCost: {
    salaryIncrease: number;
    promotionCost: number;
    trainingCost: number;
    projectCost: number;
    total: number;
  };
  
  replacementCost: {
    recruitmentCost: number;
    onboardingCost: number;
    rampUpCost: number;
    lostProductivityCost: number;
    total: number;
  };
  
  roi: {
    value: number;
    percentage: number;
  };
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection de risque | Talents à risque détectés / total | ≥ 80% |
| Taux de faux positifs | Faux positifs / alertes | ≤ 20% |
| Taux de rétention réussie | Talents retenus / talents à risque | ≥ 70% |
| Satisfaction DRH | Satisfaction avec les plans de rétention | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction du taux de départ | Réduction des départs de talents clés | ≥ 30% |
| Économie sur les coûts de remplacement | Économie réalisée / coût de remplacement évité | ≥ 50% |
- Amélioration de la satisfaction | Satisfaction des talents | ≥ 4.5/5 |

---

## 9. Documents du Module

- **DOC-024-01** : Brief du Module (ce document)
- **DOC-024-02** : Détection Précoce du Risque de Départ
- **DOC-024-03** : Plan de Rétention Personnalisé et Analyse de Coûts

---

## 10. Conclusion

MVP-024 Talent Retention Engine détecte précocement le risque de départ des talents en analysant les signaux faibles de désengagement (baisse de performance, absence aux réunions, diminution des initiatives, feedbacks négatifs, demandes d'aménagements, mise à jour LinkedIn) et les facteurs de risque structurels (stagnation salariale, absence de promotion, changement de manager, réorganisation, concurrent qui recrute, poste sous-dimensionné). Le module génère un score de risque de départ (Faible / Modéré / Élevé / Critique) avec délai estimé et facteurs déclencheurs, et propose un plan de rétention personnalisé avec comparaison du coût de rétention vs coût du remplacement (6 à 18 mois de salaire). Le module s'intègre avec les modules existants (MVP-021, MVP-023, MVP-017).

**Points clés :**
- 6 signaux observables de désengagement
- 6 facteurs de risque structurels
- Score de risque de départ (Faible / Modéré / Élevé / Critique)
- Délai estimé avant départ potentiel
- Facteurs déclencheurs identifiés
- 6 actions de rétention recommandées
- Comparaison coût rétention vs coût remplacement
- ROI de la rétention (toujours positif)
- Intégration avec les modules existants
