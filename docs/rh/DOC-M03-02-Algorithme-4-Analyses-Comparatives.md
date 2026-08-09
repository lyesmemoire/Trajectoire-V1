# DOC-M03-02 : Algorithme des 4 Analyses Comparatives

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'algorithme des 4 analyses comparatives pour le MVP-META-03 Comparative Intelligence Engine. Ce document structure les analyses intelligentes qui identifient les meilleurs candidats selon différents critères.

---

## 2. Principe Fondateur

Le moteur ne se contente pas de comparer les scores globaux. Il identifie le candidat le plus équilibré, le meilleur sur le critère différenciateur, le meilleur ROI, et les profils complémentaires pour une équipe globale.

---

## 3. Analyse 1 — Le Candidat le Plus Équilibré

### 3.1 Objectif

Identifier le candidat avec le moins d'écarts entre dimensions. Un profil équilibré est souvent plus sûr qu'un profil brillant/lacunaire.

### 3.2 Algorithme

**Processus :**
1. Pour chaque candidat, calculer l'écart-type des 6 dimensions
2. Identifier le candidat avec l'écart-type le plus faible
3. Si plusieurs candidats ont le même écart-type, privilégier celui avec le score global le plus élevé

**Formule :**
```
Écart-type = sqrt(Σ(score_i - moyenne)² / n)
Où :
- score_i = score de la dimension i
- moyenne = moyenne des 6 dimensions
- n = 6 (nombre de dimensions)
```

### 3.3 Exemple

| Candidat | Tech | Expér. | Soft | Fit | Maturité | Potent. | Écart-type |
|----------|------|--------|------|-----|----------|---------|------------|
| Jean     | 4    | 5      | 3    | 4   | 5        | 4       | 0.71       |
| Marie    | 5    | 4      | 4    | 3   | 4        | 5       | 0.71       |
| Pierre   | 3    | 3      | 5    | 5   | 3        | 3       | 1.03       |

**Résultat :** Jean et Marie sont les plus équilibrés (écart-type 0.71). Jean est privilégié (score global 25 vs 25, égalité).

---

## 4. Analyse 2 — Le Candidat le Plus Fort sur le Critère Différenciateur

### 4.1 Objectif

Pour chaque poste, identifier le critère le plus critique. Trouver le meilleur candidat sur CE critère spécifiquement.

### 4.2 Algorithme

**Processus :**
1. Pour chaque poste, définir le critère différenciateur (ex: Tech pour développeur, Soft pour manager)
2. Pour chaque candidat, extraire le score sur ce critère
3. Identifier le candidat avec le score le plus élevé sur ce critère
4. Si plusieurs candidats ont le même score, utiliser l'écart-type comme critère secondaire

### 4.3 Critères Différenciateurs par Poste

| Poste | Critère Différenciateur |
|-------|------------------------|
| DRH | Relations sociales |
| Manager RH | Management |
| Responsable Recrutement | Fit culturel |
| Responsable Paie | Tech (précision) |
| Responsable Formation | Soft (pédagogie) |
| Business Partner RH | Fit |
| Assistant RH | Soft (relationnel) |
| Consultant RH | Tech (expertise) |

### 4.4 Exemple

**Poste : DRH**
**Critère différenciateur : Relations sociales (Soft)**

| Candidat | Soft |
|----------|------|
| Jean     | 3    |
| Marie    | 4    |
| Pierre   | 5    |

**Résultat :** Pierre est le meilleur sur le critère différenciateur (Soft = 5).

---

## 5. Analyse 3 — Le Candidat à Meilleur ROI

### 5.1 Objectif

Identifier le candidat avec le meilleur rapport niveau de compétence / attentes salariales et niveau de compétence / délai de disponibilité.

### 5.2 Algorithme

**Processus :**
1. Pour chaque candidat, calculer le ROI salarial : Score global / Attentes salariales
2. Pour chaque candidat, calculer le ROI disponibilité : Score global / Délai de disponibilité
3. Calculer le ROI combiné : (ROI salarial + ROI disponibilité) / 2
4. Identifier le candidat avec le ROI combiné le plus élevé

**Formules :**
```
ROI salarial = Score global / Attentes salariales (en K€)
ROI disponibilité = Score global / Délai de disponibilité (en jours)
ROI combiné = (ROI salarial + ROI disponibilité) / 2
```

### 5.3 Exemple

| Candidat | Score | Salaire (K€) | Délai (jours) | ROI salarial | ROI disponibilité | ROI combiné |
|----------|-------|--------------|---------------|--------------|------------------|-------------|
| Jean     | 25    | 60           | 30            | 0.42         | 0.83             | 0.63        |
| Marie    | 25    | 55           | 15            | 0.45         | 1.67             | 1.06        |
| Pierre   | 22    | 50           | 0             | 0.44         | ∞                | ∞           |

**Résultat :** Pierre a le meilleur ROI (disponibilité immédiate = ROI infini). Marie est deuxième (ROI combiné 1.06).

---

## 6. Analyse 4 — Les Profils Complémentaires

### 6.1 Objectif

Si plusieurs postes sont ouverts, identifier quelle combinaison de candidats serait optimale pour l'équipe globale.

### 6.2 Algorithme

**Processus :**
1. Pour chaque combinaison possible de candidats (un par poste ouvert)
2. Calculer le score global de l'équipe : Somme des scores de chaque candidat
3. Calculer l'équilibre de l'équipe : Écart-type moyen des dimensions de l'équipe
4. Calculer la diversité de l'équipe : Écart-type des scores globaux des candidats
5. Identifier la combinaison avec le meilleur score global et le meilleur équilibre

**Formules :**
```
Score équipe = Σ(score global candidat_i)
Équilibre équipe = Σ(écart-type candidat_i) / n_candidats
Diversité équipe = écart-type(scores globaux candidats)
Score combiné = (Score équipe + Équilibre équipe) / 2
```

### 6.3 Exemple

**Postes ouverts : DRH + Manager RH**

| Candidat | Poste | Score | Écart-type |
|----------|-------|-------|------------|
| Jean     | DRH   | 25    | 0.71       |
| Marie    | Manager RH | 25 | 0.71       |
| Pierre   | Manager RH | 22 | 1.03       |

**Combinaison 1 : Jean (DRH) + Marie (Manager RH)**
- Score équipe : 25 + 25 = 50
- Équilibre équipe : (0.71 + 0.71) / 2 = 0.71
- Diversité équipe : écart-type(25, 25) = 0
- Score combiné : (50 + 0.71) / 2 = 25.36

**Combinaison 2 : Jean (DRH) + Pierre (Manager RH)**
- Score équipe : 25 + 22 = 47
- Équilibre équipe : (0.71 + 1.03) / 2 = 0.87
- Diversité équipe : écart-type(25, 22) = 2.12
- Score combiné : (47 + 0.87) / 2 = 23.94

**Résultat :** Combinaison 1 (Jean + Marie) est optimale (score combiné 25.36).

---

## 7. Structure de Données (TypeScript)

```typescript
interface BalancedCandidateAnalysis {
  candidateId: string;
  name: string;
  scores: {
    tech: number;
    experience: number;
    soft: number;
    fit: number;
    maturity: number;
    potential: number;
  };
  globalScore: number;
  standardDeviation: number;
  rank: number;
}

interface DifferentiatorAnalysis {
  position: string;
  differentiatorCriterion: string;
  candidates: {
    candidateId: string;
    name: string;
    criterionScore: number;
    globalScore: number;
    standardDeviation: number;
  }[];
  bestCandidate: string;
  bestScore: number;
}

interface ROIAnalysis {
  candidates: {
    candidateId: string;
    name: string;
    globalScore: number;
    salaryExpectations: number;
    availabilityDelay: number;
    salaryROI: number;
    availabilityROI: number;
    combinedROI: number;
  }[];
  bestCandidate: string;
  bestROI: number;
}

interface ComplementaryProfilesAnalysis {
  openPositions: string[];
  combinations: {
    combinationId: string;
    candidates: {
      candidateId: string;
      name: string;
      position: string;
      globalScore: number;
      standardDeviation: number;
    }[];
    teamScore: number;
    teamBalance: number;
    teamDiversity: number;
    combinedScore: number;
  }[];
  bestCombination: string;
  bestScore: number;
}

interface ComparativeAnalyses {
  analysisId: string;
  recruitmentId: string;
  
  balancedCandidate: BalancedCandidateAnalysis;
  differentiatorAnalysis: DifferentiatorAnalysis;
  roiAnalysis: ROIAnalysis;
  complementaryProfiles: ComplementaryProfilesAnalysis;
  
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
CREATE TABLE comparative_analyses (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  
  balanced_candidate JSON NOT NULL,
  differentiator_analysis JSON NOT NULL,
  roi_analysis JSON NOT NULL,
  complementary_profiles JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_comparative_analyses_recruitment ON comparative_analyses(recruitment_id);
```

---

## 9. API Endpoints

```typescript
// POST /api/comparative-analyses/analyze
async function runComparativeAnalyses(recruitmentId: string): Promise<ComparativeAnalyses> {
  return await runComparativeAnalyses(recruitmentId);
}

// GET /api/comparative-analyses/:recruitmentId
async function getComparativeAnalyses(recruitmentId: string): Promise<ComparativeAnalyses> {
  return await getComparativeAnalysesByRecruitment(recruitmentId);
}

// GET /api/comparative-analyses/:recruitmentId/balanced
async function getBalancedCandidate(recruitmentId: string): Promise<BalancedCandidateAnalysis> {
  return await getBalancedCandidate(recruitmentId);
}

// GET /api/comparative-analyses/:recruitmentId/differentiator
async function getDifferentiatorAnalysis(recruitmentId: string): Promise<DifferentiatorAnalysis> {
  return await getDifferentiatorAnalysis(recruitmentId);
}

// GET /api/comparative-analyses/:recruitmentId/roi
async function getROIAnalysis(recruitmentId: string): Promise<ROIAnalysis> {
  return await getROIAnalysis(recruitmentId);
}

// GET /api/comparative-analyses/:recruitmentId/complementary
async function getComplementaryProfiles(recruitmentId: string): Promise<ComplementaryProfilesAnalysis> {
  return await getComplementaryProfiles(recruitmentId);
}
```

---

## 10. Indicateurs de Suivi

### 10.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'exécution | Analyses exécutées / recrutements | 100% |
- Taux de complétude | Analyses complètes / exécutées | 100% |

### 10.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'utilisation | Analyses utilisées pour décision / analyses générées | ≥ 70% |
- Taux de recommandation suivie | Recommandations suivies / totales | ≥ 60% |

---

## 11. Conclusion

L'algorithme des 4 analyses comparatives structure les analyses intelligentes pour identifier les meilleurs candidats. Analyse 1 : Candidat le plus équilibré (calcul de l'écart-type des 6 dimensions). Analyse 2 : Candidat le plus fort sur le critère différenciateur (critère spécifique par poste). Analyse 3 : Candidat à meilleur ROI (rapport score / salaire et score / disponibilité). Analyse 4 : Profils complémentaires (combinaison optimale pour l'équipe globale). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 analyses comparatives
- Candidat le plus équilibré
- Candidat le plus fort sur le critère différenciateur
- Candidat à meilleur ROI
- Profils complémentaires
- Algorithmes détaillés pour chaque analyse
- Exemples concrets
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
