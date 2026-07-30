const fs = require('fs');

// Charger les résultats de la Phase 7
const phase7Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof.json', 'utf8'));

// Reclasser: si pas d'assertion précise → INVALID
const reclassified = phase7Results.map(r => {
  if (r.status === 'KILLED' && (!r.assertion || r.assertion === '')) {
    return { ...r, status: 'INVALID', reason: 'Aucune assertion fonctionnelle identifiée' };
  }
  return r;
});

// Charger les résultats de la Phase 6
const phase6Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase6.json', 'utf8'));

// Combiner avec les résultats non-KILLED de la Phase 6
const nonKilledResults = phase6Results.filter(r => r.status !== 'KILLED' && r.newStatus !== 'KILLED');
const allValidated = [...nonKilledResults, ...reclassified];

// Calculer les métriques
const killed = allValidated.filter(r => r.status === 'KILLED').length;
const survived = allValidated.filter(r => r.status === 'SURVIVED').length;
const invalid = allValidated.filter(r => r.status === 'INVALID').length;
const total = allValidated.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Sauvegarder les résultats reclassés
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof-final.json', JSON.stringify(reclassified, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase7-final.json', JSON.stringify(allValidated, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase7-final.json', JSON.stringify({
  total, killed, survived, invalid, validTotal, mutationScore: parseFloat(mutationScore)
}, null, 2));

const proofTable = `| Mutation | Test détecteur | Assertion | Attendu | Obtenu | Statut |
${reclassified.map(r => `| ${r.mutation} | ${r.detectorTest || 'N/A'} | ${r.assertion || 'N/A'} | ${r.expected || 'N/A'} | ${r.obtained || 'N/A'} | ${r.status} |`).join('\n')}`;

const report = `# Phase 7 - Validation des mutations KILLED (Reclassification)

${proofTable}

## Résultats finaux après reclassification

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |

## Mutation Score

${mutationScore}%

## Note

Les mutations sans assertion fonctionnelle précise ont été reclassées en INVALID selon les règles de la Phase 7.
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof-final.md', report);

console.log('=== Résultats Phase 7 (Reclassification) ===');
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`\nMutations reclassées en INVALID: ${reclassified.filter(r => r.status === 'INVALID').length}`);
