# DOC-M03-03 : Format de Recommandation Comparative Finale

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de recommandation comparative finale pour le MVP-META-03 Comparative Intelligence Engine. Ce document structure la recommandation finale qui aide le recruteur à prendre une décision éclairée.

---

## 2. Principe Fondateur

La recommandation comparative finale synthétise les 4 analyses comparatives et présente une recommandation principale avec une justification complète, les risques acceptés, les opportunités manquées, et la qualité du lot global.

---

## 3. Format de Recommandation Comparative Finale

### 3.1 Format Markdown

```markdown
## ANALYSE COMPARATIVE FINALE
Recrutement : [Poste]
Candidats évalués : N
Date de l'analyse : [Date]

---

### RECOMMANDATION PRINCIPALE

**[Candidat X]** — Score : XX/100

**Raison principale :**
Meilleur sur [critère différenciateur] avec un niveau de [dimension] de X/5.

**Analyse détaillée :**
- Candidat le plus équilibré : [Oui/Non] (écart-type : X.XX)
- Meilleur sur le critère différenciateur : [Oui/Non] (score : X/5)
- Meilleur ROI : [Oui/Non] (ROI combiné : X.XX)

---

### POURQUOI PAS LES AUTRES

**[Candidat Y] :**
- Meilleur sur [dimension A] (score : X/5)
- Insuffisant sur [dimension B] (score : X/5) qui est critique pour ce poste
- Score global : XX/100

**[Candidat Z] :**
- Profil intéressant mais [lacune critique identifiée]
- Score global : XX/100

---

### RISQUES ACCEPTÉS EN CHOISISSANT X

En choisissant X, on accepte :
→ [faiblesse de X]
→ Plan de mitigation : [actions]

---

### OPPORTUNITÉ MANQUÉE EN NE CHOISISSANT PAS Y

Y était meilleur sur [dimension] (score : X/5).

Si cette dimension devient critique dans 12 mois :
→ Plan : [actions préventives]

---

### QUALITÉ DU LOT GLOBAL

Ce lot est [supérieur / standard / inférieur] au marché pour ce profil.

**Moyenne des scores globaux :** XX/100
**Écart-type des scores globaux :** X.XX

**Recommandation :**
[ Décider maintenant / Élargir la recherche ]

---

### SYNTHÈSE DES 4 ANALYSES

| Analyse | Candidat recommandé | Score |
|---------|---------------------|-------|
| Candidat le plus équilibré | [Nom] | Écart-type : X.XX |
| Meilleur sur critère différenciateur | [Nom] | X/5 |
| Meilleur ROI | [Nom] | ROI : X.XX |
| Profils complémentaires | [Combinaison] | Score : XX |
```

### 3.2 Format JSON

```json
{
  "recommendationId": "REC-001",
  "recruitmentId": "REC-001",
  "position": "DRH",
  
  "analysisDate": "2026-08-04T10:00:00Z",
  "candidatesEvaluated": 3,
  
  "mainRecommendation": {
    "candidateId": "CAND-001",
    "name": "Jean Dupont",
    "globalScore": 25,
    "mainReason": "Meilleur sur le critère différenciateur avec un niveau de Relations sociales de 4/5",
    "detailedAnalysis": {
      "mostBalanced": true,
      "standardDeviation": 0.71,
      "bestOnDifferentiator": true,
      "differentiatorScore": 4,
      "bestROI": false,
      "combinedROI": 0.63
    }
  },
  
  "whyNotOthers": [
    {
      "candidateId": "CAND-002",
      "name": "Marie Martin",
      "bestOn": "Tech (5/5)",
      "insufficientOn": "Fit (3/5)",
      "criticalReason": "Fit culturel critique pour ce poste",
      "globalScore": 25
    },
    {
      "candidateId": "CAND-003",
      "name": "Pierre Bernard",
      "interestingBut": "lacune critique en expérience (3/5)",
      "globalScore": 22
    }
  ],
  
  "acceptedRisks": {
    "weakness": "Relations sociales (3/5)",
    "mitigationPlan": "Accompagnement par un senior pendant 6 mois"
  },
  
  "missedOpportunity": {
    "candidateId": "CAND-002",
    "name": "Marie Martin",
    "betterOn": "Tech (5/5)",
    "ifCriticalIn12Months": "Plan de formation technique avancée"
  },
  
  "lotQuality": {
    "rating": "standard",
    "averageGlobalScore": 24,
    "standardDeviation": 1.53,
    "recommendation": "Décider maintenant"
  },
  
  "analysesSynthesis": {
    "mostBalanced": {
      "candidateId": "CAND-001",
      "name": "Jean Dupont",
      "score": 0.71
    },
    "bestOnDifferentiator": {
      "candidateId": "CAND-003",
      "name": "Pierre Bernard",
      "score": 5
    },
    "bestROI": {
      "candidateId": "CAND-003",
      "name": "Pierre Bernard",
      "score": "∞"
    },
    "complementaryProfiles": {
      "combinationId": "COMB-001",
      "score": 25.36
    }
  },
  
  "metadata": {
    "version": "1.0",
    "createdAt": "2026-08-04T10:00:00Z",
    "lastUpdated": "2026-08-04T10:00:00Z"
  }
}
```

---

## 4. Exemple Complet

### 4.1 Cas : Recrutement DRH avec 3 Candidats

```markdown
## ANALYSE COMPARATIVE FINALE
Recrutement : DRH
Candidats évalués : 3
Date de l'analyse : 2026-08-04

---

### RECOMMANDATION PRINCIPALE

**Jean Dupont** — Score : 25/30

**Raison principale :**
Meilleur sur le critère différenciateur (Relations sociales) avec un niveau de Soft skills de 4/5.

**Analyse détaillée :**
- Candidat le plus équilibré : Oui (écart-type : 0.71)
- Meilleur sur le critère différenciateur : Non (Pierre est meilleur : 5/5)
- Meilleur ROI : Non (Pierre a le meilleur ROI)

---

### POURQUOI PAS LES AUTRES

**Marie Martin :**
- Meilleur sur Tech (5/5)
- Insuffisant sur Fit (3/5) qui est critique pour ce poste
- Score global : 25/30

**Pierre Bernard :**
- Profil intéressant mais lacune critique en expérience (3/5)
- Score global : 22/30

---

### RISQUES ACCEPTÉS EN CHOISISSANT JEAN

En choisissant Jean, on accepte :
→ Soft skills (3/5) légèrement inférieurs à Pierre (5/5)
→ Plan de mitigation : Formation accélérée en relations sociales pendant les 3 premiers mois

---

### OPPORTUNITÉ MANQUÉE EN NE CHOISISSANT PAS PIERRE

Pierre était meilleur sur Soft skills (5/5).

Si cette dimension devient critique dans 12 mois :
→ Plan : Renforcer l'équipe RH avec un expert en relations sociales

---

### QUALITÉ DU LOT GLOBAL

Ce lot est standard au marché pour ce profil.

**Moyenne des scores globaux :** 24/30
**Écart-type des scores globaux :** 1.53

**Recommandation :**
Décider maintenant

---

### SYNTHÈSE DES 4 ANALYSES

| Analyse | Candidat recommandé | Score |
|---------|---------------------|-------|
| Candidat le plus équilibré | Jean Dupont | Écart-type : 0.71 |
| Meilleur sur critère différenciateur | Pierre Bernard | 5/5 |
| Meilleur ROI | Pierre Bernard | ROI : ∞ |
| Profils complémentaires | Jean + Marie | Score : 25.36 |
```

---

## 5. Structure de Données (TypeScript)

```typescript
interface MainRecommendation {
  candidateId: string;
  name: string;
  globalScore: number;
  mainReason: string;
  detailedAnalysis: {
    mostBalanced: boolean;
    standardDeviation: number;
    bestOnDifferentiator: boolean;
    differentiatorScore: number;
    bestROI: boolean;
    combinedROI: number;
  };
}

interface WhyNotOther {
  candidateId: string;
  name: string;
  bestOn: string;
  insufficientOn: string;
  criticalReason: string;
  globalScore: number;
}

interface AcceptedRisks {
  weakness: string;
  mitigationPlan: string;
}

interface MissedOpportunity {
  candidateId: string;
  name: string;
  betterOn: string;
  ifCriticalIn12Months: string;
}

interface LotQuality {
  rating: 'superior' | 'standard' | 'inferior';
  averageGlobalScore: number;
  standardDeviation: number;
  recommendation: 'decideNow' | 'expandSearch';
}

interface AnalysesSynthesis {
  mostBalanced: {
    candidateId: string;
    name: string;
    score: number;
  };
  bestOnDifferentiator: {
    candidateId: string;
    name: string;
    score: number;
  };
  bestROI: {
    candidateId: string;
    name: string;
    score: number;
  };
  complementaryProfiles: {
    combinationId: string;
    score: number;
  };
}

interface ComparativeRecommendation {
  recommendationId: string;
  recruitmentId: string;
  position: string;
  
  analysisDate: Date;
  candidatesEvaluated: number;
  
  mainRecommendation: MainRecommendation;
  whyNotOthers: WhyNotOther[];
  acceptedRisks: AcceptedRisks;
  missedOpportunity: MissedOpportunity;
  lotQuality: LotQuality;
  analysesSynthesis: AnalysesSynthesis;
  
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
CREATE TABLE comparative_recommendation (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  position VARCHAR(100) NOT NULL,
  
  analysis_date TIMESTAMP NOT NULL,
  candidates_evaluated INT NOT NULL,
  
  main_recommendation JSON NOT NULL,
  why_not_others JSON NOT NULL,
  accepted_risks JSON NOT NULL,
  missed_opportunity JSON NOT NULL,
  lot_quality JSON NOT NULL,
  analyses_synthesis JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_comparative_recommendation_recruitment ON comparative_recommendation(recruitment_id);
```

---

## 7. API Endpoints

```typescript
// POST /api/comparative-recommendation/generate
async function generateComparativeRecommendation(recruitmentId: string): Promise<ComparativeRecommendation> {
  return await generateComparativeRecommendation(recruitmentId);
}

// GET /api/comparative-recommendation/:recruitmentId
async function getComparativeRecommendation(recruitmentId: string): Promise<ComparativeRecommendation> {
  return await getComparativeRecommendationByRecruitment(recruitmentId);
}

// PUT /api/comparative-recommendation/:recruitmentId
async function updateComparativeRecommendation(recruitmentId: string, recommendation: ComparativeRecommendation): Promise<ComparativeRecommendation> {
  return await updateComparativeRecommendation(recruitmentId, recommendation);
}

// POST /api/comparative-recommendation/:recruitmentId/export
async function exportComparativeRecommendation(recruitmentId: string, format: 'markdown' | 'json' | 'pdf'): Promise<any> {
  return await exportComparativeRecommendation(recruitmentId, format);
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Recommandations générées / recrutements | 100% |
- Taux de complétude | Recommandations complètes / générées | 100% |

### 8.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de suivi | Recommandations suivies / totales | ≥ 70% |
- Taux de satisfaction | Satisfaction du recruteur / totales | ≥ 80% |

---

## 9. Conclusion

Le format de recommandation comparative finale structure la recommandation finale qui aide le recruteur à prendre une décision éclairée. Recommandation principale avec raison principale et analyse détaillée. Pourquoi pas les autres avec explications pour chaque candidat non recommandé. Risques acceptés en choisissant le candidat recommandé avec plan de mitigation. Opportunité manquée en ne choisissant pas un autre candidat avec plan préventif. Qualité du lot global avec recommandation (décider maintenant ou élargir la recherche). Synthèse des 4 analyses comparatives. Format Markdown et JSON. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Recommandation principale
- Analyse détaillée
- Pourquoi pas les autres
- Risques acceptés
- Opportunité manquée
- Qualité du lot global
- Synthèse des 4 analyses
- Format Markdown et JSON
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
