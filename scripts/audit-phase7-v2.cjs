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
  
  // Récupérer la mutation depuis les résultats Phase 5 si nécessaire
  let originalMutation = mutation.mutation;
  if (mutation.mutated && mutation.mutated !== mutation.mutation) {
    originalMutation = mutation.mutated;
  }
  
  console.log(`Validation ${mutationId}: ${mutationText}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let detectorTest = '';
  let assertion = '';
  let expected = '';
  let obtained = '';
  let status = 'KILLED';
  let reason = '';
  let rawOutput = '';
  
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
    } catch (compileError) {
      status = 'INVALID';
      reason = 'Compilation échouée';
      console.log(`  Status: INVALID (Compilation échouée)\n`);
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests avec capture détaillée
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
      });
      
      status = 'SURVIVED';
      reason = 'Tests passent sans erreur';
      console.log(`  Status: SURVIVED (Tests passent)\n`);
      
    } catch (testError) {
      rawOutput = testError.stdout || testError.stderr || '';
      
      // Analyser la sortie
      const lines = rawOutput.split('\n');
      let testName = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Extraire le nom du test
        if (line.includes('FAIL') || line.includes('✗')) {
          const match = line.match(/execution-pipeline[^>]*>/);
          if (match) {
            testName = match[0].replace('>', '').trim();
          }
        }
        
        // Extraire l'assertion
        if (line.includes('expect') && (line.includes('toBe') || line.includes('toEqual'))) {
          assertion = line.trim();
        }
        
        // Extraire attendu/obtenu
        if (line.includes('Expected')) {
          expected = line.split('Expected')[1].trim();
        }
        if (line.includes('Received')) {
          obtained = line.split('Received')[1].trim();
        }
      }
      
      // Classification
      if (rawOutput.includes('timeout') || testError.killed) {
        status = 'INVALID';
        reason = 'Timeout';
        console.log(`  Status: INVALID (Timeout)\n`);
      } else if (rawOutput.includes('FAIL')) {
        status = 'KILLED';
        detectorTest = testName || 'Test détecté';
        assertion = assertion || 'Assertion détectée';
        reason = 'Test en échec';
        console.log(`  Test: ${detectorTest}`);
        console.log(`  Status: KILLED\n`);
      } else {
        status = 'INVALID';
        reason = 'Erreur technique';
        console.log(`  Status: INVALID (Erreur technique)\n`);
      }
    }
    
  } catch (error) {
    if (status === 'KILLED' && !reason) {
      status = 'INVALID';
      reason = 'Erreur: ' + error.message;
    }
  } finally {
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

// Combiner avec les résultats non-KILLED
const nonKilledResults = phase6Results.filter(r => r.status !== 'KILLED' && r.newStatus !== 'KILLED');
const allValidated = [...nonKilledResults, ...validationResults];

// Calculer les métriques
const killed = allValidated.filter(r => r.status === 'KILLED').length;
const survived = allValidated.filter(r => r.status === 'SURVIVED').length;
const invalid = allValidated.filter(r => r.status === 'INVALID').length;
const total = allValidated.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Sauvegarder
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof.json', JSON.stringify(validationResults, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase7.json', JSON.stringify(allValidated, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase7.json', JSON.stringify({
  total, killed, survived, invalid, validTotal, mutationScore: parseFloat(mutationScore)
}, null, 2));

const proofTable = `| Mutation | Test détecteur | Assertion | Attendu | Obtenu | Statut |
${validationResults.map(r => `| ${r.mutation} | ${r.detectorTest || 'N/A'} | ${r.assertion || 'N/A'} | ${r.expected || 'N/A'} | ${r.obtained || 'N/A'} | ${r.status} |`).join('\n')}`;

const report = `# Phase 7 - Validation des mutations KILLED

${proofTable}

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |

Mutation Score: ${mutationScore}%

SHA avant: ${initialSha}
SHA après: ${finalSha}
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-proof.md', report);

console.log('=== Résultats Phase 7 ===');
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
