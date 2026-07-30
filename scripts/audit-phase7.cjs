const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Charger les résultats de la Phase 6
const phase6Results = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase6.json', 'utf8'));

// Filtrer uniquement les KILLED
const killedMutations = phase6Results.filter(r => r.status === 'KILLED' || r.newStatus === 'KILLED');

console.log('=== Phase 7 - Validation des mutations KILLED ===\n');
console.log(`Mutations KILLED à valider: ${killedMutations.length}\n`);

const validationResults = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

killedMutations.forEach((mutation) => {
  const mutationId = mutation.id;
  const mutationLine = mutation.line;
  const mutationText = mutation.mutation;
  const originalMutation = mutation.mutated || mutation.mutation;
  
  console.log(`Validation ${mutationId}: ${mutationText}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let detectorTest = '';
  let assertion = '';
  let expected = '';
  let obtained = '';
  let status = 'KILLED';
  let reason = '';
  
  try {
    // Appliquer mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutationLine - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      // Trouver la ligne originale correspondante
      const originalLine = originalLines[lineIndex];
      mutatedLines[lineIndex] = originalMutation;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
    } else {
      throw new Error('Ligne hors limites');
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
    } catch (compileError) {
      status = 'INVALID';
      reason = 'Compilation échouée';
      console.log(`  Status: INVALID (Compilation échouée)\n`);
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests avec capture détaillée
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath} --reporter=verbose`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
      });
      
      // Si on arrive ici, les tests passent
      status = 'SURVIVED';
      reason = 'Tests passent sans erreur';
      console.log(`  Status: SURVIVED (Tests passent)\n`);
      
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      
      // Analyser la sortie pour extraire les détails
      const lines = errorOutput.split('\n');
      
      // Chercher le test en échec
      let testFile = '';
      let testName = '';
      let assertionLine = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Extraire le nom du test
        if (line.includes('FAIL') && line.includes('execution-pipeline')) {
          const parts = line.split('>');
          if (parts.length >= 2) {
            testName = parts[parts.length - 1].trim();
            testFile = 'tests/vm/advanced/execution-pipeline.test.ts';
          }
        }
        
        // Extraire l'assertion
        if (line.includes('expect') && (line.includes('toBe') || line.includes('toEqual') || line.includes('assert'))) {
          assertionLine = line.trim();
        }
        
        // Extraire attendu/obtenu
        if (line.includes('Expected') || line.includes('expected')) {
          const nextLine = lines[i + 1] || '';
          expected = line.includes('Expected') ? line.split('Expected')[1].trim() : nextLine.trim();
        }
        if (line.includes('Received') || line.includes('received')) {
          const nextLine = lines[i + 1] || '';
          obtained = line.includes('Received') ? line.split('Received')[1].trim() : nextLine.trim();
        }
      }
      
      // Vérifier si c'est une vraie assertion ou un problème technique
      if (errorOutput.includes('timeout') || testError.killed) {
        status = 'INVALID';
        reason = 'Timeout - aucune assertion identifiée';
        console.log(`  Status: INVALID (Timeout)\n`);
      } else if (testName && assertionLine) {
        status = 'KILLED';
        detectorTest = testName;
        assertion = assertionLine;
        reason = 'Assertion fonctionnelle identifiée';
        console.log(`  Test détecteur: ${detectorTest}`);
        console.log(`  Assertion: ${assertion}`);
        console.log(`  Status: KILLED\n`);
      } else if (errorOutput.includes('FAIL')) {
        status = 'INVALID';
        reason = 'Tests rouges sans assertion précise identifiée';
        console.log(`  Status: INVALID (Tests rouges sans assertion)\n`);
      } else {
        status = 'INVALID';
        reason = 'Erreur technique sans assertion identifiée';
        console.log(`  Status: INVALID (Erreur technique)\n`);
      }
    }
    
  } catch (error) {
    if (status === 'KILLED' && !reason) {
      status = 'INVALID';
      reason = 'Erreur inconnue: ' + error.message;
    }
  } finally {
    // Restaurer
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
    }
    
    validationResults.push({
      id: mutationId,
      mutation: mutationText,
      detectorTest,
      assertion,
      expected,
      obtained,
      status,
      reason
    });
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Combiner avec les résultats non-KILLED de la Phase 6
const nonKilledResults = phase6Results.filter(r => r.status !== 'KILLED' && r.newStatus !== 'KILLED');
const allValidated = [...nonKilledResults, ...validationResults];

// Calculer les métriques finales
const killed = allValidated.filter(r => r.status === 'KILLED').length;
const survived = allValidated.filter(r => r.status === 'SURVIVED').length;
const invalid = allValidated.filter(r => r.status === 'INVALID').length;
const total = allValidated.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Sauvegarder rapports
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof.json', JSON.stringify(validationResults, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase7.json', JSON.stringify(allValidated, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase7.json', JSON.stringify({
  total,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore)
}, null, 2));

const proofTable = `| Mutation | Test détecteur | Assertion | Attendu | Obtenu | Statut |
${validationResults.map(r => `| ${r.mutation} | ${r.detectorTest || 'N/A'} | ${r.assertion || 'N/A'} | ${r.expected || 'N/A'} | ${r.obtained || 'N/A'} | ${r.status} |`).join('\n')}`;

const report = `# Phase 7 - Validation des mutations KILLED - execution-pipeline

## Preuve par assertion

${proofTable}

## Résultats finaux

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |

## Mutation Score

${mutationScore}%

## SHA

| SHA avant | ${initialSha} |
| SHA après | ${finalSha} |
| Identique | ${initialSha === finalSha ? 'OUI' : 'NON'} |
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof.md', report);

// Affichage demandé
console.log('=== Résultats Phase 7 ===');
console.log(`\nKILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`\nMutation Score: ${mutationScore}%`);
console.log(`\nSHA avant: ${initialSha}`);
console.log(`SHA après: ${finalSha}`);
