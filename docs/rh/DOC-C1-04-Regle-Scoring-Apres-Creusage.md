# DOC-C1-04 : Règle de Scoring après Creusage

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les règles de scoring après creusage pour le Correctif 1 Deep Drilling Engine. Ce document structure l'algorithme d'ajustement du score en fonction de la qualité de la réponse au creusage, l'intégration avec le scoring global, et la consignation dans le debrief.

---

## 2. Principe Fondateur

Le creusage ne doit pas pénaliser systématiquement. Il doit ajuster le score en fonction de la qualité de la réponse au creusage. Une réponse riche, cohérente et ouverte peut même augmenter le score. Une réponse incohérente ou évasive doit diminuer significativement le score. L'objectif est de refléter la réalité de l'expérience du candidat.

---

## 3. Algorithme d'Ajustement du Score

### 3.1 Score Initial

Le score initial est calculé avant le creusage sur la base de :
- La qualité de la réponse initiale
- La pertinence par rapport à la question
- La structure de la réponse
- Le vocabulaire utilisé

### 3.2 Ajustement selon la Qualité du Creusage

L'ajustement est calculé selon la grille d'interprétation post-creusage (DOC-C1-03).

**Tableau d'Ajustement :**

| Richesse | Cohérence | Réaction | Ajustement | Nouveau Score |
|----------|-----------|----------|------------|--------------|
| Riche | Cohérente | Ouverte | +10% | Score × 1.10 |
| Riche | Cohérente | Défensive | 0% | Score × 1.00 |
| Riche | Incohérente | Ouverte | -20% | Score × 0.80 |
| Riche | Incohérente | Défensive | -30% | Score × 0.70 |
| Riche | Incohérente | Évasive | -40% | Score × 0.60 |
| Standard | Cohérente | Ouverte | 0% | Score × 1.00 |
| Standard | Cohérente | Défensive | -10% | Score × 0.90 |
| Standard | Incohérente | Ouverte | -30% | Score × 0.70 |
| Standard | Incohérente | Défensive | -35% | Score × 0.65 |
| Standard | Incohérente | Évasive | -40% | Score × 0.60 |
| Pauvre | Cohérente | Ouverte | -20% | Score × 0.80 |
| Pauvre | Cohérente | Défensive | -30% | Score × 0.70 |
| Pauvre | Incohérente | Ouverte | -35% | Score × 0.65 |
| Pauvre | Incohérente | Défensive | -40% | Score × 0.60 |
| Pauvre | Incohérente | Évasive | -40% | Score × 0.60 |

### 3.3 Plafond et Plancher

**Plafond :**
- Le score ne peut pas dépasser 100 après ajustement
- Si le score ajusté > 100, il est plafonné à 100

**Plancher :**
- Le score ne peut pas descendre en dessous de 0 après ajustement
- Si le score ajusté < 0, il est planché à 0

### 3.4 Arrêt après 3 Creusages

Si après 3 creusages successifs la réponse reste vague :
- Le score est ajusté de -40%
- Le creusage est arrêté sur ce point
- L'information est consignée dans le debrief

---

## 4. Intégration avec le Scoring Global

### 4.1 Pondération par Compétence

Chaque compétence a un poids dans le scoring global. L'ajustement après creusage est appliqué au score de la compétence spécifique.

**Exemple :**
- Compétence "Gestion de projet" : poids 30%
- Score initial : 80/100
- Ajustement après creusage : -20%
- Score ajusté : 64/100
- Contribution au score global : 64 × 0.30 = 19.2/30

### 4.2 Impact sur le Score Global

Le score global est recalculé après chaque ajustement de score de compétence.

**Formule :**
Score Global = Σ (Score Compétence Ajusté × Poids Compétence)

### 4.3 Alertes dans le Debrief

**Alerte Orange :**
- Ajustement de -30% à -35%
- Consignation : "Compétence [X] : réponse vague après creusage, ajustement de -30%"
- Action recommandée : Investiguer plus avant

**Alerte Rouge :**
- Ajustement de -40%
- Consignation : "Compétence [X] : réponse très vague après creusage, ajustement de -40%"
- Action recommandée : Vigilance élevée, considérer l'élimination

---

## 5. Consignation dans le Debrief

### 5.1 Informations Consignées

Pour chaque creusage, le debrief contient :

**Informations de base :**
- Compétence évaluée
- Question posée
- Réponse initiale
- Score initial

**Informations de détection :**
- Score de vague (0-8)
- Critères de vague détectés
- Niveau de creusage (1, 2, 3)

**Informations de creusage :**
- Questions de creusage posées
- Réponses au creusage
- Nombre de creusages

**Informations d'évaluation :**
- Richesse des détails
- Cohérence sous creusage
- Réaction au creusage
- Ajustement du score
- Score final

**Interprétation :**
- Cas de vague identifié (1-4)
- Recommandation

### 5.2 Format de Consignation

```typescript
interface DebriefDrillingEntry {
  entryId: string;
  candidateId: string;
  interviewId: string;
  
  competency: string;
  question: string;
  initialResponse: string;
  initialScore: number;
  
  vaguenessDetection: {
    score: number;
    criteriaDetected: number[];
    level: number;
  };
  
  drilling: {
    questionsAsked: string[];
    responses: string[];
    drillingCount: number;
  };
  
  evaluation: {
    richness: string;
    coherence: string;
    reaction: string;
    adjustment: number;
    finalScore: number;
  };
  
  interpretation: {
    case: number;
    caseName: string;
    recommendation: string;
  };
  
  alertLevel: 'none' | 'orange' | 'red';
  
  metadata: {
    version: string;
    createdAt: Date;
  };
}
```

### 5.3 Synthèse pour le Debrief Final

Le debrief final contient une synthèse de tous les creusages :

**Synthèse Globale :**
- Nombre total de creusages
- Nombre d'alertes orange
- Nombre d'alertes rouge
- Ajustement moyen du score

**Synthèse par Compétence :**
- Compétences avec creusage
- Compétences sans creusage
- Compétences avec alertes

**Recommandation Globale :**
- Candidat recommandé ou non
- Raisons principales
- Points de vigilance

---

## 6. Règles Spéciales

### 6.1 Règle de la Première Impression

Si la première réponse est déjà riche et précise :
- Pas de creusage
- Score maintenu
- Note : "Réponse précise d'emblée"

### 6.2 Règle de l'Amélioration

Si le candidat s'améliore au fil des creusages :
- Ajustement réduit (ex: -20% au lieu de -30%)
- Note : "Progression détectée"

### 6.3 Règle de la Régression

Si le candidat se détériore au fil des creusages :
- Ajustement augmenté (ex: -40% au lieu de -30%)
- Note : "Régression détectée"

### 6.4 Règle du Contexte

Si le candidat est sous stress détecté (MVP-038) :
- Ajustement réduit de 5%
- Note : "Stress détecté, ajustement atténué"

### 6.5 Règle de l'Expérience

Si le candidat est junior (< 3 ans d'expérience) :
- Ajustement réduit de 5%
- Note : "Candidat junior, ajustement atténué"

---

## 7. Adaptation par Persona

### 7.1 DRH Senior Bienveillant

**Adaptation :**
- Ajustements standards
- Ton bienveillant dans le debrief
- Focus sur le potentiel

### 7.2 DRH Executive

**Adaptation :**
- Ajustements standards
- Ton factuel dans le debrief
- Focus sur les résultats

### 7.3 DRH Startup

**Adaptation :**
- Ajustements réduits de 5%
- Ton décontracté dans le debrief
- Focus sur l'attitude

### 7.4 DRH Technique

**Adaptation :**
- Ajustements standards
- Ton analytique dans le debrief
- Focus sur les compétences techniques

---

## 8. Structure de Données (TypeScript)

```typescript
interface PostDrillingScoring {
  scoringId: string;
  responseId: string;
  candidateId: string;
  interviewId: string;
  
  scoredAt: Date;
  
  initialScore: number;
  
  evaluation: {
    richness: 'rich' | 'standard' | 'poor';
    coherence: 'coherent' | 'incoherent';
    reaction: 'open' | 'defensive' | 'evasive';
  };
  
  adjustment: {
    percentage: number;
    calculation: string;
    reason: string;
  };
  
  finalScore: number;
  
  scoringRules: {
    ceiling: number;
    floor: number;
    applied: boolean;
  };
  
  specialRules: {
    firstImpression: boolean;
    improvement: boolean;
    regression: boolean;
    stressContext: boolean;
    experienceContext: boolean;
    adjustments: number[];
  };
  
  globalImpact: {
    competencyWeight: number;
    globalScoreContribution: number;
    alertLevel: 'none' | 'orange' | 'red';
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ScoringRules {
  rulesId: string;
  
  adjustmentTable: {
    combination: string;
    adjustment: number;
    newScoreCalculation: string;
  }[];
  
  limits: {
    ceiling: number;
    floor: number;
  };
  
  threeDrillRule: {
    maxDrills: number;
    finalAdjustment: number;
    action: string;
  };
  
  globalIntegration: {
    competencyWeighting: boolean;
    globalScoreRecalculation: boolean;
  };
  
  alerts: {
    orange: {
      threshold: number;
      consignation: string;
      recommendation: string;
    };
    red: {
      threshold: number;
      consignation: string;
      recommendation: string;
    };
  };
  
  specialRules: {
    firstImpression: {
      condition: string;
      action: string;
    };
    improvement: {
      condition: string;
      adjustment: number;
    };
    regression: {
      condition: string;
      adjustment: number;
    };
    stressContext: {
      condition: string;
      adjustment: number;
    };
    experienceContext: {
      condition: string;
      adjustment: number;
    };
  };
  
  personaAdaptations: {
    senior: {
      adjustmentModifier: number;
      debriefTone: string;
      focus: string;
    };
    executive: {
      adjustmentModifier: number;
      debriefTone: string;
      focus: string;
    };
    startup: {
      adjustmentModifier: number;
      debriefTone: string;
      focus: string;
    };
    technical: {
      adjustmentModifier: number;
      debriefTone: string;
      focus: string;
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

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE post_drilling_scoring (
  id VARCHAR(36) PRIMARY KEY,
  response_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  scored_at TIMESTAMP NOT NULL,
  
  initial_score DECIMAL(5,2) NOT NULL,
  
  richness_level VARCHAR(20) NOT NULL,
  coherence_level VARCHAR(20) NOT NULL,
  reaction_level VARCHAR(20) NOT NULL,
  
  adjustment_percentage DECIMAL(5,2) NOT NULL,
  adjustment_calculation TEXT NOT NULL,
  adjustment_reason TEXT NOT NULL,
  
  final_score DECIMAL(5,2) NOT NULL,
  
  scoring_rules JSON NOT NULL,
  special_rules JSON NOT NULL,
  global_impact JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_drilling_scoring_response ON post_drilling_scoring(response_id);
CREATE INDEX idx_post_drilling_scoring_candidate ON post_drilling_scoring(candidate_id);
CREATE INDEX idx_post_drilling_scoring_interview ON post_drilling_scoring(interview_id);

CREATE TABLE scoring_rules (
  id VARCHAR(36) PRIMARY KEY,
  
  adjustment_table JSON NOT NULL,
  limits JSON NOT NULL,
  three_drill_rule JSON NOT NULL,
  global_integration JSON NOT NULL,
  alerts JSON NOT NULL,
  special_rules JSON NOT NULL,
  persona_adaptations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 10. API Endpoints

```typescript
// POST /api/deep-drilling/score
async function scorePostDrilling(responseId: string, evaluation: any, initialScore: number): Promise<PostDrillingScoring> {
  return await scorePostDrilling(responseId, evaluation, initialScore);
}

// GET /api/deep-drilling/scoring/:scoringId
async function getPostDrillingScoring(scoringId: string): Promise<PostDrillingScoring> {
  return await getPostDrillingScoringById(scoringId);
}

// GET /api/deep-drilling/scoring/response/:responseId
async function getScoringByResponse(responseId: string): Promise<PostDrillingScoring> {
  return await getScoringByResponse(responseId);
}

// GET /api/deep-drilling/scoring/candidate/:candidateId
async function getScoringByCandidate(candidateId: string): Promise<PostDrillingScoring[]> {
  return await getScoringByCandidate(candidateId);
}

// GET /api/deep-drilling/scoring-rules
async function getScoringRules(): Promise<ScoringRules> {
  return await getScoringRules();
}

// PUT /api/deep-drilling/scoring-rules
async function updateScoringRules(rules: ScoringRules): Promise<ScoringRules> {
  return await updateScoringRules(rules);
}

// POST /api/deep-drilling/calculate-adjustment
async function calculateAdjustment(richness: string, coherence: string, reaction: string): Promise<number> {
  return await calculateAdjustment(richness, coherence, reaction);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Scoring

| Métrique | Description | Cible |
|----------|-------------|-------|
| Ajustement moyen | Moyenne des ajustements | Variable |
- Taux d'augmentation | Ajustements positifs / total | ≥ 10% |
- Taux de diminution | Ajustements négatifs / total | Variable |
- Ajustement maximum | Ajustement le plus élevé | +10% |
- Ajustement minimum | Ajustement le plus bas | -40% |

### 11.2 Métriques d'Alertes

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'alertes orange | Alertes orange / total | ≤ 20% |
- Taux d'alertes rouge | Alertes rouge / total | ≤ 5% |
- Taux d'arrêt après 3 creusages | Arrêt après 3 / total | ≤ 10% |

---

## 12. Conclusion

Les règles de scoring après creusage structurent l'algorithme d'ajustement du score en fonction de la qualité de la réponse au creusage. L'ajustement varie de +10% (réponse riche, cohérente, ouverte) à -40% (réponse incohérente ou évasive). Le score est plafonné à 100 et planché à 0. La règle des 3 creusages limite le nombre de questions consécutives. Les ajustements sont intégrés au scoring global avec pondération par compétence. Les alertes orange et rouge sont consignées dans le debrief. Des règles spéciales s'appliquent selon le contexte (stress, expérience, progression, régression). Les adaptations par persona modifient légèrement les ajustements.

**Points clés :**
- Ajustement de +10% à -40% selon la qualité de la réponse
- 15 combinaisons possibles avec ajustements spécifiques
- Plafond à 100, plancher à 0
- Règle des 3 creusages maximum par point
- Intégration au scoring global avec pondération
- Alertes orange (-30% à -35%) et rouge (-40%)
- Consignation détaillée dans le debrief
- Règles spéciales (première impression, amélioration, régression, stress, expérience)
- Adaptation par persona (Senior, Executive, Startup, Technique)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour le scoring
- Métriques de scoring et d'alertes
