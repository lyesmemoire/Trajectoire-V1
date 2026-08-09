# DOC-M07-02 : Modèle de Prédiction de Burn-Out

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de prédiction de burn-out pour le MVP-META-07 Predictive Intelligence Engine. Ce document structure les facteurs prédicteurs, leurs poids, et le calcul du risque de burn-out.

---

## 2. Principe Fondateur

Le modèle prédit le risque de burn-out d'un candidat dans les 12 premiers mois suivant son recrutement. La prédiction est basée sur 5 facteurs prédicteurs détectés lors du processus de recrutement.

---

## 3. Facteurs Prédicteurs

### 3.1 FACTEUR A — Perfectionnisme Excessif Détecté

**Détection :**
- Signal : "Je ne lâche pas tant que c'est pas parfait"
- Signal : Exemples de surcharge présentés comme des fiertés
- Signal : Incapacité à tolérer les erreurs

**Poids dans la prédiction :** +20%

**Logique :**
Le perfectionnisme excessif est un facteur de risque majeur de burn-out. L'incapacité à accepter l'imparfait conduit à une surcharge mentale constante.

**Exemple :**
```
Candidat : "Je ne quitte jamais le bureau tant que tout n'est pas parfait"
Candidat : "J'ai travaillé 80h cette semaine pour finaliser le projet"
Détection : Perfectionnisme excessif détecté
```

---

### 3.2 FACTEUR B — Difficulté à Déléguer

**Détection :**
- Signal : Tous les exemples de réussite sont solitaires
- Signal : Aucun exemple de délégation réussie
- Signal : Préférence pour tout faire soi-même

**Poids dans la prédiction :** +15%

**Logique :**
La difficulté à déléguer conduit à une surcharge de travail et à l'incapacité de se reposer.

**Exemple :**
```
Candidat : "J'ai tout fait moi-même sur ce projet"
Candidat : "Je préfère faire les choses moi-même pour être sûr que c'est bien fait"
Aucun exemple de travail en équipe réussi
Détection : Difficulté à déléguer
```

---

### 3.3 FACTEUR C — Identité Fusionnée au Travail

**Détection :**
- Signal : Aucune mention de vie hors travail
- Signal : Définition de soi uniquement par le travail
- Signal : Absence d'intérêts ou activités personnelles

**Poids dans la prédiction :** +15%

**Logique :**
Une identité fusionnée au travail ne permet pas de se ressourcer en dehors du travail, augmentant le risque de burn-out.

**Exemple :**
```
Candidat : "Je suis développeur, c'est tout ce que je fais"
Candidat : "Je n'ai pas de hobbies, je travaille tout le temps"
Aucune mention de famille, amis, ou activités personnelles
Détection : Identité fusionnée au travail
```

---

### 3.4 FACTEUR D — Poste Très Exigeant

**Détection :**
- Charge de travail élevée attendue
- Voyages fréquents
- Pression de résultats forte
- Disponibilité requise en dehors des heures de travail

**Poids contextuel :** +20%

**Logique :**
Un poste très exigeant combiné à des facteurs de risque personnels augmente significativement le risque de burn-out.

**Exemple :**
```
Poste : Lead Developer
Charge de travail : 50-60h/semaine attendues
Voyages : 2-3 jours par mois
Pression : Deadlines serrées, livraisons fréquentes
Détection : Poste très exigeant
```

---

### 3.5 FACTEUR E — Antécédents de Surcharge

**Détection :**
- Mention de périodes "très intenses" répétées
- Sans ressourcement apparent
- Historique de surcharge chronique

**Poids dans la prédiction :** +20%

**Logique :**
Les antécédents de surcharge indiquent un pattern de comportement à risque de burn-out.

**Exemple :**
```
Candidat : "J'ai passé 6 mois à travailler 70h/semaine sur mon dernier projet"
Candidat : "C'est intense mais je gère"
Aucune mention de vacances ou de ressourcement
Détection : Antécédents de surcharge
```

---

## 4. Calcul du Risque

### 4.1 Formule

```
Risque de burn-out = Σ (facteurs détectés × poids)
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
PRÉDICTION — RISQUE DE BURN-OUT

Niveau de risque : Faible/Modéré/Élevé
Signaux détectés : [liste]

Plan de prévention recommandé :
→ Management bienveillant avec check-ins réguliers
→ Objectifs réalistes pour les 6 premiers mois
→ Encourager les limites saines
→ Surveillance des indicateurs de surcharge dès J+60
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface BurnoutPredictionFactor {
  factorId: string;
  factorType: 'excessive_perfectionism' | 'difficulty_delegating' | 'work_identity_fusion' | 'demanding_position' | 'overload_history';
  
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

interface BurnoutPrediction {
  predictionId: string;
  recruitmentId: string;
  candidateId: string;
  
  riskScore: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  
  factors: BurnoutPredictionFactor[];
  
  preventionPlan: {
    action: string;
    targetFactor: string;
    timeline: string;
  }[];
  
  monitoringIndicators: {
    indicator: string;
    checkFrequency: string;
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
CREATE TABLE burnout_prediction (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  risk_score DECIMAL(5,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  
  factors JSON NOT NULL,
  prevention_plan JSON NOT NULL,
  monitoring_indicators JSON NOT NULL,
  
  generated_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_burnout_prediction_recruitment ON burnout_prediction(recruitment_id);
CREATE INDEX idx_burnout_prediction_candidate ON burnout_prediction(candidate_id);
CREATE INDEX idx_burnout_prediction_risk ON burnout_prediction(risk_level);
```

---

## 8. API Endpoints

```typescript
// POST /api/prediction/burnout
async function predictBurnout(recruitmentId: string, candidateId: string): Promise<BurnoutPrediction> {
  return await predictBurnout(recruitmentId, candidateId);
}

// GET /api/prediction/burnout/:predictionId
async function getBurnoutPrediction(predictionId: string): Promise<BurnoutPrediction> {
  return await getBurnoutPrediction(predictionId);
}

// GET /api/prediction/burnout/recruitment/:recruitmentId
async function getBurnoutPredictionByRecruitment(recruitmentId: string): Promise<BurnoutPrediction> {
  return await getBurnoutPredictionByRecruitment(recruitmentId);
}

// PUT /api/prediction/burnout/:predictionId/prevention
async function updatePreventionPlan(predictionId: string, preventionPlan: any[]): Promise<BurnoutPrediction> {
  return await updatePreventionPlan(predictionId, preventionPlan);
}

// GET /api/prediction/burnout/risk/:riskLevel
async function getBurnoutPredictionsByRisk(riskLevel: 'low' | 'moderate' | 'high' | 'critical'): Promise<BurnoutPrediction[]> {
  return await getBurnoutPredictionsByRisk(riskLevel);
}

// POST /api/prediction/burnout/:predictionId/monitoring
async function recordMonitoringIndicator(predictionId: string, indicator: string, value: number): Promise<BurnoutPrediction> {
  return await recordMonitoringIndicator(predictionId, indicator, value);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de précision | Prédictions correctes / totales | ≥ 70% |
- Taux de faux positifs | Faux positifs / alertes élevées | ≤ 25% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de prévention réussie | Burn-outs évités / alertes mitigées | ≥ 60% |
- Réduction de l'absentéisme | Jours d'absence évités / totaux | ≥ 30% |

---

## 10. Exemple Complet

```markdown
PRÉDICTION — RISQUE DE BURN-OUT

Niveau de risque : Élevé
Signaux détectés :
→ Perfectionnisme excessif détecté : poids 20%
→ Difficulté à déléguer : poids 15%
→ Identité fusionnée au travail : poids 15%
→ Poste très exigeant : poids 20%

Plan de prévention recommandé :
→ Management bienveillant avec check-ins réguliers (hebdomadaires)
→ Objectifs réalistes pour les 6 premiers mois (réduire la charge de 20%)
→ Encourager les limites saines (pas de travail le week-end)
→ Surveillance des indicateurs de surcharge dès J+60 (heures travaillées, stress)
```

---

## 11. Conclusion

Le modèle de prédiction de burn-out structure la prédiction du risque de burn-out dans les 12 premiers mois. 5 facteurs prédicteurs : Perfectionnisme excessif détecté (+20%), Difficulté à déléguer (+15%), Identité fusionnée au travail (+15%), Poste très exigeant (+20%), Antécédents de surcharge (+20%). Calcul du risque = Σ facteurs détectés × poids. Échelle de risque (Faible 0-30%, Modéré 31-50%, Élevé 51-70%, Critique 71-100%). Format de sortie avec niveau de risque, signaux détectés, plan de prévention. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- 5 facteurs prédicteurs
- Poids spécifiques par facteur
- Calcul du risque
- Échelle de risque
- Plan de prévention
- Indicateurs de monitoring
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
