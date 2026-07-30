const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline-r5-minimal.test.ts';

const experiments = [
  {
    name: 'EXP 1',
    description: 'Code original → nouveau test',
    mutation: null,
    expected_result: 'PASS'
  },
  {
    name: 'EXP 2',
    description: 'Mutation supprimer stop() → nouveau test',
    mutation: {
      line: 127,
      original: 'this.running = false;',
      mutated: '// stop removed'
    },
    expected_result: 'FAIL'
  },
  {
    name: 'EXP 3',
    description: 'Mutation stop() vide → nouveau test',
    mutation: {
      line: 126,
      original: 'public stop(): void {\n    this.running = false;\n  }',
      mutated: 'public stop(): void {\n    // empty\n  }'
    },
    expected_result: 'FAIL'
  },
  {
    name: 'EXP 4',
    description: 'Mutation stop() inverse running → nouveau test',
    mutation: {
      line: 127,
      original: 'this.running = false;',
      mutated: 'this.running = true;'
    },
    expected_result: 'FAIL'
  }
];

console.log('=== PHASE 6: Validation expérimentale ===\n');

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

experiments.forEach((exp, index) => {
  console.log(`\n${exp.name}: ${exp.description}`);
  console.log(`Résultat attendu: ${exp.expected_result}`);
  
  const startTime = Date.now();
  let status = 'UNKNOWN';
  let exitCode = null;
  let assertion = null;
  
  try {
    // Appliquer mutation si nécessaire
    if (exp.mutation) {
      const mutatedLines = [...originalLines];
      
      if (exp.mutation.line) {
        const lineIndex = exp.mutation.line - 1;
        if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
          mutatedLines[lineIndex] = exp.mutation.mutated;
          fs.writeFileSync(filePath, mutatedLines.join('\n'));
        }
      }
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
    } catch (compileError) {
      status = 'BUILD ERROR';
      console.log(`  Compilation: KO`);
      console.log(`  Status: BUILD ERROR`);
      console.log(`  Exit code: 1`);
      results.push({
        experiment: exp.name,
        description: exp.description,
        expected: exp.expected_result,
        actual: status,
        exit_code: 1,
        assertion: 'Compilation failed',
        duration: Date.now() - startTime
      });
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests
    try {
      execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 15000,
        encoding: 'utf8'
      });
      
      status = 'PASS';
      exitCode = 0;
      console.log(`  Tests: PASSED`);
      console.log(`  Status: PASS`);
      console.log(`  Exit code: 0`);
      
    } catch (testError) {
      const stdout = testError.stdout || '';
      const stderr = testError.stderr || '';
      const errorOutput = stdout + stderr;
      
      exitCode = testError.status || 1;
      
      const failedMatch = errorOutput.match(/(\d+)\s+failed/);
      const assertionMatch = errorOutput.match(/expected (.+) to be (.+)/);
      
      if (failedMatch && parseInt(failedMatch[1]) > 0) {
        status = 'FAIL';
        assertion = assertionMatch ? `expected ${assertionMatch[1]} to be ${assertionMatch[2]}` : 'Test failed';
        console.log(`  Tests: FAILED`);
        console.log(`  Status: FAIL`);
        console.log(`  Exit code: ${exitCode}`);
        console.log(`  Assertion: ${assertion}`);
      } else {
        status = 'BUILD ERROR';
        assertion = 'Test execution error';
        console.log(`  Tests: Erreur technique`);
        console.log(`  Status: BUILD ERROR`);
        console.log(`  Exit code: ${exitCode}`);
      }
    }
    
  } catch (error) {
    if (status === 'UNKNOWN') {
      status = 'BUILD ERROR';
      exitCode = 1;
      console.log(`  Status: BUILD ERROR`);
      console.log(`  Exit code: 1`);
    }
  } finally {
    // Restaurer
    fs.writeFileSync(filePath, originalContent);
    
    const duration = Date.now() - startTime;
    console.log(`  Durée: ${duration}ms`);
    
    results.push({
      experiment: exp.name,
      description: exp.description,
      expected: exp.expected_result,
      actual: status,
      exit_code: exitCode,
      assertion: assertion,
      duration: duration
    });
  }
});

console.log('\n=== Résultats des expériences ===\n');
results.forEach(r => {
  console.log(`${r.experiment}: ${r.actual} (attendu: ${r.expected})`);
  if (r.assertion) {
    console.log(`  Assertion: ${r.assertion}`);
  }
  console.log(`  Exit code: ${r.exit_code}`);
  console.log(`  Durée: ${r.duration}ms`);
});

// Sauvegarder résultats
fs.writeFileSync('c:/Trajectoire/reports/runtime/regression/r5-experiments.json', JSON.stringify(results, null, 2));
console.log('\nRésultats sauvegardés dans: c:/Trajectoire/reports/runtime/regression/r5-experiments.json');
