const fs = require('fs');
const { execSync } = require('child_process');

const component = 'execution-context';
const filePath = 'c:/Trajectoire/compiler/cvm/execution-context.ts';
const testPath = 'c:/Trajectoire/tests/vm/core/execution-context.test.ts';

// Charger les mutations identifiées
const mutationsData = JSON.parse(fs.readFileSync('c:/Trajectoire/scripts/mutations-identified.json', 'utf8'));
const mutations = mutationsData[component] || [];

const allResults = [];

// Lire le fichier original
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log(`\n=== Processing ${component} ===`);
console.log(`Total mutations: ${mutations.length}`);

mutations.forEach((mutation, index) => {
  console.log(`\nMutation ${index + 1}/${mutations.length}: ${mutation.type} at line ${mutation.line}`);
  console.log(`  Description: ${mutation.description}`);
  
  // Sauvegarder le fichier original
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  try {
    // Appliquer la mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutation.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      mutatedLines[lineIndex] = mutation.mutation;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
      console.log(`  Mutation applied`);
    }
    
    // Tenter de compiler
    let compileResult = 'UNKNOWN';
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      compileResult = 'SUCCESS';
      console.log(`  Compilation: SUCCESS`);
    } catch (compileError) {
      compileResult = 'FAILED';
      console.log(`  Compilation: FAILED`);
      
      // Restaurer et marquer comme INVALID
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
      
      allResults.push({
        component,
        file: filePath,
        function: 'unknown',
        line: mutation.line,
        mutation: mutation.type,
        description: mutation.description,
        status: 'INVALID',
        failedTests: [],
        executionTimeMs: 0
      });
      return;
    }
    
    if (compileResult === 'SUCCESS') {
      // Exécuter les tests
      const startTime = Date.now();
      let testResult = 'UNKNOWN';
      let failedTests = [];
      
      try {
        const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
          stdio: 'pipe', 
          timeout: 10000, // 10 secondes timeout
          encoding: 'utf8'
        });
        
        // Vérifier si les tests ont passé
        if (testOutput.includes('PASS') && !testOutput.includes('FAIL')) {
          testResult = 'SURVIVED';
        } else {
          testResult = 'KILLED';
          // Extraire les tests échoués
          const failedMatch = testOutput.match(/FAIL\s+(.+)/g);
          if (failedMatch) {
            failedTests = failedMatch.map(m => m.replace(/FAIL\s+/, ''));
          }
        }
      } catch (testError) {
        const errorOutput = testError.stdout || testError.stderr || '';
        if (errorOutput.includes('FAIL')) {
          testResult = 'KILLED';
          const failedMatch = errorOutput.match(/FAIL\s+(.+)/g);
          if (failedMatch) {
            failedTests = failedMatch.map(m => m.replace(/FAIL\s+/, ''));
          }
        } else {
          testResult = 'INVALID'; // Timeout = mutation invalide (casse le système)
        }
      }
      
      const executionTime = Date.now() - startTime;
      
      console.log(`  Test result: ${testResult} (${executionTime}ms)`);
      if (failedTests.length > 0) {
        console.log(`  Failed tests: ${failedTests.join(', ')}`);
      }
      
      allResults.push({
        component,
        file: filePath,
        function: 'unknown',
        line: mutation.line,
        mutation: mutation.type,
        description: mutation.description,
        status: testResult,
        failedTests,
        executionTimeMs: executionTime
      });
    }
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    
    allResults.push({
      component,
      file: filePath,
      function: 'unknown',
      line: mutation.line,
      mutation: mutation.type,
      description: mutation.description,
      status: 'INVALID',
      failedTests: [],
      executionTimeMs: 0
    });
  } finally {
    // Restaurer le fichier original
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
    }
  }
});

// Sauvegarder les résultats
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', JSON.stringify(allResults, null, 2));
console.log(`\n=== Results saved to mutation-results.json ===`);
console.log(`Total mutations processed: ${allResults.length}`);

// Résumé
const killed = allResults.filter(r => r.status === 'KILLED').length;
const survived = allResults.filter(r => r.status === 'SURVIVED').length;
const invalid = allResults.filter(r => r.status === 'INVALID').length;
const timeout = allResults.filter(r => r.status === 'TIMEOUT').length;

console.log(`\n=== Summary ===`);
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`TIMEOUT: ${timeout}`);

const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;
console.log(`Mutation Score: ${mutationScore}%`);
