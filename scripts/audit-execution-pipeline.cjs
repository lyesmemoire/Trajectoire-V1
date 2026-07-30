const fs = require('fs');
const { execSync } = require('child_process');

const component = 'execution-pipeline';
const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Mutations sémantiques pour execution-pipeline
const mutations = [
  {
    id: 1,
    line: 57,
    function: 'cycle',
    mutation: 'if (this.context.isHalted())',
    original: 'if (this.context.isHalted()) {',
    mutated: 'if (!this.context.isHalted()) {',
    description: 'Inversion condition halt'
  },
  {
    id: 2,
    line: 77,
    function: 'cycle',
    mutation: 'if (result.branchTaken)',
    original: 'if (result.branchTaken) {',
    mutated: 'if (!result.branchTaken) {',
    description: 'Inversion comptage branches prises'
  },
  {
    id: 3,
    line: 83,
    function: 'cycle',
    mutation: 'if (decoded.isCall)',
    original: 'if (decoded.isCall) {',
    mutated: 'if (!decoded.isCall) {',
    description: 'Inversion comptage appels'
  },
  {
    id: 4,
    line: 87,
    function: 'cycle',
    mutation: 'if (decoded.isReturn)',
    original: 'if (decoded.isReturn) {',
    mutated: 'if (!decoded.isReturn) {',
    description: 'Inversion comptage retours'
  },
  {
    id: 5,
    line: 91,
    function: 'cycle',
    mutation: 'if (!result.success)',
    original: 'if (!result.success) {',
    mutated: 'if (result.success) {',
    description: 'Inversion validation succès'
  },
  {
    id: 6,
    line: 105,
    function: 'run',
    mutation: 'while (!this.context.isHalted() && this.running)',
    original: 'while (!this.context.isHalted() && this.running) {',
    mutated: 'while (this.context.isHalted() && this.running) {',
    description: 'Inversion boucle run'
  },
  {
    id: 7,
    line: 234,
    function: 'validate',
    mutation: 'if (this.context.getProgramCounter() < 0)',
    original: 'if (this.context.getProgramCounter() < 0) {',
    mutated: 'if (this.context.getProgramCounter() >= 0) {',
    description: 'Inversion validation PC négatif'
  },
  {
    id: 8,
    line: 239,
    function: 'validate',
    mutation: 'if (this.context.getProgramCounter() >= bytecode.length)',
    original: 'if (this.context.getProgramCounter() >= bytecode.length) {',
    mutated: 'if (this.context.getProgramCounter() < bytecode.length) {',
    description: 'Inversion validation limites bytecode'
  },
  {
    id: 9,
    line: 244,
    function: 'validate',
    mutation: 'valid: errors.length === 0',
    original: 'valid: errors.length === 0,',
    mutated: 'valid: errors.length !== 0,',
    description: 'Inversion résultat validation'
  },
  {
    id: 10,
    line: 127,
    function: 'stop',
    mutation: 'this.running = false',
    original: 'this.running = false;',
    mutated: 'this.running = true;',
    description: 'Inversion stop'
  }
];

const results = [];

// Lire le fichier original
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log(`\n=== Audit par mutation: ${component} ===`);
console.log(`Total mutations: ${mutations.length}\n`);

// Obtenir le SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  console.log(`SHA initial: ${initialSha}\n`);
} catch (e) {
  console.log('Impossible de récupérer le SHA initial\n');
}

mutations.forEach((mutation, index) => {
  console.log(`\n--- Mutation ${mutation.id}/${mutations.length} ---`);
  console.log(`Fonction: ${mutation.function}`);
  console.log(`Ligne: ${mutation.line}`);
  console.log(`Description: ${mutation.description}`);
  console.log(`Mutation: ${mutation.mutation}`);
  
  // Sauvegarder le fichier original
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  const startTime = Date.now();
  let status = 'UNKNOWN';
  let failedTests = [];
  let duration = 0;
  
  try {
    // Appliquer la mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutation.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      mutatedLines[lineIndex] = mutation.mutated;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
      console.log('Mutation appliquée');
    } else {
      throw new Error('Ligne hors limites');
    }
    
    // Compiler
    console.log('Compilation...');
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      console.log('Compilation: SUCCESS');
    } catch (compileError) {
      console.log('Compilation: FAILED');
      status = 'INVALID';
      throw new Error('Compilation échouée');
    }
    
    // Exécuter les tests
    console.log('Exécution des tests...');
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 15000,
        encoding: 'utf8'
      });
      
      if (testOutput.includes('PASS') && !testOutput.includes('FAIL')) {
        status = 'SURVIVED';
        console.log('Résultat: SURVIVED (tous les tests passent)');
      } else {
        status = 'KILLED';
        console.log('Résultat: KILLED (au moins un test échoue)');
        const failedMatch = testOutput.match(/FAIL\s+(.+)/g);
        if (failedMatch) {
          failedTests = failedMatch.map(m => m.replace(/FAIL\s+/, ''));
          console.log(`Tests échoués: ${failedTests.join(', ')}`);
        }
      }
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      if (errorOutput.includes('FAIL')) {
        status = 'KILLED';
        console.log('Résultat: KILLED (tests échouent)');
        const failedMatch = errorOutput.match(/FAIL\s+(.+)/g);
        if (failedMatch) {
          failedTests = failedMatch.map(m => m.replace(/FAIL\s+/, ''));
          console.log(`Tests échoués: ${failedTests.join(', ')}`);
        }
      } else {
        status = 'INVALID';
        console.log('Résultat: INVALID (timeout ou erreur)');
      }
    }
    
  } catch (error) {
    console.log(`Erreur: ${error.message}`);
    if (status === 'UNKNOWN') {
      status = 'INVALID';
    }
  } finally {
    duration = Date.now() - startTime;
    
    // Restaurer le fichier original
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
      console.log('Fichier restauré');
    }
    
    // Vérifier que le fichier est identique à l'original
    const currentContent = fs.readFileSync(filePath, 'utf8');
    if (currentContent !== originalContent) {
      console.log('ATTENTION: Le fichier restauré diffère de l\'original!');
      fs.writeFileSync(filePath, originalContent);
    }
    
    results.push({
      component,
      file: filePath,
      line: mutation.line,
      function: mutation.function,
      mutation: mutation.mutation,
      description: mutation.description,
      status,
      tests: testPath,
      failedTests,
      duration_ms: duration
    });
    
    console.log(`Durée: ${duration}ms\n`);
  }
});

// Vérifier le SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  console.log(`\nSHA final: ${finalSha}`);
  if (initialSha && finalSha === initialSha) {
    console.log('SHA identique: OK');
  } else {
    console.log('ATTENTION: SHA différent!');
  }
} catch (e) {
  console.log('Impossible de vérifier le SHA final');
}

// Sauvegarder les résultats
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', JSON.stringify(results, null, 2));
console.log('\n=== Résultats sauvegardés ===');

// Résumé
const killed = results.filter(r => r.status === 'KILLED').length;
const survived = results.filter(r => r.status === 'SURVIVED').length;
const invalid = results.filter(r => r.status === 'INVALID').length;

console.log(`\n=== Résumé ===`);
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);

const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;
console.log(`Mutation Score: ${mutationScore}%`);
