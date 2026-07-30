const fs = require('fs');

// Charger les résultats des mutations
const mutationResults = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', 'utf8'));

// Calculer les scores par composant
const components = ['execution-context', 'memory-manager', 'execution-pipeline', 'instruction-cache', 'instruction-fetch', 'instruction-decode', 'instruction-execute', 'rollback-manager', 'thread-manager'];

const byComponent = {};
const summary = {
  totalMutations: mutationResults.length,
  totalKilled: 0,
  totalSurvived: 0,
  totalInvalid: 0,
  totalTimeout: 0
};

const survivorsList = [];
const killedList = [];

components.forEach(component => {
  const componentResults = mutationResults.filter(r => r.component === component);
  const killed = componentResults.filter(r => r.status === 'KILLED').length;
  const survived = componentResults.filter(r => r.status === 'SURVIVED').length;
  const invalid = componentResults.filter(r => r.status === 'INVALID').length;
  const timeout = componentResults.filter(r => r.status === 'TIMEOUT').length;
  
  const validTotal = killed + survived;
  const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100) : 0;
  
  // Certification
  let certification = 'Non certifié';
  if (validTotal > 0) {
    if (mutationScore >= 95) certification = 'Enterprise Gold';
    else if (mutationScore >= 90) certification = 'Enterprise Silver';
    else if (mutationScore >= 80) certification = 'Coverage Only';
  }
  
  byComponent[component] = {
    totalMutations: componentResults.length,
    killed,
    survived,
    invalid,
    timeout,
    mutationScore: parseFloat(mutationScore.toFixed(2)),
    certification
  };
  
  summary.totalKilled += killed;
  summary.totalSurvived += survived;
  summary.totalInvalid += invalid;
  summary.totalTimeout += timeout;
  
  // Collecter les survivants et killed
  componentResults.forEach(r => {
    if (r.status === 'SURVIVED') {
      survivorsList.push(r);
    } else if (r.status === 'KILLED') {
      killedList.push(r);
    }
  });
});

// Mutation Score global
const globalValidTotal = summary.totalKilled + summary.totalSurvived;
const globalMutationScore = globalValidTotal > 0 ? ((summary.totalKilled / globalValidTotal) * 100) : 0;

summary.mutationScore = parseFloat(globalMutationScore.toFixed(2));

// Sauvegarder mutation-summary.json
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary.json', JSON.stringify(summary, null, 2));

// Sauvegarder mutation-by-component.json
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-by-component.json', JSON.stringify(byComponent, null, 2));

// Sauvegarder mutation-survivors.json
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-survivors.json', JSON.stringify(survivorsList, null, 2));

// Sauvegarder mutation-killed.json
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-killed.json', JSON.stringify(killedList, null, 2));

// Sauvegarder mutation-certification.json
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-certification.json', JSON.stringify(byComponent, null, 2));

console.log('JSON reports generated successfully');
console.log(JSON.stringify(summary, null, 2));
