# DOC-009-05 : Protocole de Test de l'Explainability

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test de l'explainability pour MVP-009. Ce protocole vérifie que l'on peut reconstruire le raisonnement du moteur à partir de la sortie, garantissant que l'explication est fidèle et complète.

---

## 2. Principe Fondateur

Peut-on reconstruire le raisonnement à partir de la sortie ? Si la réponse est non, l'explainability est un échec. Le test vérifie la fidélité, la complétude et la cohérence de l'arbre de décision par rapport au raisonnement interne du moteur.

---

## 3. Types de Tests

### 3.1 Classification des Tests

```typescript
enum ExplainabilityTestType {
  FIDELITY = 'fidelity',           // Fidélité de la sortie au raisonnement
  COMPLETENESS = 'completeness',   // Complétude de l'explication
  COHERENCE = 'coherence',         // Cohérence interne
  RECONSTRUCTIBILITY = 'reconstructibility', // Reconstructibilité
  USABILITY = 'usability'          // Utilisabilité pour l'humain
  
}
```

### 3.2 Description des Tests

| Type | Description | Objectif |
|------|-------------|----------|
| FIDELITY | La sortie reflète-t-elle fidèlement le raisonnement ? | ≥ 95% de fidélité |
| COMPLETENESS | L'explication est-elle complète ? | ≥ 90% de complétude |
| COHERENCE | L'explication est-elle cohérente ? | 0 contradiction |
| RECONSTRUCTIBILITY | Peut-on reconstruire le raisonnement ? | ≥ 85% de reconstructibilité |
| USABILITY | L'explication est-elle compréhensible ? | ≥ 80% de compréhension |

---

## 4. Test de Fidélité

### 4.1 Objectif

Vérifier que la sortie (arbre de décision) reflète fidèlement le raisonnement interne du moteur.

### 4.2 Méthodologie

```typescript
interface FidelityTest {
  testId: string;
  timestamp: Date;
  
  input: {
    candidateId: string;
    jobId: string;
  };
  
  internalReasoning: {
    engineOutput: EngineOutput;
    internalScores: InternalScores;
    internalDecisions: InternalDecisions[];
  };
  
  externalOutput: {
    decisionTree: DecisionTree;
  };
  
  comparison: {
    scoreMatch: number; // 0-1
    decisionMatch: boolean;
    dimensionMatches: Record<string, number>;
    skillMatches: Record<string, number>;
  };
  
  result: {
    fidelityScore: number; // 0-1
    passesThreshold: boolean;
    threshold: number;
  };
}
```

### 4.3 Algorithme de Test

```typescript
async function runFidelityTest(candidateId: string, jobId: string): Promise<FidelityTest> {
  // Récupération du raisonnement interne
  const internalReasoning = await getInternalReasoning(candidateId, jobId);
  
  // Génération de la sortie externe
  const externalOutput = await generateDecisionTree(candidateId, jobId);
  
  // Comparaison des scores
  const scoreMatch = compareScores(
    internalReasoning.internalScores.globalScore,
    externalOutput.level1.globalScore
  );
  
  // Comparaison des décisions
  const decisionMatch = compareDecisions(
    internalReasoning.internalDecisions,
    externalOutput
  );
  
  // Comparaison des dimensions
  const dimensionMatches = compareDimensions(
    internalReasoning.internalScores.dimensions,
    externalOutput.level2
  );
  
  // Comparaison des compétences
  const skillMatches = compareSkills(
    internalReasoning.internalScores.skills,
    externalOutput.level3
  );
  
  // Calcul du score de fidélité
  const fidelityScore = (
    scoreMatch * 0.4 +
    (decisionMatch ? 1 : 0) * 0.3 +
    averageDimensionMatch(dimensionMatches) * 0.2 +
    averageSkillMatch(skillMatches) * 0.1
  );
  
  const threshold = 0.95;
  
  return {
    testId: generateUUID(),
    timestamp: new Date(),
    input: { candidateId, jobId },
    internalReasoning,
    externalOutput,
    comparison: {
      scoreMatch,
      decisionMatch,
      dimensionMatches,
      skillMatches
    },
    result: {
      fidelityScore,
      passesThreshold: fidelityScore >= threshold,
      threshold
    }
  };
}
```

### 4.4 Critères de Succès

| Métrique | Seuil | Cible |
|----------|-------|-------|
| Score de fidélité global | ≥ 0.95 | 0.95 |
| Correspondance des scores | ≥ 0.95 | 0.95 |
| Correspondance des décisions | 100% | 100% |
| Correspondance des dimensions | ≥ 0.90 | 0.90 |
| Correspondance des compétences | ≥ 0.85 | 0.85 |

---

## 5. Test de Complétude

### 5.1 Objectif

Vérifier que l'explication contient toutes les informations nécessaires pour comprendre la décision.

### 5.2 Méthodologie

```typescript
interface CompletenessTest {
  testId: string;
  timestamp: Date;
  
  decisionTree: DecisionTree;
  
  checklist: {
    hasLevel1: boolean;
    hasLevel2: boolean;
    hasLevel3: boolean;
    hasLevel4: boolean;
    hasLevel5: boolean;
    
    hasGlobalScore: boolean;
    hasRecommendation: boolean;
    hasConfidence: boolean;
    
    hasDimensionScores: boolean;
    hasSkillDetails: boolean;
    hasTransferReasoning: boolean;
    hasSources: boolean;
    hasRules: boolean;
    
    hasHypotheses: boolean;
    hasUnevaluatedItems: boolean;
  };
  
  result: {
    completenessScore: number; // 0-1
    passesThreshold: boolean;
    threshold: number;
    missingElements: string[];
  };
}
```

### 5.3 Algorithme de Test

```typescript
function runCompletenessTest(decisionTree: DecisionTree): CompletenessTest {
  const checklist = {
    hasLevel1: !!decisionTree.level1,
    hasLevel2: !!decisionTree.level2,
    hasLevel3: !!decisionTree.level3,
    hasLevel4: !!decisionTree.level4,
    hasLevel5: !!decisionTree.level5,
    
    hasGlobalScore: !!decisionTree.level1?.globalScore,
    hasRecommendation: !!decisionTree.level1?.recommendation,
    hasConfidence: !!decisionTree.level1?.confidence,
    
    hasDimensionScores: !!decisionTree.level2?.technicalSkills,
    hasSkillDetails: !!decisionTree.level3?.requiredSkills,
    hasTransferReasoning: !!decisionTree.level4?.transferPatterns,
    hasSources: !!decisionTree.level5?.appliedRules,
    hasRules: !!decisionTree.level5?.activeWeights,
    
    hasHypotheses: !!decisionTree.level5?.hypotheses,
    hasUnevaluatedItems: !!decisionTree.level5?.unevaluatedItems
  };
  
  const missingElements: string[] = [];
  
  for (const [key, value] of Object.entries(checklist)) {
    (!value) && missingElements.push(key);
  }
  
  const completenessScore = Object.values(checklist).filter(v => v).length / Object.keys(checklist).length;
  const threshold = 0.90;
  
  return {
    testId: generateUUID(),
    timestamp: new Date(),
    decisionTree,
    checklist,
    result: {
      completenessScore,
      passesThreshold: completenessScore >= threshold,
      threshold,
      missingElements
    }
  };
}
```

### 5.4 Critères de Succès

| Métrique | Seuil | Cible |
|----------|-------|-------|
| Score de complétude global | ≥ 0.90 | 0.90 |
| Niveaux 1-5 présents | 100% | 100% |
| Informations obligatoires | 100% | 100% |
| Éléments manquants | 0 | 0 |

---

## 6. Test de Cohérence

### 6.1 Objectif

Vérifier que l'explication est cohérente en interne (pas de contradictions).

### 6.2 Méthodologie

```typescript
interface CoherenceTest {
  testId: string;
  timestamp: Date;
  
  decisionTree: DecisionTree;
  
  checks: {
    scoreCoherence: boolean;
    dimensionCoherence: boolean;
    skillCoherence: boolean;
    transferCoherence: boolean;
    sourceCoherence: boolean;
  };
  
  contradictions: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  
  result: {
    coherenceScore: number; // 0-1
    passesThreshold: boolean;
    threshold: number;
  };
}
```

### 6.3 Algorithme de Test

```typescript
function runCoherenceTest(decisionTree: DecisionTree): CoherenceTest {
  const contradictions: CoherenceTest['contradictions'] = [];
  
  // Vérification 1 : Cohérence du score
  const scoreCoherence = checkScoreCoherence(decisionTree);
  if (!scoreCoherence) {
    contradictions.push({
      type: 'score',
      description: 'Le score global ne correspond pas à la somme pondérée des dimensions',
      severity: 'high'
    });
  }
  
  // Vérification 2 : Cohérence des dimensions
  const dimensionCoherence = checkDimensionCoherence(decisionTree);
  if (!dimensionCoherence) {
    contradictions.push({
      type: 'dimension',
      description: 'Les scores de dimension sont incohérents',
      severity: 'medium'
    });
  }
  
  // Vérification 3 : Cohérence des compétences
  const skillCoherence = checkSkillCoherence(decisionTree);
  if (!skillCoherence) {
    contradictions.push({
      type: 'skill',
      description: 'Les statuts de compétences sont incohérents',
      severity: 'medium'
    });
  }
  
  // Vérification 4 : Cohérence des transferts
  const transferCoherence = checkTransferCoherence(decisionTree);
  if (!transferCoherence) {
    contradictions.push({
      type: 'transfer',
      description: 'Les raisonnements de transfert sont incohérents',
      severity: 'high'
    });
  }
  
  // Vérification 5 : Cohérence des sources
  const sourceCoherence = checkSourceCoherence(decisionTree);
  if (!sourceCoherence) {
    contradictions.push({
      type: 'source',
      description: 'Les sources sont incohérentes',
      severity: 'low'
    });
  }
  
  const checks = {
    scoreCoherence,
    dimensionCoherence,
    skillCoherence,
    transferCoherence,
    sourceCoherence
  };
  
  const coherenceScore = Object.values(checks).filter(v => v).length / Object.keys(checks).length;
  const threshold = 1.0; // Aucune contradiction tolérée
  
  return {
    testId: generateUUID(),
    timestamp: new Date(),
    decisionTree,
    checks,
    contradictions,
    result: {
      coherenceScore,
      passesThreshold: coherenceScore >= threshold,
      threshold
    }
  };
}
```

### 6.4 Critères de Succès

| Métrique | Seuil | Cible |
|----------|-------|-------|
| Score de cohérence global | 1.0 | 1.0 |
| Contradictions | 0 | 0 |
| Contradictions haute sévérité | 0 | 0 |

---

## 7. Test de Reconstructibilité

### 7.1 Objectif

Vérifier que l'on peut reconstruire le raisonnement interne du moteur à partir de la sortie.

### 7.2 Méthodologie

```typescript
interface ReconstructibilityTest {
  testId: string;
  timestamp: Date;
  
  input: {
    candidateId: string;
    jobId: string;
  };
  
  originalReasoning: {
    engineOutput: EngineOutput;
  };
  
  reconstructedReasoning: {
    reconstructedOutput: EngineOutput;
  };
  
  comparison: {
    outputMatch: number; // 0-1
    scoreMatch: number; // 0-1
    decisionMatch: boolean;
  };
  
  result: {
    reconstructibilityScore: number; // 0-1
    passesThreshold: boolean;
    threshold: number;
  };
}
```

### 7.3 Algorithme de Test

```typescript
async function runReconstructibilityTest(candidateId: string, jobId: string): Promise<ReconstructibilityTest> {
  // Récupération du raisonnement original
  const originalReasoning = await getInternalReasoning(candidateId, jobId);
  
  // Génération de l'arbre de décision
  const decisionTree = await generateDecisionTree(candidateId, jobId);
  
  // Reconstruction du raisonnement à partir de l'arbre
  const reconstructedReasoning = await reconstructFromDecisionTree(decisionTree);
  
  // Comparaison
  const outputMatch = compareOutputs(
    originalReasoning.engineOutput,
    reconstructedReasoning.reconstructedOutput
  );
  
  const scoreMatch = compareScores(
    originalReasoning.engineOutput.globalScore,
    reconstructedReasoning.reconstructedOutput.globalScore
  );
  
  const decisionMatch = compareDecisions(
    originalReasoning.engineOutput.recommendation,
    reconstructedReasoning.reconstructedOutput.recommendation
  );
  
  // Calcul du score de reconstructibilité
  const reconstructibilityScore = (
    outputMatch * 0.5 +
    scoreMatch * 0.3 +
    (decisionMatch ? 1 : 0) * 0.2
  );
  
  const threshold = 0.85;
  
  return {
    testId: generateUUID(),
    timestamp: new Date(),
    input: { candidateId, jobId },
    originalReasoning,
    reconstructedReasoning,
    comparison: {
      outputMatch,
      scoreMatch,
      decisionMatch
    },
    result: {
      reconstructibilityScore,
      passesThreshold: reconstructibilityScore >= threshold,
      threshold
    }
  };
}
```

### 7.4 Reconstruction à partir de l'Arbre

```typescript
async function reconstructFromDecisionTree(tree: DecisionTree): Promise<EngineOutput> {
  // Reconstruction du score global
  const globalScore = tree.level1.globalScore;
  
  // Reconstruction des dimensions
  const dimensions = {
    technicalSkills: tree.level2.technicalSkills.score,
    experience: tree.level2.experience.score,
    education: tree.level2.education.score,
    softSkills: tree.level2.softSkills.score,
    contextualFit: tree.level2.contextualFit.score
  };
  
  // Reconstruction des compétences
  const skills = tree.level3.requiredSkills.map(skill => ({
    skill: skill.skill,
    status: skill.status,
    score: skill.score
  }));
  
  // Reconstruction des transferts
  const transfers = tree.level4.transferPatterns.map(pattern => ({
    missingSkill: pattern.missingSkill,
    compensators: pattern.compensators,
    estimatedTime: pattern.estimatedAcquisitionTime
  }));
  
  // Reconstruction de la recommandation
  const recommendation = tree.level1.recommendation;
  
  return {
    globalScore,
    dimensions,
    skills,
    transfers,
    recommendation,
    confidence: tree.level1.confidence
  };
}
```

### 7.5 Critères de Succès

| Métrique | Seuil | Cible |
|----------|-------|-------|
| Score de reconstructibilité global | ≥ 0.85 | 0.85 |
| Correspondance de la sortie | ≥ 0.85 | 0.85 |
| Correspondance du score | ≥ 0.90 | 0.90 |
| Correspondance de la décision | 100% | 100% |

---

## 8. Test d'Utilisabilité

### 8.1 Objectif

Vérifier que l'explication est compréhensible pour un humain.

### 8.2 Méthodologie

```typescript
interface UsabilityTest {
  testId: string;
  timestamp: Date;
  
  participants: {
    count: number;
    profiles: ('hr' | 'technical' | 'legal')[];
  };
  
  tasks: {
    task1: string;
    task2: string;
    task3: string;
  };
  
  results: {
    comprehensionRate: number; // 0-1
    timeToUnderstand: number; // en secondes
    clarityRating: number; // 1-5
    satisfactionRating: number; // 1-5
  };
  
  feedback: {
    positiveComments: string[];
    negativeComments: string[];
    suggestions: string[];
  };
  
  result: {
    usabilityScore: number; // 0-1
    passesThreshold: boolean;
    threshold: number;
  };
}
```

### 8.3 Protocole de Test

```typescript
async function runUsabilityTest(): Promise<UsabilityTest> {
  // Sélection des participants
  const participants = [
    ...await selectParticipants('hr', 5),
    ...await selectParticipants('technical', 3),
    ...await selectParticipants('legal', 2)
  ];
  
  // Tâches
  const tasks = {
    task1: 'Comprendre pourquoi le candidat est recommandé',
    task2: 'Identifier les points forts du candidat',
    task3: 'Identifier les points de vigilance'
  };
  
  // Exécution du test
  const results = await executeUsabilityTest(participants, tasks);
  
  // Calcul des métriques
  const comprehensionRate = results.filter(r => r.task1Success).length / results.length;
  const averageTimeToUnderstand = results.reduce((sum, r) => sum + r.timeToUnderstand, 0) / results.length;
  const averageClarityRating = results.reduce((sum, r) => sum + r.clarityRating, 0) / results.length;
  const averageSatisfactionRating = results.reduce((sum, r) => sum + r.satisfactionRating, 0) / results.length;
  
  // Collecte du feedback
  const feedback = await collectFeedback(participants);
  
  // Calcul du score d'utilisabilité
  const usabilityScore = (
    comprehensionRate * 0.4 +
    (averageClarityRating / 5) * 0.3 +
    (averageSatisfactionRating / 5) * 0.3
  );
  
  const threshold = 0.80;
  
  return {
    testId: generateUUID(),
    timestamp: new Date(),
    participants: {
      count: participants.length,
      profiles: participants.map(p => p.profile)
    },
    tasks,
    results: {
      comprehensionRate,
      timeToUnderstand: averageTimeToUnderstand,
      clarityRating: averageClarityRating,
      satisfactionRating: averageSatisfactionRating
    },
    feedback,
    result: {
      usabilityScore,
      passesThreshold: usabilityScore >= threshold,
      threshold
    }
  };
}
```

### 8.4 Critères de Succès

| Métrique | Seuil | Cible |
|----------|-------|-------|
| Score d'utilisabilité global | ≥ 0.80 | 0.80 |
| Taux de compréhension | ≥ 0.85 | 0.85 |
| Temps de compréhension | < 60 secondes | 30 secondes |
| Note de clarté | ≥ 4/5 | 4.5/5 |
| Note de satisfaction | ≥ 4/5 | 4/5 |

---

## 9. Test Intégré

### 9.1 Test Complet

Le test intégré exécute tous les tests sur un échantillon de cas :

```typescript
interface IntegratedTest {
  testId: string;
  timestamp: Date;
  
  sample: {
    candidateId: string;
    jobId: string;
  }[];
  
  results: {
    fidelity: FidelityTestResult[];
    completeness: CompletenessTestResult[];
    coherence: CoherenceTestResult[];
    reconstructibility: ReconstructibilityTestResult[];
    usability: UsabilityTestResult;
  };
  
  overallResult: {
    overallScore: number; // 0-1
    passesAllThresholds: boolean;
    failingTests: string[];
  };
}
```

### 9.2 Algorithme de Test Intégré

```typescript
async function runIntegratedTest(sampleSize: number = 50): Promise<IntegratedTest> {
  // Sélection de l'échantillon
  const sample = await selectTestSample(sampleSize);
  
  // Exécution des tests
  const fidelityResults = await Promise.all(
    sample.map(s => runFidelityTest(s.candidateId, s.jobId))
  );
  
  const completenessResults = await Promise.all(
    sample.map(s => runCompletenessTest(await getDecisionTree(s.candidateId, s.jobId)))
  );
  
  const coherenceResults = await Promise.all(
    sample.map(s => runCoherenceTest(await getDecisionTree(s.candidateId, s.jobId)))
  );
  
  const reconstructibilityResults = await Promise.all(
    sample.map(s => runReconstructibilityTest(s.candidateId, s.jobId))
  );
  
  const usabilityResult = await runUsabilityTest();
  
  // Calcul des scores moyens
  const averageFidelity = fidelityResults.reduce((sum, r) => sum + r.result.fidelityScore, 0) / fidelityResults.length;
  const averageCompleteness = completenessResults.reduce((sum, r) => sum + r.result.completenessScore, 0) / completenessResults.length;
  const averageCoherence = coherenceResults.reduce((sum, r) => sum + r.result.coherenceScore, 0) / coherenceResults.length;
  const averageReconstructibility = reconstructibilityResults.reduce((sum, r) => sum + r.result.reconstructibilityScore, 0) / reconstructibilityResults.length;
  const averageUsability = usabilityResult.result.usabilityScore;
  
  // Score global
  const overallScore = (
    averageFidelity * 0.3 +
    averageCompleteness * 0.2 +
    averageCoherence * 0.2 +
    averageReconstructibility * 0.2 +
    averageUsability * 0.1
  );
  
  // Identification des tests échoués
  const failingTests: string[] = [];
  if (averageFidelity < 0.95) failingTests.push('Fidélité');
  if (averageCompleteness < 0.90) failingTests.push('Complétude');
  if (averageCoherence < 1.0) failingTests.push('Cohérence');
  if (averageReconstructibility < 0.85) failingTests.push('Reconstructibilité');
  if (averageUsability < 0.80) failingTests.push('Utilisabilité');
  
  return {
    testId: generateUUID(),
    timestamp: new Date(),
    sample,
    results: {
      fidelity: fidelityResults,
      completeness: completenessResults,
      coherence: coherenceResults,
      reconstructibility: reconstructibilityResults,
      usability: usabilityResult
    },
    overallResult: {
      overallScore,
      passesAllThresholds: failingTests.length === 0,
      failingTests
    }
  };
}
```

---

## 10. Fréquence des Tests

### 10.1 Calendrier de Tests

| Type de Test | Fréquence | Déclenchement |
|--------------|-----------|---------------|
| Test de fidélité | Quotidien | Après chaque mise à jour |
| Test de complétude | Hebdomadaire | Révision de l'interface |
| Test de cohérence | Quotidien | Après chaque génération |
| Test de reconstructibilité | Hebdomadaire | Révision de l'algorithme |
| Test d'utilisabilité | Mensuel | Nouvelle version |
| Test intégré | Mensuel | Release candidate |

### 10.2 Test de Régression

Avant chaque mise en production, un test de régression est exécuté :

```typescript
async function runRegressionTest(): Promise<RegressionTestResult> {
  const previousTest = await getLatestIntegratedTest();
  const currentTest = await runIntegratedTest();
  
  const regression = {
    fidelityDelta: currentTest.results.fidelity - previousTest.results.fidelity,
    completenessDelta: currentTest.results.completeness - previousTest.results.completeness,
    coherenceDelta: currentTest.results.coherence - previousTest.results.coherence,
    reconstructibilityDelta: currentTest.results.reconstructibility - previousTest.results.reconstructibility,
    usabilityDelta: currentTest.results.usability - previousTest.results.usability
  };
  
  const hasRegression = Object.values(regression).some(delta => delta < -0.05);
  
  return {
    previousTest,
    currentTest,
    regression,
    hasRegression,
    canDeploy: !hasRegression
  };
}
```

---

## 11. Rapport de Test

### 11.1 Structure du Rapport

```typescript
interface TestReport {
  reportId: string;
  timestamp: Date;
  testType: 'fidelity' | 'completeness' | 'coherence' | 'reconstructibility' | 'usability' | 'integrated';
  
  summary: {
    overallScore: number;
    passesThreshold: boolean;
    failingTests: string[];
  };
  
  details: any;
  
  recommendations: string[];
  
  approval: {
    approved: boolean;
    approver: string;
    approvalDate: Date;
  };
}
```

### 11.2 Template de Rapport

```
┌─────────────────────────────────────────┐
│ RAPPORT DE TEST D'EXPLAINABILITY       │
├─────────────────────────────────────────┤
│                                         │
│ Rapport #12345                         │
│ Date : 03/08/2026                       │
│ Type : Test intégré                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RÉSUMÉ                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Score global : 0.92                     │
│ Seuil : 0.85                            │
│ Résultat : ✅ Approuvé                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RÉSULTATS PAR TEST                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Fidélité : 0.96 (seuil 0.95) ✅        │
│ Complétude : 0.92 (seuil 0.90) ✅      │
│ Cohérence : 1.00 (seuil 1.00) ✅        │
│ Reconstructibilité : 0.88 (seuil 0.85) ✅│
│ Utilisabilité : 0.85 (seuil 0.80) ✅    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RECOMMANDATIONS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ 1. Améliorer la clarté du niveau 4       │
│    (transfert) pour les utilisateurs non  │
│    techniques                           │
│                                         │
│ 2. Ajouter des exemples concrets dans    │
│    le niveau 3 (compétences)             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ APPROBATION                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Approuvé : ✅ Oui                        │
| Approbateur : Marie Dupont (Lead QA)    │
│ Date d'approbation : 03/08/2026          │
│                                         │
│ [Exporter le rapport en PDF]             │
└─────────────────────────────────────────┘
```

---

## 12. Stockage des Résultats

### 12.1 Structure de Base de Données

```sql
CREATE TABLE explainability_tests (
  id VARCHAR(36) PRIMARY KEY,
  test_id VARCHAR(36) UNIQUE NOT NULL,
  test_type VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  sample_size INT,
  
  results JSON NOT NULL,
  
  overall_score FLOAT NOT NULL,
  passes_threshold BOOLEAN NOT NULL,
  failing_tests JSON,
  
  recommendations JSON,
  
  approved BOOLEAN,
  approver VARCHAR(36),
  approval_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tests_type ON explainability_tests(test_type);
CREATE INDEX idx_tests_timestamp ON explainability_tests(timestamp);
CREATE INDEX idx_tests_score ON explainability_tests(overall_score);
```

---

## 13. Conclusion

Le protocole de test de l'explainability garantit :

- **Fidélité** de la sortie au raisonnement interne
- **Complétude** de l'explication
- **Cohérence** interne de l'explication
- **Reconstructibilité** du raisonnement
- **Utilisabilité** pour les humains
- **Régression** détectée avant déploiement
- **Qualité continue** de l'explainability
