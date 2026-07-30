const fs = require('fs');

// Charger les résultats des mutations
const mutationResults = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', 'utf8'));

const component = 'execution-pipeline';

// Filtrer les résultats pour ce composant
const componentResults = mutationResults.filter(r => r.component === component);

// Calculer les statistiques
const killed = componentResults.filter(r => r.status === 'KILLED').length;
const survived = componentResults.filter(r => r.status === 'SURVIVED').length;
const invalid = componentResults.filter(r => r.status === 'INVALID').length;

const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100) : 0;

// Certification
let certification = 'Non certifié';
if (validTotal > 0) {
  if (mutationScore >= 95) certification = 'Enterprise Gold';
  else if (mutationScore >= 85) certification = 'Enterprise Silver';
  else if (mutationScore >= 70) certification = 'Coverage Only';
}

// mutation-summary.json
const summary = {
  component,
  totalMutations: componentResults.length,
  killed,
  survived,
  invalid,
  mutationScore: parseFloat(mutationScore.toFixed(2)),
  certification
};

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary.json', JSON.stringify(summary, null, 2));

// mutation-by-component.json
const byComponent = {};
byComponent[component] = summary;
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-component.json', JSON.stringify(byComponent, null, 2));

// mutation-killed.json
const killedResults = componentResults.filter(r => r.status === 'KILLED');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-killed.json', JSON.stringify(killedResults, null, 2));

// mutation-survived.json
const survivedResults = componentResults.filter(r => r.status === 'SURVIVED');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-survived.json', JSON.stringify(survivedResults, null, 2));

// mutation-invalid.json
const invalidResults = componentResults.filter(r => r.status === 'INVALID');
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-invalid.json', JSON.stringify(invalidResults, null, 2));

// mutation-certification.json
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-certification.json', JSON.stringify(byComponent, null, 2));

console.log('Rapports JSON générés avec succès');
console.log(JSON.stringify(summary, null, 2));
