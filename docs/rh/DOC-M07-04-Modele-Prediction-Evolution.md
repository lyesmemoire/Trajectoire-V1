# DOC-M07-04 : Modèle de Prédiction d'Évolution

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de prédiction d'évolution de carrière pour le MVP-META-07 Predictive Intelligence Engine. Ce document structure la prédiction de la trajectoire de carrière d'un candidat et les actions recommandées pour le retenir.

---

## 2. Principe Fondateur

Le modèle prédit l'évolution probable de carrière d'un candidat dans les 24 premiers mois suivant son recrutement. La prédiction est basée sur l'analyse de l'ambition, du potentiel, et du contexte du poste.

---

## 3. Facteurs d'Analyse

### 3.1 FACTEUR A — Niveau d'Ambition

**Détection :**
- Vision de carrière à 3-5 ans
- Aspirations hiérarchiques
- Désir de progression rapide

**Classification :**
- **Faible ambition :** Contente du poste actuel, pas d'aspirations explicites
- **Ambition modérée :** Progression naturelle attendue (N+1 dans 2-3 ans)
- **Ambition élevée :** Aspiration à N+2 ou plus, progression rapide attendue

---

### 3.2 FACTEUR B — Potentiel de Leadership

**Détection :**
- Score leadership (réf. DOC-M06-05)
- Capacité d'influence
- Vision stratégique

**Classification :**
- **Potentiel individuel :** Excellent contributeur, pas de leadership
- **Potentiel de team lead :** Peut diriger une petite équipe
- **Potentiel de manager :** Peut diriger une équipe plus large
- **Potentiel de direction :** Vision stratégique, leadership senior

---

### 3.3 FACTEUR C — Contexte du Poste

**Détection :**
- Structure de l'organisation
- Opportunités de mobilité interne
- Historique de promotion dans l'équipe

**Classification :**
- **Poste sans évolution :** Aucune opportunité de progression
- **Poste avec évolution limitée :** Opportunité N+1 possible mais rare
- **Poste avec évolution :** Opportunités régulières de progression
- **Poste à fort potentiel :** Opportunités multiples et rapides

---

### 3.4 FACTEUR D — Historique de Carrière

**Détection :**
- Durée moyenne dans les postes précédents
- Pattern de progression
- Sauts de carrière

**Classification :**
- **Stable :** 3-5 ans par poste, progression linéaire
- **Dynamique :** 2-3 ans par poste, progression régulière
- **Très dynamique :** 1-2 ans par poste, progression rapide
- **Instable :** < 1 an par poste, changements fréquents

---

## 4. Calcul de la Trajectoire

### 4.1 Formule

```
Durée estimée dans le poste = Base (24 mois) - (Ambition × 3) - (Potentiel × 2) - (Contexte × 2) + (Historique × 2)
```

### 4.2 Échelle de Durée

| Durée estimée | Classification |
|--------------|---------------|
| 6-12 mois | Très courte |
| 13-18 mois | Courte |
| 19-24 mois | Normale |
| 25-36 mois | Longue |
| 37+ mois | Très longue |

---

## 5. Format de Sortie

```markdown
PRÉDICTION — ÉVOLUTION DE CARRIÈRE

Durée estimée dans ce poste :
X à Y mois avant plateau ou départ

Prochain poste naturel :
[description du poste logique suivant]
Dans : Z mois estimés

Plan d'évolution recommandé :
Pour garder ce candidat au-delà de [N] mois, prévoir :
→ [Action 1 : enrichissement du poste]
→ [Action 2 : plan de progression]
→ [Action 3 : visibilité accrue]

Si aucun plan d'évolution prévu :
Risque de départ dans [N] mois : X%
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface CareerEvolutionPrediction {
  predictionId: string;
  recruitmentId: string;
  candidateId: string;
  
  estimatedDuration: {
    minMonths: number;
    maxMonths: number;
    classification: 'very_short' | 'short' | 'normal' | 'long' | 'very_long';
  };
  
  nextNaturalPosition: {
    title: string;
    description: string;
    estimatedTimeline: number; // months
  };
  
  analysisFactors: {
    ambition: 'low' | 'moderate' | 'high';
    leadershipPotential: 'individual' | 'team_lead' | 'manager' | 'director';
    positionContext: 'no_evolution' | 'limited_evolution' | 'evolution' | 'high_potential';
    careerHistory: 'stable' | 'dynamic' | 'very_dynamic' | 'unstable';
  };
  
  evolutionPlan: {
    action: string;
    type: 'enrichment' | 'progression' | 'visibility';
    timeline: string;
  }[];
  
  departureRiskWithoutPlan: {
    months: number;
    probability: number; // percentage
  };
  
  generatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE career_evolution_prediction (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  estimated_duration JSON NOT NULL,
  next_natural_position JSON NOT NULL,
  analysis_factors JSON NOT NULL,
  evolution_plan JSON NOT NULL,
  departure_risk_without_plan JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_career_evolution_prediction_recruitment ON career_evolution_prediction(recruitment_id);
CREATE INDEX idx_career_evolution_prediction_candidate ON career_evolution_prediction(candidate_id);
```

---

## 8. API Endpoints

```typescript
// POST /api/prediction/career-evolution
async function predictCareerEvolution(recruitmentId: string, candidateId: string): Promise<CareerEvolutionPrediction> {
  return await predictCareerEvolution(recruitmentId, candidateId);
}

// GET /api/prediction/career-evolution/:predictionId
async function getCareerEvolutionPrediction(predictionId: string): Promise<CareerEvolutionPrediction> {
  return await getCareerEvolutionPrediction(predictionId);
}

// GET /api/prediction/career-evolution/recruitment/:recruitmentId
async function getCareerEvolutionPredictionByRecruitment(recruitmentId: string): Promise<CareerEvolutionPrediction> {
  return await getCareerEvolutionPredictionByRecruitment(recruitmentId);
}

// PUT /api/prediction/career-evolution/:predictionId/plan
async function updateEvolutionPlan(predictionId: string, evolutionPlan: any[]): Promise<CareerEvolutionPrediction> {
  return await updateEvolutionPlan(predictionId, evolutionPlan);
}

// GET /api/prediction/career-evolution/candidate/:candidateId
async function getCareerEvolutionPredictionsByCandidate(candidateId: string): Promise<CareerEvolutionPrediction[]> {
  return await getCareerEvolutionPredictionsByCandidate(candidateId);
}

// POST /api/prediction/career-evolution/:predictionId/check-in
async function recordCareerCheckIn(predictionId: string, checkIn: any): Promise<CareerEvolutionPrediction> {
  return await recordCareerCheckIn(predictionId, checkIn);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de précision | Prédictions correctes / totales | ≥ 60% |
- Écart moyen | Écart moyen entre durée prédite et réelle | ± 3 mois |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de rétention avec plan | Candidats retenus avec plan / totaux | ≥ 70% |
- Réduction du turnover | Turnover réduit / total | ≥ 25% |

---

## 10. Exemple Complet

```markdown
PRÉDICTION — ÉVOLUTION DE CARRIÈRE

Durée estimée dans ce poste :
12 à 18 mois avant plateau ou départ

Prochain poste naturel :
Team Lead ou Senior Developer avec responsabilités d'encadrement
Dans : 15 mois estimés

Plan d'évolution recommandé :
Pour garder ce candidat au-delà de 18 mois, prévoir :
→ Enrichissement du poste : Ajouter des responsabilités de mentorat junior
→ Plan de progression : Définir un chemin clair vers Team Lead dans 18 mois
→ Visibilité accrue : Inviter aux réunions de planning et de stratégie

Si aucun plan d'évolution prévu :
Risque de départ dans 15 mois : 75%
```

---

## 11. Conclusion

Le modèle de prédiction d'évolution structure la prédiction de la trajectoire de carrière dans les 24 premiers mois. 4 facteurs d'analyse : Niveau d'ambition (faible/modérée/élevée), Potentiel de leadership (individuel/team lead/manager/director), Contexte du poste (sans évolution/limitée/évolution/fort potentiel), Historique de carrière (stable/dynamique/très dynamique/instable). Calcul de la durée estimée dans le poste. Échelle de durée (Très courte 6-12 mois, Courte 13-18 mois, Normale 19-24 mois, Longue 25-36 mois, Très longue 37+ mois). Format de sortie avec durée estimée, prochain poste naturel, plan d'évolution recommandé, risque de départ sans plan. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 facteurs d'analyse
- Classification par facteur
- Calcul de la durée estimée
- Échelle de durée
- Prochain poste naturel
- Plan d'évolution recommandé
- Risque de départ sans plan
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
