# DOC-021-01 : Brief du Module Predictive Success Engine

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le module MVP-021 Predictive Success Engine. Ce module construit la prédiction de succès long terme (6, 12, 24 mois) pour chaque candidat, identifiant les facteurs prédicteurs primaires, les facteurs de risque de départ précoce, et produisant un score de prédiction de succès avec recommandations d'action.

---

## 2. Principe Fondateur

Le recrutement parfait n'est pas celui où le candidat réussit l'entretien. C'est celui où le candidat réussit dans le poste à 12 et 24 mois. Ce module construit la prédiction de succès long terme en identifiant les facteurs qui prédisent le succès réel dans un poste donné, les facteurs de risque de départ précoce, et en produisant un score de prédiction de succès (6, 12, 24 mois). Le module apprend et améliore son modèle prédictif en continu en comparant ses prédictions aux résultats réels observés.

---

## 3. Capacités du Module

### CAPACITÉ 1 — Modèle de Prédiction du Succès

Le moteur identifie les facteurs qui prédisent le succès réel dans un poste donné.

**Facteurs prédicteurs primaires (corrélés fortement au succès) :**
- Adéquation compétences / poste (pas la perfection, l'adéquation réelle)
- Motivation intrinsèque pour le contenu (pas la marque, pas le salaire, le travail quotidien)
- Compatibilité avec le manager direct (premier facteur de rétention ou de départ)
- Adéquation culturelle profonde (pas les valeurs affichées, la culture réelle)
- Trajectoire de carrière cohérente (progression logique vs régression déguisée ou fuite)

**Facteurs de risque de départ précoce :**
- Offre acceptée par défaut (candidat qui n'a pas cherché activement ou accepté faute d'autre chose)
- Attentes salariales non satisfaites (accepté en dessous des attentes réelles en espérant renégocier)
- Poste perçu comme transitoire (candidat qui voit ce poste comme une étape courte)
- Manager incompatible (style de management attendu incompatible avec le manager réel)
- Culture incompatible non détectée (candidat valorise ce que l'entreprise ne peut pas offrir)

**Score de prédiction de succès :**
- Score à 6 mois : probabilité d'intégration réussie
- Score à 12 mois : probabilité de performance attendue
- Score à 24 mois : probabilité de rétention

Pour chaque score : facteurs positifs contributeurs, facteurs de risque identifiés, actions recommandées pour maximiser le succès.

---

### CAPACITÉ 2 — Apprentissage par les Résultats Réels

Le moteur compare ses prédictions aux résultats réels observés à 6, 12 et 24 mois. Il apprend et améliore son modèle prédictif en continu. Cet apprentissage est anonymisé, validé humainement, protégé contre les biais, tracé et auditable.

---

## 4. Cas d'Usage

### CAS D'USAGE 1 — Prédiction de Succès pour un Candidat

**Scénario :** Un recruteur évalue un candidat en finale.

**Action :**
1. Le moteur collecte les données du candidat (CV, entretiens, références)
2. Le moteur évalue les facteurs prédicteurs primaires
3. Le moteur identifie les facteurs de risque de départ précoce
4. Le moteur calcule le score de prédiction de succès (6, 12, 24 mois)
5. Le moteur produit des recommandations d'action pour maximiser le succès

**Résultat :** Le recruteur dispose d'une prédiction de succès long terme avec facteurs contributeurs, facteurs de risque, et recommandations d'action.

---

### CAS D'USAGE 2 — Comparaison de Candidats

**Scénario :** Un recruteur compare plusieurs candidats pour un poste.

**Action :**
1. Le moteur génère un score de prédiction de succès pour chaque candidat
2. Le moteur compare les scores entre candidats
3. Le moteur identifie les facteurs différenciants
4. Le moteur recommande le candidat avec le meilleur potentiel de succès long terme

**Résultat :** Le recruteur dispose d'une comparaison objective des candidats basée sur le potentiel de succès long terme.

---

### CAS D'USAGE 3 — Apprentissage et Amélioration du Modèle

**Scénario :** À 6, 12 et 24 mois après l'embauche, le moteur compare ses prédictions aux résultats réels.

**Action :**
1. Le moteur collecte les données réelles (performance, rétention, satisfaction)
2. Le moteur compare les prédictions aux résultats réels
3. Le moteur identifie les écarts et ajuste le modèle
4. Le moteur valide les ajustements humainement
5. Le moteur met à jour le modèle prédictif

**Résultat :** Le modèle prédictif s'améliore en continu en apprenant des résultats réels.

---

## 5. Architecture

### 5.1 Composants Principaux

```
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE PREDICTIVE SUCCESS ENGINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ DONNÉES CANDIDAT                                     │   │
│ │ - CV et parcours                                    │   │
│ │ - Entretiens réalisés                               │   │
│ │ - Références                                        │   │
│ │ - Soft skills détectés                             │   │
│ │ - Motivation détectée                              │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ MOTEUR DE PRÉDICTION DE SUCCÈS                     │   │
│ │ - Évaluation des facteurs prédicteurs              │   │
│ │ - Identification des facteurs de risque            │   │
│ │ - Calcul du score de prédiction                   │   │
│ │ - Génération des recommandations                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ CAPACITÉS PREDICTIVE SUCCESS ENGINE                │   │
│ │ - Modèle de Prédiction du Succès                  │   │
│ │ - Apprentissage par les Résultats Réels           │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ SCORE DE PRÉDICTION                                │   │
│ │ - Score à 6 mois                                   │   │
│ │ - Score à 12 mois                                  │   │
│ │ - Score à 24 mois                                  │   │
│ │ - Facteurs contributeurs                            │   │
│ │ - Facteurs de risque                               │   │
│ │ - Recommandations d'action                         │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ APPRENTISSAGE CONTINU                               │   │
│ │ - Comparaison prédictions / résultats réels         │   │
│ │ - Ajustement du modèle                              │   │
│ │ - Validation humaine                                │   │
│ │ - Protection contre les biais                       │   │
│ └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│ │ INTERFACE UTILISATEUR                              │   │
│ │ - Score de prédiction                              │   │
│ │ - Facteurs contributeurs                            │   │
│ │ - Facteurs de risque                               │   │
│ │ - Recommandations d'action                         │   │
│ │ - Historique des prédictions vs résultats          │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Intégration

### 6.1 Intégration avec les Modules Existant

**MVP-001 CV Intelligence :**
- Utilisation des données CV pour évaluer l'adéquation compétences / poste
- Utilisation des données de parcours pour évaluer la trajectoire de carrière

**MVP-003 Job Intelligence :**
- Utilisation des données du poste pour évaluer l'adéquation compétences / poste
- Utilisation des données de culture d'entreprise pour évaluer l'adéquation culturelle

**MVP-013 Interview Intelligence :**
- Utilisation des données d'entretien pour évaluer la motivation intrinsèque
- Utilisation des données d'entretien pour détecter les signaux de risque

**MVP-014 Soft Skills Intelligence :**
- Utilisation des données de soft skills pour évaluer la compatibilité avec le manager
- Utilisation des données de soft skills pour évaluer l'adéquation culturelle

**MVP-020 Reference Intelligence :**
- Utilisation des données de références pour confirmer ou infirmer les facteurs prédicteurs
- Utilisation du scoring de cohérence pour ajuster le score de prédiction

---

## 7. Structure de Données (TypeScript)

```typescript
interface PredictiveSuccess {
  candidateId: string;
  jobId: string;
  generatedAt: Date;
  
  prediction: SuccessPrediction;
  learning?: LearningData;
}

interface SuccessPrediction {
  predictionId: string;
  candidateId: string;
  jobId: string;
  generatedAt: Date;
  
  primaryFactors: PrimaryFactor[];
  riskFactors: RiskFactor[];
  
  scores: {
    sixMonths: SuccessScore;
    twelveMonths: SuccessScore;
    twentyFourMonths: SuccessScore;
  };
  
  recommendations: Recommendation[];
}

interface PrimaryFactor {
  factor: string;
  score: number; // 0-100
  weight: number; // importance dans le score global
  description: string;
  evidence: string[];
}

interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
}

interface SuccessScore {
  score: number; // 0-100
  probability: number; // 0-1
  confidence: number; // 0-100
  
  positiveContributors: string[];
  riskFactorsIdentified: string[];
  
  recommendedActions: string[];
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  timeline: string;
}

interface LearningData {
  learningId: string;
  predictionId: string;
  candidateId: string;
  
  prediction: SuccessPrediction;
  actualResults: ActualResults;
  
  comparison: Comparison;
  modelAdjustments: ModelAdjustment[];
  
  validatedAt: Date;
  validatedBy: string;
}

interface ActualResults {
  sixMonthsResult: {
    integrationSuccess: boolean;
    performanceRating: number;
    satisfactionRating: number;
  };
  
  twelveMonthsResult: {
    performanceAchieved: boolean;
    performanceRating: number;
    retentionStatus: 'retained' | 'departed';
  };
  
  twentyFourMonthsResult: {
    retentionStatus: 'retained' | 'departed';
    departureReason?: string;
    performanceRating: number;
  };
}

interface Comparison {
  sixMonthsAccuracy: number;
  twelveMonthsAccuracy: number;
  twentyFourMonthsAccuracy: number;
  
  overallAccuracy: number;
  
  errors: PredictionError[];
}

interface PredictionError {
  type: 'false_positive' | 'false_negative' | 'magnitude_error';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface ModelAdjustment {
  factor: string;
  previousWeight: number;
  newWeight: number;
  reason: string;
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Précision du modèle | Précision des prédictions vs résultats | ≥ 80% |
| Taux de validation | Prédictions validées humainement | ≥ 95% |
| Taux de protection anti-biais | Prédictions protégées contre les biais | 100% |
| Satisfaction recruteur | Satisfaction avec les prédictions | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Réduction des départs précoces | Réduction des départs < 12 mois | ≥ 25% |
| Amélioration de la performance | Amélioration de la performance à 12 mois | ≥ 20% |
| Amélioration de la rétention | Amélioration de la rétention à 24 mois | ≥ 30% |

---

## 9. Documents du Module

- **DOC-021-01** : Brief du Module (ce document)
- **DOC-021-02** : Modèle de Prédiction du Succès
- **DOC-021-03** : Apprentissage par les Résultats Réels

---

## 10. Conclusion

MVP-021 Predictive Success Engine construit la prédiction de succès long terme (6, 12, 24 mois) pour chaque candidat. Le module identifie les facteurs prédicteurs primaires (adéquation compétences, motivation intrinsèque, compatibilité manager, adéquation culturelle, trajectoire de carrière), les facteurs de risque de départ précoce, et produit un score de prédiction de succès avec recommandations d'action. Le module apprend et améliore son modèle prédictif en continu en comparant ses prédictions aux résultats réels observés, de manière anonymisée, validée humainement, protégée contre les biais, et tracée.

**Points clés :**
- 5 facteurs prédicteurs primaires (compétences, motivation, manager, culture, trajectoire)
- 5 facteurs de risque de départ précoce (offre par défaut, attentes salariales, poste transitoire, manager incompatible, culture incompatible)
- 3 scores de prédiction (6, 12, 24 mois)
- Recommandations d'action pour maximiser le succès
- Apprentissage continu par comparaison prédictions / résultats réels
- Protection contre les biais (RH-860)
- Intégration avec les modules existants
