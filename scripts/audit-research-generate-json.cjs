const fs = require('fs');

// Charger toutes les données
const results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results.json', 'utf8'));
const metrics = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase7-metrics.json', 'utf8'));
const invalidAnalysis = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase6-invalid-analysis.json', 'utf8'));

// mutation-results.json (brut)
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', JSON.stringify(results, null, 2));

// mutation-summary.json
const summary = {
  component: 'execution-pipeline',
  totalMutations: results.length,
  killed: metrics.killed,
  survived: metrics.survived,
  invalid: metrics.invalid,
  validTotal: metrics.validTotal,
  mutationScore: metrics.mutationScore,
  certification: metrics.certification
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary.json', JSON.stringify(summary, null, 2));

// mutation-survivors.json
const survivors = results.filter(r => r.status === 'SURVIVED');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-survivors.json', JSON.stringify(survivors, null, 2));

// mutation-invalid.json
const invalids = results.filter(r => r.status === 'INVALID');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-invalid.json', JSON.stringify(invalids, null, 2));

// mutation-equivalent.json (vide - aucune mutation équivalente détectée)
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-equivalent.json', JSON.stringify([], null, 2));

// mutation-killed.json
const killed = results.filter(r => r.status === 'KILLED');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-killed.json', JSON.stringify(killed, null, 2));

// mutation-by-category.json
const byCategory = {};
results.forEach(r => {
  if (!byCategory[r.family]) {
    byCategory[r.family] = { total: 0, killed: 0, survived: 0, invalid: 0 };
  }
  byCategory[r.family].total++;
  if (r.status === 'KILLED') byCategory[r.family].killed++;
  else if (r.status === 'SURVIVED') byCategory[r.family].survived++;
  else byCategory[r.family].invalid++;
});
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-category.json', JSON.stringify(byCategory, null, 2));

// mutation-by-function.json
const byFunction = {};
results.forEach(r => {
  if (!byFunction[r.function]) {
    byFunction[r.function] = { total: 0, killed: 0, survived: 0, invalid: 0 };
  }
  byFunction[r.function].total++;
  if (r.status === 'KILLED') byFunction[r.function].killed++;
  else if (r.status === 'SURVIVED') byFunction[r.function].survived++;
  else byFunction[r.function].invalid++;
});
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-function.json', JSON.stringify(byFunction, null, 2));

// mutation-confidence.json
const confidence = {
  mutationScore: metrics.mutationScore,
  mutationDensity: metrics.mutationDensity,
  mutationDiversity: metrics.mutationDiversity,
  mutationStability: metrics.mutationStability,
  mutationReliability: metrics.mutationReliability,
  mutationConfidence: metrics.mutationConfidence,
  mutationRobustness: metrics.mutationRobustness,
  mutationQualityIndex: metrics.mutationQualityIndex,
  sampleSize: metrics.validTotal,
  requiredSampleSize: 30,
  sampleAdequate: metrics.validTotal >= 30,
  invalidRate: metrics.invalid / metrics.total,
  maxInvalidRateForGold: 0.20,
  invalidRateAdequate: (metrics.invalid / metrics.total) <= 0.20
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-confidence.json', JSON.stringify(confidence, null, 2));

// mutation-certification.json
const certification = {
  component: 'execution-pipeline',
  certification: metrics.certification,
  mutationScore: metrics.mutationScore,
  validMutations: metrics.validTotal,
  requiredValidMutationsForGold: 30,
  invalidRate: (metrics.invalid / metrics.total * 100).toFixed(2) + '%',
  maxInvalidRateForGold: '20%',
  reasons: metrics.certificationReasons,
  criteriaMet: {
    score: metrics.mutationScore >= 95,
    sampleSize: metrics.validTotal >= 30,
    invalidRate: (metrics.invalid / metrics.total) <= 0.20,
    noCriticalSurvivors: survivors.filter(s => [57, 105, 116].includes(s.line)).length === 0,
    familyCoverage: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].every(f => 
      results.filter(r => r.status !== 'INVALID' && r.family === f).length > 0
    )
  }
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-certification.json', JSON.stringify(certification, null, 2));

// mutation-final-decision.json
const finalDecision = {
  component: 'execution-pipeline',
  auditType: 'INDEPENDENT_RESEARCH_LEVEL',
  date: '2026-07-27',
  sha: '3e22378',
  certification: metrics.certification,
  summary: {
    totalMutations: results.length,
    killed: metrics.killed,
    survived: metrics.survived,
    invalid: metrics.invalid,
    validTotal: metrics.validTotal,
    mutationScore: metrics.mutationScore
  },
  metrics: {
    mutationDensity: metrics.mutationDensity,
    mutationDiversity: metrics.mutationDiversity,
    mutationStability: metrics.mutationStability,
    mutationReliability: metrics.mutationReliability,
    mutationConfidence: metrics.mutationConfidence,
    mutationRobustness: metrics.mutationRobustness,
    mutationQualityIndex: metrics.mutationQualityIndex
  },
  certificationCriteria: {
    scoreMet: metrics.mutationScore >= 95,
    sampleSizeMet: metrics.validTotal >= 30,
    invalidRateMet: (metrics.invalid / metrics.total) <= 0.20,
    criticalSurvivorsMet: survivors.filter(s => [57, 105, 116].includes(s.line)).length === 0,
    familyCoverageMet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].every(f => 
      results.filter(r => r.status !== 'INVALID' && r.family === f).length > 0
    )
  },
  reasonsForCertification: metrics.certificationReasons,
  conclusion: `Certification ${metrics.certification} accordée. Les tests démontrent une excellente résistance aux mutations sur les mutations valides (${metrics.mutationScore}%), mais l'échantillon de mutations valides est insuffisant (${metrics.validTotal} < 30 requis) et le taux d'INVALID est élevé (${(metrics.invalid / metrics.total * 100).toFixed(1)}% > 20% requis).`
};
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-final-decision.json', JSON.stringify(finalDecision, null, 2));

console.log('Tous les livrables JSON générés.');
