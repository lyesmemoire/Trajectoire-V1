# DOC-M02-06 : Protocole d'Impact sur le Scoring

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'impact sur le scoring pour le MVP-META-02 Silence Intelligence Engine. Ce document structure comment les silences détectés impactent le scoring global du candidat.

---

## 2. Principe Fondateur

Les silences détectés ont un impact quantifié sur le scoring du candidat. L'impact est calculé en fonction du niveau de silence, du type de sujet, et de la dimension affectée. Le protocole garantit une application cohérente et transparente de l'impact.

---

## 3. Processus d'Impact sur le Scoring

### 3.1 Détection et Classification

**Processus :**
1. Le moteur détecte les sujets attendus non mentionnés
2. Le moteur classe chaque silence selon les 4 niveaux
3. Le moteur identifie le type de sujet (Catégorie A, B, C, Fondamental)

### 3.2 Calcul de l'Impact

**Processus :**
1. Pour chaque silence, appliquer la matrice d'impact
2. Sommer les impacts de tous les silences
3. Appliquer un plafond maximum d'impact (−10 points)

### 3.3 Application au Scoring Global

**Processus :**
1. Soustraire l'impact total du score global
2. Documenter l'impact dans le debrief
3. Justifier chaque déduction

---

## 4. Matrice d'Impact

### 4.1 Matrice par Niveau et Type de Sujet

| Niveau | Catégorie A (90%+) | Catégorie B (60-90%) | Catégorie C (30-60%) | Fondamental |
|--------|-------------------|---------------------|---------------------|-------------|
| Niveau 1 (1 sujet) | −1 point | 0 point | 0 point | −2 points |
| Niveau 2 (2-3 sujets) | −2 points | −1 point | 0 point | −4 points |
| Niveau 3 (4-5 sujets) | −4 points | −3 points | −2 points | −6 points |
| Niveau 4 (Sujet fondamental) | −10 points | −8 points | −5 points | −10 points |

### 4.2 Matrice par Dimension

| Dimension | Impact maximum par silence | Plafond total |
|-----------|---------------------------|----------------|
| Relations sociales | −3 points | −6 points |
| Politique salariale | −3 points | −6 points |
| Recrutement | −2 points | −4 points |
| Formation | −2 points | −4 points |
| Management | −3 points | −6 points |
| Résultats | −2 points | −4 points |
| Vision | −2 points | −4 points |
| Valeurs | −2 points | −4 points |

---

## 5. Plafonnement et Ajustements

### 5.1 Plafond Maximum

**Règle :**
L'impact total des silences ne peut excéder −10 points sur le score global.

**Justification :**
- Éviter la disqualification automatique sur la base de silences seuls
- Garantir une évaluation équilibrée
- Permettre la compensation par d'autres dimensions

### 5.2 Ajustements Contextuels

**Cas 1 : Contexte justificatif**
Si le candidat fournit une justification valide (ex: entreprise de petite taille sans CSE), l'impact peut être réduit de 50%.

**Cas 2 : Réponse satisfaisante à la question révélatrice**
Si le candidat répond de manière satisfaisante à la question révélatrice, l'impact peut être réduit de 30%.

**Cas 3 : Pattern récurrent**
Si le même silence est détecté sur plusieurs entretiens, l'impact est augmenté de 20%.

---

## 6. Exemples de Calcul d'Impact

### 6.1 Cas 1 : Candidat DRH avec Silences Niveau 3

**Silences détectés :**
- CSE et relations sociales (Catégorie A, Niveau 3) : −4 points
- Politique salariale (Catégorie A, Niveau 3) : −4 points
- Recrutement (Catégorie A, Niveau 3) : −4 points

**Calcul :**
Impact total = −4 + −4 + −4 = −12 points

**Plafonnement :**
Impact final = min(−12, −10) = −10 points

**Score global :**
Score initial : 8/10
Score ajusté : 8 − 10/10 = −2/10 → 0/10 (plancher)

---

### 6.2 Cas 2 : Candidat Manager RH avec Silences Niveau 2

**Silences détectés :**
- Diversité et inclusion (Catégorie B, Niveau 2) : −1 point
- Employer branding (Catégorie B, Niveau 2) : −1 point

**Calcul :**
Impact total = −1 + −1 = −2 points

**Plafonnement :**
Impact final = −2 points (pas de plafonnement)

**Score global :**
Score initial : 7/10
Score ajusté : 7 − 2/10 = 5/10

---

### 6.3 Cas 3 : Candidat DRH avec Silence Niveau 4

**Silences détectés :**
- CSE et relations sociales (Fondamental, Niveau 4) : −10 points

**Calcul :**
Impact total = −10 points

**Plafonnement :**
Impact final = −10 points

**Score global :**
Score initial : 9/10
Score ajusté : 9 − 10/10 = −1/10 → 0/10 (plancher)

---

## 7. Documentation de l'Impact

### 7.1 Format dans le Debrief

**Format :**
```
## IMPACT DES SILENCES SUR LE SCORING

**Impact total :** −[X] points
**Score initial :** [X]/10
**Score ajusté :** [X]/10

---

### Détail par silence :

**[Sujet]** — Niveau [X]
- Type : [Catégorie A/B/C/Fondamental]
- Impact : −[X] points
- Dimension affectée : [Dimension]
- Raison : [Raison]

---

### Plafonnement appliqué :** [Oui/Non]
**Justification :** [Justification si applicable]
```

### 7.2 Format JSON

```json
{
  "sectionTitle": "IMPACT DES SILENCES SUR LE SCORING",
  
  "totalImpact": -8,
  "initialScore": 8,
  "adjustedScore": 0,
  
  "silenceImpacts": [
    {
      "topic": "CSE et relations sociales",
      "level": 3,
      "type": "categoryA",
      "impact": -4,
      "affectedDimension": "Relations sociales",
      "reason": "Donnée manquante critique"
    },
    {
      "topic": "Politique salariale",
      "level": 3,
      "type": "categoryA",
      "impact": -4,
      "affectedDimension": "Politique salariale",
      "reason": "Donnée manquante critique"
    }
  ],
  
  "cappingApplied": true,
  "cappingJustification": "Plafond maximum de −10 points atteint",
  
  "metadata": {
    "version": "1.0",
    "createdAt": "2026-08-04",
    "lastUpdated": "2026-08-04"
  }
}
```

---

## 8. Structure de Données (TypeScript)

```typescript
interface SilenceImpact {
  topic: string;
  level: 1 | 2 | 3 | 4;
  type: 'categoryA' | 'categoryB' | 'categoryC' | 'fundamental';
  
  impact: number;
  affectedDimension: string;
  reason: string;
  
  contextualAdjustment?: {
    type: 'justification' | 'satisfactoryResponse' | 'recurrentPattern';
    reduction: number;
    reason: string;
  };
}

interface ScoringImpact {
  impactId: string;
  interviewId: string;
  candidateId: string;
  positionId: string;
  
  calculatedAt: Date;
  
  totalImpact: number;
  initialScore: number;
  adjustedScore: number;
  
  silenceImpacts: SilenceImpact[];
  
  cappingApplied: boolean;
  cappingJustification?: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ImpactMatrix {
  matrixId: string;
  
  byLevelAndType: {
    level1: { categoryA: number; categoryB: number; categoryC: number; fundamental: number };
    level2: { categoryA: number; categoryB: number; categoryC: number; fundamental: number };
    level3: { categoryA: number; categoryB: number; categoryC: number; fundamental: number };
    level4: { categoryA: number; categoryB: number; categoryC: number; fundamental: number };
  };
  
  byDimension: {
    [dimension: string]: { maxPerSilence: number; totalCap: number };
  };
  
  globalCap: number;
  floorScore: number;
  
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
CREATE TABLE impact_matrix (
  id VARCHAR(36) PRIMARY KEY,
  
  by_level_and_type JSON NOT NULL,
  by_dimension JSON NOT NULL,
  global_cap INT NOT NULL,
  floor_score INT NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE scoring_impact (
  id VARCHAR(36) PRIMARY KEY,
  interview_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  position_id VARCHAR(36) NOT NULL,
  
  calculated_at TIMESTAMP NOT NULL,
  
  total_impact INT NOT NULL,
  initial_score INT NOT NULL,
  adjusted_score INT NOT NULL,
  
  silence_impacts JSON NOT NULL,
  capping_applied BOOLEAN NOT NULL,
  capping_justification TEXT,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_scoring_impact_interview ON scoring_impact(interview_id);
CREATE INDEX idx_scoring_impact_candidate ON scoring_impact(candidate_id);
CREATE INDEX idx_scoring_impact_position ON scoring_impact(position_id);
```

---

## 10. API Endpoints

```typescript
// GET /api/impact-matrix
async function getImpactMatrix(): Promise<ImpactMatrix> {
  return await getImpactMatrix();
}

// PUT /api/impact-matrix
async function updateImpactMatrix(matrix: ImpactMatrix): Promise<ImpactMatrix> {
  return await updateImpactMatrix(matrix);
}

// POST /api/scoring-impact/calculate
async function calculateScoringImpact(interviewId: string): Promise<ScoringImpact> {
  return await calculateScoringImpact(interviewId);
}

// GET /api/scoring-impact/:impactId
async function getScoringImpact(impactId: string): Promise<ScoringImpact> {
  return await getScoringImpactById(impactId);
}

// GET /api/scoring-impact/interview/:interviewId
async function getScoringImpactByInterview(interviewId: string): Promise<ScoringImpact> {
  return await getScoringImpactByInterview(interviewId);
}

// POST /api/scoring-impact/apply
async function applyScoringImpact(interviewId: string, impact: ScoringImpact): Promise<number> {
  return await applyScoringImpact(interviewId, impact);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Impact moyen | Moyenne des impacts sur le scoring | ≤ −3 points |
- Taux de plafonnement | Cas avec plafonnement / total | ≤ 10% |
- Distribution des impacts | Niveau 1 / Niveau 2 / Niveau 3 / Niveau 4 | Équilibrée |

### 11.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de documentation | Impacts documentés / total | 100% |
- Taux de justification | Impacts justifiés / total | 100% |

---

## 12. Conclusion

Le protocole d'impact sur le scoring structure comment les silences détectés impactent le scoring du candidat. Processus : Détection et classification, Calcul de l'impact, Application au scoring global. Matrice d'impact par niveau et type de sujet (Niveau 1 : −1 à −2 points, Niveau 2 : −1 à −4 points, Niveau 3 : −2 à −6 points, Niveau 4 : −5 à −10 points). Matrice d'impact par dimension avec plafonds. Plafonnement maximum de −10 points. Ajustements contextuels (justification valide, réponse satisfaisante, pattern récurrent). Exemples de calcul d'impact pour différents cas. Documentation de l'impact dans le debrief (Format Markdown et JSON). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Processus d'impact sur le scoring
- Matrice d'impact par niveau et type
- Matrice d'impact par dimension
- Plafonnement maximum de −10 points
- Ajustements contextuels
- Exemples de calcul d'impact
- Documentation de l'impact
- Format Markdown et JSON
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques d'impact et de qualité
