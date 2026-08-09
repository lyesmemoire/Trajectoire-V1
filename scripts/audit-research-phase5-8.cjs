const fs = require('fs');

// Charger les résultats
const results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results.json', 'utf8'));

// PHASE 5: Analyse des survivants
const survivors = results.filter(r => r.status === 'SURVIVED');
console.log('\n=== PHASE 5: Analyse des Survivants ===');
console.log(`Nombre de survivants: ${survivors.length}`);

if (survivors.length === 0) {
  console.log('Aucun survivant - excellente résistance aux mutations sur les mutations valides.');
} else {
  survivors.forEach(s => {
    console.log(`\nSurvivant: ${s.id} - ${s.description}`);
    console.log(`  Famille: ${s.family}`);
    console.log(`  Ligne: ${s.line}`);
    console.log(`  Analyse: À déterminer`);
  });
}

// PHASE 6: Analyse détaillée des INVALID
const invalids = results.filter(r => r.status === 'INVALID');
console.log('\n=== PHASE 6: Analyse des INVALID ===');
console.log(`Nombre d'INVALID: ${invalids.length} (${(invalids.length / results.length * 100).toFixed(1)}%)`);

const invalidAnalysis = [];
invalids.forEach(inv => {
  let reason = '';
  let category = '';
  
  if (inv.filterReason) {
    reason = inv.filterReason;
    category = 'FILTER_ERROR';
  } else if (inv.timeoutReason) {
    reason = inv.timeoutReason;
    category = 'TIMEOUT';
  } else {
    reason = 'Erreur de test inconnue - probablement crash ou assertion invalide';
    category = 'TEST_ERROR';
  }
  
  invalidAnalysis.push({
    ...inv,
    reason,
    category
  });
  
  console.log(`\n${inv.id}: ${inv.description}`);
  console.log(`  Catégorie: ${category}`);
  console.log(`  Raison: ${reason}`);
});

// Sauvegarder l'analyse des INVALID
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/phase6-invalid-analysis.json', JSON.stringify(invalidAnalysis, null, 2));

// PHASE 7: Calcul des métriques de qualité
const killed = results.filter(r => r.status === 'KILLED').length;
const survived = results.filter(r => r.status === 'SURVIVED').length;
const invalid = results.filter(r => r.status === 'INVALID').length;
const total = results.length;

const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? (killed / validTotal) * 100 : 0;

// Métriques avancées
const mutationDensity = validTotal / total; // Densité de mutations valides
const mutationDiversity = new Set(results.map(r => r.family)).size; // Nombre de familles couvertes
const mutationStability = (killed / total) * 100; // Pourcentage de mutations tuées sur total
const mutationReliability = validTotal > 0 ? (killed / validTotal) : 0; // Fiabilité sur valides
const mutationConfidence = validTotal >= 30 ? 1 : validTotal / 30; // Confiance basée sur l'échantillon
const mutationRobustness = 1 - (invalid / total); // Robustesse (1 - taux d'INVALID)
const mutationQualityIndex = mutationScore * mutationConfidence * mutationRobustness; // Index composite

console.log('\n=== PHASE 7: Métriques de Qualité ===');
console.log(`Mutation Score: ${mutationScore.toFixed(2)}%`);
console.log(`Mutation Density: ${(mutationDensity * 100).toFixed(2)}%`);
console.log(`Mutation Diversity: ${mutationDiversity} familles`);
console.log(`Mutation Stability: ${mutationStability.toFixed(2)}%`);
console.log(`Mutation Reliability: ${mutationReliability.toFixed(2)}`);
console.log(`Mutation Confidence: ${(mutationConfidence * 100).toFixed(2)}%`);
console.log(`Mutation Robustness: ${(mutationRobustness * 100).toFixed(2)}%`);
console.log(`Mutation Quality Index: ${mutationQualityIndex.toFixed(2)}`);

// PHASE 8: Certification selon les critères stricts
console.log('\n=== PHASE 8: Certification ===');

let certification = 'REJECTED';
const certificationReasons = [];

// Critère de base: Mutation Score
if (mutationScore >= 99) {
  certification = 'PLATINUM';
} else if (mutationScore >= 95) {
  certification = 'GOLD';
} else if (mutationScore >= 80) {
  certification = 'SILVER';
} else if (mutationScore > 60) {
  certification = 'BRONZE';
} else {
  certification = 'REJECTED';
  certificationReasons.push(`Mutation Score trop bas: ${mutationScore.toFixed(2)}%`);
}

// Contraintes pour GOLD
if (certification === 'GOLD' || certification === 'PLATINUM') {
  // Contrainte 1: Moins de 30 mutations valides
  if (validTotal < 30) {
    certification = 'SILVER';
    certificationReasons.push(`Échantillon insuffisant: ${validTotal} mutations valides < 30 requis pour GOLD`);
  }
  
  // Contrainte 2: Plus de 20% INVALID
  if (invalid / total > 0.20) {
    certification = 'SILVER';
    certificationReasons.push(`Taux d'INVALID trop élevé: ${(invalid / total * 100).toFixed(1)}% > 20% requis pour GOLD`);
  }
  
  // Contrainte 3: Mutation critique survivante
  const criticalSurvivors = survivors.filter(s => {
    const criticalLines = [57, 105, 116]; // Lignes critiques
    return criticalLines.includes(s.line);
  });
  if (criticalSurvivors.length > 0) {
    certification = 'SILVER';
    certificationReasons.push(`${criticalSurvivors.length} mutation(s) critique(s) survivante(s)`);
  }
  
  // Contrainte 4: Couverture des familles
  const requiredFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const coveredFamilies = new Set(results.filter(r => r.status !== 'INVALID').map(r => r.family));
  const missingFamilies = requiredFamilies.filter(f => !coveredFamilies.has(f));
  if (missingFamilies.length > 0) {
    certification = 'SILVER';
    certificationReasons.push(`Familles non couvertes par des mutations valides: ${missingFamilies.join(', ')}`);
  }
}

// Contraintes pour PLATINUM
if (certification === 'PLATINUM') {
  if (validTotal < 50) {
    certification = 'GOLD';
    certificationReasons.push(`Échantillon insuffisant pour PLATINUM: ${validTotal} < 50`);
  }
  if (invalid / total > 0.10) {
    certification = 'GOLD';
    certificationReasons.push(`Taux d'INVALID trop élevé pour PLATINUM: ${(invalid / total * 100).toFixed(1)}% > 10%`);
  }
}

console.log(`Certification: ${certification}`);
if (certificationReasons.length > 0) {
  console.log('Raisons:');
  certificationReasons.forEach(r => console.log(`  - ${r}`));
} else {
  console.log('Tous les critères satisfaits');
}

// Sauvegarder les métriques et certification
const metrics = {
  total,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore.toFixed(2)),
  mutationDensity: parseFloat(mutationDensity.toFixed(4)),
  mutationDiversity,
  mutationStability: parseFloat(mutationStability.toFixed(2)),
  mutationReliability: parseFloat(mutationReliability.toFixed(2)),
  mutationConfidence: parseFloat(mutationConfidence.toFixed(2)),
  mutationRobustness: parseFloat(mutationRobustness.toFixed(2)),
  mutationQualityIndex: parseFloat(mutationQualityIndex.toFixed(2)),
  certification,
  certificationReasons
};

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/phase7-metrics.json', JSON.stringify(metrics, null, 2));

console.log('\n=== Métriques sauvegardées ===');
