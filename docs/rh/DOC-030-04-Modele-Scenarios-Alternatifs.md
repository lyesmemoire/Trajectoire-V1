# DOC-030-04 : Modèle de Scénarios Alternatifs

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le modèle de scénarios alternatifs pour MVP-030 Uncertainty Management Engine. Ce modèle structure la construction de scénarios alternatifs pour chaque décision sous incertitude, incluant le scénario optimiste, central, pessimiste, et le point de rupture.

---

## 2. Principe Fondateur

Pour chaque décision sous incertitude, le moteur construit des scénarios alternatifs pour éclairer la prise de décision. Les scénarios permettent d'identifier les résultats possibles, leurs probabilités, et les mesures de mitigation appropriées. Le point de rupture identifie à partir de quel résultat la décision serait regrettée.

---

## 3. Les 4 Scénarios

### 3.1 Scénario Optimiste

**Hypothèse :**
Toutes les incertitudes se résolvent favorablement.

**Résultat attendu :**
Description du résultat le plus favorable possible.

**Probabilité estimée :**
X% (généralement 10-20%)

**Conditions de réalisation :**
- Liste des conditions nécessaires pour que ce scénario se réalise
- Facteurs externes favorables
- Comportements du candidat favorables

**Exemple :**
```
SCÉNARIO OPTIMISTE

Hypothèse : Toutes les incertitudes se résolvent favorablement

Résultat attendu :
  Le candidat dépasse les attentes :
  - Performance au-delà des objectifs (120%)
  - Intégration culturelle parfaite
  - Leadership exceptionnel
  - Rétention à long terme (> 3 ans)

Probabilité estimée : 15%

Conditions de réalisation :
  - Le candidat s'adapte rapidement à l'environnement
  - L'équipe est réceptive au nouveau leadership
  - Le contexte business reste favorable
  - Les compétences techniques demandées restent pertinentes
```

---

### 3.2 Scénario Central

**Hypothèse :**
Les incertitudes se résolvent de manière standard.

**Résultat attendu :**
Description du résultat le plus probable.

**Probabilité estimée :**
X% (généralement 50-70%)

**Conditions de réalisation :**
- Liste des conditions standard
- Facteurs externes neutres
- Comportements du candidat standards

**Note :**
C'est la base de la recommandation.

**Exemple :**
```
SCÉNARIO CENTRAL

Hypothèse : Les incertitudes se résolvent de manière standard

Résultat attendu :
  Le candidat répond aux attentes :
  - Performance aux objectifs (100%)
  - Intégration culturelle satisfaisante
  - Leadership compétent
  - Rétention à moyen terme (18-24 mois)

Probabilité estimée : 60%

Conditions de réalisation :
  - Le candidat s'adapte normalement à l'environnement
  - L'équipe est neutre au début puis s'adapte
  - Le contexte business reste stable
  - Les compétences techniques demandées évoluent normalement

Note : C'est la base de la recommandation
```

---

### 3.3 Scénario Pessimiste

**Hypothèse :**
Les incertitudes se résolvent défavorablement.

**Résultat attendu :**
Description du résultat le moins favorable.

**Probabilité estimée :**
X% (généralement 15-25%)

**Conditions de réalisation :**
- Liste des conditions défavorables
- Facteurs externes négatifs
- Comportements du candidat défavorables

**Mesures de mitigation :**
- Liste des mesures si ce scénario se réalise
- Actions préventives
- Plans de contingence

**Exemple :**
```
SCÉNARIO PESSIMISTE

Hypothèse : Les incertitudes se résolvent défavorablement

Résultat attendu :
  Le candidat ne répond pas aux attentes :
  - Performance en dessous des objectifs (70%)
  - Intégration culturelle difficile
  - Leadership insuffisant
  - Départ prématuré (< 12 mois)

Probabilité estimée : 25%

Conditions de réalisation :
  - Le candidat ne s'adapte pas à l'environnement
  - L'équipe est résistante au changement
  - Le contexte business se dégrade
  - Les compétences techniques demandées évoluent rapidement

Mesures de mitigation si ce scénario se réalise :
  - Plan de formation intensive dès l'arrivée
  - Mentorat renforcé par un senior
  - Évaluation à 3 mois avec possibilité de réorientation
  - Budget de contingence pour remplacement si nécessaire
```

---

### 3.4 Point de Rupture

**Définition :**
À partir de quel résultat la décision serait-elle regrettée ?

**Questions clés :**
- Quel seuil de performance ?
- Quel délai avant regret ?
- Quels signaux d'alerte ?

**Actions :**
- Que faire si ce point est atteint ?
- Quand le détecter ?
- Comment le détecter ?

**Intégration :**
Réf. MVP-021 Predictive Success + MVP-024 Retention Engine

**Exemple :**
```
POINT DE RUPTURE

À partir de quel résultat la décision serait-elle regrettée ?
  - Performance < 80% des objectifs pendant 3 mois consécutifs
  - Intégration culturelle évaluée < 3/5 après 6 mois
  - Signaux de départ (désengagement, recherche d'opportunités)

Que faire si ce point est atteint ?
  - Réunion de crise avec le manager et le candidat
  - Plan de performance améliorée (PIP) sur 2 mois
  - Si non amélioration : séparation négociée
  - Activation du budget de contingence pour remplacement

Quand le détecter ?
  - Évaluation mensuelle de la performance
  - Check-in culturel à 3 mois et 6 mois
  - Surveillance des signaux de départ en continu

Comment le détecter ?
  - KPIs de performance (réf. MVP-021 Predictive Success)
  - Enquêtes d'intégration culturelle
  - Indicateurs de rétention (réf. MVP-024 Retention Engine)
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface AlternativeScenarios {
  scenarioId: string;
  decisionId: string;
  createdAt: Date;
  
  optimisticScenario: {
    hypothesis: string;
    expectedOutcome: string;
    probability: number;
    realizationConditions: string[];
  };
  
  centralScenario: {
    hypothesis: string;
    expectedOutcome: string;
    probability: number;
    realizationConditions: string[];
    isBaseOfRecommendation: boolean;
  };
  
  pessimisticScenario: {
    hypothesis: string;
    expectedOutcome: string;
    probability: number;
    realizationConditions: string[];
    mitigationMeasures: string[];
  };
  
  breakingPoint: {
    regretThreshold: string;
    actionsIfReached: string[];
    whenToDetect: string;
    howToDetect: string[];
    integration: {
      predictiveSuccess: string;
      retentionEngine: string;
    };
  };
  
  metadata: {
    createdBy: string;
    context: string;
    version: string;
  };
}
```

---

## 5. Algorithme de Génération des Scénarios

### 5.1 Processus Global

```typescript
async function generateAlternativeScenarios(decision: Decision, uncertaintyMap: UncertaintyMap): Promise<AlternativeScenarios> {
  // 1. Analyse des incertitudes
  const uncertainties = await analyzeUncertainties(uncertaintyMap);
  
  // 2. Génération du scénario optimiste
  const optimisticScenario = await generateOptimisticScenario(decision, uncertainties);
  
  // 3. Génération du scénario central
  const centralScenario = await generateCentralScenario(decision, uncertainties);
  
  // 4. Génération du scénario pessimiste
  const pessimisticScenario = await generatePessimisticScenario(decision, uncertainties);
  
  // 5. Identification du point de rupture
  const breakingPoint = await identifyBreakingPoint(decision, uncertainties);
  
  // 6. Construction des scénarios
  const scenarios: AlternativeScenarios = {
    scenarioId: generateScenarioId(),
    decisionId: decision.decisionId,
    createdAt: new Date(),
    optimisticScenario,
    centralScenario,
    pessimisticScenario,
    breakingPoint,
    metadata: {
      createdBy: 'MVP-030 Uncertainty Management Engine',
      context: decision.context,
      version: '1.0'
    }
  };
  
  return scenarios;
}
```

---

### 5.2 Génération du Scénario Optimiste

```typescript
async function generateOptimisticScenario(decision: Decision, uncertainties: Uncertainty[]): Promise<any> {
  const hypothesis = "Toutes les incertitudes se résolvent favorablement";
  
  const expectedOutcome = await constructOptimisticOutcome(decision, uncertainties);
  
  const probability = await calculateOptimisticProbability(uncertainties);
  
  const realizationConditions = await identifyOptimisticConditions(uncertainties);
  
  return {
    hypothesis,
    expectedOutcome,
    probability,
    realizationConditions
  };
}
```

---

### 5.3 Génération du Scénario Central

```typescript
async function generateCentralScenario(decision: Decision, uncertainties: Uncertainty[]): Promise<any> {
  const hypothesis = "Les incertitudes se résolvent de manière standard";
  
  const expectedOutcome = await constructCentralOutcome(decision, uncertainties);
  
  const probability = await calculateCentralProbability(uncertainties);
  
  const realizationConditions = await identifyCentralConditions(uncertainties);
  
  return {
    hypothesis,
    expectedOutcome,
    probability,
    realizationConditions,
    isBaseOfRecommendation: true
  };
}
```

---

### 5.4 Génération du Scénario Pessimiste

```typescript
async function generatePessimisticScenario(decision: Decision, uncertainties: Uncertainty[]): Promise<any> {
  const hypothesis = "Les incertitudes se résolvent défavorablement";
  
  const expectedOutcome = await constructPessimisticOutcome(decision, uncertainties);
  
  const probability = await calculatePessimisticProbability(uncertainties);
  
  const realizationConditions = await identifyPessimisticConditions(uncertainties);
  
  const mitigationMeasures = await proposeMitigationMeasures(decision, uncertainties);
  
  return {
    hypothesis,
    expectedOutcome,
    probability,
    realizationConditions,
    mitigationMeasures
  };
}
```

---

### 5.5 Identification du Point de Rupture

```typescript
async function identifyBreakingPoint(decision: Decision, uncertainties: Uncertainty[]): Promise<any> {
  const regretThreshold = await defineRegretThreshold(decision);
  
  const actionsIfReached = await proposeActionsIfReached(decision);
  
  const whenToDetect = await defineDetectionSchedule(decision);
  
  const howToDetect = await defineDetectionMethods(decision);
  
  return {
    regretThreshold,
    actionsIfReached,
    whenToDetect,
    howToDetect,
    integration: {
      predictiveSuccess: "Intégration avec MVP-021 Predictive Success",
      retentionEngine: "Intégration avec MVP-024 Retention Engine"
    }
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE alternative_scenarios (
  id VARCHAR(36) PRIMARY KEY,
  decision_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  optimistic_scenario JSON NOT NULL,
  central_scenario JSON NOT NULL,
  pessimistic_scenario JSON NOT NULL,
  breaking_point JSON NOT NULL,
  metadata JSON NOT NULL,
  
  FOREIGN KEY (decision_id) REFERENCES decision(id)
);

CREATE INDEX idx_alternative_scenarios_decision ON alternative_scenarios(decision_id);
CREATE INDEX idx_alternative_scenarios_date ON alternative_scenarios(created_at);
```

---

## 7. API Endpoints

```typescript
// POST /api/uncertainty/scenarios
async function generateAlternativeScenarios(decision: Decision, uncertaintyMap: UncertaintyMap): Promise<AlternativeScenarios> {
  return await generateAlternativeScenarios(decision, uncertaintyMap);
}

// GET /api/uncertainty/scenarios/:scenarioId
async function getAlternativeScenarios(scenarioId: string): Promise<AlternativeScenarios> {
  return await getAlternativeScenariosById(scenarioId);
}

// GET /api/uncertainty/scenarios/decision/:decisionId
async function getScenariosByDecision(decisionId: string): Promise<AlternativeScenarios> {
  return await getScenariosByDecision(decisionId);
}

// GET /api/uncertainty/scenarios/format
async function getScenariosFormat(): Promise<any> {
  return await getScenariosFormat();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de complétude | Scénarios complets / total | ≥ 95% |
- Probabilité totale | Somme des probabilités des scénarios | 100% |
- Taux de scénarios réalistes | Scénarios réalistes / total | ≥ 90% |
- Satisfaction recruteurs | Satisfaction avec les scénarios | ≥ 4.5/5 |

### 8.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
- Précision des scénarios | Scénarios réalisés / prédits | ≥ 75% |
- Utilisation des scénarios | Scénarios consultés / créés | ≥ 80% |
- Réduction des regrets | Réduction des décisions regrettées | ≥ 30% |

---

## 9. Conclusion

Le modèle de scénarios alternatifs structure la construction de scénarios pour chaque décision sous incertitude. Les 4 scénarios (optimiste, central, pessimiste, point de rupture) permettent d'identifier les résultats possibles, leurs probabilités, et les mesures de mitigation appropriées. Le point de rupture identifie à partir de quel résultat la décision serait regrettée.

**Points clés :**
- 4 scénarios structurés
- Probabilités estimées pour chaque scénario
- Conditions de réalisation explicites
- Mesures de mitigation pour le scénario pessimiste
- Point de rupture avec actions spécifiques
- Intégration avec MVP-021 et MVP-024
- Algorithme de génération des scénarios
- Intégration avec les modules existants
