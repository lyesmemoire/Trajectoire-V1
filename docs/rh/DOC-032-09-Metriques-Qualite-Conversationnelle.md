# DOC-032-09 : Métriques de Qualité Conversationnelle

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les métriques de qualité conversationnelle pour MVP-032 Conversational Intelligence Engine. Ces métriques permettent de mesurer la qualité des entretiens, l'efficacité du moteur, et l'amélioration continue du système.

---

## 2. Principe Fondateur

Ce qui ne se mesure pas ne s'améliore pas. Les métriques de qualité conversationnelle permettent de mesurer la qualité des entretiens, l'efficacité du moteur, et l'amélioration continue du système. Ces métriques sont divisées en 4 catégories : qualité de la conversation, qualité du moteur, impact business, et satisfaction utilisateur.

---

## 3. Métriques de Qualité de la Conversation

### 3.1 Couverture des Dimensions

**Description :**
Pourcentage de dimensions évaluées avec un niveau d'éclaircissement suffisant.

**Calcul :**
```
Couverture = (Dimensions suffisamment éclaircies / Total dimensions) × 100
```

**Cible :**
- Minimum : 80%
- Objectif : 90%
- Excellence : 95%

**Exemple :**
```
Dimensions : Compétences (85%), Expérience (75%), Soft skills (70%), Motivations (60%), Culture fit (50%)
Dimensions suffisamment éclaircies (≥70%) : 3/5 = 60%
```

---

### 3.2 Profondeur des Informations

**Description :**
Profondeur moyenne des réponses mesurée par le niveau de détail et la richesse des informations.

**Calcul :**
```
Profondeur = Moyenne des scores de profondeur (0-100)
Score de profondeur = (Nombre de faits × 10) + (Nombre d'exemples × 15) + (Contextualisation × 20) + (Nuance × 25)
```

**Cible :**
- Minimum : 60
- Objectif : 75
- Excellence : 85

**Exemple :**
```
Réponse : "J'ai géré une équipe de 5 développeurs sur un projet React. Nous avons livré en 3 mois avec 95% de tests passants."
Facts : 3 (équipe de 5, projet React, 3 mois, 95% tests) = 30
Exemples : 1 = 15
Contextualisation : 20
Nuance : 10
Score = 30 + 15 + 20 + 10 = 75
```

---

### 3.3 Qualité du Fil Narratif

**Description :**
Qualité du fil narratif construit par le moteur, mesurée par la cohérence, la profondeur, et la pertinence.

**Calcul :**
```
Qualité du fil narratif = (Cohérence × 0.4) + (Profondeur × 0.3) + (Pertinence × 0.3)
```

**Cible :**
- Minimum : 70
- Objectif : 80
- Excellence : 90

---

### 3.4 Équilibre des Dimensions

**Description :**
Équilibre entre les dimensions évaluées, mesuré par l'écart-type des niveaux d'éclaircissement.

**Calcul :**
```
Équilibre = 100 - (Écart-type des niveaux d'éclaircissement × 2)
```

**Cible :**
- Minimum : 70
- Objectif : 80
- Excellence : 90

**Exemple :**
```
Niveaux : [80, 75, 70, 60, 50]
Moyenne : 67
Écart-type : 11.8
Équilibre = 100 - (11.8 × 2) = 76.4
```

---

## 4. Métriques de Qualité du Moteur

### 4.1 Taux de Détection des Patterns

**Description :**
Pourcentage de patterns (cohérences, incohérences, évolutions, esquives) détectés correctement.

**Calcul :**
```
Taux de détection = (Patterns détectés correctement / Total patterns présents) × 100
```

**Cible :**
- Minimum : 85%
- Objectif : 90%
- Excellence : 95%

---

### 4.2 Taux de Pertinence des Rebonds

**Description :**
Pourcentage de rebonds suggérés qui sont pertinents et utiles.

**Calcul :**
```
Taux de pertinence = (Rebonds pertinents / Total rebonds suggérés) × 100
```

**Cible :**
- Minimum : 75%
- Objectif : 85%
- Excellence : 90%

---

### 4.3 Taux d'Adoption des Rebonds

**Description :**
Pourcentage de rebonds suggérés qui sont suivis par le recruteur.

**Calcul :**
```
Taux d'adoption = (Rebonds suivis / Total rebonds suggérés) × 100
```

**Cible :**
- Minimum : 60%
- Objectif : 70%
- Excellence : 80%

---

### 4.4 Taux de Pertinence des Alertes

**Description :**
Pourcentage d'alertes générées qui sont pertinentes et utiles.

**Calcul :**
```
Taux de pertinence = (Alertes pertinentes / Total alertes générées) × 100
```

**Cible :**
- Minimum : 80%
- Objectif : 85%
- Excellence : 90%

---

### 4.5 Taux de Respect du Tempo

**Description :**
Pourcentage d'entretiens qui respectent le temps imparti.

**Calcul :**
```
Taux de respect du tempo = (Entretiens dans le temps / Total entretiens) × 100
```

**Cible :**
- Minimum : 85%
- Objectif : 90%
- Excellence : 95%

---

### 4.6 Temps de Réponse du Moteur

**Description :**
Temps moyen de réponse du moteur pour générer un rebond ou une alerte.

**Calcul :**
```
Temps de réponse moyen = Somme des temps de réponse / Nombre de requêtes
```

**Cible :**
- Maximum : 3 secondes
- Objectif : 2 secondes
- Excellence : 1 seconde

---

## 5. Métriques d'Impact Business

### 5.1 Amélioration de la Qualité des Décisions

**Description :**
Amélioration de la qualité des décisions de recrutement mesurée par le taux de réussite des embauches.

**Calcul :**
```
Amélioration = (Taux de réussite avec moteur - Taux de réussite sans moteur) / Taux de réussite sans moteur × 100
```

**Cible :**
- Minimum : 20%
- Objectif : 30%
- Excellence : 40%

---

### 5.2 Réduction du Temps d'Entretien

**Description :**
Réduction du temps moyen d'entretien grâce à l'efficacité du moteur.

**Calcul :**
```
Réduction = (Temps sans moteur - Temps avec moteur) / Temps sans moteur × 100
```

**Cible :**
- Minimum : 15%
- Objectif : 25%
- Excellence : 35%

---

### 5.3 Amélioration de l'Expérience Candidat

**Description :**
Amélioration de l'expérience candidat mesurée par le feedback des candidats.

**Calcul :**
```
Amélioration = (Score avec moteur - Score sans moteur) / Score sans moteur × 100
```

**Cible :**
- Minimum : 20%
- Objectif : 30%
- Excellence : 40%

---

### 5.4 Réduction des Entretiens Ratés

**Description :**
Réduction du nombre d'entretiens qui tournent mal grâce à la gestion des situations difficiles.

**Calcul :**
```
Réduction = (Entretiens ratés sans moteur - Entretiens ratés avec moteur) / Entretiens ratés sans moteur × 100
```

**Cible :**
- Minimum : 30%
- Objectif : 40%
- Excellence : 50%

---

## 6. Métriques de Satisfaction Utilisateur

### 6.1 Satisfaction des Recruteurs

**Description :**
Satisfaction des recruteurs avec le moteur mesurée par des enquêtes.

**Calcul :**
```
Satisfaction = Moyenne des scores de satisfaction (1-5)
```

**Cible :**
- Minimum : 4.0/5
- Objectif : 4.5/5
- Excellence : 4.8/5

---

### 6.2 Confiance dans le Système

**Description :**
Confiance des recruteurs dans les suggestions du moteur.

**Calcul :**
```
Confiance = Moyenne des scores de confiance (1-5)
```

**Cible :**
- Minimum : 4.0/5
- Objectif : 4.5/5
- Excellence : 4.8/5

---

### 6.3 Facilité d'Utilisation

**Description :**
Perception de la facilité d'utilisation du moteur.

**Calcul :**
```
Facilité = Moyenne des scores de facilité (1-5)
```

**Cible :**
- Minimum : 4.0/5
- Objectif : 4.5/5
- Excellence : 4.8/5

---

### 6.4 Intention de Réutilisation

**Description :**
Intention des recruteurs de réutiliser le moteur.

**Calcul :**
```
Intention = Pourcentage de recruteurs qui prévoient de réutiliser le moteur
```

**Cible :**
- Minimum : 80%
- Objectif : 90%
- Excellence : 95%

---

## 7. Structure de Données (TypeScript)

```typescript
interface ConversationalQualityMetrics {
  metricsId: string;
  interviewId: string;
  candidateId: string;
  recruiterId: string;
  
  conversationQuality: {
    dimensionCoverage: number;
    informationDepth: number;
    narrativeQuality: number;
    dimensionBalance: number;
  };
  
  engineQuality: {
    patternDetectionRate: number;
    reboundRelevanceRate: number;
    reboundAdoptionRate: number;
    alertRelevanceRate: number;
    tempoRespectRate: number;
    averageResponseTime: number;
  };
  
  businessImpact: {
    decisionQualityImprovement: number;
    interviewTimeReduction: number;
    candidateExperienceImprovement: number;
    failedInterviewsReduction: number;
  };
  
  userSatisfaction: {
    recruiterSatisfaction: number;
    systemTrust: number;
    easeOfUse: number;
    reuseIntention: number;
  };
  
  metadata: {
    calculatedAt: Date;
    version: string;
  };
}

interface QualityMetricsAggregation {
  aggregationId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  averages: {
    conversationQuality: any;
    engineQuality: any;
    businessImpact: any;
    userSatisfaction: any;
  };
  
  trends: {
    [metric: string]: {
      current: number;
      previous: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  
  metadata: {
    calculatedAt: Date;
    version: string;
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE conversational_quality_metrics (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  
  conversation_quality JSON NOT NULL,
  engine_quality JSON NOT NULL,
  business_impact JSON NOT NULL,
  user_satisfaction JSON NOT NULL,
  metadata JSON NOT NULL,
  
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (interview_id) REFERENCES interview(id),
  FOREIGN KEY (candidate_id) REFERENCES candidate(id),
  FOREIGN KEY (recruiter_id) REFERENCES recruiter(id)
);

CREATE INDEX idx_conversational_quality_interview ON conversational_quality_metrics(interview_id);
CREATE INDEX idx_conversational_quality_calculated ON conversational_quality_metrics(calculated_at);

CREATE TABLE quality_metrics_aggregation (
  id VARCHAR(36) PRIMARY KEY,
  
  period JSON NOT NULL,
  averages JSON NOT NULL,
  trends JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. API Endpoints

```typescript
// POST /api/conversational/metrics/calculate
async function calculateQualityMetrics(interviewId: string): Promise<ConversationalQualityMetrics> {
  return await calculateQualityMetrics(interviewId);
}

// GET /api/conversational/metrics/:metricsId
async function getQualityMetrics(metricsId: string): Promise<ConversationalQualityMetrics> {
  return await getQualityMetricsById(metricsId);
}

// GET /api/conversational/metrics/interview/:interviewId
async function getMetricsByInterview(interviewId: string): Promise<ConversationalQualityMetrics> {
  return await getMetricsByInterview(interviewId);
}

// GET /api/conversational/metrics/aggregation
async function getMetricsAggregation(startDate: Date, endDate: Date): Promise<QualityMetricsAggregation> {
  return await getMetricsAggregation(startDate, endDate);
}

// GET /api/conversational/metrics/dashboard
async function getMetricsDashboard(): Promise<any> {
  return await getMetricsDashboard();
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Tableau de Bord Principal

| Métrique | Valeur Actuelle | Cible | Tendance |
|----------|----------------|-------|----------|
| Couverture des dimensions | 85% | 90% | ↗ |
- Profondeur des informations | 72 | 75 | ↗ |
- Taux de détection des patterns | 88% | 90% | ↗ |
- Taux de pertinence des rebonds | 82% | 85% | → |
- Satisfaction des recruteurs | 4.3/5 | 4.5/5 | ↗ |
- Amélioration des décisions | 28% | 30% | ↗ |

### 10.2 Alertes de Qualité

**Alertes automatiques :**
- Couverture des dimensions < 80% : Alert
- Taux de pertinence des rebonds < 75% : Warning
- Satisfaction des recruteurs < 4.0/5 : Critical
- Temps de réponse > 3 secondes : Warning

---

## 11. Conclusion

Les métriques de qualité conversationnelle permettent de mesurer la qualité des entretiens, l'efficacité du moteur, et l'amélioration continue du système. Les métriques sont divisées en 4 catégories (qualité de la conversation, qualité du moteur, impact business, satisfaction utilisateur) avec des cibles claires pour chaque métrique.

**Points clés :**
- 4 catégories de métriques
- 16 métriques principales
- Cibles claires pour chaque métrique
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Tableau de bord principal
- Alertes automatiques
- Agrégation des métriques
- Tendance et évolution
