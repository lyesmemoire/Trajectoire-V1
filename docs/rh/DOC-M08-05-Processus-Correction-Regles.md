# DOC-M08-05 : Processus de Correction des Règles

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le processus de correction des règles d'évaluation pour le MVP-META-08 Error Learning Engine. Ce document structure le processus de modification des règles suite à l'analyse des faux positifs et faux négatifs.

---

## 2. Principe Fondateur

Les règles d'évaluation doivent être corrigées de manière systématique et documentée suite à l'analyse des faux positifs et faux négatifs. Chaque correction doit être justifiée, validée, et mesurée pour son impact.

---

## 3. Processus de Correction

### 3.1 Étape 1 — Identification de la Règle à Corriger

**Source d'identification :**
- Analyse des faux positifs (DOC-M08-03)
- Analyse des faux négatifs (DOC-M08-03)
- Rapport trimestriel (DOC-M08-04)

**Processus d'identification :**
- Identifier la règle qui a contribué à l'erreur
- Analyser la fréquence de l'erreur liée à cette règle
- Évaluer l'impact de la règle sur le taux d'erreur global

---

### 3.2 Étape 2 — Analyse de la Règle

**Questions d'analyse :**
- La règle est-elle pertinente ?
- Le poids de la règle est-il approprié ?
- La règle est-elle bien appliquée ?
- La règle est-elle bien comprise par les évaluateurs ?

**Processus d'analyse :**
- Consulter les données historiques
- Analyser les cas d'application de la règle
- Consulter les évaluateurs
- Identifier les biais potentiels

---

### 3.3 Étape 3 — Proposition de Correction

**Types de correction :**
- **Modification du poids :** Augmenter ou réduire le poids de la règle
- **Modification du critère :** Ajuster la définition du critère
- **Suppression de la règle :** Supprimer une règle non pertinente
- **Ajout d'une règle :** Ajouter une nouvelle règle

**Processus de proposition :**
- Définir la correction proposée
- Justifier la correction avec les données
- Estimer l'impact attendu
- Proposer un plan de test

---

### 3.4 Étape 4 — Validation de la Correction

**Processus de validation :**
- Revue par le comité d'évaluation
- Validation des données justificatives
- Validation de l'impact attendu
- Validation du plan de test

**Critères de validation :**
- Correction justifiée par les données
- Impact attendu positif
- Plan de test réaliste
- Consensus du comité

---

### 3.5 Étape 5 — Application de la Correction

**Processus d'application :**
- Mettre à jour la documentation des règles
- Former les évaluateurs à la nouvelle règle
- Mettre en place le plan de test
- Suivre l'impact de la correction

**Délai d'application :**
- Immédiat pour les corrections mineures
- 1 mois pour les corrections majeures
- 3 mois pour les modifications structurelles

---

### 3.6 Étape 6 — Mesure de l'Impact

**Métriques de mesure :**
- Taux d'erreur avant et après correction
- Fréquence de l'erreur liée à la règle
- Satisfaction des évaluateurs
- Impact sur la qualité des décisions

**Processus de mesure :**
- Collecter les données sur 3 mois
- Comparer avec la période précédente
- Analyser les résultats
- Documenter les conclusions

---

## 4. Structure de Données (TypeScript)

```typescript
interface RuleCorrection {
  correctionId: string;
  ruleId: string;
  
  identification: {
    source: 'false_positive' | 'false_negative' | 'quarterly_report';
    sourceId: string;
    identifiedAt: Date;
    identifiedBy: string;
  };
  
  analysis: {
    ruleRelevant: boolean;
    weightAppropriate: boolean;
    ruleWellApplied: boolean;
    ruleWellUnderstood: boolean;
    analysisDetails: string;
    analyzedAt: Date;
    analyzedBy: string;
  };
  
  proposal: {
    correctionType: 'weight_modification' | 'criterion_modification' | 'rule_deletion' | 'rule_addition';
    oldRule: string;
    newRule: string;
    justification: string;
    expectedImpact: string;
    testPlan: string;
    proposedAt: Date;
    proposedBy: string;
  };
  
  validation: {
    reviewedBy: string[];
    dataValidated: boolean;
    impactValidated: boolean;
    testPlanValidated: boolean;
    consensus: boolean;
    validatedAt: Date;
  };
  
  application: {
    documentationUpdated: boolean;
    evaluatorsTrained: boolean;
    testPlanImplemented: boolean;
    appliedAt: Date;
    appliedBy: string;
  };
  
  impactMeasurement: {
    errorRateBefore: number;
    errorRateAfter: number;
    errorFrequencyBefore: number;
    errorFrequencyAfter: number;
    evaluatorSatisfaction: number;
    decisionQualityImpact: string;
    measuredAt: Date;
    conclusions: string;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE rule_correction (
  id VARCHAR(36) PRIMARY KEY,
  rule_id VARCHAR(36) NOT NULL,
  
  identification JSON NOT NULL,
  analysis JSON NOT NULL,
  proposal JSON NOT NULL,
  validation JSON NOT NULL,
  application JSON NOT NULL,
  impact_measurement JSON NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_rule_correction_rule ON rule_correction(rule_id);
CREATE INDEX idx_rule_correction_status ON rule_correction(validation->>'consensus');
```

---

## 6. API Endpoints

```typescript
// POST /api/rule-correction/propose
async function proposeRuleCorrection(correction: any): Promise<RuleCorrection> {
  return await proposeRuleCorrection(correction);
}

// PUT /api/rule-correction/:correctionId/validate
async function validateRuleCorrection(correctionId: string, validation: any): Promise<RuleCorrection> {
  return await validateRuleCorrection(correctionId, validation);
}

// PUT /api/rule-correction/:correctionId/apply
async function applyRuleCorrection(correctionId: string): Promise<RuleCorrection> {
  return await applyRuleCorrection(correctionId);
}

// PUT /api/rule-correction/:correctionId/measure-impact
async function measureRuleCorrectionImpact(correctionId: string, impact: any): Promise<RuleCorrection> {
  return await measureRuleCorrectionImpact(correctionId, impact);
}

// GET /api/rule-correction/:correctionId
async function getRuleCorrection(correctionId: string): Promise<RuleCorrection> {
  return await getRuleCorrection(correctionId);
}

// GET /api/rule-correction/pending-validation
async function getPendingValidations(): Promise<RuleCorrection[]> {
  return await getPendingValidations();
}

// GET /api/rule-correction/pending-application
async function getPendingApplications(): Promise<RuleCorrection[]> {
  return await getPendingApplications();
}

// GET /api/rule-correction/rule/:ruleId
async function getRuleCorrectionsByRule(ruleId: string): Promise<RuleCorrection[]> {
  return await getRuleCorrectionsByRule(ruleId);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Corrections validées / proposées | ≥ 80% |
- Taux d'application | Corrections appliquées / validées | ≥ 90% |
- Délai moyen de correction | Temps entre identification et application | ≤ 30 jours |

### 7.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Réduction du taux d'erreur | Réduction / taux initial | ≥ 20% |
- Satisfaction des évaluateurs | Score moyen / 5 | ≥ 4/5 |

---

## 8. Exemple Complet

```markdown
PROCESSUS DE CORRECTION DE RÈGLE

Règle : Culture fit (poids 20%)

Étape 1 — Identification :
→ Source : Faux négatifs identifiés
→ Source ID : FN-2026-001
→ Identifié le : 2026-08-01
→ Identifié par : Comité d'évaluation

Étape 2 — Analyse :
→ Règle pertinente : Oui
→ Poids approprié : Non (trop élevé)
→ Règle bien appliquée : Oui
→ Règle bien comprise : Oui
→ Détails : 3 faux négatifs liés à culture fit partiel
→ Analysé le : 2026-08-05

Étape 3 — Proposition :
→ Type de correction : Modification du poids
→ Ancienne règle : Culture fit poids 20%
→ Nouvelle règle : Culture fit poids 15%
→ Justification : Réduction des faux négatifs
→ Impact attendu : Réduction de 30% des faux négatifs
→ Plan de test : Appliquer sur 50 recrutements
→ Proposé le : 2026-08-05

Étape 4 — Validation :
→ Revu par : Comité d'évaluation (5 membres)
→ Données validées : Oui
→ Impact validé : Oui
→ Plan de test validé : Oui
→ Consensus : Oui
→ Validé le : 2026-08-10

Étape 5 — Application :
→ Documentation mise à jour : Oui
→ Évaluateurs formés : Oui
→ Plan de test mis en place : Oui
→ Appliqué le : 2026-08-15

Étape 6 — Mesure de l'impact (3 mois plus tard) :
→ Taux d'erreur avant : 12%
→ Taux d'erreur après : 8%
→ Fréquence avant : 3 cas/trimestre
→ Fréquence après : 1 cas/trimestre
→ Satisfaction évaluateurs : 4.5/5
→ Impact qualité : Positif
→ Conclusions : Correction efficace, maintenir
→ Mesuré le : 2026-11-15
```

---

## 9. Conclusion

Le processus de correction des règles structure la modification des règles d'évaluation suite à l'analyse des faux positifs et faux négatifs. Processus en 6 étapes : Identification de la règle à corriger, Analyse de la règle, Proposition de correction, Validation de la correction, Application de la correction, Mesure de l'impact. 4 types de correction : Modification du poids, Modification du critère, Suppression de la règle, Ajout d'une règle. Validation par comité. Mesure de l'impact sur 3 mois. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Processus en 6 étapes
- Identification depuis faux positifs/négatifs
- Analyse de pertinence et poids
- 4 types de correction
- Validation par comité
- Application avec formation
- Mesure de l'impact
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de processus et d'impact
