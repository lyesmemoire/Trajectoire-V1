# DOC-029-05 : Protocole de Qualité et Confiance des Patterns

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de qualité et confiance des patterns pour MVP-029 Institutional Memory Engine. Ce protocole définit comment évaluer la qualité des patterns, calculer leur niveau de confiance, et présenter les patterns avec des réserves explicites lorsque la confiance est faible.

---

## 2. Principe Fondateur

Chaque pattern a un score de confiance basé sur le nombre de cas observés. Les patterns à faible confiance sont présentés avec des réserves explicites. Le protocole assure que les utilisateurs comprennent la fiabilité de chaque pattern et peuvent prendre des décisions éclairées en conséquence.

---

## 3. Niveaux de Confiance

### 3.1 Confiance Faible

**Critère :**
- Basé sur < 10 cas

**Présentation :**
- Réserves explicites
- Avertissement : "Pattern basé sur peu de cas. À utiliser avec prudence."
- Indicateur visuel : 🔴 (rouge)

**Utilisation :**
- Utilisation possible mais avec prudence
- Recommandation de validation croisée
- Documentation des décisions basées sur ce pattern

---

### 3.2 Confiance Modérée

**Critère :**
- Basé sur 10-30 cas

**Présentation :**
- Réserves modérées
- Avertissement : "Pattern basé sur un nombre modéré de cas. Confiance moyenne."
- Indicateur visuel : 🟡 (jaune)

**Utilisation :**
- Utilisation recommandée avec validation
- Recommandation de vérification contextuelle
- Documentation des décisions basées sur ce pattern

---

### 3.3 Confiance Élevée

**Critère :**
- Basé sur > 30 cas

**Présentation :**
- Aucune réserve
- Indicateur : "Pattern basé sur un nombre élevé de cas. Confiance élevée."
- Indicateur visuel : 🟢 (vert)

**Utilisation :**
- Utilisation recommandée
- Confiance élevée dans les recommandations
- Documentation optionnelle

---

## 4. Calcul de la Confiance

### 4.1 Formule de Calcul

**Score de confiance :**
```
Confidence = min(1.0, basedOnCases / 30)
```

**Niveaux :**
- < 0.33 : Confiance faible
- 0.33 - 1.0 : Confiance modérée
- 1.0 : Confiance élevée

---

### 4.2 Algorithme de Calcul

```typescript
async function calculatePatternConfidence(basedOnCases: number): Promise<{
  level: 'low' | 'moderate' | 'high';
  score: number;
  description: string;
}> {
  // Calcul du score de confiance
  const score = Math.min(1.0, basedOnCases / 30);
  
  // Détermination du niveau
  let level: 'low' | 'moderate' | 'high';
  let description: string;
  
  if (basedOnCases < 10) {
    level = 'low';
    description = 'Pattern basé sur peu de cas. À utiliser avec prudence.';
  } else if (basedOnCases < 30) {
    level = 'moderate';
    description = 'Pattern basé sur un nombre modéré de cas. Confiance moyenne.';
  } else {
    level = 'high';
    description = 'Pattern basé sur un nombre élevé de cas. Confiance élevée.';
  }
  
  return {
    level,
    score,
    description
  };
}
```

---

## 5. Qualité des Patterns

### 5.1 Critères de Qualité

**Complétude :**
- Toutes les sections du pattern sont remplies
- Les données sont cohérentes
- Les résultats sont documentés

**Cohérence :**
- Les caractéristiques sont cohérentes avec le contexte
- Les signaux sont cohérents avec les résultats
- Les résultats sont cohérents avec les caractéristiques

**Validité :**
- Les résultats sont statistiquement significatifs
- Les patterns sont reproductibles
- Les patterns sont généralisables

---

### 5.2 Évaluation de la Qualité

**Score de qualité :**
```
Quality = (Completeness * 0.4) + (Coherence * 0.3) + (Validity * 0.3)
```

**Niveaux de qualité :**
- < 0.5 : Qualité faible
- 0.5 - 0.7 : Qualité moyenne
- 0.7 - 0.9 : Qualité bonne
- > 0.9 : Qualité excellente

---

### 5.3 Algorithme d'Évaluation

```typescript
async function evaluatePatternQuality(pattern: SuccessPattern): Promise<{
  level: 'low' | 'medium' | 'good' | 'excellent';
  score: number;
  completeness: number;
  coherence: number;
  validity: number;
}> {
  // Évaluation de la complétude
  const completeness = await evaluateCompleteness(pattern);
  
  // Évaluation de la cohérence
  const coherence = await evaluateCoherence(pattern);
  
  // Évaluation de la validité
  const validity = await evaluateValidity(pattern);
  
  // Calcul du score de qualité
  const score = (completeness * 0.4) + (coherence * 0.3) + (validity * 0.3);
  
  // Détermination du niveau
  let level: 'low' | 'medium' | 'good' | 'excellent';
  
  if (score < 0.5) {
    level = 'low';
  } else if (score < 0.7) {
    level = 'medium';
  } else if (score < 0.9) {
    level = 'good';
  } else {
    level = 'excellent';
  }
  
  return {
    level,
    score,
    completeness,
    coherence,
    validity
  };
}
```

---

## 6. Présentation des Patterns

### 6.1 Format de Présentation

**Pattern avec confiance élevée :**
```
🟢 Pattern de Succès — Confiance Élevée

Contexte : Fintech / Scale-up 200-500 / Head of Product / VP / Série B

Caractéristiques communes :
- Expérience startup obligatoire
- Expérience en produit B2B
- Capacité à travailler sans équipe
- Appétence pour la relation client directe
- Profil "builder" plus que "optimizer"

Résultats :
- Avec caractéristiques : 84% de succès à 12 mois
- Sans caractéristiques : 38% de succès à 12 mois

Confiance : Basé sur 47 cas
```

**Pattern avec confiance modérée :**
```
🟡 Pattern de Succès — Confiance Modérée

Contexte : SaaS / Startup <50 / CTO / C-Level / Seed

Caractéristiques communes :
- Expérience technique avancée
- Capacité à construire une équipe
- Vision produit claire

Résultats :
- Avec caractéristiques : 72% de succès à 12 mois
- Sans caractéristiques : 45% de succès à 12 mois

⚠️ Confiance : Basé sur 18 cas. Pattern basé sur un nombre modéré de cas. Confiance moyenne.
```

**Pattern avec confiance faible :**
```
🔴 Pattern de Succès — Confiance Faible

Contexte : E-commerce / Grand groupe >1000 / VP Sales / VP / Mature

Caractéristiques communes :
- Expérience en vente B2C
- Capacité à gérer des équipes larges
- Expérience internationale

Résultats :
- Avec caractéristiques : 65% de succès à 12 mois
- Sans caractéristiques : 40% de succès à 12 mois

⚠️⚠️ Confiance : Basé sur 7 cas. Pattern basé sur peu de cas. À utiliser avec prudence.
```

---

## 7. Mise à Jour de la Confiance

### 7.1 Processus de Mise à Jour

**Quand :**
- À chaque nouveau cas observé
- Après validation des résultats
- Après réévaluation annuelle

**Comment :**
- Incrément du nombre de cas
- Recalcul du score de confiance
- Mise à jour du niveau de confiance
- Notification si le niveau change

---

### 7.2 Algorithme de Mise à Jour

```typescript
async function updatePatternConfidence(patternId: string, newCase: RecruitmentCase): Promise<SuccessPattern> {
  // 1. Récupération du pattern
  const pattern = await getSuccessPattern(patternId);
  
  // 2. Incrément du nombre de cas
  pattern.confidence.basedOnCases++;
  
  // 3. Recalcul du score de confiance
  const confidence = await calculatePatternConfidence(pattern.confidence.basedOnCases);
  pattern.confidence.level = confidence.level;
  pattern.confidence.score = confidence.score;
  pattern.confidence.description = confidence.description;
  pattern.confidence.lastUpdated = new Date();
  
  // 4. Mise à jour des résultats
  pattern.results = await updateResults(pattern, newCase);
  
  // 5. Sauvegarde du pattern
  await saveSuccessPattern(pattern);
  
  // 6. Notification si le niveau change
  if (confidence.level !== pattern.confidence.level) {
    await notifyConfidenceLevelChange(patternId, confidence.level);
  }
  
  return pattern;
}
```

---

## 8. Structure de Données (TypeScript)

```typescript
interface PatternQuality {
  patternId: string;
  
  confidence: {
    basedOnCases: number;
    level: 'low' | 'moderate' | 'high';
    score: number;
    description: string;
    lastUpdated: Date;
  };
  
  quality: {
    level: 'low' | 'medium' | 'good' | 'excellent';
    score: number;
    completeness: number;
    coherence: number;
    validity: number;
    lastEvaluated: Date;
  };
  
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    version: string;
    status: 'draft' | 'active' | 'deprecated';
  };
}
```

---

## 9. Stockage et Gestion

### 9.1 Schéma SQL

```sql
CREATE TABLE pattern_quality (
  id VARCHAR(36) PRIMARY KEY,
  pattern_id VARCHAR(36) NOT NULL UNIQUE,
  
  confidence JSON NOT NULL,
  quality JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (pattern_id) REFERENCES success_pattern(id)
);

CREATE INDEX idx_pattern_quality_confidence_level ON pattern_quality((confidence->>'level'));
CREATE INDEX idx_pattern_quality_quality_level ON pattern_quality((quality->>'level'));
```

---

## 10. API Endpoints

```typescript
// POST /api/institutional-memory/patterns/:patternId/quality
async function evaluatePatternQuality(patternId: string): Promise<PatternQuality> {
  return await evaluatePatternQuality(patternId);
}

// GET /api/institutional-memory/patterns/:patternId/quality
async function getPatternQuality(patternId: string): Promise<PatternQuality> {
  return await getPatternQualityById(patternId);
}

// PUT /api/institutional-memory/patterns/:patternId/quality/confidence
async function updatePatternConfidence(patternId: string, newCase: RecruitmentCase): Promise<PatternQuality> {
  return await updatePatternConfidence(patternId, newCase);
}

// GET /api/institutional-memory/patterns/quality/level/:level
async function getPatternsByQualityLevel(level: string): Promise<PatternQuality[]> {
  return await getPatternsByQualityLevel(level);
}

// GET /api/institutional-memory/patterns/confidence/level/:level
async function getPatternsByConfidenceLevel(level: string): Promise<PatternQuality[]> {
  return await getPatternsByConfidenceLevel(level);
}
```

---

## 11. Indicateurs de Suivi

### 11.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Confiance moyenne | Confiance moyenne des patterns | ≥ 0.7 |
- Qualité moyenne | Qualité moyenne des patterns | ≥ 0.7 |
- Taux de patterns à confiance élevée | Patterns à confiance élevée / total | ≥ 60% |
- Taux de patterns à confiance faible | Patterns à confiance faible / total | ≤ 10% |

### 11.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Précision des patterns à confiance élevée | Précision des patterns à confiance élevée | ≥ 85% |
- Précision des patterns à confiance modérée | Précision des patterns à confiance modérée | ≥ 75% |
- Précision des patterns à confiance faible | Précision des patterns à confiance faible | ≥ 60% |
- Satisfaction recruteurs | Satisfaction avec la présentation des patterns | ≥ 4.5/5 |

---

## 12. Conclusion

Le protocole de qualité et confiance des patterns définit comment évaluer la qualité des patterns, calculer leur niveau de confiance, et présenter les patterns avec des réserves explicites lorsque la confiance est faible. Le protocole assure que les utilisateurs comprennent la fiabilité de chaque pattern et peuvent prendre des décisions éclairées en conséquence.

**Points clés :**
- 3 niveaux de confiance (faible, modérée, élevée)
- Calcul de la confiance basé sur le nombre de cas
- Évaluation de la qualité (complétude, cohérence, validité)
- Présentation avec indicateurs visuels
- Réserves explicites pour les patterns à faible confiance
- Mise à jour automatique de la confiance
- Intégration avec les modules existants
- Métriques de qualité et d'impact
