# DOC-C2-04 : Règles de Scoring des Réponses Préparées

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les règles de scoring des réponses préparées pour le Correctif 2 Detection of Prepared Responses. Ce document structure les 4 niveaux de classification des réponses, les ajustements de score correspondants, et l'intégration avec le scoring global.

---

## 2. Principe Fondateur

Le scoring des réponses préparées ajuste le score en fonction du niveau de préparation détecté et de la qualité de la réponse au démasquage. Une réponse authentique confirmée maintient le score. Une réponse préparée sans fond diminue significativement le score. L'objectif est de refléter la réalité de l'expérience du candidat.

---

## 3. Classification des Réponses

### 3.1 Niveau 1 — Réponse Authentique Confirmée

**Description :**
La réponse est authentique et fondée sur une expérience réelle. Le démasquage confirme l'authenticité.

**Critères :**
- Score de préparation 0-2
- Réponse spontanée aux questions impossibles à préparer
- Détails spécifiques et variés
- Émotion présente
- Capacité à changer de contexte
- Détails précis au zoom
- Réaction calme au silence
- Regret identifié

**Ajustement :**
- Score = score de la compétence démontrée
- Ajustement : 0%

**Note :**
"Authenticité confirmée"

### 3.2 Niveau 2 — Réponse Probablement Préparée mais Fondée

**Description :**
La réponse montre des signes de préparation mais est probablement fondée sur une expérience réelle. La profondeur doit être validée.

**Critères :**
- Score de préparation 3-5
- Réponse partiellement spontanée
- Quelques détails spécifiques
- Émotion modérément présente
- Capacité limitée à changer de contexte
- Détails partiellement précis au zoom
- Réaction légèrement anxieuse au silence
- Regret générique

**Ajustement :**
- Score = score × 0.85
- Ajustement : -15%

**Note :**
"Préparation détectée. Compétence probablement réelle mais profondeur à valider."

### 3.3 Niveau 3 — Réponse Préparée sans Fond Confirmé

**Description :**
La réponse est clairement préparée sans preuve de maîtrise réelle. Lacune probable sur ce point.

**Critères :**
- Score de préparation 6-8
- Réponse peu spontanée
- Détails génériques
- Émotion absente
- Incapacité à changer de contexte
- Détails vagues au zoom
- Réaction anxieuse au silence
- Aucun regret identifié

**Ajustement :**
- Score = score × 0.60
- Ajustement : -40%

**Note :**
"Réponse préparée sans preuve de maîtrise réelle. Lacune probable sur ce point."

### 3.4 Niveau 4 — Réponse Manifestement Non Fondée

**Description :**
La réponse est sans ancrage dans une expérience réelle. Creusage niveau 3 effectué. Expérience douteuse.

**Critères :**
- Score de préparation 9-11
- Réponse non spontanée
- Détails très génériques ou incohérents
- Émotion totalement absente
- Incapacité totale à changer de contexte
- Détails incohérents au zoom
- Réaction très anxieuse au silence
- Aucun regret ou refus de répondre

**Ajustement :**
- Score = score × 0.40
- Ajustement : -60%

**Alerte rouge :**
"Réponse sans ancrage dans une expérience réelle. Creusage niveau 3 effectué. Expérience douteuse."

---

## 4. Algorithme de Scoring

### 4.1 Score Initial

Le score initial est calculé avant le démasquage sur la base de :
- La qualité de la réponse initiale
- La pertinence par rapport à la question
- La structure de la réponse
- Le vocabulaire utilisé

### 4.2 Ajustement selon le Niveau de Classification

**Tableau d'Ajustement :**

| Niveau | Classification | Ajustement | Nouveau Score |
|--------|----------------|------------|--------------|
| 1 | Authentique confirmée | 0% | Score × 1.00 |
| 2 | Probablement préparée mais fondée | -15% | Score × 0.85 |
| 3 | Préparée sans fond confirmé | -40% | Score × 0.60 |
| 4 | Manifestement non fondée | -60% | Score × 0.40 |

### 4.3 Plafond et Plancher

**Plafond :**
- Le score ne peut pas dépasser 100 après ajustement
- Si le score ajusté > 100, il est plafonné à 100

**Plancher :**
- Le score ne peut pas descendre en dessous de 0 après ajustement
- Si le score ajusté < 0, il est planché à 0

### 4.4 Ajustement selon la Qualité du Démasquage

Si le démasquage révèle une authenticité supérieure à la détection initiale :
- Ajustement réduit de 5%
- Exemple : Niveau 3 (-40%) → -35%

Si le démasquage révèle une préparation supérieure à la détection initiale :
- Ajustement augmenté de 5%
- Exemple : Niveau 2 (-15%) → -20%

---

## 5. Intégration avec le Scoring Global

### 5.1 Pondération par Compétence

Chaque compétence a un poids dans le scoring global. L'ajustement après démasquage est appliqué au score de la compétence spécifique.

**Exemple :**
- Compétence "Leadership" : poids 25%
- Score initial : 80/100
- Ajustement après démasquage : -40%
- Score ajusté : 48/100
- Contribution au score global : 48 × 0.25 = 12/25

### 5.2 Impact sur le Score Global

Le score global est recalculé après chaque ajustement de score de compétence.

**Formule :**
Score Global = Σ (Score Compétence Ajusté × Poids Compétence)

### 5.3 Alertes dans le Debrief

**Alerte Orange :**
- Ajustement de -15% (Niveau 2)
- Consignation : "Compétence [X] : préparation détectée, ajustement de -15%"
- Action recommandée : Valider la profondeur

**Alerte Rouge :**
- Ajustement de -40% ou -60% (Niveau 3 ou 4)
- Consignation : "Compétence [X] : réponse préparée sans fond, ajustement de -40%/-60%"
- Action recommandée : Vigilance élevée, considérer l'élimination

---

## 6. Consignation dans le Debrief

### 6.1 Informations Consignées

Pour chaque démasquage, le debrief contient :

**Informations de base :**
- Compétence évaluée
- Question posée
- Réponse initiale
- Score initial

**Informations de détection :**
- Score de préparation (0-11)
- Signaux détectés (Niveau A, B, C)
- Classification initiale

**Informations de démasquage :**
- Techniques de démasquage appliquées
- Réponses au démasquage
- Qualité des réponses

**Informations de scoring :**
- Classification finale
- Ajustement du score
- Score final

**Interprétation :**
- Note explicative
- Recommandation

### 6.2 Format de Consignation

```typescript
interface DebriefUnmaskingEntry {
  entryId: string;
  candidateId: string;
  interviewId: string;
  
  competency: string;
  question: string;
  initialResponse: string;
  initialScore: number;
  
  detection: {
    preparationScore: number;
    signalsDetected: {
      levelA: string[];
      levelB: string[];
      levelC: string[];
    };
    initialClassification: number;
  };
  
  unmasking: {
    techniquesApplied: number[];
    unmaskingResponses: string[];
    responseQuality: {
      spontaneous: boolean;
      specificDetails: boolean;
      emotionPresent: boolean;
      contextChange: boolean;
      zoomPrecision: boolean;
      silenceReaction: string;
      regretIdentified: boolean;
    };
  };
  
  scoring: {
    finalClassification: number;
    adjustment: number;
    finalScore: number;
    note: string;
  };
  
  interpretation: {
    recommendation: string;
    alertLevel: 'none' | 'orange' | 'red';
  };
  
  metadata: {
    version: string;
    createdAt: Date;
  };
}
```

### 6.3 Synthèse pour le Debrief Final

Le debrief final contient une synthèse de tous les démasquages :

**Synthèse Globale :**
- Nombre total de démasquages
- Nombre d'alertes orange
- Nombre d'alertes rouge
- Ajustement moyen du score

**Synthèse par Compétence :**
- Compétences avec démasquage
- Compétences sans démasquage
- Compétences avec alertes

**Recommandation Globale :**
- Candidat recommandé ou non
- Raisons principales
- Points de vigilance

---

## 7. Règles Spéciales

### 7.1 Règle de la Première Impression

Si la première réponse est déjà authentique :
- Pas de démasquage
- Score maintenu
- Note : "Réponse authentique d'emblée"

### 7.2 Règle de l'Amélioration

Si le candidat s'améliore au fil des démasquages :
- Ajustement réduit (ex: -35% au lieu de -40%)
- Note : "Progression détectée"

### 7.3 Règle de la Régression

Si le candidat se détériore au fil des démasquages :
- Ajustement augmenté (ex: -60% au lieu de -40%)
- Note : "Régression détectée"

### 7.4 Règle du Contexte

Si le candidat est sous stress détecté (MVP-038) :
- Ajustement réduit de 5%
- Note : "Stress détecté, ajustement atténué"

### 7.5 Règle de l'Expérience

Si le candidat est junior (< 3 ans d'expérience) :
- Ajustement réduit de 5%
- Note : "Candidat junior, ajustement atténué"

---

## 8. Adaptation par Persona

### 8.1 DRH Senior Bienveillant

**Adaptation :**
- Ajustements standards
- Ton bienveillant dans le debrief
- Focus sur le potentiel

### 8.2 DRH Executive

**Adaptation :**
- Ajustements standards
- Ton factuel dans le debrief
- Focus sur les résultats

### 8.3 DRH Startup

**Adaptation :**
- Ajustements réduits de 5%
- Ton décontracté dans le debrief
- Focus sur l'attitude

### 8.4 DRH Technique

**Adaptation :**
- Ajustements standards
- Ton analytique dans le debrief
- Focus sur les compétences techniques

---

## 9. Structure de Données (TypeScript)

```typescript
interface PreparedResponseScoring {
  scoringId: string;
  responseId: string;
  candidateId: string;
  interviewId: string;
  
  scoredAt: Date;
  
  initialScore: number;
  
  detection: {
    preparationScore: number;
    signalsDetected: {
      levelA: string[];
      levelB: string[];
      levelC: string[];
    };
    initialClassification: number;
  };
  
  unmasking: {
    techniquesApplied: number[];
    unmaskingResponses: string[];
    responseQuality: {
      spontaneous: boolean;
      specificDetails: boolean;
      emotionPresent: boolean;
      contextChange: boolean;
      zoomPrecision: boolean;
      silenceReaction: string;
      regretIdentified: boolean;
    };
  };
  
  classification: {
    level: 1 | 2 | 3 | 4;
    name: string;
    criteria: string[];
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
  
  classifications: {
    level1: {
      name: string;
      description: string;
      criteria: string[];
      adjustment: number;
      note: string;
    };
    level2: {
      name: string;
      description: string;
      criteria: string[];
      adjustment: number;
      note: string;
    };
    level3: {
      name: string;
      description: string;
      criteria: string[];
      adjustment: number;
      note: string;
      alertLevel: string;
    };
    level4: {
      name: string;
      description: string;
      criteria: string[];
      adjustment: number;
      note: string;
      alertLevel: string;
    };
  };
  
  adjustmentTable: {
    level: number;
    classification: string;
    adjustment: number;
    newScoreCalculation: string;
  }[];
  
  limits: {
    ceiling: number;
    floor: number;
  };
  
  unmaskingQualityAdjustment: {
    betterThanDetection: number;
    worseThanDetection: number;
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

## 10. Stockage et Gestion

### 10.1 Schéma SQL

```sql
CREATE TABLE prepared_response_scoring (
  id VARCHAR(36) PRIMARY KEY,
  response_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  scored_at TIMESTAMP NOT NULL,
  
  initial_score DECIMAL(5,2) NOT NULL,
  
  preparation_score INT NOT NULL,
  signals_detected JSON NOT NULL,
  initial_classification INT NOT NULL,
  
  techniques_applied INT NOT NULL,
  unmasking_responses JSON NOT NULL,
  response_quality JSON NOT NULL,
  
  classification_level INT NOT NULL,
  classification_name VARCHAR(50) NOT NULL,
  classification_criteria JSON NOT NULL,
  
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

CREATE INDEX idx_prepared_scoring_response ON prepared_response_scoring(response_id);
CREATE INDEX idx_prepared_scoring_candidate ON prepared_response_scoring(candidate_id);
CREATE INDEX idx_prepared_scoring_interview ON prepared_response_scoring(interview_id);
CREATE INDEX idx_prepared_scoring_classification ON prepared_response_scoring(classification_level);

CREATE TABLE scoring_rules (
  id VARCHAR(36) PRIMARY KEY,
  
  classifications JSON NOT NULL,
  adjustment_table JSON NOT NULL,
  limits JSON NOT NULL,
  unmasking_quality_adjustment JSON NOT NULL,
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

## 11. API Endpoints

```typescript
// POST /api/prepared-response/score
async function scorePreparedResponse(responseId: string, detection: any, unmasking: any, initialScore: number): Promise<PreparedResponseScoring> {
  return await scorePreparedResponse(responseId, detection, unmasking, initialScore);
}

// GET /api/prepared-response/scoring/:scoringId
async function getPreparedResponseScoring(scoringId: string): Promise<PreparedResponseScoring> {
  return await getPreparedResponseScoringById(scoringId);
}

// GET /api/prepared-response/scoring/response/:responseId
async function getScoringByResponse(responseId: string): Promise<PreparedResponseScoring> {
  return await getScoringByResponse(responseId);
}

// GET /api/prepared-response/scoring/candidate/:candidateId
async function getScoringByCandidate(candidateId: string): Promise<PreparedResponseScoring[]> {
  return await getScoringByCandidate(candidateId);
}

// GET /api/prepared-response/scoring-rules
async function getScoringRules(): Promise<ScoringRules> {
  return await getScoringRules();
}

// PUT /api/prepared-response/scoring-rules
async function updateScoringRules(rules: ScoringRules): Promise<ScoringRules> {
  return await updateScoringRules(rules);
}

// POST /api/prepared-response/classify
async function classifyResponse(detection: any, unmasking: any): Promise<number> {
  return await classifyResponse(detection, unmasking);
}

// POST /api/prepared-response/calculate-adjustment
async function calculateAdjustment(classification: number, unmaskingQuality: any): Promise<number> {
  return await calculateAdjustment(classification, unmaskingQuality);
}
```

---

## 12. Indicateurs de Suivi

### 12.1 Métriques de Scoring

| Métrique | Description | Cible |
|----------|-------------|-------|
| Ajustement moyen | Moyenne des ajustements | Variable |
- Taux de maintien | Ajustements 0% / total | Variable |
- Taux de réduction légère | Ajustements -15% / total | Variable |
- Taux de réduction modérée | Ajustements -40% / total | Variable |
- Taux de réduction sévère | Ajustements -60% / total | Variable |

### 12.2 Métriques d'Alertes

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'alertes orange | Alertes orange / total | ≤ 25% |
- Taux d'alertes rouge | Alertes rouge / total | ≤ 10% |

---

## 13. Conclusion

Les règles de scoring des réponses préparées structurent l'ajustement du score en fonction du niveau de classification. Niveau 1 (authentique confirmée) : ajustement 0%. Niveau 2 (probablement préparée mais fondée) : ajustement -15%. Niveau 3 (préparée sans fond confirmé) : ajustement -40%. Niveau 4 (manifestement non fondée) : ajustement -60%. Le score est plafonné à 100 et planché à 0. L'ajustement peut être modifié selon la qualité du démasquage. Les ajustements sont intégrés au scoring global avec pondération. Les alertes orange (-15%) et rouge (-40%, -60%) sont consignées dans le debrief. Des règles spéciales s'appliquent selon le contexte (stress, expérience, progression, régression). Les adaptations par persona modifient légèrement les ajustements.

**Points clés :**
- 4 niveaux de classification
- Ajustement de 0% à -60%
- Niveau 1 : authentique confirmée (0%)
- Niveau 2 : probablement préparée mais fondée (-15%)
- Niveau 3 : préparée sans fond confirmé (-40%)
- Niveau 4 : manifestement non fondée (-60%)
- Plafond à 100, plancher à 0
- Ajustement modifié selon qualité du démasquage
- Intégration au scoring global avec pondération
- Alertes orange (-15%) et rouge (-40%, -60%)
- Consignation détaillée dans le debrief
- Règles spéciales (première impression, amélioration, régression, stress, expérience)
- Adaptation par persona (Senior, Executive, Startup, Technique)
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour le scoring
- Métriques de scoring et d'alertes
