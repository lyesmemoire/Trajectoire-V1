# DOC-M07-01 : Modèle de Prédiction de Départ

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de prédiction de départ dans les 12 mois pour le MVP-META-07 Predictive Intelligence Engine. Ce document structure les facteurs prédicteurs, leurs poids, et le calcul de la probabilité de départ.

---

## 2. Principe Fondateur

Le modèle prédit la probabilité qu'un candidat parte volontairement dans les 12 mois suivant son recrutement. La prédiction est basée sur 6 facteurs prédicteurs détectés lors du processus de recrutement.

---

## 3. Facteurs Prédicteurs

### 3.1 FACTEUR A — Motivation Extrinsèque Dominante

**Détection :**
- Toutes les questions du candidat portent sur le salaire et les avantages
- Aucune question sur le contenu du poste ou la mission
- Focus exclusif sur les aspects financiers

**Poids dans la prédiction :** +20%

**Logique :**
Celui qui part pour l'argent partira pour plus d'argent. La motivation extrinsèque seule est un facteur de risque élevé de départ.

**Exemple :**
```
Candidat : "Quel est le salaire ? Quels sont les avantages ? Y a-t-il des primes ?"
Aucune question sur : "Quelle est la mission ? Avec qui vais-je travailler ?"
Détection : Motivation extrinsèque dominante
```

---

### 3.2 FACTEUR B — Ambition Supérieure au Poste

**Détection :**
- Vision déclarée de N+2 pour un poste de N
- Attentes de responsabilités supérieures au poste proposé
- Projection à un niveau hiérarchique plus élevé

**Poids dans la prédiction :** +15%

**Logique :**
Frustration probable dans 12-18 mois si le candidat a une ambition supérieure au poste proposé.

**Exemple :**
```
Candidat : "Je vois ce poste comme une étape vers un rôle de direction"
Poste proposé : Lead Developer (N)
Vision du candidat : Engineering Manager (N+2)
Détection : Ambition supérieure au poste
```

---

### 3.3 FACTEUR C — Culture Fit Partiel

**Détection :**
- Score culture fit < 3/5
- Désaccord avec les valeurs de l'entreprise
- Réticence culturelle détectée

**Poids dans la prédiction :** +15%

**Logique :**
La culture est le premier facteur de départ volontaire. Un mauvais fit culturel augmente significativement le risque de départ.

**Exemple :**
```
Score culture fit : 2.5/5
Désaccord sur : "Travail en équipe", "Transparence", "Innovation"
Détection : Culture fit partiel
```

---

### 3.4 FACTEUR D — Rémunération Sous le Marché

**Détection :**
- Offre < Percentile 50 du marché (réf. MVP-019)
- Rémunération inférieure aux attentes du candidat
- Écart significatif avec le marché

**Poids dans la prédiction :** +20%

**Logique :**
Candidat qui accepte en dessous de ses attentes = cherche ailleurs. La sous-rémunération est un facteur de risque élevé.

**Exemple :**
```
Offre proposée : 45k€
Percentile 50 du marché : 50k€ (réf. MVP-019)
Attentes du candidat : 50k€
Détection : Rémunération sous le marché
```

---

### 3.5 FACTEUR E — Manager Incompatible Détecté

**Détection :**
- Score compatibilité manager < 3/5 (réf. MVP-META-06)
- Styles de travail incompatibles
- Risque de conflit relationnel

**Poids dans la prédiction :** +25%

**Logique :**
40% des départs précoces = relation manager défaillante. La compatibilité manager est le facteur le plus pondéré.

**Exemple :**
```
Score compatibilité manager : 2.0/5
Style manager : Directif
Style candidat : Autonome
Détection : Manager incompatible détecté
```

---

### 3.6 FACTEUR F — Candidature de Fuite

**Détection :**
- Aucune réponse positive sur l'entreprise actuelle
- Motivation = partir, pas arriver
- Discours critique sur l'employeur actuel

**Poids dans la prédiction :** +15%

**Logique :**
Un candidat qui fuit son employeur actuel risque de fuir le prochain employeur.

**Exemple :**
```
Candidat : "Je veux quitter mon entreprise actuelle"
Aucun point positif sur l'entreprise actuelle
Motivation : Échapper à une situation négative
Détection : Candidature de fuite
```

---

## 4. Calcul de la Probabilité

### 4.1 Formule

```
Probabilité de départ dans 12 mois = Σ (facteurs détectés × poids)
```

### 4.2 Échelle de Risque

| Probabilité | Niveau de Risque |
|-------------|------------------|
| 0-20% | Faible |
| 21-40% | Modéré |
| 41-60% | Élevé |
| 61-100% | Critique |

---

## 5. Format de Sortie

```markdown
PRÉDICTION — DÉPART DANS 12 MOIS

Probabilité estimée : X%
Niveau de risque : Faible/Modéré/Élevé/Critique

Facteurs détectés :
→ [Facteur A] : poids [X%]
→ [Facteur B] : poids [X%]

Plan de mitigation recommandé :
→ [Action 1] pour réduire [facteur]
→ [Action 2] pour réduire [facteur]

Si non mitigé :
Coût estimé du remplacement : [calcul basé sur MVP-025]
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface DeparturePredictionFactor {
  factorId: string;
  factorType: 'extrinsic_motivation' | 'ambition_mismatch' | 'culture_fit_partial' | 'under_market_compensation' | 'manager_incompatible' | 'flight_candidate';
  
  detected: boolean;
  weight: number; // percentage
  
  detectionDetails: {
    signals: string[];
    evidence: string[];
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface DeparturePrediction {
  predictionId: string;
  recruitmentId: string;
  candidateId: string;
  
  probability: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  
  factors: DeparturePredictionFactor[];
  
  mitigationPlan: {
    action: string;
    targetFactor: string;
    expectedReduction: number;
  }[];
  
  replacementCost: number;
  
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
CREATE TABLE departure_prediction (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  probability DECIMAL(5,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  
  factors JSON NOT NULL,
  mitigation_plan JSON NOT NULL,
  replacement_cost DECIMAL(12,2) NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_departure_prediction_recruitment ON departure_prediction(recruitment_id);
CREATE INDEX idx_departure_prediction_candidate ON departure_prediction(candidate_id);
CREATE INDEX idx_departure_prediction_risk ON departure_prediction(risk_level);
```

---

## 8. API Endpoints

```typescript
// POST /api/prediction/departure
async function predictDeparture(recruitmentId: string, candidateId: string): Promise<DeparturePrediction> {
  return await predictDeparture(recruitmentId, candidateId);
}

// GET /api/prediction/departure/:predictionId
async function getDeparturePrediction(predictionId: string): Promise<DeparturePrediction> {
  return await getDeparturePrediction(predictionId);
}

// GET /api/prediction/departure/recruitment/:recruitmentId
async function getDeparturePredictionByRecruitment(recruitmentId: string): Promise<DeparturePrediction> {
  return await getDeparturePredictionByRecruitment(recruitmentId);
}

// PUT /api/prediction/departure/:predictionId/mitigation
async function updateMitigationPlan(predictionId: string, mitigationPlan: any[]): Promise<DeparturePrediction> {
  return await updateMitigationPlan(predictionId, mitigationPlan);
}

// GET /api/prediction/departure/risk/:riskLevel
async function getDeparturePredictionsByRisk(riskLevel: 'low' | 'moderate' | 'high' | 'critical'): Promise<DeparturePrediction[]> {
  return await getDeparturePredictionsByRisk(riskLevel);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de précision | Prédictions correctes / totales | ≥ 70% |
- Taux de faux positifs | Faux positifs / alertes élevées | ≤ 20% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de mitigation réussie | Départs évités / alertes mitigées | ≥ 50% |
- Réduction du coût de turnover | Coût évité / coût total | ≥ 30% |

---

## 10. Exemple Complet

```markdown
PRÉDICTION — DÉPART DANS 12 MOIS

Probabilité estimée : 65%
Niveau de risque : Critique

Facteurs détectés :
→ Manager incompatible détecté : poids 25%
→ Rémunération sous le marché : poids 20%
→ Culture fit partiel : poids 15%

Plan de mitigation recommandé :
→ Réévaluer l'assignation manager pour réduire manager incompatible
→ Ajuster l'offre au percentile 50 du marché pour réduire rémunération sous le marché
→ Discuter des valeurs et attentes culturelles pour réduire culture fit partiel

Si non mitigé :
Coût estimé du remplacement : 45k€ (basé sur MVP-025)
```

---

## 11. Conclusion

Le modèle de prédiction de départ structure la prédiction de la probabilité de départ dans les 12 mois. 6 facteurs prédicteurs : Motivation extrinsèque dominante (+20%), Ambition supérieure au poste (+15%), Culture fit partiel (+15%), Rémunération sous le marché (+20%), Manager incompatible détecté (+25%), Candidature de fuite (+15%). Calcul de la probabilité = Σ facteurs détectés × poids. Échelle de risque (Faible 0-20%, Modéré 21-40%, Élevé 41-60%, Critique 61-100%). Format de sortie avec probabilité, niveau de risque, facteurs détectés, plan de mitigation, coût de remplacement. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 6 facteurs prédicteurs
- Poids spécifiques par facteur
- Calcul de probabilité
- Échelle de risque
- Plan de mitigation
- Coût de remplacement
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
