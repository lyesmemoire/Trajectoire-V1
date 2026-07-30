const fs = require('fs');
const { execSync } = require('child_process');

const components = {
  'execution-context': {
    file: 'c:/Trajectoire/compiler/cvm/execution-context.ts',
    test: 'c:/Trajectoire/tests/vm/core/execution-context.test.ts'
  },
  'memory-manager': {
    file: 'c:/Trajectoire/compiler/cvm/memory-manager.ts',
    test: 'c:/Trajectoire/tests/vm/memory/memory-manager.test.ts'
  },
  'execution-pipeline': {
    file: 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts',
    test: 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts'
  },
  'instruction-cache': {
    file: 'c:/Trajectoire/compiler/cvm/instruction-cache.ts',
    test: 'c:/Trajectoire/tests/vm/performance/instruction-cache.test.ts'
  },
  'instruction-fetch': {
    file: 'c:/Trajectoire/compiler/cvm/instruction-fetch.ts',
    test: 'c:/Trajectoire/tests/vm/loader/instruction-fetch.test.ts'
  },
  'instruction-decode': {
    file: 'c:/Trajectoire/compiler/cvm/instruction-decode.ts',
    test: 'c:/Trajectoire/tests/vm/decoder/instruction-decode.test.ts'
  },
  'instruction-execute': {
    file: 'c:/Trajectoire/compiler/cvm/instruction-execute.ts',
    test: 'c:/Trajectoire/tests/vm/executor/instruction-execute.test.ts'
  },
  'rollback-manager': {
    file: 'c:/Trajectoire/compiler/cvm/rollback-manager.ts',
    test: 'c:/Trajectoire/tests/vm/advanced/rollback-manager.test.ts'
  },
  'thread-manager': {
    file: 'c:/Trajectoire/compiler/cvm/thread-manager.ts',
    test: 'c:/Trajectoire/tests/vm/advanced/thread-manager.test.ts'
  }
};

// Charger les mutations manuelles
const mutationsData = JSON.parse(fs.readFileSync('c:/Trajectoire/scripts/mutations-identified.json', 'utf8'));

const allResults = [];

Object.entries(mutationsData).forEach(([component, mutations]) => {
  const componentInfo = components[component];
  if (!componentInfo) return;
  
  const filePath = componentInfo.file;
  const testPath = componentInfo.test;
  
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
            testResult = 'INVALID'; // Timeout = mutation invalide
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
});

// Sauvegarder les résultats
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', JSON.stringify(allResults, null, 2));
console.log(`\n=== Results saved to mutation-results.json ===`);
console.log(`Total mutations processed: ${allResults.length}`);

// Résumé global
const killed = allResults.filter(r => r.status === 'KILLED').length;
const survived = allResults.filter(r => r.status === 'SURVIVED').length;
const invalid = allResults.filter(r => r.status === 'INVALID').length;

console.log(`\n=== Global Summary ===`);
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);

const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;
console.log(`Mutation Score: ${mutationScore}%`);

// Résumé par composant
console.log(`\n=== Summary by Component ===`);
Object.keys(mutationsData).forEach(component => {
  const componentResults = allResults.filter(r => r.component === component);
  const cKilled = componentResults.filter(r => r.status === 'KILLED').length;
  const cSurvived = componentResults.filter(r => r.status === 'SURVIVED').length;
  const cInvalid = componentResults.filter(r => r.status === 'INVALID').length;
  const cValidTotal = cKilled + cSurvived;
  const cScore = cValidTotal > 0 ? ((cKilled / cValidTotal) * 100).toFixed(2) : 0;
  
  console.log(`${component}: KILLED=${cKilled}, SURVIVED=${cSurvived}, INVALID=${cInvalid}, Score=${cScore}%`);
});
