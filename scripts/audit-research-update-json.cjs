const fs = require('fs');

// Charger les données
const reclassifiedResults = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results-reclassified.json', 'utf8'));
const weightedMetrics = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/weighted-metrics.json', 'utf8'));

// mutation-results.json (avec re-classification et poids)
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', JSON.stringify(reclassifiedResults, null, 2));

// mutation-summary.json (mis à jour)
const summary = {
  component: 'execution-pipeline',
  totalMutations: weightedMetrics.totalMutations,
  killed: weightedMetrics.killed,
  survived: weightedMetrics.survived,
  invalid: weightedMetrics.invalid,
  validMutations: weightedMetrics.validMutations,
  
  // Détail INVALID
  realInvalid: weightedMetrics.realInvalid,
  expectedInvalid: weightedMetrics.expectedInvalid,
  testIssue: weightedMetrics.testIssue,
  realInvalidRate: weightedMetrics.realInvalidRate + '%',
  
  // Scores
  weightedMutationScore: weightedMetrics.weightedMutationScore + '%',
  adjustedWeightedScore: weightedMetrics.adjustedWeightedScore + '%',
  
  // Confiance
  confidenceIndex: weightedMetrics.confidenceIndex + '%',
  
  certification: weightedMetrics.certification
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary.json', JSON.stringify(summary, null, 2));

// mutation-survivors.json
const survivors = reclassifiedResults.filter(r => r.status === 'SURVIVED');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-survivors.json', JSON.stringify(survivors, null, 2));

// mutation-invalid.json (avec catégories)
const invalids = reclassifiedResults.filter(r => r.status === 'INVALID');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-invalid.json', JSON.stringify(invalids, null, 2));

// mutation-invalid-detailed.json (nouveau)
const invalidByCategory = {
  REAL_INVALID: invalids.filter(r => r.invalidCategory === 'REAL_INVALID'),
  EXPECTED_INVALID: invalids.filter(r => r.invalidCategory === 'EXPECTED_INVALID'),
  TEST_ISSUE: invalids.filter(r => r.invalidCategory === 'TEST_ISSUE')
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-invalid-detailed.json', JSON.stringify(invalidByCategory, null, 2));

// mutation-equivalent.json (vide)
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-equivalent.json', JSON.stringify([], null, 2));

// mutation-killed.json
const killed = reclassifiedResults.filter(r => r.status === 'KILLED');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-killed.json', JSON.stringify(killed, null, 2));

// mutation-by-category.json (avec poids)
const byCategory = {};
reclassifiedResults.forEach(r => {
  if (!byCategory[r.family]) {
    byCategory[r.family] = { total: 0, killed: 0, survived: 0, invalid: 0, totalWeight: 0, killedWeight: 0 };
  }
  byCategory[r.family].total++;
  byCategory[r.family].totalWeight += r.weight;
  if (r.status === 'KILLED') {
    byCategory[r.family].killed++;
    byCategory[r.family].killedWeight += r.weight;
  } else if (r.status === 'SURVIVED') {
    byCategory[r.family].survived++;
  } else {
    byCategory[r.family].invalid++;
  }
});
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-category.json', JSON.stringify(byCategory, null, 2));

// mutation-by-function.json (avec poids)
const byFunction = {};
reclassifiedResults.forEach(r => {
  if (!byFunction[r.function]) {
    byFunction[r.function] = { total: 0, killed: 0, survived: 0, invalid: 0, totalWeight: 0, killedWeight: 0 };
  }
  byFunction[r.function].total++;
  byFunction[r.function].totalWeight += r.weight;
  if (r.status === 'KILLED') {
    byFunction[r.function].killed++;
    byFunction[r.function].killedWeight += r.weight;
  } else if (r.status === 'SURVIVED') {
    byFunction[r.function].survived++;
  } else {
    byFunction[r.function].invalid++;
  }
});
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-function.json', JSON.stringify(byFunction, null, 2));

// mutation-by-criticality.json (nouveau)
const byCriticality = {};
reclassifiedResults.forEach(r => {
  if (!byCriticality[r.level]) {
    byCriticality[r.level] = { total: 0, killed: 0, survived: 0, invalid: 0 };
  }
  byCriticality[r.level].total++;
  if (r.status === 'KILLED') byCriticality[r.level].killed++;
  else if (r.status === 'SURVIVED') byCriticality[r.level].survived++;
  else byCriticality[r.level].invalid++;
});
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-criticality.json', JSON.stringify(byCriticality, null, 2));

// mutation-confidence.json (mis à jour)
const confidence = {
  confidenceIndex: weightedMetrics.confidenceIndex + '%',
  sampleConfidence: weightedMetrics.sampleConfidence + '%',
  familyDiversity: weightedMetrics.familyDiversity + '%',
  criticalityDiversity: weightedMetrics.criticalityDiversity + '%',
  sampleSize: weightedMetrics.validMutations,
  requiredSampleSize: 30,
  sampleAdequate: weightedMetrics.validMutations >= 30,
  realInvalidRate: weightedMetrics.realInvalidRate + '%',
  maxRealInvalidRateForGold: '20%',
  realInvalidRateAdequate: weightedMetrics.realInvalidRate <= 20
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-confidence.json', JSON.stringify(confidence, null, 2));

// mutation-certification.json (mis à jour)
const certification = {
  component: 'execution-pipeline',
  certification: weightedMetrics.certification,
  weightedMutationScore: weightedMetrics.adjustedWeightedScore + '%',
  validMutations: weightedMetrics.validMutations,
  requiredValidMutationsForGold: 30,
  realInvalidRate: weightedMetrics.realInvalidRate + '%',
  maxRealInvalidRateForGold: '20%',
  expectedInvalid: weightedMetrics.expectedInvalid,
  testIssue: weightedMetrics.testIssue,
  reasons: weightedMetrics.certificationReasons,
  criteriaMet: {
    score: weightedMetrics.adjustedWeightedScore >= 95,
    sampleSize: weightedMetrics.validMutations >= 30,
    realInvalidRate: weightedMetrics.realInvalidRate <= 20,
    noCriticalSurvivors: survivors.filter(s => s.level === 'CRITICAL').length === 0,
    familyCoverage: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].every(f => 
      reclassifiedResults.filter(r => r.status !== 'INVALID' && r.family === f).length > 0
    ),
    criticalityCoverage: ['CRITICAL', 'MAJOR', 'MINOR', 'COSMETIC'].every(l => 
      reclassifiedResults.filter(r => r.status !== 'INVALID' && r.level === l).length > 0
    )
  }
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-certification.json', JSON.stringify(certification, null, 2));

// mutation-final-decision.json (mis à jour)
const finalDecision = {
  component: 'execution-pipeline',
  auditType: 'INDEPENDENT_RESEARCH_LEVEL_V2',
  date: '2026-07-27',
  sha: '3e22378',
  certification: weightedMetrics.certification,
  summary: {
    totalMutations: weightedMetrics.totalMutations,
    killed: weightedMetrics.killed,
    survived: weightedMetrics.survived,
    invalid: weightedMetrics.invalid,
    validMutations: weightedMetrics.validMutations,
    realInvalid: weightedMetrics.realInvalid,
    expectedInvalid: weightedMetrics.expectedInvalid,
    testIssue: weightedMetrics.testIssue,
    realInvalidRate: weightedMetrics.realInvalidRate + '%'
  },
  scores: {
    weightedMutationScore: weightedMetrics.adjustedWeightedScore + '%',
    confidenceIndex: weightedMetrics.confidenceIndex + '%'
  },
  certificationCriteria: {
    scoreMet: weightedMetrics.adjustedWeightedScore >= 95,
    sampleSizeMet: weightedMetrics.validMutations >= 30,
    realInvalidRateMet: weightedMetrics.realInvalidRate <= 20,
    noCriticalSurvivorsMet: survivors.filter(s => s.level === 'CRITICAL').length === 0,
    familyCoverageMet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].every(f => 
      reclassifiedResults.filter(r => r.status !== 'INVALID' && r.family === f).length > 0
    ),
    criticalityCoverageMet: ['CRITICAL', 'MAJOR', 'MINOR', 'COSMETIC'].every(l => 
      reclassifiedResults.filter(r => r.status !== 'INVALID' && r.level === l).length > 0
    )
  },
  reasonsForCertification: weightedMetrics.certificationReasons,
  conclusion: `Certification ${weightedMetrics.certification} accordée. Score pondéré de ${weightedMetrics.adjustedWeightedScore}% sur les mutations valides, mais l'échantillon insuffisant (${weightedMetrics.validMutations} < 30 requis), le taux d'INVALID réels élevé (${weightedMetrics.realInvalidRate}% > 20% requis), et la couverture incomplète des familles et niveaux de criticité empêchent la certification GOLD.`
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-final-decision.json', JSON.stringify(finalDecision, null, 2));

console.log('Tous les livrables JSON mis à jour avec la nouvelle analyse fine.');
