const fs = require('fs');

// Charger les résultats re-classés
const reclassifiedResults = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results-reclassified.json', 'utf8'));

// Calculer le score pondéré par criticité métier
const killed = reclassifiedResults.filter(r => r.status === 'KILLED');
const survived = reclassifiedResults.filter(r => r.status === 'SURVIVED');
const invalid = reclassifiedResults.filter(r => r.status === 'INVALID');

// Séparer les INVALID par catégorie
const realInvalid = invalid.filter(r => r.invalidCategory === 'REAL_INVALID');
const expectedInvalid = invalid.filter(r => r.invalidCategory === 'EXPECTED_INVALID');
const testIssue = invalid.filter(r => r.invalidCategory === 'TEST_ISSUE');

// Score pondéré
const totalWeight = reclassifiedResults.reduce((sum, r) => sum + r.weight, 0);
const killedWeight = killed.reduce((sum, r) => sum + r.weight, 0);
const survivedWeight = survived.reduce((sum, r) => sum + r.weight, 0);
const invalidWeight = invalid.reduce((sum, r) => sum + r.weight, 0);

// Score pondéré = (poids des KILLED) / (poids des KILLED + poids des SURVIVED)
const validWeight = killedWeight + survivedWeight;
const weightedMutationScore = validWeight > 0 ? (killedWeight / validWeight) * 100 : 0;

// Score pondéré ajusté (en excluant les EXPECTED_INVALID du dénominateur)
const realInvalidWeight = realInvalid.reduce((sum, r) => sum + r.weight, 0);
const testIssueWeight = testIssue.reduce((sum, r) => sum + r.weight, 0);
const adjustedTotalWeight = totalWeight - expectedInvalid.reduce((sum, r) => sum + r.weight, 0);
const adjustedValidWeight = killedWeight + survivedWeight;
const adjustedWeightedScore = adjustedValidWeight > 0 ? (killedWeight / adjustedValidWeight) * 100 : 0;

// Indice de confiance basé sur:
// 1. Taille de l'échantillon (mutations valides)
// 2. Diversité des familles couvertes
// 3. Diversité des niveaux de criticité
const validMutations = killed.length + survived.length;
const requiredSampleSize = 30;
const sampleConfidence = Math.min(validMutations / requiredSampleSize, 1);

// Diversité des familles
const familiesWithValidMutations = new Set(
  [...killed, ...survived].map(r => r.family)
).size;
const totalFamilies = 10;
const familyDiversity = familiesWithValidMutations / totalFamilies;

// Diversité des niveaux de criticité
const criticalityLevels = new Set(
  [...killed, ...survived].map(r => r.level)
).size;
const totalCriticalityLevels = 4; // CRITICAL, MAJOR, MINOR, COSMETIC
const criticalityDiversity = criticalityLevels / totalCriticalityLevels;

// Indice de confiance composite
const confidenceIndex = (sampleConfidence * 0.5) + (familyDiversity * 0.3) + (criticalityDiversity * 0.2);

// Taux de INVALID réels (hors EXPECTED_INVALID)
const realInvalidRate = (realInvalid.length + testIssue.length) / reclassifiedResults.length;
const realInvalidRateExcludingExpected = realInvalidRate;

// Certification selon les nouveaux critères stricts
let certification = 'REJECTED';
let certificationReasons = [];

// Critère de base: Score pondéré ≥ 95%
if (adjustedWeightedScore >= 95) {
  certification = 'GOLD';
} else if (adjustedWeightedScore >= 80) {
  certification = 'SILVER';
} else if (adjustedWeightedScore > 60) {
  certification = 'BRONZE';
} else {
  certification = 'REJECTED';
  certificationReasons.push(`Score pondéré trop bas: ${adjustedWeightedScore.toFixed(2)}%`);
}

// Contraintes pour GOLD
if (certification === 'GOLD') {
  // Contrainte 1: Au moins 30 mutations valides
  if (validMutations < 30) {
    certification = 'SILVER';
    certificationReasons.push(`Échantillon insuffisant: ${validMutations} mutations valides < 30 requis`);
  }
  
  // Contrainte 2: Moins de 20% de INVALID réels (hors EXPECTED_INVALID)
  if (realInvalidRateExcludingExpected > 0.20) {
    certification = 'SILVER';
    certificationReasons.push(`Taux d'INVALID réels trop élevé: ${(realInvalidRateExcludingExpected * 100).toFixed(1)}% > 20% requis`);
  }
  
  // Contrainte 3: 0 survivant critique
  const criticalSurvivors = survived.filter(s => s.level === 'CRITICAL');
  if (criticalSurvivors.length > 0) {
    certification = 'SILVER';
    certificationReasons.push(`${criticalSurvivors.length} mutation(s) critique(s) survivante(s)`);
  }
  
  // Contrainte 4: Couverture de toutes les familles
  const requiredFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const coveredFamilies = new Set([...killed, ...survived].map(r => r.family));
  const missingFamilies = requiredFamilies.filter(f => !coveredFamilies.has(f));
  if (missingFamilies.length > 0) {
    certification = 'SILVER';
    certificationReasons.push(`Familles non couvertes: ${missingFamilies.join(', ')}`);
  }
  
  // Contrainte 5: Pondération par criticité (au moins une mutation de chaque niveau)
  const requiredLevels = ['CRITICAL', 'MAJOR', 'MINOR', 'COSMETIC'];
  const coveredLevels = new Set([...killed, ...survived].map(r => r.level));
  const missingLevels = requiredLevels.filter(l => !coveredLevels.has(l));
  if (missingLevels.length > 0) {
    certification = 'SILVER';
    certificationReasons.push(`Niveaux de criticité non couverts: ${missingLevels.join(', ')}`);
  }
}

console.log('=== Analyse pondérée et indice de confiance ===');
console.log(`\nScore pondéré (brut): ${weightedMutationScore.toFixed(2)}%`);
console.log(`Score pondéré (ajusté, hors EXPECTED_INVALID): ${adjustedWeightedScore.toFixed(2)}%`);
console.log(`\nIndice de confiance: ${(confidenceIndex * 100).toFixed(2)}%`);
console.log(`  - Confiance échantillon: ${(sampleConfidence * 100).toFixed(2)}% (${validMutations}/${requiredSampleSize})`);
console.log(`  - Diversité familles: ${(familyDiversity * 100).toFixed(2)}% (${familiesWithValidMutations}/${totalFamilies})`);
console.log(`  - Diversité criticité: ${(criticalityDiversity * 100).toFixed(2)}% (${criticalityLevels}/${totalCriticalityLevels})`);
console.log(`\nTaux d'INVALID réels: ${(realInvalidRateExcludingExpected * 100).toFixed(2)}%`);
console.log(`  - REAL_INVALID: ${realInvalid.length}`);
console.log(`  - EXPECTED_INVALID: ${expectedInvalid.length} (exclus du calcul)`);
console.log(`  - TEST_ISSUE: ${testIssue.length}`);
console.log(`\nCertification: ${certification}`);
if (certificationReasons.length > 0) {
  console.log('Raisons:');
  certificationReasons.forEach(r => console.log(`  - ${r}`));
}

const weightedMetrics = {
  totalMutations: reclassifiedResults.length,
  killed: killed.length,
  survived: survived.length,
  invalid: invalid.length,
  validMutations,
  
  // Détail INVALID
  realInvalid: realInvalid.length,
  expectedInvalid: expectedInvalid.length,
  testIssue: testIssue.length,
  realInvalidRate: parseFloat((realInvalidRateExcludingExpected * 100).toFixed(2)),
  
  // Scores
  weightedMutationScore: parseFloat(weightedMutationScore.toFixed(2)),
  adjustedWeightedScore: parseFloat(adjustedWeightedScore.toFixed(2)),
  
  // Confiance
  confidenceIndex: parseFloat((confidenceIndex * 100).toFixed(2)),
  sampleConfidence: parseFloat((sampleConfidence * 100).toFixed(2)),
  familyDiversity: parseFloat((familyDiversity * 100).toFixed(2)),
  criticalityDiversity: parseFloat((criticalityDiversity * 100).toFixed(2)),
  
  // Certification
  certification,
  certificationReasons,
  
  // Poids
  totalWeight,
  killedWeight,
  survivedWeight,
  invalidWeight
};

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/weighted-metrics.json', JSON.stringify(weightedMetrics, null, 2));

console.log('\nMétriques pondérées sauvegardées.');
