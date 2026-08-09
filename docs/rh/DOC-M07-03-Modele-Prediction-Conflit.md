# DOC-M07-03 : Modèle de Prédiction de Conflit

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de prédiction de conflit pour le MVP-META-07 Predictive Intelligence Engine. Ce document structure les facteurs prédicteurs, leurs poids, et le calcul du risque de conflit.

---

## 2. Principe Fondateur

Le modèle prédit le risque de conflit d'un candidat dans les 12 premiers mois suivant son recrutement. La prédiction est basée sur 4 facteurs prédicteurs détectés lors du processus de recrutement, en analysant le style du candidat et le contexte de l'environnement de travail.

---

## 3. Facteurs Prédicteurs

### 3.1 FACTEUR A — Style Directif Fort + Manager Également Directif

**Détection :**
- Style du candidat : Directif, assertif, prend les décisions rapidement
- Style du manager : Directif, assertif, prend les décisions rapidement
- Les deux styles sont similaires et dominants

**Poids dans la prédiction :** +30%

**Logique :**
Choc de leadership probable. Deux leaders directifs dans la même relation créent des frictions sur la prise de décision et l'autorité.

**Exemple :**
```
Style candidat : "Je prends les décisions rapidement et je m'y tiens"
Style manager : "Je suis un leader directif, je décide et je m'attends à ce qu'on suive"
Détection : Style directif fort + Manager également directif
```

---

### 3.2 FACTEUR B — Besoin de Contrôle Élevé + Environnement Ambigu

**Détection :**
- Besoin de contrôle du candidat : Élevé (précision, structure, clarté requise)
- Environnement de travail : Ambigu (processus flous, responsabilités non définies)
- Inadéquation entre le besoin de contrôle et l'environnement

**Poids dans la prédiction :** +20%

**Logique :**
Frustration et conflits probables. Un candidat qui a besoin de contrôle dans un environnement ambigu va chercher à structurer ce qui ne peut pas l'être, créant des tensions.

**Exemple :**
```
Candidat : "J'ai besoin de processus clairs et de responsabilités bien définies"
Environnement : "Nous travaillons en mode agile, les responsabilités sont fluides"
Détection : Besoin de contrôle élevé + Environnement ambigu
```

---

### 3.3 FACTEUR C — Discours Critique sur TOUS les Anciens Contextes

**Détection :**
- Discours systématiquement critique sur tous les employeurs précédents
- Aucun aspect positif mentionné sur les expériences passées
- Pattern de blâme systématique (toujours la faute des autres)

**Poids dans la prédiction :** +25%

**Logique :**
Pattern de conflits récurrent. Un candidat qui critique systématiquement ses anciens contextes a probablement du mal à s'adapter et à collaborer.

**Exemple :**
```
Candidat : "Mon ancien manager était incompétent"
Candidat : "L'équipe ne suivait pas"
Candidat : "La culture était toxique"
Aucun point positif sur les expériences passées
Détection : Discours critique sur TOUS les anciens contextes
```

---

### 3.4 FACTEUR D — Communication Directe + Culture Indirecte

**Détection :**
- Style de communication du candidat : Direct, franc, sans détours
- Culture de l'entreprise : Indirecte, diplomatie, nuances, non-dit
- Inadéquation entre le style de communication et la culture

**Poids dans la prédiction :** +15%

**Logique :**
Incompréhension et friction. Un candidat direct dans une culture indirecte sera perçu comme brutal, tandis que la culture indirecte sera perçue comme hypocrite par le candidat.

**Exemple :**
```
Candidat : "Je dis ce que je pense, sans détours"
Culture entreprise : "Nous valorisons la diplomatie et la nuance"
Détection : Communication directe + Culture indirecte
```

---

## 4. Calcul du Risque

### 4.1 Formule

```
Risque de conflit = Σ (facteurs détectés × poids)
```

### 4.2 Échelle de Risque

| Score | Niveau de Risque |
|-------|------------------|
| 0-30% | Faible |
| 31-50% | Modéré |
| 51-70% | Élevé |
| 71-100% | Critique |

---

## 5. Format de Sortie

```markdown
PRÉDICTION — RISQUE DE CONFLIT

Niveau de risque : Faible/Modéré/Élevé
Avec qui probablement : [profil]
Sur quoi probablement : [thèmes]

Plan de prévention :
→ Clarifier les règles du jeu dès l'onboarding
→ Réunion triangulaire candidat / manager / RH à J+30
→ Points réguliers sur la dynamique relationnelle
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface ConflictPredictionFactor {
  factorId: string;
  factorType: 'directive_clash' | 'control_mismatch' | 'critical_pattern' | 'communication_mismatch';
  
  detected: boolean;
  weight: number; // percentage
  
  detectionDetails: {
    candidateStyle: string;
    contextStyle: string;
    evidence: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface ConflictPrediction {
  predictionId: string;
  recruitmentId: string;
  candidateId: string;
  
  riskScore: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  
  factors: ConflictPredictionFactor[];
  
  conflictProfile: {
    withWhom: string; // manager, team, leadership
    onWhat: string[]; // decision-making, processes, communication, authority
  };
  
  preventionPlan: {
    action: string;
    targetFactor: string;
    timeline: string;
  }[];
  
  generatedAt: Date;
  
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
CREATE TABLE conflict_prediction (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  risk_score DECIMAL(5,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  
  factors JSON NOT NULL,
  conflict_profile JSON NOT NULL,
  prevention_plan JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_conflict_prediction_recruitment ON conflict_prediction(recruitment_id);
CREATE INDEX idx_conflict_prediction_candidate ON conflict_prediction(candidate_id);
CREATE INDEX idx_conflict_prediction_risk ON conflict_prediction(risk_level);
```

---

## 8. API Endpoints

```typescript
// POST /api/prediction/conflict
async function predictConflict(recruitmentId: string, candidateId: string): Promise<ConflictPrediction> {
  return await predictConflict(recruitmentId, candidateId);
}

// GET /api/prediction/conflict/:predictionId
async function getConflictPrediction(predictionId: string): Promise<ConflictPrediction> {
  return await getConflictPrediction(predictionId);
}

// GET /api/prediction/conflict/recruitment/:recruitmentId
async function getConflictPredictionByRecruitment(recruitmentId: string): Promise<ConflictPrediction> {
  return await getConflictPredictionByRecruitment(recruitmentId);
}

// PUT /api/prediction/conflict/:predictionId/prevention
async function updatePreventionPlan(predictionId: string, preventionPlan: any[]): Promise<ConflictPrediction> {
  return await updatePreventionPlan(predictionId, preventionPlan);
}

// GET /api/prediction/conflict/risk/:riskLevel
async function getConflictPredictionsByRisk(riskLevel: 'low' | 'moderate' | 'high' | 'critical'): Promise<ConflictPrediction[]> {
  return await getConflictPredictionsByRisk(riskLevel);
}

// POST /api/prediction/conflict/:predictionId/check-in
async function recordConflictCheckIn(predictionId: string, checkIn: any): Promise<ConflictPrediction> {
  return await recordConflictCheckIn(predictionId, checkIn);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de précision | Prédictions correctes / totales | ≥ 65% |
- Taux de faux positifs | Faux positifs / alertes élevées | ≤ 30% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de prévention réussie | Conflits évités / alertes mitigées | ≥ 50% |
- Réduction des tensions | Tensions réduites / totales | ≥ 40% |

---

## 10. Exemple Complet

```markdown
PRÉDICTION — RISQUE DE CONFLIT

Niveau de risque : Élevé
Avec qui probablement : Manager direct
Sur quoi probablement : Prise de décision, Autorité

Facteurs détectés :
→ Style directif fort + Manager également directif : poids 30%
→ Discours critique sur TOUS les anciens contextes : poids 25%

Plan de prévention :
→ Clarifier les règles du jeu dès l'onboarding (définition des responsabilités de décision)
→ Réunion triangulaire candidat / manager / RH à J+30 (alignement sur les styles de travail)
→ Points réguliers sur la dynamique relationnelle (mensuels pendant les 6 premiers mois)
```

---

## 11. Conclusion

Le modèle de prédiction de conflit structure la prédiction du risque de conflit dans les 12 premiers mois. 4 facteurs prédicteurs : Style directif fort + Manager également directif (+30%), Besoin de contrôle élevé + Environnement ambigu (+20%), Discours critique sur TOUS les anciens contextes (+25%), Communication directe + Culture indirecte (+15%). Calcul du risque = Σ facteurs détectés × poids. Échelle de risque (Faible 0-30%, Modéré 31-50%, Élevé 51-70%, Critique 71-100%). Format de sortie avec niveau de risque, profil de conflit (avec qui, sur quoi), plan de prévention. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 4 facteurs prédicteurs
- Poids spécifiques par facteur
- Calcul du risque
- Échelle de risque
- Profil de conflit
- Plan de prévention
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
