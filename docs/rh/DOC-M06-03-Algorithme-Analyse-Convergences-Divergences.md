# DOC-M06-03 : Algorithme d'Analyse des Convergences/Divergences

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'algorithme d'analyse des convergences et divergences pour le MVP-META-06 Collaborative Decision Engine. Ce document structure l'algorithme qui agrège intelligemment les évaluations des différents intervenants sans faire de moyenne simple.

---

## 2. Principe Fondateur

Le moteur ne fait pas la moyenne. Il analyse les convergences ET divergences. Les convergences amplifient la confiance. Les divergences sont classées et facilitent le débat.

---

## 3. Algorithme d'Agrégation

### 3.1 Étape 1 — Collecte des Évaluations

**Entrées :**
- Évaluations de chaque intervenant
- Scores par dimension
- Observations qualitatives

**Processus :**
1. Collecte de toutes les évaluations
2. Normalisation des scores (échelle 0-5)
3. Extraction des observations qualitatives

---

### 3.2 Étape 2 — Analyse des Convergences

**Définition :**
Points sur lesquels tous les intervenants s'accordent.

**Critère de convergence :**
- Écart-type des scores < 0.5
- Tendance qualitative identique
- Aucun désaccord significatif

**Action :**
- Décision plus fiable sur ces points
- Le moteur amplifie la confiance
- Ces points ne nécessitent pas de débat

**Exemple :**
```
Dimension : Culture fit
Scores : HR 4.5/5, Manager 4.2/5, Expert 4.3/5, Direction 4.4/5
Écart-type : 0.12
Conclusion : Convergence forte → Confiance amplifiée
```

---

### 3.3 Étape 3 — Analyse des Divergences

**Définition :**
Points sur lesquels les intervenants divergent significativement.

**Critère de divergence :**
- Écart-type des scores ≥ 1.0
- Tendance qualitative différente
- Désaccord significatif identifié

**Action :**
- Source du désaccord identifiée
- Facilitation du débat
- Classification de la divergence

**Exemple :**
```
Dimension : Potentiel de leadership
Scores : HR 3.0/5, Manager 4.5/5, Expert 3.2/5, Direction 4.8/5
Écart-type : 0.85
Conclusion : Divergence significative → Débat nécessaire
```

---

## 4. Classification des Divergences

### 4.1 Divergence de Compétence

**Définition :**
Les intervenants n'ont pas le même niveau d'expertise sur la dimension évaluée.

**Critère :**
- Un intervenant a une expertise reconnue sur la dimension
- Les autres intervenants ont une expertise moindre
- Les scores divergent en faveur de l'expert

**Résolution :**
- L'expert prime sur ce point
- Le poids de l'évaluation de l'expert est augmenté
- Les autres évaluations sont relativisées

**Exemple :**
```
Dimension : Profondeur technique
Scores : Expert technique 4.8/5, RH 3.0/5, Manager 3.5/5, Direction 3.2/5
Expertise : Expert technique a l'expertise la plus élevée
Résolution : Score final pondéré vers l'expert → 4.5/5
```

---

### 4.2 Divergence de Perspective

**Définition :**
Chaque intervenant voit un aspect différent du même candidat.

**Critère :**
- Les intervenants ont des expertises complémentaires
- Les scores divergent mais sont tous justifiés
- Aucun intervenant n'a une expertise dominante

**Résolution :**
- Toutes les perspectives sont valides
- Discussion pour peser chaque aspect
- Le moteur génère une question de débat

**Exemple :**
```
Dimension : Style de travail
Scores : RH 4.0/5 (communication), Manager 3.0/5 (autonomie), Expert 4.5/5 (rigueur)
Perspectives : Chaque intervenant voit un aspect différent
Résolution : Discussion nécessaire pour peser chaque aspect
```

---

### 4.3 Divergence d'Intuition

**Définition :**
Un intervenant a une intuition non étayée par des faits.

**Critère :**
- Un intervenant a un score très différent des autres
- L'intervenant ne fournit pas de faits à l'appui
- L'évaluation est basée sur une "impression"

**Résolution :**
- Creuser pour trouver la source
- Intuition ≠ décision seule
- Soit fonder l'intuition sur des faits, soit la relativiser

**Exemple :**
```
Dimension : Potentiel long terme
Scores : Direction 5.0/5 (intuition), HR 3.0/5, Manager 3.2/5, Expert 3.0/5
Intuition : Direction basée sur "feeling" sans faits
Résolution : Demander à la direction de justifier avec des faits
```

---

### 4.4 Divergence de Biais Possible

**Définition :**
La divergence suit un pattern pouvant suggérer un biais.

**Critère :**
- La divergence est systématique pour un type de candidat
- Le pattern suggère un biais (genre, âge, origine, etc.)
- Le moteur détecte une anomalie statistique

**Résolution :**
- Le moteur alerte discrètement
- Invite à la réflexion
- Ne bloque pas la décision mais signale

**Exemple :**
```
Pattern : Les candidats de plus de 50 ans ont systématiquement des scores plus bas sur "potentiel"
Alerte : Possible biais d'âge détecté
Résolution : Alert discrète envoyée aux décideurs
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface Evaluation {
  evaluationId: string;
  intervenantId: string;
  intervenantRole: 'hr' | 'manager' | 'expert' | 'direction';
  
  scores: {
    dimension: string;
    score: number; // 0-5
  }[];
  
  qualitativeObservations: string[];
  
  evaluatedAt: Date;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ConvergenceAnalysis {
  analysisId: string;
  recruitmentId: string;
  candidateId: string;
  
  dimension: string;
  
  scores: {
    intervenantId: string;
    intervenantRole: string;
    score: number;
  }[];
  
  meanScore: number;
  standardDeviation: number;
  
  isConvergent: boolean;
  confidenceLevel: 'low' | 'medium' | 'high';
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface DivergenceAnalysis {
  analysisId: string;
  recruitmentId: string;
  candidateId: string;
  
  dimension: string;
  
  scores: {
    intervenantId: string;
    intervenantRole: string;
    score: number;
  }[];
  
  meanScore: number;
  standardDeviation: number;
  
  isDivergent: boolean;
  divergenceType: 'competence' | 'perspective' | 'intuition' | 'bias';
  
  resolution: string;
  debateQuestion?: string;
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface AggregationResult {
  resultId: string;
  recruitmentId: string;
  candidateId: string;
  
  convergences: ConvergenceAnalysis[];
  divergences: DivergenceAnalysis[];
  
  aggregatedScores: {
    dimension: string;
    score: number;
    confidence: 'low' | 'medium' | 'high';
  }[];
  
  overallRecommendation: 'recommend' | 'neutral' | 'notRecommend';
  
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
CREATE TABLE evaluation (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  intervenant_id VARCHAR(36) NOT NULL,
  intervenant_role VARCHAR(20) NOT NULL,
  
  scores JSON NOT NULL,
  qualitative_observations JSON NOT NULL,
  
  evaluated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluation_recruitment ON evaluation(recruitment_id);
CREATE INDEX idx_evaluation_candidate ON evaluation(candidate_id);
CREATE INDEX idx_evaluation_intervenant ON evaluation(intervenant_id);

CREATE TABLE convergence_analysis (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  dimension VARCHAR(100) NOT NULL,
  
  scores JSON NOT NULL,
  mean_score DECIMAL(3,2) NOT NULL,
  standard_deviation DECIMAL(3,2) NOT NULL,
  
  is_convergent BOOLEAN NOT NULL,
  confidence_level VARCHAR(20) NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_convergence_analysis_recruitment ON convergence_analysis(recruitment_id);
CREATE INDEX idx_convergence_analysis_candidate ON convergence_analysis(candidate_id);

CREATE TABLE divergence_analysis (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  dimension VARCHAR(100) NOT NULL,
  
  scores JSON NOT NULL,
  mean_score DECIMAL(3,2) NOT NULL,
  standard_deviation DECIMAL(3,2) NOT NULL,
  
  is_divergent BOOLEAN NOT NULL,
  divergence_type VARCHAR(20) NOT NULL,
  resolution TEXT NOT NULL,
  debate_question TEXT,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_divergence_analysis_recruitment ON divergence_analysis(recruitment_id);
CREATE INDEX idx_divergence_analysis_candidate ON divergence_analysis(candidate_id);
CREATE INDEX idx_divergence_analysis_type ON divergence_analysis(divergence_type);

CREATE TABLE aggregation_result (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  convergences JSON NOT NULL,
  divergences JSON NOT NULL,
  aggregated_scores JSON NOT NULL,
  
  overall_recommendation VARCHAR(20) NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_aggregation_result_recruitment ON aggregation_result(recruitment_id);
CREATE INDEX idx_aggregation_result_candidate ON aggregation_result(candidate_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/evaluation/create
async function createEvaluation(evaluation: Evaluation): Promise<Evaluation> {
  return await createEvaluation(evaluation);
}

// GET /api/evaluation/:evaluationId
async function getEvaluation(evaluationId: string): Promise<Evaluation> {
  return await getEvaluation(evaluationId);
}

// GET /api/evaluation/recruitment/:recruitmentId
async function getEvaluationsByRecruitment(recruitmentId: string): Promise<Evaluation[]> {
  return await getEvaluationsByRecruitment(recruitmentId);
}

// POST /api/aggregation/analyze
async function analyzeAggregation(recruitmentId: string, candidateId: string): Promise<AggregationResult> {
  return await analyzeAggregation(recruitmentId, candidateId);
}

// GET /api/aggregation/result/:resultId
async function getAggregationResult(resultId: string): Promise<AggregationResult> {
  return await getAggregationResult(resultId);
}

// GET /api/aggregation/recruitment/:recruitmentId
async function getAggregationResultByRecruitment(recruitmentId: string): Promise<AggregationResult> {
  return await getAggregationResultByRecruitment(recruitmentId);
}

// GET /api/aggregation/convergences/:recruitmentId
async function getConvergences(recruitmentId: string): Promise<ConvergenceAnalysis[]> {
  return await getConvergences(recruitmentId);
}

// GET /api/aggregation/divergences/:recruitmentId
async function getDivergences(recruitmentId: string): Promise<DivergenceAnalysis[]> {
  return await getDivergences(recruitmentId);
}

// POST /api/aggregation/divergence/:divergenceId/resolve
async function resolveDivergence(divergenceId: string, resolution: string): Promise<DivergenceAnalysis> {
  return await resolveDivergence(divergenceId, resolution);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de convergence | Dimensions convergentes / totales | ≥ 60% |
- Taux de résolution de divergences | Divergences résolues / totales | ≥ 80% |

### 8.2 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
- Temps d'agrégation moyen | Temps moyen d'analyse | < 30 secondes |
- Taux de satisfaction des décideurs | Décideurs satisfaits / totaux | ≥ 85% |

---

## 9. Conclusion

L'algorithme d'analyse des convergences/divergences structure l'agrégation intelligente des évaluations. Étape 1 : Collecte des évaluations. Étape 2 : Analyse des convergences (écart-type < 0.5, confiance amplifiée). Étape 3 : Analyse des divergences (écart-type ≥ 1.0, débat nécessaire). 4 types de divergences : Compétence (expert prime), Perspective (toutes valides, discussion), Intuition (creuser, fonder sur faits), Biais (alerte discrète). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Pas de moyenne simple
- Analyse des convergences
- Analyse des divergences
- 4 types de divergences
- Résolution spécifique par type
- Amplification de la confiance
- Facilitation du débat
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et de performance
