# DOC-M10-04 : Algorithme de Scoring de Compatibilité

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'algorithme de scoring de compatibilité pour le MVP-META-10 Manager Compatibility Engine. Ce document structure le calcul du score global de compatibilité entre un candidat et un manager.

---

## 2. Principe Fondateur

Le score de compatibilité global est calculé à partir des 10 dimensions de la matrice de compatibilité. Chaque dimension reçoit un score (Aligné = +2, Risque = +1, Conflit = 0). Le score global est la somme des scores des 10 dimensions, sur un maximum de 20 points.

---

## 3. Système de Scoring

### 3.1 Score par Dimension

**✅ Aligné = +2 points**
- Les caractéristiques du candidat et du manager sont parfaitement compatibles
- Exemple : Candidat autonome + Manager délégateur

**⚠️ Risque = +1 point**
- Les caractéristiques du candidat et du manager présentent un risque modéré
- Exemple : Candidat autonome + Manager directif

**❌ Conflit = 0 point**
- Les caractéristiques du candidat et du manager sont incompatibles
- Exemple : Candidat structuré + Manager laissez-faire

---

### 3.2 Score Global

**Calcul :**
```
Score global = Σ (score de chaque dimension)
Maximum = 20 points (10 dimensions × 2 points)
```

**Interprétation :**
- **16-20 points** : Compatibilité excellente
- **12-15 points** : Compatibilité bonne
- **8-11 points** : Compatibilité modérée. Vigilance.
- **4-7 points** : Compatibilité faible. Risque élevé.
- **0-3 points** : Incompatibilité forte. Reconsidérer ce binôme.

---

## 4. Algorithme de Calcul

### 4.1 Étape 1 — Récupération des Données

```typescript
function getCompatibilityData(recruitmentId: string, candidateId: string, managerId: string) {
  const candidateProfile = getCandidateProfile(candidateId);
  const managerProfile = getManagerProfile(managerId);
  
  return { candidateProfile, managerProfile };
}
```

---

### 4.2 Étape 2 — Évaluation par Dimension

```typescript
function evaluateDimension(dimension: string, candidateValue: any, managerValue: any): number {
  const compatibilityRules = getCompatibilityRules(dimension);
  
  for (const rule of compatibilityRules) {
    if (rule.matches(candidateValue, managerValue)) {
      return rule.score;
    }
  }
  
  return 0; // Conflit par défaut
}
```

---

### 4.3 Étape 3 — Calcul du Score Global

```typescript
function calculateGlobalScore(dimensions: any): number {
  let score = 0;
  
  for (const dimension of Object.values(dimensions)) {
    score += dimension.compatibility === 'aligned' ? 2 :
             dimension.compatibility === 'risk' ? 1 : 0;
  }
  
  return score;
}
```

---

### 4.4 Étape 4 — Interprétation du Score

```typescript
function interpretScore(score: number): string {
  if (score >= 16) return 'excellent';
  if (score >= 12) return 'good';
  if (score >= 8) return 'moderate';
  if (score >= 4) return 'weak';
  return 'incompatible';
}
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface CompatibilityScore {
  scoreId: string;
  recruitmentId: string;
  candidateId: string;
  managerId: string;
  
  dimensionScores: {
    workStyle: number;
    communication: number;
    structureNeed: number;
    errorTolerance: number;
    availability: number;
    ambition: number;
    values: number;
    feedback: number;
    decision: number;
    culture: number;
  };
  
  globalScore: number;
  interpretation: 'excellent' | 'good' | 'moderate' | 'weak' | 'incompatible';
  
  breakdown: {
    aligned: number;
    risk: number;
    conflict: number;
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

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE compatibility_score (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  manager_id VARCHAR(36) NOT NULL,
  
  dimension_scores JSON NOT NULL,
  global_score INTEGER NOT NULL,
  interpretation VARCHAR(20) NOT NULL,
  breakdown JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_compatibility_score_recruitment ON compatibility_score(recruitment_id);
CREATE INDEX idx_compatibility_score_candidate ON compatibility_score(candidate_id);
CREATE INDEX idx_compatibility_score_manager ON compatibility_score(manager_id);
CREATE INDEX idx_compatibility_score_global ON compatibility_score(global_score);
```

---

## 7. API Endpoints

```typescript
// POST /api/compatibility-score/calculate
async function calculateCompatibilityScore(recruitmentId: string, candidateId: string, managerId: string): Promise<CompatibilityScore> {
  return await calculateCompatibilityScore(recruitmentId, candidateId, managerId);
}

// GET /api/compatibility-score/:scoreId
async function getCompatibilityScore(scoreId: string): Promise<CompatibilityScore> {
  return await getCompatibilityScore(scoreId);
}

// GET /api/compatibility-score/recruitment/:recruitmentId
async function getCompatibilityScoreByRecruitment(recruitmentId: string): Promise<CompatibilityScore> {
  return await getCompatibilityScoreByRecruitment(recruitmentId);
}

// GET /api/compatibility-score/manager/:managerId
async function getCompatibilityScoresByManager(managerId: string): Promise<CompatibilityScore[]> {
  return await getCompatibilityScoresByManager(managerId);
}

// GET /api/compatibility-score/critical
async function getCriticalScores(): Promise<CompatibilityScore[]> {
  return await getCriticalScores();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Calcul

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de calcul | Scores calculés / recrutements | ≥ 95% |
- Latence de calcul | Temps entre données et score | ≤ 2 secondes |

### 8.2 Métriques de Distribution

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de scores excellents | Scores 16-20 / totaux | ≥ 30% |
- Taux de scores incompatibles | Scores 0-3 / totaux | ≤ 10% |

---

## 9. Exemple Complet

```markdown
ALGORITHME DE SCORING DE COMPATIBILITÉ

Candidat : [Anonymisé]
Manager : [Anonymisé]
Recrutement : REC-2026-001
Date : 2026-08-04

SCORES PAR DIMENSION :

1. Style travail : ⚠️ Risque (+1)
2. Communication : ✅ Aligné (+2)
3. Besoin structure : ❌ Conflit (0)
4. Tolérance erreur : ⚠️ Risque (+1)
5. Disponibilité : ⚠️ Risque (+1)
6. Ambition : ⚠️ Risque (+1)
7. Valeurs : ✅ Aligné (+2)
8. Feedback : ❌ Conflit (0)
9. Décision : ⚠️ Risque (+1)
10. Culture : ⚠️ Risque (+1)

CALCUL :
→ Aligné : 2 dimensions × 2 = 4 points
→ Risque : 6 dimensions × 1 = 6 points
→ Conflit : 2 dimensions × 0 = 0 points
→ Score global : 10 / 20

INTERPRÉTATION :
→ Score : 10 / 20
→ Niveau : Compatibilité modérée. Vigilance.
→ Recommandation : Vigilance sur les dimensions en conflit et en risque.

BREAKDOWN :
→ Aligné : 2/10
→ Risque : 6/10
→ Conflit : 2/10
```

---

## 10. Conclusion

L'algorithme de scoring de compatibilité structure le calcul du score global entre candidat et manager. Système de scoring : Aligné = +2 points, Risque = +1 point, Conflit = 0 point. Score global sur 20 points maximum. Interprétation : 16-20 excellent, 12-15 bon, 8-11 modéré (vigilance), 4-7 faible (risque élevé), 0-3 incompatible (reconsidérer). Algorithme en 4 étapes : Récupération données, Évaluation par dimension, Calcul score global, Interprétation score. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Système de scoring par dimension
- Score global sur 20 points
- 5 niveaux d'interprétation
- Algorithme en 4 étapes
- Breakdown des scores
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de calcul et de distribution
