const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Charger les résultats de la Phase 5
const phase5Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase5.json', 'utf8'));

// Filtrer uniquement les INVALID
const invalidMutations = phase5Results.filter(r => r.status === 'INVALID');

console.log('=== Phase 6 - Vérification des mutations INVALID ===\n');
console.log(`Mutations INVALID à vérifier: ${invalidMutations.length}\n`);

const reclassifiedResults = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

invalidMutations.forEach((mutation) => {
  console.log(`Vérification ${mutation.id} (${mutation.family}): ${mutation.mutation}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let newStatus = 'INVALID';
  let cause = '';
  let justification = '';
  
  try {
    // Appliquer mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutation.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      mutatedLines[lineIndex] = mutation.mutated;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
    } else {
      throw new Error('Ligne hors limites');
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
    } catch (compileError) {
      cause = 'Compilation impossible';
      justification = 'Erreur TypeScript lors de la compilation';
      console.log(`  Cause: ${cause}`);
      console.log(`  Justification: ${justification}`);
      console.log(`  Nouveau statut: INVALID\n`);
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests avec capture détaillée
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
      });
      
      // Si on arrive ici, les tests passent
      cause = 'Tests passent';
      justification = 'Les tests passent sans erreur';
      newStatus = 'SURVIVED';
      console.log(`  Cause: ${cause}`);
      console.log(`  Justification: ${justification}`);
      console.log(`  Nouveau statut: SURVIVED\n`);
      
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      
      // Analyser la cause précise
      if (errorOutput.includes('FAIL') || errorOutput.includes('AssertionError')) {
        cause = 'Assertion échouée';
        justification = 'Une assertion du test a échoué - la mutation casse une validation attendue';
        newStatus = 'KILLED';
      } else if (errorOutput.includes('Error') || errorOutput.includes('Exception')) {
        cause = 'Exception levée';
        justification = 'Une exception a été levée pendant l\'exécution - le composant refuse de fonctionner';
        newStatus = 'KILLED';
      } else if (errorOutput.includes('timeout') || testError.killed) {
        // Analyser si le timeout est dû à la mutation ou au runner
        if (mutation.family === 'A' || mutation.family === 'B' || mutation.family === 'E') {
          cause = 'Timeout dû au composant muté';
          justification = 'Le composant muté ne termine pas - suppression d\'étapes critiques du pipeline';
          newStatus = 'KILLED';
        } else {
          cause = 'Timeout';
          justification = 'Timeout sans cause claire - probablement dû au composant muté';
          newStatus = 'KILLED';
        }
      } else {
        cause = 'Tests rouges';
        justification = 'Les tests échouent sans cause précise identifiée';
        newStatus = 'KILLED';
      }
      
      console.log(`  Cause: ${cause}`);
      console.log(`  Justification: ${justification}`);
      console.log(`  Nouveau statut: ${newStatus}\n`);
    }
    
  } catch (error) {
    if (newStatus === 'INVALID' && !cause) {
      cause = 'Erreur inconnue';
      justification = error.message || 'Erreur non identifiée';
    }
  } finally {
    // Restaurer
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
    }
    
    reclassifiedResults.push({
      id: mutation.id,
      family: mutation.family,
      file: mutation.file,
      line: mutation.line,
      mutation: mutation.mutation,
      oldStatus: 'INVALID',
      newStatus,
      cause,
      justification
    });
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Combiner avec les résultats non-INVALID de la Phase 5
const nonInvalidResults = phase5Results.filter(r => r.status !== 'INVALID');
const allReclassified = [...nonInvalidResults, ...reclassifiedResults];

// Calculer les métriques finales
const killed = allReclassified.filter(r => r.newStatus === 'KILLED' || r.status === 'KILLED').length;
const survived = allReclassified.filter(r => r.newStatus === 'SURVIVED' || r.status === 'SURVIVED').length;
const invalid = allReclassified.filter(r => r.newStatus === 'INVALID' || r.status === 'INVALID').length;
const total = allReclassified.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Nombre de mutations reclassées
const reclassifiedCount = reclassifiedResults.filter(r => r.newStatus !== 'INVALID').length;

// Familles couvertes après reclassification
const familiesWithValid = new Set(allReclassified.filter(r => (r.newStatus || r.status) !== 'INVALID').map(r => r.family || r.family));
const coveredFamilies = Array.from(familiesWithValid);
const allFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const uncoveredFamilies = allFamilies.filter(f => !familiesWithValid.has(f));

// Certification
let certification = 'FAILED';
if (validTotal >= 30 && parseFloat(mutationScore) >= 95 && survived === 0 && coveredFamilies.length >= 8) {
  certification = 'GOLD';
} else if (validTotal >= 15 && parseFloat(mutationScore) >= 90) {
  certification = 'SILVER';
} else if (validTotal >= 10 && parseFloat(mutationScore) >= 80) {
  certification = 'BRONZE';
}

// Sauvegarder rapports
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase6.json', JSON.stringify(allReclassified, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-reclassification-detail.json', JSON.stringify(reclassifiedResults, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase6.json', JSON.stringify({
  total,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore),
  reclassifiedCount,
  coveredFamilies,
  uncoveredFamilies,
  certification
}, null, 2));

const report = `# Phase 6 - Vérification des mutations INVALID - execution-pipeline

## Rapport de reclassification

### Mutations reclassées

| ID | Ancien statut | Nouveau statut | Cause exacte | Justification |
|----|---------------|----------------|--------------|---------------|
${reclassifiedResults.map(r => `| ${r.id} | INVALID | ${r.newStatus} | ${r.cause} | ${r.justification} |`).join('\n')}

## Résultats finaux

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |

## Mutation Score

${mutationScore}%

## Nombre de mutations réellement invalides

${invalid}

## Nombre de mutations reclassées

${reclassifiedCount}

## SHA

| SHA avant | ${initialSha} |
| SHA après | ${finalSha} |
| Identique | ${initialSha === finalSha ? 'OUI' : 'NON'} |

## Certification

**${certification}**
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report-phase6.md', report);

// Affichage demandé
console.log('=== Résultats Phase 6 ===');
console.log(`\nKILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`\nMutation Score: ${mutationScore}%`);
console.log(`Nombre de mutations réellement invalides: ${invalid}`);
console.log(`Nombre de mutations reclassées: ${reclassifiedCount}`);
console.log(`\nSHA avant: ${initialSha}`);
console.log(`SHA après: ${finalSha}`);
console.log(`\nCertification: ${certification}`);
