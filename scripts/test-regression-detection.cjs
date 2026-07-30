const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline-regression-tests.test.ts';

const regressions = [
  {
    id: 'R5',
    description: 'Supprimer stop()',
    line: 127,
    original: 'this.running = false;',
    mutated: '// stop removed',
  },
  {
    id: 'R10',
    description: 'Ne jamais incrémenter cycles',
    line: 75,
    original: 'this.statistics.cycles++;',
    mutated: '// cycles not incremented',
  },
  {
    id: 'R19',
    description: 'Supprimer remise à zéro des statistiques dans reset()',
    line: 136,
    original: 'this.statistics = this.initializeStatistics();',
    mutated: '// statistics not reset',
  }
];

console.log('=== Test de détection des régressions avec nouveaux tests ===\n');

const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

regressions.forEach((regression) => {
  console.log(`\n=== Test ${regression.id}: ${regression.description} ===`);
  
  const startTime = Date.now();
  let status = 'UNKNOWN';
  
  try {
    // Appliquer régression
    const mutatedLines = [...originalLines];
    const lineIndex = regression.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      mutatedLines[lineIndex] = regression.mutated;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
    } catch (compileError) {
      status = 'BUILD ERROR';
      console.log(`  Compilation: KO`);
      console.log(`  Status: BUILD ERROR\n`);
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests
    try {
      execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 15000,
        encoding: 'utf8'
      });
      
      // Tests passent - régression non détectée
      status = 'REGRESSION MISSED';
      console.log(`  Tests: PASSED`);
      console.log(`  Status: REGRESSION MISSED\n`);
      
    } catch (testError) {
      const stdout = testError.stdout || '';
      const stderr = testError.stderr || '';
      const errorOutput = stdout + stderr;
      
      const failedMatch = errorOutput.match(/(\d+)\s+failed/);
      
      if (failedMatch && parseInt(failedMatch[1]) > 0) {
        status = 'REGRESSION DETECTED';
        console.log(`  Tests: FAILED`);
        console.log(`  Status: REGRESSION DETECTED\n`);
      } else {
        status = 'BUILD ERROR';
        console.log(`  Tests: Erreur technique`);
        console.log(`  Status: BUILD ERROR\n`);
      }
    }
    
  } catch (error) {
    if (status === 'UNKNOWN') {
      status = 'BUILD ERROR';
    }
  } finally {
    // Restaurer
    fs.writeFileSync(filePath, originalContent);
    
    console.log(`Durée: ${Date.now() - startTime}ms`);
    console.log(`Résultat: ${status}`);
  }
});

console.log('\n=== Fin des tests ===');
