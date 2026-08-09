# DOC-028-04 : Protocole d'Apprentissage des Exceptions

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'apprentissage des exceptions pour MVP-028 Exception Intelligence Engine. Ce protocole permet au moteur d'apprendre de chaque exception décidée (accordée ou refusée), d'enrichir sa mémoire, et d'évoluer les règles en fonction des résultats observés.

---

## 2. Principe Fondateur

Chaque exception décidée enrichit la mémoire du moteur. Le moteur apprend si l'exception a été accordée, par qui et avec quelle justification, quel a été le résultat à 6, 12, 24 mois, si l'exception était justifiée, et si la règle doit être révisée. Le mécanisme d'évolution des règles permet d'adapter le corpus de règles en fonction des exceptions accordées et des résultats observés.

---

## 3. Ce que le Moteur Apprend

### 3.1 Décision sur l'Exception

**Champ :** L'exception a-t-elle été accordée ?

**Format :** Oui / Non / Conditionnel

**Exemple :** Oui

---

### 3.2 Décideur et Justification

**Champ :** Par qui et avec quelle justification ?

**Format :** Décideur + justification

**Exemple :** DRH Marie Dupont : "L'exception est accordée car le parcours entrepreneurial du candidat démontre une maturité équivalente à 5 ans d'expérience en grande entreprise."

---

### 3.3 Résultat à 6 Mois

**Champ :** Quel a été le résultat à 6 mois ?

**Format :** Performance / Intégration / Satisfaction

**Exemple :** Performance : 8/10, Intégration : Réussie, Satisfaction manager : 9/10

---

### 3.4 Résultat à 12 Mois

**Champ :** Quel a été le résultat à 12 mois ?

**Format :** Performance / Intégration / Satisfaction

**Exemple :** Performance : 9/10, Intégration : Réussie, Satisfaction manager : 9/10

---

### 3.5 Résultat à 24 Mois

**Champ :** Quel a été le résultat à 24 mois ?

**Format :** Performance / Intégration / Satisfaction

**Exemple :** Performance : 9/10, Intégration : Réussie, Satisfaction manager : 9/10

---

### 3.6 Justification de l'Exception

**Champ :** L'exception était-elle justifiée ?

**Format :** Oui / Non / Partiellement

**Exemple :** Oui

---

### 3.7 Révision de la Règle

**Champ :** La règle doit-elle être révisée ?

**Format :** Oui / Non / À étudier

**Exemple :** À étudier

---

## 4. Mécanisme d'Évolution des Règles

### 4.1 Si 10 Exceptions Similaires sont Accordées et Produisent de Bons Résultats

**Condition :**
- 10 exceptions similaires accordées
- Résultats positifs à 12 mois (performance ≥ 8/10)

**Action :**
- La règle doit être révisée
- Proposition de révision générée
- Soumise au Comité de Gouvernance (réf. RH-006)

**Exemple :**
- Règle : "Exiger 5 ans d'expérience minimum"
- 10 exceptions accordées pour candidats avec parcours entrepreneurial
- Résultats : Performance moyenne 8.5/10 à 12 mois
- Proposition : Réviser la règle pour accepter l'équivalence entrepreneuriale

---

### 4.2 Si 5 Exceptions Similaires Échouent

**Condition :**
- 5 exceptions similaires accordées
- Résultats négatifs à 12 mois (performance < 6/10)

**Action :**
- La règle est renforcée
- L'argumentaire d'exception est durci
- Les conditions sont précisées

**Exemple :**
- Règle : "Exiger 5 ans d'expérience minimum"
- 5 exceptions accordées pour candidats sans parcours entrepreneurial
- Résultats : Performance moyenne 5/10 à 12 mois
- Action : Renforcer la règle, durcir l'argumentaire d'exception

---

### 4.3 Si les Résultats sont Mixtes

**Condition :**
- Exceptions accordées avec résultats mixtes
- Certains positifs, certains négatifs

**Action :**
- Analyse approfondie des cas positifs et négatifs
- Identification des facteurs de succès
- Précision des conditions d'exception

**Exemple :**
- Règle : "Exiger 5 ans d'expérience minimum"
- 10 exceptions accordées, 6 positives, 4 négatives
- Analyse : Les cas positifs ont tous un parcours entrepreneurial
- Action : Préciser que l'exception s'applique uniquement aux parcours entrepreneuriaux

---

## 5. Algorithme d'Apprentissage des Exceptions

### 5.1 Processus Global

```typescript
async function learnFromException(dossierId: string): Promise<ExceptionLearning> {
  // 1. Récupération du dossier d'exception
  const dossier = await getExceptionDossier(dossierId);
  
  // 2. Enregistrement de la décision
  const decision = await recordDecision(dossier);
  
  // 3. Suivi des résultats à 6, 12, 24 mois
  const results = await trackResults(dossier);
  
  // 4. Évaluation de la justification de l'exception
  const justification = await evaluateJustification(dossier, results);
  
  // 5. Évaluation de la nécessité de révision de la règle
  const ruleRevision = await evaluateRuleRevision(dossier, results);
  
  // 6. Construction de l'apprentissage
  const learning: ExceptionLearning = {
    learningId: generateLearningId(),
    dossierId,
    learnedAt: new Date(),
    
    decision,
    results,
    justification,
    ruleRevision
  };
  
  // 7. Sauvegarde de l'apprentissage
  await saveExceptionLearning(learning);
  
  // 8. Mise à jour de la mémoire du moteur
  await updateEngineMemory(learning);
  
  return learning;
}
```

---

### 5.2 Suivi des Résultats

```typescript
async function trackResults(dossier: ExceptionDossier): Promise<{
  sixMonths: {
    performance: number;
    integration: string;
    managerSatisfaction: number;
  };
  twelveMonths: {
    performance: number;
    integration: string;
    managerSatisfaction: number;
  };
  twentyFourMonths: {
    performance: number;
    integration: string;
    managerSatisfaction: number;
  };
}> {
  // Récupération des résultats à 6 mois
  const sixMonths = await getResultsAtSixMonths(dossier);
  
  // Récupération des résultats à 12 mois
  const twelveMonths = await getResultsAtTwelveMonths(dossier);
  
  // Récupération des résultats à 24 mois
  const twentyFourMonths = await getResultsAtTwentyFourMonths(dossier);
  
  return {
    sixMonths,
    twelveMonths,
    twentyFourMonths
  };
}
```

---

### 5.3 Évaluation de la Justification

```typescript
async function evaluateJustification(
  dossier: ExceptionDossier,
  results: any
): Promise<{
  justified: boolean;
  justification: string;
}> {
  // Calcul de la performance moyenne
  const averagePerformance = (results.sixMonths.performance + results.twelveMonths.performance + results.twentyFourMonths.performance) / 3;
  
  // Si la performance moyenne est ≥ 8/10
  if (averagePerformance >= 8) {
    return {
      justified: true,
      justification: `L'exception était justifiée. Performance moyenne : ${averagePerformance}/10`
    };
  }
  
  // Si la performance moyenne est < 6/10
  if (averagePerformance < 6) {
    return {
      justified: false,
      justification: `L'exception n'était pas justifiée. Performance moyenne : ${averagePerformance}/10`
    };
  }
  
  // Si la performance moyenne est entre 6 et 8
  return {
    justified: true,
    justification: `L'exception était partiellement justifiée. Performance moyenne : ${averagePerformance}/10`
  };
}
```

---

### 5.4 Évaluation de la Nécessité de Révision de la Règle

```typescript
async function evaluateRuleRevision(
  dossier: ExceptionDossier,
  results: any
): Promise<{
  revisionNeeded: boolean;
  revisionType: 'strengthen' | 'revise' | 'precise' | null;
  justification: string;
}> {
  // Récupération des exceptions similaires
  const similarExceptions = await getSimilarExceptions(dossier);
  
  // Comptage des exceptions accordées avec résultats positifs
  const positiveExceptions = similarExceptions.filter(e => e.justified && e.results.twelveMonths.performance >= 8);
  
  // Comptage des exceptions accordées avec résultats négatifs
  const negativeExceptions = similarExceptions.filter(e => !e.justified && e.results.twelveMonths.performance < 6);
  
  // Si 10 exceptions similaires sont accordées et produisent de bons résultats
  if (positiveExceptions.length >= 10) {
    return {
      revisionNeeded: true,
      revisionType: 'revise',
      justification: `${positiveExceptions.length} exceptions similaires accordées avec résultats positifs. La règle doit être révisée.`
    };
  }
  
  // Si 5 exceptions similaires échouent
  if (negativeExceptions.length >= 5) {
    return {
      revisionNeeded: true,
      revisionType: 'strengthen',
      justification: `${negativeExceptions.length} exceptions similaires échouent. La règle doit être renforcée.`
    };
  }
  
  // Si les résultats sont mixtes
  if (positiveExceptions.length >= 5 && negativeExceptions.length >= 3) {
    return {
      revisionNeeded: true,
      revisionType: 'precise',
      justification: `Résultats mixtes (${positiveExceptions.length} positifs, ${negativeExceptions.length} négatifs). Les conditions d'exception doivent être précisées.`
    };
  }
  
  // Si aucune condition n'est remplie
  return {
    revisionNeeded: false,
    revisionType: null,
    justification: 'Pas assez de données pour justifier une révision de la règle.'
  };
}
```

---

## 6. Structure de Données (TypeScript)

```typescript
interface ExceptionLearning {
  learningId: string;
  dossierId: string;
  learnedAt: Date;
  
  decision: {
    granted: boolean;
    decisionMaker: string;
    justification: string;
  };
  
  results: {
    sixMonths: {
      performance: number;
      integration: string;
      managerSatisfaction: number;
    };
    twelveMonths: {
      performance: number;
      integration: string;
      managerSatisfaction: number;
    };
    twentyFourMonths: {
      performance: number;
      integration: string;
      managerSatisfaction: number;
    };
  };
  
  justification: {
    justified: boolean;
    justification: string;
  };
  
  ruleRevision: {
    revisionNeeded: boolean;
    revisionType: 'strengthen' | 'revise' | 'precise' | null;
    justification: string;
  };
}
```

---

## 7. Stockage et Gestion

### 7.1 Schéma SQL

```sql
CREATE TABLE exception_learning (
  id VARCHAR(36) PRIMARY KEY,
  dossier_id VARCHAR(36) NOT NULL,
  learned_at TIMESTAMP NOT NULL,
  
  decision JSON NOT NULL,
  results JSON NOT NULL,
  justification JSON NOT NULL,
  rule_revision JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (dossier_id) REFERENCES exception_dossier(id)
);

CREATE INDEX idx_exception_learning_dossier ON exception_learning(dossier_id);
CREATE INDEX idx_exception_learning_date ON exception_learning(learned_at);
CREATE INDEX idx_exception_learning_revision ON exception_learning((rule_revision->>'revisionNeeded'));
```

---

## 8. API Endpoints

```typescript
// POST /api/exception-intelligence/learn
async function learnFromException(dossierId: string): Promise<ExceptionLearning> {
  return await learnFromException(dossierId);
}

// GET /api/exception-intelligence/learning/:learningId
async function getExceptionLearning(learningId: string): Promise<ExceptionLearning> {
  return await getExceptionLearningById(learningId);
}

// GET /api/exception-intelligence/learning/rule/:ruleId
async function getExceptionLearningByRule(ruleId: string): Promise<ExceptionLearning[]> {
  return await getExceptionLearningByRuleId(ruleId);
}

// POST /api/exception-intelligence/learning/evaluate-revision
async function evaluateRuleRevision(ruleId: string): Promise<RuleRevisionProposal> {
  return await evaluateRuleRevision(ruleId);
}
```

---

## 9. Indicateurs de Suivi

### 9.1 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'apprentissage | Exceptions avec apprentissage / total | ≥ 90% |
| Taux de suivi des résultats | Résultats suivis à 12 mois / total | ≥ 80% |
| Précision de l'évaluation | Précision de l'évaluation de justification | ≥ 75% |
| Satisfaction DRH | Satisfaction avec l'apprentissage | ≥ 4.5/5 |

### 9.2 Métriques d'Impact

| Métrique | Description | Cible |
|----------|-------------|-------|
| Amélioration des règles | Règles révisées basées sur l'apprentissage | ≥ 5/an |
- Réduction des exceptions injustifiées | Exceptions injustifiées réduites | ≥ 30% |
- Amélioration de la qualité des décisions | Décisions positives améliorées | ≥ 20% |

---

## 10. Conclusion

Le protocole d'apprentissage des exceptions permet au moteur d'apprendre de chaque exception décidée (accordée ou refusée), d'enrichir sa mémoire, et d'évoluer les règles en fonction des résultats observés. Le mécanisme d'évolution des règles permet d'adapter le corpus de règles en fonction des exceptions accordées et des résultats observés. Le protocole s'intègre avec les modules existants (MVP-021).

**Points clés :**
- 7 points d'apprentissage par exception
- Suivi des résultats à 6, 12, 24 mois
- Évaluation de la justification de l'exception
- Évaluation de la nécessité de révision de la règle
- 3 types de révision (renforcer, réviser, préciser)
- Conditions de révision automatique
- Intégration avec les modules existants
