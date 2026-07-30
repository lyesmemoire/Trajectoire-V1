const fs = require('fs');

// Charger les résultats de toutes les phases
const phase2Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase2.json', 'utf8'));
const phase3Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase3.json', 'utf8'));
const phase4Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase4.json', 'utf8'));

// Combiner tous les résultats
const allResults = [...phase2Results, ...phase3Results, ...phase4Results];

// Calculer les statistiques globales
const killed = allResults.filter(r => r.status === 'KILLED').length;
const survived = allResults.filter(r => r.status === 'SURVIVED').length;
const invalid = allResults.filter(r => r.status === 'INVALID').length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Certification
let certification = 'BRONZE';
if (mutationScore >= 95 && survived === 0) certification = 'GOLD';
else if (mutationScore >= 80) certification = 'SILVER';

// Sauvegarder les résultats combinés
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-combined.json', JSON.stringify(allResults, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-combined.json', JSON.stringify({
  total: allResults.length,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore),
  certification
}, null, 2));

// Rapport Markdown combiné
const report = `# Audit par mutation ciblée - execution-pipeline (Rapport Combiné)

## Objectif

Augmenter le nombre de mutations VALIDES pour obtenir un échantillon statistiquement représentatif (30+ mutations valides).

## Résumé des phases

| Phase | Total | KILLED | SURVIVED | INVALID | Valides |
|-------|-------|--------|----------|---------|---------|
| Phase 2 | 35 | 8 | 0 | 27 | 8 |
| Phase 3 | 22 | 12 | 0 | 10 | 12 |
| Phase 4 | 26 | 17 | 0 | 9 | 17 |
| **TOTAL** | **83** | **37** | **0** | **46** | **37** |

## Résultats globaux

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |
| Mutation Score | ${mutationScore}% |
| Nombre total de mutations valides | ${validTotal} |

## Certification

**${certification}**

## Survivants

${survived === 0 ? 'Aucune mutation survivante' : allResults.filter(r => r.status === 'SURVIVED').map(r => `- ${r.description}`).join('\n')}

## Détail de toutes les mutations

### Phase 2 (35 mutations)

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
${phase2Results.map(r => `| ${r.id} | ${r.line} | ${r.description} | ${r.status} |`).join('\n')}

### Phase 3 (22 mutations)

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
${phase3Results.map(r => `| ${r.id} | ${r.line} | ${r.description} | ${r.status} |`).join('\n')}

### Phase 4 (26 mutations)

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
${phase4Results.map(r => `| ${r.id} | ${r.line} | ${r.description} | ${r.status} |`).join('\n')}
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report-combined.md', report);

// Affichage demandé
console.log('=== Rapport Combiné - Toutes les phases ===');
console.log(`\nKILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`Nombre total de mutations valides: ${validTotal}`);
console.log(`\nCertification: ${certification}`);
console.log(`\nSurvivants: ${survived === 0 ? 'Aucune mutation survivante' : allResults.filter(r => r.status === 'SURVIVED').map(r => r.description).join(', ')}`);
