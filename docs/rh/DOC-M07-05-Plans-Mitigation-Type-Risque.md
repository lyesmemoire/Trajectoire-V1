# DOC-M07-05 : Plans de Mitigation par Type de Risque

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les plans de mitigation par type de risque pour le MVP-META-07 Predictive Intelligence Engine. Ce document structure les actions recommandées pour réduire chaque type de risque détecté.

---

## 2. Principe Fondateur

Chaque type de risque (départ, burn-out, conflit) nécessite un plan de mitigation spécifique. Les plans sont personnalisés en fonction des facteurs détectés et du niveau de risque.

---

## 3. Plans de Mitigation pour le Risque de Départ

### 3.1 FACTEUR A — Motivation Extrinsèque Dominante

**Actions de mitigation :**
- Discuter des aspects intrinsèques du poste (mission, impact, apprentissage)
- Mettre en avant les opportunités de développement
- Créer un plan de progression clair
- Ajuster la rémunération si possible (réf. MVP-025)

**Timeline :** Immédiat (avant signature)

**Responsable :** RH + Manager

---

### 3.2 FACTEUR B — Ambition Supérieure au Poste

**Actions de mitigation :**
- Clarifier les opportunités de progression à moyen terme
- Créer un plan de carrière avec des étapes intermédiaires
- Proposer des projets de visibilité accrue
- Envisager un poste plus senior si disponible

**Timeline :** Avant signature + 6 mois

**Responsable :** Manager + Direction

---

### 3.3 FACTEUR C — Culture Fit Partiel

**Actions de mitigation :**
- Discuter des valeurs et attentes culturelles
- Identifier les points d'accord et de désaccord
- Proposer des ajustements de contexte d'équipe si possible
- Clarifier les marges de manœuvre culturelles

**Timeline :** Avant signature

**Responsable :** RH + Manager

---

### 3.4 FACTEUR D — Rémunération Sous le Marché

**Actions de mitigation :**
- Ajuster l'offre au percentile 50 du marché
- Proposer des avantages non monétaires (flexibilité, télétravail)
- Créer un plan de révision salariale à 6-12 mois
- Justifier par d'autres aspects (mission, équipe)

**Timeline :** Avant signature

**Responsable :** RH + Direction

---

### 3.5 FACTEUR E — Manager Incompatible Détecté

**Actions de mitigation :**
- Réévaluer l'assignation manager
- Proposer un changement d'équipe si possible
- Mettre en place un coaching relationnel
- Clarifier les styles de travail et attentes

**Timeline :** Avant signature

**Responsable :** RH + Direction

---

### 3.6 FACTEUR F — Candidature de Fuite

**Actions de mitigation :**
- Discuter des motivations profondes
- Identifier ce que le candidat cherche vraiment
- Vérifier si l'entreprise peut répondre à ces besoins
- Être transparent sur les limites du poste

**Timeline :** Avant signature

**Responsable :** RH

---

## 4. Plans de Mitigation pour le Risque de Burn-Out

### 4.1 FACTEUR A — Perfectionnisme Excessif Détecté

**Actions de mitigation :**
- Définir des critères de "suffisamment bon"
- Encourager la délégation et le travail en équipe
- Mettre en place des check-ins réguliers sur la charge de travail
- Former au "done is better than perfect"

**Timeline :** Dès l'onboarding + continu

**Responsable :** Manager + RH

---

### 4.2 FACTEUR B — Difficulté à Déléguer

**Actions de mitigation :**
- Former à la délégation efficace
- Assigner un mentor pour le coaching
- Créer des opportunités de travail en équipe
- Évaluer régulièrement la charge de travail

**Timeline :** Dès l'onboarding + 3 mois

**Responsable :** Manager

---

### 4.3 FACTEUR C — Identité Fusionnée au Travail

**Actions de mitigation :**
- Encourager les activités hors travail
- Mettre en place des limites claires (pas de travail le week-end)
- Discuter de l'équilibre vie pro/vie perso
- Proposer des ressources de bien-être

**Timeline :** Dès l'onboarding + continu

**Responsable :** Manager + RH

---

### 4.4 FACTEUR D — Poste Très Exigeant

**Actions de mitigation :**
- Réévaluer la charge de travail attendue
- Proposer des ajustements si possible
- Mettre en place des périodes de ressourcement
- Surveiller les indicateurs de surcharge

**Timeline :** Avant signature + continu

**Responsable :** Manager + Direction

---

### 4.5 FACTEUR E — Antécédents de Surcharge

**Actions de mitigation :**
- Discuter des périodes passées et des leçons apprises
- Mettre en place un plan de prévention
- Surveiller les signes de surcharge dès J+60
- Proposer un accompagnement psychologique si nécessaire

**Timeline :** Dès l'onboarding + continu

**Responsable :** Manager + RH

---

## 5. Plans de Mitigation pour le Risque de Conflit

### 5.1 FACTEUR A — Style Directif Fort + Manager Également Directif

**Actions de mitigation :**
- Clarifier les rôles et responsabilités de décision
- Mettre en place des réunions d'alignement régulières
- Définir les zones d'autonomie du candidat
- Envisager un changement d'équipe si nécessaire

**Timeline :** Dès l'onboarding + 30 jours

**Responsable :** Manager + RH

---

### 5.2 FACTEUR B — Besoin de Contrôle Élevé + Environnement Ambigu

**Actions de mitigation :**
- Clarifier les processus et responsabilités
- Créer des structures de travail plus définies
- Mettre en place des points de régularité
- Ajuster l'environnement si possible

**Timeline :** Dès l'onboarding + 30 jours

**Responsable :** Manager

---

### 5.3 FACTEUR C — Discours Critique sur TOUS les Anciens Contextes

**Actions de mitigation :**
- Explorer les patterns de conflits passés
- Mettre en place un coaching relationnel
- Clarifier les attentes et règles de l'équipe
- Surveiller la dynamique relationnelle

**Timeline :** Dès l'onboarding + continu

**Responsable :** Manager + RH

---

### 5.4 FACTEUR D — Communication Directe + Culture Indirecte

**Actions de mitigation :**
- Expliquer la culture de communication de l'entreprise
- Former aux nuances culturelles
- Mettre en place un médiateur si nécessaire
- Clarifier les attentes de communication

**Timeline :** Dès l'onboarding + 30 jours

**Responsable :** Manager + RH

---

## 6. Structure de Données (TypeScript)

```typescript
interface MitigationAction {
  actionId: string;
  riskType: 'departure' | 'burnout' | 'conflict';
  factorType: string;
  
  action: string;
  timeline: string;
  responsible: string[];
  
  expectedReduction: number; // percentage
  
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}

interface MitigationPlan {
  planId: string;
  predictionId: string;
  recruitmentId: string;
  candidateId: string;
  
  riskType: 'departure' | 'burnout' | 'conflict';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  
  actions: MitigationAction[];
  
  overallProgress: number; // percentage
  expectedRiskReduction: number; // percentage
  
  createdAt: Date;
  
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
CREATE TABLE mitigation_plan (
  id VARCHAR(36) PRIMARY KEY,
  prediction_id VARCHAR(36) NOT NULL,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  risk_type VARCHAR(20) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  
  actions JSON NOT NULL,
  overall_progress DECIMAL(5,2) NOT NULL,
  expected_risk_reduction DECIMAL(5,2) NOT NULL,
  
  created_at TIMESTAMP NOT NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_mitigation_plan_prediction ON mitigation_plan(prediction_id);
CREATE INDEX idx_mitigation_plan_recruitment ON mitigation_plan(recruitment_id);
CREATE INDEX idx_mitigation_plan_risk_type ON mitigation_plan(risk_type);
```

---

## 8. API Endpoints

```typescript
// POST /api/mitigation/create
async function createMitigationPlan(predictionId: string): Promise<MitigationPlan> {
  return await createMitigationPlan(predictionId);
}

// GET /api/mitigation/:planId
async function getMitigationPlan(planId: string): Promise<MitigationPlan> {
  return await getMitigationPlan(planId);
}

// PUT /api/mitigation/:planId/action/:actionId
async function updateActionStatus(planId: string, actionId: string, status: string): Promise<MitigationPlan> {
  return await updateActionStatus(planId, actionId, status);
}

// GET /api/mitigation/prediction/:predictionId
async function getMitigationPlanByPrediction(predictionId: string): Promise<MitigationPlan> {
  return await getMitigationPlanByPrediction(predictionId);
}

// GET /api/mitigation/risk/:riskType
async function getMitigationPlansByRisk(riskType: 'departure' | 'burnout' | 'conflict'): Promise<MitigationPlan[]> {
  return await getMitigationPlansByRisk(riskType);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétion | Actions complétées / totales | ≥ 80% |
- Taux de réduction effective | Risque réduit / attendu | ≥ 70% |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux de mitigation réussie | Risques mitigés / totaux | ≥ 60% |
- ROI de mitigation | Coût évité / coût de mitigation | ≥ 3x |

---

## 10. Exemple Complet

```markdown
PLAN DE MITIGATION — RISQUE DE DÉPART

Facteur détecté : Manager incompatible détecté (poids 25%)

Actions de mitigation :
→ Réévaluer l'assignation manager
  Timeline : Avant signature
  Responsable : RH + Direction
  Réduction attendue : 15%

→ Mettre en place un coaching relationnel
  Timeline : Dès l'onboarding
  Responsable : Manager + RH
  Réduction attendue : 10%

Progression globale : 0%
Réduction de risque attendue : 25%
```

---

## 11. Conclusion

Les plans de mitigation par type de risque structurent les actions recommandées pour réduire chaque type de risque détecté. Pour le risque de départ : 6 facteurs avec actions spécifiques (Motivation extrinsèque, Ambition supérieure, Culture fit partiel, Rémunération sous le marché, Manager incompatible, Candidature de fuite). Pour le risque de burn-out : 5 facteurs avec actions spécifiques (Perfectionnisme excessif, Difficulté à déléguer, Identité fusionnée, Poste exigeant, Antécédents de surcharge). Pour le risque de conflit : 4 facteurs avec actions spécifiques (Style directif, Besoin de contrôle, Discours critique, Communication directe). Chaque action inclut timeline, responsable, réduction attendue. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Plans de mitigation par type de risque
- Actions spécifiques par facteur
- Timeline et responsable pour chaque action
- Réduction attendue par action
- Progression globale du plan
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et d'impact
