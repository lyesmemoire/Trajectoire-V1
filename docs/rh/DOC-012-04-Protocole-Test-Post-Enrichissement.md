# DOC-012-04 : Protocole de Test Post-Enrichissement

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test post-enrichissement pour le Knowledge Pack RH (MVP-012). Ce protocole couvre la Semaine 3 du cycle mensuel : revue par DRH référent et test sur le golden dataset pour vérifier que l'enrichissement n'a pas dégradé le matching.

---

## 2. Principe Fondateur

L'enrichissement du Knowledge Pack ne doit jamais dégrader la qualité du matching. Chaque enrichissement doit être testé sur un golden dataset pour garantir que les performances sont maintenues ou améliorées.

---

## 3. Calendrier Mensuel

### 3.1 Semaine 3 : Validation

| Jour | Activité | Responsable |
|-----|----------|-------------|
| Lundi | Réception du rapport de qualification | DRH référent |
| Mardi | Revue des données qualifiées | DRH référent |
| Mercredi | Test sur golden dataset | Équipe technique + DRH référent |
| Jeudi | Analyse des résultats | DRH référent |
| Vendredi | Validation formelle | DRH référent |

---

## 4. Golden Dataset

### 4.1 Composition du Golden Dataset

| Type | Quantité | Description |
|------|----------|-------------|
| CV | 100 | CV réels anonymisés |
| Offres d'emploi | 50 | Offres réelles anonymisées |
| Paires CV/Offre | 50 | Paires avec décision connue |
| Cas limites | 20 | Cas complexes et rares |

### 4.2 Structure du Golden Dataset

```typescript
interface GoldenDataset {
  cvs: {
    id: string;
    anonymized: boolean;
    content: string;
    extractedSkills: string[];
    extractedJobs: string[];
    extractedCertifications: string[];
  }[];
  
  jobPostings: {
    id: string;
    anonymized: boolean;
    content: string;
    requiredSkills: string[];
    requiredJobs: string[];
    requiredCertifications: string[];
  }[];
  
  pairs: {
    cvId: string;
    jobPostingId: string;
    expectedDecision: 'accept' | 'reject' | 'doubt';
    expectedScore: number;
    justification: string;
  }[];
  
  edgeCases: {
    id: string;
    description: string;
    type: 'synonym' | 'ambiguity' | 'rare' | 'complex';
    content: string;
    expectedBehavior: string;
  }[];
}
```

### 4.3 Maintenance du Golden Dataset

**Fréquence :** Trimestrielle

**Processus :**
1. Ajout de nouveaux CV et offres
2. Mise à jour des paires avec décisions connues
3. Ajout de nouveaux cas limites
4. Validation par DRH référent

---

## 5. Processus de Test

### 5.1 Flux de Test

```
Données qualifiées
    ↓
Injection dans Knowledge Pack de test
    ↓
Exécution du matching sur golden dataset
    ↓
Comparaison des résultats avec baseline
    ↓
Analyse des écarts
    ↓
Validation des améliorations
    ↓
Identification des dégradations
    ↓
Rapport de test
```

### 5.2 Algorithme de Test

```typescript
async function testEnrichment(qualifiedData: any[], goldenDataset: GoldenDataset): Promise<TestResult> {
  // Étape 1 : Injection dans Knowledge Pack de test
  const testKP = await injectIntoTestKP(qualifiedData);
  
  // Étape 2 : Exécution du matching sur golden dataset
  const testResults = await runMatchingOnGoldenDataset(testKP, goldenDataset);
  
  // Étape 3 : Comparaison avec baseline
  const baselineResults = await getBaselineResults(goldenDataset);
  const comparison = compareResults(testResults, baselineResults);
  
  // Étape 4 : Analyse des écarts
  const analysis = analyzeDifferences(comparison);
  
  // Étape 5 : Validation des améliorations
  const improvements = validateImprovements(analysis);
  
  // Étape 6 : Identification des dégradations
  const degradations = identifyDegradations(analysis);
  
  // Étape 7 : Rapport de test
  const report = generateTestReport({
    testResults,
    baselineResults,
    comparison,
    analysis,
    improvements,
    degradations
  });
  
  return {
    passed: degradations.length === 0,
    improvementsCount: improvements.length,
    degradationsCount: degradations.length,
    report
  };
}
```

---

## 6. Exécution du Matching sur Golden Dataset

### 6.1 Processus de Matching

```typescript
async function runMatchingOnGoldenDataset(testKP: KnowledgePack, goldenDataset: GoldenDataset): Promise<MatchingResults> {
  const results: MatchingResults = {
    cvs: [],
    jobPostings: [],
    pairs: [],
    edgeCases: []
  };
  
  // Matching des CV
  for (const cv of goldenDataset.cvs) {
    const extractedData = await extractFromCV(cv.content);
    const matchedSkills = await matchSkills(extractedData.skills, testKP);
    const matchedJobs = await matchJobs(extractedData.jobs, testKP);
    const matchedCertifications = await matchCertifications(extractedData.certifications, testKP);
    
    results.cvs.push({
      cvId: cv.id,
      matchedSkills,
      matchedJobs,
      matchedCertifications,
      unmatchedSkills: extractedData.skills.filter(s => !matchedSkills.includes(s)),
      unmatchedJobs: extractedData.jobs.filter(j => !matchedJobs.includes(j)),
      unmatchedCertifications: extractedData.certifications.filter(c => !matchedCertifications.includes(c))
    });
  }
  
  // Matching des offres
  for (const job of goldenDataset.jobPostings) {
    const extractedData = await extractFromJobPosting(job.content);
    const matchedSkills = await matchSkills(extractedData.skills, testKP);
    const matchedJobs = await matchJobs(extractedData.jobs, testKP);
    const matchedCertifications = await matchCertifications(extractedData.certifications, testKP);
    
    results.jobPostings.push({
      jobPostingId: job.id,
      matchedSkills,
      matchedJobs,
      matchedCertifications,
      unmatchedSkills: extractedData.skills.filter(s => !matchedSkills.includes(s)),
      unmatchedJobs: extractedData.jobs.filter(j => !matchedJobs.includes(j)),
      unmatchedCertifications: extractedData.certifications.filter(c => !matchedCertifications.includes(c))
    });
  }
  
  // Matching des paires CV/Offre
  for (const pair of goldenDataset.pairs) {
    const matchingResult = await matchCVWithJob(pair.cvId, pair.jobPostingId, testKP);
    
    results.pairs.push({
      pairId: `${pair.cvId}-${pair.jobPostingId}`,
      expectedDecision: pair.expectedDecision,
      expectedScore: pair.expectedScore,
      actualDecision: matchingResult.decision,
      actualScore: matchingResult.score,
      decisionMatch: matchingResult.decision === pair.expectedDecision,
      scoreDelta: matchingResult.score - pair.expectedScore
    });
  }
  
  // Test des cas limites
  for (const edgeCase of goldenDataset.edgeCases) {
    const result = await testEdgeCase(edgeCase, testKP);
    
    results.edgeCases.push({
      edgeCaseId: edgeCase.id,
      expectedBehavior: edgeCase.expectedBehavior,
      actualBehavior: result.behavior,
      behaviorMatch: result.behavior === edgeCase.expectedBehavior
    });
  }
  
  return results;
}
```

---

## 7. Comparaison avec Baseline

### 7.1 Métriques de Comparaison

| Métrique | Description | Formule |
|----------|-------------|---------|
| Taux de reconnaissance CV | % de compétences reconnues dans les CV | Compétences reconnues / Total compétences |
| Taux de reconnaissance Offre | % de compétences reconnues dans les offres | Compétences reconnues / Total compétences |
| Taux de décision correcte | % de décisions correctes sur les paires | Décisions correctes / Total décisions |
| Écart moyen de score | Écart moyen entre score actuel et baseline | Moyenne(|Score actuel - Score baseline|) |
| Taux de cas limites passés | % de cas limites passés | Cas passés / Total cas limites |

### 7.2 Algorithme de Comparaison

```typescript
function compareResults(testResults: MatchingResults, baselineResults: MatchingResults): ComparisonResult {
  // Comparaison des CV
  const cvComparison = compareCVResults(testResults.cvs, baselineResults.cvs);
  
  // Comparaison des offres
  const jobComparison = compareJobResults(testResults.jobPostings, baselineResults.jobPostings);
  
  // Comparaison des paires
  const pairComparison = comparePairResults(testResults.pairs, baselineResults.pairs);
  
  // Comparaison des cas limites
  const edgeCaseComparison = compareEdgeCaseResults(testResults.edgeCases, baselineResults.edgeCases);
  
  return {
    cvComparison,
    jobComparison,
    pairComparison,
    edgeCaseComparison,
    overall: {
      cvRecognitionRate: cvComparison.recognitionRate,
      jobRecognitionRate: jobComparison.recognitionRate,
      decisionAccuracyRate: pairComparison.decisionAccuracyRate,
      scoreDelta: pairComparison.scoreDelta,
      edgeCasePassRate: edgeCaseComparison.passRate
    }
  };
}

function compareCVResults(testCVs: CVResult[], baselineCVs: CVResult[]): CVComparison {
  let totalSkills = 0;
  let matchedSkillsTest = 0;
  let matchedSkillsBaseline = 0;
  
  for (const testCV of testCVs) {
    const baselineCV = baselineCVs.find(cv => cv.cvId === testCV.cvId);
    if (!baselineCV) continue;
    
    totalSkills += testCV.matchedSkills.length + testCV.unmatchedSkills.length;
    matchedSkillsTest += testCV.matchedSkills.length;
    matchedSkillsBaseline += baselineCV.matchedSkills.length;
  }
  
  const recognitionRateTest = totalSkills > 0 ? matchedSkillsTest / totalSkills : 0;
  const recognitionRateBaseline = totalSkills > 0 ? matchedSkillsBaseline / totalSkills : 0;
  const recognitionRateDelta = recognitionRateTest - recognitionRateBaseline;
  
  return {
    recognitionRateTest,
    recognitionRateBaseline,
    recognitionRateDelta,
    improvement: recognitionRateDelta > 0,
    degradation: recognitionRateDelta < 0
  };
}
```

---

## 8. Analyse des Écarts

### 8.1 Types d'Écarts

| Type | Description | Action |
|------|-------------|--------|
| Amélioration | Le résultat est meilleur que la baseline | Valider |
| Dégradation | Le résultat est pire que la baseline | Investiger |
| Stable | Le résultat est identique à la baseline | Valider |
| Inattendu | Le résultat est inattendu (positif ou négatif) | Investiger |

### 8.2 Algorithme d'Analyse

```typescript
function analyzeDifferences(comparison: ComparisonResult): AnalysisResult {
  const improvements: Improvement[] = [];
  const degradations: Degradation[] = [];
  const stable: Stable[] = [];
  const unexpected: Unexpected[] = [];
  
  // Analyse des CV
  if (comparison.cvComparison.improvement) {
    improvements.push({
      type: 'cv_recognition',
      metric: 'recognition_rate',
      delta: comparison.cvComparison.recognitionRateDelta,
      impact: 'positive'
    });
  } else if (comparison.cvComparison.degradation) {
    degradations.push({
      type: 'cv_recognition',
      metric: 'recognition_rate',
      delta: comparison.cvComparison.recognitionRateDelta,
      impact: 'negative'
    });
  } else {
    stable.push({
      type: 'cv_recognition',
      metric: 'recognition_rate'
    });
  }
  
  // Analyse des offres
  if (comparison.jobComparison.improvement) {
    improvements.push({
      type: 'job_recognition',
      metric: 'recognition_rate',
      delta: comparison.jobComparison.recognitionRateDelta,
      impact: 'positive'
    });
  } else if (comparison.jobComparison.degradation) {
    degradations.push({
      type: 'job_recognition',
      metric: 'recognition_rate',
      delta: comparison.jobComparison.recognitionRateDelta,
      impact: 'negative'
    });
  } else {
    stable.push({
      type: 'job_recognition',
      metric: 'recognition_rate'
    });
  }
  
  // Analyse des paires
  if (comparison.pairComparison.decisionAccuracyDelta > 0.05) {
    improvements.push({
      type: 'decision_accuracy',
      metric: 'decision_accuracy_rate',
      delta: comparison.pairComparison.decisionAccuracyDelta,
      impact: 'positive'
    });
  } else if (comparison.pairComparison.decisionAccuracyDelta < -0.05) {
    degradations.push({
      type: 'decision_accuracy',
      metric: 'decision_accuracy_rate',
      delta: comparison.pairComparison.decisionAccuracyDelta,
      impact: 'negative'
    });
  } else {
    stable.push({
      type: 'decision_accuracy',
      metric: 'decision_accuracy_rate'
    });
  }
  
  // Analyse des cas limites
  if (comparison.edgeCaseComparison.passRateDelta > 0.05) {
    improvements.push({
      type: 'edge_case',
      metric: 'pass_rate',
      delta: comparison.edgeCaseComparison.passRateDelta,
      impact: 'positive'
    });
  } else if (comparison.edgeCaseComparison.passRateDelta < -0.05) {
    degradations.push({
      type: 'edge_case',
      metric: 'pass_rate',
      delta: comparison.edgeCaseComparison.passRateDelta,
      impact: 'negative'
    });
  } else {
    stable.push({
      type: 'edge_case',
      metric: 'pass_rate'
    });
  }
  
  return {
    improvements,
    degradations,
    stable,
    unexpected,
    overall: {
      hasImprovements: improvements.length > 0,
      hasDegradations: degradations.length > 0,
      netImpact: improvements.length - degradations.length
    }
  };
}
```

---

## 9. Validation des Améliorations

### 9.1 Critères de Validation

| Critère | Description | Condition |
|---------|-------------|-----------|
| Significativité | L'amélioration est-elle significative ? | Delta > 5% |
| Cohérence | L'amélioration est-elle cohérente avec l'enrichissement ? | Oui |
| Pas d'effet secondaire | L'amélioration n'a-t-elle pas d'effet secondaire négatif ? | Oui |

### 9.2 Algorithme de Validation

```typescript
function validateImprovements(analysis: AnalysisResult): Improvement[] {
  const validatedImprovements: Improvement[] = [];
  
  for (const improvement of analysis.improvements) {
    // Vérifier la significativité
    if (Math.abs(improvement.delta) < 0.05) {
      continue;
    }
    
    // Vérifier la cohérence
    if (!isCoherentWithEnrichment(improvement)) {
      continue;
    }
    
    // Vérifier l'absence d'effet secondaire
    if (hasSideEffect(improvement, analysis.degradations)) {
      continue;
    }
    
    validatedImprovements.push(improvement);
  }
  
  return validatedImprovements;
}
```

---

## 10. Identification des Dégradations

### 10.1 Critères d'Identification

| Critère | Description | Condition |
|---------|-------------|-----------|
| Significativité | La dégradation est-elle significative ? | Delta < -5% |
| Impact | La dégradation a-t-elle un impact critique ? | Oui |
| Réversibilité | La dégradation est-elle réversible ? | Oui |

### 10.2 Algorithme d'Identification

```typescript
function identifyDegradations(analysis: AnalysisResult): Degradation[] {
  const criticalDegradations: Degradation[] = [];
  
  for (const degradation of analysis.degradations) {
    // Vérifier la significativité
    if (Math.abs(degradation.delta) < 0.05) {
      continue;
    }
    
    // Vérifier l'impact critique
    if (isCriticalImpact(degradation)) {
      criticalDegradations.push({
        ...degradation,
        severity: 'critical',
        reversible: true,
        recommendedAction: 'rollback'
      });
    } else {
      criticalDegradations.push({
        ...degradation,
        severity: 'moderate',
        reversible: true,
        recommendedAction: 'investigate'
      });
    }
  }
  
  return criticalDegradations;
}
```

---

## 11. Rapport de Test

### 11.1 Structure du Rapport

```typescript
interface TestReport {
  reportId: string;
  testDate: Date;
  enrichmentId: string;
  
  summary: {
    passed: boolean;
    improvementsCount: number;
    degradationsCount: number;
    stableCount: number;
    overallImpact: 'positive' | 'neutral' | 'negative';
  };
  
  results: {
    cvRecognitionRate: {
      test: number;
      baseline: number;
      delta: number;
    };
    jobRecognitionRate: {
      test: number;
      baseline: number;
      delta: number;
    };
    decisionAccuracyRate: {
      test: number;
      baseline: number;
      delta: number;
    };
    edgeCasePassRate: {
      test: number;
      baseline: number;
      delta: number;
    };
  };
  
  improvements: Improvement[];
  degradations: Degradation[];
  stable: Stable[];
  
  recommendation: 'deploy' | 'investigate' | 'rollback';
  
  validatedBy: string;
  validationDate: Date;
}
```

### 11.2 Template de Rapport

```
┌─────────────────────────────────────────┐
│ RAPPORT DE TEST POST-ENRICHISSEMENT    │
├─────────────────────────────────────────┤
│                                         │
| Rapport ID : [REPORT-ID]               │
| Date du test : [DD/MM/YYYY]            │
| Enrichissement ID : [ENRICHMENT-ID]     │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RÉSUMÉ                                │
├─────────────────────────────────────────┤
│                                         │
| Test passé : [Oui / Non]                │
│ Améliorations : [XXX]                  │
│ Dégradations : [XXX]                   │
| Stable : [XXX]                         │
| Impact global : [Positif / Neutre / Négatif]│
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RÉSULTATS                              │
├─────────────────────────────────────────┤
│                                         │
| Taux de reconnaissance CV :             │
| • Test : [XX%]                         │
| • Baseline : [XX%]                     │
| • Delta : [+/- XX%]                    │
│                                         │
| Taux de reconnaissance Offre :          │
| • Test : [XX%]                         │
| • Baseline : [XX%]                     │
| • Delta : [+/- XX%]                    │
│                                         │
| Taux de décision correcte :            │
| • Test : [XX%]                         │
| • Baseline : [XX%]                     │
| • Delta : [+/- XX%]                    │
│                                         │
| Taux de cas limites passés :           │
| • Test : [XX%]                         │
| • Baseline : [XX%]                     │
| • Delta : [+/- XX%]                    │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ AMÉLIORATIONS                          │
├─────────────────────────────────────────┤
│                                         │
| 1. [Type] - [Métrique]                 │
|    Delta : [+XX%]                      │
|    Impact : Positif                    │
│    Justification : [____]               │
│                                         │
| 2. [Type] - [Métrique]                 │
|    Delta : [+XX%]                      │
|    Impact : Positif                    │
|    Justification : [____]               │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ DÉGRADATIONS                           │
├─────────────────────────────────────────┤
│                                         │
| 1. [Type] - [Métrique]                 │
|    Delta : [-XX%]                      │
|    Impact : Négatif                    │
|    Sévérité : [Critique / Modérée]     │
|    Action recommandée : [____]         │
│                                         │
| 2. [Type] - [Métrique]                 │
|    Delta : [-XX%]                      │
|    Impact : Négatif                    │
|    Sévérité : [Critique / Modérée]     │
|    Action recommandée : [____]         │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RECOMMANDATION                         │
├─────────────────────────────────────────┤
│                                         │
| ○ Déployer                            │
| ○ Investiger                          │
| ○ Rollback                            │
│                                         │
| Justification : [____]                 │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ VALIDATION                             │
├─────────────────────────────────────────┤
│                                         │
| Validé par : [Nom du DRH]             │
| Date : [DD/MM/YYYY]                    │
| Signature : [________________]           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 12. Recommandations

### 12.1 Critères de Recommandation

| Résultat du test | Recommandation | Condition |
|------------------|----------------|-----------|
| Pas de dégradation, améliorations significatives | Déployer | Dégradations = 0, Améliorations > 0 |
| Pas de dégradation, pas d'amélioration | Déployer | Dégradations = 0, Améliorations = 0 |
| Dégradations non critiques | Investiger | Dégradations < 3, Sévérité = modérée |
| Dégradations critiques | Rollback | Dégradations ≥ 1, Sévérité = critique |

### 12.2 Processus de Décision

```typescript
function makeRecommendation(testReport: TestReport): 'deploy' | 'investigate' | 'rollback' {
  if (testReport.degradations.length === 0) {
    return 'deploy';
  }
  
  const criticalDegradations = testReport.degradations.filter(d => d.severity === 'critical');
  
  if (criticalDegradations.length > 0) {
    return 'rollback';
  }
  
  if (testReport.degradations.length < 3) {
    return 'investigate';
  }
  
  return 'rollback';
}
```

---

## 13. Documentation du Test

### 13.1 Journalisation

```sql
CREATE TABLE enrichment_test_log (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) UNIQUE NOT NULL,
  test_date TIMESTAMP NOT NULL,
  enrichment_id VARCHAR(36) NOT NULL,
  
  passed BOOLEAN NOT NULL,
  improvements_count INT NOT NULL,
  degradations_count INT NOT NULL,
  stable_count INT NOT NULL,
  
  cv_recognition_rate_test DECIMAL(5,2) NOT NULL,
  cv_recognition_rate_baseline DECIMAL(5,2) NOT NULL,
  cv_recognition_rate_delta DECIMAL(5,2) NOT NULL,
  
  job_recognition_rate_test DECIMAL(5,2) NOT NULL,
  job_recognition_rate_baseline DECIMAL(5,2) NOT NULL,
  job_recognition_rate_delta DECIMAL(5,2) NOT NULL,
  
  decision_accuracy_rate_test DECIMAL(5,2) NOT NULL,
  decision_accuracy_rate_baseline DECIMAL(5,2) NOT NULL,
  decision_accuracy_rate_delta DECIMAL(5,2) NOT NULL,
  
  edge_case_pass_rate_test DECIMAL(5,2) NOT NULL,
  edge_case_pass_rate_baseline DECIMAL(5,2) NOT NULL,
  edge_case_pass_rate_delta DECIMAL(5,2) NOT NULL,
  
  recommendation VARCHAR(20) NOT NULL,
  
  validated_by VARCHAR(36),
  validation_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_enrich ON enrichment_test_log(enrichment_id);
CREATE INDEX idx_test_date ON enrichment_test_log(test_date);
```

---

## 14. Indicateurs de Suivi

### 14.1 Métriques de Test

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de test passé | Tests passés / total | ≥ 95% |
| Taux d'amélioration | Enrichissements avec améliorations / total | ≥ 60% |
| Taux de dégradation critique | Enrichissements avec dégradation critique / total | 0% |
| Temps moyen de test | Temps moyen de test | < 1 jour |

### 14.2 Métriques de Performance

| Métrique | Baseline | Cible |
|----------|----------|-------|
| Taux de reconnaissance CV | 75% | ≥ 80% |
| Taux de reconnaissance Offre | 70% | ≥ 75% |
| Taux de décision correcte | 85% | ≥ 90% |
| Taux de cas limites passés | 60% | ≥ 70% |

---

## 15. Conclusion

Le protocole de test post-enrichissement garantit que chaque enrichissement du Knowledge Pack ne dégrade pas la qualité du matching. Le test sur le golden dataset valide les améliorations et identifie les dégradations avant déploiement.

**Points clés :**
- Golden dataset de 170 éléments (100 CV, 50 offres, 50 paires, 20 cas limites)
- Test automatique sur le golden dataset
- Comparaison avec baseline
- Analyse des écarts (améliorations, dégradations)
- Validation des améliorations
- Identification des dégradations
- Recommandation basée sur les résultats
