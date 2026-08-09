# DOC-C7-03 : Formule de Calcul avec Coefficients

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la formule de calcul avec coefficients pour le Correctif 7 Scoring Calibration. Ce document structure la formule complète de calcul du score final, incluant les ajustements pour les lacunes critiques, les absences notables, et la cohérence.

---

## 2. Principe Fondateur

Le score final est calculé en appliquant successivement les 5 principes de calibration juste au score brut. Les ajustements sont multiplicatifs et additifs pour garantir que le score final reflète la réalité du candidat pour le poste.

---

## 3. Formule Complète

### 3.1 Étape 1 — Calcul du Score Brut

**Formule :**
Score brut = Σ (dimension × poids)

**Détail :**
Score brut = (Compétences × 0.25) + (Expérience × 0.20) + (Connaissances légales × 0.15) + (Soft skills × 0.20) + (Adéquation culturelle × 0.10) + (Maturité × 0.10)

**Conversion en pourcentage :**
Score brut (%) = Score brut / 5 × 100

**Exemple :**
- Compétences : 4/5
- Expérience : 3/5
- Connaissances légales : 3/5
- Soft skills : 4/5
- Adéquation culturelle : 3/5
- Maturité : 3/5

Score brut = (4 × 0.25) + (3 × 0.20) + (3 × 0.15) + (4 × 0.20) + (3 × 0.10) + (3 × 0.10)
Score brut = 1.0 + 0.6 + 0.45 + 0.8 + 0.3 + 0.3 = 3.45 / 5
Score brut (%) = 3.45 / 5 × 100 = 69/100

### 3.2 Étape 2 — Application du Coefficient Lacunes Critiques

**Principe 2 : Les lacunes critiques pèsent plus que les forces**

**Coefficient par nombre de lacunes critiques :**
- 0 lacune critique : × 1.00
- 1 lacune critique : × 0.75
- 2 lacunes critiques : × 0.60
- 3 lacunes critiques : × 0.50
- 4+ lacunes critiques : × 0.40

**Formule :**
Score après lacunes critiques = Score brut × Coefficient lacunes critiques

**Exemple :**
Score brut : 69/100
Lacunes critiques : 2
Coefficient : × 0.60
Score après lacunes critiques = 69 × 0.60 = 41.4/100

### 3.3 Étape 3 — Application des Pénalités de Silence

**Principe 3 : Le silence est un score négatif**

**Pénalités par élément non mentionné :**
- Critique : −5 points
- Significatif : −3 points
- Mineur : −1 point

**Formule :**
Score après silence = Score après lacunes critiques − Σ (pénalités de silence)

**Exemple :**
Score après lacunes critiques : 41.4/100
Éléments non mentionnés :
- Autorisation Inspection du Travail (critique) : −5 points
- Budget RH (significatif) : −3 points
- Stratégie (significatif) : −3 points
Total pénalités : −11 points

Score après silence = 41.4 − 11 = 30.4/100

### 3.4 Étape 4 — Application du Coefficient Cohérence

**Principe 5 : La cohérence vaut plus que la performance ponctuelle**

**Coefficient par niveau de cohérence :**
- Cohérence élevée : × 1.10
- Cohérence standard : × 1.00
- Cohérence faible : × 0.90

**Formule :**
Score après cohérence = Score après silence × Coefficient cohérence

**Exemple :**
Score après silence : 30.4/100
Cohérence : standard
Coefficient : × 1.00
Score après cohérence = 30.4 × 1.00 = 30.4/100

### 3.5 Étape 5 — Arrondi Final

**Règle d'arrondi :**
Arrondir à l'entier le plus proche (0.5 arrondi à l'entier supérieur)

**Formule :**
Score final = Arrondi(Score après cohérence)

**Exemple :**
Score après cohérence : 30.4/100
Score final = 30/100

---

## 4. Formule Complète Synthétisée

### 4.1 Formule Mathématique

**Score final = Arrondi[ ( (Σ (dimension × poids) / 5 × 100 ) × Coefficient_lacunes_critiques − Σ (pénalités_silence) ) × Coefficient_cohérence ]**

### 4.2 Décomposition

1. **Score brut :** Σ (dimension × poids) / 5 × 100
2. **Ajustement lacunes critiques :** × Coefficient_lacunes_critiques
3. **Ajustement silence :** − Σ (pénalités_silence)
4. **Ajustement cohérence :** × Coefficient_cohérence
5. **Arrondi :** Arrondi à l'entier le plus proche

---

## 5. Exemples de Calcul

### 5.1 Exemple 1 — Candidat Excellent

**Scores par dimension :**
- Compétences : 5/5
- Expérience : 5/5
- Connaissances légales : 5/5
- Soft skills : 5/5
- Adéquation culturelle : 5/5
- Maturité : 5/5

**Calcul :**
Score brut = (5 × 0.25) + (5 × 0.20) + (5 × 0.15) + (5 × 0.20) + (5 × 0.10) + (5 × 0.10)
Score brut = 1.25 + 1.0 + 0.75 + 1.0 + 0.5 + 0.5 = 5.0 / 5
Score brut (%) = 5.0 / 5 × 100 = 100/100

**Ajustements :**
- Lacunes critiques : 0 → × 1.00
- Pénalités de silence : 0 → −0
- Cohérence : élevée → × 1.10

**Score final :**
Score final = (100 × 1.00 − 0) × 1.10 = 110/100
Score final arrondi = 110/100 (plafond à 100)

### 5.2 Exemple 2 — Candidat Sophie (Cas Réel)

**Scores par dimension :**
- Compétences : 3/5
- Expérience : 3/5
- Connaissances légales : 2/5
- Soft skills : 3/5
- Adéquation culturelle : 4/5
- Maturité : 2/5

**Calcul :**
Score brut = (3 × 0.25) + (3 × 0.20) + (2 × 0.15) + (3 × 0.20) + (4 × 0.10) + (2 × 0.10)
Score brut = 0.75 + 0.6 + 0.3 + 0.6 + 0.4 + 0.2 = 2.85 / 5
Score brut (%) = 2.85 / 5 × 100 = 57/100

**Ajustements :**
- Lacunes critiques : 2 (méconnaissance procédure salarié protégé, incapacité gérer conflit collectif) → × 0.60
- Pénalités de silence : −10 (autorisation IT −5, budget RH −3, stratégie −3)
- Cohérence : standard → × 1.00

**Score final :**
Score final = (57 × 0.60 − 10) × 1.00
Score final = (34.2 − 10) × 1.00 = 24.2/100
Score final arrondi = 24/100

**Résultat :**
Score moteur (ancien) : 64/100
Score moteur (nouveau) : 24/100
Score DRH senior attendu : 45/100
Écart nouveau : 21 points (sous-estimation due aux lacunes critiques)

### 5.3 Exemple 3 — Candidat Moyen

**Scores par dimension :**
- Compétences : 4/5
- Expérience : 3/5
- Connaissances légales : 3/5
- Soft skills : 4/5
- Adéquation culturelle : 3/5
- Maturité : 3/5

**Calcul :**
Score brut = (4 × 0.25) + (3 × 0.20) + (3 × 0.15) + (4 × 0.20) + (3 × 0.10) + (3 × 0.10)
Score brut = 1.0 + 0.6 + 0.45 + 0.8 + 0.3 + 0.3 = 3.45 / 5
Score brut (%) = 3.45 / 5 × 100 = 69/100

**Ajustements :**
- Lacunes critiques : 0 → × 1.00
- Pénalités de silence : −5 (budget RH −3, stratégie −2)
- Cohérence : standard → × 1.00

**Score final :**
Score final = (69 × 1.00 − 5) × 1.00
Score final = 64/100
Score final arrondi = 64/100

### 5.4 Exemple 4 — Candidat Faible

**Scores par dimension :**
- Compétences : 2/5
- Expérience : 2/5
- Connaissances légales : 1/5
- Soft skills : 2/5
- Adéquation culturelle : 2/5
- Maturité : 1/5

**Calcul :**
Score brut = (2 × 0.25) + (2 × 0.20) + (1 × 0.15) + (2 × 0.20) + (2 × 0.10) + (1 × 0.10)
Score brut = 0.5 + 0.4 + 0.15 + 0.4 + 0.2 + 0.1 = 1.75 / 5
Score brut (%) = 1.75 / 5 × 100 = 35/100

**Ajustements :**
- Lacunes critiques : 1 (méconnaissance procédure salarié protégé) → × 0.75
- Pénalités de silence : −15 (autorisation IT −5, budget RH −3, stratégie −3, processus −4)
- Cohérence : faible → × 0.90

**Score final :**
Score final = (35 × 0.75 − 15) × 0.90
Score final = (26.25 − 15) × 0.90 = 10.125/100
Score final arrondi = 10/100

---

## 6. Plancher et Plafond

### 6.1 Plancher Minimum

**Score minimum :** 0/100

Si le calcul donne un score négatif, le score final est 0/100.

### 6.2 Plafond Maximum

**Score maximum :** 100/100

Si le calcul donne un score supérieur à 100, le score final est 100/100.

---

## 7. Structure de Données (TypeScript)

```typescript
interface ScoringCalculation {
  calculationId: string;
  candidateId: string;
  positionId: string;
  interviewId: string;
  
  calculatedAt: Date;
  
  dimensions: {
    technicalSkills: {
      score: number;
      weight: number;
    };
    relevantExperience: {
      score: number;
      weight: number;
    };
    legalKnowledge: {
      score: number;
      weight: number;
    };
    softSkills: {
      score: number;
      weight: number;
    };
    culturalFit: {
      score: number;
      weight: number;
    };
    maturity: {
      score: number;
      weight: number;
    };
  };
  
  rawScore: {
    score: number;
    percentage: number;
    calculation: string;
  };
  
  adjustments: {
    criticalGaps: {
      count: number;
      coefficient: number;
      score: number;
    };
    silencePenalties: {
      elements: {
        element: string;
        type: 'critical' | 'significant' | 'minor';
        points: number;
      }[];
      total: number;
      score: number;
    };
    coherence: {
      level: 'high' | 'standard' | 'low';
      coefficient: number;
      score: number;
    };
  };
  
  finalScore: {
    score: number;
    rounded: number;
    classification: string;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ScoringFormula {
  formulaId: string;
  
  formula: {
    rawScore: string;
    criticalGaps: string;
    silencePenalties: string;
    coherence: string;
    final: string;
  };
  
  coefficients: {
    criticalGaps: {
      zero: number;
      one: number;
      two: number;
      three: number;
      fourPlus: number;
    };
    coherence: {
      high: number;
      standard: number;
      low: number;
    };
    silencePenalties: {
      critical: number;
      significant: number;
      minor: number;
    };
  };
  
  limits: {
    minimum: number;
    maximum: number;
  };
  
  examples: {
    excellent: ScoringCalculation;
    sophie: ScoringCalculation;
    medium: ScoringCalculation;
    low: ScoringCalculation;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 8. Stockage et Gestion

### 8.1 Schéma SQL

```sql
CREATE TABLE scoring_calculation (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  position_id VARCHAR(36) NOT NULL,
  interview_id VARCHAR(36) NOT NULL,
  
  calculated_at TIMESTAMP NOT NULL,
  
  dimensions JSON NOT NULL,
  raw_score JSON NOT NULL,
  adjustments JSON NOT NULL,
  final_score JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_scoring_calculation_candidate ON scoring_calculation(candidate_id);
CREATE INDEX idx_scoring_calculation_position ON scoring_calculation(position_id);
CREATE INDEX idx_scoring_calculation_interview ON scoring_calculation(interview_id);

CREATE TABLE scoring_formula (
  id VARCHAR(36) PRIMARY KEY,
  
  formula JSON NOT NULL,
  coefficients JSON NOT NULL,
  limits JSON NOT NULL,
  examples JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 9. API Endpoints

```typescript
// GET /api/scoring-formula
async function getScoringFormula(): Promise<ScoringFormula> {
  return await getScoringFormula();
}

// PUT /api/scoring-formula
async function updateScoringFormula(formula: ScoringFormula): Promise<ScoringFormula> {
  return await updateScoringFormula(formula);
}

// POST /api/scoring-calculation
async function calculateFinalScore(candidateId: string, positionId: string, interviewId: string, dimensions: any, adjustments: any): Promise<ScoringCalculation> {
  return await calculateFinalScore(candidateId, positionId, interviewId, dimensions, adjustments);
}

// GET /api/scoring-calculation/:calculationId
async function getScoringCalculation(calculationId: string): Promise<ScoringCalculation> {
  return await getScoringCalculationById(calculationId);
}

// POST /api/scoring/calculate-raw-score
async function calculateRawScore(dimensions: any): Promise<number> {
  return await calculateRawScore(dimensions);
}

// POST /api/scoring/apply-critical-gaps-coefficient
async function applyCriticalGapsCoefficient(score: number, criticalGaps: number): Promise<number> {
  return await applyCriticalGapsCoefficient(score, criticalGaps);
}

// POST /api/scoring/apply-silence-penalties
async function applySilencePenalties(score: number, penalties: any): Promise<number> {
  return await applySilencePenalties(score, penalties);
}

// POST /api/scoring/apply-coherence-coefficient
async function applyCoherenceCoefficient(score: number, coherence: 'high' | 'standard' | 'low'): Promise<number> {
  return await applyCoherenceCoefficient(score, coherence);
}

// POST /api/scoring/round-final-score
async function roundFinalScore(score: number): Promise<number> {
  return await roundFinalScore(score);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Distribution

| Métrique | Description | Cible |
|----------|-------------|-------|
| Distribution des scores finaux | % par tranche de score | Variable selon exigence |
- Score moyen par poste | Moyenne des scores finaux | Variable selon poste |

### 10.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Écart moyen moteur / DRH senior | Différence moyenne des scores | ≤ 5 points |
- Taux d'application des ajustements | Ajustements appliqués / total | 100% |

---

## 11. Conclusion

La formule de calcul avec coefficients structure le calcul du score final en 5 étapes. Étape 1 : Calcul du score brut = Σ (dimension × poids) / 5 × 100. Étape 2 : Application du coefficient lacunes critiques (0 lacunes × 1.00, 1 lacune × 0.75, 2 lacunes × 0.60, 3 lacunes × 0.50, 4+ lacunes × 0.40). Étape 3 : Application des pénalités de silence (critique −5, significatif −3, mineur −1). Étape 4 : Application du coefficient cohérence (élevée × 1.10, standard × 1.00, faible × 0.90). Étape 5 : Arrondi final à l'entier le plus proche. Formule complète : Score final = Arrondi[ ( (Σ (dimension × poids) / 5 × 100 ) × Coefficient_lacunes_critiques − Σ (pénalités_silence) ) × Coefficient_cohérence ]. Plancher minimum 0/100, plafond maximum 100/100. Exemples de calcul pour candidats excellent, Sophie (cas réel), moyen, faible. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Formule en 5 étapes
- Coefficient lacunes critiques multiplicatif
- Pénalités de silence additives
- Coefficient cohérence multiplicatif
- Arrondi final
- Plancher 0/100, plafond 100/100
- Exemples de calcul détaillés
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de distribution et de qualité
