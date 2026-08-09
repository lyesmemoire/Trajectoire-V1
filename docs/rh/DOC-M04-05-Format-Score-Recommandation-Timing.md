# DOC-M04-05 : Format de Score et Recommandation Timing

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le format de score et recommandation timing pour le MVP-META-04 Timing Intelligence Engine. Ce document structure le score de timing global et la recommandation finale basée sur les 4 dimensions du timing.

---

## 2. Principe Fondateur

Le score de timing global synthétise les 4 dimensions du timing en un score unique (0-10) avec une interprétation claire et une recommandation actionnable.

---

## 3. Score de Timing Global

### 3.1 Composantes du Score

**Score de timing : X/10**

**Composantes :**
- Disponibilité candidat : X/10 (pondéré par l'urgence du poste)
- Stade de carrière : X/10
- Maturité organisationnelle : X/10
- Marché du travail : X/10

**Formule de calcul :**
```
Score global = (Disponibilité × 0.3) + (Stade de carrière × 0.3) + (Maturité organisationnelle × 0.2) + (Marché du travail × 0.2)
```

### 3.2 Interprétation du Score

| Score | Interprétation | Action |
|-------|----------------|--------|
| 8-10 | Timing optimal | Décider maintenant |
| 6-7 | Timing acceptable avec nuances | Décider avec précautions |
| 4-5 | Timing questionnable | Réfléchir |
| 0-3 | Mauvais timing | Attendre ou renoncer |

---

## 4. Format de Sortie Timing

### 4.1 Format Markdown

```markdown
## ANALYSE DE TIMING

Score global : X/10

---

### Disponibilité

[Candidat] peut démarrer dans [délai].
Compatible avec l'urgence : Oui/Non
Risque de désistement d'ici [délai] : [%]

---

### Stade de Carrière

Ce poste arrive [trop tôt/au bon moment/trop tard] dans sa trajectoire.
Raison : [explication]

---

### Organisation

[Entreprise] est [prête/partiellement prête/pas prête] à accueillir ce profil.
Point de vigilance : [si applicable]

---

### Marché

Ce profil est [rare/standard/abondant].
Recommandation : [Décider maintenant / Prendre le temps / Élargir la recherche]

---

### RECommandation TIMING

[Decision recommandée avec justification]
```

### 4.2 Format JSON

```json
{
  "timingAnalysisId": "TA-001",
  "candidateId": "CAND-001",
  "recruitmentId": "REC-001",
  
  "globalScore": 8.5,
  "interpretation": "optimal",
  "action": "decideNow",
  
  "availability": {
    "candidateName": "Jean Dupont",
    "availabilityDelay": 14,
    "compatibleWithUrgency": true,
    "withdrawalRisk": 10,
    "score": 9
  },
  
  "careerStage": {
    "stage": "optimal",
    "reason": "Le poste représente la prochaine marche logique",
    "score": 8
  },
  
  "organization": {
    "readinessLevel": "ready",
    "vigilancePoint": null,
    "score": 9
  },
  
  "laborMarket": {
    "profileRarity": "rare",
    "recommendation": "decideNow",
    "score": 8
  },
  
  "timingRecommendation": {
    "decision": "Recruter maintenant",
    "justification": "Timing optimal sur toutes les dimensions. Candidat disponible dans 2 semaines, stade de carrière optimal, organisation prête, marché tendu.",
    "confidence": "high"
  },
  
  "metadata": {
    "version": "1.0",
    "createdAt": "2026-08-04T10:00:00Z",
    "lastUpdated": "2026-08-04T10:00:00Z"
  }
}
```

---

## 5. Exemple Complet

### 5.1 Cas : Candidat Optimal

```markdown
## ANALYSE DE TIMING

Score global : 8.5/10

---

### Disponibilité

Jean Dupont peut démarrer dans 2 semaines.
Compatible avec l'urgence : Oui
Risque de désistement d'ici 2 semaines : 10%

---

### Stade de Carrière

Ce poste arrive au bon moment dans sa trajectoire.
Raison : Le poste représente la prochaine marche logique (maturité 4/5, potentiel 4/5)

---

### Organisation

Entreprise ABC est prête à accueillir ce profil.
Point de vigilance : Aucun

---

### Marché

Ce profil est rare.
Recommandation : Décider maintenant

---

### RECommandation TIMING

Recruter maintenant. Timing optimal sur toutes les dimensions. Candidat disponible dans 2 semaines, stade de carrière optimal, organisation prête, marché tendu.
```

### 5.2 Cas : Candidat avec Timing Questionnable

```markdown
## ANALYSE DE TIMING

Score global : 4.5/10

---

### Disponibilité

Marie Martin peut démarrer dans 6 mois.
Compatible avec l'urgence : Non
Risque de désistement d'ici 6 mois : 30%

---

### Stade de Carrière

Ce poste arrive trop tard dans sa trajectoire.
Raison : Le poste est une régression par rapport à ses expériences passées

---

### Organisation

Entreprise ABC est partiellement prête à accueillir ce profil.
Point de vigilance : Manager en train de partir

---

### Marché

Ce profil est standard.
Recommandation : Prendre le temps

---

### RECommandation TIMING

Ne pas recruter. Timing questionnable sur plusieurs dimensions. Candidat disponible dans 6 mois (incompatible avec l'urgence), stade de carrière trop tard (régression), organisation partiellement prête (manager en partance).
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface TimingAnalysis {
  timingAnalysisId: string;
  candidateId: string;
  recruitmentId: string;
  
  globalScore: number; // 0-10
  interpretation: 'optimal' | 'acceptable' | 'questionable' | 'poor';
  action: 'decideNow' | 'decideWithPrecautions' | 'reflect' | 'waitOrAbandon';
  
  availability: {
    candidateName: string;
    availabilityDelay: number; // en jours
    compatibleWithUrgency: boolean;
    withdrawalRisk: number; // en pourcentage
    score: number; // 0-10
  };
  
  careerStage: {
    stage: 'tooEarly' | 'optimal' | 'tooLate';
    reason: string;
    score: number; // 0-10
  };
  
  organization: {
    readinessLevel: 'ready' | 'partiallyReady' | 'notReady';
    vigilancePoint: string | null;
    score: number; // 0-10
  };
  
  laborMarket: {
    profileRarity: 'rare' | 'standard' | 'abundant';
    recommendation: 'decideNow' | 'takeTime' | 'expandSearch';
    score: number; // 0-10
  };
  
  timingRecommendation: {
    decision: string;
    justification: string;
    confidence: 'high' | 'medium' | 'low';
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE timing_analysis (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  
  global_score DECIMAL(3,1) NOT NULL,
  interpretation VARCHAR(20) NOT NULL,
  action VARCHAR(30) NOT NULL,
  
  availability JSON NOT NULL,
  career_stage JSON NOT NULL,
  organization JSON NOT NULL,
  labor_market JSON NOT NULL,
  timing_recommendation JSON NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_timing_analysis_candidate ON timing_analysis(candidate_id);
CREATE INDEX idx_timing_analysis_recruitment ON timing_analysis(recruitment_id);
CREATE INDEX idx_timing_analysis_score ON timing_analysis(global_score);
```

---

## 8. API Endpoints

```typescript
// POST /api/timing-analysis/generate
async function generateTimingAnalysis(candidateId: string, recruitmentId: string): Promise<TimingAnalysis> {
  return await generateTimingAnalysis(candidateId, recruitmentId);
}

// GET /api/timing-analysis/:candidateId/:recruitmentId
async function getTimingAnalysis(candidateId: string, recruitmentId: string): Promise<TimingAnalysis> {
  return await getTimingAnalysis(candidateId, recruitmentId);
}

// PUT /api/timing-analysis/:candidateId/:recruitmentId
async function updateTimingAnalysis(candidateId: string, recruitmentId: string, analysis: TimingAnalysis): Promise<TimingAnalysis> {
  return await updateTimingAnalysis(candidateId, recruitmentId, analysis);
}

// POST /api/timing-analysis/:candidateId/:recruitmentId/export
async function exportTimingAnalysis(candidateId: string, recruitmentId: string, format: 'markdown' | 'json' | 'pdf'): Promise<any> {
  return await exportTimingAnalysis(candidateId, recruitmentId, format);
}

// GET /api/timing-analysis/recruitment/:recruitmentId
async function getTimingAnalysesByRecruitment(recruitmentId: string): Promise<TimingAnalysis[]> {
  return await getTimingAnalysesByRecruitment(recruitmentId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de génération | Analyses générées / candidats évalués | 100% |
- Taux de complétude | Analyses complètes / générées | 100% |

### 9.2 Métriques d'Utilisation

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de consultation | Analyses consultées / générées | ≥ 80% |
- Taux d'impact sur décision | Décisions influencées par timing / décisions totales | ≥ 60% |

---

## 10. Conclusion

Le format de score et recommandation timing structure le score de timing global et la recommandation finale. Score global 0-10 calculé à partir des 4 dimensions (Disponibilité 30%, Stade de carrière 30%, Maturité organisationnelle 20%, Marché du travail 20%). Interprétation du score (8-10 optimal, 6-7 acceptable, 4-5 questionnable, 0-3 mauvais). Format de sortie Markdown et JSON. Exemples complets (candidat optimal, candidat avec timing questionnable). Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Score de timing global 0-10
- 4 composantes pondérées
- Interprétation du score
- Format de sortie Markdown
- Format de sortie JSON
- Exemples complets
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'utilisation
