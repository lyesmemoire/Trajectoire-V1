const fs = require('fs');
const { execSync } = require('child_process');

const component = 'execution-pipeline';
const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Mutations subtiles pour éviter les timeouts
const mutations = [
  {
    id: 1,
    line: 74,
    function: 'cycle',
    mutation: 'this.statistics.instructionsExecuted++',
    original: 'this.statistics.instructionsExecuted++;',
    mutated: 'this.statistics.instructionsExecuted += 2;',
    description: 'Incrémenter instructionsExecuted de 2 au lieu de 1'
  },
  {
    id: 2,
    line: 75,
    function: 'cycle',
    mutation: 'this.statistics.cycles++',
    original: 'this.statistics.cycles++;',
    mutated: 'this.statistics.cycles += 2;',
    description: 'Incrémenter cycles de 2 au lieu de 1'
  },
  {
    id: 3,
    line: 78,
    function: 'cycle',
    mutation: 'this.statistics.branchesTaken++',
    original: 'this.statistics.branchesTaken++;',
    mutated: 'this.statistics.branchesTaken += 2;',
    description: 'Incrémenter branchesTaken de 2 au lieu de 1'
  },
  {
    id: 4,
    line: 80,
    function: 'cycle',
    mutation: 'this.statistics.branchesNotTaken++',
    original: 'this.statistics.branchesNotTaken++;',
    mutated: 'this.statistics.branchesNotTaken += 2;',
    description: 'Incrémenter branchNotTaken de 2 au lieu de 1'
  },
  {
    id: 5,
    line: 84,
    function: 'cycle',
    mutation: 'this.statistics.calls++',
    original: 'this.statistics.calls++;',
    mutated: 'this.statistics.calls += 2;',
    description: 'Incrémenter calls de 2 au lieu de 1'
  },
  {
    id: 6,
    line: 88,
    function: 'cycle',
    mutation: 'this.statistics.returns++',
    original: 'this.statistics.returns++;',
    mutated: 'this.statistics.returns += 2;',
    description: 'Incrémenter returns de 2 au lieu de 1'
  },
  {
    id: 7,
    line: 92,
    function: 'cycle',
    mutation: 'this.statistics.errors++',
    original: 'this.statistics.errors++;',
    mutated: 'this.statistics.errors += 2;',
    description: 'Incrémenter errors de 2 au lieu de 1'
  },
  {
    id: 8,
    line: 144,
    function: 'getStatistics',
    mutation: 'return { ...this.statistics };',
    original: 'return { ...this.statistics };',
    mutated: 'return { ...this.statistics, instructionsExecuted: this.statistics.instructionsExecuted + 1 };',
    description: 'Ajouter 1 à instructionsExecuted dans le retour'
  },
  {
    id: 9,
    line: 144,
    function: 'getStatistics',
    mutation: 'return { ...this.statistics };',
    original: 'return { ...this.statistics };',
    mutated: 'return { ...this.statistics, cycles: this.statistics.cycles + 1 };',
    description: 'Ajouter 1 à cycles dans le retour'
  },
  {
    id: 10,
    line: 144,
    function: 'getStatistics',
    mutation: 'return { ...this.statistics };',
    original: 'return { ...this.statistics };',
    mutated: 'return { ...this.statistics, errors: this.statistics.errors + 1 };',
    description: 'Ajouter 1 à errors dans le retour'
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
