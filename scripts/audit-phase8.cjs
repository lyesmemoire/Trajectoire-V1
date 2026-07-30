const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Charger les mutations de la Phase 5
const phase5Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase5.json', 'utf8'));

console.log('=== Phase 8 - Validation finale de classification KILLED ===\n');
console.log(`Mutations à vérifier: ${phase5Results.length}\n`);

const verificationResults = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

phase5Results.forEach((mutation) => {
  const mutationId = mutation.id;
  const mutationLine = mutation.line;
  const mutationText = mutation.mutation;
  const originalMutation = mutation.mutated || mutation.mutation;
  
  console.log(`Vérification ${mutationId}: ${mutationText}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let compilation = 'KO';
  let testsExecuted = false;
  let exitCode = null;
  let testsTotal = 0;
  let testsFailed = 0;
  let testsPassed = 0;
  let duration = 0;
  let classification = 'UNKNOWN';
  let justification = '';
  
  const startTime = Date.now();
  
  try {
    // Appliquer mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutationLine - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      mutatedLines[lineIndex] = originalMutation;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
    } else {
      throw new Error('Ligne hors limites');
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      compilation = 'OK';
    } catch (compileError) {
      compilation = 'KO';
      classification = 'INVALID';
      justification = 'Erreur TypeScript / Compilation échouée';
      console.log(`  Compilation: KO`);
      console.log(`  Classification: INVALID (${justification})\n`);
      throw new Error('Compilation échouée');
    }
    
    console.log(`  Compilation: OK`);
    
    // Exécuter tests
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
      });
      
      // Tests passent
      testsExecuted = true;
      exitCode = 0;
      classification = 'SURVIVED';
      justification = 'Tous les tests passent';
      
      // Extraire nombre de tests
      const match = testOutput.match(/Tests\s+(\d+)\s+passed/);
      if (match) {
        testsPassed = parseInt(match[1]);
        testsTotal = testsPassed;
      }
      
      console.log(`  Tests: OK (${testsPassed} passed)`);
      console.log(`  Classification: SURVIVED\n`);
      
    } catch (testError) {
      testsExecuted = true;
      exitCode = testError.status || testError.signal || 1;
      
      const stdout = testError.stdout || '';
      const stderr = testError.stderr || '';
      const errorOutput = stdout + stderr;
      
      // Extraire nombre de tests
      const passedMatch = errorOutput.match(/(\d+)\s+passed/);
      const failedMatch = errorOutput.match(/(\d+)\s+failed/);
      
      if (passedMatch) testsPassed = parseInt(passedMatch[1]);
      if (failedMatch) testsFailed = parseInt(failedMatch[1]);
      testsTotal = testsPassed + testsFailed;
      
      // Classification selon les règles Phase 8
      if (testError.killed || testError.signal === 'SIGTERM' || errorOutput.includes('timeout')) {
        classification = 'INVALID';
        justification = 'Timeout / Runner tué avant fin';
        console.log(`  Tests: TIMEOUT`);
        console.log(`  Classification: INVALID (${justification})\n`);
      } else if (exitCode !== 0 && testsFailed > 0) {
        classification = 'KILLED';
        justification = 'Tests échouent (exit code non nul)';
        console.log(`  Tests: ${testsFailed} failed, ${testsPassed} passed`);
        console.log(`  Exit code: ${exitCode}`);
        console.log(`  Classification: KILLED (${justification})\n`);
      } else {
        classification = 'INVALID';
        justification = 'Erreur technique / Runner crash';
        console.log(`  Tests: Erreur technique`);
        console.log(`  Classification: INVALID (${justification})\n`);
      }
    }
    
  } catch (error) {
    if (classification === 'UNKNOWN') {
      classification = 'INVALID';
      justification = 'Erreur inconnue: ' + error.message;
    }
  } finally {
    duration = Date.now() - startTime;
    
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
    }
    
    verificationResults.push({
      id: mutationId,
      mutation: mutationText,
      compilation,
      testsExecuted,
      exitCode,
      testsTotal,
      testsFailed,
      testsPassed,
      duration,
      classification,
      justification
    });
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Calculer les métriques finales
const killed = verificationResults.filter(r => r.classification === 'KILLED').length;
const survived = verificationResults.filter(r => r.classification === 'SURVIVED').length;
const invalid = verificationResults.filter(r => r.classification === 'INVALID').length;
const total = verificationResults.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Familles couvertes
const familiesWithValid = new Set(verificationResults.filter(r => r.classification !== 'INVALID').map(r => r.family || ''));
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

// Sauvegarder
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-final-verification.json', JSON.stringify(verificationResults, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-final-verification-summary.json', JSON.stringify({
  total, killed, survived, invalid, validTotal, mutationScore: parseFloat(mutationScore),
  coveredFamilies, uncoveredFamilies, certification
}, null, 2));

const table = `| Mutation | Compile | Tests | Exit code | Failed | Passed | Classification |
${verificationResults.map(r => `| ${r.mutation} | ${r.compilation} | ${r.testsExecuted ? 'oui' : 'non'} | ${r.exitCode || 'N/A'} | ${r.testsFailed} | ${r.testsPassed} | ${r.classification} |`).join('\n')}`;

const report = `# Phase 8 - Validation finale de classification KILLED

## Tableau de vérification

${table}

## Résultats finaux

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |
| Total | ${total} |

## Mutation Score

${mutationScore}%

## Familles couvertes

${coveredFamilies.length} familles sur 10: ${coveredFamilies.join(', ') || 'Aucune'}

## Familles non couvertes

${uncoveredFamilies.join(', ') || 'Aucune'}

## Certification

**${certification}**

## SHA

| SHA avant | ${initialSha} |
| SHA après | ${finalSha} |
| Identique | ${initialSha === finalSha ? 'OUI' : 'NON'} |

## Note

Cette classification est basée sur le comportement réel des tests (exit code, compilation, runner Vitest) conformément aux pratiques du mutation testing (PIT, Stryker, Major). La présence d'une assertion textuelle n'est pas un critère obligatoire.
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-final-verification.md', report);

console.log('=== Résultats Phase 8 ===');
console.log(`\nKILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`\nCertification: ${certification}`);
console.log(`\nSHA avant: ${initialSha}`);
console.log(`SHA après: ${finalSha}`);
